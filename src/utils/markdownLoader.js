// Utilitaire pour charger et parser les fichiers Markdown dans un environnement Astro
import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';

/**
 * Charge et parse un fichier Markdown depuis le système de fichiers Astro
 * @param {string} path - Chemin du fichier Markdown
 * @returns {Promise<string>} - Contenu HTML parsé
 */
export const loadMarkdownContent = async (path) => {
  try {
    // Normaliser le chemin pour l'import dynamique
    const normalizedPath = normalizePath(path);
    
    // Essayer d'abord avec les collections de contenu Astro
    try {
      // Astro utilise un système spécial pour les collections de contenu
      // On utilise un chemin relatif pour l'import dynamique
      const module = await import(`../..${normalizedPath}?raw`);
      const content = module.default || module;
      
      if (content && typeof content === 'string') {
        return parseMarkdownToHTML(content);
      }
    } catch (importError) {
      console.warn(`Import via collections échoué pour ${path}:`, importError.message);
      // Continuer avec d'autres méthodes
    }
    
    // Essayer avec fetch pour le développement local
    try {
      const response = await fetch(path);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
      }
      
      const markdownContent = await response.text();
      return parseMarkdownToHTML(markdownContent);
    } catch (fetchError) {
      console.warn(`Fetch échoué pour ${path}:`, fetchError.message);
    }
    
    // Essayer avec un import direct (pour les fichiers .md accessibles directement)
    try {
      const directImportPath = path.replace(/^\/src\//, '../');
      const module = await import(/* @vite-ignore */ `${directImportPath}?raw`);
      const content = module.default || module;
      
      if (content && typeof content === 'string') {
        return parseMarkdownToHTML(content);
      }
    } catch (directImportError) {
      console.warn(`Import direct échoué pour ${path}:`, directImportError.message);
    }
    
    // Dernier essai avec un chemin spécifique pour les fables
    if (path.includes('acteon') || path.includes('laigle-et-le-chapon')) {
      return loadFallbackFableContent(path);
    }
    
    throw new Error(`Impossible de charger le contenu depuis ${path}`);
  } catch (error) {
    console.error('Erreur lors du chargement du contenu:', error);
    throw error;
  }
};

/**
 * Normalise un chemin de fichier pour les imports
 * @param {string} path - Chemin à normaliser
 * @returns {string} - Chemin normalisé
 */
const normalizePath = (path) => {
  // Supprimer les doubles slashes et normaliser le chemin
  return path
    .replace(/\/\//g, '/')
    .replace(/\/src\//, '/');
};

/**
 * Charge le contenu d'une fable spécifique basée sur son chemin
 * @param {string} path - Chemin du fichier
 * @returns {Promise<string>} - Contenu HTML
 */
const loadFallbackFableContent = async (path) => {
  // Extraire les informations du chemin
  const pathParts = path.split('/');
  const language = pathParts.includes('fr') ? 'fr' : 
                  pathParts.includes('en') ? 'en' : 
                  pathParts.includes('es') ? 'es' : 'fr';
  
  const fable = pathParts.includes('acteon') ? 'acteon' : 
               pathParts.includes('laigle-et-le-chapon') ? 'laigle-et-le-chapon' : 'unknown';
  
  // Essayer de charger depuis des chemins alternatifs
  const alternativePaths = [
    `/src/content/docs/${language}/antoine-vincent-arnault/livre-1/${fable}/index.mdx`,
    `/src/content/docs/${language}/fabulateurs-francais/antoine-vincent-arnault/livre-1/${fable}/index.mdx`,
    `/src/content/docs/fr/antoine-vincent-arnault/livre-1/${fable}/${language}.md`,
  ];
  
  for (const altPath of alternativePaths) {
    try {
      const importPath = altPath.replace(/^\/src\//, '../').replace(/\.md(x)?$/, '.md$1?raw');
      const module = await import(/* @vite-ignore */ importPath);
      const content = module.default || module;
      
      if (content && typeof content === 'string') {
        return parseMarkdownToHTML(content);
      }
    } catch (e) {
      console.warn(`Tentative échouée pour ${altPath}:`, e.message);
    }
  }
  
  // Retourner un contenu de secours si tout échoue
  return generateFallbackContent(language, fable);
};

/**
 * Parse le Markdown en HTML avec des styles Tailwind
 * @param {string} markdown - Contenu Markdown brut
 * @returns {string} - HTML stylisé
 */
const parseMarkdownToHTML = (markdown) => {
  // Nettoyer les frontmatter YAML s'ils existent
  let cleanedMarkdown = markdown.replace(/^---[\s\S]*?---\n/m, '');
  
  // Utiliser marked pour parser le markdown
  const rawHtml = marked(cleanedMarkdown);
  
  // Assainir le HTML avec DOMPurify
  const sanitizedHtml = DOMPurify.sanitize(rawHtml);
  
  // Améliorer le HTML avec des classes Tailwind
  let enhancedHtml = sanitizedHtml
    // Titres
    .replace(/<h1>(.*?)<\/h1>/g, '<h1 class="text-2xl font-bold text-slate-800 mb-6 mt-4">$1</h1>')
    .replace(/<h2>(.*?)<\/h2>/g, '<h2 class="text-xl font-semibold text-slate-700 mb-4 mt-8">$1</h2>')
    .replace(/<h3>(.*?)<\/h3>/g, '<h3 class="text-lg font-semibold text-slate-700 mb-3 mt-6">$1</h3>')
    
    // Paragraphes
    .replace(/<p>(.*?)<\/p>/g, '<p class="text-slate-600 leading-relaxed mb-4">$1</p>')
    
    // Listes
    .replace(/<ul>/g, '<ul class="list-disc list-inside mb-6 space-y-2 ml-4">')
    .replace(/<ol>/g, '<ol class="list-decimal list-inside mb-6 space-y-2 ml-4">')
    .replace(/<li>/g, '<li class="mb-2 text-slate-600">')
    
    // Code
    .replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, 
      '<pre class="bg-slate-100 p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm font-mono text-slate-800">$1</code></pre>')
    .replace(/<code>(.*?)<\/code>/g, 
      '<code class="bg-slate-100 px-2 py-1 rounded text-sm font-mono text-slate-800">$1</code>')
    
    // Liens
    .replace(/<a href="(.*?)">/g, '<a href="$1" class="text-blue-600 hover:text-blue-800 underline transition-colors">');
  
  return enhancedHtml;
};

/**
 * Génère un contenu de secours si le chargement échoue
 * @param {string} language - Code de langue
 * @param {string} fable - Identifiant de la fable
 * @returns {string} - HTML formaté
 */
const generateFallbackContent = (language, fable) => {
  const fableTitle = fable === 'acteon' ? 'Actéon' : 
                   fable === 'laigle-et-le-chapon' ? 'L\'Aigle et le Chapon' : 
                   formatFableTitle(fable);
  
  const translations = {
    fr: {
      title: `${fableTitle} - Contenu en Français`,
      loading: "⚠️ Contenu en cours de chargement",
      message: "Le système tente de charger le contenu depuis les fichiers Markdown d'Astro.",
      description: "Cette fable fait partie de la collection d'Antoine Vincent Arnault, poète et fabuliste français du XVIIIe siècle.",
      technical: "Information technique",
      fileInfo: `Fichier recherché: ${fable}.md`
    },
    en: {
      title: `${fableTitle} - Content in English`,
      loading: "⚠️ Content loading in progress",
      message: "The system is attempting to load content from Astro Markdown files.",
      description: "This fable is part of the collection by Antoine Vincent Arnault, French poet and fabulist of the 18th century.",
      technical: "Technical information",
      fileInfo: `File searched: ${fable}.md`
    },
    es: {
      title: `${fableTitle} - Contenido en Español`,
      loading: "⚠️ Contenido cargándose",
      message: "El sistema está intentando cargar el contenido desde los archivos Markdown de Astro.",
      description: "Esta fábula forma parte de la colección de Antoine Vincent Arnault, poeta y fabulista francés del siglo XVIII.",
      technical: "Información técnica",
      fileInfo: `Archivo buscado: ${fable}.md`
    }
  };
  
  const t = translations[language] || translations.fr;
  
  return `
    <div class="content-container">
      <h1 class="text-2xl font-bold text-slate-800 mb-6">${t.title}</h1>
      <div class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <p class="text-amber-800 font-medium mb-2">${t.loading}</p>
        <p class="text-sm text-amber-700">${t.message}</p>
      </div>
      <div class="space-y-4">
        <p class="text-slate-600 leading-relaxed">${t.description}</p>
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 class="font-semibold text-blue-800 mb-2">${t.technical}</h3>
          <p class="text-sm text-blue-700">${t.fileInfo}</p>
        </div>
      </div>
    </div>
  `;
};

// Formater le titre d'une fable (convertir kebab-case en texte lisible)
const formatFableTitle = (fableId) => {
  return fableId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Fonction spéciale pour charger le contenu des fables d'Actéon
export const loadActeonContent = async (language) => {
  try {
    const paths = {
      fr: '/src/content/docs/fr/antoine-vincent-arnault/livre-1/acteon/fr.md',
      en: '/src/content/docs/fr/antoine-vincent-arnault/livre-1/acteon/en.md',
      es: '/src/content/docs/fr/antoine-vincent-arnault/livre-1/acteon/es.md'
    };
    
    if (!paths[language]) {
      throw new Error(`Langue non supportée: ${language}`);
    }
    
    return await loadMarkdownContent(paths[language]);
  } catch (error) {
    console.error(`Erreur lors du chargement d'Actéon en ${language}:`, error);
    return generateFallbackContent(language, 'acteon');
  }
};

// Fonction spéciale pour charger le contenu des autres fables
export const loadFableContent = async (language, author, book, fable) => {
  try {
    // Construire le chemin standard pour les fables
    let path;
    
    // Cas spécial pour les fables avec structure non standard
    if (author.includes('/')) {
      // Format: fabulateurs-francais/antoine-vincent-arnault
      const [collection, actualAuthor] = author.split('/');
      path = `/src/content/docs/${language}/${collection}/${actualAuthor}/${book}/${fable}/index.mdx`;
    } else {
      // Format standard
      path = `/src/content/docs/${language}/${author}/${book}/${fable}/index.mdx`;
    }
    
    return await loadMarkdownContent(path);
  } catch (error) {
    console.error(`Erreur lors du chargement de ${fable} en ${language}:`, error);
    return generateFallbackContent(language, fable);
  }
};

// Construire le chemin complet vers un fichier de fable
export const buildFablePath = (language, author, book, fable) => {
  // Pour les fichiers .md dans le dossier acteon
  if (fable === 'acteon') {
    return `/src/content/docs/fr/antoine-vincent-arnault/livre-1/acteon/${language}.md`;
  }
  
  // Pour les autres fables avec structure standard
  if (author.includes('/')) {
    // Format: fabulateurs-francais/antoine-vincent-arnault
    const [collection, actualAuthor] = author.split('/');
    return `/src/content/docs/${language}/${collection}/${actualAuthor}/${book}/${fable}/index.mdx`;
  }
  
  return `/src/content/docs/${language}/${author}/${book}/${fable}/index.mdx`;
};

// Fonction pour obtenir la structure des fables disponibles
export const getFablesStructure = async () => {
  try {
    const structure = {
      fr: {
        'antoine-vincent-arnault': {
          'livre-1': [
            'acteon',
            'laigle-et-le-chapon'
          ]
        },
        'fabulateurs-francais': {
          'antoine-vincent-arnault': {
            'livre-1': [
              'laigle-et-le-chapon'
            ]
          }
        }
      },
      en: {
        'antoine-vincent-arnault': {
          'livre-1': [
            'acteon'
          ]
        },
        'fabulateurs-francais': {
          'antoine-vincent-arnault': {
            'livre-1': [
              'laigle-et-le-chapon'
            ]
          }
        }
      },
      es: {
        'antoine-vincent-arnault': {
          'livre-1': [
            'acteon'
          ]
        },
        'fabulateurs-francais': {
          'antoine-vincent-arnault': {
            'livre-1': [
              'laigle-et-le-chapon'
            ]
          }
        }
      }
    };
    
    return structure;
  } catch (error) {
    console.error('Erreur lors de la récupération de la structure des fables:', error);
    return {};
  }
};

// Fonction pour obtenir les fables d'un auteur spécifique
export const getAuthorFables = async (language, author) => {
  const structure = await getFablesStructure();
  
  if (!structure[language] || !structure[language][author]) {
    return [];
  }
  
  const authorBooks = structure[language][author];
  const fables = [];
  
  // Parcourir tous les livres de l'auteur
  for (const book in authorBooks) {
    authorBooks[book].forEach(fable => {
      fables.push({
        title: formatFableTitle(fable),
        path: buildFablePath(language, author, book, fable),
        book
      });
    });
  }
  
  return fables;
};
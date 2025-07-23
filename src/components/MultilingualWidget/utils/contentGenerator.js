const CONTENT_TEMPLATES = {
  fr: {
    title: "Contenu en Français",
    sections: [
      {
        heading: "Introduction",
        content: "Bienvenue dans notre système de contenu multilingue. Cette interface permet de gérer facilement du contenu dans différentes langues avec une expérience utilisateur optimisée."
      },
      {
        heading: "Fonctionnalités Principales",
        content: `
          <ul>
            <li><strong>Chargement intelligent :</strong> Le contenu se charge uniquement quand nécessaire</li>
            <li><strong>Gestion d'état :</strong> Vos préférences sont automatiquement sauvegardées</li>
            <li><strong>Interface intuitive :</strong> Navigation fluide entre les différentes langues</li>
            <li><strong>Performance optimisée :</strong> Transitions rapides et mémoire efficace</li>
          </ul>
        `
      },
      {
        heading: "Utilisation",
        content: "Cliquez simplement sur les onglets pour naviguer entre les langues. Utilisez l'icône de configuration pour personnaliser les langues disponibles selon vos besoins."
      }
    ]
  },
  en: {
    title: "Content in English",
    sections: [
      {
        heading: "Introduction",
        content: "Welcome to our multilingual content system. This interface allows you to easily manage content in different languages with an optimized user experience."
      },
      {
        heading: "Key Features",
        content: `
          <ul>
            <li><strong>Smart Loading:</strong> Content loads only when necessary</li>
            <li><strong>State Management:</strong> Your preferences are automatically saved</li>
            <li><strong>Intuitive Interface:</strong> Smooth navigation between different languages</li>
            <li><strong>Optimized Performance:</strong> Fast transitions and efficient memory usage</li>
          </ul>
        `
      },
      {
        heading: "Usage",
        content: "Simply click on the tabs to navigate between languages. Use the configuration icon to customize available languages according to your needs."
      }
    ]
  },
  es: {
    title: "Contenido en Español",
    sections: [
      {
        heading: "Introducción",
        content: "Bienvenido a nuestro sistema de contenido multilingüe. Esta interfaz permite gestionar fácilmente contenido en diferentes idiomas con una experiencia de usuario optimizada."
      },
      {
        heading: "Características Principales",
        content: `
          <ul>
            <li><strong>Carga Inteligente:</strong> El contenido se carga solo cuando es necesario</li>
            <li><strong>Gestión de Estado:</strong> Tus preferencias se guardan automáticamente</li>
            <li><strong>Interfaz Intuitiva:</strong> Navegación fluida entre diferentes idiomas</li>
            <li><strong>Rendimiento Optimizado:</strong> Transiciones rápidas y uso eficiente de memoria</li>
          </ul>
        `
      },
      {
        heading: "Uso",
        content: "Simplemente haz clic en las pestañas para navegar entre idiomas. Usa el icono de configuración para personalizar los idiomas disponibles según tus necesidades."
      }
    ]
  },
  de: {
    title: "Inhalt auf Deutsch",
    sections: [
      {
        heading: "Einführung",
        content: "Willkommen zu unserem mehrsprachigen Content-System. Diese Oberfläche ermöglicht es, Inhalte in verschiedenen Sprachen einfach zu verwalten mit einer optimierten Benutzererfahrung."
      },
      {
        heading: "Hauptmerkmale",
        content: `
          <ul>
            <li><strong>Intelligentes Laden:</strong> Inhalte werden nur bei Bedarf geladen</li>
            <li><strong>Zustandsverwaltung:</strong> Ihre Einstellungen werden automatisch gespeichert</li>
            <li><strong>Intuitive Oberfläche:</strong> Reibungslose Navigation zwischen verschiedenen Sprachen</li>
            <li><strong>Optimierte Leistung:</strong> Schnelle Übergänge und effiziente Speichernutzung</li>
          </ul>
        `
      },
      {
        heading: "Verwendung",
        content: "Klicken Sie einfach auf die Registerkarten, um zwischen den Sprachen zu navigieren. Verwenden Sie das Konfigurationssymbol, um verfügbare Sprachen nach Ihren Bedürfnissen anzupassen."
      }
    ]
  },
  it: {
    title: "Contenuto in Italiano",
    sections: [
      {
        heading: "Introduzione",
        content: "Benvenuto nel nostro sistema di contenuti multilingue. Questa interfaccia permette di gestire facilmente contenuti in diverse lingue con un'esperienza utente ottimizzata."
      },
      {
        heading: "Caratteristiche Principali",
        content: `
          <ul>
            <li><strong>Caricamento Intelligente:</strong> Il contenuto si carica solo quando necessario</li>
            <li><strong>Gestione dello Stato:</strong> Le tue preferenze vengono salvate automaticamente</li>
            <li><strong>Interfaccia Intuitiva:</strong> Navigazione fluida tra diverse lingue</li>
            <li><strong>Prestazioni Ottimizzate:</strong> Transizioni rapide e uso efficiente della memoria</li>
          </ul>
        `
      },
      {
        heading: "Utilizzo",
        content: "Basta cliccare sulle schede per navigare tra le lingue. Usa l'icona di configurazione per personalizzare le lingue disponibili secondo le tue esigenze."
      }
    ]
  }
};

export const generateMockContent = async (languageCode, tabId) => {
  // Simuler une possible erreur réseau
  if (Math.random() < 0.05) {
    throw new Error('Erreur de réseau simulée');
  }

  const template = CONTENT_TEMPLATES[languageCode] || CONTENT_TEMPLATES.en;
  
  const content = `
    <div class="content-container">
      <h1 class="text-2xl font-bold text-slate-800 mb-6">${template.title}</h1>
      
      ${template.sections.map(section => `
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-slate-700 mb-4">${section.heading}</h2>
          <div class="text-slate-600 leading-relaxed">${section.content}</div>
        </div>
      `).join('')}
      
      <div class="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p class="text-sm text-blue-700">
          <strong>Note technique :</strong> Ce contenu a été chargé dynamiquement pour l'onglet ${tabId} 
          en langue ${languageCode.toUpperCase()} à ${new Date().toLocaleTimeString()}.
        </p>
      </div>
    </div>
  `;

  return content;
};
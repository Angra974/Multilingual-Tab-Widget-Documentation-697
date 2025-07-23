import { useState, useCallback } from 'react';
import { loadActeonContent, loadFableContent } from '../../../utils/markdownLoader';

export const useContentLoader = () => {
  const [loadedContent, setLoadedContent] = useState({});
  const [loadingStates, setLoadingStates] = useState({});
  const [errors, setErrors] = useState({});

  const loadContent = useCallback(async (tabId, language, author, book, fable) => {
    if (loadingStates[tabId]) return;

    setLoadingStates(prev => ({ ...prev, [tabId]: true }));
    setErrors(prev => ({ ...prev, [tabId]: null }));

    try {
      let content;
      
      // Chargement spécial pour Actéon
      if (fable === 'acteon') {
        content = await loadActeonContent(language);
      } else {
        // Chargement pour les autres fables
        content = await loadFableContent(language, author, book, fable);
      }
      
      if (content) {
        setLoadedContent(prev => ({ ...prev, [tabId]: content }));
      } else {
        throw new Error('Contenu non trouvé');
      }
    } catch (error) {
      console.error(`Erreur lors du chargement du contenu pour l'onglet ${tabId}:`, error);
      setErrors(prev => ({ 
        ...prev, 
        [tabId]: `Impossible de charger le contenu en ${language}: ${error.message}` 
      }));
    } finally {
      setLoadingStates(prev => ({ ...prev, [tabId]: false }));
    }
  }, [loadingStates]);

  const clearContent = useCallback((tabId) => {
    setLoadedContent(prev => {
      const newContent = { ...prev };
      delete newContent[tabId];
      return newContent;
    });
    
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[tabId];
      return newErrors;
    });
  }, []);

  return {
    loadedContent,
    loadingStates,
    errors,
    loadContent,
    clearContent
  };
};
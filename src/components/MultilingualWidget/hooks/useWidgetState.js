import { useState, useEffect, useCallback } from 'react';
import { DEFAULT_TAB_CONFIG } from '../constants';

export const useWidgetState = (widgetId) => {
  const [tabConfig, setTabConfig] = useState(DEFAULT_TAB_CONFIG);
  const [activeTab, setActiveTab] = useState('1');

  // Clé de stockage spécifique au widget
  const storageKey = `multilingual-widget-${widgetId}`;

  // Charger l'état sauvegardé au démarrage
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(storageKey);
      if (savedState) {
        const { tabConfig: savedTabConfig, activeTab: savedActiveTab } = JSON.parse(savedState);
        setTabConfig(savedTabConfig || DEFAULT_TAB_CONFIG);
        setActiveTab(savedActiveTab || '1');
      }
    } catch (error) {
      console.warn('Erreur lors du chargement de l\'état du widget:', error);
    }
  }, [storageKey]);

  // Sauvegarder l'état à chaque changement
  const saveState = useCallback((newTabConfig, newActiveTab) => {
    try {
      const state = {
        tabConfig: newTabConfig,
        activeTab: newActiveTab,
        lastUpdated: Date.now()
      };
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      console.warn('Erreur lors de la sauvegarde de l\'état du widget:', error);
    }
  }, [storageKey]);

  // Mettre à jour la langue d'un onglet
  const updateTabLanguage = useCallback((tabId, language) => {
    setTabConfig(prev => {
      const newConfig = { ...prev };
      
      if (language === null) {
        delete newConfig[tabId];
      } else {
        // Vérifier l'unicité
        const existingTab = Object.entries(newConfig).find(
          ([id, lang]) => id !== tabId && lang === language
        );
        
        if (existingTab) {
          console.warn(`La langue ${language} est déjà utilisée dans l'onglet ${existingTab[0]}`);
          return prev;
        }
        
        newConfig[tabId] = language;
      }
      
      saveState(newConfig, activeTab);
      return newConfig;
    });
  }, [activeTab, saveState]);

  // Changer l'onglet actif
  const setActiveTabWithSave = useCallback((tabId) => {
    setActiveTab(tabId);
    saveState(tabConfig, tabId);
  }, [tabConfig, saveState]);

  // Sauvegarder comme configuration par défaut
  const saveAsDefault = useCallback(() => {
    try {
      const defaultState = {
        tabConfig,
        activeTab,
        isDefault: true,
        createdAt: Date.now()
      };
      localStorage.setItem('multilingual-widget-default', JSON.stringify(defaultState));
      
      // Notification ou feedback utilisateur
      console.log('Configuration sauvegardée comme défaut');
    } catch (error) {
      console.warn('Erreur lors de la sauvegarde de la configuration par défaut:', error);
    }
  }, [tabConfig, activeTab]);

  return {
    tabConfig,
    activeTab,
    updateTabLanguage,
    setActiveTab: setActiveTabWithSave,
    saveAsDefault
  };
};
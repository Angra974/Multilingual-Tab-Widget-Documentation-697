import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TabNavigation from './TabNavigation';
import ConfigurationPanel from './ConfigurationPanel';
import ContentDisplay from './ContentDisplay';
import { useWidgetState } from './hooks/useWidgetState';
import { useContentLoader } from './hooks/useContentLoader';
import { AVAILABLE_LANGUAGES } from './constants';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiInfo } = FiIcons;

const MultilingualWidget = ({ 
  widgetId, 
  title, 
  author = 'antoine-vincent-arnault', 
  book = 'livre-1', 
  fable = 'acteon' 
}) => {
  const { tabConfig, activeTab, updateTabLanguage, setActiveTab, saveAsDefault } = useWidgetState(widgetId);
  const { loadedContent, loadingStates, loadContent, errors } = useContentLoader();
  const [showConfig, setShowConfig] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  // Chargement initial du contenu
  useEffect(() => {
    const language = tabConfig[activeTab];
    if (language && !loadedContent[activeTab]) {
      loadContent(activeTab, language, author, book, fable);
    }
  }, [activeTab, tabConfig, loadContent, loadedContent, author, book, fable]);

  const handleTabClick = useCallback((tabId) => {
    if (tabId === 'config') {
      setShowConfig(true);
      return;
    }
    
    setActiveTab(tabId);
    const language = tabConfig[tabId];
    if (language && !loadedContent[tabId]) {
      loadContent(tabId, language, author, book, fable);
    }
  }, [tabConfig, loadedContent, loadContent, setActiveTab, author, book, fable]);

  const handleLanguageChange = useCallback((tabId, newLanguage) => {
    updateTabLanguage(tabId, newLanguage);
    if (newLanguage) {
      loadContent(tabId, newLanguage, author, book, fable);
    }
  }, [updateTabLanguage, loadContent, author, book, fable]);

  const handleQuickLanguageChange = useCallback((tabId, newLanguage) => {
    handleLanguageChange(tabId, newLanguage);
  }, [handleLanguageChange]);

  const handleRetry = useCallback((tabId, language) => {
    loadContent(tabId, language, author, book, fable);
  }, [loadContent, author, book, fable]);

  const getAvailableLanguagesForTab = useCallback((tabId) => {
    const usedLanguages = Object.entries(tabConfig)
      .filter(([id, lang]) => id !== tabId && lang)
      .map(([, lang]) => lang);
    
    return AVAILABLE_LANGUAGES.filter(lang => !usedLanguages.includes(lang.code));
  }, [tabConfig]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button 
            onClick={() => setShowDebug(!showDebug)} 
            className="text-slate-400 hover:text-white transition-colors"
            title="Afficher/Masquer les informations de débogage"
          >
            <SafeIcon icon={FiInfo} className="w-5 h-5" />
          </button>
        </div>
        <p className="text-slate-300 text-sm mt-1">
          📚 Collection d'Antoine Vincent Arnault • Widget Astro + React
        </p>
        
        {showDebug && (
          <div className="mt-2 p-2 bg-slate-900/50 rounded text-xs text-slate-300 font-mono">
            <div>Structure: {author}/{book}/{fable}</div>
            <div>Moteur: Astro + React</div>
            <div>Chemin: /src/content/docs/[lang]/{author}/{book}/{fable}/</div>
          </div>
        )}
      </div>
      
      <TabNavigation 
        tabConfig={tabConfig}
        activeTab={showConfig ? 'config' : activeTab}
        onTabClick={handleTabClick}
        onQuickLanguageChange={handleQuickLanguageChange}
        getAvailableLanguagesForTab={getAvailableLanguagesForTab}
        loadingStates={loadingStates}
      />
      
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {showConfig ? (
            <motion.div
              key="config"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ConfigurationPanel 
                tabConfig={tabConfig}
                onLanguageChange={handleLanguageChange}
                onClose={() => setShowConfig(false)}
                onSaveAsDefault={saveAsDefault}
                getAvailableLanguagesForTab={getAvailableLanguagesForTab}
              />
            </motion.div>
          ) : (
            <motion.div
              key={`content-${activeTab}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ContentDisplay 
                tabId={activeTab}
                language={tabConfig[activeTab]}
                content={loadedContent[activeTab]}
                loading={loadingStates[activeTab]}
                error={errors[activeTab]}
                onRetry={handleRetry}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MultilingualWidget;
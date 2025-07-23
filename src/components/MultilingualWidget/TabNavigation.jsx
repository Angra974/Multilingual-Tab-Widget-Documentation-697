import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { AVAILABLE_LANGUAGES } from './constants';
import QuickLanguageSelector from './QuickLanguageSelector';

const { FiSettings, FiLoader } = FiIcons;

const TabNavigation = ({
  tabConfig,
  activeTab,
  onTabClick,
  onQuickLanguageChange,
  getAvailableLanguagesForTab,
  loadingStates
}) => {
  const [showQuickSelector, setShowQuickSelector] = useState(null);

  const getLanguageInfo = (languageCode) => {
    return AVAILABLE_LANGUAGES.find(lang => lang.code === languageCode);
  };

  const renderTabContent = (tabId) => {
    const language = tabConfig[tabId];
    const languageInfo = language ? getLanguageInfo(language) : null;
    const isLoading = loadingStates[tabId];

    return (
      <div className="flex items-center space-x-2">
        {languageInfo ? (
          <>
            <span className="text-lg">{languageInfo.flag}</span>
            <span className="font-medium">{languageInfo.name}</span>
          </>
        ) : (
          <span className="text-slate-400 italic">Non configuré</span>
        )}
        
        {isLoading && (
          <SafeIcon 
            icon={FiLoader} 
            className="w-4 h-4 animate-spin text-blue-500" 
          />
        )}
      </div>
    );
  };

  const handleQuickSelectorToggle = (tabId, event) => {
    event.stopPropagation();
    setShowQuickSelector(showQuickSelector === tabId ? null : tabId);
  };

  return (
    <div className="border-b border-slate-200">
      <div className="flex">
        {/* Onglets de contenu */}
        {['1', '2', '3'].map((tabId) => {
          const isActive = activeTab === tabId;
          const language = tabConfig[tabId];
          
          return (
            <div key={tabId} className="relative flex-1">
              <button
                onClick={() => onTabClick(tabId)}
                className={`
                  w-full px-4 py-3 text-left transition-all duration-200 relative
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500' 
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  {renderTabContent(tabId)}
                  
                  {language && (
                    <button
                      onClick={(e) => handleQuickSelectorToggle(tabId, e)}
                      className={`
                        p-1 rounded hover:bg-slate-200 transition-colors
                        ${showQuickSelector === tabId ? 'bg-slate-200' : ''}
                      `}
                    >
                      <SafeIcon 
                        icon={FiSettings} 
                        className="w-4 h-4 text-slate-500" 
                      />
                    </button>
                  )}
                </div>
              </button>

              {/* Sélecteur rapide de langue */}
              {showQuickSelector === tabId && (
                <QuickLanguageSelector
                  tabId={tabId}
                  currentLanguage={language}
                  availableLanguages={getAvailableLanguagesForTab(tabId)}
                  onLanguageSelect={(lang) => {
                    onQuickLanguageChange(tabId, lang);
                    setShowQuickSelector(null);
                  }}
                  onClose={() => setShowQuickSelector(null)}
                />
              )}
            </div>
          );
        })}

        {/* Onglet Configuration */}
        <button
          onClick={() => onTabClick('config')}
          className={`
            px-6 py-3 flex items-center space-x-2 transition-all duration-200
            ${activeTab === 'config'
              ? 'bg-slate-100 text-slate-800 border-b-2 border-slate-500'
              : 'bg-white text-slate-600 hover:bg-slate-50'
            }
          `}
        >
          <SafeIcon icon={FiSettings} className="w-5 h-5" />
          <span className="font-medium">Configuration</span>
        </button>
      </div>
    </div>
  );
};

export default TabNavigation;
import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { AVAILABLE_LANGUAGES } from './constants';

const { FiX, FiSave, FiGlobe } = FiIcons;

const ConfigurationPanel = ({
  tabConfig,
  onLanguageChange,
  onClose,
  onSaveAsDefault,
  getAvailableLanguagesForTab
}) => {
  const getLanguageInfo = (languageCode) => {
    return AVAILABLE_LANGUAGES.find(lang => lang.code === languageCode);
  };

  const renderLanguageSelector = (tabId) => {
    const currentLanguage = tabConfig[tabId];
    const availableLanguages = getAvailableLanguagesForTab(tabId);
    
    // Ajouter la langue actuelle aux options disponibles
    const allOptions = currentLanguage 
      ? [getLanguageInfo(currentLanguage), ...availableLanguages]
      : availableLanguages;

    return (
      <select
        value={currentLanguage || ''}
        onChange={(e) => onLanguageChange(tabId, e.target.value || null)}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Sélectionner une langue...</option>
        {allOptions.map((language) => (
          <option key={language.code} value={language.code}>
            {language.flag} {language.name}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className="p-6">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiGlobe} className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-slate-800">
            Configuration des Langues
          </h3>
        </div>
        
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <SafeIcon icon={FiX} className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      {/* Configuration des onglets */}
      <div className="space-y-6">
        {['1', '2', '3'].map((tabId) => {
          const currentLanguage = tabConfig[tabId];
          const languageInfo = currentLanguage ? getLanguageInfo(currentLanguage) : null;
          
          return (
            <motion.div
              key={tabId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: parseInt(tabId) * 0.1 }}
              className="bg-slate-50 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-slate-700">
                  Onglet {tabId}
                </h4>
                
                {languageInfo && (
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <span className="text-lg">{languageInfo.flag}</span>
                    <span>{languageInfo.name}</span>
                  </div>
                )}
              </div>
              
              {renderLanguageSelector(tabId)}
              
              {currentLanguage && (
                <div className="mt-3 p-3 bg-white rounded border text-sm text-slate-600">
                  <strong>Aperçu :</strong> Le contenu sera affiché en {languageInfo?.name}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
        <button
          onClick={onSaveAsDefault}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
        >
          <SafeIcon icon={FiSave} className="w-4 h-4" />
          <span>Définir comme défaut</span>
        </button>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            Annuler
          </button>
          
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Appliquer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationPanel;
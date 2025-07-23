import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { AVAILABLE_LANGUAGES } from './constants';

const { FiLoader, FiAlertCircle, FiGlobe, FiRefreshCw } = FiIcons;

const ContentDisplay = ({ tabId, language, content, loading, error, onRetry }) => {
  const getLanguageInfo = (languageCode) => {
    return AVAILABLE_LANGUAGES.find(lang => lang.code === languageCode);
  };

  const languageInfo = language ? getLanguageInfo(language) : null;

  if (!language) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        <div className="text-center">
          <SafeIcon icon={FiGlobe} className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <p className="text-lg font-medium">Onglet non configuré</p>
          <p className="text-sm">Utilisez la configuration pour assigner une langue</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <SafeIcon icon={FiLoader} className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-500" />
          <p className="text-slate-600">Chargement du contenu en {languageInfo?.name}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <SafeIcon icon={FiAlertCircle} className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <p className="text-lg font-medium text-red-600 mb-2">Erreur de chargement</p>
          <p className="text-sm text-slate-600 mb-4">{error}</p>
          {onRetry && (
            <button 
              onClick={() => onRetry(tabId, language)}
              className="flex items-center mx-auto px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-md transition-colors"
            >
              <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2" />
              Réessayer
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        <div className="text-center">
          <SafeIcon icon={FiGlobe} className="w-12 h-12 mx-auto mb-4 text-slate-300" />
          <p className="text-lg font-medium">Contenu non disponible</p>
          <p className="text-sm">Le contenu en {languageInfo?.name} n'est pas encore chargé</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      {/* En-tête du contenu */}
      <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-200">
        <span className="text-2xl">{languageInfo?.flag}</span>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            Contenu en {languageInfo?.name}
          </h3>
          <p className="text-sm text-slate-500">Onglet {tabId}</p>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="prose prose-slate max-w-none">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </motion.div>
  );
};

export default ContentDisplay;
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const QuickLanguageSelector = ({
  tabId,
  currentLanguage,
  availableLanguages,
  onLanguageSelect,
  onClose
}) => {
  const selectorRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <motion.div
      ref={selectorRef}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-b-lg shadow-lg z-50"
    >
      <div className="p-2">
        <div className="text-xs font-medium text-slate-500 mb-2 px-2">
          Changer la langue :
        </div>
        
        {availableLanguages.length > 0 ? (
          <div className="space-y-1">
            {availableLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => onLanguageSelect(language.code)}
                className="w-full px-3 py-2 text-left hover:bg-slate-100 rounded flex items-center space-x-2 transition-colors"
              >
                <span className="text-lg">{language.flag}</span>
                <span className="text-sm font-medium">{language.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="px-3 py-2 text-sm text-slate-500 italic">
            Toutes les langues sont déjà utilisées
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default QuickLanguageSelector;
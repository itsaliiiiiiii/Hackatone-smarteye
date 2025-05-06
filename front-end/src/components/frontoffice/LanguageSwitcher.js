import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div className="language-switcher dropdown">
      <button
        className="btn btn-light dropdown-toggle"
        type="button"
        id="languageDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {t('language')}
      </button>
      <ul className="dropdown-menu" aria-labelledby="languageDropdown">
        <li>
          <button
            className="dropdown-item"
            onClick={() => changeLanguage('en')}
          >
            English
          </button>
        </li>
        <li>
          <button
            className="dropdown-item"
            onClick={() => changeLanguage('fr')}
          >
            Français
          </button>
        </li>
        <li>
          <button
            className="dropdown-item"
            onClick={() => changeLanguage('ar')}
          >
            العربية
          </button>
        </li>
      </ul>
    </div>
  );
};

export default LanguageSwitcher;
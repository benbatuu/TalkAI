import { useTranslation } from 'react-i18next';
import ModernButton from './ModernButton';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Dil / Language</h3>
      <div className="flex gap-4">
        <ModernButton
          onClick={() => changeLanguage('tr')}
          className={`${i18n.language === 'tr' ? 'bg-blue-600' : 'bg-gray-600'} hover:bg-blue-700`}
        >
          Türkçe
        </ModernButton>
        <ModernButton
          onClick={() => changeLanguage('en')}
          className={`${i18n.language === 'en' ? 'bg-blue-600' : 'bg-gray-600'} hover:bg-blue-700`}
        >
          English
        </ModernButton>
      </div>
    </div>
  );
};

export default LanguageSelector;

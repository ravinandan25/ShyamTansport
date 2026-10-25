import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {settingsStorage} from '../utils/settings-storage';
import en from './en';
import hi from './hi';

// Languages offered in Settings, each shown in its own script.
export const LANGUAGES = [
  {code: 'en', name: 'English'},
  {code: 'hi', name: 'हिन्दी'},
];

const LANGUAGE_KEY = 'language';

// Saved choice, otherwise the phone's language (Hindi phones start in Hindi).
const initialLanguage = () => {
  const saved = settingsStorage.getString(LANGUAGE_KEY);
  if (LANGUAGES.some(language => language.code === saved)) {
    return saved;
  }
  const phoneLocale = Intl.DateTimeFormat().resolvedOptions().locale ?? '';
  return phoneLocale.startsWith('hi') ? 'hi' : 'en';
};

i18n.use(initReactI18next).init({
  resources: {en: {translation: en}, hi: {translation: hi}},
  lng: initialLanguage(),
  fallbackLng: 'en',
  interpolation: {escapeValue: false}, // React already escapes text
  returnNull: false,
});

export const setLanguage = code => {
  settingsStorage.setString(LANGUAGE_KEY, code);
  i18n.changeLanguage(code);
};

// Server messages are English; show them as-is in English, otherwise the
// app's own translated fallback.
export const serverMessage = (err, fallbackKey) =>
  i18n.language === 'en' && err?.response?.data?.message
    ? err.response.data.message
    : i18n.t(fallbackKey);

export default i18n;

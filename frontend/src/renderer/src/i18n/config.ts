import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import es from './locales/es.json'
import en from './locales/en.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: es,
      en: en
    },
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    }
  })

export default i18n

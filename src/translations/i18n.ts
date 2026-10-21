import { getLocales } from 'expo-localization'
import i18n from 'i18next'
export { default } from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from '@/translations/en'
import tr from '@/translations/tr'

void i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  lng: getLocales()[0].languageCode ?? 'en',
  resources: {
    en: { translation: en },
    tr: { translation: tr },
  },
})

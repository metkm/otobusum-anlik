import { getLocales } from 'expo-localization'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from '@/translations/en'
import tr from '@/translations/tr'

// eslint-disable-next-line import/no-named-as-default-member
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      tr: { translation: tr },
    },
    lng: getLocales()[0]?.languageCode ?? 'en',
    fallbackLng: 'en',
  })

export default i18n

// import { getLocales } from 'expo-localization'
// import { I18n } from 'i18n-js'

// import en from '@/translations/en'
// import tr from '@/translations/tr'

// export const i18n = new I18n({ tr, en })
// i18n.locale = getLocales()[0]?.languageCode || 'en'
// i18n.enableFallback = true

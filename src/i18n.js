import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import ko from './locales/ko.json'
import en from './locales/en.json'
import ja from './locales/ja.json'
import zh from './locales/zh.json'
import es from './locales/es.json'
import fr from './locales/fr.json'

// 지원 언어 목록 (UI 셀렉터에서 사용)
export const SUPPORTED = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中文' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
]

export const SUPPORTED_CODES = SUPPORTED.map((s) => s.code)
export const FALLBACK_LNG = 'en'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ko: { translation: ko },
      en: { translation: en },
      ja: { translation: ja },
      zh: { translation: zh },
      es: { translation: es },
      fr: { translation: fr },
    },
    fallbackLng: FALLBACK_LNG,
    supportedLngs: SUPPORTED_CODES,
    // zh-CN, ja-JP 처럼 지역 코드가 붙어도 기본 언어(zh, ja)로 매칭
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    detection: {
      // URL(?lng=) → 저장된 선택 → 브라우저 언어 → <html lang> 순으로 감지
      order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lng',
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false },
  })

export default i18n

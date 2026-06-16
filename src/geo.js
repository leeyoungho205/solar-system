// 접속 위치(IP) 기반 언어 자동 선택.
// 사용자가 직접 언어를 고르지 않았을 때만 1회 시도하며, 실패해도 조용히 무시합니다.
import { SUPPORTED_CODES } from './i18n'

// 국가 코드 → 언어 매핑 (대표적인 경우만)
const COUNTRY_TO_LANG = {
  KR: 'ko',
  JP: 'ja',
  CN: 'zh', TW: 'zh', HK: 'zh', SG: 'zh', MO: 'zh',
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es', VE: 'es',
  FR: 'fr', BE: 'fr', CA: 'fr', CH: 'fr', SN: 'fr', CI: 'fr',
  US: 'en', GB: 'en', AU: 'en', IE: 'en', NZ: 'en', IN: 'en',
}

const MANUAL_FLAG = 'ss_lang_manual'

export function markLanguageManual() {
  try { localStorage.setItem(MANUAL_FLAG, '1') } catch { /* ignore */ }
}

export function isLanguageManual() {
  try { return localStorage.getItem(MANUAL_FLAG) === '1' } catch { return false }
}

// IP 위치 기반 언어 코드를 반환 (지원하지 않거나 실패 시 null)
export async function detectLangByLocation() {
  try {
    const res = await fetch('https://ipapi.co/json/', { headers: { Accept: 'application/json' } })
    if (!res.ok) return null
    const data = await res.json()
    const code = (data && data.country_code) || ''
    const lang = COUNTRY_TO_LANG[code]
    return lang && SUPPORTED_CODES.includes(lang) ? lang : null
  } catch {
    return null
  }
}

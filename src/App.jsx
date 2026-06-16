import { useEffect } from 'react'
import { Routes, Route, Navigate, useParams, useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { SUPPORTED_CODES, FALLBACK_LNG } from './i18n'
import { detectLangByLocation, isLanguageManual } from './geo'
import Home from './pages/Home'
import Detail from './pages/Detail'

// URL의 :lang 을 i18n 과 동기화하는 레이아웃
function LangLayout() {
  const { lang } = useParams()
  const { i18n } = useTranslation()

  useEffect(() => {
    if (lang && SUPPORTED_CODES.includes(lang) && i18n.language !== lang) {
      i18n.changeLanguage(lang)
      document.documentElement.lang = lang
    }
  }, [lang, i18n])

  if (!SUPPORTED_CODES.includes(lang)) {
    return <Navigate to={`/${FALLBACK_LNG}`} replace />
  }
  return <Outlet />
}

export default function App() {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  // 접속 위치(IP) 기반 언어 자동 선택 — 사용자가 직접 고르지 않았을 때 1회만
  useEffect(() => {
    if (isLanguageManual()) return
    let cancelled = false
    detectLangByLocation().then((lang) => {
      if (cancelled || !lang) return
      const current = (i18n.language || '').split('-')[0]
      if (lang !== current) {
        i18n.changeLanguage(lang)
        // 루트(또는 언어 프리픽스만 있는) 경로일 때 URL 도 갱신
        const seg = location.pathname.split('/').filter(Boolean)
        if (seg.length <= 1) navigate(`/${lang}`, { replace: true })
      }
    })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const initial = (i18n.language || FALLBACK_LNG).split('-')[0]
  const start = SUPPORTED_CODES.includes(initial) ? initial : FALLBACK_LNG

  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/${start}`} replace />} />
      <Route path="/:lang" element={<LangLayout />}>
        <Route index element={<Home />} />
        <Route path="body/:id" element={<Detail />} />
      </Route>
      <Route path="*" element={<Navigate to={`/${start}`} replace />} />
    </Routes>
  )
}

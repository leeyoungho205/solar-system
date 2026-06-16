import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { SUPPORTED } from '../i18n'
import { markLanguageManual } from '../geo'

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.6 2.5 4 5.7 4 9s-1.4 6.5-4 9c-2.6-2.5-4-5.7-4-9s1.4-6.5 4-9z" />
    </svg>
  )
}

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const current = (i18n.language || '').split('-')[0]
  const currentLabel = (SUPPORTED.find((l) => l.code === current) || SUPPORTED[0]).label

  // 바깥 클릭 / ESC 로 닫기
  useEffect(() => {
    if (!open) return
    function onDown(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  function pick(code) {
    setOpen(false)
    if (code === current) return
    markLanguageManual() // 이후 위치 기반 자동 변경 비활성화
    i18n.changeLanguage(code)
    document.documentElement.lang = code
    const seg = location.pathname.split('/').filter(Boolean)
    if (seg.length === 0) seg.push(code)
    else seg[0] = code
    navigate('/' + seg.join('/') + location.search, { replace: true })
  }

  return (
    <div className="lang-dropdown" ref={ref}>
      <button
        className="lang-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Language"
      >
        <GlobeIcon />
        <span className="lang-current">{currentLabel}</span>
        <span className={'lang-caret' + (open ? ' open' : '')} aria-hidden>▾</span>
      </button>

      {open && (
        <ul className="lang-menu" role="listbox">
          {SUPPORTED.map((l) => (
            <li key={l.code} role="option" aria-selected={l.code === current}>
              <button
                className={'lang-option' + (l.code === current ? ' active' : '')}
                onClick={() => pick(l.code)}
              >
                {l.label}
                {l.code === current && <span className="lang-check" aria-hidden>✓</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

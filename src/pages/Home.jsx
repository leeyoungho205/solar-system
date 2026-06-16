import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SolarSystemScene from '../scenes/SolarSystemScene'
import LanguageSwitcher from '../components/LanguageSwitcher'
import TimeControls from '../components/TimeControls'

export default function Home() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { lang } = useParams()
  const [showComets, setShowComets] = useState(false)

  function onSelect(id) {
    navigate(`/${lang}/body/${id}`)
  }

  return (
    <div className="app-root">
      <div className="canvas-wrap">
        <SolarSystemScene onSelect={onSelect} showComets={showComets} />
      </div>

      <button
        className={'overlay comet-toggle' + (showComets ? ' active' : '')}
        onClick={() => setShowComets((v) => !v)}
        aria-pressed={showComets}
      >
        <span aria-hidden>☄</span> {t('cometsLabel')}
      </button>

      <div className="overlay top-bar">
        <div className="title-block">
          <h1>{t('ui.title')}</h1>
          <p>{t('ui.subtitle')}</p>
        </div>
        <LanguageSwitcher />
      </div>

      <TimeControls />

      <div className="overlay hint">{t('ui.clickHint')}</div>
    </div>
  )
}

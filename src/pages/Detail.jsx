import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import BodyDetailScene from '../scenes/BodyDetailScene'
import InfoPanel from '../components/InfoPanel'
import LanguageSwitcher from '../components/LanguageSwitcher'
import TimeControls from '../components/TimeControls'
import { BODY_MAP, getMoonsOf } from '../data/bodies'

export default function Detail() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { lang, id } = useParams()
  const body = BODY_MAP[id]

  if (!body) return <Navigate to={`/${lang}`} replace />

  const moons = getMoonsOf(id)

  function selectMoon(mid) {
    navigate(`/${lang}/body/${mid}`)
  }

  function back() {
    if (body.type === 'moon' && body.parent) navigate(`/${lang}/body/${body.parent}`)
    else navigate(`/${lang}`)
  }

  const backLabel = body.type === 'moon' && body.parent
    ? t(`bodies.${body.parent}.name`)
    : t('ui.backToSystem')

  return (
    <div className="app-root">
      <div className="canvas-wrap">
        <BodyDetailScene body={body} onSelect={selectMoon} />
      </div>

      <button className="overlay back-btn" onClick={back}>
        <span aria-hidden>←</span> {backLabel}
      </button>

      <div className="overlay top-bar" style={{ justifyContent: 'flex-end' }}>
        <LanguageSwitcher />
      </div>

      <TimeControls />

      <InfoPanel body={body} moons={moons} onSelectMoon={selectMoon} />
    </div>
  )
}

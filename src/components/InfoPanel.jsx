import { useTranslation } from 'react-i18next'
import { FACT_KEYS } from '../data/bodies'

export default function InfoPanel({ body, moons = [], onSelectMoon }) {
  const { t } = useTranslation()
  if (!body) return null

  const facts = FACT_KEYS
    .filter((k) => body.facts && body.facts[k] != null)
    .map((k) => ({ key: k, label: t(`factLabels.${k}`), value: body.facts[k] }))

  return (
    <aside className="overlay info-panel">
      <div className="info-head">
        <span className="body-accent" style={{ background: body.color, color: body.color }} />
        <h2>{t(`bodies.${body.id}.name`)}</h2>
        <span className="type-chip">{t(`types.${body.type}`)}</span>
      </div>

      <p className="info-desc">{t(`bodies.${body.id}.desc`)}</p>

      <div>
        <p className="section-label">{t('ui.facts')}</p>
        <div className="facts-grid">
          {facts.map((f) => (
            <div className="fact" key={f.key}>
              <span className="k">{f.label}</span>
              <span className="v">{f.value}</span>
            </div>
          ))}
        </div>
      </div>

      {body.type !== 'moon' && (
        <div>
          <p className="section-label">{t('ui.moons')}</p>
          {moons.length === 0 ? (
            <p className="no-moons">{t('ui.noMoons')}</p>
          ) : (
            <div className="moon-list">
              {moons.map((m) => (
                <div className="moon-item" key={m.id} onClick={() => onSelectMoon(m.id)}>
                  <span className="moon-dot" style={{ background: m.color }} />
                  <span className="moon-name">{t(`bodies.${m.id}.name`)}</span>
                  <span className="moon-arrow" aria-hidden>›</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </aside>
  )
}

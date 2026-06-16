import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { sim, SPEED_PRESETS, simDate, resetToNow, setSimDate } from '../sim'

function toInputValue(d) {
  const y = String(d.getFullYear()).padStart(4, '0')
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function TimeControls() {
  const { t, i18n } = useTranslation()
  const [playing, setPlaying] = useState(sim.playing)
  const [speed, setSpeed] = useState(sim.speed)
  const [dir, setDir] = useState(sim.dir)
  const [picker, setPicker] = useState(toInputValue(simDate()))
  const editingRef = useRef(false)

  // 날짜 입력값을 시뮬레이션 시간에 맞춰 갱신 (단, 사용자가 편집 중이면 건드리지 않음)
  useEffect(() => {
    let raf
    const loop = () => {
      if (!editingRef.current) setPicker(toInputValue(simDate()))
      raf = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(raf)
  }, [])

  function toggle() {
    sim.playing = !sim.playing
    setPlaying(sim.playing)
  }
  function pickSpeed(s) {
    sim.speed = s
    setSpeed(s)
  }
  function toggleDir() {
    sim.dir = sim.dir === 1 ? -1 : 1
    setDir(sim.dir)
  }
  function goNow() {
    resetToNow()
    sim.dir = 1
    setDir(1)
    setPicker(toInputValue(simDate()))
  }
  function onDateChange(e) {
    const v = e.target.value
    setPicker(v)
    if (v) setSimDate(new Date(v + 'T00:00:00'))
  }

  return (
    <div className="overlay time-controls">
      <button className="time-btn" onClick={goNow} title={t('controls.now')} aria-label={t('controls.now')}>
        ⌖
      </button>
      <button
        className={'time-btn' + (dir === -1 ? ' active' : '')}
        onClick={toggleDir}
        title={dir === -1 ? t('controls.forward') : t('controls.reverse')}
        aria-label={dir === -1 ? t('controls.forward') : t('controls.reverse')}
      >
        {dir === -1 ? '⏪' : '⏩'}
      </button>
      <button
        className="time-play"
        onClick={toggle}
        aria-label={playing ? t('controls.pause') : t('controls.play')}
        title={playing ? t('controls.pause') : t('controls.play')}
      >
        {playing ? '❚❚' : '▶'}
      </button>
      <div className="time-info">
        <input
          className="time-date-input"
          type="date"
          value={picker}
          onFocus={() => { editingRef.current = true }}
          onBlur={() => { editingRef.current = false }}
          onChange={onDateChange}
          aria-label={t('controls.now')}
        />
        <div className="time-speeds">
          {SPEED_PRESETS.map((s) => (
            <button
              key={s}
              className={'spd' + (s === speed ? ' active' : '')}
              onClick={() => pickSpeed(s)}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

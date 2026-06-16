import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { useTranslation } from 'react-i18next'
import Planet3D, { OrbitRing, BodyLabel } from '../components/three/Planet3D'
import Comet from '../components/three/Comet'
import TimeKeeper from '../components/three/TimeKeeper'
import { SUN, PLANETS, DWARFS } from '../data/bodies'
import { COMETS } from '../data/comets'
import { sim } from '../sim'

const DEG2RAD = Math.PI / 180

// 실제 공전주기와 J2000 평균 황경(l0)으로 현재 날짜의 위치를 재현하며 공전
function OrbitingBody({ body, onSelect, t }) {
  const ref = useRef()
  useFrame(() => {
    if (ref.current) {
      const deg = body.l0 + (360 / body.period) * sim.days
      ref.current.rotation.y = -deg * DEG2RAD
    }
  })
  return (
    <group>
      <OrbitRing radius={body.orbitRadius} />
      <group ref={ref}>
        <group position={[body.orbitRadius, 0, 0]}>
          <Planet3D body={body} onClick={() => onSelect(body.id)} />
          <BodyLabel id={body.id} offsetY={body.radius + 0.9} t={t} />
        </group>
      </group>
    </group>
  )
}

export default function SolarSystemScene({ onSelect }) {
  const { t } = useTranslation()
  const orbiting = useMemo(() => [...PLANETS, ...DWARFS], [])

  return (
    <Canvas camera={{ position: [0, 72, 168], fov: 50, near: 0.1, far: 2000 }} dpr={[1, 2]}>
      <color attach="background" args={['#04050b']} />
      <TimeKeeper />
      <ambientLight intensity={0.34} />
      <pointLight position={[0, 0, 0]} intensity={2.6} decay={0} color="#fff4d6" />
      <Stars radius={400} depth={90} count={7500} factor={4} saturation={0} fade speed={0.4} />

      <Planet3D body={SUN} onClick={() => onSelect('sun')} />
      <BodyLabel id="sun" offsetY={SUN.radius + 1.6} t={t} />

      {orbiting.map((b) => (
        <OrbitingBody key={b.id} body={b} onSelect={onSelect} t={t} />
      ))}

      {COMETS.map((c) => (
        <Comet key={c.id} comet={c} t={t} />
      ))}

      <OrbitControls
        enablePan={false}
        minDistance={14}
        maxDistance={520}
        autoRotate
        autoRotateSpeed={0.16}
      />
    </Canvas>
  )
}

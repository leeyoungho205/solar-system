import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { useTranslation } from 'react-i18next'
import Planet3D, { OrbitRing, BodyLabel } from '../components/three/Planet3D'
import TimeKeeper from '../components/three/TimeKeeper'
import { getMoonsOf } from '../data/bodies'
import { sim } from '../sim'

const TWO_PI = Math.PI * 2

function Moon({ moon, onSelect, t }) {
  const ref = useRef()
  const a0 = useMemo(() => Math.random() * TWO_PI, [])
  useFrame(() => {
    // 공유 시뮬레이션 시간 기반 → 재생/일시정지·배속에 반응
    if (ref.current) ref.current.rotation.y = a0 + sim.days * moon.orbitSpeed * 0.05
  })
  return (
    <group>
      <OrbitRing radius={moon.orbitRadius} />
      <group ref={ref}>
        <group position={[moon.orbitRadius, 0, 0]}>
          <Planet3D body={moon} onClick={() => onSelect(moon.id)} />
          <BodyLabel id={moon.id} offsetY={moon.radius + 0.55} t={t} />
        </group>
      </group>
    </group>
  )
}

export default function BodyDetailScene({ body, onSelect }) {
  const { t } = useTranslation()
  const moons = useMemo(() => getMoonsOf(body.id), [body.id])
  const extent = useMemo(
    () => (moons.length ? Math.max(body.radius, ...moons.map((m) => m.orbitRadius + m.radius)) : body.radius),
    [body.id, moons]
  )
  const camDist = extent * 2.6 + 5
  const isStar = body.type === 'star'

  return (
    <Canvas
      key={body.id}
      camera={{ position: [0, extent * 0.5, camDist], fov: 45, near: 0.1, far: 3000 }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#04050b']} />
      <TimeKeeper />
      <ambientLight intensity={isStar ? 0.7 : 0.4} />
      {isStar ? (
        <pointLight position={[0, 0, 0]} intensity={2} decay={0} color="#fff4d6" />
      ) : (
        <pointLight position={[extent * 3, extent * 2.2, extent * 3]} intensity={2.8} decay={0} color="#fff4e0" />
      )}
      <Stars radius={400} depth={90} count={5000} factor={4} saturation={0} fade speed={0.3} />

      <Planet3D body={body} interactive={false} spinScale={0.6} />

      {moons.map((m) => (
        <Moon key={m.id} moon={m} onSelect={onSelect} t={t} />
      ))}

      <OrbitControls
        enablePan={false}
        minDistance={body.radius * 1.4}
        maxDistance={camDist * 3.5}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </Canvas>
  )
}

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { makeGlowTexture } from '../../utils/textures'
import { sim } from '../../sim'

const glowTex = makeGlowTexture()
const TWO_PI = Math.PI * 2

// 케플러 방정식 풀이 (M, e → 이심 근점이각 E)
function solveKepler(M, e) {
  M = ((M % TWO_PI) + TWO_PI) % TWO_PI
  let E = e < 0.8 ? M : Math.PI
  for (let i = 0; i < 8; i++) {
    E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E))
  }
  return E
}

// 궤도 요소 → 위치 변환기 (초점이 원점)
function makeTransform(c) {
  const b = c.a * Math.sqrt(1 - c.e * c.e)
  const cosP = Math.cos(c.peri), sinP = Math.sin(c.peri)
  const cosI = Math.cos(c.inc), sinI = Math.sin(c.inc)
  const cosN = Math.cos(c.node), sinN = Math.sin(c.node)
  return function posFromE(E, out) {
    const xo = c.a * (Math.cos(E) - c.e)
    const yo = b * Math.sin(E)
    const x = xo * cosP - yo * sinP
    const y = xo * sinP + yo * cosP
    // 평면(XZ) → 경사(X축) → 승교점(Y축)
    let vx = x, vy = 0, vz = y
    const ny = -vz * sinI
    const nz = vz * cosI
    vy = ny; vz = nz
    const fx = vx * cosN + vz * sinN
    const fz = -vx * sinN + vz * cosN
    out.set(fx, vy, fz)
    return out
  }
}

export default function Comet({ comet, t }) {
  const headRef = useRef()
  const tailRef = useRef()
  const posFromE = useMemo(() => makeTransform(comet), [comet.id])
  const tmp = useMemo(() => new THREE.Vector3(), [])
  const dir = useMemo(() => new THREE.Vector3(), [])
  const quat = useMemo(() => new THREE.Quaternion(), [])
  const down = useMemo(() => new THREE.Vector3(0, -1, 0), [])

  const orbitGeom = useMemo(() => {
    const pts = []
    const v = new THREE.Vector3()
    for (let i = 0; i <= 200; i++) pts.push(posFromE((i / 200) * TWO_PI, v).clone())
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [comet.id])

  const tailGeom = useMemo(() => {
    const g = new THREE.ConeGeometry(0.55, 1, 16, 1, true)
    g.translate(0, -0.5, 0) // 꼭짓점을 원점으로 (혜성 머리 위치)
    return g
  }, [])

  const q = comet.a * (1 - comet.e) // 근일점 거리

  useFrame(() => {
    const M = TWO_PI * (sim.days / comet.periodDays + (comet.phase || 0))
    posFromE(solveKepler(M, comet.e), tmp)
    if (headRef.current) headRef.current.position.copy(tmp)
    if (tailRef.current) {
      tailRef.current.position.copy(tmp)
      const r = Math.max(tmp.length(), 0.001)
      dir.copy(tmp).normalize() // 태양 반대 방향
      quat.setFromUnitVectors(down, dir)
      tailRef.current.quaternion.copy(quat)
      const len = THREE.MathUtils.clamp((q / r) * 20, 3, 30)
      tailRef.current.scale.set(1, len, 1)
    }
  })

  return (
    <group>
      <line geometry={orbitGeom}>
        <lineBasicMaterial color={comet.color} transparent opacity={0.3} />
      </line>

      <mesh ref={tailRef} renderOrder={1}>
        <primitive object={tailGeom} attach="geometry" />
        <meshBasicMaterial
          color={comet.color}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <group ref={headRef}>
        <mesh>
          <sphereGeometry args={[0.32, 16, 16]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
        <sprite scale={[4, 4, 1]}>
          <spriteMaterial
            map={glowTex}
            color={comet.color}
            blending={THREE.AdditiveBlending}
            transparent
            depthWrite={false}
            opacity={0.9}
          />
        </sprite>
        <Html center position={[0, 1.5, 0]} className="body-label-wrap" zIndexRange={[5, 0]}>
          <span className="comet-label" style={{ color: comet.color }}>☄ {t(`comets.${comet.id}`)}</span>
        </Html>
      </group>
    </group>
  )
}

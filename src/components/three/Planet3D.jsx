import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { makeSurfaceTexture, makeRingTexture, makeGlowTexture } from '../../utils/textures'
import { timeFactor } from '../../sim'

const _loader = new THREE.TextureLoader()
_loader.setCrossOrigin('anonymous')

// 텍스처 URL을 비동기 로드하고, 실패 시 절차적 폴백을 유지하는 훅
function useSurface(body) {
  const fallback = useMemo(() => makeSurfaceTexture(body), [body.id])
  const [maps, setMaps] = useState({ map: fallback, bumpMap: null })

  useEffect(() => {
    let alive = true
    setMaps({ map: fallback, bumpMap: null })
    if (body.texture) {
      _loader.load(
        body.texture,
        (t) => {
          if (!alive) return
          t.colorSpace = THREE.SRGBColorSpace
          t.anisotropy = 8
          setMaps((m) => ({ ...m, map: t }))
        },
        undefined,
        () => {} // 실패 시 폴백 유지
      )
    }
    if (body.bump) {
      _loader.load(body.bump, (t) => {
        if (!alive) return
        setMaps((m) => ({ ...m, bumpMap: t }))
      })
    }
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [body.id])

  return maps
}

// 고리 텍스처를 반지름 방향으로 매핑하기 위한 UV 재계산 지오메트리
function buildRingGeometry(inner, outer, segments) {
  const g = new THREE.RingGeometry(inner, outer, segments, 1)
  const pos = g.attributes.position
  const uv = g.attributes.uv
  const v = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    const r = Math.sqrt(v.x * v.x + v.y * v.y)
    uv.setXY(i, (r - inner) / (outer - inner), 0.5)
  }
  uv.needsUpdate = true
  return g
}

function RingMesh({ ring }) {
  const geom = useMemo(() => buildRingGeometry(ring.inner, ring.outer, 128), [ring.inner, ring.outer])
  const fallback = useMemo(() => makeRingTexture(ring.color), [ring.color])
  const [map, setMap] = useState(fallback)

  useEffect(() => {
    let alive = true
    if (ring.texture) {
      _loader.load(ring.texture, (t) => {
        if (!alive) return
        t.colorSpace = THREE.SRGBColorSpace
        t.anisotropy = 8
        setMap(t)
      })
    }
    return () => { alive = false }
  }, [ring.texture])

  return (
    <mesh geometry={geom} rotation={[-Math.PI / 2, 0, 0]}>
      <meshStandardMaterial
        map={map}
        alphaMap={map}
        side={THREE.DoubleSide}
        transparent
        opacity={0.92}
        roughness={1}
        metalness={0}
        depthWrite={false}
      />
    </mesh>
  )
}

// 항성 헤일로 — 카메라를 향하는 단일 additive 스프라이트 (동심원 껍질 겹침 없음)
function SunGlow({ body }) {
  const tex = useMemo(() => makeGlowTexture(), [])
  const scale = body.radius * 5.2
  return (
    <sprite scale={[scale, scale, 1]} renderOrder={-1}>
      <spriteMaterial
        map={tex}
        color={body.emissive || '#ff9933'}
        blending={THREE.AdditiveBlending}
        transparent
        depthWrite={false}
        opacity={0.85}
      />
    </sprite>
  )
}

// 행성/위성/항성 단일 구체 (자전 + 선택적 고리 + 축 기울기 + 텍스처)
export default function Planet3D({ body, onClick, interactive = true, spinScale = 1 }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const { map, bumpMap } = useSurface(body)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += body.rotationSpeed * spinScale * delta * 60 * timeFactor()
    }
  })

  function over(e) {
    if (!interactive) return
    e.stopPropagation()
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }
  function out(e) {
    if (!interactive) return
    e.stopPropagation()
    setHovered(false)
    document.body.style.cursor = 'auto'
  }

  const isStar = body.type === 'star'

  return (
    <group rotation={[0, 0, body.tilt || 0]}>
      <mesh
        ref={meshRef}
        scale={hovered ? 1.08 : 1}
        onClick={onClick ? (e) => { e.stopPropagation(); onClick() } : undefined}
        onPointerOver={over}
        onPointerOut={out}
      >
        <sphereGeometry args={[body.radius, 64, 64]} />
        {isStar ? (
          <meshBasicMaterial map={map} toneMapped={false} />
        ) : (
          <meshStandardMaterial
            map={map}
            bumpMap={bumpMap || undefined}
            bumpScale={0.6}
            roughness={0.95}
            metalness={0.02}
          />
        )}
      </mesh>

      {isStar && <SunGlow body={body} />}

      {body.ring && <RingMesh ring={body.ring} />}
    </group>
  )
}

// 정적 공전 궤도선
export function OrbitRing({ radius }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.03, radius + 0.03, 160]} />
      <meshBasicMaterial color="#6b8ad6" side={THREE.DoubleSide} transparent opacity={0.18} />
    </mesh>
  )
}

// 천체 이름 라벨 (DOM 기반 — 모든 언어 렌더링)
export function BodyLabel({ id, offsetY, t }) {
  return (
    <Html position={[0, offsetY, 0]} center zIndexRange={[5, 0]} className="body-label-wrap">
      <span className="body-label">{t(`bodies.${id}.name`)}</span>
    </Html>
  )
}

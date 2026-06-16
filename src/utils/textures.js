import * as THREE from 'three'

// 외부 이미지 없이 캔버스에 절차적으로 행성 표면 텍스처를 그립니다.
// (자체 포함 — 배포 시 추가 에셋 불필요)

function hexToRgb(hex) {
  const h = hex.replace('#', '')
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  }
}

function shade(hex, amt) {
  const { r, g, b } = hexToRgb(hex)
  const cl = (v) => Math.max(0, Math.min(255, Math.round(v)))
  return `rgb(${cl(r + amt)},${cl(g + amt)},${cl(b + amt)})`
}

const TWO_PI = Math.PI * 2

export function makeSurfaceTexture(body) {
  const w = 512
  const h = 256
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = body.color
  ctx.fillRect(0, 0, w, h)

  if (body.bands) {
    // 가스 행성: 수평 띠 + 난류 타원
    const bands = body.bands
    const n = 22
    for (let i = 0; i < n; i++) {
      const t = i / n
      ctx.fillStyle = bands[i % bands.length]
      const y = t * h
      ctx.fillRect(0, y, w, h / n + 1)
    }
    for (let i = 0; i < 600; i++) {
      const x = Math.random() * w
      const y = Math.random() * h
      const rx = 4 + Math.random() * 26
      const ry = 1 + Math.random() * 4
      ctx.fillStyle = shade(bands[Math.floor(Math.random() * bands.length)], (Math.random() - 0.5) * 40)
      ctx.globalAlpha = 0.35
      ctx.beginPath()
      ctx.ellipse(x, y, rx, ry, 0, 0, TWO_PI)
      ctx.fill()
    }
    ctx.globalAlpha = 1
  } else if (body.type === 'star') {
    // 항성: 밝은 입자 노이즈
    for (let i = 0; i < 4000; i++) {
      const x = Math.random() * w
      const y = Math.random() * h
      const r = Math.random() * 3
      ctx.fillStyle = shade(body.color, (Math.random() - 0.3) * 90)
      ctx.globalAlpha = 0.5
      ctx.beginPath()
      ctx.arc(x, y, r, 0, TWO_PI)
      ctx.fill()
    }
    ctx.globalAlpha = 1
  } else {
    // 암석/얼음: 얼룩 + 분화구 느낌
    for (let i = 0; i < 1600; i++) {
      const x = Math.random() * w
      const y = Math.random() * h
      const r = 1 + Math.random() * 8
      ctx.fillStyle = shade(body.color, (Math.random() - 0.5) * 60)
      ctx.globalAlpha = 0.4
      ctx.beginPath()
      ctx.arc(x, y, r, 0, TWO_PI)
      ctx.fill()
    }
    // 분화구 하이라이트
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * w
      const y = Math.random() * h
      const r = 2 + Math.random() * 6
      ctx.strokeStyle = shade(body.color, 40)
      ctx.globalAlpha = 0.3
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(x, y, r, 0, TWO_PI)
      ctx.stroke()
    }
    ctx.globalAlpha = 1
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

export function makeRingTexture(color) {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = 16
  const ctx = canvas.getContext('2d')
  for (let x = 0; x < size; x++) {
    const a = 0.15 + Math.random() * 0.6
    ctx.fillStyle = shade(color, (Math.random() - 0.5) * 50)
    ctx.globalAlpha = a
    ctx.fillRect(x, 0, 1, 16)
  }
  ctx.globalAlpha = 1
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = THREE.RepeatWrapping
  return tex
}

// 항성 헤일로용 부드러운 방사형 글로우 (additive 스프라이트에 사용)
export function makeGlowTexture() {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0.0, 'rgba(255,255,255,0.95)')
  g.addColorStop(0.2, 'rgba(255,240,200,0.55)')
  g.addColorStop(0.45, 'rgba(255,180,90,0.18)')
  g.addColorStop(1.0, 'rgba(255,150,60,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

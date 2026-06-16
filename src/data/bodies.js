// 천체 데이터 — 시각적 수치(radius, orbitRadius 등)는 보기 좋게 압축된 값이며
// 실제 비율이 아닙니다. 물리 수치(facts)는 실제 값입니다.
// 이름/설명 텍스트는 언어별 locales/*.json 에서 가져옵니다(키: bodies.<id>.name / .desc).
//
// period: 실제 공전주기(일), l0: J2000 기준 평균 황경(도). 시간 시뮬레이션에서
// 현재 날짜의 행성 위치와 상대 공전속도를 재현하는 데 사용합니다.
//
// 텍스처: planetpixelemporium 기반 NASA 행성 맵을 jsDelivr CDN에서 런타임 로드합니다.
// (네트워크 실패 시 utils/textures.js 의 절차적 텍스처로 자동 폴백)

const TEX = 'https://cdn.jsdelivr.net/gh/jeromeetienne/threex.planets@master/images/'

export const SUN = {
  id: 'sun',
  type: 'star',
  color: '#ffcc33',
  emissive: '#ff8800',
  radius: 7,
  rotationSpeed: 0.04,
  texture: TEX + 'sunmap.jpg',
  facts: {
    diameter: '1,392,700 km',
    mass: '1.989 × 10³⁰ kg',
    surfaceTemp: '5,500 °C',
    coreTemp: '15,000,000 °C',
    type: 'G2V',
    age: '4.6 billion yr',
  },
}

export const PLANETS = [
  {
    id: 'mercury', type: 'planet', color: '#9c8b7d', radius: 0.8,
    orbitRadius: 16, period: 87.969, l0: 252.25, rotationSpeed: 0.02, tilt: 0.03,
    texture: TEX + 'mercurymap.jpg', bump: TEX + 'mercurybump.jpg',
    facts: { distanceFromSun: '57.9M km', orbitalPeriod: '88 days', dayLength: '1,408 h',
      diameter: '4,879 km', gravity: '3.7 m/s²', moons: '0', temp: '167 °C' },
  },
  {
    id: 'venus', type: 'planet', color: '#d9a066', radius: 1.4,
    orbitRadius: 22, period: 224.701, l0: 181.98, rotationSpeed: -0.008, tilt: 3.1,
    texture: TEX + 'venusmap.jpg', bump: TEX + 'venusbump.jpg',
    facts: { distanceFromSun: '108.2M km', orbitalPeriod: '225 days', dayLength: '5,832 h',
      diameter: '12,104 km', gravity: '8.9 m/s²', moons: '0', temp: '464 °C' },
  },
  {
    id: 'earth', type: 'planet', color: '#3b7dd8', radius: 1.5,
    orbitRadius: 30, period: 365.256, l0: 100.46, rotationSpeed: 0.05, tilt: 0.41,
    texture: TEX + 'earthmap1k.jpg', bump: TEX + 'earthbump1k.jpg',
    facts: { distanceFromSun: '149.6M km', orbitalPeriod: '365.25 days', dayLength: '24 h',
      diameter: '12,742 km', gravity: '9.8 m/s²', moons: '1', temp: '15 °C' },
  },
  {
    id: 'mars', type: 'planet', color: '#c1440e', radius: 1.1,
    orbitRadius: 38, period: 686.980, l0: 355.45, rotationSpeed: 0.048, tilt: 0.44,
    texture: TEX + 'marsmap1k.jpg', bump: TEX + 'marsbump1k.jpg',
    facts: { distanceFromSun: '227.9M km', orbitalPeriod: '687 days', dayLength: '24.6 h',
      diameter: '6,779 km', gravity: '3.7 m/s²', moons: '2', temp: '-65 °C' },
  },
  {
    id: 'jupiter', type: 'planet', color: '#c9a36f', radius: 3.6,
    orbitRadius: 56, period: 4332.59, l0: 34.40, rotationSpeed: 0.11, tilt: 0.05,
    bands: ['#c9a36f', '#a8794d', '#e0c8a0', '#9c6b42'],
    texture: TEX + 'jupitermap.jpg',
    facts: { distanceFromSun: '778.5M km', orbitalPeriod: '11.9 yr', dayLength: '9.9 h',
      diameter: '139,820 km', gravity: '24.8 m/s²', moons: '95', temp: '-110 °C' },
  },
  {
    id: 'saturn', type: 'planet', color: '#e3d2a0', radius: 3.0,
    orbitRadius: 74, period: 10759.22, l0: 49.94, rotationSpeed: 0.10, tilt: 0.47,
    bands: ['#e3d2a0', '#cbb583', '#f0e4bf'],
    texture: TEX + 'saturnmap.jpg',
    ring: { inner: 4.2, outer: 7.0, color: '#cdb988', texture: TEX + 'saturnringcolor.jpg' },
    facts: { distanceFromSun: '1,434M km', orbitalPeriod: '29.5 yr', dayLength: '10.7 h',
      diameter: '116,460 km', gravity: '10.4 m/s²', moons: '146', temp: '-140 °C' },
  },
  {
    id: 'uranus', type: 'planet', color: '#9fdfe3', radius: 2.2,
    orbitRadius: 90, period: 30685.4, l0: 313.23, rotationSpeed: 0.07, tilt: 1.71,
    texture: TEX + 'uranusmap.jpg',
    ring: { inner: 2.8, outer: 3.6, color: '#7fa7b0', texture: TEX + 'uranusringcolour.jpg' },
    facts: { distanceFromSun: '2,871M km', orbitalPeriod: '84 yr', dayLength: '17.2 h',
      diameter: '50,724 km', gravity: '8.7 m/s²', moons: '28', temp: '-195 °C' },
  },
  {
    id: 'neptune', type: 'planet', color: '#3b5bdb', radius: 2.1,
    orbitRadius: 104, period: 60189, l0: 304.88, rotationSpeed: 0.072, tilt: 0.49,
    texture: TEX + 'neptunemap.jpg',
    facts: { distanceFromSun: '4,495M km', orbitalPeriod: '165 yr', dayLength: '16.1 h',
      diameter: '49,244 km', gravity: '11.0 m/s²', moons: '16', temp: '-200 °C' },
  },
]

export const DWARFS = [
  {
    id: 'ceres', type: 'dwarf', color: '#8a8378', radius: 0.5,
    orbitRadius: 46, period: 1681.6, l0: 95.99, rotationSpeed: 0.04, tilt: 0.07,
    facts: { distanceFromSun: '413M km', orbitalPeriod: '4.6 yr', dayLength: '9 h',
      diameter: '940 km', gravity: '0.27 m/s²', moons: '0', temp: '-105 °C' },
  },
  {
    id: 'pluto', type: 'dwarf', color: '#c7a98b', radius: 0.6,
    orbitRadius: 118, period: 90560, l0: 238.93, rotationSpeed: 0.03, tilt: 2.13,
    texture: TEX + 'plutomap1k.jpg', bump: TEX + 'plutobump1k.jpg',
    facts: { distanceFromSun: '5,906M km', orbitalPeriod: '248 yr', dayLength: '153 h',
      diameter: '2,377 km', gravity: '0.62 m/s²', moons: '5', temp: '-225 °C' },
  },
  {
    id: 'haumea', type: 'dwarf', color: '#dcdcd0', radius: 0.5,
    orbitRadius: 126, period: 103468, l0: 240.0, rotationSpeed: 0.18, tilt: 0.5,
    facts: { distanceFromSun: '6,452M km', orbitalPeriod: '285 yr', dayLength: '3.9 h',
      diameter: '1,560 km', gravity: '0.4 m/s²', moons: '2', temp: '-241 °C' },
  },
  {
    id: 'makemake', type: 'dwarf', color: '#b8623a', radius: 0.5,
    orbitRadius: 132, period: 111845, l0: 165.0, rotationSpeed: 0.03, tilt: 0.5,
    facts: { distanceFromSun: '6,850M km', orbitalPeriod: '305 yr', dayLength: '22.5 h',
      diameter: '1,430 km', gravity: '0.5 m/s²', moons: '1', temp: '-243 °C' },
  },
  {
    id: 'eris', type: 'dwarf', color: '#d4d2cc', radius: 0.55,
    orbitRadius: 140, period: 203830, l0: 35.0, rotationSpeed: 0.02, tilt: 0.6,
    facts: { distanceFromSun: '10,125M km', orbitalPeriod: '558 yr', dayLength: '25.9 h',
      diameter: '2,326 km', gravity: '0.82 m/s²', moons: '1', temp: '-243 °C' },
  },
]

// 위성: parent(부모 천체 id) 기준 공전. orbitRadius 는 부모 반지름 배수가 아닌 절대 시각값.
export const MOONS = [
  { id: 'moon', parent: 'earth', color: '#cfcfcf', radius: 0.4, orbitRadius: 3.0, orbitSpeed: 2.2, rotationSpeed: 0.02,
    texture: TEX + 'moonmap1k.jpg', bump: TEX + 'moonbump1k.jpg',
    facts: { distance: '384,400 km', orbitalPeriod: '27.3 days', diameter: '3,474 km', gravity: '1.6 m/s²' } },

  { id: 'phobos', parent: 'mars', color: '#7a6a5a', radius: 0.18, orbitRadius: 2.0, orbitSpeed: 3.5, rotationSpeed: 0.03,
    facts: { distance: '9,377 km', orbitalPeriod: '7.7 h', diameter: '22 km', gravity: '0.0057 m/s²' } },
  { id: 'deimos', parent: 'mars', color: '#8c7c6a', radius: 0.13, orbitRadius: 2.8, orbitSpeed: 2.4, rotationSpeed: 0.02,
    facts: { distance: '23,460 km', orbitalPeriod: '30.3 h', diameter: '12 km', gravity: '0.003 m/s²' } },

  { id: 'io', parent: 'jupiter', color: '#e8d24a', radius: 0.35, orbitRadius: 5.2, orbitSpeed: 2.6, rotationSpeed: 0.02,
    facts: { distance: '421,700 km', orbitalPeriod: '1.8 days', diameter: '3,643 km', gravity: '1.8 m/s²' } },
  { id: 'europa', parent: 'jupiter', color: '#cdb38b', radius: 0.32, orbitRadius: 6.2, orbitSpeed: 2.0, rotationSpeed: 0.02,
    facts: { distance: '671,000 km', orbitalPeriod: '3.6 days', diameter: '3,122 km', gravity: '1.3 m/s²' } },
  { id: 'ganymede', parent: 'jupiter', color: '#9c8d78', radius: 0.5, orbitRadius: 7.4, orbitSpeed: 1.5, rotationSpeed: 0.02,
    facts: { distance: '1,070,400 km', orbitalPeriod: '7.2 days', diameter: '5,268 km', gravity: '1.4 m/s²' } },
  { id: 'callisto', parent: 'jupiter', color: '#6b5e52', radius: 0.46, orbitRadius: 8.6, orbitSpeed: 1.1, rotationSpeed: 0.02,
    facts: { distance: '1,882,700 km', orbitalPeriod: '16.7 days', diameter: '4,821 km', gravity: '1.2 m/s²' } },

  { id: 'titan', parent: 'saturn', color: '#d9a441', radius: 0.48, orbitRadius: 8.0, orbitSpeed: 1.3, rotationSpeed: 0.02,
    facts: { distance: '1,221,870 km', orbitalPeriod: '15.9 days', diameter: '5,150 km', gravity: '1.35 m/s²' } },
  { id: 'enceladus', parent: 'saturn', color: '#f0f4f7', radius: 0.22, orbitRadius: 5.0, orbitSpeed: 2.4, rotationSpeed: 0.02,
    facts: { distance: '238,020 km', orbitalPeriod: '1.4 days', diameter: '504 km', gravity: '0.11 m/s²' } },
  { id: 'rhea', parent: 'saturn', color: '#c9c4bd', radius: 0.28, orbitRadius: 6.4, orbitSpeed: 1.7, rotationSpeed: 0.02,
    facts: { distance: '527,108 km', orbitalPeriod: '4.5 days', diameter: '1,527 km', gravity: '0.26 m/s²' } },

  { id: 'titania', parent: 'uranus', color: '#9b8e86', radius: 0.3, orbitRadius: 4.6, orbitSpeed: 1.6, rotationSpeed: 0.02,
    facts: { distance: '435,910 km', orbitalPeriod: '8.7 days', diameter: '1,578 km', gravity: '0.38 m/s²' } },
  { id: 'miranda', parent: 'uranus', color: '#b0a9a2', radius: 0.18, orbitRadius: 3.4, orbitSpeed: 2.6, rotationSpeed: 0.02,
    facts: { distance: '129,390 km', orbitalPeriod: '1.4 days', diameter: '472 km', gravity: '0.08 m/s²' } },

  { id: 'triton', parent: 'neptune', color: '#cdd6d0', radius: 0.34, orbitRadius: 4.4, orbitSpeed: -1.8, rotationSpeed: 0.02,
    facts: { distance: '354,759 km', orbitalPeriod: '5.9 days', diameter: '2,707 km', gravity: '0.78 m/s²' } },

  { id: 'charon', parent: 'pluto', color: '#9a8f82', radius: 0.3, orbitRadius: 1.8, orbitSpeed: 1.4, rotationSpeed: 0.02,
    facts: { distance: '19,591 km', orbitalPeriod: '6.4 days', diameter: '1,212 km', gravity: '0.29 m/s²' } },
]

// 빠른 조회용 인덱스
export const ALL_BODIES = [SUN, ...PLANETS, ...DWARFS, ...MOONS]
export const BODY_MAP = Object.fromEntries(ALL_BODIES.map((b) => [b.id, b]))

export function getMoonsOf(parentId) {
  return MOONS.filter((m) => m.parent === parentId)
}

// facts 의 어떤 키를 보여줄지 (없는 키는 자동 생략)
export const FACT_KEYS = [
  'distanceFromSun', 'distance', 'orbitalPeriod', 'dayLength', 'diameter',
  'gravity', 'moons', 'temp', 'mass', 'surfaceTemp', 'coreTemp', 'type', 'age',
]

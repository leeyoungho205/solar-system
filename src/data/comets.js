// 유명 혜성 — 타원 궤도(장반경 a·이심률 e 는 보기 좋게 조정한 시각값).
// periodDays: 실제 공전주기(일). inc/node/peri: 궤도 방향(라디안). phase: 시작 위상.
// 태양은 타원의 한 초점에 위치하며, 케플러 운동으로 근일점에서 빨라집니다.
export const COMETS = [
  { id: 'encke',       color: '#bfe9c0', a: 24,  e: 0.667, periodDays: 1205,  inc: 0.20, node: 2.1, peri: 0.0, phase: 0.55 },
  { id: 'halley',      color: '#9fe7ff', a: 82,  e: 0.852, periodDays: 27500, inc: 0.55, node: 0.6, peri: 0.2, phase: 0.12 },
  { id: 'tempeltuttle',color: '#ffc0d0', a: 62,  e: 0.842, periodDays: 12150, inc: 0.40, node: 4.2, peri: 0.9, phase: 0.70 },
  { id: 'swifttuttle', color: '#ffd9a0', a: 110, e: 0.852, periodDays: 48600, inc: 0.85, node: 3.6, peri: 1.1, phase: 0.35 },
]

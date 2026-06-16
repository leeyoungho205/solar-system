// 시뮬레이션 시계 — 모든 3D 씬이 공유하는 단일 시간 상태.
// sim.days = J2000(2000-01-01 12:00 UTC) 기준 경과일. 행성 위치 계산에 사용.
// 각 씬에 mount 된 <TimeKeeper /> 가 매 프레임 advance() 로 시간을 진행시킵니다.
// (한 번에 하나의 씬만 mount 되므로 중복 가산 없음)

export const J2000 = Date.UTC(2000, 0, 1, 12, 0, 0)

// 현실 1초 ≈ 기본 8일 (행성 공전이 자연스럽게 보이는 속도). speed 배수로 조절.
export const BASE_DAYS_PER_SEC = 8

export const SPEED_PRESETS = [1, 5, 20, 100]

function nowDays() {
  return (Date.now() - J2000) / 86400000
}

export const sim = {
  days: nowDays(), // 현재 실제 날짜에서 시작
  speed: 5,
  playing: true,
  dir: 1, // +1 정방향(미래), -1 역방향(과거)
}

export function advance(dtSeconds) {
  if (sim.playing) sim.days += dtSeconds * BASE_DAYS_PER_SEC * sim.speed * sim.dir
}

// 현재 실제 시각으로 복귀
export function resetToNow() {
  sim.days = nowDays()
}

// 특정 날짜로 이동
export function setSimDate(date) {
  if (date instanceof Date && !isNaN(date.getTime())) {
    sim.days = (date.getTime() - J2000) / 86400000
  }
}

// sim.days → 자바스크립트 Date
export function simDate() {
  return new Date(J2000 + sim.days * 86400000)
}

// 시간 가산 계수 (자전 등 delta 기반 회전에 사용, 방향 포함)
export function timeFactor() {
  return sim.playing ? sim.speed * sim.dir : 0
}

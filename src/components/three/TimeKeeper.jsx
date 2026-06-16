import { useFrame } from '@react-three/fiber'
import { advance } from '../../sim'

// 씬마다 하나씩 두어 공유 시뮬레이션 시간을 진행시키는 컴포넌트 (렌더 없음)
export default function TimeKeeper() {
  useFrame((_, delta) => {
    advance(Math.min(delta, 0.1)) // 탭 전환 등으로 인한 큰 점프 방지
  })
  return null
}

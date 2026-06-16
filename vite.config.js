import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// 프로젝트 루트를 이 설정 파일이 있는 폴더로 고정 (실행 위치/cwd 와 무관하게 index.html 을 찾도록).
const projectRoot = fileURLToPath(new URL('.', import.meta.url))

// Cloudflare Pages / GitHub Pages 모두 루트 경로 배포 기준.
// GitHub Pages의 하위 경로(/repo/)에 배포할 경우 base 를 '/저장소이름/' 으로 바꾸세요.
export default defineConfig({
  root: projectRoot,
  plugins: [react()],
  base: '/',
  server: {
    open: true,
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1500,
  },
})

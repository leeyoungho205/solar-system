# 🪐 Solar System 3D — 다국어 인터랙티브 태양계

React + React Three Fiber로 만든 3D 태양계 탐험 웹앱입니다.
태양·8행성·주요 위성·왜소행성을 3D로 둘러보고, 천체를 클릭하면 확대된 3D 상세 페이지로 이동합니다.
6개 언어를 지원하며 접속 위치(IP)에 따라 언어를 자동 선택하고, 사용자가 직접 바꿀 수도 있습니다.

## ✨ 주요 기능

- **태양계 전체 3D 뷰** — 태양 중심으로 행성/왜소행성이 공전. 드래그 회전, 휠 줌, 자동 회전
- **천체별 3D 상세 페이지** — 확대된 천체가 자전하고, 위성이 주위를 공전. 위성 클릭 시 위성 상세로 이동
- **물리 정보 패널** — 지름·중력·공전주기·평균 온도 등 실제 데이터 표시
- **6개 언어** — 한국어 · English · 日本語 · 中文 · Español · Français
- **언어 자동 선택** — 브라우저 언어 + IP 위치 기반 자동 감지, 수동 전환 가능 (선택 시 자동 감지 비활성화)
- **언어별 URL** — `/ko`, `/en/body/mars` 처럼 경로에 언어가 포함되어 공유·SEO에 유리
- **외부 이미지 에셋 없음** — 행성 표면 텍스처를 캔버스로 절차적 생성 (완전 자체 포함)

## 🛠 기술 스택

| 영역 | 사용 기술 |
|------|-----------|
| UI | React 18, Vite 5 |
| 3D | three.js, @react-three/fiber, @react-three/drei |
| 라우팅 | react-router-dom (언어 prefix) |
| 다국어 | react-i18next, i18next-browser-languagedetector |
| 위치 감지 | ipapi.co (국가 코드 → 언어 매핑) |

## 🚀 로컬 실행

```bash
npm install      # 의존성 설치
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # 프로덕션 빌드 → dist/
npm run preview  # 빌드 결과 미리보기
```

> Node.js 18 이상 권장.

## 📁 폴더 구조

```
solar-system/
├─ index.html
├─ vite.config.js
├─ public/
│  ├─ _redirects          # SPA 라우팅(모든 경로 → index.html)
│  └─ favicon.svg
├─ src/
│  ├─ main.jsx            # 진입점 (Router + Suspense)
│  ├─ App.jsx             # 라우팅 + 언어 동기화 + 위치 자동 감지
│  ├─ i18n.js             # i18next 설정 / 지원 언어 목록
│  ├─ geo.js              # IP 위치 기반 언어 감지
│  ├─ index.css           # 전역 + 오버레이 UI 스타일
│  ├─ data/bodies.js      # 천체 데이터(물리 수치·궤도·고리)
│  ├─ locales/*.json      # 6개 언어 번역
│  ├─ utils/textures.js   # 절차적 표면 텍스처 생성
│  ├─ components/         # LanguageSwitcher, InfoPanel, Loader, three/Planet3D
│  ├─ scenes/             # SolarSystemScene, BodyDetailScene
│  └─ pages/              # Home, Detail
└─ .github/workflows/deploy.yml  # (선택) Cloudflare Pages 자동 배포
```

## 🌐 GitHub + Cloudflare Pages 배포

### 1) GitHub에 올리기

```bash
git init
git add .
git commit -m "Solar System 3D"
git branch -M main
git remote add origin https://github.com/<사용자>/<저장소>.git
git push -u origin main
```

### 2) Cloudflare Pages 연결 (대시보드 방식, 가장 쉬움)

1. Cloudflare 대시보드 → **Workers & Pages → Create → Pages → Connect to Git**
2. 위 GitHub 저장소 선택
3. 빌드 설정:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. **Save and Deploy** → `https://<프로젝트>.pages.dev` 로 게시됩니다.

`public/_redirects` 가 모든 경로를 `index.html` 로 보내므로 `/ko/body/mars` 같은 주소를 직접 열거나 새로고침해도 정상 동작합니다.

### 3) (선택) GitHub Actions 자동 배포

`.github/workflows/deploy.yml` 가 포함되어 있습니다. 저장소 **Settings → Secrets and variables → Actions** 에 아래 3개를 등록하면 푸시할 때마다 자동 배포됩니다.

- `CLOUDFLARE_API_TOKEN` — Cloudflare API 토큰(Pages 편집 권한)
- `CLOUDFLARE_ACCOUNT_ID` — 계정 ID
- `CF_PAGES_PROJECT` — Pages 프로젝트 이름

> 대시보드 연결만으로도 자동 배포가 되므로 Actions는 필수가 아닙니다.

## ➕ 천체 추가/수정 방법

1. `src/data/bodies.js` 에 천체 항목 추가 (id, type, color, radius, orbitRadius 등)
2. 모든 `src/locales/*.json` 의 `bodies` 에 `<id>.name` / `<id>.desc` 추가
3. 끝 — 데이터 기반으로 3D 씬과 패널에 자동 반영됩니다.

## 📝 참고

- 행성 크기·궤도 간격은 실제 비율이 아니라 **보기 좋게 압축**한 값입니다. 정보 패널의 물리 수치는 실제 값입니다.
- 표면 텍스처는 사진이 아니라 색상 기반으로 생성한 **양식화된 표현**입니다.

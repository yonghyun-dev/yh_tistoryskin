# 기술 결정 (Tech Decisions)

- 작성일: 2026-04-19
- 승인: 유저 2026-04-19 ("ㄱㄱ")
- 규격 근거: [tistory-skin-spec.md](tistory-skin-spec.md)
- 범위: Sprint 1~5 공통

---

## T-1. 코드 하이라이터 = highlight.js

- **선택**: highlight.js v11.x
  - 스크립트: `https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/highlight.min.js`
  - 라이트 테마: `https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/styles/github.min.css`
  - 다크 테마: `https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/styles/github-dark.min.css`
- **이유**
  - 자동 언어 감지(`hljs.highlightAll()`) — 티스토리 에디터가 언어 클래스를 붙이지 않아도 동작
  - 라이트/다크 테마 공식 제공, 링크 태그의 `href` 스왑으로 즉시 전환 가능
  - 코어 번들 ~80KB, CDN 정적 호스팅
- **대안 미선택 이유**
  - Prism.js: 언어별 클래스 사전 부여 전제가 강해 에디터 호환성 불확실
  - Shiki: SSR/빌드타임 전제 → 정적 스킨에 부적합
- **주의**: 티스토리 에디터가 생성하는 코드블록 마크업(`<pre><code>`)이 highlight.js 자동 감지에 잘 물리는지는 Sprint 3 스모크에서 재확인

## T-2. 댓글/방명록 = 현행 치환자 (`[##_comment_group_##]`, `[##_guestbook_group_##]`)

- **선택**: 두 치환자 모두 사용. 레거시 `<s_rp>` / `<s_guest>` 블록 미사용
- **이유**
  - 티스토리 공식 권장 신규 방식 (React 앱 자동 주입)
  - 기능/디자인 업데이트를 티스토리가 흡수 → 유지보수 비용 최소
  - 레거시 블록은 2레벨 중첩 수동 마크업 + 스팸/광고 필터 누락 가능
- **한계**: 댓글 영역 내부 DOM의 CSS 훅은 공식 문서화되지 않음 → 외곽(컨테이너·헤더) 스타일링만 적용. 내부는 기본 유지
- **대안 미선택 이유**: 레거시 `<s_rp>` 수동 마크업 — 세밀 스타일링은 가능하나 유지보수 부담이 큼

## T-3. 프로필·액센트·기능 토글 = `<variables>` 로 노출

- **이유**
  - 사용자가 티스토리 관리자 UI에서 직접 편집 가능
  - 스킨 재배포 시 다른 사용자가 자기 정보로 교체 가능
  - 유저 당부("디자인 세부 결정은 합리적 기본값")에 부합
- **최종 variables 목록 (11개)**

| name | type | default | label | 용도 |
|:--|:--|:--|:--|:--|
| `accent-start` | COLOR | `#5B5BF5` | 액센트 시작색 | gradient 시작 |
| `accent-end` | COLOR | `#8B5CF6` | 액센트 끝색 | gradient 끝 |
| `profile-image` | IMAGE | (빈값) | 프로필 이미지 | 히어로·About |
| `profile-name` | STRING | (빈값) | 이름/닉네임 | 히어로 헤드라인 |
| `profile-tagline` | STRING | (빈값) | 한 줄 소개 | 히어로 서브텍스트 |
| `profile-link-github` | STRING | (빈값) | GitHub URL | 히어로 링크 |
| `profile-link-linkedin` | STRING | (빈값) | LinkedIn URL | 히어로 링크 |
| `profile-link-email` | STRING | (빈값) | 이메일 | 히어로 링크 |
| `cursor-glow` | BOOL | `false` | 다크모드 커서 글로우 | 마이크로 인터랙션 |
| `show-reading-progress` | BOOL | `true` | 읽기 진행률 바 | 포스트 상단 바 |
| `chatbot-endpoint` | STRING | (빈값) | 챗봇 서버 URL | Sprint 5 훅 |

- **스킨 코드 사용법**
  - 값 참조: `[##_var_profile-name_##]`
  - 조건부: `<s_if_var_show-reading-progress>...</s_if_var_show-reading-progress>`, `<s_not_var_profile-image>...</s_not_var_profile-image>`
- **주의**: `index.xml` 수정 시 사용자 설정 초기화 공식 경고 → Sprint 1에서 스키마 확정 후 변경 금지. 이후 스프린트에서 신규 추가만 허용 (삭제·이름변경 금지)

## T-4. CSS 아키텍처 = 단일 `style.css` + 토큰 구획 주석

- **선택**: 모든 스타일을 `style.css` 한 파일에 집중
  - 상단: 디자인 토큰 (CSS variables)
  - 아래: 섹션별(리셋 → 베이스 → 레이아웃 → 컴포넌트 → 유틸리티) 주석 구획
- **이유**
  - 티스토리 스킨 에디터에서 편집이 단순
  - 외부 CSS 분리 대비 디버깅 편리
  - 현 규모에서 파일 분리는 오버엔지니어링
- **토큰 구획 구조** (skin-architecture.md §4 참고)

## T-5. JS = vanilla ES6+, jQuery 제거

- **선택**: 모든 스킨 JS는 `images/script.js` 한 파일, vanilla ES6+
- **모듈 영역 (같은 파일 내 IIFE 분리)**
  - 테마 토글 (`localStorage` + `data-theme` + `prefers-color-scheme`)
  - TOC 생성 및 active 추적 (IntersectionObserver)
  - 읽기 진행률 바 (scroll 이벤트, `requestAnimationFrame`)
  - 페이드인 애니메이션 (IntersectionObserver)
  - 다크모드 커서 글로우 (variable 활성 시만)
  - 챗봇 훅 (마운트 지점 + 마커 치환 + 전역 설정 객체)
- **이유**
  - Ray 테마의 jQuery는 IE 호환 목적. 2026 기준 IE 지원 불필요
  - IntersectionObserver/localStorage/matchMedia 네이티브 API로 충분
  - 번들 부담 최소화

## T-6. Viewport = 줌 허용 (접근성)

- **선택**: `<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">`
- **이유**: Ray 테마의 `user-scalable=no, maximum-scale=1.0`은 시각 보조가 필요한 사용자의 확대를 막는 접근성 위배. WCAG 2.1 SC 1.4.4 (Resize text) 위반
- **대안 미선택 이유**: Ray 방식 그대로 — 접근성 손해

---

## 외부 의존성 (최종 확정)

| 항목 | CDN (정적) | 비고 |
|:--|:--|:--|
| Pretendard (variable) | `cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css` | 동적 서브셋, variable font로 굵기 전 영역 지원 |
| JetBrains Mono | `cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5.0.0/index.css` | 코드 폰트 |
| highlight.js | `cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/highlight.min.js` | 코드 하이라이팅 |
| highlight.js github 테마 | `cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/styles/github.min.css` | 라이트 테마 |
| highlight.js github-dark 테마 | `cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/styles/github-dark.min.css` | 다크 테마 |

- 모든 폰트는 `font-display: swap`
- Sprint 1 스모크에서 전 CDN 로드 성공 확인. 실패 시 `images/` 폴더 내재화로 전환 (R-1 대응)

## 결정 이력

| 날짜 | 결정 | 근거 |
|:--|:--|:--|
| 2026-04-19 | T-1~T-6, variables 11개, 외부 의존성 확정 | PM 초안 → 유저 승인 |

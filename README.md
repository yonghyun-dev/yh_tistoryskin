# Modern Dev Blog — 티스토리 2.0 개발자 블로그 스킨

Stripe · Apple · Vercel docs 무드의 깔끔한 개인 개발 블로그 스킨입니다. 티스토리 2.0 스킨 규격을 준수하며, 라이트/다크 모드, 카드 그리드, 목차(TOC), 코드 하이라이팅, 챗봇 embed 훅을 포함합니다. 설정은 티스토리 관리자 UI만으로 완결됩니다.

---

## 한눈에 보기

| 항목 | 내용 |
|:--|:--|
| 스킨 이름 | Modern Dev Blog |
| 버전 | 1.0.0 |
| 라이선스 | MIT |
| 티스토리 요구 버전 | 2.0 |
| 지원 브라우저 | ES6+ 지원 모던 브라우저 (Chrome, Firefox, Safari, Edge 최신) |
| 외부 CDN 의존 | Pretendard, JetBrains Mono, highlight.js (jsdelivr.net) |

---

## 스크린샷

![홈 — 라이트 모드 카드 그리드](#)
![개별 포스트 — 다크 모드 TOC 2단 레이아웃](#)
![모바일 — TOC FAB 버튼 + 카드 1열](#)

> 위 이미지는 추후 실제 스크린샷으로 교체 예정입니다.

---

## 주요 기능

| 기능 | 설명 |
|:--|:--|
| 라이트/다크 모드 | 헤더 버튼으로 즉시 전환. 선택 값을 localStorage에 저장해 새로고침 후에도 유지. OS `prefers-color-scheme` 자동 반영 |
| 액센트 컬러 그라데이션 | 관리자에서 시작색·끝색을 지정하면 제목·링크 hover·진행률 바·TOC 활성 항목 등에 일괄 적용 |
| 카드 그리드 | 홈·카테고리·태그·검색 결과 공용. 모바일 1열 → 태블릿 2열 → 데스크톱 3열 반응형 |
| 홈 커버 | Featured(직접 선택) + Recent(최근 글 자동) 두 섹션. 관리자 커버 편집 UI 연동 |
| 프로필 히어로 | 홈 상단에 이미지·이름·한 줄 소개·GitHub·LinkedIn·이메일 링크 표시. 이름에 액센트 그라데이션 적용 |
| TOC (목차) | 포스트 본문 h2/h3를 자동 스캔해 우측 사이드에 목차 생성. 스크롤하면 현재 섹션이 액센트 컬러로 하이라이트. 모바일에서는 우측 하단 FAB 버튼으로 접힘 |
| 읽기 진행률 바 | 포스트 상단에 고정된 그라데이션 바. 스크롤 위치에 따라 너비 증가. 관리자에서 ON/OFF 가능 |
| 예상 읽기 시간 | 본문 글자 수 기반으로 `N분 읽기`를 포스트 상단에 표시 |
| 코드 하이라이팅 | highlight.js 연동. 라이트 모드에서는 github 테마, 다크 모드에서는 github-dark 테마 자동 전환 |
| 마이크로 인터랙션 | 카드 hover lift 효과, 스크롤 페이드인, 페이지 전환 애니메이션, 다크 모드 커서 소프트 글로우(선택) |
| 접근성 | viewport 줌 허용(`user-scalable` 미제한), `aria-label` 적용, `prefers-reduced-motion` 대응, `prefers-color-scheme` 자동 반영 |
| 챗봇 embed 훅 | `chatbot-endpoint` 변수에 URL을 입력하고 외부 스크립트 한 줄을 추가하면 플로팅 위젯과 본문 인라인 마커 두 지점에 마운트. 자세한 내용은 [챗봇 통합](#챗봇-통합) 참조 |
| 보조 페이지 | 공지 배너, 비밀글 비밀번호 카드, 방명록(`/guestbook`), 태그 클라우드(`/tag`) |
| 반응형 | 767px / 1023px / 1279px 세 구간 브레이크포인트 |

---

## 요구 환경

- **티스토리 2.0** — 스킨 등록 및 `<variables>` 기능 필요
- **모던 브라우저** — ES6+ 지원 환경 (Chrome, Firefox, Safari, Edge 최신 버전)
- **외부 CDN 접근** — 스킨이 아래 CDN에서 폰트·라이브러리를 로드합니다. 방화벽 환경에서는 렌더링이 불완전할 수 있습니다.
  - `cdn.jsdelivr.net` — Pretendard 폰트, JetBrains Mono 폰트, highlight.js
- 별도 빌드 도구나 Node.js 설치는 필요하지 않습니다.

---

## 설치

### 방법 1. zip 일괄 업로드 (권장)

아래 명령어로 스킨 파일을 하나의 zip으로 묶습니다.

```bash
cd /home/yhkim/yh_tistoryskin
rm -rf build modern-dev-blog.zip
mkdir -p build/images
cp skin/skin.html skin/index.xml skin/style.css skin/preview.gif build/
cp skin/script.js skin/chatbot-stub.js build/images/
(cd build && zip -r ../modern-dev-blog.zip .)
rm -rf build
```

> 로컬은 `skin/` 한 폴더에서 관리하지만, 티스토리는 JS를 `./images/` 경로로 서빙하므로 zip에는 `images/` 서브폴더 구조를 만들어 담습니다.

만들어진 `modern-dev-blog.zip`을 아래 경로에서 업로드합니다.

> 티스토리 관리자 > 꾸미기 > 스킨 변경 > **스킨 등록** 또는 **파일 업로드**

### 방법 2. 개별 파일 업로드

`skin/` 폴더의 파일을 티스토리 관리자 > 꾸미기 > 스킨 편집 > **HTML 편집** 또는 **파일 업로드** 탭에서 각 파일을 개별로 붙여넣거나 업로드합니다. `script.js`·`chatbot-stub.js`는 "파일 업로드" 탭에 올리면 티스토리가 자동으로 `./images/` 경로에 저장합니다.

> 주의: `index.xml`을 개별 업로드하면 이전에 관리자에서 설정한 `<variables>` 값(액센트 색상, 프로필 정보 등)이 초기화됩니다. 기존 설정을 백업한 뒤 진행하세요.

### 방법 3. 스킨 활성화 확인

업로드 후 아래 경로에서 스킨이 활성화되었는지 확인합니다.

> 티스토리 관리자 > 꾸미기 > 스킨 변경 > 현재 적용된 스킨 확인

블로그 홈(`/`)에 접속해 헤더, 카드 그리드, 다크 모드 토글 버튼이 표시되면 설치가 완료된 것입니다.

---

## 커스터마이징 — 티스토리 관리자 변수 설정

티스토리 관리자 > 꾸미기 > 스킨 편집 > **스킨 설정(변수 설정)** 탭에서 아래 11개 변수를 설정할 수 있습니다. 코드를 수정할 필요가 없습니다.

### Theme 그룹

| 변수명 | 레이블 | 타입 | 기본값 | 설명 |
|:--|:--|:--|:--|:--|
| `accent-start` | 액센트 시작색 | COLOR | `#5B5BF5` | 제목 그라데이션·링크 hover·진행률 바·TOC 활성 항목의 시작 색상 |
| `accent-end` | 액센트 끝색 | COLOR | `#8B5CF6` | 그라데이션의 끝 색상 |

예를 들어 `accent-start`를 `#F97316`(주황), `accent-end`를 `#EF4444`(빨강)으로 바꾸면 사이트 전체 포인트 컬러가 한 번에 바뀝니다.

### Profile 그룹

| 변수명 | 레이블 | 타입 | 기본값 | 설명 |
|:--|:--|:--|:--|:--|
| `profile-image` | 프로필 이미지 | IMAGE | (없음) | 홈 히어로 섹션에 표시되는 원형 프로필 사진. 비워두면 이미지 영역이 숨겨집니다 |
| `profile-name` | 이름/닉네임 | STRING | (없음) | 히어로 섹션 헤드라인. 비워두면 블로그 주인 필명이 표시됩니다 |
| `profile-tagline` | 한 줄 소개 | STRING | (없음) | 이름 아래 서브 텍스트. 비워두면 기본 안내 문구가 표시됩니다 |
| `profile-link-github` | GitHub URL | STRING | (없음) | 예: `https://github.com/username`. 비워두면 GitHub 링크가 숨겨집니다 |
| `profile-link-linkedin` | LinkedIn URL | STRING | (없음) | 예: `https://linkedin.com/in/username`. 비워두면 LinkedIn 링크가 숨겨집니다 |
| `profile-link-email` | 이메일 | STRING | (없음) | 예: `you@example.com`. 비워두면 이메일 링크가 숨겨집니다 |

### Features 그룹

| 변수명 | 레이블 | 타입 | 기본값 | 설명 |
|:--|:--|:--|:--|:--|
| `cursor-glow` | 다크모드 커서 소프트 글로우 | BOOL | `false` | 다크 모드에서 마우스 커서 주변에 은은한 글로우 효과를 표시합니다. 거슬리면 `false`로 끄세요 |
| `show-reading-progress` | 읽기 진행률 바 | BOOL | `true` | 포스트 상단에 읽기 진행률 바를 표시합니다 |
| `chatbot-endpoint` | 챗봇 서버 URL | STRING | (없음) | 챗봇을 연결할 서버 URL. 비워두면 챗봇 위젯이 표시되지 않습니다 |

---

## 파일 구조

```
yh_tistoryskin/
└── skin/                  # 티스토리 업로드 대상 파일 일체
    ├── skin.html          # 전체 페이지 템플릿. 헤더·메인·사이드바·푸터 + 티스토리 치환자
    ├── index.xml          # 스킨 메타 정보, <variables> 11개 정의, <cover> 2개 정의
    ├── style.css          # 디자인 토큰 + 모든 컴포넌트 스타일 + 반응형
    ├── preview.gif        # 티스토리 스킨 목록 썸네일 (1x1 임시, 실제 스크린샷으로 교체 예정)
    ├── script.js          # 런타임 JS 10개 모듈 (theme, toc, progress, codeBlocks 등)
    └── chatbot-stub.js    # 챗봇 스크립트 없을 때 마운트 지점을 확인하는 선택적 더미 스텁
```

> `skin.html` 내부의 `./images/script.js` 참조는 티스토리 서버의 서빙 경로 규약이며, 로컬 폴더 이름과 무관합니다.

### `script.js` 모듈 목록

| 모듈명 | 역할 |
|:--|:--|
| `theme` | 라이트/다크 모드 전환 (localStorage + `prefers-color-scheme`) |
| `pageTransition` | 페이지 진입 페이드인 |
| `progress` | 포스트 읽기 진행률 바 (스크롤 기반 너비 갱신) |
| `toc` | 포스트 본문 h2/h3 스캔 → TOC 생성 + 현재 섹션 active 하이라이트 |
| `readingTime` | 본문 글자 수 기반 예상 읽기 시간 계산·표시 |
| `codeBlocks` | highlight.js 로드 대기 후 자동 코드 하이라이팅 |
| `tagPage` | `/tag` vs `/tag/{태그명}` URL 기반 body 클래스 분기 |
| `fadeIn` | IntersectionObserver 기반 스크롤 페이드인 |
| `glow` | 다크 모드 커서 소프트 글로우 (`cursor-glow` variable 활성화 시만 동작) |
| `chatbot` | 챗봇 훅 — 전역 설정 초기화 + 본문 마커 치환 + `themechange` 이벤트 브로드캐스트 |

---

## 챗봇 통합

스킨은 외부 챗봇 스크립트를 연결하기 위한 마운트 지점과 설정 API를 미리 준비해 두고 있습니다. 별도로 챗봇 서버와 프론트 스크립트를 만들어 연결하면 됩니다.

**연결 방법 요약**

1. 티스토리 관리자 변수 설정에서 `chatbot-endpoint`에 챗봇 서버 URL을 입력합니다.
2. 스킨 편집 HTML 하단에 아래 한 줄을 추가합니다.

```html
<script src="https://your-cdn.com/chatbot.js" defer></script>
```

3. 챗봇 스크립트는 `#chatbot-widget-root` 요소에 플로팅 위젯을 마운트하고, 포스트 본문에 `<!--[chatbot]-->` 마커가 있으면 인라인 슬롯도 자동 생성됩니다.
4. 테마가 전환될 때 `window` 스코프에서 `themechange` 이벤트가 발행되므로, 챗봇 UI가 이를 구독해 내부 테마를 동기화할 수 있습니다.

상세 API 계약(DOM 마운트 지점, `window.__CHATBOT_CONFIG__` 구조, 이벤트 명세)은 아래 문서를 참조하세요.

> [docs/design/chatbot-integration.md](docs/design/chatbot-integration.md)

---

## 디자인 시스템

디자인 토큰(Design Token)이란 색상·폰트·간격·모서리 둥글기 등을 CSS 변수로 미리 정의해 둔 것입니다. `style.css` 상단의 `:root {}` 블록에 모두 정의되어 있습니다.

### 컬러 토큰

| 토큰 이름 | 라이트 기본값 | 다크 기본값 | 용도 |
|:--|:--|:--|:--|
| `--color-bg` | `#ffffff` | `#0a0e1a` | 페이지 배경 |
| `--color-text` | `#0a0a0a` | `#e8e8ec` | 본문 텍스트 |
| `--color-text-muted` | 62% 투명도 | 62% 투명도 | 날짜·카테고리 등 보조 텍스트 |
| `--color-border` | 8% 투명도 | 8% 투명도 | 카드·구분선 테두리 |
| `--color-link` | `#5b5bf5` | `#a78bfa` | 링크 색상 |
| `--color-code-bg` | `#f5f5f7` | 반투명 남색 | 인라인 코드 배경 |
| `--accent-start` | `#5b5bf5` | (변수 공유) | 그라데이션 시작. 관리자 설정으로 변경 가능 |
| `--accent-end` | `#8b5cf6` | (변수 공유) | 그라데이션 끝. 관리자 설정으로 변경 가능 |

라이트/다크 전환은 `<html data-theme="dark">` 속성 교체로 이루어집니다. `[data-theme="dark"]` 블록이 토큰 값을 덮어씁니다.

### 타이포그래피 토큰

| 토큰 | 값 | 용도 |
|:--|:--|:--|
| `--font-sans` | Pretendard Variable | 본문·UI 전체 |
| `--font-mono` | JetBrains Mono | 코드 블록 |
| `--fs-base` | `1rem` (16px) | 기본 본문 크기 |
| `--fs-3xl` | `2rem` | 포스트 제목 |
| `--lh-prose` | `1.8` | 본문 줄 높이 |

### 간격 토큰

4px를 기본 단위로 합니다. `--space-4`가 `1rem(16px)`, `--space-8`이 `2rem(32px)` 식으로 배수로 늘어납니다.

### 모서리(Radius) 토큰

| 토큰 | 값 | 용도 |
|:--|:--|:--|
| `--radius-sm` | `6px` | 태그 pill |
| `--radius-md` | `10px` | 카드 |
| `--radius-lg` | `16px` | 프로필 이미지·히어로 영역 |
| `--radius-full` | `9999px` | 원형 버튼·뱃지 |

---

## 접근성

- viewport 줌 허용 — `meta viewport`에 `user-scalable` 제한 없음
- 시각적 버튼에 `aria-label` 적용 — 테마 토글(라이트/다크 모드 전환), 검색 실행, TOC FAB 버튼
- `prefers-reduced-motion` 대응 — CSS와 JS 모두 애니메이션을 최소화
- `prefers-color-scheme` 자동 반영 — localStorage에 설정이 없으면 OS 테마를 기본값으로 사용
- TOC 내비게이션에 `aria-label="목차"` 적용
- 카테고리 내비게이션에 `aria-label="카테고리"` 적용

---

## 알려진 제약 및 주의사항

### index.xml 수정 시 변수 설정 초기화

티스토리 공식 제약 사항입니다. `index.xml`을 업로드(교체)하면 관리자 UI에서 설정한 `accent-start`, `accent-end`, 프로필 정보 등 모든 `<variables>` 값이 초기화됩니다. 변경 전에 반드시 현재 설정값을 메모해 두세요.

### 시리즈 기능 미지원

티스토리 시리즈 기능(요구사항 F-20b)은 이번 버전의 범위에 포함되지 않습니다.

### 외부 CDN 의존

폰트(Pretendard, JetBrains Mono)와 highlight.js는 `cdn.jsdelivr.net`에서 로드됩니다. 해당 CDN이 차단된 환경에서는 폴백 폰트로 표시되고 코드 하이라이팅이 동작하지 않습니다.

### 방명록

방명록(`/guestbook`)은 티스토리가 제공하는 `[##_guestbook_group_##]` 치환자로 렌더됩니다. 스킨은 마운트 지점만 제공하며, 실제 방명록 기능은 티스토리 플랫폼이 담당합니다.

### 확인 필요 항목

Sprint 5 최종 스모크 체크리스트를 수행하면서 아래 항목들을 확인해야 합니다.

> [docs/design/final-smoke-checklist.md](docs/design/final-smoke-checklist.md)

- U-3: `<s_t3>` 내부에서 외부 CDN `<script>` 허용 여부 (운영 환경 실측 필요)
- N-3: 관리자 UI에서 `<variables>` 그룹(Theme/Profile/Features)이 올바르게 표시되는지
- N-5: 커버 썸네일 img 태그 정상 렌더 여부

---

## 개발 히스토리

총 5개 스프린트로 개발되었습니다 (2026-04-19 기준).

| 스프린트 | 목표 | 완료 여부 | 주요 산출물 |
|:--|:--|:--|:--|
| Sprint 1 | 스킨 골격 + 디자인 토큰 + 라이트/다크 | 완료 (2026-04-19) | `skin.html` 기본 구조, `style.css` 토큰 체계, `index.xml` 변수 정의, 테마 전환 JS |
| Sprint 2 | 메인 목록 + 프로필 + 네비 + 검색 + 사이드바 | 완료 (2026-04-19) | 카드 그리드, 커버(Featured/Recent), 프로필 히어로 그라데이션, 태그 클라우드, 페이지네이션 |
| Sprint 3 | 개별 포스트 + TOC + 코드 하이라이팅 + 진행률 | 완료 (2026-04-19) | 포스트 2단 레이아웃, TOC 자동 생성·active 하이라이트, 읽기 진행률 바, highlight.js 연동, 관련글/이전·다음/댓글 |
| Sprint 4 | 공지 + 보호글 + 방명록 + 마이크로 인터랙션 + 반응형 | 완료 (2026-04-19) | 페이드인, hover lift, 페이지 전환 애니메이션, 커서 글로우, `prefers-reduced-motion` 대응, 767/1023/1279 반응형 |
| Sprint 5 | 챗봇 훅 + 전역 설정 API + 더미 스텁 + 통합 검증 | 구현 완료, 검증 진행 중 | `chatbot` JS 모듈, `chatbot-stub.js`, `chatbot-integration.md` API 계약 문서 |

---

## 기여

버그 제보나 개선 제안은 이슈로 등록해 주세요. PR은 `main` 브랜치 기준으로 보내주시면 됩니다.

fork 후 개선할 때 참고할 설계 문서는 `docs/design/` 폴더에 있습니다.

- [아키텍처](docs/design/skin-architecture.md)
- [기술 결정 기록](docs/design/tech-decisions.md)
- [챗봇 통합 가이드](docs/design/chatbot-integration.md)
- [최종 스모크 체크리스트](docs/design/final-smoke-checklist.md)

---

## 라이선스

MIT License. 자세한 내용은 `index.xml`의 `<license>` 항목을 참조하세요.

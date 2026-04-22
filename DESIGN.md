# Design System — Yonghyun Dev Archive

## Product Context
- **What this is:** 티스토리 2.0 기반의 개인 개발 블로그이자 경력 아카이브. 기술 글, 트러블슈팅, 프로젝트 회고, 이직 준비 기록을 장기적으로 축적하는 공간이다.
- **Who it's for:** 블로그 주인 자신, 비슷한 경로를 걷는 개발자, 그리고 활동성과 사고 과정을 보고 싶은 인사팀/채용 담당자.
- **Space/industry:** 개발자 개인 블로그, docs형 기술 아카이브, lightweight portfolio.
- **Project type:** 하이브리드. 홈은 에디토리얼 아카이브, 글 페이지는 문서형 읽기 구조.
- **Memorable thing:** "이 사람 꾸준히 활동하는구나."

## Aesthetic Direction
- **Direction:** Editorial Utility, dark-first archive
- **Decoration level:** intentional
- **Mood:** 앱 대시보드처럼 보이지 않고, 정제된 기술 아카이브처럼 보여야 한다. 조용하지만 차갑기만 하지는 않고, 기록의 밀도와 업데이트 리듬이 먼저 느껴져야 한다.
- **Reference sites:** Lee Robinson, Josh W. Comeau, Vercel Docs, Stripe Docs
- **Do not look like:** generic SaaS landing page, personal dashboard, bubbly no-code template

## Core Design Thesis
- 첫 화면의 주인공은 자기소개가 아니라 최근 활동과 대표 글이다.
- "화려함"보다 "지속성의 증거"를 먼저 보여준다.
- 블로그 전체는 글 읽기 흐름을 방해하지 않아야 한다.
- 기능은 많아도 셸이 앞에 나오면 안 된다. 검색, TOC, 태그, 아카이브, 챗봇은 보조 장치다.

## Typography
- **Display/Hero:** `Pretendard Variable`
  이유: 이번 방향은 세리프 감성보다 더 또렷하고 현대적인 인상이 중요하다. 제목은 ExtraBold 중심, 자간은 약간 조인다.
- **Body:** `Pretendard Variable`
  이유: 한국어 긴 글 가독성, UI 일관성, 티스토리 환경에서의 안정성이 좋다.
- **UI/Labels:** `Pretendard Variable`
- **Data/Tables:** `JetBrains Mono`
  이유: 날짜, 태그, 읽기 시간, 업데이트 시각, 코드 메타를 분리해준다.
- **Code:** `JetBrains Mono`
- **Loading:** 기존 CDN 유지
  - Pretendard Variable: `cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/...`
  - JetBrains Mono: `cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5.0.0/...`
- **Scale:**
  - hero-xl: `clamp(3rem, 7vw, 6rem)`
  - display-lg: `clamp(2.4rem, 4vw, 3.8rem)`
  - title-lg: `2rem`
  - title-md: `1.5rem`
  - body-lg: `1.125rem`
  - body: `1rem`
  - body-sm: `0.9375rem`
  - meta: `0.78rem`
- **Rules:**
  - 제목은 산세리프 기반, 강한 굵기, 타이트한 자간
  - 메타는 monospace + uppercase 조합 허용
  - 본문 line-height는 `1.72 ~ 1.8`

## Color
- **Approach:** restrained, dark-first
- **Primary dark background:** `#070B11`
- **Dark elevated surface:** `#0D141D`
- **Dark strong surface:** `#131B26`
- **Primary light background:** `#EDF2F8`
- **Light surface:** `#F8FBFF`
- **Primary text dark mode:** `#E5EDF7`
- **Primary text light mode:** `#0F1722`
- **Muted text dark mode:** `rgba(229, 237, 247, 0.72)`
- **Muted text light mode:** `rgba(15, 23, 34, 0.70)`
- **Primary accent:** `#78A8FF`
- **Accent deep:** `#B5CCFF`
- **Secondary accent:** `#63CDBD`
- **Semantic:**
  - success: `#77C1A0`
  - warning: `#D5B062`
  - error: `#D48D8A`
  - info: `#84B9EE`
- **Dark mode strategy:** 브랜드 정체성은 dark-first로 본다. 라이트 모드는 기능적 대안이다. 다크에서도 채도는 낮게 유지하고, 포인트 블루는 넓게 쓰지 않고 선, 활성 상태, 링크, 작은 강조에만 사용한다.
- **Do not use:**
  - 기본 보라/보랏빛 그라데이션
  - 과한 네온
  - 따뜻한 베이지/크림 중심 무드
  - 컬러풀한 배지 남발

## Spacing
- **Base unit:** 8px
- **Density:** comfortable
- **Scale:** `2(0.125rem) 4(0.25rem) 8(0.5rem) 12(0.75rem) 16(1rem) 20(1.25rem) 24(1.5rem) 32(2rem) 40(2.5rem) 48(3rem) 64(4rem) 80(5rem)`
- **Rules:**
  - 홈 섹션 간 간격은 최소 `56px`, 주요 섹션은 `64px~80px`
  - 카드 내부 패딩은 `20px~24px`
  - 글 본문 단락 간격은 `20px` 이상
  - 정보 밀도를 높이되 숨 막히게 압축하지 않는다

## Layout
- **Approach:** hybrid
- **Grid:**
  - mobile: 1 column
  - tablet: 1 column + 보조 메타 정렬
  - desktop home: `content + utility rail`, 단 항상 콘텐츠가 주인공
  - desktop article: `article + toc`
- **Max content width:** 본문 `760px~800px`, 전체 컨테이너 `1320px~1400px`
- **Border radius scale:**
  - sm: `6px`
  - md: `12px`
  - lg: `18px`
  - xl: `24px`
- **Rules:**
  - 기존 고정 `profile-rail` 구조는 제거하거나 최소화한다
  - 헤더는 얇은 top bar 형태로 간다
  - 홈은 hero보다 activity stream이 더 중요하다
  - 페이지 전체가 "dashboard shell"처럼 보이면 실패다

## Motion
- **Approach:** minimal-functional
- **Easing:** enter(`cubic-bezier(0.22, 1, 0.36, 1)`) / exit(`ease-in`) / move(`ease-in-out`)
- **Duration:**
  - micro: `80ms`
  - short: `160ms`
  - medium: `220ms`
  - long: `360ms`
- **Rules:**
  - hover는 1~2px 정도의 이동만 허용
  - 스크롤 등장 애니메이션은 약하게
  - cursor glow는 기본 비활성
  - `prefers-reduced-motion`을 항상 존중

## Page Blueprints

### Home
- 순서:
  1. 얇은 상단 바
  2. 짧은 소개
  3. 대표 글 1~3개
  4. 최근 활동 리스트
  5. 태그/주제 탐색
  6. 아카이브 진입
- 홈의 목표는 "무슨 사람인지"보다 "계속 기록하는 사람인지"를 보여주는 것
- 문구는 자기 PR보다 활동 메타 중심

### Article
- 상단 메타: 카테고리, 날짜, 마지막 업데이트, 읽기 시간
- 제목과 요약
- 본문
- 우측 TOC
- 하단 관련 글
- 챗봇은 글 하단 또는 읽기 흐름 뒤쪽에 배치

### Archive / Tag / Search
- 대시보드가 아니라 인덱스처럼 보이게
- 날짜, 태그, 업데이트 상태가 잘 보여야 함
- 리스트의 목적은 "많아 보이는 것"이 아니라 "계속 쌓이고 있는 것처럼 보이는 것"

## Components

### Header
- 둥근 캡슐형보다는 낮은 반지름의 각진 top bar
- 메뉴는 과하지 않게
- 검색, 테마 토글, 아카이브 진입 정도만 명확히

### Cards
- 너무 말랑한 카드 금지
- 배경 대비는 낮고, 보더와 미세한 그림자로 레이어 구분
- 대표 글 카드는 조용한 포인트 컬러를 얇게 사용

### Tags / Chips
- 완전 원형 pill보다 낮은 반지름
- monospace 메타와 함께 사용
- 색상을 너무 많이 주지 않는다

### TOC
- docs처럼 단정하게
- 활성 항목만 accent
- 모바일은 FAB 가능하지만 시각적으로 과하면 안 됨

### Chatbot
- 홈의 주인공이 아니다
- 기본 원칙은 "later, not louder"
- 위치:
  - 플로팅 위젯: 전역 유지 가능
  - 인라인 챗봇: 글 본문 하단 또는 `<!--[chatbot]-->` 위치
- 톤:
  - 처음부터 세게 드러내지 말고, 읽기 보조 기능처럼 보이게

## Tistory Implementation Guardrails
- 티스토리 2.0 문법과 치환자를 절대 깨지 않는다
- `skin.html`, `style.css`, `index.xml`, `images/` 구조 유지
- 홈은 `<s_cover_group>` + `<s_list>`를 활용
- 글은 `<s_article_rep><s_permalink_article_rep>` 기반
- 페이지는 `<s_page_rep>`
- 태그/검색/아카이브는 공식 body id와 공식 블록 중심으로 처리
- `index.xml`의 variables는 최소한으로 유지하고, 이미 공개된 이름은 함부로 바꾸지 않는다

## Content Tone Guidelines
- 문구는 "workspace", "control panel", "dashboard" 같은 제품 UI 어휘를 피한다
- 대신 `archive`, `notes`, `recent activity`, `updated`, `field notes` 같은 기록형 어휘를 쓴다
- 홈 문구는 자기소개보다 활동 흐름을 보여주는 쪽으로 쓴다

## Anti-Patterns
- 좌측 고정 프로필 레일 중심 구조
- 과하게 동글동글한 pill/button/card
- 보라 그라데이션 중심의 익숙한 AI SaaS 무드
- 과장된 자기소개 hero
- 기능을 전면에 세우는 홈
- 챗봇을 첫 화면 메인 CTA처럼 다루는 것

## Implementation Priority
1. 홈 구조를 activity-first로 재정리
2. 고정 레일 제거 또는 축소
3. 다크 우선 토큰 정리
4. radius와 component silhouette 정리
5. 글 페이지 메타 + TOC + 챗봇 위치 재정리

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-21 | dark-first archive 방향 채택 | 사용자 피드백: 더 모던하고 더 다크한 무드 선호 |
| 2026-04-21 | 큰 radius 축소 | 사용자 피드백: 동글동글한 인상을 줄이고 싶음 |
| 2026-04-21 | Pretendard 중심 타이포로 정리 | 세리프보다 더 현대적이고 또렷한 방향이 적합 |
| 2026-04-21 | 블루 포인트 컬러 채택 | 기존 따뜻한 포인트보다 더 현대적이고 차가운 인상 필요 |

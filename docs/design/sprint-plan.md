# 스프린트 계획 (Sprint Plan)

- 작성일: 2026-04-19
- 승인: 유저 2026-04-19
- 근거: [requirements/01_modern-blog-skin.md](../requirements/01_modern-blog-skin.md), [tech-decisions.md](tech-decisions.md), [tistory-skin-spec.md](tistory-skin-spec.md)

---

## 전체 로드맵

| # | 목표 | 주요 산출물 | 완료 기준 요약 |
|:--|:--|:--|:--|
| 1 | 스킨 골격 + 디자인 토큰 + 라이트/다크 | `skin.html` 골격, `index.xml`, `style.css` 토큰, `script.js` 테마 토글 | 업로드 후 페이지별 `body_id` 확인 + 테마 전환 정상 |
| 2 | 메인 목록 + 프로필 히어로 + 카테고리/태그/검색 | 홈 커버, 카드 그리드, 네비, `<s_search>`, 사이드바 | 홈·카테고리·태그·검색에서 카드 그리드 렌더 + hover lift |
| 3 | 개별 포스트 + TOC + 코드 하이라이팅 + 진행률 | permalink 2단 레이아웃, TOC JS, highlight.js 연동, 진행률 바, 관련글·이전/다음, `[##_comment_group_##]` | 실포스트 1개로 모두 동작 |
| 4 | 보조 페이지 + 마이크로 인터랙션 + 반응형 | 공지/보호글/방명록/About, 페이드인·페이지 전환·글로우, 768/1024/1280 반응형 | 모든 페이지 타입 정상 + reduced-motion 검증 |
| 5 | 챗봇 훅 + 전역 설정 API + 최종 검증 | `#chatbot-widget-root`, 마커 치환 JS, `window.__CHATBOT_CONFIG__`, 더미 스텁, reviewer/doc-writer 위임 | `<script src="chatbot.js">` 한 줄로 붙일 수 있는 상태 |

---

## Sprint 1 — 스킨 골격 + 디자인 시스템 + 라이트/다크 (상세)

### 목표
티스토리 2.0 스킨으로 동작하는 **뼈대**를 완성한다. 페이지별 `body_id` 분기가 되고, CSS 변수 기반 디자인 토큰이 전체에 적용되며, 라이트/다크 전환이 자동(prefers-color-scheme) + 수동(토글) 모두 작동한다.

### 작업 목록 (순서대로)

1. **파일 구조 생성**
   - `skin.html` (분기 껍데기, 각 페이지 블록은 placeholder 주석)
   - `index.xml` (`<information>`, `<author>`, `<default>`, `<variables>`, `<cover>`)
   - `style.css` (토큰 + 리셋 + 베이스 타이포그래피 + 전역 레이아웃 셸)
   - `images/script.js` (테마 토글 모듈만. 나머지는 stub)
   - `preview.gif` (임시 빈 이미지, Sprint 5에 실제 미리보기 교체)
2. **`index.xml` 완성**
   - `name`, `version=1.0.0`, `description`, `license`, `author`
   - `<default>` 권장값: `entriesOnPage=10`, `entriesOnList=10`, `recentEntries=5`, `recentComments=5`, `tagsInCloud=30`, `sortInCloud=3`(랜덤), `expandComment=1`, `showListOnCategory=1` (홈에서 `<s_cover_group>` + `<s_list>` 조합을 쓰므로 "목록만"), `contentWidth=720` 등
   - `<variables>` 11개 (tech-decisions.md T-3 표 참고, `variablegroup` **3개**로 분류: `Theme` — accent-start/end, `Profile` — profile-* 6개, `Features` — cursor-glow / show-reading-progress / chatbot-endpoint)
   - `<cover>` 2개: `featured` (CUSTOM), `list` (RECENT) — `<default><cover>` JSON 기본값 포함
3. **`skin.html` 골격**
   - `<!DOCTYPE html>`, `lang="ko"`, `data-theme="light"`
   - `<head>`: meta charset/viewport, og 메타, RSS `<link rel="alternate">`, 폰트 CDN `<link>`, highlight.js 라이트 테마 `<link id="hljs-theme">`, `style.css` `<link>`
   - `<body id="[##_body_id_##]">` 안에 `<s_t3>` 래핑
   - 헤더(로고 + 네비 + 검색 + 테마 토글 버튼) 전체 블록
   - main 영역의 각 페이지 블록은 placeholder 주석으로 자리만 (`<!-- TODO: Sprint 2 - cover group -->`)
   - `<s_sidebar>` + `<s_sidebar_element>` placeholder
   - 푸터 (RSS 링크)
   - `<div id="chatbot-widget-root"></div>` (Sprint 5 훅, 지금은 빈 div)
   - `<script src="./images/script.js" defer>` (highlight.js **JS 스크립트**는 Sprint 3에서 추가. Sprint 1에는 **라이트 테마 CSS `<link id="hljs-theme">`** 만 `<head>` 에 포함)
4. **`style.css` 토큰 시스템**
   - `:root` 라이트 토큰: 컬러(bg/surface/text/border/link), 타이포(font family/size scale/line-height/weight), 스페이싱, 라디우스, 섀도우, 모션 (skin-architecture.md §4 참고)
   - `[data-theme="dark"]` 다크 토큰 오버라이드
   - 리셋 (box-sizing, margin/padding 0)
   - 베이스 타이포그래피: `body`, `h1-h6`, `p`, `a`, `code`, `pre`, `blockquote`
   - 전역 레이아웃 셸: `.site-header`, `.site-main`, `.site-footer`, `.container`
   - `@media (prefers-reduced-motion: reduce)` 전역: transition/animation 1ms
5. **`images/script.js` 테마 토글 모듈**
   - IIFE 래퍼
   - `theme.init()` — localStorage 우선, 없으면 `prefers-color-scheme`, `data-theme` 속성 적용, 토글 버튼 이벤트, system 변경 감지
   - `theme.apply(mode)` — `data-theme` 세팅 + `hljs-theme` href 스왑 + `themechange` CustomEvent 발행
   - 이후 모듈은 stub (`/* Sprint 3 */`)
6. **스모크 업로드 체크리스트 작성 (유저 수행용)**
   - 별도 파일 `docs/design/sprint1-smoke-checklist.md`
   - **10개 "확인 필요" 항목 전체를 스프린트별로 배분 기재** (skin-architecture.md §8.1 표 참고)
   - Sprint 1에서 직접 검증: 파일 업로드 용량, 외부 CDN 허용(jsdelivr), 모바일 자동 변환 옵션 OFF, `<s_t3>` 빈 div 위치, `<variables>` 11개 관리자 UI 노출, body_id 페이지별 값, 라이트/다크 전환
   - 이후 스프린트 담당 항목도 문서에 명시하되, 체크 수행은 해당 스프린트에서

### 산출물
- `/home/yhkim/yh_tistoryskin/skin.html`
- `/home/yhkim/yh_tistoryskin/index.xml`
- `/home/yhkim/yh_tistoryskin/style.css`
- `/home/yhkim/yh_tistoryskin/images/script.js`
- `/home/yhkim/yh_tistoryskin/preview.gif` (임시)
- `docs/design/sprint1-smoke-checklist.md`

### 완료 기준
- [ ] 티스토리 관리자 업로드 성공, 에러 없음
- [ ] 홈·개별글·카테고리·태그·검색·방명록·공지 페이지 접근 시 최소한 헤더/푸터 렌더
- [ ] `[##_body_id_##]` 가 페이지 타입에 따라 `tt-body-index`, `tt-body-page`, `tt-body-category`, `tt-body-tag`, `tt-body-search`, `tt-body-guestbook` 등으로 변경됨을 DOM 검사로 확인
- [ ] 라이트/다크 토글 버튼 클릭 시 테마 전환 + localStorage 저장 + 새로고침 후 유지
- [ ] `prefers-color-scheme: dark` OS 설정 시 자동 다크 (localStorage 없을 때)
- [ ] CSS 변수 기반 컬러가 헤더/푸터/본문에 일관 적용
- [ ] Pretendard / JetBrains Mono / highlight.js **라이트 테마 CSS** (`github.min.css`) CDN 로드 성공 (Network 탭). highlight.js JS 스크립트는 Sprint 3에서 추가
- [ ] `<s_t3>` 정상 렌더 (댓글 React 앱이 주입되지만 스타일링은 Sprint 3에서)
- [ ] `index.xml` `<variables>` 11개가 티스토리 관리자 편집 UI에 노출됨

### 리스크 (Sprint 1 범위)

| # | 리스크 | 대응 |
|:--|:--|:--|
| R-1 | 외부 CDN 허용 범위 확인 필요 | 스모크 실패 시 `images/` 내재화 |
| R-5 | jsdelivr 로드 실패 | 대체 CDN (Google Fonts 등) 또는 내재화 |

---

## Sprint 2 — 메인 목록 + 프로필 + 카테고리/태그/검색

### 목표
홈·카테고리·태그·검색 페이지에서 카드 그리드가 일관되게 렌더되고, 상단 헤더 네비와 프로필 히어로가 완성된다.

### 작업 목록 (요약, Sprint 1 종료 시 상세화)
0. **선행 확인 (구현 전)**: Ray 테마 `skin.html` (출처 27)에서 `<s_cover_group>` 실제 사용 패턴 재확인 (U-1). `<s_cover_rep>` 의 정확한 역할 및 이름이 다른 `<s_cover>` 복수 배치 방식 확정
1. 홈 커버 `<s_cover_group>` — `featured` + `list` 2개 (U-1 결과 반영)
2. 카드 그리드 `<s_list>` + `<s_list_rep>` — 썸네일(Daum CDN 리사이즈) + 제목 + 요약 + 태그 + 날짜
3. 프로필 히어로 (홈 전용, `body#tt-body-index` CSS + `<s_if_var_profile-name>` 조건부)
4. 헤더 네비 — 로고, `[##_category_list_##]`, `<s_search>` 폼 (input + submit 버튼 둘 다 `[##_search_onclick_submit_##]` 연결)
5. 사이드바 — `<s_random_tags>`, `<s_rctps_rep>`
6. 페이지네이션 `<s_paging>` (`<a [##_paging_rep_link_##]>` 속성 블록 주의)
7. 카드 hover lift + soft shadow
8. 태그 클라우드 페이지 `<s_tag>` + `<s_tag_rep>` (`[##_tag_class_##]` 크기 차등)
9. **U-2 검증**: `/tag` (클라우드) 와 `/tag/X` (목록) 모두 `tt-body-tag` 사용. DOM 검사 후 필요 시 JS로 `location.pathname` 기반 분기 (`.is-tag-cloud` / `.is-tag-list` 클래스)

### 완료 기준
- 홈 커버·카드 그리드·검색 결과·카테고리·태그 페이지 모두 카드 그리드로 렌더
- 프로필 히어로가 `profile-name` 비어 있을 때 숨김
- 페이지네이션 정상 동작
- 카드 hover 효과 확인

---

## Sprint 3 — 개별 포스트 + TOC + 코드 하이라이팅 + 진행률 바

### 목표
permalink 페이지에서 2단 레이아웃, TOC, 코드 하이라이팅, 진행률 바, 관련글·이전/다음, 댓글이 모두 동작한다.

### 작업 목록 (요약)
1. `<s_article_rep>` + `<s_permalink_article_rep>` — 메타 헤더(제목·날짜·카테고리·예상 읽기시간 JS 계산) + 본문 `[##_article_rep_desc_##]`
2. 2단 레이아웃 — 본문 max 720px + 우측 sticky TOC
3. TOC JS — 본문 h2/h3 스캔, id 할당, IntersectionObserver active, 모바일 하단 버튼 접힘
4. highlight.js 로드 + `hljs.highlightAll()` + 테마 CSS 스왑
5. 읽기 진행률 바 (`<s_if_var_show-reading-progress>`)
6. `<s_tag_label>` 태그 라벨 + `<s_article_prev>/<s_article_next>` + `<s_article_related>`
7. `[##_comment_group_##]` 댓글 영역 외곽 스타일링

### 완료 기준
- 실포스트 1개로 본문·TOC·코드블록·진행률·댓글·관련글·이전/다음 모두 확인
- 테마 전환 시 코드 테마 동기화
- 모바일 TOC 하단 버튼 접힘

---

## Sprint 4 — 보조 페이지 + 마이크로 인터랙션 + 반응형 마감

### 목표
모든 페이지 타입을 커버하고, 마이크로 인터랙션을 입히며, 반응형을 최종 점검한다.

### 작업 목록 (요약)
1. `<s_notice_rep>` 공지사항 (permalink + index 분기)
2. `<s_article_protected>` 보호글 비밀번호 폼
3. `[##_guestbook_group_##]` 방명록
4. About 섹션 — **티스토리 페이지 기능** (`<s_page_rep>`) 사용. `<s_cover name="about">` 방식은 `index.xml <cover>` 수정이 필요하고 **사용자 설정 초기화 위험** 있어 지양 (Gotcha #8). 유저가 티스토리 관리자에서 About 페이지 생성 후 해당 URL의 `<s_page_rep>` 내부 치환자로 렌더
5. 스크롤 페이드인 + 슬라이드업 (IntersectionObserver + reduced-motion)
6. 페이지 전환 페이드 (CSS overlay)
7. 제목 gradient 텍스트
8. 다크모드 커서 소프트 글로우 (`<s_if_var_cursor-glow>`)
9. `prefers-reduced-motion` 전역 검증
10. 반응형 브레이크포인트 확정 (767/1023/1279)

### 완료 기준
- 공지/보호글/방명록/About 모두 렌더
- 애니메이션 4종 동작 + reduced-motion 시 즉시
- 4개 브레이크포인트 레이아웃 검증

---

## Sprint 5 — 챗봇 훅 + 전역 설정 API + 최종 검증

### 목표
챗봇 embed 스니펫(`<script src="chatbot.js">` 한 줄)만으로 위젯/본문 마커에 렌더될 수 있도록 스킨 측 준비를 마친다.

### 작업 목록 (요약)
1. `#chatbot-widget-root` CSS (z-index, 위치)
2. 본문 마커 치환 JS — `<!--[chatbot]-->` 탐지 → `.chatbot-inline-slot` 삽입
3. `window.__CHATBOT_CONFIG__` 초기화 + `themechange` 이벤트 연동
4. 더미 스텁 UI (`images/chatbot-stub.js`, `endpoint` 미설정 시 placeholder)
5. API 계약 문서 `docs/design/chatbot-integration.md`
6. 검증: reviewer 전체 코드 리뷰, doc-writer README 작성

### 완료 기준
- `<script src="chatbot.js">` 한 줄 추가만으로 두 지점에 마운트 가능한 상태
- reviewer 치명적 이슈 0
- README 완성

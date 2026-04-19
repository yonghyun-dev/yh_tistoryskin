# PM-03: Sprint 2-5 통합 구현

- 스프린트: 2 → 3 → 4 → 5
- 날짜: 2026-04-19

## 작업 로그

| 시점 | 행동 | 내용 |
|:--|:--|:--|
| 2026-04-19 | [유저 지시] | "sprint 5까지 한 번에 진행" — 중간 검증 생략, Sprint 2-5 일괄 구현 |
| 2026-04-19 | [PM 판단] | 각 스프린트의 reviewer/test-writer 병렬 위임을 생략하고 Sprint 5 말에 통합 리뷰 + doc-writer 위임으로 압축 |
| 2026-04-19 | [PM 직접] | **Sprint 2 구현**: skin.html `<s_cover_rep>` 래핑 + 카드 그리드 + 프로필 히어로 정식 + 헤더 네비/검색 다듬기 + 태그 클라우드 + 페이지네이션 |
| 2026-04-19 | [PM 직접] | **Sprint 3 구현**: skin.html permalink 포스트 2단 (`post__layout`) + 메타 헤더 + 태그 라벨 + 관련글 + 이전/다음 + 댓글. style.css 4.7~4.8 포스트 컴포넌트. script.js `progress`/`toc`/`readingTime`/`codeBlocks` 모듈 실 구현. highlight.js 스크립트 skin.html 추가 |
| 2026-04-19 | [PM 직접] | **Sprint 4 구현**: skin.html `<s_notice_rep>` (index + permalink) + `<s_article_protected>` 비밀번호 폼. style.css 4.9 공지/보호글/방명록 + 섹션 5 마이크로 인터랙션(fadeIn, pageTransition, cursor-glow). script.js `pageTransition`/`fadeIn`/`glow` 모듈. 반응형 767/1023/1279 브레이크포인트 확정 |
| 2026-04-19 | [PM 직접] | **Sprint 5 구현**: script.js `chatbot` 모듈 실 구현 (config 초기화 + `<!--[chatbot]-->` 코멘트 노드 치환 + themechange 이벤트). `images/chatbot-stub.js` 옵션 더미. `docs/design/chatbot-integration.md` API 계약 문서 |
| 2026-04-19 | [위임→reviewer] | Sprint 2-5 통합 코드 리뷰 (background) |
| 2026-04-19 | [위임→doc-writer] | README.md 작성 (background) |

## 구현 세부 사항

### Sprint 2 — 메인 목록 + 프로필 + 네비 + 검색 + 사이드바

**작업 0 (Ray 테마 재확인, U-1)**: Ray 테마는 2015 세대라 `<s_cover_group>` 치환자 자체가 없음. 공식 가이드 `common/cover.html` canonical 예제 기반으로 `<s_cover_group> → <s_cover_rep> → <s_cover name="...">` 래핑이 필수임을 확정.

**작업 1-8 주요 산출**:
- 커버: `<s_cover_rep>` 추가. `featured` (1-2 열 큰 카드) + `list` (가로 썸네일 리스트)
- 카드 그리드: `<s_list>` + `<s_list_rep>`. `[##_list_rep_thumbnail_url_##]` (명시적 URL 치환자), `[##_list_rep_title_text_##]` (순수 텍스트) 사용
- 프로필 히어로: `body#tt-body-index` 에만 CSS 표시, 이름은 gradient 텍스트 (accent-start → accent-end), 소셜 링크는 icon + 라벨 pill 버튼
- 헤더: `site-header__tools` 그룹으로 검색 + 테마 토글 묶음. 카테고리 네비는 가로 scrollbar-hidden 방식
- 태그 클라우드: `.cloud1` ~ `.cloud5` 크기 차등 (가장 많이 쓰인 태그가 가장 큼)
- 페이지네이션: `<a [##_prev_page_##]>` href 속성 블록 형태 (Gotcha #4 준수)
- 사이드바: `.site-main` 2단 Grid (데스크톱 1024+). 포스트 페이지에서는 CSS 로 숨김 (TOC 가 대체)

### Sprint 3 — 개별 포스트 + TOC + 코드 하이라이팅 + 진행률 바

**skin.html**:
- `<s_permalink_article_rep>` 내부: 카테고리 + 제목 + 메타(작성일·예상읽기시간)
- `.post__layout` Grid 2단 (본문 + TOC, 1024+ 에서만 2단)
- `<s_tag_label>` + `<s_article_related>` (+ `<s_article_related_rep_thumbnail>` 조건부) + `<s_article_prev>` / `<s_article_next>` + `[##_comment_group_##]`
- 모바일 TOC FAB (`.toc-fab`) — 데스크톱에선 CSS 로 숨김
- highlight.js `<script>` 추가

**script.js**:
- `progress`: `scroll` 이벤트 + `requestAnimationFrame` 스로틀링. `#tt-body-page` 에서만 동작
- `toc`: `[data-post-body]` 내부 h2/h3 스캔, 한글 지원 id 자동 생성 (중복 suffix), IntersectionObserver `rootMargin: -20%/-70%` 로 active, 모바일 FAB 토글
- `readingTime`: 한국어 분당 450자 추정으로 `N분 읽기`
- `codeBlocks`: `window.hljs` 로드 대기 후 `highlightElement`

### Sprint 4 — 공지/보호글/방명록 + 마이크로 인터랙션 + 반응형 마감

- `<s_notice_rep>`: index 분기는 accent-soft 배경 배너 (`.notice-index`), permalink 는 일반 post 템플릿 재사용
- `<s_article_protected>`: 중앙 정렬 카드에 password input + gradient submit 버튼
- 방명록: `[##_guestbook_group_##]` 한 줄 (외곽 `.guestbook` 컨테이너만 스타일링, React 앱 내부는 기본 유지)
- 페이지 전환 페이드: `body` 기본 opacity 0 → `is-loaded` 클래스로 1. `pageTransition.init()` 에서 rAF 뒤 적용
- 스크롤 페이드인: `[data-fade-in]` 속성으로 마킹된 요소 (card, cover-card, cover-item, profile-hero, sibling, related-item, notice-index). IntersectionObserver 로 `.is-inview` 토글
- 커서 소프트 글로우: 다크 모드 + `cursor-glow=true` variable 에서만. `pointermove` + rAF 로 `.cursor-glow` div translate3d
- 반응형: 767 / 768 / 1024 / 1280. card-grid 는 1/2/3 열, post__layout 은 1024+ 에서 2단

### Sprint 5 — 챗봇 훅 + 전역 설정 API + 더미 스텁 + 통합 검증

**공개 API 확정**:
- DOM: `#chatbot-widget-root` (상시), `.chatbot-inline-slot[data-chatbot-inline="true"]` (본문 마커 치환 결과)
- 전역: `window.__CHATBOT_CONFIG__ = { endpoint, theme, mount }`
- 이벤트: `window` 에 `themechange` CustomEvent (`detail.mode`)

**script.js chatbot 모듈**:
- `data-chatbot-endpoint` data attribute 에서 endpoint 읽음 (HTML attribute 자동 이스케이프로 XSS 회피)
- `TreeWalker SHOW_COMMENT` 로 본문 `<!--[chatbot]-->` 코멘트 노드 탐지 → `.chatbot-inline-slot` div 로 `replaceChild`
- `themechange` 리스너로 `__CHATBOT_CONFIG__.theme` stale 방지

**`images/chatbot-stub.js`** (옵션): `endpoint` 가 비어 있을 때만 "💬 챗봇 연결 대기 중" placeholder 표시. `skin.html` 에 주석으로 처리해둠 (`<!-- <script src="./images/chatbot-stub.js" defer></script> -->`)

**`docs/design/chatbot-integration.md`**: 외부 챗봇 스크립트 제작자를 위한 API 계약, 스타일 가이드, 설치 절차, 제약 사항 문서

## 판단 기록

### P-8. Sprint 2-5 일괄 진행 시 중간 reviewer 생략

- **결정**: 각 스프린트 말마다 reviewer/test-writer 병렬 위임 대신 Sprint 5 말에 **통합 리뷰** 1회 + doc-writer (README) 로 압축
- **이유**: 유저 지시 "한 번에 진행" + 스프린트 간 의존성이 누적 (Sprint 3 포스트는 Sprint 2 레이아웃 위에, Sprint 4 마이크로 인터랙션은 Sprint 2-3 컴포넌트 위에). 중간 리뷰가 어차피 뒤집힐 가능성
- **대안**: 각 스프린트 reviewer 병렬
- **대안 미선택 이유**: 4번의 agent 호출 + 4번의 피드백 반영 루프는 과함. 최종 상태를 한 번에 검토하는 게 효율적

### P-9. test-writer 위임 생략

- **결정**: 이 프로젝트는 test-writer 위임하지 않음
- **이유**: 티스토리 스킨은 서버사이드 치환 + React 앱 주입 환경에서만 동작. 단위 테스트가 의미 있는 독립 모듈이 거의 없음 (JS 모듈 대부분이 DOM/치환 환경 의존). 실 검증은 티스토리 업로드 스모크로 커버
- **대안**: JSDOM 으로 script.js 모듈 테스트
- **대안 미선택 이유**: 치환자가 빠진 HTML 은 실환경과 달라 테스트 가치 낮음. ROI 부적절

### P-10. highlight.js 스크립트 `<s_t3>` 내부 배치 (U-3 확인 사항 해결 미뤄둠)

- **결정**: highlight.js `<script>` 를 `<s_t3>` 내부에 두었으나 확인 필요 U-3 (외부 CDN `<script>` 가 `<s_t3>` 내부에 허용되는지) 는 실환경 확인 전
- **대안**: `<s_t3>` 외부, `</body>` 직전에 배치
- **대안 미선택 이유**: `<s_t3>` 외부 배치 시 `common.js` 로드 전에 highlight.js 가 먼저 로드되어 DOM 준비 시점 이슈 가능. 최종 스모크에서 확인

### P-11. 카드 그리드 썸네일 URL 치환자 선택 — `_url_` 명시 버전

- **결정**: `<img src="[##_list_rep_thumbnail_url_##]" />` 사용 (spec 에 명시된 "원본 주소")
- **이유**: `[##_list_rep_thumbnail_##]` 는 공식 문서가 "대표 이미지"로만 적고 HTML 여부 명시 없음. `_url_` 버전이 명시적 URL 이므로 `<img src>` 에 직접 넣어도 안전
- **대안**: `[##_list_rep_thumbnail_##]` 사용
- **대안 미선택 이유**: 이 치환자가 자체 HTML 일 경우 `<img>` 중첩으로 깨짐. 안전 우선
- **주의**: cover 쪽은 대응 `_url_` 치환자가 문서화되지 않아 `<img src="[##_cover_item_thumbnail_##]" />` 시도 (스모크에서 확인 필요 N-5)

## 확인 필요 항목 (최종 스모크에서 해소)

| # | 항목 | Sprint |
|:--|:--|:--|
| U-3 | `<s_t3>` 내부 highlight.js `<script>` 로드 성공 여부 | 3 |
| U-2 | `/tag` vs `/tag/X` 에서 `<s_tag>` / `<s_list>` 동시 렌더 여부 + JS 분기 동작 | 2 |
| N-1 | COLOR 변수 CSS 인젝션 방어 범위 | 1 |
| N-2 | STRING 변수 HTML/href 이스케이프 여부 | 1 |
| N-3 | `<variablegroup name="...">` 속성 방식이 관리자 UI 에 그룹으로 표시 | 1 |
| N-5 | `[##_cover_item_thumbnail_##]` 치환이 URL vs HTML 인지 | 2 |
| N-6 | `[##_tag_label_rep_##]` 치환이 `.post__tags` 외곽 스타일과 맞물리는지 | 3 |
| N-7 | `[##_comment_group_##]` React 앱의 CSS 변수 사용 여부 (테마 동기화) | 3 |

## 현재 상태

- [x] Sprint 2-5 코드 작성 완료
- [x] chatbot-integration.md 작성
- [ ] reviewer 통합 리뷰 (background)
- [ ] doc-writer README (background)
- [ ] 최종 스모크 체크리스트 작성
- [ ] 유저 최종 업로드 검증
- [ ] 프로젝트 완료 선언

# PM-01: Sprint 1 분석 — 티스토리 모던 개발 블로그 스킨

- 스프린트: 1
- 날짜: 2026-04-19

## 작업 로그

| 시점 | 행동 | 내용 |
|:--|:--|:--|
| 2026-04-19 | [분석 시작] | 유저 `/pm` 실행. 요청: 티스토리 모던 개발 블로그 스킨 (Stripe/Apple/Vercel docs 무드). 유저가 상세 스펙 제공 |
| 2026-04-19 | [판단] | 요구사항이 매우 구체적 → 추가 명확화 질문 생략. 프로필 기본값은 index.xml 변수로 빼서 placeholder만 둠 |
| 2026-04-19 | [PM 직접] | 요구사항 구조화 → `docs/requirements/01_modern-blog-skin.md` 작성 (기능 30개 분류) |
| 2026-04-19 | [판단] | researcher agent는 코드 조사(Read/Grep/Glob) 전용 → 외부 공식 문서 리서치는 `general-purpose` agent로 위임 |
| 2026-04-19 | [위임→general-purpose] | 티스토리 2.0 스킨 공식 규격 조사 — skin.html 구조, 치환자, 조건부 블록, index.xml 변수/커버, 페이지 분기, RSS, 관련글/이전-다음, 모바일 처리 |
| 2026-04-19 | [완료←general-purpose] | 공식 GitBook 28페이지 + Ray 테마 소스 직접 확인. `docs/design/tistory-skin-spec.md` (1,149줄) 저장. 파생 블로그 근거 사용 없음. 확인 필요 10개 항목은 별도 표기 |
| 2026-04-19 | [분석→설계] | 규격 확정 → 스프린트 구성 + 기술 결정 유저 제안 단계로 진입 |

## 판단 기록

### P-1. 외부 공식 문서 리서치는 general-purpose agent로

- **결정**: 티스토리 스킨 공식 규격 조사는 `general-purpose` agent에 위임한다
- **이유**: `researcher` agent는 Read/Grep/Glob만 보유 → WebSearch/WebFetch 불가. 코드베이스 내부 조사 전용임. 외부 공식 문서(티스토리 가이드 페이지, 개발자 블로그)를 조사하려면 웹 접근 도구가 필수
- **대안**: (1) PM이 직접 WebSearch/WebFetch (2) researcher에게 강제로 위임
- **대안 미선택 이유**: (1)은 컨텍스트 소비가 큼. (2)는 도구가 없어 물리적으로 불가능
- **유저 원 지시와의 차이**: 유저는 "researcher agent"라고 명명했으나, CLAUDE.md 정의상 researcher는 "코드 조사" 전용. "외부 문서 리서치"는 범위 밖. 실용적 판단으로 대체 — 유저에게 명시 보고 예정

### P-2. 유저 제안 스프린트(1~5)는 참고만, 최종 확정은 설계 단계

- **결정**: 유저가 제안한 5단계 스프린트 분해는 합리적이나, researcher 조사 결과 반영 후 PM 최종 확정
- **이유**: 티스토리 단일 `skin.html` 제약, 조건부 블록 중첩 규칙 등이 스프린트 경계에 영향을 줄 수 있음. 추측 금지
- **대안**: 유저 제안을 그대로 수용
- **대안 미선택 이유**: 규격 조사 전 확정은 "추측 금지" 원칙 위배

### P-3. 프로필/About 기본값은 placeholder + index.xml 변수

- **결정**: 블로그 주인 프로필(이름·소개·소셜 링크)은 스킨 자체에 **placeholder**만 두고 `index.xml` 변수로 노출 → 티스토리 관리자 UI에서 유저가 직접 편집
- **이유**: 유저 개인정보 질문을 줄이고, 재배포 시에도 범용적으로 쓸 수 있음. 티스토리 스킨의 관용 패턴
- **대안**: 유저에게 프로필 정보를 물어서 하드코딩
- **대안 미선택 이유**: 재사용성·유연성 저하. 유저 당부("중요 판단만 질문")와 어긋남

## 유저에게 확인할 것 (설계 단계 진입 시 일괄)

1. researcher 조사 결과 요약 및 스프린트 최종 구성안 승인
2. 프로필/About 정보를 index.xml 변수 방식으로 가는 것 승인
3. 코드 하이라이터 선택(초안: **highlight.js** — 라이트/다크 테마 기본 제공, 자동 감지, 번들 가벼움) — 다른 선호 있는지

## researcher 결과 핵심 요약 (설계 반영 포인트)

1. **단일 `skin.html` + `[##_body_id_##]` + 조건부 블록**으로 모든 페이지 분기. 모바일도 반응형 CSS로 통합
2. **`<s_t3>` 필수** — `<body>` 안 최상위에 감싸야 댓글/관리 기능 작동
3. **댓글/방명록은 현행 `[##_comment_group_##]` / `[##_guestbook_group_##]` 권장** (React 앱 자동 렌더, 레거시 `<s_rp>`보다 유지보수 쉬움)
4. **`<s_list>` + `<s_list_rep>` 는 홈·카테고리·태그·검색 결과에 전부 재사용** → 카드 그리드 하나로 커버
5. **`[##_article_rep_summary_##]` 는 `<s_index_article_rep>` 전용**, permalink에서는 `[##_article_rep_desc_##]` 사용
6. **페이징 치환자는 `href="…"` 속성 블록**으로 치환됨 — `<a [##_prev_page_##]>` 형태로 써야 함
7. **`<variables>` 5타입** (STRING/SELECT/IMAGE/BOOL/COLOR) 지원 → 프로필·액센트 컬러·기능 토글 모두 노출 가능
8. **`index.xml` 수정 시 스킨 설정 초기화** 공식 경고 → variables 스키마를 초기에 제대로 잡아야 함
9. **Daum CDN 이미지 리사이즈** (`//i1.daumcdn.net/thumb/C{W}x{H}/?fname=…`)가 공식 Ray 테마 패턴
10. **확인 필요 10개 항목**은 실제 티스토리 관리자에 업로드해야 검증 가능 → Sprint 1 중반 스모크 테스트로 흡수

## 제안 스프린트 구성 (유저 승인 필요)

| Sprint | 목표 | 주요 산출물 | 완료 기준 |
|:--|:--|:--|:--|
| 1 | 기반 — 스킨 골격 + 디자인 시스템 | `skin.html` 골격, `index.xml` 메타/variables/cover 선언, `style.css` CSS 변수 토큰, 라이트/다크 토글 JS | 티스토리 업로드 후 라이트/다크 전환 정상, 페이지 타입별 body_id 확인 |
| 2 | 메인 목록 + 프로필 + 카테고리/태그/검색 | 홈 커버, 카드 그리드 `<s_list>`, 프로필 히어로, 헤더 네비, `<s_search>`, 태그 사이드바 | 홈·카테고리·태그·검색 결과에서 카드 그리드 렌더 + hover lift |
| 3 | 개별 포스트 + TOC + 코드 하이라이팅 + 진행률 바 | `<s_permalink_article_rep>` 본문, 2단 레이아웃, TOC JS, highlight.js, 진행률 바, 관련글/이전-다음, `[##_comment_group_##]` | 실포스트 1개로 본문·TOC·코드블록·진행률·댓글 동작 |
| 4 | 보조 페이지 + 마이크로 인터랙션 + 반응형 마감 | 공지(`<s_notice_rep>`), 보호글(`<s_article_protected>`), 방명록(`[##_guestbook_group_##]`), About 커버, 스크롤 페이드인, 페이지 전환 페이드, `prefers-reduced-motion` 전역 검증, 768/1024/1280 반응형 | 모든 페이지 타입 정상 + 애니메이션 + reduced-motion 확인 |
| 5 | 챗봇 훅 + 전역 설정 API + 최종 검증 | `#chatbot-widget-root` 마운트 지점, `<!--[chatbot]-->` 마커 치환 JS 훅, `window.__CHATBOT_CONFIG__`, 더미 스텁 UI, reviewer/doc-writer 위임 | `<script src="chatbot.js">` 한 줄로 두 지점에 붙을 수 있는 상태, 전체 리뷰 통과 |

## 주요 기술 결정 (설계 확정 전 유저 확인)

### T-1. 코드 하이라이터 = highlight.js
- **이유**: 자동 언어 감지, 라이트/다크 CSS 테마 공식 제공, 런타임 경량(80KB 수준), CDN 사용 용이
- **대안**: Prism.js (프리프로세서 전제 강함), Shiki (SSR 전제, 티스토리 스킨 부적합)

### T-2. 댓글/방명록 = 현행 치환자 (`[##_comment_group_##]`, `[##_guestbook_group_##]`)
- **이유**: React 앱 자동 주입, 티스토리가 기능 업데이트를 흡수 → 유지보수 비용 최소
- **대안**: 레거시 `<s_rp>` / `<s_guest>` 수동 마크업 (세밀한 스타일링 가능하지만 유지보수 부담)
- **주의**: 댓글 영역 내부 CSS 훅이 공식 문서화되지 않음 → 스타일링은 외곽(컨테이너, 헤더)만 커스터마이즈

### T-3. 프로필/액센트/기능 토글 = `<variables>` 로 노출
- **이유**: 사용자가 티스토리 관리자 UI에서 편집 가능, 스킨 재배포성 확보
- **초기 variables 목록 (안)**:
  - `accent-start` (COLOR, #5B5BF5)
  - `accent-end` (COLOR, #8B5CF6)
  - `profile-image` (IMAGE)
  - `profile-name` (STRING)
  - `profile-tagline` (STRING)
  - `profile-link-github` (STRING)
  - `profile-link-linkedin` (STRING)
  - `profile-link-email` (STRING)
  - `cursor-glow` (BOOL, default false)
  - `show-reading-progress` (BOOL, default true)
  - `chatbot-endpoint` (STRING) — 챗봇 연결 시 사용
- **주의**: index.xml 수정 시 설정 초기화 → 초기에 variables 스키마 확정

### T-4. CSS 아키텍처 = 단일 `style.css` + 토큰 주석 구획
- **이유**: 티스토리 스킨 에디터에서 편집 용이, 외부 CSS 파일(`images/*.css`) 분리보다 디버깅 단순
- **대안**: `images/tokens.css` 별도 분리 — 파일이 5개 미만이면 과한 분리

### T-5. JS = vanilla ES6+, jQuery 제거
- **이유**: Ray 테마는 jQuery를 IE 호환 때문에 쓰지만, 현대 스킨이면 불필요. IntersectionObserver/localStorage/matchMedia가 네이티브로 충분
- **대안**: jQuery 유지 (레거시 부담)

### T-6. 뷰포트 메타 = 줌 허용
- **이유**: 접근성(시각 약한 독자가 확대 필요). Ray 테마의 `user-scalable=no`는 지양
- 최종: `<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">`

## 리스크

| # | 리스크 | 대응 |
|:--|:--|:--|
| R-1 | 확인 필요 10개 항목 (CDN 허용·카테고리 DOM·모바일 변환 옵션·댓글 React CSS 훅 등) | Sprint 1 말에 티스토리 테스트 블로그 업로드로 스모크 검증 |
| R-2 | 댓글 React 앱 내부 스타일링 제약 | Sprint 3에서 실제 렌더 확인 후 외곽 스타일만 적용, 내부는 기본 유지 |
| R-3 | `index.xml` 수정 시 사용자 설정 초기화 | Sprint 1에서 variables 스키마를 완결 형태로 확정, 이후 신규 추가만 |
| R-4 | Ray 테마에만 있는 `[##_calendar_##]` 등 deprecate 가능성 | 공식 문서화된 치환자만 사용, 달력/아카이브 기능은 이번 범위 제외 |
| R-5 | 외부 CDN(jsdelivr 등) 로드 실패 가능성 | Sprint 1 스모크에서 테스트 후 실패하면 `images/`로 내재화 |

## 현재 상태

- [x] 유저 요청 수령 및 구조화
- [x] 요구사항 문서 생성
- [x] researcher 조사 결과 수령 (`docs/design/tistory-skin-spec.md`)
- [x] 스프린트 구성 · 기술 결정 초안 작성
- [ ] **유저 승인 대기** (스프린트 구성 + T-1~T-6 + variables 목록)
- [ ] 승인 후 설계 문서 확정 → 구현 착수

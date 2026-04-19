# Sprint 1 스모크 체크리스트

- 작성일: 2026-04-19
- 실행 주체: 유저 (티스토리 관리자 업로드 담당)
- 목적: Sprint 1 완료 기준 검증 + "확인 필요" 항목 중 Sprint 1 범위 해소

---

## 업로드 전 준비

1. 4개 코드 파일 확인
   - `/home/yhkim/yh_tistoryskin/skin.html`
   - `/home/yhkim/yh_tistoryskin/index.xml`
   - `/home/yhkim/yh_tistoryskin/style.css`
   - `/home/yhkim/yh_tistoryskin/images/script.js`
2. `preview.gif` 는 아직 없음 — 티스토리가 기본 이미지를 쓰거나 업로드 실패 시 Sprint 5에서 추가

업로드 방법:
- 티스토리 관리자 > 꾸미기 > 스킨 편집 > **HTML/CSS** 탭에서 파일 업로드
- 또는 `스킨 등록` 메뉴에서 4개 파일을 zip 으로 묶어 업로드

---

## 1. 직접 검증 항목

### 1.1 업로드 및 기본 로드

- [ ] 4개 파일 업로드 성공 (에디터 경고/에러 없음)
- [ ] 개별 파일 업로드 용량 상한이 있는지 관찰 (확인 필요 #1) → PM에게 보고
- [ ] 업로드 후 `/` (홈) 접근 시 500 에러 등 없음

### 1.2 페이지 분기 (`[##_body_id_##]`)

브라우저 DevTools > Elements 탭 > `<body id="...">` 값 확인.

| URL | 기대 body_id |
|:--|:--|
| `/` | `tt-body-index` |
| `/1` 또는 `/entry/제목` (포스트 permalink) | `tt-body-page` |
| `/category/{카테고리명}` | `tt-body-category` |
| `/tag` | `tt-body-tag` |
| `/tag/{태그명}` | `tt-body-tag` |
| `/search/{검색어}` | `tt-body-search` |
| `/guestbook` | `tt-body-guestbook` |

모두 기대 값과 일치하면 페이지 분기 OK.

### 1.3 라이트/다크 테마

- [ ] OS 설정 **다크**일 때 처음 방문 → 자동 다크 (`<html data-theme="dark">`)
- [ ] OS 설정 **라이트**일 때 처음 방문 → 자동 라이트
- [ ] 헤더 우측 **테마 토글 버튼** 클릭 → 즉시 전환
- [ ] 새로고침 후에도 수동 선택 유지 (`localStorage.getItem("theme")` 값 확인)
- [ ] `prefers-reduced-motion` 활성 OS 에서는 전환이 거의 순간적

### 1.4 외부 CDN 로드 (확인 필요 #2)

DevTools > Network 탭, All 필터, 페이지 새로고침.

- [ ] `cdn.jsdelivr.net/gh/orioncactus/pretendard@...` — 200 OK
- [ ] `cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@...` — 200 OK
- [ ] `cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/styles/github.min.css` — 200 OK
- 다크 전환 후 `github-dark.min.css` 로 href 스왑 되는 것도 관찰 (Network 재요청)

**실패 시**: PM에게 보고 → `images/` 내재화로 전환 (리스크 R-1)

### 1.5 `<variables>` 관리자 UI 노출 (확인 필요 N-3)

티스토리 관리자 > 꾸미기 > 스킨 편집 > **스킨 설정** (또는 변수 설정) 화면.

- [ ] **Theme** 그룹으로 `액센트 시작색` (COLOR 피커), `액센트 끝색` (COLOR 피커)이 묶여 표시
- [ ] **Profile** 그룹으로 `프로필 이미지` (IMAGE), `이름/닉네임`, `한 줄 소개`, `GitHub URL`, `LinkedIn URL`, `이메일` (STRING)
- [ ] **Features** 그룹으로 `다크모드 커서 소프트 글로우` (BOOL), `읽기 진행률 바` (BOOL), `챗봇 서버 URL` (STRING)
- [ ] 그룹 이름이 표시되지 않고 11개가 평면적으로 나열되면 **N-3 실패** → PM 에게 즉시 보고 (variablegroup 파서 방식 재검토 필요)

`액센트 시작색`을 바꾸고 저장 → 링크 hover 시 그라데이션 색이 바뀌는지 확인.

### 1.5a `<variables>` 보안 검증 (확인 필요 N-1 · N-2)

관리자 본인이 쓰는 값이라 실용 위험은 낮지만 플랫폼 이스케이프 동작 확인.

- [ ] **N-1 (COLOR 인젝션)**: `accent-start` 값에 `red; } body { display:none; } :root { --x: red` 같은 CSS 주입 시도 → UI 가 입력 자체를 거부하거나 저장 후 body 가 정상이면 OK. body 가 사라지면 보고
- [ ] **N-2 (STRING href 인젝션)**: `profile-link-github` 값에 `javascript:alert(1)` 입력 후 홈 히어로 링크 클릭 → alert 가 뜨면 보고 (Sprint 2 에서 JS 검증 레이어 추가)
- [ ] **N-2 (STRING 텍스트)**: `profile-name` 값에 `<script>alert(1)</script>` 입력 후 홈 진입 → alert 가 뜨면 보고

> 테스트 후에는 정상 값으로 복원해 두세요.

### 1.6 `<s_t3>` 주입 확인

- [ ] DevTools > Elements > `<body>` 내부에 다음이 자동 삽입되어 있는지:
  - `<script src="https://t1.daumcdn.net/tistory_admin/blogs/script/blog/common.js">`
  - 빈 `<div style="margin:0;padding:0;...z-index:0">` (티스토리 기본 주입)
- [ ] `common.js` 로드 실패 없음 (Network 탭)
- [ ] `<s_t3>` 주입 빈 `<div>` 가 레이아웃을 깨지 않음 (예: main 영역 밀림 없음)

### 1.7 모바일 웹 자동 변환 옵션 (확인 필요 #8)

- [ ] 티스토리 관리자 > 관리 또는 설정 메뉴에서 "모바일 웹" 또는 "모바일 자동 변환" 유사 항목 검색
- [ ] 옵션이 존재하면 **OFF** (반응형 스킨이 모든 해상도 담당)
- [ ] 옵션을 찾지 못하면 PM에게 보고 (2026 현재 UI 메뉴가 바뀌었을 수 있음)

---

## 2. 이후 스프린트 담당 "확인 필요" 항목 (참고용, 이번에 체크 X)

| # | 항목 | 담당 스프린트 |
|:--|:--|:--|
| 3 | 검색 결과 URL 구조 `/search/{q}` | Sprint 2 |
| 4 | `[##_category_##]` / `[##_category_list_##]` DOM 구조 | Sprint 2 |
| 6 | 전역 JS API (`window.t3` 등) | Sprint 3 |
| 7 | `[##_tag_label_rep_##]` HTML 구조 | Sprint 3 |
| 10 | 댓글/방명록 React 앱 CSS 훅 | Sprint 3 |
| U-1 | `<s_cover_group>` 내부 구조 | Sprint 2 착수 전 |
| U-2 | `/tag` 와 `/tag/X` 동시 렌더 여부 | Sprint 2 |
| U-3 | `<s_t3>` 내부 외부 CDN `<script>` 허용 | Sprint 3 |

제외 항목:
- #5 `[##_calendar_##]` 등 미문서화 치환자 — 사용하지 않음 (deprecate 가능성)
- #9 광고 iframe display 토글 — 이번 스킨 범위 외

---

## 3. 실패 시 행동

| 상황 | 행동 |
|:--|:--|
| 업로드 실패 | 에러 메시지 전체 캡처해서 PM에게 보고. 파일 재생성 |
| 페이지 에러 500 | body_id / 치환자 철자 재확인. PM에게 보고 |
| CDN 전부 실패 | `images/` 내재화로 전환 (R-1) |
| CDN 일부 실패 | 실패 항목만 내재화 |
| `<variables>` 가 UI에 안 뜸 | `index.xml` 문법 오류 검증 |
| 테마 토글 안 됨 | DevTools Console 에러 확인 |
| 모바일 자동 변환 옵션 못 찾음 | 없다고 보고 (신규 티스토리에서는 제거됐을 수 있음) |

---

## 4. 결과 기록

체크리스트 결과:

| 항목 | 통과 여부 | 메모 |
|:--|:--|:--|
| 1.1 업로드 | [ ] | |
| 1.2 body_id 7종 | [ ] | |
| 1.3 라이트/다크 전환 | [ ] | |
| 1.4 CDN 3개 로드 | [ ] | |
| 1.5 variables 11개 UI + 그룹 표시 (N-3) | [ ] | |
| 1.5a COLOR 인젝션 (N-1) / STRING 인젝션 (N-2) | [ ] | |
| 1.6 `<s_t3>` 주입 | [ ] | |
| 1.7 모바일 변환 옵션 | [ ] | |

**완료 시**: PM에게 "Sprint 1 스모크 통과" 알려주세요 → Sprint 2 착수.
**부분 실패 시**: 실패 항목과 증상을 PM에게 전달 → 대응 후 재검증.

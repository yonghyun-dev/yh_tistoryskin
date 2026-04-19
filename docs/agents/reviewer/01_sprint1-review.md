# Sprint 1 코드 리뷰 보고서

- 검증일: 2026-04-19
- 검증 대상: `skin.html`, `index.xml`, `style.css`, `images/script.js`
- 근거: `docs/design/tistory-skin-spec.md`, `tech-decisions.md`, `skin-architecture.md`, `sprint-plan.md`
- 리뷰어: `reviewer` agent (background, agentId `aa68cd474cc6c1895`)
- 저장 주체: PM (reviewer agent 는 Read/Grep/Glob 만 보유해 파일 직접 작성 불가 → agent 응답 내용을 그대로 저장)

---

## 요약

| 분류 | 건수 |
|:--|:--|
| 치명적 | 1건 |
| 주의 | 5건 |
| 개선 권장 | 5건 |
| 확인 필요 | 4건 |

**종합 판단**: 조건부 통과 (치명적 C-1 + 주의 W-5 업로드 전 필수 수정, W-1/W-2/W-3 권장)

---

## Sprint 1 완료 기준 점검

| # | 완료 기준 | 판정 | 근거 |
|:--|:--|:--|:--|
| 1 | 티스토리 관리자 업로드 성공, 에러 없음 | 미흡 | `preview.gif` 산출물 누락 (spec §1.2 필수 fallback) |
| 2 | 홈/개별글/카테고리 등 헤더·푸터 렌더 | OK | `<s_t3>` 최상위 구조, 헤더/푸터 마크업 정상 |
| 3 | `[##_body_id_##]` 페이지별 변경 | OK | `<body id="[##_body_id_##]">` 올바른 위치 |
| 4 | 라이트/다크 토글 + localStorage 유지 | OK | `theme.toggle()` → `safeStorageSet` → `apply()` 흐름 정상 |
| 5 | `prefers-color-scheme` 자동 다크 | OK (단 W-2) | `matchMedia` MediaQueryList GC 유실 위험은 W-2 참고 |
| 6 | CSS 변수 기반 컬러 일관 적용 | OK | `:root` 토큰 → `[data-theme="dark"]` 오버라이드 → 전 컴포넌트 `var(--color-*)` |
| 7 | 3개 CDN 로드 | OK | `<head>` 3개 `<link>` 정상. 실제 로드 성공은 스모크 확인 |
| 8 | `<s_t3>` 정상 렌더 | OK | `<body>` 직하 최상위에 위치. 닫힘 확인 |
| 9 | `<variables>` 11개 관리자 UI 노출 | 미흡 | C-1 참고: XML 구조가 spec 정규 예시와 불일치 |

---

## 치명적 이슈

### C-1. `<variablegroup>` XML 구조 불일치 — 그룹 이름 노출 실패 가능성

- **파일**: `index.xml:75-173` (변수 정의 영역 전체)
- **문제**: `tistory-skin-spec.md §4.7` 정규 정의 예시는 `<variablegroup name="그룹이름">` (**속성 방식**). 그러나 구현된 index.xml 은 `<variablegroup><name>Theme</name>...</variablegroup>` 형태로 **자식 태그 방식**을 사용한다.
  - spec 에는 두 형태가 혼재한다: §4.7 정의 구조는 속성 방식, §4.7 BOOL 예시는 `<variablegroup>` 속성 없음(그룹 이름 생략). 그러나 `<variablegroup>` 안에 `<name>` 자식 태그를 넣는 형태는 spec 어디에도 예시 없음.
  - 티스토리 파서가 `<name>` 자식 태그를 그룹 이름으로 인식하지 않으면 관리자 UI 에서 `Theme/Profile/Features` 그룹 구분이 표시되지 않는다.
- **위험**: Sprint 1 완료 기준 9번 직접 영향. 업로드 후 index.xml 을 수정하면 사용자 설정이 초기화된다는 공식 경고(Gotcha #8)가 있어 위험도 높음
- **개선 방향**: spec §4.7 정규 속성 방식으로 변경. **업로드 전 수정 필수**
  ```xml
  <variablegroup name="Theme">
    <variable>...</variable>
  </variablegroup>
  <variablegroup name="Profile">...</variablegroup>
  <variablegroup name="Features">...</variablegroup>
  ```

---

## 주의 이슈

### W-1. `showListOnCategory` 값이 sprint-plan 권장값과 불일치

- **파일**: `index.xml:30` vs `docs/design/sprint-plan.md §Sprint 1 작업 2번`
- **문제**: sprint-plan 권장값 `2`(내용+목록), index.xml 실제값 `1`(목록만). 홈에서 `<s_cover_group>` + `<s_list>` 조합을 쓰는 설계에서는 `1`이 맞음. sprint-plan 의 권장값 기재가 설계 의도와 불일치
- **개선 방향**: sprint-plan.md 의 권장값을 `1`로 수정. 업로드 전 수정해 설정 초기화 위험 회피

---

### W-2. `matchMedia` MediaQueryList 객체 미보존 — GC 로 리스너 유실 가능

- **파일**: `images/script.js:41-44, 50-57`
- **문제**: `theme.init()` 에서 `matchMedia("(prefers-color-scheme: dark)")` 를 두 번 호출. 두 번째 호출은 `.addEventListener("change", ...)` 를 거는데 이 MediaQueryList 를 변수에 보존하지 않는다. Chromium 일부 버전에서 변수 미보존 MediaQueryList 는 GC 수거 시 리스너도 소멸한다는 알려진 동작
- **개선 방향**: 모듈 스코프에 `_mql` 저장
  ```js
  const theme = {
    _mql: null,
    init() {
      this._mql = matchMedia("(prefers-color-scheme: dark)");
      const preferred = this._mql.matches ? "dark" : "light";
      // ...
      this._mql.addEventListener("change", (e) => { ... });
    }
  };
  ```

---

### W-3. `<style>` 블록 내 CSS 값 위치에 `[##_var_accent-*_##]` 직접 삽입 — CSS 인젝션 경로

- **파일**: `skin.html:35-36`
- **문제**: `--accent-start: [##_var_accent-start_##];` 삽입. COLOR 타입이지만 티스토리 관리자 UI 의 COLOR 검증 범위가 공식 미명시. `red; } body { display:none; } :root { --x: red` 같은 인젝션 가능성 존재 (관리자 본인의 값이라 실용적 위험은 낮음)
- **개선 방향**: `data-accent-start="[##_var_accent-start_##]"` 속성에서 JS 로 읽어 CSSOM 에 적용하는 방식도 대안. 현재는 확인 필요 N-1 로 분류해 스모크 시 검증

---

### W-4. `profile-link-github/linkedin` href 에 STRING 타입 직접 삽입 — 프로토콜 인젝션 경로

- **파일**: `skin.html:123, 126`
- **문제**: `<a href="[##_var_profile-link-github_##]" ...>`. STRING 값이 `javascript:alert(1)` 이면 XSS. 관리자 본인 입력이라 실용 위험 낮음. 이스케이프 여부는 공식 미명시
- **개선 방향**: N-2 로 분류해 스모크 검증. Sprint 2 프로필 히어로 구현 시 JS 검증 레이어 고려 (`href` 가 `http(s)://` 로 시작하는지 체크)

---

### W-5. `preview.gif` 산출물 누락

- **파일**: SKIN_ROOT 최상위
- **문제**: sprint-plan §Sprint 1 산출물에 명시, spec §1.2 에서 "필수 (기본 fallback)" 로 언급. 업로드 필수 파일 검사가 있으면 업로드 자체 실패 가능
- **개선 방향**: 112x84 최소 GIF 생성. **업로드 전 필수**

---

## 개선 권장

### S-1. `onkeypress` / `event.keyCode` deprecated

- **파일**: `skin.html:69`
- **제안**: `onkeydown="if(event.key==='Enter'){[##_search_onclick_submit_##]}"` 로 교체

### S-2. `CustomEvent` `bubbles` 옵션 미명시

- **파일**: `images/script.js:70-72`
- **제안**: `themechange` 이벤트 명시적 `bubbles: false` 추가 (Sprint 5 챗봇 훅이 청취 예정이라 의도 명확화)

### S-3. 하드코딩된 비토큰 값들

- **파일**: `style.css` 다수
  - `0.9em` (code 축소), `line-height: 1.6` (pre, base 1.75와 다름), `border-left: 3px` (blockquote), `width: 160px` (검색 input), `36px` (테마 토글), `calc(... - 200px)` (매직 넘버), `100ms linear` (progress bar), `96px` (프로필 이미지)
- **제안**: 토큰화하거나 최소 주석으로 의도 명시. Sprint 2~4 에서 컴포넌트 추가할 때 같이 정리

### S-4. `profile-hero__image` 의 `alt=""` 개선

- **파일**: `skin.html:111`
- **제안**: `alt="[##_var_profile-name_##] 프로필 이미지"` 또는 `alt="프로필 이미지"`. Sprint 2 히어로 구현 시 반영

### S-5. `data-chatbot-endpoint` 초기 HTML 노출

- **파일**: `skin.html:6`
- **제안**: 공개 블로그 특성상 실용 위험 낮지만, Sprint 5 챗봇 훅 설계 시 서버 URL 노출 의미 검토 (다른 방법은 복잡도 증가 트레이드오프)

---

## 확인 필요 (스모크/이후 스프린트에서 실환경 검증)

| # | 항목 | 검증 시점 | 방법 |
|:--|:--|:--|:--|
| N-1 | COLOR 타입 변수의 CSS 인젝션 방어 범위 | Sprint 1 스모크 | 관리자 편집 UI 에서 `red; } body { display:none; }` 같은 값 입력 시도 |
| N-2 | STRING 타입 변수의 HTML/href 이스케이프 | Sprint 1/2 스모크 | `<script>alert(1)</script>`, `javascript:alert(1)` 입력 후 렌더 확인 |
| N-3 | `<variablegroup name="...">` 속성 방식이 티스토리 파서에서 그룹 구분으로 처리 | Sprint 1 스모크 | 관리자 스킨 편집 UI 에서 Theme/Profile/Features 그룹 표시 확인 |
| N-4 | `<s_cover_group>` 직하 `<s_cover name="...">` 나열 방식의 동작 | Sprint 2 착수 전 | design-reviewer U-1 연계. Ray 테마 재확인 + 업로드 테스트 |

---

## 잘 작성된 부분

1. **`<s_t3>` 구조 준수**: `<body>` 직하 최상위. Gotcha #1 정확히 준수
2. **`<s_notice_rep>` 단일 선언 + 내부 분기**: design-reviewer C-3 반영. `<s_index_article_rep>` / `<s_permalink_article_rep>` 이중 선언 없음
3. **`<s_permalink_article_rep>` 중첩**: Gotcha #2 준수
4. **외부 링크 보안**: GitHub/LinkedIn 링크에 `rel="noopener noreferrer"`
5. **`safeStorageGet/Set`**: localStorage try-catch 패턴
6. **CSS 토큰 시스템**: `:root` → `[data-theme="dark"]` 오버라이드 일관
7. **접근성 기초**: viewport 줌 허용(T-6), aria-label, role="search", focus-visible, aria-hidden SVG
8. **검색 버튼**: design-reviewer W-3 반영. submit 버튼 포함
9. **IIFE + `"use strict"`**: 전역 스코프 오염 없음
10. **`defer` + DOMContentLoaded 이중 가드**: `document.readyState` 체크로 안전

---

## 종합 판단

**조건부 통과**

- **업로드 전 필수 수정**: C-1 (variablegroup 속성 방식), W-5 (preview.gif)
- **업로드 전 권장 수정**: W-1 (sprint-plan 권장값), W-2 (matchMedia 보존), S-1 (onkeypress)
- **확인 필요**: N-1 ~ N-4 스모크에서 검증
- **이후 스프린트 처리**: S-3 토큰화(점진), S-4 alt(Sprint 2), S-5 URL 노출 검토(Sprint 5)

---

## 참고 (리뷰 프로세스)

reviewer agent 는 Read/Grep/Glob 만 보유해 보고서 파일을 직접 저장할 수 없다. 본 문서는 agent 응답(task-notification result) 내용을 PM 이 그대로 저장한 것이다. 다음 스프린트부터는 agent 도구 제약이 해결되거나 PM 이 저장을 맡는 것으로 프로세스 명문화 필요.

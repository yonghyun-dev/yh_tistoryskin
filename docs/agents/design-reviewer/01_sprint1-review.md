# Sprint 1 설계 문서 교차 검증 보고서

- 검증일: 2026-04-19
- 검증 대상: `docs/design/tech-decisions.md`, `docs/design/sprint-plan.md`, `docs/design/skin-architecture.md`
- 근거: `docs/design/tistory-skin-spec.md` (1,149줄), `docs/requirements/01_modern-blog-skin.md`

---

## 요약

| 분류 | 건수 |
|:--|:--|
| 치명적 (구현 전 반드시 수정) | 3건 |
| 주의 (구현 중 주의) | 5건 |
| 개선 권장 (필수 아님) | 3건 |
| 확인 필요 (실제 환경 검증) | 3건 |

---

## 치명적 이슈 (구현 전 반드시 수정)

### C-1. `highlight.js` 스크립트를 `<s_t3>` 안에서 `defer` 로드 — `<head>` 의 CSS 태그와 위치가 불일치

- **위치**: `skin-architecture.md §3` skin.html 의사코드 최하단
- **문제**: `<head>` 안에 highlight.js 라이트 테마 CSS(`<link id="hljs-theme" ...>`)를 넣고, highlight.js 스크립트 자체는 `<s_t3>` 내부 최하단 `</s_t3>` 직전에 `<script defer>`로 배치한다. 이것 자체는 문법적으로 문제가 없으나, **`<s_t3>` 내부에 `<script>` 태그를 직접 배치하는 것이 티스토리에서 허용되는지 공식 문서에 명시가 없다**. 더 심각한 문제는 `sprint-plan.md §Sprint 1 작업 3번`에 다음과 같이 기재되어 있다는 점이다.
  > "`<script src="./images/script.js" defer>` (highlight.js 로드는 Sprint 3에서 추가)"
  
  그러나 `skin-architecture.md §3` 의사코드에는 Sprint 1 산출물임에도 불구하고 highlight.js `<script>` 태그가 이미 `<s_t3>` 내부에 포함되어 있다. sprint-plan과 skin-architecture 의사코드가 **Sprint 1 범위에 대해 서로 다른 내용을 기술**한다.

- **근거**: `sprint-plan.md §Sprint 1 작업 3번`: "highlight.js 로드는 Sprint 3에서 추가". `skin-architecture.md §3` 의사코드 최하단: `<script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/highlight.min.js" defer></script>` 가 `<s_t3>` 안에 포함
- **제안**: `skin-architecture.md §3` 의사코드에서 highlight.js `<script>` 태그에 `<!-- Sprint 3에서 추가 -->` 주석을 달거나, Sprint 1 의사코드와 Sprint 3 의사코드를 명확히 분리해서 기술한다. 두 문서 중 하나가 틀린 것이므로 어느 스프린트에서 추가할지 확정 후 통일한다.

---

### C-2. `<s_cover_rep>` 안에서 `<s_cover name="...">` 바로 나열 — 중첩 구조 위반

- **위치**: `skin-architecture.md §3` skin.html 의사코드 홈 커버 블록
- **문제**: 의사코드에 다음과 같이 기재되어 있다.
  ```html
  <s_cover_group>
    <s_cover_rep>
      <s_cover name="featured">…</s_cover>
      <s_cover name="list">…</s_cover>
    </s_cover_rep>
  </s_cover_group>
  ```
  그러나 공식 규격에 따르면 `<s_cover_rep>` 는 **커버 반복 블록**이다. 즉 `<s_cover_rep>` 내부는 **커버 한 항목을 반복하는 템플릿**으로, 내부에 `<s_cover name="featured">`, `<s_cover name="list">` 처럼 **이름이 다른 두 커버를 동시에 나열하는 구조는 공식 예제와 다르다**.

  공식 규격(`tistory-skin-spec.md §3.12`)의 중첩 구조는 아래와 같다:
  > `<s_cover_group>` → `<s_cover_rep>` → `<s_cover name="…">` → (`<s_cover_item>` → `<s_cover_item_article_info>` / `<s_cover_item_not_article_info>`)

  규격에 따르면 `<s_cover_rep>` 는 반복자(repeater)이며, 내부에서 `<s_cover name="…">` 를 **한 번** 선언해 여러 커버를 처리하는 구조로 보인다. 혹은 반복 없이 `<s_cover_group>` → `<s_cover name="…">` 직접 선언 방식도 Ray 테마에서 사용된다. 의사코드처럼 `<s_cover_rep>` 내부에 이름이 다른 두 개를 나란히 두는 구조는 **공식 예제에서 확인되지 않는다**.

- **근거**: `tistory-skin-spec.md §3.12`: "`<s_cover_group>` → `<s_cover_rep>` → `<s_cover name="…">` → `<s_cover_item>` → … 순으로 중첩"
- **제안**: Sprint 2 구현 전, Ray 테마 `skin.html` (출처 27)에서 실제 `<s_cover_group>` 사용 패턴을 재확인한다. `<s_cover_rep>` 를 사용하지 않고 `<s_cover_group>` 직하에 `<s_cover name="featured">`, `<s_cover name="list">` 를 직접 나열하는 방식이 더 안전할 수 있다. skin-architecture.md 의사코드를 Ray 테마 패턴에 맞게 수정할 것을 권장한다.

---

### C-3. `<s_notice_rep>` 이 `<s_article_rep>` 와 동등하게 두 번 선언되어 있어 홈에서 공지 인덱스가 중복 렌더될 수 있음

- **위치**: `skin-architecture.md §3` skin.html 의사코드
- **문제**: 의사코드에서 `<s_notice_rep>` 가 두 군데 나온다.
  1. 홈 공지 인덱스 위치: `<s_notice_rep><s_index_article_rep>…</s_index_article_rep></s_notice_rep>`
  2. 공지 permalink 위치: `<s_notice_rep><s_permalink_article_rep>…</s_permalink_article_rep></s_notice_rep>`

  티스토리는 `<s_notice_rep>` 를 **하나**만 선언하고 내부에 `<s_index_article_rep>` / `<s_permalink_article_rep>` 를 중첩해 페이지 타입을 분기하는 방식을 사용한다(`tistory-skin-spec.md §2.3 규칙 3`). 의사코드처럼 `<s_notice_rep>` 를 두 번 분리 선언하면 **두 블록이 동시에 활성화되는 페이지에서 이중 렌더될 수 있다**.

  글 블록 `<s_article_rep>` 과 동일하게, `<s_notice_rep>` 도 **단 한 번 선언** 후 내부에서 `<s_index_article_rep>` / `<s_permalink_article_rep>` 으로 분기해야 한다.

- **근거**: `tistory-skin-spec.md §2.3 규칙 3`: "공지 블록 `<s_notice_rep>` 도 동일한 패턴 (`<s_permalink_article_rep>`/`<s_index_article_rep>` 을 내부에 중첩)". 그리고 글 블록의 원리: "퍼머링크 페이지에서와 인덱스 페이지에서 표시될 내용을 구분할 수 있습니다."
- **제안**: `skin-architecture.md §3` 의사코드의 `<s_notice_rep>` 두 선언을 하나로 통합한다. 아래 구조로 수정한다.
  ```html
  <s_notice_rep>
    <s_index_article_rep>…홈 인덱스 공지 내용…</s_index_article_rep>
    <s_permalink_article_rep>…공지 permalink 내용…</s_permalink_article_rep>
  </s_notice_rep>
  ```

---

## 주의 이슈 (구현 중 주의)

### W-1. `<s_article_rep>` 안에 `<s_index_article_rep>` 가 의사코드에 없음

- **위치**: `skin-architecture.md §3` skin.html 의사코드, 개별 글 블록
- **문제**: 의사코드에서 `<s_article_rep>` 내부에는 `<s_permalink_article_rep>` 만 선언되어 있고, `<s_index_article_rep>` 가 없다. 그런데 `skin-architecture.md §2.1` 페이지 분기 표에서는 홈 페이지의 활성 블록으로 `<s_article_rep><s_index_article_rep>` 를 명시하고 있다. 즉 설계에서는 홈에서 `showListOnCategory` 설정에 따라 `<s_article_rep>` 안의 `<s_index_article_rep>` 가 렌더될 수 있다고 하지만, 의사코드에는 해당 블록이 없다.
  
  Sprint 2에서 홈을 `<s_cover_group>` + `<s_list>` 로 구성할 예정이라면 `<s_article_rep><s_index_article_rep>` 가 불필요할 수 있다. 그러나 페이지 분기 표와 의사코드 간에 불일치가 존재한다.

- **근거**: `skin-architecture.md §2.1` 홈 행 활성 블록: "`<s_article_rep><s_index_article_rep>`". `skin-architecture.md §3` 의사코드: `<s_article_rep>` 내에 `<s_permalink_article_rep>` 만 존재
- **제안**: 홈에서 `<s_list>` 를 쓰기로 확정했다면 `§2.1` 표에서 해당 블록 설명을 정리하거나, 의사코드에 `<s_index_article_rep>` stub(주석)을 추가해 설계 의도를 명확히 한다.

---

### W-2. `sprint-plan.md` Sprint 4 About 섹션에 `<s_cover name="about">` 사용 — `index.xml` 에 `about` 커버 정의 없음

- **위치**: `sprint-plan.md §Sprint 4 작업 4번`
- **문제**: Sprint 4 작업 목록에 `About 섹션 — <s_cover name="about"> 또는 티스토리 페이지 기능` 이라고 기재되어 있다. 그러나 `tech-decisions.md T-3` 및 `sprint-plan.md §Sprint 1 작업 2번` 에서 `index.xml <cover>` 는 `featured`와 `list` 두 개만 정의된다. `<s_cover name="about">` 를 `skin.html` 에서 사용하려면 `index.xml <cover><item><name>about</name>` 이 반드시 선언되어 있어야 한다.
  
  공식 규격에 따르면 `<s_cover>` 의 `name` 속성은 `index.xml` 의 `<cover><item><name>` 과 정확히 일치해야 렌더된다. 일치하지 않으면 무시된다(Gotcha #7).

- **근거**: `tistory-skin-spec.md §10 Gotcha #7`: "`<s_cover>` 의 `name` 속성은 `index.xml` 의 `<cover><item><name>` 와 정확히 일치해야 렌더된다. 일치하지 않으면 무시된다." `tech-decisions.md T-3`: cover 2개 — `featured`(CUSTOM), `list`(RECENT). `about` 미포함.
- **제안**: `about` 커버를 사용할 경우 Sprint 1에서 `index.xml <cover>` 에 `about` 항목을 추가해야 한다(index.xml 변경 시 설정 초기화 위험 있음). 대안으로 "티스토리 페이지 기능"(티스토리 고유 `<s_page_rep>`)을 사용하는 방향이 index.xml 수정을 피할 수 있다. Sprint 4 구현 전에 결정이 필요하다.

---

### W-3. `skin-architecture.md §3` 의사코드에서 `<s_search>` 검색 폼에 submit 버튼 없음

- **위치**: `skin-architecture.md §3` skin.html 의사코드 헤더 `<s_search>` 블록
- **문제**: 의사코드의 `<s_search>` 블록에는 `<input type="text">` 만 있고, submit 역할을 하는 버튼이 없다. 공식 규격 및 Ray 테마 예제에서는 검색 버튼(또는 아이콘 버튼)에도 `onclick="[##_search_onclick_submit_##]"` 를 걸어야 폼 제출이 완성된다. `onkeypress` 로 Enter 키는 처리되지만, 터치 기기에서 검색 버튼 탭으로 제출하는 방식이 누락된다.

- **근거**: `tistory-skin-spec.md §3.13.9` 공식 예: `<input value="검색" type="button" onclick="[##_search_onclick_submit_##]" />`. Ray 테마도 검색 버튼을 별도로 둔다.
- **제안**: 의사코드에 검색 버튼을 추가한다. 최소 `<button type="button" onclick="[##_search_onclick_submit_##]">검색</button>` 한 줄. Sprint 2 구현 시 반드시 포함한다.

---

### W-4. `tech-decisions.md` 에서 `variablegroup` 분류가 2개로 명시되어 있으나 11개 variables를 3가지 성격으로 분류 — 그룹 수 불일치

- **위치**: `tech-decisions.md T-3`, `sprint-plan.md §Sprint 1 작업 2번`
- **문제**: `tech-decisions.md T-3` 의 변수 목록 설명에는 그룹 언급이 없다. 그러나 `sprint-plan.md §Sprint 1 작업 2번` 에는 "`variablegroup` 2개로 분류: `Theme`, `Profile`, `Features`" 라고 기재되어 있다. `Theme`, `Profile`, `Features` 는 **3개**인데 "2개로 분류"라고 되어 있다. 단순 오타 또는 설계 수정 미반영일 수 있다.

- **근거**: `sprint-plan.md §Sprint 1 작업 2번`: "`<variables>` 11개 (tech-decisions.md T-3 표 참고, `variablegroup` 2개로 분류: `Theme`, `Profile`, `Features`)"
- **제안**: `sprint-plan.md` 에서 "2개" → "3개" 로 수정하거나, 3개 그룹 중 하나를 통합해 2개로 설계를 확정한 뒤 일관되게 기재한다.

---

### W-5. `skin-architecture.md §3` 의사코드에서 `<s_tag>` 블록이 `<s_article_rep>` 와 같은 `<main>` 안에 있어 태그 클라우드 페이지에서 빈 블록 잔류 문제 발생 가능

- **위치**: `skin-architecture.md §3` skin.html 의사코드 태그 클라우드 블록
- **문제**: 의사코드에서 `<s_tag>` 블록이 `<main class="site-main">` 안에 `<s_list>`, `<s_article_rep>` 등과 함께 나열되어 있다. `<s_tag>` 는 `/tag` (태그 클라우드) 페이지에서만 활성화된다. 티스토리는 비활성 조건부 블록을 빈 문자열로 치환하므로 다른 페이지에서는 `<s_tag>` 내용이 완전히 사라진다. 이 동작 자체는 맞다.

  그러나 `<section class="tag-cloud">` 같은 **외부 컨테이너 태그 없이** `<s_tag>` 블록이 `<section class="tag-cloud">` 를 **내부에** 포함하고 있다(`<s_tag><section class="tag-cloud">…</section></s_tag>`). 비활성 시 `<section>` 태그도 함께 사라지므로 레이아웃 상 문제는 없다. 이는 의사코드 표현상 옳다. **다만 `<s_tag>` 블록과 태그별 목록에 쓰이는 `<s_list>` 블록이 같은 레벨에서 혼재**하기 때문에, `/tag` 페이지에서는 `<s_tag>` 와 `<s_list>` 가 **동시에** 활성화될 수 있다. `skin-architecture.md §2.1` 페이지 분기 표에서는 태그 클라우드(`/tag`)와 태그별 목록(`/tag/X`)을 body_id 로 구분하지 않고 모두 `tt-body-tag` 로 동일하게 처리한다. 따라서 `/tag` 에서 `<s_list>` 도 렌더되는지 확인이 필요하다.

- **근거**: `skin-architecture.md §2.1` 태그 클라우드 행: "body_id = `tt-body-tag` (URL `/tag`)". 태그별 목록 행: "body_id = `tt-body-tag` (URL `/tag/X`)". 두 행 모두 body_id 가 동일하며, URL 패턴으로만 구분.
- **제안**: `/tag` (클라우드) 와 `/tag/X` (목록) 의 body_id 가 동일하므로 CSS URL 분기가 불가능하다. Sprint 2에서 `<s_tag>` 와 `<s_list>` 가 동일 페이지에서 모두 렌더되는지 실제 환경에서 확인 후 중복 렌더 여부에 따라 구조를 조정한다.

---

## 개선 권장 (필수 아님)

### I-1. `sprint-plan.md` Sprint 1 완료 기준에 highlight.js CDN 로드 성공 항목 포함 — Sprint 3 구현 예정과 불일치 가능성

- **내용**: `sprint-plan.md §Sprint 1 완료 기준` 마지막 항목에 "Pretendard / JetBrains Mono / highlight.js 테마 CDN 로드 성공 (Network 탭)"이 포함되어 있다. highlight.js `<link id="hljs-theme">` CSS는 `<head>`에 Sprint 1부터 포함되므로 CSS 로드 확인은 타당하다. 그러나 highlight.js 스크립트(`highlight.min.js`)는 sprint-plan.md 에 따르면 Sprint 3에서 추가된다. Sprint 1 완료 기준에 "highlight.js 테마 CDN 로드 성공"의 범위(CSS만인지 JS까지인지)가 명확하지 않다.
- **제안**: Sprint 1 완료 기준의 해당 항목을 "Pretendard / JetBrains Mono / highlight.js **라이트 테마 CSS** CDN 로드 성공 (Network 탭)" 으로 구체화한다.

---

### I-2. 시리즈 기능(F-20 일부) 처리 방침이 5개 스프린트 어디에도 명시되지 않음

- **내용**: `requirements/01_modern-blog-skin.md §F-20` 은 "시리즈 / 방명록" 으로 선택 기능이다. `sprint-plan.md §Sprint 4 작업 3번` 에 방명록(`[##_guestbook_group_##]`)이 포함되어 있다. 그러나 "시리즈" 기능은 5개 스프린트 어디에도 언급이 없다. 티스토리의 "시리즈" 기능은 공식 치환자 카탈로그(`tistory-skin-spec.md`)에도 치환자가 정의되어 있지 않다. 즉 시리즈 기능을 지원하는 공식 치환자가 없을 가능성이 높으며, 이 경우 F-20 의 "시리즈" 부분은 구현 불가 기능일 수 있다.
- **제안**: "시리즈" 기능이 티스토리 공식 치환자로 지원되지 않는다면, requirements 에 "시리즈: 티스토리 공식 치환자 미지원으로 구현 범위 제외" 라고 명시한다. 지원 여부를 `tistory-skin-spec.md §12` 확인 필요 목록에 추가하는 것도 고려한다.

---

### I-3. `skin-architecture.md §8` 확인 필요 목록이 4개인데 `tistory-skin-spec.md §12` 확인 필요는 10개

- **내용**: `skin-architecture.md §8` 는 "Sprint 1 범위" 확인 필요 항목으로 4개만 나열한다. `tistory-skin-spec.md §12` 의 10개 항목 중 나머지 6개(파일 업로드 용량 상한, 검색 URL 구조, `[##_calendar_##]` 등 미문서화 치환자, 전역 JS API, `[##_tag_label_rep_##]` HTML 구조, 광고 display 토글, 댓글 React 앱 CSS 훅)는 Sprint 1 스모크 체크리스트에 포함되지 않는다. Sprint 1 스모크에서 커버하지 않는 항목이 추후 어느 스프린트에서 검증될지 계획이 없다.
- **제안**: `docs/design/sprint1-smoke-checklist.md` 파일을 작성할 때, 10개 항목 전체를 나열하고 Sprint별 담당 스모크로 배분하는 항목을 추가한다. 예: "파일 업로드 용량 상한 → Sprint 1 업로드 시 확인", "`[##_tag_label_rep_##]` HTML 구조 → Sprint 3 태그 라벨 구현 시 확인" 등.

---

## 확인 필요 (실제 환경에서 검증)

### U-1. `<s_cover_rep>` 내부에 이름이 다른 `<s_cover>` 를 복수 선언하는 방식이 실제로 동작하는지

- **위치**: `skin-architecture.md §3`, Sprint 2 구현 전
- **내용**: C-2에서 지적한 것처럼, `<s_cover_rep>` 내부에 `<s_cover name="featured">` 와 `<s_cover name="list">` 를 동시에 나열하는 방식이 티스토리에서 의도대로 작동하는지 공식 문서에서 확인되지 않는다.
- **확인 방법**: Sprint 2 초기 업로드 후 홈 페이지에서 양쪽 커버가 독립적으로 렌더되는지 개발자 도구로 확인한다.

---

### U-2. `/tag` (클라우드)와 `/tag/X` (목록)에서 `<s_tag>` 와 `<s_list>` 가 동시에 렌더되는지

- **위치**: `skin-architecture.md §2.1`, Sprint 2 구현 전
- **내용**: W-5에서 지적한 것처럼 두 URL 모두 `tt-body-tag` 를 사용하므로 CSS 분기가 body_id 만으로는 불가능하다. `/tag` 에서 `<s_tag>` 와 `<s_list>` 가 동시에 활성화된다면 UI가 중복 렌더된다.
- **확인 방법**: Sprint 2에서 태그 관련 블록 구현 후 `/tag` 와 `/tag/{name}` 각각 접근해 어떤 블록이 렌더되는지 DOM 검사로 확인한다.

---

### U-3. `<s_t3>` 내부에 외부 CDN `<script defer>` 태그를 배치하는 것이 티스토리에서 허용되는지

- **위치**: `skin-architecture.md §3`, Sprint 3 구현 전 (highlight.js 스크립트 추가 시점)
- **내용**: 공식 문서는 `<s_t3>` 의 위치만 명시하고, 내부에 어떤 태그를 넣을 수 있는지는 명시하지 않는다. 티스토리가 `<s_t3>` 내부를 그대로 렌더하는지, 혹은 특정 처리를 하는지 불명확하다. `images/script.js` 는 `<s_t3>` 안에 있어도 Ray 테마에서 정상 동작이 확인되지만, 외부 CDN URL(jsdelivr) `<script>` 를 `<s_t3>` 내부에 두는 것은 별도 확인이 필요하다.
- **확인 방법**: Sprint 1 업로드 후 `images/script.js` 로드가 정상인지 확인하고, Sprint 3에서 highlight.js 추가 시 Network 탭에서 로드 성공 여부를 확인한다.

---

## 요구사항 커버리지 테이블

| 요구사항 # | 이름 | 배정 스프린트 | 근거 위치 | 상태 |
|:--|:--|:--|:--|:--|
| F-1 | CSS 변수 디자인 토큰 | 1 | skin-architecture.md §4, sprint-plan.md §Sprint 1 작업 4번 | OK |
| F-2 | 라이트/다크 테마 전환 | 1 | sprint-plan.md §Sprint 1 작업 5번, skin-architecture.md §5.2 | OK |
| F-3 | 타이포그래피 시스템 | 1 | sprint-plan.md §Sprint 1 작업 4번 (베이스 타이포그래피) | OK |
| F-4 | 반응형 그리드 | 4 | sprint-plan.md §Sprint 4 작업 10번 | OK |
| F-5 | 프로필 히어로 섹션 | 2 | sprint-plan.md §Sprint 2 작업 3번 (구조는 Sprint 1 의사코드에 포함) | OK |
| F-6 | 카드 그리드 리스트 | 2 | sprint-plan.md §Sprint 2 작업 2번 | OK |
| F-7 | 카테고리 네비 (상단 고정) | 2 | sprint-plan.md §Sprint 2 작업 4번 | OK |
| F-8 | 태그 노출 | 2 | sprint-plan.md §Sprint 2 작업 8번 (태그 클라우드), Sprint 3 작업 6번 (태그 라벨) | OK |
| F-9 | 검색 | 2 | sprint-plan.md §Sprint 2 작업 4번 (`<s_search>`) | OK |
| F-10 | 포스트 메타 헤더 | 3 | sprint-plan.md §Sprint 3 작업 1번 | OK |
| F-11 | 2단 레이아웃 (본문 + TOC) | 3 | sprint-plan.md §Sprint 3 작업 2번 | OK |
| F-12 | TOC 자동 생성 (H2/H3) | 3 | sprint-plan.md §Sprint 3 작업 3번 | OK |
| F-13 | 코드 하이라이팅 | 3 | sprint-plan.md §Sprint 3 작업 4번 | OK |
| F-14 | 읽기 진행률 바 (상단 고정) | 3 | sprint-plan.md §Sprint 3 작업 5번 | OK |
| F-15 | 관련 글 / 이전·다음 글 | 3 | sprint-plan.md §Sprint 3 작업 6번 | OK |
| F-16 | About / 프로필 페이지 | 4 | sprint-plan.md §Sprint 4 작업 4번 | OK (단, W-2 이슈 주의) |
| F-17 | RSS 노출 | 1 | skin-architecture.md §3 의사코드 푸터 + `<head>` link | OK |
| F-18 | 댓글 영역 | 3 | sprint-plan.md §Sprint 3 작업 7번 | OK |
| F-19 | 다크/라이트 토글 UI | 1 | sprint-plan.md §Sprint 1 작업 3·5번, skin-architecture.md §3 헤더 버튼 | OK |
| F-20 | 시리즈 / 방명록 | 4 (방명록) / 미배정 (시리즈) | sprint-plan.md §Sprint 4 작업 3번 (방명록만) | 시리즈 누락 — I-2 참고 |
| F-21 | 스크롤 페이드인 + 슬라이드업 | 4 | sprint-plan.md §Sprint 4 작업 5번 | OK |
| F-22 | 카드 hover lift + soft shadow | 2 | sprint-plan.md §Sprint 2 작업 7번 | OK |
| F-23 | 페이지 전환 페이드 | 4 | sprint-plan.md §Sprint 4 작업 6번 | OK |
| F-24 | 제목 gradient 텍스트 | 4 | sprint-plan.md §Sprint 4 작업 7번 | OK |
| F-25 | 다크모드 커서 소프트 글로우 | 4 | sprint-plan.md §Sprint 4 작업 8번 | OK (선택 기능) |
| F-26 | `prefers-reduced-motion` 대응 | 1+4 | sprint-plan.md §Sprint 1 작업 4번 (전역 CSS), Sprint 4 작업 9번 (검증) | OK |
| F-27 | 플로팅 위젯 마운트 지점 | 1 | skin-architecture.md §3 의사코드 `#chatbot-widget-root`, sprint-plan.md §Sprint 1 작업 3번 | OK |
| F-28 | 본문 마커 치환 JS 훅 | 5 | sprint-plan.md §Sprint 5 작업 2번 | OK |
| F-29 | 전역 설정 객체 주입 | 5 | sprint-plan.md §Sprint 5 작업 3번, skin-architecture.md §6.2 | OK |
| F-30 | 외부 스크립트 1줄 연결 API | 5 | sprint-plan.md §Sprint 5, skin-architecture.md §6.4 | OK |

**누락 집계**: F-20 의 "시리즈" 부분이 어느 스프린트에도 배정되지 않음. 나머지 29개 기능은 스프린트에 배정됨.

---

## 종합 판단

**조건부 통과 (3개 수정 후)**

치명적 이슈 C-1·C-2·C-3을 구현 착수 전에 설계 문서에서 정리해야 한다. 세 이슈 모두 skin-architecture.md 의사코드의 수정 사항이며, 실제 skin.html 코드를 작성할 때 혼선을 유발하는 부분이다. 치명적 이슈 수정 후 구현에 착수할 것을 권고한다.

주의 이슈(W-1~W-5) 중 W-2(About 커버 정의 누락)와 W-4(variablegroup 수 불일치)는 Sprint 1 index.xml 작성 전에 결정해야 한다. 나머지 주의 이슈는 해당 스프린트 구현 시 인지하고 있으면 된다.

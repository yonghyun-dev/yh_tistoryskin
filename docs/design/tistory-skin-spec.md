# 티스토리 2.0 스킨 공식 규격 (조사 결과)

- 조사일: 2026-04-19
- 조사자: general-purpose agent (PM 위임)
- 1차 출처: 티스토리 공식 스킨 가이드 (GitBook + GitHub `tistory/document-tistory-skin`)
- 2차 출처: 티스토리 공식 레퍼런스 스킨 `tistory/tistory-theme-ray` (Ray 테마, MIT)

> 본 문서는 공식 문서에서 직접 발췌한 내용만 정리한다. 공식 소스에서 확인하지 못한 항목은 **"확인 필요"** 로 표시한다. 파생 블로그 글은 근거로 사용하지 않았다.

## 출처 (공식 URL)

| # | URL | 내용 |
|:--|:--|:--|
| 1 | https://tistory.github.io/document-tistory-skin/ | GitBook 메인 (공식 문서) |
| 2 | https://github.com/tistory/document-tistory-skin | GitBook 소스 (raw markdown) |
| 3 | https://tistory.github.io/document-tistory-skin/common/files.html | 파일 구조 |
| 4 | https://tistory.github.io/document-tistory-skin/common/index.xml.html | index.xml 스펙 |
| 5 | https://tistory.github.io/document-tistory-skin/common/basic.html | 치환자 구조 |
| 6 | https://tistory.github.io/document-tistory-skin/common/global.html | 공통 치환자 |
| 7 | https://tistory.github.io/document-tistory-skin/common/cover.html | 홈 커버 |
| 8 | https://tistory.github.io/document-tistory-skin/common/variable.html | 스킨 옵션 |
| 9 | https://tistory.github.io/document-tistory-skin/contents/post.html | 글 치환자 |
| 10 | https://tistory.github.io/document-tistory-skin/contents/comment.html | 댓글 치환자 |
| 11 | https://tistory.github.io/document-tistory-skin/contents/notice.html | 공지사항 치환자 |
| 12 | https://tistory.github.io/document-tistory-skin/contents/protected.html | 보호글 치환자 |
| 13 | https://tistory.github.io/document-tistory-skin/contents/page.html | 페이지 치환자 |
| 14 | https://tistory.github.io/document-tistory-skin/contents/tag.html | 태그 클라우드 |
| 15 | https://tistory.github.io/document-tistory-skin/contents/guestbook.html | 방명록 |
| 16 | https://tistory.github.io/document-tistory-skin/list/list.html | 리스트 치환자 |
| 17 | https://tistory.github.io/document-tistory-skin/list/paging.html | 페이징 |
| 18 | https://tistory.github.io/document-tistory-skin/sidebar/basic.html | 사이드바 구조 |
| 19 | https://tistory.github.io/document-tistory-skin/sidebar/recent_notice.html | 최근 공지 |
| 20 | https://tistory.github.io/document-tistory-skin/sidebar/recent_post.html | 최근 글 |
| 21 | https://tistory.github.io/document-tistory-skin/sidebar/popular_post.html | 인기글 |
| 22 | https://tistory.github.io/document-tistory-skin/sidebar/recent_comment.html | 최근 댓글 |
| 23 | https://tistory.github.io/document-tistory-skin/sidebar/category.html | 카테고리 |
| 24 | https://tistory.github.io/document-tistory-skin/sidebar/random_tag.html | 랜덤 태그 |
| 25 | https://tistory.github.io/document-tistory-skin/sidebar/count.html | 방문자수 |
| 26 | https://tistory.github.io/document-tistory-skin/sidebar/search.html | 검색 |
| 27 | https://github.com/tistory/tistory-theme-ray/blob/master/skin.html | Ray 테마 실제 구현 |
| 28 | https://github.com/tistory/tistory-theme-ray/blob/master/index.xml | Ray 테마 index.xml |

---

## 1. 파일 구성

### 1.1 공식 파일 트리 (출처 3)

공식 문서 `common/files.md` 원문을 그대로 옮긴다.

```
SKIN ─┬─ index.xml
      ├─ skin.html
      ├─ style.css
      ├─ preview.gif
      ├─ preview256.jpg
      ├─ preview560.jpg
      ├─ preview1600.jpg
      └─ images ─┬─ script.js
                 ├─ background.jpg
                 ├─ background.jpg
                 └─ background.jpg
```

### 1.2 각 파일의 역할

| 파일 | 역할 | 비고 |
|:--|:--|:--|
| `index.xml` | 스킨 정보 파일. 스킨명, 버전, 기본 설정, 옵션 정의 | **이 파일이 변경되면 스킨의 모든 설정이 초기화된다** (공식 경고) |
| `skin.html` | 스킨 메인 템플릿. 치환자를 사용해 각 URL 요청에 해당하는 HTML 결과물로 치환 | 단일 파일에서 모든 페이지 분기를 처리 |
| `style.css` | CSS 분리 파일. `skin.html`과 마찬가지로 스킨 에디터에서 편집 가능 | |
| `preview.gif` | 미리보기 기본 파일 (112x84). 아래 jpg가 없을 때 fallback | 필수 (기본 fallback) |
| `preview256.jpg` | 사용 중인 스킨 미리보기 (256x192) | |
| `preview560.jpg` | 스킨 목록 미리보기 (560x420) | |
| `preview1600.jpg` | 스킨 상세보기 미리보기 (1600x1200) | |
| `images/` | 필수요소가 아닌 모든 파일(image, script, css 등)이 위치 | 폴더명 고정 |

### 1.3 배치 규칙 (공식 원문 인용)

> "필수요소가 아닌 파일은 모두 images 아래에 위치하게 됩니다. image, script, css 등을 업로드하여 스킨에서 사용합니다." — files.md

따라서 추가 JS/CSS/폰트/이미지는 모두 `images/` 하위에 둔다. 실제 Ray 테마도 `./images/font.css`, `./images/script.js` 처럼 참조한다.

### 1.4 파일 용량·인코딩 제약

- **인코딩**: 공식 `index.xml`은 `<?xml version="1.0" encoding="utf-8"?>` 로 선언한다. Ray 테마 `skin.html`도 `<meta charset="UTF-8">` 을 사용한다. → **UTF-8 고정**.
- **개별 파일 업로드 용량 제한**: **확인 필요** — 공식 스킨 가이드에는 명시되지 않음. 파생 글에서는 10MB 수준이라는 언급이 있으나 공식 근거 없음. 실제 업로드 시 에디터가 경고 메시지로 안내하므로 개발 단계에서 확인한다.
- **JavaScript 허용 범위**: 공식 가이드는 `images/script.js` 와 같은 내부 JS를 기본 예시로 명시한다. 외부 CDN(`//t1.daumcdn.net/…` 등 카카오 CDN)은 Ray 테마에서 직접 사용되므로 허용됨. 그 외 임의 CDN 허용 여부는 **확인 필요** — 공식 문서에 정책 설명 없음. 실제 운영 경험으로는 `cdn.jsdelivr.net`, `unpkg.com` 등도 로드 가능했으나 공식 근거는 없다.

### 1.5 서버사이드 불가 — 클라이언트 JS 대체 범위

티스토리는 **정적 HTML + 치환자 기반**으로 동작한다. 스킨 파일에서 직접 서버사이드 로직(PHP, Node, DB 쿼리 등)은 불가능하다. 아래 기능은 반드시 클라이언트 JS로 대체한다.

| 필요 기능 | 구현 방법 |
|:--|:--|
| 다크모드 토글 | `localStorage` + `data-theme` 속성 토글 |
| 목차(TOC) 자동 생성 | `[##_article_rep_desc_##]` 가 채워진 DOM을 순회해 `h2`/`h3` 수집 |
| 코드 하이라이팅 | `highlight.js`, `prismjs` 등을 `images/` 에 두거나 공용 CDN 사용 |
| 검색 자동완성·부분검색 | 클라이언트 JS. 단, 기본 `<s_search>` 폼은 서버 검색(`/search/{q}`)으로 처리됨 (Ray 테마 `frm_search` 참고) |
| 방문자 통계 외부 연동 | Google Analytics 등 외부 스크립트 삽입 |

---

## 2. 페이지 분기 맵

### 2.1 body_id 기준 페이지 타입 (출처 6, global.md)

공통 치환자 `[##_body_id_##]` 로 현재 페이지 타입을 body 속성으로 받을 수 있다. **공식 값 테이블**:

| 페이지 타입 | body_id |
|:--|:--|
| 홈화면 | `tt-body-index` |
| 글화면 | `tt-body-page` |
| 카테고리 글 리스트 | `tt-body-category` |
| 보관함 글 리스트 | `tt-body-archive` |
| 태그 리스트 | `tt-body-tag` |
| 검색결과 리스트 | `tt-body-search` |
| 방명록 | `tt-body-guestbook` |
| 지역로그 | `tt-body-location` |

> 출처 원문: common/global.md 의 표.

이 값을 CSS 선택자(`body#tt-body-page ...`)나 JS 분기(`document.body.id === 'tt-body-index'`)로 사용한다.

### 2.2 페이지별 활성 그룹 치환자 (공식 예제 기반)

아래 표는 공식 각 문서(`contents/*`, `list/*`)에서 설명한 **그룹 치환자의 렌더링 조건**을 정리한 것이다. Ray 테마 `skin.html` 의 실제 조립 방식도 같다.

| 페이지 종류 | URL 예 | body_id | 활성 블록 | 주요 내부 치환자 |
|:--|:--|:--|:--|:--|
| 홈 (커버 사용) | `/` | `tt-body-index` | `<s_cover_group>` 내부 `<s_cover_rep>`/`<s_cover>` | `[##_cover_item_title_##]`, `[##_cover_item_url_##]`, `[##_cover_item_thumbnail_##]` |
| 홈/카테고리/태그/검색 목록 | `/`, `/category/…`, `/tag/…`, `/search/…` | 각 `tt-body-…` | `<s_list>` + `<s_list_rep>` (+ `<s_list_empty>`, `<s_paging>`) | `[##_list_rep_title_##]`, `[##_list_rep_link_##]`, `[##_list_rep_summary_##]`, `[##_list_rep_thumbnail_##]` |
| 개별 글 (permalink) | `/{id}` 또는 `/entry/…` | `tt-body-page` | `<s_article_rep>` 내부의 `<s_permalink_article_rep>` | `[##_article_rep_desc_##]`, `[##_article_rep_title_##]`, `<s_tag_label>`, `<s_article_prev>/<s_article_next>`, `<s_article_related>` |
| 개별 글 (인덱스에서 목록에 글 나열) | `/` (showListOnCategory=0/2) | `tt-body-index` | `<s_article_rep>` 내부의 `<s_index_article_rep>` | `[##_article_rep_summary_##]`, 썸네일 |
| 공지 permalink | `/notice/{id}` 추정 | `tt-body-page` | `<s_notice_rep>` 내부의 `<s_permalink_article_rep>` | `[##_notice_rep_desc_##]`, `[##_notice_rep_title_##]` |
| 공지 (인덱스 상단) | `/` | `tt-body-index` | `<s_notice_rep>` 내부의 `<s_index_article_rep>` | `[##_notice_rep_summary_##]`, `[##_notice_rep_link_##]` |
| 보호글 | permalink | `tt-body-page` | `<s_article_protected>` | `[##_article_password_##]`, `[##_article_dissolve_##]` |
| 페이지(Page) | `/{slug}` | `tt-body-page` | `<s_page_rep>` (없으면 `<s_article_rep>`가 대신 쓰임) | 기본 article 치환자 공유 |
| 방명록 | `/guestbook` | `tt-body-guestbook` | `<s_guest>` 또는 `[##_guestbook_group_##]` 단독 | `<s_guest_input_form>`, `<s_guest_container>`, `<s_guest_rep>` |
| 태그 목록 (태그로그) | `/tag` | `tt-body-tag` | `<s_tag>` + `<s_tag_rep>` | `[##_tag_link_##]`, `[##_tag_name_##]`, `[##_tag_class_##]` |
| 검색 결과 | `/search/{q}` | `tt-body-search` | `<s_list>` + `<s_list_rep>` | `[##_list_conform_##]`이 검색어로 치환 |

> 공식 문서 원문 (`contents/post.md`):
> "퍼머링크 페이지에서와 인덱스 페이지에서 표시될 내용을 구분할 수 있습니다. (퍼머링크 페이지/인덱스 페이지 영역 밖에서 사용되는 치환자는 둘 모두에서 표시됩니다)"

→ 즉 `<s_article_rep>` 바로 밑에 둔 HTML은 두 페이지에서 다 렌더되지만, `<s_permalink_article_rep>` 내부는 permalink에서만, `<s_index_article_rep>` 내부는 목록(index) 상황에서만 렌더된다.

### 2.3 중첩 규칙 (공식 원문 + 예제)

1. **`<s_t3>` 는 `<body>` 안에 감싸는 최상위 그룹** (필수). global.md: "티스토리 공통 javascript 삽입 (필수)".
2. **글 블록**은 `<s_article_rep>` 안에 `<s_permalink_article_rep>`/`<s_index_article_rep>` 를 중첩해 두 페이지를 구분한다.
3. **공지 블록** `<s_notice_rep>` 도 동일한 패턴 (`<s_permalink_article_rep>`/`<s_index_article_rep>` 을 내부에 중첩).
4. **리스트 블록** `<s_list>` 안에 `<s_list_rep>` 를 넣고, 필요 시 `<s_list_empty>`, `<s_list_image>`, `<s_list_rep_thumbnail>` 을 중첩한다.
5. **페이징 블록** `<s_paging>` 은 `<s_paging_rep>` 를 내부에 중첩.
6. **댓글 블록 (수동)** `<s_rp>` 안에 `<s_rp_container>` → `<s_rp_rep>` → `<s_rp2_container>` → `<s_rp2_rep>` 로 2레벨 댓글 구조.
7. **방명록 블록 (수동)** `<s_guest>` 안에 `<s_guest_input_form>`, `<s_guest_container>` → `<s_guest_rep>` → `<s_guest_reply_container>` → `<s_guest_reply_rep>` 중첩.
8. **사이드바** `<s_sidebar>` 안에 `<s_sidebar_element>` 를 여러 개 넣는다. `<s_sidebar>` 는 여러 번 선언 가능 (왼쪽/오른쪽 등).
9. **홈 커버** `<s_cover_group>` → `<s_cover_rep>` → `<s_cover name="…">` → `<s_cover_item>` → `<s_cover_item_article_info>/<s_cover_item_not_article_info>` 순으로 중첩. `<s_cover_item_thumbnail>`, `<s_cover_url>` 은 값이 있을 때만 렌더.

---

## 3. 치환자 카탈로그

본 섹션은 공식 문서의 모든 치환자를 카테고리별로 정리한다. **이름은 공식 원문에서 복사해 철자 그대로 기재**한다.

### 3.1 스킨 최상위 & 블로그 메타 (출처 6)

**그룹 치환자**

| 이름 | 설명 |
|:--|:--|
| `<s_t3>` | 티스토리 공통 javascript 삽입 (필수). `<body>` 내부에 **반드시 감싼다**. 치환 후 `https://t1.daumcdn.net/tistory_admin/blogs/script/blog/common.js` 스크립트와 빈 div가 삽입된다. |

**값 치환자 (블로그 정보)**

| 이름 | 설명 |
|:--|:--|
| `[##_title_##]` | 블로그 제목 |
| `[##_image_##]` | 블로그 대표 이미지 url |
| `[##_blog_image_##]` | 블로그 대표 이미지를 포함한 `<img>` 태그 |
| `[##_desc_##]` | 블로그 설명 |
| `[##_blogger_##]` | 블로그 소유자의 필명 |

**블로그 URL**

| 이름 | 설명 |
|:--|:--|
| `[##_blog_link_##]` | 블로그 url (홈) |
| `[##_rss_url_##]` | RSS feed 주소 |
| `[##_taglog_link_##]` | 태그로그 url |
| `[##_guestbook_link_##]` | 방명록 url |

**기타 기본 정보**

| 이름 | 설명 |
|:--|:--|
| `[##_page_title_##]` | 페이지 제목 (브라우저 탭 타이틀용) |
| `[##_blog_menu_##]` | 블로그 메뉴 리스트 (티스토리가 생성한 기본 메뉴) |
| `[##_body_id_##]` | 페이지 타입에 따른 id (표는 § 2.1 참조) |

**광고 치환자**

| 이름 | 설명 |
|:--|:--|
| `[##_revenue_list_upper_##]` | 블로그 홈/목록 상단 광고 영역 |
| `[##_revenue_list_lower_##]` | 블로그 홈/목록 하단 광고 영역 |

### 3.2 글(Article) 치환자 — permalink 공용 (출처 9)

**그룹 치환자**

| 이름 | 유효 범위 | 설명 |
|:--|:--|:--|
| `<s_article_rep>` | 글이 있는 페이지 전반 | 글 그룹 치환자 (최상위) |
| `<s_article_rep_thumbnail>` | `<s_article_rep>`/`<s_permalink_article_rep>`/`<s_index_article_rep>` 내부 | 대표 이미지가 있을 때만 렌더 |
| `<s_rp_count>` | `<s_article_rep>` 내부 | 댓글 개수 영역 (치환 여부로 댓글 유무 구분) |
| `<s_ad_div>` | `<s_article_rep>` 내부 | 관리 권한자에게만 노출되는 관리 링크 영역 |
| `<s_tag_label>` | `<s_article_rep>` 내부 (보통 permalink) | 글에 달린 태그 표시 영역 |
| `<s_permalink_article_rep>` | `<s_article_rep>` 내부 | permalink 페이지일 때만 렌더 (내부 치환자는 `<s_article_rep>`와 동일) |
| `<s_index_article_rep>` | `<s_article_rep>` 내부 | 인덱스(목록 안에 글) 일 때만 렌더. `[##_article_rep_summary_##]` 추가로 사용 가능 |

**값 치환자 (`<s_article_rep>` 내부 공통)**

| 이름 | 설명 |
|:--|:--|
| `[##_article_rep_link_##]` | 글의 고유 주소 (permalink URL) |
| `[##_article_rep_title_##]` | 글 제목 |
| `[##_article_rep_category_link_##]` | 카테고리 목록 링크 URL |
| `[##_article_rep_category_##]` | 카테고리 이름 |
| `[##_article_rep_date_##]` | 글쓴 날짜/시간 (`yyyy. m. d. HH:MM`) |
| `[##_article_rep_simple_date_##]` | 글쓴 날짜 (`yyyy. m. d.`) |
| `[##_article_rep_date_year_##]` | 연도 `yyyy` |
| `[##_article_rep_date_month_##]` | 월 `mm` |
| `[##_article_rep_date_day_##]` | 일 `dd` |
| `[##_article_rep_date_hour_##]` | 시 `HH` |
| `[##_article_rep_date_minute_##]` | 분 `MM` |
| `[##_article_rep_date_second_##]` | 초 `SS` |
| `[##_article_rep_author_##]` | 작성자 이름 (*팀블로그용) |
| `[##_article_rep_desc_##]` | 본문 내용 (HTML) |
| `[##_article_rep_rp_link_##]` | 댓글을 열고 닫는 onclick 이벤트 핸들러 |
| `[##_article_rep_summary_##]` | **`<s_index_article_rep>` 내부에서만 유효**. 글 내용 요약 |

**썸네일 (`<s_article_rep_thumbnail>` 내부)**

| 이름 | 설명 |
|:--|:--|
| `[##_article_rep_thumbnail_url_##]` | 대표 이미지 썸네일 주소 |
| `[##_article_rep_thumbnail_raw_url_##]` | 대표 이미지 원본 주소 |

**댓글 수 (`<s_rp_count>` 내부)**

| 이름 | 설명 |
|:--|:--|
| `[##_article_rep_rp_cnt_##]` | 답글 수 (정수) |

**관리 기능 (`<s_ad_div>` 내부)** — 권한 있는 사용자에게만 렌더

| 이름 | 설명 |
|:--|:--|
| `[##_s_ad_m_link_##]` | 수정 페이지 링크 |
| `[##_s_ad_m_onclick_##]` | 수정 onclick 이벤트 (팝업 형태) |
| `[##_s_ad_s1_label_##]` | 글의 현재 상태 라벨 (공개/비공개 등) |
| `[##_s_ad_s2_onclick_##]` | 상태 변경 onclick 이벤트 |
| `[##_s_ad_s2_label_##]` | 변경될 이후 상태 라벨 |
| `[##_s_ad_t_onclick_##]` | 트랙백 onclick 이벤트 |
| `[##_s_ad_d_onclick_##]` | 삭제 onclick 이벤트 |

**태그 라벨 (`<s_tag_label>` 내부)**

| 이름 | 설명 |
|:--|:--|
| `[##_tag_label_rep_##]` | 태그 반복 출력 (이미 포맷된 HTML 한 덩어리로 치환됨) |

### 3.3 관련글 / 이전·다음 글 (출처 9)

**카테고리의 다른 글 `<s_article_related>`** — 글이 카테고리에 속한 경우에만 렌더.

| 치환자 | 설명 |
|:--|:--|
| `<s_article_related_rep>` | 반복 블록 |
| `[##_article_related_rep_type_##]` | 글 타입 (썸네일 없음: `text_type`, 있음: `thumb_type`) |
| `[##_article_related_rep_link_##]` | 글 주소 |
| `[##_article_related_rep_title_##]` | 글 제목 |
| `[##_article_related_rep_date_##]` | 발행 시간 |
| `<s_article_related_rep_thumbnail>` | 썸네일 있을 때만 렌더 |
| `[##_article_related_rep_thumbnail_link_##]` | 썸네일 URL |

**이전 글 `<s_article_prev>`** — 이전 글이 있을 때만 렌더.

| 치환자 | 설명 |
|:--|:--|
| `[##_article_prev_type_##]` | 타입 (`text_type`/`thumb_type`) |
| `[##_article_prev_link_##]` | 글 주소 |
| `[##_article_prev_title_##]` | 글 제목 |
| `[##_article_prev_date_##]` | 작성시간 |
| `<s_article_prev_thumbnail>` | 썸네일 있을 때만 |
| `[##_article_prev_thumbnail_link_##]` | 썸네일 URL |

**다음 글 `<s_article_next>`** — 다음 글이 있을 때만 렌더.

| 치환자 | 설명 |
|:--|:--|
| `[##_article_next_type_##]` | 타입 |
| `[##_article_next_link_##]` | 글 주소 |
| `[##_article_next_title_##]` | 글 제목 |
| `[##_article_next_date_##]` | 작성시간 |
| `<s_article_next_thumbnail>` | 썸네일 있을 때만 |
| `[##_article_next_thumbnail_link_##]` | 썸네일 URL |

### 3.4 공지사항(Notice) 치환자 (출처 11)

**그룹**: `<s_notice_rep>` (permalink / 인덱스 분기는 글과 동일 패턴)

| 값 치환자 | 설명 |
|:--|:--|
| `[##_notice_rep_link_##]` | 공지 고유 주소 |
| `[##_notice_rep_title_##]` | 제목 |
| `[##_notice_rep_date_##]` | 발행 날짜/시간 (`yyyy.mm.dd HH:MM`) |
| `[##_notice_rep_simple_date_##]` | 날짜만 (`yyyy.mm.dd`) |
| `[##_notice_rep_date_year_##]` ~ `_second_##` | 세부 시간 (연/월/일/시/분/초) |
| `[##_notice_rep_desc_##]` | 본문 |
| `[##_notice_rep_author_##]` | 작성자 이름 (*팀블로그용) |
| `[##_notice_rep_summary_##]` | **`<s_index_article_rep>` 내부에서만 유효**. 본문 일부 |
| `<s_notice_rep_thumbnail>` | 썸네일 있을 때만 렌더 |
| `[##_notice_rep_thumbnail_url_##]` | 썸네일 주소 |
| `[##_notice_rep_thumbnail_raw_url_##]` | 원본 주소 |

> 참고: Ray 테마는 공지 permalink에서 `[##_notice_rep_desc_##]` 로 본문을 표시한다.

### 3.5 페이지(Page) 치환자 (출처 13)

**그룹**: `<s_page_rep>`

> 공식 원문: "스킨에 페이지 치환자가 존재하지 않는 경우 글 치환자에 페이지가 표시됩니다."

즉 `<s_page_rep>` 를 아예 안 쓰면 `<s_article_rep>` 가 폴백 역할을 한다.

내부 치환자는 글 치환자와 공유:
`[##_article_rep_link_##]`, `[##_article_rep_title_##]`, `[##_article_rep_date_##]`, `[##_article_rep_simple_date_##]`, `[##_article_rep_date_year_##]` ~ `_second_##`, `[##_article_rep_desc_##]`, `[##_article_rep_author_##]` (팀블로그용).

### 3.6 보호글(Protected) 치환자 (출처 12)

**그룹**: `<s_article_protected>`

공유 값 치환자는 글과 동일 (`[##_article_rep_link_##]` 등). 보호글 전용:

| 이름 | 설명 |
|:--|:--|
| `[##_article_password_##]` | 비밀번호 입력 박스 Id값 (label용) |
| `[##_article_dissolve_##]` | 비밀번호 입력 후 엔터/확인 눌렀을 때 실행될 JS 코드가 치환됨 |

공식 예제 HTML (protected.md 원문):

```html
<s_article_protected>
  <div class="entryProtected">
    <h2><a href="[##_article_rep_link_##]">[##_article_rep_title_##]</a></h2>
    <span class="date">[##_article_rep_date_##]</span>
    <p>보호되어 있는 글입니다. 내용을 보시려면 비밀번호를 입력하세요.</p>
    <p>
      <label for="[##_article_password_##]">비밀번호 ::</label>
      <input type="password" maxlength="16" id="[##_article_password_##]"
             name="[##_article_password_##]" value=""
             onkeydown="if (event.keyCode == 13)[##_article_dissolve_##]" />
      <input type="button" class="submit" value="submit"
             onclick="[##_article_dissolve_##]" />
    </p>
  </div>
</s_article_protected>
```

### 3.7 리스트(List) 치환자 — 카테고리/태그/검색 공용 (출처 16)

**그룹**

| 이름 | 설명 |
|:--|:--|
| `<s_list>` | 리스트 최상위 |
| `<s_list_empty>` | 결과 0건일 때 렌더 |
| `<s_list_rep>` | 아이템 반복 |
| `<s_list_image>` | 리스트 대표 이미지가 있을 때만 |
| `<s_list_rep_thumbnail>` | 아이템 썸네일 있을 때만 |

**값 (`<s_list>` 내부)**

| 이름 | 설명 |
|:--|:--|
| `[##_list_conform_##]` | 카테고리 이름 / 검색어 / 태그명 (페이지 상황에 맞게 치환) |
| `[##_list_count_##]` | 결과 총 개수 |
| `[##_list_description_##]` | 리스트 설명 (카테고리면 카테고리 설명, 그 외는 블로그 설명) |
| `[##_list_style_##]` | 리스트 스타일 값 (`class` 속성에 넣어 활용) |
| `[##_list_image_##]` | (`<s_list_image>` 내부) 리스트 대표 이미지 |

**값 (`<s_list_rep>` 내부, 반복)**

| 이름 | 설명 |
|:--|:--|
| `[##_list_rep_link_##]` | 글 고유 주소 |
| `[##_list_rep_regdate_##]` | 작성일 `yyyy.mm.dd` |
| `[##_list_rep_date_year_##]` ~ `_second_##` | 세부 시간 |
| `[##_list_rep_title_##]` | 글 제목 (새 글 표시 이미지 태그 **포함**) |
| `[##_list_rep_title_text_##]` | 글 제목 (순수 텍스트) |
| `[##_list_rep_category_##]` | 카테고리 이름 |
| `[##_list_rep_category_link_##]` | 카테고리 목록 URL |
| `[##_list_rep_rp_cnt_##]` | 댓글 수 |
| `[##_list_rep_author_##]` | 작성자 이름 |
| `[##_list_rep_summary_##]` | 본문 요약 |
| `[##_list_rep_thumbnail_url_##]` | 대표 이미지 원본 주소 |
| `[##_list_rep_thumbnail_##]` | (`<s_list_rep_thumbnail>` 내부) 대표 이미지 |

### 3.8 페이징 (출처 17)

**그룹**: `<s_paging>` → `<s_paging_rep>`. 리스트/글(permalink 목록 이동)/방명록 공용.

| 이름 | 설명 |
|:--|:--|
| `[##_prev_page_##]` | 이전 페이지 링크 (`href="…"` 형태 속성 블록) |
| `[##_paging_rep_link_##]` | 현재 반복의 페이지 링크 (`href="…"` 속성 블록) |
| `[##_paging_rep_link_num_##]` | 페이지 번호 |
| `[##_next_page_##]` | 다음 페이지 링크 |
| `[##_no_more_prev_##]` | 이전이 없을 때 class로 사용 (Ray 테마 예: `class="[##_no_more_prev_##]"`) |
| `[##_no_more_next_##]` | 다음이 없을 때 class로 사용 |

> 공식 예 (paging.md):
> ```html
> <s_paging>
>   <div class="paging">
>     <a [##_prev_page_##] class="[##_no_more_prev_##]">◀ PREV </a>
>     <span class="numbox">
>       <s_paging_rep>
>         <a [##_paging_rep_link_##] class="num">[[##_paging_rep_link_num_##]]</a>
>       </s_paging_rep>
>     </span>
>     <a [##_next_page_##] class="[##_no_more_next_##]">NEXT ▶</a>
>   </div>
> </s_paging>
> ```

> 주의: `[##_prev_page_##]` / `[##_next_page_##]` / `[##_paging_rep_link_##]` 는 **URL 문자열이 아니라 `href="..."` 속성 블록** 형태로 치환된다. `<a [##_prev_page_##]>` 처럼 태그 속성 위치에 그대로 쓴다.

### 3.9 태그 클라우드(tag) (출처 14)

**URL**: `/tag` (공식 표기).

| 이름 | 설명 |
|:--|:--|
| `<s_tag>` | 태그 클라우드 그룹 치환자 |
| `<s_tag_rep>` | 개별 태그 반복 |
| `[##_tag_link_##]` | 태그가 포함된 글을 출력하기 위한 URL |
| `[##_tag_class_##]` | 사용 빈도에 따른 등급. 총 5단계 `cloud1` ~ `cloud5` (1이 가장 많이 사용) |
| `[##_tag_name_##]` | 태그 이름 |

### 3.10 댓글(Comment) — 현행(권장) (출처 10, `[##_comment_group_##]`)

공식 문서는 **두 방식**을 모두 설명한다.

#### 3.10.1 간이 방식 — `[##_comment_group_##]`

> 공식 원문 (contents/comment.md):
> "기본 댓글 치환자로, **댓글 개수**, **댓글 리스트**, **댓글 작성폼**을 출력합니다."
> "기본 댓글 치환자만 작성하는 것으로 댓글 화면을 구성할 수 있습니다. 별도의 css를 작성하지 않아도 기본 스타일이 적용되며, css를 추가하여 원하는 디자인을 사용할 수도 있습니다."
> "기능이 추가됨에 따라 html을 수정하지 않아도 됩니다."

서버에서는 `<div data-tistory-react-app="Comment"></div>` 하나로 렌더된 뒤, 클라이언트에서 React 앱이 실제 DOM을 주입한다. 최종 DOM은 `.tt-comment-cont`, `.tt-area-reply`, `.tt-list-reply`, `.tt-item-reply`, `.tt-area-write` 등 `tt-` 프리픽스 클래스로 구성된다.

- 핀고정 댓글 영역, 이전 댓글 더보기 버튼, 로그인/비로그인별 작성폼 모두 React 앱이 알아서 처리.
- 스킨이 할 일: `[##_comment_group_##]` 한 줄만 넣고, 필요 시 `.tt-` 클래스들을 대상으로 CSS 커스터마이징.

→ **2026년 시점 신규 스킨 개발에는 이 방식 사용을 공식이 권장**.

#### 3.10.2 수동 방식 — `<s_rp>` + `<s_rp_container>` + `<s_rp_rep>` (레거시)

**그룹 중첩**: `<s_rp>` → (`<s_rp_input_form>`, `<s_rp_container>` → `<s_rp_rep>` → `<s_rp2_container>` → `<s_rp2_rep>`)

**입력 폼 (`<s_rp_input_form>` 내부)**

| 이름 | 설명 |
|:--|:--|
| `[##_article_rep_id_##]` | 댓글 식별용 ID (한 화면 내 고유) |
| `[##_rp_input_comment_##]` | 댓글 입력 textarea의 name |
| `[##_rp_onclick_submit_##]` | 댓글 입력 onclick 이벤트 |
| `<s_rp_member>` | 로그인 안했거나 소유자가 아닐 때 렌더 |
| `[##_rp_input_is_secret_##]` | 비밀글 체크박스 name |
| `<s_rp_guest>` | 로그인 안 했을 때만 렌더 |
| `[##_rp_input_name_##]` | 이름 입력 박스 name |
| `[##_guest_name_##]` | 이름 (기본값) |
| `[##_rp_input_password_##]` | 비밀번호 입력 박스 name |
| `[##_rp_password_##]` | 비밀번호 (기본값) |
| `[##_rp_input_homepage_##]` | 홈페이지 입력 박스 name |
| `[##_guest_homepage_##]` | 홈페이지 (기본값) |

**리스트 (`<s_rp_rep>` 내부)**

| 이름 | 설명 |
|:--|:--|
| `[##_rp_rep_id_##]` | 댓글 고유 ID |
| `[##_rp_rep_class_##]` | 댓글 CSS 클래스 (admin 아이콘 포함) |
| `[##_rp_rep_name_##]` | 작성자 이름 |
| `[##_rp_rep_logo_##]` | 프로필 이미지 (URL) |
| `[##_rp_rep_date_##]` | 작성 날짜 |
| `[##_rp_rep_desc_##]` | 본문 |
| `[##_rp_rep_link_##]` | 댓글 주소 |
| `[##_rp_rep_onclick_delete_##]` | 삭제 onclick |
| `[##_rp_rep_onclick_reply_##]` | 답글 쓰기 onclick |

대댓글은 `<s_rp2_container>` → `<s_rp2_rep>` 안에서 동일한 치환자를 다시 사용한다.

### 3.11 방명록(Guestbook) (출처 15)

**URL**: `/guestbook`

#### 3.11.1 간이 방식 — `[##_guestbook_group_##]`

댓글과 동일한 React 컴포넌트 패턴(`<div data-tistory-react-app="Comment"></div>`)으로 렌더된다. 공식 원문:

> "기본 방명록 치환자로, 방명록 개수, 방명록 리스트, 방명록 작성폼을 출력합니다."

**권장 방식**이며 필요 최소 코드는 `[##_guestbook_group_##]` 한 줄.

#### 3.11.2 수동 방식 — `<s_guest>` 계열

**그룹 중첩**: `<s_guest>` → (`<s_guest_input_form>`, `<s_guest_container>` → `<s_guest_rep>` → `<s_guest_reply_container>` → `<s_guest_reply_rep>`)

**입력 폼 (`<s_guest_input_form>` 내부)**

| 이름 | 설명 |
|:--|:--|
| `[##_guest_textarea_body_##]` | 내용 textarea name |
| `[##_guest_onclick_submit_##]` | 등록 onclick |
| `<s_guest_member>` | 비로그인/비소유자에게만 렌더 |
| `<s_guest_form>` | 비로그인에게만 렌더 |
| `[##_guest_input_name_##]` | 이름 input name |
| `[##_guest_name_##]` | 이름 기본값 |
| `[##_guest_input_password_##]` | 비밀번호 input name |
| `[##_guest_password_##]` | 비밀번호 기본값 |
| `[##_guest_input_homepage_##]` | 홈페이지 input name |
| `[##_guest_homepage_##]` | 홈페이지 기본값 |

**리스트 (`<s_guest_rep>` 내부)**

| 이름 | 설명 |
|:--|:--|
| `[##_guest_rep_id_##]` | 방명록 고유 ID |
| `[##_guest_rep_class_##]` | CSS 클래스 (admin 아이콘 포함) |
| `[##_guest_rep_name_##]` | 이름 |
| `[##_guest_rep_date_##]` | 날짜 |
| `[##_guest_rep_desc_##]` | 내용 |
| `[##_guest_rep_logo_##]` | 작성자 프로필 이미지 |
| `[##_guest_rep_onclick_delete_##]` | 삭제 onclick |
| `[##_guest_rep_onclick_reply_##]` | 답글(수정) onclick |

### 3.12 홈 커버 (출처 7)

**그룹 중첩**:
`<s_cover_group>` → `<s_cover_rep>` → `<s_cover name="…">` → (`[##_cover_title_##]`, `<s_cover_url>`, `<s_cover_item>` → `<s_cover_item_article_info>` / `<s_cover_item_not_article_info>`)

| 치환자 | 설명 |
|:--|:--|
| `<s_cover>` (속성 `name`) | 개별 커버. `name`은 `index.xml`의 `<cover><item><name>` 과 일치해야 사용됨. 정의되지 않은 이름은 무시 |
| `[##_cover_title_##]` | 커버 타이틀 |
| `<s_cover_url>` | 커버에 URL이 있는 경우만 렌더 |
| `[##_cover_url_##]` | 커버 URL |
| `<s_cover_item>` | 아이템 반복 |
| `<s_cover_item_not_article_info>` | 아이템이 "글"이 아닌 경우(CUSTOM)에만 렌더 |
| `<s_cover_item_article_info>` | 아이템이 "글"인 경우(RECENT)에만 렌더 |
| `[##_cover_item_title_##]` | 아이템 제목 |
| `[##_cover_item_summary_##]` | 아이템 요약/본문 |
| `[##_cover_item_url_##]` | 아이템 URL |
| `<s_cover_item_thumbnail>` | 아이템 이미지 있을 때만 |
| `[##_cover_item_thumbnail_##]` | 아이템 이미지 |
| `[##_cover_item_category_##]` | (article 전용) 카테고리 이름 |
| `[##_cover_item_category_url_##]` | (article 전용) 카테고리 URL |
| `[##_cover_item_date_##]` | (article 전용) 발행 시간 (`yyyy.mm.dd HH:MM`) |
| `[##_cover_item_simple_date_##]` | (article 전용) 발행 날짜 (`yyyy.mm.dd`) |
| `[##_cover_item_comment_count_##]` | (article 전용) 댓글 수 |

### 3.13 사이드바 (출처 18~26)

#### 3.13.1 구조

`<s_sidebar>` 안에 여러 `<s_sidebar_element>` 를 넣는다. `<s_sidebar_element>` 의 첫 줄 주석 `<!-- 타이틀 -->` 이 관리자 편집 화면에서 타이틀로 사용된다.

`<s_sidebar>` 는 **여러 번 선언 가능** (왼쪽/오른쪽/기타 영역 분리용).

#### 3.13.2 최근 공지 (`<s_rct_notice>`)

| 이름 | 설명 |
|:--|:--|
| `<s_rct_notice>` | 최근 공지 그룹 |
| `<s_rct_notice_rep>` | 반복 |
| `[##_notice_rep_link_##]` | 공지 주소 |
| `[##_notice_rep_title_##]` | 제목 |

#### 3.13.3 최근 글 (`<s_rctps_rep>`)

| 이름 | 설명 |
|:--|:--|
| `<s_rctps_rep>` | 최근 글 반복 |
| `[##_rctps_rep_link_##]` | 글 주소 |
| `[##_rctps_rep_title_##]` | 제목 |
| `[##_rctps_rep_rp_cnt_##]` | 댓글 수 |
| `[##_rctps_rep_author_##]` | 작성자 (*팀블로그용) |
| `[##_rctps_rep_date_##]` | 발행 시간 (`yyyy.mm.dd HH:MM`) |
| `[##_rctps_rep_simple_date_##]` | 발행 날짜 (`yyyy.mm.dd`) |
| `<s_rctps_rep_thumbnail>` | 썸네일 있을 때만 |
| `[##_rctps_rep_thumbnail_##]` | 썸네일 |
| `[##_rctps_rep_category_##]` | 카테고리 이름 |
| `[##_rctps_rep_category_link_##]` | 카테고리 URL |

#### 3.13.4 인기글 (`<s_rctps_popular_rep>`)

내부 값 치환자는 최근 글과 동일 (`[##_rctps_rep_*_##]`). **그룹 이름만 `<s_rctps_popular_rep>` 로 다르다.**

#### 3.13.5 최근 댓글 (`<s_rctrp_rep>`)

| 이름 | 설명 |
|:--|:--|
| `[##_rctrp_rep_link_##]` | 댓글로 이동할 URL |
| `[##_rctrp_rep_desc_##]` | 본문 일부 |
| `[##_rctrp_rep_name_##]` | 작성자 이름 |
| `[##_rctrp_rep_time_##]` | 작성 시간 |

#### 3.13.6 카테고리 (값 치환자만)

| 이름 | 설명 |
|:--|:--|
| `[##_category_##]` | **폴더(트리) 형식** 카테고리. 펼침/접기 동작 포함 (티스토리가 렌더링한 `<table>` 또는 `<ul>` HTML 한 덩어리) |
| `[##_category_list_##]` | **리스트 형식** 카테고리. `<ul class="tt_category">` → `<li>` → `<ul class="category_list">` 구조. Ray 테마는 이 쪽을 사용 |

> 참고: HTML 구조(파생 자료 기반, **확인 필요**): `ul.tt_category > li > ul.category_list > li > ul.sub_category_list > li`. 공식 문서에는 내부 DOM 구조가 명시되지 않는다.

#### 3.13.7 랜덤 태그 (`<s_random_tags>`)

**주의**: 태그 클라우드 페이지(`<s_tag>`)와 **다른 그룹 이름**이다. 사이드바 전용.

| 이름 | 설명 |
|:--|:--|
| `<s_random_tags>` | 태그 반복 |
| `[##_tag_link_##]` | 태그 주소 |
| `[##_tag_class_##]` | `cloud1` ~ `cloud5` (빈도 등급) |
| `[##_tag_name_##]` | 태그 이름 |

#### 3.13.8 방문자수 (값 치환자)

| 이름 | 설명 |
|:--|:--|
| `[##_count_total_##]` | 총 방문자 |
| `[##_count_today_##]` | 오늘 방문자 |
| `[##_count_yesterday_##]` | 어제 방문자 |

#### 3.13.9 검색 폼 (`<s_search>`)

| 이름 | 설명 |
|:--|:--|
| `<s_search>` | 검색 입력폼 그룹 |
| `[##_search_name_##]` | 검색어 input name |
| `[##_search_text_##]` | 검색어(현재 검색 결과 페이지에서는 입력한 값이 치환) |
| `[##_search_onclick_submit_##]` | 검색 onclick / onsubmit |

> 공식 예 (search.md):
> ```html
> <s_search>
>   <input type="text" name="[##_search_name_##]" value="[##_search_text_##]"
>          onkeypress="if (event.keyCode == 13) { [##_search_onclick_submit_##] }"/>
>   <input value="검색" type="button" onclick="[##_search_onclick_submit_##]" />
> </s_search>
> ```

### 3.14 Ray 테마에서만 확인된 추가 치환자 (출처 27)

공식 가이드에는 없지만 **공식 Ray 테마 `skin.html` 에서 실제 사용되는** 치환자. 기능은 존재하지만 공식 문서화는 누락된 상태다(**확인 필요 — 문서 누락**).

| 치환자 | 용도 | 근거 |
|:--|:--|:--|
| `[##_owner_url_##]` | 소유자 관리 URL (예: 글쓰기, 관리) | Ray `skin.html` 에서 `[##_owner_url_##]/entry/post`, `[##_owner_url_##]` 사용 |
| `<s_link_rep>` / `[##_link_url_##]` / `[##_link_site_##]` | 사이드바 링크 모듈 반복 | Ray `s_link_rep` 블록 |
| `[##_calendar_##]` | 달력 모듈 (`<table class="calendar">` 한 덩어리) | Ray 사이드바에서 직접 사용. 포스트가 있는 날짜는 `<a class="cal_click" href="/archive/YYYYMMDD/">` 링크로 치환 |
| `<s_archive_rep>` / `[##_archive_rep_link_##]` / `[##_archive_rep_date_##]` / `[##_archive_rep_count_##]` | 글 보관함(월별) 목록 | Ray `s_archive_rep` 블록 |

> 이들은 "사용해도 동작하지만 공식 치환자 문서에는 빠져 있는" 항목이다. 신뢰도를 위해서라도 기능상 대체 가능하면 공식 문서화된 치환자(예: `[##_category_list_##]`, 사이드바 최근 글)로 대체하는 편이 안전하다.

---

## 4. index.xml 스펙

### 4.1 최상위 구조 (출처 4, index.xml.md 원문)

```xml
<?xml version="1.0" encoding="utf-8"?>
<skin>
  <information>
    <name>기본 스킨</name>
    <version>1.1</version>
    <description><![CDATA[웹표준을 준수한 XHTML 기반의 Tistory 기본 스킨입니다.]]></description>
    <license><![CDATA[자유롭게 수정이 가능하며, 저작권 표시하에 재배포 가능합니다.]]></license>
  </information>
  <author>
    <name>tistory</name>
    <homepage>http://notice.tistory.com</homepage>
    <email>tistoryblog@daum.net</email>
  </author>
  <default>
    <!-- ... 기본값 ... -->
  </default>
  <!-- 선택: <cover>, <variables>, <liststyle> -->
</skin>
```

### 4.2 `<information>` 기본 정보

| 필드 | 설명 |
|:--|:--|
| `name` | 목록에 표시되는 스킨 이름 |
| `version` | 스킨 버전 문자열 |
| `description` | 상세 설명 (CDATA 권장) |
| `license` | 저작권/라이선스 설명 (CDATA 권장) |

### 4.3 `<author>` 제작자

| 필드 | 설명 |
|:--|:--|
| `name` | 제작자명 |
| `homepage` | 제작자 웹사이트 |
| `email` | 연락 이메일 |

### 4.4 `<default>` 기본값 (공식 원문 표)

공식 문서가 명시한 기본값 필드:

| 필드 | 설명 |
|:--|:--|
| `recentEntries` | 사이드바 최근글 개수 |
| `recentComments` | 사이드바 최근 댓글 개수 |
| `recentTrackbacks` | 사이드바 최근 트랙백 개수 |
| `itemsOnGuestbook` | 한 페이지 방명록 개수 |
| `tagsInCloud` | 사이드바 태그 개수 |
| `sortInCloud` | 태그 클라우드 정렬 방식 (`1`:인기도순, `2`:이름순, `3`:랜덤) |
| `expandComment` | 댓글 영역 초기 상태 (`0`:감추기, `1`:펼치기) |
| `expandTrackback` | 트랙백 영역 초기 상태 (`0`:감추기, `1`:펼치기) |
| `lengthOfRecentNotice` | 최근 공지 표현 글자수 |
| `lengthOfRecentEntry` | 최근 글 표현 글자수 |
| `lengthOfRecentComment` | 최근 댓글 표현 글자수 |
| `lengthOfRecentTrackback` | 최근 트랙백 표현 글자수 |
| `lengthOfLink` | 링크 표현 글자수 |
| `entriesOnPage` | 홈 화면 글 개수 |
| `entriesOnList` | 글 목록 글 개수 |
| `showListOnCategory` | 커버 미사용 홈에서의 표시 방식 (`0`:내용만, `1`:목록만, `2`:내용+목록) |
| `showListLock` | 홈 설정의 '목록 구성 요소' 노출 (`0`:노출, `1`:노출 안 함) |
| `tree.color` | 카테고리 글자색 |
| `tree.bgColor` | 카테고리 배경색 |
| `tree.activeColor` | 선택 시 글자색 |
| `tree.activeBgColor` | 선택 시 배경색 |
| `tree.labelLength` | 카테고리 글자 수 |
| `tree.showValue` | 카테고리 글 수 표시 (`0`:숨김, `1`:보임) |
| `contentWidth` | 콘텐츠 영역 가로 사이즈 (에디터 WYSIWYG 폭) |
| `commentMessage.none` | 댓글 0개일 때 문구 (HTML 가능) |
| `commentMessage.single` | 댓글 1개일 때 문구 |
| `trackbackMessage.none` | 트랙백 0개일 때 문구 |
| `trackbackMessage.single` | 트랙백 1개일 때 문구 |
| `cover` | 홈 커버 기본값 (JSON 문자열, § 4.5 참조) |
| `liststyle` | 기본 리스트 스타일 값 (§ 4.6 참조) |

### 4.5 `<cover>` 홈 커버 정의 (index.xml)

스킨 편집기에 보여줄 **커버 아이템을 정의**한다. 실제 매핑은 `skin.html` 의 `<s_cover name="…">` 와 일치해야 한다.

```xml
<cover>
  <item>
    <name>featured</name>
    <label><![CDATA[Featured]]></label>
    <description><![CDATA[강조할 글을 표시합니다.]]></description>
  </item>
  <item>
    <name>list</name>
    <label><![CDATA[리스트]]></label>
    <description><![CDATA[글 리스트를 표시합니다.]]></description>
  </item>
</cover>
```

**기본값 (`<default><cover>` 안 JSON 문자열)**:

```json
[
  {
    "name": "featured",
    "title": "",
    "dataType": "CUSTOM",
    "data": [
      { "title": "...", "summary": "...", "url": "...", "thumbnail": "..." }
    ]
  },
  {
    "name": "list",
    "title": "",
    "dataType": "RECENT",
    "data": { "category": "ALL", "size": 5 }
  }
]
```

- `dataType` 는 `RECENT` 또는 `CUSTOM` 만 허용. (공식 원문: "스킨 에디터에서 제공하는 유형 중 '최신 글', '직접 입력' 만 사용할 수 있습니다.")
- `RECENT.category` 는 사용자 카테고리를 미리 알 수 없으므로 `ALL` 또는 `NOTICE` 만 허용.
- `RECENT.size` 는 1~100 사이.

### 4.6 `<liststyle>` 리스트 스타일 정의 (index.xml)

카테고리마다 목록 뷰를 바꾸기 위한 선택지를 정의한다. 사용자가 선택한 값이 `[##_list_style_##]` 로 치환된다.

```xml
<default>
  <liststyle>grid</liststyle>
</default>

<liststyle>
  <item><label>기본</label><value>default</value></item>
  <item><label>그리드</label><value>grid</value></item>
</liststyle>
```

### 4.7 `<variables>` 스킨 옵션 정의 (출처 8, variable.md)

사용자가 티스토리 스킨 편집 UI에서 편집 가능한 변수. 스킨 코드에서는 3가지 치환자로 접근:

| 치환자 | 의미 |
|:--|:--|
| `<s_if_var_{VARIABLE_NAME}>…</s_if_var_{VARIABLE_NAME}>` | 값이 있으면(BOOL이면 true이면) 렌더 |
| `<s_not_var_{VARIABLE_NAME}>…</s_not_var_{VARIABLE_NAME}>` | 값이 없으면(BOOL이면 false이면) 렌더 |
| `[##_var_{VARIABLE_NAME}_##]` | 값 자체 |

**정의 구조**:

```xml
<variables>
  <variablegroup name="그룹이름">
    <variable>
      <name>치환자에서 사용할 이름</name>
      <label>사용자에게 표시할 이름</label>
      <description>설명(선택)</description>
      <type>STRING | SELECT | IMAGE | BOOL | COLOR</type>
      <option>max/min/select 옵션 (선택, SELECT는 필수)</option>
      <default>기본값</default>
    </variable>
  </variablegroup>
</variables>
```

**`type` 종류** (공식 5가지):

- `STRING`: 문자 입력
- `SELECT`: 옵션 선택. `<option>` 에 name/label/value JSON 배열 필수
- `IMAGE`: 이미지 URL
- `BOOL`: true/false
- `COLOR`: `#RRGGBB`

**SELECT 예**:

```xml
<option><![CDATA[
  [
    {"name":"light", "label":"밝은색", "value":"light"},
    {"name":"dark", "label":"어두운색", "value":"dark"}
  ]
]]></option>
```

**BOOL 예** (공식 문서 variable.md 전체 예시):

```xml
<variablegroup>
  <variable>
    <name>scroll-load</name>
    <label><![CDATA[ 무한스크롤 ]]></label>
    <type>BOOL</type>
    <option />
    <default>true</default>
    <description><![CDATA[ 글 리스트 끝에 다다르면 다음 페이지를 불러옵니다. ]]></description>
  </variable>
</variablegroup>
```

**스킨 코드에서의 사용 (공식 variable.md 예)**:

```html
<s_if_var_scroll-load>
  <style>
    .article_skin .area_paging .inner_paging.scroll_spinner {
      width:48px; height:48px;
      background:url('./images/spinner.gif') no-repeat;
    }
  </style>
  <script src="./images/scroll-load.js"></script>
</s_if_var_scroll-load>
```

```html
<style>
  .wrap_sub {
    background-image: url('[##_var_cover-image_##]');
  }
</style>
```

---

## 5. 관련글 · 이전/다음 · 페이지네이션 · 더보기

### 5.1 관련글 (카테고리의 다른 글)

- **그룹**: `<s_article_related>` → `<s_article_related_rep>` (반복)
- permalink에서 해당 글이 속한 카테고리의 다른 글을 보여준다.
- **카테고리에 속하지 않은 글에는 표시되지 않음** (공식 원문).
- 자동 생성이라 **JS로 직접 만들 필요 없음**.
- 치환자 상세: § 3.3 참조.

### 5.2 이전 글 / 다음 글

- **그룹**: `<s_article_prev>`, `<s_article_next>`
- 이전/다음이 없으면 블록 자체가 렌더되지 않음 (→ 공백 처리 자동).
- **페이지네이션의 이전/다음 페이지 URL과 동일한 글을 가리킨다** (공식 원문).
- 치환자 상세: § 3.3 참조.

### 5.3 페이지네이션 (`<s_paging>`)

- **리스트/글/방명록 공용** (공식 원문 paging.md).
- `[##_prev_page_##]`, `[##_next_page_##]`, `[##_paging_rep_link_##]` 는 **URL이 아닌 `href="…"` 속성 블록** 형태로 치환된다. 태그 속성 위치에 그대로 넣어야 한다.
- `[##_no_more_prev_##]`, `[##_no_more_next_##]` 는 끝 페이지일 때 disable 클래스명을 자동 부여 (Ray 테마 예).

### 5.4 "더보기" 패턴

공식 치환자 중 "더보기" 전용은 없다. 관행:

- 홈 커버 "더보기": `<s_cover_url>` 내부에서 `<a href="[##_cover_url_##]">더보기</a>`.
- 관련글 "더보기": `<a href="[##_article_rep_category_link_##]">more</a>` (카테고리로 이동).
- 무한 스크롤: `<variable name="scroll-load">` + 클라이언트 JS로 다음 페이지 요청. Ray 테마가 실제로 이 패턴을 문서화 예제로 쓴다.

---

## 6. 모바일 처리

### 6.1 PC 스킨과 모바일 스킨 통합 여부

- **공식 문서에는 "모바일 스킨"을 별도로 언급하는 섹션이 없다**. `common/files.md` 의 파일 트리에도 모바일 전용 파일은 포함되지 않는다.
- 공식 레퍼런스 Ray 테마는 **단일 `skin.html` + CSS 미디어 쿼리로 반응형**으로 구현되어 있다.
- 따라서 **"단일 `skin.html` + 미디어 쿼리 반응형"이 공식 권장 방식**으로 보는 것이 타당하다.
- 참고: 과거 티스토리 관리자에는 "모바일 웹 자동 변환" 옵션이 존재했다. 반응형 스킨을 쓸 때는 이 옵션을 **끄고** 반응형 스킨 하나로 운영하는 것이 Ray 테마가 설명하는 패턴이다. (**확인 필요 — 2026년 현재 관리 UI 메뉴명**)

### 6.2 viewport 설정 (Ray 테마 기준)

```html
<meta name="viewport" content="user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, width=device-width">
```

> 개인 개발 블로그라면 줌 제한은 풀어주는 게 접근성에 낫다:
> ```html
> <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
> ```

### 6.3 반응형 구현 권장 패턴

- `body[id]` (= `[##_body_id_##]`) 기준 페이지별 레이아웃 분기.
- 브레이크포인트: 대략 `768px` (모바일/태블릿), `1024px` (태블릿/데스크톱), `1280px` (와이드) 수준. **이 수치는 공식 규정이 아님** — 각 스킨 제작자가 결정한다.
- 이미지는 `//i1.daumcdn.net/thumb/C{W}x{H}/?fname={rawUrl}` 로 Daum CDN 리사이즈를 태워 쓰는 것이 공식 Ray 테마 패턴이다 (예: `C148x148`).

---

## 7. 검색 / 태그 / 카테고리

### 7.1 검색

- **공식 검색 폼**: `<s_search>` 블록 (치환자 상세 § 3.13.9).
- 입력창 + 버튼 둘 다 `[##_search_onclick_submit_##]` 를 걸어야 submit 된다.
- `[##_search_text_##]` 는 **현재 검색 결과 페이지에서 사용자가 입력했던 검색어**로 치환된다.
- **검색 결과 페이지 URL**: `/search/{검색어}` (Ray 테마의 form action + Ray 관찰 경로). **확인 필요 — 공식 URL 규격 문서 없음**.
- 검색 결과는 `<s_list>` + `<s_list_rep>` 로 렌더되며, `[##_list_conform_##]` 가 검색어로 치환된다.

### 7.2 태그

**태그 클라우드 페이지** (`/tag`):
- `<s_tag>` + `<s_tag_rep>` + `[##_tag_link_##]/[##_tag_class_##]/[##_tag_name_##]` (§ 3.9).

**태그별 글 목록** (보통 `/tag/{태그명}`):
- `<s_list>` + `<s_list_rep>` 로 렌더 (다른 목록과 동일 블록 재사용).
- `[##_list_conform_##]` 가 태그명으로 치환.

**글 상세의 태그 라벨**:
- `<s_tag_label>` 블록 + `[##_tag_label_rep_##]` (§ 3.2). 태그 HTML이 한 덩어리로 치환됨.

**사이드바 랜덤 태그**:
- `<s_random_tags>` (§ 3.13.7). **태그 클라우드 페이지의 `<s_tag>` 와 다른 별도 그룹**이라는 점 주의.

### 7.3 카테고리

**사이드바 카테고리** (§ 3.13.6):
- `[##_category_##]` : 폴더(트리) 형식. 접기/펼치기 포함.
- `[##_category_list_##]` : 리스트 형식. Ray 테마가 선택.

**카테고리 목록 페이지**:
- `<s_list>` + `<s_list_rep>` (위와 동일 블록 재사용).

---

## 8. JS 훅과 제약

### 8.1 필수 JS 훅

- `<s_t3>` 는 **필수**. 치환 후 다음이 삽입된다:
  ```html
  <script type="text/javascript" src="https://t1.daumcdn.net/tistory_admin/blogs/script/blog/common.js"></script>
  <div style="margin:0; padding:0; border:none; background:none; float:none; clear:none; z-index:0"></div>
  ```
- 이 `common.js` 가 **티스토리 인증·댓글 React 앱·관리자 툴바** 등을 담당한다. 제거하면 댓글 작동·관리 기능이 깨진다.

### 8.2 전역 객체·데이터 접근

- 공식 가이드는 전역 JS API를 따로 명시하지 않는다(**확인 필요 — 공식 JS API 문서 없음**).
- `[##_comment_group_##]` / `[##_guestbook_group_##]` 를 쓰면 `<div data-tistory-react-app="Comment">` 에 React 앱이 자동으로 붙는다. 스킨 JS가 개입할 필요 없음.
- 관리 권한 판정은 `<s_ad_div>` / `<s_rp_member>` / `<s_guest_member>` 가 서버 측에서 조건부 렌더하므로, 클라이언트 JS에서 권한 체크는 하지 않는 것이 일반적.

### 8.3 iframe·광고 충돌 주의

- `[##_revenue_list_upper_##]` / `[##_revenue_list_lower_##]` 는 티스토리/카카오 광고 플랫폼이 삽입하는 iframe 광고다. 치환 위치에 따라 레이아웃에 영향을 준다.
- 광고가 `iframe` 으로 삽입되므로 `overflow:hidden` 등으로 의도치 않게 가려지지 않도록 부모 컨테이너 폭·높이를 보장한다.
- 카카오 광고(Adfit)는 레이지 로딩을 내부적으로 하므로, 스킨에서 `display:none` → `block` 토글 시 광고가 로드되지 않을 수 있다(**확인 필요**).

### 8.4 외부 CDN 로드 주의

- Daum/Kakao CDN (`t1.daumcdn.net`, `i1.daumcdn.net`) 는 Ray 테마에서 직접 사용되므로 확실히 허용.
- 그 외 외부 CDN은 HTTPS를 사용하고(혼합 컨텐츠 방지), `async` / `defer` 로 성능 저하 방지.
- jQuery는 Ray 테마가 직접 로드한다:
  ```html
  <!--[if lt IE 9]>
  <script src="//t1.daumcdn.net/tistory_admin/lib/jquery/jquery-1.12.4.min.js"></script>
  <![endif]-->
  <!--[if gte IE 9]><!-->
  <script src="//t1.daumcdn.net/tistory_admin/lib/jquery/jquery-3.2.1.min.js"></script>
  <!--<![endif]-->
  ```
  현대 스킨이라면 IE 조건부 주석은 걷어내고 jQuery 자체도 최소화하거나 제거한다.

### 8.5 한국어·웹폰트 권장

- 한글 웹폰트(Pretendard, Noto Sans KR 등)는 `images/font.css` 로 내부화하거나 `cdn.jsdelivr.net/gh/orioncactus/pretendard/...` 같은 정적 CDN을 `<link rel="stylesheet">` 로 로드한다.
- `font-display: swap` 으로 FOIT 방지.

---

## 9. RSS / robots / 기타

### 9.1 RSS

- 공식 치환자: `[##_rss_url_##]` (블로그 RSS 피드 URL).
- Ray 테마 head 예:
  ```html
  <link rel="alternate" type="application/rss+xml" title="[##_title_##]" href="[##_rss_url_##]" />
  ```

### 9.2 robots.txt / sitemap.xml

- **공식 스킨 가이드에는 robots/sitemap 제공 방식이 언급되지 않는다** (확인 필요).
- 관행: 티스토리가 서비스 레벨에서 `/rss` 와 `/sitemap.xml` 을 자동 제공한다. 스킨에서 별도 설정할 수 없다.

### 9.3 댓글 영역 치환자 정리

신규 스킨은 **댓글은 `[##_comment_group_##]`, 방명록은 `[##_guestbook_group_##]`** 를 우선 사용한다 (§ 3.10.1, § 3.11.1). 레거시 `<s_rp>` / `<s_guest>` 블록은 호환을 위해 유지되지만 유지보수 비용이 높다.

### 9.4 공통 메뉴·달력·보관함 (공식 문서화 누락 항목)

- `[##_blog_menu_##]` 는 공식 global.md 에 나오지만 내부 HTML 구조 설명이 없다. Ray 테마는 이 치환자를 쓰지 않고 직접 `<ul>` 로 메뉴를 구성한다.
- `[##_calendar_##]`, `<s_archive_rep>`, `<s_link_rep>` 는 **공식 가이드 문서화 누락**이지만 Ray 테마에서 동작이 확인됨 (§ 3.14). 사용 시 동작은 하지만 향후 변경 가능성이 있다.

---

## 10. 구현 시 주의점 요약 (Gotcha)

실제 스킨 작성에서 자주 실수하는 지점을 공식 문서 근거로 정리한다.

1. **`<s_t3>` 누락 금지**. `<body>` 안에서 최상위로 감싸지 않으면 댓글·관리 기능이 동작하지 않는다.
2. **`<s_article_rep>` 안에 `<s_permalink_article_rep>`/`<s_index_article_rep>` 중첩 필수**. 둘을 구분해주지 않으면 목록 페이지에서 본문 전체가 나오는 참사가 발생한다.
3. **`[##_article_rep_summary_##]` 는 `<s_index_article_rep>` 내부에서만 유효**하다. permalink에서 쓰면 치환되지 않는다.
4. **`[##_prev_page_##]` / `[##_next_page_##]` / `[##_paging_rep_link_##]` 는 URL이 아니라 `href="…"` 속성 블록**. `<a href="[##_prev_page_##]">` 가 아니라 `<a [##_prev_page_##]>` 로 쓴다.
5. **사이드바 랜덤 태그는 `<s_random_tags>`** 이고, 태그 클라우드 페이지는 `<s_tag>` + `<s_tag_rep>` 이다. 두 개는 다른 그룹이다.
6. **`[##_category_##]` 와 `[##_category_list_##]` 는 다른 DOM** (트리 vs 리스트). 스타일링은 렌더된 HTML 구조를 기준으로 맞춘다.
7. **`<s_cover>` 의 `name` 속성은 `index.xml` 의 `<cover><item><name>` 와 정확히 일치해야 렌더된다**. 일치하지 않으면 무시된다.
8. **`index.xml` 을 변경하면 스킨의 모든 설정이 초기화된다** (공식 경고). 배포된 스킨은 수정에 신중해야 한다.
9. **댓글/방명록은 신규 스킨에서 `[##_comment_group_##]` / `[##_guestbook_group_##]` 우선 사용**. React 앱이 기능 변경을 흡수하므로 유지보수가 쉽다.
10. **`<s_tag_label>` 내부의 `[##_tag_label_rep_##]` 는 이미 포맷된 HTML 한 덩어리로 치환된다**. 개별 태그를 커스텀 마크업으로 쓰려면 permalink에서도 `<s_tag>` + `<s_tag_rep>` 를 쓰거나 클라이언트 JS로 재조립해야 한다(**확인 필요**).
11. **서버사이드 로직 불가**. 검색 자동완성·다크모드·목차 등은 모두 클라이언트 JS 로 구현한다.
12. **`images/` 폴더 고정**. 그 외 경로의 정적 파일은 업로드할 수 없다 (공식 files.md).
13. **`<s_t3>` 치환 후 삽입되는 빈 `<div>` 가 레이아웃에 영향을 줄 수 있다**. `float:none; z-index:0` 인 작은 div지만 CSS Grid/Flex 자식 계산에 들어갈 수 있으니, 최상위 flex 컨테이너를 `<s_t3>` 내부에 한 번 더 두는 방식을 쓴다.
14. **스킨 옵션 이름에 하이픈(`-`) 허용 확인됨** (공식 예 `scroll-load`, `cover-image`, `point-color`). underscore 대신 kebab-case가 관례.
15. **팀블로그 전용 치환자** (`[##_article_rep_author_##]`, `[##_rctps_rep_author_##]`, `[##_notice_rep_author_##]`)는 1인 블로그에서는 비어 있을 수 있다. 빈 값 처리를 CSS로 커버(`:empty` 등).

---

## 11. 참고 자료 (출처 요약)

| # | URL | 간단 요약 |
|:--|:--|:--|
| 1 | https://tistory.github.io/document-tistory-skin/ | 공식 스킨 가이드 GitBook 진입점 |
| 2 | https://github.com/tistory/document-tistory-skin | 공식 가이드의 markdown 원본. SUMMARY.md 가 전체 TOC |
| 3 | https://tistory.github.io/document-tistory-skin/common/files.html | 파일 구조: `index.xml`, `skin.html`, `style.css`, `preview*`, `images/` |
| 4 | https://tistory.github.io/document-tistory-skin/common/index.xml.html | index.xml 전체 스펙과 default 필드 표 |
| 5 | https://tistory.github.io/document-tistory-skin/common/basic.html | `<s_NAME>VALUE</s_NAME>` / `[##_NAME_##]` 문법 정의 |
| 6 | https://tistory.github.io/document-tistory-skin/common/global.html | 공통 치환자 (`<s_t3>`, 블로그 메타, `[##_body_id_##]` 표) |
| 7 | https://tistory.github.io/document-tistory-skin/common/cover.html | 홈 커버 `<s_cover_group>` 구조와 index.xml 정의 |
| 8 | https://tistory.github.io/document-tistory-skin/common/variable.html | 스킨 옵션(`<variables>`, `<s_if_var_…>`, `[##_var_…_##]`) |
| 9 | https://tistory.github.io/document-tistory-skin/contents/post.html | 글 치환자, permalink/index 분기, 관련글/이전·다음 |
| 10 | https://tistory.github.io/document-tistory-skin/contents/comment.html | 댓글 `<s_rp>` 레거시 + `[##_comment_group_##]` 현행 |
| 11 | https://tistory.github.io/document-tistory-skin/contents/notice.html | 공지사항 `<s_notice_rep>` |
| 12 | https://tistory.github.io/document-tistory-skin/contents/protected.html | 보호글 `<s_article_protected>` + 비밀번호 폼 |
| 13 | https://tistory.github.io/document-tistory-skin/contents/page.html | 페이지 `<s_page_rep>` (없으면 `<s_article_rep>` fallback) |
| 14 | https://tistory.github.io/document-tistory-skin/contents/tag.html | 태그 클라우드 페이지 `<s_tag>` + `[##_tag_class_##]` |
| 15 | https://tistory.github.io/document-tistory-skin/contents/guestbook.html | 방명록 `<s_guest>` 레거시 + `[##_guestbook_group_##]` 현행 |
| 16 | https://tistory.github.io/document-tistory-skin/list/list.html | 리스트 `<s_list>` + `<s_list_rep>` 치환자 |
| 17 | https://tistory.github.io/document-tistory-skin/list/paging.html | 페이징 `<s_paging>` |
| 18 | https://tistory.github.io/document-tistory-skin/sidebar/basic.html | `<s_sidebar>` + `<s_sidebar_element>` |
| 19 | https://tistory.github.io/document-tistory-skin/sidebar/recent_notice.html | `<s_rct_notice>` |
| 20 | https://tistory.github.io/document-tistory-skin/sidebar/recent_post.html | `<s_rctps_rep>` |
| 21 | https://tistory.github.io/document-tistory-skin/sidebar/popular_post.html | `<s_rctps_popular_rep>` |
| 22 | https://tistory.github.io/document-tistory-skin/sidebar/recent_comment.html | `<s_rctrp_rep>` |
| 23 | https://tistory.github.io/document-tistory-skin/sidebar/category.html | `[##_category_##]`, `[##_category_list_##]` |
| 24 | https://tistory.github.io/document-tistory-skin/sidebar/random_tag.html | `<s_random_tags>` (사이드바 전용) |
| 25 | https://tistory.github.io/document-tistory-skin/sidebar/count.html | `[##_count_total_##]/_today_##/_yesterday_##` |
| 26 | https://tistory.github.io/document-tistory-skin/sidebar/search.html | `<s_search>` |
| 27 | https://github.com/tistory/tistory-theme-ray/blob/master/skin.html | 공식 Ray 테마 — 실제 어떻게 조립하는지 참고용 |
| 28 | https://github.com/tistory/tistory-theme-ray/blob/master/index.xml | Ray 테마 index.xml 예 |

---

## 12. "확인 필요" 목록 (공식 소스에서 답을 못 찾은 항목)

이 목록은 공식 `tistory/document-tistory-skin` 과 Ray 테마 소스에서 답이 나오지 않았거나 불명확한 것들이다. 실제 구현 전 반드시 재검증한다.

1. **개별 파일 업로드 용량 상한** — 공식 가이드 미기재. 에디터 UI로 확인 필요.
2. **외부 임의 CDN (Daum/Kakao 외) 허용 여부와 정책** — 공식 정책 문서 없음. 실사용 가능.
3. **검색 결과 URL 구조 (`/search/{q}`)** — Ray 테마 form action/관찰 기준이며 공식 규격 문서는 없음.
4. **`[##_category_##]` / `[##_category_list_##]` 의 내부 DOM 구조** — 공식 문서는 DOM 클래스명을 명시하지 않는다. CSS 선택자는 렌더된 결과를 실시간으로 확인해서 맞춰야 한다.
5. **`[##_calendar_##]`, `<s_archive_rep>`, `<s_link_rep>`, `[##_owner_url_##]`** — Ray 테마에서 동작 확인되지만 **공식 가이드 문서화 누락**. 향후 deprecate 가능성 있음.
6. **전역 JS API (`window.t3`, 이벤트 버스 등) 존재 여부** — 공식 JS API 문서 없음. `<s_t3>` 가 주입하는 `common.js` 를 브라우저 디버거로 까봐야 함.
7. **`[##_tag_label_rep_##]` 가 치환하는 HTML 구조** — 공식 문서는 "태그 반복 출력"이라고만 적는다. 개별 태그를 꾸미려면 실제 치환 결과 확인 필요.
8. **모바일 스킨 자동 변환 옵션과 반응형 스킨의 상호작용** — 2026년 현재 관리자 UI 메뉴 확인 필요.
9. **iframe 광고 (Adfit) 의 display 토글 시 레이지 로드 재동작 여부** — 광고 SDK 문서 확인 필요.
10. **댓글/방명록 React 앱이 내부적으로 주입하는 CSS 변수/테마 훅** — `tt-` 프리픽스 DOM은 공개되어 있으나 공식 CSS 훅 문서 없음. 실제 DOM 인스펙션 필요.

---

*문서 종료. 이 규격만 지키면 실무 스킨 구현 시 치환자·파일 구성·index.xml 스펙 때문에 막힐 일은 없다. 확인 필요 항목은 실제 티스토리 관리자 UI / 에디터 / 렌더링 결과로 보완한다.*

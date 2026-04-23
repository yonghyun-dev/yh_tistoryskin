# Dev-Archive → Tistory 2.0 스킨 마이그레이션 계획

생성: 2026-04-23 (/plan-eng-review)
브랜치: main
목적: `Dev-Archive/Dev-Archive/artifacts/devlog`(React+Vite SPA)의 시각 언어·구조·인터랙션을 현재 Tistory 2.0 스킨(`skin/`)으로 풀 이식.

## 확정된 결정사항

| # | 결정 | 선택 | 근거 |
|:--|:--|:--|:--|
| Q1 | 스코프 | **B) 풀 이식 (구조 포함)** | 사용자 요구: "시각 언어·컴포넌트 스타일·인터랙션 최대한 보존". series/archive UX가 핵심. |
| Q2 | Series 매핑 | **C) 카테고리 = 시리즈 + SERIES_META 하이브리드** | 글 추가 workflow 최소화 + 시리즈 accent/설명 관리 일원화 |
| Q3 | /archive 구현 | **A) Tistory PAGE + /rss fetch** | 연도 그룹 + 인라인 검색 UX 보존. fallback: 월별 `/archive/YYYY-MM` 다회 요청 |
| Q4 | 에셋 경로 | **A) flat 유지 (`./script.js`)** | `images/` 폴더 없음 + 로컬 미리보기 동작. 업로드 후 실 URL 검증 필요 (R4/U-3) |
| Q5 | ⌘K 검색 | **A) 오버레이 + RSS 라이브 프리뷰** | Q3의 fetch 결과 재사용, 추가 비용 0 |

## 산출물 범위

- `skin/skin.html` — ~30% 재작성
- `skin/style.css` — 토큰 전면 교체 + 컴포넌트 70% 재작성
- `skin/script.js` — 10 모듈 → 12 모듈 (+ `SERIES_META`, `seriesStrip`, `seriesPage`, `archivePage`, `aboutPage`, `search` 오버레이, `codeBlocks` 확장)
- `skin/index.xml` — accent 기본값 교체, 2 variables 추가 (`footer-tagline`, `search-mode`, `show-activity-badges` 중 확정분)
- **Tistory 관리자 (스킨 외)**: about / archive / series-index PAGE 3개 생성, 시리즈용 카테고리 `series-xxx` 정리

## NOT in scope (의식적으로 제외)

| 항목 | 이유 |
|:--|:--|
| Dev-Archive의 hash-router 복제 | Tistory는 서버 렌더 멀티-URL. 불필요한 복잡도 |
| `/rss` 한계를 넘는 전체 본문 검색 | 비용 대비 효용 낮음. 제목/카테고리/태그 검색으로 충분 |
| 시리즈 accent 관리자 UI 노출 | index.xml variable 로 뺄 수 있지만 변경 빈도 낮음. SERIES_META 상수로 충분 |
| 기존 사이드바 블록 (`.sidebar-block`) | Dev-Archive는 사이드바 없음. 단일 컬럼 + 글 상세만 2-col |
| preview.gif 스크린샷 갱신 | Sprint 외 작업. final smoke 후 수행 |
| 댓글/방명록 스타일 재작성 | Tistory 기본 UI. Dev-Archive에 대응 컴포넌트 없음 |

## 구현 순서 (Phase 1-10)

```
Phase 1  토큰 리팩터 (style.css L1-166 + index.xml accent)         [blocker]
Phase 2  Shell: header brand + nav + footer                        (1에 의존)
Phase 3  홈 5섹션 (home-hero / featured / activity / cta)          (2에 의존)
Phase 4  Series 시스템 (SERIES_META + seriesStrip + 카테고리 정리)   (3 병행 가능)
Phase 5  글 상세 재스타일 (article-head + prose + code-head + copy) (1 이후 언제든)
Phase 6  /archive /series /about PAGE 3종 + 모듈                    (4에 의존)
Phase 7  Tags (s_tag → tags-grid)                                  (1 이후 언제든)
Phase 8  ⌘K Search overlay (live preview)                          (6 이후: rss cache 공유)
Phase 9  마이크로 인터랙션 + 반응형 최종                              (전 phase 이후)
Phase 10 최종 smoke + /images/ 경로 실서버 검증                      (마지막)
```

## 병렬화 전략 (worktree)

| Lane | Phase | 공유 모듈 |
|:--|:--|:--|
| Lane A | 1 → 2 → 3 → 4 → 6 → 8 (홈~동적 페이지) | skin.html / script.js |
| Lane B | 5 → 7 (글 상세 + 태그) | skin.html (article block) / style.css (다른 섹션) |

Lane A와 B 모두 `style.css`를 터치하므로 **순차 권장** (Phase 1 토큰 먼저 확정 → 이후 A/B 병행).

## 리스크 관리

- **R1 카테고리=시리즈 혼재**: 카테고리명에 `series-` 접두어 + SERIES_META 키와 1:1 매칭
- **R2 `<s_page_rep>` 실동작**: about PAGE 먼저 생성해 스모크. 실패 시 body id 감지 fallback
- **R3 `/rss` 개수 제한**: Tistory 설정 확인. 초과 시 `/archive/YYYY-MM` 월별 다회 fetch
- **R4 images/ 경로**: final-smoke-checklist에 실서버 검증 추가 (script.js src 경로 최종 확정)
- **R5 cover_item 1 primary + 2 secondary 레이아웃**: CSS `:first-child` + Grid로 구현. 실패 시 JS `data-index` 후처리

## 검증 포인트 (스모크)

- [ ] Phase 1 완료 후 기존 사이트 모든 페이지 렌더 확인 (토큰만 바뀐 상태)
- [ ] Phase 3 완료 후 홈이 Dev-Archive와 시각적으로 일치하는지 screenshot diff
- [ ] Phase 4 완료 후 series-xxx 카테고리 글의 series-strip 동작 확인
- [ ] Phase 6 완료 후 /archive /series /about 3페이지 개별 smoke
- [ ] Phase 8 완료 후 ⌘K 키바인딩 + 방향키 + Enter 동작
- [ ] Phase 10: 라이트/다크 각 페이지, 767/1023/1279 브레이크포인트, prefers-reduced-motion

## 참조 파일

| 파일 | 역할 |
|:--|:--|
| `Dev-Archive/Dev-Archive/artifacts/devlog/src/app.js` | 라우터 + 각 페이지 renderXxx (846 라인) |
| `Dev-Archive/Dev-Archive/artifacts/devlog/src/data.js` | profile/tags/posts/series/activity 데이터 모델 (474 라인) |
| `Dev-Archive/Dev-Archive/artifacts/devlog/src/style.css` | 디자인 토큰 source of truth (37KB) |
| `Dev-Archive/Dev-Archive/artifacts/devlog/index.html` | shell 레이아웃 (83 라인) |
| `skin/skin.html` | 기존 Tistory 2.0 블록 구조 (574 라인) |
| `skin/style.css` | 기존 토큰·컴포넌트 (2,875 라인) |
| `skin/script.js` | 기존 10 모듈 (463 라인) |
| `skin/index.xml` | variables + cover + defaults (172 라인) |

## Completion Summary

- Step 0 Scope Challenge: 스코프 풀 이식(B) 선택, 불필요 항목 "NOT in scope" 분리
- Architecture Review: 5개 리스크 식별, 5개 완화책 대응 매핑
- Code Quality Review: 기존 네이밍 BEM-ish ↔ Dev-Archive 더블-언더바 혼재 → 점진 대체
- Test Review: 각 Phase 말미 smoke 항목 명시 (자동화 테스트 없음 — Tistory 스킨 특성)
- Performance Review: /rss fetch 1회, SERIES_META 상수 (추가 네트워크 없음)
- Outside Voice: 생략 (소규모 스킨 작업)
- Parallelization: 2 lane 병행 가능, 단 Phase 1은 blocker

---

## 구현 완료 (2026-04-23)

모든 Phase 완료. 산출물:

| 파일 | 라인 | 변경 요약 |
|:--|:--|:--|
| `skin/skin.html` | 682 | header 브랜드 `~/title.` + 5 고정 nav, 홈 5섹션 (hero + 01–05), permalink article-head/series-strip mount, s_page_rep 3종 마운트, search overlay dialog, `./script.js` flat 경로 |
| `skin/style.css` | 3,486 | Dev-Archive 토큰 (cyan #38bdf8, deep-navy) + legacy bridge, 섹션 4.0~4.7 홈/시리즈/아카이브/about/tags/search-overlay/article-head/prose 추가, 기존 profile-rail 제거 |
| `skin/script.js` | 1,101 | SERIES_META + seriesUrl/seriesByCategory, seriesStrip/homeSections/pageRouter/archivePage/seriesPage/aboutPage/search 모듈, loadRssEntries 캐시, codeBlocks에 .code-head/.copy 주입 |
| `skin/index.xml` | 180 | accent 기본값 #38BDF8 / #0EA5E9, `search-mode` SELECT variable 추가 |

### 최종 smoke 체크리스트 (업로드 전 검증)

로컬 파일 검증 (완료):
- [x] `node -c script.js` — syntax OK
- [x] `node -c chatbot-stub.js` — syntax OK
- [x] `xml.etree` parse `index.xml` — OK
- [x] Tistory 블록 균형 (s_t3, s_article_rep, s_permalink_article_rep, s_list, s_cover_group, s_cover_rep, s_cover_item, s_page_rep, s_tag, s_notice_rep, s_sidebar, s_search) — 모두 열기/닫기 일치
- [x] `./images/` 경로 없음 확인 (Q4.A flat 유지)

Tistory 업로드 후 실서버 검증 (사용자 수행):
- [ ] **R4/U-3**: `./script.js`가 실제 서버에서 404 없이 로드되는지 DevTools Network에서 확인. 404 시 skin.html의 두 `<script src>`를 `./images/script.js`로 복원하고 파일을 `skin/images/` 하위로 이동.
- [ ] **R3**: `/rss` 응답에 전체 글이 포함되는지 확인. Tistory 관리자 RSS 설정 최대값(20 이상 권장).
- [ ] **Q2 운영**: 시리즈용 카테고리 생성 — `series-career-prep`, `series-postgres-deep`, `series-project-retros`, `series-ops-lessons`, `series-go-deep`. 이 문자열과 `script.js`의 SERIES_META 키가 정확히 일치해야 series-strip이 동작.
- [ ] **Q3 PAGE 생성**: 관리자 → 페이지 → "About" / "Archive" / "Series" 3개 생성. 슬러그는 가능하면 `/about` / `/archive` / `/series`. 본문은 비워둬도 JS가 렌더 (pageRouter.TYPES.titles 로 감지).
- [ ] **U-2 body id 확인**: 홈(tt-body-index), permalink(tt-body-page), 카테고리, 태그, 검색, 페이지에서 `document.body.id` 실제 값. home-only 표시 제어가 올바른지.
- [ ] 라이트/다크 토글 각 페이지에서 FOUC 없이 동작
- [ ] ⌘K 오버레이: ⌘K/Ctrl+K 오픈, 타이핑 시 RSS 기반 필터링, 방향키 이동, Enter로 이동, Esc 닫기
- [ ] 767/1023/1279 브레이크포인트 (모바일·태블릿·데스크톱) 렌더
- [ ] prefers-reduced-motion 환경에서 애니메이션 최소화 확인

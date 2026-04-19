# 최종 스모크 체크리스트 (Sprint 1~5 전체)

- 작성일: 2026-04-19
- 실행 주체: 유저 (티스토리 관리자 업로드 담당)
- 목적: Sprint 1~5 모든 산출물 검증 + 확인 필요 항목 해소
- 업로드 대상: `skin.html` · `index.xml` · `style.css` · `images/script.js` · `images/chatbot-stub.js` · `preview.gif`

---

## 업로드 방법

### 권장: zip 일괄 업로드

```bash
cd /home/yhkim/yh_tistoryskin
rm -f modern-dev-blog.zip
zip modern-dev-blog.zip skin.html index.xml style.css preview.gif images/script.js images/chatbot-stub.js
```

만들어진 `modern-dev-blog.zip` 을 티스토리 관리자 > 꾸미기 > 스킨 변경 > **스킨 등록** 또는 **파일 업로드** 에서 업로드.

### 대안: 개별 파일 업로드
- 스킨 편집 UI 에서 각 파일을 수정 후 저장
- 주의: `index.xml` 을 바꾸면 사용자 `<variables>` 설정이 초기화됨 (공식 경고). 기존에 `accent-*`, `profile-*` 값을 설정해뒀다면 백업

---

## 1. 기본 렌더 (Sprint 1 재확인)

- [ ] 업로드 에러 없음
- [ ] 홈 `/` 접근 시 페이지 정상 로드
- [ ] 헤더 로고 / 카테고리 네비 / 검색 / 테마 토글 버튼 표시
- [ ] 푸터 `© blog · RSS` 표시
- [ ] 다크/라이트 토글 버튼 클릭 시 즉시 전환 + 새로고침 후 유지 (localStorage)
- [ ] OS `prefers-color-scheme` 변경 시 자동 반영 (localStorage 미설정 시)

## 2. 페이지 분기 (body_id)

DevTools > Elements > `<body id="...">` 확인.

| URL | 기대 body_id |
|:--|:--|
| `/` | `tt-body-index` |
| `/1` (포스트 permalink) | `tt-body-page` |
| `/category/{카테고리명}` | `tt-body-category` |
| `/tag` | `tt-body-tag` + `.is-tag-cloud` 클래스 |
| `/tag/{태그명}` | `tt-body-tag` + `.is-tag-list` 클래스 |
| `/search/{검색어}` | `tt-body-search` |
| `/guestbook` | `tt-body-guestbook` |

## 3. `<variables>` 관리자 UI (N-3)

꾸미기 > 스킨 편집 > 스킨 설정/변수 설정.

- [ ] **Theme** 그룹: `액센트 시작색`, `액센트 끝색` (COLOR)
- [ ] **Profile** 그룹: `프로필 이미지` (IMAGE) + 이름/한줄소개/GitHub/LinkedIn/이메일 (STRING) 6개
- [ ] **Features** 그룹: `다크모드 커서 소프트 글로우` (BOOL), `읽기 진행률 바` (BOOL), `챗봇 서버 URL` (STRING)
- [ ] 그룹이 표시되지 않고 평면으로 나열되면 N-3 실패 → PM 에게 보고

## 4. 프로필 히어로 (Sprint 2)

`Profile` 그룹에 값을 채워보세요.
- `이름/닉네임`: 본인 닉네임
- `한 줄 소개`: 짧은 소개 (예: "Python 개발자 · 이직 준비 중")
- `GitHub URL`: `https://github.com/username`
- `profile-image`: 아무 이미지 업로드

- [ ] 홈에서 이름이 **gradient** 로 표시 (액센트 색상 변경 시 같이 변함)
- [ ] 한 줄 소개 · 소셜 링크 pill 버튼 표시
- [ ] 헤더 로고와 시각적으로 분리됨 (Sprint 1의 중복 문제 해소)
- [ ] 프로필 이미지가 원형으로 표시

## 5. 홈 커버 + 카드 그리드 (Sprint 2)

포스트를 2~3개 작성 후:
- [ ] 홈 상단에 `FEATURED` 영역 (featured cover 설정 시)
- [ ] `RECENT` 영역에 최근 글 리스트 (썸네일 + 제목 + 카테고리·날짜)
- [ ] 그 아래 카드 그리드 — 카테고리/태그/검색 페이지에서도 동일 레이아웃
- [ ] 카드 hover 시 살짝 뜨는 효과 + shadow
- [ ] 반응형: 모바일 1열 / 태블릿 2열 / 데스크톱 3열
- [ ] N-5: 커버 썸네일이 제대로 렌더되는지 (img 태그가 정상 동작). 안 뜨면 보고

## 6. 페이지네이션 + 검색 (Sprint 2)

- [ ] 포스트가 많으면 하단 페이지네이션 표시
- [ ] 끝 페이지에서 `이전`/`다음` 버튼이 흐려짐 (no_more_prev/next)
- [ ] 검색창에 키워드 입력 후 엔터 → 검색 결과 페이지 이동
- [ ] 검색 버튼(→ 아이콘) 클릭도 동작

## 7. 개별 포스트 — 2단 레이아웃 + TOC + 코드 + 진행률 (Sprint 3)

본문에 h2 · h3 헤딩과 ```code``` 블록을 포함한 포스트 작성 후:
- [ ] 상단: 카테고리 · 제목(gradient 아님 일반 텍스트) · 작성일 · `N분 읽기`
- [ ] 데스크톱 (1024+): 본문 + 우측 TOC 2단 레이아웃
- [ ] TOC 에 h2/h3 목록 자동 생성, 클릭 시 해당 헤딩으로 스크롤
- [ ] 스크롤하면 현재 섹션 TOC 항목이 **액센트 컬러**로 하이라이트
- [ ] 모바일: TOC 가 우측 하단 FAB 버튼으로 접힘, 클릭 시 패널 열림
- [ ] 코드 블록 자동 하이라이트 (라이트 모드: github / 다크 모드: github-dark)
- [ ] 테마 전환 시 코드 테마도 함께 변함 (U-3 통과 지표)
- [ ] 상단 고정 **읽기 진행률 바** 표시 + 스크롤 따라 width 증가
- [ ] 본문 하단: 태그 · 관련 글 · 이전/다음 · 댓글

## 8. 보조 페이지 (Sprint 4)

- [ ] 공지 포스트 작성 후 홈 상단에 `NOTICE` 배너 표시
- [ ] 비밀글 작성 후 해당 URL 접근 → 비밀번호 입력 카드 표시, 입력하면 본문 보임
- [ ] `/guestbook` 접근 → 방명록 React 앱 렌더

## 9. 마이크로 인터랙션 (Sprint 4)

- [ ] 페이지 진입 시 전체 페이드인 (OS `prefers-reduced-motion` OFF 상태)
- [ ] 스크롤하면 카드·히어로·sibling 요소들이 슬라이드업 + 페이드인
- [ ] 다크모드 + `cursor-glow` ON 상태 + 마우스 움직일 때 커서 주변 은은한 그라데이션 글로우
- [ ] OS `prefers-reduced-motion` ON 으로 설정 후 새로고침 → 모든 애니메이션 즉시 종료 (깜빡임 없음)

## 10. 챗봇 훅 (Sprint 5)

챗봇 서버 없이 자리만 확인:
1. `skin.html` 의 주석 처리된 `<!-- <script src="./images/chatbot-stub.js" defer></script> -->` 줄에서 HTML 주석 기호 `<!-- -->` 제거
2. 업로드 후 새로고침

- [ ] 우측 하단에 `💬 챗봇 연결 대기 중` placeholder 표시
- [ ] 포스트 본문에 `<!--[chatbot]-->` 주석을 입력한 글 작성 → 본문 그 자리에 `챗봇 자리 (챗봇 자리)` 표시
- [ ] DevTools Console 에 `window.__CHATBOT_CONFIG__` 입력 → `{ endpoint, theme, mount }` 객체 확인
- [ ] 테마 토글 → Console 에서 `__CHATBOT_CONFIG__.theme` 가 갱신됨

스텁 확인 후 `skin.html` 의 해당 줄을 다시 주석 처리 (실 챗봇이 붙을 때까지).

## 11. 인젝션 방어 테스트 (N-1 / N-2)

관리자 본인이 입력하는 값이라 실용 위험은 낮지만, 플랫폼 이스케이프 확인:

- [ ] `accent-start` 값에 `red; } body { display:none; } :root { --x: red` 입력 시도 → UI 가 거부하거나, 저장 후 body 가 정상이면 OK
- [ ] `profile-link-github` 값에 `javascript:alert(1)` 입력 후 링크 클릭 → alert 뜨면 PM 에 보고 (Sprint 2 차 패치 예정)
- [ ] `profile-name` 값에 `<script>alert(1)</script>` 입력 후 홈 진입 → alert 뜨면 보고

테스트 후 정상 값 복원.

## 12. CDN 로드 (R-1 해소)

DevTools > Network 탭 → 새로고침.

- [ ] `cdn.jsdelivr.net/gh/orioncactus/pretendard...` (폰트) 200 OK
- [ ] `cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono...` 200 OK
- [ ] `cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/styles/github.min.css` 200 OK
- [ ] `cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/highlight.min.js` 200 OK (Sprint 3 추가)
- [ ] 다크 전환 후 `github-dark.min.css` 로 href 스왑 + 200 OK

## 결과 기록

| 섹션 | 통과 여부 | 메모 |
|:--|:--|:--|
| 1. 기본 렌더 | [ ] | |
| 2. 페이지 분기 | [ ] | |
| 3. variables UI | [ ] | |
| 4. 프로필 히어로 | [ ] | |
| 5. 커버 + 카드 | [ ] | |
| 6. 페이징 + 검색 | [ ] | |
| 7. 포스트 + TOC + 코드 + 진행률 | [ ] | |
| 8. 공지 + 보호글 + 방명록 | [ ] | |
| 9. 마이크로 인터랙션 | [ ] | |
| 10. 챗봇 훅 | [ ] | |
| 11. 인젝션 방어 | [ ] | |
| 12. CDN 로드 | [ ] | |

**모두 통과**: 프로젝트 완료 선언.
**부분 실패**: 실패 항목을 PM 에게 전달 → 대응 후 재검증.

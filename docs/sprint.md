# 현재 스프린트

## 스프린트 정보

- 스프린트 번호: 5 (최종)
- 목표: 챗봇 훅 + 전역 설정 API + 더미 스텁 + 통합 검증
- 상태: 구현 완료. 통합 리뷰 + README 작성 + 최종 스모크 검증 진행 중

## 현재 단계

- [x] 분석
- [x] 설계
- [x] 구현 (Sprint 1~5 전체)
- [ ] 검증 — reviewer 통합 리뷰 (background) + doc-writer README (background) + 유저 최종 스모크

## 진행 중인 작업

- **reviewer 통합 리뷰** (background) — `docs/agents/reviewer/02_integrated-review.md` 예정
- **doc-writer README** (background) — `README.md` 예정
- **유저 최종 스모크** — [docs/design/final-smoke-checklist.md](design/final-smoke-checklist.md) 수행 대기

## 이번 스프린트 완료 기준

- 챗봇 embed API 계약 확정 (`#chatbot-widget-root` · `window.__CHATBOT_CONFIG__` · `themechange`)
- 본문 `<!--[chatbot]-->` 마커 치환 JS 동작
- `images/chatbot-stub.js` 더미 스텁 작성
- `docs/design/chatbot-integration.md` 문서화
- reviewer 통합 리뷰 통과
- doc-writer README 완성
- 유저 최종 스모크 통과

## 중간 추가 요청 (파킹랏)

| # | 요청 내용 | 긴급도 | 현재 작업 영향 | 처리 |
|:--|:--|:--|:--|:--|
| - | - | - | - | - |

## 스프린트 히스토리

| 스프린트 | 목표 | 완료 여부 | 비고 |
|:--|:--|:--|:--|
| 1 | 스킨 골격 + 디자인 토큰 + 라이트/다크 | 완료 (2026-04-19) | 유저 스크린샷으로 정상 렌더 확인 |
| 2 | 메인 목록 + 프로필 + 네비 + 검색 + 사이드바 | 완료 (2026-04-19) | 카드 그리드·커버·프로필 히어로 gradient·태그 클라우드·페이지네이션 |
| 3 | 개별 포스트 + TOC + 코드 하이라이팅 + 진행률 | 완료 (2026-04-19) | 2단 레이아웃·TOC active·진행률 바·highlight.js 연동·관련글/이전·다음/댓글 |
| 4 | 공지 + 보호글 + 방명록 + 마이크로 인터랙션 + 반응형 | 완료 (2026-04-19) | 페이드인·hover lift·페이지 전환·커서 글로우·reduced-motion 대응·767/1023/1279 반응형 |
| 5 | 챗봇 훅 + 전역 설정 API + 더미 스텁 + 통합 검증 | 구현 완료, 검증 진행 중 | chatbot 모듈·stub·API 계약 문서 |

## 산출물

| 경로 | 내용 |
|:--|:--|
| `skin.html` | 전 페이지 템플릿 |
| `index.xml` | 메타 + `<variables>` 11개 + `<cover>` 2개 |
| `style.css` | 디자인 토큰 + 모든 컴포넌트 + 마이크로 인터랙션 + 반응형 |
| `images/script.js` | 10개 모듈 (theme/pageTransition/progress/toc/readingTime/codeBlocks/tagPage/fadeIn/glow/chatbot) |
| `images/chatbot-stub.js` | 옵션 챗봇 더미 |
| `preview.gif` | 1x1 임시 (Sprint 5 실제 스크린샷 교체 예정) |
| `docs/design/tistory-skin-spec.md` | 공식 규격 (1,149줄) |
| `docs/design/tech-decisions.md` | T-1~T-6 기술 결정 |
| `docs/design/sprint-plan.md` | 5 스프린트 계획 |
| `docs/design/skin-architecture.md` | 아키텍처 · 다이어그램 |
| `docs/design/chatbot-integration.md` | 챗봇 API 계약 |
| `docs/design/sprint1-smoke-checklist.md` | Sprint 1 스모크 |
| `docs/design/final-smoke-checklist.md` | Sprint 1-5 최종 스모크 |
| `docs/design/diagrams/` | Mermaid 다이어그램 3종 |
| `docs/requirements/01_modern-blog-skin.md` | 요구사항 30개 (F-20b 시리즈는 범위 제외) |
| `docs/pm/01_sprint1-analysis.md` | Sprint 1 분석 |
| `docs/pm/02_sprint1-closing-sprint2-start.md` | Sprint 1 클로징 |
| `docs/pm/03_sprint2-5-integrated.md` | Sprint 2-5 통합 구현 |
| `docs/agents/design-reviewer/01_sprint1-review.md` | 설계 검증 |
| `docs/agents/reviewer/01_sprint1-review.md` | Sprint 1 코드 리뷰 |
| `docs/agents/reviewer/02_integrated-review.md` | Sprint 2-5 통합 리뷰 (진행 중) |

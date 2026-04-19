# 스프린트 의존성 그래프

- 신규 작성
- 근거: `sprint-plan.md` 전체, `tech-decisions.md`, `skin-architecture.md`

각 스프린트가 이전 스프린트의 어떤 산출물에 의존하는지 보여준다. Sprint 1 의 `index.xml`(`<variables>`, `<cover>`)과 `skin.html` 의 분기 구조는 이후 모든 스프린트의 기반이므로, Sprint 1 에서 스키마를 확정하지 않으면 이후 `index.xml` 수정 시 사용자 설정 초기화 위험이 발생한다.

```mermaid
flowchart TD
    S1[Sprint 1\n스킨 골격 + 디자인 시스템 + 라이트/다크]
    S2[Sprint 2\n메인 목록 + 프로필 + 카테고리/태그/검색]
    S3[Sprint 3\n개별 포스트 + TOC + 코드 + 진행률]
    S4[Sprint 4\n보조 페이지 + 마이크로 인터랙션 + 반응형]
    S5[Sprint 5\n챗봇 훅 + 전역 설정 API + 최종 검증]

    S1 -->|skin.html 분기 구조\nbody_id CSS/JS 분기| S2
    S1 -->|style.css CSS 토큰\ndata-theme 시스템| S2
    S1 -->|index.xml variables 11개 스키마 확정\ncover featured/list 정의| S2
    S1 -->|script.js IIFE 모듈 구조\nthemechange 이벤트 계약| S3
    S1 -->|chatbot-widget-root div 자리 확보\nwindow.__CHATBOT_CONFIG__ 초기화| S5

    S2 -->|s_list 카드 그리드 CSS\nhover lift 효과| S3
    S2 -->|s_paging href 속성 블록 패턴\n카드 레이아웃 시스템| S4

    S3 -->|permalink 2단 레이아웃\npost__body / post__toc 구조| S4
    S3 -->|highlight.js 로드 + 테마 스왑\nhljs-theme href 스왑| S4
    S3 -->|IntersectionObserver TOC 패턴\nprogress + fadeIn 구조| S4

    S4 -->|모든 페이지 타입 완성\n반응형 브레이크포인트 확정| S5
    S4 -->|reduced-motion 전역 검증\n마이크로 인터랙션 완성| S5

    S5 -->|chatbot.js 외부 스크립트 연결\nreviewer 전체 코드 리뷰\nREADME 작성| Done[완성]
```

## 의존성 상세 (Sprint 1 산출물이 이후에 미치는 영향)

| Sprint 1 산출물 | 의존하는 스프린트 | 비고 |
|:--|:--|:--|
| `index.xml` `<variables>` 11개 스키마 | 2~5 전체 | 수정 시 사용자 설정 초기화. **Sprint 1에서 확정 필수** |
| `index.xml` `<cover>` `featured`/`list` | Sprint 2 (홈 커버 구현) | `<s_cover name="...">` 와 반드시 일치 |
| `skin.html` body_id 분기 구조 | 2~5 전체 | 모든 페이지 블록의 위치가 Sprint 1 골격에 기반 |
| `style.css` `:root` CSS 토큰 | 2~5 전체 | 모든 컴포넌트가 이 토큰 참조 |
| `[data-theme]` 시스템 + `themechange` 이벤트 | Sprint 3 (hljs 스왑), Sprint 5 (챗봇 테마 동기화) | 이벤트 이름/detail 형식 변경 불가 |
| `#chatbot-widget-root` div | Sprint 5 (챗봇 위젯 마운트) | Sprint 1부터 존재해야 외부 스크립트가 항상 찾을 수 있음 |
| `window.__CHATBOT_CONFIG__` 초기화 스텁 | Sprint 5 (챗봇 통합) | 객체 구조 변경 시 외부 스크립트와 계약 파기 |

## 임계 경로 (Critical Path)

Sprint 1 → Sprint 2 → Sprint 3 → Sprint 4 → Sprint 5 순서가 고정이며, 각 스프린트는 이전 스프린트 완료 기준을 통과해야 다음을 시작할 수 있다. Sprint 4 와 Sprint 5 일부 작업은 병렬 진행 가능하다(챗봇 API 계약 문서 `chatbot-integration.md` 는 Sprint 4 와 동시 작업 가능).

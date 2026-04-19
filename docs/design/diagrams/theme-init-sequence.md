# 테마 초기화 시퀀스 다이어그램

- 출처: `skin-architecture.md §5.3` 를 독립 파일로 추출 + 설명 추가
- 구현 대상: Sprint 1 `images/script.js` 테마 모듈

페이지 로드 시 `script.js` 가 `DOMContentLoaded` 이벤트를 받아 테마를 초기화하는 흐름을 보여준다. localStorage에 저장된 값이 있으면 우선 적용하고, 없으면 OS 의 `prefers-color-scheme` 를 읽어 적용한다. 테마 전환 시 `hljs-theme` CSS 링크의 href 를 스왑해 코드 하이라이팅 테마도 동기화한다.

테마 변경이 일어날 때마다 `themechange` CustomEvent 를 발행하며, Sprint 5 챗봇 모듈은 이 이벤트를 listen해 내부 테마를 동기화한다.

```mermaid
sequenceDiagram
    participant DOM
    participant script.js
    participant LS as localStorage
    participant MM as matchMedia
    participant HLJS as hljs-theme link
    participant Chatbot as chatbot.js 외부 스크립트

    DOM->>script.js: DOMContentLoaded
    script.js->>LS: getItem("theme")
    alt 저장된 테마 있음
      LS-->>script.js: "dark" 또는 "light"
    else 없음
      script.js->>MM: prefers-color-scheme 확인
      MM-->>script.js: "dark" 또는 "light"
    end
    script.js->>DOM: html[data-theme] 세팅
    script.js->>HLJS: href 스왑 (라이트/다크 테마 CSS)
    script.js->>DOM: themechange CustomEvent 발행

    Note over script.js: toc.init / progress.init / fadeIn.init / chatbot.init 순차 호출

    DOM->>script.js: 사용자 클릭 [data-theme-toggle]
    script.js->>LS: setItem("theme", 다음값)
    script.js->>DOM: html[data-theme] 토글
    script.js->>HLJS: href 스왑
    script.js->>DOM: themechange CustomEvent 발행
    DOM->>Chatbot: themechange 이벤트 수신 (Sprint 5)
    Chatbot->>Chatbot: 내부 테마 동기화

    Note over MM, script.js: OS 테마 변경 감지 (localStorage 값 없을 때만)
    MM->>script.js: change 이벤트
    script.js->>DOM: html[data-theme] 갱신
    script.js->>HLJS: href 스왑
    script.js->>DOM: themechange CustomEvent 발행
```

## 구현 체크포인트 (Sprint 1)

| 체크 항목 | 확인 방법 |
|:--|:--|
| localStorage 우선 적용 | 토글 후 새로고침 시 같은 테마 유지 |
| OS 감지 초기 적용 | localStorage 비운 뒤 OS 다크모드 켜고 접속 |
| OS 변경 실시간 반영 | localStorage 비운 뒤 OS 테마 변경 시 즉시 전환 |
| localStorage 있을 때 OS 무시 | localStorage `light` 세팅 후 OS 다크 변경 → light 유지 |
| hljs-theme CSS 스왑 | Network 탭에서 테마 전환 시 CSS href 변경 확인 |
| themechange 이벤트 | 브라우저 콘솔에서 이벤트 발행 확인 |

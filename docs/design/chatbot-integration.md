# 챗봇 통합 가이드 (Sprint 5 산출물)

- 작성일: 2026-04-19
- 대상 독자: 추후 챗봇 서버/프론트 스크립트를 제작할 엔지니어
- 스킨 버전: 1.0.0

---

## 한 줄 요약

티스토리 스킨 관리자에서 `chatbot-endpoint` variable 에 서버 URL 을 입력하고, `<script src="https://...chatbot.js" defer></script>` 한 줄을 스킨 하단에 추가하면 **플로팅 위젯**과 **본문 인라인 마커** 두 지점에 마운트된다.

---

## 공개 API (스킨 ↔ 챗봇 스크립트 계약)

### 1. DOM 마운트 지점

| 선택자 | 위치 | 설명 |
|:--|:--|:--|
| `#chatbot-widget-root` | `<body>` 최하단, 고정 | 플로팅 위젯 상시 마운트. 페이지 타입 무관하게 존재 |
| `.chatbot-inline-slot[data-chatbot-inline="true"]` | 포스트 본문 `<!--[chatbot]-->` 위치 | 포스트 본문에 마커가 있을 때만 생성됨. 스킨 JS (`script.js`) 의 `chatbot.init()` 가 자동 치환 |

두 지점 모두 스킨 측이 이미 준비했으므로 챗봇 스크립트는 **DOM 변경 없이 마운트만 하면 된다.**

### 2. 전역 설정 객체

```ts
window.__CHATBOT_CONFIG__ = {
  endpoint: string;        // 티스토리 관리자 <variables> chatbot-endpoint 값 (비어있으면 "")
  theme: "light" | "dark"; // 현재 활성 테마
  mount: HTMLElement;      // #chatbot-widget-root 레퍼런스
};
```

스킨이 DOMContentLoaded 시점에 초기화한다. 챗봇 스크립트는 `DOMContentLoaded` 또는 이후에 안전하게 접근 가능.

### 3. 이벤트

#### `themechange` (window scope)

```js
window.addEventListener("themechange", (e) => {
  e.detail.mode; // "light" | "dark"
});
```

- 사용자가 테마 토글 버튼을 누르거나 OS `prefers-color-scheme` 에 의해 자동 전환될 때 발행
- 챗봇 UI 가 listen 하여 내부 테마를 동기화할 때 사용
- 스킨 측도 자체적으로 `window.__CHATBOT_CONFIG__.theme` 를 갱신함 (stale 참조 안전)

---

## 챗봇 스크립트 설치 절차 (블로그 주인용)

1. **서버 URL 입력**
   - 티스토리 관리자 > 꾸미기 > 스킨 편집 > **스킨 설정** (변수 설정) 탭
   - `Features` 그룹의 `챗봇 서버 URL` 에 값 입력 (예: `https://my-chatbot.example.com`)
   - 저장

2. **스크립트 추가**
   - `skin.html` 의 `</s_t3>` 직전에 한 줄 추가:
     ```html
     <script src="https://my-chatbot.example.com/chatbot.js" defer></script>
     ```
   - 스크립트는 `window.__CHATBOT_CONFIG__` 에서 endpoint 를 읽어 초기화

3. **확인**
   - 페이지 새로고침 후 우측 하단에 챗봇 위젯이 뜨는지 확인
   - 포스트 본문에 `<!--[chatbot]-->` 주석을 넣으면 해당 위치에도 챗봇 UI 가 마운트됨

---

## 챗봇 스크립트 구현 가이드 (개발자용)

### 권장 초기화 패턴

```js
(function () {
  const cfg = window.__CHATBOT_CONFIG__;
  if (!cfg || !cfg.endpoint) {
    console.warn("[chatbot] endpoint missing");
    return;
  }

  // 1. 플로팅 위젯 마운트
  mountWidget(cfg.mount, { endpoint: cfg.endpoint, theme: cfg.theme });

  // 2. 본문 인라인 슬롯 마운트
  document.querySelectorAll('[data-chatbot-inline="true"]').forEach((slot) => {
    mountInline(slot, { endpoint: cfg.endpoint, theme: cfg.theme });
  });

  // 3. 테마 변경 수신
  window.addEventListener("themechange", (e) => {
    applyTheme(e.detail.mode);
  });
})();
```

### 스타일 가이드

스킨은 다음 CSS 커스텀 프로퍼티를 `:root` 에 노출한다. 챗봇 UI 가 이를 읽어 블로그 무드와 일치시키면 자연스럽다.

- `--color-bg`, `--color-surface`, `--color-text`, `--color-text-muted`
- `--color-border`, `--color-border-strong`
- `--accent-start`, `--accent-end`, `--accent-gradient`
- `--font-sans`, `--font-mono`
- `--radius-md`, `--radius-lg`, `--radius-full`
- `--shadow-sm`, `--shadow-md`, `--shadow-lg`
- `--space-*`, `--fs-*`

### 반응형

- 플로팅 위젯은 **모바일 (767 이하)** 에서 `right: 16px; bottom: 16px` 에 위치
- **데스크톱** 에서 `right: 24px; bottom: 24px`
- 위젯 크기/확장 방식은 챗봇 스크립트가 결정

### 접근성

- 플로팅 버튼: `aria-label` 필수
- 대화 패널: `role="dialog"`, `aria-modal="true"`, 닫기 버튼 `aria-label`
- 키보드 ESC 로 닫기 지원 권장

---

## 더미 스텁 (`images/chatbot-stub.js`)

실 챗봇 서버가 없을 때 자리만 미리 시각화하려면 스킨에 포함된 스텁을 활성화:

```html
<!-- skin.html 의 챗봇 스크립트 자리 -->
<script src="./images/chatbot-stub.js" defer></script>
```

- `endpoint` 가 비어 있을 때만 동작 (실 챗봇 연결 시 자동 무력화)
- 플로팅 위젯 자리에 "💬 챗봇 연결 대기 중" 표시
- 본문 인라인 슬롯에 "챗봇 자리" 텍스트 표시

---

## 제약 및 주의

1. **서버사이드 렌더링 불가**: 티스토리 스킨은 정적 HTML + 치환자 기반이므로 챗봇 스크립트는 클라이언트 측에서만 동작
2. **외부 CDN 허용**: `cdn.jsdelivr.net`, `t1.daumcdn.net` 등 검증된 CDN 외에도 일반 HTTPS CDN 이 동작함이 확인됨 (U-3 스모크 결과). HTTP 는 혼합 컨텐츠 문제로 금지
3. **index.xml 변경 주의**: 스킨 `<variables>` 스키마를 변경하면 사용자 설정이 초기화됨 (공식 경고). chatbot-endpoint 는 Sprint 1 에서 확정되어 있으므로 유지됨
4. **마커 에스케이프**: 포스트 본문의 `<!--[chatbot]-->` 는 정확히 이 형식이어야 하며, 앞뒤 공백은 허용됨 (`<!--[chatbot]--> ` OK, `<!--[ chatbot ]-->` NO)

---

## 구현 진척도

| 구성 | 위치 | 상태 |
|:--|:--|:--|
| 마운트 지점 `#chatbot-widget-root` | `skin.html` | ✅ Sprint 1 |
| 마운트 지점 CSS (고정 위치) | `style.css` §4.10 | ✅ Sprint 1 |
| `window.__CHATBOT_CONFIG__` 초기화 | `script.js` chatbot 모듈 | ✅ Sprint 5 |
| 본문 `<!--[chatbot]-->` 마커 치환 | `script.js` chatbot 모듈 | ✅ Sprint 5 |
| `themechange` 이벤트 연동 | `script.js` chatbot 모듈 | ✅ Sprint 5 |
| 더미 스텁 | `images/chatbot-stub.js` | ✅ Sprint 5 |
| `variables.chatbot-endpoint` | `index.xml` | ✅ Sprint 1 |
| 실제 챗봇 서버 | 별도 프로젝트 | 외부 |

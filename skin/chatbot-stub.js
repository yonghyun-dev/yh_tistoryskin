/**
 * 파일: images/chatbot-stub.js
 * 목적: 실제 챗봇 서버가 아직 연결되지 않았을 때 자리만 시각화하는 옵션 스텁
 * 활성화: skin.html 에서 주석 처리된 `<script src="./images/chatbot-stub.js" defer>` 줄을 해제
 * 자동 중지: window.__CHATBOT_CONFIG__.endpoint 값이 존재하면 아무 동작도 하지 않음 (실 챗봇이 우선)
 *
 * 공개 계약 (script.js chatbot 모듈이 먼저 초기화해야 동작):
 *   window.__CHATBOT_CONFIG__.mount      : 플로팅 위젯 root div
 *   document.querySelectorAll('[data-chatbot-inline]') : 본문 마커 슬롯들
 */
(function () {
  "use strict";

  function run() {
    const cfg = window.__CHATBOT_CONFIG__;
    if (!cfg || !cfg.mount) return;
    if (cfg.endpoint) return;

    // 플로팅 위젯 자리 표시
    if (!cfg.mount.querySelector(".chatbot-stub")) {
      const bubble = document.createElement("div");
      bubble.className = "chatbot-stub";
      bubble.setAttribute("role", "status");
      bubble.textContent = "💬 챗봇 연결 대기 중";
      cfg.mount.appendChild(bubble);
    }

    // 본문 인라인 슬롯 표시
    document.querySelectorAll("[data-chatbot-inline]").forEach((slot) => {
      if (!slot.classList.contains("chatbot-stub-inline")) {
        slot.classList.add("chatbot-stub-inline");
        slot.textContent = "챗봇 자리";
      }
    });
  }

  // script.js 의 chatbot.init() 이 완료된 뒤 동작해야 __CHATBOT_CONFIG__ 가 존재한다
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();

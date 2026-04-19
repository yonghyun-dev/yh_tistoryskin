/**
 * 파일: images/script.js
 * 목적: 티스토리 모던 개발 블로그 스킨의 런타임 스크립트
 * 경로: SKIN_ROOT/images/script.js
 * 실행: <script src="./images/script.js" defer>
 *
 * 모듈:
 *   theme         — 라이트/다크 모드 토글 (localStorage + prefers-color-scheme)
 *   pageTransition — 페이지 진입 페이드인
 *   progress      — 포스트 읽기 진행률 바
 *   toc           — 포스트 본문 h2/h3 스캔 → TOC 생성 + active 하이라이트
 *   readingTime   — 본문 길이 기반 예상 읽기 시간
 *   codeBlocks    — highlight.js 연동 (라이브러리 로드 대기 후 자동 하이라이트)
 *   tagPage       — /tag vs /tag/X URL 기반 body 클래스 분기 (U-2)
 *   fadeIn        — IntersectionObserver 기반 스크롤 페이드인
 *   glow          — 다크 모드 커서 소프트 글로우 (variable 활성화 시만)
 *   chatbot       — 챗봇 훅 (전역 설정 + 본문 마커 치환 + 테마 이벤트 브로드캐스트)
 *
 * 제약:
 *   - 외부 라이브러리 의존성 없음 (vanilla ES6+). highlight.js 는 skin.html 에서 별도 <script> 로 로드
 *   - localStorage 는 safeStorage 유틸로 감싸 사설 모드 등 예외 환경 대응
 *   - prefers-reduced-motion 은 CSS 가 1차 처리, JS 는 불필요한 애니메이션 자제
 */
(function () {
  "use strict";

  const ROOT = document.documentElement;
  const REDUCED_MOTION = matchMedia("(prefers-reduced-motion: reduce)").matches;


  /* ---------------------------------------------------------------
   * theme — 라이트/다크 모드 전환
   * --------------------------------------------------------------- */

  const theme = {
    STORAGE_KEY: "theme",
    HLJS_LIGHT:
      "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/styles/github.min.css",
    HLJS_DARK:
      "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/styles/github-dark.min.css",

    /** MediaQueryList 를 모듈 스코프에 보존해야 일부 브라우저에서 change 리스너가 GC 로 유실되지 않음 */
    _mql: null,

    init() {
      const stored = safeStorageGet(this.STORAGE_KEY);
      this._mql = matchMedia("(prefers-color-scheme: dark)");
      const preferred = this._mql.matches ? "dark" : "light";
      this.apply(stored || preferred);

      document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
        btn.addEventListener("click", () => this.toggle());
      });

      this._mql.addEventListener("change", (e) => {
        if (!safeStorageGet(this.STORAGE_KEY)) {
          this.apply(e.matches ? "dark" : "light");
        }
      });
    },

    apply(mode) {
      ROOT.dataset.theme = mode;
      const link = document.getElementById("hljs-theme");
      if (link) link.href = mode === "dark" ? this.HLJS_DARK : this.HLJS_LIGHT;
      window.dispatchEvent(new CustomEvent("themechange", { detail: { mode } }));
    },

    toggle() {
      const next = ROOT.dataset.theme === "dark" ? "light" : "dark";
      safeStorageSet(this.STORAGE_KEY, next);
      this.apply(next);
    },
  };


  /* ---------------------------------------------------------------
   * pageTransition — 페이지 진입 페이드인
   * --------------------------------------------------------------- */

  const pageTransition = {
    init() {
      if (REDUCED_MOTION) {
        document.body.classList.add("is-loaded");
        return;
      }
      requestAnimationFrame(() => {
        document.body.classList.add("is-loaded");
      });
    },
  };


  /* ---------------------------------------------------------------
   * progress — 포스트 읽기 진행률 바
   * --------------------------------------------------------------- */

  const progress = {
    init() {
      const bar = document.querySelector("[data-reading-progress]");
      if (!bar) return;
      if (document.body.id !== "tt-body-page") {
        bar.style.display = "none";
        return;
      }

      let ticking = false;
      const update = () => {
        const h = document.documentElement;
        const scrolled = h.scrollTop || document.body.scrollTop;
        const maxScroll = h.scrollHeight - h.clientHeight;
        const pct = maxScroll > 0 ? Math.min(100, (scrolled / maxScroll) * 100) : 0;
        bar.style.width = pct + "%";
        ticking = false;
      };

      window.addEventListener(
        "scroll",
        () => {
          if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
          }
        },
        { passive: true }
      );
      update();
    },
  };


  /* ---------------------------------------------------------------
   * toc — 본문 h2/h3 스캔, id 부여, active 하이라이트
   * --------------------------------------------------------------- */

  const toc = {
    init() {
      if (document.body.id !== "tt-body-page") return;
      const body = document.querySelector("[data-post-body]");
      const container = document.querySelector("[data-toc]");
      const wrap = container ? container.closest(".post__toc-wrap") : null;
      if (!body || !container || !wrap) return;

      const headings = body.querySelectorAll("h2, h3");
      if (headings.length === 0) {
        wrap.remove();
        const fab = document.querySelector("[data-toc-fab]");
        if (fab) fab.remove();
        return;
      }

      const ul = document.createElement("ul");
      ul.className = "post__toc-list";
      const items = [];

      headings.forEach((h) => {
        if (!h.id) h.id = generateHeadingId(h);
        const li = document.createElement("li");
        li.className = "post__toc-item post__toc-item--" + h.tagName.toLowerCase();
        const a = document.createElement("a");
        a.href = "#" + h.id;
        a.textContent = h.textContent;
        a.dataset.tocLink = h.id;
        li.appendChild(a);
        ul.appendChild(li);
        items.push({ heading: h, link: a });
      });

      container.innerHTML = "";
      container.appendChild(ul);

      // IntersectionObserver 로 스크롤 따라 active
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const id = entry.target.id;
            items.forEach((item) => {
              item.link.classList.toggle("is-active", item.link.dataset.tocLink === id);
            });
          });
        },
        { rootMargin: "-20% 0% -70% 0%", threshold: 0 }
      );
      items.forEach((item) => observer.observe(item.heading));

      // 모바일 FAB 로 TOC 토글
      const fab = document.querySelector("[data-toc-fab]");
      if (fab) {
        fab.addEventListener("click", () => {
          const open = wrap.classList.toggle("is-open");
          fab.setAttribute("aria-expanded", open ? "true" : "false");
          fab.setAttribute("aria-label", open ? "목차 닫기" : "목차 열기");
        });
        // TOC 링크 클릭 시 패널 닫기
        container.addEventListener("click", (e) => {
          if (e.target.closest("a")) {
            wrap.classList.remove("is-open");
            fab.setAttribute("aria-expanded", "false");
          }
        });
      }
    },
  };

  /** 헤딩 텍스트를 기반으로 URL-safe id 생성. 중복 시 숫자 suffix */
  function generateHeadingId(heading) {
    const base =
      (heading.textContent || "section")
        .trim()
        .toLowerCase()
        .replace(/[^\w가-힣\s-]+/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "") || "section";
    let id = base;
    let i = 1;
    while (document.getElementById(id)) {
      id = base + "-" + i++;
    }
    return id;
  }


  /* ---------------------------------------------------------------
   * readingTime — 본문 텍스트 길이 기반 예상 읽기 시간
   * --------------------------------------------------------------- */

  const readingTime = {
    /** 한국어 평균 읽기 속도: 분당 ~450 글자 (보수적 추정) */
    CHARS_PER_MINUTE: 450,

    init() {
      const body = document.querySelector("[data-post-body]");
      const target = document.querySelector("[data-reading-time]");
      if (!body || !target) return;

      const text = (body.innerText || body.textContent || "").trim();
      const minutes = Math.max(1, Math.ceil(text.length / this.CHARS_PER_MINUTE));
      target.textContent = minutes + "분 읽기";
    },
  };


  /* ---------------------------------------------------------------
   * codeBlocks — highlight.js 로드 후 자동 하이라이트
   * --------------------------------------------------------------- */

  const codeBlocks = {
    init() {
      const body = document.querySelector("[data-post-body]");
      if (!body) return;

      let attempts = 0;
      const maxAttempts = 50;
      const interval = setInterval(() => {
        attempts++;
        if (window.hljs) {
          clearInterval(interval);
          body.querySelectorAll("pre code").forEach((el) => {
            try {
              window.hljs.highlightElement(el);
            } catch (_) {
              /* hljs 자체 에러는 무시 (라이브러리 내부 문제) */
            }
          });
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
        }
      }, 100);
    },
  };


  /* ---------------------------------------------------------------
   * tagPage — /tag vs /tag/X URL 분기 (U-2)
   * --------------------------------------------------------------- */

  const tagPage = {
    init() {
      if (document.body.id !== "tt-body-tag") return;
      const path = location.pathname.replace(/\/+$/, "");
      if (path === "/tag") {
        document.body.classList.add("is-tag-cloud");
      } else if (path.startsWith("/tag/")) {
        document.body.classList.add("is-tag-list");
      }
    },
  };


  /* ---------------------------------------------------------------
   * fadeIn — 스크롤 페이드인
   * --------------------------------------------------------------- */

  const fadeIn = {
    init() {
      const targets = document.querySelectorAll("[data-fade-in]");
      if (targets.length === 0) return;

      if (REDUCED_MOTION) {
        targets.forEach((el) => el.classList.add("is-inview"));
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-inview");
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );

      targets.forEach((el) => observer.observe(el));
    },
  };


  /* ---------------------------------------------------------------
   * glow — 다크 모드 커서 소프트 글로우 (variable 활성화 시)
   * --------------------------------------------------------------- */

  const glow = {
    init() {
      if (REDUCED_MOTION) return;
      if (ROOT.dataset.cursorGlow !== "true") return;

      const layer = document.createElement("div");
      layer.className = "cursor-glow";
      layer.setAttribute("aria-hidden", "true");
      document.body.appendChild(layer);

      let x = -400, y = -400; // 초기엔 화면 밖
      let running = false;

      document.addEventListener(
        "pointermove",
        (e) => {
          x = e.clientX - 150;
          y = e.clientY - 150;
          if (!running) {
            running = true;
            requestAnimationFrame(() => {
              layer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
              running = false;
            });
          }
        },
        { passive: true }
      );
    },
  };


  /* ---------------------------------------------------------------
   * chatbot — 챗봇 embed 훅 (Sprint 5)
   *
   * 외부 chatbot.js 가 사용할 공개 계약:
   *   #chatbot-widget-root          : 플로팅 위젯 마운트 지점
   *   .chatbot-inline-slot           : 포스트 본문 <!--[chatbot]--> 마커 치환 결과
   *   window.__CHATBOT_CONFIG__      : { endpoint, theme, mount }
   *   window.addEventListener('themechange', ...) : 테마 변경 이벤트
   * --------------------------------------------------------------- */

  const chatbot = {
    init() {
      const mount = document.getElementById("chatbot-widget-root");
      if (!mount) return;

      const endpoint = (ROOT.dataset.chatbotEndpoint || "").trim();

      window.__CHATBOT_CONFIG__ = {
        endpoint,
        theme: ROOT.dataset.theme,
        mount,
      };

      // 본문의 <!--[chatbot]--> 코멘트 노드를 인라인 슬롯 div 로 치환
      const body = document.querySelector("[data-post-body]");
      if (body) {
        const walker = document.createTreeWalker(body, NodeFilter.SHOW_COMMENT, null);
        const comments = [];
        let node;
        while ((node = walker.nextNode())) {
          if ((node.nodeValue || "").trim() === "[chatbot]") {
            comments.push(node);
          }
        }
        comments.forEach((comment) => {
          const slot = document.createElement("div");
          slot.className = "chatbot-inline-slot";
          slot.dataset.chatbotInline = "true";
          comment.parentNode.replaceChild(slot, comment);
        });
      }

      // 테마 변경 시 config 동기화 → 외부 chatbot.js 가 listen 해서 UI 테마 동기화 가능
      window.addEventListener("themechange", (e) => {
        if (window.__CHATBOT_CONFIG__) {
          window.__CHATBOT_CONFIG__.theme = e.detail.mode;
        }
      });
    },
  };


  /* ---------------------------------------------------------------
   * 유틸 — localStorage 안전 접근
   * --------------------------------------------------------------- */

  function safeStorageGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (_) {
      return null;
    }
  }

  function safeStorageSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (_) {
      /* ignore */
    }
  }


  /* ---------------------------------------------------------------
   * 초기화
   * --------------------------------------------------------------- */

  function init() {
    // 테마는 FOUC 방지 위해 가장 먼저
    theme.init();
    pageTransition.init();

    // 포스트 관련
    progress.init();
    toc.init();
    readingTime.init();
    codeBlocks.init();

    // 페이지 타입 분기
    tagPage.init();

    // 시각 효과
    fadeIn.init();
    glow.init();

    // 챗봇 훅
    chatbot.init();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

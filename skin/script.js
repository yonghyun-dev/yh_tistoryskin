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
 *   toc           — 포스트 본문 h1/h2/h3 스캔 → TOC 생성 + active 하이라이트
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
   * toc — 본문 h1/h2/h3 스캔, id 부여, active 하이라이트
   * --------------------------------------------------------------- */

  const toc = {
    init() {
      if (document.body.id !== "tt-body-page") return;
      const body = document.querySelector("[data-post-body]");
      const container = document.querySelector("[data-toc]");
      const wrap = container ? container.closest(".post__toc-wrap") : null;
      if (!body || !container || !wrap) return;

      const headings = body.querySelectorAll("h1, h2, h3");
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
   * loadTistoryCategories — [##_category_list_##] 매크로가 서버 렌더한
   * 숨긴 소스를 파싱해 실제 카테고리만 추출 (RSS 의 tag/category 혼재 회피).
   *
   * 반환 형식: [{ name, href, count }, ...]
   *   - "분류 전체보기" (root) 는 제외
   *   - 글 0개 카테고리도 제외
   * --------------------------------------------------------------- */

  function loadTistoryCategories() {
    const source = document.querySelector("[data-categories-source]");
    if (!source) return [];

    const out = [];
    const seen = new Set();
    source.querySelectorAll("a[href^='/category']").forEach((a) => {
      const href = a.getAttribute("href") || "";
      // 루트 "분류 전체보기" 제외
      if (href === "/category" || href === "/category/") return;

      // 이름: anchor 텍스트에서 "(N)" 카운트 꼬리표 떼어냄
      const raw = (a.textContent || "").replace(/\s+/g, " ").trim();
      const name = raw.replace(/\s*\(\d+\)\s*$/, "").trim();
      if (!name) return;

      // 카운트: 형제/자식 노드 어디에 있든 "(N)" 패턴으로 잡는다
      let count = 0;
      const mSelf = raw.match(/\((\d+)\)\s*$/);
      if (mSelf) count = parseInt(mSelf[1], 10);
      else {
        const sib = a.parentElement && a.parentElement.textContent;
        const mSib = sib && sib.match(/\((\d+)\)/);
        if (mSib) count = parseInt(mSib[1], 10);
      }

      // 중복 제거 (같은 href 가 여러번 나올 수 있음)
      if (seen.has(href)) return;
      seen.add(href);

      if (count > 0) out.push({ name, href, count });
    });

    return out;
  }

  // 이름 해시 기반 결정적 accent (6색 팔레트)
  const CATEGORY_PALETTE = ["#f59e0b", "#38bdf8", "#a78bfa", "#2dd4bf", "#60a5fa", "#fb7185"];
  function categoryAccent(name) {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
    return CATEGORY_PALETTE[Math.abs(h) % CATEGORY_PALETTE.length];
  }

  /* ---------------------------------------------------------------
   * homeSections — 홈의 섹션 02 (카테고리 그리드) + 04 (stats/bars) 렌더
   *   - 02: Tistory [##_category_list_##] 기반 실제 카테고리 상위 4개
   *   - 04: /rss 로 posts/topics/months 카운트 + 최근 12개월 activity bars
   *   - 홈(tt-body-index) 에서만 동작
   * --------------------------------------------------------------- */

  const homeSections = {
    init() {
      if (document.body.id !== "tt-body-index") return;
      this.renderSeriesGrid();
      this.renderStats();
    },

    renderSeriesGrid() {
      const mount = document.querySelector("[data-series-grid-mount]");
      if (!mount) return;

      const cats = loadTistoryCategories();
      if (cats.length === 0) {
        mount.innerHTML = `<p class="muted mono" style="font-size:12px;">아직 카테고리가 없습니다.</p>`;
        return;
      }

      // 글 수 많은 순 정렬 후 상위 4개
      const top = cats.slice().sort((a, b) => b.count - a.count).slice(0, 4);

      // 최신 글 매칭: RSS entry 의 <category> 중 실제 카테고리명과 일치하는 엔트리
      const realCatSet = new Set(cats.map((c) => c.name));
      loadRssEntries()
        .then((entries) => {
          const latestPerCat = new Map();
          entries.forEach((entry) => {
            const hitName = (entry.categories || []).find((c) => realCatSet.has(c));
            if (!hitName) return;
            const prev = latestPerCat.get(hitName);
            if (!prev || (entry.date && entry.date > prev.date)) {
              latestPerCat.set(hitName, { title: entry.title, date: entry.date });
            }
          });
          top.forEach((c) => { c.latest = latestPerCat.get(c.name) || null; });
          mount.innerHTML = top.map((c) => cardHtml(c)).join("");
        })
        .catch(() => {
          mount.innerHTML = top.map((c) => cardHtml(c)).join("");
        });

      function cardHtml(c) {
        return `
          <a class="series-card" href="${c.href}" style="--series-accent:${categoryAccent(c.name)};">
            <div class="series-card__head">
              <span class="series-dot" aria-hidden="true"></span>
              <span class="series-card__subtitle mono">${c.count} post${c.count > 1 ? "s" : ""}</span>
            </div>
            <h3 class="series-card__title">${escapeHtml(c.name)}</h3>
            <p class="series-card__desc">${c.latest ? "최근 글 — " + escapeHtml(c.latest.title) : ""}</p>
            <div class="series-card__foot mono">
              <span class="series-card__cta">시간순으로 읽기 →</span>
            </div>
          </a>
        `;
      }
    },

    renderStats() {
      const postsEl  = document.querySelector('[data-stat="posts"]');
      const tagsEl   = document.querySelector('[data-stat="tags"]');
      const monthsEl = document.querySelector('[data-stat="months"]');
      const barsEl   = document.querySelector("[data-stat-bars]");
      const startEl  = document.querySelector("[data-stat-bars-start]");
      const endEl    = document.querySelector("[data-stat-bars-end]");

      // 04 섹션이 없는 스킨 변경 상황 대비: mount 하나라도 있으면 진행
      if (!postsEl && !tagsEl && !monthsEl && !barsEl) return;

      // "topics" 는 실제 카테고리 개수 (태그 섞인 RSS <category> 말고
      //  [##_category_list_##] 기반 loadTistoryCategories 사용)
      const realCats = loadTistoryCategories();

      loadRssEntries()
        .then((entries) => {
          const posts = entries.length;
          const monthSet = new Set();
          entries.forEach((e) => {
            if (e.date) monthSet.add(e.date.slice(0, 7)); // YYYY-MM
          });

          if (postsEl)  postsEl.textContent  = String(posts);
          if (tagsEl)   tagsEl.textContent   = String(realCats.length);
          if (monthsEl) monthsEl.textContent = String(monthSet.size);

          // 최근 12개월 버킷 (오래된 → 최신 순)
          if (barsEl) {
            const buckets = [];
            const now = new Date();
            for (let i = 11; i >= 0; i--) {
              const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
              const key = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
              buckets.push({ key, label: key, count: 0 });
            }
            const bucketMap = new Map(buckets.map((b) => [b.key, b]));
            entries.forEach((e) => {
              if (!e.date) return;
              const key = e.date.slice(0, 7);
              const b = bucketMap.get(key);
              if (b) b.count++;
            });
            const max = Math.max(1, ...buckets.map((b) => b.count));
            barsEl.innerHTML = buckets.map((b) => {
              const pct = Math.round((b.count / max) * 100);
              const active = b.count > 0 ? " is-active" : "";
              return `<div class="bar${active}" style="height:${Math.max(pct, 8)}%;" title="${b.label}: ${b.count}"></div>`;
            }).join("");

            if (startEl) startEl.textContent = buckets[0].label;
            if (endEl)   endEl.textContent   = buckets[buckets.length - 1].label;
          }
        })
        .catch(() => { /* RSS 실패 시 기존 "—" 표시를 그대로 유지 */ });
    },
  };


  /* ---------------------------------------------------------------
   * pageRouter — Tistory PAGE 인지 판별 + 어떤 페이지인지 분기
   *   판별 순서:
   *     1) URL 경로가 /archive · /series · /about 중 하나
   *     2) PAGE title (data-page-title) 이 "Archive" / "Series" / "About" 와 일치
   *   일치 시 body 에 data-page-type 속성 부여 → 하위 모듈이 dispatch
   * --------------------------------------------------------------- */

  const pageRouter = {
    // paths: Tistory PAGE 의 실제 URL 은 /pages/<slug> 규격이다.
    //   - /archive, /tag 는 Tistory 네이티브 라우트라 PAGE 없어도 200 뜨지만,
    //     PAGE 로 커스텀 콘텐츠를 얹고 싶으면 /pages/archive 로 만들면 매칭됨
    //   - /series, /about 은 네이티브가 없어 반드시 /pages/<slug> PAGE 필요
    TYPES: {
      archive: { titles: ["archive", "아카이브"],       paths: ["/archive", "/pages/archive"] },
      series:  { titles: ["series", "시리즈"],          paths: ["/pages/series"] },
      about:   { titles: ["about", "어바웃", "소개"],   paths: ["/pages/about"]  },
    },

    init() {
      const pageEl = document.querySelector("[data-page]");
      if (!pageEl) return;

      const path = (location.pathname || "").toLowerCase().replace(/\/+$/, "");
      const title = String(pageEl.dataset.pageTitle || "").trim().toLowerCase();

      for (const [type, spec] of Object.entries(this.TYPES)) {
        const pathMatch  = spec.paths.some((p) => path === p || path.startsWith(p + "/"));
        const titleMatch = spec.titles.some((t) => title === t);
        if (pathMatch || titleMatch) {
          document.body.dataset.pageType = type;
          // 원래 PAGE 본문은 숨기고 동적 마운트만 노출 (본문이 비어있는 placeholder PAGE 기준)
          const pageBody = pageEl.querySelector("[data-page-body]");
          if (pageBody && !pageBody.textContent.trim()) pageBody.hidden = true;
          return;
        }
      }
    },
  };


  /* ---------------------------------------------------------------
   * archivePage — /archive PAGE 에서 /rss fetch → 연도 그룹 + 인라인 검색
   *   R3: /rss 개수 제한 fallback 없음 (초기 구현).
   *       전체가 안 내려오면 Tistory 관리자에서 RSS 개수 최대치로 설정 권장
   * --------------------------------------------------------------- */

  const archivePage = {
    _entries: null,
    _cache: null, // 다른 모듈(search, homeSections)이 재활용

    init() {
      if (document.body.dataset.pageType !== "archive") return;
      const mount = document.querySelector("[data-archive-mount]");
      if (!mount) return;
      mount.hidden = false;
      mount.innerHTML = `
        <div class="page-eyebrow mono">/ archive</div>
        <h1 class="page-title">전체 글 아카이브</h1>
        <p class="page-lede" data-archive-lede>RSS에서 글 목록을 불러오는 중…</p>
        <div class="archive-toolbar">
          <div class="toolbar-left">
            <label class="archive-input">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7"/>
                <path d="m20 20-3.5-3.5"/>
              </svg>
              <input id="archive-search" type="search" placeholder="제목, 카테고리에서…" autocomplete="off" />
            </label>
          </div>
          <div class="toolbar-right mono" data-archive-count>—</div>
        </div>
        <div data-archive-groups></div>
      `;

      loadRssEntries().then((entries) => {
        archivePage._entries = entries;
        archivePage.render("");
        const input = mount.querySelector("#archive-search");
        if (input) {
          let t;
          input.addEventListener("input", (e) => {
            clearTimeout(t);
            const v = e.target.value;
            t = setTimeout(() => archivePage.render(v), 80);
          });
        }
      }).catch(() => {
        const lede = mount.querySelector("[data-archive-lede]");
        if (lede) lede.textContent = "RSS를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.";
      });
    },

    render(query) {
      const mount = document.querySelector("[data-archive-mount]");
      if (!mount || !this._entries) return;
      const q = (query || "").toLowerCase().trim();
      const filtered = q
        ? this._entries.filter((p) =>
            (p.title + " " + p.category).toLowerCase().includes(q))
        : this._entries;

      const byYear = {};
      filtered.forEach((p) => {
        const y = (p.date || "").slice(0, 4) || "—";
        (byYear[y] = byYear[y] || []).push(p);
      });
      const years = Object.keys(byYear).sort((a, b) => (a < b ? 1 : -1));

      const groups = years.map((year) => `
        <div class="archive-group">
          <div class="archive-year mono">
            <span>${year}</span>
            <span class="count">${byYear[year].length} entries</span>
          </div>
          ${byYear[year].map((p) => `
            <a class="archive-row" href="${escapeHtml(p.link)}">
              <div class="archive-date mono">${escapeHtml((p.date || "").replace(/-/g, "."))}</div>
              <div class="archive-title-wrap">
                <p class="archive-title">${escapeHtml(p.title)}</p>
                ${p.category ? `<p class="archive-summary">${escapeHtml(p.category)}</p>` : ""}
              </div>
              <div class="archive-tags"></div>
            </a>
          `).join("")}
        </div>
      `).join("");

      mount.querySelector("[data-archive-groups]").innerHTML =
        filtered.length === 0
          ? `<div class="list__empty"><p class="mono">no entries match "<span style="color:var(--accent);">${escapeHtml(q)}</span>"</p></div>`
          : groups;

      const lede = mount.querySelector("[data-archive-lede]");
      if (lede) lede.textContent = `${this._entries.length}개의 글. 가장 최근 글부터 정렬되어 있습니다.`;
      const count = mount.querySelector("[data-archive-count]");
      if (count) count.textContent = `${filtered.length} / ${this._entries.length} entries`;
    },
  };


  /* ---------------------------------------------------------------
   * seriesPage — /pages/series 에서 실제 Tistory 카테고리 목록 렌더
   *   RSS 는 태그/카테고리 혼재라 쓰지 않고 [##_category_list_##] 매크로를
   *   파싱한 loadTistoryCategories 결과를 사용.
   *   각 카테고리는 "시간순으로 읽기" 링크로 연결되어 categoryPage 가
   *   오래된→최신 정렬로 보여줌.
   * --------------------------------------------------------------- */

  const seriesPage = {
    init() {
      if (document.body.dataset.pageType !== "series") return;
      const mount = document.querySelector("[data-series-index-mount]");
      if (!mount) return;
      mount.hidden = false;

      mount.innerHTML = `
        <div class="page-eyebrow mono">/ series</div>
        <h1 class="page-title">시리즈</h1>
        <p class="page-lede" data-series-lede>카테고리별로 묶인 글을 시간 순으로 읽을 수 있습니다.</p>
        <div class="series-list" data-series-list></div>
      `;

      const lede = mount.querySelector("[data-series-lede]");
      const list = mount.querySelector("[data-series-list]");

      const cats = loadTistoryCategories();
      if (cats.length === 0) {
        if (lede) lede.textContent = "아직 카테고리가 없습니다.";
        return;
      }

      // 글 수 많은 순 기본 정렬 (가장 큰 시리즈가 먼저)
      const sorted = cats.slice().sort((a, b) => b.count - a.count);

      if (lede) lede.textContent = `총 ${sorted.length}개의 카테고리. 카드 클릭 시 시간순으로 정렬되어 보입니다.`;

      // RSS 로 각 카테고리의 최신 글 제목 한 줄 가져오기 (best-effort)
      const realCatSet = new Set(sorted.map((c) => c.name));
      loadRssEntries()
        .then((entries) => {
          const latestPerCat = new Map();
          entries.forEach((entry) => {
            const hit = (entry.categories || []).find((c) => realCatSet.has(c));
            if (!hit) return;
            const prev = latestPerCat.get(hit);
            if (!prev || (entry.date && entry.date > prev.date)) {
              latestPerCat.set(hit, { title: entry.title, date: entry.date });
            }
          });
          sorted.forEach((c) => { c.latest = latestPerCat.get(c.name) || null; });
          list.innerHTML = sorted.map(rowHtml).join("");
        })
        .catch(() => {
          list.innerHTML = sorted.map(rowHtml).join("");
        });

      function rowHtml(c) {
        return `
          <a class="series-row" href="${c.href}" style="--series-accent:${categoryAccent(c.name)};">
            <div class="series-row-rail" aria-hidden="true">
              <span class="series-dot"></span>
            </div>
            <div class="series-row-body">
              <div class="series-row-meta mono">
                <span>${c.count} post${c.count > 1 ? "s" : ""}</span>
                ${c.latest && c.latest.date ? `<span class="sep">·</span><span>최근 ${escapeHtml(c.latest.date)}</span>` : ""}
              </div>
              <h3 class="series-row-title">${escapeHtml(c.name)}</h3>
              ${c.latest ? `<p class="series-row-desc">최근 글 — ${escapeHtml(c.latest.title)}</p>` : ""}
            </div>
            <div class="series-row-arrow" aria-hidden="true">시간순 →</div>
          </a>
        `;
      }
    },
  };


  /* ---------------------------------------------------------------
   * categoryPage — Tistory 카테고리 페이지(/category/X) 에서
   *   글 카드를 시간순(오래된 → 최신) 으로 재정렬.
   *   Tistory 가 기본적으로 최신순으로 뿌려주므로 DOM 순서만 뒤집으면 됨.
   * --------------------------------------------------------------- */

  const categoryPage = {
    init() {
      if (document.body.id !== "tt-body-category") return;

      const list = document.querySelector(".card-grid");
      if (!list) return;

      const cards = Array.from(list.querySelectorAll(".card"));
      if (cards.length < 2) return;

      // 각 카드의 <time> 텍스트 (Tistory 기본 포맷 "YYYY. MM. DD." 또는 "YYYY-MM-DD")
      function dateKey(card) {
        const t = card.querySelector("time");
        const raw = (t?.textContent || t?.getAttribute("datetime") || "").trim();
        // 숫자만 뽑아 조합해 정렬키로 사용 → "20260419"
        const digits = raw.replace(/\D/g, "");
        return digits || "";
      }

      cards.sort((a, b) => {
        const ka = dateKey(a), kb = dateKey(b);
        if (ka === kb) return 0;
        return ka < kb ? -1 : 1; // 오래된 → 최신
      });

      const frag = document.createDocumentFragment();
      cards.forEach((c, i) => {
        // 시간순 번호 주입 (디자인용, 기존 .card__category 옆 작게 표시)
        if (!c.querySelector("[data-series-seq]")) {
          const meta = c.querySelector(".card__category");
          if (meta) {
            const seq = document.createElement("span");
            seq.className = "card__seq mono";
            seq.dataset.seriesSeq = String(i + 1);
            seq.textContent = "#" + String(i + 1).padStart(2, "0");
            seq.style.marginRight = "6px";
            seq.style.color = "var(--text-faint)";
            meta.insertBefore(seq, meta.firstChild);
          }
        }
        frag.appendChild(c);
      });
      list.appendChild(frag);

      // list head 에 "시간순으로 정렬됨" 배지 추가
      const head = document.querySelector(".list__head");
      if (head && !head.querySelector("[data-series-badge]")) {
        const badge = document.createElement("p");
        badge.className = "mono";
        badge.dataset.seriesBadge = "true";
        badge.style.color = "var(--text-faint)";
        badge.style.fontSize = "12px";
        badge.style.marginTop = "4px";
        badge.textContent = "시간순 정렬 — 오래된 글부터 최신 글까지";
        head.appendChild(badge);
      }
    },
  };


  /* ---------------------------------------------------------------
   * aboutPage — /about PAGE 에서 정적 프로필 + 타임라인 렌더
   *   Tistory PAGE 본문이 비어 있으면 이 정적 콘텐츠로 대체.
   *   PAGE 본문이 있으면 그걸 그대로 .prose 스타일로 보여주고 side/timeline 은 추가.
   * --------------------------------------------------------------- */

  const aboutPage = {
    init() {
      if (document.body.dataset.pageType !== "about") return;
      const mount = document.querySelector("[data-about-mount]");
      if (!mount) return;
      mount.hidden = false;

      // variables 에서 가져올 수 있는 값은 skin.html 에서 data-* 으로 노출하는 편이 정석이나,
      // 여기서는 정적 placeholder 를 기본으로 두고 관리자가 PAGE 본문을 채울 때는 그 위에 side/timeline 만 붙임.
      const pageBody = document.querySelector("[data-page-body]");
      const hasBody  = pageBody && pageBody.textContent.trim().length > 0;

      mount.innerHTML = `
        <div class="page-eyebrow mono">/ about</div>
        <div class="about-grid">
          <div class="prose" data-about-prose>
            ${hasBody ? "" : `<p class="muted">About 페이지 본문을 Tistory 관리자에서 작성하면 이곳에 표시됩니다.</p>`}
          </div>
          <aside class="about-side">
            <h4>profile</h4>
            <ul>
              <li><span>since</span><span class="v" data-about-since>—</span></li>
              <li><span>tz</span><span class="v">Asia/Seoul</span></li>
            </ul>
            <h4>links</h4>
            <ul data-about-links></ul>
          </aside>
        </div>
      `;

      // PAGE 본문이 있으면 그것을 prose 안에 이동
      if (hasBody) {
        const prose = mount.querySelector("[data-about-prose]");
        prose.innerHTML = pageBody.innerHTML;
        pageBody.hidden = true;
      }

      // 링크 영역 — a[rel="me"] 등이 없어서 단순히 profile-link-* 변수 기반
      // skin.html 에서 data- 속성으로 노출해 두는 게 이상적이지만,
      // 지금은 footer 의 동일 링크들을 가볍게 복제
      const linksUl = mount.querySelector("[data-about-links]");
      if (linksUl) {
        const footerLinks = document.querySelectorAll(".footer-links a");
        footerLinks.forEach((a) => {
          const li = document.createElement("li");
          li.innerHTML = `<span>${escapeHtml((a.textContent || "").toLowerCase())}</span><span class="v"><a href="${a.getAttribute("href")}">${escapeHtml(a.textContent || "")}</a></span>`;
          linksUl.appendChild(li);
        });
      }
    },
  };


  /* ---------------------------------------------------------------
   * loadRssEntries — /rss 를 한 번만 fetch 해 in-memory 캐시
   *   사용처: archivePage, search, (옵션) homeSections 의 stat bars
   * --------------------------------------------------------------- */

  let _rssPromise = null;
  function loadRssEntries() {
    if (_rssPromise) return _rssPromise;
    _rssPromise = fetch("/rss", { credentials: "same-origin" })
      .then((r) => { if (!r.ok) throw new Error("rss " + r.status); return r.text(); })
      .then((xml) => {
        const doc = new DOMParser().parseFromString(xml, "application/xml");
        const items = Array.from(doc.querySelectorAll("item")).map((it) => {
          const title = (it.querySelector("title")?.textContent || "").trim();
          const link  = (it.querySelector("link")?.textContent  || "").trim();
          const pub   = (it.querySelector("pubDate")?.textContent || "").trim();
          const cats  = Array.from(it.querySelectorAll("category")).map((c) => c.textContent.trim()).filter(Boolean);
          let iso = "";
          if (pub) {
            const d = new Date(pub);
            if (!isNaN(d)) iso = d.toISOString().slice(0, 10);
          }
          return { title, link, date: iso, category: cats[0] || "", categories: cats };
        }).filter((e) => e.title && e.link);
        items.sort((a, b) => (a.date < b.date ? 1 : -1));
        return items;
      });
    return _rssPromise;
  }


  /* ---------------------------------------------------------------
   * escapeHtml — 간단 HTML 이스케이프
   * --------------------------------------------------------------- */

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
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

      // 1) .code-head (lang 라벨 + copy 버튼) 을 모든 pre > code 블록에 주입
      body.querySelectorAll("pre").forEach((pre) => {
        if (pre.querySelector(".code-head")) return; // 멱등성
        const code = pre.querySelector("code");
        if (!code) return;

        const lang = (() => {
          const m = String(code.className || "").match(/language-([\w+-]+)/i);
          return m ? m[1] : "code";
        })();

        const head = document.createElement("div");
        head.className = "code-head";
        head.innerHTML =
          `<span class="lang">${lang}</span>` +
          `<span class="copy" role="button" tabindex="0">copy</span>`;
        pre.insertBefore(head, code);
        pre.classList.add("has-code-head");

        const btn = head.querySelector(".copy");
        btn.addEventListener("click", async () => {
          try {
            await navigator.clipboard.writeText(code.innerText);
            const orig = btn.textContent;
            btn.textContent = "copied";
            setTimeout(() => { btn.textContent = orig; }, 1200);
          } catch (_) {
            /* clipboard 실패 시 조용히 무시 */
          }
        });
      });

      // 2) highlight.js 로드 후 자동 하이라이트
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
   * search — ⌘K/Ctrl+K 오버레이 (Dev-Archive 감각: 라이브 프리뷰 + 키보드 내비)
   *   모드:
   *     - overlay+preview (기본): /rss fetch 후 제목/카테고리에서 메모리 매칭
   *     - overlay        : Enter 시 /search/:q 로 redirect 만
   *     - native         : 오버레이 비활성 (기존 Tistory 폼 재활성)
   * --------------------------------------------------------------- */

  const search = {
    _currentResults: [],
    _activeIndex: 0,
    _mode: "overlay+preview",

    init() {
      const overlay = document.getElementById("search-overlay");
      const input   = document.getElementById("search-input");
      const list    = document.getElementById("search-results");
      const opener  = document.getElementById("search-open");
      const closer  = document.getElementById("search-close");
      if (!overlay || !input || !list) return;

      // index.xml variable 에서 search-mode 값 읽기 (없으면 기본)
      const modeAttr = ROOT.dataset.searchMode;
      if (modeAttr === "native") { overlay.remove(); this._revealNative(); return; }
      if (modeAttr === "overlay") this._mode = "overlay";

      const open = () => {
        overlay.hidden = false;
        document.body.style.overflow = "hidden";
        input.value = "";
        this._activeIndex = 0;
        this._renderResults("");
        setTimeout(() => input.focus(), 30);
      };
      const close = () => {
        overlay.hidden = true;
        document.body.style.overflow = "";
      };

      if (opener) opener.addEventListener("click", open);
      if (closer) closer.addEventListener("click", close);
      overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });

      document.addEventListener("keydown", (e) => {
        const isMeta = e.metaKey || e.ctrlKey;
        if (isMeta && (e.key === "k" || e.key === "K")) {
          e.preventDefault();
          overlay.hidden ? open() : close();
          return;
        }
        if (overlay.hidden) return;
        if (e.key === "Escape") { e.preventDefault(); close(); }
        else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          if (this._currentResults.length === 0) return;
          const delta = e.key === "ArrowDown" ? 1 : -1;
          this._activeIndex = (this._activeIndex + delta + this._currentResults.length) % this._currentResults.length;
          this._updateActive();
        } else if (e.key === "Enter") {
          e.preventDefault();
          const r = this._currentResults[this._activeIndex];
          if (r && r.link) { close(); location.href = r.link; }
          else {
            // 라이브 프리뷰에서 매칭 없음 → 서버 검색으로 fallback
            const q = input.value.trim();
            if (q) location.href = "/search/" + encodeURIComponent(q);
          }
        }
      });

      input.addEventListener("input", (e) => {
        this._activeIndex = 0;
        this._renderResults(e.target.value);
      });

      // 라이브 프리뷰 모드일 때만 RSS 미리 로드
      if (this._mode === "overlay+preview") {
        loadRssEntries().catch(() => { /* preview 실패해도 redirect 모드는 동작 */ });
      }
    },

    _renderResults(q) {
      const list = document.getElementById("search-results");
      if (!list) return;
      const trimmed = (q || "").trim();

      if (this._mode !== "overlay+preview") {
        list.innerHTML = trimmed
          ? `<div class="search-empty mono">Enter ↵ 로 /search/${escapeHtml(trimmed)} 이동</div>`
          : `<div class="search-empty mono">검색어를 입력하세요</div>`;
        this._currentResults = [];
        return;
      }

      const render = (entries) => {
        this._currentResults = !trimmed
          ? entries.slice(0, 8)
          : entries.filter((p) =>
              (p.title + " " + p.category + " " + (p.categories || []).join(" "))
                .toLowerCase().includes(trimmed.toLowerCase())
            ).slice(0, 12);

        if (this._currentResults.length === 0) {
          list.innerHTML = `<div class="search-empty mono">no results — Enter ↵ 로 서버 검색</div>`;
          return;
        }
        list.innerHTML = this._currentResults.map((p, i) => `
          <a class="search-result ${i === this._activeIndex ? "is-active" : ""}" data-idx="${i}" href="${escapeHtml(p.link)}">
            <div class="title">${this._highlight(p.title, trimmed)}</div>
            <div class="sub mono">
              ${p.category ? `<span>${escapeHtml(p.category)}</span>` : ""}
              ${p.date ? `<span>·</span><span>${escapeHtml(p.date.replace(/-/g,"."))}</span>` : ""}
            </div>
          </a>
        `).join("");

        list.querySelectorAll(".search-result").forEach((el) => {
          el.addEventListener("mouseenter", () => {
            this._activeIndex = Number(el.dataset.idx);
            this._updateActive();
          });
        });
      };

      // 캐시된 promise 이미 resolved → 즉시 render, 아니면 await
      (loadRssEntries().then(render)).catch(() => {
        list.innerHTML = `<div class="search-empty mono">RSS 로드 실패 — Enter ↵ 로 서버 검색</div>`;
      });
    },

    _highlight(text, q) {
      if (!q) return escapeHtml(text);
      const lower = text.toLowerCase();
      const idx = lower.indexOf(q.toLowerCase());
      if (idx < 0) return escapeHtml(text);
      return escapeHtml(text.slice(0, idx))
        + "<mark>" + escapeHtml(text.slice(idx, idx + q.length)) + "</mark>"
        + escapeHtml(text.slice(idx + q.length));
    },

    _updateActive() {
      const list = document.getElementById("search-results");
      if (!list) return;
      list.querySelectorAll(".search-result").forEach((el, i) => {
        el.classList.toggle("is-active", i === this._activeIndex);
      });
      const active = list.querySelector(".search-result.is-active");
      if (active) active.scrollIntoView({ block: "nearest" });
    },

    _revealNative() {
      const form = document.getElementById("native-search-form");
      if (form) form.hidden = false;
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

    // 페이지 타입 분기 (PAGE 여부 판별 → body[data-page-type] 세팅)
    pageRouter.init();

    // 포스트 관련
    progress.init();
    toc.init();
    readingTime.init();
    codeBlocks.init();

    // 홈 섹션 렌더 (tt-body-index 전용)
    homeSections.init();

    // PAGE 모듈 — pageRouter.init 이후에 호출
    archivePage.init();
    seriesPage.init();
    aboutPage.init();

    // tag page 분기 (/tag vs /tag/X)
    tagPage.init();

    // 카테고리 페이지 (시간순 정렬)
    categoryPage.init();

    // ⌘K 검색 오버레이
    search.init();

    // 시각 효과 (DOM 주입 후 실행 — 모든 마운트 결과를 fade-in 대상으로 수집)
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

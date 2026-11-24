/* Portfolio app. Plain JS, no dependencies.
   Views: feed (#/), pin (#/pin/:id), profile (#/profile, #/profile/saved), board (#/board/:id) */
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const app = $("#app");
  const searchInput = $("#search");
  const CATS = [
    ["all", "All"], ["product", "Product"], ["systems", "Systems"],
    ["ml", "ML"], ["research", "Research"], ["life", "Life"],
  ];
  const CAT_LABEL = Object.fromEntries(CATS);
  const BASE_COL = 236; // pin heights in data.js are authored for this column width
  const GAP = 16;

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const byId = Object.fromEntries(PINS.map((p) => [p.id, p]));

  /* ---------- saved pins (localStorage, fails soft) ---------- */
  const STORE_KEY = "sanjana.saved.v1";
  const saved = new Set((() => {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || "[]"); } catch { return []; }
  })());
  function persist() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify([...saved])); } catch { /* private mode etc. */ }
  }
  function toggleSave(id) {
    const on = !saved.has(id);
    on ? saved.add(id) : saved.delete(id);
    persist();
    document.querySelectorAll(`[data-save="${id}"]`).forEach(paintSave);
    toast(on ? "Saved to your profile" : "Removed from saved", on ? { label: "View", href: "#/profile/saved" } : null);
  }
  function paintSave(btn) {
    const on = saved.has(btn.dataset.save);
    btn.classList.toggle("is-saved", on);
    btn.setAttribute("aria-pressed", on);
    btn.textContent = on ? "Saved" : "Save";
  }

  /* ---------- toast ---------- */
  let toastTimer;
  function toast(msg, action) {
    const el = $("#toast");
    el.innerHTML = `<span>${esc(msg)}</span>` + (action ? `<a href="${action.href}">${esc(action.label)}</a>` : "");
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  }

  /* ---------- covers: drawn card art so the site works before screenshots exist ---------- */
  function sparkPath(vals, w = 200, h = 50) {
    const max = Math.max(...vals), min = Math.min(...vals);
    return vals.map((v, i) => {
      const x = (i / (vals.length - 1)) * w;
      const y = h - ((v - min) / (max - min || 1)) * h;
      return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(" ");
  }
  const COVERS = {
    app: (c) => `<div class="c-center"><div class="c-phone"><div class="c-screen">
        <div class="c-alert" style="background:${c.accent}">${esc(c.head)}</div>
        ${c.rows.map((r) => `<div class="c-row"><span>${esc(r)}</span><i></i></div>`).join("")}
        <div class="c-map"><b style="background:${c.accent}"></b></div>
      </div></div></div>`,
    metric: (c) => `<div class="c-metric">
        <div class="c-label">${esc(c.label)}</div>
        <svg viewBox="-4 -4 208 58" preserveAspectRatio="none" aria-hidden="true"><path d="${sparkPath(c.spark)}"/></svg>
        <div class="c-value">${esc(c.value)}</div></div>`,
    editor: () => `<div class="c-center"><div class="c-doc">
        <span class="c-cur" style="top:22%;left:46%;--k:#e60023">you</span>
        <span class="c-cur" style="top:62%;left:18%;--k:#0a7cff">teammate</span>
        <i style="width:55%;height:12px;background:#111"></i><i></i><i class="hl" style="width:82%"></i><i style="width:70%"></i><i></i><i class="hl2" style="width:48%"></i><i style="width:86%"></i>
      </div></div>`,
    terminal: (c) => `<div class="c-term"><div class="c-dots"><i></i><i></i><i></i></div><pre>${esc(c.lines.join("\n"))}</pre></div>`,
    player: () => `<div class="c-player">
        <div class="c-album"></div>
        <div class="c-track"><b>Feeling: calm</b><span>12 songs picked for you</span></div>
        <div class="c-wave">${Array.from({ length: 28 }, (_, i) => `<i style="height:${18 + Math.round(78 * Math.abs(Math.sin(i * 1.3)))}%"></i>`).join("")}</div>
        <div class="c-controls"><i></i><b></b><i></i></div></div>`,
    weather: () => `<div class="c-weather"><span>Boston</span><b>72°</b><span>Light rain later</span>
        <div class="c-days">${["Mon", "Tue", "Wed", "Thu"].map((d, i) => `<div><small>${d}</small><em>${[70, 64, 61, 66][i]}°</em></div>`).join("")}</div></div>`,
    paper: (c) => `<div class="c-center"><div class="c-paper"><small>${esc(c.venue)}</small><b>${esc(c.head)}</b>
        ${Array.from({ length: 7 }, (_, i) => `<i style="width:${[100, 94, 98, 88, 96, 72, 90][i]}%"></i>`).join("")}</div></div>`,
    chart: (c) => `<div class="c-chart">${c.bars.map((b) => `<i style="height:${b * 10}%"></i>`).join("")}</div>`,
    note: (c) => `<div class="c-note" style="color:${c.ink || "#111"}">${esc(c.text)}</div>`,
  };
  function art(p, height) {
    const h = height ? `height:${height}px;` : "";
    if (p.img) return `<div class="art" style="${h}"><img src="${esc(p.img)}" alt="" loading="lazy"></div>`;
    const c = p.cover;
    const dark = c.type === "terminal" ? " art-dark" : "";
    return `<div class="art${dark}" style="${h}background:${c.bg}">${(COVERS[c.type] || COVERS.note)(c)}</div>`;
  }

  /* ---------- pin card ---------- */
  function card(p, colW) {
    const h = Math.round(p.h * (colW / BASE_COL));
    return `<div class="pin">
      <a class="pin-hit" href="#/pin/${p.id}" aria-label="${esc(p.title)}">${art(p, h)}<span class="pin-kind" aria-hidden="true">${esc(CAT_LABEL[p.cats[0]])}</span></a>
      <button class="save" data-save="${p.id}" aria-pressed="false">Save</button>
      <a class="pin-title" href="#/pin/${p.id}" tabindex="-1">${esc(p.title)}</a>
      <div class="pin-sub">${esc(p.sub)}</div>
    </div>`;
  }

  /* ---------- masonry: each pin goes into the currently shortest column ---------- */
  const layouts = new Map();
  function masonry(el, pins) {
    const width = el.clientWidth;
    const n = Math.max(2, Math.floor((width + GAP) / (BASE_COL + GAP)));
    const colW = (width - GAP * (n - 1)) / n;
    el.style.setProperty("--cols", n);
    el.innerHTML = Array.from({ length: n }, () => `<div class="col"></div>`).join("");
    const cols = [...el.children];
    const heights = new Array(n).fill(0);
    const tmp = document.createElement("div");
    for (const p of pins) {
      const i = heights.indexOf(Math.min(...heights));
      tmp.innerHTML = card(p, colW);
      const node = tmp.firstElementChild;
      cols[i].appendChild(node);
      heights[i] += node.offsetHeight + GAP;
    }
    el.querySelectorAll("[data-save]").forEach(paintSave);
    layouts.set(el, { n, pins });
  }
  // Re-flow only when the column count changes, not on every resize tick
  const ro = new ResizeObserver((entries) => {
    for (const { target } of entries) {
      const prev = layouts.get(target);
      if (!prev) continue;
      const n = Math.max(2, Math.floor((target.clientWidth + GAP) / (BASE_COL + GAP)));
      if (n !== prev.n) masonry(target, prev.pins);
    }
  });
  function mountFeed(el, pins) { masonry(el, pins); ro.observe(el); }

  /* ---------- search: every term must match; title and stack matches rank higher ---------- */
  function search(q, cat) {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    const pool = cat && cat !== "all" ? PINS.filter((p) => p.cats.includes(cat)) : PINS;
    if (!terms.length) return pool;
    const scored = [];
    for (const p of pool) {
      const fields = [
        [p.title, 6], [p.stack.join(" "), 5], [p.sub, 3], [p.cats.join(" "), 3],
        [[p.summary, p.problem, p.impact, p.role, ...p.approach, ...p.decisions].join(" "), 1],
      ].map(([t, w]) => [String(t).toLowerCase(), w]);
      let score = 0, all = true;
      for (const t of terms) {
        const s = fields.reduce((acc, [text, w]) => acc + (text.includes(t) ? w : 0), 0);
        if (!s) { all = false; break; }
        score += s;
      }
      if (all) scored.push([score, p]);
    }
    return scored.sort((a, b) => b[0] - a[0]).map(([, p]) => p);
  }

  /* ---------- related pins: Jaccard similarity on categories + stack ---------- */
  function related(p, k = 12) {
    const feats = (x) => new Set([...x.cats.map((c) => "c:" + c), ...x.stack.map((s) => "s:" + s.toLowerCase()), "b:" + x.board]);
    const a = feats(p);
    return PINS.filter((x) => x.id !== p.id)
      .map((x) => {
        const b = feats(x);
        const inter = [...a].filter((f) => b.has(f)).length;
        return [inter / (a.size + b.size - inter), x];
      })
      .sort((m, n) => n[0] - m[0]).slice(0, k).map(([, x]) => x);
  }

  /* ---------- router ---------- */
  function parse() {
    const raw = location.hash.slice(1) || "/";
    const [path, qs] = raw.split("?");
    return { parts: path.split("/").filter(Boolean), params: new URLSearchParams(qs || "") };
  }
  const scrollMemory = new Map();
  let lastKey = location.hash;
  let internalNav = false;

  function route() {
    scrollMemory.set(lastKey, window.scrollY);
    lastKey = location.hash;
    const { parts, params } = parse();
    document.querySelectorAll("[data-nav]").forEach((a) =>
      a.classList.toggle("active", a.dataset.nav === (parts[0] || "home")));

    if (parts[0] === "pin" && byId[parts[1]]) viewPin(byId[parts[1]]);
    else if (parts[0] === "profile") viewProfile(parts[1] === "saved" ? "saved" : "created");
    else if (parts[0] === "board" && BOARDS.some((b) => b.id === parts[1])) viewBoard(parts[1]);
    else viewFeed(params.get("q") || "", params.get("c") || "all");

    const y = parts[0] === "pin" ? 0 : (scrollMemory.get(location.hash) || 0);
    window.scrollTo(0, y);
  }
  function go(hash, replace) {
    internalNav = true;
    if (replace) { history.replaceState(null, "", hash); route(); } else location.hash = hash;
  }
  function feedHash(q, c) {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (c && c !== "all") p.set("c", c);
    const s = p.toString();
    return "#/" + (s ? "?" + s : "");
  }

  /* ---------- views ---------- */
  function viewFeed(q, cat) {
    document.title = q ? `${q} · Sanjana` : "Sanjana · Product Engineer";
    if (searchInput.value !== q && document.activeElement !== searchInput) searchInput.value = q;
    const results = search(q, cat);
    app.innerHTML = `
      ${q ? "" : `<section class="intro">
        <div class="intro-text">
          <h1>Hi, I'm Sanjana. I build products people use, and the systems that keep them fast.</h1>
          <p>Product engineer finishing an MS in CS at Boston University. ${esc(PROFILE.status)}.</p>
        </div>
        <div class="intro-actions">
          <a class="btn btn-red" href="#/pin/campus-emergency">Start with my best work</a>
          <a class="btn" href="#/profile">About me</a>
        </div></section>`}
      <nav class="chips" aria-label="Filter by category">
        ${CATS.map(([id, label]) => `<a class="chip ${id === cat ? "on" : ""}" href="${feedHash(q, id)}" aria-current="${id === cat}">${label}</a>`).join("")}
      </nav>
      ${q ? `<p class="result-count">${results.length} ${results.length === 1 ? "pin" : "pins"} for “${esc(q)}”</p>` : ""}
      ${results.length ? `<div class="feed" id="feed"></div>` : `
        <div class="empty"><h2>No pins match “${esc(q)}”</h2>
        <p>Try a language or tool, like Python, React or Supabase.</p>
        <a class="btn" href="#/">Clear search</a></div>`}`;
    if (results.length) mountFeed($("#feed"), results);
  }

  function section(title, body) { return body ? `<section class="d-sec"><h2>${title}</h2>${body}</section>` : ""; }
  const list = (items) => items && items.length ? `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>` : "";

  function viewPin(p) {
    document.title = `${p.title} · Sanjana`;
    const meta = [p.role, p.when].filter(Boolean).join(", ");
    app.innerHTML = `
      <div class="detail-wrap">
        <button class="back" id="back" aria-label="Go back"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <article class="detail">
          <div class="detail-art">${art(p)}</div>
          <div class="detail-body">
            <div class="d-bar">
              <button class="icon-btn" id="copy" aria-label="Copy link to this pin" title="Copy link">
                <svg viewBox="0 0 24 24" width="20" height="20"><path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
              </button>
              ${p.links.map(([label, url]) => `<a class="btn btn-sm" href="${esc(url)}" target="_blank" rel="noopener">${esc(label)}</a>`).join("")}
              <button class="save save-lg" data-save="${p.id}" aria-pressed="false">Save</button>
            </div>
            <h1>${esc(p.title)}</h1>
            <p class="d-summary">${esc(p.summary)}</p>
            <a class="d-author" href="#/profile"><span class="avatar">${avatarInner()}</span><span><b>Sanjana</b>${meta ? `<small>${esc(meta)}</small>` : ""}</span></a>
            ${section("The problem", p.problem ? `<p>${esc(p.problem)}</p>` : "")}
            ${section("What I built", list(p.approach))}
            ${section("Decisions and tradeoffs", list(p.decisions))}
            ${p.impact ? `<section class="d-impact"><h2>Outcome</h2><p>${esc(p.impact)}</p></section>` : ""}
            ${p.stack.length ? `<div class="d-stack">${p.stack.map((s) => `<a class="chip chip-sm" href="${feedHash(s, "all")}" title="See other work using ${esc(s)}">${esc(s)}</a>`).join("")}</div>` : ""}
          </div>
        </article>
        <h2 class="more">More like this</h2>
        <div class="feed" id="feed"></div>
      </div>`;
    paintSave($(".save-lg"));
    mountFeed($("#feed"), related(p));
    $("#back").onclick = goBack;
    $("#copy").onclick = async () => {
      try { await navigator.clipboard.writeText(location.href); toast("Link copied"); }
      catch { toast("Copy failed. The link is in your address bar."); }
    };
  }

  function avatarInner(big) {
    return PROFILE.photo ? `<img src="${esc(PROFILE.photo)}" alt="">` : `<span${big ? ' class="lg"' : ""}>S</span>`;
  }

  function boardCard(b) {
    const pins = PINS.filter((p) => p.board === b.id);
    const [a, c, d] = pins;
    const tile = (p) => p ? art(p) : `<div class="art" style="background:#efefef"></div>`;
    return `<a class="board" href="#/board/${b.id}">
      <div class="collage"><div class="cl-a">${tile(a)}</div><div class="cl-b">${tile(c)}</div><div class="cl-c">${tile(d)}</div></div>
      <h3>${esc(b.name)}</h3><p>${pins.length} pins</p></a>`;
  }

  function viewProfile(tab) {
    document.title = "About · Sanjana";
    const savedPins = PINS.filter((p) => saved.has(p.id));
    app.innerHTML = `
      <section class="profile">
        <div class="avatar avatar-xl">${avatarInner(true)}</div>
        <h1>${esc(PROFILE.name)}</h1>
        <p class="handle">${esc(PROFILE.headline)}</p>
        <p class="p-sub">${esc(PROFILE.subline)}</p>
        <p class="p-status"><i></i>${esc(PROFILE.status)}</p>
        <p class="p-bio">${esc(PROFILE.bio)}</p>
        <div class="p-actions">
          <a class="btn btn-red" href="mailto:${esc(PROFILE.email)}">Email me</a>
          <a class="btn" href="${esc(PROFILE.resume)}" target="_blank" rel="noopener">Résumé</a>
          <a class="btn" href="${esc(PROFILE.github)}" target="_blank" rel="noopener">GitHub</a>
          <a class="btn" href="${esc(PROFILE.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>
        </div>
        <div class="tabs" role="tablist">
          <a role="tab" href="#/profile" class="${tab === "created" ? "on" : ""}" aria-selected="${tab === "created"}">Created</a>
          <a role="tab" href="#/profile/saved" class="${tab === "saved" ? "on" : ""}" aria-selected="${tab === "saved"}">Saved${savedPins.length ? ` (${savedPins.length})` : ""}</a>
        </div>
      </section>
      ${tab === "created" ? `
        <div class="boards">${BOARDS.map(boardCard).join("")}</div>
        <section class="exp">
          <h2>Experience</h2>
          <ol>${EXPERIENCE.map((e) => `<li><span class="when">${esc(e.when)}</span><div><b>${esc(e.what)}</b>${e.detail ? `<p>${esc(e.detail)}</p>` : ""}</div></li>`).join("")}</ol>
        </section>`
      : savedPins.length ? `<div class="feed" id="feed"></div>` : `
        <div class="empty"><h2>Nothing saved yet</h2>
        <p>Hit Save on any pin and it'll show up here. Saves stay in this browser.</p>
        <a class="btn btn-red" href="#/">Browse pins</a></div>`}`;
    if (tab === "saved" && savedPins.length) mountFeed($("#feed"), savedPins);
  }

  function viewBoard(id) {
    const b = BOARDS.find((x) => x.id === id);
    const pins = PINS.filter((p) => p.board === id);
    document.title = `${b.name} · Sanjana`;
    app.innerHTML = `
      <section class="board-head">
        <button class="back" id="back" aria-label="Go back"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <h1>${esc(b.name)}</h1><p>${esc(b.desc)}</p><p class="count">${pins.length} pins</p>
      </section>
      <div class="feed" id="feed"></div>`;
    $("#back").onclick = goBack;
    mountFeed($("#feed"), pins);
  }

  function goBack() { if (internalNav && history.length > 1) history.back(); else go("#/"); }

  /* ---------- global events ---------- */
  app.addEventListener("click", (e) => {
    const s = e.target.closest("[data-save]");
    if (s) { e.preventDefault(); toggleSave(s.dataset.save); }
  });

  let typing;
  searchInput.addEventListener("input", () => {
    clearTimeout(typing);
    typing = setTimeout(() => {
      const { parts, params } = parse();
      const cat = parts.length ? "all" : (params.get("c") || "all");
      go(feedHash(searchInput.value.trim(), cat), !parts.length);
    }, 140);
  });
  $("#search-form").addEventListener("submit", (e) => { e.preventDefault(); searchInput.blur(); });

  document.addEventListener("keydown", (e) => {
    const inField = /INPUT|TEXTAREA/.test(document.activeElement.tagName);
    if (e.key === "/" && !inField) { e.preventDefault(); searchInput.focus(); searchInput.select(); }
    else if (e.key === "Escape") {
      if (inField) { searchInput.blur(); return; }
      const { parts } = parse();
      if (parts[0] === "pin" || parts[0] === "board") goBack();
    }
  });

  window.addEventListener("hashchange", route);
  route();
})();

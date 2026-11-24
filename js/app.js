/* Single-page portfolio. Plain JS, no dependencies. */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const BASE_COL = 236, GAP = 16;
  const GH = `<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>`;

  /* ---------- drawn card art ---------- */
  function sparkPath(v, w = 200, h = 50) {
    const max = Math.max(...v), min = Math.min(...v);
    return v.map((x, i) => `${i ? "L" : "M"}${((i / (v.length - 1)) * w).toFixed(1)} ${(h - ((x - min) / (max - min || 1)) * h).toFixed(1)}`).join(" ");
  }
  const COVERS = {
    app: (c) => `<div class="c-center"><div class="c-phone"><div class="c-screen">
      <div class="c-alert" style="background:${c.accent}">${esc(c.head)}</div>
      ${c.rows.map((r) => `<div class="c-row"><span>${esc(r)}</span><i></i></div>`).join("")}
      <div class="c-map"><b style="background:${c.accent}"></b></div></div></div></div>`,
    metric: (c) => `<div class="c-metric"><div class="c-label">${esc(c.label)}</div>
      <svg viewBox="-4 -4 208 58" preserveAspectRatio="none" aria-hidden="true"><path d="${sparkPath(c.spark)}"/></svg>
      <div class="c-value">${esc(c.value)}</div></div>`,
    editor: () => `<div class="c-center"><div class="c-doc">
      <span class="c-cur" style="top:22%;left:46%;--k:#e60023">you</span>
      <span class="c-cur" style="top:62%;left:18%;--k:#0a7cff">teammate</span>
      <i style="width:55%;height:12px;background:#111"></i><i></i><i class="hl" style="width:82%"></i><i style="width:70%"></i><i></i><i class="hl2" style="width:48%"></i><i style="width:86%"></i></div></div>`,
    terminal: (c) => `<div class="c-term"><div class="c-dots"><i></i><i></i><i></i></div><pre>${esc(c.lines.join("\n"))}</pre></div>`,
    player: () => `<div class="c-player"><div class="c-album"></div>
      <div class="c-track"><b>Feeling: calm</b><span>12 songs picked for you</span></div>
      <div class="c-wave">${Array.from({ length: 28 }, (_, i) => `<i style="height:${18 + Math.round(78 * Math.abs(Math.sin(i * 1.3)))}%"></i>`).join("")}</div>
      <div class="c-controls"><i></i><b></b><i></i></div></div>`,
    weather: () => `<div class="c-weather"><span>Boston</span><b>72°</b><span>Light rain later</span>
      <div class="c-days">${["Mon", "Tue", "Wed", "Thu"].map((d, i) => `<div><small>${d}</small><em>${[70, 64, 61, 66][i]}°</em></div>`).join("")}</div></div>`,
    game: () => `<div class="c-game">${Array.from({ length: 24 }, (_, i) => {
        const t = { 1: "H", 4: "H", 19: "M", 22: "M", 13: "·" }[i] || "";
        return `<i class="${i % 3 === 2 ? "wall" : ""} ${t === "H" ? "hero" : t === "M" ? "mon" : ""}">${t === "·" ? "" : t}</i>`;
      }).join("")}</div>`,
    chart: (c) => `<div class="c-chart">${c.bars.map((b) => `<i style="height:${b * 10}%"></i>`).join("")}</div>`,
  };
  function art(p, h) {
    const style = h ? `height:${h}px;` : "";
    if (p.img) return `<div class="art" style="${style}"><img src="${esc(p.img)}" alt="" loading="lazy"></div>`;
    const dark = p.cover.type === "terminal" ? " art-dark" : "";
    return `<div class="art${dark}" style="${style}background:${p.cover.bg}">${COVERS[p.cover.type](p.cover)}</div>`;
  }

  /* ---------- masonry: each card goes into the currently shortest column ---------- */
  const layouts = new Map();
  const colCount = (w) => Math.max(2, Math.floor((w + GAP) / (BASE_COL + GAP)));
  function masonry(el, items, render) {
    const n = colCount(el.clientWidth);
    const colW = (el.clientWidth - GAP * (n - 1)) / n;
    el.style.setProperty("--cols", n);
    el.innerHTML = Array.from({ length: n }, () => `<div class="col"></div>`).join("");
    const cols = [...el.children], heights = new Array(n).fill(0), tmp = document.createElement("div");
    for (const it of items) {
      const i = heights.indexOf(Math.min(...heights));
      tmp.innerHTML = render(it, colW);
      const node = tmp.firstElementChild;
      cols[i].appendChild(node);
      heights[i] += node.offsetHeight + GAP;
    }
    layouts.set(el, { n, items, render });
  }
  const ro = new ResizeObserver((entries) => {
    for (const { target } of entries) {
      const l = layouts.get(target);
      if (l && colCount(target.clientWidth) !== l.n) masonry(target, l.items, l.render);
    }
  });
  const mount = (el, items, render) => { masonry(el, items, render); ro.observe(el); };

  /* ---------- profile ---------- */
  const P = PROFILE;
  $("#profile").innerHTML = `
    <figure class="hero-photo">
      <div class="photo-wrap">
        <img id="me" src="${esc(P.photo)}" alt="Sanjana">
        <button id="avatar-toggle" class="avatar-toggle" role="switch" aria-checked="false" aria-label="Switch photo style"><i></i></button>
      </div>
      <figcaption><span class="status"><i></i>${esc(P.status)}</span></figcaption>
    </figure>
    <div class="hero-text">
      <h1 class="name">${esc(P.name)}</h1>
      <p class="heading">${esc(P.heading)}</p>
      <p class="about">${esc(P.about)}</p>
      <div class="roles-want">
        <p>Roles I'm looking for</p>
        <ul>${P.roles.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>
      </div>
      <div class="actions">
        <a class="btn btn-red" href="mailto:${esc(P.email)}">Email me</a>
        <a class="btn" href="${esc(P.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>
        <a class="btn" href="${esc(P.resume)}" target="_blank" rel="noopener">Resume</a>
        <a class="btn" href="${esc(P.github)}" target="_blank" rel="noopener">GitHub</a>
      </div>
      <p class="contact-line">${esc(P.email)} · ${esc(P.location)}</p>
    </div>`;

  /* photo / pixel avatar toggle, remembered in this browser */
  const me = $("#me"), tog = $("#avatar-toggle");
  function setAvatar(on) {
    me.src = on ? P.avatar : P.photo;
    me.alt = on ? "Sanjana's pixel avatar" : "Sanjana";
    me.classList.toggle("pixel", on);
    tog.setAttribute("aria-checked", on);
    try { localStorage.setItem("sanjana.avatar", on ? "1" : "0"); } catch { /* storage off */ }
  }
  tog.addEventListener("click", () => {
    me.classList.add("flip");
    setTimeout(() => { setAvatar(tog.getAttribute("aria-checked") !== "true"); me.classList.remove("flip"); }, 160);
  });
  try { if (localStorage.getItem("sanjana.avatar") === "1") setAvatar(true); } catch { /* storage off */ }

  /* logo with a lettered fallback if the image file isn't there yet */
  const logo = (r, cls) => `<span class="${cls}" style="background:${r.mark}" aria-hidden="true">${r.logo ? `<img src="${esc(r.logo)}" alt="" onerror="this.remove()">` : ""}<b>${esc(r.org[0])}</b></span>`;

  /* ---------- experience: two native dropdowns ---------- */
  $("#experience-list").innerHTML = EXPERIENCE.map((g) => `
    <details class="group" ${g.open ? "open" : ""}>
      <summary>
        <span class="g-marks" aria-hidden="true">${g.roles.slice(0, 4).map((r) => logo(r, "g-mark")).join("")}</span>
        <span class="g-text"><b>${esc(g.title)}</b><small>${esc(g.blurb)} · ${g.roles.length} roles</small></span>
        <span class="g-chev" aria-hidden="true"></span>
      </summary>
      <ol class="roles">${g.roles.map((r) => `
        <li class="role">
          ${logo(r, "r-mark")}
          <div class="r-body">
            <div class="r-top"><div><h3>${esc(r.role)}</h3><p class="r-org">${esc(r.org)}</p></div>
              <p class="r-when">${esc(r.when)}<br><span>${esc(r.where)}</span></p></div>
            <ul>${r.points.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
            ${r.stack.length ? `<div class="tags">${r.stack.map((s) => `<span>${esc(s)}</span>`).join("")}</div>` : ""}
          </div>
        </li>`).join("")}</ol>
    </details>`).join("");

  /* ---------- projects board ---------- */
  const projById = Object.fromEntries(PROJECTS.map((p) => [p.id, p]));
  const projCard = (p, colW) => `<div class="pin">
      <button class="pin-hit" data-open="${p.id}" aria-label="Open ${esc(p.title)}">${art(p, Math.round(p.h * colW / BASE_COL))}<span class="pin-more">Open</span></button>
      <p class="pin-title">${esc(p.title)}</p>
      <p class="pin-sub">${esc(p.sub)}</p>
      ${(p.links.find(([, u]) => u.includes("github.com")) || [])[1] ? `<a class="pin-code" href="${esc(p.links.find(([, u]) => u.includes("github.com"))[1])}" target="_blank" rel="noopener">${GH} Code</a>` : ""}</div>`;
  let filter = "all";
  const board = $("#board");
  const renderBoard = () => mount(board, filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.cats.includes(filter)), projCard);
  document.querySelectorAll("#filters button").forEach((b) => b.addEventListener("click", () => {
    filter = b.dataset.f;
    document.querySelectorAll("#filters button").forEach((x) => x.setAttribute("aria-pressed", x === b));
    renderBoard();
  }));

  const dlg = $("#project");
  function openProject(id, push = true) {
    const p = projById[id];
    if (!p) return;
    $("#project-body").innerHTML = `
      <div class="d-art">${art(p)}</div>
      <div class="d-text">
        <p class="d-when">${esc(p.when)}</p>
        <h2 id="project-title">${esc(p.title)}</h2>
        ${p.problem ? `<h3>The problem</h3><p>${esc(p.problem)}</p>` : ""}
        ${p.built.length ? `<h3>What I built</h3><ul>${p.built.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
        ${p.impact ? `<div class="d-impact"><h3>Outcome</h3><p>${esc(p.impact)}</p></div>` : ""}
        <div class="tags">${p.stack.map((s) => `<span>${esc(s)}</span>`).join("")}</div>
        ${p.links.filter(([, u]) => u !== "#").length ? `<div class="d-links">${p.links.filter(([, u]) => u !== "#").map(([t, u]) => `<a class="btn btn-sm" href="${esc(u)}" target="_blank" rel="noopener">${esc(t)}</a>`).join("")}</div>` : ""}
      </div>`;
    if (!dlg.open) dlg.showModal();
    if (push) history.pushState({ p: id }, "", `#project/${id}`);
  }
  function closeProject() { if (dlg.open) dlg.close(); }
  board.addEventListener("click", (e) => { const b = e.target.closest("[data-open]"); if (b) openProject(b.dataset.open); });
  $("#project-close").addEventListener("click", () => history.back());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) history.back(); });
  dlg.addEventListener("cancel", (e) => { e.preventDefault(); history.back(); });
  window.addEventListener("popstate", () => {
    const m = location.hash.match(/^#project\/(.+)$/);
    m ? openProject(m[1], false) : closeProject();
  });

  /* ---------- education, publications, life ---------- */
  $("#education-list").innerHTML = EDUCATION.map((e) => `
    <article class="edu">${logo({ org: e.school, logo: e.logo, mark: "#ffd6e0" }, "edu-mark")}
      <div><h3>${esc(e.school)}</h3><p>${esc(e.degree)}</p>${e.note ? `<p class="edu-note">${esc(e.note)}</p>` : ""}
      <p class="muted">${esc(e.when)} · ${esc(e.where)}</p></div></article>`).join("");
  $("#scholarship-list").innerHTML = SCHOLARSHIPS.map((x) => `
    <article class="award" style="background:${x.bg}">
      <p class="award-amt">${esc(x.amount)}</p>
      <div><h4>${esc(x.title)}</h4><p class="award-school">${esc(x.school)}</p><p>${esc(x.detail)}</p></div>
    </article>`).join("");

  const boldMe = (a) => esc(a).replace(/\bSanjana( Sanjeev)?\b/, (m) => `<b>${m}</b>`);
  $("#publications-list").innerHTML = PUBLICATIONS.map((p) => `
    <article class="pub">
      <div class="pub-top"><span class="venue">${esc(p.venue)}</span></div>
      <h3><a href="${esc(p.link)}" target="_blank" rel="noopener">${esc(p.title)}</a></h3>
      <p class="pub-authors">${boldMe(p.authors)}</p>
      <p>${esc(p.summary)}</p>
      <a class="btn btn-sm" href="${esc(p.link)}" target="_blank" rel="noopener">Read on arXiv</a>
    </article>`).join("");

  const LIFE_ART = {
    volleyball: () => `<svg class="la" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="200" height="200" fill="#8ec5ff"/><circle cx="150" cy="38" r="20" fill="#fff1b8"/>
      <rect y="150" width="200" height="50" fill="#f4d58d"/>
      <g stroke="#fff" stroke-width="1.5" opacity=".9">${Array.from({ length: 9 }, (_, i) => `<line x1="${10 + i * 22}" y1="92" x2="${10 + i * 22}" y2="132"/>`).join("")}<line x1="0" y1="92" x2="200" y2="92"/><line x1="0" y1="132" x2="200" y2="132"/></g>
      <line x1="6" y1="88" x2="6" y2="160" stroke="#333" stroke-width="3"/><line x1="194" y1="88" x2="194" y2="160" stroke="#333" stroke-width="3"/>
      <g transform="translate(92 58)"><circle r="20" fill="#fff" stroke="#222" stroke-width="2"/><path d="M-20 0 Q0 -8 20 0M-8 -18 Q4 0 -8 18M8 -18 Q-4 0 8 18" fill="none" stroke="#e60023" stroke-width="2.5"/></g></svg>`,
    music: () => `<svg class="la" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="200" height="200" fill="#cdb8ff"/><circle cx="100" cy="96" r="64" fill="#1a1a1a"/>
      ${[56, 48, 40, 32].map((r) => `<circle cx="100" cy="96" r="${r}" fill="none" stroke="#333" stroke-width="1.5"/>`).join("")}
      <circle cx="100" cy="96" r="20" fill="#e60023"/><circle cx="100" cy="96" r="3" fill="#fff"/>
      <path d="M150 30 L150 70" stroke="#ddd" stroke-width="4" stroke-linecap="round"/><path d="M150 70 L128 82" stroke="#ddd" stroke-width="4" stroke-linecap="round"/></svg>`,
    trek: () => `<svg class="la" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd6a5"/><stop offset="1" stop-color="#ffe9d6"/></linearGradient></defs>
      <rect width="200" height="200" fill="url(#sky)"/><circle cx="140" cy="62" r="18" fill="#ff9f5a"/>
      <path d="M-10 150 L55 60 L90 105 L125 50 L210 150 Z" fill="#6c8f7d"/><path d="M55 60 L68 78 L60 76 L48 70 Z M125 50 L140 70 L128 66 L116 64 Z" fill="#fff"/>
      <path d="M-10 170 L40 120 L80 150 L130 110 L210 170 L210 200 L-10 200 Z" fill="#3f6a57"/>
      <path d="M95 200 Q110 170 100 150 Q92 135 108 120" fill="none" stroke="#f4d58d" stroke-width="3" stroke-dasharray="5 5"/></svg>`,
    design: () => `<svg class="la" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="200" height="200" fill="#ffd6e0"/>
      <rect x="24" y="30" width="96" height="120" rx="10" fill="#fff"/><rect x="34" y="42" width="76" height="52" rx="6" fill="#e60023"/>
      <rect x="34" y="102" width="56" height="8" rx="4" fill="#222"/><rect x="34" y="116" width="70" height="6" rx="3" fill="#ccc"/><rect x="34" y="128" width="44" height="6" rx="3" fill="#ccc"/>
      ${["#e60023", "#fff1b8", "#8ec5ff", "#9fe0c1"].map((c, i) => `<circle cx="150" cy="${48 + i * 30}" r="12" fill="${c}" stroke="#fff" stroke-width="3"/>`).join("")}
      <path d="M128 170 L176 122 L184 130 L136 178 L124 182 Z" fill="#222"/></svg>`,
  };
  mount($("#life-board"), LIFE, (l, colW) => {
    const h = Math.round(l.h * colW / BASE_COL);
    const inner = `<div class="art life-art" style="height:${h}px;background:${l.bg};color:${l.ink || "#111"}">
        ${LIFE_ART[l.cover] ? LIFE_ART[l.cover]() : ""}
        <span class="life-cap">${esc(l.text)}</span>
        ${l.img ? `<img src="${esc(l.img)}" alt="${esc(l.title)}" loading="lazy" onerror="this.remove()">` : ""}
      </div>`;
    const tag = l.link ? `<a class="pin-hit" href="${esc(l.link)}" target="_blank" rel="noopener">${inner}<span class="pin-more">Visit</span></a>` : inner;
    return `<div class="pin">${tag}<p class="pin-title">${esc(l.title)}</p></div>`;
  });

  /* ---------- sticky tabs follow the scroll ---------- */
  const tabs = [...document.querySelectorAll(".tabs a")];
  const spy = new IntersectionObserver((entries) => {
    for (const en of entries) if (en.isIntersecting) {
      tabs.forEach((t) => t.classList.toggle("on", t.getAttribute("href") === "#" + en.target.id));
    }
  }, { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("main > section[id]").forEach((s) => spy.observe(s));

  renderBoard();
  const m = location.hash.match(/^#project\/(.+)$/);
  if (m) { history.replaceState(null, "", "#projects"); openProject(m[1]); }
})();

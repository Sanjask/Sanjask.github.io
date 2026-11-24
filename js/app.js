/* Single-page portfolio. Plain JS, no dependencies. */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const BASE_COL = 236, GAP = 16;

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
    <div class="avatar-ring"><img class="avatar-img" src="${esc(P.photo)}" alt="Sanjana"></div>
    <h1 class="name">${esc(P.name)}</h1>
    <p class="heading">${esc(P.heading)}</p>
    <p class="about">${esc(P.about)}</p>
    <p class="meta"><span class="status"><i></i>${esc(P.status)}</span><span class="loc">${esc(P.location)}</span></p>
    <div class="actions">
      <a class="btn btn-red" href="mailto:${esc(P.email)}">Email me</a>
      <a class="btn" href="${esc(P.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>
      <a class="btn" href="${esc(P.resume)}" target="_blank" rel="noopener">Résumé</a>
      <a class="btn" href="${esc(P.github)}" target="_blank" rel="noopener">GitHub</a>
    </div>
    <ul class="skills" aria-label="Skills">${P.skills.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>`;

  /* ---------- experience: two native dropdowns ---------- */
  $("#experience-list").innerHTML = EXPERIENCE.map((g) => `
    <details class="group" ${g.open ? "open" : ""}>
      <summary>
        <span class="g-marks" aria-hidden="true">${g.roles.slice(0, 4).map((r) => `<i style="background:${r.mark}">${esc(r.org[0])}</i>`).join("")}</span>
        <span class="g-text"><b>${esc(g.title)}</b><small>${esc(g.blurb)} · ${g.roles.length} roles</small></span>
        <span class="g-chev" aria-hidden="true"></span>
      </summary>
      <ol class="roles">${g.roles.map((r) => `
        <li class="role">
          <span class="r-mark" style="background:${r.mark}" aria-hidden="true">${esc(r.org[0])}</span>
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
      <p class="pin-title">${esc(p.title)}</p><p class="pin-sub">${esc(p.sub)}</p></div>`;
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
        ${p.links.length ? `<div class="d-links">${p.links.map(([t, u]) => `<a class="btn btn-sm" href="${esc(u)}" target="_blank" rel="noopener">${esc(t)}</a>`).join("")}</div>` : ""}
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
    <article class="edu"><span class="edu-mark" aria-hidden="true">${esc(e.school[0])}</span>
      <div><h3>${esc(e.school)}</h3><p>${esc(e.degree)}</p>${e.note ? `<p class="edu-note">${esc(e.note)}</p>` : ""}
      <p class="muted">${esc(e.when)} · ${esc(e.where)}</p></div></article>`).join("");

  const boldMe = (a) => esc(a).replace(/\bSanjana( Sanjeev)?\b/, (m) => `<b>${m}</b>`);
  $("#publications-list").innerHTML = PUBLICATIONS.map((p) => `
    <article class="pub">
      <div class="pub-top"><span class="venue">${esc(p.venue)}</span></div>
      <h3><a href="${esc(p.link)}" target="_blank" rel="noopener">${esc(p.title)}</a></h3>
      <p class="pub-authors">${boldMe(p.authors)}</p>
      <p>${esc(p.summary)}</p>
      <a class="btn btn-sm" href="${esc(p.link)}" target="_blank" rel="noopener">Read on arXiv</a>
    </article>`).join("");

  mount($("#life-board"), LIFE, (l, colW) => `<div class="pin">
      <div class="art c-note" style="height:${Math.round(l.h * colW / BASE_COL)}px;background:${l.bg};color:${l.ink || "#111"}">${esc(l.text)}</div>
      <p class="pin-title">${esc(l.title)}</p></div>`);

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

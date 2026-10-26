/* Manideep & Surabhi wedding — plain JavaScript, works from file:// */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var body = document.body;

  /* Wedding muhurat: Saturday 21 Nov 2026, 8:15 PM IST (UTC+5:30) = 14:45 UTC */
  var MUHURAT = Date.UTC(2026, 10, 21, 14, 45, 0);

  /* ---------- Scroll lock (works on iPhone Safari too) ---------- */
  var lockedY = 0;
  function lockScroll() {
    lockedY = window.pageYOffset || 0;
    body.classList.add("cover-lock");
  }
  function unlockScroll() {
    body.classList.remove("cover-lock");
    document.documentElement.classList.remove("cover-lock");
    window.scrollTo(0, lockedY);
  }

  /* ---------- Music ---------- */
  var audio = $("music");
  var musicBtn = $("music-btn");
  function setMusicUI(on) {
    musicBtn.setAttribute("aria-pressed", on ? "true" : "false");
    musicBtn.setAttribute("aria-label", on ? "Turn music off" : "Turn music on");
    $("music-on").hidden = !on;
    $("music-off").hidden = on;
    $("music-label").textContent = on ? "Music on" : "Music off";
  }
  function play() { var p = audio.play(); if (p && p.catch) p.catch(function () {}); }
  audio.addEventListener("play", function () { setMusicUI(true); });
  audio.addEventListener("pause", function () { setMusicUI(false); });
  musicBtn.addEventListener("click", function () { if (audio.paused) play(); else audio.pause(); });

  /* ---------- Cover / opening doors ---------- */
  var cover = $("cover");
  var opened = false;
  $("open-btn").addEventListener("click", function () {
    if (opened) return;
    opened = true;
    cover.classList.add("is-open", "pointer-events-none");
    $("cover-content").classList.replace("opacity-100", "opacity-0");
    play();
    $("particles").hidden = false;
    setTimeout(function () {
      cover.parentNode && cover.parentNode.removeChild(cover);
      unlockScroll();
      revealVisibleNow();
    }, 1300);
  });

  /* ---------- Mobile menu ---------- */
  var menu = $("menu");
  $("menu-open").addEventListener("click", function () { menu.hidden = false; });
  $("menu-close").addEventListener("click", function () { menu.hidden = true; });
  Array.prototype.forEach.call(document.querySelectorAll("[data-menu-link]"), function (a) {
    a.addEventListener("click", function () { menu.hidden = true; });
  });

  /* ---------- Reveal on scroll ---------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  function show(el) { el.classList.add("is-visible"); }
  var io = null;
  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(show);
  }
  function revealVisibleNow() {
    var h = window.innerHeight || document.documentElement.clientHeight;
    reveals.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < h && r.bottom > 0) show(el);
    });
  }
  /* Jumping via nav: make sure the target section is never left invisible */
  window.addEventListener("hashchange", function () { setTimeout(revealVisibleNow, 700); });

  /* ---------- Save-the-date seal ---------- */
  var seal = $("seal");
  function openSeal() {
    if (seal.classList.contains("is-open")) return;
    seal.classList.add("is-open");
    seal.setAttribute("aria-expanded", "true");
    seal.setAttribute("aria-label", "Wedding date revealed");
    $("seal-date").hidden = false;
    $("seal-date").classList.add("animate-medallion");
    $("seal-status").textContent = "21 November 2026 · Saturday";
  }
  seal.addEventListener("click", openSeal);

  /* ---------- Gallery lightbox ---------- */
  var TILES = ["The Engagement", "Moments Together", "Family", "Mehendi Memories", "Haldi", "Forever Begins"];
  var lb = $("lightbox"), idx = null;
  function openLb(i) {
    idx = (i + TILES.length) % TILES.length;
    $("lb-title").textContent = TILES[idx];
    lb.setAttribute("aria-label", TILES[idx]);
    lb.hidden = false;
  }
  function closeLb() { lb.hidden = true; idx = null; }
  Array.prototype.forEach.call(document.querySelectorAll("[data-tile]"), function (b) {
    b.addEventListener("click", function () { openLb(parseInt(b.getAttribute("data-tile"), 10)); });
  });
  lb.addEventListener("click", closeLb);
  $("lb-card").addEventListener("click", function (e) { e.stopPropagation(); });
  $("lb-close").addEventListener("click", closeLb);
  $("lb-prev").addEventListener("click", function (e) { e.stopPropagation(); openLb(idx - 1); });
  $("lb-next").addEventListener("click", function (e) { e.stopPropagation(); openLb(idx + 1); });
  window.addEventListener("keydown", function (e) {
    if (idx === null) { if (e.key === "Escape") menu.hidden = true; return; }
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowRight") openLb(idx + 1);
    if (e.key === "ArrowLeft") openLb(idx - 1);
  });

  /* ---------- Countdown ---------- */
  function timeLeft(target, now) {
    var ms = Math.max(0, target - now), s = Math.floor(ms / 1000);
    return { done: ms === 0, days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60 };
  }
  window.weddingTimeLeft = timeLeft;
  var cells = {};
  ["days", "hours", "minutes", "seconds"].forEach(function (u) { cells[u] = document.querySelector('[data-unit="' + u + '"]'); });
  var pad = function (n) { return n < 10 ? "0" + n : String(n); };
  var timer;
  function tick() {
    var t = timeLeft(MUHURAT, Date.now());
    if (t.done) { $("cd-grid").hidden = true; $("cd-done").hidden = false; clearInterval(timer); return; }
    for (var u in cells) cells[u].textContent = pad(t[u]);
  }
  tick();
  timer = setInterval(tick, 1000);

  /* ---------- Back to top ---------- */
  $("to-top").addEventListener("click", function () { window.scrollTo(0, 0); });

  lockScroll();
})();

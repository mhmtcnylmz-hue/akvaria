// Günlük otomatik kontrol: node tools/gunluk_kontrol.js
// Oyunu başsız tarayıcıda açar, her tanka balık koyup düğmelere tıklar; hataları, eksik dosyaları,
// kare süresini ve iki sekmede müziğin üst üste çalıp çalmadığını kontrol eder. Kısa bir rapor yazar.
// Çıkış kodu: 0 = sorun yok, 1 = sorun var.
const { chromium } = require("playwright");
const http = require("http"), fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, ".."), PORT = 8799;
const MIME = { ".html": "text/html", ".js": "application/javascript", ".webp": "image/webp", ".png": "image/png", ".mp3": "audio/mpeg", ".json": "application/json", ".webmanifest": "application/json" };
const srv = http.createServer((q, r) => {
  const p = path.join(ROOT, decodeURIComponent(q.url.split("?")[0]).replace(/^\/$/, "/index.html"));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { r.writeHead(404); r.end(); return; }
  r.writeHead(200, { "Content-Type": MIME[path.extname(p)] || "application/octet-stream" }); fs.createReadStream(p).pipe(r);
});
const SORUN = [], BILGI = [];
(async () => {
  await new Promise(r => srv.listen(PORT, r));
  const U = "http://localhost:" + PORT + "/index.html";
  const b = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
  const c = await b.newContext({ viewport: { width: 414, height: 896 } });
  await c.route(/game\.js/, r => { let s = fs.readFileSync(path.join(ROOT, "game.js"), "utf8"); s = s.replace(/\}\)\(\);\s*$/, "window.__G={get state(){return state},get ctx(){return audioCtx}};\n})();"); r.fulfill({ body: s, contentType: "application/javascript" }); });
  await c.route(/firebase|gstatic\.com|googleapis/, r => r.abort());
  const p = await c.newPage(), hata = new Map(), eksik = new Set();
  p.on("pageerror", e => hata.set(e.message, (hata.get(e.message) || 0) + 1));
  p.on("response", r => { if (r.status() >= 400 && r.url().includes("localhost")) eksik.add(r.url().replace(/^.*localhost:\d+\//, "")); });
  p.on("dialog", d => d.dismiss());
  await p.goto(U); await p.waitForTimeout(2500);
  // her tanka balık, kabuklu ve dekor koyan bir kayıt hazırla
  const SAVE = await p.evaluate(() => {
    const s = JSON.parse(JSON.stringify(window.__G.state)), f0 = s.fish[0]; let id = 100;
    const mk = (t, m) => Object.assign(JSON.parse(JSON.stringify(f0)), { id: id++, type: t, mutation: m || "normal", age: 3, x: Math.random(), y: .5, hunger: 60, health: 100 });
    s.level = 51; s.coins = 1e6; s.gems = 1e4; s.tut = 99;
    s.fish = ["koi", "neon", "guppy", "betta", "gold", "cichlid", "discus", "arowana"].map(t => mk(t)).concat([mk("neon", "gold"), mk("guppy", "glitch"), mk("koi", "albino")]);
    s.stash = { salt: { fish: ["clown", "napo", "ytang", "btang", "angel", "lion", "trigger", "mandarin"].map(t => mk(t)).concat([mk("clown", "melanistic")]), dirt: 30 },
      deep: { fish: ["oar", "angler", "hatchet", "viper", "dragon", "lantern"].map(t => mk(t)).concat([mk("angler", "melanistic"), mk("viper", "transparent")]), dirt: 30 },
      cfresh: { fish: [mk("koi"), mk("clown")], dirt: 0 } };
    s.crit = { deep: [{ id: 900, k: "jdeep" }, { id: 901, k: "iso" }], salt: [{ id: 902, k: "jpink" }, { id: 904, k: "cleaner" }], fresh: [{ id: 906, k: "blue" }] };
    s.decor = [{ k: "🦀", x: .25 }, { k: "sf", x: .4 }, { k: "🐚", x: .7 }]; s.snails = 2; s.props = ["moai", "table"]; s.dirt = 40;
    return JSON.stringify(s);
  });
  await p.addInitScript(S => { if (!sessionStorage.getItem("x")) { sessionStorage.setItem("x", 1); localStorage.setItem("fishvilleClassicSave3", S); } }, SAVE);
  await p.reload(); await p.waitForTimeout(3000);
  const kare = {};
  for (const tk of ["fresh", "salt", "deep", "cfresh"]) {
    await p.evaluate(tk => { const s = window.__G.state; if (s.tank !== tk && s.stash[tk]) { const o = s.stash[tk]; s.stash[s.tank] = { fish: s.fish, dirt: s.dirt }; s.fish = o.fish; s.dirt = o.dirt; delete s.stash[tk]; s.tank = tk; } }, tk);
    await p.waitForTimeout(1500);
    kare[tk] = await p.evaluate(() => new Promise(res => { const d = []; let l = performance.now(), st = l; const f = n => { d.push(n - l); l = n; if (n - st < 3000) requestAnimationFrame(f); else { d.sort((a, b) => a - b); res(Math.round(d[d.length >> 1])); } }; requestAnimationFrame(f); }));
    for (let i = 0; i < 8; i++) { await p.mouse.click(30 + Math.random() * 350, 150 + Math.random() * 600); await p.waitForTimeout(50); }
    for (const id of ["feed", "clean", "nightBtn", "dshop", "fishes", "achBtn", "mapBtn", "questBtn", "cupBtn", "surprise", "set", "coinPill", "chatBtn"]) {
      try {
        await p.click("#" + id, { timeout: 500, force: true }); await p.waitForTimeout(200);
        const ids = await p.evaluate(tag => [...document.querySelectorAll("button,[data-tab],[data-st]")].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && !/fbDel|fbOut|bkLoad|admBtn|fsBtn|oriBtn|rhPort/.test(e.id); }).slice(0, 40).map((e, i) => { e.setAttribute("data-k9", tag + i); return tag + i; }), tk + id);
        for (const k of ids) { const n0 = hata.size; try { await p.click('[data-k9="' + k + '"]', { timeout: 300, force: true }); await p.waitForTimeout(60); } catch (e) {} if (hata.size > n0) BILGI.push("hata şu tıklamadan sonra: " + tk + " · " + id); }
        await p.keyboard.press("Escape"); await p.evaluate(() => document.querySelectorAll("#sclose").forEach(e => e.click())); await p.waitForTimeout(100);
      } catch (e) {}
    }
  }
  const oyunHata = await p.evaluate(() => localStorage.getItem("fvErr"));
  // müzik: iki sekmede aynı anda çalmamalı
  const A = await c.newPage(), B = await c.newPage();
  for (const q of [A, B]) { await q.goto(U); await q.waitForTimeout(1500); }
  await A.mouse.click(200, 500); await A.waitForTimeout(3000); await B.mouse.click(200, 500); await B.waitForTimeout(3000);
  const ses = await Promise.all([A, B].map(q => q.evaluate(() => (window.__G.ctx || {}).state)));
  await b.close(); srv.close();

  for (const [m, n] of hata) SORUN.push("JS hatası (" + n + "x): " + m.slice(0, 160));
  if (oyunHata) SORUN.push("Oyunun kendi hata kaydı: " + oyunHata.slice(0, 200));
  for (const e of eksik) SORUN.push("Yüklenemeyen dosya: " + e);
  if (ses.filter(s => s === "running").length > 1) SORUN.push("Müzik iki sekmede aynı anda çalıyor");
  for (const tk in kare) if (kare[tk] > 60) SORUN.push("Kare süresi yüksek (" + tk + "): " + kare[tk] + " ms");
  console.log("Kare süreleri (ms, başsız tarayıcı): " + Object.entries(kare).map(([k, v]) => k + " " + v).join(", "));
  BILGI.forEach(x => console.log("· " + x));
  console.log(SORUN.length ? "SORUNLAR:\n- " + SORUN.join("\n- ") : "SORUN YOK");
  process.exit(SORUN.length ? 1 : 0);
})().catch(e => { console.log("Kontrol çalışamadı: " + e.message); process.exit(2); });

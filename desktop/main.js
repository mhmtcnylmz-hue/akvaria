// Akvaria masaüstü kabuğu: oyunu yerel sunucudan (localhost) açar.
const { app, BrowserWindow, shell, Menu } = require("electron");
const http = require("http"), fs = require("fs"), path = require("path");

// Sabit port: localStorage (oyun kaydı) adrese bağlı, port değişirse kayıt kaybolur.
const PORT = 47821;
const ROOT = path.join(__dirname, "game");
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json",
  ".webmanifest": "application/manifest+json", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg",
  ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".ogg": "audio/ogg", ".m4a": "audio/mp4", ".wav": "audio/wav", ".woff2": "font/woff2" };

// GPU ayarları: Intel/entegre kartlarda donanım hızlandırmayı zorla, arka planda kısma yapma.
app.commandLine.appendSwitch("ignore-gpu-blocklist");
app.commandLine.appendSwitch("enable-gpu-rasterization");
app.commandLine.appendSwitch("enable-zero-copy");
app.commandLine.appendSwitch("force_high_performance_gpu");
app.commandLine.appendSwitch("disable-renderer-backgrounding");
app.commandLine.appendSwitch("disable-background-timer-throttling");
app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");

function serve() {
  return new Promise((resolve, reject) => {
    const srv = http.createServer((req, res) => {
      let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
      if (p === "/") p = "/index.html";
      const f = path.normalize(path.join(ROOT, p));
      if (!f.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
      fs.readFile(f, (err, buf) => {
        if (err) { res.writeHead(404); return res.end(); }
        if (p === "/index.html") // bulut kaydını http://localhost üzerinde de aç
          buf = Buffer.from(buf.toString("utf8").replace("<head>", "<head><script>window.__fbTest=true;window.__desktop=true</script>"));
        res.writeHead(200, { "Content-Type": TYPES[path.extname(f).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-cache" });
        res.end(buf);
      });
    });
    srv.on("error", reject);
    srv.listen(PORT, "127.0.0.1", () => resolve());
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1600, height: 900, minWidth: 800, minHeight: 450, backgroundColor: "#06202e",
    title: "Akvaria", icon: path.join(ROOT, "icon-512.png"), show: false,
    webPreferences: { backgroundThrottling: false, contextIsolation: true, sandbox: true }
  });
  // Google girişi Electron'u "güvensiz tarayıcı" sayıyor; normal Chrome kimliği kullan.
  const ua = win.webContents.getUserAgent().replace(/\s(Electron|akvaria)\/\S+/gi, "");
  win.webContents.setUserAgent(ua);
  win.webContents.setWindowOpenHandler(({ url }) => {
    // Firebase/Google giriş açılır penceresi uygulama içinde kalmalı, diğer bağlantılar tarayıcıda açılsın
    if (/^https:\/\/(accounts\.google\.com|[^/]+\.firebaseapp\.com|[^/]+\.google\.com)\//.test(url) || url === "about:blank")
      return { action: "allow", overrideBrowserWindowOptions: { width: 520, height: 680, autoHideMenuBar: true, webPreferences: { contextIsolation: true, sandbox: true } } };
    if (/^https?:/.test(url)) shell.openExternal(url);
    return { action: "deny" };
  });
  win.webContents.on("did-create-window", w => w.webContents.setUserAgent(ua));
  win.once("ready-to-show", () => { win.maximize(); win.show(); });
  win.webContents.on("before-input-event", (e, i) => {
    if (i.type !== "keyDown") return;
    if (i.key === "F11") { win.setFullScreen(!win.isFullScreen()); e.preventDefault(); }
    if (i.key === "F5") { win.webContents.reload(); e.preventDefault(); }
    if (i.key === "F12") { win.webContents.toggleDevTools(); e.preventDefault(); }
  });
  win.loadURL("http://localhost:" + PORT + "/");
}

if (!app.requestSingleInstanceLock()) app.quit();
else {
  app.on("second-instance", () => { const w = BrowserWindow.getAllWindows()[0]; if (w) { if (w.isMinimized()) w.restore(); w.focus(); } });
  Menu.setApplicationMenu(null);
  app.whenReady().then(serve).then(createWindow).catch(e => { require("electron").dialog.showErrorBox("Akvaria", "Başlatılamadı: " + e.message); app.quit(); });
  app.on("window-all-closed", () => app.quit());
}

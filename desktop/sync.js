// Oyun dosyalarını web deposundan (../akvaria) game/ klasörüne kopyalar.
const fs = require("fs"), path = require("path");
const src = process.env.AKVARIA_SRC || path.join(__dirname, "..");
const dst = path.join(__dirname, "game");
const keep = ["index.html", "game.js", "lang.js", "manifest.webmanifest", "a", "snd",
  "apple-touch-icon.png", "icon-192.png", "icon-512.png", "icon-maskable-512.png"];
fs.rmSync(dst, { recursive: true, force: true });
fs.mkdirSync(dst, { recursive: true });
for (const k of keep) fs.cpSync(path.join(src, k), path.join(dst, k), { recursive: true });
fs.mkdirSync(path.join(__dirname, "build"), { recursive: true });
fs.copyFileSync(path.join(src, "icon-512.png"), path.join(__dirname, "build", "icon.png"));
console.log("oyun dosyaları kopyalandı:", src, "->", dst);

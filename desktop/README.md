# Akvaria masaüstü (Windows .exe)
Oyunu Electron içinde, yerel sunucudan (http://localhost:47821) açar. Oyun dosyaları üst klasörden kopyalanır.
- Kurulum: `cd desktop && npm install`
- Deneme: `npm start`
- Windows paketi: `npm run dist:win` → `dist/Akvaria-Kurulum-<sürüm>.exe` ve `dist/Akvaria-<sürüm>-portable.exe` (Linux'ta wine64 + wine32 gerekir)
- Sürüm yükseltirken `package.json` içindeki `version` alanını da güncelle.

# akvaria
## Dosya yapısı (sürüm 112'den itibaren)
- `index.html`: sayfa, stiller ve yükleyici. Resimleri önden yükler, sonra `game.js`'i başlatır.
- `game.js`: oyunun bütün kodu.
- `a/`: resim ve ses dosyaları. Adları içeriklerinin özetidir; aynı resim hep aynı adla kalır.
- Koda yeni bir resim gömülü (base64) olarak eklenirse `python3 tools/split_assets.py index.html` komutu onu `a/` klasörüne taşır.
- Sürüm yükseltirken: `index.html` içindeki "sürüm N" yazısı ve `sw.js` içindeki `akvaria-vN`.
- Günlük kontrol: `node tools/gunluk_kontrol.js` (oyunu başsız tarayıcıda açar, hataları ve eksik dosyaları raporlar; çıkış kodu 0 = sorun yok).

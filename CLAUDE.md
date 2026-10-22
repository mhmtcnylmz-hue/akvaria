# Akvaria — kaynak dalı

Bu dal oyunun kaynağıdır. Yayın `main` dalındadır (GitHub Pages → https://akvariagame.com).
Oyun tek dosyadır: `src/build.py`, `src/*.html|css|js` ve `src/assets.json` (base64 görseller) birleştirilir.

## Derleme ve test
- `python3 src/build.py out.html art.html` → `out.html` (site) ve `art.html` (Claude sayfası)
- `node src/test.js out.html` → birim testleri; hepsi "geçti" olmalı (sondaki satır "N geçti, 0 kaldı")
- `node tools/smoke.js out.html` → tarayıcıda yatay/dikey duman testi; çıkış kodu 0 olmalı

## Yayın
1. `git worktree add ../site main` (ya da main'i ayrı klasöre klonla)
2. `python3 tools/release.py ../site` → sürüm numarasını artırır, `index.html`, `sw.js`, `manifest.webmanifest` yazar
3. Kaynak dalına (`kaynak`) ve `main`'e ayrı ayrı commit + push

## Değişmemesi gerekenler
- Kayıt anahtarı `fishvilleClassicSave3` ve kayıt biçimi (oyuncuların ilerlemesi buna bağlı)
- Firebase yapılandırması (`FB_CFG`), Firestore yolları: `data/users/{uid}/save`, `tanks/{uid}`, `helps/{uid}`, `profiles/{uid}`
- Ses dosyaları `snd/` (main dalında), `snd/synth.py` ile üretilir
- Zynga ya da başka bir firmaya ait görsel/isim kullanılmaz

## Notlar
- Oyuncu dili Türkçe; kullanıcıya görünen bütün yazılar Türkçe.
- Arayüz (v3, sürüm 107): üst çubuk `#topbar` (seviye halkası, XP, altın/zümrüt, ayar), sol `.side`, sağ `.rside`, Yemle/Temizle sağ sütunda (`.rside .bub`, tabanı boş bırakır), alt menü `#nav` (`navSync()` seçili düğmeyi işaretler). Simgeler `assets.json` içinde `u_*`. Yeni kurallar `style.css` sonundaki "v3" bölümünde (`#stage #game` öneki).
- Derin Okyanus (sürüm 109): `TANKS.deep` (Sv35), türler `deep:1` (Sv35–46 kademeli), hep gece (`NIGHT()`/`deepNow()`), ışık örtüsü `drawDeepLight`/`LITE`, canlı yem `mkKrill` (tp "k"), görevler `q.deep`, etkinlikler `dp:1`. Görselleri: `sp_lantern…sp_dragon`, `jb_deep`/`ja_deep`, `cr_iso`, `css_deep`/`css_deepL`, `ic_tankD`. Mutasyon görseli yok: `mutOK()`/`noMut()` mutasyonu engeller; görseller gelince `MUT_IMG`'e eklenmesi yeter.
- Seviye eğrisi `xpNeed(l)=100l+⌊l³/20⌋`.
- Ekran yönü: `ORI` (yatay/dikey), yatay düzen CSS'i `html.land` altında.
- Hata günlüğü: oyun içi hatalar `localStorage["fvErr"]` ve Ayarlar'daki `#errNote`.

#!/usr/bin/env python3
"""Akvaria: index.html içine gömülü resim/ses verilerini ayrı dosyalara taşır.

Kullanım:  python3 tools/split_assets.py index.html   (yerinde dönüştürür)
- Uzun base64 verileri a/<içerik-özeti>.<uzantı> dosyalarına yazılır (aynı içerik = aynı ad, tarayıcı önbelleği bozulmaz)
- Ana oyun kodu game.js dosyasına taşınır; index.html önce resimleri önden yükler, sonra game.js'i başlatır
- Zaten bölünmüş bir dosyada tekrar çalıştırılırsa sadece yeni eklenen gömülü verileri taşır
"""
import re, sys, os, hashlib, base64, json

MIN = 400
EXT = {"image/webp": "webp", "image/png": "png", "image/jpeg": "jpg", "audio/mpeg": "mp3"}


def main(path):
    root = os.path.dirname(os.path.abspath(path))
    adir = os.path.join(root, "a")
    os.makedirs(adir, exist_ok=True)
    s = open(path, encoding="utf-8").read()
    gpath = os.path.join(root, "game.js")
    game = open(gpath, encoding="utf-8").read() if os.path.exists(gpath) else None
    written = {}

    def save(b64, ext):
        raw = base64.b64decode(b64 + "=" * (-len(b64) % 4))
        name = "a/" + hashlib.sha1(raw).hexdigest()[:16] + "." + ext
        fp = os.path.join(root, name)
        if not os.path.exists(fp):
            open(fp, "wb").write(raw)
        written[name] = 1
        return name

    def expr_end(t, i):
        """i: start of a JS expression; returns end index (member chain or balanced parens)."""
        if t[i] == "(":
            d = 0
            j = i
            while True:
                c = t[j]
                if c in "([{": d += 1
                elif c in ")]}":
                    d -= 1
                    if d == 0: return j + 1
                elif c in "\"'`":
                    q = c; j += 1
                    while t[j] != q:
                        if t[j] == "\\": j += 1
                        j += 1
                j += 1
        m = re.compile(r"[A-Za-z_$][\w$]*").match(t, i)
        j = m.end()
        while j < len(t):
            if t[j] == "." and re.match(r"[A-Za-z_$]", t[j + 1:j + 2]):
                j = re.compile(r"[A-Za-z_$][\w$]*").match(t, j + 1).end()
            elif t[j] == "[":
                d = 0
                while True:
                    if t[j] == "[": d += 1
                    elif t[j] == "]":
                        d -= 1
                        if d == 0: break
                    j += 1
                j += 1
            else:
                break
        return j

    def fix_concat(t):
        out = []; i = 0
        pat = re.compile(r"data:image/webp;base64,(['\"])\+")
        while True:
            m = pat.search(t, i)
            if not m:
                out.append(t[i:]); break
            q = m.group(1); e0 = m.end(); e1 = expr_end(t, e0)
            out.append(t[i:m.start()]); out.append(q + "+B64(" + t[e0:e1] + ")")
            i = e1
        t = "".join(out)
        t = re.sub(r"data:image/webp;base64,\$\{", "${B64(", t)
        # close template B64 calls: ${B64(EXPR} -> ${B64(EXPR)}
        t = re.sub(r"\$\{B64\(([^{}]*)\}", r"${B64(\1)}", t)
        return t

    def extract(t):
        t = re.sub(r"data:([a-z]+/[a-z0-9.+-]+);base64,([A-Za-z0-9+/]{%d,}={0,2})" % MIN,
                   lambda m: save(m.group(2), EXT.get(m.group(1), "bin")) if m.group(1) in EXT else m.group(0), t)
        t = re.sub(r"([\"'])(UklG[A-Za-z0-9+/]{%d,}={0,2})\1" % MIN, lambda m: m.group(1) + save(m.group(2), "webp") + m.group(1), t)
        return t

    scripts = list(re.finditer(r"<script>(.*?)</script>", s, re.S))
    if game is None:
        main_m = max(scripts, key=lambda m: len(m.group(1)))
        game = main_m.group(1)
        s = s[:main_m.start()] + "<script>" + LOADER + "</script>" + s[main_m.end():]
    game = extract(fix_concat(game))
    if "function B64(" not in game:
        game = 'function B64(x){return typeof x==="string"&&x.slice(0,2)==="a/"?x:"data:image/webp;base64,"+x}\n' + game
    s = extract(fix_concat(s))
    # preload list: every asset referenced anywhere
    used = sorted(set(re.findall(r"a/[0-9a-f]{16}\.(?:webp|png|jpg)", s + game)))
    s = re.sub(r"window\.__AKV_ASSETS=\[[^\]]*\];", "window.__AKV_ASSETS=" + json.dumps(used, separators=(",", ":")) + ";", s)
    open(path, "w", encoding="utf-8").write(s)
    open(gpath, "w", encoding="utf-8").write(game)
    print("index.html", len(s), "game.js", len(game), "assets", len(used), "new files", len(written))


# Resimleri önden yükle (tarayıcı belleğinde hazır olsunlar, oyun kodu onları anında bulsun), sonra oyunu başlat
LOADER = r"""
window.__AKV_ASSETS=[];
(function(){var L=window.__AKV_ASSETS,n=L.length,k=0,keep=window.__AKV_PRE=[],started=false,v=(document.getElementById("verNote")||{}).textContent||"";
function go(){if(started)return;started=true;var s=document.createElement("script");s.src="game.js?v="+encodeURIComponent(v.replace(/\D/g,"")||"0");s.onerror=function(){var b=document.getElementById("boot");if(b)b.querySelector("p")&&(b.querySelector("p").textContent="Yüklenemedi, sayfayı yenile")};document.body.appendChild(s)}
function one(){k++;try{window.bootP&&bootP(55+Math.round(28*k/n))}catch(e){}if(k>=n)go()}
if(!n){go();return}var q=0,act=0,MAX=16;
function next(){while(act<MAX&&q<n){var im=new Image();act++;im.onload=im.onerror=function(){act--;one();next()};im.src=L[q++];keep.push(im)}}
next();setTimeout(go,20000)})();
"""

if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "index.html")

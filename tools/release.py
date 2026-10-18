# Akvaria sürüm çıkarıcı: kaynaktan derler, sürüm numarasını artırır, site dosyalarını hedef klasöre yazar.
# Kullanım: python3 tools/release.py <main dalının çalışma klasörü> [--no-bump]
import os, re, sys, subprocess, shutil
R = os.path.dirname(os.path.abspath(__file__)) + '/../'
dst = sys.argv[1]; bump = '--no-bump' not in sys.argv
body = open(R + 'src/body.html', encoding='utf-8').read()
v = int(re.search(r'Akvaria · sürüm (\d+)', body).group(1))
if bump:
    v += 1; body = re.sub(r'Akvaria · sürüm \d+', 'Akvaria · sürüm %d' % v, body)
    open(R + 'src/body.html', 'w', encoding='utf-8').write(body)
subprocess.run([sys.executable, R + 'src/build.py', R + 'out.html', R + 'art.html'], check=True)
o = open(R + 'out.html', encoding='utf-8').read()
T = '<title>Akvaria</title>'; b = o.index(T) + len(T)
ins = open(R + 'site/head_extra.html', encoding='utf-8').read()
sw = '<script>if("serviceWorker" in navigator&&location.protocol==="https:")addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}))</script>'
n = o[:b] + ins + o[b:]; n = n[:n.rindex('</body>')] + sw + '</body></html>'
open(os.path.join(dst, 'index.html'), 'w', encoding='utf-8').write(n)
s = re.sub(r'akvaria-v\d+', 'akvaria-v%d' % v, open(R + 'site/sw.js').read())
open(R + 'site/sw.js', 'w').write(s); shutil.copy(R + 'site/sw.js', os.path.join(dst, 'sw.js'))
shutil.copy(R + 'site/manifest.webmanifest', os.path.join(dst, 'manifest.webmanifest'))
print('sürüm', v)

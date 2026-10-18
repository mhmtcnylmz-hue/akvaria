import json,re,sys
import os
W=os.path.dirname(os.path.abspath(__file__))+'/'
A=json.load(open(W+'assets.json'))
def fill(t):
    def r(m):
        k=m.group(1)
        if k not in A: raise SystemExit('eksik görsel: '+k)
        return A[k]
    return re.sub(r'«([A-Za-z0-9_]+)»',r,t)
head=open(W+'head.html').read();css=open(W+'style.css').read();body=open(W+'body.html').read();js=open(W+'game.js').read()
boot=open(W+'boot.html').read();CK=lambda v:'<script>window.bootP&&bootP(%d)</script>'%v
html=fill(head)+'</style></head><body>'+fill(boot)+'<style>'+fill(css)+'</style>'+CK(40)+fill(body)+CK(55)+'<script>'+fill(js)+'</script></body></html>'
out=sys.argv[1] if len(sys.argv)>1 else W+'out.html'
open(out,'w',encoding='utf-8').write(html);print(out,len(html)//1024,'KB')
if len(sys.argv)>2:
    art='<title>Akvaria</title><meta name="claude:viewport-fit-sides" content="cover"><meta name="theme-color" content="#063b62">'+fill(boot)+'<style>'+fill(css)+'</style>'+CK(40)+fill(body)+CK(55)+'<script>'+fill(js)+'</script>'
    open(sys.argv[2],'w',encoding='utf-8').write(art);print(sys.argv[2],len(art)//1024,'KB')

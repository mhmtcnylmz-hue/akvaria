// Tarayıcı duman testi: oyunu yatay ve dikey açar, panelleri gezer, temel işlemleri dener, JS hatası arar.
// Kullanım: node tools/ekran_testi.js   (çıkış kodu 0 = sorun yok; ekran görüntüleri geçici klasöre yazılır)
let pw;try{pw=require('playwright')}catch(e){pw=require('/opt/npm-tools/node_modules/playwright')}
const fs=require('fs'),path=require('path');const exe=['/opt/pw-browsers/chromium','/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find(p=>fs.existsSync(p));
const http=require('http'),os=require('os'),ROOT=path.resolve(__dirname,'..'),PORT=8812;
const MIME={'.html':'text/html','.js':'application/javascript','.webp':'image/webp','.png':'image/png','.mp3':'audio/mpeg','.json':'application/json','.webmanifest':'application/json'};
const srv=http.createServer((q,r)=>{const p=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]).replace(/^\/$/,'/index.html'));if(!p.startsWith(ROOT)||!fs.existsSync(p)||fs.statSync(p).isDirectory()){r.writeHead(404);r.end();return}r.writeHead(200,{'Content-Type':MIME[path.extname(p)]||'application/octet-stream'});fs.createReadStream(p).pipe(r)});
const file='http://localhost:'+PORT+'/index.html';
(async()=>{await new Promise(r=>srv.listen(PORT,r));const b=await pw.chromium.launch(exe?{executablePath:exe,args:['--no-sandbox']}:{args:['--no-sandbox']});const errs=[];let fails=0;
const ok=(c,m)=>{console.log((c?'GEÇTİ ':'KALDI ')+m);if(!c)fails++};
for(const [w,h,n] of [[1280,720,'yatay'],[390,844,'dikey'],[844,390,'yatay-telefon']]){
 const ctx=await b.newContext({viewport:{width:w,height:h}});const p=await ctx.newPage();await ctx.route(/firebase|gstatic\.com|googleapis/,r=>r.abort());p.on('pageerror',e=>errs.push(n+': '+e.message));
 await p.goto(file);await p.waitForTimeout(3500);
 ok(await p.evaluate(()=>!!document.querySelector('canvas')&&document.querySelector('canvas').width>0),n+' tuval çiziliyor');
 const land=await p.evaluate(()=>document.documentElement.classList.contains('land'));ok(land===(w>h),n+' doğru yön ('+(land?'yatay':'dikey')+')');
 for(const id of ['fishes','questBtn','mapBtn','dshop','setBtn']){const ex=await p.evaluate(i=>{const e=document.getElementById(i)||document.querySelector('[data-sheet="'+i+'"]');if(!e||e.offsetParent===null)return 'yok';e.click();return 'ok'},id);if(ex==='ok'){await p.waitForTimeout(400);const open=await p.evaluate(()=>document.getElementById('sheet').classList.contains('show'));ok(open,n+' '+id+' paneli açıldı');await p.evaluate(()=>{const c=document.getElementById('sclose');c&&c.click()});await p.waitForTimeout(250)}}
 const c0=await p.evaluate(()=>document.getElementById('coins').textContent);await p.evaluate(()=>{const f=document.getElementById('feed');f&&f.click()});await p.waitForTimeout(200);
 const r=await p.evaluate(()=>{const c=document.querySelector('canvas').getBoundingClientRect();return[c.x+c.width*.5,c.y+c.height*.45]});await p.mouse.click(r[0],r[1]);await p.waitForTimeout(400);
 const c1=await p.evaluate(()=>document.getElementById('coins').textContent);ok(c0!==c1,n+' yem atılınca altın düştü ('+c0+' → '+c1+')');
 const lay=await p.evaluate(()=>{const W=innerWidth,H=innerHeight,R=s=>{const e=document.querySelector(s);if(!e||e.offsetParent===null)return null;const q=e.getBoundingClientRect();return q},ov=(a,b)=>a&&b&&a.left<b.right-1&&b.left<a.right-1&&a.top<b.bottom-1&&b.top<a.bottom-1,ks=['#topbar','#nav','.side','.rside','#cntpill'],bad=[];for(const k of ks){const q=R(k);if(!q){bad.push(k+' yok');continue}if(q.left<-1||q.top<-1||q.right>W+1||q.bottom>H+1)bad.push(k+' ekran dışında')}for(let i=0;i<ks.length;i++)for(let j=i+1;j<ks.length;j++)if(ov(R(ks[i]),R(ks[j])))bad.push(ks[i]+' ile '+ks[j]+' üst üste');const f=R('#feed'),c=R('#clean'),n=R('#nav'),cv=R('canvas');if(f&&c&&n&&cv){const fl=n.top-(n.top-cv.top)*.25;if(f.bottom>fl||c.bottom>fl)bad.push('Yemle/Temizle tabana iniyor ('+Math.round(Math.max(f.bottom,c.bottom))+' > '+Math.round(fl)+')')}return bad});ok(!lay.length,n+' ana ekran öğeleri ekranda ve üst üste binmiyor'+(lay.length?': '+lay.join(', '):''));
 await p.evaluate(()=>document.getElementById('fishes').click());await p.waitForTimeout(300);const nv=await p.evaluate(()=>{const a=document.getElementById('fishes').classList.contains('on');document.getElementById('homeBtn').click();return a&&!document.getElementById('sheet').classList.contains('show')&&document.getElementById('homeBtn').classList.contains('on')});ok(nv,n+' alt menü: Balıklarım seçili görünüyor, Akvaryum paneli kapatıyor');
 await p.screenshot({path:path.join(os.tmpdir(),'akvaria_ekran_'+n+'.png')});await ctx.close()}
ok(errs.length===0,'hiç JS hatası yok'+(errs.length?': '+errs.slice(0,3).join(' | '):''));
await b.close();srv.close();console.log(fails?fails+' sorun':'tamam');process.exit(fails?1:0)})();

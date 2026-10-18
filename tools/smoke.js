// Tarayıcı duman testi: oyunu yatay ve dikey açar, panelleri gezer, temel işlemleri dener, JS hatası arar.
// Kullanım: node tools/smoke.js out.html   (çıkış kodu 0 = sorun yok)
let pw;try{pw=require('playwright')}catch(e){pw=require('/opt/npm-tools/node_modules/playwright')}
const fs=require('fs'),path=require('path');const exe=['/opt/pw-browsers/chromium','/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find(p=>fs.existsSync(p));
const file='file://'+path.resolve(process.argv[2]||'out.html');
(async()=>{const b=await pw.chromium.launch(exe?{executablePath:exe,args:['--no-sandbox']}:{args:['--no-sandbox']});const errs=[];let fails=0;
const ok=(c,m)=>{console.log((c?'GEÇTİ ':'KALDI ')+m);if(!c)fails++};
for(const [w,h,n] of [[1280,720,'yatay'],[390,844,'dikey'],[844,390,'yatay-telefon']]){
 const ctx=await b.newContext({viewport:{width:w,height:h}});const p=await ctx.newPage();p.on('pageerror',e=>errs.push(n+': '+e.message));
 await p.goto(file);await p.waitForTimeout(3500);
 ok(await p.evaluate(()=>!!document.querySelector('canvas')&&document.querySelector('canvas').width>0),n+' tuval çiziliyor');
 const land=await p.evaluate(()=>document.documentElement.classList.contains('land'));ok(land===(w>h),n+' doğru yön ('+(land?'yatay':'dikey')+')');
 for(const id of ['fishes','questBtn','mapBtn','dshop','setBtn']){const ex=await p.evaluate(i=>{const e=document.getElementById(i)||document.querySelector('[data-sheet="'+i+'"]');if(!e||e.offsetParent===null)return 'yok';e.click();return 'ok'},id);if(ex==='ok'){await p.waitForTimeout(400);const open=await p.evaluate(()=>document.getElementById('sheet').classList.contains('show'));ok(open,n+' '+id+' paneli açıldı');await p.evaluate(()=>{const c=document.getElementById('sclose');c&&c.click()});await p.waitForTimeout(250)}}
 const c0=await p.evaluate(()=>document.querySelector('.hud .bar b').textContent);await p.evaluate(()=>{const f=document.getElementById('feed');f&&f.click()});await p.waitForTimeout(200);
 const r=await p.evaluate(()=>{const c=document.querySelector('canvas').getBoundingClientRect();return[c.x+c.width*.5,c.y+c.height*.45]});await p.mouse.click(r[0],r[1]);await p.waitForTimeout(400);
 const c1=await p.evaluate(()=>document.querySelector('.hud .bar b').textContent);ok(c0!==c1,n+' yem atılınca altın düştü ('+c0+' → '+c1+')');
 await p.screenshot({path:'smoke_'+n+'.png'});await ctx.close()}
ok(errs.length===0,'hiç JS hatası yok'+(errs.length?': '+errs.slice(0,3).join(' | '):''));
await b.close();console.log(fails?fails+' sorun':'tamam');process.exit(fails?1:0)})();

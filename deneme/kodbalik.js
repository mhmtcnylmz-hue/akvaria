// Kodla çizilen Koi: hiçbir resim dosyası yok, her parça burada çizilir.
// Bütün parçalar aynı (gövde) koordinat sisteminde çizildiği için birbirine tam oturur;
// yüzgeç kökleri gövde kenarını takip ederek gövdenin altına girer, böylece boşluk oluşmaz.
// Mutasyonlar yalnızca renk ayarıdır (PAL).
(function(){"use strict";
const BW=1000,BH=480,CY=232,X0=60,X1=945,L=X1-X0;
const sm=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)};
const T=x=>(x-X0)/L;
function hT(t){if(t<=0)return 52;if(t<.62)return 52+150*Math.pow(sm(.02,.62,t),.78);const u=(t-.62)/.38;return 202*Math.pow(Math.max(0,1-Math.pow(u,2.6)),.42)}
function hB(t){if(t<=0)return 52;if(t<.52)return 52+124*Math.pow(sm(.02,.52,t),.9);const u=(t-.52)/.48;return 176*Math.pow(Math.max(0,1-Math.pow(u,2.2)),.45)}
function hAt(t){return(hT(t)+hB(t))/2}
const drop=t=>26*sm(.6,1,t);
const topY=x=>{const t=T(x);return CY-hT(t)+drop(t)};
const botY=x=>{const t=T(x);return CY+hB(t)+drop(t)};
const midY=x=>(topY(x)+botY(x))/2;
function rng(seed){let s=seed>>>0||1;return()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return(s>>>0)/4294967296}}
const hex=h=>{h=h.replace("#","");return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]};
const mix=(a,b,k)=>a.map((v,i)=>Math.round(v+(b[i]-v)*k));
const rgba=(c,a)=>"rgba("+c[0]+","+c[1]+","+c[2]+","+(a==null?1:a)+")";
function cv(w,h){const c=document.createElement("canvas");c.width=Math.ceil(w);c.height=Math.ceil(h);return c}
const PAL={
 normal:{base:"#f8f4ef",red:"#d8341a",black:"#1c1b21",finA:"#ec6a2a",finB:"#fffaf5",finAl:.96,irisI:"#f7c45c",irisO:"#c56f28",pupil:"#090707",bodyAl:1,inv:0,gloss:1},
 albino:{base:"#fdf4f2",red:"#f3a3ab",black:null,finA:"#f6aebd",finB:"#ffffff",finAl:.9,irisI:"#ff6a5c",irisO:"#a3121c",pupil:"#3a0408",bodyAl:1,inv:0,gloss:1},
 melanistic:{base:"#26252e",red:"#3d3852",black:"#0b0b10",white:"#e9e7f2",finA:"#2b2a3b",finB:"#8f8ac2",finAl:.9,irisI:"#f2c04e",irisO:"#9a6418",pupil:"#050505",bodyAl:1,inv:1,gloss:1.2},
 gold:{base:"#f4c64e",red:"#cf8b17",black:"#7d5310",finA:"#f2b638",finB:"#fff4c6",finAl:.92,irisI:"#fbe08a",irisO:"#b07a1c",pupil:"#0a0805",bodyAl:1,inv:0,gloss:1.6},
 transparent:{base:"#d6f3ee",red:"#a2dccb",black:"#6a9b8c",finA:"#bfeee6",finB:"#f4fffd",finAl:.6,irisI:"#d8f7a0",irisO:"#5c9a3a",pupil:"#0b1a10",bodyAl:.62,inv:0,gloss:1.3}
};
// leke alanı (gövde koordinatında): kırmızı ve siyah lekeler; kenarlar hafif dalgalı
function field(blobs,x,y){let f=0;for(const b of blobs){const dx=(x-b[0])/b[2],dy=(y-b[1])/b[3];f=Math.max(f,Math.exp(-(dx*dx+dy*dy)*1.6))}
 return f+.07*Math.sin(x/19+y/27)*Math.sin(y/23-x/41)}
const RED=[[655,CY-86,125,72],[440,CY-96,115,80],[255,CY-64,82,56],[560,CY+6,72,42],[340,CY+20,60,34]];
const BLK=[[525,CY-118,48,36],[335,CY-78,38,30],[705,CY-128,28,22],[205,CY-40,24,20]];
function bodyPath(c,x0){c.beginPath();const n=260;for(let i=0;i<=n;i++){const x=x0+(X1-x0)*i/n;i?c.lineTo(x,topY(x)):c.moveTo(x,topY(x))}
 for(let i=n;i>=0;i--){const x=x0+(X1-x0)*i/n;c.lineTo(x,botY(x))}c.closePath()}
function drawBody(P){
 const c=cv(BW,BH),g=c.getContext("2d"),R=rng(7),base=hex(P.base),red=hex(P.red),blk=P.black?hex(P.black):null,wht=P.white?hex(P.white):null;
 g.save();bodyPath(g,X0);g.clip();g.fillStyle=rgba(base);g.fillRect(0,0,BW,BH);
 // pullar: kuyruktan başa doğru çizilir (öndeki pul arkadakinin üstüne biner, serbest kenar kuyruğa bakar)
 const cols=[];for(let x=X0+6;x<X1-120;){const h=hAt(T(x)),s=Math.max(16,h*2/9.2);cols.push([x,s]);x+=s*.62}
 cols.forEach(([x,s],ci)=>{const h=hAt(T(x)),m=midY(x),rows=Math.round(h*2/(s*.86));
  for(let j=-1;j<=rows+1;j++){const v=-1+(j+(ci%2?.5:0))*2/rows,jx=(R()-.5)*s*.12,y=m+v*h*.98+(R()-.5)*s*.1,r=s*.66*(1-.22*v*v)*(.94+R()*.12);x+=jx;const vis=.35+.65*sm(1.05,.1,v)*(1-.45*sm(.2,.9,v));
   let col=base,fr=field(RED,x,y),fb=blk?field(BLK,x,y):0;
   if(fr>.46)col=mix(red,[255,255,255],(R()-.5)*.08);if(blk&&fb>.52)col=mix(blk,[90,90,100],R()*.15);
   if(P.inv){col=fb>.52||fr>.62?mix(wht,[180,175,210],R()*.12):mix(base,[0,0,0],R()*.25)}
   const gr=g.createRadialGradient(x-r*.25,y-r*.2,r*.1,x,y,r*1.05);gr.addColorStop(0,rgba(mix(col,[255,255,255],.16)));gr.addColorStop(.7,rgba(col));gr.addColorStop(1,rgba(mix(col,[0,0,0],.12)));
   g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.fill();
   // serbest kenar (kuyruk tarafı) koyu çizgi ve içinde parlak ince yay
   const wk=(col===base||(P.inv&&col[0]<80))?.55:1;g.strokeStyle=rgba(mix(col,[60,20,10],.5),.5*vis*wk*(.7+R()*.3));g.lineWidth=Math.max(1.6,s*.13);g.beginPath();g.arc(x,y,r*.96,Math.PI*.66,Math.PI*1.34);g.stroke();
   g.strokeStyle="rgba(255,255,255,"+(.42*P.gloss*vis)+")";g.lineWidth=Math.max(1,s*.06);g.beginPath();g.arc(x+r*.08,y,r*.72,Math.PI*.8,Math.PI*1.1);g.stroke();
   if(R()<.06*P.gloss&&v<.3){const sp=g.createRadialGradient(x-r*.2,y-r*.2,0,x-r*.2,y-r*.2,r*.55);sp.addColorStop(0,"rgba(255,255,255,.75)");sp.addColorStop(1,"rgba(255,255,255,0)");g.fillStyle=sp;g.beginPath();g.arc(x-r*.2,y-r*.2,r*.55,0,7);g.fill()}
   // yanal çizgi: orta sıradaki pulların ortasında küçük delik
   x-=jx;if(Math.abs(v-.06)<1/rows){g.fillStyle=rgba(mix(col,[0,0,0],.45),.6);g.beginPath();g.ellipse(x-r*.15,y,r*.13,r*.08,0,0,7);g.fill()}}});
 // baş: pulsuz, pürüzsüz; solungaç kapağının kenarı
 const xo=X0+.795*L;g.save();g.beginPath();const hb=hAt(T(xo));for(let i=0;i<=40;i++){const v=-1.15+2.3*i/40,y=midY(xo)+v*hb,x=xo-46*(1-Math.min(1,v*v));i?g.lineTo(x,y):g.moveTo(x,y)}g.lineTo(BW,BH);g.lineTo(BW,0);g.closePath();g.clip();
 let hc=base;if(P.inv)hc=mix(base,[0,0,0],.1);g.fillStyle=rgba(hc);g.fillRect(0,0,BW,BH);
 const capX=X0+.9*L,capY=topY(X0+.9*L)+50,cap=g.createRadialGradient(capX,capY,5,capX,capY,92);const rc=P.inv?wht:red;cap.addColorStop(0,rgba(rc));cap.addColorStop(.78,rgba(rc));cap.addColorStop(.9,rgba(rc,.4));cap.addColorStop(1,rgba(rc,0));
 g.fillStyle=cap;g.beginPath();g.ellipse(capX,capY,98,62,-.15,0,7);g.fill();
 const ck=g.createRadialGradient(850,CY+60,10,850,CY+60,120);ck.addColorStop(0,"rgba(120,40,20,.0)");ck.addColorStop(.6,"rgba(120,40,20,.08)");ck.addColorStop(1,"rgba(120,40,20,0)");g.fillStyle=ck;g.fillRect(700,CY-50,260,240);g.restore();
 // solungaç kapağı kenarı: koyu çizgi + arkasında parlak dudak
 g.lineCap="round";const gil=(off,w,st)=>{g.strokeStyle=st;g.lineWidth=w;g.beginPath();for(let i=0;i<=40;i++){const v=-.8+1.55*i/40,y=midY(xo)+v*hb,x=xo-46*(1-v*v)+off;i?g.lineTo(x,y):g.moveTo(x,y)}g.stroke()};
 gil(0,3.2,rgba(mix(P.inv?wht:base,[60,20,10],.55),.6));gil(-5,2.4,"rgba(255,255,255,"+(.35*P.gloss)+")");
 // göz çukuru gölgesi
 const ex=X0+.885*L,ey=midY(ex)-.12*(botY(ex)-topY(ex)),eo=g.createRadialGradient(ex,ey,40,ex,ey,64);eo.addColorStop(0,"rgba(0,0,0,.28)");eo.addColorStop(1,"rgba(0,0,0,0)");g.fillStyle=eo;g.beginPath();g.arc(ex,ey,64,0,7);g.fill();
 g.restore();
 // ışık ve gölge (piksel piksel): silindir gölgesi, sırtta parlak şerit, kuyruk sapında yumuşak bitiş
 const id=g.getImageData(0,0,BW,BH),d=id.data;
 for(let x=0;x<BW;x++){const t=T(x),tp=topY(x),bt=botY(x),m=(tp+bt)/2,hh=(bt-tp)/2;if(hh<=1)continue;
  const fade=sm(X0,X0+44,x),hl=.42*P.gloss*sm(.06,.28,t)*(1-sm(.86,.97,t));
  for(let y=Math.max(0,Math.floor(tp)-1);y<=Math.min(BH-1,Math.ceil(bt)+1);y++){const i=(y*BW+x)*4;if(!d[i+3])continue;const v=(y-m)/hh,q=Math.max(0,1-v*v);
   const s=.5+.5*Math.pow(q,.6)+.05*(-v),h2=hl*Math.exp(-Math.pow((v+.52)/.14,2))+.1*P.gloss*Math.exp(-Math.pow((v-.55)/.2,2))*sm(.1,.4,t);
   for(let k=0;k<3;k++)d[i+k]=Math.min(255,d[i+k]*s+255*h2);d[i+3]=d[i+3]*fade*P.bodyAl}}
 g.putImageData(id,0,0);
 // dış çizgi (kuyruk sapı hariç)
 g.save();g.beginPath();const n=200;for(let i=0;i<=n;i++){const x=X0+40+(X1-X0-40)*i/n;i?g.lineTo(x,topY(x)):g.moveTo(x,topY(x))}for(let i=n;i>=0;i--){const x=X0+40+(X1-X0-40)*i/n;g.lineTo(x,botY(x))}
 g.strokeStyle=rgba(mix(P.inv?hex("#3a3850"):base,[70,25,10],.6),.55);g.lineWidth=2.6;g.stroke();g.restore();
 // ağız, burun deliği, bıyıklar
 const mx=X1-4,my=midY(X1-10)+6;g.strokeStyle=rgba(mix(base,[80,20,10],.6),.75);g.lineWidth=2.4;g.beginPath();g.moveTo(mx-30,my+6);g.quadraticCurveTo(mx-12,my+12,mx,my+2);g.stroke();
 g.fillStyle="rgba(255,255,255,"+(.5*P.gloss)+")";g.beginPath();g.ellipse(mx-14,my-3,13,4,-.2,0,7);g.fill();
 g.fillStyle=rgba(mix(base,[40,10,5],.7),.7);g.beginPath();g.ellipse(X1-34,midY(X1-34)-24,5,3.5,-.4,0,7);g.fill();
 const barbel=(x0,y0,x1,y1,cx,cy2,w,al)=>{for(let k=0;k<12;k++){const a=k/12,b=(k+1)/12,P0=(t)=>[(1-t)*(1-t)*x0+2*(1-t)*t*cx+t*t*x1,(1-t)*(1-t)*y0+2*(1-t)*t*cy2+t*t*y1];const p=P0(a),q=P0(b);
  g.strokeStyle=rgba(mix(base,[255,255,255],.3),al);g.lineWidth=w*(1-a*.8);g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(q[0],q[1]);g.stroke();
  g.strokeStyle=rgba(mix(base,[90,40,30],.5),al*.35);g.lineWidth=1;g.beginPath();g.moveTo(p[0]+w*.3,p[1]);g.lineTo(q[0]+w*.3,q[1]);g.stroke()}};
 barbel(mx-30,my+8,mx-48,my+92,mx-22,my+50,7,.95);barbel(mx-18,my+10,mx-10,my+78,mx-2,my+40,6,.9);
 return c}
// Catmull-Rom ile eğri örnekleme (eşit uzunluklu noktalar)
function spline(P,n){const S=[];for(let i=0;i<P.length-1;i++){const p0=P[Math.max(0,i-1)],p1=P[i],p2=P[i+1],p3=P[Math.min(P.length-1,i+2)];
  for(let k=0;k<24;k++){const t=k/24,t2=t*t,t3=t2*t;S.push([.5*((2*p1[0])+(-p0[0]+p2[0])*t+(2*p0[0]-5*p1[0]+4*p2[0]-p3[0])*t2+(-p0[0]+3*p1[0]-3*p2[0]+p3[0])*t3),.5*((2*p1[1])+(-p0[1]+p2[1])*t+(2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*t2+(-p0[1]+3*p1[1]-3*p2[1]+p3[1])*t3)])}}
 S.push(P[P.length-1]);const len=[0];for(let i=1;i<S.length;i++)len.push(len[i-1]+Math.hypot(S[i][0]-S[i-1][0],S[i][1]-S[i-1][1]));
 const out=[];let j=0;for(let k=0;k<=n;k++){const L=len[len.length-1]*k/n;while(j<len.length-2&&len[j+1]<L)j++;const a=(L-len[j])/Math.max(1e-6,len[j+1]-len[j]);out.push([S[j][0]+(S[j+1][0]-S[j][0])*a,S[j][1]+(S[j+1][1]-S[j][1])*a])}return out}
// yüzgeç: B kök noktaları, E kenar noktaları (aynı sayıda), ışınlar kökten kenara; box gövde koordinatında
function drawFin(P,B,E0,box,o){
 // B ve E yoğun örneklenmiş (her ışın arası K adım); ışın aralarında kenar hafif içe çekilir (gerçek yüzgeç kenarı gibi)
 const K=o.K||6,c=cv(box[2],box[3]),g=c.getContext("2d"),A=hex(P.finA),Z=hex(P.finB),al=P.finAl*(o.al||1),n=B.length-1;g.translate(-box[0],-box[1]);
 const E=E0.map((p,i)=>{if(!i||i===n)return p;const a=E0[i-1],b=E0[i+1],nx=-(b[1]-a[1]),ny=b[0]-a[0],nl=Math.hypot(nx,ny)||1,w=-(o.wave||5)*Math.pow(Math.sin(Math.PI*(i%K)/K),1.5);
  const bx=B[i][0]-p[0],by=B[i][1]-p[1],sg=(nx*bx+ny*by)>0?1:-1;return[p[0]+nx/nl*w*-sg,p[1]+ny/nl*w*-sg]});
 const ray=i=>{const b=B[i],e=E[i],bw=(o.bow||.06)*(1+.3*Math.sin(i/K*1.3));return[b,e,(b[0]+e[0])/2+(e[1]-b[1])*bw,(b[1]+e[1])/2-(e[0]-b[0])*bw]};
 const qp=(r,t)=>[(1-t)*(1-t)*r[0][0]+2*(1-t)*t*r[2]+t*t*r[1][0],(1-t)*(1-t)*r[0][1]+2*(1-t)*t*r[3]+t*t*r[1][1]];
 // zar: ince şeritler (yumuşak), her ışın şeridinde renk değişimi
 for(let i=0;i<n;i++){const ri=Math.floor(i/K),st=(ri%4===1||ri%7===3)?.55:0,k=(ri%2?.05:-.02);
  const r0=ray(i),r1=ray(i+1),gr=g.createLinearGradient(B[i][0],B[i][1],E[i][0],E[i][1]);
  gr.addColorStop(0,rgba(mix(A,[255,255,255],Math.max(0,k)),al));gr.addColorStop(o.mid||.42,rgba(mix(mix(A,Z,.55-st*.5),[0,0,0],Math.max(0,-k)),al*.95));gr.addColorStop(.82,rgba(mix(Z,A,st*.55),al*.82));gr.addColorStop(1,rgba(Z,al*.6));
  g.fillStyle=gr;g.beginPath();g.moveTo(r0[0][0],r0[0][1]);for(let t=1;t<=8;t++){const q=qp(r0,t/8);g.lineTo(q[0],q[1])}for(let t=8;t>=0;t--){const q=qp(r1,t/8);g.lineTo(q[0],q[1])}g.closePath();g.fill();g.strokeStyle=gr;g.lineWidth=.8;g.stroke()}
 // ışınlar
 g.lineCap="round";for(let i=0;i<=n;i+=K){const r=ray(i);
  for(let k=0;k<12;k++){const p0=qp(r,k/12),p1=qp(r,(k+1)/12);g.strokeStyle=rgba(mix(A,[90,30,10],.45),.45*(1-k/12*.75)*al);g.lineWidth=2.4*(1-k/12*.65);g.beginPath();g.moveTo(p0[0],p0[1]);g.lineTo(p1[0],p1[1]);g.stroke()}
  g.strokeStyle="rgba(255,255,255,"+(.38*al)+")";g.lineWidth=1;g.beginPath();g.moveTo(r[0][0]+1,r[0][1]+1);g.quadraticCurveTo(r[2]+1,r[3]+1,r[1][0],r[1][1]);g.stroke();
  // ışın ucu çatallanması
  if(i+K/2<=n){const m=qp(r,.65),e2=E[i+Math.floor(K/2)];g.strokeStyle=rgba(mix(A,[90,30,10],.4),.22*al);g.lineWidth=1;g.beginPath();g.moveTo(m[0],m[1]);g.lineTo(e2[0],e2[1]);g.stroke()}}
 // kenar: ince koyu çizgi + iç tarafta parlak kenar
 g.strokeStyle=rgba(mix(Z,[80,40,30],.55),.42*al);g.lineWidth=1.8;g.beginPath();E.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.stroke();
 g.strokeStyle="rgba(255,255,255,"+(.3*al)+")";g.lineWidth=3;g.beginPath();E.forEach((p,i)=>{const q=[p[0]+(B[i][0]-p[0])*.03,p[1]+(B[i][1]-p[1])*.03];i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1])});g.stroke();
 if(o.root){const r=o.root;const rg=g.createRadialGradient(r[0],r[1],1,r[0],r[1],Math.max(r[2],r[3]));rg.addColorStop(0,rgba(mix(A,[60,20,10],.35),.75));rg.addColorStop(1,rgba(mix(A,[60,20,10],.35),0));g.fillStyle=rg;g.beginPath();g.ellipse(r[0],r[1],r[2],r[3],r[4]||0,0,7);g.fill()}
 return c}
const inset=(x,top,k)=>top?[x,topY(x)+k]:[x,botY(x)-k];
function build(pal){
 const P=PAL[pal]||PAL.normal,cvs={},R={};
 cvs.govde=drawBody(P);R.govde={k:"body",p:[0,0],at:[0,0],s:1,g:[34,18]};
 // kuyruk: kök gövde sapının altında (x≈108), iki loblu çatal kuyruk
 {const n=26*6,B=[],E=spline([[72,CY-52],[-40,CY-120],[-190,CY-210],[-350,CY-262],[-330,CY-200],[-300,CY-150],[-250,CY-80],[-200,CY],[-250,CY+80],[-300,CY+150],[-330,CY+200],[-350,CY+262],[-190,CY+210],[-40,CY+120],[72,CY+52]],n);
  for(let i=0;i<=n;i++)B.push([112,CY-44+88*i/n]);const box=[-440,CY-300,580,600];cvs.kuyruk=drawFin(P,B,E,box,{mid:.4,wave:7});
  R.kuyruk={k:"tail",p:[112-box[0],CY-box[1]],at:[112,CY],s:1,g:[22,24]}}
 // sırt yüzgeci: kök sırt kenarını takip eder (26 px içeride); önde dik yükselir, üst kenar hafif kavisli, arkaya doğru alçalır
 {const xa=X0+.6*L,xb=X0+.24*L,n=20*6,B=[];for(let i=0;i<=n;i++){const x=xa+(xb-xa)*i/n;B.push(inset(x,1,26))}
  const E=spline([[xa-16,topY(xa)-150],[xa-70,topY(xa-60)-158],[xa-170,topY(xa-170)-138],[xa-270,topY(xa-270)-104],[xb+40,topY(xb+40)-62],[xb+6,topY(xb)-14]],n);
  const y0=Math.min(...E.map(p=>p[1]))-20,y1=Math.max(...B.map(p=>p[1]))+12,box=[xb-30,y0,xa-xb+60,y1-y0];cvs.sirt=drawFin(P,B,E,box,{wave:3,bow:.08});
  const ax=(xa+xb)/2;R.sirt={k:"top",p:[ax-box[0],topY(ax)+26-box[1]],at:[ax,topY(ax)+26],s:1,g:[24,12]}}
 // anal yüzgeç: küçük, yuvarlak, kuyruğa yakın
 {const xa=X0+.25*L,xb=X0+.13*L,n=10*6,B=[];for(let i=0;i<=n;i++){const x=xa+(xb-xa)*i/n;B.push(inset(x,0,22))}
  const E=spline([[xa-20,botY(xa)+92],[xa-60,botY(xa-55)+96],[xb+12,botY(xb+12)+46],[xb+2,botY(xb)+12]],n);
  const y1=Math.max(...E.map(p=>p[1]))+20,y0=Math.min(...B.map(p=>p[1]))-12,box=[xb-30,y0,xa-xb+60,y1-y0];cvs.karin=drawFin(P,B,E,box,{wave:3});
  const ax=(xa+xb)/2;R.karin={k:"anal",p:[ax-box[0],botY(ax)-22-box[1]],at:[ax,botY(ax)-22],s:1,g:[10,10]}}
 // karın (pelvik) yüzgeci: yuvarlak kürek
 {const xa=X0+.52*L,xb=X0+.44*L,n=12*6,B=[];for(let i=0;i<=n;i++){const x=xa+(xb-xa)*i/n;B.push(inset(x,0,20))}
  const E=spline([[xa-24,botY(xa)+84],[xa-62,botY(xa)+138],[xa-118,botY(xa)+150],[xb-36,botY(xb)+86],[xb+2,botY(xb)+14]],n);
  const y1=Math.max(...E.map(p=>p[1]))+20,y0=Math.min(...B.map(p=>p[1]))-12,x0=Math.min(...E.map(p=>p[0]))-20,box=[x0,y0,xa+20-x0,y1-y0];cvs.alt=drawFin(P,B,E,box,{wave:3});
  const ax=(xa+xb)/2;R.alt={k:"pelv",p:[ax-box[0],botY(ax)-20-box[1]],at:[ax,botY(ax)-20],s:1,g:[12,14]}}
 // göğüs (yan) yüzgeci: büyük, yuvarlak kürek; solungaç arkasında, gövdenin alt yarısında
 {const bx=X0+.765*L,by=midY(bx)+.42*(botY(bx)-midY(bx)),n=12*6,B=[];for(let i=0;i<=n;i++)B.push([bx-4*i/n,by-20+40*i/n]);
  const E=spline([[bx-30,by-22],[bx-110,by-4],[bx-178,by+42],[bx-196,by+100],[bx-150,by+132],[bx-84,by+104],[bx-30,by+40]],n);
  const box=[bx-240,by-50,260,200];cvs.yan=drawFin(P,B,E,box,{root:[bx-2,by,9,22,.1],al:.95,wave:3,bow:.06});
  R.yan={k:"pect",p:[bx-box[0],by-box[1]],at:[bx,by],s:1,g:[12,10]};R.yan2={k:"pect",src:"yan",p:[bx-box[0],by-box[1]],at:[bx+26,by-16],s:.9,g:[12,10],dim:.55,far:1}}
 // göz ve gözbebeği
 {const c=cv(140,140),g=c.getContext("2d"),I=hex(P.irisI),O=hex(P.irisO);g.fillStyle=rgba(mix(O,[0,0,0],.6));g.beginPath();g.arc(70,70,62,0,7);g.fill();
  const ir=g.createRadialGradient(70,70,10,70,70,58);ir.addColorStop(0,rgba(I));ir.addColorStop(.55,rgba(I));ir.addColorStop(.85,rgba(O));ir.addColorStop(1,rgba(mix(O,[0,0,0],.5)));g.fillStyle=ir;g.beginPath();g.arc(70,70,58,0,7);g.fill();
  for(let k=0;k<72;k++){const a=k/72*Math.PI*2;g.strokeStyle=k%2?rgba(mix(I,[255,255,255],.4),.25):rgba(mix(O,[0,0,0],.3),.25);g.lineWidth=1.4;g.beginPath();g.moveTo(70+Math.cos(a)*24,70+Math.sin(a)*24);g.lineTo(70+Math.cos(a)*56,70+Math.sin(a)*56);g.stroke()}
  const lid=g.createLinearGradient(0,8,0,70);lid.addColorStop(0,"rgba(0,0,0,.45)");lid.addColorStop(1,"rgba(0,0,0,0)");g.fillStyle=lid;g.beginPath();g.arc(70,70,58,0,7);g.fill();cvs.goz=c;
  const p=cv(80,80),q=p.getContext("2d"),pc=hex(P.pupil),pg=q.createRadialGradient(36,36,4,40,40,36);pg.addColorStop(0,rgba(mix(pc,[60,50,50],.4)));pg.addColorStop(1,rgba(pc));q.fillStyle=pg;q.beginPath();q.arc(40,40,36,0,7);q.fill();
  q.fillStyle="rgba(255,255,255,.95)";q.beginPath();q.ellipse(28,26,11,8,-.5,0,7);q.fill();q.fillStyle="rgba(255,255,255,.7)";q.beginPath();q.arc(54,54,4.5,0,7);q.fill();cvs.gozbebek=p;
  const EX=X0+.885*L,EY=midY(EX)-.12*(botY(EX)-topY(EX));R.goz={k:"eye",p:[70,70],at:[EX,EY],s:.66,g:[2,2]};R.gozbebek={k:"pupil",p:[40,40],at:[EX,EY],s:.68,g:[2,2]}}
 return{dir:"kod_"+pal,cv:cvs,head:X1,tip:-430,cy:CY,c:[(X1-430)/2,CY],R,O:["sirt","yan2","karin","alt","kuyruk","govde","yan","goz","gozbebek"]}}
window.KODBALIK={build,PAL:Object.keys(PAL)};
})();

// Kodla çizilen Koi (Kohaku-Sanke), gerçek koi fotoğraflarındaki özellikler esas alınarak.
// Gövde piksel piksel gölgelendirilir: her pul ışığı ayrı yakalayan hafif kubbeli bir plakadır, öndeki pul arkadakinin üstüne biner.
// Kırmızı lekelerin kuyruk tarafı kenarı pul pul keskindir (kiwa), baş tarafı pulların altından yumuşakça sızar (sashi).
// Bütün parçalar aynı gövde koordinatında çizilir: yüzgeç kökleri gövde kenarını izleyip altına girer, boşluk oluşmaz.
// Mutasyonlar yalnızca renk ayarıdır (PAL).
(function(){"use strict";
const SC=1.5;                       // doku çözünürlüğü (gövde birimi başına piksel)
const BW=1000,BH=480,CY=232,X0=60,X1=945,L=X1-X0;
const sm=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)};
const T=x=>(x-X0)/L;
function hT(t){if(t<=0)return 54;if(t<.6)return 54+150*Math.pow(sm(.02,.6,t),.75);const u=(t-.6)/.4;return 204*Math.pow(Math.max(0,1-Math.pow(u,2.6)),.42)}
function hB(t){if(t<=0)return 54;if(t<.5)return 54+126*Math.pow(sm(.02,.5,t),.85);const u=(t-.5)/.5;return 180*Math.pow(Math.max(0,1-Math.pow(u,2.3)),.45)}
const drop=t=>24*sm(.62,1,t);
const topY=x=>{const t=T(x);return CY-hT(t)+drop(t)};
const botY=x=>{const t=T(x);return CY+hB(t)+drop(t)};
const midY=x=>(topY(x)+botY(x))/2;
function hash(x,y,s){let h=(x*374761393+y*668265263+s*1442695041)|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296}
function vnoise(x,y,s){const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);
 const a=hash(xi,yi,s),b=hash(xi+1,yi,s),c=hash(xi,yi+1,s),d=hash(xi+1,yi+1,s);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v}
function fbm(x,y,s){let f=0,a=.5,q=1;for(let o=0;o<4;o++){f+=a*vnoise(x*q,y*q,s+o*17);q*=2.03;a*=.5}return f}
function rng(seed){let s=seed>>>0||1;return()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return(s>>>0)/4294967296}}
const hex=h=>{h=h.replace("#","");return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]};
const mix=(a,b,k)=>a.map((v,i)=>v+(b[i]-v)*k);
const rgba=(c,a)=>"rgba("+Math.round(c[0])+","+Math.round(c[1])+","+Math.round(c[2])+","+(a==null?1:a)+")";
function cv(w,h){const c=document.createElement("canvas");c.width=Math.ceil(w*SC);c.height=Math.ceil(h*SC);return c}
const PAL={
 normal:{base:"#f6f3ee",red:"#cf3416",red2:"#e8571f",black:"#141317",fin:"#f7f2ee",finTint:"#e9805a",finAl:.97,irisI:"#f0c167",irisO:"#9b5a22",pupil:"#060505",lip:"#f2c9bf",bodyAl:1,inv:0,gloss:1,rimC:"#7fb9e6"},
 albino:{base:"#fbf3f1",red:"#ef9aa6",red2:"#f7b7bf",black:null,fin:"#fbeef0",finTint:"#f3a6b4",finAl:.95,irisI:"#ff6b63",irisO:"#8e0f1b",pupil:"#3a0408",lip:"#f7c1c6",bodyAl:1,inv:0,gloss:1,rimC:"#c9b7e6"},
 melanistic:{base:"#1e1d25",red:"#2d2a3c",red2:"#3a3550",black:"#0a0a0e",white:"#e8e6f1",fin:"#3a3850",finTint:"#8e88c4",finAl:.95,irisI:"#efc14f",irisO:"#8f5e15",pupil:"#030303",lip:"#4a4458",bodyAl:1,inv:1,gloss:1.25,rimC:"#8aa6e6"},
 gold:{base:"#efc04a",red:"#c98516",red2:"#dc9c22",black:"#6e4a0e",fin:"#f7e3a1",finTint:"#e2a83a",finAl:.97,irisI:"#fbe08a",irisO:"#a2701a",pupil:"#0a0805",lip:"#f1cf86",bodyAl:1,inv:0,gloss:1.7,rimC:"#fff0b0",metal:1},
 transparent:{base:"#d4f0ea",red:"#9fd6c4",red2:"#b4e3d4",black:"#618f80",fin:"#e8fbf7",finTint:"#bfeee4",finAl:.55,irisI:"#d6f59a",irisO:"#4f8f34",pupil:"#0b1a10",lip:"#dff5ee",bodyAl:.6,inv:0,gloss:1.4,rimC:"#c8fff4"}
};
const RED=[[660,CY-92,130,78],[445,CY-100,120,84],[262,CY-66,84,58],[575,CY+4,74,44],[342,CY+18,62,36],[148,CY-30,40,30]];
const BLK=[[528,CY-122,46,34],[338,CY-84,36,28],[712,CY-132,26,20],[210,CY-44,22,18]];
function blobs(B,x,y,s){let f=0;for(const b of B){const dx=(x-b[0])/b[2],dy=(y-b[1])/b[3];f=Math.max(f,Math.exp(-(dx*dx+dy*dy)*1.5))}return f+.32*(fbm(x/46,y/46,s)-.5)}
function capF(x,y,s){const cx=X0+.9*L,cy=topY(cx)+58,dx=(x-cx)/108,dy=(y-cy)/70;return Math.exp(-(dx*dx+dy*dy)*1.3)+.25*(fbm(x/38,y/38,s)-.5)}
const XO=X0+.8*L;const gillX=v=>XO-78*(1-Math.min(1,v*v))*(1-.25*v);
function eyePos(){const EX=X0+.885*L;return[EX,midY(EX)-.13*(botY(EX)-topY(EX))]}
function drawBody(P){
 const c=cv(BW,BH),g=c.getContext("2d"),W=c.width,H=c.height,id=g.createImageData(W,H),d=id.data;
 const base=hex(P.base).map(v=>v/255),red=hex(P.red).map(v=>v/255),red2=hex(P.red2).map(v=>v/255),blk=P.black?hex(P.black).map(v=>v/255):null,wht=P.white?hex(P.white).map(v=>v/255):null,lip=hex(P.lip).map(v=>v/255),rimC=hex(P.rimC).map(v=>v/255);
 const NR=21,col=[];let acc=0;
 for(let px=W-1;px>=0;px--){const x=px/SC,t=T(x),tp=topY(x),bt=botY(x),h=Math.max(1,(bt-tp)/2),sp=Math.max(9,(2*h/NR)*.92);acc+=1/(sp*SC);col[px]={x,t,tp,bt,m:(tp+bt)/2,h,sp,a:acc}}
 const Lx=-.38,Ly=-.74,Lz=.56,ll=Math.hypot(Lx,Ly,Lz),lx=Lx/ll,ly=Ly/ll,lz=Lz/ll,hx=lx,hy=ly,hz=lz+1,hl=Math.hypot(hx,hy,hz);
 const [EX,EY]=eyePos(),MX=X1-3,MY=midY(X1-6)+.35*(botY(X1-6)-midY(X1-6));
 const scol=new Map();
 const scaleColor=(i,j,cx,cy)=>{const k=i*1000+j;let r=scol.get(k);if(r)return r;
  const fr=blobs(RED,cx,cy,3),fb=blk?blobs(BLK,cx,cy,9):0,n=hash(i,j,5);
  let cR=sm(.47,.53,fr),cB=blk?sm(.5,.56,fb):0,cc;
  if(P.inv){const w=Math.max(sm(.5,.56,fb),sm(.6,.66,fr));cc=mix(mix(base,blk,.3+.4*n),wht,w)}
  else{cc=mix(base,mix(red,red2,n*.6),cR);if(blk)cc=mix(cc,blk,cB)}
  r={c:cc,red:cR,n};scol.set(k,r);return r};
 for(let py=0;py<H;py++){const y=py/SC;
  for(let px=0;px<W;px++){const C=col[px];if(y<C.tp-1||y>C.bt+1)continue;const x=C.x,t=C.t;
   let al=Math.max(0,Math.min(1,Math.min(y-C.tp,C.bt-y)*SC+.5))*sm(X0,X0+40,x)*P.bodyAl;if(al<=0)continue;
   const v=Math.max(-1,Math.min(1,(y-C.m)/C.h)),nz0=Math.sqrt(Math.max(.04,1-v*v));
   let nx=.95*Math.pow(sm(.76,1,t),1.3)*nz0,ny=v*.97,nz=nz0,clr=null,edge=0;
   const hd=sm(-5,6,x-gillX(v));
   if(hd<1){const a=C.a,b=(v+1)/2*NR,ia=Math.floor(a);let best=null;
    for(let i=ia-1;i<=ia+1;i++){const bb=b-.5*(i&1),j0=Math.round(bb);
     for(let j=j0-1;j<=j0+1;j++){const da=(a-(i+.42))*C.sp,db=(bb-j)*(2*C.h/NR),dd=Math.hypot(da,db)/(C.sp*.78);
      if(dd<1&&(!best||i<best.i))best={i,j,da,db,dd}}}
    if(!best)best={i:ia,j:Math.round(b),da:0,db:0,dd:.5};
    const sc=scaleColor(best.i,best.j,x-best.da,y-best.db),dd=best.dd,dl=Math.hypot(best.da,best.db)||1,ux=best.da/dl,uy=best.db/dl;
    const bump=.16*dd*dd;nx-=ux*bump;ny+=uy*bump;
    edge=sm(.84,1,dd)*(.45+.55*Math.max(0,ux));
    clr=sc.c;
    if(!P.inv){const fr=blobs(RED,x,y,3),soft=sm(.44,.52,fr)*(1-sc.red)*.18*(1-dd);clr=mix(clr,red,soft)}}
   if(hd>0){let hc=P.inv?mix(base,[0,0,0],.05):base.slice();const cf=capF(x,y,4);hc=mix(hc,P.inv?wht:mix(red,red2,.3),sm(.49,.53,cf));
    const sk=fbm(x/9,y/9,11);hc=hc.map(q=>q*(.97+.06*sk));
    const dg=x-gillX(v);if(dg>0&&dg<26){nx-=.35*(1-dg/26)*nz0}
    const md=Math.hypot((x-MX)/34,(y-MY)/22);if(md<1){hc=mix(hc,lip,.75*(1-md));nx+=.25*(1-md);ny+=.15*(1-md)}
    const ed=Math.hypot(x-EX,y-EY);if(ed<58&&ed>34){const q=(ed-34)/24;ny+=.14*(1-q)*((y-EY)/ed);nx+=.14*(1-q)*((x-EX)/ed);hc=hc.map(z=>z*(.9+.1*q))}
    clr=clr?mix(clr,hc,hd):hc;edge*=1-hd;
    const gl=Math.abs(x-gillX(v));if(gl<3&&Math.abs(v)<.82)edge=Math.max(edge,.6*(1-gl/3))}
   const nl=Math.hypot(nx,ny,nz);nx/=nl;ny/=nl;nz/=nl;
   const dif=Math.max(0,nx*lx+ny*ly+nz*lz),hd2=Math.max(0,(nx*hx+ny*hy+nz*hz)/hl);
   const g1=P.gloss*(.32*Math.pow(hd2,40)+.14*Math.pow(hd2,7))*(1-.6*edge),rim=Math.pow(1-nz,2.6)*.32;
   let r_=clr[0],g_=clr[1],b_=clr[2];const sh=.4+.72*dif;r_*=sh;g_*=sh;b_*=sh;
   if(P.metal){const m=.25*Math.pow(hd2,4);r_+=m;g_+=m*.85;b_+=m*.4}
   const lum=(clr[0]+clr[1]+clr[2])/3,ec=1-edge*(lum>.8?.12:.32);r_*=ec;g_*=ec;b_*=ec*1.02;
   r_+=g1+rim*rimC[0]*.6;g_+=g1+rim*rimC[1]*.6;b_+=g1+rim*rimC[2]*.6;
   const bl=sm(.55,1,v)*.08;r_-=bl*.4;b_+=bl*.3;
   const i4=(py*W+px)*4;d[i4]=Math.max(0,Math.min(255,r_*255));d[i4+1]=Math.max(0,Math.min(255,g_*255));d[i4+2]=Math.max(0,Math.min(255,b_*255));d[i4+3]=al*255}}
 g.putImageData(id,0,0);g.scale(SC,SC);
 const nsx=X1-40,nsy=midY(X1-40)-26,nf=g.createRadialGradient(nsx,nsy,0,nsx,nsy,7);nf.addColorStop(0,rgba(mix(hex(P.base),[30,10,5],.75),.85));nf.addColorStop(1,rgba(mix(hex(P.base),[30,10,5],.75),0));g.fillStyle=nf;g.beginPath();g.ellipse(nsx,nsy,7,5,-.4,0,7);g.fill();
 g.strokeStyle=rgba(mix(hex(P.lip),[80,25,15],.6),.8);g.lineWidth=2.2;g.lineCap="round";g.beginPath();g.moveTo(MX-22,MY+6);g.quadraticCurveTo(MX-10,MY+10,MX-1,MY+2);g.stroke();
 const barbel=(x0,y0,cx,cy,x1,y1,w,dim)=>{const pts=[];for(let k=0;k<=16;k++){const t=k/16;pts.push([(1-t)*(1-t)*x0+2*(1-t)*t*cx+t*t*x1,(1-t)*(1-t)*y0+2*(1-t)*t*cy+t*t*y1])}
  const lc=mix(hex(P.lip),[255,255,255],.2).map(q=>q*dim),dc=mix(hex(P.lip),[60,20,15],.5).map(q=>q*dim);
  for(let k=0;k<16;k++){const a=pts[k],b=pts[k+1],ww=w*(1-k/16*.85);g.strokeStyle=rgba(dc,.9);g.lineWidth=ww;g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke();
   g.strokeStyle=rgba(lc,.95);g.lineWidth=ww*.55;g.beginPath();g.moveTo(a[0]-ww*.15,a[1]-ww*.15);g.lineTo(b[0]-ww*.15,b[1]-ww*.15);g.stroke()}};
 barbel(MX-8,MY+6,MX+10,MY+40,MX+2,MY+84,7,.85);barbel(MX-18,MY+8,MX-12,MY+38,MX-30,MY+66,5.5,.7);barbel(MX-2,MY+2,MX+22,MY+18,MX+30,MY+50,5,1);
 return c}
function spline(P,n){const S=[];for(let i=0;i<P.length-1;i++){const p0=P[Math.max(0,i-1)],p1=P[i],p2=P[i+1],p3=P[Math.min(P.length-1,i+2)];
  for(let k=0;k<24;k++){const t=k/24,t2=t*t,t3=t2*t;S.push([.5*((2*p1[0])+(-p0[0]+p2[0])*t+(2*p0[0]-5*p1[0]+4*p2[0]-p3[0])*t2+(-p0[0]+3*p1[0]-3*p2[0]+p3[0])*t3),.5*((2*p1[1])+(-p0[1]+p2[1])*t+(2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*t2+(-p0[1]+3*p1[1]-3*p2[1]+p3[1])*t3)])}}
 S.push(P[P.length-1]);const len=[0];for(let i=1;i<S.length;i++)len.push(len[i-1]+Math.hypot(S[i][0]-S[i-1][0],S[i][1]-S[i-1][1]));
 const out=[];let j=0;for(let k=0;k<=n;k++){const L=len[len.length-1]*k/n;while(j<len.length-2&&len[j+1]<L)j++;const a=(L-len[j])/Math.max(1e-6,len[j+1]-len[j]);out.push([S[j][0]+(S[j+1][0]-S[j][0])*a,S[j][1]+(S[j+1][1]-S[j][1])*a])}return out}
function drawFin(P,B,E0,box,o){
 const K=o.K||4,c=cv(box[2],box[3]),g=c.getContext("2d"),F=hex(P.fin),Tn=hex(P.finTint),al=P.finAl*(o.al||1),n=B.length-1,R=rng(o.seed||3);g.scale(SC,SC);g.translate(-box[0],-box[1]);
 const E=E0.map((p,i)=>{if(!i||i===n)return p;const ph=(i%K)/K,w=(o.wave||5)*Math.pow(Math.sin(Math.PI*ph),1.4);const bx=B[i][0]-p[0],by=B[i][1]-p[1],bl=Math.hypot(bx,by)||1;return[p[0]+bx/bl*w,p[1]+by/bl*w]});
 const ray=i=>{const b=B[i],e=E[i],bw=(o.bow||.05)*(1+.4*Math.sin(i/K*1.1));return[b,e,(b[0]+e[0])/2+(e[1]-b[1])*bw,(b[1]+e[1])/2-(e[0]-b[0])*bw]};
 const qp=(r,t)=>[(1-t)*(1-t)*r[0][0]+2*(1-t)*t*r[2]+t*t*r[1][0],(1-t)*(1-t)*r[0][1]+2*(1-t)*t*r[3]+t*t*r[1][1]];
 const streak=[];for(let i=0;i<=n;i+=K)streak[i/K]=R()<(o.streaks||.22)?.4+.6*R():0;
 for(let i=0;i<n;i++){const ri=Math.floor(i/K),ph=(i%K+.5)/K,thin=.62+.38*Math.pow(Math.cos(Math.PI*(ph-.5)),2),st=Math.max(streak[ri]||0,streak[ri+1]||0)*(1-Math.abs(ph-.5)*1.6);
  const r0=ray(i),r1=ray(i+1),gr=g.createLinearGradient(B[i][0],B[i][1],E[i][0],E[i][1]);
  const rootC=mix(F,Tn,.35+.5*st),midC=mix(F,Tn,.6*st),tipC=mix(F,[255,255,255],.25);
  gr.addColorStop(0,rgba(rootC,al*.98));gr.addColorStop(.18,rgba(mix(rootC,midC,.5),al*.9*thin));gr.addColorStop(.6,rgba(midC,al*.8*thin));gr.addColorStop(.92,rgba(tipC,al*.66*thin));gr.addColorStop(1,rgba(tipC,al*.4));
  g.fillStyle=gr;g.beginPath();g.moveTo(r0[0][0],r0[0][1]);for(let t=1;t<=10;t++){const q=qp(r0,t/10);g.lineTo(q[0],q[1])}for(let t=10;t>=0;t--){const q=qp(r1,t/10);g.lineTo(q[0],q[1])}g.closePath();g.fill()}
 g.lineCap="round";for(let i=0;i<=n;i+=K){const r=ray(i),len=Math.hypot(r[1][0]-r[0][0],r[1][1]-r[0][1]),seg=Math.max(8,Math.round(len/7));
  for(let k=0;k<seg;k++){const t0=k/seg,t1=(k+1)/seg,p0=qp(r,t0),p1=qp(r,t1);if(t0>.72)break;
   g.strokeStyle=rgba(mix(F,[110,95,95],.45),.6*al*(1-t0*.55));g.lineWidth=2.6*(1-t0*.7);g.beginPath();g.moveTo(p0[0],p0[1]);g.lineTo(p1[0],p1[1]);g.stroke();
   g.strokeStyle=rgba([255,255,255],.55*al*(1-t0));g.lineWidth=1.1*(1-t0*.6);g.beginPath();g.moveTo(p0[0]-.6,p0[1]-.6);g.lineTo(p1[0]-.6,p1[1]-.6);g.stroke();
   if(k%2===1){g.fillStyle=rgba([255,255,255],.45*al*(1-t0));g.beginPath();g.arc(p1[0],p1[1],1.1*(1-t0*.5),0,7);g.fill()}}
  const m=qp(r,.72);for(const s of[-1,1]){const j=Math.max(0,Math.min(n,i+s*Math.floor(K*.4))),e=E[j];g.strokeStyle=rgba(mix(F,[120,110,110],.3),.3*al);g.lineWidth=.9;g.beginPath();g.moveTo(m[0],m[1]);g.lineTo(e[0],e[1]);g.stroke()}}
 for(const [w,a] of[[3,.12],[1.4,.22]]){g.strokeStyle=rgba(mix(F,[255,255,255],.4),a*al);g.lineWidth=w;g.beginPath();E.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.stroke()}
 if(o.root){const r=o.root,rg=g.createRadialGradient(r[0],r[1],1,r[0],r[1],r[2]);rg.addColorStop(0,rgba(mix(F,[90,60,50],.45),.8));rg.addColorStop(1,rgba(mix(F,[90,60,50],.45),0));g.fillStyle=rg;g.beginPath();g.ellipse(r[0],r[1],r[2],r[3],r[4]||0,0,7);g.fill()}
 return c}
const inset=(x,top,k)=>top?[x,topY(x)+k]:[x,botY(x)-k];
function rig(o){o.p=[o.p[0]*SC,o.p[1]*SC];o.s=(o.s||1)/SC;return o}
function build(pal){
 const P=PAL[pal]||PAL.normal,cvs={},R={};
 cvs.govde=drawBody(P);R.govde={k:"body",p:[0,0],at:[0,0],s:1/SC,g:[36,20]};
 {const n=34*4,B=[],E=spline([[74,CY-54],[-30,CY-110],[-150,CY-188],[-280,CY-246],[-352,CY-250],[-344,CY-196],[-300,CY-128],[-246,CY-58],[-214,CY],[-246,CY+58],[-300,CY+128],[-344,CY+196],[-352,CY+250],[-280,CY+246],[-150,CY+188],[-30,CY+110],[74,CY+54]],n);
  for(let i=0;i<=n;i++)B.push([114,CY-46+92*i/n]);const box=[-380,CY-275,520,550];cvs.kuyruk=drawFin(P,B,E,box,{wave:6,bow:.04,seed:11,streaks:.18});
  R.kuyruk=rig({k:"tail",p:[114-box[0],CY-box[1]],at:[114,CY],g:[22,24]})}
 {const xa=X0+.6*L,xb=X0+.25*L,n=18*4,B=[];for(let i=0;i<=n;i++){const x=xa+(xb-xa)*i/n;B.push(inset(x,1,24))}
  const E=spline([[xa-10,topY(xa)-140],[xa-56,topY(xa-56)-150],[xa-150,topY(xa-150)-128],[xa-250,topY(xa-250)-98],[xb+46,topY(xb+46)-60],[xb+4,topY(xb)-12]],n);
  const y0=Math.min(...E.map(p=>p[1]))-16,y1=Math.max(...B.map(p=>p[1]))+12,box=[xb-30,y0,xa-xb+60,y1-y0];cvs.sirt=drawFin(P,B,E,box,{wave:4,bow:.06,seed:21});
  const ax=(xa+xb)/2;R.sirt=rig({k:"top",p:[ax-box[0],topY(ax)+24-box[1]],at:[ax,topY(ax)+24],g:[24,12]})}
 {const xa=X0+.26*L,xb=X0+.14*L,n=9*4,B=[];for(let i=0;i<=n;i++){const x=xa+(xb-xa)*i/n;B.push(inset(x,0,20))}
  const E=spline([[xa-16,botY(xa)+86],[xa-56,botY(xa-50)+94],[xb+16,botY(xb+16)+48],[xb+2,botY(xb)+10]],n);
  const y1=Math.max(...E.map(p=>p[1]))+16,y0=Math.min(...B.map(p=>p[1]))-12,box=[xb-30,y0,xa-xb+60,y1-y0];cvs.karin=drawFin(P,B,E,box,{wave:4,seed:31});
  const ax=(xa+xb)/2;R.karin=rig({k:"anal",p:[ax-box[0],botY(ax)-20-box[1]],at:[ax,botY(ax)-20],g:[10,10]})}
 {const xa=X0+.53*L,xb=X0+.45*L,n=12*4,B=[];for(let i=0;i<=n;i++){const x=xa+(xb-xa)*i/n;B.push(inset(x,0,18))}
  const E=spline([[xa-20,botY(xa)+78],[xa-58,botY(xa)+130],[xa-112,botY(xa)+146],[xb-38,botY(xb)+90],[xb+2,botY(xb)+14]],n);
  const y1=Math.max(...E.map(p=>p[1]))+16,y0=Math.min(...B.map(p=>p[1]))-12,x0=Math.min(...E.map(p=>p[0]))-20,box=[x0,y0,xa+20-x0,y1-y0];cvs.alt=drawFin(P,B,E,box,{wave:4,seed:41});
  const ax=(xa+xb)/2;R.alt=rig({k:"pelv",p:[ax-box[0],botY(ax)-18-box[1]],at:[ax,botY(ax)-18],g:[12,14]})}
 {const bx=X0+.765*L,by=midY(bx)+.45*(botY(bx)-midY(bx)),n=14*4,B=[];for(let i=0;i<=n;i++)B.push([bx-5*i/n,by-22+44*i/n]);
  const E=spline([[bx-26,by-24],[bx-112,by-6],[bx-188,by+46],[bx-206,by+112],[bx-160,by+150],[bx-88,by+122],[bx-28,by+44]],n);
  const box=[bx-236,by-48,256,220];cvs.yan=drawFin(P,B,E,box,{root:[bx-2,by,12,24,.1],al:.95,wave:4,bow:.05,seed:51});
  R.yan=rig({k:"pect",p:[bx-box[0],by-box[1]],at:[bx,by],g:[12,10]});R.yan2=rig({k:"pect",src:"yan",p:[bx-box[0],by-box[1]],at:[bx+26,by-16],s:.9,g:[12,10],dim:.6,far:1})}
 {const[EX,EY]=eyePos(),c=cv(140,140),g=c.getContext("2d"),I=hex(P.irisI),O=hex(P.irisO);g.scale(SC,SC);
  g.fillStyle=rgba(mix(O,[0,0,0],.65));g.beginPath();g.arc(70,70,62,0,7);g.fill();
  const ir=g.createRadialGradient(70,72,8,70,70,58);ir.addColorStop(0,rgba(mix(I,[255,255,255],.15)));ir.addColorStop(.5,rgba(I));ir.addColorStop(.82,rgba(O));ir.addColorStop(1,rgba(mix(O,[0,0,0],.55)));g.fillStyle=ir;g.beginPath();g.arc(70,70,58,0,7);g.fill();
  const Rr=rng(77);for(let k=0;k<160;k++){const a=Rr()*Math.PI*2,r0=22+Rr()*8,r1=40+Rr()*16;g.strokeStyle=Rr()<.5?rgba(mix(I,[255,255,255],.45),.22):rgba(mix(O,[0,0,0],.4),.22);g.lineWidth=.8+Rr()*1.2;g.beginPath();g.moveTo(70+Math.cos(a)*r0,70+Math.sin(a)*r0);g.lineTo(70+Math.cos(a)*r1,70+Math.sin(a)*r1);g.stroke()}
  const lid=g.createLinearGradient(0,10,0,74);lid.addColorStop(0,"rgba(0,0,0,.55)");lid.addColorStop(1,"rgba(0,0,0,0)");g.fillStyle=lid;g.beginPath();g.arc(70,70,58,0,7);g.fill();
  const rimg=g.createRadialGradient(70,70,50,70,70,62);rimg.addColorStop(0,"rgba(0,0,0,0)");rimg.addColorStop(1,"rgba(0,0,0,.5)");g.fillStyle=rimg;g.beginPath();g.arc(70,70,62,0,7);g.fill();cvs.goz=c;
  const p=cv(80,80),q=p.getContext("2d"),pc=hex(P.pupil);q.scale(SC,SC);const pg=q.createRadialGradient(36,34,3,40,40,36);pg.addColorStop(0,rgba(mix(pc,[70,60,60],.35)));pg.addColorStop(1,rgba(pc));q.fillStyle=pg;q.beginPath();q.arc(40,40,36,0,7);q.fill();
  q.fillStyle="rgba(255,255,255,.95)";q.beginPath();q.ellipse(27,24,10,7,-.55,0,7);q.fill();q.fillStyle="rgba(255,255,255,.55)";q.beginPath();q.ellipse(52,53,5,3.5,-.5,0,7);q.fill();cvs.gozbebek=p;
  R.goz=rig({k:"eye",p:[70,70],at:[EX,EY],s:.6,g:[2,2]});R.gozbebek=rig({k:"pupil",p:[40,40],at:[EX,EY],s:.58,g:[2,2]})}
 return{dir:"kod_"+pal,cv:cvs,head:X1,tip:-352,cy:CY,c:[(X1-352)/2,CY],R,O:["sirt","yan2","karin","alt","kuyruk","govde","yan","goz","gozbebek"]}}
window.KODBALIK={build,PAL:Object.keys(PAL)};
})();

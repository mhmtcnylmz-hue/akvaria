// Akvaria görüntü motoru (sürüm 171) — dış kütüphane yok, doğrudan WebGL.
// Oyunun mantığına, ekonomisine ve kayıtlarına dokunmaz: oyun her karede balığın verisini verir, motor sadece çizer.
// Parçalar: RendererManager (WebGL yardımcıları) · FishRenderer (balık ağı, GPU'da tek parça) · FishAnimationController
// (yüzgeç, solungaç, ağız, tepki) · EnvironmentRenderer (ışık hüzmeleri, su parçacıkları, kabarcıklar) · PerformanceManager.
(function(){"use strict";
var VE=window.AkvVE={ok:false,err:null};

// ---------- tür ayarları (motoru değiştirmeden düzenlenebilir) ----------
// Hareket değerleri oyunun mevcut değerleriyle başlar; değiştirilirse sadece bu tür için uygulanır.
// pectoral*: göğüs yüzgeci (radyan, çarpan) · dorsal*: sırt/anal yüzgeç dalgası · gill*: solungaç · mouth*: ağız
VE.SPECIES={
 clown:{cruiseSpeed:null,acceleration:null,hoverChance:null,tailFrequency:null,tailAmplitude:null,
  pectoralAmp:.42,pelvicAmp:.2,dorsalAmp:.010,dorsalFreq:1.6,finLift:.028,gillFreq:.75,gillAmp:.012,gillX:.75,mouthAmp:.006,reactTime:.7}
};
// sürüm 176: motor bütün türlere açık. DEFAULT her türe uygulanır; VE.SPECIES[tür] sadece farklı olan değerleri içerir. VE.OFF listesindeki türler eski çizimde kalır.
VE.DEFAULT={pectoralAmp:.42,pelvicAmp:.2,dorsalAmp:.010,dorsalFreq:1.6,finLift:.028,gillFreq:.75,gillAmp:.012,gillX:.75,mouthAmp:.006,reactTime:.7};
VE.SPECIES.oar={dorsalAmp:.018,dorsalFreq:1.1,pectoralAmp:.25,gillAmp:.006};VE.SPECIES.eel={dorsalAmp:.014,pectoralAmp:.3};VE.SPECIES.lion={pectoralAmp:.3,finLift:.02};
VE.SPECIES.betta={dorsalAmp:.016,dorsalFreq:1.2,finLift:.04};VE.SPECIES.angel={dorsalAmp:.012,dorsalFreq:1.2};VE.SPECIES.boxfish={pectoralAmp:.55};VE.SPECIES.angler={gillAmp:.016,mouthAmp:.01};
VE.OFF=[];VE.ENABLED=null;
var CC={};function conf(t){var c=CC[t];if(!c){c=CC[t]={};var k;for(k in VE.DEFAULT)c[k]=VE.DEFAULT[k];var o=VE.SPECIES[t]||{};for(k in o)if(o[k]!=null)c[k]=o[k]}return c}
VE.handles=function(type){return VE.ok&&VE.fishOn&&VE.OFF.indexOf(type)<0};
// kare bütçesi: bir karede motorla çizim bu süreyi aşarsa kalan balıklar o kare eski yolla çizilir
var FB={t:0,ms:0};VE.frameStart=function(){FB.ms=0};VE.budget=function(){return VE.Q>=3?9:VE.Q===2?6:3};

// ---------- RendererManager: küçük WebGL yardımcıları ----------
function mkGL(cv){var o={alpha:true,premultipliedAlpha:true,preserveDrawingBuffer:true,antialias:false,depth:false,stencil:false};
 var gl=cv.getContext("webgl",o)||cv.getContext("experimental-webgl",o);if(!gl)throw new Error("WebGL yok");gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);return gl}
function sh(gl,type,src){var s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s}
function prog(gl,vs,fs){var p=gl.createProgram();gl.attachShader(p,sh(gl,gl.VERTEX_SHADER,vs));gl.attachShader(p,sh(gl,gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));return p}
function tex(gl){var t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);return t}

// ---------- FishRenderer ----------
var FR={cv:null,gl:null,p:null,bP:null,bU:null,bI:null,uM:null,aP:0,aU:0,tc:new WeakMap(),grid:"",nI:0,P:null,U:null,cw:0,ch:0,lost:false};
function frInit(){var cv=document.createElement("canvas");cv.width=cv.height=256;var gl=mkGL(cv);
 FR.cv=cv;FR.gl=gl;cv.addEventListener("webglcontextlost",function(e){e.preventDefault();FR.lost=true;VE.fishOn=false},false);
 FR.p=prog(gl,"attribute vec2 p;attribute vec2 u;uniform vec4 m;varying vec2 v;void main(){v=u;gl_Position=vec4(p.x*m.x+m.z,p.y*m.y+m.w,0.,1.);}",
  "precision mediump float;varying vec2 v;uniform sampler2D t;void main(){gl_FragColor=texture2D(t,v);}");
 FR.aP=gl.getAttribLocation(FR.p,"p");FR.aU=gl.getAttribLocation(FR.p,"u");FR.uM=gl.getUniformLocation(FR.p,"m");FR.bP=gl.createBuffer();FR.bU=gl.createBuffer();FR.bI=gl.createBuffer()}
// kaynağı (resim ya da tuval) dokuya yükler; tuvaller değişebildiği için en çok saniyede 20 kez yeniden yüklenir
function frTex(src,now){var gl=FR.gl,e=FR.tc.get(src),w=src.naturalWidth||src.width,h=src.naturalHeight||src.height;
 if(!e){e={t:tex(gl),at:-1e9,w:0,h:0};FR.tc.set(src,e)}var dyn=!(src instanceof HTMLImageElement);
 gl.bindTexture(gl.TEXTURE_2D,e.t);if(e.w!==w||e.h!==h||(dyn&&now-e.at>50)){gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,src);e.at=now;e.w=w;e.h=h}return e.t}
function frGrid(NX,NY){var k=NX+"x"+NY;if(FR.grid===k)return;FR.grid=k;var gl=FR.gl,n=(NX+1)*(NY+1),U=new Float32Array(n*2),I=new Uint16Array(NX*NY*6),q=0;
 for(var i=0;i<=NX;i++)for(var j=0;j<=NY;j++){var a=(i*(NY+1)+j)*2;U[a]=i/NX;U[a+1]=j/NY}
 for(i=0;i<NX;i++)for(j=0;j<NY;j++){var a0=i*(NY+1)+j,a1=(i+1)*(NY+1)+j;I[q++]=a0;I[q++]=a1;I[q++]=a0+1;I[q++]=a1;I[q++]=a1+1;I[q++]=a0+1}
 gl.bindBuffer(gl.ARRAY_BUFFER,FR.bU);gl.bufferData(gl.ARRAY_BUFFER,U,gl.STATIC_DRAW);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,FR.bI);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,I,gl.STATIC_DRAW);FR.nI=q;FR.P=new Float32Array(n*2)}

// ---------- FishAnimationController: oyunun yüzme ağına yüzgeç, solungaç, ağız ve tepki hareketleri ekler ----------
var REACT=new WeakMap();
VE.react=function(f){REACT.set(f,performance.now())};
function animate(o,P){var C=conf(o.type),NX=o.NX,NY=o.NY,I=o.I,ww=o.ww,h=o.h,bw=I.bx1-I.bx0,bh=I.by1-I.by0,t=o.t,pa=o.pa,pp=o.pp,Q=VE.Q;
 var r0=REACT.get(o.f),rk=0;if(r0){var u0=(performance.now()-r0)/1000/(C.reactTime||.7);if(u0<1)rk=Math.sin(Math.PI*Math.min(1,u0*1.6))*(1-u0*.4);else REACT.delete(o.f)}
 var pc=o.pc,pv=o.pv,turn=Math.min(1,o.turn||0),lift=(C.finLift||0)*ww*(.35*turn+rk),dA=(C.dorsalAmp||0)*ww*(Q>0?1:.5),dF=6.2832*(C.dorsalFreq||1.5),
  br=Math.sin(t*6.2832*(C.gillFreq||.8)+(o.ph||0)),gO=Math.max(0,br),gA=(C.gillAmp||0)*h*gO,mA=(C.mouthAmp||0)*ww*(.5+.5*Math.sin(t*6.2832*(C.gillFreq||.8)+(o.ph||0)+2.4)),
  aPc=(C.pectoralAmp||0)*(.55+.9*pa)*Math.sin(pp)+rk*.35,aPv=(C.pelvicAmp||0)*(.6+.6*pa)*Math.sin(pp*.8+1.3)+rk*.15,MO=o.mouth||[.99,.55],gx=C.gillX||.75,cP=Math.cos(aPc),sP=Math.sin(aPc),cV=Math.cos(aPv),sV=Math.sin(aPv);
 for(var i=0;i<=NX;i++){var u=i/NX,ub=(u-I.bx0)/bw,k=Math.max(0,Math.min(64,Math.round(ub*64))),T=I.T[k],B=I.B[k],M=Math.max(.02,B-T),wgx=Math.exp(-Math.pow((ub-gx)/.045,2)),wmx=Math.exp(-Math.pow((u-MO[0])/.07,2));
  for(var j=0;j<=NY;j++){var a=(i*(NY+1)+j)*2,v=j/NY,vb=(v-I.by0)/bh,dx=0,dy=0,w,x0,y0;
   // göğüs ve karın yüzgeci: kendi kökü etrafında döner
   if(pc&&Q>0){w=Math.exp(-(Math.pow((ub-pc[2])/pc[4],2)+Math.pow((vb-pc[3])/pc[5],2))*1.1);if(w>.02){x0=(ub-pc[0])*bw*ww;y0=(vb-pc[1])*bh*h;var c=1+(cP-1)*w,s=sP*w;dx+=x0*c-y0*s-x0;dy+=x0*s+y0*c-y0}}
   if(pv&&Q>0){w=Math.exp(-(Math.pow((ub-pv[2])/pv[4],2)+Math.pow((vb-pv[3])/pv[5],2))*1.1);if(w>.02){x0=(ub-pv[0])*bw*ww;y0=(vb-pv[1])*bh*h;var c2=1+(cV-1)*w,s2=sV*w;dx+=x0*c2-y0*s2-x0;dy+=x0*s2+y0*c2-y0}}
   // sırt ve anal yüzgeç: kenarda hafif dalga, dönüşte ve ürkünce kalkar
   var wd=v<T+.3*M?Math.max(0,Math.min(1,1-(v-T)/(.3*M))):0,wa=v>B-.24*M?Math.max(0,Math.min(1,1-(B-v)/(.24*M))):0;
   if(wd>0){dx+=dA*wd*Math.sin(t*dF-ub*9);dy-=lift*wd*wd}if(wa>0){dx+=dA*.8*wa*Math.sin(t*dF*1.1-ub*9+1);dy+=lift*.7*wa*wa}
   // solungaç kapağı nefes alır, ağız hafifçe açılıp kapanır
   if(wgx>.03){var wv=Math.exp(-Math.pow((vb-.5)/.3,2));dy+=(vb-.5)*gA*wgx*wv*2}
   if(wmx>.03&&v>MO[1]){dy+=mA*wmx*Math.exp(-Math.pow((v-MO[1])/.12,2))}
   P[a]=o.X[a]+dx;P[a+1]=o.X[a+1]+dy}}}

// o: {f,type,src,NX,NY,X(konumlar, yerel birim),I,ww,h,t,pa,pp,pc,pv,mouth,turn,ph}; ctx dönüşümü balığın yerel uzayında
VE.drawFish=function(ctx,o){if(!VE.fishOn||FR.lost||FB.ms>VE.budget())return false;var r=fdraw(ctx,o),ms=performance.now()-PM.t0;FB.ms+=ms;PM.fe+=(ms-PM.fe)*.05;if(PM.fe>6){if(++PM.fslow>90){VE.fishOn=false;VE.autoOff=true}}else PM.fslow=0;return r};
function fdraw(ctx,o){var gl=FR.gl,now=PM.t0=performance.now();frGrid(o.NX,o.NY);var P=FR.P;animate(o,P);
 var n=(o.NX+1)*(o.NY+1),x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(var i=0;i<n*2;i+=2){var x=P[i],y=P[i+1];if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
 x0-=2;y0-=2;x1+=2;y1+=2;var m=ctx.getTransform(),sx=Math.max(.2,Math.hypot(m.a,m.b)),sy=Math.max(.2,Math.hypot(m.c,m.d)),pw=Math.min(1024,Math.ceil((x1-x0)*sx)),ph=Math.min(1024,Math.ceil((y1-y0)*sy));if(pw<4||ph<4)return true;
 var cw=Math.max(64,Math.ceil(pw/64)*64),ch=Math.max(64,Math.ceil(ph/64)*64);if(cw>FR.cv.width||ch>FR.cv.height||cw<FR.cv.width/2||ch<FR.cv.height/2){FR.cv.width=Math.max(cw,64);FR.cv.height=Math.max(ch,64)}
 var W=FR.cv.width,H=FR.cv.height;gl.viewport(0,0,W,H);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(FR.p);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
 var kx=pw/(x1-x0),ky=ph/(y1-y0);gl.uniform4f(FR.uM,2*kx/W,-2*ky/H,-1-2*kx*x0/W,1+2*ky*y0/H);
 gl.activeTexture(gl.TEXTURE0);frTex(o.src,now);
 gl.bindBuffer(gl.ARRAY_BUFFER,FR.bP);gl.bufferData(gl.ARRAY_BUFFER,P,gl.DYNAMIC_DRAW);gl.enableVertexAttribArray(FR.aP);gl.vertexAttribPointer(FR.aP,2,gl.FLOAT,false,0,0);
 gl.bindBuffer(gl.ARRAY_BUFFER,FR.bU);gl.enableVertexAttribArray(FR.aU);gl.vertexAttribPointer(FR.aU,2,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,FR.bI);gl.drawElements(gl.TRIANGLES,FR.nI,gl.UNSIGNED_SHORT,0);
 ctx.drawImage(FR.cv,0,0,pw,ph,x0,y0,x1-x0,y1-y0);VE.stat.fish++;return true}

// ---------- EnvironmentRenderer: ışık, su parçacıkları ve kabarcıklar (oyun tuvalinin üstünde, dokunmaları geçirir) ----------
var EN={cv:null,gl:null,p:null,b:null,aP:0,aU:0,aC:0,uM:null,t:null,D:null,n:0,motes:[],bub:[],emit:[],rays:[],W:0,H:0,on:false};
var MAXQ=400;
function atlas(){var c=document.createElement("canvas");c.width=c.height=256;var x=c.getContext("2d"),g;
 // 0: yumuşak nokta (0,0)-(64,64)
 g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,"rgba(255,255,255,1)");g.addColorStop(.35,"rgba(255,255,255,.55)");g.addColorStop(1,"rgba(255,255,255,0)");x.fillStyle=g;x.fillRect(0,0,64,64);
 // 1: kabarcık (64,0)-(128,64): ince halka, üstte parlak nokta
 x.save();x.translate(96,32);g=x.createRadialGradient(0,0,18,0,0,30);g.addColorStop(0,"rgba(255,255,255,0.06)");g.addColorStop(.8,"rgba(220,245,255,.5)");g.addColorStop(.93,"rgba(255,255,255,.95)");g.addColorStop(1,"rgba(255,255,255,0)");x.fillStyle=g;x.beginPath();x.arc(0,0,30,0,7);x.fill();
 g=x.createRadialGradient(-9,-10,0,-9,-10,9);g.addColorStop(0,"rgba(255,255,255,1)");g.addColorStop(1,"rgba(255,255,255,0)");x.fillStyle=g;x.beginPath();x.arc(-9,-10,9,0,7);x.fill();x.restore();
 // 2: ışık hüzmesi (128,0)-(192,256): ortası parlak, kenarları ve altı yumuşak sönen şerit
 var id=x.createImageData(64,256),d=id.data;for(var yy=0;yy<256;yy++)for(var xx=0;xx<64;xx++){var u=(xx+.5)/64,v=yy/255,s=Math.pow(Math.sin(Math.PI*u),2.2),f=Math.pow(1-v,1.35)*Math.min(1,v*9+.15),a=s*f,o=(yy*64+xx)*4;d[o]=d[o+1]=d[o+2]=255;d[o+3]=Math.round(255*a)}
 x.putImageData(id,128,0);
 // 3: yüzey parıltısı (0,64)-(128,128): yatay kırpışan çizgiler
 for(var i=0;i<26;i++){var px=Math.random()*128,py=64+Math.random()*64,w=8+Math.random()*30;g=x.createLinearGradient(px-w,0,px+w,0);g.addColorStop(0,"rgba(255,255,255,0)");g.addColorStop(.5,"rgba(255,255,255,"+(.25+Math.random()*.4)+")");g.addColorStop(1,"rgba(255,255,255,0)");x.fillStyle=g;x.fillRect(px-w,py,w*2,1.5+Math.random()*2.5)}
 return c}
var UV={dot:[0,0,.25,.25],bub:[.25,0,.5,.25],ray:[.5,0,.75,1],sur:[0,.25,.5,.5]};
function enInit(host){var cv=document.createElement("canvas");cv.id="veEnv";cv.setAttribute("aria-hidden","true");cv.className="cvl";cv.style.cssText="position:absolute;pointer-events:none";
 var gl=mkGL(cv);EN.cv=cv;EN.gl=gl;cv.addEventListener("webglcontextlost",function(e){e.preventDefault();VE.envOn=false;cv.style.display="none"},false);
 EN.p=prog(gl,"attribute vec2 p;attribute vec2 u;attribute vec4 c;uniform vec4 m;varying vec2 v;varying vec4 k;void main(){v=u;k=c;gl_Position=vec4(p.x*m.x+m.z,p.y*m.y+m.w,0.,1.);}",
  "precision mediump float;varying vec2 v;varying vec4 k;uniform sampler2D t;void main(){gl_FragColor=texture2D(t,v)*k;}");
 EN.aP=gl.getAttribLocation(EN.p,"p");EN.aU=gl.getAttribLocation(EN.p,"u");EN.aC=gl.getAttribLocation(EN.p,"c");EN.uM=gl.getUniformLocation(EN.p,"m");EN.b=gl.createBuffer();EN.D=new Float32Array(MAXQ*6*8);
 EN.t=tex(gl);gl.bindTexture(gl.TEXTURE_2D,EN.t);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,atlas());host.after(cv)}
// kuad ekle: merkez, yarı boyutlar, dönüş, uv, renk (önceden alfa ile çarpılmış)
function quad(cx,cy,hw,hh,rot,uv,r,g,b,a){if(EN.n>=MAXQ)return;var D=EN.D,o=EN.n*48,c=Math.cos(rot),s=Math.sin(rot),pr=r*a,pg=g*a,pb=b*a,
 X=[-hw,hw,hw,-hw],Y=[-hh,-hh,hh,hh],U=[uv[0],uv[2],uv[2],uv[0]],V=[uv[1],uv[1],uv[3],uv[3]],ord=[0,1,2,0,2,3];
 for(var q=0;q<6;q++){var k=ord[q];D[o++]=cx+X[k]*c-Y[k]*s;D[o++]=cy+X[k]*s+Y[k]*c;D[o++]=U[k];D[o++]=V[k];D[o++]=pr;D[o++]=pg;D[o++]=pb;D[o++]=a}EN.n++}
function flush(add){var gl=EN.gl;if(!EN.n)return;gl.blendFunc(gl.ONE,add?gl.ONE:gl.ONE_MINUS_SRC_ALPHA);gl.bindBuffer(gl.ARRAY_BUFFER,EN.b);gl.bufferData(gl.ARRAY_BUFFER,EN.D.subarray(0,EN.n*48),gl.DYNAMIC_DRAW);
 gl.enableVertexAttribArray(EN.aP);gl.vertexAttribPointer(EN.aP,2,gl.FLOAT,false,32,0);gl.enableVertexAttribArray(EN.aU);gl.vertexAttribPointer(EN.aU,2,gl.FLOAT,false,32,8);gl.enableVertexAttribArray(EN.aC);gl.vertexAttribPointer(EN.aC,4,gl.FLOAT,false,32,16);
 gl.drawArrays(gl.TRIANGLES,0,EN.n*6);EN.n=0}
// ParticleManager: havuzlu (nesneler yeniden kullanılır)
var QL={3:{rays:6,motes:90,emit:3,bub:90,sur:1},2:{rays:4,motes:50,emit:2,bub:50,sur:1},1:{rays:2,motes:20,emit:1,bub:24,sur:0}};
function R(a,b){return a+Math.random()*(b-a)}
function enSetup(W,H,floor){EN.W=W;EN.H=H;var L=QL[VE.Q]||QL[3];EN.motes.length=0;for(var i=0;i<L.motes;i++){var z=Math.pow(Math.random(),1.5);EN.motes.push({x:R(0,W),y:R(0,H),z:z,ph:R(0,6.3),vx:R(-3,3)})}
 EN.rays.length=0;for(i=0;i<L.rays;i++)EN.rays.push({x:W*(.08+.84*(i+.5)/L.rays)+R(-30,30),w:R(.07,.15)*W,a:R(.05,.11),sp:R(.08,.2),ph:R(0,6.3)});
 EN.emit.length=0;var xs=[.14,.86,.52];for(i=0;i<L.emit;i++)EN.emit.push({x:W*xs[i]+R(-20,20),t:R(0,2),cl:0});
 if(EN.bub.length>L.bub)EN.bub.length=L.bub;EN.floor=floor;EN.key=W+"x"+H+":"+VE.Q}
function spawn(x,y,r){var b=null;for(var i=0;i<EN.bub.length;i++)if(!EN.bub[i].on){b=EN.bub[i];break}if(!b){if(EN.bub.length>=(QL[VE.Q]||QL[3]).bub)return;b={};EN.bub.push(b)}b.on=true;b.x=x;b.y=y;b.r=r;b.vy=R(34,58)+r*4;b.ph=R(0,6.3);b.dr=R(6,14);b.age=0}
// g: {W,H,floor,surf,night,dt,t}
VE.envFrame=function(g){if(!VE.envOn||!EN.gl)return;var gl=EN.gl,W=g.W,H=g.H,dt=Math.min(.05,g.dt||0),t=g.t,day=1-(g.night||0);
 var dpr=Math.min(1.5,window.devicePixelRatio||1),cw=Math.round(EN.cv.clientWidth*dpr),ch=Math.round(EN.cv.clientHeight*dpr);if(!cw||!ch)return;if(EN.cv.width!==cw||EN.cv.height!==ch){EN.cv.width=cw;EN.cv.height=ch}
 if(EN.key!==W+"x"+H+":"+VE.Q)enSetup(W,H,g.floor);
 gl.viewport(0,0,cw,ch);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(EN.p);gl.enable(gl.BLEND);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,EN.t);gl.uniform4f(EN.uM,2/W,-2/H,-1,1);
 var L=QL[VE.Q]||QL[3],i,m;
 // LightingManager: yüzeyden inen yumuşak hüzmeler (eklemeli), parlaklık dalgalarla nefes alır; gece kaybolur
 if(day>.03){for(i=0;i<EN.rays.length;i++){m=EN.rays[i];var a=m.a*day*(.65+.25*Math.sin(t*m.sp*2+m.ph)+.1*Math.sin(t*1.3+m.ph*2)),x=m.x+Math.sin(t*m.sp+m.ph)*W*.02,len=(g.floor||H*.78)*1.05;
  quad(x+len*.09,len*.5,m.w*(.8+.2*Math.sin(t*.5+m.ph)),len*.5,-.18,UV.ray,.86,.97,1,a)}
  if(L.sur){var sa=.16*day+.04,o1=(t*9)%W;quad(o1-W/2,22,W/2,26,0,UV.sur,1,1,1,sa);quad(o1+W/2,22,W/2,26,0,UV.sur,1,1,1,sa);var o2=((-t*6)%W+W)%W;quad(o2-W/2,30,W/2,22,Math.PI,UV.sur,1,1,1,sa*.7);quad(o2+W/2,30,W/2,22,Math.PI,UV.sur,1,1,1,sa*.7)}
  flush(true)}
 // su parçacıkları: üç derinlik; uzaktakiler küçük ve sönük, yakındakiler büyük, yumuşak ve hızlı
 for(i=0;i<EN.motes.length;i++){m=EN.motes[i];m.y+=(1.5+7*m.z*m.z)*dt;m.x+=(m.vx*(.5+m.z)+Math.sin(t*.3+m.ph)*(3+8*m.z)*m.z)*dt;if(m.y>H+10){m.y=-10;m.x=R(0,W)}if(m.x<-10)m.x=W+10;else if(m.x>W+10)m.x=-10;
  var near=m.z>.84,rr=near?5+m.z*8:.7+m.z*2.6,al=(near?.1:.16+.36*m.z)*(.75+.25*Math.sin(t*1.7+m.ph))*(.4+.6*day);quad(m.x,m.y,rr,rr,0,UV.dot,.9,.98,1,al)}
 // kabarcıklar: seçili noktalardan yükselir, ara sıra küçük kümeler; yüzeye yaklaşınca söner
 for(i=0;i<EN.emit.length;i++){var e=EN.emit[i];e.t-=dt;if(e.t<=0){var fl=(g.floor||H*.78)-6;if(Math.random()<.22&&VE.Q>1){e.cl=R(4,8)|0}spawn(e.x+R(-4,4),fl,R(1.6,4.2));e.t=e.cl>0?R(.06,.14):R(.5,1.6);if(e.cl>0)e.cl--}}
 var top=(g.surf||H*.08)+4;for(i=0;i<EN.bub.length;i++){m=EN.bub[i];if(!m.on)continue;m.age+=dt;m.y-=m.vy*dt;m.vy=Math.min(m.vy+dt*8,95);m.x+=Math.sin(m.age*3+m.ph)*m.dr*dt;var fa=Math.min(1,m.age*4)*Math.min(1,Math.max(0,(m.y-top)/40));if(m.y<top){m.on=false;continue}
  var wb=1+.07*Math.sin(m.age*9+m.ph);quad(m.x,m.y,m.r*wb,m.r/wb,0,UV.bub,1,1,1,.85*fa)}
 flush(false);VE.stat.env++};
VE.envShow=function(on){if(EN.cv)EN.cv.style.display=on?"":"none"};

// ---------- PerformanceManager: kalite (3 yüksek · 2 orta · 1 düşük) ve otomatik düşürme ----------
VE.Q=3;VE.QU=3;VE.stat={fish:0,env:0};var PM={slow:0,last:0,t0:0,fe:0,fslow:0};
VE.setQuality=function(q){VE.QU=VE.Q=Math.max(1,Math.min(3,q|0));EN.key=""};
// her karede kare süresi (ms) verilir; uzun süre yavaşsa kalite bir kademe iner
VE.perf=function(ms){if(!(ms>0))return;if(ms>24)PM.slow+=ms/1000;else PM.slow=Math.max(0,PM.slow-ms/2000);if(PM.slow>3&&VE.Q>1){VE.Q--;PM.slow=0;EN.key=""}};

// ---------- başlatma ----------
VE.init=function(host){try{if(!FR.gl)frInit();if(!EN.gl)enInit(host);VE.ok=true;VE.fishOn=true;VE.envOn=true;return true}catch(e){VE.err=String(e&&e.message||e);VE.ok=false;VE.fishOn=false;VE.envOn=false;return false}};
})();

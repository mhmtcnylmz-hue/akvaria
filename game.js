function B64(x){return typeof x==="string"&&x.slice(0,2)==="a/"?x:"data:image/webp;base64,"+x}

(() => {
"use strict";
try{window.bootP&&bootP(72)}catch(e){}
const $ = id => document.getElementById(id);
const canvas=$("tank"), ctx=canvas.getContext("2d");
const asset=n=>getComputedStyle(document.documentElement).getPropertyValue("--asset-"+n).trim().replace(/^url\(["']?|["']?\)$/g,"");
const reefBg=new Image();reefBg.src=asset("reef");const nightBg=new Image();nightBg.src=asset("night");const deepBg=new Image();deepBg.src=asset("deep");const reefF=new Image();reefF.src=asset("reefF");const nightF=new Image();nightF.src=asset("nightF");
const chestClosedImg=new Image();chestClosedImg.src=asset("chestClosed");
const chestOpenImg=new Image();chestOpenImg.src=asset("chestOpen");
let bgCache=null,chestAnim=null;
const ORI_PREF=(()=>{try{const o=localStorage.getItem("akvOri");return o==="land"||o==="port"?o:"auto"}catch(e){return"auto"}})(),ORI=ORI_PREF!=="auto"?ORI_PREF:(typeof innerWidth==="number"&&typeof innerHeight==="number"&&innerHeight>innerWidth?"port":"land"),PORT=ORI==="port";try{document.documentElement.classList.toggle("land",!PORT)}catch(e){}
const SCR=(()=>{let w=0,h=0;try{const st=document.getElementById("stage");if(st){const r=st.getBoundingClientRect();w=r.width;h=r.height}}catch(e){}try{if(!(w>0&&h>0)){w=innerWidth;h=innerHeight}const ua=navigator.userAgent||"",sa=navigator.standalone===true||(window.matchMedia&&matchMedia("(display-mode: standalone),(display-mode: fullscreen)").matches)||!!window.Capacitor||(/iP(hone|ad|od)/.test(ua)&&!/Safari\//.test(ua));if(sa&&screen&&screen.width>0&&screen.height>0){const P=h>=w,a=P?Math.min(screen.width,screen.height):Math.max(screen.width,screen.height),b=P?Math.max(screen.width,screen.height):Math.min(screen.width,screen.height);if(Math.abs(a-w)<3&&b>h&&b-h<140)h=b}}catch(e){}return{w,h}})();const GAR=(()=>{const a=SCR.w>0&&SCR.h>0&&isFinite(SCR.w/SCR.h)?SCR.w/SCR.h:(PORT?540/960:16/9);return PORT?Math.max(.42,Math.min(.8,a)):Math.max(1.3,Math.min(2.4,a))})();try{document.documentElement.style.setProperty("--gar",GAR.toFixed(4))}catch(e){}
const W=PORT?Math.round(960*GAR):Math.round(540*GAR),H=PORT?960:540,FLOOR=H*(PORT?.77:.78),LSP=PORT?1:.62,LSR=PORT?1:.8;function ymig(y){return 421.2+(y-739.2)*.5625}function yconv(y,from){if(from===ORI)return y;return from==="port"?421.2+(y-739.2)*.5625:739.2+(y-421.2)/.5625}
let K=Math.min(2,Math.max(1,Math.ceil(typeof devicePixelRatio==="number"?devicePixelRatio:1)));const KMAX=K;try{localStorage.removeItem("fvK2");const sk=+localStorage.getItem("fvK3");if(sk>=1&&sk<K)K=sk}catch(e){}canvas.width=Math.round(W*K);canvas.height=Math.round(H*K);try{ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality="high"}catch(e){}
const species=[
{id:"neon",name:"Neon Tetra",price:15,value:9,speed:42,grow:.03,scale:.9,img:"a/ed8fb00124e3f9e7.webp"},
{id:"guppy",name:"Gupi",price:30,value:18,speed:38,grow:.1,scale:1,img:"a/c2fa2456fb9b5353.webp"},
{id:"clown",name:"Palyaço Balığı",price:60,value:36,speed:30,grow:.3,scale:1,img:"a/315d15987626854f.webp"},
{id:"ytang",name:"Sarı Cerrah",price:70,value:42,speed:28,grow:.4,scale:1,img:"a/e9c4d29b2d74e7cd.webp"},
{id:"gold",name:"Japon Balığı",price:80,value:48,speed:20,grow:.5,scale:1.05,img:"a/83a3dfbd3f0e6d0f.webp"},
{id:"betta",name:"Betta",price:100,value:60,speed:18,grow:.7,scale:1.1,img:"a/393d4214db37dc2b.webp"},
{id:"btang",name:"Mavi Cerrah",price:140,value:84,speed:32,grow:1,scale:1.05,img:"a/1a053862fa3ba96c.webp"},
{id:"angel",name:"Kral Melek",price:190,value:114,speed:24,grow:1.5,scale:1.05,img:"a/2691163284910791.webp"},
{id:"cichlid",name:"Gökkuşağı Çiklit",price:220,value:132,speed:26,grow:1.8,scale:1.05,lv:3,img:"a/4fa891bd39f55c06.webp"},
{id:"lion",name:"Aslan Balığı",price:260,value:156,speed:20,grow:2.2,scale:0.95,lv:4,img:"a/09c53b8c7b2b4a33.webp"},
{id:"arowana",name:"Kırmızı Aravana",price:280,value:168,speed:30,grow:2.4,scale:1,lv:4,img:"a/fffd81f5982b6497.webp"},
{id:"copper",name:"Bakır Kelebek",price:300,value:180,speed:22,grow:2.5,scale:1.05,lv:5,img:"a/29f3145ddb0740c9.webp"},
{id:"discus",name:"Disk Balığı",price:340,value:204,speed:20,grow:3,scale:0.95,lv:5,img:"a/7975d6b3ab0caf28.webp"},
{id:"trigger",name:"Tetik Balığı",price:380,value:228,speed:24,grow:3.5,scale:1,lv:6,img:"a/ff96d4072dc818bb.webp"},
{id:"boxfish",name:"Kutu Balığı",price:410,value:246,speed:14,grow:3.5,scale:1,lv:6,img:"a/44c3249341318a2b.webp"},
{id:"mandarin",name:"Mandarin Balığı",price:440,value:264,speed:22,grow:4,scale:1,lv:7,img:"a/c21e099039c961d3.webp"},
{id:"koi",name:"Koi Balığı",price:450,value:270,speed:22,grow:3.8,scale:1,lv:8,img:"a/59e580fbc2523e94.webp"},
{id:"idol",name:"Moor Putu",price:500,value:300,speed:22,grow:4.5,scale:0.9,lv:8,img:"a/a76309015cc9ad8c.webp"},
{id:"emp",name:"Mavi Melek",price:600,value:360,speed:20,grow:5,scale:0.95,lv:9,img:"a/ce6dcc3bcda0d936.webp"},
{id:"napo",name:"Napolyon Balığı",price:750,value:450,speed:18,grow:6.3,scale:1,lv:10,img:"a/c6f015a094eedf0f.webp"},
{id:"lantern",name:"Fener Hamsisi",price:90,value:54,speed:44,grow:.05,scale:1,lv:35,deep:1,img:"a/1c0fe30543c583d6.webp"},
{id:"hatchet",name:"Balta Balığı",price:160,value:96,speed:36,grow:.12,scale:1,lv:36,deep:1,img:"a/ff946d1f70619a48.webp"},
{id:"angler",name:"Fener Balığı",price:900,value:540,speed:16,grow:5,scale:1,lv:37,deep:1,img:"a/c5fd9fce1c75e17d.webp"},
{id:"viper",name:"Engerek Balığı",price:1200,value:720,speed:30,grow:6,scale:1,lv:39,deep:1,img:"a/142877c39d0ba005.webp"},
{id:"oar",name:"Kürek Balığı",price:2200,value:1320,speed:14,grow:9,scale:1,lv:42,deep:1,wmax:250,sl:18,img:"a/a7084ffc6e7ae707.webp"},
{id:"dragon",name:"Kara Ejder Balığı",price:4000,value:2400,speed:24,grow:12,scale:1,lv:46,deep:1,wmax:230,sl:18,img:"a/75d072f9fce39cc8.webp"},
{id:"tripod",name:"Üç Ayaklı Balık",price:1500,value:900,speed:20,grow:7,scale:1,lv:40,deep:1,wmax:175,img:"a/663196a55451f917.webp"},
{id:"lancet",name:"Uzun Burunlu Mızrak Balığı",price:5000,value:3000,speed:38,grow:14,scale:1,lv:48,deep:1,wmax:240,sl:14,img:"a/a5e9fe1da476bec3.webp"},
{id:"piranha",name:"Kırmızı Karınlı Pirana",price:300,value:180,speed:40,grow:2,scale:1,lv:25,river:1,img:"a/281e03beff61af2a.webp"},
{id:"peacock",name:"Ateş Gözlü Tavus Levreği",price:450,value:270,speed:34,grow:3,scale:1,lv:25,river:1,img:"a/5f2b8d37277f234e.webp"},
{id:"bichir",name:"Süslü Bichir",price:600,value:360,speed:16,grow:4,scale:1,lv:26,river:1,sl:12,img:"a/993c6a2e25722191.webp"},
{id:"eel",name:"Elektrikli Yılan Balığı",price:1100,value:660,speed:16,grow:6,scale:1,lv:28,river:1,wmax:210,sl:16,img:"a/3c6c8922bc7d4705.webp"},
{id:"mahseer",name:"Altın Mahseer",price:1300,value:780,speed:30,grow:6.5,scale:1,lv:29,river:1,wmax:165,img:"a/85349baf413151d8.webp"},
{id:"gar",name:"Timsah Turna Balığı",price:1700,value:1020,speed:22,grow:8,scale:1,lv:30,river:1,wmax:215,sl:14,img:"a/19100ec885ebe2fe.webp"},
{id:"goliath",name:"Goliath Kaplan Balığı",price:2200,value:1320,speed:34,grow:9,scale:1,lv:31,river:1,wmax:185,img:"a/0fc5479071961f65.webp"},
{id:"mekong",name:"Mekong Dev Yayın Balığı",price:2800,value:1680,speed:14,grow:10,scale:1,lv:32,river:1,wmax:225,sl:12,img:"a/1797c3e728848317.webp"},
{id:"sturgeon",name:"Mersin Balığı",price:3500,value:2100,speed:14,grow:12,scale:1,lv:33,river:1,wmax:240,sl:12,img:"a/419ab990fbd67db4.webp"},
{id:"arapaima",name:"Arapaima",price:4500,value:2700,speed:20,grow:14,scale:1,lv:34,river:1,wmax:245,sl:12,img:"a/4cc0bc649378cf27.webp"}
];
// gerçek hayattaki yetişkin boyu (cm) ve sprite genişliğindeki yüzgeç/uzantı payı; ekran boyu cm^0,35 ile ölçekli (3,5 cm ≈ 66 px, 45 cm ≈ 160 px)
const CMS={koi:[50,.95],arowana:[40,.95],boxfish:[18,1],napo:[42,1],neon:[3.5,1],guppy:[4.5,.95],clown:[10,1],ytang:[20,1],gold:[18,.95],betta:[6.5,.85],btang:[27,1],angel:[38,1],cichlid:[14,1],lion:[35,.9],copper:[20,1],discus:[18,1],trigger:[45,1],mandarin:[6.5,.9],idol:[22,.9],emp:[30,1],lantern:[7,1],hatchet:[5,1.1],angler:[20,1],viper:[28,1],oar:[300,1],dragon:[60,1],tripod:[30,1],lancet:[150,1],piranha:[30,1],peacock:[60,1],bichir:[45,1],eel:[200,1],mahseer:[90,1],gar:[200,1],goliath:[130,1],mekong:[270,1],sturgeon:[400,1],arapaima:[250,1]};
species.forEach(s=>{const c=CMS[s.id]||[10,1];s.cm=c[0];s.scale=66*Math.pow(c[0]/3.5,.35)*c[1]/98.4});
const MUTW={"glitch_lancet":1.011,"glitch_tripod":1.016,"glitch_dragon":1.012,"gold_lancet":1.022,"gold_tripod":1.03,"melanistic_lancet":1.013,"melanistic_tripod":1.021,"transparent_lancet":1.015,"transparent_tripod":1.014,"albino_lancet":1.019,"albino_tripod":1.021,"glitch_clown":1.097,"glitch_ytang":1.017,"glitch_btang":0.999,"glitch_angel":0.909,"glitch_lion":1.104,"glitch_trigger":1.005,"glitch_boxfish":1.049,"glitch_idol":0.943,"glitch_emp":0.991,"glitch_napo":1.027,"glitch_neon":1.019,"glitch_guppy":1.055,"glitch_gold":0.947,"glitch_betta":1.052,"glitch_cichlid":0.918,"glitch_arowana":0.988,"glitch_discus":1.056,"glitch_koi":0.971,"glitch_copper":1.007,"glitch_mandarin":1.075,"gold_neon":1.0,"gold_guppy":1.0,"gold_gold":1.0,"gold_betta":1.005,"gold_cichlid":1.004,"gold_arowana":0.994,"gold_discus":0.989,"gold_koi":1.006,"gold_clown":0.991,"gold_ytang":0.958,"gold_btang":0.95,"gold_angel":0.954,"gold_lion":0.991,"gold_copper":0.972,"gold_trigger":0.966,"gold_boxfish":0.993,"gold_mandarin":0.984,"gold_idol":0.923,"gold_emp":1.0,"gold_napo":0.988,"albino_koi":1.013,"transparent_koi":1.006,"melanistic_koi":1.025,"albino_arowana":0.989,"transparent_arowana":1.044,"melanistic_arowana":0.997,"albino_boxfish":1.014,"transparent_boxfish":0.986,"melanistic_boxfish":1.028,"albino_napo":1.003,"transparent_napo":0.953,"melanistic_napo":1.012,"albino_neon":1.08,"transparent_neon":1.036,"melanistic_neon":1.028,"albino_guppy":0.983,"transparent_guppy":1.01,"melanistic_guppy":0.981,"albino_clown":1.015,"transparent_clown":0.969,"melanistic_clown":0.985,"albino_ytang":0.965,"transparent_ytang":0.951,"melanistic_ytang":0.993,"albino_gold":1.0,"transparent_gold":1.004,"melanistic_gold":0.991,"albino_betta":0.923,"transparent_betta":1.021,"melanistic_betta":0.94,"albino_btang":1.015,"transparent_btang":0.931,"melanistic_btang":0.984,"albino_angel":0.953,"transparent_angel":0.932,"melanistic_angel":0.947,"albino_mandarin":0.963,"transparent_mandarin":0.964,"melanistic_mandarin":0.967,"albino_lion":0.946,"transparent_lion":0.953,"melanistic_lion":1.006,"albino_idol":0.904,"transparent_idol":0.923,"melanistic_idol":0.882,"albino_trigger":0.96,"transparent_trigger":0.977,"melanistic_trigger":0.949,"albino_discus":1.001,"transparent_discus":1.014,"melanistic_discus":1.02,"albino_copper":0.963,"transparent_copper":0.958,"melanistic_copper":0.951,"albino_cichlid":0.977,"transparent_cichlid":1.027,"melanistic_cichlid":0.968,"albino_emp":1.014,"transparent_emp":0.967,"melanistic_emp":0.989};
function initState(){return{coins:250,xp:0,level:1,nextId:4,tank:"fresh",fish:[
{id:1,type:"neon",age:.38,x:.22,y:.43,dir:1,phase:1.2},
{id:2,type:"guppy",age:.58,x:.67,y:.58,dir:-1,phase:3.3},
{id:3,type:"betta",age:.74,x:.48,y:.30,dir:1,phase:5.1}
],discovered:["neon","guppy","betta"],lastFeed:0,muted:false,lastTick:Date.now(),pending:0,dirt:10,stash:{},propPos:{},wheel:null,gems:10,luck:0,snails:0,decor:[],chest:null,chestAt:Date.now()+18e4,market:{},marketAt:Date.now()+36e5,eggs:[],equipment:{filter:0,feeder:0},eventAt:Date.now()+6e5,night:false,music:true,props:[],mutsFound:[],stats:{},ach:{},daily:null,streak:{last:"",count:0},helped:{},helpGot:{},savedAt:0}}
let state=initState();
let lastAdv=0,lastSave=0;
let openKey=null,drops=[],dirtC=null,dirtK=-1;
let lastDrag=0,feedMode=0,feedQAt=0,xpAcc=0,coinsLoose=[],coinsFly=[],sfxAt=0,eatAt=0;const NOCT=["lion","mandarin","lantern","hatchet","angler","viper","oar","dragon","tripod","lancet","eel","bichir"];
const fishImgs={};species.forEach(sp=>{const u=""+B64(sp.img);document.documentElement.style.setProperty("--f-"+sp.id,'url("'+u+'")');const im=new Image();im.src=u;fishImgs[sp.id]=im});
function spReq(s){const T=TANKS[WATER[s.id]];return Math.max(s.lv||1,T&&T.lv||1)}
function spLocked(s){return state.level<spReq(s)&&!state.discovered.includes(s.id)}

const EIS={"🪙":"a/661c2de6284865ee.webp","💎":"a/06d56eefcdf74988.webp","⭐":"a/7dc6624607493f4f.webp","🌟":"a/7dc6624607493f4f.webp","🐠":"a/2639e3c708a855aa.webp","🐟":"a/2639e3c708a855aa.webp","🔒":"a/6a52c7088f39f1f3.webp","🔓":"a/e9239040290689fe.webp","🏆":"a/cde01368485c3657.webp","👑":"a/dfb6198fde544e84.webp","🧬":"a/90bb53a88f428409.webp","💊":"a/43aebce92b5da7cf.webp","❤️":"a/cb453a3a671948b9.webp","🌱":"a/bd59b7ee87cfd976.webp","🍽️":"a/98d96a84e99c7d66.webp","😴":"a/5b189ea946395dac.webp","🌙":"a/5b189ea946395dac.webp","🤒":"a/754f754a0bf2079a.webp","🔥":"a/87e483396ee067e3.webp","🍀":"a/417f2f88e364bcfa.webp","📦":"a/6226b159120f54aa.webp","🧪":"a/0b8112ebe23039d6.webp","☀️":"a/cd81932493a619d4.webp","🐚":"a/2935c87c4d382fdd.webp","🪸":"a/d4ae05e0b41dfd3d.webp","⚓":"a/e7b80d9d52bbec0e.webp","🦪":"a/4dbeac73ffba3b00.webp","🦀":"a/9d7541c1fd93acdc.webp","🪨":"a/ddc731f6de1eeddd.webp","🐌":"a/997a407b7ca9b76c.webp","🏺":"a/3a7e56f1ef434194.webp","🍂":"a/5846749a1c787c0a.webp","🎃":"a/20a04a429d195d0f.webp","❄️":"a/0b5f47c65d57cb74.webp","💘":"a/3f04c4609f83722e.webp","🌸":"a/8d4a78842543196c.webp","🎉":"a/ac37e8408bf1c979.webp","🏠":"a/228545fd7fe7c3f3.webp","🎁":"a/10d44b3d929297a7.webp","🛒":"a/d29b3b53478c1f91.webp","🎡":"a/54772fea00e03f74.webp","📸":"a/6acc2759bbc432f9.webp","🗺️":"a/56b7ec574789e97d.webp","⚙️":"a/c619169e7e7f353c.webp","🤖":"a/369e78c42206c42a.webp","🍤":"a/bd37432ee8f858b6.webp","🧽":"a/e48199d9edac1667.webp","📋":"a/445d1c9ad91bdbd6.webp","🥚":"a/8f65eebf4effa57f.webp","✨":"a/58e16f29b1414898.webp","🛠️":"a/1f81a84b400a2dc2.webp","✅":"a/4d6b8f720434e544.webp","⚠️":"a/c1b7372f59c29ff4.webp","💾":"a/182e27fc31ac463c.webp","📖":"a/8e02ff0197d725b2.webp","🫧":"a/25f6ed168f01f758.webp","💞":"a/1caa97130ac9435a.webp","🤝":"a/abda6c384a3b7364.webp","🎵":"a/f8912fa49f84fe63.webp","🏅":"a/084f94bf2cc8ac49.webp","⚔️":"a/ae1a6f7346f5d008.webp","🤍":"a/e03bc63f90783e06.webp","🔮":"a/f9bb47a6f7e914f8.webp","🖤":"a/c06e72f418589774.webp","💀":"a/7163aabfbc0bcba5.webp","🔊":"a/ff1b9b3a51c25368.webp","🔇":"a/6d787f0a80d66ac4.webp","✏️":"a/8ffdbb06cc3ac0c1.webp","🧠":"a/32c6e8a5e65be433.webp","💰":"a/c33ab39ff3875814.webp","📈":"a/8342e11e16d03119.webp","⚡":"a/f02de7c74eecd49c.webp","🧰":"a/b84d9e4393f157e2.webp","🐣":"a/ac90bba6a0a8cb90.webp","😣":"a/d8cbd5ae25d7b2f1.webp","😨":"a/58948746251df061.webp","💧":"a/1505d79b0b97dbb2.webp","🌊":"a/55965da1afb2a983.webp","🌿":"a/8c6d1d2c18ee3515.webp","⏳":"a/e84b844c66e5a4b2.webp","👥":"a/0d36913196fdbfbb.webp","🗂️":"a/be5f943060e31f61.webp","⬇️":"a/3a2ca41a88ed71af.webp","📚":"a/4a2ca40c9659f474.webp","🌐":"a/0f2d4363f0e744b6.webp","📤":"a/a5da1fcd20e30e14.webp","👀":"a/236fc57e3c965d7b.webp","❌":"a/76cf3ed528ecd371.webp","⏩":"a/33fcb4f9430905b4.webp","👍":"a/a8b04f727f1fd226.webp"};
const EIK=Object.keys(EIS).map(k=>k.replace(/️/g,"")).sort((a,b)=>b.length-a.length),EIX={};Object.keys(EIS).forEach(k=>{EIX[k.replace(/️/g,"")]=EIS[k]});
const EIRE=new RegExp("("+EIK.map(k=>k+"\\uFE0F?").join("|")+")","g"),EIM={},EIC={};let EIN=0;
function eimg(k){k=k.replace(/️/g,"");const b=EIX[k];if(!b)return null;let im=EIM[k];if(!im){im=EIM[k]=new Image();im.src=""+B64(b)}return im.complete&&im.naturalWidth?im:null}
function eiCls(k){k=k.replace(/️/g,"");if(EIC[k])return EIC[k];const c="ei"+(EIN++);EIC[k]=c;try{eiSheet.textContent+="."+c+"{background-image:url("+B64(EIX[k])+")}"}catch(e){}return c}
let eiSheet=null;try{eiSheet=document.createElement("style");eiSheet.textContent=".ei{display:inline-block;width:1.25em;height:1.25em;vertical-align:-.28em;background:center/contain no-repeat;pointer-events:none;margin:0 .03em}";document.head.appendChild(eiSheet)}catch(e){}
const EI_SKIP={SCRIPT:1,STYLE:1,TEXTAREA:1,OPTION:1,SELECT:1,TITLE:1,INPUT:1,CANVAS:1};
function emojify(root){try{if(!root)return;if(root.nodeType===3){eiText(root);return}if(root.nodeType!==1||EI_SKIP[root.nodeName])return;const w=document.createTreeWalker(root,4),L=[];let n;while(n=w.nextNode())L.push(n);L.forEach(eiText)}catch(e){}}
function eiText(n){const s=n.nodeValue;if(!s||!n.parentNode||EI_SKIP[n.parentNode.nodeName])return;EIRE.lastIndex=0;if(!EIRE.test(s))return;EIRE.lastIndex=0;const f=document.createDocumentFragment();let last=0,m;while(m=EIRE.exec(s)){if(m.index>last)f.appendChild(document.createTextNode(s.slice(last,m.index)));const i=document.createElement("i");i.className="ei "+eiCls(m[1]);i.setAttribute("aria-label",m[1]);f.appendChild(i);last=m.index+m[0].length}if(last<s.length)f.appendChild(document.createTextNode(s.slice(last)));n.parentNode.replaceChild(f,n)}
function eiStart(){if(typeof MutationObserver==="undefined"||!document.body)return;emojify(document.body);new MutationObserver(ms=>{for(const m of ms){if(m.type==="characterData")emojify(m.target);else m.addedNodes.forEach(emojify)}}).observe(document.body,{childList:true,subtree:true,characterData:true})}
function drawEmo(c,str,x,y,sz){const parts=String(str).split(EIRE);let cx=x;c.textAlign="left";parts.forEach((p,i)=>{if(!p)return;if(i%2){const im=eimg(p);if(im){const h=sz*1.25,w=h*im.naturalWidth/im.naturalHeight;c.drawImage(im,cx,y-h*.82,w,h);cx+=w+2;return}}c.fillText(p,cx,y);cx+=c.measureText(p).width})}
const CUP=["a/6dc9bbce694ee2dd.webp","a/983b109e0934122a.webp","a/a64569f989ccfe00.webp","a/b96ab8debcd4015f.webp","a/26d4a4d16b70e26a.webp","a/d83ca8e27b66a5ee.webp","a/d84f4cbfe3cf84fb.webp","a/2db45141ab208ea9.webp"];
function tankIco(T){return '<img class="cuimg" alt="" src="'+B64((T.w==="salt"?"a/52256a36fb688b4c.webp":T.w==="deep"?"a/94f250b56e2542c2.webp":T.w==="river"?"a/4cc0bc649378cf27.webp":"a/2523ff48b9b78348.webp"))+'">'}
const DECN={"🐚":"Deniz kabuğu","🪸":"Mercan dalı","⚓":"Paslı çapa","🦪":"İnci istiridyesi","🦀":"Yengeç","🪨":"Yosunlu taş","sf":"Deniz yıldızı","r1":"Yosunlu kök","r2":"Nehir taşları","r3":"Amazon kılıç bitkisi","r4":"Orman yaprakları","r5":"Batık kano","r6":"Antik toprak çömlek","r7":"Dev nehir salyangozu kabuğu","d1":"Balina kaburgası","d2":"Sıcak su bacası","d3":"Işıklı mercan","d4":"Cam sünger","d5":"Eski derin deniz feneri","d6":"Işıklı tüp kurtları","d7":"Işıklı volkanik kaya"},DIMG={"🐚":"a/2935c87c4d382fdd.webp","🪸":"a/d4ae05e0b41dfd3d.webp","⚓":"a/e7b80d9d52bbec0e.webp","🦪":"a/4dbeac73ffba3b00.webp","🦀":"a/9d7541c1fd93acdc.webp","🪨":"a/ddc731f6de1eeddd.webp","sf":"a/ae7a151686134b49.webp","r1":"a/0b55ad5bb1c3a1d1.webp","r2":"a/32e59cf7af1ec267.webp","r3":"a/f2eceb66b9282522.webp","r4":"a/b77617b2fe5c6158.webp","r5":"a/e0d8ecc1641e99a8.webp","r6":"a/025ce855f6f924a5.webp","r7":"a/38bea532b54e6b18.webp","d1":"a/b21e90b4fdc6781e.webp","d2":"a/603e4ca5cad41e9d.webp","d3":"a/929a4f1246544b94.webp","d4":"a/f34da4493d86f782.webp","d5":"a/1420e5bb3df45699.webp","d6":"a/d558952c2ca49f28.webp","d7":"a/fb761eae50619bab.webp"},DIM={};
function decImg(k){let im=DIM[k];if(!im){im=DIM[k]=new Image();im.src=""+B64((DIMG[k]||DIMG["🐚"]))}return im.complete&&im.naturalWidth?im:null}
function decBox(d){const im=decImg(d.k),s=(PORT?64:52)*pDepth(decY(d)),ar=im?im.naturalWidth/im.naturalHeight:1,w=ar>=1?s:s*ar,h=ar>=1?s/ar:s;return{w,h,x:d.x*W-w/2,y:decY(d)+8-h}}
function decTxt(k){return DECN[k]||""}
function icon(sp){return '<i class="fi" style="background-image:var(--f-'+sp.id+')"></i>'}
const WATER={koi:"fresh",arowana:"fresh",boxfish:"salt",napo:"salt",neon:"fresh",guppy:"fresh",gold:"fresh",betta:"fresh",clown:"salt",ytang:"salt",btang:"salt",angel:"salt",cichlid:"fresh",lion:"salt",copper:"salt",discus:"fresh",trigger:"salt",mandarin:"salt",idol:"salt",emp:"salt",lantern:"deep",hatchet:"deep",angler:"deep",viper:"deep",oar:"deep",dragon:"deep",tripod:"deep",lancet:"deep",piranha:"river",peacock:"river",bichir:"river",eel:"river",mahseer:"river",gar:"river",goliath:"river",mekong:"river",sturgeon:"river",arapaima:"river"};
const TANKS={fresh:{name:"Tatlı su",icon:"🌿",w:"fresh"},salt:{name:"Tuzlu su",icon:"🌊",w:"salt",lv:3,cost:400,info:"Palyaço, Cerrahlar, Melekler ve resif balıkları burada yaşar"},deep:{name:"Derin Okyanus",icon:"🌌",w:"deep",lv:35,cost:15000,info:"Işığın ulaşmadığı derinlikler · hep gece · ışıklı balıklar canlı yemle beslenir"},river:{name:"Kadim Nehir",icon:"🌳",w:"river",lv:25,cost:8000,info:"Amazon'un sular altındaki ormanı · dev nehir canavarları burada yaşar · gündüz ve gece"},cfresh:{name:"Koleksiyon",icon:"🏺",w:"salt",coll:true,lv:4,cost:500,info:"Tatlı ve tuzlu su balıkları bir arada · 30 balık · bakım, gelir ve büyüme yok"},coll2:{name:"Büyük Koleksiyon",icon:"🏛️",w:"fresh",coll:true,lv:15,cost:3000,info:"İkinci vitrin · her sudan 30 balık · bakım, gelir ve büyüme yok"}};
const TKEYS=["fresh","salt","river","deep","cfresh","coll2"];
const SMALL=["neon","guppy"];
const COMPAT={betta:"Erkek Bettalar kavga eder; tankta tek Betta tut.",gold:"Küçük balıkları (Neon, Gupi) kovalar.",neon:"Japon Balığı varken korkar ve yavaş büyür.",guppy:"Japon Balığı varken korkar ve yavaş büyür."};
function tw(k){return (TANKS[k]||TANKS.fresh).w}
function isColl(k){return !!(TANKS[k]&&TANKS[k].coll)}
// sürüm 133: küçük dekorlar her tankın kendisine ait (state.decor = açık tankınki, diğerleri stash[k].decor)
function swapTo(k){const o=state.stash[k];if(!o)return false;const f=state.fish,d=state.dirt,dc=state.decor||[],a=state.tank;state.fish=o.fish;state.dirt=o.dirt;state.decor=Array.isArray(o.decor)?o.decor:[];state.tank=k;delete state.stash[k];state.stash[a]={fish:f,dirt:d,decor:dc};return true}
function tankDecor(k){return state.tank===k?state.decor||[]:(state.stash[k]&&state.stash[k].decor)||[]}
// özel dekorlar (etkileri her tankta geçerli) tatlı/tuzlu su ortamına göre çizildi; Kadim Nehir ve Derin Okyanus'ta görünmez
function propsHere(){const w=curWater();return w!=="river"&&w!=="deep"}
const DECW={river:["r1","r2","r3","r4","r5","r6","r7","🪨"],deep:["d1","d2","d3","d4","d5","d6","d7"]};function decorPool(){return DECW[tw(state.tank)]||DECOR0}
// derin okyanus dekorlarının ışığı (karanlık katmanda delik açar ve parlar)
const DGLOW={d2:[255,120,50],d3:[90,220,255],d5:[255,190,90],d6:[255,90,70],d7:[90,150,255]};
function allFish(){let a=state.fish;for(const k in state.stash)a=a.concat(state.stash[k].fish);return a}
function workFish(){let a=isColl(state.tank)?[]:state.fish;for(const k in state.stash)if(!isColl(k))a=a.concat(state.stash[k].fish);return a}
function hasTank(k){return state.tank===k||!!state.stash[k]}
function fishCap(k){return state.admNoCap?99:TANKS[k]&&TANKS[k].coll?30:20+2*((state.capUp||{})[k]||0)}
function tankArr(k){return state.tank===k?state.fish:(state.stash[k]?state.stash[k].fish:null)}
function tankDirt(k){return state.tank===k?state.dirt:(state.stash[k]?state.stash[k].dirt:0)}
const STATUS={water:["😣","yanlış su!"],fight:["⚔️","kavga ediyor"],scared:["😨","korkuyor"]};
// genetik: gizli çekinik gen (taşıyıcı) + görünen mutasyon
const GENES=["albino","transparent","melanistic","gold","glitch"];
function rollGene(){if(Math.random()<.002)return"gold";const r=Math.random(),dk=ev("dark")?3:1;if(r<.01*dk)return"melanistic";if(r<.01*dk+.04)return"transparent";if(r<.01*dk+.16)return"albino";return null}
function allele(p){if(p.h&&p.m&&p.m!=="normal")return Math.random()<.87?(Math.random()<.5?p.m:p.h):null;if(p.m&&p.m!=="normal")return Math.random()<.87?p.m:null;if(p.g)return Math.random()<.5?p.g:null;return null}
function geneKnown(f){return(f.mutation&&f.mutation!=="normal")||!!f.geneKnown}
function geneText(f){if(hybOf(f))return"🧬 Hibrit: "+hybName(f);if(f.mutation&&f.mutation!=="normal")return"🧬 "+MUTS[f.mutation].name+" (görünen)";if(!f.geneKnown)return"🧬 genler bilinmiyor";return f.gene?"🧬 "+MUTS[f.gene].name+" taşıyıcı":"🧬 taşıyıcı değil"}
function passP(f,g){if(hybOf(f))return g===f.mutation||g===f.hyb?.435:0;if(f.mutation===g)return .87;if(f.mutation&&f.mutation!=="normal")return 0;return f.gene===g?.5:0}
function oddsText(a,b){if(!a||!b)return"";if(!geneKnown(a)||!geneKnown(b))return"Ebeveynlerden birinin genleri bilinmiyor. Genetik test yaptırırsan olasılıkları görürsün.";const parts=GENES.map(g=>[g,passP(a,g)*passP(b,g)]).filter(x=>x[1]>0).map(x=>MUTS[x[0]].icon+" "+MUTS[x[0]].name+" %"+Math.round(x[1]*100));let hy=0;for(const g1 of HYB_T)for(const g2 of HYB_T)if(g1!==g2)hy+=passP(a,g1)*passP(b,g2);hy*=hybOf(a)&&hybOf(b)?.4:.2;if(hy>=.005)parts.push("🧬 Hibrit %"+Math.max(1,Math.round(hy*100)));return parts.length?"Yavru şansı: "+parts.join(" · "):"Bu çiftten mutasyon kalıtılmaz; yalnızca kendiliğinden mutasyon şansı var."}
// boy mutasyonu: renk mutasyonundan bağımsız; bir balık hem Dev hem Albino olabilir
const SIZES={normal:{n:"Normal",m:1,v:1},dwarf:{n:"Cüce",icon:"🔹",tier:"Nadir",m:.72,v:1.4,p:.04},giant:{n:"Dev",icon:"🔶",tier:"Çok nadir",m:1.38,v:1.8,p:.025}};
function rollSize(){const r=Math.random();if(r<SIZES.giant.p)return"giant";if(r<SIZES.giant.p+SIZES.dwarf.p)return"dwarf";return"normal"}
function inheritSize(a,b){a=SIZES[a]?a:"normal";b=SIZES[b]?b:"normal";if(a!=="normal"&&a===b)return Math.random()<.6?a:rollSize();for(const z of [a,b])if(z!=="normal"&&Math.random()<.35)return z;return rollSize()}
const szOf=f=>SIZES[f.sizeTrait]?f.sizeTrait:"normal";
function fsz(f){return(25+Math.min(1.4,f.age)*16)*(1+(f.sizeGrowth||0))*SIZES[szOf(f)].m}
const FWC=new WeakMap();// sürüm 117: kalabalık tankta balıklar üst üste yığılmasın diye hepsi birlikte biraz küçülür (en fazla %22, yavaşça)
let CRK=1,crkT=0,crkA=null;
function crkStep(now){if(now-crkT<1000&&crkA===state.fish)return;crkT=now;let a=0;for(const f of state.fish){if(f.dead)continue;const w=fishW0(f);a+=w*w*.5}const A=W*(FLOOR-70),cov=a/A,tg=cov>.28?Math.max(.78,Math.sqrt(.28/cov)):1;if(crkA!==state.fish){crkA=state.fish;CRK=tg}else CRK+=Math.max(-.03,Math.min(.03,tg-CRK))}
function fishW(f){return fishW0(f)*CRK}
function fishW0(f){const q=FWC.get(f);if(q&&q.a===f.age&&q.g===f.sizeGrowth&&q.m===f.mutation&&q.z===f.sizeTrait&&q.t===f.type)return q.w;const s=getSpecies(f.type),m=MUTS[f.mutation]&&f.mutation!=="normal"?f.mutation:"",c=CMS[f.type]||[10,1],v=Math.min(s.wmax?s.wmax*1.35:200,Math.min(s.wmax||150,58*Math.pow(c[0]/3.5,.3)*c[1]*(25+Math.min(1.15,f.age)*16)/41*(1+.33*(f.sizeGrowth||0)))*SIZES[szOf(f)].m)*(m&&MUTW[m+"_"+f.type]||1);FWC.set(f,{a:f.age,g:f.sizeGrowth,m:f.mutation,z:f.sizeTrait,t:f.type,w:v});return v}
function fishH(f){const im=fishImgs[f.type];return fishW(f)*(im&&im.naturalWidth?im.naturalHeight/im.naturalWidth:.75)}
function fext(f){return Math.max(fsz(f),fishW(f)*.4)}
function sizeNote(f,s){const z=szOf(f);if(z==="normal")return;Q("size_"+z);sfx("rare");setTimeout(()=>notify(SIZES[z].icon+" "+SIZES[z].tier+" boy mutasyonu: "+SIZES[z].n+" "+s.name+" ("+SIZES[z].m+"x)"),z==="giant"?1700:1500)}
const MUT_IMG={glitch:{neon:"a/5ccf6bbdc9ac8a40.webp",guppy:"a/729c5ee54b231446.webp",gold:"a/195e08e6e37ad21b.webp",betta:"a/3b9d5b26ee619613.webp",cichlid:"a/424edf504e9f229b.webp",arowana:"a/b6f6741b79348722.webp",discus:"a/2f24dcd1bbac3d59.webp",koi:"a/47f6a77cb9e998a7.webp",copper:"a/423062f29d52dcf6.webp",mandarin:"a/10ee6bb43bf46b18.webp",clown:"a/45e0774354176f72.webp",ytang:"a/2da75dd5f88c98b5.webp",btang:"a/1b491678d5f78817.webp",angel:"a/b755185b6c54b199.webp",lion:"a/67341d2228b824d0.webp",trigger:"a/7365117c968a373d.webp",boxfish:"a/de55908ee1ef2562.webp",idol:"a/22c5b2925d4514cc.webp",emp:"a/b9b440a8c5f4486e.webp",napo:"a/7168262bf1f2657c.webp"},
albino:{koi:"a/05ba4ef6aded59f3.webp",arowana:"a/967664b78bd00ec5.webp",boxfish:"a/7f5611d3eb335f86.webp",napo:"a/598ee81572c4b3de.webp",cichlid:"a/e77c71f3b272500d.webp",lion:"a/c8f0277b71f7c967.webp",copper:"a/d22eb021c94e9d3f.webp",discus:"a/9330cd696a9571d8.webp",trigger:"a/b0e7fe8692f031bd.webp",mandarin:"a/a4011c439ea6b41a.webp",idol:"a/cdc87e9ffd1690db.webp",emp:"a/fa20f149409254f5.webp",clown:"a/335777f673135900.webp",ytang:"a/b4702966c95b6aed.webp",btang:"a/089113d77ed7d5cb.webp",angel:"a/b80d63db02f18c3a.webp",neon:"a/733e39bea319833a.webp",guppy:"a/65dd92ad4927ff0d.webp",gold:"a/d3704f3ae758c331.webp",betta:"a/a887090d634816c7.webp"},
transparent:{koi:"a/e3be9c4896e1d9d9.webp",arowana:"a/79a4c9f91188cea9.webp",boxfish:"a/e5593386e212e199.webp",napo:"a/3005158f65716847.webp",cichlid:"a/eda76634a4edca46.webp",lion:"a/d679fc3bd70be226.webp",copper:"a/750c90580cc2d17a.webp",discus:"a/fb38945c092b8007.webp",trigger:"a/4e402f3931958e1c.webp",mandarin:"a/16c69a0e42345a73.webp",idol:"a/7a2641518e7d2c4c.webp",emp:"a/1e06b06e371d7dc6.webp",clown:"a/1f2a74ea65b41793.webp",ytang:"a/1fc84b50fc329197.webp",btang:"a/3a8f6ddf3d85d3c8.webp",angel:"a/c3ce0711d077e1ed.webp",neon:"a/742911c3ce4eb8e6.webp",guppy:"a/ca5a35ad92f18534.webp",gold:"a/245689b85ef8358c.webp",betta:"a/e876aea711045d84.webp"},
melanistic:{koi:"a/81ae5a2c230b0e6b.webp",arowana:"a/922f130102424fa9.webp",boxfish:"a/f522f804cbc97213.webp",napo:"a/d0135da488e8b981.webp",cichlid:"a/2fc017ad8dc899f6.webp",lion:"a/8cb6d5f512f775d7.webp",copper:"a/36524d423c42e4a4.webp",discus:"a/76e58b71fbb64760.webp",trigger:"a/728544f71420e182.webp",mandarin:"a/d16271514e88d3d4.webp",idol:"a/4377f3c86d558267.webp",emp:"a/2e973f3e228d8ab4.webp",clown:"a/517928b4cd01145c.webp",ytang:"a/7dce061fc3da2302.webp",btang:"a/e68563a3cd56ad10.webp",angel:"a/09fe529631271a45.webp",neon:"a/f0aa9cbc47b049f3.webp",guppy:"a/bce78d25ae2ea4ec.webp",gold:"a/2972a32edd7caf3f.webp",betta:"a/04bef06ecbb105bc.webp"},
gold:{neon:"a/a8129ec8eeba5c99.webp",guppy:"a/44d06b4e5a0578fb.webp",gold:"a/98f7d2443de017b1.webp",betta:"a/155562b41e4de49e.webp",cichlid:"a/b0b19f42a00fd96e.webp",arowana:"a/dc65b79dbdbd59f0.webp",discus:"a/ca7758e9b294fc5d.webp",koi:"a/07a4e595ed650158.webp",clown:"a/bf03314e2936df3a.webp",ytang:"a/d64b598b4ee8cdc8.webp",btang:"a/4bede573690e2ae2.webp",angel:"a/665b3f5ac3185447.webp",lion:"a/6345e745406b3556.webp",copper:"a/4d7b527f3102d349.webp",trigger:"a/cf84d4e4a4389f87.webp",boxfish:"a/3f26e4b7cb0fa803.webp",mandarin:"a/702f0363aba541d2.webp",idol:"a/86b175101a604ccf.webp",emp:"a/d2cd1b17bc652d0a.webp",napo:"a/03d4101a9b0105ab.webp"},
};
// Mutasyonlar: en nadirden başlayarak birbirini dışlayan tek zar
const MUTS={normal:{name:"Normal",tier:"",p:0,mult:1},albino:{name:"Albino",tier:"Nadir",p:.05,mult:2,glow:"rgba(255,205,225,.95)",blur:12,icon:"🤍"},transparent:{name:"Transparan",tier:"Çok nadir",p:.01,mult:4,glow:"rgba(190,240,255,.95)",blur:10,icon:"🔮"},melanistic:{name:"Melanistik",tier:"Efsanevi",p:.002,mult:6,glow:"rgba(120,150,255,.9)",blur:9,icon:"🖤"},gold:{name:"Altın",tier:"Mitik",p:.0004,mult:15,glow:"rgba(255,214,90,.95)",blur:14,icon:"👑"}};
MUTS.glitch={name:"Glitch",tier:"Bozuk Veri",p:.0002,mult:30,glow:"rgba(255,40,220,.9)",blur:12,icon:"👾"};
function rollMutation(){if(Math.random()<MUTS.glitch.p)return"glitch";if(Math.random()<MUTS.gold.p)return"gold";const r=Math.random(),dk=ev("dark")?3:1,pm=MUTS.melanistic.p*dk,pt=MUTS.transparent.p*dk,pa=MUTS.albino.p*(ev("weekend")?2:1);if(r<pm)return"melanistic";if(r<pm+pt)return"transparent";if(r<pm+pt+pa)return"albino";return"normal"}
function mutOK(t){return !!MUT_IMG.albino[t]}
function noMut(f){if(f&&!mutOK(f.type)){f.mutation="normal";f.gene=null;delete f.hyb}return f}
const MSP=()=>species.filter(s=>mutOK(s.id)),BASESP=species.filter(s=>!s.deep&&!s.river).map(s=>s.id);
const DEEP_MUT={"albino":{"lantern":"a/3a860fff8aa130ab.webp","hatchet":"a/c1c72c865770b94d.webp","angler":"a/08722fd71ff296a6.webp","viper":"a/01b22de6948f7c44.webp","oar":"a/1510c16c7e0c7363.webp","dragon":"a/b652cadccccb94ed.webp"},"transparent":{"lantern":"a/168eaaad7e94b969.webp","hatchet":"a/1675ce8ffd0b65ec.webp","angler":"a/9c06b8563d171afa.webp","viper":"a/fdc9915953aaed60.webp","oar":"a/13edcea27ac95832.webp","dragon":"a/069bd8bb40a181d0.webp"},"melanistic":{"lantern":"a/7f6975d3b849f572.webp","hatchet":"a/64c75a7cb596f648.webp","angler":"a/851eb2c799627702.webp","viper":"a/aebab903eaaca232.webp","oar":"a/56f445f7dadcff64.webp","dragon":"a/c3904d63b4076760.webp"},"gold":{"lantern":"a/91f40f2c2267dd42.webp","hatchet":"a/d12b0e5ecf4e847e.webp","angler":"a/7633cd962c66ca45.webp","viper":"a/c55e6a0fdcf928c0.webp","oar":"a/a3b8a4b8a5b5ed72.webp","dragon":"a/4d2e9cb564c82b66.webp"},"glitch":{"lantern":"a/accbd76c50219b69.webp","hatchet":"a/7dca6032f4130ccc.webp","angler":"a/0c9b1369dcca26c3.webp","viper":"a/786878f9e676374e.webp","oar":"a/640a18d65ea4a56e.webp"}};Object.assign(DEEP_MUT.albino,{tripod:"a/aaf19430a0c56d65.webp",lancet:"a/c520fb475158f01a.webp"});Object.assign(DEEP_MUT.transparent,{tripod:"a/1ea2022c032bc064.webp",lancet:"a/aa1aa6ec26451730.webp"});Object.assign(DEEP_MUT.melanistic,{tripod:"a/5fbc77d3dac853f1.webp",lancet:"a/caa87c3487dc6de6.webp"});Object.assign(DEEP_MUT.gold,{tripod:"a/f7854dafe949da56.webp",lancet:"a/70227aac87a6299f.webp"});Object.assign(DEEP_MUT.glitch,{dragon:"a/74987a311999d93e.webp",tripod:"a/6d9b7257e8c355c3.webp",lancet:"a/0513102fb52548ed.webp"});for(const m in DEEP_MUT)Object.assign(MUT_IMG[m]||(MUT_IMG[m]={}),DEEP_MUT[m]);
// sürüm 131: Kadim Nehir balıklarının mutasyon görselleri ve genişlik düzeltmeleri
const RIVER_MUT={"albino":{"piranha":"a/9410fc8440179f7a.webp","peacock":"a/13acf26ea3b3201c.webp","bichir":"a/fc9c35b8feedc7e3.webp","eel":"a/d412d66455ba0d2f.webp","mahseer":"a/df901e913fead784.webp","gar":"a/2eedc74b85b668df.webp","arapaima":"a/c4304ed67f9bce75.webp","goliath":"a/9ff3583465fcdf33.webp","mekong":"a/765961f1f27b4ddb.webp","sturgeon":"a/eafe534eb505bb04.webp"},"transparent":{"piranha":"a/8427f7958e453fd1.webp","peacock":"a/1fa6c64c03492e2d.webp","bichir":"a/e5c90853349e6d57.webp","eel":"a/51fd46569ba9673a.webp","mahseer":"a/2b9fc300e3c0b061.webp","gar":"a/1345aacd63df8e19.webp","arapaima":"a/739cc9fdd2327b39.webp","goliath":"a/aaeb0373f94aebe3.webp","mekong":"a/3a1afa2d36e95807.webp","sturgeon":"a/bc8c4afe964427f7.webp"},"melanistic":{"piranha":"a/9435fee21ae0e027.webp","peacock":"a/57432ddb88c6d9d2.webp","bichir":"a/18a8dc239d001b81.webp","eel":"a/f854b9eda6056ba8.webp","mahseer":"a/68edac913584575a.webp","gar":"a/ad248751096eb871.webp","arapaima":"a/5354b40105d0a1fd.webp","goliath":"a/973e50d9eb5ee95c.webp","mekong":"a/8aabb2dac771ef59.webp","sturgeon":"a/78331580aa5e7764.webp"},"gold":{"piranha":"a/c2c1de1d4b41ae7f.webp","peacock":"a/893aea28d5f9c460.webp","bichir":"a/6c03921c032cfa16.webp","eel":"a/974dd51d95e357d4.webp","mahseer":"a/ce8381c263e90069.webp","gar":"a/2a69e20b76b5a8c7.webp","arapaima":"a/f412bd0e83ca76c7.webp","goliath":"a/cb683720f03c15e1.webp","mekong":"a/0642fd7b0b3d7d6f.webp","sturgeon":"a/8628913378e915fc.webp"},"glitch":{"piranha":"a/8ce16624282b52b8.webp","peacock":"a/47ca0d162248fd0e.webp","bichir":"a/a8dddea45c61f61c.webp","eel":"a/437cd22998bd903f.webp","mahseer":"a/c981e0852715ed7c.webp","gar":"a/cbf34ea7f2c5a562.webp","arapaima":"a/ae7d9d878f0a0fc4.webp","goliath":"a/9a31f1ef7806a8bf.webp","mekong":"a/c55fc8e9b10a3397.webp","sturgeon":"a/c01b433e5d7af24b.webp"}};for(const m in RIVER_MUT)Object.assign(MUT_IMG[m]||(MUT_IMG[m]={}),RIVER_MUT[m]);Object.assign(MUTW,{"albino_piranha":1.008,"transparent_piranha":1.011,"melanistic_piranha":1.011,"gold_piranha":1.005,"glitch_piranha":1.005,"albino_peacock":1.009,"transparent_peacock":1.011,"melanistic_peacock":1.009,"gold_peacock":1.007,"glitch_peacock":1.011,"albino_bichir":1.007,"transparent_bichir":1.005,"melanistic_bichir":1.007,"gold_bichir":1.007,"glitch_bichir":1.013,"albino_eel":1.007,"transparent_eel":1.005,"melanistic_eel":1.007,"gold_eel":1.005,"glitch_eel":1.007,"albino_mahseer":1.008,"transparent_mahseer":1.008,"melanistic_mahseer":1.006,"gold_mahseer":1.012,"glitch_mahseer":1.042,"albino_gar":1.008,"transparent_gar":1.006,"melanistic_gar":1.005,"gold_gar":1.005,"glitch_gar":1.009,"albino_arapaima":1.005,"transparent_arapaima":1.003,"melanistic_arapaima":1.005,"gold_arapaima":1.005,"glitch_arapaima":1.002,"albino_goliath":1.016,"transparent_goliath":1.013,"melanistic_goliath":1.013,"gold_goliath":1.009,"glitch_goliath":1.026,"albino_mekong":1.01,"transparent_mekong":1.008,"melanistic_mekong":1.008,"gold_mekong":1.01,"glitch_mekong":1.012,"albino_sturgeon":1.009,"transparent_sturgeon":1.009,"melanistic_sturgeon":1.008,"gold_sturgeon":1.009,"glitch_sturgeon":1.013});Object.assign(MUTW,{"albino_lantern":1.0,"albino_hatchet":1.0,"albino_angler":1.0,"albino_viper":0.998,"albino_oar":1.0,"albino_dragon":1.027,"transparent_lantern":1.006,"transparent_hatchet":1.0,"transparent_angler":0.998,"transparent_viper":1.002,"transparent_oar":1.0,"transparent_dragon":1.016,"melanistic_lantern":1.0,"melanistic_hatchet":1.0,"melanistic_angler":1.005,"melanistic_viper":1.005,"melanistic_oar":1.0,"melanistic_dragon":1.021,"gold_lantern":1.003,"gold_hatchet":1.0,"gold_angler":1.014,"gold_viper":1.002,"gold_oar":1.0,"gold_dragon":1.02,"glitch_lantern":1.009,"glitch_hatchet":1.063,"glitch_angler":1.083,"glitch_viper":1.025,"glitch_oar":1.015});
const mutImgs={};
// sürüm 125: ikinci resimler — Üç Ayaklı Balık dururken (yüzgeç ışınları ayak gibi açık), Mızrak Balığı'nın sırt yelkeni (ayrı parça)
const ALTSRC={tripod:{normal:"a/21d47bcb3f8d2bc3.webp",albino:"a/c84aaa67db90ac48.webp",transparent:"a/53370e4ff4218464.webp",melanistic:"a/2fb84af09fa5005b.webp",gold:"a/99cee68155fe3a62.webp",glitch:"a/372e4642e7f190f2.webp"},sail:{normal:"a/b9726cf0abefcb45.webp",albino:"a/c2e95599fa92c8a8.webp",transparent:"a/7cf1e206c4060462.webp",melanistic:"a/b7969673e4751341.webp",gold:"a/5807ca5ce4a4414a.webp",glitch:"a/222c54d3a65574d9.webp"}},ALTI={};
function altImg(g,m){const S=ALTSRC[g];if(!S)return null;const k=g+"_"+(S[m]?m:"normal");let im=ALTI[k];if(!im){im=ALTI[k]=new Image();im.src=""+B64(S[S[m]?m:"normal"])}return im.complete&&im.naturalWidth?im:null}

for(const m in MUT_IMG)for(const sid in MUT_IMG[m]){const u=""+B64(MUT_IMG[m][sid]);document.documentElement.style.setProperty("--m-"+m+"-"+sid,'url("'+u+'")');if(m==="glitch")continue;const im=new Image();im.src=u;mutImgs[m+"_"+sid]=im}
function mutOf(f){return MUTS[f.mutation]?f.mutation:"normal"}
// ===== Hibrit mutasyon (sürüm 123)
// Farklı mutasyon geni taşıyan iki ebeveynin yavrusu nadiren iki mutasyonu birden taşır (ör. Albino × Melanistik).
// Balığın ön yarısı üst mutasyonun, arka yarısı diğerinin renginde çizilir. Glitch hibrit olmaz.
const HYB_T=["albino","transparent","melanistic","gold"];
function hybOf(f){const m=mutOf(f),h=f&&f.hyb;return m!=="normal"&&h&&h!==m&&HYB_T.includes(h)&&HYB_T.includes(m)?h:null}
function hybPair(a,b){return HYB_T.indexOf(a)>=HYB_T.indexOf(b)?[a,b]:[b,a]}
function hybName(f){const h=hybOf(f);return h?MUTS[mutOf(f)].name+" × "+MUTS[h].name:""}
function mutMult(f){const m=MUTS[mutOf(f)]||MUTS.normal,h=hybOf(f);if(!h)return m.mult;const a=m.mult,b=MUTS[h].mult;return Math.round((Math.max(a,b)*1.5+Math.min(a,b))*10)/10}
const HYBI={};
function hybImg(f,sid){const h=hybOf(f),m=mutOf(f);if(!h)return null;const k=m+"_"+h+"_"+sid;let o=HYBI[k];if(o!==undefined)return o&&o.complete&&o.naturalWidth?o:null;const A=mutImgs[m+"_"+sid],B=mutImgs[h+"_"+sid];if(!A||!B||!A.complete||!B.complete||!A.naturalWidth||!B.naturalWidth)return null;
 o=null;try{const w=A.naturalWidth,hh=A.naturalHeight,c=document.createElement("canvas");c.width=w;c.height=hh;const x=c.getContext("2d");x.drawImage(A,0,0);
  const t=document.createElement("canvas");t.width=w;t.height=hh;const y=t.getContext("2d");y.drawImage(B,0,0,w,hh);y.globalCompositeOperation="destination-in";const g=y.createLinearGradient(0,0,w,0);g.addColorStop(0,"rgba(0,0,0,1)");g.addColorStop(.38,"rgba(0,0,0,1)");g.addColorStop(.62,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,0)");y.fillStyle=g;y.fillRect(0,0,w,hh);
  x.globalCompositeOperation="source-atop";x.drawImage(t,0,0);o=new Image();o.src=c.toDataURL("image/png")}catch(e){o=null}HYBI[k]=o;return null}
function fishIcon(f){const m=mutOf(f);if(m==="normal")return icon(getSpecies(f.type));const hi=hybOf(f)?hybImg(f,f.type):null;return hi?'<i class="fi" style="background-image:url(\''+hi.src+'\')"></i>':'<i class="fi" style="background-image:var(--m-'+m+'-'+f.type+')"></i>'}
function mutTag(f){const z=szOf(f);return (z!=="normal"?' <span class="pill sz-'+z+'">'+SIZES[z].icon+" "+SIZES[z].n+" · "+SIZES[z].m+"x</span>":"")+mutTag0(f)}
function mutTag0(f){const m=mutOf(f),h=hybOf(f);if(h)return ' <span class="pill mut-hyb">'+MUTS[m].icon+MUTS[h].icon+" "+hybName(f)+" · Hibrit</span>";return m==="normal"?"":' <span class="pill mut-'+m+'">'+MUTS[m].icon+" "+MUTS[m].name+" · "+MUTS[m].tier+"</span>"}
function mutNote(f,s){const m=mutOf(f);if(m==="normal")return;{const h=hybOf(f);if(h){const k="hyb_"+[m,h].sort().join("+")+"_"+f.type;if(!state.mutsFound.includes(k)){state.mutsFound.push(k);state.gems+=5;addXP(60)}setTimeout(()=>{goldFx();notify("🧬 HİBRİT! "+hybName(f)+" "+s.name+" doğdu! Değeri "+mutMult(f)+" kat ✨")},800);sfx("legend");return}}if(!state.mutsFound.includes(m+"_"+f.type)){state.mutsFound.push(m+"_"+f.type);state.gems+=m==="glitch"?20:m==="gold"?10:m==="melanistic"?3:m==="transparent"?1:0;addXP(40);setTimeout(checkAch,1500)}
if(m==="melanistic"){setTimeout(()=>notify("🖤 EFSANEVİ! Melanistik "+s.name+" doğdu! Değeri 6 kat ✨"),900);sfx("legend")}
if(m==="glitch"){setTimeout(()=>{sfx("crash");glitchFx();notify("👾 BOZUK VERİ! GLITCH "+s.name.toLocaleUpperCase("tr-TR")+"! Değeri 30 kat ⚡")},700)}
else if(m==="gold"){setTimeout(()=>{goldFx();notify("👑 MİTİK! ALTIN "+s.name.toLocaleUpperCase("tr-TR")+"! Değeri 15 kat ✨")},700);sfx("legend")}
else{sfx("rare");}if(m!=="melanistic"&&m!=="glitch")setTimeout(()=>notify(MUTS[m].icon+" "+MUTS[m].tier+" mutasyon: "+MUTS[m].name+" "+s.name+"!"),900)}
function pop(x,y,n){for(let i=0;i<n&&bubbles.length<90;i++)bubbles.push({x,y,r:rand(2,5),speed:rand(20,40),drift:rand(-6,6),alpha:.3,phase:rand(0,7)})}
let bubbles=[],particles=[],last=performance.now(),messageTimer;
function rand(a,b){return a+Math.random()*(b-a)}
function lokEk(n){n=Math.abs(Math.round(+n||0));if(!n)return"'da";if(n%10)return["","'de","'de","'te","'te","'te","'da","'de","'de","'da"][n%10];if(n%100)return["","'da","'de","'da","'ta","'de","'ta","'te","'de","'da"][(n/10|0)%10];return"'de"}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c])}
let VISIT=null;
let tapInfo=null,LV=null,DN=null;
const YS=.375;function yasOf(f){return f.age<1?0:Math.min(3,1+Math.floor((f.sizeGrowth||0)/YS+1e-6))}
function yasPct(f){if(f.age<1)return f.age;const y=(f.sizeGrowth||0)/YS;return y>=2?1:y-Math.floor(y)}
function yasTxt(f){if(f.age<1)return stageOf(f)+" · büyüme %"+Math.round(f.age*100);const n=yasOf(f);return n>=3?"3 yaş · tam boy":n+" yaş · "+(n+1)+". yaşa %"+Math.round(yasPct(f)*100)}
function boyOf(f){return((1+.33*(f.sizeGrowth||0))*SIZES[szOf(f)].m).toFixed(2)}
function stageOf(f){return f.age<.35?"Yavru":f.age<MATURE?"Genç":"Yetişkin"}
function rrect(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function drawTapInfo(){if(!tapInfo){TIBTN=null;return}const left=tapInfo.until-performance.now();if(left<=0){tapInfo=null;TIBTN=null;return}const f=state.fish.find(x=>x.id===tapInfo.id);if(!f){tapInfo=null;return}
const s=getSpecies(f.type),z=szOf(f),m=mutOf(f),boy=boyOf(f),adult=f.age>=1,pct=adult?yasPct(f):Math.min(1,f.age);
const tags=[z!=="normal"?SIZES[z].icon+" "+SIZES[z].n:"",m!=="normal"?MUTS[m].icon+" "+MUTS[m].name:"",f.rarity==="Nadir"?"✨ Parlak":""].filter(Boolean).join("  ");
const bw=228,bh=tags?104:86,fx=f.x*W,fy=f.y*H,x=Math.max(8,Math.min(W-bw-8,fx-bw/2)),above=fy-fext(f)-bh-14>H*.15,y=above?fy-fext(f)-bh-14:fy+fext(f)+14;
ctx.save();ctx.globalAlpha=Math.min(1,left/350);ctx.shadowColor="rgba(0,20,40,.35)";ctx.shadowBlur=12;ctx.fillStyle="rgba(255,253,244,.96)";rrect(x,y,bw,bh,14);ctx.fill();ctx.shadowBlur=0;
ctx.fillStyle="rgba(255,253,244,.96)";ctx.beginPath();const tx=Math.max(x+18,Math.min(x+bw-18,fx));if(above){ctx.moveTo(tx-8,y+bh-1);ctx.lineTo(tx+8,y+bh-1);ctx.lineTo(tx,y+bh+9)}else{ctx.moveTo(tx-8,y+1);ctx.lineTo(tx+8,y+1);ctx.lineTo(tx,y-9)}ctx.fill();
ctx.textAlign="left";ctx.fillStyle="#1d5a73";ctx.font="800 15px system-ui,sans-serif";let nm=f.name||s.name;while(ctx.measureText(nm).width>bw-84&&nm.length>3)nm=nm.slice(0,-2);ctx.fillText(nm,x+12,y+22);
ctx.font="700 12px system-ui,sans-serif";ctx.fillStyle="#2b6b82";ctx.fillText(yasTxt(f),x+12,y+41);
ctx.fillStyle="#dcecef";rrect(x+12,y+49,bw-24,9,4.5);ctx.fill();const g=ctx.createLinearGradient(x+12,0,x+bw-12,0);g.addColorStop(0,"#7ce2bc");g.addColorStop(1,"#ffd16e");ctx.fillStyle=g;if(pct>.02){rrect(x+12,y+49,(bw-24)*pct,9,4.5);ctx.fill()}
ctx.fillStyle="#2b6b82";ctx.font="700 12px system-ui,sans-serif";drawEmo(ctx,"Boy "+boy+"x"+(VISIT?"":" · 🍽️ "+Math.round(f.hunger)+" · ❤️ "+Math.round(f.health)+" · "+saleValue(f)+" 🪙"),x+12,y+76,12);
if(tags){ctx.font="800 12px system-ui,sans-serif";ctx.fillStyle="#8a4fbf";drawEmo(ctx,tags,x+12,y+95,12)}if(!VISIT&&f.id>=0){const bx=x+bw-62,by=y+8;ctx.fillStyle="#1d5a73";rrect(bx,by,54,22,11);ctx.fill();ctx.fillStyle="#fff";ctx.font="800 11px system-ui,sans-serif";drawEmo(ctx,"✏️ İsim",bx+7,by+15,11);TIBTN={x:bx-6,y:by-6,w:66,h:34,id:f.id}}else TIBTN=null;ctx.restore()}
// ---------- seviye atlama ekranı
const LV_UNLOCK={2:"🔓 Görevler, 🎡 günlük çark ve 🪸 dekorasyon açıldı",3:"🔓 🗺️ Harita açıldı · 🌊 Tuzlu su tankını açabilirsin",4:"🔓 🥚 Üretim ve ekipman açıldı · tank kapasitesini büyütebilirsin",5:"Daha nadir mutasyonlar için genetik test ve çiftleştirmeyi dene",10:"Akvaryum ustası unvanına ulaştın!",35:"🔓 🌌 Derin Okyanus tankını açabilirsin · ilk balık: Fener Hamsisi",36:"🔓 🌌 Balta Balığı açıldı",37:"🔓 🌌 Fener Balığı açıldı",39:"🔓 🌌 Engerek Balığı açıldı",42:"🔓 🌌 Kürek Balığı açıldı",46:"🔓 🐉 Efsanevi Derinlik Ejderi açıldı!"};
function gemSum(a,b){let s=0;for(let l=a+1;l<=b;l++)s+=lvGems(l);return s}
function showLevelUp(lv,coins,gm){LV={lv,t0:performance.now()};$("lvNum").textContent=lv;$("lvReward").textContent="+"+coins+" 🪙 · +"+(gm==null?lvGems(lv):gm)+" 💎";$("lvNext").textContent=LV_UNLOCK[lv]||("Sonraki seviye için "+xpNeed(lv).toLocaleString("tr-TR")+" XP");$("lvl").hidden=false;$("lvl").classList.remove("go");void $("lvl").offsetWidth;$("lvl").classList.add("go");sfx("level");
for(let i=0;i<70;i++)particles.push({x:W/2+rand(-40,40),y:H*.42,vx:rand(-260,260),vy:rand(-420,-120),life:rand(1.6,2.6),type:"confetti",c:["#ffd34d","#7ce2bc","#ff8fb1","#8a5cff","#5cc8ff"][i%5],r:rand(0,6),vr:rand(-8,8)})}
function closeLevelUp(){$("lvl").hidden=true;LV=null}
// ---------- gece/gündüz geçişi
function nightLbl(){const l=document.querySelector("#nightBtn .tll");if(l)l.textContent=state.night?"Gündüz":"Gece";const b=$("nightBtn");if(b&&b.classList)b.classList.toggle("isn",!!state.night)}
function toggleNight(){if(DN)return;if(deepNow()){notify("🌌 Derin okyanusa güneş ulaşmaz, burası hep gece");return}DN={from:state.night,t0:performance.now()};state.night=!state.night;nightLbl();$("night").textContent=state.night?"☀️ Gündüz modu":"🌙 Gece modu";sfx(state.night?"dusk":"dawn");save(true)}
// ---------- Claude içinde açıldığında: bulut kaydı, komşular, sıralama
let netTry=0;function netRetry(){if(++netTry<=3)setTimeout(()=>{try{netInit();netLabel()}catch(e){}},4000*netTry);try{netLabel()}catch(e){}}
const NET={why:"",pubErr:"",readFail:"",on:false,db:null,user:null,uid:null,busy:false,pend:false,lastAt:0,timer:0,lastPub:"",writeOff:false};
function score(){return state.level*100+state.discovered.length*20+state.mutsFound.length*60+state.props.length*25+allFish().length*5}
// sürüm 123: boyut alanı sadece normal olmayan balıklarda yazılır. Eskiden "undefined" yazılıyordu, Firestore bunu reddettiği için
// tank komşulara hiç yayımlanamıyordu (komşular balıkları göremiyordu).
function snapFish(arr){return arr.slice(0,30).map(f=>{const o={t:f.type,m:f.mutation||"normal",a:Math.round(f.age*100)/100,g:Math.round((f.sizeGrowth||0)*100)/100,r:f.rarity==="Nadir"?1:0,n:String(f.name||"").slice(0,24)},z=szOf(f);if(z!=="normal")o.z=z;if(f.hyb)o.h=f.hyb;return o})}

// ---------- akvariagame.com: Firebase ile bulut kaydı (Claude dışında)
const FB_CFG={apiKey:"AIzaSyBQVGw8Lu0JSoqrxcz_j1ShHbBiPUcZVE8",authDomain:"akvaria-44b60.firebaseapp.com",projectId:"akvaria-44b60",storageBucket:"akvaria-44b60.firebasestorage.app",messagingSenderId:"19211737562",appId:"1:19211737562:web:790bed8a5dff36fd0888e3"};
let FB=null;
function fbOK(){try{return location.protocol==="https:"||window.__fbTest}catch(e){return false}}
function loadJS(src){return new Promise((res,rej)=>{const s=document.createElement("script");s.src=src;s.async=true;s.onload=res;s.onerror=()=>rej(new Error("yüklenemedi"));document.head.appendChild(s)})}
async function fbUse(){if(!window.firebase||!window.firebase.firestore){const B="https://www.gstatic.com/firebasejs/10.14.1/";await loadJS(B+"firebase-app-compat.js");await Promise.all([loadJS(B+"firebase-auth-compat.js"),loadJS(B+"firebase-firestore-compat.js")])}
const fb=window.firebase;if(!fb.apps.length)fb.initializeApp(FB_CFG);const auth=fb.auth(),db=fb.firestore();
try{const rr=await auth.getRedirectResult();if(rr&&rr.user)NET.justLinked=true}catch(e){if(e&&e.code==="auth/credential-already-in-use"&&e.credential){try{await auth.signInWithCredential(e.credential);NET.switched=true}catch(_){}}}
let user=auth.currentUser||await new Promise(r=>{const un=auth.onAuthStateChanged(u=>{un();r(u)})});
if(!user){user=(await auth.signInAnonymously()).user}
FB={fb,auth,db};
const U={id:async()=>auth.currentUser&&auth.currentUser.uid,profiles:async ids=>{const out={};const sn=await Promise.all(ids.slice(0,50).map(id=>db.doc("profiles/"+id).get().catch(()=>null)));sn.forEach((s,i)=>{if(s&&s.exists)out[ids[i]]=s.data()});return out}};
return{u:U,d:db}}
function myName(){const n=String(state.nick||"").trim();if(n)return n;try{const u=FB&&FB.auth.currentUser;if(u&&!u.isAnonymous&&u.displayName)return String(u.displayName).split(" ")[0].slice(0,18);const id=(u&&u.uid)||NET.uid||"";return"Akvaryumcu "+String(id).slice(0,4).toUpperCase()}catch(e){return"Akvaryumcu"}}
function favType(){let b=null,v=-1;for(const f of allFish()){const x=saleValue(f);if(x>v){v=x;b=f.type}}return b||"neon"}
function spSrc(t){try{const sp=getSpecies(t);return sp&&sp.img?B64(sp.img):""}catch(e){return""}}
function fbProfile(){if(!FB||!NET.on)return;try{const u=FB.auth.currentUser;if(!u)return;FB.db.doc("profiles/"+u.uid).set({name:myName(),avatarUrl:u.isAnonymous?"":(u.photoURL||""),av:favType(),lv:state.level}).catch(()=>{})}catch(e){}}
function fbIsGoogle(){try{const u=FB&&FB.auth.currentUser;return!!(u&&!u.isAnonymous)}catch(e){return false}}
async function fbAfterSwitch(){try{const uid=FB.auth.currentUser.uid,sn=await FB.db.doc("data/users/"+uid+"/save").get();NET.uid=uid;if(sn.exists){const c=sn.data(),p=JSON.parse(c.json);if(validSave(p)){const ok=confirm("Bu Google hesabında kayıtlı bir oyun var (Seviye "+(p.level||1)+", "+((p.fish||[]).length)+" balık). O kayıt yüklensin mi?\n\nTamam: hesaptaki kayıt yüklenir, bu cihazdaki ilerleme silinir.\nİptal: bu cihazdaki ilerleme hesaba yazılır.");if(ok){window.__nosave=1;localStorage.setItem("fishvilleClassicSave3",c.json);location.reload();return}}}cloudSave(true);fbProfile();netLabel();notify("☁️ Google hesabına bağlandı")}catch(e){notify("Bağlantı tamamlanamadı")}}
async function fbLink(){if(!FB){notify("Bulut bağlantısı henüz kurulmadı");return}const fb=FB.fb,auth=FB.auth,prov=new fb.auth.GoogleAuthProvider(),u=auth.currentUser;try{if(u&&u.isAnonymous){await u.linkWithPopup(prov);fbProfile();cloudSave(true);netLabel();notify("☁️ Kaydın Google hesabına bağlandı")}else{await auth.signInWithPopup(prov);await fbAfterSwitch()}}catch(e){const c=e&&e.code||"";if(c==="auth/credential-already-in-use"&&e.credential){try{await auth.signInWithCredential(e.credential);await fbAfterSwitch()}catch(_){notify("Giriş yapılamadı")}}else if(c==="auth/popup-blocked"||c==="auth/operation-not-supported-in-this-environment"||c==="auth/web-storage-unsupported"){try{if(u&&u.isAnonymous)await u.linkWithRedirect(prov);else await auth.signInWithRedirect(prov)}catch(_){notify("Bu tarayıcıda Google girişi açılamadı")}}else if(c!=="auth/popup-closed-by-user"&&c!=="auth/cancelled-popup-request")notify("Google girişi başarısız ("+c.replace("auth/","")+")")}}
async function fbSignOut(){if(!FB)return;if(!confirm("Google hesabından çıkılsın mı? Bu cihaz yeni boş bir bulut kimliğiyle devam eder, hesaptaki kayıt silinmez."))return;try{save(true);await FB.auth.signOut();location.reload()}catch(e){}}
async function fbDelete(){if(!FB||!NET.on)return;if(!confirm("Buluttaki bütün verilerin (kayıt, tank, profil) silinsin mi? Bu cihazdaki oyun kalır."))return;try{const uid=FB.auth.currentUser.uid;await Promise.all(["data/users/"+uid+"/save","tanks/"+uid,"helps/"+uid,"profiles/"+uid].map(p=>FB.db.doc(p).delete().catch(()=>{})));try{await FB.auth.currentUser.delete()}catch(e){}NET.on=false;NET.writeOff=true;netLabel();notify("Bulut verilerin silindi")}catch(e){notify("Silinemedi, tekrar dene")}}
function cloudUI(){const b=$("cloudBox");if(!b)return;const show=!!FB;b.hidden=!show;if(!show)return;const g=fbIsGoogle();$("fbLink").hidden=g;$("fbOut").hidden=!g;$("fbDel").disabled=!NET.on}
async function netInit(){try{const c=window.claude;let u,d;if(!c||typeof c.use!=="function"){if(!fbOK()){NET.why="Bulut kapalı";return}try{const F=await fbUse();u=F.u;d=F.d}catch(e){NET.why="Bulut bağlantısı kurulamadı: "+(e&&(e.code||e.message)||"?");netRetry();return}}
else{try{[u,d]=await Promise.all([c.use("user"),c.use("db")])}catch(e){NET.why="İzin alınamadı: "+(e&&(e.code||e.message)||"?");netRetry();return}}
if(!u||!d){NET.why="Kullanıcı/veritabanı izni verilmedi";netRetry();return}
let id;try{id=await u.id()}catch(e){NET.why="Kimlik alınamadı: "+(e&&(e.code||e.message)||"?");netRetry();return}if(!id){NET.why="Giriş yapılmamış görünüyor";netRetry();return}
NET.user=u;NET.db=d;NET.uid=id;NET.why="";NET.readFail="";let cloud=null;
try{const sn=await d.doc("data/users/"+id+"/save").get();if(sn.exists)cloud=sn.data()}catch(e){NET.readFail=(e&&(e.code||e.message))||"?";NET.why="Buluttan okunamadı: "+NET.readFail;netRetry();return}
NET.on=true;state.netSeen=true;
if(cloud&&typeof cloud.json==="string"&&(+cloud.savedAt||0)>LOAD_SAVED){try{const p=JSON.parse(cloud.json);if(validSave(p)){state=fromSave(p);normalize();offlineReport();dailyCheck();checkAch();drops=[];dirtK=-1;selectedFish=null;$("night").textContent=state.night?"☀️ Gündüz modu":"🌙 Gece modu";try{localStorage.setItem("fishvilleClassicSave3",serial())}catch(e){}setTimeout(()=>notify("☁️ Kaydın buluttan yüklendi"),900)}}catch(e){}}
else cloudSave(true);
if(FB){fbProfile();if(NET.switched)fbAfterSwitch();setTimeout(()=>{chatWatch();giftCheck();giftWatch()},1500);if(!NET.giftT)NET.giftT=setInterval(giftCheck,90000)}netLabel();checkHelps();renderUI();badges()}catch(e){}}
function netLabel(){admVis();try{cloudUI()}catch(_){}const e=$("netStatus");const why=NET.saveErr?"⚠️ Buluta yazılamadı: "+NET.saveErr:NET.readFail?"⚠️ Buluttan okunamadı: "+NET.readFail:"";if(e&&FB&&NET.on&&why){e.textContent=why;return}if(e&&!NET.on&&fbOK()&&NET.why&&!window.claude){e.textContent="⚠️ "+NET.why;return}if(e)e.textContent=FB&&NET.on&&!NET.writeOff?(fbIsGoogle()?"☁️ Bulut kaydı açık · Google hesabına bağlı, her cihazdan devam edebilirsin":"☁️ Bulut kaydı açık · başka cihazdan devam etmek için Google ile bağlan"+(NET.okAt?" · son yedek "+new Date(NET.okAt).toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"}):"")):!NET.on?"💾 İlerlemen bu cihazda, bu tarayıcıda kayıtlı. Tarayıcı verilerini silersen ya da başka cihaza geçersen kaybolur; aşağıdan yedek alabilirsin.":NET.pubErr?"☁️ Bağlı ama tankın yayımlanamadı ("+NET.pubErr+"), komşular seni göremeyebilir.":NET.writeOff?"☁️ Bağlı, ama bu sayfaya yazma iznin yok. Kayıt bu cihazda kalıyor.":"☁️ Bulut kaydı açık · diğer cihazlarında da devam edebilirsin"}
function cloudSave(force){if(!NET.on||NET.writeOff||VISIT)return;if(NET.busy){NET.pend=true;return}const wait=(FB?45000:15000)-(Date.now()-NET.lastAt);if(!force&&wait>0){if(!NET.timer)NET.timer=setTimeout(()=>{NET.timer=0;cloudSave(true)},wait);return}
NET.busy=true;NET.lastAt=Date.now();const body={json:serial(),savedAt:state.savedAt||Date.now()};
NET.db.doc("data/users/"+NET.uid+"/save").set(body).then(()=>{if(NET.saveErr){NET.saveErr="";netLabel()}NET.okAt=Date.now();return publishTank()}).catch(e=>{NET.saveErr=(e&&(e.code||e.message))||"?";netLabel();if(e&&(e.code==="invalid_argument"||e.code==="revoked"||e.code==="not_granted")){NET.writeOff=true;netLabel()}}).finally(()=>{NET.busy=false;if(NET.pend){NET.pend=false;cloudSave()}})}
function tankData(k){const a=tankArr(k);return a?snapFish(a):null}
async function publishTank(){if(!NET.on||NET.writeOff)return;const d={level:state.level,score:score(),fresh:tankData("fresh")||[],salt:tankData("salt"),deep:tankData("deep"),river:tankData("river"),cfresh:tankData("cfresh"),coll2:tankData("coll2"),av:favType(),dirt:Math.round(tankDirt("fresh")),props:state.props.slice(),decor:tankDecor("fresh").slice(0,14).map(x=>({k:x.k,x:Math.round(x.x*100)/100,y:typeof x.y==="number"?Math.round(x.y):null})),propPos:Object.fromEntries(Object.entries(state.propPos||{}).map(([k,v])=>[k,{x:Math.round(v.x*100)/100,y:Math.round(v.y)}])),mut:state.mutsFound.length,sp:state.discovered.length,layout:ORI,nm:myName()};
const key=JSON.stringify(d);if(key===NET.lastPub)return;d.at=Date.now();try{await NET.db.doc("tanks/"+NET.uid).set(d);NET.lastPub=key;if(NET.pubErr){NET.pubErr="";netLabel()}}catch(e){NET.pubErr=(e&&(e.code||e.message))||"?";netLabel()}}

function nbTanks(d){const L=["fresh","salt","river","deep","cfresh","coll2"].filter(k=>Array.isArray(d[k])&&d[k].length);return L.length?L:["fresh"]}
function nbCount(d){let n=0;for(const k of["fresh","salt","river","deep","cfresh","coll2"])if(Array.isArray(d[k]))n+=d[k].length;return n}
// ---------- sürüm 115: oyuncu adı, sohbet odası, balık hediyesi
const BADW=["amk","aq","orospu","piç","pic","siktir","sikerim","yarrak","göt","gavat","pezevenk","ibne","kahpe","fuck","shit","bitch"];
function cleanText(t,max){t=String(t||"").replace(/[\u0000-\u001f\u007f​-‏‪-‮]/g," ").replace(/\s+/g," ").trim().slice(0,max||200);
 const low=t.toLocaleLowerCase("tr-TR");let out=t;for(const w of BADW){let i=low.indexOf(w);while(i>=0){const a=i===0||!/[a-zçğıöşü0-9]/.test(low[i-1]),b=!/[a-zçğıöşü0-9]/.test(low[i+w.length]||" ");if(a&&b)out=out.slice(0,i)+"*".repeat(w.length)+out.slice(i+w.length);i=low.indexOf(w,i+1)}}return out}
function cleanName(n){return cleanText(n,32)}
function nickInit(){const f=$("nickForm");if(!f)return;const i=$("nickIn");i.value=state.nick||"";f.addEventListener("submit",e=>{e.preventDefault();const v=cleanName(i.value);if(v&&v.length<2){notify("Ad en az 2 harf olmalı");return}state.nick=v.slice(0,18);i.value=state.nick;save(true);fbProfile();try{publishTank()}catch(_){}notify(v?"👋 Artık "+v+" olarak görünüyorsun":"Ad sıfırlandı")})}
const CHAT={un:null,unB:null,msgs:[],sentAt:0,seen:0,mute:new Set()};try{CHAT.seen=+localStorage.getItem("akvChatSeen")||0;CHAT.mute=new Set(JSON.parse(localStorage.getItem("akvMute")||"[]"))}catch(e){}
function chatOK(){return !!(FB&&NET.on&&FB.db&&FB.auth.currentUser)}
function chatNote(t){const e=$("chatNote");if(e)e.textContent=t}
function chatErr(e){const c=e&&e.code||"";return c==="permission-denied"?(isAdmin()?"Bulut sohbete henüz izin vermiyor. Firebase'de Firestore kurallarını güncellemen gerekiyor.":"Sohbet odası birazdan açılacak, şu an bakımda."):"Bağlantı sorunu, birazdan tekrar dene."}
function tsOf(m){const a=m&&m.at;return a&&a.toMillis?a.toMillis():(+m.ms||Date.now())}
function chatStart(){chatStop();if(!chatOK()){$("chatList").innerHTML="";chatNote(FB?"Sohbet için internet bağlantısı gerekiyor.":"Sohbet odası akvariagame.com'da açık.");return}
 chatNote("Mesajlar bütün oyunculara görünür. Kibar ol, kişisel bilgilerini paylaşma.");
 CHAT.un=FB.db.collection("chat").orderBy("at","desc").limit(60).onSnapshot(sn=>{CHAT.msgs=sn.docs.map(d=>Object.assign({id:d.id},d.data())).reverse();chatRender();chatSeen()},e=>{chatNote(chatErr(e))})}
function chatStop(){if(CHAT.un){try{CHAT.un()}catch(e){}CHAT.un=null}}
function chatSeen(){const l=CHAT.msgs[CHAT.msgs.length-1];if(l){CHAT.seen=Math.max(CHAT.seen,tsOf(l));try{localStorage.setItem("akvChatSeen",CHAT.seen)}catch(e){}}const b=$("cbadge");if(b)b.hidden=true}
function chatTime(ms){const d=new Date(ms),n=new Date();return d.toDateString()===n.toDateString()?d.toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"}):d.toLocaleDateString("tr-TR",{day:"numeric",month:"short"})}
function chatRender(){const box=$("chatList");if(!box)return;const atEnd=box.scrollHeight-box.scrollTop-box.clientHeight<60;box.innerHTML="";const me=NET.uid,adm=isAdmin();
 if(!CHAT.msgs.length){const p=document.createElement("p");p.className="note";p.textContent="Henüz mesaj yok. İlk merhabayı sen de!";box.append(p)}
 for(const m of CHAT.msgs){if(CHAT.mute.has(m.u)&&m.u!==me)continue;const row=document.createElement("div");row.className="cm"+(m.u===me?" me":"");const im=document.createElement("img");im.alt="";im.src=spSrc(m.av)||spSrc("neon");
  const bb=document.createElement("div");bb.className="bb";const hd=document.createElement("div");hd.className="hd";const b=document.createElement("b");b.textContent=cleanName(m.n)||"Akvaryumcu";const sm=document.createElement("span");sm.textContent="Sv "+(+m.lv||1)+" · "+chatTime(tsOf(m));hd.append(b,sm);
  if(m.u===me||adm){const x=document.createElement("button");x.className="x";x.textContent="Sil";x.title="Mesajı sil";x.onclick=()=>{FB.db.doc("chat/"+m.id).delete().catch(e=>notify(chatErr(e)))};hd.append(x)}
  else{const x=document.createElement("button");x.className="x";x.textContent="🔇";x.title="Bu oyuncuyu sessize al";x.onclick=()=>{CHAT.mute.add(m.u);try{localStorage.setItem("akvMute",JSON.stringify([...CHAT.mute].slice(-200)))}catch(e){}notify("🔇 "+(cleanName(m.n)||"Oyuncu")+" sessize alındı");chatRender()};hd.append(x)}
  const tx=document.createElement("div");tx.className="tx";tx.textContent=cleanText(m.m,200);bb.append(hd,tx);row.append(im,bb);box.append(row)}
 if(atEnd||box.dataset.first!=="1"){box.scrollTop=box.scrollHeight;box.dataset.first="1"}}
async function chatSend(e){if(e)e.preventDefault();const i=$("chatIn"),t=cleanText(i.value,200);if(!t)return;if(!chatOK()){notify("Sohbet için internet bağlantısı gerekiyor");return}
 const now=Date.now();if(now-CHAT.sentAt<4000){notify("Biraz yavaş, 4 saniyede bir mesaj");return}CHAT.sentAt=now;i.value="";
 try{await FB.db.collection("chat").add({u:FB.auth.currentUser.uid,n:myName(),av:favType(),lv:state.level,m:t,at:FB.fb.firestore.FieldValue.serverTimestamp()});sfx("click")}catch(err){i.value=t;notify(chatErr(err));chatNote(chatErr(err))}}
function chatWatch(){if(CHAT.unB||!chatOK())return;try{CHAT.unB=FB.db.collection("chat").orderBy("at","desc").limit(1).onSnapshot(sn=>{const d=sn.docs[0];if(!d)return;const m=d.data();if(openKey==="chat"||m.u===NET.uid)return;if(tsOf(m)>CHAT.seen){const b=$("cbadge");if(b)b.hidden=false}},()=>{})}catch(e){}}
// hediye: balık bir başka oyuncunun "gelen kutusuna" yazılır, o oyunu açınca tankına girer
let GIFT_F=null;
function giftOpen(id){if(VISIT)return;const f=state.fish.find(x=>x.id===id);if(!f)return;if(isLocked(f)){sfx("error");notify("🔒 Kilitli balık hediye edilemez, önce kilidi aç");return}if(!NET.on||!FB){notify("Hediye için internet bağlantısı gerekiyor");return}GIFT_F=id;openSheet("gift","🎁 Balık hediye et");giftRender()}
async function giftRender(){const box=$("giftBox");if(!box)return;const f=state.fish.find(x=>x.id===GIFT_F);if(!f){box.innerHTML='<p class="note">Bu balık artık tankında değil.</p>';return}const sp=getSpecies(f.type);
 box.innerHTML="";const top=document.createElement("div");top.className="gfish";top.innerHTML=fishIcon(f);const tx=document.createElement("div");const b=document.createElement("strong");b.textContent=f.name||sp.name;const sm=document.createElement("small");sm.textContent=" · "+(MUTS[f.mutation]&&f.mutation!=="normal"?MUTS[f.mutation].name+" · ":"")+yasTxt(f);tx.append(b,sm);top.append(tx);box.append(top);
 const left=10-giftsToday();const n=document.createElement("p");n.className="note";n.textContent=left>0?"Kime göndermek istersin? Balık tankından çıkar ve o oyuncu oyunu açınca tankına girer. Bugün "+left+" hediye hakkın kaldı.":"Bugünkü 10 hediye hakkını kullandın. Yarın tekrar gönderebilirsin.";box.append(n);if(left<=0)return;
 const wait=document.createElement("p");wait.className="note";wait.textContent="Oyuncular yükleniyor…";box.append(wait);
 try{const {rows,ps}=await fetchTanks();wait.remove();const others=rows.filter(r=>r.id!==NET.uid&&r.id!==BOT_ID);if(!others.length){box.append(Object.assign(document.createElement("p"),{className:"note",textContent:"Henüz başka oyuncu yok."}));return}
  for(const r of others){const p=ps[r.id]||{},row=document.createElement("div");row.className="nrow";const im=document.createElement("img");im.className=p.avatarUrl?"":"fav";im.src=p.avatarUrl||spSrc(p.av||(r.d||{}).av||"neon");im.alt="";const mid=document.createElement("div"),nm=document.createElement("strong"),s2=document.createElement("small");nm.textContent=cleanName(p.name)||"Bir komşu";s2.textContent="Seviye "+(+(r.d||{}).level||1)+" · "+nbCount(r.d||{})+" balık";mid.append(nm,s2);
   const bt=document.createElement("button");bt.textContent="Gönder";bt.onclick=()=>{if(bt.dataset.arm!=="1"){bt.dataset.arm="1";bt.textContent="Emin misin?";setTimeout(()=>{if(bt.isConnected){bt.dataset.arm="";bt.textContent="Gönder"}},3500);return}bt.disabled=true;giftSend(GIFT_F,r.id,cleanName(p.name)||"komşun")};row.append(im,mid,bt);box.append(row)}}catch(e){wait.textContent="Oyuncular şu an yüklenemedi."}}
function giftsToday(){const d=dayKey();if(!state.giftDay||state.giftDay.d!==d)state.giftDay={d,n:0};return state.giftDay.n}
function giftSnap(f){return{t:f.type,m:f.mutation||"normal",ge:f.gene||null,a:Math.round(Math.min(1,f.age)*100)/100,g:Math.round((f.sizeGrowth||0)*100)/100,z:f.sizeTrait||"normal",r:f.rarity==="Nadir"?1:0,n:String(f.name||"").slice(0,24),p:f.personality||"Uysal",gf:f.gift?1:0,h:hybOf(f)}}
async function giftSend(id,to,toName){const i=state.fish.findIndex(x=>x.id===id);if(i<0||!chatOK())return;if(isLocked(state.fish[i])){sfx("error");notify("🔒 Kilitli balık hediye edilemez");return}if(giftsToday()>=10){notify("Bugünkü hediye hakkın bitti");return}const f=state.fish[i],sp=getSpecies(f.type);
 state.fish.splice(i,1);FSEL.delete(id);renderUI();
 try{await FB.db.collection("gifts").add({to,from:FB.auth.currentUser.uid,fn:myName(),f:giftSnap(f),at:FB.fb.firestore.FieldValue.serverTimestamp()});state.giftDay.n++;Q("gift");sfx("coins");notify("🎁 "+(f.name||sp.name)+" "+toName+" adlı oyuncuya gönderildi");closeSheet();save(true)}
 catch(e){state.fish.splice(Math.min(i,state.fish.length),0,f);renderUI();notify(e&&e.code==="permission-denied"?(isAdmin()?"Bulut hediyeye henüz izin vermiyor (Firestore kuralları)":"Hediye şu an gönderilemiyor"):"Gönderilemedi, balığın sende kaldı")}}
// sürüm 124: hediye anında gelir (oyun açıkken canlı dinleme) ve büyük bir pencereyle gösterilir; oyun kapalıyken gelenler açılışta topluca gösterilir
let GIFT_BUSY=false,GIFT_W=null;
function giftWatch(){try{if(GIFT_W||!FB||!FB.auth.currentUser)return;GIFT_W=FB.db.collection("gifts").where("to","==",FB.auth.currentUser.uid).onSnapshot(sn=>{if(!sn.empty)giftCheck()},()=>{GIFT_W=null})}catch(e){GIFT_W=null}}
function giftPopup(L){if(!L.length)return;try{let ov=$("giftBig");if(!ov){ov=document.createElement("div");ov.id="giftBig";ov.onclick=e=>{if(e.target===ov||e.target.closest("[data-gok]"))ov.classList.remove("show")};$("game").appendChild(ov)}
 const one=L.length===1;ov.innerHTML='<div class="gbox"><div class="gtop">🎁</div><h3>'+(one?"Sana hediye geldi!":L.length+" hediye geldi!")+'</h3><div class="glist">'+L.map(g=>'<div class="gi"><span class="gfi">'+fishIcon(g.f)+'</span><div><b>'+esc(g.from)+'</b><small>'+esc(g.f.name||getSpecies(g.f.type).name)+(mutOf(g.f)!=="normal"?" · "+(hybOf(g.f)?hybName(g.f):MUTS[mutOf(g.f)].name):"")+" · "+TANKS[g.k].icon+" "+TANKS[g.k].name+"</small></div></div>").join("")+'</div><button data-gok="1">Teşekkürler 💙</button></div>';void ov.offsetWidth;ov.classList.add("show")}catch(e){}}
async function giftCheck(){if(!chatOK()||VISIT||GIFT_BUSY)return;GIFT_BUSY=true;const POP=[];try{const sn=await FB.db.collection("gifts").where("to","==",FB.auth.currentUser.uid).limit(20).get();if(sn.empty)return;state.giftsGot=Array.isArray(state.giftsGot)?state.giftsGot:[];let got=0,full=0;
 for(const doc of sn.docs){const g=doc.data()||{},s0=g.f||{};if(state.giftsGot.includes(doc.id)){doc.ref.delete().catch(()=>{});continue}if(!species.some(x=>x.id===s0.t)){doc.ref.delete().catch(()=>{});continue}
  const w=WATER[s0.t],dest=[w,"cfresh"].map(k=>({k,a:tankArr(k)})).find(o=>o.a&&o.a.length<fishCap(o.k)&&(o.k!=="cfresh"||w!=="deep"));if(!dest){full++;continue}
  const mu=MUTS[s0.m]?s0.m:"normal",f={id:state.nextId++,type:s0.t,mutation:mu,gene:GENES.includes(s0.ge)?s0.ge:(mu!=="normal"&&GENES.includes(mu)?mu:null),age:Math.max(.05,Math.min(1,+s0.a||.5)),lifeHours:0,sizeGrowth:Math.max(0,Math.min(.75,+s0.g||0)),sizeTrait:SIZES[s0.z]?s0.z:"normal",rarity:s0.r?"Nadir":"Normal",name:cleanText(s0.n,24)||getSpecies(s0.t).name,hyb:HYB_T.includes(s0.h)?s0.h:undefined,personality:["Meraklı","Uysal","Hareketli","Utangaç"].includes(s0.p)?s0.p:"Uysal",hunger:85,health:100,sick:false,x:rand(.15,.85),y:rand(.25,.7),dir:Math.random()<.5?-1:1,phase:rand(0,6),gifted:cleanName(g.fn)||"Bir komşu"};if(s0.gf)f.gift=true;
  dest.a.push(f);if(!state.discovered.includes(f.type))state.discovered.push(f.type);state.giftsGot.push(doc.id);got++;doc.ref.delete().catch(()=>{});POP.push({from:cleanName(g.fn)||"Bir komşu",f,k:dest.k})}
 state.giftsGot=state.giftsGot.slice(-200);if(got){sfx("chest");renderUI();save(true)}if(full)setTimeout(()=>notify("🎁 Sana gelen "+full+" hediye balık bekliyor, tankında yer aç"),got?2500:300)}catch(e){}finally{GIFT_BUSY=false;if(POP.length)giftPopup(POP)}}
// ---------- Bilgisayarın yönettiği örnek komşu (internet gerekmez)
const BOT_ID="bot:deniz",BOT_P={name:"Deniz 🤖 · örnek komşu",avatarUrl:"a/369e78c42206c42a.webp"};
const BOT_NAMES=["Pırıl","Dalga","Kabarcık","Mercan","Yosun","İncik","Lacivert","Köpük","Sedef","Gümüş","Turkuaz","Çıtır"];
function botData(){if(!state.botEpoch)state.botEpoch=Date.now();const days=(Date.now()-state.botEpoch)/864e5+3,lvl=Math.min(25,3+Math.floor(days*.7)),count=Math.min(14,2+Math.floor(days*.9)),n1=Math.ceil(count/2);
const mk=(w,n,off)=>{const pool=species.filter(x=>WATER[x.id]===w&&(x.lv||0)<=lvl).sort((a,b)=>a.price-b.price),out=[];for(let i=0;i<n;i++){const j=i+off,sp=pool[(i*3+i%2)%pool.length],age=Math.max(.1,Math.min(1,.35+(days-j*.7)*.4)),mu=j%9===4?"albino":j%23===7?"transparent":"normal";out.push({t:sp.id,m:mu,a:Math.round(age*100)/100,g:age>=1?Math.round(Math.min(.5,Math.max(0,(days-j*.7-2)*.02))*100)/100:0,r:0,n:BOT_NAMES[j%BOT_NAMES.length]})}return out};
const props=PROPS.slice(0,Math.min(PROPS.length,Math.floor(lvl/3))).map(p=>p.id),mut=Math.floor(days/3),sp=Math.min(species.length,3+Math.floor(days*.5));
return{level:lvl,score:lvl*100+sp*20+mut*60+props.length*25+count*5,fresh:mk("fresh",n1,0),salt:mk("salt",count-n1,n1),dirt:Math.round(((Date.now()/36e5)%24)/24*70),props,decor:[{k:"🐚",x:.2},{k:"🪸",x:.7},{k:"⚓",x:.45}],mut,sp}}
function botRow(){return{id:BOT_ID,d:botData()}}
function botHelp(){try{const d=dayKey();if(state.helpGot[BOT_ID]===d)return;state.helpGot[BOT_ID]=d;state.coins+=10;state.dirt=Math.max(0,state.dirt-20);notify("🤝 Deniz bugün tankını temizledi! +10 🪙");renderUI();save(true)}catch(e){}}
async function fetchTanks(){const snap=await NET.db.collection("tanks").orderBy("score","desc").limit(50).get();const rows=snap.docs.filter(x=>x.exists).map(x=>({id:x.id,d:x.data()}));let ps={};try{ps=await NET.user.profiles(rows.map(r=>r.id))}catch(e){}rows.push(botRow());ps[BOT_ID]=BOT_P;rows.sort((a,b)=>(+b.d.score||0)-(+a.d.score||0));return{rows,ps}}
function personRow(r,ps,i,rank){const p=ps[r.id]||{},me=r.id===NET.uid||r.id==="local",row=document.createElement("div");row.className="nrow";
const left=document.createElement(rank?"span":"img");if(rank){left.className="rk";left.textContent="#"+(i+1)}else{const d0=r.d||{},av=p.avatarUrl||spSrc(p.av||d0.av||((d0.deep||d0.river||d0.salt||d0.fresh||d0.cfresh||d0.coll2||[])[0]||{}).t||"neon");left.src=av;left.alt="";if(!p.avatarUrl)left.className="fav";left.onerror=()=>{left.onerror=null;left.src=spSrc("neon")}}
const mid=document.createElement("div"),nm=document.createElement("strong"),sm=document.createElement("small");const d=r.d||{};nm.textContent=(me?"Sen":(cleanName(p.name)||cleanName(d.nm)||"Bir komşu"));
sm.textContent=rank?((+d.score||0).toLocaleString("tr-TR")+" puan · Seviye "+(+d.level||1)+" · "+(+d.mut||0)+" mutasyon"):("Seviye "+(+d.level||1)+" · "+nbCount(d)+" balık · "+(+d.mut||0)+" mutasyon");mid.append(nm,sm);row.append(left,mid);
if(!rank&&!me){const b=document.createElement("button");b.textContent=state.helped[r.id]===dayKey()?"✓ Ziyaret":"Ziyaret et";b.onclick=()=>startVisit(r,p);row.append(b)}else if(rank&&me){row.classList.add("me")}else row.append(document.createElement("span"));return row}
async function renderNeighbors(){const box=$("neighbors");if(!NET.on){box.innerHTML='<p class="note">Örnek komşun Deniz her zaman burada. Arkadaşlarını komşu olarak ekleme özelliği yakında geliyor.</p>';box.append(personRow(botRow(),{[BOT_ID]:BOT_P},0,false));return}
box.innerHTML='<p class="note">Yükleniyor…</p>';try{const {rows,ps}=await fetchTanks();const others=rows.filter(r=>r.id!==NET.uid);box.innerHTML="";if(!others.length){box.innerHTML='<p class="note">Henüz komşun yok. Oyunu paylaş menüsünden arkadaşlarını <b>e-postayla Düzenleyici</b> olarak davet et; onlar oynadıkça akvaryumları burada çıkar.</p>';return}others.forEach((r,i)=>box.append(personRow(r,ps,i,false)))}catch(e){box.innerHTML='<p class="note">Komşular şu an yüklenemedi. Biraz sonra tekrar dene.</p>'}}
async function renderRank(){const box=$("rankList");if(!NET.on){box.innerHTML='<p class="note">Puan = seviye×100 + tür×20 + mutasyon×60 + özel dekor×25 + balık×5. Arkadaşlarınla ortak sıralama yakında geliyor.</p>';const rows=[{id:"local",d:{level:state.level,score:score(),mut:state.mutsFound.length}},botRow()].sort((a,b)=>b.d.score-a.d.score);rows.forEach((r,i)=>box.append(personRow(r,{[BOT_ID]:BOT_P},i,true)));return}
box.innerHTML='<p class="note">Yükleniyor…</p>';try{await publishTank()}catch(e){}try{const {rows,ps}=await fetchTanks();box.innerHTML='<p class="note">Puan = seviye×100 + tür×20 + mutasyon×60 + özel dekor×25 + balık×5</p>';rows.forEach((r,i)=>box.append(personRow(r,ps,i,true)));if(!rows.length)box.innerHTML+='<p class="note">Henüz kimse yok.</p>'}catch(e){box.innerHTML='<p class="note">Sıralama şu an yüklenemedi.</p>'}}
function visitTank(){const d=VISIT.d,arr=Array.isArray(d[VISIT.tank])?d[VISIT.tank]:[];
state.fish=arr.slice(0,30).map((s,i)=>({id:-1-i,type:s.t,mutation:MUTS[s.m]?s.m:"normal",hyb:HYB_T.includes(s.h)?s.h:undefined,age:Math.max(.05,Math.min(1,+s.a||.5)),sizeGrowth:Math.max(0,Math.min(.75,+s.g||0)),rarity:s.r?"Nadir":"Normal",sizeTrait:SIZES[s.z]?s.z:"normal",name:String(s.n||"").slice(0,24),hunger:100,health:100,sick:false,personality:"Uysal",x:rand(.15,.85),y:rand(.25,.7),dir:Math.random()<.5?-1:1,phase:rand(0,6)})).filter(f=>species.some(s=>s.id===f.type));
state.dirt=VISIT.helpedNow?0:Math.max(0,Math.min(100,+d.dirt||0));state.props=(Array.isArray(d.props)?d.props:[]).filter(i=>PROPS.some(p=>p.id===i));state.decor=(Array.isArray(d.decor)&&!DECW[tw(VISIT.tank)]?d.decor:[]).filter(x=>x&&DECOR.includes(x.k)).slice(0,14).map(x=>({k:x.k,x:Math.max(.05,Math.min(.95,+x.x||.5)),y:typeof x.y==="number"?Math.max(H*.2,Math.min(FLOOR+60,yconv(x.y,d.layout==="land"?"land":"port"))):undefined}));state.propPos={};if(d.propPos&&typeof d.propPos==="object")for(const p of PROPS){const v=d.propPos[p.id];if(v&&isFinite(v.x)&&isFinite(v.y))state.propPos[p.id]={x:Math.max(.05,Math.min(.95,+v.x)),y:Math.max(H*.2,Math.min(FLOOR+60,yconv(+v.y,d.layout==="land"?"land":"port")))}}state.chest=null;state.tank=VISIT.tank;drops=[];dirtK=-1;
{const L=nbTanks(d),i=L.indexOf(VISIT.tank),nx=L[(i+1)%L.length];$("vtank").textContent=L.length>1?TANKS[nx].icon+" "+TANKS[nx].name:TANKS[VISIT.tank].icon+" "+TANKS[VISIT.tank].name;$("vtank").disabled=L.length<2}$("vhelp").textContent=state.helped[VISIT.id]===dayKey()?"✓ Yardım edildi":"🧽 Yardım et";$("vhelp").disabled=state.helped[VISIT.id]===dayKey()}
function startVisit(r,p){if(VISIT)return;closeSheet();VISIT={id:r.id,d:r.d||{},tank:nbTanks(r.d||{}).sort((a,b)=>((r.d||{})[b]||[]).length-((r.d||{})[a]||[]).length)[0]||"fresh",keep:{fish:state.fish,dirt:state.dirt,props:state.props,propPos:state.propPos,decor:state.decor,chest:state.chest,snails:state.snails,tank:state.tank}};state.snails=0;visitTank();
$("vname").textContent=((p&&cleanName(p.name))||cleanName((r.d||{}).nm)||"Komşu")+" · akvaryumu";$("vav").src=p&&p.avatarUrl||spSrc((p&&p.av)||(r.d||{}).av||"neon");document.body.classList.add("visiting");$("visitbar").hidden=false;renderUI();updateLive()}
function endVisit(){if(!VISIT)return;Object.assign(state,VISIT.keep);VISIT=null;document.body.classList.remove("visiting");$("visitbar").hidden=true;drops=[];dirtK=-1;acc=0;renderUI();updateLive();save(true)}
async function helpNeighbor(){if(!VISIT||(!NET.on&&VISIT.id!==BOT_ID))return;const d=dayKey();if(state.helped[VISIT.id]===d)return;for(const k in state.helped)if(state.helped[k]!==d)delete state.helped[k];state.helped[VISIT.id]=d;VISIT.helpedNow=true;state.dirt=0;pop(rand(60,480),H-40,16);pop(rand(60,480),H-40,10);
state.coins+=15;Q("help");state.xp+=10;{const l0=state.level;while(state.xp>=xpNeed(state.level)){state.xp-=xpNeed(state.level);state.level++;state.coins+=lvCoins(state.level);state.gems+=lvGems(state.level)}if(state.level>l0)showLevelUp(state.level,lvSum(l0,state.level),gemSum(l0,state.level))}sfx("help");notify("🤝 Komşunun tankını temizledin! +15 🪙 +10 XP");$("vhelp").textContent="✓ Yardım edildi";$("vhelp").disabled=true;renderUI();
if(NET.on&&!NET.writeOff&&VISIT.id!==BOT_ID){try{await NET.db.doc("helps/"+NET.uid).set({d,t:Object.keys(state.helped)})}catch(e){}}}
async function checkHelps(){if(!NET.on)return;try{const d=dayKey(),snap=await NET.db.collection("helps").where("d","==",d).get();let n=0;for(const x of snap.docs){if(!x.exists||x.id===NET.uid)continue;const t=x.data().t;if(Array.isArray(t)&&t.includes(NET.uid)&&state.helpGot[x.id]!==d){state.helpGot[x.id]=d;n++}}
for(const k in state.helpGot)if(state.helpGot[k]!==d)delete state.helpGot[k];if(n){state.coins+=10*n;state.dirt=Math.max(0,state.dirt-20*n);setTimeout(()=>notify("🤝 "+n+" komşun bugün tankını temizledi! +"+10*n+" 🪙"),2400);renderUI();save(true)}}catch(e){}}
// ---------- etkinlikler (takvime bağlı)
const EVENTS=[{id:"harvest",n:"🍂 Hasat Ayı",d:"Satış fiyatları %15 yüksek",from:[10,1],to:[10,19]},
{id:"dark",n:"🎃 Karanlık Sular",d:"Transparan ve melanistik şansı 3 kat",from:[10,20],to:[11,3]},
{id:"winter",n:"❄️ Kış Festivali",d:"Sandıklar daha sık çıkar, %50 daha çok para verir",from:[12,15],to:[1,5]},
{id:"love",n:"💘 Sevgi Haftası",d:"Çiftleştirme yarı fiyata",from:[2,10],to:[2,20]},
{id:"spring",n:"🌸 Bahar Üremesi",d:"Yumurtalar 2 kat hızlı açılır",from:[3,20],to:[4,15]},
{id:"summer",n:"☀️ Yaz Hazinesi",d:"Hazine sandığı 45 dakikada bir",from:[6,15],to:[8,31]},
{id:"weekend",n:"🎉 Hafta Sonu",d:"Albino şansı 2 kat",weekend:true},
{id:"biolum",n:"✨ Biyolüminesans Gecesi",d:"Derin okyanusta ışıklar daha parlak · derin balıklar %20 daha değerli",dow:3,dp:1},
{id:"abyss",n:"🌌 Derin Göç",d:"Derin okyanus balıkları %30 daha hızlı büyür",mday:[1,7],dp:1},
{id:"dragonm",n:"🐉 Ejder Ayı",d:"Kürek Balığı ve Kara Ejder Balığı %25 daha değerli · derin balıklarda parlak şansı 2 kat",from:[11,10],to:[11,24],dp:1}];
function deepSeen(){return hasTank("deep")||state.level>=30}
function riverSeen(){return hasTank("river")||state.level>=20}
function deepEvK(f){if(WATER[f.type]!=="deep")return 1;return(ev("biolum")?1.2:1)*((f.type==="oar"||f.type==="dragon")&&ev("dragonm")?1.25:1)}
function inEvent(e,d){if(e.weekend)return d.getDay()===0||d.getDay()===6;if(e.dow!=null)return d.getDay()===e.dow;if(e.mday)return d.getDate()>=e.mday[0]&&d.getDate()<=e.mday[1];const md=(d.getMonth()+1)*100+d.getDate(),a=e.from[0]*100+e.from[1],b=e.to[0]*100+e.to[1];return a<=b?md>=a&&md<=b:md>=a||md<=b}
let evC={t:0,l:[]};
function activeEvents(){const n=Date.now();if(n-evC.t>6e4){const d=new Date();evC={t:n,l:EVENTS.filter(e=>(inEvent(e,d)&&(!e.dp||deepSeen()))||(state.admEv||[]).includes(e.id))}}return evC.l}
function ev(id){return activeEvents().some(e=>e.id===id)}
function nextEvent(){const d=new Date();for(let i=1;i<400;i++){const x=new Date(d.getFullYear(),d.getMonth(),d.getDate()+i);const e=EVENTS.find(e=>!e.weekend&&e.dow==null&&!e.mday&&(!e.dp||deepSeen())&&inEvent(e,x)&&!inEvent(e,d));if(e)return{e,days:i}}return null}
// ---------- günlük görevler, seri, başarımlar
const dayKey=(o=0)=>{const d=new Date();d.setDate(d.getDate()+o);return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()};
const QUESTS=[{id:"order",t:"Bir sipariş teslim et",ev:"order",n:1,r:25,ord:true},{id:"feed",t:"Balıklarını 3 kez besle",ev:"feed",n:3,r:19},{id:"clean",t:"Bir tankı temizle",ev:"clean",n:1,r:15},{id:"buy",t:"2 balık satın al",ev:"buy",n:2,r:22},{id:"sell",t:"1 balık sat",ev:"sell",n:1,r:19},{id:"collect",t:"Gelirden 50 🪙 topla",ev:"collect",n:50,r:30},{id:"chest",t:"Bir hazine sandığı aç",ev:"chest",n:1,r:26},{id:"breed",t:"Bir çift çiftleştir",ev:"breed",n:1,r:26},{id:"gene",t:"Bir balığa genetik test yap",ev:"gene",n:1,r:19},{id:"tap",t:"Balıklarına 10 kez dokun",ev:"tap",n:10,r:11},{id:"help",t:"Bir komşuna yardım et",ev:"help",n:1,r:30,net:true},
{id:"dfeed",t:"🌌 Derin okyanusta 3 kez canlı yem ver",ev:"dfeed",n:3,r:60,deep:true},{id:"dbuy",t:"🌌 Bir derin okyanus balığı satın al",ev:"dbuy",n:1,r:80,deep:true},{id:"dsell",t:"🌌 Yetişkin bir derin okyanus balığı sat",ev:"dsell",n:1,r:120,deep:true},{id:"dtap",t:"🌌 Işıklı balıklarına 5 kez dokun",ev:"dtap",n:5,r:40,deep:true},{id:"dclean",t:"🌌 Derin Okyanus tankını temizle",ev:"dclean",n:1,r:50,deep:true},
{id:"rfeed",t:"🌳 Kadim Nehir'deki balıklarını 3 kez besle",ev:"rfeed",n:3,r:45,river:true},{id:"rbuy",t:"🌳 Bir nehir canavarı satın al",ev:"rbuy",n:1,r:70,river:true},{id:"rsell",t:"🌳 Yetişkin bir nehir balığı sat",ev:"rsell",n:1,r:100,river:true},{id:"rclean",t:"🌳 Kadim Nehir tankını temizle",ev:"rclean",n:1,r:40,river:true},{id:"rair",t:"🌳 Nehirde 2 balığın yüzeye çıkıp hava almasını izle",ev:"rair",n:2,r:55,river:true},{id:"rzap",t:"🌳 Elektrikli yılan balığının boşalımını gör",ev:"rzap",n:1,r:60,river:true}];
const S=k=>(state.stats&&state.stats[k])||0,mf=m=>state.mutsFound.some(x=>x.startsWith(m+"_"));
const ACH=[{id:"ord5",n:"Sadık tedarikçi",d:"5 sipariş teslim et",r:80,f:()=>S("order")>=5},{id:"first",n:"İlk balık",d:"Bir balık satın al",r:20,f:()=>S("buy")>=1},{id:"crowd",n:"Kalabalık akvaryum",d:"Aynı anda 10 balığın olsun",r:50,f:()=>allFish().length>=10},{id:"col",n:"Koleksiyoncu",d:"Bütün türleri keşfet ("+BASESP.length+")",r:150,f:()=>BASESP.every(i=>state.discovered.includes(i))},{id:"alb",n:"Beyaz inci",d:"İlk albino balığını bul",r:50,f:()=>mf("albino")},{id:"tra",n:"Cam balık",d:"İlk transparan balığını bul",r:100,f:()=>mf("transparent")},{id:"mel",n:"Gölgelerin efendisi",d:"İlk melanistik balığını bul",r:300,f:()=>mf("melanistic")},{id:"gold1",n:"Kral Midas",d:"İlk altın balığını bul",r:800,f:()=>mf("gold")},{id:"glitch1",n:"Sistem Hatası",d:"İlk glitch balığını bul",r:3000,f:()=>mf("glitch")},{id:"bin",n:"Bin Balık Ustası",d:"Aynı türden 1.000 balığı yetişkin olana kadar büyütüp sat",r:0,gift:1,p:()=>{const t=raisedTop();return t.k?"en çok: "+getSpecies(t.k).name+" "+Math.min(1000,t.n).toLocaleString("tr-TR")+"/1.000":"0/1.000"},f:()=>raisedTop().n>=1000},{id:"gold5",n:"Altın Koleksiyon",d:"5 farklı türde altın balık bul",r:2500,f:()=>state.mutsFound.filter(k=>k.startsWith("gold_")).length>=5},{id:"gen12",n:"Genetikçi",d:MSP().length*5+" mutasyonun 12'sini keşfet",r:200,f:()=>state.mutsFound.length>=12},{id:"gen24",n:"Mutasyon ustası",d:"Albino, transparan ve melanistik mutasyonların hepsini keşfet ("+MSP().length*3+")",r:1000,f:()=>state.mutsFound.filter(k=>!k.startsWith("gold_")&&!k.startsWith("glitch_")).length>=MSP().length*3},{id:"giant",n:"Devler ülkesi",d:"Dev boy mutasyonlu bir balık bul",r:80,f:()=>S("size_giant")>=1},{id:"dwarf",n:"Cep boyu",d:"Cüce boy mutasyonlu bir balık bul",r:50,f:()=>S("size_dwarf")>=1},{id:"hatch",n:"İlk yavru",d:"Bir yumurtadan yavru çıkar",r:30,f:()=>S("hatch")>=1},{id:"mendel",n:"Mendel'in mirası",d:"Çiftleştirerek mutasyonlu yavru elde et",r:150,f:()=>S("bredMut")>=1},{id:"salt",n:"Okyanusa açılış",d:"Tuzlu su tankını aç",r:50,f:()=>hasTank("salt")},{id:"props",n:"İç mimar",d:"8 özel dekorun hepsini yerleştir",r:200,f:()=>state.props.length>=8},{id:"lv5",n:"Deneyimli bakıcı",d:"Seviye 5'e ulaş",r:50,f:()=>state.level>=5},{id:"lv10",n:"Akvaryum ustası",d:"Seviye 10'a ulaş",r:150,f:()=>state.level>=10},{id:"rich",n:"Zengin akvaryumcu",d:"Toplam 5.000 🪙 kazan",r:200,f:()=>S("earn")>=5000},{id:"cleaner",n:"Temizlik delisi",d:"Tankı 20 kez temizle",r:60,f:()=>S("clean")>=20},{id:"hunter",n:"Hazine avcısı",d:"10 hazine sandığı aç",r:80,f:()=>S("chest")>=10},{id:"loyal",n:"Sadık bakıcı",d:"7 gün üst üste gir",r:150,f:()=>(state.streak.count||0)>=7},{id:"neigh",n:"İyi komşu",d:"Komşularına 5 kez yardım et",r:100,f:()=>S("help")>=5},{id:"deep",n:"Derinlere dalış",d:"Derin Okyanus tankını aç",r:500,f:()=>hasTank("deep")},{id:"dcol",n:"Derinlerin kâşifi",d:"Derin okyanusun 6 türünü de keşfet",r:2000,f:()=>species.filter(s=>s.deep).every(s=>state.discovered.includes(s.id))},{id:"dragon",n:"Ejderin efendisi",d:"Yetişkin bir Kara Ejder Balığı sat",r:3000,f:()=>S("dsell_dragon")>=1},{id:"river",n:"Nehrin kalbine",d:"Kadim Nehir tankını aç",r:300,f:()=>hasTank("river")},{id:"rcol",n:"Nehir canavarları",d:"Kadim Nehir'in 10 türünü de keşfet",r:1500,f:()=>species.filter(s=>s.river).every(s=>state.discovered.includes(s.id))}];
function Q(e,n=1){if(VISIT&&e!=="help")return;tutEv(e);state.stats[e]=(state.stats[e]||0)+n;const D=state.daily;if(D&&D.date===dayKey())for(const id of D.ids){const q=QUESTS.find(x=>x.id===id);if(q&&q.ev===e)D.prog[id]=Math.min(q.n,(D.prog[id]||0)+n)}checkAch();badges()}
function checkAch(){if(VISIT)return;let got=null;for(const a of ACH)if(!state.ach[a.id]&&a.f()){state.ach[a.id]="done";got=a}if(got){setTimeout(()=>notify("🏆 Başarım: "+got.n+"!"),400);sfx("ach")}badges()}
function hashStr(s){let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0}
function dailyCheck(){const d=dayKey();if(!state.daily||state.daily.date!==d){const pool=QUESTS.filter(q=>!q.deep&&!q.river&&(!q.net||state.netSeen)&&(!q.ord||state.level>=2));let h=hashStr(d),ids=[];while(ids.length<3){h=Math.imul(h,1103515245)+12345>>>0;const q=pool[h%pool.length];if(!ids.includes(q.id))ids.push(q.id)}if(hasTank("deep")){const dq=QUESTS.filter(q=>q.deep);ids[2]=dq[hashStr(d+"/derin")%dq.length].id}if(hasTank("river")){const rq=QUESTS.filter(q=>q.river&&(q.id!=="rzap"||allFish().some(f=>f.type==="eel"))&&(q.id!=="rair"||allFish().some(f=>AIRB[f.type])));if(rq.length)ids.push(rq[hashStr(d+"/nehir")%rq.length].id)}state.daily={date:d,ids,prog:{},claimed:[],bonus:false}}
if(state.streak.last!==d){const c=state.streak.last===dayKey(-1)?(state.streak.count||0)+1:1;state.streak={last:d,count:c};const bonus=8*Math.min(7,c),sg=c%7===0?5:1;state.coins+=bonus;state.gems+=sg;setTimeout(()=>notify("🔥 "+c+". gün serisi! +"+bonus+" 🪙 · +"+sg+" 💎"),1800);checkAch()}}

// ---------- siparişler
const CUST=[["⚓","Kaptan Selim"],["👵","Ayşe Hanım"],["🎩","Bay Orhan"],["👩‍🔬","Dr. Elif"],["🧒","Küçük Can"],["🍽️","Şef Murat"],["🏨","Otel Müdürü"],["🎨","Ressam Leyla"]];
function newOrder(now){const own=[];for(const k of TKEYS){if(!hasTank(k)||isColl(k))continue;for(const f of tankArr(k))if(!own.includes(f.type))own.push(f.type)}
const pool=species.filter(s=>(s.lv||1)<=state.level&&hasTank(WATER[s.id]));const ps=own.length&&Math.random()<.6?pool.filter(s=>own.includes(s.id)):pool;const sp=(ps.length?ps:pool)[Math.random()*(ps.length?ps:pool).length|0]||species[0];
const mut=state.level>=3&&mutOK(sp.id)&&Math.random()<.25?(Math.random()<.75?"albino":"transparent"):"normal";
const reward=Math.round(sp.value*MUTS[mut].mult*1.3+6);return{type:sp.id,mut,gem:Math.random()<(mut==="normal"?.12:.4)?1:0,cust:Math.random()*CUST.length|0,reward,xp:Math.max(5,Math.min(25,Math.round(Math.sqrt(reward)))),exp:now+20*36e5}}
function ensureOrders(now){if(state.level<2)return false;if(!Array.isArray(state.orders))state.orders=[];while(state.orders.length<3)state.orders.push({wait:now});state.orders.length=3;let ch=false;
state.orders.forEach((o,i)=>{if(!o||typeof o!=="object"){state.orders[i]={wait:now};o=state.orders[i]}
if(o.type){if(now>=o.exp||!species.some(s=>s.id===o.type)||!MUTS[o.mut]){state.orders[i]={wait:now+3e5};ch=true}}
else if(now>=(o.wait||0)){state.orders[i]=newOrder(now);ch=true}});return ch}
function findOrderFish(o){let best=null;for(const k of TKEYS){if(!hasTank(k)||isColl(k))continue;for(const f of tankArr(k)){if(f.type!==o.type||f.age<MATURE||f.sick||(f.mutation||"normal")!==o.mut||isLocked(f))continue;const v=saleValue(f);if(!best||v<best.v)best={k,f,v}}}return best}
function orderReady(){return Array.isArray(state.orders)&&state.orders.some(o=>o&&o.type&&findOrderFish(o))}
function deliverOrder(i){const o=state.orders&&state.orders[i];if(!o||!o.type||VISIT)return false;const b=findOrderFish(o);if(!b){notify("Bu sipariş için uygun yetişkin balığın yok");return false}
const arr=tankArr(b.k),ix=arr.indexOf(b.f);if(ix<0)return false;arr.splice(ix,1);if(selectedFish===b.f.id)selectedFish=null;
state.coins+=o.reward;state.gems+=o.gem||0;state.orders[i]={wait:Date.now()+rand(8,20)*6e4};Q("order");addXP(o.xp);sfx("sell");notify("📦 Sipariş teslim edildi: +"+o.reward+" 🪙"+(o.gem?" · +"+o.gem+" 💎":"")+" · +"+o.xp+" XP");renderUI();save(true);return true}
function skipOrder(i){const o=state.orders&&state.orders[i];if(!o||!o.type)return;state.orders[i]={wait:Date.now()+18e4};sfx("click");renderQuests();save(true)}
function renderOrders(){const el=$("orders");if(!el)return;if(state.level<2){el.innerHTML='<p class="note">Siparişler 2. seviyede açılır.</p>';return}
const now=Date.now();el.innerHTML=(state.orders||[]).map((o,i)=>{if(!o||!o.type)return `<div class="fish-card qrow"><div class="qicon">⏳</div><div><strong>Yeni müşteri bekleniyor</strong><small>${o&&o.wait?fmtTime((o.wait-now)/1000)+" sonra":"birazdan"}</small></div></div>`;
const sp=getSpecies(o.type),c=CUST[o.cust]||CUST[0],have=!!findOrderFish(o),mn=o.mut==="normal"?"":MUTS[o.mut].name+" ";
return `<div class="fish-card qrow"><div class="qicon"><img class="cuimg" alt="" src="${B64(CUP[CUST.indexOf(c)]||CUP[0])}"></div><div><strong>${c[1]}: ${mn}${sp.name}</strong><small>Yetişkin, sağlıklı ${o.mut==="normal"?"normal ":""}balık · ödül ${o.reward} 🪙${o.gem?" + "+o.gem+" 💎":""} + ${o.xp} XP · ${fmtTime((o.exp-now)/1000)} kaldı</small></div><div class="acts"><button class="sm" data-order="${i}" ${have?"":"disabled"}>Teslim et</button><button class="sm danger" data-orderx="${i}">Vazgeç</button></div></div>`}).join("")+'<p class="note">Teslim edilen balık tankından çıkar. Koleksiyon tanklarındaki balıklar sayılmaz.</p>'}
function questDone(id){const q=QUESTS.find(x=>x.id===id);return q&&(state.daily.prog[id]||0)>=q.n}
function claimQuest(id){const D=state.daily,q=QUESTS.find(x=>x.id===id);if(!D||!q||D.claimed.includes(id)||!questDone(id))return;D.claimed.push(id);state.coins+=q.r;sfx("coins");notify("✅ Görev tamam: +"+q.r+" 🪙");addXP(20);if(!D.bonus&&D.ids.every(i=>D.claimed.includes(i))){D.bonus=true;state.coins+=40;state.gems+=2;setTimeout(()=>notify("🎁 Günün tüm görevleri bitti! +40 🪙 · +2 💎"),1200)}renderUI();save(true)}
function giftGlitch(a){const t=raisedTop(true).k;if(!t)return;const s=getSpecies(t),wt=WATER[t],dest=tankArr(wt)||(state.tank===wt?state.fish:null);if(!dest){notify("🎁 Hediyeyi almak için "+TANKS[wt].name+" tankını aç");return}if(dest.length>=fishCap(wt)){notify("🎁 Hediye için "+TANKS[wt].name+" tankında yer aç");return}const f={id:state.nextId++,type:t,sizeTrait:"normal",mutation:"glitch",gene:null,gift:true,age:1,lifeHours:0,sizeGrowth:0,rarity:"Normal",name:"Hediye Glitch",personality:"Uysal",hunger:80,health:100,sick:false,x:rand(.2,.8),y:rand(.25,.7),dir:Math.random()<.5?-1:1,phase:rand(0,6)};dest.push(f);state.ach[a.id]="claimed";addXP(30);sfx("crash");glitchFx();setTimeout(()=>notify("🎁 BİN BALIK USTASI! Hediye Glitch "+s.name+" tankına geldi 👾"),700);renderUI();save(true)}
function claimAch(id){const a=ACH.find(x=>x.id===id);if(!a||state.ach[id]!=="done")return;if(a.gift){giftGlitch(a);return}state.ach[id]="claimed";state.coins+=a.r;const ag=achGems(a);state.gems+=ag;sfx("coins");notify("🏆 "+a.n+": +"+a.r+" 🪙 · +"+ag+" 💎");addXP(30);renderUI();save(true)}
function badges(){const D=state.daily,qb=(D&&D.date===dayKey()&&D.ids.some(i=>questDone(i)&&!D.claimed.includes(i)))||orderReady(),ab=Object.values(state.ach).includes("done");const a=$("qbadge"),b=$("abadge");if(a)a.hidden=!(qb||ab||(state.level>=2&&wheelReady()));const fb=$("fbadge");if(fb)fb.hidden=!bookClaimable();if(b)b.hidden=!ab}
function renderQuests(){const D=state.daily,act=activeEvents(),nx=nextEvent();renderOrders();
$("events").innerHTML=(act.length?act.map(e=>`<div class="evt on"><strong>${e.n}</strong><small>${e.d} · şu an aktif</small></div>`).join(""):'<div class="evt"><small>Şu an aktif etkinlik yok.</small></div>')+(nx?`<div class="evt"><strong>${nx.e.n}</strong><small>${nx.e.d} · ${nx.days} gün sonra</small></div>`:"")+(deepSeen()?'<div class="evt"><strong>🌌 Derin okyanus takvimi</strong><small>✨ Biyolüminesans Gecesi her çarşamba · 🌌 Derin Göç her ayın 1–7\'si · 🐉 Ejder Ayı 10–24 Kasım</small></div>':"");
$("streak").textContent="🔥 "+(state.streak.count||0)+" günlük seri · her gün girişte +"+8*Math.min(7,Math.max(1,(state.streak.count||0)+1))+" 🪙";
$("quests").innerHTML=D.ids.map(id=>{const q=QUESTS.find(x=>x.id===id),p=D.prog[id]||0,done=p>=q.n,cl=D.claimed.includes(id);return `<div class="fish-card qrow"><div class="qicon">${cl?"✅":done?"🎁":"📋"}</div><div><strong>${q.t}</strong><small>${Math.min(p,q.n)} / ${q.n} · ödül ${q.r} 🪙 + 20 XP</small><div class="progress"><span style="width:${Math.min(100,p/q.n*100)}%"></span></div></div>${cl?'<span class="pill">Alındı</span>':`<button data-quest="${id}" ${done?"":"disabled"}>Al</button>`}</div>`}).join("")+`<p class="note">Üç görevi de bitirince +40 🪙 · +2 💎 bonus. Görevler her gün yenilenir.</p>`}
function renderAch(){const n=Object.keys(state.ach).length;$("achCount").textContent=n+" / "+ACH.length+" başarım";
$("achList").innerHTML=ACH.map(a=>{const s=state.ach[a.id];return `<div class="fish-card qrow ${s?"":"locked"}"><div class="qicon">${s?"🏆":"🔒"}</div><div><strong>${a.n}</strong><small>${a.d}${a.p&&!s?" · "+a.p():""} · ${a.gift?"ödül: 🎁 Hediye Glitch balığı":a.r+" 🪙"}</small></div>${s==="done"?`<button data-ach="${a.id}">Al</button>`:s?'<span class="pill">Alındı</span>':""}</div>`}).join("")}
function renderMap(){const t=k=>{const arr=tankArr(k),T=TANKS[k],act=state.tank===k;if(!arr&&T.coll&&state.level<T.lv)return"";if(!arr)return `<div class="fish-card qrow locked"><div class="qicon">${tankIco(T)}</div><div><strong>${T.name} tankı</strong><small>Seviye ${T.lv} · ${T.cost.toLocaleString("tr-TR")} 🪙 · ${T.info}</small></div><button data-unlock="${k}" ${state.level<T.lv||state.coins<T.cost?"disabled":""}>Aç</button></div>`;
if(T.coll)return `<div class="fish-card qrow ${act?"cur":""}"><div class="qicon">${tankIco(T)}</div><div><strong>${T.name}${act?" · buradasın":""}</strong><small>${arr.length} balık · koleksiyon, bakım gerekmez</small></div>${act?"":`<button data-go="${k}">Geç</button>`}</div>`;
const dirt=tankDirt(k),sick=arr.filter(f=>f.sick).length,wrong=isColl(k)?0:arr.filter(f=>WATER[f.type]!==tw(k)).length;
return `<div class="fish-card qrow ${act?"cur":""}"><div class="qicon">${tankIco(T)}</div><div><strong>${T.name} tankı${act?" · buradasın":""}</strong><small>${arr.length} balık · su %${Math.round(100-dirt)} temiz${sick?" · 🤒 "+sick+" hasta":""}${wrong?" · 😣 "+wrong+" yanlış suda":""}</small></div>${act?"":`<button data-go="${k}">Geç</button>`}</div>`};
$("tankList").innerHTML=TKEYS.map(t).join("")}

const SPM=new Map();function getSpecies(id){let s=SPM.get(id);if(!s){s=species.find(x=>x.id===id);if(!s)return species[0];SPM.set(id,s)}return s}
function notify(text){$("message").textContent=text;$("message").classList.add("show");clearTimeout(messageTimer);messageTimer=setTimeout(()=>$("message").classList.remove("show"),2200)}
const TRANSIENT=new Set(["_w","_wa","_wg","_wm","_wz","_wt","chase","flee","chT","fleeT","wake","slp","vx","vy","tx","ty","tt","rest","ang","fs","tp","sn","st"]);
function serial(){const ls=coinsLoose.reduce((a,c)=>a+c.v,0);return JSON.stringify(state,function(k,v){if(TRANSIENT.has(k))return undefined;return k==="pending"&&this===state?(v||0)+ls:v})}
function save(silent=false){if(VISIT||window.__nosave)return;state.savedAt=Date.now();cloudSave();try{localStorage.setItem("fishvilleClassicSave3",serial());$("lastSaved").textContent="Kaydedildi · "+new Date().toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"});if(!silent)notify("Akvaryumun kaydedildi! 💾")}catch(e){$("lastSaved").textContent="Kayıt kullanılamıyor"}}
function validSave(p){return p&&typeof p==="object"&&Array.isArray(p.fish)&&Array.isArray(p.discovered)}
function fromSave(p){const s={...initState(),...p};if(!("tank" in p))s.tank=null;return s}
let LOAD_SAVED=0;
function load(){try{const raw=localStorage.getItem("fishvilleClassicSave3");if(raw){const parsed=JSON.parse(raw);if(validSave(parsed))state=fromSave(parsed);}}catch(e){}LOAD_SAVED=+state.savedAt||0}
// seviye eğrisi: ilk seviyeler aynı, ileri seviyeler daha zor (Sv10 +%5, Sv35 +%61)
function xpNeed(l){l=Math.max(1,l|0);return 100*l+Math.floor(l*l*l/20)}
// sürüm 132: en yüksek seviye 100 · günlük XP yumuşak sınırı: günün ilk kısmı tam, sonra %30, en sonda %10 (yarın sıfırlanır)
const MAXLV=100;function xpDayCap(){return 1200+40*state.level}
function xpDayK(n){const d=dayKey();let o=state.xpDay;if(!o||o.d!==d)o=state.xpDay={d,n:0};const D=xpDayCap(),u=o.n,k=u<D?1:u<D*2?.3:.1;o.n+=n*k;if(u<D&&o.n>=D&&!o.w){o.w=1;setTimeout(()=>notify("🌙 Bugünkü XP'nin çoğunu topladın · XP kazancı yarına kadar yavaşladı"),900)}return k}
function lvCoins(l){return 20+5*l}
function lvSum(a,b){let s=0;for(let l=a+1;l<=b;l++)s+=lvCoins(l);return s}
function lvGems(l){return l%5===0?5:2}
function addXP(n,raw){if(state.level>=MAXLV){state.level=MAXLV;state.xp=Math.min(state.xp,xpNeed(MAXLV)-1);return}const g=n*(pk("ruins")?1.1:1)*critXPK();state.xp+=Math.round(raw?g:g*xpDayK(g));const l0=state.level;while(state.level<MAXLV&&state.xp>=xpNeed(state.level)){state.xp-=xpNeed(state.level);state.level++;state.coins+=lvCoins(state.level);state.gems+=lvGems(state.level)}if(state.level>=MAXLV)state.xp=Math.min(state.xp,xpNeed(MAXLV)-1);if(state.level>l0){showLevelUp(state.level,lvSum(l0,state.level),gemSum(l0,state.level));checkAch()}renderUI();save(true)}
function ageFactor(f){return Math.min(.92,.31+f.age*.75)}
function mkt(id){return state.market[id]||1}
function saleValue(f){return Math.round(getSpecies(f.type).price*ageFactor(f)*mkt(f.type)*(.3+.7*f.health/100)*(f.rarity==="Nadir"?3:1)*(f.gift?1:mutMult(f))*(1+(f.sizeGrowth||0))*SIZES[szOf(f)].v*(ev("harvest")?1.15:1)*deepEvK(f))}
const MATURE=.95;
function growHours(s){return s.grow||1+s.price/60}
function incomeRate(s){return s.price*.045/3600}
function fmtTime(sec){sec=Math.max(0,Math.round(sec));const h=Math.floor(sec/3600),m=Math.floor(sec%3600/60);if(h>0)return h+" sa "+m+" dk";if(m>0)return m+" dk";return sec+" sn"}
function marketTick(now){if(now-state.marketAt>864e5)state.marketAt=now-864e5;while(now>=state.marketAt){state.marketAt+=36e5;species.forEach(sp=>{const m=state.market[sp.id]||1;state.market[sp.id]=Math.max(.7,Math.min(1.3,m*(.85+Math.random()*.3)+(1-m)*.15))})}}
let OFFLINE=false;
function simTank(st,hz,res){
if(isColl(state.tank)){state.fish.forEach(f=>f.st="");return 0}
const fr=state.fish,bettas=fr.filter(f=>f.type==="betta").length,gold=fr.some(f=>f.type==="gold");let earned=0;
if(hz)state.dirt=Math.min(100,state.dirt+st*.0012*fr.length*critShrimpK()*Math.pow(.8,state.snails)*(pk("table")?.92:1)*Math.max(.3,1-(state.equipment.filter||0)*.13-Math.min(.25,(state.decor||[]).length*.015)));
for(let i=fr.length-1;i>=0;i--){const f=fr[i],s=getSpecies(f.type);
const wrong=!isColl(state.tank)&&WATER[f.type]!==tw(state.tank),fight=f.type==="betta"&&bettas>1,scared=gold&&SMALL.includes(f.type);
f.st=wrong?"water":fight?"fight":scared?"scared":"";
if(hz){f.hunger=Math.max(0,f.hunger-st*.0093*((TRAIT[f.type]||TR0).hungry||1)*(1-(state.equipment.feeder||0)*.18)*(pk("bonsai")?.9:1));
if(f.hunger<=0)f.health-=st*.0139;
if(!f.sick&&state.dirt>60&&Math.random()<1-Math.exp(-st*(state.dirt-60)/144000)){f.sick=true;res.sick++}
if(f.sick)f.health-=st*.0093*(pk("cave")?.75:1);else if(f.hunger>30&&state.dirt<60&&!wrong&&!fight)f.health=Math.min(100,f.health+st*.028);
if(wrong)f.health-=st*.0035;if(fight)f.health-=st*.0029;
if(OFFLINE&&f.health<25){f.health=25;res.weak=(res.weak||0)+1}if(f.health<=0){res.dead.push(f.name||s.name);fr.splice(i,1);continue}}
if(!f.sick&&f.hunger>20&&!wrong){const dg=s.deep&&ev("abyss")?1.3:1,rate=MATURE/(growHours(s)*3600)*(scared?.5:1)*dg;f.lifeHours=(f.lifeHours||0)+st/3600;if(f.age<1)f.age=Math.min(1,f.age+st*rate);else{const G=growHours(s)*3600/MATURE*(scared?2:1)/dg,y=(f.sizeGrowth||0)/YS;if(y<2)f.sizeGrowth=Math.min(.75,YS*(y+st/((y<1?2:3)*G)))}if(f.age>=MATURE)earned+=st*incomeRate(s)}
}
return earned}
function advance(sec){
const now=Date.now(),res={dead:[],sick:0};
if(!(sec>0)){state.lastTick=now;return res}
OFFLINE=sec>90;let left=sec,haz=8*3600,earned=0;const k0=state.tank,ks=Object.keys(state.stash).filter(k=>!isColl(k));
while(left>0){const st=Math.min(left,600),hz=haz>0;left-=st;haz-=st;
earned+=simTank(st,hz,res);for(const k of ks){swapTo(k);earned+=simTank(st,hz,res);swapTo(k0)}}
let cap=0;workFish().forEach(f=>cap+=incomeRate(getSpecies(f.type))*8*3600);
state.pending=Math.min(cap,(state.pending||0)+earned*(pk("diver")?1.08:1));
marketTick(now);
if(!state.chest&&now>=state.chestAt)state.chest={x:rand(.12,.88)};
state.lastTick=now;OFFLINE=false;return res;
}


// ===== Omurgasızlar: karidesler ve denizanaları (satılmaz, tanka yardım eder)
const CRIT=[
{id:"cherry",t:"sh",w:"fresh",n:"Kiraz Karides",img:"a/2f348e7e5511936f.webp",p:120,lv:3,leg:"rgba(215,40,30,.85)",leg2:"rgba(240,90,70,.85)",ant:"rgba(230,80,60,.85)"},
{id:"blue",t:"sh",w:"fresh",n:"Mavi Kadife Karides",img:"a/650752e883f9f95f.webp",p:150,lv:3,leg:"rgba(40,90,210,.85)",leg2:"rgba(110,170,255,.85)",ant:"rgba(150,200,255,.85)"},
{id:"cleaner",t:"sh",w:"salt",n:"Temizlikçi Karides",img:"a/616696193c06df18.webp",p:180,lv:3,leg:"rgba(255,245,240,.92)",leg2:"rgba(230,60,40,.9)",ant:"rgba(255,250,245,.9)"},
{id:"tiger",t:"sh",w:"salt",n:"Kaplan Karides",img:"a/eec3f557cb8fe220.webp",p:200,lv:3,leg:"rgba(225,165,80,.85)",leg2:"rgba(90,50,20,.85)",ant:"rgba(240,200,140,.85)"},
{id:"jpink",t:"je",w:"salt",n:"Pembe Ay Denizanası",img:"a/4d1c38eb1db8ed58.webp",arm:"a/2ff21647530ce6fe.webp",c:[330,80,72],g:6,lv:5},
{id:"jcyan",t:"je",w:"salt",n:"Mavi Ay Denizanası",img:"a/b6c37055e6cca7ce.webp",arm:"a/e2aa3d086997318d.webp",c:[198,85,66],g:6,lv:5},
{id:"jorange",t:"je",w:"salt",n:"Turuncu Denizanası",img:"a/7fb605be3c702081.webp",arm:"a/335f79dff38d4087.webp",c:[26,92,62],g:8,lv:5},
{id:"jviolet",t:"je",w:"salt",n:"Mor Yıldız Denizanası",img:"a/f58f9ab9643b597c.webp",arm:"a/f9266b98d94b368e.webp",c:[268,70,70],g:10,lv:5},
{id:"jdeep",t:"je",w:"deep",n:"Derin Denizanası",img:"a/bc73441ef51a2c12.webp",arm:"a/6e15abeca614c42d.webp",c:[262,82,68],g:12,lv:38},
{id:"iso",t:"iso",w:"deep",n:"Dev İzopod",img:"a/aba3ffc3ffb51498.webp",p:2500,lv:40},
{id:"comb",t:"ct",w:"deep",n:"Taraklı Denizanası",img:"a/cb8856e631632404.webp",rows:"a/0dac2ca06132cb86.webp",g:14,lv:41},
{id:"atolla",t:"at",w:"deep",n:"Atolla Taç Denizanası",img:"a/cd22652d99d8797c.webp",arm:"a/55c2a8810a60ff65.webp",g:18,lv:44},
{id:"gsquid",t:"sq",w:"deep",n:"Cam Mürekkep Balığı",img:"a/b50963a080ee65a2.webp",arm:"a/70658b53bc321b03.webp",p:6000,lv:45}];
const CMAX={sh:4,je:3,iso:2,ct:3,at:2,sq:2},CIM={};
// tür adı ve faydası (mağaza ve uyarılar için)
const CTN={sh:"karides",je:"denizanası",iso:"izopod",ct:"taraklı denizanası",at:"Atolla",sq:"mürekkep balığı"},CPERK={sh:"Kirlenmeyi %8 yavaşlatır · tank başına en fazla 4",iso:"Dipteki artıkları yer · kirlenmeyi %10 yavaşlatır · tank başına en fazla 2",je:"Gece parlar · XP +%4 · tank başına en fazla 3",ct:"Kirpikleriyle süzülür, tarak sıralarında gökkuşağı dalgaları akar · XP +%4 · en fazla 3",at:"Dokununca dönen mavi ışık çarkıyla alarm verir · XP +%5 · en fazla 2",sq:"Jet gibi fırlar, dokununca top olup mürekkep bırakır · kirlenmeyi %6 yavaşlatır · en fazla 2"},CBUY={sh:"Suyun daha yavaş kirlenmesini sağlar.",iso:"Dipteki artıkları yer, su daha yavaş kirlenir.",je:"Gece parlar, kazandığın XP'yi artırır.",ct:"Tarak sıralarındaki gökkuşağı dalgalarını izle!",at:"Ona dokun: ışık alarmını gör.",sq:"Ona dokun: top olup mürekkep bırakır."};
function cImg(src){let i=CIM[src];if(!i){i=CIM[src]=new Image();i.src=""+B64(src)}return i.complete&&i.naturalWidth?i:null}
function critList(k){if(!state.crit||typeof state.crit!=="object")state.crit={};const a=state.crit[k||state.tank];return Array.isArray(a)?a:[]}
function critCount(k,t){return critList(k).filter(c=>{const d=CRIT.find(x=>x.id===c.k);return d&&d.t===t}).length}
function critShrimpK(){return Math.max(.6,1-.08*critCount(state.tank,"sh")-.1*critCount(state.tank,"iso")-.06*critCount(state.tank,"sq"))}
function critXPK(){let n=0;for(const k in (state.crit||{}))n+=.04*(critCount(k,"je")+critCount(k,"ct"))+.05*critCount(k,"at");return 1+n}
function buyCrit(id){const d=CRIT.find(x=>x.id===id);if(!d||VISIT)return;if(isColl(state.tank)){notify("Koleksiyon tankına eklenemez");return}if(tw(state.tank)!==d.w){notify(d.n+" "+TANKS[d.w].name+" tankında yaşar");return}if(state.level<d.lv){notify("Seviye "+d.lv+lokEk(d.lv)+" açılır");return}if(critCount(state.tank,d.t)>=CMAX[d.t]){notify("Bu tank en fazla "+CMAX[d.t]+" "+CTN[d.t]+" alabilir");return}
 if(d.g){if((state.gems||0)<d.g){notify("Yeterli 💎 yok");return}state.gems-=d.g}else{if(state.coins<d.p){notify("Yeterli 🪙 yok");return}state.coins-=d.p}
 if(!state.crit||typeof state.crit!=="object")state.crit={};const a=state.crit[state.tank]=critList(state.tank).slice();a.push({id:state.nextId++,k:id});sfx("buy");notify(d.n+" tanka girdi! "+CBUY[d.t]);renderUI();save(true)}
function critShopHTML(){return CRIT.map(d=>{const n=critCount(state.tank,d.t),lock=state.level<d.lv,wr=isColl(state.tank)||tw(state.tank)!==d.w;const perk=CPERK[d.t]||"";const pr=d.g?d.g+" 💎":d.p+" 🪙";
 return '<div class="fish-card qrow crit"><div class="qicon"><img class="cuimg" alt="" src="'+B64(d.img)+'"></div><div><strong>'+d.n+'</strong><small>'+(d.w==="salt"?"🌊 Tuzlu su":d.w==="deep"?"🌌 Derin Okyanus":"🌿 Tatlı su")+" · "+perk+(lock?" · Seviye "+d.lv+lokEk(d.lv)+" açılır":"")+'</small></div><button class="sm" data-crit="'+d.id+'"'+(lock||wr||n>=CMAX[d.t]?" disabled":"")+'>'+pr+"</button></div>"}).join("")}
const CRT=new Map();
function critRT(){if(VISIT){CRT.clear();return[]}const L=critList(state.tank),ids=new Set(L.map(c=>c.id));for(const id of [...CRT.keys()])if(!ids.has(id))CRT.delete(id);
 return L.map(c=>{let o=CRT.get(c.id);if(!o){const d=CRIT.find(x=>x.id===c.k);if(!d)return null;o=d.t==="sh"?mkShr(d):d.t==="iso"?mkIso(d):d.t==="ct"?mkCt(d):d.t==="at"?mkAt(d):d.t==="sq"?mkSq(d):mkJel(d);CRT.set(c.id,o)}return o}).filter(Boolean)}
const CU=.5;
function mkJel(d){const r=rand(26,34),x=rand(BX0+r,BX1-r),y=rand(H*.3,H*.55),j={d,x,y,r,ph:Math.random(),period:rand(2.1,2.9),vx:0,vy:0,tx:x,c:0,fl:0,tent:[],arms:[],t:Math.random()*10};
 const len=r*rand(1.6,2.3);for(let i=0;i<9;i++){const pts=[];for(let k=0;k<10;k++)pts.push({x,y:y+k*len/10,px:x,py:y+k*len/10});j.tent.push({pts,sl:len/10*rand(.85,1.15)})}
 for(let i=0;i<3;i++)j.arms.push({o:rand(0,6),len:r*rand(1.5,2.1),fl:i%2});return j}
function mkShr(d){return{d,x:rand(BX0+40,BX1-40),y:FLOOR-10,dir:Math.random()<.5?1:-1,vx:0,vy:0,len:rand(52,62),mode:"walk",t:Math.random()*9,curl:0,flip:0,leg:0,swim:0,next:rand(2,5),pause:0,tilt:0}}
function stepJel(j,dt){const u=CU;j.t+=dt;const p0=j.ph;j.ph+=dt/j.period*(j.fl>0?1.9:1);if(Math.floor(j.ph)!==Math.floor(p0))j.tx=bestSpot(j,3,()=>[Math.max(BX0+j.r,Math.min(BX1-j.r,j.x+rand(-W*.25,W*.25))),j.ty||j.y])[0];
 // sürüm 127: hedef derinlik — hedefin altındayken güçlü atar, üstündeyken atışı zayıflar ve batar (eskiden hep en üste çıkıp kalıyordu)
 if(!(j.nty>j.t)){j.nty=j.t+rand(8,16);j.ty=bestSpot(j,3,()=>[j.tx||j.x,rand(H*.24,FLOOR-j.r*3.2)])[1]}const kd=j.fl>0?1:Math.max(0,Math.min(1.5,.35+(j.y-j.ty)/70));
 const p=j.ph%1;j.c=p<.28?Math.sin(p/.28*Math.PI):0;const th=j.c*(j.fl>0?260:130*kd)*u;j.vy+=(-th+22*u)*dt;j.vx+=((j.tx-j.x)*.25-j.vx)*dt*.8;j.vx*=Math.exp(-dt*.6);j.vy*=Math.exp(-dt*1.6);j.fl=Math.max(0,j.fl-dt);
 j.x+=j.vx*dt;j.y+=j.vy*dt;const top=H*.16+j.r,bot=FLOOR-j.r*2.6;if(j.y<top){j.y=top;j.vy=Math.abs(j.vy)*.3}if(j.y>bot){j.y=bot;j.vy=-Math.abs(j.vy)*.2-10}j.x=Math.max(j.r,Math.min(W-j.r,j.x));
 const w=j.r*(1-.22*j.c),n=j.tent.length;j.tent.forEach((T,i)=>{const a=(i/(n-1)-.5)*1.7,ax=j.x+Math.sin(a)*w*.92,ay=j.y+j.r*.1;const P=T.pts;
  for(let k=1;k<P.length;k++){const q=P[k],vx=(q.x-q.px)*.94,vy=(q.y-q.py)*.94;q.px=q.x;q.py=q.y;q.x+=vx+Math.sin(j.t*1.3+i+k*.5)*.04;q.y+=vy+.06}
  P[0].x=ax;P[0].y=ay;P[0].px=ax;P[0].py=ay;for(let it=0;it<3;it++)for(let k=1;k<P.length;k++){const A=P[k-1],B=P[k],dx=B.x-A.x,dy=B.y-A.y,dd=Math.hypot(dx,dy)||1,df=(dd-T.sl)/dd;if(k===1){B.x-=dx*df;B.y-=dy*df}else{A.x+=dx*df*.5;A.y+=dy*df*.5;B.x-=dx*df*.5;B.y-=dy*df*.5}}})}
function hsl2rgb(h,s,l){s/=100;l/=100;const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,9-k(n),1));return[Math.round(f(0)*255),Math.round(f(8)*255),Math.round(f(4)*255)]}
function hslc(c,a,l){return"hsla("+c[0]+","+c[1]+"%,"+(l==null?c[2]:l)+"%,"+a+")"}
function drawJel(j){const d=j.d,bi=cImg(d.img),ai=cImg(d.arm),col=d.c,glow=nightAmt(),x=j.x,y=j.y,w=j.r*(1-.22*j.c),ar=bi?bi.naturalHeight/bi.naturalWidth:.6,bw=w*2.12,bh=j.r*2*ar*(1+.2*j.c);
 ctx.lineCap="round";j.tent.forEach(T=>{ctx.beginPath();const P=T.pts;ctx.moveTo(P[0].x,P[0].y);for(let k=1;k<P.length-1;k++)ctx.quadraticCurveTo(P[k].x,P[k].y,(P[k].x+P[k+1].x)/2,(P[k].y+P[k+1].y)/2);ctx.strokeStyle=hslc(col,.35+.35*glow,78+8*glow);ctx.lineWidth=Math.max(.7,j.r*.03);ctx.stroke()});
 if(ai){const aw0=w*.62;j.arms.forEach((A,i)=>{const ah=A.len*(1+.15*j.c),aw=aw0*(i===1?1:.8),n=LQ?7:12,sh=ai.naturalHeight/n,dh=ah/n,cx=x+(i-1)*w*.28;ctx.save();ctx.globalAlpha=.92;for(let k=0;k<n;k++){const f=(k+.5)/n,dx=Math.sin(j.t*1.6+A.o+f*3.2)*w*.2*f-j.vx*.06*f*f,yy=y-bh*.06+k*dh;if(A.fl){ctx.save();ctx.translate(cx+dx,0);ctx.scale(-1,1);ctx.drawImage(ai,0,k*sh,ai.naturalWidth,sh+1,-aw/2,yy,aw,dh+1);ctx.restore()}else ctx.drawImage(ai,0,k*sh,ai.naturalWidth,sh+1,cx+dx-aw/2,yy,aw,dh+1)}ctx.restore()})}
 if(glow>.01){ctx.save();ctx.globalCompositeOperation="lighter";ctx.globalAlpha=.55*glow;const R0=j.r*2.6;ctx.drawImage(glowSpr(j.rgb||(j.rgb=hsl2rgb(col[0],col[1],62))),x-R0,y-bh*.45-R0,R0*2,R0*2);ctx.restore()}
 if(bi){ctx.drawImage(bi,x-bw/2,y-bh*.9,bw,bh);if(glow>.01){ctx.save();ctx.globalCompositeOperation="lighter";ctx.globalAlpha=.45*glow;ctx.drawImage(bi,x-bw/2,y-bh*.9,bw,bh);ctx.restore()}}}
// ===== sürüm 125: yeni derin okyanus omurgasızları
// Bazı ışıklar karanlık örtünün üstüne çizilmeli (tarak sıralarının gökkuşağı, mürekkep): bunlar CPOST listesine eklenir,
// derin okyanus ışık geçişinde (drawDeepLight) çizilir.
let CPOST=[];const INK=[];
// --- Taraklı denizanası: atmaz, kirpikleriyle hep aynı hızda süzülür; tarak sıralarında renk dalgaları yukarıdan aşağı akar
function mkCt(d){const r=rand(20,26),im=cImg(d.img);return{d,r,ar:im?im.naturalHeight/im.naturalWidth:1.6,x:rand(BX0+60,BX1-60),y:rand(H*.25,H*.6),vx:0,vy:0,tx:0,ty:0,t:rand(0,9),nt:0,rot:0,fl:0}}
function stepCt(o,dt){o.t+=dt;o.nt-=dt;if(o.nt<=0){o.nt=rand(5,10);[o.tx,o.ty]=bestSpot(o,3,()=>[rand(BX0+o.r*2,BX1-o.r*2),rand(H*.18,FLOOR-o.r*o.ar*1.4)])}
 const dx=o.tx-o.x,dy=o.ty-o.y,d=Math.hypot(dx,dy)||1,sp=Math.min(9,d*.2)*(o.fl>0?2.2:1);o.vx+=(dx/d*sp-o.vx)*Math.min(1,dt*.7);o.vy+=(dy/d*sp-o.vy)*Math.min(1,dt*.7);o.x+=o.vx*dt;o.y+=o.vy*dt;
 o.rot+=((Math.sin(o.t*.31)*.18+o.vx*.012)-o.rot)*Math.min(1,dt*.8);o.fl=Math.max(0,o.fl-dt)}
function drawCt(o){const bi=cImg(o.d.img),ri=cImg(o.d.rows);if(!bi)return;const w=o.r*2*(1-.06*Math.min(1,o.fl)),h=w*o.ar;ctx.save();ctx.translate(o.x,o.y);ctx.rotate(o.rot);ctx.globalAlpha=.9;ctx.drawImage(bi,-w/2,-h/2,w,h);ctx.restore();
 if(!ri)return;const x=o.x,y=o.y,rot=o.rot,t=o.t,dir=o.vy>2?-1:1,fl=o.fl;
 CPOST.push(()=>{ctx.save();ctx.translate(x,y);ctx.rotate(rot);const n=LQ?8:14,ih=ri.naturalHeight,iw=ri.naturalWidth,sh=ih/n,dh=h/n;for(let k=0;k<n;k++){const ph=t*5.2*dir-k*.62,a=.16+.84*Math.pow(Math.max(0,Math.sin(ph)),2);ctx.globalAlpha=Math.min(1,a*(.85+.6*Math.min(1,fl)));ctx.drawImage(ri,0,k*sh,iw,sh+.5,-w/2,-h/2+k*dh,w,dh+.4)}ctx.restore()})}
// --- Atolla taç denizanası: ağır atar, uzun dokunacı arkada sürüklenir; dokununca kenarında mavi ışık çarkı döner (hırsız alarmı)
function mkAt(d){const j=mkJel(d);j.r=rand(30,36);j.period=rand(3.4,4.4);j.al=0;j.spin=0;return j}
function drawAt(j){const bi=cImg(j.d.img),ai=cImg(j.d.arm);if(!bi)return;const c=j.c,bw=j.r*2.5*(1-.12*c),bh=bw*bi.naturalHeight/bi.naturalWidth*(1+.18*c),top=j.y-bh*.85,x=j.x;
 if(ai){const ah=bw*ai.naturalHeight/ai.naturalWidth*(1+.08*c),y0=top+bh*(300/395),n=LQ?9:14,sh=ai.naturalHeight/n,dh=ah/n;for(let k=0;k<n;k++){const f=(k+.5)/n,dx=Math.sin(j.t*1.15-k*.38)*bw*.09*Math.pow(f,1.4)-j.vx*.1*f*f;ctx.drawImage(ai,0,k*sh,ai.naturalWidth,sh+1,x-bw/2+dx,y0+k*dh,bw,dh+1)}}
 ctx.drawImage(bi,x-bw/2,top,bw,bh);j._rim=[x,top+bh*.74,bw*.47,bh*.2]}
function atollaAlarm(j){j.al=3.2;j.fl=2.5;sfx("bubble");for(const f of state.fish){const dx=f.x*W-j.x,dy=f.y*H-j.y,d=Math.hypot(dx,dy);if(d>260)continue;if(fishW(f)<90){f.flee={x:j.x/W,y:j.y/H};f.fleeT=simT+2.2}else{f.look=[j.x,j.y];f.lookT=simT+3;f.rest=false}}}
// --- Cam mürekkep balığı: manto önde, jet itişiyle fırlar; kollar arkada dalgalanır; dokununca top olup mürekkep bırakır
function mkSq(d){return{d,x:rand(BX0+80,BX1-80),y:rand(H*.25,H*.6),dir:Math.random()<.5?1:-1,fs:1,vx:0,vy:0,t:rand(0,9),nj:rand(1,3),jet:0,ball:0,L:rand(58,68),tilt:0}}
function stepSq(o,dt){o.t+=dt;o.nj-=dt;if(o.fs===undefined)o.fs=o.dir;
 const back=-o.dir,wall=back<0?o.x<BX0+o.L:o.x>BX1-o.L;if(wall&&o.ball<.1&&Math.random()<dt*2)o.dir*=-1;
 if(o.nj<=0&&o.ball<.2){o.nj=rand(2.2,3.8);o.jet=1;o.vx+=back*rand(70,95);o.vy+=rand(-18,18)+(o.y>FLOOR-80?-20:o.y<H*.2?16:0)}
 o.jet=Math.max(0,o.jet-dt*2.6);o.ball=Math.max(0,o.ball-dt*.6);o.vx*=Math.exp(-dt*1.1);o.vy*=Math.exp(-dt*1.3);o.vy+=Math.sin(o.t*.7)*3*dt;
 o.x+=o.vx*dt;o.y+=o.vy*dt;o.x=Math.max(BX0+20,Math.min(BX1-20,o.x));o.y=Math.max(H*.15,Math.min(FLOOR-30,o.y));o.fs+=(o.dir-o.fs)*Math.min(1,dt*5);o.tilt+=((o.vy/90)-o.tilt)*Math.min(1,dt*3)}
function squidScare(o,tx){o.ball=1.6;o.dir=tx>o.x?1:-1;setTimeout(()=>{o.jet=1;o.vx+=-o.dir*150;o.nj=rand(2.5,4)},500);for(let i=0;i<14;i++)INK.push({x:o.x+rand(-8,8),y:o.y+rand(-6,6),vx:rand(-14,14),vy:rand(-10,10),r:rand(5,10),life:rand(2.5,4),l0:4});if(!state.lowGfx)for(let i=0;i<14&&SPK.length<200;i++){const a=rand(0,6.3),r=rand(3,18);SPK.push({x:o.x+Math.cos(a)*r,y:o.y+Math.sin(a)*r,vx:Math.cos(a)*rand(6,18),vy:Math.sin(a)*rand(6,18),life:rand(.6,1.4),l0:1.4})}sfx("bubble")}
function drawSq(o){const bi=cImg(o.d.img),ai=cImg(o.d.arm);if(!bi)return;const bw=o.L,bh=bw*bi.naturalHeight/bi.naturalWidth,j=o.jet,b=Math.min(1,o.ball);ctx.save();ctx.translate(o.x,o.y);ctx.scale(o.fs*(1-.18*b),1);ctx.rotate(o.tilt*.4);
 if(ai){const ah=bh*1.14*(1-.55*b),aw=bw*1.1*(1-.3*j)*(1-.7*b),ax=bw*.3,ay=bh*(.63-.5)-ah*.46,n=LQ?6:10,sw=ai.naturalWidth/n,dw=aw/n;for(let k=0;k<n;k++){const f=(k+.5)/n,dy=Math.sin(o.t*2.4-k*.55)*ah*.14*f*(1-b)+o.vy*.05*f;ctx.drawImage(ai,k*sw,0,sw+1,ai.naturalHeight,ax+k*dw,ay+dy,dw+1,ah)}}
 ctx.scale(1+.06*j,1-.13*j);ctx.globalAlpha=.94;ctx.drawImage(bi,-bw/2,-bh/2,bw,bh);const T=ctx.getTransform();ctx.restore();CPOST.push(()=>{ctx.save();ctx.setTransform(T);ctx.globalAlpha=.32;ctx.drawImage(bi,-bw/2,-bh/2,bw,bh);ctx.restore()});
 const m=[[.72,.63],[.745,.33]];o._eyes=m.map(p=>[o.x+o.fs*(1-.18*b)*(p[0]-.5)*bw,o.y+(p[1]-.5)*bh])}
function inkDraw(dt){if(!INK.length)return;for(const p of INK){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=Math.exp(-dt*.8);p.vy*=Math.exp(-dt*.8);p.r+=dt*7}for(let i=INK.length-1;i>=0;i--)if(INK[i].life<=0)INK.splice(i,1);
 const S=inkSpr();CPOST.push(()=>{ctx.save();ctx.globalCompositeOperation="source-over";for(const p of INK){ctx.globalAlpha=Math.min(1,Math.min(1,p.life/p.l0*1.4)*.55);ctx.drawImage(S,p.x-p.r,p.y-p.r,p.r*2,p.r*2)}ctx.restore()})}
let INKS=null;function inkSpr(){if(INKS)return INKS;const c=document.createElement("canvas");c.width=c.height=48;const x=c.getContext("2d"),g=x.createRadialGradient(24,24,0,24,24,24);g.addColorStop(0,"rgba(46,26,20,1)");g.addColorStop(.6,"rgba(30,16,12,.6)");g.addColorStop(1,"rgba(18,8,6,0)");x.fillStyle=g;x.fillRect(0,0,48,48);return INKS=c}
// ışıklar: karanlık örtüye delik (ENV) ve ışık noktaları (EM)
function critLights(t){for(const o of CRT.values()){const T=o.d.t;
 if(T==="ct"){ENV.push([o.x,o.y,o.r*3.2,[170,190,255],.16+.3*Math.min(1,o.fl)])}
 else if(T==="at"){const R=o._rim;ENV.push([o.x,o.y-o.r*.4,o.r*3,[255,70,60],.16]);if(R&&o.al>0){const fd=Math.min(1,o.al/.6),sp=t*7.5,n=22;for(let i=0;i<n;i++){const an=i/n*Math.PI*2,cq=Math.max(0,Math.cos(an-sp)),a=Math.pow(cq,5)*.95+.15;EM.push([R[0]+Math.cos(an)*R[2],R[1]+Math.sin(an)*R[3],2.3,[90,175,255],a*fd,cq>.93?1:0])}ENV.push([o.x,o.y,o.r*5,[70,140,255],.4*fd])}}
 else if(T==="sq"&&o._eyes){for(const e of o._eyes)EM.push([e[0],e[1],1.3,[200,232,255],.75*(1-.6*Math.min(1,o.ball)),0]);ENV.push([o.x,o.y,o.L*1.2,[200,220,255],.2])}}}
// Dev izopod v2: eklemli kabuk (9 halka), 7 çift yürüme bacağı (arkadan öne dalga hâlinde adım), oynayan antenler,
// dokununca gerçekçi şekilde top olur, dipteki yemi bulup yer, adımlarında kum kalkar, gözleri ışıkta parlar
let ISOB=null;
const ISO_CUT=[[0,141],[12,137],[40,129],[80,121],[120,114],[160,108],[200,106],[240,103],[258,104],[268,111],[284,121],[298,119],[310,110],[318,100],[318,78],[360,78],[360,190],[0,190]];
const ISO_LEG=[52,88,124,160,196,230,258],ISO_NS=9,ISO_X1=320,ISO_CX=165,ISO_VY=118;
function isoCutY(px){for(let i=1;i<ISO_CUT.length;i++){const a=ISO_CUT[i-1],b=ISO_CUT[i];if(px>=a[0]&&px<=b[0]&&b[0]>a[0])return a[1]+(b[1]-a[1])*(px-a[0])/(b[0]-a[0])}return ISO_VY}
function isoBody(im){if(ISOB&&ISOB.im===im)return ISOB;const iw=im.naturalWidth,ih=im.naturalHeight,sx=iw/360,sy=ih/190,c=document.createElement("canvas");c.width=iw;c.height=ih;const x=c.getContext("2d");x.drawImage(im,0,0);x.globalCompositeOperation="destination-out";x.beginPath();ISO_CUT.forEach((p,i)=>{i?x.lineTo(p[0]*sx,p[1]*sy):x.moveTo(p[0]*sx,p[1]*sy)});x.closePath();x.fill();const top=[];try{const D=x.getImageData(0,0,iw,ih).data;for(let i=0;i<=36;i++){const cx=Math.min(iw-1,Math.round(i*ISO_X1/36*sx));let y=0;while(y<ih&&D[(y*iw+cx)*4+3]<60)y++;top.push(Math.min(ISO_VY,y/sy))}}catch(e){for(let i=0;i<=36;i++)top.push(20)}ISOB={im,c,iw,ih,sx,sy,top};return ISOB}
function isoTop(B,px){const f=Math.max(0,Math.min(36,px/ISO_X1*36)),i=Math.min(35,f|0),u=f-i;return B.top[i]*(1-u)+B.top[i+1]*u}
function mkIso(d){return{d,x:rand(BX0+70,BX1-70),y:FLOOR+16,dir:Math.random()<.5?1:-1,face:0,vx:0,len:rand(72,84),t:Math.random()*9,g:Math.random(),st:0,pause:rand(.5,2),next:rand(4,8),c:0,cT:0,curl:0,eat:0,food:null,look:0,dust:[],ant:rand(0,6),tap:0,groom:-1,gT:0,pl:new Array(7).fill(0)}}
function isoPoke(o){o.cT=rand(2.6,4.2);o.eat=0;o.food=null;o.pause=Math.max(o.pause,o.cT+.6);sfx("click")}
function stepIso(o,dt){o.t+=dt;o.next-=dt;o.look-=dt;if(o.face===0)o.face=o.dir;
 // top olma: hızlı kapanır, yavaş açılır
 if(o.cT>0){o.cT-=dt;o.c=Math.min(1,o.c+dt*3.2)}else o.c=Math.max(0,o.c-dt*.95);o.curl=o.c;
 const L=o.len,S=L/360,head=o.x+o.face*L*.42;
 // dipteki yemi ara (canlı yem dibe çökünce)
 if(o.look<=0&&o.c<.05){o.look=.6;let best=null,bd=1e9;for(const d of drops){if(d.eaten||d.ph!=="floor")continue;const dd=Math.abs(d.x-o.x);if(dd<bd&&dd<W*.6){bd=dd;best=d}}o.food=best}
 if(o.food&&(o.food.eaten||o.food.ph!=="floor"))o.food=null;
 let want=0;
 if(o.c>.02){want=0}
 else if(o.eat>0){o.eat-=dt;want=0;if(o.eat<=0&&o.food){o.food.eaten=true;crumbs(o.food.x,o.food.y,3,o.food.col||"#ff9c7c");o.food=null;o.pause=rand(1,2.5)}}
 else if(o.food){const want_dir=o.food.x>=o.x?1:-1;if(want_dir!==o.dir){o.dir=want_dir}else if(Math.abs(o.face-o.dir)<.3){if(Math.abs(head-o.food.x)<7*S*10/10+4)o.eat=rand(2.2,3.2);else want=15*CU*2}}
 else if(o.pause>0){o.pause-=dt;
  // dururken bazen bir bacağını temizler
  if(o.groom<0&&Math.random()<dt*.25){o.groom=Math.random()*7|0;o.gT=0}}
 else{want=9*CU*2;if(o.next<0){o.next=rand(4,9);const r=Math.random();if(r<.45)o.pause=rand(1.5,4.5);else if(r<.7)o.dir*=-1}}
 if(o.groom>=0){o.gT+=dt;if(o.gT>1.2)o.groom=-1}
 // dönüş: gövde önce dönmeli, sonra yürümeli
 o.face+=(o.dir-o.face)*Math.min(1,dt*2.6);if(Math.abs(o.face-o.dir)>.35)want=0;
 o.vx+=(o.dir*want-o.vx)*Math.min(1,dt*2.2);
 const v=Math.abs(o.vx);o.st+=((v>.6?Math.min(22,10+v*.9)*S*3.3:0)-o.st)*Math.min(1,dt*3);
 const step=v>.3?.7*v/Math.max(1,o.st):0;o.g+=step*dt;
 o.x+=o.vx*dt;const m=L*.55;if(o.x<BX0+m){o.x=BX0+m;o.dir=1}if(o.x>BX1-m){o.x=BX1-m;o.dir=-1}
 // kum tozu
 for(const p of o.dust){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=(-2-p.vy)*Math.min(1,dt*2);p.vx*=1-Math.min(1,dt*1.5)}o.dust=o.dust.filter(p=>p.life>0)}
// IK: kalça H, ayak bileği F, uzunluk a,b -> diz (gövde merkezinden uzağa bükülür)
function isoKnee(hx,hy,fx,fy,a,b,out){const dx=fx-hx,dy=fy-hy;let d=Math.hypot(dx,dy)||1e-3;if(d>a+b-.01)d=a+b-.01;const al=Math.atan2(dy,dx),be=Math.acos(Math.max(-1,Math.min(1,(a*a+d*d-b*b)/(2*a*d))));const k1=[hx+a*Math.cos(al+be),hy+a*Math.sin(al+be)],k2=[hx+a*Math.cos(al-be),hy+a*Math.sin(al-be)];return (out>0?k1[0]>k2[0]:k1[0]<k2[0])?k1:k2}
function isoSeg(x0,y0,x1,y1,w0,w1,col,far){const a=Math.atan2(y1-y0,x1-x0),nx=-Math.sin(a),ny=Math.cos(a);ctx.beginPath();ctx.moveTo(x0+nx*w0,y0+ny*w0);ctx.lineTo(x1+nx*w1,y1+ny*w1);ctx.lineTo(x1-nx*w1,y1-ny*w1);ctx.lineTo(x0-nx*w0,y0-ny*w0);ctx.closePath();ctx.fillStyle=col;ctx.fill();ctx.lineWidth=Math.max(.5,w1*.45);ctx.strokeStyle=far?"rgba(18,8,22,.85)":"rgba(40,16,34,.9)";ctx.stroke();if(!far){ctx.beginPath();ctx.moveTo(x0+nx*w0*.45,y0+ny*w0*.45-w0*.2);ctx.lineTo(x1+nx*w1*.45,y1+ny*w1*.45-w1*.2);ctx.strokeStyle="rgba(255,228,240,.45)";ctx.lineWidth=Math.max(.4,w1*.35);ctx.stroke()}}
function drawIso(o){const im=cImg(o.d.img);if(!im)return;const B=isoBody(im),L=o.len,S=L/360,c=o.c,e=c*c*(3-2*c),t=o.t;
 // kıvrılma: sırt çizgisi bir çemberin üstüne sarılır (top olmuş izopod), kabuk kalınlığı içe doğru sıkışır
 const k=e*(1.7*Math.PI)/(ISO_X1*S),ride=50*S,hsc=1-.38*e,dip=o.eat>0?.5+.5*Math.sin(t*5):0,walk=Math.min(1,Math.abs(o.vx)/6),bob=-Math.abs(Math.sin(o.g*Math.PI*2*2))*.7*S*walk;
 const th=px=>{const s=(px-ISO_CX)*S;return s*k+(px>250?dip*.2*(px-250)/70:0)+Math.sin(t*2.2-px*.03)*.006*(1-e)},
  piv=px=>{const s=(px-ISO_CX)*S,q=s*k;return k>1e-5?[Math.sin(q)/k,(1-Math.cos(q))/k]:[s,0]},
  ly0=(px,py)=>(py-isoTop(B,px)*e)*S*hsc;
 let my=-1e9;for(let i=0;i<=12;i++){const px=i*ISO_X1/12,a=th(px),p=piv(px);for(const py of [isoTop(B,px),Math.max(isoTop(B,px)+10,isoCutY(px))]){const ly=ly0(px,py);my=Math.max(my,p[1]+Math.cos(a)*ly)}}
 const e2=Math.min(1,e*1.4),straightOff=-ride-ISO_VY*S;let yOff=straightOff*(1-e2)+(-my-1)*e2;
 yOff+=bob+(e>.9?Math.sin(t*3)*.35*S:0);
 const mp=(px,py)=>{const a=th(px),p=piv(px),ly=ly0(px,py);return[p[0]-Math.sin(a)*ly,p[1]+Math.cos(a)*ly+yOff]};
 ctx.save();ctx.translate(o.x,o.y);
 ctx.save();ctx.scale(1,.2);ctx.fillStyle="rgba(0,4,14,"+(.42-.1*e)+")";ctx.beginPath();ctx.ellipse(0,-4,L*(.46-.28*e),L*.22,0,0,7);ctx.fill();ctx.restore();
 const fc=Math.abs(o.face)<.12?.12*Math.sign(o.face||1):o.face;ctx.scale(fc,1);
 const legA=1-Math.min(1,e/.45);
 if(legA>.01){const a=27*S,b=31*S,ank=8*S,rho=.7;for(const side of [1,0]){ctx.globalAlpha=legA;for(let i=0;i<7;i++){const hp=ISO_LEG[i]+(side?7:0),H=mp(hp,isoCutY(hp)-5),out=i>=3?1:-1,neutral=hp+(i-3)*15;let ph=((o.g-i*.13+(side?.5:0))%1+1)%1,fx,lift=0;
   if(ph<rho){fx=o.st/2-(ph/rho)*o.st}else{const q=(ph-rho)/(1-rho);fx=-o.st/2+(1-Math.cos(Math.PI*q))/2*o.st;lift=Math.sin(Math.PI*q)*8*S*Math.min(1,o.st/(10*S))}
   if(o.groom===i&&!side){lift+=Math.sin(Math.min(1,o.gT/1.2)*Math.PI)*16*S;fx+=Math.sin(o.gT*14)*3*S}
   const was=o.pl[i]||0,now=lift>.5?1:0;if(!side&&was&&!now&&o.st>4*S&&Math.random()<.5){const wx=o.x+((neutral-ISO_CX)*S+fx)*fc;o.dust.push({x:wx,y:o.y-1,vx:rand(-6,6),vy:rand(-7,-2),life:rand(.6,1.1),l0:1.1})}if(!side)o.pl[i]=now;
   const tk=1-legA,Fx0=(neutral-ISO_CX)*S+fx,Fx=Fx0+(H[0]-Fx0)*tk*.85,Fy=(-ank-lift)*(1-tk)+(H[1]+6*S)*tk,K2=isoKnee(H[0],H[1],Fx,Fy,a,b,out),tip=[Fx+out*3*S,Fy+ank*(1-tk*.8)];
   const col=side?"#6e5468":"#c99aa8",w0=(side?7.5:8.5)*S,w1=(side?5.6:6.4)*S;
   isoSeg(H[0],H[1],K2[0],K2[1],w0,w1,col,side);isoSeg(K2[0],K2[1],Fx,Fy,w1,w1*.72,col,side);isoSeg(Fx,Fy,tip[0],tip[1],w1*.62,.6*S,side?"#5e4558":"#b58494",side);
   ctx.fillStyle=side?"rgba(30,14,30,.8)":"rgba(70,30,52,.85)";for(const f of [.45,.75]){const jx=K2[0]+(Fx-K2[0])*f,jy=K2[1]+(Fy-K2[1])*f;ctx.beginPath();ctx.arc(jx,jy,w1*.42,0,7);ctx.fill()}ctx.beginPath();ctx.arc(K2[0],K2[1],w1*.7,0,7);ctx.fill()}
  }ctx.globalAlpha=1}
 const antBase=mp(316,97);isoAnt(o,antBase,S,1,legA,dip,e);
 // kabuk: 24 ince dilim, kuyruktan başa (öndeki halka arkadakinin üstüne biner)
 if(e>.25&&k>1e-5){const R=1/k;ctx.globalAlpha=Math.min(1,(e-.25)/.4);const cy=R+yOff,g2=ctx.createRadialGradient(0,cy-R*.2,R*.1,0,cy,R*.66);g2.addColorStop(0,"#6b4a60");g2.addColorStop(1,"#2a1a27");ctx.fillStyle=g2;ctx.beginPath();ctx.arc(0,cy,R*.64,0,7);ctx.fill();ctx.lineCap="round";ctx.strokeStyle="#b58494";ctx.lineWidth=2.4*S*1.4;for(let i=0;i<7;i++){const an=Math.PI*(.18+.64*i/6)+Math.sin(t*6+i)*.03*e,r0=R*.25,r1=R*.58;ctx.beginPath();ctx.moveTo(Math.cos(an)*r0,cy+Math.sin(an)*r0);ctx.quadraticCurveTo(Math.cos(an+.25)*r1,cy+Math.sin(an+.25)*r1,Math.cos(an+.45)*r1*.92,cy+Math.sin(an+.45)*r1*.92);ctx.stroke()}ctx.globalAlpha=1}
 const sx=B.sx,NS=24,sw=ISO_X1/NS;for(let i=0;i<NS;i++){const x0=i*sw,x1=(i+1)*sw,sc=(x0+x1)/2,a=th(sc),p=piv(sc),last=i===NS-1,ov=last?40:1.6,tp=isoTop(B,sc)*e;ctx.save();ctx.translate(p[0],p[1]+yOff);ctx.rotate(a);const brd=hsc*(1+.012*Math.sin(t*2.4-i*.3)*(1-e));ctx.drawImage(B.c,x0*sx,0,(x1-x0+ov)*sx,B.ih,(x0-sc)*S,-tp*S*hsc,(x1-x0+ov)*S,190*S*brd);ctx.restore()}
 isoAnt(o,antBase,S,0,legA,dip,e);
 ctx.restore();
 if(o.dust.length){ctx.save();ctx.fillStyle="#8d95a3";for(const p of o.dust){ctx.globalAlpha=.32*(p.life/p.l0);ctx.beginPath();ctx.arc(p.x,p.y,1.1+(1-p.life/p.l0)*1.6,0,7);ctx.fill()}ctx.restore()}
 if(e<.6){const ep=mp(285,88);ISO_EYES.push([o.x+ep[0]*fc,o.y+ep[1],1.2*S*10,(1-e/.6)])}
}
function isoAnt(o,base,S,far,legA,dip,e){const t=o.t,vis=Math.max(0,1-e/.45);if(vis<=.01)return;const n=14,Ltot=(far?.36:.42)*o.len*vis,seg=Ltot/n;let a=(far?.1:-.08)+Math.sin(t*1.25+o.ant+(far?1.7:0))*.32+dip*.35,x=base[0]+(far?-2*S:0),y=base[1];
 const explore=o.pause>0||o.eat>0?1:0,tap=explore?Math.max(0,Math.sin(t*2.6+(far?1.1:0)))**3*.5:0;
 ctx.lineCap="round";const pts=[[x,y]];for(let i=0;i<n;i++){const u=i/n;a+=(.085+.05*Math.sin(t*1.7+o.ant*2+u*3+(far?2:0))+tap*.07*u)*(1-.3*u);x+=Math.cos(a)*seg;y+=Math.sin(a)*seg;pts.push([x,y])}
 for(let i=0;i<n;i++){const w=(3.3-2.6*i/n)*S*1.4*(far?.85:1),p=pts[i],q=pts[i+1];ctx.strokeStyle=far?"rgba(20,8,20,.85)":"rgba(48,18,36,.9)";ctx.lineWidth=w+1.2*S*2;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();ctx.strokeStyle=far?"#6c5266":(i%2?"#c6929f":"#d5a6b3");ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke()}
 if(!far){for(let j=0;j<2;j++){let aa=-.15+j*.35+Math.sin(t*9+j*2.3+o.ant)*.25,xx=base[0]+2*S,yy=base[1]-3*S;ctx.strokeStyle=j?"#b98896":"#d8acb8";ctx.lineWidth=1.6*S*1.4;ctx.beginPath();ctx.moveTo(xx,yy);for(let i=0;i<4;i++){aa+=.12;xx+=Math.cos(aa)*4.2*S*vis;yy+=Math.sin(aa)*4.2*S*vis;ctx.lineTo(xx,yy)}ctx.stroke()}}}
function stepShr(s,dt){const u=CU;s.t+=dt;const fy=FLOOR-10;s.next-=dt;
 if(s.flip>0){s.flip-=dt;const f=1-s.flip/.32;s.curl=f<.35?f/.35:Math.max(0,1-(f-.35)/.65);if(s.flip<=0){s.mode="swim";s.swim=rand(1,2)}}else s.curl+=(0-s.curl)*Math.min(1,dt*8);
 if(s.mode==="walk"){if(s.pause>0){s.pause-=dt;s.vx*=Math.exp(-dt*6)}else{s.vx+=(s.dir*26*u-s.vx)*Math.min(1,dt*3);s.leg+=dt*9}if(s.next<0){s.next=rand(2.5,6);const r=Math.random();if(r<.35)s.pause=rand(1,2.5);else if(r<.55)s.dir*=-1;else if(r<.7){s.mode="swim";s.swim=rand(1.5,3);s.vy=-40*u}}s.vy+=(fy-s.y)*dt*6;s.vy*=Math.exp(-dt*5)}
 else if(s.mode==="swim"){s.swim-=dt;s.leg+=dt*3;s.vx+=(s.dir*42*u-s.vx)*Math.min(1,dt*2);s.vy+=(Math.sin(s.t*1.4)*12*u+6*u)*dt;s.vy*=Math.exp(-dt*1.5);if(s.swim<=0&&s.flip<=0)s.mode="walk"}else{s.vx*=Math.exp(-dt*3);s.vy+=50*u*dt}
 s.x+=s.vx*dt;s.y+=s.vy*dt;if(s.y>fy){s.y=fy;s.vy=Math.min(0,s.vy)}if(s.y<H*.3){s.y=H*.3;s.vy=Math.abs(s.vy)}const m=s.len;if(s.x<BX0+m*.3){s.x=BX0+m*.3;if(s.flip<=0)s.dir=1}if(s.x>BX1-m*.3){s.x=BX1-m*.3;if(s.flip<=0)s.dir=-1}
 s.tilt+=((s.mode==="swim"?-.12:0)+(s.vy/(200*u))*.4-s.tilt)*Math.min(1,dt*4)}
function drawShr(s){const L=s.len,im0=cImg(s.d.img);if(!im0)return;const im=nightAmt()>.5&&tinted(im0,"cr"+s.d.id,0,true,1)||im0;const SS=s.d;ctx.save();ctx.translate(s.x,s.y);ctx.scale(s.dir,1);ctx.rotate(s.tilt);
 const iw=im.naturalWidth||im.width,ih=im.naturalHeight||im.height,DW=L*1.25,DH=DW*ih/iw,X0=-L,sx=DW/iw,sw=s.mode==="swim"||s.flip>0;
 ctx.save();ctx.scale(1,.25);ctx.beginPath();ctx.ellipse(-L*.3,(FLOOR-4-s.y)*4+L*.1,L*.55,L*.22,0,0,7);ctx.fillStyle="rgba(0,20,30,"+(s.mode==="walk"?.22:.1)+")";ctx.fill();ctx.restore();
 const P0=.5,N=10,pivot=X0+P0*DW,chain=[];let px=pivot,py=0,th=0;const stripW=P0*iw/N;for(let i=0;i<N;i++){th+=s.curl*1.5/N+Math.sin(s.t*2+i*.5)*.004;chain.push([px,py,th]);const dd=stripW*sx;px-=Math.cos(th)*dd;py+=Math.sin(th)*dd}
 ctx.lineCap="round";for(let i=0;i<5;i++){const bx=-L*(.02+i*.09),by=DH*.18,ph=s.leg+i*1.3,lift=Math.max(0,Math.sin(ph))*L*.03,sw2=Math.cos(ph)*L*.05;ctx.strokeStyle=i%2?SS.leg2:SS.leg;ctx.lineWidth=Math.max(.8,L*.012);ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx+sw2*.4,by+L*.07);ctx.lineTo(bx+sw2-L*.03,by+L*.14-lift);ctx.stroke()}
 ctx.strokeStyle=SS.leg2;ctx.lineWidth=Math.max(.8,L*.011);for(let i=1;i<8;i+=2){const c=chain[i],a=Math.sin(s.t*(sw?26:6)-i*.6)*(sw?.7:.15);ctx.beginPath();ctx.moveTo(c[0],c[1]+DH*.14);ctx.lineTo(c[0]+Math.sin(a)*L*.05,c[1]+DH*.14+Math.cos(a)*L*.07);ctx.stroke()}
 const yTop=-DH*.5;ctx.drawImage(im,P0*iw,0,iw*(1-P0),ih,pivot,yTop,DW*(1-P0),DH);
 for(let i=0;i<N;i++){const c=chain[i];ctx.save();ctx.translate(c[0],c[1]);ctx.rotate(-c[2]);ctx.drawImage(im,P0*iw-(i+1)*stripW,0,stripW+1,ih,-stripW*sx,yTop,(stripW+1)*sx,DH);ctx.restore()}
 ctx.strokeStyle=SS.ant;ctx.lineWidth=Math.max(.8,L*.011);for(const k of [0,1]){const ph=s.t*(s.pause>0?5:2)+k*2;ctx.beginPath();ctx.moveTo(0,DH*.12);ctx.quadraticCurveTo(L*.1,DH*.3+Math.sin(ph)*L*.03,L*.2,DH*.05+Math.sin(ph*1.3)*L*.05);ctx.stroke()}
 for(const k of [0,1]){ctx.beginPath();let ax=L*.05,ay=-DH*(.05+k*.1);ctx.moveTo(ax,ay);let an=-.3-k*.25;const n=16,sl=L*(k?1.45:1.2)/n;for(let i=0;i<n;i++){an+=.03+Math.sin(s.t*(1.7+k*.4)-i*.35)*.035;ax+=Math.cos(an)*sl;ay+=Math.sin(an)*sl;ctx.lineTo(ax,ay)}ctx.lineWidth=Math.max(.6,L*.008);ctx.stroke()}
 ctx.restore()}
// sürüm 130: yeni hedef seçerken birkaç aday arasından diğer canlılara en uzak olanı al (hepsi ortada üst üste birikmesin)
let CRL=[];function spaceScore(x,y,self){let m=1e9;for(const f of state.fish){if(f===self)continue;const d=Math.hypot(f.x*W-x,(f.y*H-y)*1.4);if(d<m)m=d}for(const o of CRL){if(o===self||o.d.t==="sh"||o.d.t==="iso")continue;const d=Math.hypot(o.x-x,(o.y-y)*1.4);if(d<m)m=d}return m}
function bestSpot(self,n,gen){let b=gen(),bs=spaceScore(b[0],b[1],self);for(let i=1;i<n;i++){const c=gen(),cs=spaceScore(c[0],c[1],self);if(cs>bs){b=c;bs=cs}}return b}
function critDraw(dt){CPOST.length=0;const L=critRT();CRL=L;if(!L.length)return;for(const o of L){const T=o.d.t;if(T==="sh")stepShr(o,dt);else if(T==="iso")stepIso(o,dt);else if(T==="ct")stepCt(o,dt);else if(T==="sq")stepSq(o,dt);else stepJel(o,dt);if(T==="at")o.al=Math.max(0,(o.al||0)-dt)}
 L.filter(o=>o.d.t==="iso").forEach(drawIso);L.filter(o=>o.d.t==="sh").sort((a,b)=>a.y-b.y).forEach(drawShr);L.filter(o=>o.d.t==="je").forEach(drawJel);L.filter(o=>o.d.t==="at").forEach(drawAt);L.filter(o=>o.d.t==="ct").forEach(drawCt);L.filter(o=>o.d.t==="sq").forEach(drawSq);inkDraw(dt)}
function critTap(x,y){if(VISIT)return false;let hit=false;for(const o of CRT.values()){const T=o.d.t;
 if(T==="ct"){if(Math.abs(x-o.x)<o.r*1.3&&Math.abs(y-o.y)<o.r*o.ar*1.2){o.fl=1.6;o.vx+=(o.x-x)*1.5;o.vy+=(o.y-y)*1.5;hit=true}continue}
 if(T==="at"){if(Math.hypot(x-o.x,y-(o.y-o.r*.3))<o.r*2.2){atollaAlarm(o);hit=true}continue}
 if(T==="sq"){if(Math.abs(x-o.x)<Math.max(36,o.L*.6)&&Math.abs(y-o.y)<Math.max(26,o.L*.3)){squidScare(o,x);hit=true}continue}
 if(o.d.t==="iso"){if(Math.hypot(x-o.x,y-(o.y-o.len*.15))<o.len*.6){isoPoke(o);hit=true}}else if(o.d.t==="sh"){if(Math.hypot(x-o.x,y-o.y)<o.len*1.15){o.dir=x>=o.x?1:-1;o.flip=.32;o.mode="flip";o.vx=-o.dir*rand(380,480)*CU;o.vy=-rand(90,160)*CU;hit=true}}
 else{const d=Math.hypot(x-o.x,y-(o.y-o.r*.3));if(d<o.r*2.2){const k=1/(d||1);o.vx+=(o.x-x)*k*120*CU;o.vy+=Math.min(0,(o.y-y)*k*60*CU);o.fl=2.5;o.ph=Math.ceil(o.ph);o.tx=Math.max(BX0+o.r,Math.min(BX1-o.r,o.x+(o.x-x)*3));hit=true}}}
 if(hit)sfx("bubble");return hit}
// ===== Balıklarım: sıralama, süzme, toplu satış =====
// sürüm 123: kartlar varsayılan olarak tek satır (dokununca ayrıntı açılır); "Sıradanları seç" değerli olmayan yetişkinleri tek dokunuşla seçer

// ===== sürüm 139: isim verme penceresi (listedeki ✏️ ve tanktaki bilgi balonundan açılır) · rastgele isim önerisi
const RNM={g:["Pamuk","Minnoş","Fıstık","Boncuk","Zıpzıp","Kaptan Pul","Bulut","Şeker","Lokum","Mavi","Dalga","Köpük","Yüzgeç","Pırıl","Tarçın","Limon","Çakıl","Mercan","Inci","Poyraz","Rüzgâr","Simit","Kurabiye","Badem","Fındık","Kiraz","Nar","Mısır","Tombi","Gofret"],
 gold:["Altın Bey","Sultan","Hazine","Midas","Güneş","Kral Pul","Paşa"],albino:["Kar Tanesi","Pamukşeker","Ak Prens","Süt","Bulutçuk"],transparent:["Hayalet","Cam","Kristal","Şeffaf Bey","Buz"],melanistic:["Gölge","Gece","Kömür","Karabiber","Zifir"],glitch:["Piksel","Hata 404","Bit","Sinyal","Byte"],
 big:["Koca Reis","Dev Dayı","Amiral","Kaptan","Tank"],small:["Ufaklık","Minik","Cüce","Bıdık","Bezelye"],deep:["Fener","Yıldız","Gece Lambası","Karanlık Şövalye"],river:["Kaplan","Amazon","Orman Kralı","Nehir Reisi"]};
function rndName(f){const m=mutOf(f),z=szOf(f),w=WATER[f.type],L=[].concat(RNM.g,RNM[m]||[],RNM[m]||[],z==="giant"?RNM.big:z==="dwarf"?RNM.small:[],RNM[w]||[],fishW(f)>150?RNM.big:[]);let n=L[Math.random()*L.length|0];const used=new Set(allFish().map(x=>x.name));for(let i=0;i<8&&used.has(n);i++)n=L[Math.random()*L.length|0];return n}
let RENID=null;
function renOpen(id){const f=allFish().find(x=>x.id===id);if(!f||VISIT)return;RENID=id;const s=getSpecies(f.type);let b=$("renBox");if(!b){b=document.createElement("div");b.id="renBox";b.className="renbox";b.innerHTML='<div class="renc"><div class="renh"><div class="renf" id="renF"></div><div><b id="renT"></b><small id="renS"></small></div></div><div class="renr"><input id="renIn" maxlength="24" autocomplete="off" enterkeyhint="done"><button id="renRnd" title="Rastgele isim" aria-label="Rastgele isim">🎲</button></div><div class="renb"><button id="renClr">Türün adı</button><button id="renOk" class="home">✓ Kaydet</button></div><button id="renX" class="sd-x" aria-label="Kapat">✕</button></div>';$("game").appendChild(b);
  b.addEventListener("pointerdown",e=>{if(e.target===b)renClose()});$("renX").onclick=renClose;$("renOk").onclick=()=>renSave($("renIn").value);$("renClr").onclick=()=>renSave("");$("renRnd").onclick=()=>{const g=allFish().find(x=>x.id===RENID);if(g){$("renIn").value=rndName(g);sfx("click")}};$("renIn").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();renSave($("renIn").value)}else if(e.key==="Escape")renClose()})}
 $("renF").innerHTML=fishIcon(f);$("renT").textContent=f.name||s.name;$("renS").textContent=s.name+(mutOf(f)!=="normal"?" · "+MUTS[mutOf(f)].name:"");const i=$("renIn");i.value=f.name||"";i.placeholder=s.name;b.hidden=false;setTimeout(()=>{try{i.focus();i.select()}catch(e){}},60)}
function renClose(){RENID=null;const b=$("renBox");if(b)b.hidden=true;try{document.activeElement&&document.activeElement.blur()}catch(e){}}
function renSave(v){const f=allFish().find(x=>x.id===RENID);if(!f)return renClose();v=String(v||"").replace(/\s+/g," ").trim().slice(0,24);const s=getSpecies(f.type);if(v&&v!==s.name)f.name=v;else delete f.name;sfx("click");notify(v?"✏️ Yeni adı: "+v:"✏️ "+s.name+" adına döndü");renClose();renderUI();save(true)}
let TIBTN=null;
function cureBtnSync(){const n=isColl(state.tank)?0:state.fish.filter(f=>f.sick).length,b=$("cureBtn");if(b){b.hidden=!n||VISIT;const c=$("cureN");if(c)c.textContent=n}}
let FSORT="value",FFILT="all",sellArm=null,FDET=false,FSELM=false;const FSEL=new Set(),FOPEN=new Set();
function commonAdults(){return state.fish.filter(f=>f.age>=MATURE&&!isPrecious(f)&&!f.sick&&!f.gift&&!isLocked(f))}
// ===== Balık kilidi (sürüm 126)
// f.lock: true = elle kilitli · false = otomatik kilidi elle açılmış · yok = varsayılan.
// "Nadir balıkları otomatik kilitle" açıkken (varsayılan) mutasyonlu, hibrit, parlak ve Dev/Cüce balıklar kendiliğinden kilitli sayılır.
// Kilitli balık satılamaz (tek tek ya da toplu), hediye edilemez, siparişe verilmez.
function autoLockOn(){return state.autoLock!==false}
function autoLockable(f){return mutOf(f)!=="normal"||!!hybOf(f)||f.rarity==="Nadir"||szOf(f)!=="normal"}
function isLocked(f){if(!f)return false;if(f.lock===true)return true;if(f.lock===false)return false;return autoLockOn()&&autoLockable(f)}
function lockWhy(f){return f.lock===true?"elle kilitli":isLocked(f)?"otomatik kilitli":""}
function toggleLock(id){const f=allFish().find(x=>x.id===id);if(!f)return;const nm=f.name||getSpecies(f.type).name;if(isLocked(f)){f.lock=false;if(!(autoLockOn()&&autoLockable(f)))delete f.lock;notify("🔓 "+nm+" kilidi açıldı")}else{f.lock=true;FSEL.delete(id);notify("🔒 "+nm+" kilitlendi, satılamaz")}if(sellArm&&sellArm.id===id)sellArm=null;sfx("click");renderUI();save(true)}
function lockMsg(f){sfx("error");notify("🔒 "+(f.name||getSpecies(f.type).name)+" kilitli ("+lockWhy(f)+"). Satmak için önce kilidi aç.")}
function isPrecious(f){return mutOf(f)!=="normal"||szOf(f)!=="normal"||f.rarity==="Nadir"||saleValue(f)>=200}
function invList(){let a=state.fish.slice();const F={all:()=>1,adult:f=>f.age>=MATURE,young:f=>f.age<MATURE,sick:f=>f.sick,mut:f=>mutOf(f)!=="normal"||szOf(f)!=="normal",lock:f=>isLocked(f)};a=a.filter(F[FFILT]||F.all);const S={value:(x,y)=>saleValue(y)-saleValue(x),type:(x,y)=>getSpecies(x.type).name.localeCompare(getSpecies(y.type).name,"tr")||saleValue(y)-saleValue(x),age:(x,y)=>y.age-x.age};a.sort(S[FSORT]||S.value);return a}
function invHTML(){for(const id of [...FSEL])if(!state.fish.some(f=>f.id===id))FSEL.delete(id);const list=invList(),tot=state.fish.reduce((s,f)=>s+saleValue(f),0),cnt=k=>state.fish.filter({adult:f=>f.age>=MATURE,young:f=>f.age<MATURE,sick:f=>f.sick,mut:f=>mutOf(f)!=="normal"||szOf(f)!=="normal",lock:f=>isLocked(f)}[k]).length;
const opt=(k,t,cur)=>'<option value="'+k+'"'+(cur===k?" selected":"")+">"+t+"</option>";
let h='<div class="ib"><div class="ib-s"><b>'+state.fish.length+" balık</b><small>· "+tot.toLocaleString("tr-TR")+' 🪙 değer</small></div><select class="ib-sel" data-ffs="1" aria-label="Filtre">'+[["all","Tümü"],["adult","Yetişkin "+cnt("adult")],["young","Yavru "+cnt("young")],["sick","Hasta "+cnt("sick")],["mut","Özel "+cnt("mut")],["lock","🔒 Kilitli "+cnt("lock")]].filter(x=>x[0]==="all"||x[0]===FFILT||!/ 0$/.test(x[1])).map(x=>opt(x[0],x[1],FFILT)).join("")+'</select><select class="ib-sel" data-fss="1" aria-label="Sırala">'+[["value","↓ Değer"],["type","A–Z Tür"],["age","Büyüme"]].map(x=>opt(x[0],x[1],FSORT)).join("")+'</select><button class="chip2'+(FSELM?" on":"")+'" data-selm="1">'+(FSELM?"✓ Seçim":"☑ Seç")+"</button></div>"+(cnt("sick")&&!isColl(state.tank)?'<button class="curebar" data-cure="1">💊 '+cnt("sick")+" hasta balığı iyileştir · 30 🪙</button>":"");
return h+(list.length?list.map(fcCard).join(""):'<p class="note">Bu filtrede balık yok.</p>')}
function sellBarRender(){try{$("inventory").classList.toggle("selm",FSELM)}catch(e){}let b=$("sellBar");if(!b){try{b=document.createElement("div");b.id="sellBar";b.className="sellbar";b.onclick=e=>invClick(e);const inv=$("inventory");inv.parentNode.insertBefore(b,inv.nextSibling)}catch(e){return}}const sel=state.fish.filter(f=>FSEL.has(f.id));if(!sel.length&&!FSELM){b.hidden=true;b.innerHTML="";return}if(!sel.length){const ca=commonAdults();b.hidden=false;b.innerHTML="<div><b>Satılacak balıkları seç</b><small>Kartlara dokun</small></div>"+(ca.length?'<button class="chip2 gold" data-selcommon="1">🧺 Sıradanlar ('+ca.length+")</button>":"")+'<button class="chip2" data-selall="1">Tümü</button><button class="chip2" data-selnone="1">Vazgeç</button>';return}const v=sel.reduce((s,f)=>s+saleValue(f),0),pr=sel.filter(isPrecious).length,arm=sellArm&&sellArm.id==="many"&&sellArm.until>Date.now();b.hidden=false;b.innerHTML='<div><b>'+sel.length+" balık seçildi</b><small>"+(pr?"⚠️ "+pr+" tanesi değerli":"Toplam değer")+"</small></div>"+(commonAdults().some(f=>!FSEL.has(f.id))?'<button class="chip2 gold" data-selcommon="1">🧺</button>':"")+"<button class=\"chip2\" data-selnone=\"1\">Vazgeç</button><button class=\"danger"+(arm?" armed":"")+"\" data-sellmany=\"1\">"+(arm?"Emin misin?":"Sat")+"<small>"+v.toLocaleString("tr-TR")+" 🪙</small></button>"}
function raisedSold(f){if(!f||f.gift||!(f.age>=MATURE))return;if(WATER[f.type]==="deep"){Q("dsell");if(f.type==="dragon")Q("dsell_dragon")}if(WATER[f.type]==="river")Q("rsell");const r=state.raised||(state.raised={});r[f.type]=(r[f.type]||0)+1;if(r[f.type]===1000)setTimeout(checkAch,600)}
function raisedTop(m){const r=state.raised||{};let k=null,n=0;for(const t in r)if(r[t]>n&&(!m||mutOK(t))){n=r[t];k=t}return{k,n}}
function sellMany(ids){let v=0,n=0,lk=0;ids.forEach(id=>{const i=state.fish.findIndex(f=>f.id===id);if(i<0)return;if(isLocked(state.fish[i])){lk++;FSEL.delete(id);return}raisedSold(state.fish[i]);v+=saleValue(state.fish[i]);state.fish.splice(i,1);n++;FSEL.delete(id)});if(!n){if(lk)notify("🔒 Seçilen balıkların hepsi kilitli, hiçbiri satılmadı");return}state.coins+=v;Q("sell");Q("earn",v);addXP(Math.min(12,n*2));sfx("coins");notify(n+" balık satıldı: +"+v.toLocaleString("tr-TR")+" 🪙"+(lk?" · "+lk+" kilitli balık satılmadı":""));sellArm=null;renderUI();save(true)}
function invClick(e){const t=e.target.closest("[data-ren],[data-cure],[data-selm],[data-ff],[data-fs],[data-pick],[data-selall],[data-selnone],[data-sellmany],[data-sell],[data-gift],[data-open],[data-fdet],[data-selcommon],[data-lock]");if(!t)return false;const d=t.dataset;if(d.gift){giftOpen(+d.gift);return true}if(d.ren){renOpen(+d.ren);return true}if(d.cure){cure();return true}
if(d.selm){FSELM=!FSELM;if(!FSELM)FSEL.clear();sellArm=null;sfx("click")}else if(d.open&&FSELM){const id=+d.open,pf=state.fish.find(x=>x.id===id);if(FSEL.has(id))FSEL.delete(id);else if(pf&&isLocked(pf)){lockMsg(pf);return true}else FSEL.add(id);sellArm=null;sfx("click")}else if(d.open){const id=+d.open;FOPEN.has(id)?FOPEN.delete(id):FOPEN.add(id);sfx("click")}else if(d.fdet){FDET=!FDET;FOPEN.clear()}else if(d.selcommon){FSELM=true;FSEL.clear();commonAdults().forEach(f=>FSEL.add(f.id));sellArm=null;sfx("click")}else
if(d.ff){FFILT=d.ff;sellArm=null}else if(d.fs){FSORT=d.fs}else if(d.pick){FSELM=true;const id=+d.pick,pf=state.fish.find(x=>x.id===id);if(FSEL.has(id))FSEL.delete(id);else if(pf&&isLocked(pf)){lockMsg(pf);return true}else FSEL.add(id);sellArm=null;sfx("click")}
else if(d.lock){toggleLock(+d.lock);return true}
else if(d.selall){const l=invList().filter(f=>!isLocked(f));if(l.length&&l.every(f=>FSEL.has(f.id)))l.forEach(f=>FSEL.delete(f.id));else l.forEach(f=>FSEL.add(f.id));sellArm=null}
else if(d.selnone){FSEL.clear();FSELM=false;sellArm=null}
else if(d.sellmany){const sel=state.fish.filter(f=>FSEL.has(f.id));const need=sel.some(isPrecious)||sel.length>=3;if(need&&!(sellArm&&sellArm.id==="many"&&sellArm.until>Date.now())){sellArm={id:"many",until:Date.now()+3500};sfx("click");setTimeout(renderUI,3600)}else sellMany(sel.map(f=>f.id))}
else if(d.sell){const id=+d.sell,f=state.fish.find(x=>x.id===id);if(f&&isPrecious(f)&&!(sellArm&&sellArm.id===id&&sellArm.until>Date.now())){sellArm={id,until:Date.now()+3500};sfx("click");setTimeout(renderUI,3600)}else{sellArm=null;FSEL.delete(id);sell(id)}}
renderUI();return true}


function fitCv(){try{const g=$("game"),gw=g.clientWidth,gh=g.clientHeight;if(!gw||!gh)return;const k=Math.max(gw/W,gh/H),cw=W*k,ch=H*k;g.style.setProperty("--cvw",cw.toFixed(1)+"px");g.style.setProperty("--cvh",ch.toFixed(1)+"px");g.style.setProperty("--cvx",((gw-cw)/2).toFixed(1)+"px");g.style.setProperty("--cvy",((gh-ch)/2).toFixed(1)+"px")}catch(e){}}
try{fitCv();if(window.ResizeObserver)new ResizeObserver(fitCv).observe($("game"));addEventListener("resize",fitCv)}catch(e){}
let oriT=0,oriLast=(typeof innerWidth==="number"&&innerHeight>innerWidth)?"port":"land";function oriWatch(){try{window.__setH&&__setH()}catch(e){}clearTimeout(oriT);oriT=setTimeout(()=>{const now=innerHeight>innerWidth?"port":"land";if(!PORT&&now==="land"){const a=Math.max(1.3,Math.min(2.4,innerWidth/innerHeight));if(Math.abs(a-GAR)>.3){try{save(true)}catch(e){}location.reload();return}}if(now===oriLast)return;oriLast=now;try{save(true)}catch(e){}if(ORI_PREF==="auto"&&now!==ORI){location.reload();return}if(now===ORI){try{window.scrollTo(0,0)}catch(e){}const vv=window.visualViewport;if(vv&&(Math.abs(vv.scale-1)>.01||Math.abs(vv.offsetTop)>1||Math.abs(vv.offsetLeft)>1))location.reload()}},450)}
try{addEventListener("orientationchange",oriWatch);addEventListener("resize",oriWatch)}catch(e){}

// arka plan yumuşatma (derinlik hissi): hafif bulanık, biraz soluk, kenarları koyu
function bgSoftOn(){return state.bgSoft!==false}
function bgSoftF(){return ""}
let vigEl=null;function vigSync(){try{if(!vigEl){vigEl=document.createElement("div");vigEl.className="cvl";vigEl.style.cssText="position:absolute;pointer-events:none;background:radial-gradient(ellipse 72% 70% at 50% 46%,rgba(4,20,30,0) 55%,rgba(4,20,30,.42) 100%),rgba(34,52,62,.13)";canvas.before(vigEl)}vigEl.style.display=bgSoftOn()?"":"none"}catch(e){}}
function autoLockLabel(){const b=$("autoLockBtn");if(b)b.textContent="🔒 Nadirleri otomatik kilitle: "+(autoLockOn()?"Açık":"Kapalı")}
function bgSoftLabel(){const b=$("bgSoftBtn");if(b)b.textContent="🌫️ Arka plan: "+(bgSoftOn()?"Yumuşak":"Net")}
function oriLabel(){const b=$("oriBtn");if(!b)return;b.textContent="🖥️ Ekran: "+(ORI_PREF==="auto"?"Otomatik ("+(PORT?"dikey":"yatay")+")":ORI_PREF==="land"?"Yatay":"Dikey")}
function setOri(v){try{if(v==="auto")localStorage.removeItem("akvOri");else localStorage.setItem("akvOri",v)}catch(e){}save(true);setTimeout(()=>location.reload(),120)}
function fcMeta(f){const sz=boyOf(f)+"x";return yasTxt(f)+" · boy "+sz}
function fcChips(f){let h="";if(f.st&&STATUS[f.st])h+='<span class="fchip warn">'+STATUS[f.st][0]+" "+STATUS[f.st][1]+"</span>";if(f.sick)h+='<span class="fchip bad">🤒 Hasta</span>';else if(f.age>=MATURE)h+='<span class="fchip ok">✅ Yetişkin</span>';if(geneKnown(f))h+='<span class="fchip">'+geneText(f)+"</span>";return h}
function fcBar(ic,key,id,v,cls){v=Math.max(0,Math.min(100,v));return '<div class="fcb '+cls+'"><i>'+ic+'</i><span class="fcbt"><s data-'+key+'="'+id+'" style="width:'+v+'%"></s></span><em data-'+key+'v="'+id+'">%'+Math.round(v)+"</em></div>"}
function fcCard(f){const s=getSpecies(f.type),coll=isColl(state.tank),pk2=FSEL.has(f.id),arm=sellArm&&sellArm.id===f.id&&sellArm.until>Date.now(),cmp=!FDET&&!FOPEN.has(f.id),nm=f.name||s.name;return `<div class="fc${f.sick?" sick":""}${pk2?" picked":""}${cmp?" cmp":""}" data-card="${f.id}"><button class="fpick" data-pick="${f.id}" aria-label="Seç">${pk2?"✓":""}</button><div class="fc-ico">${fishIcon(f)}</div><div class="fc-main" data-open="${f.id}"><div class="fc-name"><b>${esc(nm)}${f.rarity==="Nadir"?" ✨":""}</b>${VISIT?"":`<button class="fren" data-ren="${f.id}" aria-label="İsim ver">✏️</button>`}${nm!==s.name?`<small class="fc-sp">${esc(s.name)}</small>`:""}<span class="pill">${f.personality||""}</span><button class="flock${isLocked(f)?" on":""}" data-lock="${f.id}" title="${isLocked(f)?"Kilitli ("+lockWhy(f)+") · açmak için dokun":"Kilitle"}" aria-label="Kilit">${isLocked(f)?"🔒":"🔓"}</button><i class="fc-tg">${cmp?"⌄":"⌃"}</i></div><div class="fc-sum">${f.sick?"🤒 Hasta · ":""}${f.age>=MATURE?"✅ Yetişkin":"🌱 %"+Math.round(f.age*100)}${coll?"":" · 🍽️ %"+Math.round(f.hunger)}</div><div class="fc-tags">${mutTag(f)}</div><div class="fc-bars">${fcBar("🌱","bar",f.id,f.age*100,"g")}${coll?"":fcBar("❤️","hp",f.id,f.health,"h")+fcBar("🍽️","hu",f.id,f.hunger,"u")}</div><div class="fc-meta" data-info="${f.id}">${fcMeta(f)}</div><div class="fc-chips" data-chips="${f.id}">${fcChips(f)}</div></div><div class="fc-act">${isLocked(f)?`<button class="danger lockd" data-sell="${f.id}">🔒 Kilitli<small>${saleValue(f)} 🪙</small></button>`:`<button class="danger${arm?" armed":""}" data-sell="${f.id}">${arm?"Emin misin?":"Sat"}<small>${saleValue(f)} 🪙</small></button>`}${!geneKnown(f)?`<button class="sm" data-gene="${f.id}" title="Genetik test">🧬 40</button>`:""}${VISIT?"":`<button class="sm" data-gift="${f.id}" title="Hediye et">🎁</button>`}${moveSel(f)}</div></div>`}
function infoText(f){if(isColl(state.tank))return "🏺 Koleksiyonda · "+yasTxt(f)+" · boy "+boyOf(f)+"x · değer "+saleValue(f)+" 🪙 · "+geneText(f);return (f.st&&STATUS[f.st]?STATUS[f.st][0]+" "+STATUS[f.st][1]+" · ":"")+yasTxt(f)+" · boy "+boyOf(f)+"x · 🍽️ %"+Math.round(f.hunger)+" · ❤️ %"+Math.round(f.health)+" · değer "+saleValue(f)+" 🪙"+(f.sick?" · 🤒 hasta!":f.age>=MATURE?" · yetişkin ✅":"")+(szOf(f)!=="normal"?" · "+SIZES[szOf(f)].icon+" "+SIZES[szOf(f)].n:"")+" · "+geneText(f)}
function updateLive(){
if(openKey==="fish")state.fish.forEach(f=>{const q=k=>document.querySelector("[data-"+k+'="'+f.id+'"]'),set=(k,v)=>{v=Math.max(0,Math.min(100,v));const b=q(k),t=q(k+"v");if(b)b.style.width=v+"%";if(t)t.textContent="%"+Math.round(v)};const i=q("info"),c=q("chips"),cd=q("card");if(i)i.textContent=fcMeta(f);if(c)c.innerHTML=fcChips(f);if(cd)cd.classList.toggle("sick",!!f.sick);set("bar",f.age*100);set("hp",f.health);set("hu",f.hunger)});
$("badge").hidden=!(state.chest||(state.pending||0)>=1||coinsLoose.length>0);
waterStatus();
const m=Math.max(0,Math.ceil((state.chestAt-Date.now())/60000));
const act=activeEvents(),rot=Math.floor(Date.now()/6000)%2;
moodSet(VISIT?"👀 Komşunun akvaryumundasın":feedModeOn()?(curWater()==="deep"?"🦐 Canlı yemi bırakmak istediğin yere dokun":"🍤 Yemi atmak istediğin yere dokun"):(NIGHT()&&state.fish.some(f=>f.slp)&&!state.chest)?"😴 Balıklar uyuyor · yemlersen uyanırlar":state.chest?"🎁 Hazine sandığı seni bekliyor!":state.dirt>60?"Su kirli, balıklar hasta olabilir! 🧽":state.fish.some(f=>f.sick)?"Hasta balıkların var! 💊":state.fish.some(f=>f.st==="water")?"😣 Yanlış sudaki balıkları taşı!":state.fish.some(f=>f.st==="fight")?"⚔️ Bettalar kavga ediyor!":(act.length&&rot)?act[0].n+" · "+act[0].d:"Sonraki sandık ~"+m+" dk");
}
function collMerge(){try{const S=state.stash||(state.stash={});if(state.tank==="csalt"){const cs=state.fish||[];if(S.cfresh){state.fish=S.cfresh.fish.concat(cs);delete S.cfresh}else state.fish=cs;state.tank="cfresh";state.dirt=0}if(S.csalt){const cs=S.csalt.fish||[];delete S.csalt;if(state.tank==="cfresh")state.fish=state.fish.concat(cs);else if(S.cfresh)S.cfresh.fish=S.cfresh.fish.concat(cs);else S.cfresh={fish:cs,dirt:0}}if(state.crit&&state.crit.csalt){delete state.crit.csalt}}catch(e){}}
function normalize(){collMerge();{let n=0;const rm=a=>{const b=a.filter(f=>f&&f.type!=="motoro");n+=a.length-b.length;return b};if(Array.isArray(state.fish))state.fish=rm(state.fish);for(const k in state.stash||{})if(state.stash[k]&&Array.isArray(state.stash[k].fish))state.stash[k].fish=rm(state.stash[k].fish);if(n){state.coins=(+state.coins||0)+800*n;setTimeout(()=>notify("Benekli Vatoz oyundan kaldırıldı · "+n+" vatoz için +"+(800*n).toLocaleString("tr-TR")+" 🪙 iade edildi"),5200)}}const D=initState();if(!state.decT){state.decT=1;try{const base=(state.decor||[]).filter(x=>x&&DECOR.includes(x.k));for(const k in state.stash){const o=state.stash[k];if(o&&!Array.isArray(o.decor))o.decor=DECW[tw(k)]?[]:base.map(d=>Object.assign({},d))}if(DECW[tw(state.tank)])state.decor=[]}catch(e){}}{const LF=state.layout==="land"?"land":"port";if(LF!==ORI){try{const DL=(state.decor||[]).slice();for(const k in state.stash)if(state.stash[k]&&Array.isArray(state.stash[k].decor))DL.push(...state.stash[k].decor);DL.forEach(d=>{if(typeof d.y==="number")d.y=Math.max(H*.2,Math.min(FLOOR+60,yconv(d.y,LF)))});const pp=state.propPos||{};for(const k in pp)if(pp[k]&&isFinite(pp[k].y))pp[k].y=Math.max(H*.2,Math.min(FLOOR+60,yconv(pp[k].y,LF)))}catch(e){}}state.layout=ORI}if(typeof state.gems!=="number"||!isFinite(state.gems)){state.gems=15;setTimeout(()=>notify("💎 Yeni para birimi: Zümrüt! Hoş geldin hediyesi +15 💎"),4800)}for(const k of["coins","xp"])if(typeof state[k]!=="number"||!isFinite(state[k]))state[k]=Math.max(0,+state[k]||0);if(!(state.level>=1)||!isFinite(state.level))state.level=Math.max(1,Math.floor(+state.level)||1);if(typeof state.luck!=="number")state.luck=0;if(typeof state.tut!=="number")state.tut=(state.level>=2||(state.stats&&state.stats.buy>0))?99:0;if(!state.capUp||typeof state.capUp!=="object")state.capUp={};if(!Array.isArray(state.themes))state.themes=[];if(!state.bookRw||typeof state.bookRw!=="object")state.bookRw={};if(!state.propPos||typeof state.propPos!=="object"||Array.isArray(state.propPos))state.propPos={};for(const k of ["stats","ach","streak","helped","helpGot"])if(!state[k]||typeof state[k]!=="object")state[k]=D[k];
if(!state.tank){state.tank="fresh";const salt=state.fish.filter(f=>WATER[f.type]==="salt");if(salt.length){state.fish=state.fish.filter(f=>WATER[f.type]!=="salt");state.stash.salt={fish:salt,dirt:state.dirt};state.migrated=true}}
if(state.other){if(Array.isArray(state.other.fish)&&TANKS[state.other.key]&&state.other.key!==state.tank)state.stash[state.other.key]={fish:state.other.fish,dirt:+state.other.dirt||0};delete state.other}
if(!state.stash||typeof state.stash!=="object"||Array.isArray(state.stash))state.stash={};
if(!TANKS[state.tank])state.tank="fresh";
for(const k of Object.keys(state.stash)){const o=state.stash[k];if(!TANKS[k]||k===state.tank||!o||!Array.isArray(o.fish))delete state.stash[k];else{o.fish=o.fish.filter(f=>species.some(s=>s.id===f.type));o.dirt=Math.max(0,Math.min(100,+o.dirt||0))}}
if(!hasTank("fresh"))state.stash.fresh={fish:[],dirt:5};
state.mutsFound=state.mutsFound||[];allFish().forEach(f=>{if(!isFinite(f.phase))f.phase=rand(0,6);if(f.dir!==1&&f.dir!==-1)f.dir=Math.random()<.5?-1:1;if(!isFinite(f.x)||f.x<0||f.x>1)f.x=rand(.2,.8);if(!isFinite(f.y)||f.y<0||f.y>1)f.y=rand(.25,.65);if(!isFinite(f.age))f.age=.5;if(!isFinite(f.hunger))f.hunger=70;if(!isFinite(f.health))f.health=100;if(!f.personality)f.personality="Uysal";if(!SIZES[f.sizeTrait])f.sizeTrait="normal";if(!MUTS[f.mutation])f.mutation="normal";if(f.hyb!==undefined&&!hybOf(f))delete f.hyb;if(f.lock!==undefined&&f.lock!==true&&f.lock!==false)delete f.lock;if(f.gene!==undefined&&f.gene!==null&&f.gene!=="glitch"&&!GENES.includes(f.gene))f.gene=null;if(f.gene===undefined)f.gene=f.mutation!=="normal"?f.mutation:null;noMut(f)});state.props=(state.props||[]).filter(i=>PROPS.some(p=>p.id===i));state.fish=state.fish.filter(f=>species.some(s=>s.id===f.type));state.discovered=state.discovered.filter(i=>species.some(s=>s.id===i));allFish().forEach(f=>{if(f.hunger==null)f.hunger=70;if(f.health==null)f.health=100;f.sick=!!f.sick});state.market=state.market||{};state.decor=state.decor||[];state.eggs=state.eggs||[];state.equipment=state.equipment||{filter:0,feeder:0};state.equipment.filter=state.equipment.filter||0;state.equipment.feeder=state.equipment.feeder||0;allFish().forEach(f=>{if(!f.name)f.name=getSpecies(f.type).name;if(!f.personality)f.personality=["Meraklı","Uysal","Hareketli","Utangaç"][f.id%4];if(f.lifeHours==null)f.lifeHours=(f.age||0)*24;if(f.sizeGrowth==null)f.sizeGrowth=0;if(f.rarity==null)f.rarity="Normal"});}
function offlineReport(){
normalize();
const elapsed=(Date.now()-(state.lastTick||Date.now()))/1000;
if(elapsed<60){state.lastTick=Date.now();return}
const before=state.pending||0,r=advance(Math.min(elapsed,72*3600)),gain=Math.floor((state.pending||0)-before);
setTimeout(()=>notify("Sen yokken "+fmtTime(elapsed)+" geçti 🌊"+(r.dead.length?" · "+r.dead.length+" balık öldü 💀":"")+(r.sick?" · balıklar hastalandı 🤒":"")+(r.weak?" · balıkların çok acıktı, hemen besle 🍤":"")+(gain>0?" · "+gain+" 🪙 birikti":"")+(state.chest?" · 🎁 sandık çıktı!":"")),600);
}
const PROPS=[
{id:"bonsai",name:"Mercan Bonsai",price:130,perk:"Balıklar %10 daha yavaş acıkır",x:.52,dy:-50,sc:.55,r:1,on:"table",img:"a/0f46c9e359980fff.webp"},
{id:"amphora",name:"Antik Amfora",price:90,perk:"Yumurtalar %20 daha çabuk açılır",x:.10,dy:-38,sc:.9,r:1,img:"a/6f47214b55b3a24c.webp"},
{id:"moai",name:"Moai Heykeli",price:200,perk:"Nadir balık şansı %3,5 → %6",x:.92,dy:-38,sc:.9,r:0,img:"a/746e4257213c1ac7.webp"},
{id:"cave",name:"Taş Mağara",price:100,perk:"Hasta balıklar %25 daha yavaş sağlık kaybeder",x:.38,dy:-30,sc:.9,r:0,img:"a/23ad78f15648e0cf.webp"},
{id:"diver",name:"Dalgıç Kaskı",price:140,perk:"Biriken gelir +%8",x:.66,dy:-30,sc:.78,r:1,img:"a/c2940805c286fcd7.webp"},
{id:"wreck",name:"Gemi Enkazı",price:120,perk:"Hazine sandığı %10 daha sık çıkar",x:.24,dy:0,sc:.95,r:1,img:"a/2f384e1da6c58d6c.webp"},
{id:"ruins",name:"Antik Kalıntılar",price:150,perk:"Kazanılan deneyim +%10",x:.78,dy:0,sc:.9,r:0,img:"a/fb144e095be4d49e.webp"},
{id:"table",name:"Yosunlu Kaya Masa",price:80,perk:"Su %8 daha yavaş kirlenir",x:.52,dy:8,sc:.9,r:1,img:"a/4c397688a40fa1c7.webp"}
];
const pk=id=>(state.props||[]).includes(id),propImgs={},propImgsN={},propImgsF={};const FIMG={bonsai:"a/1fe6c110c3c3011f.webp",amphora:"a/71b6595c38af6a8b.webp",moai:"a/7424c9895d285cbe.webp",cave:"a/18fb0953fa46ca48.webp",diver:"a/8451f458301f539f.webp",wreck:"a/21938f5c8d1b3084.webp",ruins:"a/910c1efd041efaae.webp",table:"a/a6aa03b8043a6a6b.webp"};const NIMG={bonsai:"a/5fa213e3eb3bb530.webp",amphora:"a/ceb0bb968107ad19.webp",moai:"a/01c25dcef9ea0edf.webp",cave:"a/b18937e61727255f.webp",diver:"a/c2a5bb01275d2de4.webp",wreck:"a/9899c04a9de18993.webp",ruins:"a/d7ff524d99ed4d18.webp",table:"a/516cc7618ec98362.webp"};
PROPS.forEach(p=>{const nm=new Image();nm.src=""+B64(NIMG[p.id]);propImgsN[p.id]=nm;const fm=new Image();fm.src=""+B64(FIMG[p.id]);propImgsF[p.id]=fm;const u=""+B64(p.img);document.documentElement.style.setProperty("--p-"+p.id,'url("'+u+'")');const im=new Image();im.src=u;propImgs[p.id]=im});
const DECOR0=["🐚","🪸","⚓","🦪","🦀","🪨","sf"],DECOR=DECOR0.concat(["r1","r2","r3","r4","r5","r6","r7","d1","d2","d3","d4","d5","d6","d7"]);
function clean(){if(isColl(state.tank)){notify("Koleksiyon tankı kirlenmez 🏺");return}if(state.dirt<3){notify("Tank zaten tertemiz ✨");return}const free=state.coins<10;if(!free)state.coins-=10;state.dirt=0;Q("clean");if(curWater()==="deep")Q("dclean");if(curWater()==="river")Q("rclean");if(!free)addXP(2);pop(rand(0,W),H-20,12);sfx("clean");notify(free?"Altının azdı, bu temizlik bizden 🧽":"Tank temizlendi 🧽");renderUI();save(true)}
function cure(){const n=state.fish.filter(f=>f.sick).length;if(!n){notify("Hasta balık yok 👍");return}if(state.coins<30){notify("İlaç için 30 🪙 gerekli");return}state.coins-=30;state.fish.forEach(f=>{if(f.sick){f.sick=false;f.health=Math.max(f.health,40)}});sfx("cure");notify(n+" balık iyileşti 💊");renderUI();save(true)}
function openChest(){
if(!state.chest)return;chestAnim={x:state.chest.x,until:Date.now()+1100};state.chest=null;state.chestAt=Date.now()+36e5*(pk("wreck")?.9:1)*(ev("winter")?.6:1)*(ev("summer")?.75:1);Q("chest");const cm=ev("winter")?1.5:1;
const r=Math.random();let msg;
if(r<.4){const n=Math.round(rand(15,60)*cm);state.coins+=n;msg="Sandıktan "+n+" 🪙 çıktı!"}
else if(r<.55){state.dirt=Math.max(0,state.dirt-40);msg="Arıtma kristali çıktı! Su berraklaştı 🫧"}
else if(r<.68){state.fish.forEach(f=>{f.sick=false;f.health=Math.min(100,f.health+30)});msg="Şifalı yosun çıktı! Balıklar toparlandı 🌿"}
else if(r<.8&&state.snails<3){state.snails++;msg="Salyangoz çıktı 🐌 Yosunları temizler, tank geç kirlenir"}
else if(r<.95&&state.decor.length<14){const P=decorPool(),k=P[Math.random()*P.length|0];state.decor.push({k,x:rand(.06,.94)});msg="Dekor çıktı: "+decTxt(k)+"! Tankın gerçekçileşti"}
else if(r<.985){const n=Math.round(rand(70,150)*cm);state.coins+=n;msg="Nadir hazine! +"+n+" 🪙 ✨"}else{const n=Math.random()<.3?2:1;state.gems+=n;msg="Zümrüt buldun! +"+n+" 💎"}
for(let i=0;i<20;i++)particles.push({x:rand(150,400),y:FLOOR,vx:rand(-60,60),vy:rand(-90,-20),life:rand(.8,1.6),type:"food"});
sfx("chest");renderUI();save(true);notify(msg)}
function deepNow(){return !VISIT&&tw(state.tank)==="deep"}
function NIGHT(){return !!state.night||deepNow()}
function nightAmt(){if(curWater()==="deep")return 1;return DN?(state.night?dnP():1-dnP()):(state.night?1:0)}
const tintC={};
function tinted(im,key,haze,night,nofade){const k=key+(night?"n":"d")+(nofade?"f":"")+curWater();let c=tintC[k];if(c!==undefined)return c;c=null;try{const cv=document.createElement("canvas");cv.width=im.naturalWidth;cv.height=im.naturalHeight;const x=cv.getContext("2d");x.drawImage(im,0,0);x.globalCompositeOperation="source-atop";
// sürüm 117: gece tonu nesnenin kendi rengini korur (eskiden "color" karışımı her şeyi soluk mora çeviriyordu)
if(night){x.globalCompositeOperation="multiply";x.fillStyle="rgb(112,138,196)";x.fillRect(0,0,cv.width,cv.height);x.globalCompositeOperation="screen";x.fillStyle="rgb(3,12,32)";x.fillRect(0,0,cv.width,cv.height);x.globalCompositeOperation="destination-in";x.drawImage(im,0,0);x.globalCompositeOperation="source-atop"}else{x.globalCompositeOperation="source-over";grade(cv,{bg:(FLOOR_AVG[curWater()]||FLOOR_AVG.fresh)[0],mix:.1+haze*.6,desat:.84,contrast:.9,top:.12,ao:.38});x.globalCompositeOperation="source-atop"}
if(!nofade){x.globalCompositeOperation="destination-out";const gr=x.createLinearGradient(0,cv.height*.9,0,cv.height);gr.addColorStop(0,"rgba(0,0,0,0)");gr.addColorStop(1,"rgba(0,0,0,.9)");x.fillStyle=gr;x.fillRect(0,cv.height*.88,cv.width,cv.height*.12)}c=gpuCopy(cv)}catch(e){c=null}tintC[k]=c;return c}
function drawTinted(im,key,x,y,w,h,haze,nf){const d=tinted(im,key,haze,false);ctx.drawImage(d||im,x,y,w,h);if(nf>.01){const n=tinted(im,key,haze,true);if(n){ctx.globalAlpha=nf;ctx.drawImage(n,x,y,w,h);ctx.globalAlpha=1}}}
let propL=null,propKey="";let PY0=FLOOR-240,PHH=H-PY0;const propBox={};function pDepth(y){return .72+.28*Math.max(0,Math.min(1.2,(y-H*.2)/(FLOOR+30-H*.2)))}function decY(d){return typeof d.y==="number"?d.y:FLOOR+22}
function paintProps(ctx,nf){const pl={};const PP=state.propPos||{},ord=p=>PP[p.id]?PP[p.id].y:p.on?1e6:FLOOR+(p.r===0?14:30);[...PROPS].sort((x,y)=>ord(x)-ord(y)).forEach(p=>{const cp=PP[p.id];const im=propImgs[p.id];if(!pk(p.id)||!im||!im.complete||!im.naturalWidth)return;
const back=p.r===0,ar=im.naturalWidth/im.naturalHeight,w=Math.sqrt(18000*ar)*LSR*p.sc*(back?.88:1)*(cp?pDepth(cp.y):1),h=w/ar,cx=(cp?cp.x:p.x)*W,tb=!cp&&p.on&&pl[p.on];
const base=tb?tb.base-tb.h*.74:cp?cp.y:FLOOR+(back?14:30);
if(!tb){const sg=ctx.createRadialGradient(0,0,0,0,0,w*.5);sg.addColorStop(0,"rgba(0,18,30,"+(.34+.14*nf)+")");sg.addColorStop(1,"rgba(0,18,30,0)");ctx.save();ctx.translate(cx,base-3);ctx.scale(1,.2);ctx.fillStyle=sg;ctx.beginPath();ctx.arc(0,0,w*.5,0,7);ctx.fill();ctx.restore()}
{const hz=back?.2:.08,d=tinted(im,p.id+(back?"b":"f"),hz,false);const imN0=(/fresh/.test(state.tank)?propImgsF:propImgsN)[p.id],ok0=imN0&&imN0.complete&&imN0.naturalWidth;ctx.globalAlpha=ok0?1-nf:1;if(ctx.globalAlpha>.01)ctx.drawImage(d||im,cx-w/2,base-h,w,h);ctx.globalAlpha=1;const imN=(/fresh/.test(state.tank)?propImgsF:propImgsN)[p.id];if(nf>.01){const ok=imN&&imN.complete&&imN.naturalWidth;if(ok){const n=tinted(imN,p.id+(/fresh/.test(state.tank)?"Fb":"Nb"),back?.08:0,false),ar2=imN.naturalWidth/imN.naturalHeight,h2=h*1.02,w2=h2*ar2;if(n){ctx.globalAlpha=nf;ctx.drawImage(n,cx-w2/2,base+2-h2,w2,h2);ctx.globalAlpha=1}}else{const n=tinted(im,p.id+(back?"b":"f"),hz,true);if(n){ctx.globalAlpha=nf;ctx.drawImage(n,cx-w/2,base-h,w,h);ctx.globalAlpha=1}}}}pl[p.id]={base,h};propBox[p.id]={cx,base,w,h}})}
function drawProps(){if(!propsHere()){for(const k in propBox)delete propBox[k];return}const nf=nightAmt(),fr=/fresh/.test(state.tank),own=PROPS.filter(p=>pk(p.id));if(!own.length)return;let rd=0;own.forEach(p=>{const a=propImgs[p.id],b=(fr?propImgsF:propImgsN)[p.id];if(a&&a.complete&&a.naturalWidth)rd++;if(b&&b.complete&&b.naturalWidth)rd+=2});const t0=own.some(p=>state.propPos&&state.propPos[p.id])?60:FLOOR-240;if(t0!==PY0){PY0=t0;PHH=H-PY0;propKey=""}const key=JSON.stringify(state.propPos)+own.map(p=>p.id).join()+"|"+fr+"|"+Math.round(nf*30)+"|"+K+"|"+rd;if(key!==propKey||!propL){propKey=key;try{if(!propL)propL=document.createElement("canvas");propL.width=Math.round(W*K);propL.height=Math.round(PHH*K);const c=propL.getContext("2d");c.setTransform(K,0,0,K,0,-PY0*K);try{c.imageSmoothingQuality="high"}catch(e){}paintProps(c,nf)}catch(e){propL=null;paintProps(ctx,nf);return}}ctx.drawImage(propL,0,PY0,W,PHH)}
function drawFloor(t){
drawPlants2(t,0);
if(curWater()!=="deep")try{drawShadows()}catch(e){}
if(!(state.admOff||{}).props)drawProps();if(!(state.admOff||{}).caust)drawCaustics(t);
const dnf=nightAmt();[...state.decor].sort((p,q)=>decY(p)-decY(q)).forEach(d=>{const im=decImg(d.k);if(!im)return;const b=decBox(d);ctx.save();ctx.globalAlpha=.32;ctx.fillStyle="#001a28";ctx.beginPath();ctx.ellipse(d.x*W,b.y+b.h-2,b.w*.42,b.w*.08,0,0,7);ctx.fill();ctx.restore();drawTinted(im,"dec"+d.k,b.x,b.y,b.w,b.h,.05,dnf);const gc=DGLOW[d.k];if(gc&&curWater()==="deep"&&!state.lowGfx){const fk=.85+.15*Math.sin(t*1.7+d.x*20),cx=d.x*W,cy=b.y+b.h*.5;ENV.push([cx,cy,b.w*1.4,gc,.42*fk]);EM.push([cx,b.y+b.h*.4,2.4,gc,.55*fk,0])}});if(EDIT&&EDIT.mode==="deco")editOverlay();
{const si=eimg("🐌");if(si)for(let i=0;i<state.snails;i++){const sx=((t*6+i*300)%(W+60))-30,sw=40,sh=sw*si.naturalHeight/si.naturalWidth,bob=Math.sin(t*1.7+i)*.6;drawTinted(si,"snail",sx-sw/2,FLOOR+40-sh+bob,sw,sh,.03,dnf)}}
if(chestAnim&&Date.now()<chestAnim.until&&chestOpenImg.complete&&chestOpenImg.naturalWidth){{const cw=112,ch=cw*chestOpenImg.naturalHeight/chestOpenImg.naturalWidth;drawTinted(chestOpenImg,"chestO",chestAnim.x*W-cw/2,FLOOR+38-ch,cw,ch,.06,nightAmt())}}
const c=state.chest;if(c){ctx.save();ctx.translate(c.x*W,FLOOR-8+Math.sin(t*3)*3);ctx.globalAlpha=.25+Math.sin(t*4)*.1;ctx.fillStyle="#ffe58a";ctx.beginPath();ctx.arc(0,0,40,0,7);ctx.fill();ctx.globalAlpha=1;const img=chestClosedImg;if(img.complete&&img.naturalWidth){const cw=96,ch=cw*img.naturalHeight/img.naturalWidth;drawTinted(img,"chestC",-cw/2,37-ch,cw,ch,.06,nightAmt())}else{ctx.fillStyle="#8a4b1d";ctx.fillRect(-26,-6,52,30);ctx.fillStyle="#a8621f";ctx.beginPath();ctx.ellipse(0,-6,26,16,0,Math.PI,0);ctx.fill();ctx.fillStyle="#ffd36b";ctx.fillRect(-4,-6,8,16);ctx.fillRect(-26,6,52,4)}ctx.restore()}
}

let moodTxt="",moodAt=0;const moodSeen={};function moodSet(t){const e=$("tankMood");if(!e)return;if(t!==moodTxt){moodTxt=t;e.textContent=t;const k=String(t).replace(/[0-9~]+/g,""),n=Date.now();if(!(moodSeen[k]&&n-moodSeen[k]<120000)){moodAt=n;e.classList.remove("quiet")}moodSeen[k]=n}}
setInterval(()=>{try{const e=$("tankMood");if(e&&moodTxt&&Date.now()-moodAt>6000&&!feedModeOn())e.classList.add("quiet");else if(e&&feedModeOn())e.classList.remove("quiet")}catch(_){}},1000);
function waterStatus(){document.body.classList.toggle("coll",isColl(state.tank));document.body.classList.toggle("deep",deepNow());if(isColl(state.tank)){const e=$("water"),T=TANKS[state.tank],t=T.name+" · bakım gerekmez";if(e.textContent!==t){e.textContent=t;(e.style.setProperty&&e.style.setProperty("--dot","#7fa8e0"))}try{e.classList.add("ok")}catch(_){}return}const d=state.dirt,e=$("water"),T=TANKS[state.tank]||TANKS.fresh,p=T.name+" · ",r=d<15?[p+"Temiz","#3ddc84"]:d<40?[p+"Az kirli","#b5e04a"]:d<60?[p+"Kirli","#f0a83a"]:[p+"Çok kirli","#ff5a4f"];if(e.textContent!==r[0]){e.textContent=r[0];(e.style.setProperty&&e.style.setProperty("--dot",r[1]))}try{e.classList.toggle("ok",d<15)}catch(_){}}
function drawDirt(t){
const d=Math.min(1,state.dirt/100*1.5);if(d<.08){if(dirtC&&dirtC.style)dirtC.style.display="none";return}const dp=curWater()==="deep",k=Math.round(d*40)+(dp?"d":"");
if(k!==dirtK){dirtK=k;if(!dirtC){try{document.querySelectorAll(".dirtov").forEach(e=>e.remove())}catch(e){}dirtC=document.createElement("canvas");dirtC.className="dirtov";dirtC.width=W/2;dirtC.height=H/2;try{dirtC.style.cssText="pointer-events:none";canvas.after(dirtC)}catch(e){dirtC.dom=0}}
const c=dirtC.getContext("2d"),w=W/2,h=H/2;c.clearRect(0,0,w,h);
let g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,dp?"rgba(18,36,40,"+d*.4+")":"rgba(70,95,35,"+d*.45+")");g.addColorStop(.6,dp?"rgba(20,34,34,"+d*.5+")":"rgba(80,85,35,"+d*.6+")");g.addColorStop(1,dp?"rgba(16,24,22,"+d*.7+")":"rgba(60,45,18,"+d*.85+")");c.fillStyle=g;c.fillRect(0,0,w,h);
g=c.createRadialGradient(w/2,h/2,h*.15,w/2,h/2,h*.7);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,dp?"rgba(10,20,18,"+d*.7+")":"rgba(35,45,10,"+d*.75+")");c.fillStyle=g;c.fillRect(0,0,w,h);
for(let i=0;i<40;i++){const r=n=>{const v=Math.sin(i*12.9898+n*78.233)*43758.5453;return v-Math.floor(v)};if(r(1)>d*1.1)continue;
const sd=i%3,x=sd===0?r(2)*w*.18:sd===1?w-r(2)*w*.18:r(3)*w,y=sd===2?h-r(2)*h*.12:r(4)*h,rad=(10+r(5)*26)*(.5+d);
// sürüm 117: yosun lekeleri kenarı yumuşak geçişle çizilir (düz daire gibi durmasın); derin suda koyu ve bulanık
const col=dp?(14+r(6)*12|0)+","+(30+r(7)*16|0)+","+(34+r(7)*14|0):(40+r(6)*30|0)+","+(80+r(7)*40|0)+",25",ga=(.18+d*.3)*(dp?.8:1),gg=c.createRadialGradient(0,0,0,0,0,rad);gg.addColorStop(0,"rgba("+col+","+ga+")");gg.addColorStop(.55,"rgba("+col+","+ga*.7+")");gg.addColorStop(1,"rgba("+col+",0)");c.save();c.translate(x,y);c.rotate(r(9)*3);c.scale(1,.5+r(8)*.8);c.fillStyle=gg;c.fillRect(-rad,-rad,rad*2,rad*2);c.restore()}}
if(dirtC.style)dirtC.style.display="";if(dirtC.dom===0)ctx.drawImage(dirtC,0,0,W,H);
const n=Math.floor(d*70),al=.2+d*.35;for(let g=0;g<3;g++){ctx.fillStyle="rgba("+(90+g*14)+","+(84+g*8)+",30,"+al+")";ctx.beginPath();for(let i=g;i<n;i+=3){const z=(1+i%5)*(.6+d*.8),x=((i*137.5)%W+Math.sin(t*.3+i)*30+t*(3+i%4*2))%W,y=((i*263.7)%H+Math.sin(t*.5+i*1.7)*25+t*(2+i%3))%H;ctx.moveTo(x+z,y);ctx.arc(x,y,z,0,7)}ctx.fill()}
}
function drawStatus(t){
ctx.textAlign="center";ctx.font="18px serif";state.fish.forEach(f=>{const x=f.x*W,y=f.y*H-48;const k=f.sick?"🤒":f.hunger<25?"🍽️":f.st&&STATUS[f.st]?STATUS[f.st][0]:"";if(k){const im=eimg(k);if(im){const h=24,w=h*im.naturalWidth/im.naturalHeight;ctx.drawImage(im,x-w/2,y-h*.8,w,h)}else ctx.fillText(k,x,y)}else if(f.st&&STATUS[f.st])ctx.fillText(STATUS[f.st][0],x,y)});
drawDirt(t)
}
function numK(n){n=+n||0;const a=Math.abs(n),f=(v,u)=>(v>=100?Math.floor(v):Math.floor(v*10)/10).toLocaleString("tr-TR",{maximumFractionDigits:1})+u;if(a<1e5)return Math.floor(n).toLocaleString("tr-TR");if(a<1e6)return f(n/1e3,"B");if(a<1e9)return f(n/1e6,"Mn");return f(n/1e9,"Mr")}
function fitNum(e){try{if(!e||!e.style)return;const k=e.textContent+"|"+innerWidth+"x"+innerHeight;if(e._fk===k)return;e._fk=k;e.style.fontSize="";const cw=e.clientWidth;if(!cw||typeof getComputedStyle!=="function")return;let fs=parseFloat(getComputedStyle(e).fontSize)||0,n=0;while(fs>9&&e.scrollWidth>cw+1&&n++<10){fs*=.92;e.style.fontSize=fs.toFixed(1)+"px"}}catch(_){}}
try{addEventListener("resize",()=>setTimeout(()=>fitNum($("coins")),60))}catch(e){}
function renderUI(){applyUnlocks();
{const ce=$("coins");ce.textContent=numK(state.coins);ce.title=state.coins.toLocaleString("tr-TR")+" altın";fitNum(ce)}{const ge=$("gems");if(ge){ge.textContent=numK(state.gems);fitNum(ge)}}{const lr=$("lvring");if(lr&&lr.style&&lr.style.setProperty)lr.style.setProperty("--xp",Math.min(1,Math.max(0,state.xp/xpNeed(state.level))).toFixed(3))}$("level").textContent=state.level;$("xpfill").style.width=(Math.min(1,state.xp/xpNeed(state.level))*100)+"%";{const xt=$("xptxt");if(xt){const N=xpNeed(state.level),fx=v=>N>=1e4&&v>=1e4?(Math.floor(v/100)/10).toLocaleString("tr-TR")+"B":Math.floor(v).toLocaleString("tr-TR");xt.textContent=fx(state.xp)+(N>=1e4?"\u202f/\u202f":" / ")+fx(N);fitNum(xt)}}$("count").textContent=state.fish.length+"/"+fishCap(state.tank);try{cureBtnSync()}catch(e){}try{tankStripRender()}catch(e){}try{autoLockLabel()}catch(e){}
waterStatus();$("badge").hidden=!(state.chest||(state.pending||0)>=1);$("feedCost").textContent="½ 🪙";$("feed").disabled=(state.coins<1&&!feedModeOn())||!state.fish.length;
if(!openKey)return;updateFeatures();if(openKey==="prod")fillParents();if(openKey==="map")renderMap();if(openKey==="quest")renderQuests();if(openKey==="ach")renderAch();
if(openKey==="shop")renderShop();
if(openKey==="shop"&&shopTab==="decor")$("props").innerHTML=PROPS.map(p=>`<div class="fish-card"><div class="fish-icon"><i class="fi" style="background-image:var(--p-${p.id})"></i></div><div><strong>${p.name}</strong><small>${p.perk}</small></div>${pk(p.id)?'<span class="pill">✓ Yerleşti</span>':`<button data-prop="${p.id}" ${state.coins<p.price?"disabled":""}>${p.price} 🪙</button>`}</div>`).join("");
if(openKey==="fish"){$("speciesCount").textContent=state.discovered.length+" tür keşfedildi";$("inventory").innerHTML=state.fish.length?invHTML():'<p class="note">Bu tank boş. Mağazadan balık alabilirsin.</p>';sellBarRender()}
}
function buy(type,at,q){const s=getSpecies(type),wt=WATER[type],dest=tankArr(wt);if(s.lv&&state.level<s.lv){notify(s.name+" Seviye "+s.lv+lokEk(s.lv)+" açılır 🔒");return}if(!dest){notify("Önce "+TANKS[wt].name+" tankını açmalısın 🔒");return}if(dest.length>=fishCap(wt)){sfx("error");notify(TANKS[wt].icon+" "+TANKS[wt].name+" tankı dolu ("+dest.length+"/"+fishCap(wt)+"). Balık sat ya da koleksiyona taşı");return}if(state.coins<s.price){sfx("error");return}state.coins-=s.price;const rare=Math.random()<(.035+(pk("moai")?.025:0))*(s.deep&&ev("dragonm")?2:1);let mu0=rollMutation();if(state.luck>0){state.luck--;for(let i=0;i<2&&mu0==="normal";i++)mu0=rollMutation()}const f={id:state.nextId++,type,sizeTrait:rollSize(),mutation:mu0,gene:mu0!=="normal"?mu0:rollGene(),age:.12,lifeHours:0,sizeGrowth:0,rarity:rare?"Nadir":"Normal",name:rare?"Parlak "+s.name:s.name,personality:["Meraklı","Uysal","Hareketli","Utangaç"][Math.random()*4|0],hunger:70,health:100,sick:false,x:at?at.x/W:rand(.15,.85),y:at?at.y/H:rand(.2,.8),dir:Math.random()<.5?-1:1,phase:rand(0,6)};noMut(f);dest.push(f);mutNote(f,s);sizeNote(f,s);const newSp=!state.discovered.includes(type);if(newSp)state.discovered.push(type);Q("buy");if(s.deep)Q("dbuy");if(s.river)Q("rbuy");if(!q)sfx("buy");addXP(newSp?15+Math.min(35,Math.floor(Math.sqrt(s.price))):1);if(q)return f;renderUI();save(true);notify(wt===state.tank?s.name+" akvaryuma eklendi! 🐟":s.name+" "+TANKS[wt].name+" tankına eklendi "+TANKS[wt].icon)}
function geneTest(id){const f=state.fish.find(x=>x.id===id);if(!f||geneKnown(f))return;if(state.coins<40){notify("Genetik test 40 🪙");return}state.coins-=40;f.geneKnown=true;Q("gene");sfx("gene");notify((f.name||getSpecies(f.type).name)+": "+(f.gene?MUTS[f.gene].icon+" "+MUTS[f.gene].name+" geni taşıyor!":"taşıyıcı değil"));renderUI();save(true)}
function moveOpts(f){return TKEYS.filter(k=>k!==state.tank&&state.stash[k])}
function moveSel(f){const o=moveOpts(f);return o.length?`<select class="mv" data-mv="${f.id}"><option value="">Taşı…</option>${o.map(k=>`<option value="${k}">${TANKS[k].icon} ${TANKS[k].name}</option>`).join("")}</select>`:""}
function moveFish(id,to){if(VISIT||!TANKS[to]||to===state.tank)return;const dest=tankArr(to);if(!dest)return;if(dest.length>=fishCap(to)){sfx("error");notify(TANKS[to].icon+" "+TANKS[to].name+" tankı dolu ("+dest.length+"/"+fishCap(to)+")");return}const i=state.fish.findIndex(x=>x.id===id);if(i<0)return;const f0=state.fish[i],nm=f0.name||getSpecies(f0.type).name;const f=state.fish.splice(i,1)[0];for(const k of ["vx","vy","tx","ty","tt","rest","ang","fs","tp","sn","st"])delete f[k];f.x=rand(.2,.8);f.y=rand(.3,.6);dest.push(f);if(selectedFish===id)selectedFish=null;const T=TANKS[to];sfx("whoosh");notify(isColl(to)?nm+" koleksiyona alındı "+T.icon:WATER[f.type]===tw(to)?nm+" "+T.name+" tankına taşındı "+T.icon:"⚠️ "+nm+" yanlış suya taşındı, strese girecek!");renderUI();save(true)}
function switchTank(k){if(VISIT||!k||!state.stash[k])return;if(SELLM)sellModeSet(false);CRT.clear();coinsLoose.forEach(c=>{state.pending=(state.pending||0)+c.v});coinsLoose.length=0;feedMode=0;swapTo(k);drops=[];selectedFish=null;dirtK=-1;tapInfo=null;const T=TANKS[k];sfx("whoosh");notify(T.icon+" "+T.name+(T.coll?" · bakım gerekmez":" tankı"));renderUI();save(true)}
function unlockTank(k){const T=TANKS[k];if(!T||hasTank(k))return;if(state.level<T.lv){notify(T.name+" tankı Seviye "+T.lv+lokEk(T.lv)+" açılır");return}if(state.coins<T.cost){notify(T.name+" tankı "+T.cost.toLocaleString("tr-TR")+" 🪙");return}state.coins-=T.cost;state.stash[k]={fish:[],dirt:0};sfx("unlock");checkAch();notify(T.icon+" "+T.name+" tankı açıldı!"+(T.coll?" Balıklarım panelinden balık taşıyabilirsin.":k==="deep"?" Mağazadan derin okyanus balıkları alabilirsin. Burası hep gece 🌙":k==="river"?" Mağazadan nehir canavarlarını alabilirsin 🌳":" Mağazadan tuzlu su balıkları alabilirsin."));renderUI();save(true)}
function sell(id){const i=state.fish.findIndex(f=>f.id===id);if(i<0)return;if(isLocked(state.fish[i])){lockMsg(state.fish[i]);return}const f=state.fish[i],s=getSpecies(f.type),v=saleValue(f);raisedSold(f);state.fish.splice(i,1);state.coins+=v;Q("sell");Q("earn",v);renderUI();addXP(Math.min(4,1+Math.floor(Math.sqrt(v)/25)));sfx("sell");notify(s.name+" satıldı: +"+v+" 🪙")}
function feedCost(){return Math.max(5,state.fish.length*2)}
function feedModeOn(){return feedMode>performance.now()}
function feed(){
if(VISIT)return;
if(isColl(state.tank)){notify("Koleksiyon tankında yemleme gerekmez 🏺");return}
if(!state.fish.length)return;
if(feedModeOn()){feedMode=0;sfx("click");return}
feedMode=performance.now()+15000;sfx("click");notify(curWater()==="deep"?"🦐 Canlı yem: bırakmak istediğin yere dokun":"🍤 Yem modu: yemi atmak istediğin yere dokun")}
function dropFood(x,y,n){
if(VISIT||isColl(state.tank)||!state.fish.length||drops.length>70)return 0;
x=Math.max(50,Math.min(W-50,x));let k=0;
for(let i=0;i<n;i++){state.feedTab=(state.feedTab||0)+.5;
if(state.feedTab>=1){if(state.coins<1){state.feedTab-=.5;break}state.coins-=1;state.feedTab-=1}
drops.push(mkFood(x,y));k++}feedX=x;if(k&&typeof y==="number"&&y>SURF+18)particles.push({x,y,vx:0,vy:0,life:.7,l0:.7,type:"ring"});
if(!k){notify("Yem için yeterli altın yok 🪙");feedMode=0;return 0}
state.dirt=Math.min(100,state.dirt+.08*k);state.lastFeed=Date.now();
state.fish.forEach(f=>{f.wake=simT+10});
const now=performance.now();if(now-feedQAt>6000){feedQAt=now;Q("feed");if(curWater()==="deep")Q("dfeed");if(curWater()==="river")Q("rfeed")}
if(now-sfxAt>260){sfxAt=now;sfx("feed")}
feedMode=now+15000;$("coins").textContent=state.coins.toLocaleString("tr-TR");
if(navigator.vibrate)navigator.vibrate(8);return k}
// ---------- balıkların düşürdüğü altınlar
const COINV=s=>Math.max(1,Math.round(s.price*.045/3));
function spitCoin(f,x,y,fw){if(coinsLoose.length>=10)return;const av=Math.floor(state.pending||0);if(av<1)return;
const v=Math.min(av,COINV(getSpecies(f.type)));state.pending-=v;const d=f.dir||1;
coinsLoose.push({x:x+d*fw*.3,y,vy:-24,v,sw:rand(0,6),yf:FLOOR-4+rand(-4,22),rest:false,t:0});
for(let i=0;i<3;i++)particles.push({x:x+d*fw*.35,y,vx:rand(-8,8),vy:rand(-40,-15),life:.7,type:"bubble"})}
function coinStep(h){if(VISIT)return;for(const c of coinsLoose){c.t+=h;if(!c.rest){c.vy+=(40-c.vy)*Math.min(1,2.2*h);c.y+=c.vy*h;c.x+=Math.sin(simT*2+c.sw)*10*h;if(c.y>=c.yf){c.y=c.yf;c.rest=true}}}for(const c of coinsFly)c.t+=h}
function pickCoin(c){const i=coinsLoose.indexOf(c);if(i<0)return;coinsLoose.splice(i,1);coinsFly.push({x:c.x,y:c.y,v:c.v,t:0});
state.coins+=c.v;Q("collect",c.v);Q("earn",c.v);if(++xpAcc>=2){xpAcc=0;addXP(1)}
sfx("coins");if(navigator.vibrate)navigator.vibrate(6);renderUI()}
function drawCoinSprite(x,y,v,sx,sc){const r=(v>=10?15:v>=3?12:9)*sc;ctx.save();ctx.translate(x,y);ctx.scale(Math.max(.22,sx),1);
if(v>=3){ctx.fillStyle="rgba(255,210,70,.28)";ctx.beginPath();ctx.arc(0,0,r*1.45,0,7);ctx.fill()}
const g=ctx.createRadialGradient(-r*.3,-r*.3,1,0,0,r);g.addColorStop(0,"#fff6b0");g.addColorStop(.6,"#ffc928");g.addColorStop(1,"#d98c0a");
ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r,0,7);ctx.fill();ctx.shadowBlur=0;ctx.lineWidth=2;ctx.strokeStyle="#b36a00";ctx.stroke();
ctx.lineWidth=1.4;ctx.strokeStyle="#f0a400";ctx.beginPath();ctx.arc(0,0,r*.62,0,7);ctx.stroke();ctx.restore()}
function drawCoins(t){if(VISIT){return}
for(const c of coinsLoose){const sx=c.rest?1:Math.abs(Math.cos(t*3.2+c.sw));drawCoinSprite(c.x,c.y,c.v,sx,1+(c.rest?.06*Math.sin(t*4+c.sw):0))}
coinsFly=coinsFly.filter(c=>c.t<.6);for(const c of coinsFly){const p=Math.max(0,c.t/.55);if(c.t<0)continue;const e=Math.pow(Math.min(1,p),1.6);
drawCoinSprite(c.x+(48-c.x)*e,c.y+(40-c.y)*e-Math.sin(Math.min(1,p)*Math.PI)*60,c.v,Math.abs(Math.cos(p*14)),1-.4*e)}}
function collect(){let amount=Math.floor(state.pending||0);const lo=coinsLoose.reduce((s,c)=>s+c.v,0);if(amount+lo<1){notify("Henüz biriken ödül yok");return}state.pending-=amount;coinsLoose.forEach((c,i)=>coinsFly.push({x:c.x,y:c.y,v:c.v,t:-i*.06}));coinsLoose.length=0;amount+=lo;state.coins+=amount;Q("collect",amount);Q("earn",amount);addXP(Math.min(6,1+Math.floor(Math.sqrt(amount)/20)));sfx("coins");notify("Olgun balıklardan "+amount+" 🪙 topladın!");renderUI();save(true)}
// ---------- ses motoru: tüm sesler anlık sentezlenir (dosya yok)
let audioCtx=null,ambience=null,AU=null;
function audio(){if(!audioCtx){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;try{audioCtx=new AC()}catch(e){return null}}if(document.hidden)return audioCtx;if(audioCtx.state!=="running"&&audioCtx.state!=="closed")audioCtx.resume().catch(()=>{});if(!AU)initAU();musInit();audOwn();return audioCtx}
// sürüm 122: oyun aynı anda iki yerde açıksa (uygulama + Safari, iki sekme, yenilenen sayfanın eski hali) ikisi birden
// müzik çalıyor ve gece parçası iki farklı yerinden üst üste binip "notalar karışmış" gibi duyuluyordu.
// Artık sadece en son dokunulan/öne gelen oyun ses çalar, diğerleri susar; arka plana alınan veya kapanan sayfa sesini durdurur.
const AUD_ID=Math.random().toString(36).slice(2);let audBC=null,audOwnT=0;
function audHush(){try{if(audioCtx&&audioCtx.state==="running")audioCtx.suspend().catch(()=>{})}catch(e){}}
function audOwn(){const n=Date.now();if(n-audOwnT<1500)return;audOwnT=n;try{audBC&&audBC.postMessage(AUD_ID)}catch(e){}try{localStorage.setItem("akvAudOwn",AUD_ID+"|"+n)}catch(e){}}
try{if(window.BroadcastChannel){audBC=new BroadcastChannel("akv-audio");audBC.onmessage=e=>{if(e.data!==AUD_ID)audHush()}}}catch(e){}
addEventListener("storage",e=>{if(e.key==="akvAudOwn"&&e.newValue&&e.newValue.split("|")[0]!==AUD_ID)audHush()});
document.addEventListener("visibilitychange",()=>{if(document.hidden)audHush();else if(audioCtx){audOwnT=0;audio()}});
addEventListener("pagehide",()=>{audHush();try{for(const o of MUSALL)musKill(o,true);musCur=null;musKey=""}catch(e){}});addEventListener("pageshow",e=>{if(e.persisted&&audioCtx&&!document.hidden){audOwnT=0;audio()}});
function initAU(){const a=audioCtx,m=a.createGain(),comp=a.createDynamicsCompressor();m.gain.value=.9;comp.threshold.value=-16;comp.ratio.value=4;m.connect(comp);comp.connect(a.destination);
const sfx=a.createGain(),amb=a.createGain(),mus=a.createGain(),mf=a.createBiquadFilter();mf.type="lowpass";mf.frequency.value=5000;mus.connect(mf);mf.connect(m);sfx.connect(m);amb.connect(m);
const len=a.sampleRate*2,nb=a.createBuffer(1,len,a.sampleRate),nd=nb.getChannelData(0);for(let i=0;i<len;i++)nd[i]=Math.random()*2-1;
const bb=a.createBuffer(1,len,a.sampleRate),bd=bb.getChannelData(0);let l=0;for(let i=0;i<len;i++){l=(l+.02*(Math.random()*2-1))/1.02;bd[i]=l*3.5}
const mus2=a.createGain();mus2.connect(m);AU={m,sfx,amb,mus,mus2,mf,nb,bb,next:0,step:0,bar:0,mel:5};applyVolumes()}
const VOL=(()=>{const v={s:1,m:1,a:1};try{const o=JSON.parse(localStorage.getItem("akvVol")||"null");if(o&&typeof o==="object"){for(const k of["s","m","a"])if(o[k]>=0&&o[k]<=1)v[k]=+o[k];if(typeof o.ao==="boolean")v.ao=o.ao}}catch(e){}return v})();
function ambOn(){return typeof VOL.ao==="boolean"?VOL.ao:!state.muted}function volSave(){try{localStorage.setItem("akvVol",JSON.stringify(VOL))}catch(e){}}
function setVol(k,p){p=Math.max(0,Math.min(100,Math.round(+p)));if(!isFinite(p))return;VOL[k]=p/100;volSave();audio();applyVolumes();soundLabels()}
function applyVolumes(){if(!AU)return;const t=audioCtx.currentTime;AU.sfx.gain.setTargetAtTime(state.muted?0:VOL.s,t,.05);AU.amb.gain.setTargetAtTime(ambOn()?.8*VOL.a:0,t,.3);AU.mus.gain.setTargetAtTime(state.music===false?0:.5*VOL.m,t,.4);if(AU.mus2)AU.mus2.gain.setTargetAtTime(state.music===false?0:.6*VOL.m,t,.4)}
function env(g,t,at,peak,dec){g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+at);g.gain.exponentialRampToValueAtTime(.0001,t+at+dec)}
function osc(type,f,t,dur,vol,o2){o2=o2||{};const a=audioCtx,o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(o2.to)o.frequency.exponentialRampToValueAtTime(o2.to,t+(o2.glide||dur));env(g,t,o2.at||.006,vol,dur);let out=o;if(o2.lp){const fl=a.createBiquadFilter();fl.type="lowpass";fl.frequency.value=o2.lp;o.connect(fl);out=fl}out.connect(g);g.connect(o2.bus||AU.sfx);o.start(t);o.stop(t+(o2.at||.006)+dur+.05)}
function noise(t,dur,vol,type,f,o2){o2=o2||{};const a=audioCtx,s=a.createBufferSource(),fl=a.createBiquadFilter(),g=a.createGain();s.buffer=o2.brown?AU.bb:AU.nb;fl.type=type;fl.frequency.setValueAtTime(f,t);if(o2.to)fl.frequency.exponentialRampToValueAtTime(o2.to,t+dur);fl.Q.value=o2.q||1;env(g,t,o2.at||.004,vol,dur);s.connect(fl);fl.connect(g);g.connect(o2.bus||AU.sfx);s.start(t,Math.random()*1.5);s.stop(t+dur+.1)}
const NT=n=>440*Math.pow(2,(n-69)/12);
function bubble(t,p,v,bus){osc("sine",p,t,.07,v||.05,{to:p*2.4,glide:.06,bus})}
function plop(t,v){osc("sine",950,t,.09,v||.09,{to:170,glide:.08});noise(t,.035,(v||.09)*.35,"bandpass",1400,{q:3})}
function coin(t,v){osc("square",NT(88),t,.06,(v||.045)*.6,{lp:5000});osc("triangle",NT(95),t+.06,.28,v||.045);osc("sine",NT(107),t+.06,.22,(v||.045)*.4)}
function arp(t,notes,gap,type,v,dur){notes.forEach((n,i)=>osc(type||"triangle",NT(n),t+i*gap,dur||.3,v||.045))}
function chime(t,n,v){osc("sine",NT(n),t,.9,v||.04,{at:.004});osc("sine",NT(n)*2.76,t,.25,(v||.04)*.35)}
function sfx(name){if(!AU||state.muted||!audioCtx||audioCtx.state!=="running")return;if(MB.sfx&&SIDX[name]){const s=SIDX[name],v=SVAR[name]||0;playSeg(MB.sfx,s[0],s[1],name==="click"?.55:.85,v?rand(1-v,1+v):1);return}const t=audioCtx.currentTime+.01;
switch(name){
case"bubble":bubble(t,rand(380,700));bubble(t+.07,rand(600,900),.03);break;
case"amb":bubble(t,rand(300,900),rand(.008,.02),AU.amb);break;
case"boop":osc("sine",520,t,.12,.06,{to:820,glide:.09});bubble(t+.08,900,.025);break;
case"click":osc("sine",1500,t,.03,.025);noise(t,.02,.015,"highpass",4000);break;
case"feed":for(let i=0;i<3;i++)noise(t+i*.07,.05,.05,"highpass",5000);for(let i=0;i<5;i++)plop(t+.25+i*rand(.08,.16)+i*.04,rand(.04,.08));break;
case"clean":noise(t,.7,.09,"bandpass",350,{to:2600,q:1.5,at:.15});for(let i=0;i<9;i++)bubble(t+.2+i*.06,rand(400,1100),.03);break;
case"whoosh":noise(t,.5,.08,"bandpass",1800,{to:300,q:1.2,at:.08});bubble(t+.35,500,.04);break;
case"buy":noise(t,.45,.11,"lowpass",3200,{to:400});for(let i=0;i<4;i++)bubble(t+.08+i*.05,rand(350,800),.035);chime(t+.25,84,.03);break;
case"sell":coin(t);coin(t+.12,.035);osc("triangle",NT(67),t,.18,.04);break;
case"coins":for(let i=0;i<4;i++)coin(t+i*.07+rand(0,.03),.035);break;
case"chest":osc("sawtooth",95,t,.32,.035,{to:150,glide:.3,lp:700});noise(t+.28,.12,.05,"lowpass",900);arp(t+.4,[84,88,91,96,100],.06,"triangle",.04,.4);for(let i=0;i<4;i++)coin(t+.75+i*.08,.03);break;
case"level":arp(t,[72,76,79,84,88],.09,"triangle",.05,.35);osc("sine",NT(60),t,.9,.04,{at:.05});osc("sine",NT(64),t,.9,.03,{at:.05});break;
case"ach":arp(t,[79,84,88],.1,"square",.025,.18);arp(t+.32,[91],0,"triangle",.05,.8);chime(t+.32,96,.03);osc("sine",NT(67),t+.32,1,.03,{at:.08});break;
case"place":osc("triangle",140,t,.18,.06,{to:90});noise(t,.15,.05,"lowpass",600);chime(t+.18,88,.03);break;
case"help":case_help(t);break;
case"dusk":noise(t,1.4,.05,"lowpass",2400,{to:300,at:.3,brown:true});arp(t+.1,[84,79,76,72,67],.16,"sine",.035,.7);osc("sine",NT(48),t+.2,1.6,.03,{at:.4});break;
case"dawn":noise(t,1.2,.05,"lowpass",300,{to:2600,at:.4,brown:true});arp(t+.1,[67,72,76,79,84,88],.12,"triangle",.035,.6);chime(t+.8,91,.03);break;
case"cure":arp(t,[76,83,88],.08,"sine",.04,.4);break;
case"gene":for(let i=0;i<6;i++)osc("sine",NT(84+((i*5)%12)),t+i*.045,.12,.025);chime(t+.3,91,.03);break;
case"breed":chime(t,79,.04);chime(t+.18,83,.04);bubble(t+.3,700,.03);break;
case"hatch":for(let i=0;i<3;i++)plop(t+i*.12,.05);chime(t+.4,88,.035);chime(t+.55,91,.03);break;
case"rare":for(let i=0;i<10;i++)osc("sine",NT([84,86,88,91,93][i%5]+12*(i%2)),t+i*.05,.3,.02);break;
case"crash":if(MB.crash){playSeg(MB.crash,0,GLX_MS/1000-.02,.8);break}{for(let i=0;i<7;i++){noise(t+i*.055,.045,.09,"bandpass",i%2?3200:900,{q:6});osc("square",i%2?1760:440,t+i*.055,.04,.025)}
osc("sawtooth",110,t+.4,.5,.07,{lp:900});osc("sawtooth",116.5,t+.4,.5,.06,{lp:900});
[[76,.95],[71,1.12],[64,1.29]].forEach(([n,d])=>{osc("triangle",NT(n),t+d,.16,.07);osc("square",NT(n)/2,t+d,.14,.018,{lp:1400})});
osc("sine",NT(52),t+1.5,1.1,.08,{to:38,glide:1});noise(t+1.5,.9,.05,"lowpass",900,{to:120,brown:true});break}
case"legend":osc("sine",NT(31),t,2.4,.09,{at:.01});osc("sine",NT(43),t,2,.05);osc("sine",NT(43)*2.76,t,.8,.02);for(let i=0;i<14;i++)osc("sine",NT([79,82,84,86,89][i%5]+12*(i%3===0)),t+.3+i*.07,.35,.018);break;
case"unlock":noise(t,.9,.07,"lowpass",300,{to:2000,at:.3,brown:true});arp(t+.3,[67,72,76,79,84],.1,"triangle",.045,.5);break;
case"sick":osc("triangle",NT(64),t,.25,.04);osc("triangle",NT(63),t+.22,.4,.04);break;
case"death":arp(t,[67,65,63,60],.22,"sine",.04,.5);break;
case"error":osc("sine",NT(57),t,.12,.04);osc("sine",NT(55),t+.12,.18,.04);break;
}}
function case_help(t){noise(t,.6,.07,"bandpass",400,{to:2400,q:1.4,at:.12});for(let i=0;i<6;i++)bubble(t+.15+i*.06,rand(400,1000),.03);coin(t+.5);coin(t+.62,.035)}
function tone(freq,dur,wave="sine",vol=.025,delay=0){if(!AU||state.muted)return;osc(wave,freq,audioCtx.currentTime+delay+.01,dur,vol)}

// Akvaria'ya özel üretilmiş müzik ve efektler (snd/ klasörü). Yüklenemezse sentez sesler çalışır.
const MUS={day:"snd/day.mp3",night:"snd/night.mp3",event:"snd/event.mp3",amb:"snd/amb.mp3",sfx:"snd/sfx.mp3",crash:"a/81fe4c1a53b8fd09.mp3"},MB={},SIDX={"feed":[0.0,0.7],"sell":[0.82,0.9],"coins":[1.84,1.2],"buy":[3.16,1.0],"click":[4.28,0.18],"error":[4.58,0.6],"clean":[5.3,1.4],"bubble":[6.82,0.35],"boop":[7.2899,0.6],"chest":[8.0099,2.0],"level":[10.1299,2.0],"ach":[12.2499,2.0],"rare":[14.3699,1.8],"legend":[16.2899,3.2],"hatch":[19.6099,1.0],"whoosh":[20.7299,0.8],"unlock":[21.6499,1.6],"cure":[23.3699,1.0],"breed":[24.4899,0.9],"gene":[25.5099,1.0],"place":[26.6299,0.7],"help":[27.4499,1.3],"sick":[28.8699,0.9],"death":[29.8899,2.0],"dusk":[32.0099,2.0],"dawn":[34.1299,2.0]},SVAR={feed:.08,sell:.04,coins:.03,click:.05,bubble:.12,boop:.06,place:.05,breed:.03,hatch:.04};let musLoad=0,musCur=null,musKey="",musChk=0;
// sürüm 119: bir ses dosyası yüklenemezse 3 kez daha denenir; yedek sentez müzik sadece dosya hiç yüklenemezse çalar
// (eskiden gece parçası bir kez yüklenemeyince bütün gece yedek melodi çalıyordu)
const MFAIL={};
function musLoadK(k,n){fetch(MUS[k],n?{cache:"reload"}:undefined).then(r=>{if(!r.ok)throw new Error("yok");return r.arrayBuffer()}).then(b=>new Promise((res,rej)=>{try{const p=audioCtx.decodeAudioData(b,res,rej);if(p&&p.then)p.then(res,rej)}catch(e){rej(e)}})).then(buf=>{MB[k]=buf;if(k==="amb"&&ambience&&!ambience.file)ambFile()}).catch(()=>{if(n<3)setTimeout(()=>musLoadK(k,n+1),2000*(n+1));else MFAIL[k]=1})}
function musInit(){if(musLoad||!audioCtx||typeof fetch!=="function")return;musLoad=1;Object.keys(MUS).forEach(k=>musLoadK(k,0))}
function loopTrim(s,buf){try{const d=buf.getChannelData(0);let a=0,b=d.length-1;while(a<d.length-1&&Math.abs(d[a])<1e-4)a++;while(b>a&&Math.abs(d[b])<1e-4)b--;s.loopStart=a/buf.sampleRate;s.loopEnd=(b+1)/buf.sampleRate}catch(e){}}
function playSeg(buf,off,dur,vol,rate){try{const s=audioCtx.createBufferSource(),g=audioCtx.createGain();s.buffer=buf;s.playbackRate.value=rate||1;g.gain.value=vol;s.connect(g);g.connect(AU.sfx);s.start(audioCtx.currentTime+.005,off,dur+.02)}catch(e){}}
function playBuf(buf,vol,rate){try{const s=audioCtx.createBufferSource(),g=audioCtx.createGain();s.buffer=buf;if(rate)s.playbackRate.value=rate;g.gain.value=vol;s.connect(g);g.connect(AU.sfx);s.start()}catch(e){}}
function ambFile(){try{if(ambience){try{ambience.s.stop()}catch(e){}}const s=audioCtx.createBufferSource(),g=audioCtx.createGain();s.buffer=MB.amb;s.loop=true;loopTrim(s,MB.amb);g.gain.value=.55;s.connect(g);g.connect(AU.amb);s.start();ambience={s,file:1}}catch(e){}}
function musWant(){if(state.music===false)return"";const wb=$("wheelBox");if(MB.event&&wb&&wb.offsetParent)return"event";return NIGHT()?"night":"day"}
// sürüm 128: müzik geçişi iPhone'da da güvenilir. Eski parça doğrusal olarak kısılır ve ses saatine göre durdurulur (zamanlayıcıya güvenilmez);
// çalan bütün müzik kaynakları listede tutulur, o an çalması gereken dışındaki her parça zorla durdurulur (eskiden gece parçası gündüzde de çalmaya devam edebiliyordu).
const MUSALL=new Set();
function musKill(o,hard){const a=audioCtx;if(!o||!a)return;try{const t=a.currentTime,g=o.g.gain;g.cancelScheduledValues(t);if(hard){g.setValueAtTime(0,t)}else{g.setValueAtTime(g.value,t);g.linearRampToValueAtTime(0,t+1.4)}o.s.stop(t+(hard?.05:1.5))}catch(e){try{o.s.stop()}catch(_){}}o.dead=o.dead||performance.now();if(hard){try{o.s.disconnect();o.g.disconnect()}catch(e){}MUSALL.delete(o)}}
function musGuard(){const now=performance.now();for(const o of MUSALL){if(o===musCur)continue;if(!o.dead)musKill(o,false);else if(now-o.dead>2200)musKill(o,true)}if(musCur&&musCur.k!==musKey){musKill(musCur,false);musCur=null}if(musCur&&now-musCur.t0>3000&&musCur.g.gain.value<.05){try{musCur.g.gain.cancelScheduledValues(0);musCur.g.gain.value=musCur.k==="event"?.75:1}catch(e){}}}
function musUpdate(){if(!AU||!audioCtx||audioCtx.state!=="running")return;const now=performance.now();if(now-musChk<400)return;musChk=now;musGuard();const k=musWant();if(k===musKey)return;if(k&&!MB[k])return;const t=audioCtx.currentTime;if(musCur)musKill(musCur,false);musCur=null;musKey=k;if(!k)return;try{const s=audioCtx.createBufferSource(),g=audioCtx.createGain(),b=MB[k];s.buffer=b;s.loop=true;loopTrim(s,b);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(k==="event"?.75:1,t+1.8);s.connect(g);g.connect(AU.mus2);s.start(t,k==="event"?0:Math.random()*Math.max(0,(s.loopEnd||b.duration)-30));musCur={s,g,k,t0:now};MUSALL.add(musCur)}catch(e){musCur=null;musKey=""}}
function startAmbience(){if(!AU||ambience)return;if(MB.amb){ambFile();return}const a=audioCtx,s=a.createBufferSource(),fl=a.createBiquadFilter(),g=a.createGain(),lfo=a.createOscillator(),lg=a.createGain();s.buffer=AU.bb;s.loop=true;fl.type="lowpass";fl.frequency.value=420;g.gain.value=.045;lfo.frequency.value=.07;lg.gain.value=.02;lfo.connect(lg);lg.connect(g.gain);s.connect(fl);fl.connect(g);g.connect(AU.amb);s.start();lfo.start();ambience={s,fl}}
function stopAmbience(){}
// müzik: I–vi–IV–V üzerinde yumuşak pad, bas ve pentatonik marimba
const PROG=[[60,64,67],[57,60,64],[53,57,60],[55,59,62]],PENTA=[72,74,76,79,81,84,86,88];
function musicTick(){if(!AU||state.music===false||audioCtx.state!=="running"||musCur)return;{const k=musWant();if(k&&MUS[k]&&!MFAIL[k]&&typeof fetch==="function")return}const a=audioCtx,now=a.currentTime,E=60/74/2;if(AU.next<now)AU.next=now+.1;
AU.mf.frequency.setTargetAtTime(NIGHT()?1300:5000,now,.5);
while(AU.next<now+.35){const t=AU.next,st=AU.step%8,ch=PROG[AU.bar%4];
if(st===0){ch.forEach(n=>osc("sine",NT(n),t,E*8,.016,{at:.9,bus:AU.mus}));osc("triangle",NT(ch[0]-12),t,E*3,.045,{bus:AU.mus,lp:600})}
if(st===4)osc("triangle",NT(ch[0]-12),t,E*3,.035,{bus:AU.mus,lp:600});
if(Math.random()<(NIGHT()?.28:.42)&&!(st%2&&Math.random()<.5)){AU.mel=Math.max(0,Math.min(PENTA.length-1,AU.mel+[-2,-1,-1,0,1,1,2][Math.random()*7|0]));let n=PENTA[AU.mel];if(st===0&&!ch.some(c=>(n-c)%12===0))n=ch[2]+12;osc("sine",NT(n),t,.55,.04,{bus:AU.mus});osc("sine",NT(n)*4,t,.12,.012,{bus:AU.mus})}
AU.next+=E;AU.step++;if(AU.step%8===0)AU.bar++}}
document.addEventListener("pointerdown",()=>{if(audio())startAmbience()},true);
$("feed").addEventListener("click",()=>{audio();feed()});
$("clean").addEventListener("click",()=>{audio();clean()});$("cure").addEventListener("click",()=>{audio();cure()});$("save").addEventListener("click",()=>save());$("sound").addEventListener("click",()=>sndToggle("s",state.muted));$("music").addEventListener("click",()=>sndToggle("m",state.music===false));
function soundLabels(){const on={s:!state.muted,m:state.music!==false,a:ambOn()},sw={s:"sound",m:"music",a:"ambBtn"};for(const k of["s","m","a"]){const b=$(sw[k]),r=$("vol"+k.toUpperCase()),l=$("vol"+k.toUpperCase()+"v"),p=Math.round(VOL[k]*100);if(b){b.classList.toggle("on",on[k]);if(b.setAttribute)b.setAttribute("aria-checked",String(on[k]))}if(r){if(document.activeElement!==r)r.value=String(p);if(r.style&&r.style.setProperty)r.style.setProperty("--p",p+"%")}if(l)l.textContent=on[k]?"%"+p:"Kapalı";const row=r&&r.closest&&r.closest(".sndrow");if(row)row.classList.toggle("off",!on[k])}const a=$("sndAll");if(a)a.textContent=on.s||on.m||on.a?"🔇 Hepsini kapat":"🔊 Hepsini aç"}
function sndToggle(k,v){if(k==="s")state.muted=!v;else if(k==="m")state.music=!!v;else{VOL.ao=!!v;volSave()}audio();startAmbience();applyVolumes();soundLabels();if(k==="s"&&v)sfx("boop");save(true)}
function sndAll(){const any=!state.muted||state.music!==false||ambOn();state.muted=any;state.music=!any;VOL.ao=!any;volSave();audio();startAmbience();applyVolumes();soundLabels();if(!any)sfx("boop");save(true)}
for(const k of["s","m","a"]){const r=$("vol"+k.toUpperCase());if(r){r.addEventListener("input",()=>{setVol(k,r.value);if(VOL[k]>0&&!(k==="s"?!state.muted:k==="m"?state.music!==false:ambOn()))sndToggle(k,true)});if(k==="s")r.addEventListener("change",()=>sfx("boop"))}}
if($("ambBtn"))$("ambBtn").addEventListener("click",()=>sndToggle("a",!ambOn()));if($("sndAll"))$("sndAll").addEventListener("click",sndAll);if($("sndTest"))$("sndTest").addEventListener("click",()=>{audio();if(state.muted){notify("Efektler kapalı, önce aç 🔔");return}sfx("coins")})
function updateFeatures(){
const eggs=state.eggs||[];const ready=eggs.filter(e=>Date.now()>=e.hatchAt).length;
$("eggStatus").textContent=eggs.length?(ready?ready+" yumurta açılmaya hazır":eggs.length+" yumurta · "+fmtTime(Math.max(0,(Math.min(...eggs.map(e=>e.hatchAt))-Date.now())/1000))):"Yumurta beklenmiyor";
$("gearStatus").textContent="Filtre Sv. "+state.equipment.filter+" · Yemleyici Sv. "+state.equipment.feeder;
capLabel();$("upgradeFilter").textContent="🫧 Filtre · "+(state.equipment.filter>=5?"MAX":100*(state.equipment.filter+1)+" 🪙");$("upgradeFeeder").textContent="🍤 Yemleyici · "+(state.equipment.feeder>=5?"MAX":100*(state.equipment.feeder+1)+" 🪙");
$("decorStatus").textContent=state.decor.length+" küçük dekor · "+state.props.length+"/"+PROPS.length+" özel dekor"+(propsHere()?"":" · özel dekorlar bu tankta görünmez");
$("collectionStatus").textContent=state.discovered.length+" / "+species.length+" tür · "+state.mutsFound.length+" / "+MSP().length*5+" mutasyon keşfedildi";
}
function featureTick(now){
if(!state.eggs)state.eggs=[];
if(ensureOrders(now)){if(openKey==="quest")renderQuests();badges()}
const due=state.eggs.filter(e=>now>=e.hatchAt),used={},hatch=due.filter(e=>{const k=e.tank||state.tank,a=tankArr(k)||state.fish;used[k]=(used[k]||0)+1;return a.length+used[k]<=fishCap(k)});if(due.length>hatch.length&&!state.eggWait){state.eggWait=1;const wk=due.find(e=>!hatch.includes(e)),wt=TANKS[(wk&&wk.tank)||state.tank]||TANKS.fresh;notify("🥚 Yumurta bekliyor: "+wt.name+" tankı dolu, yer açınca çıkacak")}if(!due.length||hatch.length)state.eggWait=0;if(hatch.length){state.eggs=state.eggs.filter(e=>!hatch.includes(e));hatch.forEach(e=>{let sp,mu,gene,hyb=null,bredMut=false,shiny=Math.random()<.08,dest=state.fish,zt=rollSize();
if(e.type&&e.pa&&e.pb&&species.some(s=>s.id===e.type)){sp=getSpecies(e.type);const a1=allele(e.pa),a2=allele(e.pb);if(a1&&a2&&a1!==a2&&HYB_T.includes(a1)&&HYB_T.includes(a2)&&Math.random()<(e.pa.h&&e.pb.h?.4:.2)){const P=hybPair(a1,a2);mu=P[0];hyb=P[1];bredMut=true}else if(a1&&a1===a2){mu=a1;bredMut=true}else mu=rollMutation();if(mu!=="glitch"&&e.pa.m&&e.pa.m!=="normal"&&e.pb.m&&e.pb.m!=="normal"&&Math.random()<MUTS.glitch.p*4){mu="glitch";hyb=null}gene=mu!=="normal"?mu:(a1&&a2?(Math.random()<.5?a1:a2):(a1||a2||null));if(e.shiny)shiny=Math.random()<.3;zt=inheritSize(e.pa.z,e.pb.z);dest=tankArr(e.tank)||state.fish}
else{const par=state.fish.length?state.fish[Math.random()*state.fish.length|0]:null;sp=par?getSpecies(par.type):species[0];mu=rollMutation();gene=mu!=="normal"?mu:rollGene()}
const f={id:state.nextId++,type:sp.id,sizeTrait:zt,mutation:mu,gene,age:.04,lifeHours:0,sizeGrowth:0,rarity:shiny?"Nadir":"Normal",name:"Yavru "+sp.name,personality:["Meraklı","Uysal","Hareketli","Utangaç"][Math.random()*4|0],hunger:80,health:100,sick:false,x:rand(.15,.85),y:rand(.2,.8),dir:Math.random()<.5?-1:1,phase:rand(0,6)};if(hyb)f.hyb=hyb;noMut(f);dest.push(f);mutNote(f,sp);sizeNote(f,sp);if(bredMut)Q("bredMut");if(!state.discovered.includes(sp.id))state.discovered.push(sp.id)});Q("hatch",hatch.length);addXP(6*hatch.length);sfx("hatch");notify(hatch.length+" yumurta açıldı! Yeni yavrular 🐣");renderUI();save(true)}
if(now>=(state.eventAt||now+999999)){state.eventAt=now+rand(900000,1800000);const r=Math.random();if(r<.34){const n=Math.round(rand(4,14));state.coins+=n;state.eventMessage="Akıntı bir hazine getirdi! +"+n+" 🪙";notify("🌟 "+state.eventMessage)}else if(r<.67){state.dirt=Math.max(0,state.dirt-18);state.eventMessage="Temiz akıntı suyu berraklaştırdı!";notify("🌊 "+state.eventMessage)}else{const f=state.fish[Math.random()*state.fish.length|0];if(f){f.hunger=Math.min(100,f.hunger+25);state.eventMessage=(f.name||getSpecies(f.type).name)+" doğal yem buldu!";notify("🐟 "+state.eventMessage)}}save(true)}
if(openKey)updateFeatures();
}
function breedable(f){return f.age>=MATURE&&!f.sick&&f.health>50&&WATER[f.type]===state.tank&&!(f.bredAt&&Date.now()-f.bredAt<18e5)}
function fillParents(){const ps=state.fish.filter(breedable),a=$("pa"),b=$("pb"),va=a.value,vb=b.value;
const nm=f=>(f.name||getSpecies(f.type).name)+(f.mutation!=="normal"?" "+MUTS[f.mutation].icon:"")+(f.geneKnown&&f.gene&&f.mutation==="normal"?" 🧬":"");
a.innerHTML='<option value="">Birinci ebeveyn</option>'+ps.map(f=>`<option value="${f.id}">${esc(nm(f))}</option>`).join("");if(ps.some(f=>String(f.id)===va))a.value=va;
const A=ps.find(f=>String(f.id)===a.value),bs=A?ps.filter(f=>f!==A&&f.type===A.type):[];
b.innerHTML='<option value="">'+(A?(bs.length?"İkinci ebeveyn":"Aynı türden başka yetişkin yok"):"Önce birinciyi seç")+'</option>'+bs.map(f=>`<option value="${f.id}">${esc(nm(f))}</option>`).join("");if(bs.some(f=>String(f.id)===vb))b.value=vb;
const B=bs.find(f=>String(f.id)===b.value);$("odds").textContent=A&&B?oddsText(A,B):ps.length<2?breedHint():"Aynı türden iki balık seç.";
$("breed").textContent="💞 Çiftleştir · "+breedCost()+" 🪙";$("breed").disabled=!(A&&B)}
function breedHint(){const base="Çiftleşmek için aynı türden iki sağlıklı yetişkin balık gerekir (yarım saatte bir).";if(isColl(state.tank))return"Koleksiyon tankında balıklar büyümez ve çiftleşmez. Çiftleştirmek için balıkları tatlı ya da tuzlu su tankına taşı.";const fs=state.fish.filter(f=>WATER[f.type]===state.tank),r=[],young=fs.filter(f=>f.age<MATURE).length,weak=fs.filter(f=>f.age>=MATURE&&(f.sick||f.health<=50)).length,rest=fs.filter(f=>f.age>=MATURE&&!f.sick&&f.health>50&&f.bredAt&&Date.now()-f.bredAt<18e5).length;if(young)r.push(young+" balık henüz yetişkin değil");if(weak)r.push(weak+" balık hasta ya da zayıf");if(rest)r.push(rest+" balık dinleniyor");return base+(r.length?" Bu tankta: "+r.join(", ")+".":"")}
function breedCost(){const A=state.fish.find(f=>String(f.id)===($("pa")&&$("pa").value)),p=A?getSpecies(A.type).price:30,b=Math.round(p*.5+20);return ev("love")?Math.round(b*.5):b}
function breed(){const A=state.fish.find(f=>String(f.id)===$("pa").value),B=state.fish.find(f=>String(f.id)===$("pb").value);if(!A||!B||A===B||A.type!==B.type||!breedable(A)||!breedable(B)){notify("Aynı türden iki sağlıklı yetişkin seç");return}const c=breedCost();if(state.coins<c){notify("Çiftleştirme "+c+" 🪙");return}if(state.eggs.length>=3){notify("Aynı anda en fazla 3 yumurta tutabilirsin");return}if(state.fish.length+state.eggs.length>=fishCap(state.tank)){notify("Tank dolu, yavrulara yer yok ("+state.fish.length+"/"+fishCap(state.tank)+")");return}state.coins-=c;A.bredAt=B.bredAt=Date.now();
state.eggs.push({id:Date.now(),hatchAt:Date.now()+9e5*(pk("amphora")?.8:1)*(ev("spring")?.5:1),tank:state.tank,type:A.type,pa:{m:A.gift?"normal":A.mutation,g:A.gift?null:A.gene,z:szOf(A),h:A.gift?null:hybOf(A)},pb:{m:B.gift?"normal":B.mutation,g:B.gift?null:B.gene,z:szOf(B),h:B.gift?null:hybOf(B)},shiny:A.rarity==="Nadir"||B.rarity==="Nadir"});Q("breed");sfx("breed");notify("💞 Yumurta bırakıldı! Yaklaşık "+fmtTime((state.eggs[state.eggs.length-1].hatchAt-Date.now())/1000)+" sonra açılacak 🥚");renderUI();save(true)}
function upgrade(which){const level=state.equipment[which]||0,cost=100*(level+1);if(level>=5){notify("Bu ekipman en üst seviyede!");return}if(state.coins<cost){notify("Geliştirmek için "+cost+" 🪙 gerekli");return}state.coins-=cost;state.equipment[which]=level+1;notify((which==="filter"?"Filtre":"Otomatik yemleyici")+" seviyesi "+(level+1)+" oldu!");renderUI();save(true)}
function buyProp(id){const p=PROPS.find(x=>x.id===id);if(!p||pk(id))return;if(state.coins<p.price){notify("Yeterli 🪙 yok");return}state.coins-=p.price;state.props.push(id);checkAch();sfx("place");renderUI();save(true);notify(p.name+" eklendi! "+p.perk);setTimeout(()=>editStart("deco"),250)}
function addDecor(){if(state.decor.length>=14){notify("Akvaryum dekorla dolu!");return}if(state.coins<25){notify("Dekor için 25 🪙 gerekli");return}state.coins-=25;const P=decorPool(),k=P[Math.random()*P.length|0];state.decor.push({k,x:rand(.06,.94)});notify(decTxt(k)+" eklendi! Sürükleyerek yerleştir");renderUI();save(true);setTimeout(()=>editStart("deco"),250)}
function renameFish_old(){const f=state.fish.find(x=>x.id===selectedFish)||state.fish[0],v=$("nm").value.trim().slice(0,24);if(!f){notify("Önce bir balık al");return}if(!v){notify("Önce bir isim yaz ✏️");return}f.name=v;$("nm").value="";renderUI();save(true);notify("Balığın adı: "+v)}
function renderBook(){$("bookList").innerHTML='<p class="note" style="margin:0 0 8px">Bir türün Albino, Transparan ve Melanistik halini bulunca ödül alırsın 🎁 · Altın ve Glitch çok nadirdir</p>'+species.map(sp=>{const ok=state.discovered.includes(sp.id);if(spLocked(sp))return `<div class="fish-card locked"><div class="fish-icon"><i class="fi" style="background-image:var(--f-${sp.id});filter:brightness(0) invert(1) opacity(.3)"></i></div><div><strong>???</strong><small>Seviye ${spReq(sp)}${lokEk(spReq(sp))} açılır</small></div></div>`;return `<div class="fish-card"><div class="fish-icon"><i class="fi" style="background-image:var(--f-${sp.id});${ok?"":"filter:brightness(0) invert(1) opacity(.3)"}"></i></div><div><strong>${ok?sp.name:"???"}</strong><small>${ok?sp.price+" 🪙 · satış ~"+Math.round(sp.value*mkt(sp.id))+" 🪙 · büyüme "+fmtTime(growHours(sp)*3600)+"<br>🧠 "+traitTxt(sp.id):"Henüz keşfedilmedi"}${ok&&!mutOK(sp.id)?'<span class="mutrow"><b class="bkn">✨ Nadir varyasyonları yakında</b></span>':""}${ok&&mutOK(sp.id)?`<span class="mutrow">${["albino","transparent","melanistic","gold","glitch"].map(m=>`<i class="fi mb" title="${MUTS[m].name}" style="background-image:var(--m-${m}-${sp.id});${state.mutsFound.includes(m+"_"+sp.id)?"":"filter:brightness(0) invert(1) opacity(.22)"}"></i>`).join("")}<b class="bkn">${bookAll(sp.id)}/5</b></span>`:""}</small></div>${ok?bookBtn(sp):""}</div>`}).join("")}
try{$("critShop").onclick=e=>{const b=e.target.closest("[data-crit]");if(b){audio();buyCrit(b.dataset.crit);renderShop()}}}catch(e){}
$("props").onclick=e=>{const b=e.target.closest("[data-prop]");if(b)buyProp(b.dataset.prop)};$("shop").onclick=shopClick;$("inventory").addEventListener("change",e=>{const t=e.target;if(!t||!t.dataset)return;if(t.dataset.ffs){FFILT=t.value;sellArm=null;renderUI()}else if(t.dataset.fss){FSORT=t.value;renderUI()}});$("inventory").onclick=e=>{if(invClick(e))return;const b=e.target.closest("[data-gene],[data-move]");if(!b)return;if(0);else if(b.dataset.gene)geneTest(+b.dataset.gene);else moveFish(+b.dataset.move)};$("shopCount").textContent=species.length+" tür";
$("orders").onclick=e=>{const b=e.target.closest("[data-order]"),x=e.target.closest("[data-orderx]");if(b){if(deliverOrder(+b.dataset.order))renderQuests()}else if(x)skipOrder(+x.dataset.orderx)};$("quests").onclick=e=>{const b=e.target.closest("[data-quest]");if(b)claimQuest(b.dataset.quest)};$("achList").onclick=e=>{const b=e.target.closest("[data-ach]");if(b)claimAch(b.dataset.ach)};
$("tankList").onclick=e=>{const b=e.target.closest("button");if(!b)return;if(b.dataset.unlock)unlockTank(b.dataset.unlock);else if(b.dataset.go){switchTank(b.dataset.go);closeSheet()}};$("inventory").addEventListener("change",e=>{const s=e.target.closest("[data-mv]");if(s&&s.value)moveFish(+s.dataset.mv,s.value)});$("night").onclick=()=>{audio();toggleNight()};$("nightBtn").onclick=()=>{audio();toggleNight()};$("fsBtn").onclick=()=>{const d=document,e=d.documentElement,on=d.fullscreenElement||d.webkitFullscreenElement;try{if(on){(d.exitFullscreen||d.webkitExitFullscreen).call(d)}else{const f=e.requestFullscreen||e.webkitRequestFullscreen;if(!f){notify("Bu cihaz tam ekrana izin vermiyor. Ana ekrana ekleyebilirsin.");return}const p=f.call(e);if(p&&p.catch)p.catch(()=>notify("Bu pencere tam ekrana izin vermiyor. Ana ekrana ekleyebilirsin."))}}catch(x){notify("Bu pencere tam ekrana izin vermiyor. Ana ekrana ekleyebilirsin.")}};$("lvOk").onclick=closeLevelUp;$("lvl").addEventListener("pointerdown",e=>{if(e.target.id==="lvl")closeLevelUp()});$("breed").addEventListener("click",breed);$("pa").addEventListener("change",fillParents);$("pb").addEventListener("change",fillParents);$("upgradeFilter").addEventListener("click",()=>upgrade("filter"));$("upgradeFeeder").addEventListener("click",()=>upgrade("feeder"));$("decorate").addEventListener("click",addDecor);
function initScenery(){for(let i=0;i<30;i++)bubbles.push({x:rand(0,W),y:rand(0,H),r:rand(1.5,5),speed:rand(8,27),drift:rand(-7,7),alpha:rand(.12,.38),phase:rand(0,7)})}
function curWater(){return VISIT?tw(VISIT.tank):tw(state.tank)}
let bgKey="";const RIVBG={};function rivBg(n){const k=n?"nightR":"reefR";return RIVBG[k]||(RIVBG[k]=Object.assign(new Image(),{src:asset(k)}))}
function bgImg(n){const dp=curWater()==="deep",rv=curWater()==="river",fr=curWater()==="fresh",k=dp?"Dn":(rv?"R":fr?"F":"S")+(n?"n":"d");if(k!==bgKey){bgKey=k;fillSet(k);}const im=dp?deepBg:rv?rivBg(n):fr?(n?nightF:reefF):(n?nightBg:reefBg);if(im.complete&&im.naturalWidth)ctx.drawImage(im,0,0,W,H);else{ctx.fillStyle=fr?(n?"#052a2c":"#0a8a90"):(n?"#061a40":"#087ba3");ctx.fillRect(0,0,W,H)}}
function dnP(){if(!DN)return 1;const p=(performance.now()-DN.t0)/1600;if(p>=1){DN=null;return 1}return p}
function drawDN(){if(!DN)return;const p=Math.min(1,(performance.now()-DN.t0)/1600),toN=state.night;
const sweep=Math.sin(p*Math.PI);ctx.save();const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,toN?"rgba(20,24,80,"+(.35*sweep)+")":"rgba(255,214,140,"+(.35*sweep)+")");g.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
ctx.textAlign="center";ctx.font="64px serif";const ox=W*.78,dn=(k,yy)=>{const im=eimg(k);if(im)ctx.drawImage(im,ox-40,yy-62,80,80);else ctx.fillText(k,ox,yy)};ctx.globalAlpha=1-p;dn(toN?"☀️":"🌙",H*.12+p*H*.18);ctx.globalAlpha=p;dn(toN?"🌙":"☀️",H*.3-p*H*.18);
if(toN){ctx.fillStyle="#fff";for(let i=0;i<18;i++){const a=p*(.4+.6*Math.abs(Math.sin(i*7.3+performance.now()/400)));ctx.globalAlpha=a*.8;ctx.beginPath();ctx.arc((i*97.3)%W,(i*53.1)%(H*.3)+20,1.2+(i%3)*.6,0,7);ctx.fill()}}ctx.restore()}
let bgA=null,bgB=null,bgCur="",bgDom=null,bgTm=0;
const BG_V={Sd:"reef",Sn:"night",Fd:"reefF",Fn:"nightF",Dn:"deep",Rd:"reefR",Rn:"nightR"},BG_C={Sd:"#087ba3",Sn:"#061a40",Fd:"#0a8a90",Fn:"#052a2c",Dn:"#040b24",Rd:"#2c6b3c",Rn:"#06171f"};
function bgInit(){if(bgDom!==null)return bgDom;try{bgA=document.createElement("div");bgB=document.createElement("div");bgA.className=bgB.className="cvl";const st="position:absolute;background-size:cover;background-position:center 72%;pointer-events:none";bgA.style.cssText=st;bgB.style.cssText=st+";opacity:0";canvas.before(bgA);canvas.before(bgB);bgDom=!!(canvas.before&&bgA.style)}catch(e){bgDom=false}return bgDom}
function bgSet(el,k){el.style.backgroundColor=BG_C[k];el.style.backgroundImage="var(--asset-"+BG_V[k]+")"}
const FILLU={};function fillSet(k){const el=$("bgfill");if(!el)return;if(FILLU[k]){el.style.backgroundImage='url("'+FILLU[k]+'")';return}const im=new Image();im.onload=()=>{try{const cw=48,ch=Math.max(1,Math.round(im.naturalHeight*48/im.naturalWidth)),c=document.createElement("canvas");c.width=cw;c.height=ch;const x=c.getContext("2d",{willReadFrequently:true});try{x.imageSmoothingQuality="high"}catch(e){}x.drawImage(im,0,0,cw,ch);const D=x.getImageData(0,0,cw,ch),d=D.data;for(let i=0;i<d.length;i+=4){const r=d[i],g=d[i+1],b=d[i+2],l=.299*r+.587*g+.114*b;d[i]=(l+(r-l)*1.1)*.8;d[i+1]=(l+(g-l)*1.1)*.8;d[i+2]=(l+(b-l)*1.1)*.8}x.putImageData(D,0,0);FILLU[k]=c.toDataURL("image/png");if(bgCur===k||!bgDom)el.style.backgroundImage='url("'+FILLU[k]+'")'}catch(e){}};im.src=asset(BG_V[k])}
function bgDomStep(){const cw=curWater(),k=cw==="deep"?"Dn":(cw==="river"?"R":cw==="fresh"?"F":"S")+(state.night?"n":"d");if(k===bgCur)return;const prev=bgCur;bgCur=k;fillSet(k);
clearTimeout(bgTm);if(prev&&prev[0]===k[0]&&DN){bgSet(bgB,k);bgB.style.transition="none";bgB.style.opacity="0";void bgB.offsetWidth;bgB.style.transition="opacity 1.6s ease-in-out";bgB.style.opacity="1";bgTm=setTimeout(()=>{bgSet(bgA,k);bgB.style.transition="none";bgB.style.opacity="0"},1700)}else{bgSet(bgA,k);bgB.style.transition="none";bgB.style.opacity="0"}}
function drawBackground(){
if(bgInit()){dnP();bgDomStep();const bgo=!!(state.admOff||{}).bg;if(bgo!==bgOffC){bgOffC=bgo;bgA.style.display=bgB.style.display=bgo?"none":""}const tf=((VISIT?"":themeF())+" "+bgSoftF()).trim();if(tf!==curTF){curTF=tf;bgA.style.filter=tf;bgB.style.filter=tf;vigSync()}ctx.clearRect(0,0,W,H)}else{const p=dnP();if(DN){bgImg(DN.from);const e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;ctx.globalAlpha=e;bgImg(state.night);ctx.globalAlpha=1}else bgImg(state.night)}
const BS=bubSpr();bubbles.forEach(b=>{const r=b.r*1.15,wb=1+.06*Math.sin(b.y*.08+b.phase);ctx.globalAlpha=Math.min(1,b.alpha*1.9);ctx.drawImage(BS,b.x-r*wb,b.y-r/wb,r*2*wb,r*2/wb)});ctx.globalAlpha=1
}
// yüzme animasyonu ayarları (tek yerden): n=dilim, amp=kuyruk genliği, wave=gövdedeki dalga boyu (rad), rest=dururken genlik, roll=gövde sallanması
// sürüm 126: kıvrılma genliği gövde kalınlığıyla sınırlı (uzun ince balıklar ip gibi kıvrılmasın), yüzerken gövde basıklaşmaz
const SWIM={amp:.06,rest:.016,wave:3.2,roll:.03,turn:.07,stretch:.035};
// tür profili: [genlik, vuruş hızı, kuyruğa yığılma, gövde sallanması, dalga boyu]
const SWP={koi:[.6,.6,1.8,.6,1.1],arowana:[.7,.8,1.8,.7,1.1],boxfish:[.55,1,2,.6,1.1],napo:[.5,.65,2,.5,1.2],neon:[1,1.5,1.6,1,1],guppy:[1,1.35,1.6,1,1],clown:[1.05,1.2,1.7,1,1],ytang:[.85,1,1.8,.8,1.1],btang:[.85,1,1.8,.8,1.1],gold:[.95,.7,1.4,.9,.9],betta:[1.15,.6,1.2,1,.8],angel:[.45,.6,2,.5,1.2],emp:[.45,.6,2,.5,1.2],idol:[.45,.65,2,.5,1.2],discus:[.4,.55,2,.4,1.2],copper:[.5,.7,2,.5,1.2],lion:[.55,.5,1.8,.5,1.1],trigger:[.55,1,2,.6,1.1],mandarin:[.75,1.4,1.7,.9,1],cichlid:[.9,1,1.7,.9,1],lantern:[1,1.5,1.6,1,1],hatchet:[.7,1.2,1.8,.7,1],angler:[.55,.55,1.9,.5,1.1],viper:[.85,.9,1.4,.6,1.3],oar:[1.1,.55,.55,.25,2.2],dragon:[1.05,.55,.7,.3,2.1],tripod:[.55,.8,1.8,.4,1.1],lancet:[.5,1.05,1.9,.3,1.25],piranha:[1,1.2,1.7,1,1],peacock:[.9,1,1.7,.9,1],bichir:[.9,.9,1.4,.6,1.3],eel:[1.1,.55,.6,.25,2.2],mahseer:[.7,.8,1.8,.7,1.1],gar:[.5,.6,1.9,.35,1.25],goliath:[.7,.8,1.8,.7,1.1],mekong:[.5,.65,2,.5,1.2],sturgeon:[.6,.6,1.8,.5,1.15],arapaima:[.6,.6,1.9,.5,1.15]};
// büyük balık yavaş ve geniş, küçük balık hızlı ve sık vurur; her balığa küçük bireysel fark
function swimFq(f){const p=SWP[f.type]||SWP.clown,z=Math.max(.6,Math.min(1.6,Math.pow(70/fishW(f),.45)));return p[1]*z*(1+.12*Math.sin((f.phase||0)*13))}
const GLS=new WeakMap(),glTC=new WeakMap();
function glTint(src){let o=glTC.get(src);if(o!==undefined)return o;o=null;try{const iw=src.naturalWidth||src.width,ih=src.naturalHeight||src.height,mk=c=>{const cv=document.createElement("canvas");cv.width=iw;cv.height=ih;const x=cv.getContext("2d");x.drawImage(src,0,0);x.globalCompositeOperation="source-atop";x.fillStyle=c;x.fillRect(0,0,iw,ih);return cv};const c=mk("#00f0ff"),m=mk("#ff1fd2"),d=Math.max(2,Math.round(iw*.018)),fr=document.createElement("canvas");fr.width=iw+2*d;fr.height=ih;const x=fr.getContext("2d");x.globalAlpha=.85;x.drawImage(c,0,0);x.globalCompositeOperation="lighter";x.drawImage(m,2*d,0);x.globalCompositeOperation="destination-out";x.globalAlpha=1;x.drawImage(src,d,0);o={c,m,fr,d}}catch(e){o=null}glTC.set(src,o);return o}
function glRest(T2,src){if(T2.r!==undefined)return T2.r;let r=null;try{const fr=T2.fr,c=document.createElement("canvas");c.width=fr.width;c.height=fr.height;const x=c.getContext("2d");x.globalAlpha=.7;x.drawImage(fr,0,0);x.globalAlpha=1;x.drawImage(src,T2.d,0);r=c}catch(e){r=null}T2.r=r;return r}
function glitchSt(f,t,w){let o=GLS.get(f);if(!o){o={nb:t+rand(.4,2.5),be:0,bf:0};GLS.set(f,o)}if(t>o.nb){o.b0=t;o.be=t+rand(.12,.45);o.nb=o.be+rand(1,3.2);const r=Math.random();o.tel=r<.35?[rand(-1,1)*w*.4,rand(-1,1)*w*.15]:null;o.hide=r>.86;o.big=Math.random()<.4}
const b=t<o.be;if(b&&t>o.bf){o.bf=t+.05;o.sp=rand(4,o.big?16:9);o.bands=[];const n=6+(Math.random()*5|0);for(let i=0;i<n;i++)o.bands.push(Math.random()<.55?rand(-1,1)*w*(o.big?.22:.1):0);o.bands.cut=Math.random()<.5}
if(!state.lowGfx&&!VISIT){const P=o.px||(o.px=[]);for(let i=P.length-1;i>=0;i--)if(t-P[i].t0>P[i].life)P.splice(i,1);const dirS=(f.fs||f.dir||1)>=0?1:-1,tx=f.x*W-dirS*w*.45,ty=f.y*H;const n=b?3:(Math.random()<.12?1:0);for(let i=0;i<n&&P.length<24;i++)P.push({t0:t,x:tx+rand(-6,6),y:ty+rand(-w*.18,w*.18),vx:-dirS*rand(10,50),vy:rand(-10,10),life:rand(.4,1.2),s:rand(2,b?7:4),c:["#00f6ff","#ff2bd6","#7dff4f"][Math.random()*3|0]})}else if(o.px)o.px.length=0
return{b,sp:b?o.sp:1.4+Math.abs(Math.sin(t*17+(f.phase||0)))*1.6,bands:b?o.bands:null,tel:b?o.tel:null,hide:b&&o.hide&&t-o.b0<.07}}
function glPx(f,t){const o=GLS.get(f),P=o&&o.px;if(!P||!P.length)return;ctx.save();for(const p of P){const a=t-p.t0,l=p.life-a;if(l<=0)continue;ctx.globalAlpha=Math.min(1,l*2)*(Math.random()<.2?.25:1);ctx.fillStyle=p.c;ctx.fillRect(Math.round(p.x+p.vx*a),Math.round(p.y+p.vy*a),p.s,p.s*(Math.random()<.3?.4:1))}ctx.restore()}
const lodC=new Map();function lodImg(im,wd){const nw=im.naturalWidth;let L=nw;for(const l of [96,144,208,288]){if(l>=wd*.9){L=l;break}}if(L>=nw)return im;let m=lodC.get(im);if(!m){m={};lodC.set(im,m)}let c=m[L];if(c!==undefined)return c||im;c=null;try{const cv=document.createElement("canvas");cv.width=L;cv.height=Math.max(1,Math.round(im.naturalHeight*L/nw));const x=cv.getContext("2d");try{x.imageSmoothingQuality="high"}catch(e){}x.drawImage(im,0,0,cv.width,cv.height);c=cv}catch(e){c=null}m[L]=c;return c||im}
const haloC={};
function halo(im,key,color,blur){let c=haloC[key];if(c!==undefined)return c;c=null;try{const pad=Math.ceil(blur*1.8),cv=document.createElement("canvas");const iw0=im.naturalWidth||im.width,ih0=im.naturalHeight||im.height;cv.width=iw0+pad*2;cv.height=ih0+pad*2;const x=cv.getContext("2d"),off=cv.width+60;x.shadowColor=color;x.shadowBlur=blur;x.shadowOffsetX=off;x.drawImage(im,pad-off,pad);c={cv,pad}}catch(e){c=null}haloC[key]=c;return c}

function flushGfx(why){try{lodC.clear();for(const o of [tintC,haloC,hexC,PLC])for(const k in o)delete o[k];propL=null;propKey="";dirtK=-1;bgCache=null;obsC=null;obsKey="";causT=null;causP=null}catch(e){}}
function gfxProbe(c){try{if(c&&c.getContext&&c.width>2){const x=c.getContext("2d"),d=x.getImageData(0,0,c.width,c.height).data;for(let i=3,n=0;i<d.length&&n<4000;i+=4*Math.max(1,(d.length>>2)/4000|0),n++)if(d[i]>200){c._pi=i>>2;break}}}catch(e){}}
let gfxChk=0,gfxRR=0,gfxS=null;function gfxList(){const L=[];for(const m of lodC.values())for(const k in m)if(m[k])L.push(m[k]);if(!gfxS){try{gfxS=document.createElement("canvas");gfxS.width=gfxS.height=96;const x=gfxS.getContext("2d");x.fillStyle="#123";x.fillRect(0,0,96,96);gfxS._pi=96*48+48}catch(e){gfxS=null}}if(gfxS)L.push(gfxS);return L}
function gfxWatch(now){if(now-gfxChk<12000)return;gfxChk=now;try{const L=gfxList();if(Object.keys(PLC).length>90||Object.keys(tintC).length>70){flushGfx("mem");return}if(!L.length)return;const c=L[gfxRR++%L.length];if(c._pi===undefined){gfxProbe(c);if(c._pi===undefined)c._pi=-1;return}if(c._pi<0)return;const a=c.getContext("2d").getImageData(c._pi%c.width,(c._pi/c.width)|0,1,1).data[3];if(a<10){if(c===gfxS)gfxS=null;flushGfx("lost")}}catch(e){flushGfx("err")}}
document.addEventListener("visibilitychange",()=>{if(!document.hidden)flushGfx("vis")});addEventListener("pageshow",()=>flushGfx("show"));try{document.querySelectorAll("canvas").forEach(c=>c.addEventListener("contextrestored",()=>flushGfx("ctx")))}catch(e){}
function drawFish(f,t){
const s=getSpecies(f.type),mu=MUTS[f.mutation]&&f.mutation!=="normal"?f.mutation:null,mi=mu&&(mutImgs[mu+"_"+s.id]||(mu==="glitch"&&MUT_IMG.glitch[s.id]?(mutImgs[mu+"_"+s.id]=Object.assign(new Image(),{src:""+B64(MUT_IMG.glitch[s.id])})):null)),im0=mi&&mi.complete&&mi.naturalWidth?mi:fishImgs[s.id],hi=im0===mi&&hybOf(f)?hybImg(f,s.id):null,im1=hi||im0,mim=!!mi&&(im1===mi||im1===hi),vk=mim?mu:"normal",im=f.type==="lancet"?lancetIm(f,im1,vk):im1,tpk=f.type==="tripod"?(f.pk||0):0;if(!im.complete||!im.naturalWidth)return;
const size=fsz(f),vf=mim&&im===im1?(MUTW[mu+"_"+s.id]||1):1,w=fishW(f),h=w*im.naturalHeight/im.naturalWidth,sn=f.sn||0,tp=f.tp||0,fs=f.fs||f.dir||1,turn=1-Math.min(1,Math.abs(fs));
const GX=mu==='glitch'?glitchSt(f,t,w):null;if(GX)glPx(f,t);if(GX&&GX.hide)return;
ctx.save();ctx.translate(f.x*W,f.y*H+Math.sin(t*1.4+f.phase)*(2+3*(1-sn))*(1-tpk));if(GX&&GX.tel)ctx.translate(GX.tel[0],GX.tel[1]);
const gk=f.gulp>0?Math.sin(Math.PI*(1-f.gulp/.24)):0;ctx.scale((fs>=0?Math.max(.4,fs):Math.min(-.4,fs))*(1+SWIM.stretch*.4*sn)*(1-.07*gk),(1+SWIM.turn*turn)*(1+.06*gk));
ctx.rotate((f.ang||0)+Math.sin(tp+1.9)*(SWIM.roll*.35+SWIM.roll*sn)*(SWP[f.type]||SWP.clown)[3]);
// sürüm 124: derin okyanus balıklarına eklenen mavi hale kaldırıldı; parlak (Nadir) balıklar her tankta eskisi gibi altın haleyle görünür
const M=mu?MUTS[mu]:null,hc=state.lowGfx||mu==="glitch"?null:M?(hybOf(f)?{c:MUTS[f.hyb].glow,b:M.blur,k:"h"+mu+f.hyb}:{c:M.glow,b:M.blur,k:mu}):(f.rarity==="Nadir"?{c:"#ffe46b",b:14,k:"rare"}:null);
if(hc&&tpk<.5&&LQ<2){const hs=lodImg(im,w*K*.6),hw=hs.naturalWidth||hs.width,H0=halo(hs,hc.k+"_"+s.id+"_"+hw,hc.c,hc.b*1.6*hw/190);if(H0){const k=w/hw,pu=(.75+.25*Math.sin(t*2+f.phase))*(mu==="transparent"?.45:1);ctx.globalAlpha=pu;ctx.drawImage(H0.cv,-w/2-H0.pad*k,-h/2-H0.pad*k,H0.cv.width*k,H0.cv.height*k);ctx.globalAlpha=1}}
const GL=mu==="glitch",src0=lodImg(im,w*K),LT=litOn(),src=GL?src0:curWater()==="deep"?deepTex(src0):LT?litTex(src0):src0,N=s.sl?(state.lowGfx?10:s.sl):state.lowGfx?(w<90?4:5):(w<70?6:w<110?8:10),iw=src.naturalWidth||src.width,ih=src.naturalHeight||src.height,sw=iw/N,dw=w/N,P=SWP[f.type]||SWP.clown,amp=Math.min(w*(SWIM.rest+SWIM.amp*sn)*P[0]*Math.pow(90/w,.15),h*(.2+.06*sn)),ov=1.2;
const Ycf=fx=>{const u=1-fx;return Math.sin(tp-u*SWIM.wave*P[4])*amp*Math.pow(u,P[2])};
const drawS=(img,ox,oy,ww,live)=>bendDraw(f,img,ox,oy,ww||w,h,N,tp,amp,P,live);
if(GX){const T2=state.lowGfx?null:glTint(src),R=T2&&!GX.b?glRest(T2,src):null;if(T2&&GX.b){ctx.globalAlpha=.95;ctx.drawImage(T2.c,-w/2-GX.sp,-h/2+rand(-2,2),w,h);ctx.drawImage(T2.m,-w/2+GX.sp,-h/2+rand(-2,2),w,h);ctx.globalAlpha=1}
if(GX.bands){const n=GX.bands.length,bh=h/n;for(let i=0;i<n;i++){const off=GX.bands[i];if(GX.bands.cut&&i%3===1&&off)continue;ctx.drawImage(src,0,ih*i/n,iw,ih/n,-w/2+off,-h/2+bh*i,w,bh+.6)}if(!state.lowGfx){ctx.save();ctx.globalCompositeOperation="lighter";for(let i=0;i<3;i++){ctx.globalAlpha=rand(.15,.45);ctx.fillStyle=["#00f6ff","#ff2bd6","#7dff4f"][i];ctx.fillRect(rand(-w*.6,w*.3),rand(-h*.5,h*.45),rand(w*.15,w*.6),rand(1.5,4))}ctx.restore()}}
else if(R)drawS(R,0,0,w*R.width/iw);else drawS(src,0,0);
if(!state.lowGfx&&Math.sin(t*9+(f.phase||0)*5)>.6){ctx.save();ctx.globalCompositeOperation="lighter";ctx.globalAlpha=.18;ctx.fillStyle="#00f6ff";const yy=((t*60+(f.phase||0)*40)%h)-h/2;ctx.fillRect(-w/2,yy,w,2);ctx.restore()}}
else{const jo=NOJAW[f.type]?0:jawOpen(f);if(tpk>0)tripodDraw(f,src,vk,w,h,tpk,drawS);else if(jo>.02)drawJaw(f,src,w,h,Ycf,drawS,jo);else drawS(src,0,0);
 if(!state.lowGfx&&mim&&SHEEN[mu]){ctx.save();ctx.globalCompositeOperation="lighter";ctx.globalAlpha=SHEEN[mu].a;drawS(sheenTex(src,mu,t,(f.phase||0)*1.7,f),0,0,0,1);ctx.restore()}}
if(mu==="gold"&&!state.lowGfx&&!(mim)){const sh=(t*.45+f.phase*.13)%1.6;if(sh<1){ctx.save();ctx.globalCompositeOperation="lighter";ctx.globalAlpha=.32*Math.sin(sh*Math.PI);const gx=-w/2+w*sh,gr=ctx.createLinearGradient(gx-w*.18,0,gx+w*.18,0);gr.addColorStop(0,"rgba(255,240,170,0)");gr.addColorStop(.5,"rgba(255,248,210,1)");gr.addColorStop(1,"rgba(255,240,170,0)");ctx.fillStyle=gr;ctx.beginPath();ctx.ellipse(gx,0,w*.16,h*.36,-.5,0,7);ctx.fill();ctx.restore()}}
if(mu&&!state.lowGfx){ctx.shadowBlur=0;const k=mu==="gold"?5:mu==="melanistic"?3:mu==="transparent"?2:1;for(let i=0;i<k;i++){const a=Math.sin(t*1.6+f.phase*3+i*2.1);if(a<.55)continue;const px=Math.sin(f.phase*7+i*4.3)*w*.32,py=Math.cos(f.phase*5+i*3.7)*h*.22,r=(a-.55)*w*.09;ctx.globalAlpha=(a-.55)*2.2;ctx.fillStyle=mu==="gold"?"#fff6c8":mu==="melanistic"?"#c9d6ff":mu==="transparent"?"#e8fbff":"#fff0f6";ctx.beginPath();ctx.moveTo(px,py-r);ctx.lineTo(px+r*.25,py);ctx.lineTo(px,py+r);ctx.lineTo(px-r*.25,py);ctx.closePath();ctx.moveTo(px-r,py);ctx.lineTo(px,py+r*.25);ctx.lineTo(px+r,py);ctx.lineTo(px,py-r*.25);ctx.fill()}ctx.globalAlpha=1}
{const MO=mouthOf(f),mt=ctx.getTransform(),ki=1/K,lx=-w/2+MO[0]*w,ly=-h/2+MO[1]*h+Ycf(MO[0]),gx=-w/2+(MO[0]-.3)*w,gy=-h/2+MO[1]*h+Ycf(MO[0]-.3);f._mx=(mt.a*lx+mt.c*ly+mt.e)*ki;f._my=(mt.b*lx+mt.d*ly+mt.f)*ki;f._gx=(mt.a*gx+mt.c*gy+mt.e)*ki;f._gy=(mt.b*gx+mt.d*gy+mt.f)*ki}
if(PHOT[f.type])phCollect(f,w,h,Ycf,t,im,mu,N);if(curWater()==="deep"&&state.fish.length<=8)flushFishLights();
ctx.restore()
}
// ===== sürüm 125: Mızrak Balığı yelkeni ve Üç Ayaklı Balık duruşu
// Yelken gövdeyle tek resim olarak birleştirilir (5 açıklık seviyesi), böylece gövde kıvrıldıkça yelken de onunla kıvrılır.
// Yatarken yelkenin ışınları kuyruğa doğru eğilir. Resim üstte ve altta eşit boşlukla genişletilir, gövde ortada kalır.
const LSAILG=Object.assign({normal:{x0:.3,x1:.73,y0:.485,y1:.35}},{"albino":{"x0":0.3,"x1":0.73,"y0":0.45,"y1":0.322},"transparent":{"x0":0.3,"x1":0.73,"y0":0.445,"y1":0.346},"melanistic":{"x0":0.3,"x1":0.73,"y0":0.475,"y1":0.336},"gold":{"x0":0.3,"x1":0.73,"y0":0.435,"y1":0.27},"glitch":{"x0":0.3,"x1":0.73,"y0":0.429,"y1":0.32}}),LANC=new WeakMap();
function lancetIm(f,body,vk){const sail=altImg("sail",vk);if(!sail||!body.naturalWidth)return body;const q=Math.round(Math.max(0,Math.min(1,f.sail==null?1:f.sail))*4)/4;let m=LANC.get(body);if(!m){m={};LANC.set(body,m)}let o=m[q];if(o!==undefined)return o&&o.complete&&o.naturalWidth?o:(m._last||body);
 try{const LSAIL=LSAILG[vk]||LSAILG.normal,iw=body.naturalWidth,ih=body.naturalHeight,sw=(LSAIL.x1-LSAIL.x0)*iw,sh=sw*sail.naturalHeight/sail.naturalWidth,E=Math.ceil(Math.max(0,sh+6-LSAIL.y1*ih)),c=document.createElement("canvas");c.width=iw;c.height=ih+2*E;const x=c.getContext("2d");
  const ax=LSAIL.x0*iw,ay=E+LSAIL.y0*ih,an=Math.atan2((LSAIL.y1-LSAIL.y0)*ih,sw),hh=sh*(.14+.86*q);x.save();x.translate(ax,ay);x.rotate(an);x.transform(1,0,(1-q)*.9,1,0,0);x.drawImage(sail,0,-hh+3,sw/Math.cos(an),hh);x.restore();x.drawImage(body,0,E);
  o=new Image();o.onload=()=>{m._last=o};o.src=c.toDataURL("image/png")}catch(e){o=null}m[q]=o;return m._last||body}
// Üç Ayaklı Balık: yüzme pozu ile duruş pozu arasında yumuşak geçiş; duruş pozu kıvrılmaz (ayaklar kumda sabit)
// her biçimin kendi ölçüsü: ar = duruş resmi boy/en, ay = duruşta gövde ortası, by = yüzerken gövde ortası
const TRIPG={"albino":{"by":0.512,"ar":0.401,"ay":0.361},"transparent":{"by":0.539,"ar":0.441,"ay":0.4},"melanistic":{"by":0.516,"ar":0.428,"ay":0.369},"gold":{"by":0.537,"ar":0.427,"ay":0.355},"glitch":{"by":0.557,"ar":0.429,"ay":0.323},"normal":{"by":0.543,"ay":0.274,"ar":0.91}};function tripG(vk){return TRIPG[vk]||TRIPG.normal}
function tripodDraw(f,src,vk,w,h,k,drawS){if(k<1){ctx.globalAlpha=1-k;drawS(src,0,0);ctx.globalAlpha=1}const st=altImg("tripod",vk);if(!st)return;const T=tripG(vk),s0=lodImg(st,w*K),s1=curWater()==="deep"?deepTex(s0):s0,hS=w*st.naturalHeight/st.naturalWidth,top=(T.by-.5)*h-T.ay*hS;ctx.globalAlpha=k;ctx.drawImage(s1,-w/2,top,w,hS);ctx.globalAlpha=1}
function tripodPerchY(f,fw){const m=mutOf(f),mi=m!=="normal"&&mutImgs[m+"_tripod"],sw=mi&&mi.naturalWidth?mi:fishImgs.tripod,vk=mi&&mi.naturalWidth?m:"normal",T=tripG(vk),h=fw*(sw&&sw.naturalWidth?sw.naturalHeight/sw.naturalWidth:.3);return FLOOR+18-(1-T.ay)*fw*T.ar-(T.by-.5)*h}
// ===== sürüm 131: Kadim Nehir — hava soluyan balıklar yüzeye çıkar, elektrikli yılan balığı boşalım yapar, avcılar küçük balıkları kovalar, pembe yunus arka planda geçer
const RIVB={piranha:1,peacock:1,bichir:1,eel:1,gar:1,goliath:1,arapaima:1},AIRB={arapaima:[28,55],gar:[45,90],bichir:[50,100]};let RFX=[];
function riverStep(f,h,food,fw,fh){const x=f.x*W,y=f.y*H,A=AIRB[f.type];
 if(A&&!food&&!isSleepy(f)&&!f.sick){if(f.airT==null)f.airT=simT+rand(8,A[0]);
  if(f.act!=="air"&&simT>f.airT){f.act="air";f.rest=false;f.tt=12;f.ax=Math.min(BX1-fw*.3,Math.max(BX0+fw*.3,x+(f.dir||1)*rand(40,120)))}
  if(f.act==="air"){f.tx=f.ax;f.ty=SURF+fh*.1;f.tt=Math.max(f.tt,1);if(y>SURF+fh*.9){const vu=-(PH[f.type]||PH.clown)[0]*.95;f.vy+=(vu-f.vy)*Math.min(1,h*2.5)}if(y<SURF+fh*.6){f.act="";f.airT=simT+rand(A[0],A[1]);f.tt=0;f.vy=Math.max(f.vy,22);const mx=x+(f.dir||1)*fw*.42;for(let i=0;i<3;i++)particles.push({x:mx+rand(-5,5),y:SURF+1,vx:0,vy:0,life:.9+i*.35,l0:.9+i*.35,type:"ring"});f.jawT=simT;f.jawA=.8;f.jawH=.25;sfx("bubble");Q("rair")}}}
 else if(f.act==="air"&&food)f.act="";
 if(f.type==="piranha"&&food&&!(f.burst>0)&&Math.random()<h*2.5)f.burst=.22;
 if((f.type==="peacock"||f.type==="goliath")&&!food&&!isSleepy(f)&&simT>(f.chCd||0)&&Math.random()<h*.05){let best=null,bd=260;for(const o of state.fish){if(o===f||o.type===f.type||fishW(o)>fw*.55)continue;const d=Math.hypot((o.x-f.x)*W,(o.y-f.y)*H);if(d<bd){bd=d;best=o}}f.chCd=simT+(best?rand(18,34):6);if(best){f.chase=best;f.chT=simT+1.4;f.burst=.3;best.flee=f;best.fleeT=simT+1.7}}

 if(f.type==="eel"&&!isSleepy(f)&&!f.sick){if(f.zapT==null)f.zapT=simT+rand(12,30);if(simT>f.zapT){f.zapT=simT+rand(25,50);RFX.push({f,t0:simT,sd:Math.random()*1e3});sfx("crash");Q("rzap");if(navigator.vibrate&&!state.muted)try{navigator.vibrate(30)}catch(e){}
  for(const o of state.fish){if(o===f)continue;const d=Math.hypot(o.x*W-x,o.y*H-y);if(d<260&&fishW(o)<fw*.8){o.flee={x:f.x,y:f.y};o.fleeT=simT+1.8;o.burst=.3}}}}}
// elektrik boşalımı: kısa titrek parlama ve gövde boyunca kırık ışık çizgileri
function riverFx(t,dt){if(!RFX.length)return;RFX=RFX.filter(z=>simT-z.t0<.9&&state.fish.includes(z.f));ctx.save();ctx.globalCompositeOperation="lighter";
 for(const z of RFX){const u=(simT-z.t0)/.9,fl=(u<.05?u/.05:1-u*.85)*(.65+.35*Math.sin(simT*70+z.sd)),f=z.f,fw=fishW(f),fh=fishH(f),x=f.x*W,y=f.y*H,d=f.fs||f.dir||1;if(fl<=0)continue;
  ctx.globalAlpha=Math.max(0,fl)*.2;ctx.fillStyle="#9fe8ff";ctx.fillRect(0,0,W,H);
  const G=glowSpr([150,225,255]),R=fw*1.25;ctx.globalAlpha=Math.max(0,fl)*.8;ctx.drawImage(G,x-R,y-R*.55,R*2,R*1.1);
  let sd=z.sd+Math.floor(simT*30);const rnd=()=>{sd=(sd*9301+49297)%233280;return sd/233280};
  for(let b=0;b<5;b++){ctx.beginPath();let px=x-d*fw*.55,py=y+(rnd()-.5)*fh*.8;ctx.moveTo(px,py);for(let k=1;k<=8;k++){px=x-d*fw*.55+d*fw*1.1*k/8;py=y+(rnd()-.5)*fh*2.2;ctx.lineTo(px,py)}
   ctx.strokeStyle="rgba(120,210,255,"+Math.min(1,fl*.6)+")";ctx.lineWidth=7;ctx.stroke();ctx.strokeStyle="rgba(240,252,255,"+Math.min(1,fl*1.3)+")";ctx.lineWidth=2.2;ctx.stroke()}}
 ctx.restore();ctx.globalAlpha=1}
// pembe Amazon yunusu: ara sıra uzaktan geçer; su bulanıklığı için soldurulur, kuyruğu yukarı aşağı dalgalanır
const DOLSRC="a/c2f25889edb8575b.webp";let DOL=null,DOLN=0,DOLI=null,DOLB=null;const DOLC={};
function dolImg(n){const k=n?"n":"d";if(DOLC[k])return DOLC[k];if(!DOLI){DOLI=new Image();DOLI.src=DOLSRC;return null}if(!DOLI.complete||!DOLI.naturalWidth)return null;
 try{const c=document.createElement("canvas");c.width=DOLI.naturalWidth;c.height=DOLI.naturalHeight;const x=c.getContext("2d");x.filter=n?"saturate(.6) brightness(.55)":"saturate(.95) brightness(.97)";x.drawImage(DOLI,0,0);x.filter="none";x.globalCompositeOperation="source-atop";x.fillStyle=n?"rgba(8,30,48,.45)":"rgba(40,110,80,.16)";x.fillRect(0,0,c.width,c.height);DOLC[k]=c}catch(e){DOLC[k]=DOLI}return DOLC[k]}
function drawRiverBack(t,dt){if(state.lowGfx||VISIT)return;if(!DOLN)DOLN=t+rand(18,30);
 if(!DOL&&t>DOLN){const L=W*rand(.5,.62)*(PORT?1.2:1),d=Math.random()<.5?1:-1;DOL={L,d,x:d>0?-L*.6:W+L*.6,y:rand(H*.24,H*.46),sp:(W+L*1.2)/rand(24,32),ph:rand(0,6)}}
 if(!DOL)return;const B=DOL;B.x+=B.d*B.sp*dt;if((B.d>0&&B.x>W+B.L*.65)||(B.d<0&&B.x<-B.L*.65)){DOL=null;DOLN=t+rand(50,100);return}
 const I=dolImg(nightAmt()>.5);if(!I)return;const iw=I.width,ih=I.height,N=16,sw=iw/N,pad=Math.round(ih*.12),ah=ih+pad*2;
 // dilimler önce ayrı tuvalde tam opak birleşir (yarı saydam üst üste binme çizgi bırakmasın), sonra tek seferde soluk çizilir
 if(!DOLB||DOLB.width!==iw||DOLB.height!==ah){DOLB=document.createElement("canvas");DOLB.width=iw;DOLB.height=ah}const bx=DOLB.getContext("2d");bx.clearRect(0,0,iw,ah);
 for(let i=0;i<N;i++){const u=(i+.5)/N,q=Math.max(0,.55-u)/.55,dy=q*q*.05*iw*Math.sin(t*1.6+B.ph-u*4);bx.drawImage(I,i*sw,0,sw+1,ih,Math.floor(i*sw),pad+dy,Math.ceil(sw)+1,ih)}
 ctx.save();ctx.translate(B.x,B.y+Math.sin(t*.5+B.ph)*10);ctx.scale(B.L*B.d/iw,B.L/iw);ctx.rotate(Math.sin(t*.35+B.ph)*.03);ctx.globalAlpha=.6;ctx.drawImage(DOLB,-iw/2,-ah/2);
 ctx.restore();ctx.globalAlpha=1}
function specStep(f,h,food,fw){
 if(f.type==="lancet"){const c=f.sail==null?1:f.sail,sn=f.sn||0,tg=sn<.35?1:sn>.6?0:c;f.sail=c+(tg-c)*Math.min(1,h*1.6);
  // ara sıra küçük bir balığın peşine kısa süre düşer (yemez)
  if(!food&&simT>(f.chCd||0)&&Math.random()<h*.06){let best=null,bd=280;for(const o of state.fish){if(o===f||o.type==="lancet"||fishW(o)>fw*.55)continue;const d=Math.hypot((o.x-f.x)*W,(o.y-f.y)*H);if(d<bd){bd=d;best=o}}f.chCd=simT+(best?rand(16,32):6);if(best){f.chase=best;f.chT=simT+1.6;f.burst=.35;best.flee=f;best.fleeT=simT+1.9}}
  return}
 if(f.type!=="tripod")return;const py=tripodPerchY(f,fw),y=f.y*H;
 const crowd=x=>state.fish.some(o=>o!==f&&o.type==="tripod"&&o.pm==="s"&&Math.abs((o.px==null?o.x:o.px)-x)*W<70);
 if(f.pm==null){f.pm=Math.random()<.75&&!crowd(f.x)?"s":"w";f.pt=rand(3,12);f.px=f.x;if(f.pm==="s"){f.y=py/H;f.pk=1;f.ly=py}}
 f.pt-=h;const nearFood=food&&Math.abs(food.x-f.x*W)<140&&food.y>py-170;
 if(f.pm==="s"){f.pk=Math.min(1,(f.pk||0)+h*2.4);f.x=f.px;if(f.ly==null)f.ly=y;f.ly+=(py-f.ly)*Math.min(1,h*5);f.y=f.ly/H;f.vx=f.vy=0;f.ang=(f.ang||0)*.9;
  if(f.pt<=0||nearFood){f.pm="w";f.pt=nearFood?rand(2,4):rand(4,9);f.burst=nearFood?.4:.15;f.vy=-40;f.vx=(nearFood?Math.sign(food.x-f.x*W):f.dir||1)*30;sandPuff(f.x*W,FLOOR+16,3)}}
 else{f.pk=Math.max(0,(f.pk||0)-h*4);if(f.pt<=0&&!food){f.tx=f.x*W+(f.dir||1)*20;f.ty=py;f.tt=Math.max(f.tt||0,.5);if(y>py-75&&!crowd(f.x)){f.ly=y;f.pm="s";f.px=f.x;f.pt=rand(10,26);sandPuff(f.x*W,FLOOR+16,4)}}}}
// ===== Kıvrılan balık çizimi (sürüm 114)
// Balık her karede doğrudan ekrana 8-10 şerit halinde çizilmiyor: kıvrılmış hali balığın kendi küçük tuvaline bir kez hazırlanıyor
// (şeritler tam piksel sınırlarında, üst üste binmeden birleşir; bu yüzden ara çizgiler oluşmaz), sonra ekrana tek parça konuyor.
// Kuyruk duruşu ve genliği çok küçük adımlara yuvarlanır; duruş değişmedikçe aynı çizim tekrar kullanılır.
const BND=new WeakMap();let BNDN=0,BNDB=9;
// sürüm 117: aynı balığın kıvrımı en fazla ~30 kez/sn yeniden hazırlanır (her karede değil); arada hazır çizim kullanılır
let BNDT=30;
function bendRec(f,img){let m=BND.get(f);if(!m){m=new Map();BND.set(f,m)}let r=m.get(img);if(!r){if(m.size>=(f.type==="lancet"?8:4)){for(const v of m.values())v.cv.width=v.cv.height=0;m.clear()}r={cv:document.createElement("canvas"),k:""};m.set(img,r)}return r}
function bendDraw(f,img,ox,oy,ww,h,N,tp,amp,P,live){const iw=img.naturalWidth||img.width,ih=img.naturalHeight||img.height;if(!iw||!ih)return;if((state.admOff||{}).bend){ctx.drawImage(img,-ww/2+ox,-h/2+oy,ww,h);return}
 const TAU=6.283185307179586,qp=Math.round(((tp%TAU)+TAU)%TAU/TAU*64)%64,tq=qp/64*TAU,qa=Math.round(amp/ww*512),aq=qa/512*ww,sy=ih/h,pad=Math.ceil(Math.abs(aq)*sy)+2,r=bendRec(f,img),key=live?"":N+"|"+qp+"|"+qa+"|"+iw+"|"+ih;
 const now=performance.now(),age=now-(r.t||0);let go=live?age>33:r.k!==key;if(go&&r.k){if(age<BNDT)go=false;else if(age<110){if(BNDB>0)BNDB--;else go=false}}
 if(go){r.t=now;const c=r.cv;if(c.width!==iw||c.height!==ih+2*pad){c.width=iw;c.height=ih+2*pad}const x=c.getContext("2d");x.setTransform(1,0,0,1,0,0);x.globalCompositeOperation="source-over";x.globalAlpha=1;x.clearRect(0,0,c.width,c.height);try{x.imageSmoothingQuality="high"}catch(e){}
  const Y=b=>{const u=1-b/N;return Math.sin(tq-u*SWIM.wave*P[4])*aq*Math.pow(u,P[2])*sy};let x0=0,y0=Y(0);
  for(let i=0;i<N;i++){const x1=i===N-1?iw:Math.round((i+1)*iw/N),y1=Y(i+1),cw=x1-x0;if(cw>0){x.setTransform(1,(y1-y0)/cw,0,1,x0,pad+y0);x.drawImage(img,x0,0,cw,ih,0,0,cw,ih)}x0=x1;y0=y1}
  r.k=key;BNDN++}
 if(!live)f._bk=r.k+"|"+(r.t||0);
 const ps=pad/sy;ctx.drawImage(r.cv,-ww/2+ox,-h/2+oy-ps,ww,h+2*ps)}
let selectedFish=null;
// ===== Derin okyanus ışık sistemi v2
// Biyolüminesans gerçek ışık organlarından (fotofor) gelir: noktalar balığın kendi resmindeki yerlerinden yanar ve balık kıvrıldıkça
// onunla birlikte hareket eder. Her türün kendine özgü bir yanma düzeni var. Noktalar karanlık örtünün ÜSTÜNE çizilir, bu yüzden
// karartılmaz; etraflarına küçük ve doğal bir parlama (bloom) yayılır. Işığın yakınında "deniz karı" görünür, hızlı yüzen
// balıkların ve dokunulan suyun arkasında plankton kıvılcımları çakar.
const PHOT={lantern:[[.267,.417,.004],[.192,.51,.008],[.227,.514,.008],[.264,.519,.007],[.3,.522,.007],[.34,.529,.008],[.378,.537,.008],[.419,.541,.007],[.46,.545,.008],[.504,.547,.009],[.549,.55,.009],[.596,.556,.009],[.642,.559,.01],[.69,.564,.01],[.733,.563,.007],[.267,.693,.004]],
hatchet:[[.42,.508,.005],[.464,.523,.007],[.524,.577,.009],[.484,.6,.01],[.508,.636,.012],[.576,.64,.012],[.551,.704,.014],[.634,.692,.01],[.657,.707,.004],[.612,.77,.016],[.704,.755,.005],[.763,.785,.005],[.679,.829,.016],[.803,.838,.008],[.826,.846,.005],[.753,.867,.014],[.724,.866,.006],[.748,.916,.004]],
angler:[[.19,.56,.004],[.234,.554,.005],[.249,.484,.003],[.286,.546,.007],[.295,.457,.004],[.34,.537,.003],[.382,.37,.004],[.412,.357,.004],[.419,.417,.005],[.459,.365,.004],[.656,.379,.004],[.72,.798,.004],[.735,.787,.003],[.776,.746,.004],[.794,.718,.003]],
viper:[[.161,.57,.003],[.192,.552,.003],[.196,.607,.004],[.226,.6,.004],[.262,.596,.004],[.3,.6,.004],[.334,.602,.005],[.37,.604,.006],[.407,.602,.006],[.447,.6,.006],[.492,.596,.007],[.543,.587,.006],[.597,.588,.008],[.649,.579,.007],[.699,.579,.008],[.754,.587,.007]],
dragon:[[.224,.5,.006],[.251,.5,.005],[.274,.5,.005],[.3,.496,.004],[.325,.491,.006],[.353,.483,.006],[.384,.472,.007],[.414,.462,.007],[.448,.452,.008],[.479,.439,.009],[.513,.425,.009],[.551,.415,.01],[.591,.404,.01],[.632,.397,.011],[.672,.392,.009],[.712,.389,.009],[.752,.388,.008],[.792,.389,.008],[.832,.392,.007]]};
// m: yanma düzeni · env: çevreye verdiği ışık · lure: yem ışığı [x,y,yarıçap] · red: kırmızı göz-altı ışığı (sadece ejder balığı)
const PHS={lantern:{c:[120,232,255],m:"wave",env:.34},hatchet:{c:[135,220,255],m:"steady",env:.3,down:1},
 angler:{c:[110,228,255],m:"dim",env:.16,lure:[.912,.254,.04],lc:[175,255,238],lr:150},viper:{c:[105,185,255],m:"breath",env:.26,lr:70},
 dragon:{c:[120,190,255],m:"wave",env:.24,lure:[.969,.829,.012],lc:[190,235,255],lr:110}};
let DEEP_DARK=.78;let EM=[],ENV=[],SPK=[],SNOW=null,ISO_EYES=[],lastLT=0,lastDT=.016;const PHST=new WeakMap();
function phState(f){let o=PHST.get(f);if(!o){o={fl:rand(3,10),flT:-99,bo:rand(25,70),boT:-99,px:null,py:null,sp:0};PHST.set(f,o)}return o}
function phInt(P,o,i,n,t,ph){let a;switch(P.m){
 case"wave":{a=.7+.22*Math.sin(t*2.1-i*.55+ph);const q=(t-o.flT)*2.4-(i/n)*1.3;if(q>0&&q<1.5)a+=1.15*Math.exp(-(q-.6)*(q-.6)*14);break}
 case"steady":a=.84+.06*Math.sin(t*.7+ph)+.05*Math.sin(t*6.3+i*1.9);break;
 case"dim":a=.4+.14*Math.sin(t*.55+i*.9+ph);break;
 case"breath":{const b=.5+.5*Math.sin(t*.85+ph-i*.2);a=.25+.75*b*b;break}
 default:a=.6+.4*Math.sin(t*3.1-i*.75+ph)}
 const bo=t-o.boT;if(bo>=0&&bo<1.2)a*=bo<.12?1-bo/.12:bo>.85?(bo-.85)/.35:0;
 return a>0?a:0}
let LUREW=[];
function phCollect(f,w,h,Yc,t,im,mu,N){const S=PHOT[f.type],P=PHS[f.type];if(!S||!P||curWater()!=="deep")return;const m=ctx.getTransform(),k=1/K,sc=Math.sqrt(Math.abs(m.a*m.d-m.b*m.c))*k,o=phState(f),ph=(f.phase||0)*3;
 if(t>o.flT+o.fl){o.flT=t;o.fl=rand(5,13)}if(t>o.boT+o.bo){o.boT=t;o.bo=rand(28,75)}
 const mul=(f.slp?.4:1)*(f.sick?.6:1)*(ev("biolum")?1.3:1)*(.55+.45*Math.min(1,f.age)),T=(lx,ly)=>[(m.a*lx+m.c*ly+m.e)*k,(m.b*lx+m.d*ly+m.f)*k],C=T(0,0),ws=w*sc;
 const MU=mu&&im&&im!==fishImgs[f.type]?mu:"normal",col=MGC[MU]||P.c;let lure=null;
 if(MU){// mutasyonlu resim: ışık haritası resmin kendisinden
  const em=emisMap(im,MU,f.type);let sa=0;const al=[];for(let i=0;i<N;i++){const a=phInt(P,o,i,N,t,ph)*mul;al.push(a*1.2);sa+=a}
  if(em){const Ys=[];for(let b=0;b<=N;b++)Ys.push(Yc(b/N));EMI.push({f,img:em,m:[m.a,m.b,m.c,m.d,m.e,m.f],w,h,N,Ys,al})}
  ENV.push([C[0],C[1],Math.max(40,ws*1.1),col,Math.min(.6,(MENV[MU]||P.env)*(.5+.5*sa/N)*mul+.04)]);
  const L=PML[MU+"_"+f.type];if(L)lure=[L[0],L[1],L[2],L[3]||col]}
 else{const n=S.length;let sa=0;for(let i=0;i<n;i++){const d=S[i],p=T(-w/2+d[0]*w,-h/2+d[1]*h+Yc(d[0])),a=phInt(P,o,i,n,t,ph)*mul;EM.push([p[0],p[1],Math.max(.55,d[2]*w*sc),P.c,a,0]);sa+=a}
  if(sa>0)ENV.push([C[0],C[1],Math.max(38,ws*1.05),P.c,Math.min(.55,P.env*sa/n)]);if(P.lure)lure=[P.lure[0],P.lure[1],P.lure[2],P.lc]}
 if(P.down)ENV.push([C[0],C[1]+h*sc*.75,ws*.8,col,.16*mul]);
 if(lure&&P.lr){const p=T(-w/2+lure[0]*w,-h/2+lure[1]*h+Yc(lure[0]));let a=(.9+.07*Math.sin(t*1.1+ph)+.03*Math.sin(t*7.3+ph)+.02*Math.sin(t*13.7))*mul;
  for(const d of drops)if(!d.eaten&&Math.abs(d.x-p[0])<115&&Math.abs(d.y-p[1])<115){a*=1.12+.22*Math.sin(t*17);break}
  EM.push([p[0],p[1],Math.max(1.4,Math.min(lure[2],.045)*ws),lure[3],a,1]);ENV.push([p[0],p[1],P.lr*Math.min(1.2,Math.max(.6,ws/110)),lure[3],.45*a]);LUREW.push([p[0],p[1],f])}
 const RD=PRED[MU+"_"+f.type];if(RD){const p=T(-w/2+RD[0]*w,-h/2+RD[1]*h+Yc(RD[0]));EM.push([p[0],p[1],Math.max(1,ws*.011),[255,72,52],.8*mul,0])}
 // hızlı yüzünce suyun içindeki planktonlar kıvılcımlanır
 if(o.px!==null){const v=Math.hypot(C[0]-o.px,C[1]-o.py)/Math.max(.004,lastDT);o.sp+=(Math.min(400,v)-o.sp)*.12;if(o.sp>70&&!state.lowGfx&&SPK.length<170&&Math.random()<Math.min(.85,(o.sp-70)/80)){const q=T(-w*.5,Yc(0));SPK.push({x:q[0]+rand(-3,3),y:q[1]+rand(-4,4),vx:rand(-6,6),vy:rand(-6,6),life:rand(.5,1.1),l0:1.1})}}o.px=C[0];o.py=C[1]}
const GLS2={};let holeS=null;
function glowSpr(c){const k=c.join();let s=GLS2[k];if(s)return s;s=document.createElement("canvas");s.width=s.height=64;const x=s.getContext("2d"),g=x.createRadialGradient(32,32,0,32,32,32),r="rgba("+k+",";g.addColorStop(0,r+"1)");g.addColorStop(.12,r+".62)");g.addColorStop(.3,r+".24)");g.addColorStop(.55,r+".08)");g.addColorStop(1,r+"0)");x.fillStyle=g;x.fillRect(0,0,64,64);return GLS2[k]=s}
function coreSpr(c){const k="c"+c.join();let s=GLS2[k];if(s)return s;s=document.createElement("canvas");s.width=s.height=32;const x=s.getContext("2d"),g=x.createRadialGradient(16,16,0,16,16,16),m=c.map(v=>Math.round(v+(255-v)*.55)).join();g.addColorStop(0,"rgba(255,255,255,1)");g.addColorStop(.3,"rgba("+m+",.95)");g.addColorStop(.65,"rgba("+c.join()+",.4)");g.addColorStop(1,"rgba("+c.join()+",0)");x.fillStyle=g;x.fillRect(0,0,32,32);return GLS2[k]=s}
function holeSpr(){if(holeS)return holeS;holeS=document.createElement("canvas");holeS.width=holeS.height=64;const x=holeS.getContext("2d"),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,"rgba(255,255,255,1)");g.addColorStop(.25,"rgba(255,255,255,.78)");g.addColorStop(.55,"rgba(255,255,255,.3)");g.addColorStop(.8,"rgba(255,255,255,.08)");g.addColorStop(1,"rgba(255,255,255,0)");x.fillStyle=g;x.fillRect(0,0,64,64);return holeS}
let darkC=null,blA=null,blB=null,blC=null;function cv2(c,w,h){if(!c||c.width!==w||c.height!==h){c=document.createElement("canvas");c.width=w;c.height=h}return c}
function deepTap(x,y){if(curWater()!=="deep"||state.lowGfx)return;for(let i=0;i<12&&SPK.length<170;i++){const a=rand(0,6.3),r=rand(2,16);SPK.push({x:x+Math.cos(a)*r,y:y+Math.sin(a)*r,vx:Math.cos(a)*rand(4,14),vy:Math.sin(a)*rand(4,14),life:rand(.5,1.3),l0:1.3})}}

// ===== Derin okyanus sahnesi (sürüm 114)
// Dipte bir hidrotermal baca: çatlakları turuncu yanar, etrafını ısıtıp aydınlatır, ağzından kıvılcımlar yükselir.
// Arada bir uzaktan dev bir balina geçer: karanlıkta sadece silüeti ve böğründeki ışık noktaları seçilir.
// Belli aralıklarla bir biyolüminesans dalgası tankı boydan boya geçer ve planktonları yakar.
let WHALE=null,WHN=0,WAVE=null,WVN=0,EMB=[];
function ventPos(){return[W*.5,FLOOR+46]}
function smoothPath(x,P){const n=P.length,M=i=>[(P[i][0]+P[(i+1)%n][0])/2,(P[i][1]+P[(i+1)%n][1])/2];let m=M(n-1);x.moveTo(m[0],m[1]);for(let i=0;i<n;i++){m=M(i);x.quadraticCurveTo(P[i][0],P[i][1],m[0],m[1])}x.closePath()}
// balina köpekbalığı yandan: yassı baş, iki sırt yüzgeci, göğüs yüzgeci, dikey kuyruk
// balina köpekbalığı görseli: uzakta kaldığı için koyulaştırılıp soldurulur, gövde dilimlere bölünüp kuyruğa doğru artan dalgayla kıvrılır
const WHSRC="a/75b2b51005a459d6.webp",WHSP=[[.492,.633],[.604,.618],[.43,.618],[.533,.637],[.639,.592],[.671,.56],[.7,.517],[.558,.455],[.481,.489],[.375,.603],[.444,.498],[.115,.41],[.614,.416],[.099,.34],[.836,.573],[.344,.594],[.75,.475],[.619,.488],[.13,.469],[.653,.388],[.57,.631],[.087,.275],[.731,.499],[.113,.553],[.29,.57],[.316,.582],[.661,.743]];let WHI=null,WHC=null;
function whaleImg(){if(WHC)return WHC;if(!WHI){WHI=new Image();WHI.src=WHSRC;return null}if(!WHI.complete||!WHI.naturalWidth)return null;try{const c=document.createElement("canvas");c.width=WHI.naturalWidth;c.height=WHI.naturalHeight;const x=c.getContext("2d");x.filter="saturate(.6) brightness(.62)";x.drawImage(WHI,0,0);x.filter="none";x.globalCompositeOperation="source-atop";x.fillStyle="rgba(8,22,44,.42)";x.fillRect(0,0,c.width,c.height);WHC=c}catch(e){WHC=WHI}return WHC}
function whaleBend(u,t,ph){const q=Math.max(0,.62-u)/.62;return q*q*.06*Math.sin(t*1.25+ph-u*4)}
function whaleDraw(I,t,ph){const N=18,iw=I.width,ih=I.height,w=1.065/N,sw=iw/N;ctx.globalAlpha=.78;for(let i=0;i<N;i++){const u=(i+.5)/N;ctx.drawImage(I,i*sw,0,sw+1,ih,-.565+i*w,-.2+whaleBend(u,t,ph),w*1.06,.388)}ctx.globalAlpha=1}
function whalePath(x,fl){x.beginPath();smoothPath(x,[[.5,-.005],[.47,-.06],[.36,-.095],[.2,-.115],[.04,-.122],[-.14,-.1],[-.3,-.058],[-.4,-.032],[-.47,-.1+fl*.6],[-.565,-.215+fl],[-.52,-.085+fl*.5],[-.49,-.008],[-.535,.09+fl*.6],[-.455,.035],[-.4,.024],[-.24,.05],[-.04,.085],[.2,.088],[.4,.06],[.49,.03]]);
 x.moveTo(.03,-.118);x.quadraticCurveTo(-.05,-.17,-.1,-.205);x.quadraticCurveTo(-.11,-.14,-.13,-.098);x.closePath();
 x.moveTo(-.27,-.064);x.quadraticCurveTo(-.31,-.09,-.335,-.105);x.lineTo(-.33,-.05);x.closePath();
 x.moveTo(.23,.072);x.quadraticCurveTo(.15,.15,.07,.2);x.quadraticCurveTo(.1,.12,.11,.08);x.closePath()}function drawDeepBack(t,dt){if(state.lowGfx)return;const[vx,vy]=ventPos();
 // dev balina (balıkların arkasında)
 if(!WHN)WHN=t+rand(14,26);if(!WHALE&&t>WHN){const L=W*rand(.82,1.02),d=Math.random()<.5?1:-1;WHALE={L,d,x:d>0?-L*.6:W+L*.6,y:rand(H*.3,H*.5),sp:(W+L*1.2)/rand(36,46),ph:rand(0,6)}}
 if(WHALE){const B=WHALE;B.x+=B.d*B.sp*dt;if((B.d>0&&B.x>W+B.L*.65)||(B.d<0&&B.x<-B.L*.65)){WHALE=null;WHN=t+rand(45,90)}else{const fl=Math.sin(t*1.25+B.ph)*.05;ctx.save();ctx.translate(B.x,B.y+Math.sin(t*.4+B.ph)*8);ctx.scale(B.L*B.d,B.L);ctx.rotate(Math.sin(t*.3+B.ph)*.02);
  const WI=whaleImg();if(WI){whaleDraw(WI,t,B.ph);const m=ctx.getTransform(),k=1/K;WHSP.forEach(([u,v],i)=>{const lx=-.565+u*1.065,ly=-.2+v*.388+whaleBend(u,t,B.ph),a=.18+.34*Math.max(0,Math.sin(t*1.6-u*7+B.ph+i*.4));EM.push([(m.a*lx+m.c*ly+m.e)*k,(m.b*lx+m.d*ly+m.f)*k,1+(i<8?.5:0),[150,215,255],a,0])})}else{
  ctx.globalAlpha=.72;const g=ctx.createLinearGradient(0,-.2,0,.12);g.addColorStop(0,"rgba(92,132,178,.75)");g.addColorStop(.3,"rgba(30,48,74,.92)");g.addColorStop(1,"rgba(5,9,18,.96)");ctx.fillStyle=g;whalePath(ctx,fl);ctx.fill();
  ctx.save();whalePath(ctx,fl);ctx.clip();ctx.fillStyle="rgba(215,235,255,.16)";for(let i=0;i<70;i++){const u=.44-((i*.61803)%1)*.82,v=-.1+((i*.38197*7)%1)*.17,r=.0045+(i%3)*.0015;if(u<-.36)continue;ctx.beginPath();ctx.arc(u,v,r,0,7);ctx.fill()}
  ctx.strokeStyle="rgba(150,190,230,.18)";ctx.lineWidth=.004;for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(.33-i*.022,.005,.07,-.9,.9);ctx.stroke()}ctx.restore();ctx.globalAlpha=1;
  {const m=ctx.getTransform(),k=1/K;for(let i=0;i<16;i++){const u=.4-i*.052,yy=.015+Math.sin(u*3)*.01,px=(m.a*u+m.c*yy+m.e)*k,py=(m.b*u+m.d*yy+m.f)*k,a=.22+.4*Math.max(0,Math.sin(t*2.2-i*.55+B.ph));EM.push([px,py,1.1,[120,205,255],a,0])}}
  }
  const m=ctx.getTransform(),k=1/K;ENV.push([(m.a*.1+m.e)*k,(m.b*.1+m.f)*k,B.L*.45,[90,150,230],.1]);ctx.restore()}}
 // sıcak su kaynağı: kumun içinden yükselen titrek ışık sütunu
 const fk=.82+.1*Math.sin(t*7.3)+.08*Math.sin(t*13.1),G=glowSpr([255,120,50]);ctx.save();ctx.globalCompositeOperation="lighter";
 for(let i=0;i<5;i++){const yy=vy-18-i*34,sw=34+i*12+Math.sin(t*2.1+i*1.7)*6,xx=vx+Math.sin(t*1.3+i*.9)*(4+i*3);ctx.globalAlpha=(.16-i*.025)*fk;ctx.drawImage(G,xx-sw/2,yy-30,sw,60)}
 ctx.globalAlpha=.5*fk;ctx.drawImage(G,vx-46,vy-22,92,40);ctx.restore()}
function deepLights(t,dt){if(state.lowGfx)return;const[vx,vy]=ventPos(),fk=.82+.1*Math.sin(t*7.3)+.08*Math.sin(t*13.1);
 ENV.push([vx,vy-40,200,[255,118,46],.5*fk]);ENV.push([vx,vy-6,120,[255,96,40],.4*fk]);EM.push([vx,vy-6,2.6,[255,170,90],.8*fk,0]);EM.push([vx-14,vy-2,1.6,[255,150,70],.5*fk,0]);EM.push([vx+12,vy-4,1.4,[255,150,70],.5*fk,0]);
 if(Math.random()<dt*14&&EMB.length<40)EMB.push({x:vx+rand(-12,12),y:vy-8,vx:rand(-3,3),vy:-rand(16,30),life:rand(2.2,4.2),l0:4.2});
 for(const e of EMB){e.life-=dt;e.x+=(e.vx+Math.sin(t*2+e.y*.05)*5)*dt;e.y+=e.vy*dt}EMB=EMB.filter(e=>e.life>0);
 // biyolüminesans dalgası
 if(!WVN)WVN=t+rand(10,18);if(!WAVE&&t>WVN){const d=Math.random()<.5?1:-1;WAVE={d,x:d>0?-20:W+20}}
 if(WAVE){WAVE.x+=WAVE.d*80*dt;for(let i=0;i<6&&SPK.length<240;i++)SPK.push({x:WAVE.x+rand(-10,10),y:rand(H*.08,FLOOR+10),vx:WAVE.d*rand(2,10),vy:rand(-5,5),life:rand(.7,1.6),l0:1.6});if(WAVE.x<-30||WAVE.x>W+30){WAVE=null;WVN=t+rand(22,40)}}}
function drawEmbers(){if(!EMB.length)return;const C=coreSpr([255,160,80]);for(const e of EMB){const u=e.life/e.l0;ctx.globalAlpha=Math.min(1,u*1.6)*.9;const r=1.2+u*1.4;ctx.drawImage(C,e.x-r,e.y-r,r*2,r*2)}}
// sürüm 116: karanlık ve sudaki renkli ışık sadece arkaplana uygulanır (balıklar sisin arkasında kalmaz);
// her balığın ışık organları kendi balığıyla birlikte çizilir, öndeki balık arkadakinin ışığını örter.
let ENVP=[];
function emDraw(L){const lo=state.lowGfx;for(const e of L){if(e[4]<.02)continue;const r=e[2],R=r*(e[5]?8:4.2)+2;ctx.globalAlpha=Math.min(1,e[4]*(e[5]?.8:.65));ctx.drawImage(glowSpr(e[3]),e[0]-R,e[1]-R,R*2,R*2);const rc=r*(e[5]?1.7:1.4);ctx.globalAlpha=Math.min(1,e[4]);ctx.drawImage(coreSpr(e[3]),e[0]-rc,e[1]-rc,rc*2,rc*2);if(e[5]&&!lo&&LQ<1){const R2=r*20;ctx.globalAlpha=e[4]*.16;ctx.drawImage(glowSpr(e[3]),e[0]-R2,e[1]-R2,R2*2,R2*2)}}}
function flushFishLights(){if(!EM.length&&!EMI.length)return;if((state.admOff||{}).lights){EM.length=0;EMI.length=0;return}ctx.save();ctx.setTransform(K,0,0,K,0,0);ctx.globalCompositeOperation="lighter";ctx.globalAlpha=1;emDraw(EM);for(const E of EMI)emiDraw(ctx,E,1);ctx.restore();EM.length=0;EMI.length=0}
// sürüm 124: karanlık örtü tek küçük tuvalde hazırlanır (eskiden 4 ara tuval ve 3 kademeli parlama vardı) ve saniyede ~30 kez yenilenir;
// arada aynı örtü tekrar kullanılır. iPhone'da derin okyanustaki kasmanın ana sebebi buydu.
function drawDeepPre(t,dt){const lo=state.lowGfx;deepLights(t,dt);const L=ENVP,sw=Math.ceil(W/4),sh=Math.ceil(H/4),now=performance.now();
 if(!darkC||darkC.width!==sw||darkC.height!==sh||now-(darkC._t||0)>=(LQ>=2?110:LQ?62:31)){darkC=cv2(darkC,sw,sh);darkC._t=now;const x=darkC.getContext("2d");x.setTransform(1,0,0,1,0,0);x.globalCompositeOperation="source-over";x.globalAlpha=1;x.clearRect(0,0,sw,sh);const g=x.createLinearGradient(0,0,0,sh);g.addColorStop(0,"rgba(0,4,16,"+(DEEP_DARK-.1)+")");g.addColorStop(1,"rgba(0,2,10,"+(DEEP_DARK+.06)+")");x.fillStyle=g;x.fillRect(0,0,sw,sh);
  x.globalCompositeOperation="destination-out";const HS=holeSpr();for(const l of L){const r=l[2]/4;x.globalAlpha=Math.min(1,l[4]*1.7);x.drawImage(HS,l[0]/4-r,l[1]/4-r,r*2,r*2)}
  if(!lo&&LQ<2&&L.length){x.globalCompositeOperation="lighter";for(const l of L){const r=l[2]*1.15/4;x.globalAlpha=Math.min(1,l[4]*.3);x.drawImage(glowSpr(l[3]),l[0]/4-r,l[1]/4-r,r*2,r*2)}}
  x.globalAlpha=1;x.globalCompositeOperation="source-over"}
 ctx.drawImage(darkC,0,0,W,H);flushFishLights()}
function drawDeepLight(t){const dt=lastLT?Math.min(.05,Math.max(.001,t-lastLT)):.016;lastLT=t;lastDT=dt;const lo=state.lowGfx;
 // balık dışındaki ışık kaynakları: derin denizanası, sandık, paralar, canlı yem (kril), izopod gözleri
 critLights(t);for(const o of CRT.values())if(o.d.id==="jdeep"){const pu=.55+.3*Math.max(0,Math.sin(((o.ph||0)%1)*Math.PI*2+1.2));ENV.push([o.x,o.y-o.r*.3,125,[175,128,255],.55*pu]);const n=8,rr=o.r*1.02*(1-.2*(o.c||0));for(let i=0;i<n;i++){const an=Math.PI*(.08+.84*i/(n-1)),q=(t*1.8-i*.6)%(Math.PI*2);EM.push([o.x-Math.cos(an)*rr,o.y-o.r*.15+Math.sin(an)*rr*.32,1.3,i%2?[120,200,255]:[200,140,255],.35+.45*Math.max(0,Math.sin(q)),0])}}
 const c=state.chest;if(c)ENV.push([c.x*W,FLOOR-8,110,[255,205,120],.55]);for(const q of coinsLoose)ENV.push([q.x,q.y,26,[255,210,90],.4]);
 for(const d of drops)if(d.tp==="k"&&!d.eaten){const a=.45+.45*Math.max(0,Math.sin(t*3.6+(d.sw||0)*4));EM.push([d.x+1.5,d.y,1.1,[120,225,255],a,0]);ENV.push([d.x,d.y,24,[120,225,255],.22*a])}
 for(const e of ISO_EYES)EM.push([e[0],e[1],Math.max(.7,e[2]*.12),[190,255,215],.18*e[3]+ .5*e[3]*Math.min(1,eyeLit(e[0],e[1])),0]);ISO_EYES=[];
 for(const p of SPK){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=1-Math.min(1,dt*1.6);p.vy*=1-Math.min(1,dt*1.6)}SPK=SPK.filter(p=>p.life>0);
 ctx.save();ctx.globalCompositeOperation="lighter";if(!lo&&LQ<1)drawSnow(t,dt);for(const fn of CPOST){try{fn()}catch(e){}}CPOST.length=0;ctx.globalCompositeOperation="lighter";emDraw(EM);for(const E of EMI)emiDraw(ctx,E,1);drawEmbers();for(const p of SPK){const f=sparkA(p);ctx.globalAlpha=f;ctx.drawImage(coreSpr([110,215,255]),p.x-1.4,p.y-1.4,2.8,2.8)}
 ctx.restore();ENVP=ENV;EM=[];ENV=[];EMI=[];EMPI=0;LURE_LAST=LUREW;LUREW=[]}
function sparkA(p){const u=1-p.life/p.l0;return u<.12?u/.12:Math.pow(1-(u-.12)/.88,1.6)}
function eyeLit(x,y){let L=0;for(const l of ENV){const dx=x-l[0],dy=y-l[1],r=l[2]*1.6,q=1-(dx*dx+dy*dy)/(r*r);if(q>0)L+=q*l[4]}return L}
function drawSnow(t,dt){if(!SNOW){SNOW=[];for(let i=0;i<85;i++)SNOW.push({x:rand(0,W),y:rand(H*.06,FLOOR+20),z:rand(.35,1),ph:rand(0,6.3)})}
 for(const s of SNOW){s.y+=(2.5+6*s.z)*dt;s.x+=Math.sin(t*.35+s.ph)*3.5*s.z*dt;if(s.y>FLOOR+24){s.y=H*.04;s.x=rand(0,W)}let L=.065,cr=200,cg=225,cb=255,cw=1;
  for(const l of ENV){const dx=s.x-l[0],dy=s.y-l[1],r=l[2]*1.25,q=1-(dx*dx+dy*dy)/(r*r);if(q>0){const v=q*q*l[4];L+=v;cr+=l[3][0]*v*3;cg+=l[3][1]*v*3;cb+=l[3][2]*v*3;cw+=v*3}}
  const a=Math.min(.85,L*1.7*s.z);if(a<.02)continue;ctx.globalAlpha=a;ctx.fillStyle="rgb("+(cr/cw|0)+","+(cg/cw|0)+","+(cb/cw|0)+")";const z=(.5+.9*s.z)*2.2;ctx.drawImage(dotSpr(),s.x-z,s.y-z,z*2,z*2)}}
// ===== Mutasyon malzeme katmanı: her mutasyonun yüzeyi ışığı kendine göre yansıtır.
// Altın: gövdede gezen sıcak metal parlaması · Transparan: camda kayan soğuk yansıma · Melanistik: yağ gibi yanardöner renk dalgası · Albino: inci parıltısı.
// Parlama bandı balığın kendi şekline maskelenir ve balıkla birlikte kıvrılır.
const SHEEN={gold:{c:["rgba(255,246,200,0)","rgba(255,250,222,.85)","rgba(255,236,160,0)"],sp:.42,wd:.2,a:.6},
 melanistic:{c:["rgba(70,255,235,0)","rgba(70,255,235,.4)","rgba(185,95,255,.45)","rgba(255,110,200,.3)","rgba(255,110,200,0)"],sp:.24,wd:.42,a:.72},
 transparent:{c:["rgba(205,250,255,0)","rgba(230,253,255,.65)","rgba(205,250,255,0)"],sp:.33,wd:.16,a:.62},
 albino:{c:["rgba(255,220,236,0)","rgba(255,238,246,.5)","rgba(205,228,255,.32)","rgba(255,220,236,0)"],sp:.29,wd:.3,a:.5}};
// sürüm 117: her balığın parıltı tuvali ayrı (ortak tuval her balıkta yeniden boyutlanıyordu) ve kıvrımla aynı hızda (~30/sn) yenilenir
const SHC=new WeakMap();
function sheenTex(src,mu,t,ph,f){const S=SHEEN[mu],iw=src.naturalWidth||src.width,ih=src.naturalHeight||src.height,now=performance.now();let o=SHC.get(f);if(!o){o={c:document.createElement("canvas"),t:0};SHC.set(f,o)}const shC=o.c;if(shC.width===iw&&shC.height===ih&&o.s===src&&now-o.t<BNDT)return shC;o.t=now;o.s=src;if(shC.width!==iw||shC.height!==ih){shC.width=iw;shC.height=ih}const x=shC.getContext("2d");x.globalCompositeOperation="source-over";x.globalAlpha=1;x.clearRect(0,0,iw,ih);
 const p=((t*S.sp+ph)%1.9)/1.9*1.7-.35,cx=p*iw,bw=S.wd*iw,g=x.createLinearGradient(cx-bw,0,cx+bw,ih*.7);S.c.forEach((c,i)=>g.addColorStop(i/(S.c.length-1),c));x.fillStyle=g;x.fillRect(0,0,iw,ih);x.globalCompositeOperation="destination-in";x.drawImage(src,0,0);return shC}
// ===== Derin deniz mutasyonları: ışık haritası balığın kendi resminden otomatik çıkarılır (resimdeki parlak ışık organları bulunur),
// sonra karanlığın üstüne türün yanma düzeniyle dilim dilim yakılır. Yem ışıklarının yeri her resim için ölçüldü.
const PML={"normal_angler":[0.921,0.267,0.04,[115,196,255]],"normal_viper":[0.956,0.282,0.01,[100,195,255]],"normal_dragon":[0.969,0.829,0.012,[140,205,255]],"albino_angler":[0.907,0.227,0.045,[255,156,167]],"albino_viper":[0.92,0.256,0.017,[255,154,169]],"albino_dragon":[0.973,0.909,0.02,[255,175,210]],"transparent_angler":[0.919,0.252,0.043,[110,198,255]],"transparent_viper":[0.955,0.283,0.011,[111,226,255]],"transparent_dragon":[0.976,0.875,0.02,[150,245,255]],"melanistic_angler":[0.913,0.252,0.044,[78,78,255]],"melanistic_viper":[0.936,0.266,0.015,[82,108,255]],"melanistic_dragon":[0.974,0.898,0.02,[100,150,255]],"gold_angler":[0.911,0.254,0.044,[255,162,77]],"gold_viper":[0.933,0.267,0.015,[255,186,96]],"gold_dragon":[0.971,0.896,0.02,[255,232,165]],"glitch_angler":[0.912,0.229,0.043,[255,88,235]],"glitch_viper":[0.918,0.262,0.017,[255,108,249]],"glitch_dragon":[0.962,0.859,0.025,[255,72,218]]},PRED={};
const MGC={normal:null,albino:[255,175,205],transparent:[110,212,255],melanistic:[80,125,255],gold:[255,200,90],glitch:[190,105,255]},MENV={albino:.2,transparent:.22,melanistic:.26,gold:.34,glitch:.24};
const EHX={lantern:.86,hatchet:.84,angler:.84,viper:.86,dragon:.82,oar:.9},EMC=new WeakMap();let EMI=[];
function emisMap(im,m,sp){let c=EMC.get(im);if(c!==undefined)return c;c=null;try{const W=im.naturalWidth,H=im.naturalHeight,cv=document.createElement("canvas");cv.width=W;cv.height=H;const x=cv.getContext("2d",{willReadFrequently:true});x.drawImage(im,0,0);const d=x.getImageData(0,0,W,H).data,n=W*H,L=new Float32Array(n),O=new Uint8Array(n),Q=new Uint8Array(n);
 for(let i=0;i<n;i++){const a=d[i*4+3];L[i]=Math.max(d[i*4],d[i*4+1],d[i*4+2])/255;O[i]=a>128?1:0;Q[i]=a>230?1:0}
 const W1=W+1,Z=()=>new Float64Array(W1*(H+1)),iL=Z(),iO=Z(),iQ=Z(),iR=Z(),iG=Z(),iB=Z();
 for(let y=0;y<H;y++){let sl=0,so=0,sq=0,sr=0,sg=0,sb=0;for(let k=0;k<W;k++){const i=y*W+k,j=(y+1)*W1+k+1;sl+=L[i]*O[i];so+=O[i];sq+=Q[i];sr+=d[i*4]*O[i];sg+=d[i*4+1]*O[i];sb+=d[i*4+2]*O[i];iL[j]=iL[j-W1]+sl;iO[j]=iO[j-W1]+so;iQ[j]=iQ[j-W1]+sq;iR[j]=iR[j-W1]+sr;iG[j]=iG[j-W1]+sg;iB[j]=iB[j-W1]+sb}}
 const bx=(I,x0,y0,x1,y1)=>I[y1*W1+x1]-I[y0*W1+x1]-I[y1*W1+x0]+I[y0*W1+x0],R=Math.max(3,W*.022|0),E=3,Rs=Math.max(2,W*.009|0),hx=(EHX[sp]||.85)*W,T=.06,cl=v=>v<0?0:v>1?1:v,out=x.createImageData(W,H),o=out.data;
 for(let y=0;y<H;y++)for(let k=0;k<W;k++){const i=y*W+k;if(k>hx||!Q[i])continue;const ex0=Math.max(0,k-E),ey0=Math.max(0,y-E),ex1=Math.min(W,k+E+1),ey1=Math.min(H,y+E+1);if(bx(iQ,ex0,ey0,ex1,ey1)<(ex1-ex0)*(ey1-ey0))continue;
  const x0=Math.max(0,k-R),y0=Math.max(0,y-R),x1=Math.min(W,k+R+1),y1=Math.min(H,y+R+1),lb=bx(iL,x0,y0,x1,y1)/Math.max(1,bx(iO,x0,y0,x1,y1)),l=L[i];let e=cl((l-lb-T)/.2)*cl((l-.62)/.3);if(e<=0)continue;
  const sx0=Math.max(0,k-Rs),sy0=Math.max(0,y-Rs),sx1=Math.min(W,k+Rs+1),sy1=Math.min(H,y+Rs+1),so=Math.max(1,bx(iO,sx0,sy0,sx1,sy1))*255,r=bx(iR,sx0,sy0,sx1,sy1)/so,g=bx(iG,sx0,sy0,sx1,sy1)/so,b=bx(iB,sx0,sy0,sx1,sy1)/so,sL=Math.max(r,g,b),sS=(sL-Math.min(r,g,b))/Math.max(sL,1e-3),mn=Math.min(d[i*4],d[i*4+1],d[i*4+2])/255;
  const gt=m==="albino"?cl((r-g-.12)/.15)*cl((mn-.75)/.15):m==="gold"?cl((r-b-.3)/.2)*cl((mn-.5)/.25):cl((sS-.4)/.2);
  e*=gt;if(e<.02)continue;o[i*4]=d[i*4];o[i*4+1]=d[i*4+1];o[i*4+2]=d[i*4+2];o[i*4+3]=Math.min(255,e*255)}
 x.clearRect(0,0,W,H);x.putImageData(out,0,0);c=cv}catch(e){c=null}EMC.set(im,c);return c}
// ışık haritası da balık gibi tek parça kıvrılır (şerit sınırlarında parlak çizgi kalmaz); her karede bir kez hazırlanıp iki yere çizilir
const EMP=[];let EMPI=0;
const EMIC=new WeakMap();
// balığın kıvrımı yeniden hazırlanmadıysa ışık haritası da önceki karedeki haliyle kullanılır
function emiBake(E){if(E.cv)return E.cv;const img=E.img,iw=img.width,ih=img.height,N=E.N,sy=ih/E.h,now=performance.now(),q=E.f&&EMIC.get(E.f);if(q&&q.img===img&&q.k===E.f._bk&&now-q.t<100){E.cv=q.cv;E.pad=q.pad;return q.cv}let mx=0;for(const y of E.Ys)mx=Math.max(mx,Math.abs(y));const pad=Math.ceil(mx*sy)+2;
 const c=q?q.cv:E.f?document.createElement("canvas"):(EMP[EMPI]||(EMP[EMPI]=document.createElement("canvas")));if(!E.f)EMPI++;if(c.width!==iw||c.height!==ih+2*pad){c.width=iw;c.height=ih+2*pad}const x=c.getContext("2d");x.setTransform(1,0,0,1,0,0);x.globalAlpha=1;x.clearRect(0,0,c.width,c.height);
 let x0=0;for(let i=0;i<N;i++){const x1=i===N-1?iw:Math.round((i+1)*iw/N),cw=x1-x0,a=E.al[i];if(cw>0&&a>=.02){const y0=E.Ys[i]*sy,y1=E.Ys[i+1]*sy;x.globalAlpha=Math.min(1,a);x.setTransform(1,(y1-y0)/cw,0,1,x0,pad+y0);x.drawImage(img,x0,0,cw,ih,0,0,cw,ih)}x0=x1}
 E.cv=c;E.pad=pad/sy;if(E.f)EMIC.set(E.f,{cv:c,img,k:E.f._bk,t:now,pad:E.pad});return c}
function emiDraw(cx,E,s){const m=E.m,c=emiBake(E);cx.save();cx.setTransform(m[0]*s,m[1]*s,m[2]*s,m[3]*s,m[4]*s,m[5]*s);cx.globalAlpha=1;cx.drawImage(c,-E.w/2,-E.h/2-E.pad,E.w,E.h+2*E.pad);cx.restore()}
// ===== Gerçekçi beslenme: emme ile yeme
// Gerçek balıkların çoğu yemi ısırmaz, ağzını hızla açıp suyla birlikte içine çeker. Burada: balık yeme yaklaşınca yavaşlar ve
// hizalanır, sonra çenesi açılır (alt çene menteşesinden döner), yem ve etrafındaki su zerreleri ağza doğru çekilir, çene kapanır,
// balık yutkunur ve küçük parçaları solungaçlarından dışarı atar. Bazen yemi tadıp geri tükürür, bazen ıskalar.
// Fener balığı pusuda bekler: canlı yemler ışığına doğru çekilir, yaklaşınca çok hızlı ve geniş bir ağızla yutar.
const MOUTH={neon:[.995,.62],guppy:[.995,.5],clown:[.99,.52],ytang:[.995,.64],gold:[.99,.58],betta:[.99,.36],btang:[.99,.58],angel:[.99,.6],cichlid:[.99,.51],lion:[.985,.64],arowana:[.995,.33],copper:[.995,.6],discus:[.99,.59],trigger:[.99,.63],boxfish:[.99,.58],mandarin:[.99,.5],koi:[.99,.64],idol:[.995,.65],emp:[.99,.54],napo:[.99,.59],lantern:[.975,.6],hatchet:[.975,.45],angler:[.87,.62],viper:[.9,.66],oar:[.99,.53],dragon:[.95,.42],tripod:[.99,.43],lancet:[.985,.48],piranha:[0.99,0.627],peacock:[0.991,0.604],bichir:[0.991,0.522],eel:[0.993,0.407],mahseer:[0.991,0.6],gar:[0.992,0.387],arapaima:[0.993,0.582],goliath:[0.99,0.56],mekong:[0.992,0.674],sturgeon:[0.992,0.541]};const NOJAW={angler:1,viper:1,dragon:1,tripod:1,lancet:1,goliath:1,gar:1,sturgeon:1};
const JAWL={angler:.2,viper:.15,dragon:.12,hatchet:.11,lantern:.1,oar:.07,arowana:.12,napo:.1,discus:.08,boxfish:.07,copper:.07,idol:.07,neon:.09,guppy:.09};
let LURE_LAST=[];
function mouthOf(f){return MOUTH[f.type]||[.985,.56]}
function jawOpen(f){if(!f.jawT)return 0;const u=simT-f.jawT,A=f.jawA||.7;let j=u<0?0:u<.06?u/.06:u<(f.jawH||.14)?1:Math.max(0,1-(u-(f.jawH||.14))/.18);j*=A;if(f.chew&&simT>f.chew&&simT<f.chew+.7){const c=(simT-f.chew)/.7;j=Math.max(j,.16*Math.abs(Math.sin(c*Math.PI*3))*(1-c))}return j}
// emme başlat
function suckStart(f,food){food.sk=f;food.skT=0;f.jawT=simT;f.jawH=.14;f.jawA=f.type==="angler"?1:.55+.35*Math.random();if(food.ph==="surf"){particles.push({x:food.x,y:SURF+1,vx:0,vy:0,life:.8,l0:.8,type:"ring"})}}
// yem ağza doğru çekilir (foodStep içinde her adımda)
function suckStep(d,h){const f=d.sk;if(!f||!state.fish.includes(f)){d.sk=null;return}d.skT+=h;const tx=f._mx!=null?f._mx:d.x,ty=f._my!=null?f._my:d.y,dx=tx-d.x,dy=ty-d.y,dist=Math.hypot(dx,dy)||.001,v=Math.min(dist/h,50+dist*18+d.skT*600);d.x+=dx/dist*v*h;d.y+=dy/dist*v*h;d.vx=d.vy=0;
 if(!state.lowGfx&&Math.random()<h*26){const a=rand(0,6.3),r=rand(8,20);particles.push({type:"suck",x:tx+Math.cos(a)*r,y:ty+Math.sin(a)*r,vx:-Math.cos(a)*r*7,vy:-Math.sin(a)*r*7,life:.14})}
 if(dist<2.5||d.skT>.3)suckEnd(f,d,tx,ty)}
function suckEnd(f,d,tx,ty){const fw=fishW(f),mo=(f.fs||f.dir||1)>=0?1:-1;d.sk=null;f.jawH=Math.max(.06,simT-f.jawT);
 // tadıp geri tükürme (küçük balıklar, ara sıra)
 if(fw<85&&!d.spat&&d.tp!=="k"&&Math.random()<.1){d.spat=1;d.x=tx+mo*4;d.y=ty;d.vx=mo*rand(45,70);d.vy=rand(-12,4);if(d.ph!=="sink"){d.ph="sink";d.vy=8}f.spitT=simT+.6;f.jawT=simT;f.jawA=.45;f.jawH=.08;crumbs(tx,ty,1,d.col);return}
 const bite=Math.max(.5,Math.min(2,fw/75)),e=Math.min(bite,d.hp);d.hp-=e;f.hunger=Math.min(100,f.hunger+12*e);
 if(d.hp<=.01)d.eaten=true;else{d.x=tx+mo*3;d.vx=mo*rand(8,20);d.vy=rand(-6,6)}
 f.gulp=.24;f.chew=simT+.08;f.gill=simT+.22;f.gillC=d.ph==="floor"?"#cdbb92":d.col||"#d6c7a0";if(d.ph==="floor")sandPuff(d.x,d.y,3);crumbs(tx,ty,1,d.col);if(simT-eatAt>.3){eatAt=simT;sfx("bubble")}}
// yutkunduktan sonra solungaçlardan küçük parçalar çıkar
function gillStep(f){if(!f.gill||simT<f.gill||f._gx==null)return;f.gill=0;const mo=(f.fs||f.dir||1)>=0?1:-1;for(let i=0;i<3;i++)particles.push({x:f._gx+rand(-2,2),y:f._gy+rand(-3,3),vx:-mo*rand(6,18),vy:rand(-2,9),life:rand(.5,1),type:"crumb",c:f.gillC})}
// canlı yemler yem ışığına doğru çekilir
function lureAttract(d,h){if(d.tp!=="k"||!(d.live>0)||d.sk)return;for(const L of LURE_LAST){const dx=L[0]-d.x,dy=L[1]-d.y,q=Math.hypot(dx,dy);if(q<170&&q>6){const k=(1-q/170)*34*h;d.vx+=dx/q*k;d.vy+=dy/q*k}}}
// alt çenesi açılmış balık çizimi (drawFish içinden)
function drawJaw(f,src,w,h,Yc,drawS,jo){const MO=mouthOf(f),JL=JAWL[f.type]||.13,hx=-w/2+(MO[0]-JL)*w,hy=-h/2+MO[1]*h+Yc(MO[0]-JL),tx=-w/2+MO[0]*w+1,ty=-h/2+MO[1]*h+Yc(MO[0]),ang=jo*(f.type==="angler"?.5:f.type==="viper"||f.type==="dragon"?.4:.24),ex=w*.12;
 const jawPath=c=>{c.beginPath();c.moveTo(hx,hy);c.lineTo(tx+ex,ty);c.lineTo(tx+ex,hy+h);c.lineTo(hx-w*.04,hy+h);c.closePath()};
 ctx.save();ctx.beginPath();ctx.rect(-w*1.5,-h*1.5,w*3,h*3);ctx.moveTo(hx,hy);ctx.lineTo(hx-w*.04,hy+h);ctx.lineTo(tx+ex,hy+h);ctx.lineTo(tx+ex,ty);ctx.closePath();ctx.clip("evenodd");drawS(src,0,0);ctx.restore();
 // ağız içi: dudakların arasında koyu, yuvarlak bir boşluk (yandan bakınca açık ağız)
 {const cx=tx-w*.02,cy=ty+h*.025*jo,rx=w*.028*jo+.8,ry=h*.06*jo+.8,g=ctx.createRadialGradient(cx+rx*.2,cy,0,cx,cy,Math.max(rx,ry));g.addColorStop(0,"rgba(8,2,6,.95)");g.addColorStop(.7,"rgba(40,8,16,.9)");g.addColorStop(1,"rgba(90,30,40,.0)");ctx.save();ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,0,7);ctx.fill();ctx.restore()}
 ctx.save();ctx.translate(hx,hy);ctx.rotate(ang);ctx.translate(-hx,-hy);jawPath(ctx);ctx.clip();drawS(src,0,0);ctx.restore()}
const litC=new WeakMap(),dpC=new WeakMap();
// derin suda balık katı ve renkli kalır; sadece üstten soğuk bir ışık ve alt tarafta hafif lacivert gölge alır
function deepTex(src){let L=dpC.get(src);if(L!==undefined)return L;L=src;try{const iw=src.naturalWidth||src.width,ih=src.naturalHeight||src.height,c=document.createElement("canvas");c.width=iw;c.height=ih;const x=c.getContext("2d");x.drawImage(src,0,0);try{const D=x.getImageData(0,0,iw,ih),d=D.data;for(let i=0;i<d.length;i+=4){if(d[i+3]<4)continue;const r=d[i],gg=d[i+1],b=d[i+2],l=.299*r+.587*gg+.114*b,f=v=>{v=(l+(v-l)*1.22-128)*1.05+128;v*=1.04;return v<0?0:v>255?255:v};d[i]=f(r);d[i+1]=f(gg);d[i+2]=f(b)}x.putImageData(D,0,0)}catch(e){}x.globalCompositeOperation="source-atop";const g=x.createLinearGradient(0,0,0,ih);g.addColorStop(0,"rgba(190,225,255,.2)");g.addColorStop(.35,"rgba(140,180,255,.05)");g.addColorStop(.7,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(6,14,50,.16)");x.fillStyle=g;x.fillRect(0,0,iw,ih);L=c}catch(e){L=src}dpC.set(src,L);return L}
function litOn(){return !state.lowGfx&&!VISIT}
function litTex(src){let L=litC.get(src);if(L!==undefined)return L;L=src;try{const iw=src.naturalWidth||src.width,ih=src.naturalHeight||src.height,c=document.createElement("canvas");c.width=iw;c.height=ih;const x=c.getContext("2d");x.drawImage(src,0,0);x.globalCompositeOperation="source-atop";const g=x.createLinearGradient(0,0,0,ih);g.addColorStop(0,"rgba(255,252,235,.26)");g.addColorStop(.3,"rgba(255,255,255,.06)");g.addColorStop(.6,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,22,40,.22)");x.fillStyle=g;x.fillRect(0,0,iw,ih);L=c}catch(e){L=src}litC.set(src,L);return L}
function drawParticles(dt){
particles=particles.filter(p=>p.life>0);
particles.forEach(p=>{
p.life-=dt; p.x+=p.vx*dt; p.y+=p.vy*dt;
if(p.type==='px'){ctx.globalAlpha=Math.min(1,p.life*2)*(Math.random()<.2?.25:1);ctx.fillStyle=p.c;ctx.fillRect(Math.round(p.x),Math.round(p.y),p.s,p.s*(Math.random()<.3?.4:1));ctx.globalAlpha=1}
else if(p.type==='suck'){ctx.globalAlpha=Math.min(1,p.life*6)*.55;ctx.strokeStyle='rgba(225,245,255,.9)';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-p.vx*.025,p.y-p.vy*.025);ctx.stroke();ctx.globalAlpha=1}
else if(p.type==='ring'){const k=1-p.life/p.l0;ctx.strokeStyle='rgba(230,250,255,'+(.55*(1-k))+')';ctx.lineWidth=1.4;ctx.beginPath();ctx.ellipse(p.x,p.y,4+k*26,1.5+k*5,0,0,7);ctx.stroke()}
else if(p.type==='crumb'){p.vy+=(14-p.vy)*Math.min(1,dt*3);ctx.globalAlpha=Math.min(1,p.life*1.6);ctx.fillStyle=p.c||'#d99a4e';ctx.fillRect(p.x-1,p.y-1,2,2);ctx.globalAlpha=1}
else if(p.type==='sand'){p.vx*=1-dt*2;p.vy+=(4-p.vy)*Math.min(1,dt*2.5);ctx.globalAlpha=Math.min(.75,p.life*.8);ctx.fillStyle='#e8d6a8';ctx.beginPath();ctx.arc(p.x,p.y,p.r||1.6,0,7);ctx.fill();ctx.globalAlpha=1}
else if(p.type==='confetti'){p.vy+=520*dt;p.vx*=1-1.2*dt;p.r+=p.vr*dt;ctx.save();ctx.globalAlpha=Math.min(1,p.life);ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.fillStyle=p.c;ctx.fillRect(-4,-2.5,8,5);ctx.restore()}
else if(p.type==='zz'){const a=Math.min(1,p.life*.7);ctx.globalAlpha=a;ctx.fillStyle='#e6f0ff';ctx.font='italic 800 '+Math.round((10+(2.6-p.life)*5)*p.s)+'px system-ui';ctx.fillText(p.s>1?'Z':'z',p.x,p.y);ctx.globalAlpha=1}
else if(p.type==='heart'){const im=eimg('❤️'),s=12+p.life*8;if(im){ctx.globalAlpha=Math.max(0,Math.min(1,p.life));ctx.drawImage(im,p.x-s/2,p.y-s*.8,s,s);ctx.globalAlpha=1}}
else { ctx.fillStyle=p.type==="food"?"#ffce65":"#fff"; ctx.globalAlpha=Math.min(1,p.life); ctx.beginPath(); ctx.arc(p.x,p.y,3,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1; }
});
ctx.globalAlpha=1;
drawFood();
}
const cdMap=new Map(),STEP=1/120,BX0=PORT?45:Math.round(W*.085),BX1=W-BX0,BY0=H*(PORT?.17:.2),BY1=H*(PORT?.73:.76);
// [azami hız px/sn, ivme px/sn², derinlik min, derinlik max (0=yüzey), sürü, çeviklik] — tür profilleri
const PH={koi:[45,70,.15,.8,0,.8],arowana:[60,100,.2,.8,0,1],boxfish:[32,55,.25,.85,0,.7],napo:[42,70,.15,.75,0,.75],neon:[95,190,.1,.7,1,1.3],guppy:[80,160,.15,.75,1,1.2],clown:[62,110,.3,.95,0,1],ytang:[70,115,.25,.85,0,1],gold:[48,70,.25,.95,0,.7],betta:[42,60,.2,.9,0,.6],btang:[72,120,.15,.8,0,1],angel:[55,85,.15,.75,0,.75],cichlid:[60,100,.2,.8,0,1],lion:[30,50,.25,.85,0,.7],copper:[45,80,.2,.8,0,.9],discus:[40,60,.2,.8,0,.6],trigger:[58,95,.25,.9,0,1],mandarin:[50,90,.4,.95,0,1.2],idol:[52,85,.15,.75,0,.8],emp:[50,80,.15,.75,0,.7],lantern:[95,190,.15,.7,1,1.3],hatchet:[55,120,.15,.6,1,1.1],angler:[26,45,.45,.92,0,.6],viper:[60,115,.2,.8,0,1.1],oar:[28,38,.15,.65,0,.5],dragon:[44,95,.15,.85,0,.9],tripod:[38,110,.6,.95,0,1.2],lancet:[78,125,.15,.7,0,1],piranha:[70,130,.3,.8,1,1.2],peacock:[60,110,.2,.8,0,1.1],bichir:[30,60,.8,1,0,.8],eel:[32,55,.5,.95,0,.7],mahseer:[62,95,.2,.75,0,.9],gar:[40,140,.1,.5,0,1.2],goliath:[70,140,.2,.7,0,1.1],mekong:[30,45,.6,.95,0,.6],sturgeon:[32,48,.75,1,0,.6],arapaima:[38,60,.1,.5,0,.7]};
let acc=0,simT=0;
function phys(f,s){if(f.vx!==undefined&&isFinite(f.vx+f.vy+f.x+f.y))return;const p=PH[s.id]||PH.clown;f.x=Math.min(BX1/W,Math.max(BX0/W,f.x||.5));f.y=Math.min(BY1/H,Math.max(BY0/H,f.y||.4));f.dir=f.dir||1;f.vx=f.dir*p[0]*.3;f.vy=0;f.tt=0;f.tx=f.x*W;f.ty=f.y*H;f.ang=0;f.fs=f.dir;f.tp=rand(0,6);f.sn=0}
function isSleepy(f){return NIGHT()&&!NOCT.includes(f.type)&&!(f.wake>simT)}
function pick(f,p){const TR=TRAIT[f.type]||TR0,sl=isSleepy(f),fw=fishW(f),fh=fishH(f),mx=PORT?Math.max(0,fw/2-80)*.6:Math.max(0,fw/2-50),my=Math.max(0,fh/2-48)*.8,bx0=BX0+mx,bx1=BX1-mx,by0=BY0+my,by1=BY1-my;f.act="";const rest=sl||Math.random()<(NOCT.includes(f.type)&&!NIGHT()?.45:(TR.rest!=null?TR.rest:.22)),x=f.x*W,y=f.y*H;f.rest=rest;f.tt=sl?rand(5,10):rest?rand(1.5,4):rand(3,9);
if(sl){f.tx=W*(.1+.8*((f.id*.7548776)%1))+rand(-20,20);f.ty=by0+(by1-by0)*(.32+.64*((f.id*.6180339)%1))}else if(rest){f.tx=x+rand(-25,25);f.ty=y+rand(-15,15)}else{let d=(Math.random()<.7)===(f.vx>=0)?1:-1;if(x<bx0+120)d=1;else if(x>bx1-120)d=-1;f.tx=x+d*rand(90,300)*(TR.patrol?1.8:1);const z=TR.z||[p[2],p[3]];f.ty=Math.random()<.3?y+rand(-50,50):by0+(by1-by0)*rand(z[0],z[1]);if(TR.patrol){f.tx=x<W/2?bx1-rand(0,30):bx0+rand(0,30);f.tt=rand(6,11)}if(TR.home){if(f.home==null)f.home=homeSpot(f);f.tx=f.home+rand(-75,75)}}
f.tx=Math.min(bx1,Math.max(bx0,f.tx));f.ty=Math.min(by1,Math.max(by0,f.ty));if(!sl&&!rest&&!TR.patrol&&!TR.home){const d=f.tx>=x?1:-1,z=TR.z||[p[2],p[3]],c0=[f.tx,f.ty];[f.tx,f.ty]=bestSpot(f,3,()=>c0.used?[Math.min(bx1,Math.max(bx0,x+d*rand(90,300))),Math.min(by1,Math.max(by0,by0+(by1-by0)*rand(z[0],z[1])))]:(c0.used=1,c0))}if(!sl&&!rest)traitPick(f,TR,fw,fh,bx0,bx1)}
let gridG=null,gridArr=null,gridN=0,gridT=0,obsKey="",obsC=null;
function physics(h){
const fs=state.fish,n=fs.length,coll=isColl(state.tank);simT+=h;let G=null;coinStep(h);
fs.forEach(f=>phys(f,getSpecies(f.type)));
if(n>10){if(!gridG||gridArr!==fs||gridN!==n||(++gridT)%4===0){gridArr=fs;gridG=new Map();fs.forEach(f=>{const k=((f.x*W/170)|0)+((f.y*H/170)|0)*10,a=gridG.get(k);a?a.push(f):gridG.set(k,[f])});gridN=n}G=gridG}
const okey=state.decor.map(d=>d.x+","+d.y).join(";")+"|"+state.props.join()+"|"+JSON.stringify(state.propPos)+"|"+(state.chest?state.chest.x:"-")+"|"+curWater();if(okey!==obsKey||!obsC){obsKey=okey;obsC=state.decor.map(d=>[d.x*W,decY(d)-14,34]);PROPS.forEach(p=>{if(pk(p.id)&&propsHere()){const cp=state.propPos[p.id];obsC.push(cp?[cp.x*W,cp.y-26*p.sc-10,48*p.sc]:[p.x*W,FLOOR+p.dy*.5-14,48*p.sc])}});if(state.chest)obsC.push([state.chest.x*W,FLOOR-8,50])}const obs=obsC;
for(const f of fs){
const s=getSpecies(f.type),p=PH[s.id]||PH.clown,ps=f.personality==="Hareketli"?1.3:f.personality==="Utangaç"?.8:f.personality==="Uysal"?.9:1,yg=Math.min(1,f.age),
sz=fsz(f),sl=isSleepy(f),nm=NOCT.includes(f.type)?(NIGHT()?1.2:.8):1,vmax=p[0]*ps*nm*(sl?.3:1)*(f.sick?.55:1)*(f.hunger<15?.8:1)*(1.15-.25*yg),A=p[1]*p[5]*(sl?.4:1)*(1.2-.3*yg);
if(sl!==!!f.slp){f.slp=sl;f.tt=0}
let x=f.x*W,y=f.y*H,ax=0,ay=0,cruise=vmax*.8,food=null;const fw=fishW(f),fh=fishH(f),mx=PORT?Math.max(0,fw/2-80)*.6:Math.max(0,fw/2-50),my=Math.max(0,fh/2-48)*.8,bx0=BX0+mx,bx1=BX1-mx,by0=BY0+my,by1=BY1-my;
if(!isFinite(x+y+f.vx+f.vy)){f.x=.5;f.y=.4;f.vx=f.vy=0;continue}
// yem algısı: ağız noktası, türe göre beslenme bölgesi, büyük balığın önceliği
const TR=TRAIT[f.type]||TR0,mo=f.dir||1,MOq=mouthOf(f),mx0=f._mx!=null&&Math.abs(f._mx-x)<fw?f._mx:x+mo*fw*(MOq[0]-.5),my0=f._my!=null&&Math.abs(f._my-y)<fh?f._my:y+fh*(MOq[1]-.5);gillStep(f);let bm=1;if(f.burst>0){f.burst-=h;bm=1.75}if(f.gulp>0)f.gulp-=h;
if(drops.length&&f.hunger<95&&(!sl||f.hunger<35)&&!(f.spitT>simT)){let best=1e9;const R=(130+(100-f.hunger)*2.6)*(TR.sense||1);for(const d of drops){if(d.eaten||d.ph==="fall"||(d.sk&&d.sk!==f))continue;const wz=zoneW(TR.feed,d);if(wz<=0||(f.hunger>55&&wz<.45))continue;if(d.by&&d.by!==f.id&&simT-d.ct<.35&&f.hunger>35&&d.bsz>fw*1.1)continue;const q=Math.hypot(d.x-mx0,d.y-my0)/wz;if(q<R&&q<best){best=q;food=d}}}
if(food){if(!food.by||food.by===f.id||simT-food.ct>.35||fw>food.bsz*1.1){food.by=f.id;food.bsz=fw}if(food.by===f.id)food.ct=simT;const fd=food.x>=x?1:-1;
f.tx=food.x-fd*fw*.42;f.ty=(food.ph==="surf"?Math.max(food.y+fh*.12,SURF+6):food.y+(food.ph==="sink"?food.vy*.35:0))-fh*.06;f.rest=false;f.tt=1;f.act="";cruise=vmax*(.65+.45*(1-f.hunger/100))*(TR.lunge&&simT-f.lt>2?1.3:1);
if(Math.abs(food.x-x)<95&&mo!==fd&&Math.abs(food.y-y)<90)f.dir=fd;const dm=Math.hypot(food.x-mx0,food.y-my0);if(dm<(TR.lunge?110:65)&&mo===fd){if(!(f.burst>0)&&simT-(f.lt||0)>.6){f.burst=TR.lunge?.32:.2;f.lt=simT}}
// emme: ağız yeme yeterince yakın ve hizalıysa çene açılır, yem suyla birlikte içeri çekilir
{const SR=Math.max(16,fw*.2)*(TR.lunge?1.25:1)*(f.type==="angler"?1.9:1)+food.r0;if(!food.sk&&dm<SR&&mo===fd&&simT>(f.biteT||0)){f.biteT=simT+(fw<70?.42:.3)+(f.type==="angler"?.5:0);if(f.type!=="angler"&&Math.random()<.08&&food.ph!=="floor"){food.vx+=mo*rand(25,45);food.vy+=rand(-15,15);f.jawT=simT;f.jawA=.5;f.jawH=.06}else{suckStart(f,food);if(f.type==="angler")f.burst=.15}}}}
else{if(behave(f,TR,x,y,fw,fh,mx0,my0,h,p,bx0,bx1,by0,by1))cruise=vmax*.9;f.tt-=h;if(f.tt<=0||(!f.rest&&f.act!=="graze"&&f.act!=="forage"&&Math.hypot(f.tx-x,f.ty-y)<18))pick(f,p)}
// varışa yavaşlayarak yönelme (dikey ivme daha düşük)
const deep=(food&&food.ph==="floor")||f.act==="forage",by1e=deep?Math.max(by1,FLOOR+6-fh*.22):by1,by0e=(food&&food.ph==="surf")||f.act==="beg"||f.act==="air"?Math.min(by0,SURF+fh*.12):by0;const dx=f.tx-x,dy=f.ty-y,dist=Math.hypot(dx,dy)||1,want=food?bm*cruise*Math.max(.35,Math.min(1,dist/35)):bm*f.rest&&!sl?Math.min(cruise*.25,dist*.8):cruise*Math.min(1,dist/90);
// komşular: ayrılma + (uygun türlerde) sürü uyumu/merkezleme
let cand=fs;if(G){cand=[];const cx=(x/170)|0,cy=(y/170)|0;for(let i=-1;i<2;i++)for(let j=-1;j<2;j++){const a=G.get(cx+i+(cy+j)*10);if(a)for(const o of a)cand.push(o)}}
let sx=0,sy=0,cx2=0,cy2=0,mvx=0,mvy=0,c=0;
for(const o of cand){if(o===f)continue;const ox=o.x*W-x,oy=o.y*H-y,d=Math.hypot(ox,oy);if(d>170||d<.01)continue;const de=Math.hypot(ox,oy*1.6),R=Math.min(170,(fw+fishW(o))*(food?.3:.42)+4);if(de<R){const k=(1-de/R)*(food?Math.min(2,Math.max(.5,fishW(o)/fw)):1);sx-=ox/d*k;sy-=oy/d*k*1.3}
if(p[4]&&o.type===f.type){cx2+=ox;cy2+=oy;mvx+=o.vx;mvy+=o.vy;c++}}
if(f.type==="betta"||f.type==="gold"||SMALL.includes(f.type)){let bd=1e9,bx=0,by=0;for(const o of fs){if(o===f)continue;const ox=o.x*W-x,oy=o.y*H-y,d=Math.hypot(ox,oy)||1;
if(f.type==="betta"&&o.type==="betta"&&d<300&&d>sz*2.2){ax+=ox/d*A*.7;ay+=oy/d*A*.5}
else if(SMALL.includes(f.type)&&o.type==="gold"&&d<140){const k=1-d/140;ax-=ox/d*A*1.4*k;ay-=oy/d*A*1.1*k}
else if(f.type==="gold"&&SMALL.includes(o.type)&&d<220&&d<bd){bd=d;bx=ox/d;by=oy/d}}
if(bd<1e9&&!food){ax+=bx*A*.35;ay+=by*A*.25}}
let dvx=dx/dist*want-f.vx,dvy=dy/dist*want*(food||deep||f.act==="air"?1:.6)+(food&&food.ph==="sink"?food.vy:0)-f.vy;const dl=Math.hypot(dvx,dvy)||1,m=Math.min(dl*3,A*bm*(bm>1?1.4:1))*(c&&!food?.6:1);ax+=dvx/dl*m;ay+=dvy/dl*m;
const sk=f.act==="air"?.3:1;ax+=sx*A*(sl?3.4:1.6)*sk;ay+=sy*A*(sl?3.4:1.6)*sk;
if(c){ax+=cx2/c/170*A*.5+(mvx/c-f.vx)*.8;ay+=cy2/c/170*A*.4+(mvy/c-f.vy)*.8}
// duvarlar ve dekorlar
const M=60;if(x<bx0+M)ax+=(bx0+M-x)/M*A*1.2;else if(x>bx1-M)ax-=(x-bx1+M)/M*A*1.2;if(y<by0e+M)ay+=(by0e+M-y)/M*A*1.2*(by0e<by0?.3:1);else if(y>by1e-M)ay-=(y-by1e+M)/M*A*1.2;
for(const o of obs){const ox=x-o[0],oy=y-o[1],d=Math.hypot(ox,oy)||1,R=o[2]+sz*.9;if(d<R){const k=1-d/R;ax+=ox/d*k*A*2.2;ay+=oy/d*k*A*2.2-k*A*.5}}
// bütünleştirme
f.vx+=ax*h;f.vy+=ay*h;f.vx-=f.vx*.35*h;f.vy-=f.vy*.35*h;
const vym=vmax*bm*(food||deep||f.act==="air"?1:.5);f.vy=Math.max(-vym,Math.min(vym,f.vy));const sp=Math.hypot(f.vx,f.vy),lim=vmax*1.15*bm;if(sp>lim){f.vx*=lim/sp;f.vy*=lim/sp}
if(!food&&Math.abs(f.vx)<1.2&&Math.abs(f.vy)<1.2&&dist<30){f.vx=f.vy=0}
x+=f.vx*h;y+=f.vy*h;
if(x<bx0){x=bx0;f.vx=Math.abs(f.vx)*.2}else if(x>bx1){x=bx1;f.vx=-Math.abs(f.vx)*.2}if(y<by0e){y=by0e;f.vy=Math.abs(f.vy)*.2}else if(y>by1e){y=by1e;f.vy=-Math.abs(f.vy)*.2}
f.x=x/W;f.y=y/H;if(f.type==="tripod"||f.type==="lancet")specStep(f,h,food,fw);if(RIVB[f.type]&&!VISIT)riverStep(f,h,food,fw,fh);
if(sl&&f.rest&&Math.random()<h*.12)particles.push({x:x+(f.dir||1)*fw*.3,y:y-fh*.35,vx:rand(3,9),vy:rand(-22,-14),life:rand(1.8,2.6),type:"zz",s:rand(.8,1.2)});
if(!VISIT&&!coll&&f.age>=MATURE&&!f.sick&&f.id!==undefined){let cd=cdMap.get(f.id);if(cd===undefined)cd=rand(15,60);cd-=h;if(cd<=0){cd=rand(45,100);spitCoin(f,x,y,fw)}cdMap.set(f.id,cd)}
// yön (histerezisli) ve görsel durum: gövde eğimi, yumuşak çevirme, kuyruk fazı
if(Math.abs(f.vx)>9&&Math.sign(f.vx)!==f.dir)f.dir=Math.sign(f.vx);
const sn=Math.min(1,Math.hypot(f.vx,f.vy)/vmax);
const tilt=(f.type==="dragon"&&f.rest&&!food?-.3:0)+(f.act==="forage"&&Math.hypot(f.tx-x,f.ty-y)<40?.42:0)+(food&&food.ph==="surf"&&Math.hypot(food.x-x,food.y-y)<70?-.3:0);f.ang+=(Math.max(-.6,Math.min(.6,Math.atan2(f.vy,Math.abs(f.vx)+25)+tilt))-f.ang)*Math.min(1,6*h);f.fs+=(f.dir-f.fs)*Math.min(1,9*h);f.tp+=h*(2+sn*11)*swimFq(f)*(sl?.4:1);f.sn=sl?sn*.45:sn}
foodStep(h)}
let lastDraw=0,ftN=0,ftS=0,ftT=0,feedOnC=null;const PRF={n:0,ph:0,fl:0,fi:0,pl:0,ot:0,all:0,ns:0,iv:0,mx:0};let adaptHold=0,kUser=0;try{kUser=+localStorage.getItem("fvK3")||0}catch(e){}function setK(v){K=v;canvas.width=Math.round(W*K);canvas.height=Math.round(H*K);try{ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality="high"}catch(e){}}
function adaptK(now,d){if(d>100||document.hidden||globalThis.__noAdapt||PT||now<adaptHold||document.querySelector("#game.glx")){ftN=0;ftS=0;return}if(!ftT)ftT=now;ftN++;ftS+=d;if(ftN>=90){const avg=ftS/ftN;ftN=0;ftS=0;if(now-ftT<4000)return;const top=Math.min(kCap,kUser>=1?Math.min(KMAX,kUser):KMAX);if(avg>26&&K>1){kCap=Math.max(1,K-.25);setK(avg>60?1:kCap);adaptHold=now+1500}else if(avg>30&&K<=1&&LQ<2){LQ++;lqGood=0;adaptHold=now+3000}else if(avg<19&&LQ>0){if(++lqGood>=4){LQ--;lqGood=0;adaptHold=now+3000}}else if(avg<18.5&&K<top&&!state.lowGfx){setK(Math.min(top,K+.25));adaptHold=now+2000}else lqGood=0}}
let kCap=9;
// sürüm 127: uyarlamalı kalite (LQ). Çözünürlük (K) en düşükteyken FPS hâlâ düşükse pahalı efektler kademeli azalır:
// LQ1: deniz karı yok, büyük parlamalar yok, dilim sayıları az, karanlık örtü ve kıvrımlar daha seyrek yenilenir
// LQ2: karanlık örtüde renkli parlama yok, haleler yok. FPS uzun süre iyi kalırsa kademe geri iner.
let LQ=0,lqGood=0;
document.addEventListener("visibilitychange",()=>{adaptHold=performance.now()+4000});
let ERRN=0,ERRL=0;
function reportErr(e,where){ERRN++;const msg=(where||"kare")+": "+(e&&e.message||String(e))+" @ "+((e&&e.stack||"").split("\n").find(l=>/:\d+:\d+/.test(l))||"").trim().slice(-60);try{localStorage.setItem("fvErr",JSON.stringify({m:msg,n:ERRN,t:Date.now(),v:(($("verNote")||{}).textContent||"")}))}catch(_){}const el=$("errNote");if(el){el.hidden=false;el.textContent="⚠️ Son hata ("+ERRN+"): "+msg}const now=performance.now();if(now-ERRL>20000){ERRL=now;try{notify("⚠️ Küçük bir hata oldu, oyun devam ediyor. Ayrıntı: Ayarlar")}catch(_){}}}
addEventListener("error",ev=>reportErr(ev.error||ev.message,"genel"));addEventListener("unhandledrejection",ev=>reportErr(ev.reason,"söz"));
function frame(now){try{gfxWatch(now)}catch(e){}try{frameBody(now)}catch(e){reportErr(e);try{ctx.setTransform(K,0,0,K,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation="source-over";ctx.filter="none"}catch(_){}requestAnimationFrame(frame)}}
function frameBody(now){if(now-lastDraw<12){requestAnimationFrame(frame);return}crkStep(now);adaptK(now,now-lastDraw);admFpsTick(now);lastDraw=now;const dt=Math.min(.05,(now-last)/1000||0);last=now;const t=now/1000;
if(now-lastAdv>1000&&!VISIT){lastAdv=now;if(state.daily&&state.daily.date!==dayKey()){dailyCheck();badges()}featureTick(Date.now());const r=advance((Date.now()-state.lastTick)/1000);if(r.dead.length){sfx("death");notify(r.dead[0]+" öldü 💀 Tankı temiz, balıkları tok tut!")}else if(r.sick){sfx("sick");notify("Bir balığın hastalandı 🤒 İlaç ver!")}if(r.dead.length||r.sick)renderUI();updateLive();if(now-lastSave>30000){lastSave=now;save(true)}}
musicTick();musUpdate();if(AU&&!state.muted&&!(ambience&&ambience.file)&&Math.random()<dt*.3)sfx("amb");
const P0=performance.now();acc+=dt*ADM.speed;let ns=0;const NSM=Math.max(4,Math.ceil(4*ADM.speed));while(acc>=STEP&&ns<NSM){physics(STEP);acc-=STEP;ns++}if(ns>=NSM)acc=0;admTick(now);const P1=performance.now();
bubbles.forEach(b=>{b.y-=b.speed*dt;b.x+=Math.sin(t+b.phase)*b.drift*dt;if(b.y<-10){b.y=H+10;b.x=rand(0,W)}});
BNDB=state.lowGfx?3:(state.fish.length>12?5:8);BNDT=LQ?60:state.fish.length>12?45:30;const OFF=state.admOff||{};ctx.setTransform(K,0,0,K,0,0);drawBackground(t);drawFloor(t);if(!OFF.crit)try{critDraw(dt)}catch(e){reportErr(e,"omurgasız")}else CPOST.length=0;const P2=performance.now();if(curWater()==="river")try{drawRiverBack(t,dt)}catch(e){reportErr(e,"nehir")}if(curWater()==="deep"&&!OFF.dark)try{drawDeepBack(t,dt);drawDeepPre(t,dt)}catch(e){reportErr(e,"derin")}if(!OFF.fish)for(const f of state.fish){try{drawFish(f,t)}catch(e){try{ctx.restore()}catch(_){}reportErr(e,"balık "+f.type)}}const P3=performance.now();if(!OFF.plants)drawPlants2(t,1);if(curWater()==="river")try{riverFx(t,dt)}catch(e){reportErr(e,"nehir")}if(curWater()==="deep")try{if(OFF.lights){EM=[];ENV=[];EMI=[];EMPI=0;LUREW=[];ISO_EYES=[]}else drawDeepLight(t)}catch(e){reportErr(e,"ışık")}else try{drawAtmo(t,dt)}catch(e){reportErr(e,"atmosfer")}const P4=performance.now();drawCoins(t);drawStatus(t);const fo=feedModeOn()&&!VISIT;if(fo!==feedOnC){feedOnC=fo;$("feed").classList.toggle("on",fo)}if(SELLM)try{drawSellTags()}catch(e){}drawParticles(dt);drawTapInfo();if(ADM.on)try{admDebug(t)}catch(e){}drawDN();
const P5=performance.now();if(admFps){PRF.n++;PRF.ph+=P1-P0;PRF.fl+=P2-P1;PRF.fi+=P3-P2;PRF.pl+=P4-P3;PRF.ot+=P5-P4;PRF.all+=P5-P0+(P0-now>0?0:0);PRF.ns+=ns}
requestAnimationFrame(frame)}
canvas.addEventListener("pointerdown",e=>{audio();startAmbience();const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*W,y=(e.clientY-r.top)/r.height*H;if(EDIT){editDown(e,x,y);return}if(SELLM){sellTap(x,y);return}if(TIBTN&&tapInfo&&tapInfo.id===TIBTN.id&&x>=TIBTN.x&&x<=TIBTN.x+TIBTN.w&&y>=TIBTN.y&&y<=TIBTN.y+TIBTN.h){renOpen(TIBTN.id);return}if(!VISIT){let cc=null,cd=1e9;for(const c of coinsLoose){const d=Math.hypot(x-c.x,y-c.y);if(d<34&&d<cd){cc=c;cd=d}}if(cc){pickCoin(cc);return}}
if(!VISIT&&feedModeOn()&&!isColl(state.tank)){dropFood(x,y,4);lastDrag=performance.now();return}
if(!VISIT&&state.chest&&Math.hypot(x-state.chest.x*W,y-FLOOR)<55){openChest();return}deepTap(x,y);if(critTap(x,y))return;let hit=null,dist=Infinity;state.fish.forEach(f=>{const s=getSpecies(f.type),fx=f.x*W,fy=f.y*H;if(Math.hypot(x-fx,y-fy)<Math.max(55,fishW(f)*.42)&&Math.hypot(x-fx,y-fy)<dist){hit=f;dist=Math.hypot(x-fx,y-fy)}});if(hit){
selectedFish=hit.id;hit.wake=simT+8;if(!VISIT){Q("tap");if((PHS[hit.type]||hit.type==="oar")&&curWater()==="deep")Q("dtap")}tapInfo={id:hit.id,until:performance.now()+3200};
for(let k=0;k<4;k++) particles.push({x:x+rand(-8,8), y:y+rand(-12,4), vx:rand(-18,18), vy:rand(-55,-15), life:rand(.9,1.6), type:"heart"});
const s=getSpecies(hit.type);
sfx("boop");
if(navigator.vibrate) navigator.vibrate(10);
}else{pop(x,y,4);sfx("bubble");curiousTap(x,y)}});
canvas.addEventListener("pointermove",e=>{if(!feedModeOn()||VISIT||!(e.buttons||e.pointerType==="touch")||performance.now()-lastDrag<90)return;lastDrag=performance.now();const r=canvas.getBoundingClientRect();dropFood((e.clientX-r.left)/r.width*W,(e.clientY-r.top)/r.height*H,1)});
document.addEventListener("visibilitychange",()=>{if(VISIT){acc=0;return}if(document.hidden){advance((Date.now()-state.lastTick)/1000);save(true);if(NET.timer){clearTimeout(NET.timer);NET.timer=0;cloudSave(true)}}else{acc=0;advance((Date.now()-state.lastTick)/1000);renderUI();checkHelps()}});
const flush=()=>{if(VISIT)endVisit();advance((Date.now()-state.lastTick)/1000);save(true)};addEventListener("pagehide",flush);window.addEventListener("beforeunload",flush);
let EDIT=null;
function ptXY(e){const r=canvas.getBoundingClientRect();return[(e.clientX-r.left)/r.width*W,(e.clientY-r.top)/r.height*H]}
function ghostAt(x,y){const gh=$("ghost");if(!gh||!EDIT||EDIT.mode!=="place")return;try{const gw=fishW({type:EDIT.arg,age:.35,mutation:"normal",sizeGrowth:0});gh.style.width=(gw/W*100).toFixed(2)+"%"}catch(e){}gh.style.backgroundImage="var(--f-"+EDIT.arg+")";gh.style.left=x/W*100+"%";gh.style.top=y/H*100+"%";gh.hidden=false}
function editStart(mode,arg){if(VISIT||EDIT)return;if(SELLM)sellModeSet(false);closeSheet();EDIT={mode,arg,sel:null,drag:false,last:null};document.body.classList.add("editing");const sp=mode==="place"?getSpecies(arg):null;$("etext").textContent=mode==="place"?"🐠 "+sp.name+": tanka dokun ya da sürükleyip bırak":"🪸 Dekorları sürükleyip istediğin yere bırak";$("ebtns").innerHTML=mode==="place"?'<button id="eCancel">İptal</button>':'<button id="eReset">↩️ Varsayılan</button><button id="eDone" class="home">✓ Bitti</button>';$("editbar").hidden=false}
function editEnd(){EDIT=null;setTimeout(tutRender,50);document.body.classList.remove("editing");$("editbar").hidden=true;$("ghost").hidden=true;renderUI();save(true)}
function bulkN(s,wt){const d=tankArr(wt);if(!d)return 0;return Math.min(5,fishCap(wt)-d.length,Math.floor(state.coins/s.price))}
function bulkBtn(s,wt){const d=tankArr(wt),room=d?fishCap(wt)-d.length:0;if(room<2)return"";const n=Math.min(5,room),ok=state.coins>=s.price*n;return`<button class="sm bulk" data-buyn="${s.id}" data-n="${n}" ${ok?"":"disabled"}>${n} al · ${(s.price*n).toLocaleString("tr-TR")} 🪙</button>`}
function buyMany(type,n){const s=getSpecies(type),wt=WATER[type];n=Math.min(n||5,bulkN(s,wt));if(n<1){sfx("error");notify("Yeterli altın ya da tankta yer yok");return}let got=[];for(let i=0;i<n;i++){const f=buy(type,null,true);if(!f||typeof f!=="object")break;got.push(f)}if(!got.length)return;sfx("buy");renderUI();save(true);const mu=got.filter(f=>mutOf(f)!=="normal").length,rr=got.filter(f=>f.rarity==="Nadir").length;notify(got.length+" "+s.name+" "+(wt===state.tank?"akvaryuma eklendi 🐟":TANKS[wt].name+" tankına eklendi "+TANKS[wt].icon)+(mu?" · "+mu+" mutasyonlu ✨":"")+(rr?" · "+rr+" parlak":""))}
function startBuy(type){const s=getSpecies(type),wt=WATER[type],dest=tankArr(wt);if(VISIT||state.tank!==wt||dest!==state.fish||(s.lv&&state.level<s.lv)||dest.length>=fishCap(wt)||state.coins<s.price){buy(type);return}editStart("place",type)}
function editDown(e,x,y){const E=EDIT;try{canvas.setPointerCapture(e.pointerId)}catch(_){}E.drag=true;E.last=[x,y];if(E.mode==="place"){ghostAt(x,y);return}
let best=null;state.decor.forEach((d,i)=>{const bx=decBox(d),dd=Math.hypot(x-d.x*W,y-(bx.y+bx.h/2));if(dd<Math.max(34,bx.w*.6)&&(!best||dd<best.dd))best={t:"d",i,dd,ax:d.x*W,ay:decY(d)}});
if(!best){let bd=1e9;for(const p of PROPS){if(!pk(p.id))continue;const b=propBox[p.id];if(!b)continue;if(x>=b.cx-b.w/2&&x<=b.cx+b.w/2&&y>=b.base-b.h&&y<=b.base+8){const dd=Math.hypot(x-b.cx,y-(b.base-b.h*.45));if(dd<bd){bd=dd;best={t:"p",id:p.id,ax:b.cx,ay:b.base}}}}}
E.sel=best?{...best,ox:best.ax-x,oy:best.ay-y}:null;if(best)sfx("click")}
function editMove(e){const E=EDIT;if(!E)return;const[x,y]=ptXY(e);if(E.mode==="place"){ghostAt(x,y);E.last=[x,y];return}if(!E.drag||!E.sel)return;const s=E.sel,ax=Math.max(.05*W,Math.min(.95*W,x+s.ox)),ay=Math.max(H*.2,Math.min(FLOOR+60,y+s.oy));if(s.t==="p")state.propPos[s.id]={x:ax/W,y:ay};else{const d=state.decor[s.i];if(d){d.x=ax/W;d.y=ay}}}
function editUp(e){const E=EDIT;if(!E||!E.drag)return;E.drag=false;if(E.mode==="place"){const[x,y]=ptXY(e);const px=Math.max(.08*W,Math.min(.92*W,x)),py=Math.max(H*.16,Math.min(FLOOR-24,y)),type=E.arg;editEnd();buy(type,{x:px,y:py});pop(px,py,6);return}E.sel=null;save(true)}
function editOverlay(){ctx.save();ctx.setLineDash([7,5]);ctx.lineWidth=2;const S=EDIT.sel;for(const p of PROPS){if(!pk(p.id))continue;const b=propBox[p.id];if(!b)continue;ctx.strokeStyle=S&&S.t==="p"&&S.id===p.id?"#ffd34d":"rgba(255,255,255,.7)";ctx.strokeRect(b.cx-b.w/2,b.base-b.h,b.w,b.h+6)}state.decor.forEach((d,i)=>{ctx.strokeStyle=S&&S.t==="d"&&S.i===i?"#ffd34d":"rgba(255,255,255,.7)";{const bx=decBox(d);ctx.strokeRect(bx.x-3,bx.y-3,bx.w+6,bx.h+6)}});ctx.restore()}
canvas.addEventListener("pointermove",editMove);canvas.addEventListener("pointerup",editUp);canvas.addEventListener("pointercancel",()=>{if(EDIT)EDIT.drag=false});
$("ebtns").addEventListener("click",e=>{if(e.target.closest("#smDone")){sellModeSet(false);sfx("click")}});$("ebtns").addEventListener("click",e=>{const b=e.target.closest("button");if(!b||!EDIT)return;audio();if(b.id==="eDone"||b.id==="eCancel")editEnd();else if(b.id==="eReset"){state.propPos={};state.decor.forEach(d=>{delete d.y});save(true)}});
const WHEEL=[{ic:"🪙",k:"c1",c:"#ffd36b",w:24},{ic:"✨",k:"xp",c:"#b99bff",w:16},{ic:"🎁",k:"chest",c:"#ff9aa8",w:12},{ic:"💰",k:"c2",c:"#ffb347",w:14},{ic:"🧽",k:"clean",c:"#7fe1d7",w:10},{ic:"🍤",k:"feed",c:"#9ad65a",w:10},{ic:"🐠",k:"fish",c:"#6fb7ff",w:5},{ic:"💎",k:"gem",c:"#3fcf8e",w:5}];
let WSPIN=false;
function wheelBase(){return 20+4*state.level}
function wheelTxt(k){const b=wheelBase();return{c1:b+" 🪙",c2:b*2+" 🪙",gem:wheelGem()+" 💎",xp:(20+state.level*2)+" XP",chest:"Hazine sandığı",clean:"Tank temizliği",feed:"Balıkları doyur",fish:"Bedava balık"}[k]}
function wheelReady(){return!(state.wheel&&state.wheel.day===dayKey())}
function wheelPay(){const W=state.wheel;if(!W||W.paid)return null;if(!WHEEL[W.idx]){W.paid=true;return null}W.paid=true;const k=WHEEL[W.idx].k,b=wheelBase();const gain=n=>{state.coins+=n;Q("earn",n)};let m;
if(k==="c1"){gain(b);m="+"+b+" 🪙"}else if(k==="c2"){gain(b*2);m="+"+b*2+" 🪙"}else if(k==="gem"){const n=wheelGem();state.gems+=n;m="Zümrüt! +"+n+" 💎"}
else if(k==="xp"){const x=20+state.level*2;addXP(x);m="+"+x+" XP"}
else if(k==="chest"){if(!state.chest){state.chest={x:rand(.12,.88)};m="Tankında hazine sandığı belirdi 🎁"}else{gain(b*2);m="Sandık zaten var, yerine +"+b*2+" 🪙"}}
else if(k==="clean"){state.dirt=0;Object.values(state.stash).forEach(o=>{if(!isColl(o.k||""))o.dirt=0});m="Tanklar tertemiz 🧽"}
else if(k==="feed"){allFish().forEach(f=>{f.hunger=100});m="Bütün balıklar doydu 🍤"}
else{const pool=species.filter(s=>spReq(s)<=state.level&&s.price<=Math.max(60,b*3)&&tankArr(WATER[s.id])&&tankArr(WATER[s.id]).length<fishCap(WATER[s.id]));const s=pool[Math.random()*pool.length|0];const f=s&&admFish(s.id,{mut:rollMutation(),size:rollSize()});if(f)m="Bedava "+s.name+" ("+TANKS[WATER[s.id]].name+")";else{gain(b*2);m="Balık için yer yok, yerine +"+b*2+" 🪙"}}
W.msg=m;sfx(k==="gem"?"legend":"ach");renderUI();save(true);badges();notify("🎡 "+m);return m}
function wheelSpin(){if(WSPIN||!wheelReady()||VISIT)return;let r=Math.random()*WHEEL.reduce((a,x)=>a+x.w,0),idx=0;for(;idx<WHEEL.length-1;idx++){if(r<WHEEL[idx].w)break;r-=WHEEL[idx].w}
const R=360*6-(idx*45+22.5)+rand(-15,15);state.wheel={day:dayKey(),idx,paid:false,rot:R%360};save(true);WSPIN=true;const el=$("wheel");el.style.transition="transform 4.4s cubic-bezier(.12,.72,.12,1)";el.style.transform="rotate("+R+"deg)";$("wspin").disabled=true;sfx("click");
setTimeout(()=>{WSPIN=false;wheelPay();if(openKey==="wheel")renderWheel()},4600)}
function renderWheel(){if(WSPIN)return;const b=$("wheelBox");if(!b)return;const W=state.wheel,used=W&&W.day===dayKey(),sum=WHEEL.reduce((a,x)=>a+x.w,0);
const grad="conic-gradient("+WHEEL.map((x,i)=>x.c+" "+i*45+"deg "+(i+1)*45+"deg").join(",")+")";
b.innerHTML='<div class="wheelbox"><div class="wptr">▼</div><div class="wheel" id="wheel" style="background:'+grad+(used?";transform:rotate("+(W.rot||0)+"deg)":"")+'">'+WHEEL.map((x,i)=>'<div class="wlbl" style="--a:'+(i*45+22.5)+'deg">'+x.ic+"</div>").join("")+'<div class="whub">🎡</div></div></div><button id="wspin" class="home"'+(used?" disabled":"")+'>'+(used?"Bugünkü hakkını kullandın":"🎡 Çevir")+'</button><p class="note" style="text-align:center">'+(used&&W.msg?"Bugün: "+W.msg+" · yarın yeniden çevirebilirsin":used?"Yarın yeniden çevirebilirsin":"Günde bir kez ücretsiz")+'</p><h4 class="sh">Ödüller</h4>'+WHEEL.map(x=>'<div class="fish-card qrow"><div class="qicon">'+x.ic+'</div><div><strong>'+wheelTxt(x.k)+'</strong></div><span class="pill">%'+Math.round(x.w/sum*100)+"</span></div>").join("");
$("wspin").onclick=()=>{audio();wheelSpin()}}
// ===== v31: rehber, açılımlar, kapasite, temalar, fotoğraf, defter ödülleri, grafik
const TUT=[{t:"🐠 Akvaryumuna hoş geldin! Balıklarına bakacak, onları büyütüp satarak para kazanacaksın.",btn:"Başlayalım"},
{t:"🍤 Önce balıklarını besle: Yemle'ye dokun, sonra tankın üstüne dokun.",el:"feed",ev:"feed"},
{t:"🛒 Yeni bir balık al: Mağaza'ya dokun, bir balık seç ve tankta istediğin yere bırak.",el:"dshop",ev:"buy"},
{t:"🎁 Balıklar büyüdükçe para biriktirir. Biriken parayı ve hazine sandıklarını soldaki hediye kutusuna (Topla) dokunarak alırsın.",el:"surprise",btn:"Anladım"},
{t:"🧽 Su zamanla kirlenir. Kirlenince Temizle'ye bas, yoksa balıkların hastalanır.",el:"clean",btn:"Anladım"},
{t:"🐟 Büyüyen balıklarını Balıklarım'dan satabilirsin. Yeni özellikler seviye atladıkça açılır. İyi eğlenceler!",el:"fishes",btn:"Bitir"}];
function tutOn(){return typeof state.tut==="number"&&state.tut<TUT.length}
function tutRender(){const el=$("tut");if(!el)return;const lv=$("lvl"),on=tutOn()&&!openKey&&!EDIT&&!VISIT&&(!lv||lv.hidden);const cur=on?TUT[state.tut].el:null;document.querySelectorAll(".tuthi").forEach(e=>{if(e.id!==cur)e.classList.remove("tuthi")});try{document.body.classList.toggle("tuton",!!on)}catch(e){}if(!on){el.hidden=true;return}const s=TUT[state.tut];if(el.dataset.step!==String(state.tut)){el.dataset.step=String(state.tut);el.innerHTML='<div class="tutn">Rehber '+(state.tut+1)+"/"+TUT.length+'</div><p>'+s.t+'</p><div class="tutb">'+(s.btn?'<button id="tutNext" class="home">'+s.btn+'</button>':'<small class="tutd">👉 Dene bakalım</small>')+'<button id="tutSkip" class="tskip">Geç</button></div>'}el.hidden=false;if(cur){const t=$(cur);if(t)t.classList.add("tuthi")}}
function tutStep(){if(!tutOn())return;state.tut++;save(true);tutRender()}
function tutEv(e){if(tutOn()&&TUT[state.tut].ev===e)setTimeout(tutStep,700)}
const UNL={questBtn:2,decor:2,mapBtn:3,prod:4,camBtn:2};
function applyUnlocks(){for(const id in UNL){const e=$(id);if(e)e.style.display=state.level>=UNL[id]?"":"none"}}
const CAP_COST=[400,900,1800,3500];
function capInfo(){const k=state.tank;if(isColl(k))return null;const u=(state.capUp||{})[k]||0,m=k==="salt"?1.5:1;return{k,u,max:u>=CAP_COST.length,cost:u>=CAP_COST.length?0:Math.round(CAP_COST[u]*m)}}
function capLabel(){const b=$("upgradeCap");if(!b)return;const c=capInfo();if(!c){b.textContent="📦 Kapasite · ana tankta";b.disabled=true;return}b.disabled=false;b.textContent=c.max?"📦 Kapasite "+fishCap(c.k)+" · MAX":"📦 Kapasite "+fishCap(c.k)+"→"+(fishCap(c.k)+2)+" · "+c.cost+" 🪙"}
function upgradeCap(){const c=capInfo();if(!c){notify("Koleksiyon tankının kapasitesi sabit");return}if(c.max){notify("Bu tank en büyük boyutta");return}if(state.coins<c.cost){sfx("error");notify("Kapasite için "+c.cost+" 🪙 gerekli");return}state.coins-=c.cost;if(!state.capUp)state.capUp={};state.capUp[c.k]=c.u+1;sfx("unlock");notify("📦 "+TANKS[c.k].name+" tankı artık "+fishCap(c.k)+" balık alıyor!");renderUI();save(true)}
const THEMES=[{id:"none",n:"Doğal",p:0,f:""},{id:"tropic",n:"Tropik",p:300,f:"saturate(1.65) brightness(1.06) contrast(1.05)"},{id:"deep",n:"Derin mavi",p:600,f:"hue-rotate(28deg) brightness(.78) saturate(1.35)"},{id:"emerald",n:"Zümrüt",p:900,f:"hue-rotate(-42deg) saturate(1.35)"},{id:"sunset",n:"Gün batımı",p:1500,f:"sepia(.55) hue-rotate(-28deg) saturate(1.7) brightness(1.02)"},{id:"pearl",n:"İnci",p:0,g:15,f:"saturate(.7) brightness(1.12) contrast(1.05) hue-rotate(-8deg)"},{id:"biolum",n:"Biyolüminesan",p:0,g:30,f:"hue-rotate(60deg) saturate(1.6) brightness(.82) contrast(1.15)"}];
let curTF=null,bgOffC=false;
function themeF(){const t=THEMES.find(x=>x.id===state.theme);return t?t.f:""}
function renderThemes(){const e=$("themes");if(!e)return;const own=state.themes||[];e.innerHTML=THEMES.map(t=>{const has=(t.p===0&&!t.g)||own.includes(t.id),cur=(state.theme||"none")===t.id;return '<div class="thm'+(cur?" cur":"")+'"><i style="filter:'+(t.f||"none")+'"></i><b>'+t.n+'</b>'+(cur?'<small>Kullanılıyor</small>':has?'<button class="sm" data-theme="'+t.id+'">Uygula</button>':(t.g?'<button class="sm gbtn" data-theme="'+t.id+'"'+(state.gems<t.g?" disabled":"")+'>'+t.g+' 💎</button>':'<button class="sm" data-theme="'+t.id+'"'+(state.coins<t.p?" disabled":"")+'>'+t.p+' 🪙</button>'))+'</div>'}).join("")}
function pickTheme(id){const t=THEMES.find(x=>x.id===id);if(!t)return;if(!state.themes)state.themes=[];if(t.g&&!state.themes.includes(id)){if(state.gems<t.g){sfx("error");notify("Yeterli zümrüt yok 💎");return}state.gems-=t.g;state.themes.push(id);sfx("unlock");notify("🎨 "+t.n+" teması alındı!")}if(t.p>0&&!state.themes.includes(id)){if(state.coins<t.p){sfx("error");return}state.coins-=t.p;state.themes.push(id);sfx("unlock");notify("🎨 "+t.n+" teması alındı!")}state.theme=id;renderUI();save(true)}
function bookAll(id){return["albino","transparent","melanistic","gold","glitch"].filter(m=>state.mutsFound.includes(m+"_"+id)).length}
function bookN(id){return["albino","transparent","melanistic"].filter(m=>state.mutsFound.includes(m+"_"+id)).length}
function bookRwd(sp){return{c:Math.round(sp.price*2),x:40}}
function bookBtn(sp){const n=bookN(sp.id),got=(state.bookRw||{})[sp.id];if(got)return'<span class="pill">✅</span>';if(n<3)return"";const r=bookRwd(sp);return'<button class="home sm" data-bookrw="'+sp.id+'">🎁 '+r.c+' 🪙</button>'}
function bookClaimable(){return species.some(sp=>bookN(sp.id)>=3&&!(state.bookRw||{})[sp.id])}
// ===== Koleksiyon kartları (sürüm 123)
// Her türün her biçimi (Normal, Albino, Transparan, Melanistik, Altın, Glitch) bir kart; bulunan hibritler ayrı kart.
// Kart, o biçim ilk kez elde edilince açılır. Tatlı / Tuzlu / Derin setlerinin normal kartları tamamlanınca ödül alınır.
const CFORM=["normal","albino","transparent","melanistic","gold","glitch"],CRAR={normal:["Yaygın",1],albino:["Nadir",2],transparent:["Çok nadir",3],melanistic:["Efsanevi",4],gold:["Mitik",5],glitch:["Bozuk Veri",6],hyb:["Hibrit",5]};
const CSET=[["fresh","🌿 Tatlı su"],["salt","🌊 Tuzlu su"],["river","🌳 Kadim Nehir"],["deep","🌌 Derin okyanus"]];let CFILT="all",COWN=false;
function cardList(){const L=[];species.forEach(sp=>{const fs=mutOK(sp.id)?CFORM:["normal"];fs.forEach(m=>L.push({sp,m,k:m+"_"+sp.id}))});
 (state.mutsFound||[]).filter(k=>k.startsWith("hyb_")).forEach(k=>{const p=k.split("_"),sp=species.find(x=>x.id===p[2]),ab=(p[1]||"").split("+");if(sp&&ab.length===2&&ab.every(x=>HYB_T.includes(x))){const P=hybPair(ab[0],ab[1]);L.push({sp,m:P[0],h:P[1],k})}});return L}
function cardOwn(c){return c.h?true:c.m==="normal"?state.discovered.includes(c.sp.id):(state.mutsFound||[]).includes(c.k)}
function cardImg(c){if(c.h){const hi=hybImg({mutation:c.m,hyb:c.h},c.sp.id);if(hi)return "url('"+hi.src+"')"}return c.m==="normal"?"var(--f-"+c.sp.id+")":"var(--m-"+c.m+"-"+c.sp.id+")"}
function cardHave(c){return allFish().filter(f=>f.type===c.sp.id&&mutOf(f)===c.m&&(hybOf(f)||null)===(c.h||null)).length}
function cardHTML(c,i,big){const own=cardOwn(c),R=CRAR[c.h?"hyb":c.m],nm=c.h?MUTS[c.m].name+" × "+MUTS[c.h].name:c.m==="normal"?"Normal":MUTS[c.m].name,nw=own&&!(state.cardSeen||[]).includes(c.k);
 return '<button class="ccard r-'+(c.h?"hyb":c.m)+(own?"":" lock")+(big?" big":"")+'" data-card2="'+c.k+'"><span class="cno">#'+(i+1)+'</span>'+(nw?'<span class="cnew">YENİ</span>':"")+'<span class="cimg" style="background-image:'+cardImg(c)+'"></span><span class="cnm">'+(own?esc(c.sp.name):"???")+'</span><span class="cfm">'+(own?nm:R[0])+'</span><span class="cst">'+"★".repeat(R[1])+'</span>'+(big&&own?'<span class="cdet">'+R[0]+" · değer "+(c.h?mutMult({mutation:c.m,hyb:c.h}):(MUTS[c.m]||MUTS.normal).mult)+"x · "+TANKS[WATER[c.sp.id]].name+"<br>Şu an sende: "+cardHave(c)+" balık</span>":"")+"</button>"}
function cardSetDone(w){return species.filter(sp=>WATER[sp.id]===w).every(sp=>state.discovered.includes(sp.id))}
function renderCards(){const box=$("cardList");if(!box)return;const L=cardList(),own=L.filter(cardOwn),rw=state.cardRw||{};
 let h='<div class="cbar"><div class="csum">🃏 '+own.length+" / "+L.length+' kart toplandı</div><div class="invrow">'+[["all","Tümü"]].concat(CSET).map(x=>'<button class="chip2'+(CFILT===x[0]?" on":"")+'" data-cf="'+x[0]+'">'+x[1]+"</button>").join("")+'<button class="chip2'+(COWN?" on":"")+'" data-cown="1">✓ Sadece bulduklarım</button></div></div>';
 h+='<div class="csets">'+CSET.map(([w,n])=>{const sp=species.filter(x=>WATER[x.id]===w),got=sp.filter(x=>state.discovered.includes(x.id)).length,done=got===sp.length;return '<div class="cset"><b>'+n+'</b><small>'+got+" / "+sp.length+" tür kartı</small>"+(rw[w]?'<em>✓ Ödül alındı</em>':done?'<button class="sm gold" data-csrw="'+w+'">🎁 5 💎 al</button>':'<i style="width:'+Math.round(got/sp.length*100)+'%"></i>')+"</div>"}).join("")+"</div>";
 const V=L.map((c,i)=>[c,i]).filter(([c])=>(CFILT==="all"||WATER[c.sp.id]===CFILT)&&(!COWN||cardOwn(c)));
 h+='<div class="cgrid">'+V.map(([c,i])=>cardHTML(c,i)).join("")+"</div>"+(V.length?"":'<p class="note">Bu filtrede kart yok.</p>');box.innerHTML=h;
 setTimeout(()=>{state.cardSeen=L.filter(cardOwn).map(c=>c.k)},1500)}
function cardClick(e){const t=e.target.closest("[data-cf],[data-cown],[data-csrw],[data-card2]");if(!t)return;const d=t.dataset;
 if(d.cf){CFILT=d.cf;renderCards()}else if(d.cown){COWN=!COWN;renderCards()}
 else if(d.csrw){const w=d.csrw;if(!cardSetDone(w)||(state.cardRw||{})[w])return;(state.cardRw||(state.cardRw={}))[w]=1;state.gems+=5;state.coins+=500;addXP(80);sfx("ach");notify("🃏 "+CSET.find(x=>x[0]===w)[1]+" kart seti tamamlandı! +5 💎 · +500 🪙");renderCards();renderUI();save(true)}
 else if(d.card2){const L=cardList(),i=L.findIndex(c=>c.k===d.card2);if(i<0)return;sfx("click");let ov=$("cardBig");if(!ov){ov=document.createElement("div");ov.id="cardBig";ov.onclick=()=>{ov.classList.remove("show")};$("game").appendChild(ov)}ov.innerHTML=cardHTML(L[i],i,true)+'<small class="chint">Kapatmak için dokun</small>';void ov.offsetWidth;ov.classList.add("show")}}
try{document.addEventListener("click",e=>{if(e.target.closest&&e.target.closest("#cardList"))cardClick(e)})}catch(e){}
function claimBook(id){const sp=species.find(s=>s.id===id);if(!sp||bookN(id)<3||(state.bookRw||{})[id])return;if(!state.bookRw)state.bookRw={};state.bookRw[id]=true;const r=bookRwd(sp);state.coins+=r.c;state.gems+=3;Q("earn",r.c);addXP(r.x);sfx("ach");notify("📖 "+sp.name+" defteri tamamlandı! +"+r.c+" 🪙 · +3 💎 · +"+r.x+" XP");renderBook();badges();save(true)}
function mktPill(id){const m=mkt(id),p=Math.round((m-1)*100);if(Math.abs(p)<3)return"";return'<span class="pill mk '+(p>0?"up":"dn")+'">'+(p>0?"📈 satış +"+p:"📉 satış "+p)+"%</span>"}
function gfxLabel(){const b=$("gfxBtn");if(b)b.textContent=state.lowGfx?"⚡ Grafik: Düşük":"✨ Grafik: Yüksek"}
function setGfx(low){state.lowGfx=low;const hi=Math.min(2,Math.max(1,Math.ceil(typeof devicePixelRatio==="number"?devicePixelRatio:1)));admSetK(low?1:hi);gfxLabel();save(true);notify(low?"⚡ Düşük grafik: daha akıcı, daha az parlama":"✨ Yüksek grafik açık")}
function shotMake(){const S2=2,c=document.createElement("canvas");c.width=W*S2;c.height=H*S2;const x=c.getContext("2d");x.scale(S2,S2);const fr=curWater()==="fresh",im=curWater()==="deep"?deepBg:curWater()==="river"?rivBg(state.night):fr?(state.night?nightF:reefF):(state.night?nightBg:reefBg);
try{x.filter=themeF()||"none"}catch(e){}if(im.complete&&im.naturalWidth)x.drawImage(im,0,0,W,H);else{x.fillStyle="#087ba3";x.fillRect(0,0,W,H)}try{x.filter="none"}catch(e){}
x.drawImage(canvas,0,0,W,H);if(dirtC&&dirtC.style&&dirtC.style.display!=="none")x.drawImage(dirtC,0,0,W,H);
const g=x.createLinearGradient(0,H-170,0,H);g.addColorStop(0,"rgba(2,30,50,0)");g.addColorStop(.5,"rgba(2,30,50,.75)");g.addColorStop(1,"rgba(2,30,50,.92)");x.fillStyle=g;x.fillRect(0,H-170,W,170);
x.textAlign="left";x.fillStyle="#fff";x.font="900 34px system-ui,sans-serif";drawEmo(x,"🐠 Akvaria",26,H-82,34);x.font="700 19px system-ui,sans-serif";x.fillStyle="#cdeefb";const n=allFish().length,mu=allFish().filter(f=>mutOf(f)!=="normal").length;
x.fillText("Seviye "+state.level+" · "+n+" balık"+(mu?" · "+mu+" mutasyonlu":"")+" · "+state.discovered.length+" tür",28,H-48);x.font="600 15px system-ui,sans-serif";x.fillStyle="#9fd3e6";x.fillText(new Date().toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"}),28,H-22);return c}
let shotC=null;
function openShot(){closeSheet();try{shotC=shotMake();$("shotimg").src=shotC.toDataURL("image/jpeg",.9);$("shotm").hidden=false;sfx("click")}catch(e){notify("Fotoğraf oluşturulamadı")}}
function shareShot(){if(!shotC)return;try{shotC.toBlob(b=>{try{const f=new File([b],"akvaria.jpg",{type:"image/jpeg"});if(navigator.canShare&&navigator.canShare({files:[f]}))navigator.share({files:[f],title:"Akvaria",text:"Akvaryumuma bak! 🐠"}).catch(()=>{});else notify("Bu cihaz doğrudan paylaşmayı desteklemiyor. Resme basılı tutup kaydedebilirsin")}catch(e){notify("Paylaşılamadı. Resme basılı tutup kaydedebilirsin")}},"image/jpeg",.9)}catch(e){}}
function dlShot(){if(!shotC)return;try{const a=document.createElement("a");a.href=shotC.toDataURL("image/jpeg",.92);a.download="akvaria-"+dayKey()+".jpg";document.body.appendChild(a);a.click();a.remove()}catch(e){notify("İndirilemedi. Resme basılı tutup kaydedebilirsin")}}
function v31Init(){$("tut").addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;audio();if(b.id==="tutNext")tutStep();else if(b.id==="tutSkip"){state.tut=99;save(true);tutRender()}});
$("upgradeCap").addEventListener("click",upgradeCap);$("themes").addEventListener("click",e=>{const b=e.target.closest("[data-theme]");if(b){audio();pickTheme(b.dataset.theme)}});
$("bookList").addEventListener("click",e=>{const b=e.target.closest("[data-bookrw]");if(b){audio();claimBook(b.dataset.bookrw)}});
$("gfxBtn").addEventListener("click",()=>{audio();setGfx(!state.lowGfx)});$("tutBtn").addEventListener("click",()=>{audio();state.tut=0;closeSheet();save(true);tutRender()});
$("shotBtn").addEventListener("click",()=>{audio();openShot()});$("camBtn").addEventListener("click",()=>{audio();openShot()});$("shotX").addEventListener("click",()=>{$("shotm").hidden=true});$("shotShare").addEventListener("click",shareShot);$("shotDl").addEventListener("click",dlShot)}
// ===== hareketli bitkiler
const PL={fresh:{back:[[.04,.95,150,13,0],[.09,.6,118,11,0],[.145,.9,92,10,0],[.27,.2,64,8,0],[.71,.35,78,9,0],[.83,.75,138,12,0],[.895,.15,112,11,0],[.955,.5,160,13,0]],front:[[.012,.3,265,22,0],[.065,.8,205,18,0],[.945,.4,235,20,0],[.993,.1,185,17,0]],moss:[.2,.6,.79],vine:[[.2,.34,0],[.82,.26,1]]},
salt:{back:[[.04,.95,165,15,0],[.1,.6,110,10,1],[.15,.9,90,11,0],[.28,.2,60,8,1],[.7,.35,74,9,1],[.82,.75,150,14,0],[.9,.15,104,10,1],[.96,.5,170,15,0]],front:[[.015,.3,275,24,0],[.07,.8,190,16,1],[.94,.4,250,22,0],[.992,.1,180,16,1]],moss:[.22,.62,.8],vine:[[.2,.3,0],[.82,.22,1]]}};
const PC={fresh:[["#1d4a24","#7cc04e"],["#1d4a24","#7cc04e"]],salt:[["#3b4614","#b0a83e"],["#5a1a2a","#cf5b66"]]},PCF={fresh:["#0d2614","#3a7330"],salt:["#1f2810","#6e6a26"]};
const hexC={};function rgbOf(h){return hexC[h]||(hexC[h]=[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)])}
function ncol(h,nf,a){const c=rgbOf(h),m=nf*.62,d=[10,22,46];return"rgba("+Math.round(c[0]+(d[0]-c[0])*m)+","+Math.round(c[1]+(d[1]-c[1])*m)+","+Math.round(c[2]+(d[2]-c[2])*m)+","+(a==null?1:a)+")"}
const PLB={};
function plantStrand(key,x,by,h,w,ph,t,c0,c1,nf,fs){const n=9,seg=h/n;let push=0;if(fs)for(const f of fs){const fy=f.y*H;if(fy<by-h-30||fy>by+10)continue;const d=f.x*W-x;if(Math.abs(d)<75)push+=(d>0?-1:1)*(1-Math.abs(d)/75)}
let b=PLB[key]||0;b+=(Math.max(-1,Math.min(1,push))-b)*.04;PLB[key]=b;
let px=x,py=by;const P=[[px,py]];for(let i=1;i<=n;i++){const k=i/n,a=(Math.sin(t*.85+ph+i*.42)*.11+Math.sin(t*.33+ph*2.3)*.07+b*.32)*Math.pow(k,1.15)*2.1;px+=Math.sin(a)*seg;py-=Math.cos(a)*seg;P.push([px,py])}
const L=[],R=[];for(let i=0;i<=n;i++){const p=P[i],q=P[Math.min(n,i+1)],o=P[Math.max(0,i-1)];let dx=q[0]-o[0],dy=q[1]-o[1];const l=Math.hypot(dx,dy)||1;dx/=l;dy/=l;const ww=w*.5*Math.pow(1-i/(n+.25),.62)*(i===0?.75:1);L.push([p[0]-dy*ww,p[1]+dx*ww]);R.push([p[0]+dy*ww,p[1]-dx*ww])}
const g=ctx.createLinearGradient(x,by,P[n][0],P[n][1]);g.addColorStop(0,ncol(c0,nf));g.addColorStop(.55,ncol(c1,nf,.95));g.addColorStop(1,ncol(c1,nf,.7));ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(L[0][0],L[0][1]);for(let i=1;i<=n;i++){const m=L[i-1];ctx.quadraticCurveTo(m[0],m[1],(m[0]+L[i][0])/2,(m[1]+L[i][1])/2)}ctx.lineTo(P[n][0],P[n][1]);for(let i=n;i>=1;i--){const m=R[i];ctx.quadraticCurveTo(m[0],m[1],(m[0]+R[i-1][0])/2,(m[1]+R[i-1][1])/2)}ctx.lineTo(R[0][0],R[0][1]);ctx.closePath();ctx.fill();
ctx.strokeStyle="rgba(230,255,200,"+(.22*(1-nf*.6))+")";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(L[1][0],L[1][1]);for(let i=2;i<n;i++)ctx.lineTo(L[i][0],L[i][1]);ctx.stroke();ctx.strokeStyle="rgba(255,255,240,"+(.14*(1-nf*.6))+")";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(P[0][0],P[0][1]);for(let i=1;i<n;i++)ctx.lineTo(P[i][0],P[i][1]);ctx.stroke()}
function plantVine(x,len,ph,t,nf,wat){const n=16,seg=len/n;let px=x,py=-6;const P=[[px,py]];for(let i=1;i<=n;i++){const k=i/n,a=(Math.sin(t*.6+ph*3+i*.3)*.16+Math.sin(t*.23+ph)*.08)*Math.pow(k,1.3)*1.8;px+=Math.sin(a)*seg;py+=Math.cos(a)*seg;P.push([px,py])}
ctx.strokeStyle=ncol(wat==="salt"?"#3c4a22":"#2d4a1e",nf);ctx.lineWidth=3.6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(P[0][0],P[0][1]);for(let i=1;i<=n;i++)ctx.lineTo(P[i][0],P[i][1]);ctx.stroke();
for(let i=2;i<=n;i++){const p=P[i],q=P[i-1],ang=Math.atan2(p[1]-q[1],p[0]-q[0]),sd=i%2?1:-1,sz=(12+((i*37+ph*13)%6))*(1-i/(n*1.8)),sw=Math.sin(t*1.3+i+ph)*.25;ctx.save();ctx.translate(p[0],p[1]);ctx.rotate(ang+sd*(1.05+sw));const g=ctx.createLinearGradient(0,0,sz*2,0);g.addColorStop(0,ncol(wat==="salt"?"#4f6a2a":"#2f6a26",nf));g.addColorStop(1,ncol(wat==="salt"?"#a6b14c":"#86c95a",nf));ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(sz*.9,-sz*.75,sz*2,0);ctx.quadraticCurveTo(sz*.9,sz*.75,0,0);ctx.fill();ctx.strokeStyle="rgba(20,40,10,.35)";ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(1,0);ctx.lineTo(sz*1.8,0);ctx.stroke();ctx.restore()}}
function plantMoss(x,t,nf,wat){const by=FLOOR+40;const mg=ctx.createRadialGradient(x,by-6,2,x,by,44);mg.addColorStop(0,ncol(wat==="salt"?"#7d8a34":"#5f9a3c",nf));mg.addColorStop(1,ncol(wat==="salt"?"#2c3812":"#1a3a16",nf,.0));ctx.fillStyle=mg;ctx.beginPath();ctx.ellipse(x,by-4,44,14,0,0,7);ctx.fill();ctx.lineCap="round";for(let i=0;i<34;i++){const r=Math.sin(i*91.7+x*13)*.5+.5,bx=x+(i/33-.5)*76,h=(8+r*18)*(1-Math.abs(i/33-.5)*.9),sw=Math.sin(t*1.1+i*.7+x)*3.2;ctx.strokeStyle=ncol(i%3?(wat==="salt"?"#6d7a2c":"#4f8a34"):(wat==="salt"?"#a5a548":"#8cc95a"),nf);ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(bx,by+2);ctx.quadraticCurveTo(bx+sw*.4,by-h*.6,bx+sw,by-h);ctx.stroke()}}
function drawPlants(t,front){const wat=curWater()==="salt"?"salt":"fresh",D=PL[wat],nf=nightAmt(),lo=state.lowGfx,fs=VISIT?null:state.fish;ctx.save();
if(!front){D.back.forEach((s,i)=>{if(lo&&i%2)return;const c=PC[wat][s[4]],nb=lo?1:3;for(let j=0;j<nb;j++){const k=nb===1?1:[.82,1,.68][j];plantStrand("b"+wat+i+"_"+j,s[0]*W+(j-1)*s[3]*.9,FLOOR+18+(i%3)*9,s[2]*k,s[3]*1.7,s[1]*6+j*1.9,t,c[0],c[1],nf,fs)}});if(!lo)D.moss.forEach(x=>plantMoss(x*W,t,nf,wat))}
else{D.front.forEach((s,i)=>{const c=s[4]?PC[wat][1]:[PCF[wat][0],PCF[wat][1]],nb=lo?1:2;for(let j=0;j<nb;j++){plantStrand("f"+wat+i+"_"+j,s[0]*W+(j?s[3]*.8:0),H+12,s[2]*(j?.78:1),s[3]*1.6,s[1]*6+j*2.3,t,c[0],c[1],Math.min(1,nf+.1),fs)}});D.vine.forEach(v=>plantVine(v[0]*W,v[1]*H,v[2]+1,t,nf,wat))}
ctx.restore()}
// ===== görsel bitkiler (kullanıcı çizimi)
const PLSRC={plf1:"a/ab331529fd585e08.webp",plf2:"a/4b158b3def42a880.webp",plf3:"a/d453ff3cd6a28776.webp",plf4:"a/28f78a443777eaa2.webp",plf5:"a/19b718ccfb8d8cdd.webp",plf6:"a/dffa4aa827c7ac0b.webp",plf7:"a/5b843e391feeb716.webp",plf8:"a/aa074a8185f0ef9a.webp",pls1:"a/e1faebee352a8137.webp",pls2:"a/99e76a1f45bdbf63.webp",pls3:"a/b25915ec133542d4.webp",pls4:"a/8f695394cd15876f.webp",pls5:"a/7e933cc42e7dadb4.webp",pls6:"a/11ae0fab040337a6.webp",pls7:"a/7eb315ece240b1f4.webp",pls8:"a/831ddb5c2391a796.webp"};
const PLIMG={};for(const k in PLSRC){const im=new Image();im.src=""+B64(PLSRC[k]);PLIMG[k]=im}
const PLL={fresh:{back:[{k:"plf1",x:.045,d:40,h:250,a:1},{k:"plf4",x:.15,d:26,h:212,a:.75},{k:"plf5",x:.3,d:20,h:104,a:.6},{k:"plf6",x:.44,d:66,h:40,a:.15,f:1},{k:"plf6",x:.62,d:50,h:48,a:.15},{k:"plf3",x:.8,d:24,h:200,a:.7},{k:"plf2",x:.935,d:44,h:190,a:.5}],front:[{k:"plf1",x:.03,h:330,a:1},{k:"plf5",x:.965,h:270,a:.6,f:1}],hang:[{k:"plf7",x:.23,h:.27,a:.55},{k:"plf8",x:.79,h:.24,a:.55}]},
salt:{back:[{k:"pls1",x:.05,d:40,h:270,a:.8},{k:"pls3",x:.17,d:24,h:168,a:.45},{k:"pls6",x:.42,d:62,h:46,a:.15},{k:"pls6",x:.6,d:48,h:52,a:.15,f:1},{k:"pls2",x:.72,d:22,h:140,a:.9},{k:"pls5",x:.84,d:26,h:205,a:.2},{k:"pls4",x:.945,d:44,h:170,a:.5}],front:[{k:"pls2",x:.03,h:300,a:1},{k:"pls1",x:.97,h:320,a:.8,f:1}],hang:[{k:"pls7",x:.23,h:.27,a:.5},{k:"pls8",x:.79,h:.24,a:.5}]}};
const PLC={};
function plTone(cv,mode){try{const c=cv.getContext("2d"),d=c.getImageData(0,0,cv.width,cv.height),p=d.data;for(let i=0;i<p.length;i+=4){let r=p[i],g=p[i+1],b=p[i+2];if(mode&1){r*=.56;g*=.6;b*=.66}if(mode&2){r=r*.42+6;g=g*.5+12;b=b*.62+30}p[i]=r;p[i+1]=g;p[i+2]=b}c.putImageData(d,0,0)}catch(e){}}
// sürüm 117: tuval çözünürlüğü (K) çeyrek adımlarla değişince bütün bitkiler yeniden hazırlanmasın diye tam sayıya yuvarlanır
function plCanvas(k,h,flip,mode){const im=PLIMG[k];if(!im||!im.complete||!im.naturalWidth)return null;const PK=Math.ceil(K),key=k+"|"+h+"|"+flip+"|"+mode+"|"+PK+"|"+curWater();let c=PLC[key];if(c)return c;const w=h*im.naturalWidth/im.naturalHeight;c=document.createElement("canvas");c.width=Math.max(1,Math.round(w*PK));c.height=Math.max(1,Math.round(h*PK));const x=c.getContext("2d");try{x.imageSmoothingQuality="high"}catch(e){}if(flip){x.translate(c.width,0);x.scale(-1,1)}x.drawImage(im,0,0,c.width,c.height);if(!(mode&1))grade(c,{bg:(FLOOR_AVG[curWater()]||FLOOR_AVG.fresh)[0],mix:.12,desat:.86,contrast:.92,top:.1,ao:.32});if(mode)plTone(c,mode);c.lw=w;c=gpuCopy(c);PLC[key]=c;return c}
function plDraw(id,p,cx,root,h,hang,t,nf,front,fs){const flip=!!p.f,dm=front?1:0,cv=plCanvas(p.k,h,flip,dm);if(!cv)return;const w=cv.lw,top=hang?root:root-h;
let push=0;if(fs&&p.a>.3)for(const f of fs){const fy=f.y*H;if(fy<top-20||fy>top+h+20)continue;const d=f.x*W-cx;const R=w*.5+40;if(Math.abs(d)<R)push+=(d>0?-1:1)*(1-Math.abs(d)/R)}
let b=PLB[id]||0;b+=(Math.max(-1,Math.min(1,push))-b)*.05;PLB[id]=b;const ph=cx*.031,A=p.a*h*.06;
const N=state.lowGfx?1:6,sh=h/N,ch=cv.height/N;const cvN=nf>.01?plCanvas(p.k,h,flip,dm|2):null;
if(!hang&&!front&&p.h>60){const sg=ctx.createRadialGradient(cx,root-2,0,cx,root-2,w*.45);sg.addColorStop(0,"rgba(0,18,24,"+(.32+.1*nf)+")");sg.addColorStop(1,"rgba(0,18,24,0)");ctx.save();ctx.translate(0,root-2);ctx.scale(1,.22);ctx.translate(0,-(root-2));ctx.fillStyle=sg;ctx.beginPath();ctx.arc(cx,root-2,w*.45,0,7);ctx.fill();ctx.restore()}
const DX=new Array(N+1);for(let i=0;i<=N;i++){const ym=i/N,kk=hang?ym:1-ym;DX[i]=(Math.sin(t*.9+ph+kk*1.7)+Math.sin(t*.37+ph*1.9)*.55+b*1.5)*A*Math.pow(kk,1.5)}
const pass=(c,al)=>{if(!c)return;ctx.globalAlpha=al;for(let i=0;i<N;i++){const y0=top+i*sh,s=(DX[i+1]-DX[i])/sh;ctx.setTransform(K,0,K*s,K,K*(DX[i]-s*y0),0);ctx.drawImage(c,0,i*ch,c.width,ch+(i<N-1?.5:0),cx-w/2,y0,w,sh+(i<N-1?.3:0))}ctx.setTransform(K,0,0,K,0,0)};
if(nf<.99)pass(cv,1);if(cvN&&nf>.01)pass(cvN,nf<.99?nf:1);ctx.globalAlpha=1}
function drawPlants2(t,front){if(curWater()==="deep")return;const wat=curWater()==="salt"?"salt":"fresh",L=PLL[wat],nf=nightAmt(),fs=VISIT?null:state.fish,lo=state.lowGfx;
if((state.admOff||{}).plants)return;if(!front&&PORT){L.back.forEach((p,i)=>{if(lo&&p.h<60)return;plDraw("B"+wat+i,p,p.x*W,FLOOR+p.d*LSP,p.h*LSP,0,t,nf,0,fs)})}
else{L.front.forEach((p,i)=>plDraw("F"+wat+i,p,p.x*W,H+(PORT?28:20),p.h*LSP,0,t,nf,1,fs));L.hang.forEach((p,i)=>plDraw("V"+wat+i,p,p.x*W,-14,p.h*H,1,t,nf,0,null))}}
// ===== gerçekçilik: renk eşleme + ışık + kostik
const FLOOR_AVG={fresh:[[150,160,110],[30,52,70]],salt:[[110,150,170],[24,44,90]],deep:[[40,60,110],[10,18,50]]};
function gpuCopy(c){try{const n=document.createElement("canvas");n.width=c.width;n.height=c.height;n.getContext("2d").drawImage(c,0,0);n.lw=c.lw;return n}catch(e){return c}}
function grade(cv,o){try{const c=cv.getContext("2d"),W2=cv.width,H2=cv.height,d=c.getImageData(0,0,W2,H2),p=d.data,m=o.mix,bg=o.bg,ds=o.desat,ct=o.contrast;for(let y=0;y<H2;y++){const fy=y/H2,lt=1+o.top*(1-fy)*(1-fy)-o.ao*fy*fy*fy;for(let x=0;x<W2;x++){const i=(y*W2+x)*4;if(p[i+3]===0)continue;let r=p[i],g=p[i+1],b=p[i+2];const l=r*.3+g*.59+b*.11;r=l+(r-l)*ds;g=l+(g-l)*ds;b=l+(b-l)*ds;r=128+(r-128)*ct;g=128+(g-128)*ct;b=128+(b-128)*ct;r=(r+(bg[0]-r)*m)*lt;g=(g+(bg[1]-g)*m)*lt;b=(b+(bg[2]-b)*m)*lt;p[i]=r;p[i+1]=g;p[i+2]=b}}c.putImageData(d,0,0)}catch(e){}}
let causT=null;
const causImg=Object.assign(new Image(),{src:"a/6e0aafd85a82db00.png"});
// ===== Gerçekçi su atmosferi (sürüm 114)
// Hepsi bir kez hazırlanan küçük dokulardan çizilir; her kare sadece birkaç ucuz çizim ekler.
// Işık hüzmeleri yüzeyden süzülüp yavaşça salınır · yüzeyin alt yüzü parıldar · suda asılı tanecikler derinlik verir (yakındakiler büyük ve bulanık)
// · balıklar kuma gerçek gölge düşürür (kuma yaklaştıkça koyu ve net) · kabarcıklar ışığı kırar.
let RAYT=null,SURT=null,MOTES=null,DOTS=null,SHDS=null,BUBS=null;
function sprC(w,h,fn){const c=document.createElement("canvas");c.width=w;c.height=h;fn(c.getContext("2d"),w,h);return c}
function bubSpr(){return BUBS||(BUBS=sprC(48,48,(x,w)=>{const g=x.createRadialGradient(24,24,14,24,24,23);g.addColorStop(0,"rgba(200,240,255,0)");g.addColorStop(.7,"rgba(200,240,255,.18)");g.addColorStop(.92,"rgba(235,252,255,.85)");g.addColorStop(1,"rgba(235,252,255,0)");x.fillStyle=g;x.beginPath();x.arc(24,24,23,0,7);x.fill();
 const h=x.createRadialGradient(16,15,0,16,15,7);h.addColorStop(0,"rgba(255,255,255,.95)");h.addColorStop(1,"rgba(255,255,255,0)");x.fillStyle=h;x.beginPath();x.arc(16,15,7,0,7);x.fill();x.fillStyle="rgba(255,255,255,.35)";x.beginPath();x.ellipse(31,33,4,2,-.7,0,7);x.fill()}))}
function dotSpr(){return DOTS||(DOTS=sprC(32,32,(x)=>{const g=x.createRadialGradient(16,16,0,16,16,16);g.addColorStop(0,"rgba(255,252,240,1)");g.addColorStop(.35,"rgba(240,250,255,.55)");g.addColorStop(1,"rgba(230,248,255,0)");x.fillStyle=g;x.fillRect(0,0,32,32)}))}
function shdSpr(){return SHDS||(SHDS=sprC(128,40,(x)=>{x.translate(64,20);x.scale(1,.3125);const g=x.createRadialGradient(0,0,0,0,0,64);g.addColorStop(0,"rgba(0,14,22,.9)");g.addColorStop(.45,"rgba(0,14,22,.5)");g.addColorStop(1,"rgba(0,14,22,0)");x.fillStyle=g;x.beginPath();x.arc(0,0,64,0,7);x.fill()}))}
function rayTex(){if(RAYT&&RAYT.W===W)return RAYT.c;const w=Math.ceil(W/2),h=Math.ceil(H*.92/2),c=sprC(w,h,(x)=>{let sd=7;const R=()=>{sd=(sd*16807)%2147483647;return sd/2147483647};
 for(let i=0;i<8;i++){const cx=w*(.04+.92*(i+R()*.6)/8),top=w*(.012+R()*.03),bot=top*(2.6+R()*2.6),sk=(R()-.3)*w*.22,a=.22+R()*.4;const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,"rgba(255,253,236,"+a+")");g.addColorStop(.4,"rgba(215,245,255,"+a*.42+")");g.addColorStop(1,"rgba(200,240,255,0)");x.fillStyle=g;
  for(let k=0;k<5;k++){const f=1-k*.19;x.globalAlpha=.24;x.beginPath();x.moveTo(cx-top*f,0);x.lineTo(cx+top*f,0);x.lineTo(cx+sk+bot*f,h);x.lineTo(cx+sk-bot*f,h);x.closePath();x.fill()}}});RAYT={c,W};return c}
function surTex(){if(SURT&&SURT.W===W)return SURT.c;const w=Math.ceil(W/2),h=60,c=sprC(w,h,(x)=>{let sd=11;const R=()=>{sd=(sd*16807)%2147483647;return sd/2147483647};x.lineCap="round";
 for(let i=0;i<70;i++){const y0=R()*h*.85,x0=R()*w,L=8+R()*28,a=.18+R()*.5*(1-y0/h);x.strokeStyle="rgba(240,255,255,"+a+")";x.lineWidth=.6+R()*1.4;x.beginPath();x.moveTo(x0,y0);x.quadraticCurveTo(x0+L*.5,y0+(R()-.5)*7,x0+L,y0+(R()-.5)*4);x.stroke()}
 x.globalCompositeOperation="destination-in";const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,"rgba(0,0,0,1)");g.addColorStop(1,"rgba(0,0,0,0)");x.fillStyle=g;x.fillRect(0,0,w,h)});SURT={c,W};return c}
function drawShadows(){if(state.lowGfx)return;const S=shdSpr(),nf=nightAmt(),top=60;for(const f of state.fish){if(f.dead)continue;const fy=f.y*H,hg=Math.max(0,Math.min(1,(FLOOR-fy)/(FLOOR-top))),w=fishW(f),sw=w*(.5+.55*hg),sh=sw*.24,a=(.3*(1-hg)*(1-hg)+.07)*(1-nf*.45);ctx.globalAlpha=a;ctx.drawImage(S,f.x*W+(FLOOR-fy)*.06-sw/2,FLOOR+26-sh/2,sw,sh)}ctx.globalAlpha=1}
function drawAtmo(t,dt){if(state.lowGfx||(state.admOff||{}).atmo)return;const nf=nightAmt(),day=1-nf;ctx.save();
 // ışık hüzmeleri: iki katman farklı hızda salınır, parlaklığı yüzeydeki dalgalara göre nefes alır
 const R=rayTex(),a=.62*day+.1*nf;if(a>.02){ctx.globalCompositeOperation="lighter";ctx.globalAlpha=.8*a*(.62+.22*Math.sin(t*.37)+.1*Math.sin(t*1.13));ctx.drawImage(R,Math.sin(t*.05)*W*.04,0,W,H*.92);ctx.globalAlpha=.8*a*(.42+.22*Math.sin(t*.53+2));ctx.drawImage(R,W*1.04+Math.sin(t*.071+1)*W*.06,0,-W*1.08,H*.92)}
 // yüzeyin alt yüzü: iki ters yönde kayan parıltı
 const Sf=surTex(),o1=(t*9)%W,o2=(t*-6%W+W)%W;ctx.globalCompositeOperation="lighter";ctx.globalAlpha=.32*day+.08;ctx.drawImage(Sf,o1-W,0,W,120);ctx.drawImage(Sf,o1,0,W,120);ctx.globalAlpha=.22*day+.05;ctx.drawImage(Sf,o2,8,-W,110);ctx.drawImage(Sf,o2+W,8,-W,110);
 // asılı tanecikler
 if(!MOTES){MOTES=[];for(let i=0;i<46;i++)MOTES.push({x:rand(0,W),y:rand(0,H),z:Math.pow(Math.random(),1.6),ph:rand(0,6.3),vx:rand(-2,2)})}
 const D=dotSpr();ctx.globalCompositeOperation="source-over";for(const m of MOTES){m.y+=(1.5+3*m.z)*dt;m.x+=(m.vx+Math.sin(t*.3+m.ph)*4*m.z)*dt;if(m.y>H+8){m.y=-8;m.x=rand(0,W)}if(m.x<-8)m.x=W+8;else if(m.x>W+8)m.x=-8;
  const near=m.z>.86,r=near?3.5+m.z*5:.7+m.z*2.2,al=(near?.13:.2+.4*m.z)*(.75+.25*Math.sin(t*1.7+m.ph))*(.45+.55*day);ctx.globalAlpha=al;ctx.drawImage(D,m.x-r,m.y-r,r*2,r*2)}
 ctx.restore()}
function causticTex(){if(causT!==null)return causT;if(causImg.complete&&causImg.naturalWidth){causT=causImg;return causT}return null}
let causP=null;function drawCaustics(t){if(state.lowGfx||curWater()==="deep")return;const c=causticTex();if(!c)return;if(!causP){try{causP=ctx.createPattern(c,"repeat")}catch(e){causP=false}}if(!causP)return;const nf=nightAmt(),al=.22*(1-nf*.75);if(al<.02)return;const y0=FLOOR-110,sc=600/320;ctx.save();ctx.globalCompositeOperation="lighter";ctx.fillStyle=causP;for(let L=0;L<1;L++){const ox=t*(L?-7:9),oy=t*(L?5:-4);ctx.setTransform(K*sc,0,0,K*sc,K*ox,K*oy);for(let band=0;band<3;band++){const by=y0+band*40,bh=band<2?40:H-by;ctx.globalAlpha=al*(L?.6:1)*(band===0?.35:band===1?.7:1);ctx.fillRect((0-ox)/sc,(by-oy)/sc,W/sc,bh/sc)}}ctx.restore()}
// ===== yem fiziği ve tür karakterleri
const SURF=H*.155,FOOD_ROT=25;let feedX=W/2;
const FCOL=["#e8742a","#d9a13b","#8fae3e","#c94a3a","#e0b25a"];
function mkKrill(x,ty){const y=typeof ty==="number"&&ty>SURF+18?Math.min(FLOOR-30,ty+rand(-12,12)):SURF+rand(16,46);return{x:Math.max(BX0+10,Math.min(BX1-10,x+rand(-18,18))),y,vx:rand(-25,25),vy:rand(-8,8),ph:"sink",tp:"k",hp:1.5,hp0:1.5,r0:4.6,term:14,rot:0,rs:0,sw:rand(0,6),fy:FLOOR+rand(-4,16),t:0,ft:0,eaten:false,col:"#ff9c7c",pts:[],live:rand(35,50),kick:rand(.2,.8)}}
function mkFood(x,ty){if(!VISIT&&curWater()==="deep")return mkKrill(x,ty);const fl=Math.random()<.6,pts=[];for(let i=0;i<5;i++)pts.push(.7+Math.random()*.5);const o={x:Math.max(BX0+10,Math.min(BX1-10,x+rand(-24,24))),y:SURF-rand(26,46),vx:rand(-15,15),vy:rand(20,60),ph:"fall",tp:fl?"f":"p",hp:fl?1:2,hp0:fl?1:2,r0:fl?rand(4.2,5.6):rand(3.3,4.3),term:fl?rand(18,26):rand(36,48),rot:rand(0,6),rs:rand(-3,3),sw:rand(0,6),fy:FLOOR+rand(-4,16),t:0,ft:0,eaten:false,col:fl?FCOL[Math.random()*FCOL.length|0]:"#9a5a22",pts};if(typeof ty==="number"&&ty>SURF+18){const d=o;d.y=Math.min(FLOOR-24,ty+rand(-14,14));d.x=Math.max(BX0+10,Math.min(BX1-10,x+rand(-16,16)));d.ph="sink";d.vy=rand(2,8);d.vx=rand(-10,10)}return o}
function zoneW(fz,d){const lo=d.y>H*.45;if(d.ph==="floor")return fz==="b"?1:fz==="a"?.8:fz==="m"?.25:0;if(d.ph==="surf")return fz==="s"?1:fz==="m"?.7:fz==="a"?1:.25;return fz==="s"?(lo?.35:.8):fz==="b"?(lo?.9:.45):1}
function crumbs(x,y,n,c){for(let i=0;i<n;i++)particles.push({x:x+rand(-3,3),y:y+rand(-3,3),vx:rand(-12,12),vy:rand(-10,6),life:rand(.5,.9),type:"crumb",c})}
function sandPuff(x,y,n){if(state.lowGfx)n=Math.min(n,1);for(let i=0;i<n;i++)particles.push({x:x+rand(-6,6),y:y+rand(-2,2),vx:rand(-18,18),vy:rand(-26,-8),life:rand(.7,1.2),type:"sand",r:rand(1.2,2.4)})}
function foodStep(h){drops=drops.filter(d=>!d.eaten&&!(d.ph==="floor"&&d.ft>FOOD_ROT));for(const d of drops){d.t+=h;if(d.sk){suckStep(d,h);continue}lureAttract(d,h);
if(d.tp==="k"&&d.live>0){d.live-=h;d.kick-=h;if(d.kick<=0){d.kick=rand(.35,1.3);d.vx+=rand(-38,38);d.vy+=rand(-30,22)}d.vx*=1-Math.min(1,h*1.3);d.vy+=(3-d.vy)*Math.min(1,h*1.1);d.x+=d.vx*h;d.y+=d.vy*h;if(d.y<SURF+14){d.y=SURF+14;d.vy=Math.abs(d.vy)}if(d.y>FLOOR-24){d.y=FLOOR-24;d.vy=-Math.abs(d.vy)}if(d.x<BX0+8||d.x>BX1-8)d.vx=-d.vx;if(d.live<=0){d.vy=6}}
else if(d.ph==="fall"){d.vy+=520*h;d.y+=d.vy*h;d.x+=d.vx*h;if(d.y>=SURF){d.y=SURF;d.ph="surf";d.st=d.tp==="f"?rand(1.2,2.8):rand(.2,.6);d.vy=0;d.vx*=.3;particles.push({x:d.x,y:SURF+1,vx:0,vy:0,life:.9,l0:.9,type:"ring"})}}
else if(d.ph==="surf"){d.st-=h;d.x+=d.vx*h+Math.sin(simT*.9+d.sw)*4*h;d.vx*=1-h*.8;d.y=SURF+Math.sin(simT*2.4+d.sw)*1.2;if(d.st<=0){d.ph="sink";d.vy=4}}
else if(d.ph==="sink"){d.vy+=(d.term-d.vy)*Math.min(1,h*2.2);d.y+=d.vy*h;d.x+=(d.tp==="f"?Math.sin(simT*2.6+d.sw)*16:Math.sin(simT*1.4+d.sw)*4)*h+d.vx*h;d.vx*=1-h*1.5;d.rot+=d.rs*h*(d.tp==="f"?1:.3);if(d.y>=d.fy){d.y=d.fy;d.ph="floor";d.ft=0;d.vx=0;sandPuff(d.x,d.y,2)}}
else{d.ft+=h;if(d.ft>FOOD_ROT-.05&&!d.rot2){d.rot2=1;if(!VISIT)state.dirt=Math.min(100,state.dirt+.35)}}
d.x=Math.max(BX0,Math.min(BX1,d.x))}}
function drawFood(){for(const d of drops){const a=d.ph==="floor"?Math.max(0,Math.min(1,(FOOD_ROT-d.ft)/3)):1,r=d.r0*Math.sqrt(Math.max(.2,d.hp/d.hp0));ctx.globalAlpha=a;ctx.save();ctx.translate(d.x,d.y);
if(d.tp==="k"){const sp=Math.hypot(d.vx,d.vy),dir=d.vx<0?-1:1,L=r*2.7,kk=Math.sin(simT*14+d.sw)*(d.live>0?.5:.1);ctx.scale(dir,1);ctx.rotate(Math.max(-.6,Math.min(.6,Math.atan2(d.vy,Math.abs(d.vx)+4)))*.8);ctx.fillStyle="rgba(255,150,118,.95)";ctx.beginPath();ctx.ellipse(0,0,L*.5,r*.55,0,0,7);ctx.fill();ctx.beginPath();ctx.moveTo(-L*.42,0);ctx.lineTo(-L*.78,-r*.55+kk);ctx.lineTo(-L*.78,r*.55+kk);ctx.closePath();ctx.fill();ctx.strokeStyle="rgba(255,190,160,.85)";ctx.lineWidth=.8;for(let i=0;i<3;i++){const lx=-L*.15+i*L*.18;ctx.beginPath();ctx.moveTo(lx,r*.4);ctx.lineTo(lx-1.5+Math.sin(simT*18+i+d.sw)*1.4,r*1.15);ctx.stroke()}ctx.beginPath();ctx.moveTo(L*.45,-r*.2);ctx.quadraticCurveTo(L*.8,-r*1.2,L*1.1,-r*.9+kk);ctx.stroke();ctx.fillStyle="#1a0a10";ctx.beginPath();ctx.arc(L*.32,-r*.15,.9,0,7);ctx.fill();ctx.fillStyle="rgba(150,235,255,.95)";ctx.beginPath();ctx.arc(-L*.05,r*.15,1.2+.4*Math.sin(simT*5+d.sw),0,7);ctx.fill()}
else if(d.tp==="f"){ctx.rotate(d.rot);ctx.scale(1,d.ph==="sink"?Math.max(.22,Math.abs(Math.cos(d.rot*1.7))):d.ph==="floor"?.5:.6);ctx.fillStyle=d.col;ctx.beginPath();for(let i=0;i<5;i++){const an=i/5*6.283,rr=r*d.pts[i];i?ctx.lineTo(Math.cos(an)*rr,Math.sin(an)*rr):ctx.moveTo(Math.cos(an)*rr,Math.sin(an)*rr)}ctx.closePath();ctx.fill();ctx.fillStyle="rgba(255,255,230,.28)";ctx.fillRect(-r*.4,-r*.35,r*.6,r*.3)}
else{ctx.fillStyle="#6e3c14";ctx.beginPath();ctx.arc(0,0,r,0,7);ctx.fill();ctx.fillStyle="#b7743a";ctx.beginPath();ctx.arc(-r*.25,-r*.25,r*.62,0,7);ctx.fill();ctx.fillStyle="rgba(255,235,190,.6)";ctx.beginPath();ctx.arc(-r*.38,-r*.4,r*.22,0,7);ctx.fill()}
if(d.ph==="floor"&&d.ft>8){ctx.fillStyle="rgba(70,60,20,"+Math.min(.55,(d.ft-8)/(FOOD_ROT-8)*.6)+")";ctx.beginPath();ctx.arc(0,0,r*1.05,0,7);ctx.fill()}
ctx.restore()}ctx.globalAlpha=1}
const TR0={feed:"m"};
const TRAIT={
neon:{feed:"m",z:[.25,.6],hungry:.9,txt:"Sürü hâlinde yüzer · orta suda beslenir"},
guppy:{feed:"s",z:[.05,.4],dart:1,txt:"Çok hareketli, ani atılımlar yapar · yüzeyden beslenir"},
gold:{feed:"b",z:[.45,.95],forage:1,beg:1,hungry:1.3,txt:"Dipte kumu eşeler · hep açtır, yem için yüzeye gelir"},
betta:{feed:"s",z:[.02,.3],rest:.45,txt:"Yüzeye yakın dinlenir · diğer Bettalara kabarır"},
cichlid:{feed:"m",z:[.4,.85],terr:1,home:1,txt:"Bölgesini korur, yaklaşanı kovalar"},
arowana:{feed:"s",z:[0,.18],patrol:1,lunge:1,rest:.06,sense:1.3,txt:"Yüzeyde devriye gezer · yeme ok gibi atılır"},
discus:{feed:"m",z:[.3,.7],rest:.35,txt:"Sakin ve çekingen · orta suda süzülür"},
koi:{feed:"b",z:[.4,.95],forage:1,beg:1,hungry:1.2,txt:"Ağır ağır süzülür · dipte eşelenir, yem ister"},
clown:{feed:"m",z:[.45,.9],home:1,txt:"Kendi köşesinden pek uzaklaşmaz"},
ytang:{feed:"m",z:[.3,.8],graze:1,txt:"Bitkileri ve kayaları otlar"},
btang:{feed:"m",z:[.2,.75],graze:1,dart:.5,txt:"Hareketli otlayıcı · bitkileri didikler"},
angel:{feed:"m",z:[.3,.75],graze:.6,txt:"Zarif yüzer · kayaları gagalar"},
lion:{feed:"a",z:[.35,.8],rest:.55,lunge:1,hungry:.7,txt:"Pusuya yatar, yeme ani saldırır · gece aktif"},
copper:{feed:"a",z:[.45,.9],graze:1,txt:"Uzun burnuyla kaya ve dekorları didikler"},
trigger:{feed:"m",z:[.3,.8],terr:1,txt:"Huysuzdur, yakınındakileri kovalar"},
boxfish:{feed:"m",z:[.35,.8],rest:.5,txt:"Yavaş, suda asılı durur gibi yüzer"},
mandarin:{feed:"b",z:[.85,1],forage:1,rest:.4,hungry:.8,txt:"Dipte zıplayarak dolaşır · yalnızca dipten yer · gece aktif"},
idol:{feed:"m",z:[.25,.7],graze:.7,txt:"Zarif yüzer · kayaları gagalar"},
emp:{feed:"m",z:[.3,.75],patrol:1,terr:.5,rest:.12,txt:"Bölgesinde devriye gezer"},
napo:{feed:"a",z:[.25,.75],curious:1,hungry:1.1,txt:"Meraklıdır, dokunduğun yere gelir"},
lantern:{feed:"m",z:[.2,.6],txt:"Sürü hâlinde yüzer · karnındaki ışıklar yanıp söner"},
hatchet:{feed:"s",z:[.1,.45],rest:.35,dart:.6,txt:"Suda asılı durur, küçük sıçramalar yapar"},
angler:{feed:"a",z:[.55,.9],rest:.6,lunge:1,hungry:.7,txt:"Işıklı yemiyle pusuda bekler · yeme ani saldırır"},
viper:{feed:"a",z:[.2,.7],lunge:1,dart:.4,txt:"Hızlı avcı · uzun dişleriyle yemi kapar"},
oar:{feed:"m",z:[.15,.6],patrol:1,rest:.1,txt:"Dalgalanarak süzülür · tankın boyunca devriye gezer"},
dragon:{feed:"a",z:[.2,.8],rest:.5,lunge:1,hungry:.8,txt:"Yılan gibi dalgalanarak yüzer · suda eğik asılı bekler, ışıklı çene bıyığıyla avını çeker ve canlı yeme ani atılır"},
tripod:{feed:"b",z:[.8,1],txt:"Deniz tabanında üç uzun yüzgeç ışınının üstünde akıntıya karşı durur · uzun göğüs iplikleriyle avı hisseder, yanından batan yemi yerinden kapar"},
lancet:{feed:"m",z:[.12,.65],patrol:1,dart:.4,txt:"Hızlı devriyeci · yavaşlayınca yelken gibi sırt yüzgecini açar, hızlanınca yatırır · küçük balıkları kısa süre kovalar"},
piranha:{feed:"m",z:[.3,.8],hungry:1.3,lunge:1,sense:1.5,txt:"Sürü hâlinde yüzer · yem düşünce hepsi birden üşüşür ve yemi saniyeler içinde bitirir"},
peacock:{feed:"m",z:[.2,.75],dart:.8,lunge:1,terr:.5,txt:"Hızlı avcı · ani atılımlar yapar, küçük balıkları kısa süre kovalar"},
bichir:{feed:"b",z:[.85,1],forage:1,rest:.5,txt:"Dinozor çağından kalma · dipte göğüs yüzgeçleriyle ağır ağır ilerler · ara sıra hava almak için yüzeye çıkar · gece aktif"},
eel:{feed:"b",z:[.6,1],rest:.45,txt:"Yılan gibi süzülür · arada bir elektrik boşaltır, tank bir an aydınlanır ve yakındaki balıklar irkilip kaçar · gece aktif"},
mahseer:{feed:"m",z:[.15,.7],patrol:1,rest:.08,txt:"Nehirlerin kaplanı · güçlü yüzer, tankın boyunca devriye gezer"},
gar:{feed:"a",z:[.05,.45],rest:.6,lunge:1,sense:1.4,txt:"Kütük gibi hareketsiz pusuda bekler · yeme ani bir hamleyle atılır · ara sıra yüzeyden hava yutar"},
goliath:{feed:"a",z:[.2,.7],dart:.6,lunge:1,hungry:1.2,txt:"Afrika'nın en tehlikeli avcısı · dev dişleriyle yemi kapar, küçük balıkları kısa süre kovalar"},
mekong:{feed:"b",z:[.6,.95],forage:1,rest:.3,hungry:1.1,txt:"Nazik dev · dipte ağır ağır dolaşır, kumu eşeler"},
sturgeon:{feed:"b",z:[.8,1],forage:1,rest:.15,txt:"Zırhlı dev · bıyıklarıyla dibi yoklayarak yavaşça ilerler"},
arapaima:{feed:"s",z:[.02,.45],patrol:1,rest:.1,lunge:1,txt:"Amazon'un devi · ara sıra yüzeye çıkıp hava yutar, su yüzeyi halkalanır"}};
function traitTxt(id){const t=TRAIT[id];return t?t.txt:""}
function homeSpot(f){const L=PLL[tw(state.tank)==="salt"?"salt":"fresh"].back.filter(p=>p.h>60);const s=L.length?L[(f.id*7)%L.length]:null;return s?s.x*W:W*(.2+.6*((f.id*.618)%1))}
function grazeSpot(){const pts=[];const L=PLL[tw(state.tank)==="salt"?"salt":"fresh"].back;L.forEach(p=>{if(p.h>60)pts.push([p.x*W+rand(-p.h*.15,p.h*.15),FLOOR+p.d-p.h*rand(.25,.75)])});PROPS.forEach(p=>{const b=propBox[p.id];if(pk(p.id)&&b)pts.push([b.cx+rand(-b.w*.3,b.w*.3),b.base-b.h*rand(.25,.8)])});return pts.length?pts[Math.random()*pts.length|0]:null}
function traitPick(f,TR,fw,fh,bx0,bx1){const r=Math.random();
if(TR.forage&&f.hunger<88&&r<.4){f.act="forage";f.tx=Math.min(bx1,Math.max(bx0,f.x*W+rand(-160,160)));f.ty=FLOOR+4-fh*.22;f.tt=rand(3.5,6.5)}
else if(TR.graze&&r<.32*(TR.graze||1)){const g=grazeSpot();if(g){f.act="graze";f.gx=g[0];f.gy=g[1];const sd=g[0]>=f.x*W?1:-1;f.tx=g[0]-sd*fw*.42;f.ty=g[1]-fh*.06;f.tt=rand(2.5,5)}}}
function behave(f,TR,x,y,fw,fh,mx0,my0,h,p,bx0,bx1,by0,by1){let busy=false;
if(f.act==="graze"&&Math.hypot(f.tx-x,f.ty-y)<16){busy=true;if(simT>(f.pk||0)){f.pk=simT+rand(.55,1.1);const sd=f.gx>=x?1:-1;f.vx+=sd*38;f.dir=sd;crumbs(f.gx,f.gy,2,"#7fb34a")}}
if(f.act==="forage"&&Math.hypot(f.tx-x,f.ty-y)<36){busy=true;if(simT>(f.pk||0)){f.pk=simT+rand(.7,1.3);f.vy-=16;sandPuff(mx0,Math.max(my0,FLOOR-2),2);if(Math.random()<.35)f.tx=Math.min(bx1,Math.max(bx0,x+rand(-60,60)))}}
if(TR.beg&&feedModeOn()&&f.hunger<90&&!VISIT){f.act="beg";f.rest=false;f.tx=Math.min(bx1,Math.max(bx0,feedX+((f.id%3)-1)*40));f.ty=SURF+fh*.3+8;f.tt=Math.max(f.tt,.5);busy=true}
else if(f.act==="beg")f.tt=0;
if(TR.dart&&!f.rest&&Math.random()<h*.14*TR.dart){f.burst=.25;f.tx=Math.min(bx1,Math.max(bx0,x+rand(-140,140)));f.ty=Math.min(by1,Math.max(by0,y+rand(-60,60)));f.tt=rand(1,2)}
if(TR.terr&&simT>(f.chCd||0)&&!f.rest){const c0=TR.home&&f.home!=null?f.home:x;for(const o of state.fish){if(o===f||o.type===f.type)continue;const ox=o.x*W,oy=o.y*H;if(Math.abs(ox-c0)<95&&Math.abs(oy-y)<90&&Math.random()<h*.8*(TR.terr||1)){f.chCd=simT+rand(7,13);f.chase=o;f.chT=simT+1.2;f.burst=.3;o.flee=f;o.fleeT=simT+1.3;break}}}
if(f.chase&&simT<f.chT){f.tx=f.chase.x*W;f.ty=f.chase.y*H;f.tt=.3;busy=true}else f.chase=null;
if(f.flee&&simT<f.fleeT){const ox=x-f.flee.x*W,oy=y-f.flee.y*H,d=Math.hypot(ox,oy)||1;f.tx=Math.min(bx1,Math.max(bx0,x+ox/d*140));f.ty=Math.min(by1,Math.max(by0,y+oy/d*90));f.burst=Math.max(f.burst||0,.1);f.tt=.4}else f.flee=null;
if(f.look&&simT<f.lookT){f.tx=f.look[0];f.ty=f.look[1];f.tt=.5;busy=true}else f.look=null;
return busy}
function curiousTap(x,y){for(const f of state.fish){const TR=TRAIT[f.type];if(TR&&TR.curious&&!isSleepy(f)){f.look=[Math.min(BX1,Math.max(BX0,x)),Math.min(BY1,Math.max(BY0,y))];f.lookT=simT+3.5;f.rest=false}}}
const GLX_MS=1200;function glitchFx(){const cs=["#00f6ff","#ff2bd6","#7dff4f","#ffffff"];for(let i=0;i<60;i++)particles.push({x:rand(0,W),y:rand(H*.1,H*.85),vx:rand(-60,60),vy:rand(-30,30),life:rand(.6,1.8),l0:1.8,type:"px",s:rand(3,10),c:cs[i%4]});try{const el=$("game")||document.body;el.classList.remove("glx");void el.offsetWidth;el.classList.add("glx");setTimeout(()=>el.classList.remove("glx"),GLX_MS+100)}catch(e){}if(navigator.vibrate)navigator.vibrate([20,30,20,30,20,60,80])}
function goldFx(){for(let i=0;i<90;i++)particles.push({x:W/2+rand(-60,60),y:H*.4,vx:rand(-280,280),vy:rand(-460,-140),life:rand(1.8,2.8),type:"confetti",c:["#ffd34d","#ffe98a","#f2b233","#fff6c8"][i%4],r:rand(0,6),vr:rand(-8,8)});if(navigator.vibrate)navigator.vibrate([30,40,30,40,60])}
function bootDone(){const el=document.getElementById("boot");if(!el)return;const t0=performance.now();try{bootP(86)}catch(e){}
const ims=[reefBg,reefF,nightBg,nightF].concat(state.fish.map(f=>fishImgs[f.type]).filter(Boolean));const wait=ims.map(im=>im.complete&&im.naturalWidth?Promise.resolve():(im.decode?im.decode().catch(()=>{}):new Promise(r=>{im.onload=im.onerror=r})));
const fin=()=>{try{bootP(100);clearInterval(window.__bootCreep);clearInterval(window.__bootTipT)}catch(e){}setTimeout(()=>{try{el.classList.add("out");setTimeout(()=>{try{el.remove()}catch(e){}},700)}catch(e){}},Math.max(250,700-(performance.now()-t0)))};
Promise.race([Promise.all(wait),new Promise(r=>setTimeout(r,5000))]).then(()=>setTimeout(fin,60))}
// ===== birleşik mağaza + zümrüt
let shopTab="fish",fishWat="all";
const fishCard=s=>{const wt=WATER[s.id],T=TANKS[wt];if(spLocked(s))return `<div class="fish-card locked"><div class="fish-icon"><i class="fi" style="background-image:var(--f-${s.id});filter:brightness(0) invert(1) opacity(.3)"></i></div><div><strong>???</strong><small>Henüz keşfedilmedi</small></div><span class="pill">🔒 Seviye ${spReq(s)}</span></div>`;return `<div class="fish-card"><div class="fish-icon">${icon(s)}</div><div><strong>${s.name}</strong><small><span class="tico">${tankIco(T)}</span>${T.name} · ${s.price} 🪙 · satış ~${Math.round(s.price*.92*mkt(s.id)*(ev("harvest")?1.15:1))} 🪙 </small>${traitTxt(s.id)?`<small class="trt">🧠 ${traitTxt(s.id)}</small>`:""}${mktPill(s.id)}${COMPAT[s.id]?`<small>⚠️ ${COMPAT[s.id]}</small>`:""}</div>${!hasTank(wt)?'<span class="pill">🔒 '+T.name+' tankı</span>':s.lv&&state.level<s.lv?'<span class="pill">🔒 Seviye '+s.lv+'</span>':`<div class="buyc"><button data-buy="${s.id}" ${state.coins<s.price?"disabled":""}>Al</button>${bulkBtn(s,wt)}</div>`}</div>`};
// ===== sürüm 136: yeni mağaza ızgarası + detay kartı, tanktan satış modu, tank lombozları
let SHDET=null,SELLM=false,TARM=null,TARMT=0;
function shopCell(s){const wt=WATER[s.id],T=TANKS[wt];if(spLocked(s))return `<div class="sg-c lk" data-sdet="${s.id}"><div class="sg-im sil"><i class="fi" style="background-image:var(--f-${s.id})"></i></div><b>???</b><span class="sg-p lk">🔒 Sv ${spReq(s)}</span></div>`;
 const m=Math.round((mkt(s.id)-1)*100),mk=Math.abs(m)>=3?`<span class="sg-mk ${m>0?"up":"dn"}">${m>0?"▲":"▼"}${Math.abs(m)}%</span>`:"",nw=!state.discovered.includes(s.id)?'<span class="sg-new">YENİ</span>':"",lv=s.lv&&state.level<s.lv;
 const b=!hasTank(wt)?`<span class="sg-p lk">🔒 ${T.icon}</span>`:lv?`<span class="sg-p lk">🔒 Sv ${s.lv}</span>`:`<button class="sg-p${state.coins<s.price?" no":""}" data-buy="${s.id}"><img src="a/72efd56ad0e6b600.webp" alt="">${s.price.toLocaleString("tr-TR")}</button>`;
 return `<div class="sg-c${SHDET===s.id?" sel":""}" data-sdet="${s.id}">${nw}${mk}<div class="sg-im">${icon(s)}</div><b>${s.name}</b>${b}</div>`}
function shopDetHTML(){const s=SHDET&&getSpecies(SHDET);if(!s||!species.includes(s))return"";const wt=WATER[s.id],T=TANKS[wt],lk=spLocked(s);
 if(lk)return `<div class="sd"><button class="sd-x" data-sdx="1" aria-label="Kapat">✕</button><div class="sd-im sil">${icon(s)}</div><div class="sd-b"><b>Henüz keşfedilmedi</b><small>${T.icon} ${T.name} · Seviye ${spReq(s)}'te açılır</small></div></div>`;
 const sv=Math.round(s.price*.92*mkt(s.id)*(ev("harvest")?1.15:1)),lv=s.lv&&state.level<s.lv,act=!hasTank(wt)?`<span class="sd-why">🔒 Önce ${T.name} tankını aç</span>`:lv?`<span class="sd-why">🔒 Seviye ${s.lv}'te açılır</span>`:`<button class="sd-buy" data-buy="${s.id}" ${state.coins<s.price?"disabled":""}>Al · ${s.price.toLocaleString("tr-TR")} 🪙</button>${bulkBtn(s,wt)}`;
 return `<div class="sd"><button class="sd-x" data-sdx="1" aria-label="Kapat">✕</button><div class="sd-im">${icon(s)}</div><div class="sd-b"><b>${s.name}</b><small><span class="tico">${tankIco(T)}</span>${T.name} · yetişkin satış ~${sv.toLocaleString("tr-TR")} 🪙</small>${mktPill(s.id)}${traitTxt(s.id)?`<p>🧠 ${traitTxt(s.id)}</p>`:""}${COMPAT[s.id]?`<p>⚠️ ${COMPAT[s.id]}</p>`:""}</div><div class="sd-a">${act}</div></div>`}
function shopFishRender(){const tabs=[["all","Tümü"]].concat(TKEYS.filter(k=>!isColl(k)&&(k!=="river"||riverSeen())&&(k!=="deep"||deepSeen())).map(k=>[k,TANKS[k].icon,TANKS[k].name]));if(!tabs.some(t=>t[0]===fishWat))fishWat="all";
 $("fishChips").innerHTML=tabs.map(c=>'<button class="chip2 sgt'+(fishWat===c[0]?" on":"")+'" data-fw="'+c[0]+'" title="'+(c[2]||c[1])+'">'+c[1]+(fishWat===c[0]&&c[2]?" "+c[2]:"")+"</button>").join("");
 const ks=TKEYS.filter(k=>!isColl(k)&&(fishWat==="all"||fishWat===k));let n=0;
 $("shop").innerHTML=ks.map(k=>{const T=TANKS[k],sp=species.filter(s=>WATER[s.id]===k).sort((a,b)=>a.price-b.price),got=sp.filter(s=>state.discovered.includes(s.id)).length;n+=sp.length;
  const hd='<h4 class="sg-h">'+T.icon+" "+T.name+" <small>"+got+"/"+sp.length+" keşfedildi</small></h4>";
  if(!hasTank(k))return hd+'<div class="sg-lock">🔒 Seviye '+T.lv+" · "+T.cost.toLocaleString("tr-TR")+" 🪙 ile açılır · "+sp.length+" tür</div>";
  return hd+'<div class="sg">'+sp.map(shopCell).join("")+"</div>"}).join("");
 $("shopCount").textContent=n+" tür · fiyatlar saatlik değişir · ayrıntı için balığa dokun";
 let d=$("shopDet");if(!d){try{d=document.createElement("div");d.id="shopDet";d.className="sdet";d.onclick=shopClick;const sh=$("shop");sh.parentNode.insertBefore(d,sh.nextSibling)}catch(e){return}}const dh=shopDetHTML();d.hidden=!dh;d.innerHTML=dh}
function shopClick(e){const n=e.target.closest("[data-buyn]");if(n){buyMany(n.dataset.buyn,+n.dataset.n);return}const b=e.target.closest("[data-buy]");if(b){startBuy(b.dataset.buy);return}
 if(e.target.closest("[data-sdx]")){SHDET=null;sfx("click");renderUI();return}const c=e.target.closest("[data-sdet]");if(c){SHDET=SHDET===c.dataset.sdet?null:c.dataset.sdet;sfx("click");renderUI()}}
// tanktan satış: balığın üstünde fiyat etiketi, dokununca satılır (değerliyse iki dokunuş, kilitliyse satılmaz)
function sellModeSet(on){if(on&&(VISIT||EDIT))return;SELLM=!!on;document.body.classList.toggle("selling",SELLM);const eb=$("editbar");if(SELLM){closeSheet();feedMode=0;sellArm=null;$("etext").textContent="💰 Satmak istediğin balığa dokun";$("ebtns").innerHTML='<button id="smDone" class="home">✓ Bitti</button>';eb.hidden=false}else if(!EDIT)eb.hidden=true;$("sellBtn")&&$("sellBtn").classList.toggle("on",SELLM)}
function sellTagY(f){return Math.max(SURF-6,f.y*H-fishH(f)*.5-15)}
function sellTap(x,y){let hit=null,dist=1e9;for(const f of state.fish){const d=Math.min(Math.hypot(x-f.x*W,y-f.y*H),Math.hypot(x-f.x*W,y-sellTagY(f))*1.2);if(d<Math.max(46,fishW(f)*.42)&&d<dist){hit=f;dist=d}}
 if(!hit){pop(x,y,3);return}if(isLocked(hit)){lockMsg(hit);return}
 if(isPrecious(hit)&&!(sellArm&&sellArm.id===hit.id&&sellArm.until>Date.now())){sellArm={id:hit.id,until:Date.now()+3500};sfx("click");notify("💎 Değerli balık · satmak için bir kez daha dokun");return}
 const fx=hit.x*W,fy=hit.y*H;sellArm=null;FSEL.delete(hit.id);sell(hit.id);for(let i=0;i<10;i++)particles.push({x:fx,y:fy,vx:rand(-70,70),vy:rand(-150,-50),life:rand(.6,1.1),type:"confetti",c:["#ffd34d","#ffe98a","#f2b233"][i%3],r:rand(0,6),vr:rand(-8,8)});if(navigator.vibrate)navigator.vibrate(12);if(!state.fish.length)sellModeSet(false)}
function drawSellTags(){const now=Date.now(),ci=eimg("🪙"),li=eimg("🔒");ctx.save();ctx.font='800 13px "Baloo 2",system-ui,sans-serif';ctx.textBaseline="middle";ctx.textAlign="left";
 for(const f of state.fish){const lk=isLocked(f),arm=sellArm&&sellArm.id===f.id&&sellArm.until>now,txt=lk?"":arm?"Emin misin?":saleValue(f).toLocaleString("tr-TR"),tw=lk?0:ctx.measureText(txt).width,ic=arm?0:16,w=Math.max(30,tw+ic+(txt&&ic?18:14)),h=24,x=f.x*W-w/2,y=sellTagY(f)-h/2;
  ctx.globalAlpha=lk?.75:1;ctx.fillStyle=lk?"rgba(20,36,48,.88)":arm?"#ee6a5c":"#f3c552";ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x,y,w,h,12);else ctx.rect(x,y,w,h);ctx.fill();ctx.lineWidth=1.5;ctx.strokeStyle=lk?"rgba(255,255,255,.25)":"rgba(80,40,0,.35)";ctx.stroke();
  ctx.beginPath();ctx.moveTo(f.x*W-5,y+h);ctx.lineTo(f.x*W+5,y+h);ctx.lineTo(f.x*W,y+h+5);ctx.closePath();ctx.fillStyle=lk?"rgba(20,36,48,.88)":arm?"#ee6a5c":"#f3c552";ctx.fill();
  if(lk){if(li)ctx.drawImage(li,f.x*W-8,y+4,16,16)}else{let cx=x+7;if(ic&&ci){ctx.drawImage(ci,cx,y+4,16,16);cx+=19}ctx.fillStyle=arm?"#fff":"#4a2a00";ctx.fillText(txt,cx,y+h/2+1)}}
 ctx.restore();ctx.globalAlpha=1}
// tank lombozları: her tank kendi manzarasıyla yuvarlak bir pencere, etrafındaki halka doluluğu gösterir
const TBGK={fresh:["reefF","nightF"],salt:["reef","night"],river:["reefR","nightR"],deep:["deep","deep"],cfresh:["reef","night"],coll2:["reefF","nightF"]};let TSK="";
let TOPEN=false,TOPT=0;
function tankStripRender(){const el=$("tankStrip");if(!el)return;const L=TKEYS,key=L.map(k=>k+(hasTank(k)?tankArr(k).length:"-")+"/"+fishCap(k)).join()+"|"+state.tank+"|"+!!state.night+"|"+state.level+"|"+(TARM||"")+"|"+TOPEN;if(key===TSK)return;TSK=key;el.classList.toggle("open",TOPEN);
 const bg=k=>"var(--asset-"+TBGK[k][state.night?1:0]+")",lz=(k,ic)=>`<span class="tk-r" style="--p:${(hasTank(k)?Math.min(1,tankArr(k).length/fishCap(k)):0).toFixed(3)}"><span class="tk-w" style="background-image:${bg(k)}"></span>${ic?`<i class="tk-i">${ic}</i>`:""}</span>`,C=TANKS[state.tank]||TANKS.fresh;
 el.innerHTML=`<button class="tk-tog" data-tktog="1" aria-expanded="${TOPEN}" aria-label="Tanklarım">${lz(state.tank,"")}<span class="tk-tt"><small>Tanklarım</small><b>${C.icon} ${C.name}</b></span><span class="tk-cnt">${state.fish.length}/${fishCap(state.tank)}</span><i class="tk-ar">▾</i></button><div class="tk-pan">`+L.map((k,i)=>{const T=TANKS[k],own=hasTank(k),on=state.tank===k,n=own?tankArr(k).length:0,cap=fishCap(k),full=own&&n>=cap,arm=TARM===k,lvOk=state.level>=(T.lv||0);
  const sub=own?`<span class="tk-bar"><i style="width:${Math.round(Math.min(1,n/cap)*100)}%"></i></span><em>${n}/${cap}</em>`:arm?`<em class="tk-arm">Açmak için tekrar dokun · ${T.cost.toLocaleString("tr-TR")} 🪙</em>`:`<em>${lvOk?"🔓 "+T.cost.toLocaleString("tr-TR")+" 🪙 ile aç":"🔒 Seviye "+T.lv}</em>`;
  return `<button class="tk${on?" on":""}${own?"":" lk"}${full?" full":""}${arm?" arm":""}" data-tk="${k}" style="--i:${i}">${lz(k,own?"":"🔒")}<span class="tk-tx"><b>${T.icon} ${T.name}</b><span class="tk-sub">${sub}</span></span>${on?'<i class="tk-on">●</i>':""}</button>`}).join("")+"</div>"}
function tankPanel(on){TOPEN=on==null?!TOPEN:!!on;if(!TOPEN)TARM=null;TOPT=Date.now();TSK="";tankStripRender();sfx("click")}
function tankTap(k){if(VISIT||SELLM||EDIT)return;const T=TANKS[k];if(!T)return;if(hasTank(k)){TARM=null;TOPEN=false;TSK="";if(state.tank!==k)switchTank(k);else tankStripRender();return}
 if(state.level<T.lv){TARM=null;sfx("error");notify("🔒 "+T.name+" · Seviye "+T.lv+lokEk(T.lv)+" açılır");tankStripRender();return}
 if(TARM===k&&Date.now()<TARMT){TARM=null;unlockTank(k);if(hasTank(k)){TOPEN=false;switchTank(k)}TSK="";tankStripRender();return}
 TARM=k;TARMT=Date.now()+4000;sfx("click");TSK="";tankStripRender();setTimeout(()=>{if(TARM===k&&Date.now()>=TARMT){TARM=null;TSK="";tankStripRender()}},4100)}
const TIERS=[["🌱 Başlangıç","1–100 🪙",0,100],["🐠 Gelişmiş","101–300 🪙",101,300],["👑 Nadir türler","300+ 🪙",301,1e9]];
function renderShop(){document.querySelectorAll("#shopTabs [data-st]").forEach(b=>b.classList.toggle("on",b.dataset.st===shopTab));document.querySelectorAll(".shp").forEach(e=>e.hidden=e.dataset.p!==shopTab);
$("stitle").textContent={fish:"🛒 Mağaza · Balıklar",decor:"🛒 Mağaza · Dekor",gear:"🛒 Mağaza · Ekipman",gem:"🛒 Mağaza · Özel"}[shopTab];
if(shopTab==="fish")shopFishRender();
else if(shopTab==="decor"){renderThemes();try{$("critShop").innerHTML=critShopHTML()}catch(e){}$("decorStatus").textContent=state.decor.length+" küçük dekor · "+state.props.length+"/"+PROPS.length+" özel dekor"+(propsHere()?"":" · özel dekorlar bu tankta görünmez")}
else if(shopTab==="gem")renderGemShop()}
function setShopTab(t){shopTab=t;SHDET=null;sfx("click");if(openKey!=="shop")openSheet("shop","🛒 Mağaza");else renderUI()}
function wheelGem(){return 2+Math.floor(state.level/10)}
function achGems(a){return Math.max(1,Math.min(10,Math.round(a.r/100)))}
const GEMS=[{id:"grow",ic:"🧪",n:"Büyüme iksiri",d:"Bu tanktaki bütün balıklar %30 büyür",g:4},{id:"hatch",ic:"🥚",n:"Yumurtaları hemen aç",d:"Bekleyen bütün yumurtalar anında açılır",g:2},{id:"spin",ic:"🎡",n:"Ekstra çark hakkı",d:"Günlük çarkı bir kez daha çevir",g:5},{id:"luck",ic:"🍀",n:"Şans yemi",d:"Sonraki 10 balık alımında mutasyon şansı 3 kat",g:6},{id:"heal",ic:"💊",n:"Tam bakım",d:"Bu tanktaki balıklar iyileşir ve doyar, su temizlenir",g:2},{id:"orders",ic:"📦",n:"Yeni müşteriler",d:"Bütün siparişler hemen yenilenir",g:1},{id:"coins",ic:"🪙",n:"Altın kesesi",d:"Seviyene göre altın",g:5}];
function gemCoins(){return 250+50*state.level}
function gemAvail(it){if(it.id==="hatch")return(state.eggs||[]).some(e=>e.hatchAt>Date.now())||"Bekleyen yumurta yok";if(it.id==="spin")return!wheelReady()||"Bugünkü çark hakkın zaten duruyor";if(it.id==="grow")return state.fish.some(f=>f.age<1)&&!isColl(state.tank)||"Büyüyecek balık yok";if(it.id==="orders")return state.level>=2||"Siparişler 2. seviyede açılır";if(it.id==="luck")return state.luck<=0||"Şans yemi zaten etkin ("+state.luck+" alım kaldı)";return true}
function renderGemShop(){$("gemShop").innerHTML='<div class="gemhead"><span class="gmi"></span><div><b>'+state.gems.toLocaleString("tr-TR")+' zümrüt</b><small>Seviye atlayarak, başarımlardan, günlük seriden, çarktan, siparişlerden ve nadir mutasyonlardan kazanılır.</small></div></div>'+GEMS.map(it=>{const av=gemAvail(it);const d=it.id==="coins"?"+"+gemCoins().toLocaleString("tr-TR")+" 🪙":it.d;return'<div class="fish-card qrow"><div class="qicon">'+it.ic+'</div><div><strong>'+it.n+'</strong><small>'+(av===true?d:av)+'</small></div><button class="gbtn" data-gem="'+it.id+'" '+(av!==true||state.gems<it.g?"disabled":"")+'>'+it.g+' 💎</button></div>'}).join("")}
function buyGem(id){const it=GEMS.find(x=>x.id===id);if(!it||gemAvail(it)!==true)return;if(state.gems<it.g){sfx("error");notify("Yeterli zümrüt yok 💎");return}state.gems-=it.g;let m="";
if(id==="grow"){state.fish.forEach(f=>{f.age=Math.min(1,f.age+.3)});m="🧪 Balıklar büyüdü!"}
else if(id==="hatch"){(state.eggs||[]).forEach(e=>{e.hatchAt=0});m="🥚 Yumurtalar açılıyor!"}
else if(id==="spin"){state.wheel=null;m="🎡 Yeni çark hakkı! Görevler → Çark"}
else if(id==="luck"){state.luck=10;m="🍀 Sonraki 10 balıkta mutasyon şansı 3 kat"}
else if(id==="heal"){state.fish.forEach(f=>{f.sick=false;f.health=100;f.hunger=100});state.dirt=0;m="💊 Tank tertemiz, balıklar sağlıklı"}
else if(id==="orders"){state.orders=[{wait:0},{wait:0},{wait:0}];ensureOrders(Date.now());m="📦 Yeni müşteriler geldi"}
else if(id==="coins"){const n=gemCoins();state.coins+=n;m="🪙 +"+n.toLocaleString("tr-TR")+" altın"}
sfx("unlock");notify(m+" · −"+it.g+" 💎");renderUI();badges();save(true)}
function backupCode(){try{const j=serial();return "AKV1:"+btoa(unescape(encodeURIComponent(j)))}catch(e){return""}}
function openBackup(){const t=$("bkTxt");$("bkBox").hidden=!$("bkBox").hidden;if(!$("bkBox").hidden){t.value="";$("bkMsg").textContent="Kodu kopyalayıp güvenli bir yere (Notlar gibi) kaydet. Başka cihazda bu kodu yapıştırıp Geri yükle'ye basarak devam edebilirsin."}}
function doBackupCopy(){const c=backupCode(),t=$("bkTxt");t.value=c;t.select();let ok=false;try{navigator.clipboard.writeText(c).then(()=>{$("bkMsg").textContent="✅ Yedek kodu kopyalandı. Notlar'a yapıştırıp sakla."}).catch(()=>{$("bkMsg").textContent="Kod kutuya yazıldı. Basılı tutup Kopyala'yı seç."});ok=true}catch(e){}if(!ok)$("bkMsg").textContent="Kod kutuya yazıldı. Basılı tutup Kopyala'yı seç."}
function doBackupLoad(){const v=($("bkTxt").value||"").trim();try{if(!v.startsWith("AKV1:"))throw 0;const p=JSON.parse(decodeURIComponent(escape(atob(v.slice(5)))));if(!validSave(p))throw 0;if(!confirm("Bu cihazdaki ilerleme yedekteki ilerlemeyle değiştirilecek. Emin misin?"))return;p.savedAt=Date.now();localStorage.setItem("fishvilleClassicSave3",JSON.stringify(p));window.__nosave=true;removeEventListener("pagehide",flush);removeEventListener("beforeunload",flush);location.reload()}catch(e){$("bkMsg").textContent="❌ Kod geçersiz. Tamamını kopyaladığından emin ol."}}
const TABG=[[["quest","📋 Görevler","📋 Görevler ve etkinlikler"],["ach","🏆 Başarımlar","🏆 Başarımlar"],["wheel","🎡 Çark","🎡 Günlük şans çarkı"]],[["fish","🐟 Balıklar","🐟 Balıklarım"],["cards","🃏 Kartlar","🃏 Koleksiyon kartları"],["book","📖 Defter","📖 Balık defteri"],["prod","🥚 Üretim","🥚 Üretim"]],[["map","🗺️ Tanklar","🗺️ Tanklar ve komşular"],["rank","🏅 Sıralama","🏅 Sıralama"]]];
function sTabs(k){const el=$("stabs");if(!el)return;let g=TABG.find(x=>x.some(t=>t[0]===k));if(g)g=g.filter(t=>t[0]===k||!(t[0] in UNL)||state.level>=UNL[t[0]]);el.hidden=!g;el.innerHTML=g?g.map(t=>'<button class="stab'+(t[0]===k?" on":"")+'" data-tab="'+t[0]+'" data-tt="'+t[2]+'">'+t[1]+"</button>").join(""):""}
function openSheet(k,t){if(VISIT)return;if(k==="decor"){k="shop";shopTab="decor"}sfx("click");document.querySelectorAll(".sec").forEach(e=>e.classList.toggle("on",e.dataset.k===k));$("stitle").textContent=t;openKey=k;$("sheet").classList.add("show");if(k==="book")renderBook();if(k==="cards")renderCards();renderUI();if(k==="chat")chatStart();else chatStop();if(k==="map"){renderNeighbors();giftCheck()}if(k==="rank")renderRank();if(k==="set"){netLabel();try{const ni=$("nickIn");if(ni&&document.activeElement!==ni)ni.value=state.nick||""}catch(e){}}if(k==="adm")admRender();if(k==="wheel")renderWheel();sTabs(k);navSync();tutRender()}
const NAVK={shop:"dshop",fish:"fishes",book:"fishes",prod:"fishes",ach:"achBtn",map:"mapBtn",rank:"mapBtn"};function navSync(){try{const on=openKey?NAVK[openKey]:"homeBtn";document.querySelectorAll("#nav .nv").forEach(b=>b.classList.toggle("on",b.id===on))}catch(e){}}
document.querySelectorAll("[data-sheet]").forEach(b=>b.addEventListener("click",()=>{audio();openSheet(b.dataset.sheet,b.dataset.t)}));
const closeSheet=()=>{chatStop();openKey=null;$("sheet").classList.remove("show");navSync();tutRender()};try{$("homeBtn").addEventListener("click",()=>{audio();if(openKey)closeSheet()});try{$("cureBtn").addEventListener("click",()=>{audio();cure()});$("sellBtn").addEventListener("click",()=>{audio();if(VISIT)return;if(!state.fish.length&&!SELLM){notify("Bu tankta satılacak balık yok");return}sellModeSet(!SELLM);sfx("click")});document.querySelectorAll("[data-sheet]").forEach(b=>b.addEventListener("click",()=>{if(TOPEN)tankPanel(false)},true));$("tankStrip").addEventListener("click",e=>{if(e.target.closest("[data-tktog]")){audio();tankPanel();return}const b=e.target.closest("[data-tk]");if(b){audio();tankTap(b.dataset.tk)}});document.addEventListener("pointerdown",e=>{if(TOPEN&&!e.target.closest("#tankStrip"))tankPanel(false)},true)}catch(e){}for(const id of["coinPill","gemPill"])$(id).addEventListener("click",()=>{audio();if(!VISIT&&!EDIT)setShopTab("gem")})}catch(e){}$("sclose").onclick=closeSheet;try{$("chatForm").addEventListener("submit",chatSend);nickInit()}catch(e){}$("sheet").addEventListener("pointerdown",e=>{if(e.target.id==="sheet")closeSheet()});
$("vhome").onclick=endVisit;$("vhelp").onclick=()=>{audio();helpNeighbor()};$("vtank").onclick=()=>{if(!VISIT)return;const L=nbTanks(VISIT.d);if(L.length<2)return;VISIT.tank=L[(L.indexOf(VISIT.tank)+1)%L.length];drops=[];visitTank();renderUI()};
$("surprise").addEventListener("click",()=>{audio();if(state.chest)openChest();else collect()});
const ADMIN_ID="u_LyrFB5NBQ50Xrl0WUgzi_Q";
const ADMIN_MAIL="mhmtcnylmz@gmail.com";function isAdmin(){if(NET.uid===ADMIN_ID)return true;try{const u=FB&&FB.auth.currentUser;return!!(u&&!u.isAnonymous&&u.emailVerified!==false&&String(u.email||"").toLowerCase()===ADMIN_MAIL)}catch(e){return false}}
function admVis(){const b=$("admBtn");if(b)b.hidden=!isAdmin()}
let admFps=null,admFpsT=0,admFrames=0;
function admSetK(v){setK(v);kUser=v;try{localStorage.setItem("fvK3",v)}catch(e){}}
let gpuN=null;function gpuName(){if(gpuN!==null)return gpuN;gpuN="?";try{const c=document.createElement("canvas"),g=c.getContext("webgl")||c.getContext("experimental-webgl");if(!g)gpuN="WebGL yok";else{const e=g.getExtension("WEBGL_debug_renderer_info");gpuN=String(e?g.getParameter(e.UNMASKED_RENDERER_WEBGL):g.getParameter(g.RENDERER)).slice(0,70);const l=g.getExtension("WEBGL_lose_context");if(l)l.loseContext()}}catch(e){}return gpuN}
let admLast=0;// sürüm 124: cihazda kasma testi — her katmanı sırayla 2,5 sn kapatıp FPS ölçer; hangi katmanın pahalı olduğu böylece görülür
let PT=null;
function admPerfTest(){if(PT)return;closeSheet();const keep=Object.assign({},state.admOff||{}),S=[["Isınma",{}],["Hepsi açık",{}],["Işıklar kapalı",{lights:1}],["Derin karanlık kapalı",{dark:1}],["Kıvrılma kapalı",{bend:1}],["Omurgasızlar kapalı",{crit:1}],["Bitkiler kapalı",{plants:1}],["Arka plan kapalı",{bg:1}],["Üst katmanlar kapalı",{ov:1}],["Balıklar kapalı",{fish:1}],["Hepsi kapalı",{lights:1,dark:1,bend:1,plants:1,bg:1,ov:1,fish:1,atmo:1,caust:1,props:1,crit:1}],["Hepsi açık (tekrar)",{}]];
 PT={i:-1,S,keep,res:[],n:0,t0:0};notify("⏱️ Kasma testi başladı, yaklaşık 35 sn ekrana dokunma");const step=()=>{if(PT.i>0)PT.res.push([PT.S[PT.i][0],Math.round(PT.n*1000/Math.max(1,performance.now()-PT.t0))]);PT.i++;
  if(PT.i>=PT.S.length){state.admOff=PT.keep;ptOv(false);const r=PT.res,txt=r.map(x=>x[0]+": "+x[1]+" fps").join("\n"),base=(r[0][1]+r[r.length-1][1])/2;let best=null;for(const x of r.slice(1,-3))if(!best||x[1]>best[1])best=x;state.admPerfLast={at:Date.now(),tank:state.tank,fish:state.fish.length,K,txt:txt+(best&&best[1]>base*1.3?"\n→ En pahalı katman: "+best[0].replace(" kapalı",""):"")};PT=null;save(true);openSheet("adm","🛠️ Yönetim paneli");setTimeout(()=>{try{alert("⏱️ Kasma testi ("+TANKS[state.tank].name+", "+state.fish.length+" balık, K="+K+")\n\n"+state.admPerfLast.txt)}catch(e){}},300);return}
  state.admOff=Object.assign({},PT.keep,PT.S[PT.i][1]);ptOv(!!state.admOff.ov);setTimeout(()=>{PT.n=0;PT.t0=performance.now();setTimeout(step,2200)},500)};step()}
function ptOv(off){try{if(vigEl)vigEl.style.display=off?"none":(bgSoftOn()?"":"none");if(dirtC&&dirtC.style)dirtC.style.display=off?"none":""}catch(e){}}
function admFpsTick(now){if(PT)PT.n++;if(!admFps)return;admFrames++;const iv=admLast?now-admLast:0;admLast=now;PRF.mx=Math.max(PRF.mx,iv);if(now-admFpsT>=1000){const n=Math.max(1,PRF.n),f=v=>(v/n).toFixed(1);admFps.textContent=Math.round(admFrames*1000/(now-admFpsT))+" fps · en uzun kare "+Math.round(PRF.mx)+" ms\nJS işi "+f(PRF.all)+" ms: fizik "+f(PRF.ph)+" ("+(PRF.ns/n).toFixed(1)+" adım) · zemin+dekor "+f(PRF.fl)+" · balık "+f(PRF.fi)+" · ön bitki "+f(PRF.pl)+" · diğer "+f(PRF.ot)+"\nK "+K+(LQ?" · kalite kademesi "+LQ:"")+" · balık "+state.fish.length+" · ekran "+innerWidth+"×"+innerHeight+" @"+(window.devicePixelRatio||1)+(state.lowGfx?" · düşük grafik":"")+"\nkart: "+gpuName()+((admFrames*1000/(now-admFpsT))<34&&PRF.all/n<8?"\n⚠️ İş az ama FPS düşük: tarayıcı sınırlıyor olabilir (Düşük Güç Modu / çerçeve kısıtı)":"");admFrames=0;admFpsT=now;for(const k in PRF)PRF[k]=0}}
function admFish(type,o){o=o||{};const s=getSpecies(type),wt=WATER[type];const dest=tankArr(wt);if(!dest)return null;if(!state.admNoCap&&dest.length>=fishCap(wt))return null;let mu=o.mut||"normal",hy=null;if(o.hyb&&HYB_T.includes(mu)&&HYB_T.includes(o.hyb)&&o.hyb!==mu){const P=hybPair(mu,o.hyb);mu=P[0];hy=P[1]}const f={id:state.nextId++,type,sizeTrait:o.size||"normal",mutation:mu,gene:mu!=="normal"?mu:null,age:o.age==null?.12:o.age,lifeHours:0,sizeGrowth:0,rarity:o.rare?"Nadir":"Normal",name:o.rare?"Parlak "+s.name:s.name,personality:["Meraklı","Uysal","Hareketli","Utangaç"][Math.random()*4|0],hunger:70,health:100,sick:false,x:rand(.15,.85),y:rand(.2,.8),dir:Math.random()<.5?-1:1,phase:rand(0,6)};if(hy)f.hyb=hy;noMut(f);dest.push(f);if(!state.discovered.includes(type))state.discovered.push(type);mutNote(f,s);return f}
function admShift(sec){const ms=sec*1000;(state.eggs||[]).forEach(e=>{e.hatchAt-=ms});state.chestAt-=ms;(state.orders||[]).forEach(o=>{if(!o)return;if(o.exp)o.exp-=ms;if(o.wait)o.wait-=ms});advance(sec);ensureOrders(Date.now());state.lastTick=Date.now()}
function admDone(m){renderUI();save(true);badges();notify("🛠️ "+m)}
const ADM_SEC=[
["💰 Ekonomi",[["+1.000 🪙","coins",1e3],["+100 💎","gems",100],["+100.000 🪙","coins",1e5],["Parayı sıfırla","coins0"],["+500 XP","xp",500],["Seviye +1","lvl",1],["Seviye 30","lvlset",30],["Her şeyi aç","all"]]],
["⏩ Zaman",[["+1 saat","time",3600],["+6 saat","time",21600],["+1 gün","time",86400],["+7 gün","time",604800],["Yumurtaları aç","hatch"],["Sandık çıkar","chest"],["Siparişleri yenile","orders"],["Günlük görev yenile","daily"],["Birikmiş geliri doldur","pend"]]],
["🐟 Balık",[["Hepsini yetişkin yap","adult"],["Hepsini iyileştir/doyur","heal"],["Hepsini hasta yap","sick"],["Hepsini aç yap","hungry"],["Tankı boşalt","clear"],["Her türden 1 ekle","oneEach"]]],
["🌊 Tank",[["Bütün tankları aç","tanks"],["Kirlilik 0","dirt",0],["Kirlilik 50","dirt",50],["Kirlilik 100","dirt",100]]],
["🪸 Dekor",[["Bütün özel dekorlar","props"],["Özel dekorları kaldır","propsOff"],["+5 küçük dekor","decor"],["Küçük dekorları sil","decorOff"],["Gece/gündüz","night"]]],
["📈 Pazar",[["Fiyatlar en yüksek","mkt",1.3],["Fiyatlar en düşük","mkt",.7],["Sıfırla","mkt",1]]],
["👥 Deniz 🤖",[["Deniz +7 gün","bot"],["Yardım hakkını sıfırla","botReset"],["Deniz yardım etsin","botHelp"]]],
["🏆 İlerleme",[["Tüm türleri keşfet","disc"],["Tüm mutasyonları bul","muts"],["Tüm başarımlar","ach"],["Günlük görevleri bitir","quests"],["Başarımları sıfırla","achOff"],["Çarkı sıfırla","wheelReset"]]],
["⚙️ Performans",[["⏱️ Kasma testi (35 sn)","perfTest"],["FPS göstergesi","fps"],["Bitkileri kapat/aç","off","plants"],["Dekorları kapat/aç","off","props"],["Işık desenini kapat/aç","off","caust"],["Balık çizimini kapat/aç","off","fish"],["Arka planı kapat/aç","off","bg"],["K = 1","k",1],["K = 1.5","k",1.5],["K = 2","k",2],["Otomatik kalite aç/kapa","adapt"],["Balık sınırı aç/kapa","cap"],["+20 balık (stres)","stress",20],["+40 balık (stres)","stress",40]]],
["💾 Kayıt",[["Kaydı dışa aktar","exp"],["Kaydı içe aktar","imp"],["Kaydı sıfırla","reset"]]]];
// ===== Yönetim paneli v2: sekmeli, canlı durum ekranı, balık düzenleyici, zaman/hız kontrolü, şans simülatörü,
// hata ayıklama katmanları, ekran görüntüsü modu, kayıt anlık görüntüleri ve işlem günlüğü
const ADM=(()=>{let o={};try{o=JSON.parse(localStorage.getItem("akvAdm")||"{}")}catch(e){}return{tab:o.tab||"dash",speed:1,dbg:o.dbg||{},log:[],q:"",fc:0,fps:0,fT:0,on:false}})();
function admPersist(){try{localStorage.setItem("akvAdm",JSON.stringify({tab:ADM.tab,dbg:ADM.dbg}))}catch(e){}}
const ADM_TABS=[["dash","📊 Durum"],["fish","🐠 Balıklar"],["eco","💰 Ekonomi"],["time","⏩ Zaman"],["luck","🎲 Şans"],["view","🎨 Görüntü"],["tank","🌊 Tank"],["prog","🏆 İlerleme"],["save","💾 Kayıt"],["log","📝 Günlük"]];
const ADM_TABSEC={eco:["💰 Ekonomi","📈 Pazar"],time:["⏩ Zaman","👥 Deniz 🤖"],tank:["🌊 Tank","🪸 Dekor"],prog:["🏆 İlerleme"],view:["⚙️ Performans"],fish:["🐟 Balık"],save:["💾 Kayıt"]};
const _rollMut=rollMutation;
rollMutation=function(){if(state&&state.admNextMut){const m=state.admNextMut;state.admNextMut=null;setTimeout(()=>{if(openKey==="adm")admRender()},50);return m}const x=state&&state.admMutX||1;if(x===1)return _rollMut();const sv={};for(const k in MUTS){sv[k]=MUTS[k].p;if(k!=="normal")MUTS[k].p=Math.min(.45,MUTS[k].p*x)}try{return _rollMut()}finally{for(const k in sv)MUTS[k].p=sv[k]}};
const aEsc=t=>String(t).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const aNum=n=>Math.round(n).toLocaleString("tr-TR");
function admBtn(lbl,a,v,cls){return '<button class="sm'+(cls?" "+cls:"")+'" data-a="'+a+'"'+(v!==undefined?' data-v="'+aEsc(v)+'"':"")+">"+lbl+"</button>"}
function admSecBtns(title){const s=ADM_SEC.find(x=>x[0]===title);if(!s)return"";return '<div class="admsub">'+title+'</div><div class="admbtns">'+s[1].map(x=>admBtn(x[0],x[1],x[2])).join("")+"</div>"}
function admCard(t,body,open){return '<details class="admd"'+(open===false?"":" open")+"><summary>"+t+"</summary>"+body+"</details>"}
function admDashHTML(){const all=allFish(),wk=workFish(),inc=wk.filter(f=>f.age>=MATURE&&!f.sick).reduce((a,f)=>a+incomeRate(getSpecies(f.type))*3600,0),val=all.reduce((a,f)=>a+saleValue(f),0),mutN=all.filter(f=>mutOf(f)!=="normal").length;
 const kv=(k,v)=>"<div><span>"+k+"</span><b>"+v+"</b></div>";let h='<div class="admkv">';
 h+=kv("Seviye",state.level+" · "+aNum(state.xp)+" / "+aNum(xpNeed(state.level))+" XP")+kv("Altın",aNum(state.coins)+" 🪙")+kv("Zümrüt",aNum(state.gems||0)+" 💎")+kv("Biriken gelir",aNum(state.pending||0)+" 🪙")+kv("Saatlik gelir",aNum(inc)+" 🪙/sa")+kv("Balıkların değeri",aNum(val)+" 🪙")+kv("Toplam balık",all.length+" ("+mutN+" mutasyonlu)")+kv("Keşfedilen tür",state.discovered.length+" / "+species.length)+kv("Bulunan mutasyon",state.mutsFound.length+" / "+MSP().length*5)+kv("Başarım",Object.keys(state.ach||{}).filter(k=>state.ach[k]==="done").length+" / "+ACH.length)+kv("Sonraki sandık",state.chest?"hazır 🎁":fmtTime((state.chestAt-Date.now())/1000))+kv("Etkinlikler",activeEvents().map(e=>e.n).join(", ")||"yok");
 h+="</div><div class='admsub'>Tanklar</div><div class='admkv'>";for(const k of TKEYS){const T=TANKS[k];if(!hasTank(k)){h+=kv(T.icon+" "+T.name,"kilitli");continue}const a=tankArr(k);h+=kv(T.icon+" "+T.name+(state.tank===k?" ◀":""),a.length+" / "+fishCap(k)+" balık · kir %"+Math.round(tankDirt(k)))}
 const pre=window.__AKV_PRE||[],ok=pre.filter(i=>i.complete&&i.naturalWidth).length;let ss=0;try{ss=serial().length}catch(e){}
 h+="</div><div class='admsub'>Cihaz ve oyun</div><div class='admkv'>"+kv("Sürüm",(($("verNote")||{}).textContent||"").replace("Akvaria · ",""))+kv("Akıcılık",ADM.fps+" fps · kalite K="+K)+kv("Ekran",innerWidth+"×"+innerHeight+" @"+(devicePixelRatio||1))+kv("Ekran kartı",aEsc(gpuName()))+kv("Bellek",(navigator.deviceMemory?navigator.deviceMemory+" GB":"?"))+kv("Yüklenen resim",ok+" / "+pre.length)+kv("Kayıt boyutu",(ss/1024).toFixed(1)+" KB")+kv("Bulut",NET.on?"bağlı ✅":"kapalı · "+aEsc(NET.why||"-"))+kv("Hareket hızı",ADM.speed+"×")+(state.admPerfLast?kv("Son kasma testi",aEsc(state.admPerfLast.txt).replace(/\n/g,"<br>")):"")+"</div>";return h}
function admFishHTML(){const sp=species.map(s=>'<option value="'+s.id+'">'+s.name+" "+TANKS[WATER[s.id]].icon+"</option>").join(""),mu=Object.keys(MUTS).map(k=>'<option value="'+k+'">'+MUTS[k].name+"</option>").join(""),sz=Object.keys(SIZES).map(k=>'<option value="'+k+'">'+SIZES[k].n+"</option>").join("");
 let h=admCard("➕ Balık ekle",'<div class="pair"><select id="admSp">'+sp+'</select><select id="admMu">'+mu+'</select></div><div class="pair" style="margin-top:6px"><select id="admSz">'+sz+'</select><select id="admAge"><option value=".12">Yavru</option><option value=".5">Yarı büyük</option><option value="1" selected>Yetişkin</option></select></div><div class="pair" style="margin-top:6px"><select id="admHy"><option value="">Hibrit: yok</option>'+HYB_T.map(k=>'<option value="'+k+'">🧬 Hibrit + '+MUTS[k].name+"</option>").join("")+'</select></div><label class="admck"><input type="checkbox" id="admRare"> Nadir (parlak)</label><div class="admbtns">'+admBtn("Ekle","spawn")+admBtn("5 tane","spawn5")+admBtn("Rastgele 10 (bu tank)","rnd10")+admBtn("Her mutasyondan 1","eachMut")+admBtn("Her hibritten 1","eachHyb")+"</div><p class=\"note\">Hibrit için mutasyon olarak Albino/Transparan/Melanistik/Altın seç, ikinci mutasyonu Hibrit kutusundan seç.</p>");
 const mo=k=>'<option value="'+k+'">'+MUTS[k].name+"</option>",so=k=>'<option value="'+k+'">'+SIZES[k].n+"</option>";
 const rows=state.fish.map(f=>{const s=getSpecies(f.type),moves=TKEYS.filter(k=>k!==state.tank&&hasTank(k)).map(k=>'<option value="'+k+'">'+TANKS[k].icon+" "+TANKS[k].name+"</option>").join("");
  return '<div class="admfish" data-fid="'+f.id+'"><div class="admfh"><span class="admfi">'+fishIcon(f)+'</span><div><b>'+aEsc(f.name||s.name)+'</b><small>#'+f.id+" · "+aNum(saleValue(f))+" 🪙"+(f.sick?" · 🤒":"")+'</small></div></div>'+
  '<div class="pair"><select data-ff="mutation">'+Object.keys(MUTS).map(mo).join("").replace('value="'+mutOf(f)+'"','value="'+mutOf(f)+'" selected')+'</select><select data-ff="hyb"><option value="">Hibrit yok</option>'+HYB_T.filter(k=>k!==mutOf(f)).map(k=>'<option value="'+k+'"'+(hybOf(f)===k?" selected":"")+">🧬 + "+MUTS[k].name+"</option>").join("")+'</select><select data-ff="sizeTrait">'+Object.keys(SIZES).map(so).join("").replace('value="'+szOf(f)+'"','value="'+szOf(f)+'" selected')+"</select></div>"+
  '<div class="admsl"><label>Büyüme <input type="range" min="0" max="100" data-ff="age" value="'+Math.round(Math.min(1,f.age)*100)+'"></label><label>Tokluk <input type="range" min="0" max="100" data-ff="hunger" value="'+Math.round(f.hunger)+'"></label><label>Sağlık <input type="range" min="0" max="100" data-ff="health" value="'+Math.round(f.health)+'"></label><label>Boy <input type="range" min="0" max="75" data-ff="sizeGrowth" value="'+Math.round((f.sizeGrowth||0)*100)+'"></label></div>'+
  '<div class="admbtns">'+admBtn("📍 Göster","fShow",f.id)+admBtn("🩺 İyileştir","fHeal",f.id)+admBtn("🧬 Kopyala","fDup",f.id)+admBtn(f.rarity==="Nadir"?"✨ Parlak: açık":"✨ Parlak: kapalı","fRare",f.id)+admBtn("🍽️ Yemle","fFeed",f.id)+admBtn("🗑️ Sil","fDel",f.id,"admdanger")+(moves?'<select data-ff="move"><option value="">Taşı…</option>'+moves+"</select>":"")+"</div></div>"}).join("");
 h+=admCard("🐟 Bu tanktaki balıklar ("+state.fish.length+")",rows||'<p class="note">Bu tankta balık yok</p>');
 h+=admSecBtns("🐟 Balık");return h}
function admEcoHTML(){const inp=(id,v,l)=>'<label class="admin">'+l+'<input id="'+id+'" type="number" inputmode="numeric" value="'+v+'"></label>';
 return admCard("✏️ Değerleri doğrudan ayarla",'<div class="pair">'+inp("admVC",Math.round(state.coins),"Altın")+inp("admVG",state.gems||0,"Zümrüt")+inp("admVL",state.level,"Seviye")+inp("admVX",Math.round(state.xp),"XP")+'</div><div class="admbtns">'+admBtn("Uygula","setv")+admBtn("Altın ×10","cmul",10)+admBtn("Zümrüt +1.000","gems",1000)+admBtn("Seviye 40","lvlset",40)+"</div>")+admSecBtns("💰 Ekonomi")+admSecBtns("📈 Pazar")}
function admTimeHTML(){const sp=[0,.25,.5,1,2,5,10];
 return admCard("🎬 Hareket hızı",'<p class="note">Balıkların ve efektlerin hızı (ekonomi gerçek saatle işlemeye devam eder)</p><div class="admbtns admseg">'+sp.map(v=>admBtn(v===0?"⏸ Durdur":v+"×","speed",v,ADM.speed===v?"on":"")).join("")+"</div>")+
  admCard("⏭️ Zamanı ileri al",'<div class="pair"><label class="admin">Saat<input id="admTH" type="number" value="3" step="0.5"></label><div class="admbtns">'+admBtn("İleri al","tskip")+"</div></div>")+admSecBtns("⏩ Zaman")+admSecBtns("👥 Deniz 🤖")}
function admLuckHTML(){const x=state.admMutX||1,mu=Object.keys(MUTS).filter(k=>k!=="normal").map(k=>'<option value="'+k+'"'+(state.admNextMut===k?" selected":"")+">"+MUTS[k].icon+" "+MUTS[k].name+"</option>").join("");
 const evs=EVENTS.map(e=>'<label class="admck"><input type="checkbox" data-ev="'+e.id+'"'+((state.admEv||[]).includes(e.id)?" checked":"")+"> "+e.n+' <small>'+aEsc(e.d||"")+"</small></label>").join("");
 return admCard("🎰 Mutasyon şansı çarpanı",'<p class="note">Şu an: '+x+'× · Doğan ve satın alınan bütün balıklara uygulanır</p><div class="admbtns admseg">'+[1,2,5,10,50,100,1000].map(v=>admBtn(v+"×","mutx",v,x===v?"on":"")).join("")+"</div>")+
  admCard("🎯 Sıradaki mutasyonu zorla",'<div class="pair"><select id="admNM"><option value="">— yok —</option>'+mu+'</select><div class="admbtns">'+admBtn("Ayarla","nextMut")+"</div></div><p class=\"note\">"+(state.admNextMut?"Sıradaki balık: "+MUTS[state.admNextMut].name:"Ayarlı değil")+"</p>")+
  admCard("📊 Şans simülatörü",'<p class="note">Mutasyon zarını 200.000 kez atar, gerçek oranları gösterir (etkinlikler ve çarpan dahil)</p><div class="admbtns">'+admBtn("Simüle et","sim")+'</div><div id="admSim"></div>',false)+
  admCard("🎉 Etkinlikleri zorla",'<div class="admev">'+evs+"</div>",false)}
function admViewHTML(){const D=ADM.dbg,tg=(k,l)=>'<label class="admck"><input type="checkbox" data-dbg="'+k+'"'+(D[k]?" checked":"")+"> "+l+"</label>";
 return admCard("🔍 Hata ayıklama katmanları",tg("hit","Dokunma alanları")+tg("mouth","Ağız noktaları ve yem")+tg("target","Hedef çizgileri")+tg("label","Balık bilgileri (tür, açlık, hız)")+tg("grid","Tank sınırları ve zemin çizgisi"))+
  admCard("📸 Ekran görüntüsü modu",'<p class="note">Bütün düğmeleri gizler, sadece akvaryum kalır. Çıkmak için sol üstteki küçük düğmeye dokun.</p><div class="admbtns">'+admBtn("Arayüzü gizle","clean")+"</div>")+
  admCard("🌑 Derin Okyanus karanlığı",'<input type="range" min="0" max="95" id="admDark" value="'+Math.round(DEEP_DARK*100)+'" style="width:100%"><p class="note">%'+Math.round(DEEP_DARK*100)+"</p>")+
  admCard("✨ Efekt önizleme",'<div class="admbtns">'+admBtn("Altın kutlaması","fxGold")+admBtn("Glitch bulunuşu","fxGlitch")+admBtn("Seviye atlama","fxLevel")+admBtn("Plankton patlaması","fxSpark")+admBtn("Efsanevi ses","fxLegend")+admBtn("Gece/gündüz geçişi","night")+"</div>")+admSecBtns("⚙️ Performans")}
function admTankHTML(){const tb=TKEYS.map(k=>admBtn(TANKS[k].icon+" "+TANKS[k].name+(state.tank===k?" ◀":""),"tankGo",k,state.tank===k?"on":"")).join("");
 const cr=CRIT.filter(d=>d.w===tw(state.tank)).map(d=>admBtn("+ "+d.n,"critAdd",d.id)).join("");
 return admCard("🔁 Tanka geç",'<div class="admbtns">'+tb+"</div>")+
  admCard("💧 Kirlilik",'<input type="range" min="0" max="100" id="admDirt" value="'+Math.round(state.dirt)+'" style="width:100%"><p class="note">%'+Math.round(state.dirt)+"</p>")+
  admCard("🦐 Omurgasızlar",'<div class="admbtns">'+(cr||'<span class="note">Bu tank için yok</span>')+admBtn("Hepsini kaldır","critClear")+"</div>")+
  admCard("🍤 Yem ve sandık",'<div class="admbtns">'+admBtn("Yem yağmuru","foodRain")+admBtn("Sandık çıkar","chest")+admBtn("Yerdeki yemleri temizle","foodClear")+admBtn("Para yağmuru","coinRain")+"</div>")+admSecBtns("🌊 Tank")+admSecBtns("🪸 Dekor")}
function admSaveHTML(){let snaps=[];try{snaps=JSON.parse(localStorage.getItem("akvSnap")||"[]")}catch(e){}
 const rows=snaps.map((s,i)=>'<div class="admsnap"><div><b>'+aEsc(s.n)+"</b><small>"+new Date(s.t).toLocaleString("tr-TR")+" · Sv "+s.lv+" · "+aNum(s.c)+' 🪙</small></div><div class="admbtns">'+admBtn("Geri yükle","snapLoad",i)+admBtn("Sil","snapDel",i,"admdanger")+"</div></div>").join("");
 return admCard("📌 Anlık görüntüler",'<p class="note">Oyunun şu anki hâlini kaydet, istediğin zaman geri dön (en fazla 6)</p><div class="pair"><input id="admSnapN" placeholder="Ad (isteğe bağlı)"><div class="admbtns">'+admBtn("Kaydet","snapSave")+"</div></div>"+(rows||'<p class="note">Henüz yok</p>'))+
  admCard("☁️ Bulut",'<p class="note">'+(NET.on?"Bağlı":"Kapalı")+(NET.uid?" · kimlik "+aEsc(String(NET.uid).slice(0,8))+"…":"")+(NET.saveErr?" · hata: "+aEsc(NET.saveErr):"")+'</p><div class="admbtns">'+admBtn("Şimdi buluta kaydet","cloudNow")+admBtn("Yerel kaydet","saveNow")+"</div>")+
  admSecBtns("💾 Kayıt")+'<textarea id="admTxt" class="admta" placeholder="İçe aktarma için kayıt JSON\'u buraya"></textarea>'}
function admLogHTML(){let er=null;try{er=JSON.parse(localStorage.getItem("fvErr")||"null")}catch(e){}
 return admCard("⚠️ Son hata",er?'<p class="note">'+aEsc(er.m)+"<br>"+new Date(er.t).toLocaleString("tr-TR")+" · "+aEsc(er.v||"")+" · "+er.n+' kez</p><div class="admbtns">'+admBtn("Temizle","errClear")+"</div>":'<p class="note">Kayıtlı hata yok ✅</p>')+
  admCard("📝 Bu oturumdaki işlemler",ADM.log.length?'<div class="admlog">'+ADM.log.slice().reverse().map(l=>"<div><small>"+l.t+"</small> "+aEsc(l.a)+"</div>").join("")+"</div>":'<p class="note">Henüz işlem yok</p>')}
function admSearchHTML(q){q=q.toLocaleLowerCase("tr-TR");const hits=[];for(const [t,l] of ADM_SEC)for(const x of l)if((x[0]+" "+t).toLocaleLowerCase("tr-TR").includes(q))hits.push(admBtn(x[0]+' <small>'+t.split(" ")[0]+"</small>",x[1],x[2]));return '<div class="admsub">Arama sonuçları</div><div class="admbtns">'+(hits.join("")||'<span class="note">Bulunamadı</span>')+"</div>"}
function admRender(){const b=$("admBox");if(!b)return;if(!isAdmin()){b.innerHTML="";return}ADM.on=true;
 const st=b.querySelector(".admbody"),sc=st?st.scrollTop:0,open=[...b.querySelectorAll("details.admd")].map(d=>d.open);
 let h='<div class="admtop"><input id="admQ" placeholder="🔎 İşlem ara…" value="'+aEsc(ADM.q)+'"><div class="admtabs">'+ADM_TABS.map(t=>'<button data-at="'+t[0]+'" class="'+(ADM.tab===t[0]?"on":"")+'">'+t[1]+"</button>").join("")+"</div></div>";
 const T=ADM.tab;let body=ADM.q?admSearchHTML(ADM.q):T==="dash"?'<div id="admDash">'+admDashHTML()+"</div>":T==="fish"?admFishHTML():T==="eco"?admEcoHTML():T==="time"?admTimeHTML():T==="luck"?admLuckHTML():T==="view"?admViewHTML():T==="tank"?admTankHTML():T==="prog"?admSecBtns("🏆 İlerleme"):T==="save"?admSaveHTML():admLogHTML();
 h+='<div class="admbody">'+body+'</div><p class="note">Sadece sana görünür · '+ADMIN_ID.slice(0,6)+"…</p>";b.innerHTML=h;
 const ds=b.querySelectorAll("details.admd");if(open.length===ds.length)ds.forEach((d,i)=>d.open=open[i]);const nb=b.querySelector(".admbody");if(nb)nb.scrollTop=sc}
function admLogA(a){const d=new Date();ADM.log.push({t:d.toLocaleTimeString("tr-TR"),a});if(ADM.log.length>60)ADM.log.shift()}
function admFindF(id){id=+id;return state.fish.find(f=>f.id===id)}
function admAct2(a,v,btn){const lbl=btn?btn.textContent.trim():a;admLogA(lbl);
 switch(a){
 case"speed":ADM.speed=+v;notify("🛠️ Hareket hızı: "+(+v===0?"durdu":v+"×"));admRender();return;
 case"tskip":{const hh=+($("admTH")||{}).value||0;if(hh>0){admShift(hh*3600);admDone(hh+" saat ileri alındı")}admRender();return}
 case"setv":{const g=id=>{const e=$(id);return e&&e.value!==""?+e.value:null};const c=g("admVC"),gm=g("admVG"),l=g("admVL"),x=g("admVX");if(c!=null)state.coins=Math.max(0,c);if(gm!=null)state.gems=Math.max(0,gm);if(l!=null)state.level=Math.max(1,l|0);if(x!=null)state.xp=Math.max(0,x);admDone("Değerler ayarlandı");admRender();return}
 case"cmul":state.coins*=+v;break;
 case"mutx":state.admMutX=+v;save(true);notify("🛠️ Mutasyon şansı "+v+"×");admRender();return;
 case"nextMut":state.admNextMut=($("admNM")||{}).value||null;save(true);notify(state.admNextMut?"🛠️ Sıradaki balık "+MUTS[state.admNextMut].name:"🛠️ Zorlama kaldırıldı");admRender();return;
 case"sim":{const N=200000,c={};const nm=state.admNextMut;state.admNextMut=null;for(let i=0;i<N;i++){const m=rollMutation();c[m]=(c[m]||0)+1}state.admNextMut=nm;const el=$("admSim");if(el)el.innerHTML='<div class="admkv">'+Object.keys(MUTS).map(k=>"<div><span>"+(MUTS[k].icon||"🐟")+" "+MUTS[k].name+"</span><b>"+aNum(c[k]||0)+(c[k]?" · 1/"+aNum(N/c[k]):"")+"</b></div>").join("")+"</div>";return}
 case"rnd10":{const ids=species.filter(s=>WATER[s.id]===tw(state.tank)&&!isColl(state.tank)||isColl(state.tank)).map(s=>s.id);let n=0;for(let i=0;i<10;i++)if(admFish(ids[Math.random()*ids.length|0],{age:rand(.2,1)}))n++;admDone(n+" balık eklendi");admRender();return}
 case"eachHyb":{const sid=($("admSp")||{}).value;let n=0;for(let i=0;i<HYB_T.length;i++)for(let j=0;j<i;j++)if(admFish(sid,{mut:HYB_T[i],hyb:HYB_T[j],age:1}))n++;admDone(n+" hibrit eklendi");admRender();return}
case"eachMut":{const sid=($("admSp")||{}).value;let n=0;for(const m of Object.keys(MUTS))if(admFish(sid,{mut:m,age:1}))n++;admDone(n+" balık eklendi");admRender();return}
 case"fShow":{const f=admFindF(v);if(f){selectedFish=f.id;tapInfo={id:f.id,until:performance.now()+5000};closeSheet();for(let k=0;k<12;k++)particles.push({x:f.x*W+rand(-20,20),y:f.y*H+rand(-20,20),vx:rand(-30,30),vy:rand(-50,-10),life:rand(.8,1.4),type:"heart"})}return}
 case"fHeal":{const f=admFindF(v);if(f){f.sick=false;f.health=100;f.hunger=100}break}
 case"fFeed":{const f=admFindF(v);if(f)f.hunger=100;break}
 case"fRare":{const f=admFindF(v);if(f)f.rarity=f.rarity==="Nadir"?"Normal":"Nadir";break}
 case"fDup":{const f=admFindF(v);if(f){const c=JSON.parse(JSON.stringify(f));c.id=state.nextId++;c.x=Math.min(.9,f.x+.05);if(state.fish.length<fishCap(state.tank)||state.admNoCap)state.fish.push(c);else notify("Tank dolu")}break}
 case"fDel":{const i=state.fish.findIndex(f=>f.id===+v);if(i>=0)state.fish.splice(i,1);break}
 case"clean":{closeSheet();document.body.classList.add("admclean");let x=$("admExit");if(!x){x=document.createElement("button");x.id="admExit";x.textContent="✕";x.onclick=()=>{document.body.classList.remove("admclean");x.remove()};document.body.appendChild(x)}return}
 case"fxGold":closeSheet();goldFx();sfx("legend");return;case"fxGlitch":closeSheet();sfx("crash");glitchFx();return;case"fxLevel":closeSheet();showLevelUp(state.level,0);sfx("level");return;case"fxLegend":sfx("legend");return;
 case"fxSpark":closeSheet();for(let i=0;i<14;i++)deepTap(rand(W*.1,W*.9),rand(H*.2,H*.75));if(curWater()!=="deep")for(let i=0;i<40;i++)particles.push({x:rand(0,W),y:rand(H*.2,H*.8),vx:rand(-40,40),vy:rand(-40,10),life:rand(.8,1.6),l0:1.6,type:"px",s:rand(2,5),c:["#7fe9ff","#b9a2ff","#ffffff"][i%3]});return;
 case"tankGo":closeSheet();if(state.tank!==v){if(!hasTank(v))state.stash[v]={fish:[],dirt:0};switchTank(v)}return;
 case"critAdd":{const d=CRIT.find(x=>x.id===v);if(d){if(!state.crit||typeof state.crit!=="object")state.crit={};const L=state.crit[state.tank]||(state.crit[state.tank]=[]);L.push({id:"a"+Date.now().toString(36)+(Math.random()*1e4|0),k:d.id})}break}
 case"critClear":if(state.crit)state.crit[state.tank]=[];break;
 case"foodRain":closeSheet();{const c0=state.coins;state.coins=Math.max(state.coins,500);for(let i=0;i<5;i++)dropFood(rand(W*.15,W*.85),rand(H*.25,H*.5),5);state.coins=c0}return;
 case"foodClear":drops.length=0;break;
 case"coinRain":closeSheet();for(const f of state.fish)spitCoin(f,f.x*W,f.y*H,fishW(f));return;
 case"snapSave":{let a=[];try{a=JSON.parse(localStorage.getItem("akvSnap")||"[]")}catch(e){}const n=(($("admSnapN")||{}).value||"").trim()||("Görüntü "+(a.length+1));a.unshift({n,t:Date.now(),lv:state.level,c:state.coins,j:serial()});a=a.slice(0,6);try{localStorage.setItem("akvSnap",JSON.stringify(a));notify("🛠️ Anlık görüntü kaydedildi")}catch(e){notify("🛠️ Yer yok, eski görüntülerden birini sil")}admRender();return}
 case"snapLoad":{let a=[];try{a=JSON.parse(localStorage.getItem("akvSnap")||"[]")}catch(e){}const s=a[+v];if(!s||!confirm("“"+s.n+"” geri yüklensin mi? Şu anki ilerleme bu görüntüyle değişir."))return;try{const p=JSON.parse(s.j);if(!validSave(p))throw 0;p.savedAt=Date.now();localStorage.setItem("fishvilleClassicSave3",JSON.stringify(p));window.__nosave=true;removeEventListener("pagehide",flush);removeEventListener("beforeunload",flush);location.reload()}catch(e){notify("🛠️ Görüntü bozuk")}return}
 case"snapDel":{let a=[];try{a=JSON.parse(localStorage.getItem("akvSnap")||"[]")}catch(e){}a.splice(+v,1);try{localStorage.setItem("akvSnap",JSON.stringify(a))}catch(e){}admRender();return}
 case"cloudNow":save(true);cloudSave(true);notify("🛠️ Buluta gönderiliyor");return;case"saveNow":save(true);notify("🛠️ Kaydedildi");return;
 case"errClear":try{localStorage.removeItem("fvErr")}catch(e){}admRender();return;
 }
 if(["fHeal","fFeed","fRare","fDup","fDel","critAdd","critClear","foodClear","cmul"].includes(a)){renderUI();save(true);admRender();notify("🛠️ Tamam");return}
 admAct(a,v);if(openKey==="adm")admRender()}
function admFishField(fid,k,val){const f=admFindF(fid);if(!f)return;if(k==="move"){if(!val)return;moveFishAdm(f,val);return}
 if(k==="mutation"){f.mutation=val;f.gene=val!=="normal"?val:null;if(!hybOf(f))delete f.hyb;if(val!=="normal")mutNote(f,getSpecies(f.type))}else if(k==="hyb"){if(!val||!HYB_T.includes(mutOf(f))||val===mutOf(f))delete f.hyb;else{const P=hybPair(mutOf(f),val);f.mutation=P[0];f.hyb=P[1];mutNote(f,getSpecies(f.type))}}else if(k==="sizeTrait")f.sizeTrait=val;else if(k==="age")f.age=Math.max(.05,+val/100);else if(k==="sizeGrowth")f.sizeGrowth=+val/100;else f[k]=+val;
 if(k==="health"&&f.health>40)f.sick=false;save(true);admLogA("#"+f.id+" "+k+" → "+val)}
function moveFishAdm(f,k){const d=tankArr(k);if(!d)return;const i=state.fish.indexOf(f);if(i<0)return;state.fish.splice(i,1);d.push(f);notify("🛠️ "+getSpecies(f.type).name+" → "+TANKS[k].name);renderUI();save(true);admRender()}
function admInit(){const b=$("admBox");if(!b)return;
 b.addEventListener("click",e=>{const tb=e.target.closest("[data-at]");if(tb){ADM.tab=tb.dataset.at;ADM.q="";admPersist();sfx("click");admRender();const bd=b.querySelector(".admbody");if(bd)bd.scrollTop=0;return}const t=e.target.closest("button[data-a]");if(t){sfx("click");admAct2(t.dataset.a,t.dataset.v,t)}});
 b.addEventListener("input",e=>{const t=e.target;if(t.id==="admQ"){ADM.q=t.value;const pos=t.selectionStart;admRender();const q=$("admQ");if(q){q.focus();try{q.setSelectionRange(pos,pos)}catch(_){}}return}
  if(t.id==="admDark"){DEEP_DARK=+t.value/100;t.nextElementSibling&&(t.nextElementSibling.textContent="%"+t.value);return}
  if(t.id==="admDirt"){state.dirt=+t.value;t.nextElementSibling&&(t.nextElementSibling.textContent="%"+t.value);return}
  const fr=t.closest("[data-fid]");if(fr&&t.dataset.ff&&t.type==="range")admFishField(fr.dataset.fid,t.dataset.ff,t.value)});
 b.addEventListener("change",e=>{const t=e.target;if(t.dataset&&t.dataset.ev){const s=new Set(state.admEv||[]);t.checked?s.add(t.dataset.ev):s.delete(t.dataset.ev);state.admEv=[...s];evC={t:0,l:[]};save(true);admLogA("Etkinlik "+t.dataset.ev+(t.checked?" açık":" kapalı"));return}
  if(t.dataset&&t.dataset.dbg){ADM.dbg[t.dataset.dbg]=t.checked;admPersist();return}if(t.id==="admDirt"){save(true);return}
  const fr=t.closest("[data-fid]");if(fr&&t.dataset.ff&&t.tagName==="SELECT"){admFishField(fr.dataset.fid,t.dataset.ff,t.value);renderUI();if(t.dataset.ff!=="move")admRender()}});
 $("admBtn").addEventListener("click",()=>openSheet("adm","🛠️ Yönetim paneli"));
 setInterval(()=>{if(openKey==="adm"&&ADM.tab==="dash"&&!ADM.q){const d=$("admDash");if(d)d.innerHTML=admDashHTML()}},1000)}
function admTick(now){ADM.fc++;if(now-ADM.fT>=1000){ADM.fps=Math.round(ADM.fc*1000/(now-(ADM.fT||now-1000)));ADM.fc=0;ADM.fT=now}}
function admDebug(t){const D=ADM.dbg;if(!(D.hit||D.mouth||D.target||D.label||D.grid)||!isAdmin())return;ctx.save();ctx.lineWidth=1;ctx.font="700 10px system-ui";
 if(D.grid){ctx.strokeStyle="rgba(255,220,0,.7)";ctx.setLineDash([4,4]);ctx.strokeRect(BX0,BY0,BX1-BX0,BY1-BY0);ctx.beginPath();ctx.moveTo(0,FLOOR);ctx.lineTo(W,FLOOR);ctx.moveTo(0,SURF);ctx.lineTo(W,SURF);ctx.stroke();ctx.setLineDash([])}
 for(const f of state.fish){const x=f.x*W,y=f.y*H,w=fishW(f);
  if(D.hit){ctx.strokeStyle="rgba(0,255,160,.8)";ctx.beginPath();ctx.arc(x,y,Math.max(55,w*.42),0,7);ctx.stroke()}
  if(D.mouth&&f._mx!=null){ctx.fillStyle="#ff3b5c";ctx.beginPath();ctx.arc(f._mx,f._my,3,0,7);ctx.fill();if(f._gx!=null){ctx.fillStyle="#ffd34d";ctx.beginPath();ctx.arc(f._gx,f._gy,2.5,0,7);ctx.fill()}}
  if(D.target&&f.tx!=null){ctx.strokeStyle="rgba(120,200,255,.7)";ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(f.tx,f.ty);ctx.stroke();ctx.fillStyle="rgba(120,200,255,.9)";ctx.fillRect(f.tx-2,f.ty-2,4,4)}
  if(D.label){const s=getSpecies(f.type),txt=s.name+(mutOf(f)!=="normal"?" · "+MUTS[mutOf(f)].name:"")+" · tok %"+Math.round(f.hunger)+" · can %"+Math.round(f.health)+" · hız "+Math.round(Math.hypot(f.vx||0,f.vy||0));ctx.fillStyle="rgba(0,0,0,.6)";const tw2=ctx.measureText(txt).width;ctx.fillRect(x-tw2/2-3,y-w*.45-16,tw2+6,13);ctx.fillStyle="#fff";ctx.textAlign="center";ctx.fillText(txt,x,y-w*.45-6)}}
 if(D.mouth){ctx.fillStyle="#ffb04d";for(const d of drops){if(d.eaten)continue;ctx.beginPath();ctx.arc(d.x,d.y,2,0,7);ctx.fill()}}
 ctx.restore()}
function admAct(a,v){if(a==="off"){const o=state.admOff||(state.admOff={});o[v]=!o[v];notify("🛠️ "+v+": "+(o[v]?"kapalı":"açık"));save(true);return}v=+v;
switch(a){
case"coins":state.coins+=v;break;case"coins0":state.coins=0;break;case"gems":state.gems+=v;break;
case"xp":addXP(v,1);break;case"lvl":state.level++;state.xp=0;showLevelUp(state.level,0);break;case"lvlset":state.level=v;state.xp=0;break;
case"all":state.level=30;state.coins=Math.max(state.coins,1e6);TKEYS.forEach(k=>{if(!state.stash[k]&&state.tank!==k)state.stash[k]={fish:[],dirt:0}});state.props=PROPS.map(p=>p.id);species.forEach(s=>{if(!state.discovered.includes(s.id))state.discovered.push(s.id);for(const m of["albino","transparent","melanistic","gold","glitch"]){const k=m+"_"+s.id;if(!state.mutsFound.includes(k))state.mutsFound.push(k)}});checkAch();break;
case"time":admShift(v);break;
case"hatch":(state.eggs||[]).forEach(e=>{e.hatchAt=0});break;
case"chest":state.chest={x:rand(.12,.88)};break;
case"orders":state.orders=[{wait:0},{wait:0},{wait:0}];ensureOrders(Date.now());break;
case"daily":state.daily=null;dailyCheck();break;
case"pend":{let cap=0;workFish().forEach(f=>cap+=incomeRate(getSpecies(f.type))*8*3600);state.pending=cap}break;
case"adult":state.fish.forEach(f=>{f.age=1});break;
case"heal":state.fish.forEach(f=>{f.sick=false;f.health=100;f.hunger=100});break;
case"sick":state.fish.forEach(f=>{f.sick=true;f.health=40});break;
case"hungry":state.fish.forEach(f=>{f.hunger=5});break;
case"clear":state.fish.length=0;break;
case"oneEach":species.forEach(s=>{if(WATER[s.id]===state.tank)admFish(s.id,{age:1})});break;
case"tanks":TKEYS.forEach(k=>{if(!state.stash[k]&&state.tank!==k)state.stash[k]={fish:[],dirt:0}});checkAch();break;
case"dirt":state.dirt=v;break;
case"props":state.props=PROPS.map(p=>p.id);break;case"propsOff":state.props=[];break;
case"decor":for(let i=0;i<5;i++)if(state.decor.length<14)state.decor.push({k:DECOR[Math.random()*DECOR.length|0],x:rand(.1,.9)});break;case"decorOff":state.decor=[];break;
case"night":state.night=!state.night;$("night").textContent=state.night?"☀️ Gündüz modu":"🌙 Gece modu";break;
case"mkt":species.forEach(s=>{state.market[s.id]=v});break;
case"bot":state.botEpoch=(state.botEpoch||Date.now())-7*864e5;break;
case"botReset":delete state.helpGot[BOT_ID];break;
case"botHelp":delete state.helpGot[BOT_ID];botHelp();break;
case"disc":species.forEach(s=>{if(!state.discovered.includes(s.id))state.discovered.push(s.id)});checkAch();break;
case"muts":MSP().forEach(s=>{for(const m of["albino","transparent","melanistic","gold","glitch"]){const k=m+"_"+s.id;if(!state.mutsFound.includes(k))state.mutsFound.push(k)}});checkAch();break;
case"ach":ACH.forEach(x=>{state.ach[x.id]="done"});break;case"achOff":state.ach={};break;case"wheelReset":state.wheel=null;if(openKey==="wheel")renderWheel();break;
case"quests":if(state.daily){state.daily.ids.forEach(id=>{const q=QUESTS.find(x=>x.id===id);if(q)state.daily.prog[id]=q.n})}break;
case"perfTest":admPerfTest();return;
case"fps":if(admFps){admFps.remove();admFps=null}else{admFps=document.createElement("div");admFps.className="admfps";$("game").appendChild(admFps);admFpsT=performance.now();admFrames=0}return;
case"k":admSetK(v);break;
case"adapt":globalThis.__noAdapt=!globalThis.__noAdapt;notify("🛠️ Otomatik kalite: "+(globalThis.__noAdapt?"kapalı":"açık"));return;
case"cap":state.admNoCap=!state.admNoCap;notify("🛠️ Balık sınırı: "+(state.admNoCap?"kapalı":"açık"));break;
case"stress":{const was=state.admNoCap;state.admNoCap=true;const ids=species.filter(s=>WATER[s.id]===state.tank).map(s=>s.id);if(ids.length)for(let i=0;i<v;i++)admFish(ids[i%ids.length],{age:1});state.admNoCap=was;break}
case"exp":{const j=serial();try{navigator.clipboard.writeText(j)}catch(e){}const t=$("admTxt");if(t){t.value=j;t.select()}notify("🛠️ Kayıt kutuya yazıldı");return}
case"imp":{const t=$("admTxt");try{const p=JSON.parse(t.value);if(!validSave(p))throw 0;p.savedAt=Date.now();localStorage.setItem("fishvilleClassicSave3",JSON.stringify(p));window.__nosave=true;removeEventListener("pagehide",flush);removeEventListener("beforeunload",flush);location.reload()}catch(e){notify("🛠️ Geçersiz kayıt")}return}
case"reset":if(confirm("Bütün oyun sıfırlansın mı?")){window.__nosave=true;removeEventListener("pagehide",flush);removeEventListener("beforeunload",flush);try{const s0=initState();s0.savedAt=Date.now();localStorage.setItem("fishvilleClassicSave3",JSON.stringify(s0))}catch(e){}location.reload()}return;
case"spawn":case"spawn5":{const n=a==="spawn5"?5:1;let c=0;for(let i=0;i<n;i++){if(admFish($("admSp").value,{mut:$("admMu").value,hyb:($("admHy")||{}).value||null,size:$("admSz").value,age:+$("admAge").value,rare:$("admRare").checked}))c++}notify(c?"🛠️ "+c+" balık eklendi":"🛠️ Eklenemedi (tank yok/dolu)");renderUI();save(true);return}
}
admDone("Tamam")}
admInit();v31Init();
$("bkBtn").addEventListener("click",()=>{audio();openBackup()});$("bkCopy").addEventListener("click",doBackupCopy);$("bkLoad").addEventListener("click",doBackupLoad);
$("shopTabs").addEventListener("click",e=>{const b=e.target.closest("[data-st]");if(b){audio();setShopTab(b.dataset.st)}});$("fishChips").addEventListener("click",e=>{const b=e.target.closest("[data-fw]");if(b){audio();fishWat=b.dataset.fw;SHDET=null;sfx("click");renderUI()}});$("gemShop").addEventListener("click",e=>{const b=e.target.closest("[data-gem]");if(b){audio();buyGem(b.dataset.gem)}});document.querySelectorAll("[data-sheet=shop]").forEach(b=>b.addEventListener("click",()=>{shopTab="fish";SHDET=null;if(SELLM)sellModeSet(false)},true));
$("placeDecor").addEventListener("click",()=>{audio();if(!state.props.length&&!state.decor.length){notify("Önce bir dekor al 🪸");return}editStart("deco")});
if($("stabs"))$("stabs").addEventListener("click",e=>{const b=e.target.closest("[data-tab]");if(b){audio();openSheet(b.dataset.tab,b.dataset.tt)}});
eiStart();try{autoLockLabel();$("autoLockBtn").addEventListener("click",()=>{audio();state.autoLock=!autoLockOn();autoLockLabel();sfx("click");renderUI();save(true);notify(autoLockOn()?"🔒 Nadir balıklar otomatik kilitleniyor":"🔓 Otomatik kilit kapalı · elle kilitlediklerin kilitli kalır")})}catch(e){}try{bgSoftLabel();$("bgSoftBtn").addEventListener("click",()=>{audio();state.bgSoft=!bgSoftOn();curTF=null;bgSoftLabel();sfx("click");save(true)})}catch(e){}try{$("fbLink").addEventListener("click",()=>{audio();fbLink()});$("fbOut").addEventListener("click",fbSignOut);$("fbDel").addEventListener("click",fbDelete)}catch(e){}try{oriLabel();$("oriBtn").addEventListener("click",()=>{audio();setOri(ORI_PREF==="auto"?(PORT?"land":"port"):ORI_PREF==="land"?"port":"auto")});$("rhPort").addEventListener("click",()=>setOri("port"))}catch(e){}load();normalize();offlineReport();dailyCheck();checkAch();setTimeout(botHelp,2600);if(state.wheel&&!state.wheel.paid)setTimeout(wheelPay,1500);setTimeout(()=>{if(state.level>=2&&wheelReady()&&!VISIT)notify("🎡 Günlük çarkın hazır! Görevler → Çark")},4300);if(state.migrated){state.migrated=false;setTimeout(()=>notify("🌊 Tuzlu su balıkların kendi tankına taşındı! Haritadan geçebilirsin."),3200)}initScenery();$("night").textContent=state.night?"☀️ Gündüz modu":"🌙 Gece modu";renderUI();badges();soundLabels();applyUnlocks();gfxLabel();nightLbl();autoLockLabel();if(state.lowGfx)admSetK(1);setTimeout(tutRender,900);try{bootDone()}catch(e){}try{const pe=JSON.parse(localStorage.getItem("fvErr")||"null");if(pe&&(pe.v!==(($("verNote")||{}).textContent||"")))localStorage.removeItem("fvErr");else if(pe&&Date.now()-pe.t<864e5){const el=$("errNote");if(el){el.hidden=false;el.textContent="⚠️ Önceki hata ("+pe.n+"): "+pe.m}}}catch(e){}requestAnimationFrame(frame);netLabel();netInit();
})();

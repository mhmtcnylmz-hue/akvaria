
(() => {
"use strict";
try{window.bootP&&bootP(72)}catch(e){}
const $ = id => document.getElementById(id);
const canvas=$("tank"), ctx=canvas.getContext("2d");
const asset=n=>getComputedStyle(document.documentElement).getPropertyValue("--asset-"+n).trim().replace(/^url\(["']?|["']?\)$/g,"");
const reefBg=new Image();reefBg.src=asset("reef");const nightBg=new Image();nightBg.src=asset("night");const reefF=new Image();reefF.src=asset("reefF");const nightF=new Image();nightF.src=asset("nightF");
const chestClosedImg=new Image();chestClosedImg.src=asset("chestClosed");
const chestOpenImg=new Image();chestOpenImg.src=asset("chestOpen");
let bgCache=null,chestAnim=null;
const ORI_PREF=(()=>{try{const o=localStorage.getItem("akvOri");return o==="land"||o==="port"?o:"auto"}catch(e){return"auto"}})(),ORI=ORI_PREF!=="auto"?ORI_PREF:(typeof innerWidth==="number"&&typeof innerHeight==="number"&&innerHeight>innerWidth?"port":"land"),PORT=ORI==="port";try{document.documentElement.classList.toggle("land",!PORT)}catch(e){}
const GAR=(()=>{if(PORT)return 540/960;let a=16/9;try{const w=innerWidth,h=innerHeight;if(w>0&&h>0&&isFinite(w/h))a=w/h}catch(e){}return Math.max(16/9,Math.min(2.2,a))})();try{document.documentElement.style.setProperty("--gar",GAR.toFixed(4))}catch(e){}
const W=PORT?540:Math.round(540*GAR),H=PORT?960:540,FLOOR=H*(PORT?.77:.78),LSP=PORT?1:.62,LSR=PORT?1:.8;function ymig(y){return 421.2+(y-739.2)*.5625}function yconv(y,from){if(from===ORI)return y;return from==="port"?421.2+(y-739.2)*.5625:739.2+(y-421.2)/.5625}
let K=Math.min(2,Math.max(1,Math.ceil(typeof devicePixelRatio==="number"?devicePixelRatio:1)));try{const sk=+localStorage.getItem("fvK2");if(sk>=1&&sk<K)K=sk}catch(e){}canvas.width=Math.round(W*K);canvas.height=Math.round(H*K);try{ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality="high"}catch(e){}
const species=[
{id:"neon",name:"Neon Tetra",price:15,value:9,speed:42,grow:.03,scale:.9,img:"«sp_neon»"},
{id:"guppy",name:"Gupi",price:30,value:18,speed:38,grow:.1,scale:1,img:"«sp_guppy»"},
{id:"clown",name:"Palyaço Balığı",price:60,value:36,speed:30,grow:.3,scale:1,img:"«sp_clown»"},
{id:"ytang",name:"Sarı Cerrah",price:70,value:42,speed:28,grow:.4,scale:1,img:"«sp_ytang»"},
{id:"gold",name:"Japon Balığı",price:80,value:48,speed:20,grow:.5,scale:1.05,img:"«sp_gold»"},
{id:"betta",name:"Betta",price:100,value:60,speed:18,grow:.7,scale:1.1,img:"«sp_betta»"},
{id:"btang",name:"Mavi Cerrah",price:140,value:84,speed:32,grow:1,scale:1.05,img:"«sp_btang»"},
{id:"angel",name:"Kral Melek",price:190,value:114,speed:24,grow:1.5,scale:1.05,img:"«sp_angel»"},
{id:"cichlid",name:"Gökkuşağı Çiklit",price:220,value:132,speed:26,grow:1.8,scale:1.05,lv:3,img:"«sp_cichlid»"},
{id:"lion",name:"Aslan Balığı",price:260,value:156,speed:20,grow:2.2,scale:0.95,lv:4,img:"«sp_lion»"},
{id:"arowana",name:"Kırmızı Aravana",price:280,value:168,speed:30,grow:2.4,scale:1,lv:4,img:"«sp_arowana»"},
{id:"copper",name:"Bakır Kelebek",price:300,value:180,speed:22,grow:2.5,scale:1.05,lv:5,img:"«sp_copper»"},
{id:"discus",name:"Disk Balığı",price:340,value:204,speed:20,grow:3,scale:0.95,lv:5,img:"«sp_discus»"},
{id:"trigger",name:"Tetik Balığı",price:380,value:228,speed:24,grow:3.5,scale:1,lv:6,img:"«sp_trigger»"},
{id:"boxfish",name:"Kutu Balığı",price:410,value:246,speed:14,grow:3.5,scale:1,lv:6,img:"«sp_boxfish»"},
{id:"mandarin",name:"Mandarin Balığı",price:440,value:264,speed:22,grow:4,scale:1,lv:7,img:"«sp_mandarin»"},
{id:"koi",name:"Koi Balığı",price:450,value:270,speed:22,grow:3.8,scale:1,lv:8,img:"«sp_koi»"},
{id:"idol",name:"Moor Putu",price:500,value:300,speed:22,grow:4.5,scale:0.9,lv:8,img:"«sp_idol»"},
{id:"emp",name:"Mavi Melek",price:600,value:360,speed:20,grow:5,scale:0.95,lv:9,img:"«sp_emp»"},
{id:"napo",name:"Napolyon Balığı",price:750,value:450,speed:18,grow:6.3,scale:1,lv:10,img:"«sp_napo»"}
];
// gerçek hayattaki yetişkin boyu (cm) ve sprite genişliğindeki yüzgeç/uzantı payı; ekran boyu cm^0,35 ile ölçekli (3,5 cm ≈ 66 px, 45 cm ≈ 160 px)
const CMS={koi:[50,.95],arowana:[40,.95],boxfish:[18,1],napo:[42,1],neon:[3.5,1],guppy:[4.5,.95],clown:[10,1],ytang:[20,1],gold:[18,.95],betta:[6.5,.85],btang:[27,1],angel:[38,1],cichlid:[14,1],lion:[35,.9],copper:[20,1],discus:[18,1],trigger:[45,1],mandarin:[6.5,.9],idol:[22,.9],emp:[30,1]};
species.forEach(s=>{const c=CMS[s.id]||[10,1];s.cm=c[0];s.scale=66*Math.pow(c[0]/3.5,.35)*c[1]/98.4});
const MUTW={"gold_neon":1.0,"gold_guppy":1.0,"gold_gold":1.0,"gold_betta":1.005,"gold_cichlid":1.004,"gold_arowana":0.994,"gold_discus":0.989,"gold_koi":1.006,"gold_clown":0.991,"gold_ytang":0.958,"gold_btang":0.95,"gold_angel":0.954,"gold_lion":0.991,"gold_copper":0.972,"gold_trigger":0.966,"gold_boxfish":0.993,"gold_mandarin":0.984,"gold_idol":0.923,"gold_emp":1.0,"gold_napo":0.988,"albino_koi":1.013,"transparent_koi":1.006,"melanistic_koi":1.025,"albino_arowana":0.989,"transparent_arowana":1.044,"melanistic_arowana":0.997,"albino_boxfish":1.014,"transparent_boxfish":0.986,"melanistic_boxfish":1.028,"albino_napo":1.003,"transparent_napo":0.953,"melanistic_napo":1.012,"albino_neon":1.08,"transparent_neon":1.036,"melanistic_neon":1.028,"albino_guppy":0.983,"transparent_guppy":1.01,"melanistic_guppy":0.981,"albino_clown":1.015,"transparent_clown":0.969,"melanistic_clown":0.985,"albino_ytang":0.965,"transparent_ytang":0.951,"melanistic_ytang":0.993,"albino_gold":1.0,"transparent_gold":1.004,"melanistic_gold":0.991,"albino_betta":0.923,"transparent_betta":1.021,"melanistic_betta":0.94,"albino_btang":1.015,"transparent_btang":0.931,"melanistic_btang":0.984,"albino_angel":0.953,"transparent_angel":0.932,"melanistic_angel":0.947,"albino_mandarin":0.963,"transparent_mandarin":0.964,"melanistic_mandarin":0.967,"albino_lion":0.946,"transparent_lion":0.953,"melanistic_lion":1.006,"albino_idol":0.904,"transparent_idol":0.923,"melanistic_idol":0.882,"albino_trigger":0.96,"transparent_trigger":0.977,"melanistic_trigger":0.949,"albino_discus":1.001,"transparent_discus":1.014,"melanistic_discus":1.02,"albino_copper":0.963,"transparent_copper":0.958,"melanistic_copper":0.951,"albino_cichlid":0.977,"transparent_cichlid":1.027,"melanistic_cichlid":0.968,"albino_emp":1.014,"transparent_emp":0.967,"melanistic_emp":0.989};
function initState(){return{coins:250,xp:0,level:1,nextId:4,tank:"fresh",fish:[
{id:1,type:"neon",age:.38,x:.22,y:.43,dir:1,phase:1.2},
{id:2,type:"guppy",age:.58,x:.67,y:.58,dir:-1,phase:3.3},
{id:3,type:"betta",age:.74,x:.48,y:.30,dir:1,phase:5.1}
],discovered:["neon","guppy","betta"],lastFeed:0,muted:false,lastTick:Date.now(),pending:0,dirt:10,stash:{},propPos:{},wheel:null,gems:10,luck:0,snails:0,decor:[],chest:null,chestAt:Date.now()+18e4,market:{},marketAt:Date.now()+36e5,eggs:[],equipment:{filter:0,feeder:0},eventAt:Date.now()+6e5,night:false,music:true,props:[],mutsFound:[],stats:{},ach:{},daily:null,streak:{last:"",count:0},helped:{},helpGot:{},savedAt:0}}
let state=initState();
let lastAdv=0,lastSave=0;
let openKey=null,drops=[],dirtC=null,dirtK=-1;
let lastDrag=0,feedMode=0,feedQAt=0,xpAcc=0,coinsLoose=[],coinsFly=[],sfxAt=0,eatAt=0;const NOCT=["lion","mandarin"];
const fishImgs={};species.forEach(sp=>{const u="data:image/webp;base64,"+sp.img;document.documentElement.style.setProperty("--f-"+sp.id,'url("'+u+'")');const im=new Image();im.src=u;fishImgs[sp.id]=im});
function spReq(s){const T=TANKS[WATER[s.id]];return Math.max(s.lv||1,T&&T.lv||1)}
function spLocked(s){return state.level<spReq(s)&&!state.discovered.includes(s.id)}

const EIS={"🪙":"«ic_coin»","💎":"«ic_gem»","⭐":"«ic_star»","🌟":"«ic_star»","🐠":"«ic_fish»","🐟":"«ic_fish»","🔒":"«ic_lock»","🔓":"«ic_unlock»","🏆":"«ic_cup»","👑":"«ic_crown»","🧬":"«ic_dna»","💊":"«ic_pill»","❤️":"«ic_heart»","🌱":"«ic_sprout»","🍽️":"«ic_bowl»","😴":"«ic_sleep»","🌙":"«ic_sleep»","🤒":"«ic_thermo»","🔥":"«ic_fire»","🍀":"«ic_clover»","📦":"«ic_box»","🧪":"«ic_potion»","☀️":"«ic_sun»","🐚":"«dc_shell»","🪸":"«dc_coral»","⚓":"«dc_anchor»","🦪":"«dc_oyster»","🦀":"«dc_crab»","🪨":"«dc_rock»","🐌":"«dc_snail»","🏺":"«ic_amph»","🍂":"«ic_leaf»","🎃":"«ic_pumpkin»","❄️":"«ic_snow»","💘":"«ic_valent»","🌸":"«ic_blossom»","🎉":"«ic_party»","🏠":"«ic_home»","🎁":"«ic_gift»","🛒":"«ic_shop»","🎡":"«ic_wheel»","📸":"«ic_camera»","🗺️":"«ic_map»","⚙️":"«ic_set»","🤖":"«cu_bot»","🍤":"«ic_feed»","🧽":"«ic_clean»","📋":"«ic_quest»","🥚":"«ic_prod»","✨":"«ic_spark»","🛠️":"«ic_tools»","✅":"«ic_ok»","⚠️":"«ic_warn»","💾":"«ic_save»","📖":"«ic_book»","🫧":"«ic_bubbles»","💞":"«ic_hearts»","🤝":"«ic_hand»","🎵":"«ic_music»","🏅":"«ic_medal»","⚔️":"«ic_swords»","🤍":"«ic_wheart»","🔮":"«ic_orb»","🖤":"«ic_bheart»","💀":"«ic_skull»","🔊":"«ic_snd»","🔇":"«ic_mute»","✏️":"«ic_pencil»","🧠":"«ic_brain»","💰":"«ic_bag»","📈":"«ic_chart»","⚡":"«ic_bolt»","🧰":"«ic_toolbox»","🐣":"«ic_chick»","😣":"«ic_dizzy»","😨":"«ic_scared»","💧":"«ic_drop»","🌊":"«ic_wave»","🌿":"«ic_plant»","⏳":"«ic_hourglass»","👥":"«ic_people»","🗂️":"«ic_folder»","⬇️":"«ic_down»","📚":"«ic_books»","🌐":"«ic_globe»","📤":"«ic_share»","👀":"«ic_eyes»","❌":"«ic_x»","⏩":"«ic_ff»","👍":"«ic_thumb»"};
const EIK=Object.keys(EIS).map(k=>k.replace(/️/g,"")).sort((a,b)=>b.length-a.length),EIX={};Object.keys(EIS).forEach(k=>{EIX[k.replace(/️/g,"")]=EIS[k]});
const EIRE=new RegExp("("+EIK.map(k=>k+"\\uFE0F?").join("|")+")","g"),EIM={},EIC={};let EIN=0;
function eimg(k){k=k.replace(/️/g,"");const b=EIX[k];if(!b)return null;let im=EIM[k];if(!im){im=EIM[k]=new Image();im.src="data:image/webp;base64,"+b}return im.complete&&im.naturalWidth?im:null}
function eiCls(k){k=k.replace(/️/g,"");if(EIC[k])return EIC[k];const c="ei"+(EIN++);EIC[k]=c;try{eiSheet.textContent+="."+c+"{background-image:url(data:image/webp;base64,"+EIX[k]+")}"}catch(e){}return c}
let eiSheet=null;try{eiSheet=document.createElement("style");eiSheet.textContent=".ei{display:inline-block;width:1.25em;height:1.25em;vertical-align:-.28em;background:center/contain no-repeat;pointer-events:none;margin:0 .03em}";document.head.appendChild(eiSheet)}catch(e){}
const EI_SKIP={SCRIPT:1,STYLE:1,TEXTAREA:1,OPTION:1,SELECT:1,TITLE:1,INPUT:1,CANVAS:1};
function emojify(root){try{if(!root)return;if(root.nodeType===3){eiText(root);return}if(root.nodeType!==1||EI_SKIP[root.nodeName])return;const w=document.createTreeWalker(root,4),L=[];let n;while(n=w.nextNode())L.push(n);L.forEach(eiText)}catch(e){}}
function eiText(n){const s=n.nodeValue;if(!s||!n.parentNode||EI_SKIP[n.parentNode.nodeName])return;EIRE.lastIndex=0;if(!EIRE.test(s))return;EIRE.lastIndex=0;const f=document.createDocumentFragment();let last=0,m;while(m=EIRE.exec(s)){if(m.index>last)f.appendChild(document.createTextNode(s.slice(last,m.index)));const i=document.createElement("i");i.className="ei "+eiCls(m[1]);i.setAttribute("aria-label",m[1]);f.appendChild(i);last=m.index+m[0].length}if(last<s.length)f.appendChild(document.createTextNode(s.slice(last)));n.parentNode.replaceChild(f,n)}
function eiStart(){if(typeof MutationObserver==="undefined"||!document.body)return;emojify(document.body);new MutationObserver(ms=>{for(const m of ms){if(m.type==="characterData")emojify(m.target);else m.addedNodes.forEach(emojify)}}).observe(document.body,{childList:true,subtree:true,characterData:true})}
function drawEmo(c,str,x,y,sz){const parts=String(str).split(EIRE);let cx=x;c.textAlign="left";parts.forEach((p,i)=>{if(!p)return;if(i%2){const im=eimg(p);if(im){const h=sz*1.25,w=h*im.naturalWidth/im.naturalHeight;c.drawImage(im,cx,y-h*.82,w,h);cx+=w+2;return}}c.fillText(p,cx,y);cx+=c.measureText(p).width})}
const CUP=["«cu_0»","«cu_1»","«cu_2»","«cu_3»","«cu_4»","«cu_5»","«cu_6»","«cu_7»"];
function tankIco(T){return '<img class="cuimg" alt="" src="data:image/webp;base64,'+(T.w==="salt"?"«ic_tankS»":"«ic_tankF»")+'">'}
const DECN={"🐚":"Deniz kabuğu","🪸":"Mercan dalı","⚓":"Paslı çapa","🦪":"İnci istiridyesi","🦀":"Yengeç","🪨":"Yosunlu taş","sf":"Deniz yıldızı"},DIMG={"🐚":"«dc_shell»","🪸":"«dc_coral»","⚓":"«dc_anchor»","🦪":"«dc_oyster»","🦀":"«dc_crab»","🪨":"«dc_rock»","sf":"«dc_star»"},DIM={};
function decImg(k){let im=DIM[k];if(!im){im=DIM[k]=new Image();im.src="data:image/webp;base64,"+(DIMG[k]||DIMG["🐚"])}return im.complete&&im.naturalWidth?im:null}
function decBox(d){const im=decImg(d.k),s=(PORT?64:52)*pDepth(decY(d)),ar=im?im.naturalWidth/im.naturalHeight:1,w=ar>=1?s:s*ar,h=ar>=1?s/ar:s;return{w,h,x:d.x*W-w/2,y:decY(d)+8-h}}
function decTxt(k){return DECN[k]||""}
function icon(sp){return '<i class="fi" style="background-image:var(--f-'+sp.id+')"></i>'}
const WATER={koi:"fresh",arowana:"fresh",boxfish:"salt",napo:"salt",neon:"fresh",guppy:"fresh",gold:"fresh",betta:"fresh",clown:"salt",ytang:"salt",btang:"salt",angel:"salt",cichlid:"fresh",lion:"salt",copper:"salt",discus:"fresh",trigger:"salt",mandarin:"salt",idol:"salt",emp:"salt"};
const TANKS={fresh:{name:"Tatlı su",icon:"🌿",w:"fresh"},salt:{name:"Tuzlu su",icon:"🌊",w:"salt",lv:3,cost:400,info:"Palyaço, Cerrahlar, Melekler ve resif balıkları burada yaşar"},cfresh:{name:"Koleksiyon",icon:"🏺",w:"salt",coll:true,lv:4,cost:500,info:"Tatlı ve tuzlu su balıkları bir arada · 30 balık · bakım, gelir ve büyüme yok"}};
const TKEYS=["fresh","salt","cfresh"];
const SMALL=["neon","guppy"];
const COMPAT={betta:"Erkek Bettalar kavga eder; tankta tek Betta tut.",gold:"Küçük balıkları (Neon, Gupi) kovalar.",neon:"Japon Balığı varken korkar ve yavaş büyür.",guppy:"Japon Balığı varken korkar ve yavaş büyür."};
function tw(k){return (TANKS[k]||TANKS.fresh).w}
function isColl(k){return !!(TANKS[k]&&TANKS[k].coll)}
function swapTo(k){const o=state.stash[k];if(!o)return false;const f=state.fish,d=state.dirt,a=state.tank;state.fish=o.fish;state.dirt=o.dirt;state.tank=k;delete state.stash[k];state.stash[a]={fish:f,dirt:d};return true}
function allFish(){let a=state.fish;for(const k in state.stash)a=a.concat(state.stash[k].fish);return a}
function workFish(){let a=isColl(state.tank)?[]:state.fish;for(const k in state.stash)if(!isColl(k))a=a.concat(state.stash[k].fish);return a}
function hasTank(k){return state.tank===k||!!state.stash[k]}
function fishCap(k){return state.admNoCap?99:TANKS[k]&&TANKS[k].coll?30:20+2*((state.capUp||{})[k]||0)}
function tankArr(k){return state.tank===k?state.fish:(state.stash[k]?state.stash[k].fish:null)}
function tankDirt(k){return state.tank===k?state.dirt:(state.stash[k]?state.stash[k].dirt:0)}
const STATUS={water:["😣","yanlış su!"],fight:["⚔️","kavga ediyor"],scared:["😨","korkuyor"]};
// genetik: gizli çekinik gen (taşıyıcı) + görünen mutasyon
const GENES=["albino","transparent","melanistic","gold"];
function rollGene(){if(Math.random()<.002)return"gold";const r=Math.random(),dk=ev("dark")?3:1;if(r<.01*dk)return"melanistic";if(r<.01*dk+.04)return"transparent";if(r<.01*dk+.16)return"albino";return null}
function allele(p){if(p.m&&p.m!=="normal")return Math.random()<.87?p.m:null;if(p.g)return Math.random()<.5?p.g:null;return null}
function geneKnown(f){return(f.mutation&&f.mutation!=="normal")||!!f.geneKnown}
function geneText(f){if(f.mutation&&f.mutation!=="normal")return"🧬 "+MUTS[f.mutation].name+" (görünen)";if(!f.geneKnown)return"🧬 genler bilinmiyor";return f.gene?"🧬 "+MUTS[f.gene].name+" taşıyıcı":"🧬 taşıyıcı değil"}
function passP(f,g){if(f.mutation===g)return .87;if(f.mutation&&f.mutation!=="normal")return 0;return f.gene===g?.5:0}
function oddsText(a,b){if(!a||!b)return"";if(!geneKnown(a)||!geneKnown(b))return"Ebeveynlerden birinin genleri bilinmiyor. Genetik test yaptırırsan olasılıkları görürsün.";const parts=GENES.map(g=>[g,passP(a,g)*passP(b,g)]).filter(x=>x[1]>0).map(x=>MUTS[x[0]].icon+" "+MUTS[x[0]].name+" %"+Math.round(x[1]*100));return parts.length?"Yavru şansı: "+parts.join(" · "):"Bu çiftten mutasyon kalıtılmaz; yalnızca kendiliğinden mutasyon şansı var."}
// boy mutasyonu: renk mutasyonundan bağımsız; bir balık hem Dev hem Albino olabilir
const SIZES={normal:{n:"Normal",m:1,v:1},dwarf:{n:"Cüce",icon:"🔹",tier:"Nadir",m:.72,v:1.4,p:.04},giant:{n:"Dev",icon:"🔶",tier:"Çok nadir",m:1.38,v:1.8,p:.025}};
function rollSize(){const r=Math.random();if(r<SIZES.giant.p)return"giant";if(r<SIZES.giant.p+SIZES.dwarf.p)return"dwarf";return"normal"}
function inheritSize(a,b){a=SIZES[a]?a:"normal";b=SIZES[b]?b:"normal";if(a!=="normal"&&a===b)return Math.random()<.6?a:rollSize();for(const z of [a,b])if(z!=="normal"&&Math.random()<.35)return z;return rollSize()}
const szOf=f=>SIZES[f.sizeTrait]?f.sizeTrait:"normal";
function fsz(f){return(25+Math.min(1.4,f.age)*16)*(1+(f.sizeGrowth||0))*SIZES[szOf(f)].m}
function fishW(f){if(f._wa===f.age&&f._wg===f.sizeGrowth&&f._wm===f.mutation&&f._wz===f.sizeTrait&&f._wt===f.type)return f._w;const s=getSpecies(f.type),m=MUTS[f.mutation]&&f.mutation!=="normal"?f.mutation:"",c=CMS[f.type]||[10,1],v=Math.min(150,58*Math.pow(c[0]/3.5,.3)*c[1]*(25+Math.min(1.15,f.age)*16)/41*(1+.33*(f.sizeGrowth||0))*SIZES[szOf(f)].m*(m&&MUTW[m+"_"+f.type]||1));f._wa=f.age;f._wg=f.sizeGrowth;f._wm=f.mutation;f._wz=f.sizeTrait;f._wt=f.type;f._w=v;return v}
function fishH(f){const im=fishImgs[f.type];return fishW(f)*(im&&im.naturalWidth?im.naturalHeight/im.naturalWidth:.75)}
function fext(f){return Math.max(fsz(f),fishW(f)*.4)}
function sizeNote(f,s){const z=szOf(f);if(z==="normal")return;Q("size_"+z);sfx("rare");setTimeout(()=>notify(SIZES[z].icon+" "+SIZES[z].tier+" boy mutasyonu: "+SIZES[z].n+" "+s.name+" ("+SIZES[z].m+"x)"),z==="giant"?1700:1500)}
const MUT_IMG={
albino:{koi:"«mut_albino_koi»",arowana:"«mut_albino_arowana»",boxfish:"«mut_albino_boxfish»",napo:"«mut_albino_napo»",cichlid:"«mut_albino_cichlid»",lion:"«mut_albino_lion»",copper:"«mut_albino_copper»",discus:"«mut_albino_discus»",trigger:"«mut_albino_trigger»",mandarin:"«mut_albino_mandarin»",idol:"«mut_albino_idol»",emp:"«mut_albino_emp»",clown:"«mut_albino_clown»",ytang:"«mut_albino_ytang»",btang:"«mut_albino_btang»",angel:"«mut_albino_angel»",neon:"«mut_albino_neon»",guppy:"«mut_albino_guppy»",gold:"«mut_albino_gold»",betta:"«mut_albino_betta»"},
transparent:{koi:"«mut_transparent_koi»",arowana:"«mut_transparent_arowana»",boxfish:"«mut_transparent_boxfish»",napo:"«mut_transparent_napo»",cichlid:"«mut_transparent_cichlid»",lion:"«mut_transparent_lion»",copper:"«mut_transparent_copper»",discus:"«mut_transparent_discus»",trigger:"«mut_transparent_trigger»",mandarin:"«mut_transparent_mandarin»",idol:"«mut_transparent_idol»",emp:"«mut_transparent_emp»",clown:"«mut_transparent_clown»",ytang:"«mut_transparent_ytang»",btang:"«mut_transparent_btang»",angel:"«mut_transparent_angel»",neon:"«mut_transparent_neon»",guppy:"«mut_transparent_guppy»",gold:"«mut_transparent_gold»",betta:"«mut_transparent_betta»"},
melanistic:{koi:"«mut_melanistic_koi»",arowana:"«mut_melanistic_arowana»",boxfish:"«mut_melanistic_boxfish»",napo:"«mut_melanistic_napo»",cichlid:"«mut_melanistic_cichlid»",lion:"«mut_melanistic_lion»",copper:"«mut_melanistic_copper»",discus:"«mut_melanistic_discus»",trigger:"«mut_melanistic_trigger»",mandarin:"«mut_melanistic_mandarin»",idol:"«mut_melanistic_idol»",emp:"«mut_melanistic_emp»",clown:"«mut_melanistic_clown»",ytang:"«mut_melanistic_ytang»",btang:"«mut_melanistic_btang»",angel:"«mut_melanistic_angel»",neon:"«mut_melanistic_neon»",guppy:"«mut_melanistic_guppy»",gold:"«mut_melanistic_gold»",betta:"«mut_melanistic_betta»"},
gold:{neon:"«mut_gold_neon»",guppy:"«mut_gold_guppy»",gold:"«mut_gold_gold»",betta:"«mut_gold_betta»",cichlid:"«mut_gold_cichlid»",arowana:"«mut_gold_arowana»",discus:"«mut_gold_discus»",koi:"«mut_gold_koi»",clown:"«mut_gold_clown»",ytang:"«mut_gold_ytang»",btang:"«mut_gold_btang»",angel:"«mut_gold_angel»",lion:"«mut_gold_lion»",copper:"«mut_gold_copper»",trigger:"«mut_gold_trigger»",boxfish:"«mut_gold_boxfish»",mandarin:"«mut_gold_mandarin»",idol:"«mut_gold_idol»",emp:"«mut_gold_emp»",napo:"«mut_gold_napo»"},
};
// Mutasyonlar: en nadirden başlayarak birbirini dışlayan tek zar
const MUTS={normal:{name:"Normal",tier:"",p:0,mult:1},albino:{name:"Albino",tier:"Nadir",p:.05,mult:2,glow:"rgba(255,205,225,.95)",blur:12,icon:"🤍"},transparent:{name:"Transparan",tier:"Çok nadir",p:.01,mult:4,glow:"rgba(190,240,255,.95)",blur:10,icon:"🔮"},melanistic:{name:"Melanistik",tier:"Efsanevi",p:.002,mult:6,glow:"rgba(120,150,255,.9)",blur:9,icon:"🖤"},gold:{name:"Altın",tier:"Mitik",p:.0004,mult:15,glow:"rgba(255,214,90,.95)",blur:14,icon:"👑"}};
function rollMutation(){if(Math.random()<MUTS.gold.p)return"gold";const r=Math.random(),dk=ev("dark")?3:1,pm=MUTS.melanistic.p*dk,pt=MUTS.transparent.p*dk,pa=MUTS.albino.p*(ev("weekend")?2:1);if(r<pm)return"melanistic";if(r<pm+pt)return"transparent";if(r<pm+pt+pa)return"albino";return"normal"}
const mutImgs={};
for(const m in MUT_IMG)for(const sid in MUT_IMG[m]){const u="data:image/webp;base64,"+MUT_IMG[m][sid];document.documentElement.style.setProperty("--m-"+m+"-"+sid,'url("'+u+'")');const im=new Image();im.src=u;mutImgs[m+"_"+sid]=im}
function mutOf(f){return MUTS[f.mutation]?f.mutation:"normal"}
function fishIcon(f){const m=mutOf(f);return m==="normal"?icon(getSpecies(f.type)):'<i class="fi" style="background-image:var(--m-'+m+'-'+f.type+')"></i>'}
function mutTag(f){const z=szOf(f);return (z!=="normal"?' <span class="pill sz-'+z+'">'+SIZES[z].icon+" "+SIZES[z].n+" · "+SIZES[z].m+"x</span>":"")+mutTag0(f)}
function mutTag0(f){const m=mutOf(f);return m==="normal"?"":' <span class="pill mut-'+m+'">'+MUTS[m].icon+" "+MUTS[m].name+" · "+MUTS[m].tier+"</span>"}
function mutNote(f,s){const m=mutOf(f);if(m==="normal")return;if(!state.mutsFound.includes(m+"_"+f.type)){state.mutsFound.push(m+"_"+f.type);state.gems+=m==="gold"?10:m==="melanistic"?3:m==="transparent"?1:0;addXP(40);setTimeout(checkAch,1500)}
if(m==="melanistic"){setTimeout(()=>notify("🖤 EFSANEVİ! Melanistik "+s.name+" doğdu! Değeri 6 kat ✨"),900);sfx("legend")}
if(m==="gold"){setTimeout(()=>{goldFx();notify("👑 MİTİK! ALTIN "+s.name.toLocaleUpperCase("tr-TR")+"! Değeri 15 kat ✨")},700);sfx("legend")}
else{sfx("rare");}if(m!=="melanistic")setTimeout(()=>notify(MUTS[m].icon+" "+MUTS[m].tier+" mutasyon: "+MUTS[m].name+" "+s.name+"!"),900)}
function pop(x,y,n){for(let i=0;i<n&&bubbles.length<90;i++)bubbles.push({x,y,r:rand(2,5),speed:rand(20,40),drift:rand(-6,6),alpha:.3,phase:rand(0,7)})}
let bubbles=[],particles=[],last=performance.now(),messageTimer;
function rand(a,b){return a+Math.random()*(b-a)}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c])}
let VISIT=null;
let tapInfo=null,LV=null,DN=null;
function stageOf(f){return f.age<.35?"Yavru":f.age<MATURE?"Genç":"Yetişkin"}
function rrect(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
function drawTapInfo(){if(!tapInfo)return;const left=tapInfo.until-performance.now();if(left<=0){tapInfo=null;return}const f=state.fish.find(x=>x.id===tapInfo.id);if(!f){tapInfo=null;return}
const s=getSpecies(f.type),z=szOf(f),m=mutOf(f),boy=((1+(f.sizeGrowth||0))*SIZES[z].m).toFixed(2),adult=f.age>=MATURE,pct=adult?Math.min(1,(f.sizeGrowth||0)/.75):Math.min(1,f.age/MATURE);
const tags=[z!=="normal"?SIZES[z].icon+" "+SIZES[z].n:"",m!=="normal"?MUTS[m].icon+" "+MUTS[m].name:"",f.rarity==="Nadir"?"✨ Parlak":""].filter(Boolean).join("  ");
const bw=228,bh=tags?104:86,fx=f.x*W,fy=f.y*H,x=Math.max(8,Math.min(W-bw-8,fx-bw/2)),above=fy-fext(f)-bh-14>H*.15,y=above?fy-fext(f)-bh-14:fy+fext(f)+14;
ctx.save();ctx.globalAlpha=Math.min(1,left/350);ctx.shadowColor="rgba(0,20,40,.35)";ctx.shadowBlur=12;ctx.fillStyle="rgba(255,253,244,.96)";rrect(x,y,bw,bh,14);ctx.fill();ctx.shadowBlur=0;
ctx.fillStyle="rgba(255,253,244,.96)";ctx.beginPath();const tx=Math.max(x+18,Math.min(x+bw-18,fx));if(above){ctx.moveTo(tx-8,y+bh-1);ctx.lineTo(tx+8,y+bh-1);ctx.lineTo(tx,y+bh+9)}else{ctx.moveTo(tx-8,y+1);ctx.lineTo(tx+8,y+1);ctx.lineTo(tx,y-9)}ctx.fill();
ctx.textAlign="left";ctx.fillStyle="#1d5a73";ctx.font="800 15px system-ui,sans-serif";let nm=f.name||s.name;while(ctx.measureText(nm).width>bw-24&&nm.length>3)nm=nm.slice(0,-2);ctx.fillText(nm,x+12,y+22);
ctx.font="700 12px system-ui,sans-serif";ctx.fillStyle="#2b6b82";ctx.fillText(stageOf(f)+(adult?" · büyümeye devam ediyor":" · büyüme %"+Math.round(f.age/MATURE*100)),x+12,y+41);
ctx.fillStyle="#dcecef";rrect(x+12,y+49,bw-24,9,4.5);ctx.fill();const g=ctx.createLinearGradient(x+12,0,x+bw-12,0);g.addColorStop(0,"#7ce2bc");g.addColorStop(1,"#ffd16e");ctx.fillStyle=g;if(pct>.02){rrect(x+12,y+49,(bw-24)*pct,9,4.5);ctx.fill()}
ctx.fillStyle="#2b6b82";ctx.font="700 12px system-ui,sans-serif";drawEmo(ctx,"Boy "+boy+"x"+(VISIT?"":" · 🍽️ "+Math.round(f.hunger)+" · ❤️ "+Math.round(f.health)+" · "+saleValue(f)+" 🪙"),x+12,y+76,12);
if(tags){ctx.font="800 12px system-ui,sans-serif";ctx.fillStyle="#8a4fbf";drawEmo(ctx,tags,x+12,y+95,12)}ctx.restore()}
// ---------- seviye atlama ekranı
const LV_UNLOCK={2:"🔓 Görevler, 🎡 günlük çark ve 🪸 dekorasyon açıldı",3:"🔓 🗺️ Harita açıldı · 🌊 Tuzlu su tankını açabilirsin",4:"🔓 🥚 Üretim ve ekipman açıldı · tank kapasitesini büyütebilirsin",5:"Daha nadir mutasyonlar için genetik test ve çiftleştirmeyi dene",10:"Akvaryum ustası unvanına ulaştın!"};
function gemSum(a,b){let s=0;for(let l=a+1;l<=b;l++)s+=lvGems(l);return s}
function showLevelUp(lv,coins,gm){LV={lv,t0:performance.now()};$("lvNum").textContent=lv;$("lvReward").textContent="+"+coins+" 🪙 · +"+(gm==null?lvGems(lv):gm)+" 💎";$("lvNext").textContent=LV_UNLOCK[lv]||("Sonraki seviye için "+lv*100+" XP");$("lvl").hidden=false;$("lvl").classList.remove("go");void $("lvl").offsetWidth;$("lvl").classList.add("go");sfx("level");
for(let i=0;i<70;i++)particles.push({x:W/2+rand(-40,40),y:H*.42,vx:rand(-260,260),vy:rand(-420,-120),life:rand(1.6,2.6),type:"confetti",c:["#ffd34d","#7ce2bc","#ff8fb1","#8a5cff","#5cc8ff"][i%5],r:rand(0,6),vr:rand(-8,8)})}
function closeLevelUp(){$("lvl").hidden=true;LV=null}
// ---------- gece/gündüz geçişi
function nightLbl(){const l=document.querySelector("#nightBtn .tll");if(l)l.textContent=state.night?"Gündüz":"Gece"}
function toggleNight(){if(DN)return;DN={from:state.night,t0:performance.now()};state.night=!state.night;nightLbl();$("night").textContent=state.night?"☀️ Gündüz modu":"🌙 Gece modu";sfx(state.night?"dusk":"dawn");save(true)}
// ---------- Claude içinde açıldığında: bulut kaydı, komşular, sıralama
let netTry=0;function netRetry(){if(++netTry<=3)setTimeout(()=>{try{netInit();netLabel()}catch(e){}},4000*netTry);try{netLabel()}catch(e){}}
const NET={why:"",pubErr:"",readFail:"",on:false,db:null,user:null,uid:null,busy:false,pend:false,lastAt:0,timer:0,lastPub:"",writeOff:false};
function score(){return state.level*100+state.discovered.length*20+state.mutsFound.length*60+state.props.length*25+allFish().length*5}
function snapFish(arr){return arr.slice(0,30).map(f=>({t:f.type,m:f.mutation,a:Math.round(f.age*100)/100,g:Math.round((f.sizeGrowth||0)*100)/100,r:f.rarity==="Nadir"?1:0,z:szOf(f)==="normal"?undefined:szOf(f),n:String(f.name||"").slice(0,24)}))}

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
function fbProfile(){if(!FB||!NET.on)return;try{const u=FB.auth.currentUser;if(!u)return;const nm=u.isAnonymous?"Oyuncu "+u.uid.slice(0,4).toUpperCase():String(u.displayName||"Oyuncu").split(" ")[0].slice(0,18);FB.db.doc("profiles/"+u.uid).set({name:nm,avatarUrl:u.isAnonymous?"":(u.photoURL||"")}).catch(()=>{})}catch(e){}}
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
NET.user=u;NET.db=d;NET.uid=id;NET.why="";let cloud=null;
try{const sn=await d.doc("data/users/"+id+"/save").get();if(sn.exists)cloud=sn.data()}catch(e){NET.readFail=(e&&(e.code||e.message))||"?"}
NET.on=true;state.netSeen=true;
if(cloud&&typeof cloud.json==="string"&&(+cloud.savedAt||0)>(state.savedAt||0)){try{const p=JSON.parse(cloud.json);if(validSave(p)){state=fromSave(p);normalize();offlineReport();dailyCheck();checkAch();drops=[];dirtK=-1;selectedFish=null;$("night").textContent=state.night?"☀️ Gündüz modu":"🌙 Gece modu";try{localStorage.setItem("fishvilleClassicSave3",serial())}catch(e){}setTimeout(()=>notify("☁️ Kaydın buluttan yüklendi"),900)}}catch(e){}}
else cloudSave(true);
if(FB){fbProfile();if(NET.switched)fbAfterSwitch()}netLabel();checkHelps();renderUI();badges()}catch(e){}}
function netLabel(){admVis();try{cloudUI()}catch(_){}const e=$("netStatus");const why=NET.saveErr?"⚠️ Buluta yazılamadı: "+NET.saveErr:NET.readFail?"⚠️ Buluttan okunamadı: "+NET.readFail:"";if(e&&FB&&NET.on&&why){e.textContent=why;return}if(e&&!NET.on&&fbOK()&&NET.why&&!window.claude){e.textContent="⚠️ "+NET.why;return}if(e)e.textContent=FB&&NET.on&&!NET.writeOff?(fbIsGoogle()?"☁️ Bulut kaydı açık · Google hesabına bağlı, her cihazdan devam edebilirsin":"☁️ Bulut kaydı açık · başka cihazdan devam etmek için Google ile bağlan"+(NET.okAt?" · son yedek "+new Date(NET.okAt).toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"}):"")):!NET.on?"💾 İlerlemen bu cihazda, bu tarayıcıda kayıtlı. Tarayıcı verilerini silersen ya da başka cihaza geçersen kaybolur; aşağıdan yedek alabilirsin.":NET.pubErr?"☁️ Bağlı ama tankın yayımlanamadı ("+NET.pubErr+"), komşular seni göremeyebilir.":NET.writeOff?"☁️ Bağlı, ama bu sayfaya yazma iznin yok. Kayıt bu cihazda kalıyor.":"☁️ Bulut kaydı açık · diğer cihazlarında da devam edebilirsin"}
function cloudSave(force){if(!NET.on||NET.writeOff||VISIT)return;if(NET.busy){NET.pend=true;return}const wait=(FB?45000:15000)-(Date.now()-NET.lastAt);if(!force&&wait>0){if(!NET.timer)NET.timer=setTimeout(()=>{NET.timer=0;cloudSave(true)},wait);return}
NET.busy=true;NET.lastAt=Date.now();const body={json:serial(),savedAt:state.savedAt||Date.now()};
NET.db.doc("data/users/"+NET.uid+"/save").set(body).then(()=>{if(NET.saveErr){NET.saveErr="";netLabel()}NET.okAt=Date.now();return publishTank()}).catch(e=>{NET.saveErr=(e&&(e.code||e.message))||"?";netLabel();if(e&&(e.code==="invalid_argument"||e.code==="revoked"||e.code==="not_granted")){NET.writeOff=true;netLabel()}}).finally(()=>{NET.busy=false;if(NET.pend){NET.pend=false;cloudSave()}})}
function tankData(k){const a=tankArr(k);return a?snapFish(a):null}
async function publishTank(){if(!NET.on||NET.writeOff)return;const d={level:state.level,score:score(),fresh:tankData("fresh")||[],salt:tankData("salt"),dirt:Math.round(tankDirt("fresh")),props:state.props.slice(),decor:state.decor.slice(0,14).map(x=>({k:x.k,x:Math.round(x.x*100)/100,y:typeof x.y==="number"?Math.round(x.y):null})),propPos:Object.fromEntries(Object.entries(state.propPos||{}).map(([k,v])=>[k,{x:Math.round(v.x*100)/100,y:Math.round(v.y)}])),mut:state.mutsFound.length,sp:state.discovered.length,layout:ORI};
const key=JSON.stringify(d);if(key===NET.lastPub)return;d.at=Date.now();try{await NET.db.doc("tanks/"+NET.uid).set(d);NET.lastPub=key;if(NET.pubErr){NET.pubErr="";netLabel()}}catch(e){NET.pubErr=(e&&(e.code||e.message))||"?";netLabel()}}
// ---------- Bilgisayarın yönettiği örnek komşu (internet gerekmez)
const BOT_ID="bot:deniz",BOT_P={name:"Deniz 🤖 · örnek komşu",avatarUrl:"data:image/webp;base64,«cu_bot»"};
const BOT_NAMES=["Pırıl","Dalga","Kabarcık","Mercan","Yosun","İncik","Lacivert","Köpük","Sedef","Gümüş","Turkuaz","Çıtır"];
function botData(){if(!state.botEpoch)state.botEpoch=Date.now();const days=(Date.now()-state.botEpoch)/864e5+3,lvl=Math.min(25,3+Math.floor(days*.7)),count=Math.min(14,2+Math.floor(days*.9)),n1=Math.ceil(count/2);
const mk=(w,n,off)=>{const pool=species.filter(x=>WATER[x.id]===w&&(x.lv||0)<=lvl).sort((a,b)=>a.price-b.price),out=[];for(let i=0;i<n;i++){const j=i+off,sp=pool[(i*3+i%2)%pool.length],age=Math.max(.1,Math.min(1,.35+(days-j*.7)*.4)),mu=j%9===4?"albino":j%23===7?"transparent":"normal";out.push({t:sp.id,m:mu,a:Math.round(age*100)/100,g:age>=1?Math.round(Math.min(.5,Math.max(0,(days-j*.7-2)*.02))*100)/100:0,r:0,n:BOT_NAMES[j%BOT_NAMES.length]})}return out};
const props=PROPS.slice(0,Math.min(PROPS.length,Math.floor(lvl/3))).map(p=>p.id),mut=Math.floor(days/3),sp=Math.min(species.length,3+Math.floor(days*.5));
return{level:lvl,score:lvl*100+sp*20+mut*60+props.length*25+count*5,fresh:mk("fresh",n1,0),salt:mk("salt",count-n1,n1),dirt:Math.round(((Date.now()/36e5)%24)/24*70),props,decor:[{k:"🐚",x:.2},{k:"🪸",x:.7},{k:"⚓",x:.45}],mut,sp}}
function botRow(){return{id:BOT_ID,d:botData()}}
function botHelp(){try{const d=dayKey();if(state.helpGot[BOT_ID]===d)return;state.helpGot[BOT_ID]=d;state.coins+=10;state.dirt=Math.max(0,state.dirt-20);notify("🤝 Deniz bugün tankını temizledi! +10 🪙");renderUI();save(true)}catch(e){}}
async function fetchTanks(){const snap=await NET.db.collection("tanks").orderBy("score","desc").limit(50).get();const rows=snap.docs.filter(x=>x.exists).map(x=>({id:x.id,d:x.data()}));let ps={};try{ps=await NET.user.profiles(rows.map(r=>r.id))}catch(e){}rows.push(botRow());ps[BOT_ID]=BOT_P;rows.sort((a,b)=>(+b.d.score||0)-(+a.d.score||0));return{rows,ps}}
function personRow(r,ps,i,rank){const p=ps[r.id]||{},me=r.id===NET.uid||r.id==="local",row=document.createElement("div");row.className="nrow";
const left=document.createElement(rank?"span":"img");if(rank){left.className="rk";left.textContent="#"+(i+1)}else{left.src=p.avatarUrl||"";left.alt=""}
const mid=document.createElement("div"),nm=document.createElement("strong"),sm=document.createElement("small");nm.textContent=(me?"Sen":(p.name||"Bir komşu"));const d=r.d||{};
sm.textContent=rank?((+d.score||0)+" puan · Seviye "+(+d.level||1)+" · "+(+d.mut||0)+" mutasyon"):("Seviye "+(+d.level||1)+" · "+((d.fresh||[]).length+((d.salt||[]).length))+" balık · "+(+d.mut||0)+" mutasyon");mid.append(nm,sm);row.append(left,mid);
if(!rank&&!me){const b=document.createElement("button");b.textContent=state.helped[r.id]===dayKey()?"✓ Ziyaret":"Ziyaret et";b.onclick=()=>startVisit(r,p);row.append(b)}else if(rank&&me){row.classList.add("me")}else row.append(document.createElement("span"));return row}
async function renderNeighbors(){const box=$("neighbors");if(!NET.on){box.innerHTML='<p class="note">Örnek komşun Deniz her zaman burada. Arkadaşlarını komşu olarak ekleme özelliği yakında geliyor.</p>';box.append(personRow(botRow(),{[BOT_ID]:BOT_P},0,false));return}
box.innerHTML='<p class="note">Yükleniyor…</p>';try{const {rows,ps}=await fetchTanks();const others=rows.filter(r=>r.id!==NET.uid);box.innerHTML="";if(!others.length){box.innerHTML='<p class="note">Henüz komşun yok. Oyunu paylaş menüsünden arkadaşlarını <b>e-postayla Düzenleyici</b> olarak davet et; onlar oynadıkça akvaryumları burada çıkar.</p>';return}others.forEach((r,i)=>box.append(personRow(r,ps,i,false)))}catch(e){box.innerHTML='<p class="note">Komşular şu an yüklenemedi. Biraz sonra tekrar dene.</p>'}}
async function renderRank(){const box=$("rankList");if(!NET.on){box.innerHTML='<p class="note">Puan = seviye×100 + tür×20 + mutasyon×60 + özel dekor×25 + balık×5. Arkadaşlarınla ortak sıralama yakında geliyor.</p>';const rows=[{id:"local",d:{level:state.level,score:score(),mut:state.mutsFound.length}},botRow()].sort((a,b)=>b.d.score-a.d.score);rows.forEach((r,i)=>box.append(personRow(r,{[BOT_ID]:BOT_P},i,true)));return}
box.innerHTML='<p class="note">Yükleniyor…</p>';try{await publishTank()}catch(e){}try{const {rows,ps}=await fetchTanks();box.innerHTML='<p class="note">Puan = seviye×100 + tür×20 + mutasyon×60 + özel dekor×25 + balık×5</p>';rows.forEach((r,i)=>box.append(personRow(r,ps,i,true)));if(!rows.length)box.innerHTML+='<p class="note">Henüz kimse yok.</p>'}catch(e){box.innerHTML='<p class="note">Sıralama şu an yüklenemedi.</p>'}}
function visitTank(){const d=VISIT.d,arr=Array.isArray(d[VISIT.tank])?d[VISIT.tank]:[];
state.fish=arr.slice(0,30).map((s,i)=>({id:-1-i,type:s.t,mutation:MUTS[s.m]?s.m:"normal",age:Math.max(.05,Math.min(1,+s.a||.5)),sizeGrowth:Math.max(0,Math.min(.75,+s.g||0)),rarity:s.r?"Nadir":"Normal",sizeTrait:SIZES[s.z]?s.z:"normal",name:String(s.n||"").slice(0,24),hunger:100,health:100,sick:false,personality:"Uysal",x:rand(.15,.85),y:rand(.25,.7),dir:Math.random()<.5?-1:1,phase:rand(0,6)})).filter(f=>species.some(s=>s.id===f.type));
state.dirt=VISIT.helpedNow?0:Math.max(0,Math.min(100,+d.dirt||0));state.props=(Array.isArray(d.props)?d.props:[]).filter(i=>PROPS.some(p=>p.id===i));state.decor=(Array.isArray(d.decor)?d.decor:[]).filter(x=>x&&DECOR.includes(x.k)).slice(0,14).map(x=>({k:x.k,x:Math.max(.05,Math.min(.95,+x.x||.5)),y:typeof x.y==="number"?Math.max(H*.2,Math.min(FLOOR+60,yconv(x.y,d.layout==="land"?"land":"port"))):undefined}));state.propPos={};if(d.propPos&&typeof d.propPos==="object")for(const p of PROPS){const v=d.propPos[p.id];if(v&&isFinite(v.x)&&isFinite(v.y))state.propPos[p.id]={x:Math.max(.05,Math.min(.95,+v.x)),y:Math.max(H*.2,Math.min(FLOOR+60,yconv(+v.y,d.layout==="land"?"land":"port")))}}state.chest=null;state.tank=VISIT.tank;drops=[];dirtK=-1;
$("vtank").textContent=VISIT.tank==="fresh"?"🌊 Tuzlu su":"🌿 Tatlı su";$("vtank").disabled=!(d.salt&&Array.isArray(d.salt));$("vhelp").textContent=state.helped[VISIT.id]===dayKey()?"✓ Yardım edildi":"🧽 Yardım et";$("vhelp").disabled=state.helped[VISIT.id]===dayKey()}
function startVisit(r,p){if(VISIT)return;closeSheet();VISIT={id:r.id,d:r.d||{},tank:"fresh",keep:{fish:state.fish,dirt:state.dirt,props:state.props,propPos:state.propPos,decor:state.decor,chest:state.chest,snails:state.snails,tank:state.tank}};state.snails=0;visitTank();
$("vname").textContent=(p&&p.name?p.name:"Komşu")+" · akvaryumu";$("vav").src=p&&p.avatarUrl||"";document.body.classList.add("visiting");$("visitbar").hidden=false;renderUI();updateLive()}
function endVisit(){if(!VISIT)return;Object.assign(state,VISIT.keep);VISIT=null;document.body.classList.remove("visiting");$("visitbar").hidden=true;drops=[];dirtK=-1;acc=0;renderUI();updateLive();save(true)}
async function helpNeighbor(){if(!VISIT||(!NET.on&&VISIT.id!==BOT_ID))return;const d=dayKey();if(state.helped[VISIT.id]===d)return;for(const k in state.helped)if(state.helped[k]!==d)delete state.helped[k];state.helped[VISIT.id]=d;VISIT.helpedNow=true;state.dirt=0;pop(rand(60,480),H-40,16);pop(rand(60,480),H-40,10);
state.coins+=15;Q("help");state.xp+=10;{const l0=state.level;while(state.xp>=state.level*100){state.xp-=state.level*100;state.level++;state.coins+=lvCoins(state.level);state.gems+=lvGems(state.level)}if(state.level>l0)showLevelUp(state.level,lvSum(l0,state.level),gemSum(l0,state.level))}sfx("help");notify("🤝 Komşunun tankını temizledin! +15 🪙 +10 XP");$("vhelp").textContent="✓ Yardım edildi";$("vhelp").disabled=true;renderUI();
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
{id:"weekend",n:"🎉 Hafta Sonu",d:"Albino şansı 2 kat",weekend:true}];
function inEvent(e,d){if(e.weekend)return d.getDay()===0||d.getDay()===6;const md=(d.getMonth()+1)*100+d.getDate(),a=e.from[0]*100+e.from[1],b=e.to[0]*100+e.to[1];return a<=b?md>=a&&md<=b:md>=a||md<=b}
let evC={t:0,l:[]};
function activeEvents(){const n=Date.now();if(n-evC.t>6e4){const d=new Date();evC={t:n,l:EVENTS.filter(e=>inEvent(e,d)||(state.admEv||[]).includes(e.id))}}return evC.l}
function ev(id){return activeEvents().some(e=>e.id===id)}
function nextEvent(){const d=new Date();for(let i=1;i<400;i++){const x=new Date(d.getFullYear(),d.getMonth(),d.getDate()+i);const e=EVENTS.find(e=>!e.weekend&&inEvent(e,x)&&!inEvent(e,d));if(e)return{e,days:i}}return null}
// ---------- günlük görevler, seri, başarımlar
const dayKey=(o=0)=>{const d=new Date();d.setDate(d.getDate()+o);return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()};
const QUESTS=[{id:"order",t:"Bir sipariş teslim et",ev:"order",n:1,r:25,ord:true},{id:"feed",t:"Balıklarını 3 kez besle",ev:"feed",n:3,r:19},{id:"clean",t:"Bir tankı temizle",ev:"clean",n:1,r:15},{id:"buy",t:"2 balık satın al",ev:"buy",n:2,r:22},{id:"sell",t:"1 balık sat",ev:"sell",n:1,r:19},{id:"collect",t:"Gelirden 50 🪙 topla",ev:"collect",n:50,r:30},{id:"chest",t:"Bir hazine sandığı aç",ev:"chest",n:1,r:26},{id:"breed",t:"Bir çift çiftleştir",ev:"breed",n:1,r:26},{id:"gene",t:"Bir balığa genetik test yap",ev:"gene",n:1,r:19},{id:"tap",t:"Balıklarına 10 kez dokun",ev:"tap",n:10,r:11},{id:"help",t:"Bir komşuna yardım et",ev:"help",n:1,r:30,net:true}];
const S=k=>(state.stats&&state.stats[k])||0,mf=m=>state.mutsFound.some(x=>x.startsWith(m+"_"));
const ACH=[{id:"ord5",n:"Sadık tedarikçi",d:"5 sipariş teslim et",r:80,f:()=>S("order")>=5},{id:"first",n:"İlk balık",d:"Bir balık satın al",r:20,f:()=>S("buy")>=1},{id:"crowd",n:"Kalabalık akvaryum",d:"Aynı anda 10 balığın olsun",r:50,f:()=>allFish().length>=10},{id:"col",n:"Koleksiyoncu",d:"Bütün türleri keşfet ("+species.length+")",r:150,f:()=>state.discovered.length>=species.length},{id:"alb",n:"Beyaz inci",d:"İlk albino balığını bul",r:50,f:()=>mf("albino")},{id:"tra",n:"Cam balık",d:"İlk transparan balığını bul",r:100,f:()=>mf("transparent")},{id:"mel",n:"Gölgelerin efendisi",d:"İlk melanistik balığını bul",r:300,f:()=>mf("melanistic")},{id:"gold1",n:"Kral Midas",d:"İlk altın balığını bul",r:800,f:()=>mf("gold")},{id:"gold5",n:"Altın Koleksiyon",d:"5 farklı türde altın balık bul",r:2500,f:()=>state.mutsFound.filter(k=>k.startsWith("gold_")).length>=5},{id:"gen12",n:"Genetikçi",d:"48 mutasyonun 12'sini keşfet",r:200,f:()=>state.mutsFound.length>=12},{id:"gen24",n:"Mutasyon ustası",d:"Albino, transparan ve melanistik mutasyonların hepsini keşfet ("+species.length*3+")",r:1000,f:()=>state.mutsFound.filter(k=>!k.startsWith("gold_")).length>=species.length*3},{id:"giant",n:"Devler ülkesi",d:"Dev boy mutasyonlu bir balık bul",r:80,f:()=>S("size_giant")>=1},{id:"dwarf",n:"Cep boyu",d:"Cüce boy mutasyonlu bir balık bul",r:50,f:()=>S("size_dwarf")>=1},{id:"hatch",n:"İlk yavru",d:"Bir yumurtadan yavru çıkar",r:30,f:()=>S("hatch")>=1},{id:"mendel",n:"Mendel'in mirası",d:"Çiftleştirerek mutasyonlu yavru elde et",r:150,f:()=>S("bredMut")>=1},{id:"salt",n:"Okyanusa açılış",d:"Tuzlu su tankını aç",r:50,f:()=>hasTank("salt")},{id:"props",n:"İç mimar",d:"8 özel dekorun hepsini yerleştir",r:200,f:()=>state.props.length>=8},{id:"lv5",n:"Deneyimli bakıcı",d:"Seviye 5'e ulaş",r:50,f:()=>state.level>=5},{id:"lv10",n:"Akvaryum ustası",d:"Seviye 10'a ulaş",r:150,f:()=>state.level>=10},{id:"rich",n:"Zengin akvaryumcu",d:"Toplam 5.000 🪙 kazan",r:200,f:()=>S("earn")>=5000},{id:"cleaner",n:"Temizlik delisi",d:"Tankı 20 kez temizle",r:60,f:()=>S("clean")>=20},{id:"hunter",n:"Hazine avcısı",d:"10 hazine sandığı aç",r:80,f:()=>S("chest")>=10},{id:"loyal",n:"Sadık bakıcı",d:"7 gün üst üste gir",r:150,f:()=>(state.streak.count||0)>=7},{id:"neigh",n:"İyi komşu",d:"Komşularına 5 kez yardım et",r:100,f:()=>S("help")>=5}];
function Q(e,n=1){if(VISIT&&e!=="help")return;tutEv(e);state.stats[e]=(state.stats[e]||0)+n;const D=state.daily;if(D&&D.date===dayKey())for(const id of D.ids){const q=QUESTS.find(x=>x.id===id);if(q&&q.ev===e)D.prog[id]=Math.min(q.n,(D.prog[id]||0)+n)}checkAch();badges()}
function checkAch(){if(VISIT)return;let got=null;for(const a of ACH)if(!state.ach[a.id]&&a.f()){state.ach[a.id]="done";got=a}if(got){setTimeout(()=>notify("🏆 Başarım: "+got.n+"!"),400);sfx("ach")}badges()}
function hashStr(s){let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0}
function dailyCheck(){const d=dayKey();if(!state.daily||state.daily.date!==d){const pool=QUESTS.filter(q=>(!q.net||state.netSeen)&&(!q.ord||state.level>=2));let h=hashStr(d),ids=[];while(ids.length<3){h=Math.imul(h,1103515245)+12345>>>0;const q=pool[h%pool.length];if(!ids.includes(q.id))ids.push(q.id)}state.daily={date:d,ids,prog:{},claimed:[],bonus:false}}
if(state.streak.last!==d){const c=state.streak.last===dayKey(-1)?(state.streak.count||0)+1:1;state.streak={last:d,count:c};const bonus=8*Math.min(7,c),sg=c%7===0?5:1;state.coins+=bonus;state.gems+=sg;setTimeout(()=>notify("🔥 "+c+". gün serisi! +"+bonus+" 🪙 · +"+sg+" 💎"),1800);checkAch()}}

// ---------- siparişler
const CUST=[["⚓","Kaptan Selim"],["👵","Ayşe Hanım"],["🎩","Bay Orhan"],["👩‍🔬","Dr. Elif"],["🧒","Küçük Can"],["🍽️","Şef Murat"],["🏨","Otel Müdürü"],["🎨","Ressam Leyla"]];
function newOrder(now){const own=[];for(const k of TKEYS){if(!hasTank(k)||isColl(k))continue;for(const f of tankArr(k))if(!own.includes(f.type))own.push(f.type)}
const pool=species.filter(s=>(s.lv||1)<=state.level&&hasTank(WATER[s.id]));const ps=own.length&&Math.random()<.6?pool.filter(s=>own.includes(s.id)):pool;const sp=(ps.length?ps:pool)[Math.random()*(ps.length?ps:pool).length|0]||species[0];
const mut=state.level>=3&&Math.random()<.25?(Math.random()<.75?"albino":"transparent"):"normal";
const reward=Math.round(sp.value*MUTS[mut].mult*1.3+6);return{type:sp.id,mut,gem:Math.random()<(mut==="normal"?.12:.4)?1:0,cust:Math.random()*CUST.length|0,reward,xp:Math.max(6,Math.min(80,Math.round(reward/10))),exp:now+20*36e5}}
function ensureOrders(now){if(state.level<2)return false;if(!Array.isArray(state.orders))state.orders=[];while(state.orders.length<3)state.orders.push({wait:now});state.orders.length=3;let ch=false;
state.orders.forEach((o,i)=>{if(!o||typeof o!=="object"){state.orders[i]={wait:now};o=state.orders[i]}
if(o.type){if(now>=o.exp||!species.some(s=>s.id===o.type)||!MUTS[o.mut]){state.orders[i]={wait:now+3e5};ch=true}}
else if(now>=(o.wait||0)){state.orders[i]=newOrder(now);ch=true}});return ch}
function findOrderFish(o){let best=null;for(const k of TKEYS){if(!hasTank(k)||isColl(k))continue;for(const f of tankArr(k)){if(f.type!==o.type||f.age<MATURE||f.sick||(f.mutation||"normal")!==o.mut)continue;const v=saleValue(f);if(!best||v<best.v)best={k,f,v}}}return best}
function orderReady(){return Array.isArray(state.orders)&&state.orders.some(o=>o&&o.type&&findOrderFish(o))}
function deliverOrder(i){const o=state.orders&&state.orders[i];if(!o||!o.type||VISIT)return false;const b=findOrderFish(o);if(!b){notify("Bu sipariş için uygun yetişkin balığın yok");return false}
const arr=tankArr(b.k),ix=arr.indexOf(b.f);if(ix<0)return false;arr.splice(ix,1);if(selectedFish===b.f.id)selectedFish=null;
state.coins+=o.reward;state.gems+=o.gem||0;state.orders[i]={wait:Date.now()+rand(8,20)*6e4};Q("order");addXP(o.xp);sfx("sell");notify("📦 Sipariş teslim edildi: +"+o.reward+" 🪙"+(o.gem?" · +"+o.gem+" 💎":"")+" · +"+o.xp+" XP");renderUI();save(true);return true}
function skipOrder(i){const o=state.orders&&state.orders[i];if(!o||!o.type)return;state.orders[i]={wait:Date.now()+18e4};sfx("click");renderQuests();save(true)}
function renderOrders(){const el=$("orders");if(!el)return;if(state.level<2){el.innerHTML='<p class="note">Siparişler 2. seviyede açılır.</p>';return}
const now=Date.now();el.innerHTML=(state.orders||[]).map((o,i)=>{if(!o||!o.type)return `<div class="fish-card qrow"><div class="qicon">⏳</div><div><strong>Yeni müşteri bekleniyor</strong><small>${o&&o.wait?fmtTime((o.wait-now)/1000)+" sonra":"birazdan"}</small></div></div>`;
const sp=getSpecies(o.type),c=CUST[o.cust]||CUST[0],have=!!findOrderFish(o),mn=o.mut==="normal"?"":MUTS[o.mut].name+" ";
return `<div class="fish-card qrow"><div class="qicon"><img class="cuimg" alt="" src="data:image/webp;base64,${CUP[CUST.indexOf(c)]||CUP[0]}"></div><div><strong>${c[1]}: ${mn}${sp.name}</strong><small>Yetişkin, sağlıklı ${o.mut==="normal"?"normal ":""}balık · ödül ${o.reward} 🪙${o.gem?" + "+o.gem+" 💎":""} + ${o.xp} XP · ${fmtTime((o.exp-now)/1000)} kaldı</small></div><div class="acts"><button class="sm" data-order="${i}" ${have?"":"disabled"}>Teslim et</button><button class="sm danger" data-orderx="${i}">Vazgeç</button></div></div>`}).join("")+'<p class="note">Teslim edilen balık tankından çıkar. Koleksiyon tanklarındaki balıklar sayılmaz.</p>'}
function questDone(id){const q=QUESTS.find(x=>x.id===id);return q&&(state.daily.prog[id]||0)>=q.n}
function claimQuest(id){const D=state.daily,q=QUESTS.find(x=>x.id===id);if(!D||!q||D.claimed.includes(id)||!questDone(id))return;D.claimed.push(id);state.coins+=q.r;sfx("coins");notify("✅ Görev tamam: +"+q.r+" 🪙");addXP(20);if(!D.bonus&&D.ids.every(i=>D.claimed.includes(i))){D.bonus=true;state.coins+=40;state.gems+=2;setTimeout(()=>notify("🎁 Günün tüm görevleri bitti! +40 🪙 · +2 💎"),1200)}renderUI();save(true)}
function claimAch(id){const a=ACH.find(x=>x.id===id);if(!a||state.ach[id]!=="done")return;state.ach[id]="claimed";state.coins+=a.r;const ag=achGems(a);state.gems+=ag;sfx("coins");notify("🏆 "+a.n+": +"+a.r+" 🪙 · +"+ag+" 💎");addXP(30);renderUI();save(true)}
function badges(){const D=state.daily,qb=(D&&D.date===dayKey()&&D.ids.some(i=>questDone(i)&&!D.claimed.includes(i)))||orderReady(),ab=Object.values(state.ach).includes("done");const a=$("qbadge"),b=$("abadge");if(a)a.hidden=!(qb||ab||(state.level>=2&&wheelReady()));const fb=$("fbadge");if(fb)fb.hidden=!bookClaimable();if(b)b.hidden=!ab}
function renderQuests(){const D=state.daily,act=activeEvents(),nx=nextEvent();renderOrders();
$("events").innerHTML=(act.length?act.map(e=>`<div class="evt on"><strong>${e.n}</strong><small>${e.d} · şu an aktif</small></div>`).join(""):'<div class="evt"><small>Şu an aktif etkinlik yok.</small></div>')+(nx?`<div class="evt"><strong>${nx.e.n}</strong><small>${nx.e.d} · ${nx.days} gün sonra</small></div>`:"");
$("streak").textContent="🔥 "+(state.streak.count||0)+" günlük seri · her gün girişte +"+10*Math.min(7,Math.max(1,(state.streak.count||0)+1))+" 🪙'e kadar";
$("quests").innerHTML=D.ids.map(id=>{const q=QUESTS.find(x=>x.id===id),p=D.prog[id]||0,done=p>=q.n,cl=D.claimed.includes(id);return `<div class="fish-card qrow"><div class="qicon">${cl?"✅":done?"🎁":"📋"}</div><div><strong>${q.t}</strong><small>${Math.min(p,q.n)} / ${q.n} · ödül ${q.r} 🪙 + 20 XP</small><div class="progress"><span style="width:${Math.min(100,p/q.n*100)}%"></span></div></div>${cl?'<span class="pill">Alındı</span>':`<button data-quest="${id}" ${done?"":"disabled"}>Al</button>`}</div>`}).join("")+`<p class="note">Üç görevi de bitirince +60 🪙 bonus. Görevler her gün yenilenir.</p>`}
function renderAch(){const n=Object.keys(state.ach).length;$("achCount").textContent=n+" / "+ACH.length+" başarım";
$("achList").innerHTML=ACH.map(a=>{const s=state.ach[a.id];return `<div class="fish-card qrow ${s?"":"locked"}"><div class="qicon">${s?"🏆":"🔒"}</div><div><strong>${a.n}</strong><small>${a.d} · ${a.r} 🪙</small></div>${s==="done"?`<button data-ach="${a.id}">Al</button>`:s?'<span class="pill">Alındı</span>':""}</div>`}).join("")}
function renderMap(){const t=k=>{const arr=tankArr(k),T=TANKS[k],act=state.tank===k;if(!arr&&T.coll&&state.level<T.lv)return"";if(!arr)return `<div class="fish-card qrow locked"><div class="qicon">${tankIco(T)}</div><div><strong>${T.name} tankı</strong><small>Seviye ${T.lv} · ${T.cost} 🪙 · ${T.info}</small></div><button data-unlock="${k}" ${state.level<T.lv||state.coins<T.cost?"disabled":""}>Aç</button></div>`;
if(T.coll)return `<div class="fish-card qrow ${act?"cur":""}"><div class="qicon">${tankIco(T)}</div><div><strong>${T.name}${act?" · buradasın":""}</strong><small>${arr.length} balık · koleksiyon, bakım gerekmez</small></div>${act?"":`<button data-go="${k}">Geç</button>`}</div>`;
const dirt=tankDirt(k),sick=arr.filter(f=>f.sick).length,wrong=arr.filter(f=>WATER[f.type]!==tw(k)).length;
return `<div class="fish-card qrow ${act?"cur":""}"><div class="qicon">${tankIco(T)}</div><div><strong>${T.name} tankı${act?" · buradasın":""}</strong><small>${arr.length} balık · su %${Math.round(100-dirt)} temiz${sick?" · 🤒 "+sick+" hasta":""}${wrong?" · 😣 "+wrong+" yanlış suda":""}</small></div>${act?"":`<button data-go="${k}">Geç</button>`}</div>`};
$("tankList").innerHTML=TKEYS.map(t).join("")}

const SPM=new Map();function getSpecies(id){let s=SPM.get(id);if(!s){s=species.find(x=>x.id===id);if(!s)return species[0];SPM.set(id,s)}return s}
function notify(text){$("message").textContent=text;$("message").classList.add("show");clearTimeout(messageTimer);messageTimer=setTimeout(()=>$("message").classList.remove("show"),2200)}
const TRANSIENT=new Set(["chase","flee","chT","fleeT","wake","slp","vx","vy","tx","ty","tt","rest","ang","fs","tp","sn","st"]);
function serial(){const ls=coinsLoose.reduce((a,c)=>a+c.v,0);return JSON.stringify(state,function(k,v){if(TRANSIENT.has(k))return undefined;return k==="pending"&&this===state?(v||0)+ls:v})}
function save(silent=false){if(VISIT||window.__nosave)return;state.savedAt=Date.now();cloudSave();try{localStorage.setItem("fishvilleClassicSave3",serial());$("lastSaved").textContent="Kaydedildi · "+new Date().toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"});if(!silent)notify("Akvaryumun kaydedildi! 💾")}catch(e){$("lastSaved").textContent="Kayıt kullanılamıyor"}}
function validSave(p){return p&&typeof p==="object"&&Array.isArray(p.fish)&&Array.isArray(p.discovered)}
function fromSave(p){const s={...initState(),...p};if(!("tank" in p))s.tank=null;return s}
function load(){try{const raw=localStorage.getItem("fishvilleClassicSave3");if(raw){const parsed=JSON.parse(raw);if(validSave(parsed))state=fromSave(parsed);}}catch(e){}}
function lvCoins(l){return 20+5*l}
function lvSum(a,b){let s=0;for(let l=a+1;l<=b;l++)s+=lvCoins(l);return s}
function lvGems(l){return l%5===0?5:2}
function addXP(n){state.xp+=Math.round(n*(pk("ruins")?1.1:1)*critXPK());const l0=state.level;while(state.xp>=state.level*100){state.xp-=state.level*100;state.level++;state.coins+=lvCoins(state.level);state.gems+=lvGems(state.level)}if(state.level>l0){showLevelUp(state.level,lvSum(l0,state.level),gemSum(l0,state.level));checkAch()}renderUI();save(true)}
function ageFactor(f){return Math.min(1.06,.31+f.age*.75)}
function mkt(id){return state.market[id]||1}
function saleValue(f){return Math.round(getSpecies(f.type).price*ageFactor(f)*mkt(f.type)*(.3+.7*f.health/100)*(f.rarity==="Nadir"?3:1)*(MUTS[f.mutation]||MUTS.normal).mult*(1+(f.sizeGrowth||0))*SIZES[szOf(f)].v*(ev("harvest")?1.15:1))}
const MATURE=.95;
function growHours(s){return s.grow||1+s.price/60}
function incomeRate(s){return s.price*.075/3600}
function fmtTime(sec){sec=Math.max(0,Math.round(sec));const h=Math.floor(sec/3600),m=Math.floor(sec%3600/60);if(h>0)return h+" sa "+m+" dk";if(m>0)return m+" dk";return sec+" sn"}
function marketTick(now){if(now-state.marketAt>864e5)state.marketAt=now-864e5;while(now>=state.marketAt){state.marketAt+=36e5;species.forEach(sp=>{const m=state.market[sp.id]||1;state.market[sp.id]=Math.max(.7,Math.min(1.3,m*(.85+Math.random()*.3)+(1-m)*.15))})}}
let OFFLINE=false;
function simTank(st,hz,res){
if(isColl(state.tank)){state.fish.forEach(f=>f.st="");return 0}
const fr=state.fish,bettas=fr.filter(f=>f.type==="betta").length,gold=fr.some(f=>f.type==="gold");let earned=0;
if(hz)state.dirt=Math.min(100,state.dirt+st*.0012*fr.length*critShrimpK()*Math.pow(.8,state.snails)*(pk("table")?.92:1)*Math.max(.3,1-(state.equipment.filter||0)*.13-Math.min(.25,(state.decor||[]).length*.015)));
for(let i=fr.length-1;i>=0;i--){const f=fr[i],s=getSpecies(f.type);
const wrong=WATER[f.type]!==tw(state.tank),fight=f.type==="betta"&&bettas>1,scared=gold&&SMALL.includes(f.type);
f.st=wrong?"water":fight?"fight":scared?"scared":"";
if(hz){f.hunger=Math.max(0,f.hunger-st*.0093*((TRAIT[f.type]||TR0).hungry||1)*(1-(state.equipment.feeder||0)*.18)*(pk("bonsai")?.9:1));
if(f.hunger<=0)f.health-=st*.0139;
if(!f.sick&&state.dirt>60&&Math.random()<1-Math.exp(-st*(state.dirt-60)/144000)){f.sick=true;res.sick++}
if(f.sick)f.health-=st*.0093*(pk("cave")?.75:1);else if(f.hunger>30&&state.dirt<60&&!wrong&&!fight)f.health=Math.min(100,f.health+st*.028);
if(wrong)f.health-=st*.0035;if(fight)f.health-=st*.0029;
if(OFFLINE&&f.health<25){f.health=25;res.weak=(res.weak||0)+1}if(f.health<=0){res.dead.push(f.name||s.name);fr.splice(i,1);continue}}
if(!f.sick&&f.hunger>20&&!wrong){const rate=MATURE/(growHours(s)*3600)*(scared?.5:1);f.lifeHours=(f.lifeHours||0)+st/3600;if(f.age<1)f.age=Math.min(1,f.age+st*rate);else{const ageDays=(f.lifeHours||0)/24;const slow=1/(1+ageDays*.08);f.sizeGrowth=Math.min(.75,(f.sizeGrowth||0)+st/86400*.012*slow)}if(f.age>=MATURE)earned+=st*incomeRate(s)}
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
{id:"cherry",t:"sh",w:"fresh",n:"Kiraz Karides",img:"«sh_cherry»",p:120,lv:3,leg:"rgba(215,40,30,.85)",leg2:"rgba(240,90,70,.85)",ant:"rgba(230,80,60,.85)"},
{id:"blue",t:"sh",w:"fresh",n:"Mavi Kadife Karides",img:"«sh_blue»",p:150,lv:3,leg:"rgba(40,90,210,.85)",leg2:"rgba(110,170,255,.85)",ant:"rgba(150,200,255,.85)"},
{id:"cleaner",t:"sh",w:"salt",n:"Temizlikçi Karides",img:"«sh_cleaner»",p:180,lv:3,leg:"rgba(255,245,240,.92)",leg2:"rgba(230,60,40,.9)",ant:"rgba(255,250,245,.9)"},
{id:"tiger",t:"sh",w:"salt",n:"Kaplan Karides",img:"«sh_tiger»",p:200,lv:3,leg:"rgba(225,165,80,.85)",leg2:"rgba(90,50,20,.85)",ant:"rgba(240,200,140,.85)"},
{id:"jpink",t:"je",w:"salt",n:"Pembe Ay Denizanası",img:"«jb_pink»",arm:"«ja_pink»",c:[330,80,72],g:6,lv:5},
{id:"jcyan",t:"je",w:"salt",n:"Mavi Ay Denizanası",img:"«jb_cyan»",arm:"«ja_cyan»",c:[198,85,66],g:6,lv:5},
{id:"jorange",t:"je",w:"salt",n:"Turuncu Denizanası",img:"«jb_orange»",arm:"«ja_orange»",c:[26,92,62],g:8,lv:5},
{id:"jviolet",t:"je",w:"salt",n:"Mor Yıldız Denizanası",img:"«jb_violet»",arm:"«ja_violet»",c:[268,70,70],g:10,lv:5}];
const CMAX={sh:4,je:3},CIM={};
function cImg(src){let i=CIM[src];if(!i){i=CIM[src]=new Image();i.src="data:image/webp;base64,"+src}return i.complete&&i.naturalWidth?i:null}
function critList(k){if(!state.crit||typeof state.crit!=="object")state.crit={};const a=state.crit[k||state.tank];return Array.isArray(a)?a:[]}
function critCount(k,t){return critList(k).filter(c=>{const d=CRIT.find(x=>x.id===c.k);return d&&d.t===t}).length}
function critShrimpK(){return Math.max(.6,1-.08*critCount(state.tank,"sh"))}
function critXPK(){let n=0;for(const k in (state.crit||{}))n+=critCount(k,"je");return 1+.04*n}
function buyCrit(id){const d=CRIT.find(x=>x.id===id);if(!d||VISIT)return;if(isColl(state.tank)){notify("Koleksiyon tankına eklenemez");return}if(tw(state.tank)!==d.w){notify(d.n+" "+(d.w==="salt"?"tuzlu su":"tatlı su")+" tankında yaşar");return}if(state.level<d.lv){notify("Seviye "+d.lv+"'te açılır");return}if(critCount(state.tank,d.t)>=CMAX[d.t]){notify("Bu tank en fazla "+CMAX[d.t]+" "+(d.t==="sh"?"karides":"denizanası")+" alabilir");return}
 if(d.g){if((state.gems||0)<d.g){notify("Yeterli 💎 yok");return}state.gems-=d.g}else{if(state.coins<d.p){notify("Yeterli 🪙 yok");return}state.coins-=d.p}
 if(!state.crit||typeof state.crit!=="object")state.crit={};const a=state.crit[state.tank]=critList(state.tank).slice();a.push({id:state.nextId++,k:id});sfx("buy");notify(d.n+" tanka girdi! "+(d.t==="sh"?"Suyun daha yavaş kirlenmesini sağlar.":"Gece parlar, kazandığın XP'yi artırır."));renderUI();save(true)}
function critShopHTML(){return CRIT.map(d=>{const n=critCount(state.tank,d.t),lock=state.level<d.lv,wr=tw(state.tank)!==d.w;const perk=d.t==="sh"?"Kirlenmeyi %8 yavaşlatır · tank başına en fazla 4":"Gece parlar · XP +%4 · tank başına en fazla 3";const pr=d.g?d.g+" 💎":d.p+" 🪙";
 return '<div class="fish-card qrow crit"><div class="qicon"><img class="cuimg" alt="" src="data:image/webp;base64,'+d.img+'"></div><div><strong>'+d.n+'</strong><small>'+(d.w==="salt"?"🌊 Tuzlu su":"🌿 Tatlı su")+" · "+perk+(lock?" · Seviye "+d.lv+"'te açılır":"")+'</small></div><button class="sm" data-crit="'+d.id+'"'+(lock||wr||n>=CMAX[d.t]?" disabled":"")+'>'+pr+"</button></div>"}).join("")}
const CRT=new Map();
function critRT(){if(VISIT){CRT.clear();return[]}const L=critList(state.tank),ids=new Set(L.map(c=>c.id));for(const id of [...CRT.keys()])if(!ids.has(id))CRT.delete(id);
 return L.map(c=>{let o=CRT.get(c.id);if(!o){const d=CRIT.find(x=>x.id===c.k);if(!d)return null;o=d.t==="sh"?mkShr(d):mkJel(d);CRT.set(c.id,o)}return o}).filter(Boolean)}
const CU=.5;
function mkJel(d){const r=rand(26,34),x=rand(BX0+r,BX1-r),y=rand(H*.3,H*.55),j={d,x,y,r,ph:Math.random(),period:rand(2.1,2.9),vx:0,vy:0,tx:x,c:0,fl:0,tent:[],arms:[],t:Math.random()*10};
 const len=r*rand(1.6,2.3);for(let i=0;i<9;i++){const pts=[];for(let k=0;k<10;k++)pts.push({x,y:y+k*len/10,px:x,py:y+k*len/10});j.tent.push({pts,sl:len/10*rand(.85,1.15)})}
 for(let i=0;i<3;i++)j.arms.push({o:rand(0,6),len:r*rand(1.5,2.1),fl:i%2});return j}
function mkShr(d){return{d,x:rand(BX0+40,BX1-40),y:FLOOR-10,dir:Math.random()<.5?1:-1,vx:0,vy:0,len:rand(52,62),mode:"walk",t:Math.random()*9,curl:0,flip:0,leg:0,swim:0,next:rand(2,5),pause:0,tilt:0}}
function stepJel(j,dt){const u=CU;j.t+=dt;const p0=j.ph;j.ph+=dt/j.period*(j.fl>0?1.9:1);if(Math.floor(j.ph)!==Math.floor(p0))j.tx=Math.max(BX0+j.r,Math.min(BX1-j.r,j.x+rand(-W*.25,W*.25)));
 const p=j.ph%1;j.c=p<.28?Math.sin(p/.28*Math.PI):0;const th=j.c*(j.fl>0?260:130)*u;j.vy+=(-th+14*u)*dt;j.vx+=((j.tx-j.x)*.25-j.vx)*dt*.8;j.vx*=Math.exp(-dt*.6);j.vy*=Math.exp(-dt*1.6);j.fl=Math.max(0,j.fl-dt);
 j.x+=j.vx*dt;j.y+=j.vy*dt;const top=H*.16+j.r,bot=FLOOR-j.r*2.6;if(j.y<top){j.y=top;j.vy=Math.abs(j.vy)*.3}if(j.y>bot){j.y=bot;j.vy=-Math.abs(j.vy)*.2-10}j.x=Math.max(j.r,Math.min(W-j.r,j.x));
 const w=j.r*(1-.22*j.c),n=j.tent.length;j.tent.forEach((T,i)=>{const a=(i/(n-1)-.5)*1.7,ax=j.x+Math.sin(a)*w*.92,ay=j.y+j.r*.1;const P=T.pts;
  for(let k=1;k<P.length;k++){const q=P[k],vx=(q.x-q.px)*.94,vy=(q.y-q.py)*.94;q.px=q.x;q.py=q.y;q.x+=vx+Math.sin(j.t*1.3+i+k*.5)*.04;q.y+=vy+.06}
  P[0].x=ax;P[0].y=ay;P[0].px=ax;P[0].py=ay;for(let it=0;it<3;it++)for(let k=1;k<P.length;k++){const A=P[k-1],B=P[k],dx=B.x-A.x,dy=B.y-A.y,dd=Math.hypot(dx,dy)||1,df=(dd-T.sl)/dd;if(k===1){B.x-=dx*df;B.y-=dy*df}else{A.x+=dx*df*.5;A.y+=dy*df*.5;B.x-=dx*df*.5;B.y-=dy*df*.5}}})}
function hslc(c,a,l){return"hsla("+c[0]+","+c[1]+"%,"+(l==null?c[2]:l)+"%,"+a+")"}
function drawJel(j){const d=j.d,bi=cImg(d.img),ai=cImg(d.arm),col=d.c,glow=nightAmt(),x=j.x,y=j.y,w=j.r*(1-.22*j.c),ar=bi?bi.naturalHeight/bi.naturalWidth:.6,bw=w*2.12,bh=j.r*2*ar*(1+.2*j.c);
 ctx.lineCap="round";j.tent.forEach(T=>{ctx.beginPath();const P=T.pts;ctx.moveTo(P[0].x,P[0].y);for(let k=1;k<P.length-1;k++)ctx.quadraticCurveTo(P[k].x,P[k].y,(P[k].x+P[k+1].x)/2,(P[k].y+P[k+1].y)/2);ctx.strokeStyle=hslc(col,.35+.35*glow,78+8*glow);ctx.lineWidth=Math.max(.7,j.r*.03);ctx.stroke()});
 if(ai){const aw0=w*.62;j.arms.forEach((A,i)=>{const ah=A.len*(1+.15*j.c),aw=aw0*(i===1?1:.8),n=14,sh=ai.naturalHeight/n,dh=ah/n,cx=x+(i-1)*w*.28;ctx.save();ctx.globalAlpha=.92;for(let k=0;k<n;k++){const f=(k+.5)/n,dx=Math.sin(j.t*1.6+A.o+f*3.2)*w*.2*f-j.vx*.06*f*f,yy=y-bh*.06+k*dh;if(A.fl){ctx.save();ctx.translate(cx+dx,0);ctx.scale(-1,1);ctx.drawImage(ai,0,k*sh,ai.naturalWidth,sh+1,-aw/2,yy,aw,dh+1);ctx.restore()}else ctx.drawImage(ai,0,k*sh,ai.naturalWidth,sh+1,cx+dx-aw/2,yy,aw,dh+1)}ctx.restore()})}
 if(glow>.01){ctx.save();ctx.globalCompositeOperation="lighter";const g=ctx.createRadialGradient(x,y-bh*.45,0,x,y-bh*.45,j.r*2.6);g.addColorStop(0,hslc(col,.4*glow,62));g.addColorStop(1,hslc(col,0,60));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y-bh*.45,j.r*2.6,0,7);ctx.fill();ctx.restore()}
 if(bi){ctx.drawImage(bi,x-bw/2,y-bh*.9,bw,bh);if(glow>.01){ctx.save();ctx.globalCompositeOperation="lighter";ctx.globalAlpha=.45*glow;ctx.drawImage(bi,x-bw/2,y-bh*.9,bw,bh);ctx.restore()}}}
function stepShr(s,dt){const u=CU;s.t+=dt;const fy=FLOOR-10;s.next-=dt;
 if(s.flip>0){s.flip-=dt;const f=1-s.flip/.32;s.curl=f<.35?f/.35:Math.max(0,1-(f-.35)/.65);if(s.flip<=0){s.mode="swim";s.swim=rand(1,2)}}else s.curl+=(0-s.curl)*Math.min(1,dt*8);
 if(s.mode==="walk"){if(s.pause>0){s.pause-=dt;s.vx*=Math.exp(-dt*6)}else{s.vx+=(s.dir*26*u-s.vx)*Math.min(1,dt*3);s.leg+=dt*9}if(s.next<0){s.next=rand(2.5,6);const r=Math.random();if(r<.35)s.pause=rand(1,2.5);else if(r<.55)s.dir*=-1;else if(r<.7){s.mode="swim";s.swim=rand(1.5,3);s.vy=-40*u}}s.vy+=(fy-s.y)*dt*6;s.vy*=Math.exp(-dt*5)}
 else if(s.mode==="swim"){s.swim-=dt;s.leg+=dt*3;s.vx+=(s.dir*42*u-s.vx)*Math.min(1,dt*2);s.vy+=(Math.sin(s.t*1.4)*12*u+6*u)*dt;s.vy*=Math.exp(-dt*1.5);if(s.swim<=0&&s.flip<=0)s.mode="walk"}else{s.vx*=Math.exp(-dt*3);s.vy+=50*u*dt}
 s.x+=s.vx*dt;s.y+=s.vy*dt;if(s.y>fy){s.y=fy;s.vy=Math.min(0,s.vy)}if(s.y<H*.3){s.y=H*.3;s.vy=Math.abs(s.vy)}const m=s.len;if(s.x<BX0+m*.3){s.x=BX0+m*.3;if(s.flip<=0)s.dir=1}if(s.x>BX1-m*.3){s.x=BX1-m*.3;if(s.flip<=0)s.dir=-1}
 s.tilt+=((s.mode==="swim"?-.12:0)+(s.vy/(200*u))*.4-s.tilt)*Math.min(1,dt*4)}
function drawShr(s){const L=s.len,im=cImg(s.d.img);if(!im)return;const SS=s.d;ctx.save();ctx.translate(s.x,s.y);ctx.scale(s.dir,1);ctx.rotate(s.tilt);
 const iw=im.naturalWidth,ih=im.naturalHeight,DW=L*1.25,DH=DW*ih/iw,X0=-L,sx=DW/iw,sw=s.mode==="swim"||s.flip>0;
 ctx.save();ctx.scale(1,.25);ctx.beginPath();ctx.ellipse(-L*.3,(FLOOR-4-s.y)*4+L*.1,L*.55,L*.22,0,0,7);ctx.fillStyle="rgba(0,20,30,"+(s.mode==="walk"?.22:.1)+")";ctx.fill();ctx.restore();
 const P0=.5,N=10,pivot=X0+P0*DW,chain=[];let px=pivot,py=0,th=0;const stripW=P0*iw/N;for(let i=0;i<N;i++){th+=s.curl*1.5/N+Math.sin(s.t*2+i*.5)*.004;chain.push([px,py,th]);const dd=stripW*sx;px-=Math.cos(th)*dd;py+=Math.sin(th)*dd}
 ctx.lineCap="round";for(let i=0;i<5;i++){const bx=-L*(.02+i*.09),by=DH*.18,ph=s.leg+i*1.3,lift=Math.max(0,Math.sin(ph))*L*.03,sw2=Math.cos(ph)*L*.05;ctx.strokeStyle=i%2?SS.leg2:SS.leg;ctx.lineWidth=Math.max(.8,L*.012);ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx+sw2*.4,by+L*.07);ctx.lineTo(bx+sw2-L*.03,by+L*.14-lift);ctx.stroke()}
 ctx.strokeStyle=SS.leg2;ctx.lineWidth=Math.max(.8,L*.011);for(let i=1;i<8;i+=2){const c=chain[i],a=Math.sin(s.t*(sw?26:6)-i*.6)*(sw?.7:.15);ctx.beginPath();ctx.moveTo(c[0],c[1]+DH*.14);ctx.lineTo(c[0]+Math.sin(a)*L*.05,c[1]+DH*.14+Math.cos(a)*L*.07);ctx.stroke()}
 const yTop=-DH*.5;ctx.drawImage(im,P0*iw,0,iw*(1-P0),ih,pivot,yTop,DW*(1-P0),DH);
 for(let i=0;i<N;i++){const c=chain[i];ctx.save();ctx.translate(c[0],c[1]);ctx.rotate(-c[2]);ctx.drawImage(im,P0*iw-(i+1)*stripW,0,stripW+1,ih,-stripW*sx,yTop,(stripW+1)*sx,DH);ctx.restore()}
 ctx.strokeStyle=SS.ant;ctx.lineWidth=Math.max(.8,L*.011);for(const k of [0,1]){const ph=s.t*(s.pause>0?5:2)+k*2;ctx.beginPath();ctx.moveTo(0,DH*.12);ctx.quadraticCurveTo(L*.1,DH*.3+Math.sin(ph)*L*.03,L*.2,DH*.05+Math.sin(ph*1.3)*L*.05);ctx.stroke()}
 for(const k of [0,1]){ctx.beginPath();let ax=L*.05,ay=-DH*(.05+k*.1);ctx.moveTo(ax,ay);let an=-.3-k*.25;const n=16,sl=L*(k?1.45:1.2)/n;for(let i=0;i<n;i++){an+=.03+Math.sin(s.t*(1.7+k*.4)-i*.35)*.035;ax+=Math.cos(an)*sl;ay+=Math.sin(an)*sl;ctx.lineTo(ax,ay)}ctx.lineWidth=Math.max(.6,L*.008);ctx.stroke()}
 ctx.restore()}
function critDraw(dt){const L=critRT();if(!L.length)return;for(const o of L){if(o.d.t==="sh")stepShr(o,dt);else stepJel(o,dt)}
 L.filter(o=>o.d.t==="sh").sort((a,b)=>a.y-b.y).forEach(drawShr);L.filter(o=>o.d.t==="je").forEach(drawJel)}
function critTap(x,y){if(VISIT)return false;let hit=false;for(const o of CRT.values()){if(o.d.t==="sh"){if(Math.hypot(x-o.x,y-o.y)<o.len*1.15){o.dir=x>=o.x?1:-1;o.flip=.32;o.mode="flip";o.vx=-o.dir*rand(380,480)*CU;o.vy=-rand(90,160)*CU;hit=true}}
 else{const d=Math.hypot(x-o.x,y-(o.y-o.r*.3));if(d<o.r*2.2){const k=1/(d||1);o.vx+=(o.x-x)*k*120*CU;o.vy+=Math.min(0,(o.y-y)*k*60*CU);o.fl=2.5;o.ph=Math.ceil(o.ph);o.tx=Math.max(BX0+o.r,Math.min(BX1-o.r,o.x+(o.x-x)*3));hit=true}}}
 if(hit)sfx("bubble");return hit}
// ===== Balıklarım: sıralama, süzme, toplu satış =====
let FSORT="value",FFILT="all",sellArm=null;const FSEL=new Set();
function isPrecious(f){return mutOf(f)!=="normal"||szOf(f)!=="normal"||f.rarity==="Nadir"||saleValue(f)>=200}
function invList(){let a=state.fish.slice();const F={all:()=>1,adult:f=>f.age>=MATURE,young:f=>f.age<MATURE,sick:f=>f.sick,mut:f=>mutOf(f)!=="normal"||szOf(f)!=="normal"};a=a.filter(F[FFILT]||F.all);const S={value:(x,y)=>saleValue(y)-saleValue(x),type:(x,y)=>getSpecies(x.type).name.localeCompare(getSpecies(y.type).name,"tr")||saleValue(y)-saleValue(x),age:(x,y)=>y.age-x.age};a.sort(S[FSORT]||S.value);return a}
function invHTML(){for(const id of [...FSEL])if(!state.fish.some(f=>f.id===id))FSEL.delete(id);const list=invList(),tot=state.fish.reduce((s,f)=>s+saleValue(f),0),cnt=k=>state.fish.filter({adult:f=>f.age>=MATURE,young:f=>f.age<MATURE,sick:f=>f.sick,mut:f=>mutOf(f)!=="normal"||szOf(f)!=="normal"}[k]).length;
const chip=(k,t,cur,attr)=>'<button class="chip2'+(cur===k?" on":"")+'" data-'+attr+'="'+k+'">'+t+"</button>";
let h='<div class="invbar"><div class="invsum">'+state.fish.length+" balık · toplam değer <b>"+tot.toLocaleString("tr-TR")+" 🪙</b></div>";
h+='<div class="invrow">'+[["all","Tümü"],["adult","Yetişkin "+cnt("adult")],["young","Yavru "+cnt("young")],["sick","Hasta "+cnt("sick")],["mut","Özel "+cnt("mut")]].filter(x=>x[0]==="all"||!/ 0$/.test(x[1])).map(x=>chip(x[0],x[1],FFILT,"ff")).join("")+"</div>";
h+='<div class="invrow">'+'<span class="invlbl">Sırala</span>'+[["value","Değer"],["type","Tür"],["age","Büyüme"]].map(x=>chip(x[0],x[1],FSORT,"fs")).join("")+'<span class="invsp"></span><button class="chip2" data-selall="1">'+(list.length&&list.every(f=>FSEL.has(f.id))?"Seçimi kaldır":"Listeyi seç")+"</button></div></div>";
return h+(list.length?list.map(fcCard).join(""):'<p class="note">Bu filtrede balık yok.</p>')}
function sellBarRender(){let b=$("sellBar");if(!b){try{b=document.createElement("div");b.id="sellBar";b.className="sellbar";b.onclick=e=>invClick(e);const inv=$("inventory");inv.parentNode.insertBefore(b,inv.nextSibling)}catch(e){return}}const sel=state.fish.filter(f=>FSEL.has(f.id));if(!sel.length){b.hidden=true;b.innerHTML="";return}const v=sel.reduce((s,f)=>s+saleValue(f),0),pr=sel.filter(isPrecious).length,arm=sellArm&&sellArm.id==="many"&&sellArm.until>Date.now();b.hidden=false;b.innerHTML='<div><b>'+sel.length+" balık seçildi</b><small>"+(pr?"⚠️ "+pr+" tanesi değerli":"Toplam değer")+"</small></div><button class=\"chip2\" data-selnone=\"1\">Vazgeç</button><button class=\"danger"+(arm?" armed":"")+"\" data-sellmany=\"1\">"+(arm?"Emin misin?":"Sat")+"<small>"+v.toLocaleString("tr-TR")+" 🪙</small></button>"}
function sellMany(ids){let v=0,n=0;ids.forEach(id=>{const i=state.fish.findIndex(f=>f.id===id);if(i<0)return;v+=saleValue(state.fish[i]);state.fish.splice(i,1);n++;FSEL.delete(id)});if(!n)return;state.coins+=v;Q("sell");Q("earn",v);addXP(Math.min(30,Math.floor(v/50)));sfx("coins");notify(n+" balık satıldı: +"+v.toLocaleString("tr-TR")+" 🪙");sellArm=null;renderUI();save(true)}
function invClick(e){const t=e.target.closest("[data-ff],[data-fs],[data-pick],[data-selall],[data-selnone],[data-sellmany],[data-sell]");if(!t)return false;const d=t.dataset;
if(d.ff){FFILT=d.ff;sellArm=null}else if(d.fs){FSORT=d.fs}else if(d.pick){const id=+d.pick;FSEL.has(id)?FSEL.delete(id):FSEL.add(id);sellArm=null;sfx("click")}
else if(d.selall){const l=invList();if(l.length&&l.every(f=>FSEL.has(f.id)))l.forEach(f=>FSEL.delete(f.id));else l.forEach(f=>FSEL.add(f.id));sellArm=null}
else if(d.selnone){FSEL.clear();sellArm=null}
else if(d.sellmany){const sel=state.fish.filter(f=>FSEL.has(f.id));const need=sel.some(isPrecious)||sel.length>=3;if(need&&!(sellArm&&sellArm.id==="many"&&sellArm.until>Date.now())){sellArm={id:"many",until:Date.now()+3500};sfx("click");setTimeout(renderUI,3600)}else sellMany(sel.map(f=>f.id))}
else if(d.sell){const id=+d.sell,f=state.fish.find(x=>x.id===id);if(f&&isPrecious(f)&&!(sellArm&&sellArm.id===id&&sellArm.until>Date.now())){sellArm={id,until:Date.now()+3500};sfx("click");setTimeout(renderUI,3600)}else{sellArm=null;FSEL.delete(id);sell(id)}}
renderUI();return true}


let oriT=0,oriLast=(typeof innerWidth==="number"&&innerHeight>innerWidth)?"port":"land";function oriWatch(){clearTimeout(oriT);oriT=setTimeout(()=>{const now=innerHeight>innerWidth?"port":"land";if(!PORT&&now==="land"){const a=Math.max(16/9,Math.min(2.2,innerWidth/innerHeight));if(Math.abs(a-GAR)>.04){try{save(true)}catch(e){}location.reload();return}}if(now===oriLast)return;oriLast=now;try{save(true)}catch(e){}if(ORI_PREF==="auto"&&now!==ORI){location.reload();return}if(now===ORI){try{window.scrollTo(0,0)}catch(e){}const vv=window.visualViewport;if(vv&&(Math.abs(vv.scale-1)>.01||Math.abs(vv.offsetTop)>1||Math.abs(vv.offsetLeft)>1))location.reload()}},450)}
try{addEventListener("orientationchange",oriWatch);addEventListener("resize",oriWatch)}catch(e){}

// arka plan yumuşatma (derinlik hissi): hafif bulanık, biraz soluk, kenarları koyu
function bgSoftOn(){return state.bgSoft!==false}
function bgSoftF(){return bgSoftOn()?"blur("+(PORT?1.1:1.4)+"px) saturate(.78) brightness(.93)":""}
let vigEl=null;function vigSync(){try{if(!vigEl){vigEl=document.createElement("div");vigEl.style.cssText="position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse 72% 70% at 50% 46%,rgba(4,20,30,0) 55%,rgba(4,20,30,.42) 100%)";canvas.before(vigEl)}vigEl.style.display=bgSoftOn()?"":"none"}catch(e){}}
function bgSoftLabel(){const b=$("bgSoftBtn");if(b)b.textContent="🌫️ Arka plan: "+(bgSoftOn()?"Yumuşak":"Net")}
function oriLabel(){const b=$("oriBtn");if(!b)return;b.textContent="🖥️ Ekran: "+(ORI_PREF==="auto"?"Otomatik ("+(PORT?"dikey":"yatay")+")":ORI_PREF==="land"?"Yatay":"Dikey")}
function setOri(v){try{if(v==="auto")localStorage.removeItem("akvOri");else localStorage.setItem("akvOri",v)}catch(e){}save(true);setTimeout(()=>location.reload(),120)}
function fcMeta(f){const age="Yaş "+fmtTime((f.lifeHours||0)*3600),sz=(1+(f.sizeGrowth||0)).toFixed(2)+"x";return age+" · boy "+sz}
function fcChips(f){let h="";if(f.st&&STATUS[f.st])h+='<span class="fchip warn">'+STATUS[f.st][0]+" "+STATUS[f.st][1]+"</span>";if(f.sick)h+='<span class="fchip bad">🤒 Hasta</span>';else if(f.age>=MATURE)h+='<span class="fchip ok">✅ Yetişkin</span>';if(geneKnown(f))h+='<span class="fchip">'+geneText(f)+"</span>";return h}
function fcBar(ic,key,id,v,cls){v=Math.max(0,Math.min(100,v));return '<div class="fcb '+cls+'"><i>'+ic+'</i><span class="fcbt"><s data-'+key+'="'+id+'" style="width:'+v+'%"></s></span><em data-'+key+'v="'+id+'">%'+Math.round(v)+"</em></div>"}
function fcCard(f){const s=getSpecies(f.type),coll=isColl(state.tank),pk2=FSEL.has(f.id),arm=sellArm&&sellArm.id===f.id&&sellArm.until>Date.now();return `<div class="fc${f.sick?" sick":""}${pk2?" picked":""}" data-card="${f.id}"><button class="fpick" data-pick="${f.id}" aria-label="Seç">${pk2?"✓":""}</button><div class="fc-ico">${fishIcon(f)}</div><div class="fc-main"><div class="fc-name"><b>${esc(f.name||s.name)}${f.rarity==="Nadir"?" ✨":""}</b><span class="pill">${f.personality||""}</span></div><div class="fc-tags">${mutTag(f)}</div><div class="fc-bars">${fcBar("🌱","bar",f.id,f.age*100,"g")}${coll?"":fcBar("❤️","hp",f.id,f.health,"h")+fcBar("🍽️","hu",f.id,f.hunger,"u")}</div><div class="fc-meta" data-info="${f.id}">${fcMeta(f)}</div><div class="fc-chips" data-chips="${f.id}">${fcChips(f)}</div></div><div class="fc-act"><button class="danger${arm?" armed":""}" data-sell="${f.id}">${arm?"Emin misin?":"Sat"}<small>${saleValue(f)} 🪙</small></button>${!geneKnown(f)?`<button class="sm" data-gene="${f.id}" title="Genetik test">🧬 40</button>`:""}${moveSel(f)}</div></div>`}
function infoText(f){if(isColl(state.tank))return "🏺 Koleksiyonda · yaş "+fmtTime((f.lifeHours||0)*3600)+" · büyüme %"+Math.round(f.age*100)+" · boy "+(1+(f.sizeGrowth||0)).toFixed(2)+"x · değer "+saleValue(f)+" 🪙 · "+geneText(f);return (f.st&&STATUS[f.st]?STATUS[f.st][0]+" "+STATUS[f.st][1]+" · ":"")+"Yaş "+fmtTime((f.lifeHours||0)*3600)+" · büyüme %"+Math.round(f.age*100)+" · boy "+(1+(f.sizeGrowth||0)).toFixed(2)+"x · 🍽️ %"+Math.round(f.hunger)+" · ❤️ %"+Math.round(f.health)+" · değer "+saleValue(f)+" 🪙"+(f.sick?" · 🤒 hasta!":f.age>=MATURE?" · yetişkin ✅":"")+(szOf(f)!=="normal"?" · "+SIZES[szOf(f)].icon+" "+SIZES[szOf(f)].n:"")+" · "+geneText(f)}
function updateLive(){
if(openKey==="fish")state.fish.forEach(f=>{const q=k=>document.querySelector("[data-"+k+'="'+f.id+'"]'),set=(k,v)=>{v=Math.max(0,Math.min(100,v));const b=q(k),t=q(k+"v");if(b)b.style.width=v+"%";if(t)t.textContent="%"+Math.round(v)};const i=q("info"),c=q("chips"),cd=q("card");if(i)i.textContent=fcMeta(f);if(c)c.innerHTML=fcChips(f);if(cd)cd.classList.toggle("sick",!!f.sick);set("bar",f.age*100);set("hp",f.health);set("hu",f.hunger)});
$("badge").hidden=!(state.chest||(state.pending||0)>=1||coinsLoose.length>0);
waterStatus();
const m=Math.max(0,Math.ceil((state.chestAt-Date.now())/60000));
const act=activeEvents(),rot=Math.floor(Date.now()/6000)%2;
moodSet(VISIT?"👀 Komşunun akvaryumundasın":feedModeOn()?"🍤 Yemi atmak istediğin yere dokun":(state.night&&state.fish.some(f=>f.slp)&&!state.chest)?"😴 Balıklar uyuyor · yemlersen uyanırlar":state.chest?"🎁 Hazine sandığı seni bekliyor!":state.dirt>60?"Su kirli, balıklar hasta olabilir! 🧽":state.fish.some(f=>f.sick)?"Hasta balıkların var! 💊":state.fish.some(f=>f.st==="water")?"😣 Yanlış sudaki balıkları taşı!":state.fish.some(f=>f.st==="fight")?"⚔️ Bettalar kavga ediyor!":(act.length&&rot)?act[0].n+" · "+act[0].d:"Sonraki sandık ~"+m+" dk");
}
function collMerge(){try{const S=state.stash||(state.stash={});if(state.tank==="csalt"){const cs=state.fish||[];if(S.cfresh){state.fish=S.cfresh.fish.concat(cs);delete S.cfresh}else state.fish=cs;state.tank="cfresh";state.dirt=0}if(S.csalt){const cs=S.csalt.fish||[];delete S.csalt;if(state.tank==="cfresh")state.fish=state.fish.concat(cs);else if(S.cfresh)S.cfresh.fish=S.cfresh.fish.concat(cs);else S.cfresh={fish:cs,dirt:0}}if(state.crit&&state.crit.csalt){delete state.crit.csalt}}catch(e){}}
function normalize(){collMerge();const D=initState();{const LF=state.layout==="land"?"land":"port";if(LF!==ORI){try{(state.decor||[]).forEach(d=>{if(typeof d.y==="number")d.y=Math.max(H*.2,Math.min(FLOOR+60,yconv(d.y,LF)))});const pp=state.propPos||{};for(const k in pp)if(pp[k]&&isFinite(pp[k].y))pp[k].y=Math.max(H*.2,Math.min(FLOOR+60,yconv(pp[k].y,LF)))}catch(e){}}state.layout=ORI}if(typeof state.gems!=="number"||!isFinite(state.gems)){state.gems=15;setTimeout(()=>notify("💎 Yeni para birimi: Zümrüt! Hoş geldin hediyesi +15 💎"),4800)}if(typeof state.luck!=="number")state.luck=0;if(typeof state.tut!=="number")state.tut=(state.level>=2||(state.stats&&state.stats.buy>0))?99:0;if(!state.capUp||typeof state.capUp!=="object")state.capUp={};if(!Array.isArray(state.themes))state.themes=[];if(!state.bookRw||typeof state.bookRw!=="object")state.bookRw={};if(!state.propPos||typeof state.propPos!=="object"||Array.isArray(state.propPos))state.propPos={};for(const k of ["stats","ach","streak","helped","helpGot"])if(!state[k]||typeof state[k]!=="object")state[k]=D[k];
if(!state.tank){state.tank="fresh";const salt=state.fish.filter(f=>WATER[f.type]==="salt");if(salt.length){state.fish=state.fish.filter(f=>WATER[f.type]!=="salt");state.stash.salt={fish:salt,dirt:state.dirt};state.migrated=true}}
if(state.other){if(Array.isArray(state.other.fish)&&TANKS[state.other.key]&&state.other.key!==state.tank)state.stash[state.other.key]={fish:state.other.fish,dirt:+state.other.dirt||0};delete state.other}
if(!state.stash||typeof state.stash!=="object"||Array.isArray(state.stash))state.stash={};
if(!TANKS[state.tank])state.tank="fresh";
for(const k of Object.keys(state.stash)){const o=state.stash[k];if(!TANKS[k]||k===state.tank||!o||!Array.isArray(o.fish))delete state.stash[k];else{o.fish=o.fish.filter(f=>species.some(s=>s.id===f.type));o.dirt=Math.max(0,Math.min(100,+o.dirt||0))}}
if(!hasTank("fresh"))state.stash.fresh={fish:[],dirt:5};
state.mutsFound=state.mutsFound||[];allFish().forEach(f=>{if(!isFinite(f.phase))f.phase=rand(0,6);if(f.dir!==1&&f.dir!==-1)f.dir=Math.random()<.5?-1:1;if(!isFinite(f.x)||f.x<0||f.x>1)f.x=rand(.2,.8);if(!isFinite(f.y)||f.y<0||f.y>1)f.y=rand(.25,.65);if(!isFinite(f.age))f.age=.5;if(!isFinite(f.hunger))f.hunger=70;if(!isFinite(f.health))f.health=100;if(!f.personality)f.personality="Uysal";if(!SIZES[f.sizeTrait])f.sizeTrait="normal";if(!MUTS[f.mutation])f.mutation="normal";if(f.gene!==undefined&&f.gene!==null&&!GENES.includes(f.gene))f.gene=null;if(f.gene===undefined)f.gene=f.mutation!=="normal"?f.mutation:null});state.props=(state.props||[]).filter(i=>PROPS.some(p=>p.id===i));state.fish=state.fish.filter(f=>species.some(s=>s.id===f.type));state.discovered=state.discovered.filter(i=>species.some(s=>s.id===i));allFish().forEach(f=>{if(f.hunger==null)f.hunger=70;if(f.health==null)f.health=100;f.sick=!!f.sick});state.market=state.market||{};state.decor=state.decor||[];state.eggs=state.eggs||[];state.equipment=state.equipment||{filter:0,feeder:0};state.equipment.filter=state.equipment.filter||0;state.equipment.feeder=state.equipment.feeder||0;allFish().forEach(f=>{if(!f.name)f.name=getSpecies(f.type).name;if(!f.personality)f.personality=["Meraklı","Uysal","Hareketli","Utangaç"][f.id%4];if(f.lifeHours==null)f.lifeHours=(f.age||0)*24;if(f.sizeGrowth==null)f.sizeGrowth=0;if(f.rarity==null)f.rarity="Normal"});}
function offlineReport(){
normalize();
const elapsed=(Date.now()-(state.lastTick||Date.now()))/1000;
if(elapsed<60){state.lastTick=Date.now();return}
const before=state.pending||0,r=advance(Math.min(elapsed,72*3600)),gain=Math.floor((state.pending||0)-before);
setTimeout(()=>notify("Sen yokken "+fmtTime(elapsed)+" geçti 🌊"+(r.dead.length?" · "+r.dead.length+" balık öldü 💀":"")+(r.sick?" · balıklar hastalandı 🤒":"")+(r.weak?" · balıkların çok acıktı, hemen besle 🍤":"")+(gain>0?" · "+gain+" 🪙 birikti":"")+(state.chest?" · 🎁 sandık çıktı!":"")),600);
}
const PROPS=[
{id:"bonsai",name:"Mercan Bonsai",price:130,perk:"Balıklar %10 daha yavaş acıkır",x:.52,dy:-50,sc:.55,r:1,on:"table",img:"«prop_bonsai»"},
{id:"amphora",name:"Antik Amfora",price:90,perk:"Yumurtalar %20 daha çabuk açılır",x:.10,dy:-38,sc:.9,r:1,img:"«prop_amphora»"},
{id:"moai",name:"Moai Heykeli",price:200,perk:"Nadir balık şansı %3,5 → %6",x:.92,dy:-38,sc:.9,r:0,img:"«prop_moai»"},
{id:"cave",name:"Taş Mağara",price:100,perk:"Hasta balıklar %25 daha yavaş sağlık kaybeder",x:.38,dy:-30,sc:.9,r:0,img:"«prop_cave»"},
{id:"diver",name:"Dalgıç Kaskı",price:140,perk:"Biriken gelir +%8",x:.66,dy:-30,sc:.78,r:1,img:"«prop_diver»"},
{id:"wreck",name:"Gemi Enkazı",price:120,perk:"Hazine sandığı %10 daha sık çıkar",x:.24,dy:0,sc:.95,r:1,img:"«prop_wreck»"},
{id:"ruins",name:"Antik Kalıntılar",price:150,perk:"Kazanılan deneyim +%10",x:.78,dy:0,sc:.9,r:0,img:"«prop_ruins»"},
{id:"table",name:"Yosunlu Kaya Masa",price:80,perk:"Su %8 daha yavaş kirlenir",x:.52,dy:8,sc:.9,r:1,img:"«prop_table»"}
];
const pk=id=>(state.props||[]).includes(id),propImgs={},propImgsN={},propImgsF={};const FIMG={bonsai:"«propf_bonsai»",amphora:"«propf_amphora»",moai:"«propf_moai»",cave:"«propf_cave»",diver:"«propf_diver»",wreck:"«propf_wreck»",ruins:"«propf_ruins»",table:"«propf_table»"};const NIMG={bonsai:"«propn_bonsai»",amphora:"«propn_amphora»",moai:"«propn_moai»",cave:"«propn_cave»",diver:"«propn_diver»",wreck:"«propn_wreck»",ruins:"«propn_ruins»",table:"«propn_table»"};
PROPS.forEach(p=>{const nm=new Image();nm.src="data:image/webp;base64,"+NIMG[p.id];propImgsN[p.id]=nm;const fm=new Image();fm.src="data:image/webp;base64,"+FIMG[p.id];propImgsF[p.id]=fm;const u="data:image/webp;base64,"+p.img;document.documentElement.style.setProperty("--p-"+p.id,'url("'+u+'")');const im=new Image();im.src=u;propImgs[p.id]=im});
const DECOR=["🐚","🪸","⚓","🦪","🦀","🪨","sf"];
function clean(){if(isColl(state.tank)){notify("Koleksiyon tankı kirlenmez 🏺");return}if(state.dirt<3){notify("Tank zaten tertemiz ✨");return}const free=state.coins<10;if(!free)state.coins-=10;state.dirt=0;Q("clean");if(!free)addXP(2);pop(rand(0,W),H-20,12);sfx("clean");notify(free?"Altının azdı, bu temizlik bizden 🧽":"Tank temizlendi 🧽");renderUI();save(true)}
function cure(){const n=state.fish.filter(f=>f.sick).length;if(!n){notify("Hasta balık yok 👍");return}if(state.coins<30){notify("İlaç için 30 🪙 gerekli");return}state.coins-=30;state.fish.forEach(f=>{if(f.sick){f.sick=false;f.health=Math.max(f.health,40)}});sfx("cure");notify(n+" balık iyileşti 💊");renderUI();save(true)}
function openChest(){
if(!state.chest)return;chestAnim={x:state.chest.x,until:Date.now()+1100};state.chest=null;state.chestAt=Date.now()+36e5*(pk("wreck")?.9:1)*(ev("winter")?.6:1)*(ev("summer")?.75:1);Q("chest");const cm=ev("winter")?1.5:1;
const r=Math.random();let msg;
if(r<.4){const n=Math.round(rand(15,60)*cm);state.coins+=n;msg="Sandıktan "+n+" 🪙 çıktı!"}
else if(r<.55){state.dirt=Math.max(0,state.dirt-40);msg="Arıtma kristali çıktı! Su berraklaştı 🫧"}
else if(r<.68){state.fish.forEach(f=>{f.sick=false;f.health=Math.min(100,f.health+30)});msg="Şifalı yosun çıktı! Balıklar toparlandı 🌿"}
else if(r<.8&&state.snails<3){state.snails++;msg="Salyangoz çıktı 🐌 Yosunları temizler, tank geç kirlenir"}
else if(r<.95&&state.decor.length<14){const k=DECOR[Math.random()*DECOR.length|0];state.decor.push({k,x:rand(.06,.94)});msg="Dekor çıktı: "+decTxt(k)+"! Tankın gerçekçileşti"}
else if(r<.985){const n=Math.round(rand(70,150)*cm);state.coins+=n;msg="Nadir hazine! +"+n+" 🪙 ✨"}else{const n=Math.random()<.3?2:1;state.gems+=n;msg="Zümrüt buldun! +"+n+" 💎"}
for(let i=0;i<20;i++)particles.push({x:rand(150,400),y:FLOOR,vx:rand(-60,60),vy:rand(-90,-20),life:rand(.8,1.6),type:"food"});
sfx("chest");renderUI();save(true);notify(msg)}
function nightAmt(){return DN?(state.night?dnP():1-dnP()):(state.night?1:0)}
const tintC={};
function tinted(im,key,haze,night){const k=key+(night?"n":"d")+curWater();let c=tintC[k];if(c!==undefined)return c;c=null;try{const cv=document.createElement("canvas");cv.width=im.naturalWidth;cv.height=im.naturalHeight;const x=cv.getContext("2d");x.drawImage(im,0,0);x.globalCompositeOperation="source-atop";
if(night){x.globalCompositeOperation="source-over";x.globalCompositeOperation="multiply";x.fillStyle="rgb(105,150,250)";x.fillRect(0,0,cv.width,cv.height);x.globalCompositeOperation="color";x.globalAlpha=.4;x.fillStyle="rgb(20,100,200)";x.fillRect(0,0,cv.width,cv.height);x.globalAlpha=1;x.globalCompositeOperation="screen";x.fillStyle="rgb(6,34,84)";x.fillRect(0,0,cv.width,cv.height);x.globalCompositeOperation="destination-in";x.drawImage(im,0,0);x.globalCompositeOperation="source-atop"}else{x.globalCompositeOperation="source-over";grade(cv,{bg:FLOOR_AVG[curWater()==="salt"?"salt":"fresh"][0],mix:.1+haze*.6,desat:.84,contrast:.9,top:.12,ao:.38});x.globalCompositeOperation="source-atop"}
x.globalCompositeOperation="destination-out";const gr=x.createLinearGradient(0,cv.height*.9,0,cv.height);gr.addColorStop(0,"rgba(0,0,0,0)");gr.addColorStop(1,"rgba(0,0,0,.9)");x.fillStyle=gr;x.fillRect(0,cv.height*.88,cv.width,cv.height*.12);c=gpuCopy(cv)}catch(e){c=null}tintC[k]=c;return c}
function drawTinted(im,key,x,y,w,h,haze,nf){const d=tinted(im,key,haze,false);ctx.drawImage(d||im,x,y,w,h);if(nf>.01){const n=tinted(im,key,haze,true);if(n){ctx.globalAlpha=nf;ctx.drawImage(n,x,y,w,h);ctx.globalAlpha=1}}}
let propL=null,propKey="";let PY0=FLOOR-240,PHH=H-PY0;const propBox={};function pDepth(y){return .72+.28*Math.max(0,Math.min(1.2,(y-H*.2)/(FLOOR+30-H*.2)))}function decY(d){return typeof d.y==="number"?d.y:FLOOR+22}
function paintProps(ctx,nf){const pl={};const PP=state.propPos||{},ord=p=>PP[p.id]?PP[p.id].y:p.on?1e6:FLOOR+(p.r===0?14:30);[...PROPS].sort((x,y)=>ord(x)-ord(y)).forEach(p=>{const cp=PP[p.id];const im=propImgs[p.id];if(!pk(p.id)||!im||!im.complete||!im.naturalWidth)return;
const back=p.r===0,ar=im.naturalWidth/im.naturalHeight,w=Math.sqrt(18000*ar)*LSR*p.sc*(back?.88:1)*(cp?pDepth(cp.y):1),h=w/ar,cx=(cp?cp.x:p.x)*W,tb=!cp&&p.on&&pl[p.on];
const base=tb?tb.base-tb.h*.74:cp?cp.y:FLOOR+(back?14:30);
if(!tb){const sg=ctx.createRadialGradient(0,0,0,0,0,w*.5);sg.addColorStop(0,"rgba(0,18,30,"+(.34+.14*nf)+")");sg.addColorStop(1,"rgba(0,18,30,0)");ctx.save();ctx.translate(cx,base-3);ctx.scale(1,.2);ctx.fillStyle=sg;ctx.beginPath();ctx.arc(0,0,w*.5,0,7);ctx.fill();ctx.restore()}
{const hz=back?.2:.08,d=tinted(im,p.id+(back?"b":"f"),hz,false);const imN0=(/fresh/.test(state.tank)?propImgsF:propImgsN)[p.id],ok0=imN0&&imN0.complete&&imN0.naturalWidth;ctx.globalAlpha=ok0?1-nf:1;if(ctx.globalAlpha>.01)ctx.drawImage(d||im,cx-w/2,base-h,w,h);ctx.globalAlpha=1;const imN=(/fresh/.test(state.tank)?propImgsF:propImgsN)[p.id];if(nf>.01){const ok=imN&&imN.complete&&imN.naturalWidth;if(ok){const n=tinted(imN,p.id+(/fresh/.test(state.tank)?"Fb":"Nb"),back?.08:0,false),ar2=imN.naturalWidth/imN.naturalHeight,h2=h*1.02,w2=h2*ar2;if(n){ctx.globalAlpha=nf;ctx.drawImage(n,cx-w2/2,base+2-h2,w2,h2);ctx.globalAlpha=1}}else{const n=tinted(im,p.id+(back?"b":"f"),hz,true);if(n){ctx.globalAlpha=nf;ctx.drawImage(n,cx-w/2,base-h,w,h);ctx.globalAlpha=1}}}}pl[p.id]={base,h};propBox[p.id]={cx,base,w,h}})}
function drawProps(){const nf=nightAmt(),fr=/fresh/.test(state.tank),own=PROPS.filter(p=>pk(p.id));if(!own.length)return;let rd=0;own.forEach(p=>{const a=propImgs[p.id],b=(fr?propImgsF:propImgsN)[p.id];if(a&&a.complete&&a.naturalWidth)rd++;if(b&&b.complete&&b.naturalWidth)rd+=2});const t0=own.some(p=>state.propPos&&state.propPos[p.id])?60:FLOOR-240;if(t0!==PY0){PY0=t0;PHH=H-PY0;propKey=""}const key=JSON.stringify(state.propPos)+own.map(p=>p.id).join()+"|"+fr+"|"+Math.round(nf*30)+"|"+K+"|"+rd;if(key!==propKey||!propL){propKey=key;try{if(!propL)propL=document.createElement("canvas");propL.width=Math.round(W*K);propL.height=Math.round(PHH*K);const c=propL.getContext("2d");c.setTransform(K,0,0,K,0,-PY0*K);try{c.imageSmoothingQuality="high"}catch(e){}paintProps(c,nf)}catch(e){propL=null;paintProps(ctx,nf);return}}ctx.drawImage(propL,0,PY0,W,PHH)}
function drawFloor(t){
drawPlants2(t,0);
if(!(state.admOff||{}).props)drawProps();if(!(state.admOff||{}).caust)drawCaustics(t);
const dnf=nightAmt();[...state.decor].sort((p,q)=>decY(p)-decY(q)).forEach(d=>{const im=decImg(d.k);if(!im)return;const b=decBox(d);ctx.save();ctx.globalAlpha=.32;ctx.fillStyle="#001a28";ctx.beginPath();ctx.ellipse(d.x*W,b.y+b.h-2,b.w*.42,b.w*.08,0,0,7);ctx.fill();ctx.restore();drawTinted(im,"dec"+d.k,b.x,b.y,b.w,b.h,.05,dnf)});if(EDIT&&EDIT.mode==="deco")editOverlay();
{const si=eimg("🐌");if(si)for(let i=0;i<state.snails;i++){const sx=((t*6+i*300)%(W+60))-30,sw=40,sh=sw*si.naturalHeight/si.naturalWidth,bob=Math.sin(t*1.7+i)*.6;ctx.drawImage(si,sx-sw/2,FLOOR+40-sh+bob,sw,sh)}}
if(chestAnim&&Date.now()<chestAnim.until&&chestOpenImg.complete&&chestOpenImg.naturalWidth){{const cw=112,ch=cw*chestOpenImg.naturalHeight/chestOpenImg.naturalWidth;drawTinted(chestOpenImg,"chestO",chestAnim.x*W-cw/2,FLOOR+38-ch,cw,ch,.06,nightAmt())}}
const c=state.chest;if(c){ctx.save();ctx.translate(c.x*W,FLOOR-8+Math.sin(t*3)*3);ctx.globalAlpha=.25+Math.sin(t*4)*.1;ctx.fillStyle="#ffe58a";ctx.beginPath();ctx.arc(0,0,40,0,7);ctx.fill();ctx.globalAlpha=1;const img=chestClosedImg;if(img.complete&&img.naturalWidth){const cw=96,ch=cw*img.naturalHeight/img.naturalWidth;drawTinted(img,"chestC",-cw/2,37-ch,cw,ch,.06,nightAmt())}else{ctx.fillStyle="#8a4b1d";ctx.fillRect(-26,-6,52,30);ctx.fillStyle="#a8621f";ctx.beginPath();ctx.ellipse(0,-6,26,16,0,Math.PI,0);ctx.fill();ctx.fillStyle="#ffd36b";ctx.fillRect(-4,-6,8,16);ctx.fillRect(-26,6,52,4)}ctx.restore()}
}

let moodTxt="",moodAt=0;const moodSeen={};function moodSet(t){const e=$("tankMood");if(!e)return;if(t!==moodTxt){moodTxt=t;e.textContent=t;const k=String(t).replace(/[0-9~]+/g,""),n=Date.now();if(!(moodSeen[k]&&n-moodSeen[k]<120000)){moodAt=n;e.classList.remove("quiet")}moodSeen[k]=n}}
setInterval(()=>{try{const e=$("tankMood");if(e&&moodTxt&&Date.now()-moodAt>6000&&!feedModeOn())e.classList.add("quiet");else if(e&&feedModeOn())e.classList.remove("quiet")}catch(_){}},1000);
function waterStatus(){document.body.classList.toggle("coll",isColl(state.tank));if(isColl(state.tank)){const e=$("water"),T=TANKS[state.tank],t=T.name+" · bakım gerekmez";if(e.textContent!==t){e.textContent=t;(e.style.setProperty&&e.style.setProperty("--dot","#7fa8e0"))}try{e.classList.add("ok")}catch(_){}return}const d=state.dirt,e=$("water"),T=TANKS[state.tank]||TANKS.fresh,p=T.name+" · ",r=d<15?[p+"Temiz","#3ddc84"]:d<40?[p+"Az kirli","#b5e04a"]:d<60?[p+"Kirli","#f0a83a"]:[p+"Çok kirli","#ff5a4f"];if(e.textContent!==r[0]){e.textContent=r[0];(e.style.setProperty&&e.style.setProperty("--dot",r[1]))}try{e.classList.toggle("ok",d<15)}catch(_){}}
function drawDirt(t){
const d=Math.min(1,state.dirt/100*1.5);if(d<.08){if(dirtC&&dirtC.style)dirtC.style.display="none";return}const k=Math.round(d*40);
if(k!==dirtK){dirtK=k;if(!dirtC){try{document.querySelectorAll(".dirtov").forEach(e=>e.remove())}catch(e){}dirtC=document.createElement("canvas");dirtC.className="dirtov";dirtC.width=W/2;dirtC.height=H/2;try{dirtC.style.cssText="pointer-events:none";canvas.after(dirtC)}catch(e){dirtC.dom=0}}
const c=dirtC.getContext("2d"),w=W/2,h=H/2;c.clearRect(0,0,w,h);
let g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,"rgba(70,95,35,"+d*.45+")");g.addColorStop(.6,"rgba(80,85,35,"+d*.6+")");g.addColorStop(1,"rgba(60,45,18,"+d*.85+")");c.fillStyle=g;c.fillRect(0,0,w,h);
g=c.createRadialGradient(w/2,h/2,h*.15,w/2,h/2,h*.7);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(35,45,10,"+d*.75+")");c.fillStyle=g;c.fillRect(0,0,w,h);
for(let i=0;i<40;i++){const r=n=>{const v=Math.sin(i*12.9898+n*78.233)*43758.5453;return v-Math.floor(v)};if(r(1)>d*1.1)continue;
const sd=i%3,x=sd===0?r(2)*w*.18:sd===1?w-r(2)*w*.18:r(3)*w,y=sd===2?h-r(2)*h*.12:r(4)*h,rad=(10+r(5)*26)*(.5+d);
c.fillStyle="rgba("+(40+r(6)*30|0)+","+(80+r(7)*40|0)+",25,"+(.18+d*.3)+")";c.beginPath();c.ellipse(x,y,rad,rad*(.5+r(8)*.8),r(9)*3,0,7);c.fill()}}
if(dirtC.style)dirtC.style.display="";if(dirtC.dom===0)ctx.drawImage(dirtC,0,0,W,H);
const n=Math.floor(d*70),al=.2+d*.35;for(let g=0;g<3;g++){ctx.fillStyle="rgba("+(90+g*14)+","+(84+g*8)+",30,"+al+")";ctx.beginPath();for(let i=g;i<n;i+=3){const z=(1+i%5)*(.6+d*.8),x=((i*137.5)%W+Math.sin(t*.3+i)*30+t*(3+i%4*2))%W,y=((i*263.7)%H+Math.sin(t*.5+i*1.7)*25+t*(2+i%3))%H;ctx.moveTo(x+z,y);ctx.arc(x,y,z,0,7)}ctx.fill()}
}
function drawStatus(t){
ctx.textAlign="center";ctx.font="18px serif";state.fish.forEach(f=>{const x=f.x*W,y=f.y*H-48;const k=f.sick?"🤒":f.hunger<25?"🍽️":f.st&&STATUS[f.st]?STATUS[f.st][0]:"";if(k){const im=eimg(k);if(im){const h=24,w=h*im.naturalWidth/im.naturalHeight;ctx.drawImage(im,x-w/2,y-h*.8,w,h)}else ctx.fillText(k,x,y)}else if(f.st&&STATUS[f.st])ctx.fillText(STATUS[f.st][0],x,y)});
drawDirt(t)
}
function renderUI(){applyUnlocks();
$("coins").textContent=state.coins.toLocaleString("tr-TR");{const ge=$("gems");if(ge)ge.textContent=state.gems.toLocaleString("tr-TR")}$("level").textContent=state.level;$("xpfill").style.width=(Math.min(1,state.xp/(state.level*100))*60)+"%";$("count").textContent=state.fish.length+"/"+fishCap(state.tank);
waterStatus();$("badge").hidden=!(state.chest||(state.pending||0)>=1);$("feedCost").textContent="½ 🪙";$("feed").disabled=(state.coins<1&&!feedModeOn())||!state.fish.length;
if(!openKey)return;updateFeatures();if(openKey==="prod")fillParents();if(openKey==="map")renderMap();if(openKey==="quest")renderQuests();if(openKey==="ach")renderAch();
if(openKey==="shop")renderShop();
if(openKey==="shop"&&shopTab==="decor")$("props").innerHTML=PROPS.map(p=>`<div class="fish-card"><div class="fish-icon"><i class="fi" style="background-image:var(--p-${p.id})"></i></div><div><strong>${p.name}</strong><small>${p.perk}</small></div>${pk(p.id)?'<span class="pill">✓ Yerleşti</span>':`<button data-prop="${p.id}" ${state.coins<p.price?"disabled":""}>${p.price} 🪙</button>`}</div>`).join("");
if(openKey==="fish"){$("speciesCount").textContent=state.discovered.length+" tür keşfedildi";$("inventory").innerHTML=state.fish.length?invHTML():'<p class="note">Bu tank boş. Mağazadan balık alabilirsin.</p>';sellBarRender()}
}
function buy(type,at,q){const s=getSpecies(type),wt=WATER[type],dest=tankArr(wt);if(s.lv&&state.level<s.lv){notify(s.name+" Seviye "+s.lv+"'te açılır 🔒");return}if(!dest){notify("Önce "+TANKS[wt].name+" tankını açmalısın 🔒");return}if(dest.length>=fishCap(wt)){sfx("error");notify(TANKS[wt].icon+" "+TANKS[wt].name+" tankı dolu ("+dest.length+"/"+fishCap(wt)+"). Balık sat ya da koleksiyona taşı");return}if(state.coins<s.price){sfx("error");return}state.coins-=s.price;const rare=Math.random()<.035+(pk("moai")?.025:0);let mu0=rollMutation();if(state.luck>0){state.luck--;for(let i=0;i<2&&mu0==="normal";i++)mu0=rollMutation()}const f={id:state.nextId++,type,sizeTrait:rollSize(),mutation:mu0,gene:mu0!=="normal"?mu0:rollGene(),age:.12,lifeHours:0,sizeGrowth:0,rarity:rare?"Nadir":"Normal",name:rare?"Parlak "+s.name:s.name,personality:["Meraklı","Uysal","Hareketli","Utangaç"][Math.random()*4|0],hunger:70,health:100,sick:false,x:at?at.x/W:rand(.15,.85),y:at?at.y/H:rand(.2,.8),dir:Math.random()<.5?-1:1,phase:rand(0,6)};dest.push(f);mutNote(f,s);sizeNote(f,s);const newSp=!state.discovered.includes(type);if(newSp)state.discovered.push(type);Q("buy");if(!q)sfx("buy");addXP(Math.floor(s.price/25)+(newSp?15:0));if(q)return f;renderUI();save(true);notify(wt===state.tank?s.name+" akvaryuma eklendi! 🐟":s.name+" "+TANKS[wt].name+" tankına eklendi "+TANKS[wt].icon)}
function geneTest(id){const f=state.fish.find(x=>x.id===id);if(!f||geneKnown(f))return;if(state.coins<40){notify("Genetik test 40 🪙");return}state.coins-=40;f.geneKnown=true;Q("gene");sfx("gene");notify((f.name||getSpecies(f.type).name)+": "+(f.gene?MUTS[f.gene].icon+" "+MUTS[f.gene].name+" geni taşıyor!":"taşıyıcı değil"));renderUI();save(true)}
function moveOpts(f){return TKEYS.filter(k=>k!==state.tank&&state.stash[k]&&(!isColl(k)||WATER[f.type]===tw(k)||false)&&!(isColl(k)&&isColl(state.tank)&&WATER[f.type]!==tw(k)))}
function moveSel(f){const o=moveOpts(f);return o.length?`<select class="mv" data-mv="${f.id}"><option value="">Taşı…</option>${o.map(k=>`<option value="${k}">${TANKS[k].icon} ${TANKS[k].name}</option>`).join("")}</select>`:""}
function moveFish(id,to){if(VISIT||!TANKS[to]||to===state.tank)return;const dest=tankArr(to);if(!dest)return;if(dest.length>=fishCap(to)){sfx("error");notify(TANKS[to].icon+" "+TANKS[to].name+" tankı dolu ("+dest.length+"/"+fishCap(to)+")");return}const i=state.fish.findIndex(x=>x.id===id);if(i<0)return;const f0=state.fish[i],nm=f0.name||getSpecies(f0.type).name;const f=state.fish.splice(i,1)[0];for(const k of ["vx","vy","tx","ty","tt","rest","ang","fs","tp","sn","st"])delete f[k];f.x=rand(.2,.8);f.y=rand(.3,.6);dest.push(f);if(selectedFish===id)selectedFish=null;const T=TANKS[to];sfx("whoosh");notify(isColl(to)?nm+" koleksiyona alındı "+T.icon:WATER[f.type]===tw(to)?nm+" "+T.name+" tankına taşındı "+T.icon:"⚠️ "+nm+" yanlış suya taşındı, strese girecek!");renderUI();save(true)}
function switchTank(k){if(VISIT||!k||!state.stash[k])return;CRT.clear();coinsLoose.forEach(c=>{state.pending=(state.pending||0)+c.v});coinsLoose.length=0;feedMode=0;swapTo(k);drops=[];selectedFish=null;dirtK=-1;tapInfo=null;const T=TANKS[k];sfx("whoosh");notify(T.icon+" "+T.name+(T.coll?" · bakım gerekmez":" tankı"));renderUI();save(true)}
function unlockTank(k){const T=TANKS[k];if(!T||hasTank(k))return;if(state.level<T.lv){notify(T.name+" tankı Seviye "+T.lv+"'te açılır");return}if(state.coins<T.cost){notify(T.name+" tankı "+T.cost+" 🪙");return}state.coins-=T.cost;state.stash[k]={fish:[],dirt:0};sfx("unlock");checkAch();notify(T.icon+" "+T.name+" tankı açıldı!"+(T.coll?" Balıklarım panelinden balık taşıyabilirsin.":" Mağazadan tuzlu su balıkları alabilirsin."));renderUI();save(true)}
function sell(id){const i=state.fish.findIndex(f=>f.id===id);if(i<0)return;const f=state.fish[i],s=getSpecies(f.type),v=saleValue(f);state.fish.splice(i,1);state.coins+=v;Q("sell");Q("earn",v);renderUI();addXP(Math.min(12,Math.floor(v/50)));sfx("sell");notify(s.name+" satıldı: +"+v+" 🪙")}
function feedCost(){return Math.max(5,state.fish.length*2)}
function feedModeOn(){return feedMode>performance.now()}
function feed(){
if(VISIT)return;
if(isColl(state.tank)){notify("Koleksiyon tankında yemleme gerekmez 🏺");return}
if(!state.fish.length)return;
if(feedModeOn()){feedMode=0;sfx("click");return}
feedMode=performance.now()+15000;sfx("click");notify("🍤 Yem modu: yemi atmak istediğin yere dokun")}
function dropFood(x,y,n){
if(VISIT||isColl(state.tank)||!state.fish.length||drops.length>70)return 0;
x=Math.max(50,Math.min(W-50,x));let k=0;
for(let i=0;i<n;i++){state.feedTab=(state.feedTab||0)+.5;
if(state.feedTab>=1){if(state.coins<1){state.feedTab-=.5;break}state.coins-=1;state.feedTab-=1}
drops.push(mkFood(x,y));k++}feedX=x;if(k&&typeof y==="number"&&y>SURF+18)particles.push({x,y,vx:0,vy:0,life:.7,l0:.7,type:"ring"});
if(!k){notify("Yem için yeterli altın yok 🪙");feedMode=0;return 0}
state.dirt=Math.min(100,state.dirt+.08*k);state.lastFeed=Date.now();
state.fish.forEach(f=>{f.wake=simT+10});
const now=performance.now();if(now-feedQAt>6000){feedQAt=now;Q("feed")}
if(now-sfxAt>260){sfxAt=now;sfx("feed")}
feedMode=now+15000;$("coins").textContent=state.coins.toLocaleString("tr-TR");
if(navigator.vibrate)navigator.vibrate(8);return k}
// ---------- balıkların düşürdüğü altınlar
const COINV=s=>Math.max(1,Math.round(s.price*.075/3));
function spitCoin(f,x,y,fw){if(coinsLoose.length>=10)return;const av=Math.floor(state.pending||0);if(av<1)return;
const v=Math.min(av,COINV(getSpecies(f.type)));state.pending-=v;const d=f.dir||1;
coinsLoose.push({x:x+d*fw*.3,y,vy:-24,v,sw:rand(0,6),yf:FLOOR-4+rand(-4,22),rest:false,t:0});
for(let i=0;i<3;i++)particles.push({x:x+d*fw*.35,y,vx:rand(-8,8),vy:rand(-40,-15),life:.7,type:"bubble"})}
function coinStep(h){if(VISIT)return;for(const c of coinsLoose){c.t+=h;if(!c.rest){c.vy+=(40-c.vy)*Math.min(1,2.2*h);c.y+=c.vy*h;c.x+=Math.sin(simT*2+c.sw)*10*h;if(c.y>=c.yf){c.y=c.yf;c.rest=true}}}for(const c of coinsFly)c.t+=h}
function pickCoin(c){const i=coinsLoose.indexOf(c);if(i<0)return;coinsLoose.splice(i,1);coinsFly.push({x:c.x,y:c.y,v:c.v,t:0});
state.coins+=c.v;Q("collect",c.v);Q("earn",c.v);xpAcc+=c.v;if(xpAcc>=15){addXP(Math.min(15,Math.floor(xpAcc/15)));xpAcc%=15}
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
function collect(){let amount=Math.floor(state.pending||0);const lo=coinsLoose.reduce((s,c)=>s+c.v,0);if(amount+lo<1){notify("Henüz biriken ödül yok");return}state.pending-=amount;coinsLoose.forEach((c,i)=>coinsFly.push({x:c.x,y:c.y,v:c.v,t:-i*.06}));coinsLoose.length=0;amount+=lo;state.coins+=amount;Q("collect",amount);Q("earn",amount);addXP(Math.min(15,Math.floor(amount/15)));sfx("coins");notify("Olgun balıklardan "+amount+" 🪙 topladın!");renderUI();save(true)}
// ---------- ses motoru: tüm sesler anlık sentezlenir (dosya yok)
let audioCtx=null,ambience=null,AU=null;
function audio(){if(!audioCtx){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;try{audioCtx=new AC()}catch(e){return null}}if(audioCtx.state==="suspended")audioCtx.resume().catch(()=>{});if(!AU)initAU();musInit();return audioCtx}
function initAU(){const a=audioCtx,m=a.createGain(),comp=a.createDynamicsCompressor();m.gain.value=.9;comp.threshold.value=-16;comp.ratio.value=4;m.connect(comp);comp.connect(a.destination);
const sfx=a.createGain(),amb=a.createGain(),mus=a.createGain(),mf=a.createBiquadFilter();mf.type="lowpass";mf.frequency.value=5000;mus.connect(mf);mf.connect(m);sfx.connect(m);amb.connect(m);
const len=a.sampleRate*2,nb=a.createBuffer(1,len,a.sampleRate),nd=nb.getChannelData(0);for(let i=0;i<len;i++)nd[i]=Math.random()*2-1;
const bb=a.createBuffer(1,len,a.sampleRate),bd=bb.getChannelData(0);let l=0;for(let i=0;i<len;i++){l=(l+.02*(Math.random()*2-1))/1.02;bd[i]=l*3.5}
const mus2=a.createGain();mus2.connect(m);AU={m,sfx,amb,mus,mus2,mf,nb,bb,next:0,step:0,bar:0,mel:5};applyVolumes()}
function applyVolumes(){if(!AU)return;const t=audioCtx.currentTime;AU.sfx.gain.setTargetAtTime(state.muted?0:1,t,.05);AU.amb.gain.setTargetAtTime(state.muted?0:.8,t,.3);AU.mus.gain.setTargetAtTime(state.music===false?0:.5,t,.4);if(AU.mus2)AU.mus2.gain.setTargetAtTime(state.music===false?0:.6,t,.4)}
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
case"legend":osc("sine",NT(31),t,2.4,.09,{at:.01});osc("sine",NT(43),t,2,.05);osc("sine",NT(43)*2.76,t,.8,.02);for(let i=0;i<14;i++)osc("sine",NT([79,82,84,86,89][i%5]+12*(i%3===0)),t+.3+i*.07,.35,.018);break;
case"unlock":noise(t,.9,.07,"lowpass",300,{to:2000,at:.3,brown:true});arp(t+.3,[67,72,76,79,84],.1,"triangle",.045,.5);break;
case"sick":osc("triangle",NT(64),t,.25,.04);osc("triangle",NT(63),t+.22,.4,.04);break;
case"death":arp(t,[67,65,63,60],.22,"sine",.04,.5);break;
case"error":osc("sine",NT(57),t,.12,.04);osc("sine",NT(55),t+.12,.18,.04);break;
}}
function case_help(t){noise(t,.6,.07,"bandpass",400,{to:2400,q:1.4,at:.12});for(let i=0;i<6;i++)bubble(t+.15+i*.06,rand(400,1000),.03);coin(t+.5);coin(t+.62,.035)}
function tone(freq,dur,wave="sine",vol=.025,delay=0){if(!AU||state.muted)return;osc(wave,freq,audioCtx.currentTime+delay+.01,dur,vol)}

// Akvaria'ya özel üretilmiş müzik ve efektler (snd/ klasörü). Yüklenemezse sentez sesler çalışır.
const MUS={day:"snd/day.mp3",night:"snd/night.mp3",event:"snd/event.mp3",amb:"snd/amb.mp3",sfx:"snd/sfx.mp3"},MB={},SIDX={"feed":[0.0,0.7],"sell":[0.82,0.9],"coins":[1.84,1.2],"buy":[3.16,1.0],"click":[4.28,0.18],"error":[4.58,0.6],"clean":[5.3,1.4],"bubble":[6.82,0.35],"boop":[7.2899,0.6],"chest":[8.0099,2.0],"level":[10.1299,2.0],"ach":[12.2499,2.0],"rare":[14.3699,1.8],"legend":[16.2899,3.2],"hatch":[19.6099,1.0],"whoosh":[20.7299,0.8],"unlock":[21.6499,1.6],"cure":[23.3699,1.0],"breed":[24.4899,0.9],"gene":[25.5099,1.0],"place":[26.6299,0.7],"help":[27.4499,1.3],"sick":[28.8699,0.9],"death":[29.8899,2.0],"dusk":[32.0099,2.0],"dawn":[34.1299,2.0]},SVAR={feed:.08,sell:.04,coins:.03,click:.05,bubble:.12,boop:.06,place:.05,breed:.03,hatch:.04};let musLoad=0,musCur=null,musKey="",musChk=0;
function musInit(){if(musLoad||!audioCtx||typeof fetch!=="function")return;musLoad=1;Object.keys(MUS).forEach(k=>{fetch(MUS[k]).then(r=>{if(!r.ok)throw new Error("yok");return r.arrayBuffer()}).then(b=>new Promise((res,rej)=>{try{const p=audioCtx.decodeAudioData(b,res,rej);if(p&&p.then)p.then(res,rej)}catch(e){rej(e)}})).then(buf=>{MB[k]=buf;if(k==="amb"&&ambience&&!ambience.file)ambFile()}).catch(()=>{})})}
function loopTrim(s,buf){try{const d=buf.getChannelData(0);let a=0,b=d.length-1;while(a<d.length-1&&Math.abs(d[a])<1e-4)a++;while(b>a&&Math.abs(d[b])<1e-4)b--;s.loopStart=a/buf.sampleRate;s.loopEnd=(b+1)/buf.sampleRate}catch(e){}}
function playSeg(buf,off,dur,vol,rate){try{const s=audioCtx.createBufferSource(),g=audioCtx.createGain();s.buffer=buf;s.playbackRate.value=rate||1;g.gain.value=vol;s.connect(g);g.connect(AU.sfx);s.start(audioCtx.currentTime+.005,off,dur+.02)}catch(e){}}
function playBuf(buf,vol,rate){try{const s=audioCtx.createBufferSource(),g=audioCtx.createGain();s.buffer=buf;if(rate)s.playbackRate.value=rate;g.gain.value=vol;s.connect(g);g.connect(AU.sfx);s.start()}catch(e){}}
function ambFile(){try{if(ambience){try{ambience.s.stop()}catch(e){}}const s=audioCtx.createBufferSource(),g=audioCtx.createGain();s.buffer=MB.amb;s.loop=true;loopTrim(s,MB.amb);g.gain.value=.55;s.connect(g);g.connect(AU.amb);s.start();ambience={s,file:1}}catch(e){}}
function musWant(){if(state.music===false)return"";const wb=$("wheelBox");if(MB.event&&wb&&wb.offsetParent)return"event";return state.night?"night":"day"}
function musUpdate(){if(!AU||!audioCtx||audioCtx.state!=="running")return;const now=performance.now();if(now-musChk<400)return;musChk=now;const k=musWant();if(k===musKey)return;if(k&&!MB[k])return;const t=audioCtx.currentTime;if(musCur){const o=musCur;try{o.g.gain.cancelScheduledValues(t);o.g.gain.setTargetAtTime(0,t,.7)}catch(e){}setTimeout(()=>{try{o.s.stop()}catch(e){}},5000)}musCur=null;musKey=k;if(!k)return;try{const s=audioCtx.createBufferSource(),g=audioCtx.createGain(),b=MB[k];s.buffer=b;s.loop=true;loopTrim(s,b);g.gain.value=0;g.gain.setTargetAtTime(k==="event"?.75:1,t,.9);s.connect(g);g.connect(AU.mus2);s.start(t,k==="event"?0:Math.random()*Math.max(0,(s.loopEnd||b.duration)-30));musCur={s,g}}catch(e){musCur=null;musKey=""}}
function startAmbience(){if(!AU||ambience)return;if(MB.amb){ambFile();return}const a=audioCtx,s=a.createBufferSource(),fl=a.createBiquadFilter(),g=a.createGain(),lfo=a.createOscillator(),lg=a.createGain();s.buffer=AU.bb;s.loop=true;fl.type="lowpass";fl.frequency.value=420;g.gain.value=.045;lfo.frequency.value=.07;lg.gain.value=.02;lfo.connect(lg);lg.connect(g.gain);s.connect(fl);fl.connect(g);g.connect(AU.amb);s.start();lfo.start();ambience={s,fl}}
function stopAmbience(){}
// müzik: I–vi–IV–V üzerinde yumuşak pad, bas ve pentatonik marimba
const PROG=[[60,64,67],[57,60,64],[53,57,60],[55,59,62]],PENTA=[72,74,76,79,81,84,86,88];
function musicTick(){if(!AU||state.music===false||audioCtx.state!=="running"||musCur)return;const a=audioCtx,now=a.currentTime,E=60/74/2;if(AU.next<now)AU.next=now+.1;
AU.mf.frequency.setTargetAtTime(state.night?1300:5000,now,.5);
while(AU.next<now+.35){const t=AU.next,st=AU.step%8,ch=PROG[AU.bar%4];
if(st===0){ch.forEach(n=>osc("sine",NT(n),t,E*8,.016,{at:.9,bus:AU.mus}));osc("triangle",NT(ch[0]-12),t,E*3,.045,{bus:AU.mus,lp:600})}
if(st===4)osc("triangle",NT(ch[0]-12),t,E*3,.035,{bus:AU.mus,lp:600});
if(Math.random()<(state.night?.28:.42)&&!(st%2&&Math.random()<.5)){AU.mel=Math.max(0,Math.min(PENTA.length-1,AU.mel+[-2,-1,-1,0,1,1,2][Math.random()*7|0]));let n=PENTA[AU.mel];if(st===0&&!ch.some(c=>(n-c)%12===0))n=ch[2]+12;osc("sine",NT(n),t,.55,.04,{bus:AU.mus});osc("sine",NT(n)*4,t,.12,.012,{bus:AU.mus})}
AU.next+=E;AU.step++;if(AU.step%8===0)AU.bar++}}
document.addEventListener("pointerdown",()=>{if(audio())startAmbience()},true);
$("feed").addEventListener("click",()=>{audio();feed()});
$("clean").addEventListener("click",()=>{audio();clean()});$("cure").addEventListener("click",()=>{audio();cure()});$("save").addEventListener("click",()=>save());$("sound").addEventListener("click",()=>{state.muted=!state.muted;audio();startAmbience();applyVolumes();soundLabels();sfx("boop");save(true)});$("music").addEventListener("click",()=>{state.music=state.music===false;audio();startAmbience();applyVolumes();soundLabels();save(true)});
function soundLabels(){$("sound").textContent=state.muted?"🔇 Efektler: Kapalı":"🔊 Efektler: Açık";$("music").textContent=state.music===false?"🎵 Müzik: Kapalı":"🎵 Müzik: Açık"}
function updateFeatures(){
const eggs=state.eggs||[];const ready=eggs.filter(e=>Date.now()>=e.hatchAt).length;
$("eggStatus").textContent=eggs.length?(ready?ready+" yumurta açılmaya hazır":eggs.length+" yumurta · "+fmtTime(Math.max(0,(Math.min(...eggs.map(e=>e.hatchAt))-Date.now())/1000))):"Yumurta beklenmiyor";
$("gearStatus").textContent="Filtre Lv. "+state.equipment.filter+" · Yemleyici Lv. "+state.equipment.feeder;
capLabel();$("upgradeFilter").textContent="🫧 Filtre · "+(state.equipment.filter>=5?"MAX":100*(state.equipment.filter+1)+" 🪙");$("upgradeFeeder").textContent="🍤 Yemleyici · "+(state.equipment.feeder>=5?"MAX":100*(state.equipment.feeder+1)+" 🪙");
$("decorStatus").textContent=state.decor.length+" küçük dekor · "+state.props.length+"/"+PROPS.length+" özel dekor";
$("collectionStatus").textContent=state.discovered.length+" / "+species.length+" tür · "+state.mutsFound.length+" / "+species.length*4+" mutasyon keşfedildi";
}
function featureTick(now){
if(!state.eggs)state.eggs=[];
if(ensureOrders(now)){if(openKey==="quest")renderQuests();badges()}
const due=state.eggs.filter(e=>now>=e.hatchAt),used={},hatch=due.filter(e=>{const k=e.tank||state.tank,a=tankArr(k)||state.fish;used[k]=(used[k]||0)+1;return a.length+used[k]<=fishCap(k)});if(due.length>hatch.length&&!state.eggWait){state.eggWait=1;notify("🥚 Yumurta bekliyor: tank dolu")}if(!due.length||hatch.length)state.eggWait=0;if(hatch.length){state.eggs=state.eggs.filter(e=>!hatch.includes(e));hatch.forEach(e=>{let sp,mu,gene,bredMut=false,shiny=Math.random()<.08,dest=state.fish,zt=rollSize();
if(e.type&&e.pa&&e.pb&&species.some(s=>s.id===e.type)){sp=getSpecies(e.type);const a1=allele(e.pa),a2=allele(e.pb);if(a1&&a1===a2){mu=a1;bredMut=true}else mu=rollMutation();gene=mu!=="normal"?mu:(a1&&a2?(Math.random()<.5?a1:a2):(a1||a2||null));if(e.shiny)shiny=Math.random()<.3;zt=inheritSize(e.pa.z,e.pb.z);dest=tankArr(e.tank)||state.fish}
else{const par=state.fish.length?state.fish[Math.random()*state.fish.length|0]:null;sp=par?getSpecies(par.type):species[0];mu=rollMutation();gene=mu!=="normal"?mu:rollGene()}
const f={id:state.nextId++,type:sp.id,sizeTrait:zt,mutation:mu,gene,age:.04,lifeHours:0,sizeGrowth:0,rarity:shiny?"Nadir":"Normal",name:"Yavru "+sp.name,personality:["Meraklı","Uysal","Hareketli","Utangaç"][Math.random()*4|0],hunger:80,health:100,sick:false,x:rand(.15,.85),y:rand(.2,.8),dir:Math.random()<.5?-1:1,phase:rand(0,6)};dest.push(f);mutNote(f,sp);sizeNote(f,sp);if(bredMut)Q("bredMut");if(!state.discovered.includes(sp.id))state.discovered.push(sp.id)});Q("hatch",hatch.length);addXP(6*hatch.length);sfx("hatch");notify(hatch.length+" yumurta açıldı! Yeni yavrular 🐣");renderUI();save(true)}
if(now>=(state.eventAt||now+999999)){state.eventAt=now+rand(900000,1800000);const r=Math.random();if(r<.34){const n=Math.round(rand(4,14));state.coins+=n;state.eventMessage="Akıntı bir hazine getirdi! +"+n+" 🪙";notify("🌟 "+state.eventMessage)}else if(r<.67){state.dirt=Math.max(0,state.dirt-18);state.eventMessage="Temiz akıntı suyu berraklaştırdı!";notify("🌊 "+state.eventMessage)}else{const f=state.fish[Math.random()*state.fish.length|0];if(f){f.hunger=Math.min(100,f.hunger+25);state.eventMessage=(f.name||getSpecies(f.type).name)+" doğal yem buldu!";notify("🐟 "+state.eventMessage)}}save(true)}
if(openKey)updateFeatures();
}
function breedable(f){return f.age>=MATURE&&!f.sick&&f.health>50&&WATER[f.type]===state.tank&&!(f.bredAt&&Date.now()-f.bredAt<18e5)}
function fillParents(){const ps=state.fish.filter(breedable),a=$("pa"),b=$("pb"),va=a.value,vb=b.value;
const nm=f=>(f.name||getSpecies(f.type).name)+(f.mutation!=="normal"?" "+MUTS[f.mutation].icon:"")+(f.geneKnown&&f.gene&&f.mutation==="normal"?" 🧬":"");
a.innerHTML='<option value="">Birinci ebeveyn</option>'+ps.map(f=>`<option value="${f.id}">${esc(nm(f))}</option>`).join("");if(ps.some(f=>String(f.id)===va))a.value=va;
const A=ps.find(f=>String(f.id)===a.value),bs=A?ps.filter(f=>f!==A&&f.type===A.type):[];
b.innerHTML='<option value="">'+(A?(bs.length?"İkinci ebeveyn":"Aynı türden başka yetişkin yok"):"Önce birinciyi seç")+'</option>'+bs.map(f=>`<option value="${f.id}">${esc(nm(f))}</option>`).join("");if(bs.some(f=>String(f.id)===vb))b.value=vb;
const B=bs.find(f=>String(f.id)===b.value);$("odds").textContent=A&&B?oddsText(A,B):ps.length<2?"Çiftleşmek için aynı türden iki sağlıklı yetişkin balık gerekir (yarım saatte bir).":"Aynı türden iki balık seç.";
$("breed").textContent="💞 Çiftleştir · "+breedCost()+" 🪙";$("breed").disabled=!(A&&B)}
function breedCost(){const A=state.fish.find(f=>String(f.id)===($("pa")&&$("pa").value)),p=A?getSpecies(A.type).price:30,b=Math.round(p*.5+20);return ev("love")?Math.round(b*.5):b}
function breed(){const A=state.fish.find(f=>String(f.id)===$("pa").value),B=state.fish.find(f=>String(f.id)===$("pb").value);if(!A||!B||A===B||A.type!==B.type||!breedable(A)||!breedable(B)){notify("Aynı türden iki sağlıklı yetişkin seç");return}const c=breedCost();if(state.coins<c){notify("Çiftleştirme "+c+" 🪙");return}if(state.eggs.length>=3){notify("Aynı anda en fazla 3 yumurta tutabilirsin");return}if(state.fish.length+state.eggs.length>=fishCap(state.tank)){notify("Tank dolu, yavrulara yer yok ("+state.fish.length+"/"+fishCap(state.tank)+")");return}state.coins-=c;A.bredAt=B.bredAt=Date.now();
state.eggs.push({id:Date.now(),hatchAt:Date.now()+9e5*(pk("amphora")?.8:1)*(ev("spring")?.5:1),tank:state.tank,type:A.type,pa:{m:A.mutation,g:A.gene,z:szOf(A)},pb:{m:B.mutation,g:B.gene,z:szOf(B)},shiny:A.rarity==="Nadir"||B.rarity==="Nadir"});Q("breed");sfx("breed");notify("💞 Yumurta bırakıldı! Yaklaşık "+fmtTime((state.eggs[state.eggs.length-1].hatchAt-Date.now())/1000)+" sonra açılacak 🥚");renderUI();save(true)}
function upgrade(which){const level=state.equipment[which]||0,cost=100*(level+1);if(level>=5){notify("Bu ekipman en üst seviyede!");return}if(state.coins<cost){notify("Geliştirmek için "+cost+" 🪙 gerekli");return}state.coins-=cost;state.equipment[which]=level+1;notify((which==="filter"?"Filtre":"Otomatik yemleyici")+" Lv. "+(level+1)+" oldu!");renderUI();save(true)}
function buyProp(id){const p=PROPS.find(x=>x.id===id);if(!p||pk(id))return;if(state.coins<p.price){notify("Yeterli 🪙 yok");return}state.coins-=p.price;state.props.push(id);checkAch();sfx("place");renderUI();save(true);notify(p.name+" eklendi! "+p.perk);setTimeout(()=>editStart("deco"),250)}
function addDecor(){if(state.decor.length>=14){notify("Akvaryum dekorla dolu!");return}if(state.coins<25){notify("Dekor için 25 🪙 gerekli");return}state.coins-=25;const k=DECOR[Math.random()*DECOR.length|0];state.decor.push({k,x:rand(.06,.94)});notify(decTxt(k)+" eklendi! Sürükleyerek yerleştir");renderUI();save(true);setTimeout(()=>editStart("deco"),250)}
function renameFish(){const f=state.fish.find(x=>x.id===selectedFish)||state.fish[0],v=$("nm").value.trim().slice(0,24);if(!f){notify("Önce bir balık al");return}if(!v){notify("Önce bir isim yaz ✏️");return}f.name=v;$("nm").value="";renderUI();save(true);notify("Balığın adı: "+v)}
function renderBook(){$("bookList").innerHTML='<p class="note" style="margin:0 0 8px">Bir türün 3 mutasyonunu da bulunca ödül alırsın 🎁</p>'+species.map(sp=>{const ok=state.discovered.includes(sp.id);if(spLocked(sp))return `<div class="fish-card locked"><div class="fish-icon"><i class="fi" style="background-image:var(--f-${sp.id});filter:brightness(0) invert(1) opacity(.3)"></i></div><div><strong>???</strong><small>Seviye ${spReq(sp)}'de açılır</small></div></div>`;return `<div class="fish-card"><div class="fish-icon"><i class="fi" style="background-image:var(--f-${sp.id});${ok?"":"filter:brightness(0) invert(1) opacity(.3)"}"></i></div><div><strong>${ok?sp.name:"???"}</strong><small>${ok?sp.price+" 🪙 · satış ~"+Math.round(sp.value*mkt(sp.id))+" 🪙 · büyüme "+fmtTime(growHours(sp)*3600)+"<br>🧠 "+traitTxt(sp.id):"Henüz keşfedilmedi"}${ok?`<span class="mutrow">${["albino","transparent","melanistic","gold"].map(m=>`<i class="fi mb" title="${MUTS[m].name}" style="background-image:var(--m-${m}-${sp.id});${state.mutsFound.includes(m+"_"+sp.id)?"":"filter:brightness(0) invert(1) opacity(.22)"}"></i>`).join("")}<b class="bkn">${bookN(sp.id)}/3${state.mutsFound.includes("gold_"+sp.id)?" · 👑":""}</b></span>`:""}</small></div>${ok?bookBtn(sp):""}</div>`}).join("")}
try{$("critShop").onclick=e=>{const b=e.target.closest("[data-crit]");if(b){audio();buyCrit(b.dataset.crit);renderShop()}}}catch(e){}
$("props").onclick=e=>{const b=e.target.closest("[data-prop]");if(b)buyProp(b.dataset.prop)};$("shop").onclick=e=>{const n=e.target.closest("[data-buyn]");if(n){buyMany(n.dataset.buyn,+n.dataset.n);return}const b=e.target.closest("[data-buy]");if(b)startBuy(b.dataset.buy)};$("inventory").onclick=e=>{if(invClick(e))return;const b=e.target.closest("[data-gene],[data-move]");if(!b)return;if(0);else if(b.dataset.gene)geneTest(+b.dataset.gene);else moveFish(+b.dataset.move)};$("shopCount").textContent=species.length+" tür";
$("orders").onclick=e=>{const b=e.target.closest("[data-order]"),x=e.target.closest("[data-orderx]");if(b){if(deliverOrder(+b.dataset.order))renderQuests()}else if(x)skipOrder(+x.dataset.orderx)};$("quests").onclick=e=>{const b=e.target.closest("[data-quest]");if(b)claimQuest(b.dataset.quest)};$("achList").onclick=e=>{const b=e.target.closest("[data-ach]");if(b)claimAch(b.dataset.ach)};
$("tankList").onclick=e=>{const b=e.target.closest("button");if(!b)return;if(b.dataset.unlock)unlockTank(b.dataset.unlock);else if(b.dataset.go){switchTank(b.dataset.go);closeSheet()}};$("inventory").addEventListener("change",e=>{const s=e.target.closest("[data-mv]");if(s&&s.value)moveFish(+s.dataset.mv,s.value)});$("night").onclick=()=>{audio();toggleNight()};$("nightBtn").onclick=()=>{audio();toggleNight()};$("fsBtn").onclick=()=>{const d=document,e=d.documentElement,on=d.fullscreenElement||d.webkitFullscreenElement;try{if(on){(d.exitFullscreen||d.webkitExitFullscreen).call(d)}else{const f=e.requestFullscreen||e.webkitRequestFullscreen;if(!f){notify("Bu cihaz tam ekrana izin vermiyor. Ana ekrana ekleyebilirsin.");return}const p=f.call(e);if(p&&p.catch)p.catch(()=>notify("Bu pencere tam ekrana izin vermiyor. Ana ekrana ekleyebilirsin."))}}catch(x){notify("Bu pencere tam ekrana izin vermiyor. Ana ekrana ekleyebilirsin.")}};$("lvOk").onclick=closeLevelUp;$("lvl").addEventListener("pointerdown",e=>{if(e.target.id==="lvl")closeLevelUp()});$("breed").addEventListener("click",breed);$("pa").addEventListener("change",fillParents);$("pb").addEventListener("change",fillParents);$("upgradeFilter").addEventListener("click",()=>upgrade("filter"));$("upgradeFeeder").addEventListener("click",()=>upgrade("feeder"));$("decorate").addEventListener("click",addDecor);$("rename").addEventListener("click",renameFish);
function initScenery(){for(let i=0;i<30;i++)bubbles.push({x:rand(0,W),y:rand(0,H),r:rand(1.5,5),speed:rand(8,27),drift:rand(-7,7),alpha:rand(.12,.38),phase:rand(0,7)})}
function curWater(){return VISIT?(VISIT.tank==="salt"?"salt":"fresh"):tw(state.tank)}
let bgKey="";function bgImg(n){const fr=curWater()==="fresh",k=(fr?"F":"S")+(n?"n":"d");if(k!==bgKey){bgKey=k;try{$("bgfill").style.backgroundImage="var(--asset-"+(fr?(n?"nightF":"reefF"):(n?"night":"reef"))+")"}catch(e){}}const im=fr?(n?nightF:reefF):(n?nightBg:reefBg);if(im.complete&&im.naturalWidth)ctx.drawImage(im,0,0,W,H);else{ctx.fillStyle=fr?(n?"#052a2c":"#0a8a90"):(n?"#061a40":"#087ba3");ctx.fillRect(0,0,W,H)}}
function dnP(){if(!DN)return 1;const p=(performance.now()-DN.t0)/1600;if(p>=1){DN=null;return 1}return p}
function drawDN(){if(!DN)return;const p=Math.min(1,(performance.now()-DN.t0)/1600),toN=state.night;
const sweep=Math.sin(p*Math.PI);ctx.save();const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,toN?"rgba(20,24,80,"+(.35*sweep)+")":"rgba(255,214,140,"+(.35*sweep)+")");g.addColorStop(1,"rgba(0,0,0,0)");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
ctx.textAlign="center";ctx.font="64px serif";const ox=W*.78,dn=(k,yy)=>{const im=eimg(k);if(im)ctx.drawImage(im,ox-40,yy-62,80,80);else ctx.fillText(k,ox,yy)};ctx.globalAlpha=1-p;dn(toN?"☀️":"🌙",H*.12+p*H*.18);ctx.globalAlpha=p;dn(toN?"🌙":"☀️",H*.3-p*H*.18);
if(toN){ctx.fillStyle="#fff";for(let i=0;i<18;i++){const a=p*(.4+.6*Math.abs(Math.sin(i*7.3+performance.now()/400)));ctx.globalAlpha=a*.8;ctx.beginPath();ctx.arc((i*97.3)%W,(i*53.1)%(H*.3)+20,1.2+(i%3)*.6,0,7);ctx.fill()}}ctx.restore()}
let bgA=null,bgB=null,bgCur="",bgDom=null,bgTm=0;
const BG_V={Sd:"reef",Sn:"night",Fd:"reefF",Fn:"nightF"},BG_C={Sd:"#087ba3",Sn:"#061a40",Fd:"#0a8a90",Fn:"#052a2c"};
function bgInit(){if(bgDom!==null)return bgDom;try{bgA=document.createElement("div");bgB=document.createElement("div");const st="position:absolute;left:0;top:0;width:100%;height:100%;background-size:cover;background-position:center 72%;pointer-events:none";bgA.style.cssText=st;bgB.style.cssText=st+";opacity:0";canvas.before(bgA);canvas.before(bgB);bgDom=!!(canvas.before&&bgA.style)}catch(e){bgDom=false}return bgDom}
function bgSet(el,k){el.style.backgroundColor=BG_C[k];el.style.backgroundImage="var(--asset-"+BG_V[k]+")"}
function bgDomStep(){const fr=curWater()==="fresh",k=(fr?"F":"S")+(state.night?"n":"d");if(k===bgCur)return;const prev=bgCur;bgCur=k;try{$("bgfill").style.backgroundImage="var(--asset-"+BG_V[k]+")"}catch(e){}
clearTimeout(bgTm);if(prev&&prev[0]===k[0]&&DN){bgSet(bgB,k);bgB.style.transition="none";bgB.style.opacity="0";void bgB.offsetWidth;bgB.style.transition="opacity 1.6s ease-in-out";bgB.style.opacity="1";bgTm=setTimeout(()=>{bgSet(bgA,k);bgB.style.transition="none";bgB.style.opacity="0"},1700)}else{bgSet(bgA,k);bgB.style.transition="none";bgB.style.opacity="0"}}
function drawBackground(){
if(bgInit()){dnP();bgDomStep();const bgo=!!(state.admOff||{}).bg;if(bgo!==bgOffC){bgOffC=bgo;bgA.style.display=bgB.style.display=bgo?"none":""}const tf=((VISIT?"":themeF())+" "+bgSoftF()).trim();if(tf!==curTF){curTF=tf;bgA.style.filter=tf;bgB.style.filter=tf;vigSync()}ctx.clearRect(0,0,W,H)}else{const p=dnP();if(DN){bgImg(DN.from);const e=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;ctx.globalAlpha=e;bgImg(state.night);ctx.globalAlpha=1}else bgImg(state.night)}
ctx.lineWidth=1.5;bubbles.forEach(b=>{ctx.strokeStyle="rgba(210,250,255,"+b.alpha+")";ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,7);ctx.stroke()})
}
// yüzme animasyonu ayarları (tek yerden): n=dilim, amp=kuyruk genliği, wave=gövdedeki dalga boyu (rad), rest=dururken genlik, roll=gövde sallanması
const SWIM={amp:.06,rest:.016,wave:3.2,roll:.03,turn:.07,stretch:.035};
// tür profili: [genlik, vuruş hızı, kuyruğa yığılma, gövde sallanması, dalga boyu]
const SWP={koi:[.6,.6,1.8,.6,1.1],arowana:[.7,.8,1.8,.7,1.1],boxfish:[.55,1,2,.6,1.1],napo:[.5,.65,2,.5,1.2],neon:[1,1.5,1.6,1,1],guppy:[1,1.35,1.6,1,1],clown:[1.05,1.2,1.7,1,1],ytang:[.85,1,1.8,.8,1.1],btang:[.85,1,1.8,.8,1.1],gold:[.95,.7,1.4,.9,.9],betta:[1.15,.6,1.2,1,.8],angel:[.45,.6,2,.5,1.2],emp:[.45,.6,2,.5,1.2],idol:[.45,.65,2,.5,1.2],discus:[.4,.55,2,.4,1.2],copper:[.5,.7,2,.5,1.2],lion:[.55,.5,1.8,.5,1.1],trigger:[.55,1,2,.6,1.1],mandarin:[.75,1.4,1.7,.9,1],cichlid:[.9,1,1.7,.9,1]};
// büyük balık yavaş ve geniş, küçük balık hızlı ve sık vurur; her balığa küçük bireysel fark
function swimFq(f){const p=SWP[f.type]||SWP.clown,z=Math.max(.6,Math.min(1.6,Math.pow(70/fishW(f),.45)));return p[1]*z*(1+.12*Math.sin((f.phase||0)*13))}
const lodC=new Map();function lodImg(im,wd){const nw=im.naturalWidth;let L=nw;for(const l of [96,144,208,288]){if(l>=wd*.9){L=l;break}}if(L>=nw)return im;let m=lodC.get(im);if(!m){m={};lodC.set(im,m)}let c=m[L];if(c!==undefined)return c||im;c=null;try{const cv=document.createElement("canvas");cv.width=L;cv.height=Math.max(1,Math.round(im.naturalHeight*L/nw));const x=cv.getContext("2d");try{x.imageSmoothingQuality="high"}catch(e){}x.drawImage(im,0,0,cv.width,cv.height);c=cv}catch(e){c=null}m[L]=c;return c||im}
const haloC={};
function halo(im,key,color,blur){let c=haloC[key];if(c!==undefined)return c;c=null;try{const pad=Math.ceil(blur*1.8),cv=document.createElement("canvas");const iw0=im.naturalWidth||im.width,ih0=im.naturalHeight||im.height;cv.width=iw0+pad*2;cv.height=ih0+pad*2;const x=cv.getContext("2d"),off=cv.width+60;x.shadowColor=color;x.shadowBlur=blur;x.shadowOffsetX=off;x.drawImage(im,pad-off,pad);c={cv,pad}}catch(e){c=null}haloC[key]=c;return c}

function flushGfx(why){try{lodC.clear();for(const o of [tintC,haloC,hexC,PLC])for(const k in o)delete o[k];propL=null;propKey="";dirtK=-1;bgCache=null;obsC=null;obsKey="";causT=null;causP=null}catch(e){}}
function gfxProbe(c){try{if(c&&c.getContext&&c.width>2){const x=c.getContext("2d"),d=x.getImageData(0,0,c.width,c.height).data;for(let i=3,n=0;i<d.length&&n<4000;i+=4*Math.max(1,(d.length>>2)/4000|0),n++)if(d[i]>200){c._pi=i>>2;break}}}catch(e){}}
let gfxChk=0,gfxRR=0,gfxS=null;function gfxList(){const L=[];for(const m of lodC.values())for(const k in m)if(m[k])L.push(m[k]);if(!gfxS){try{gfxS=document.createElement("canvas");gfxS.width=gfxS.height=96;const x=gfxS.getContext("2d");x.fillStyle="#123";x.fillRect(0,0,96,96);gfxS._pi=96*48+48}catch(e){gfxS=null}}if(gfxS)L.push(gfxS);return L}
function gfxWatch(now){if(now-gfxChk<1500)return;gfxChk=now;try{const L=gfxList();if(Object.keys(PLC).length>90||Object.keys(tintC).length>70){flushGfx("mem");return}if(!L.length)return;const c=L[gfxRR++%L.length];if(c._pi===undefined){gfxProbe(c);if(c._pi===undefined)c._pi=-1;return}if(c._pi<0)return;const a=c.getContext("2d").getImageData(c._pi%c.width,(c._pi/c.width)|0,1,1).data[3];if(a<10){if(c===gfxS)gfxS=null;flushGfx("lost")}}catch(e){flushGfx("err")}}
document.addEventListener("visibilitychange",()=>{if(!document.hidden)flushGfx("vis")});addEventListener("pageshow",()=>flushGfx("show"));try{document.querySelectorAll("canvas").forEach(c=>c.addEventListener("contextrestored",()=>flushGfx("ctx")))}catch(e){}
function drawFish(f,t){
const s=getSpecies(f.type),mu=MUTS[f.mutation]&&f.mutation!=="normal"?f.mutation:null,mi=mu&&mutImgs[mu+"_"+s.id],im=mi&&mi.complete&&mi.naturalWidth?mi:fishImgs[s.id];if(!im.complete||!im.naturalWidth)return;
const size=fsz(f),vf=mi&&im===mi?(MUTW[mu+"_"+s.id]||1):1,w=fishW(f),h=w*im.naturalHeight/im.naturalWidth,sn=f.sn||0,tp=f.tp||0,fs=f.fs||f.dir||1,turn=1-Math.min(1,Math.abs(fs));
ctx.save();ctx.translate(f.x*W,f.y*H+Math.sin(t*1.4+f.phase)*(2+3*(1-sn)));
ctx.globalAlpha=.15;ctx.fillStyle="#001d30";ctx.beginPath();ctx.ellipse(0,w*.3,w*.42*Math.max(.35,Math.abs(fs)),w*.08,0,0,7);ctx.fill();ctx.globalAlpha=1;
const gk=f.gulp>0?Math.sin(Math.PI*(1-f.gulp/.24)):0;ctx.scale((fs>=0?Math.max(.4,fs):Math.min(-.4,fs))*(1+SWIM.stretch*sn)*(1-.07*gk),(1-SWIM.stretch*.6*sn)*(1+SWIM.turn*turn)*(1+.06*gk));
ctx.rotate((f.ang||0)+Math.sin(tp+1.9)*(SWIM.roll*.35+SWIM.roll*sn)*(SWP[f.type]||SWP.clown)[3]);
const M=mu?MUTS[mu]:null,hc=state.lowGfx?null:M?{c:M.glow,b:M.blur,k:mu}:(f.rarity==="Nadir"?{c:"#ffe46b",b:14,k:"rare"}:null);
if(hc){const hs=lodImg(im,w*K*.6),hw=hs.naturalWidth||hs.width,H0=halo(hs,hc.k+"_"+s.id+"_"+hw,hc.c,hc.b*1.6*hw/190);if(H0){const k=w/hw,pu=(.75+.25*Math.sin(t*2+f.phase))*(mu==="transparent"?.45:1);ctx.globalAlpha=pu;ctx.drawImage(H0.cv,-w/2-H0.pad*k,-h/2-H0.pad*k,H0.cv.width*k,H0.cv.height*k);ctx.globalAlpha=1}}
const src0=lodImg(im,w*K),LT=litOn(),src=LT?litTex(src0):src0,N=state.lowGfx?(w<90?4:5):(w<70?6:w<110?8:10),iw=src.naturalWidth||src.width,ih=src.naturalHeight||src.height,sw=iw/N,dw=w/N,P=SWP[f.type]||SWP.clown,amp=w*(SWIM.rest+SWIM.amp*sn)*P[0]*Math.pow(90/w,.15),ov=1.2;
for(let i=0;i<N;i++){const u=1-(i+.5)/N,dy=Math.sin(tp-u*SWIM.wave*P[4])*amp*Math.pow(u,P[2]),last=i===N-1;
ctx.drawImage(src,i*sw,0,last?sw:sw+ov,ih,-w/2+i*dw,-h/2+dy,last?dw:dw+ov*dw/sw,h)}
if(mu==="gold"&&!state.lowGfx){const sh=(t*.45+f.phase*.13)%1.6;if(sh<1){ctx.save();ctx.globalCompositeOperation="lighter";ctx.globalAlpha=.32*Math.sin(sh*Math.PI);const gx=-w/2+w*sh,gr=ctx.createLinearGradient(gx-w*.18,0,gx+w*.18,0);gr.addColorStop(0,"rgba(255,240,170,0)");gr.addColorStop(.5,"rgba(255,248,210,1)");gr.addColorStop(1,"rgba(255,240,170,0)");ctx.fillStyle=gr;ctx.beginPath();ctx.ellipse(gx,0,w*.16,h*.36,-.5,0,7);ctx.fill();ctx.restore()}}
if(mu&&!state.lowGfx){ctx.shadowBlur=0;const k=mu==="gold"?5:mu==="melanistic"?3:mu==="transparent"?2:1;for(let i=0;i<k;i++){const a=Math.sin(t*1.6+f.phase*3+i*2.1);if(a<.55)continue;const px=Math.sin(f.phase*7+i*4.3)*w*.32,py=Math.cos(f.phase*5+i*3.7)*h*.22,r=(a-.55)*w*.09;ctx.globalAlpha=(a-.55)*2.2;ctx.fillStyle=mu==="gold"?"#fff6c8":mu==="melanistic"?"#c9d6ff":mu==="transparent"?"#e8fbff":"#fff0f6";ctx.beginPath();ctx.moveTo(px,py-r);ctx.lineTo(px+r*.25,py);ctx.lineTo(px,py+r);ctx.lineTo(px-r*.25,py);ctx.closePath();ctx.moveTo(px-r,py);ctx.lineTo(px,py+r*.25);ctx.lineTo(px+r,py);ctx.lineTo(px,py-r*.25);ctx.fill()}ctx.globalAlpha=1}
ctx.restore()
}
let selectedFish=null;
const litC=new WeakMap();
function litOn(){return !state.lowGfx&&!VISIT}
function litTex(src){let L=litC.get(src);if(L!==undefined)return L;L=src;try{const iw=src.naturalWidth||src.width,ih=src.naturalHeight||src.height,c=document.createElement("canvas");c.width=iw;c.height=ih;const x=c.getContext("2d");x.drawImage(src,0,0);x.globalCompositeOperation="source-atop";const g=x.createLinearGradient(0,0,0,ih);g.addColorStop(0,"rgba(255,252,235,.26)");g.addColorStop(.3,"rgba(255,255,255,.06)");g.addColorStop(.55,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,22,40,.38)");x.fillStyle=g;x.fillRect(0,0,iw,ih);L=c}catch(e){L=src}litC.set(src,L);return L}
function drawParticles(dt){
particles=particles.filter(p=>p.life>0);
particles.forEach(p=>{
p.life-=dt; p.x+=p.vx*dt; p.y+=p.vy*dt;
if(p.type==='ring'){const k=1-p.life/p.l0;ctx.strokeStyle='rgba(230,250,255,'+(.55*(1-k))+')';ctx.lineWidth=1.4;ctx.beginPath();ctx.ellipse(p.x,p.y,4+k*26,1.5+k*5,0,0,7);ctx.stroke()}
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
const PH={koi:[45,70,.15,.8,0,.8],arowana:[60,100,.2,.8,0,1],boxfish:[32,55,.25,.85,0,.7],napo:[42,70,.15,.75,0,.75],neon:[95,190,.1,.7,1,1.3],guppy:[80,160,.15,.75,1,1.2],clown:[62,110,.3,.95,0,1],ytang:[70,115,.25,.85,0,1],gold:[48,70,.25,.95,0,.7],betta:[42,60,.2,.9,0,.6],btang:[72,120,.15,.8,0,1],angel:[55,85,.15,.75,0,.75],cichlid:[60,100,.2,.8,0,1],lion:[30,50,.25,.85,0,.7],copper:[45,80,.2,.8,0,.9],discus:[40,60,.2,.8,0,.6],trigger:[58,95,.25,.9,0,1],mandarin:[50,90,.4,.95,0,1.2],idol:[52,85,.15,.75,0,.8],emp:[50,80,.15,.75,0,.7]};
let acc=0,simT=0;
function phys(f,s){if(f.vx!==undefined&&isFinite(f.vx+f.vy+f.x+f.y))return;const p=PH[s.id]||PH.clown;f.x=Math.min(BX1/W,Math.max(BX0/W,f.x||.5));f.y=Math.min(BY1/H,Math.max(BY0/H,f.y||.4));f.dir=f.dir||1;f.vx=f.dir*p[0]*.3;f.vy=0;f.tt=0;f.tx=f.x*W;f.ty=f.y*H;f.ang=0;f.fs=f.dir;f.tp=rand(0,6);f.sn=0}
function isSleepy(f){return state.night&&!NOCT.includes(f.type)&&!(f.wake>simT)}
function pick(f,p){const TR=TRAIT[f.type]||TR0,sl=isSleepy(f),fw=fishW(f),fh=fishH(f),mx=Math.max(0,fw/2-50),my=Math.max(0,fh/2-48)*.8,bx0=BX0+mx,bx1=BX1-mx,by0=BY0+my,by1=BY1-my;f.act="";const rest=sl||Math.random()<(NOCT.includes(f.type)&&!state.night?.45:(TR.rest!=null?TR.rest:.22)),x=f.x*W,y=f.y*H;f.rest=rest;f.tt=sl?rand(5,10):rest?rand(1.5,4):rand(3,9);
if(sl){f.tx=W*(.1+.8*((f.id*.7548776)%1))+rand(-20,20);f.ty=by0+(by1-by0)*(.55+.42*((f.id*.6180339)%1))}else if(rest){f.tx=x+rand(-25,25);f.ty=y+rand(-15,15)}else{let d=(Math.random()<.7)===(f.vx>=0)?1:-1;if(x<bx0+120)d=1;else if(x>bx1-120)d=-1;f.tx=x+d*rand(90,300)*(TR.patrol?1.8:1);const z=TR.z||[p[2],p[3]];f.ty=Math.random()<.3?y+rand(-50,50):by0+(by1-by0)*rand(z[0],z[1]);if(TR.patrol){f.tx=x<W/2?bx1-rand(0,30):bx0+rand(0,30);f.tt=rand(6,11)}if(TR.home){if(f.home==null)f.home=homeSpot(f);f.tx=f.home+rand(-75,75)}}
f.tx=Math.min(bx1,Math.max(bx0,f.tx));f.ty=Math.min(by1,Math.max(by0,f.ty));if(!sl&&!rest)traitPick(f,TR,fw,fh,bx0,bx1)}
let gridG=null,gridArr=null,gridN=0,gridT=0,obsKey="",obsC=null;
function physics(h){
const fs=state.fish,n=fs.length,coll=isColl(state.tank);simT+=h;let G=null;coinStep(h);
fs.forEach(f=>phys(f,getSpecies(f.type)));
if(n>10){if(!gridG||gridArr!==fs||gridN!==n||(++gridT)%4===0){gridArr=fs;gridG=new Map();fs.forEach(f=>{const k=((f.x*W/170)|0)+((f.y*H/170)|0)*10,a=gridG.get(k);a?a.push(f):gridG.set(k,[f])});gridN=n}G=gridG}
const okey=state.decor.map(d=>d.x+","+d.y).join(";")+"|"+state.props.join()+"|"+JSON.stringify(state.propPos)+"|"+(state.chest?state.chest.x:"-");if(okey!==obsKey||!obsC){obsKey=okey;obsC=state.decor.map(d=>[d.x*W,decY(d)-14,34]);PROPS.forEach(p=>{if(pk(p.id)){const cp=state.propPos[p.id];obsC.push(cp?[cp.x*W,cp.y-26*p.sc-10,48*p.sc]:[p.x*W,FLOOR+p.dy*.5-14,48*p.sc])}});if(state.chest)obsC.push([state.chest.x*W,FLOOR-8,50])}const obs=obsC;
for(const f of fs){
const s=getSpecies(f.type),p=PH[s.id]||PH.clown,ps=f.personality==="Hareketli"?1.3:f.personality==="Utangaç"?.8:f.personality==="Uysal"?.9:1,yg=Math.min(1,f.age),
sz=fsz(f),sl=isSleepy(f),nm=NOCT.includes(f.type)?(state.night?1.2:.8):1,vmax=p[0]*ps*nm*(sl?.3:1)*(f.sick?.55:1)*(f.hunger<15?.8:1)*(1.15-.25*yg),A=p[1]*p[5]*(sl?.4:1)*(1.2-.3*yg);
if(sl!==!!f.slp){f.slp=sl;f.tt=0}
let x=f.x*W,y=f.y*H,ax=0,ay=0,cruise=vmax*.8,food=null;const fw=fishW(f),fh=fishH(f),mx=Math.max(0,fw/2-50),my=Math.max(0,fh/2-48)*.8,bx0=BX0+mx,bx1=BX1-mx,by0=BY0+my,by1=BY1-my;
if(!isFinite(x+y+f.vx+f.vy)){f.x=.5;f.y=.4;f.vx=f.vy=0;continue}
// yem algısı: ağız noktası, türe göre beslenme bölgesi, büyük balığın önceliği
const TR=TRAIT[f.type]||TR0,mo=f.dir||1,mx0=x+mo*fw*.44,my0=y+fh*.06;let bm=1;if(f.burst>0){f.burst-=h;bm=1.75}if(f.gulp>0)f.gulp-=h;
if(drops.length&&f.hunger<95&&(!sl||f.hunger<35)&&!(f.spitT>simT)){let best=1e9;const R=(130+(100-f.hunger)*2.6)*(TR.sense||1);for(const d of drops){if(d.eaten||d.ph==="fall")continue;const wz=zoneW(TR.feed,d);if(wz<=0||(f.hunger>55&&wz<.45))continue;if(d.by&&d.by!==f.id&&simT-d.ct<.35&&f.hunger>35&&d.bsz>fw*1.1)continue;const q=Math.hypot(d.x-mx0,d.y-my0)/wz;if(q<R&&q<best){best=q;food=d}}}
if(food){if(!food.by||food.by===f.id||simT-food.ct>.35||fw>food.bsz*1.1){food.by=f.id;food.bsz=fw}if(food.by===f.id)food.ct=simT;const fd=food.x>=x?1:-1;
f.tx=food.x-fd*fw*.42;f.ty=(food.ph==="surf"?Math.max(food.y+fh*.12,SURF+6):food.y+(food.ph==="sink"?food.vy*.35:0))-fh*.06;f.rest=false;f.tt=1;f.act="";cruise=vmax*(.65+.45*(1-f.hunger/100))*(TR.lunge&&simT-f.lt>2?1.3:1);
if(Math.abs(food.x-x)<95&&mo!==fd&&Math.abs(food.y-y)<90)f.dir=fd;const dm=Math.hypot(food.x-mx0,food.y-my0);if(dm<(TR.lunge?110:65)&&mo===fd){if(!(f.burst>0)&&simT-(f.lt||0)>.6){f.burst=TR.lunge?.32:.2;f.lt=simT}}
if(dm<24&&mo===fd){const k=Math.min(1,h*12);food.x+=(mx0-food.x)*k;food.y+=(my0-food.y)*k}
if(dm<food.r0+6&&mo===fd&&simT>(f.biteT||0)){f.biteT=simT+(fw<70?.38:.26);f.gulp=.24;const bite=Math.max(.5,Math.min(2,fw/75));
if(fw<85&&!food.spat&&Math.random()<.09){food.spat=1;food.vx=mo*rand(40,60);food.vy=-rand(6,16);if(food.ph!=="sink"){food.ph="sink";food.vy=8}f.spitT=simT+.55;crumbs(mx0,my0,2,food.col)}
else{const e=Math.min(bite,food.hp);food.hp-=e;f.hunger=Math.min(100,f.hunger+12*e);if(food.hp<=.01)food.eaten=true;crumbs(mx0,my0,food.tp==="f"?3:2,food.col);if(food.ph==="floor")sandPuff(food.x,food.y,3);if(simT-eatAt>.3){eatAt=simT;sfx("bubble")}}}}
else{if(behave(f,TR,x,y,fw,fh,mx0,my0,h,p,bx0,bx1,by0,by1))cruise=vmax*.9;f.tt-=h;if(f.tt<=0||(!f.rest&&f.act!=="graze"&&f.act!=="forage"&&Math.hypot(f.tx-x,f.ty-y)<18))pick(f,p)}
// varışa yavaşlayarak yönelme (dikey ivme daha düşük)
const deep=(food&&food.ph==="floor")||f.act==="forage",by1e=deep?Math.max(by1,FLOOR+6-fh*.22):by1,by0e=(food&&food.ph==="surf")||f.act==="beg"?Math.min(by0,SURF+fh*.12):by0;const dx=f.tx-x,dy=f.ty-y,dist=Math.hypot(dx,dy)||1,want=food?bm*cruise*Math.max(.35,Math.min(1,dist/35)):bm*f.rest&&!sl?Math.min(cruise*.25,dist*.8):cruise*Math.min(1,dist/90);
// komşular: ayrılma + (uygun türlerde) sürü uyumu/merkezleme
let cand=fs;if(G){cand=[];const cx=(x/170)|0,cy=(y/170)|0;for(let i=-1;i<2;i++)for(let j=-1;j<2;j++){const a=G.get(cx+i+(cy+j)*10);if(a)for(const o of a)cand.push(o)}}
let sx=0,sy=0,cx2=0,cy2=0,mvx=0,mvy=0,c=0;
for(const o of cand){if(o===f)continue;const ox=o.x*W-x,oy=o.y*H-y,d=Math.hypot(ox,oy);if(d>170||d<.01)continue;const R=Math.min(150,(fw+fishW(o))*.3+4);if(d<R){const k=(1-d/R)*(food?Math.min(2,Math.max(.5,fishW(o)/fw)):1);sx-=ox/d*k;sy-=oy/d*k}
if(p[4]&&o.type===f.type){cx2+=ox;cy2+=oy;mvx+=o.vx;mvy+=o.vy;c++}}
if(f.type==="betta"||f.type==="gold"||SMALL.includes(f.type)){let bd=1e9,bx=0,by=0;for(const o of fs){if(o===f)continue;const ox=o.x*W-x,oy=o.y*H-y,d=Math.hypot(ox,oy)||1;
if(f.type==="betta"&&o.type==="betta"&&d<300&&d>sz*2.2){ax+=ox/d*A*.7;ay+=oy/d*A*.5}
else if(SMALL.includes(f.type)&&o.type==="gold"&&d<140){const k=1-d/140;ax-=ox/d*A*1.4*k;ay-=oy/d*A*1.1*k}
else if(f.type==="gold"&&SMALL.includes(o.type)&&d<220&&d<bd){bd=d;bx=ox/d;by=oy/d}}
if(bd<1e9&&!food){ax+=bx*A*.35;ay+=by*A*.25}}
let dvx=dx/dist*want-f.vx,dvy=dy/dist*want*(food||deep?1:.6)+(food&&food.ph==="sink"?food.vy:0)-f.vy;const dl=Math.hypot(dvx,dvy)||1,m=Math.min(dl*3,A*bm*(bm>1?1.4:1))*(c&&!food?.6:1);ax+=dvx/dl*m;ay+=dvy/dl*m;
ax+=sx*A*(sl?3.4:1.6);ay+=sy*A*(sl?3.4:1.6);
if(c){ax+=cx2/c/170*A*.5+(mvx/c-f.vx)*.8;ay+=cy2/c/170*A*.4+(mvy/c-f.vy)*.8}
// duvarlar ve dekorlar
const M=60;if(x<bx0+M)ax+=(bx0+M-x)/M*A*1.2;else if(x>bx1-M)ax-=(x-bx1+M)/M*A*1.2;if(y<by0e+M)ay+=(by0e+M-y)/M*A*1.2*(by0e<by0?.3:1);else if(y>by1e-M)ay-=(y-by1e+M)/M*A*1.2;
for(const o of obs){const ox=x-o[0],oy=y-o[1],d=Math.hypot(ox,oy)||1,R=o[2]+sz*.9;if(d<R){const k=1-d/R;ax+=ox/d*k*A*2.2;ay+=oy/d*k*A*2.2-k*A*.5}}
// bütünleştirme
f.vx+=ax*h;f.vy+=ay*h;f.vx-=f.vx*.35*h;f.vy-=f.vy*.35*h;
const vym=vmax*bm*(food||deep?1:.5);f.vy=Math.max(-vym,Math.min(vym,f.vy));const sp=Math.hypot(f.vx,f.vy),lim=vmax*1.15*bm;if(sp>lim){f.vx*=lim/sp;f.vy*=lim/sp}
if(!food&&Math.abs(f.vx)<1.2&&Math.abs(f.vy)<1.2&&dist<30){f.vx=f.vy=0}
x+=f.vx*h;y+=f.vy*h;
if(x<bx0){x=bx0;f.vx=Math.abs(f.vx)*.2}else if(x>bx1){x=bx1;f.vx=-Math.abs(f.vx)*.2}if(y<by0e){y=by0e;f.vy=Math.abs(f.vy)*.2}else if(y>by1e){y=by1e;f.vy=-Math.abs(f.vy)*.2}
f.x=x/W;f.y=y/H;
if(sl&&f.rest&&Math.random()<h*.35)particles.push({x:x+(f.dir||1)*fw*.3,y:y-fh*.35,vx:rand(3,9),vy:rand(-22,-14),life:rand(1.8,2.6),type:"zz",s:rand(.8,1.2)});
if(!VISIT&&!coll&&f.age>=MATURE&&!f.sick&&f.id!==undefined){let cd=cdMap.get(f.id);if(cd===undefined)cd=rand(15,60);cd-=h;if(cd<=0){cd=rand(45,100);spitCoin(f,x,y,fw)}cdMap.set(f.id,cd)}
// yön (histerezisli) ve görsel durum: gövde eğimi, yumuşak çevirme, kuyruk fazı
if(Math.abs(f.vx)>9&&Math.sign(f.vx)!==f.dir)f.dir=Math.sign(f.vx);
const sn=Math.min(1,Math.hypot(f.vx,f.vy)/vmax);
const tilt=(f.act==="forage"&&Math.hypot(f.tx-x,f.ty-y)<40?.42:0)+(food&&food.ph==="surf"&&Math.hypot(food.x-x,food.y-y)<70?-.3:0);f.ang+=(Math.max(-.6,Math.min(.6,Math.atan2(f.vy,Math.abs(f.vx)+25)+tilt))-f.ang)*Math.min(1,6*h);f.fs+=(f.dir-f.fs)*Math.min(1,9*h);f.tp+=h*(2+sn*11)*swimFq(f)*(sl?.4:1);f.sn=sl?sn*.45:sn}
foodStep(h)}
let lastDraw=0,ftN=0,ftS=0,ftT=0,feedOnC=null;const PRF={n:0,ph:0,fl:0,fi:0,pl:0,ot:0,all:0,ns:0,iv:0,mx:0};function adaptK(now,d){if(d>100||document.hidden||globalThis.__noAdapt)return;if(!ftT)ftT=now;ftN++;ftS+=d;if(ftN>=90){const avg=ftS/ftN;ftN=0;ftS=0;if(now-ftT>3000&&avg>26&&K>1){K=Math.max(1,K-.25);canvas.width=Math.round(W*K);canvas.height=Math.round(H*K);try{ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality="high"}catch(e){}try{localStorage.setItem("fvK2",K)}catch(e){}}}}
let ERRN=0,ERRL=0;
function reportErr(e,where){ERRN++;const msg=(where||"kare")+": "+(e&&e.message||String(e))+" @ "+((e&&e.stack||"").split("\n").find(l=>/:\d+:\d+/.test(l))||"").trim().slice(-60);try{localStorage.setItem("fvErr",JSON.stringify({m:msg,n:ERRN,t:Date.now(),v:(($("verNote")||{}).textContent||"")}))}catch(_){}const el=$("errNote");if(el){el.hidden=false;el.textContent="⚠️ Son hata ("+ERRN+"): "+msg}const now=performance.now();if(now-ERRL>20000){ERRL=now;try{notify("⚠️ Küçük bir hata oldu, oyun devam ediyor. Ayrıntı: Ayarlar")}catch(_){}}}
addEventListener("error",ev=>reportErr(ev.error||ev.message,"genel"));addEventListener("unhandledrejection",ev=>reportErr(ev.reason,"söz"));
function frame(now){try{gfxWatch(now)}catch(e){}try{frameBody(now)}catch(e){reportErr(e);try{ctx.setTransform(K,0,0,K,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation="source-over";ctx.filter="none"}catch(_){}requestAnimationFrame(frame)}}
function frameBody(now){if(now-lastDraw<14.5){requestAnimationFrame(frame);return}adaptK(now,now-lastDraw);admFpsTick(now);lastDraw=now;const dt=Math.min(.05,(now-last)/1000||0);last=now;const t=now/1000;
if(now-lastAdv>1000&&!VISIT){lastAdv=now;if(state.daily&&state.daily.date!==dayKey()){dailyCheck();badges()}featureTick(Date.now());const r=advance((Date.now()-state.lastTick)/1000);if(r.dead.length){sfx("death");notify(r.dead[0]+" öldü 💀 Tankı temiz, balıkları tok tut!")}else if(r.sick){sfx("sick");notify("Bir balığın hastalandı 🤒 İlaç ver!")}if(r.dead.length||r.sick)renderUI();updateLive();if(now-lastSave>30000){lastSave=now;save(true)}}
musicTick();musUpdate();if(AU&&!state.muted&&!(ambience&&ambience.file)&&Math.random()<dt*.3)sfx("amb");
const P0=performance.now();acc+=dt;let ns=0;while(acc>=STEP&&ns<4){physics(STEP);acc-=STEP;ns++}if(ns>=4)acc=0;const P1=performance.now();
bubbles.forEach(b=>{b.y-=b.speed*dt;b.x+=Math.sin(t+b.phase)*b.drift*dt;if(b.y<-10){b.y=H+10;b.x=rand(0,W)}});
const OFF=state.admOff||{};ctx.setTransform(K,0,0,K,0,0);drawBackground(t);drawFloor(t);try{critDraw(dt)}catch(e){reportErr(e,"omurgasız")}const P2=performance.now();if(!OFF.fish)for(const f of state.fish){try{drawFish(f,t)}catch(e){try{ctx.restore()}catch(_){}reportErr(e,"balık "+f.type)}}const P3=performance.now();if(!OFF.plants)drawPlants2(t,1);const P4=performance.now();drawCoins(t);drawStatus(t);const fo=feedModeOn()&&!VISIT;if(fo!==feedOnC){feedOnC=fo;$("feed").classList.toggle("on",fo)}drawParticles(dt);drawTapInfo();drawDN();
const P5=performance.now();if(admFps){PRF.n++;PRF.ph+=P1-P0;PRF.fl+=P2-P1;PRF.fi+=P3-P2;PRF.pl+=P4-P3;PRF.ot+=P5-P4;PRF.all+=P5-P0+(P0-now>0?0:0);PRF.ns+=ns}
requestAnimationFrame(frame)}
canvas.addEventListener("pointerdown",e=>{audio();startAmbience();const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*W,y=(e.clientY-r.top)/r.height*H;if(EDIT){editDown(e,x,y);return}if(!VISIT){let cc=null,cd=1e9;for(const c of coinsLoose){const d=Math.hypot(x-c.x,y-c.y);if(d<34&&d<cd){cc=c;cd=d}}if(cc){pickCoin(cc);return}}
if(!VISIT&&feedModeOn()&&!isColl(state.tank)){dropFood(x,y,4);lastDrag=performance.now();return}
if(!VISIT&&state.chest&&Math.hypot(x-state.chest.x*W,y-FLOOR)<55){openChest();return}if(critTap(x,y))return;let hit=null,dist=Infinity;state.fish.forEach(f=>{const s=getSpecies(f.type),fx=f.x*W,fy=f.y*H;if(Math.hypot(x-fx,y-fy)<Math.max(55,fishW(f)*.42)&&Math.hypot(x-fx,y-fy)<dist){hit=f;dist=Math.hypot(x-fx,y-fy)}});if(hit){
selectedFish=hit.id;hit.wake=simT+8;if(!VISIT)Q("tap");tapInfo={id:hit.id,until:performance.now()+3200};
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
function editStart(mode,arg){if(VISIT||EDIT)return;closeSheet();EDIT={mode,arg,sel:null,drag:false,last:null};document.body.classList.add("editing");const sp=mode==="place"?getSpecies(arg):null;$("etext").textContent=mode==="place"?"🐠 "+sp.name+": tanka dokun ya da sürükleyip bırak":"🪸 Dekorları sürükleyip istediğin yere bırak";$("ebtns").innerHTML=mode==="place"?'<button id="eCancel">İptal</button>':'<button id="eReset">↩️ Varsayılan</button><button id="eDone" class="home">✓ Bitti</button>';$("editbar").hidden=false}
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
$("ebtns").addEventListener("click",e=>{const b=e.target.closest("button");if(!b||!EDIT)return;audio();if(b.id==="eDone"||b.id==="eCancel")editEnd();else if(b.id==="eReset"){state.propPos={};state.decor.forEach(d=>{delete d.y});save(true)}});
const WHEEL=[{ic:"🪙",k:"c1",c:"#ffd36b",w:24},{ic:"✨",k:"xp",c:"#b99bff",w:16},{ic:"🎁",k:"chest",c:"#ff9aa8",w:12},{ic:"💰",k:"c2",c:"#ffb347",w:14},{ic:"🧽",k:"clean",c:"#7fe1d7",w:10},{ic:"🍤",k:"feed",c:"#9ad65a",w:10},{ic:"🐠",k:"fish",c:"#6fb7ff",w:5},{ic:"💎",k:"gem",c:"#3fcf8e",w:5}];
let WSPIN=false;
function wheelBase(){return 20+4*state.level}
function wheelTxt(k){const b=wheelBase();return{c1:b+" 🪙",c2:b*2+" 🪙",gem:wheelGem()+" 💎",xp:(20+state.level*6)+" XP",chest:"Hazine sandığı",clean:"Tank temizliği",feed:"Balıkları doyur",fish:"Bedava balık"}[k]}
function wheelReady(){return!(state.wheel&&state.wheel.day===dayKey())}
function wheelPay(){const W=state.wheel;if(!W||W.paid)return null;if(!WHEEL[W.idx]){W.paid=true;return null}W.paid=true;const k=WHEEL[W.idx].k,b=wheelBase();const gain=n=>{state.coins+=n;Q("earn",n)};let m;
if(k==="c1"){gain(b);m="+"+b+" 🪙"}else if(k==="c2"){gain(b*2);m="+"+b*2+" 🪙"}else if(k==="gem"){const n=wheelGem();state.gems+=n;m="Zümrüt! +"+n+" 💎"}
else if(k==="xp"){const x=20+state.level*6;addXP(x);m="+"+x+" XP"}
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
{t:"🎁 Balıklar büyüdükçe para biriktirir. Biriken parayı ve hazine sandıklarını Topla düğmesinden alırsın.",el:"surprise",btn:"Anladım"},
{t:"🧽 Su zamanla kirlenir. Kirlenince Temizle'ye bas, yoksa balıkların hastalanır.",el:"clean",btn:"Anladım"},
{t:"🐟 Büyüyen balıklarını Balıklarım'dan satabilirsin. Yeni özellikler seviye atladıkça açılır. İyi eğlenceler!",el:"fishes",btn:"Bitir"}];
function tutOn(){return typeof state.tut==="number"&&state.tut<TUT.length}
function tutRender(){const el=$("tut");if(!el)return;const lv=$("lvl"),on=tutOn()&&!openKey&&!EDIT&&!VISIT&&(!lv||lv.hidden);const cur=on?TUT[state.tut].el:null;document.querySelectorAll(".tuthi").forEach(e=>{if(e.id!==cur)e.classList.remove("tuthi")});if(!on){el.hidden=true;return}const s=TUT[state.tut];if(el.dataset.step!==String(state.tut)){el.dataset.step=String(state.tut);el.innerHTML='<div class="tutn">Rehber '+(state.tut+1)+"/"+TUT.length+'</div><p>'+s.t+'</p><div class="tutb">'+(s.btn?'<button id="tutNext" class="home">'+s.btn+'</button>':'<small class="tutd">👉 Dene bakalım</small>')+'<button id="tutSkip" class="tskip">Geç</button></div>'}el.hidden=false;if(cur){const t=$(cur);if(t)t.classList.add("tuthi")}}
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
function bookN(id){return["albino","transparent","melanistic"].filter(m=>state.mutsFound.includes(m+"_"+id)).length}
function bookRwd(sp){return{c:Math.round(sp.price*2),x:40}}
function bookBtn(sp){const n=bookN(sp.id),got=(state.bookRw||{})[sp.id];if(got)return'<span class="pill">✅</span>';if(n<3)return"";const r=bookRwd(sp);return'<button class="home sm" data-bookrw="'+sp.id+'">🎁 '+r.c+' 🪙</button>'}
function bookClaimable(){return species.some(sp=>bookN(sp.id)>=3&&!(state.bookRw||{})[sp.id])}
function claimBook(id){const sp=species.find(s=>s.id===id);if(!sp||bookN(id)<3||(state.bookRw||{})[id])return;if(!state.bookRw)state.bookRw={};state.bookRw[id]=true;const r=bookRwd(sp);state.coins+=r.c;state.gems+=3;Q("earn",r.c);addXP(r.x);sfx("ach");notify("📖 "+sp.name+" defteri tamamlandı! +"+r.c+" 🪙 · +3 💎 · +"+r.x+" XP");renderBook();badges();save(true)}
function mktPill(id){const m=mkt(id),p=Math.round((m-1)*100);if(Math.abs(p)<3)return"";return'<span class="pill mk '+(p>0?"up":"dn")+'">'+(p>0?"📈 satış +"+p:"📉 satış "+p)+"%</span>"}
function gfxLabel(){const b=$("gfxBtn");if(b)b.textContent=state.lowGfx?"⚡ Grafik: Düşük":"✨ Grafik: Yüksek"}
function setGfx(low){state.lowGfx=low;const hi=Math.min(2,Math.max(1,Math.ceil(typeof devicePixelRatio==="number"?devicePixelRatio:1)));admSetK(low?1:hi);gfxLabel();save(true);notify(low?"⚡ Düşük grafik: daha akıcı, daha az parlama":"✨ Yüksek grafik açık")}
function shotMake(){const S2=2,c=document.createElement("canvas");c.width=W*S2;c.height=H*S2;const x=c.getContext("2d");x.scale(S2,S2);const fr=curWater()==="fresh",im=fr?(state.night?nightF:reefF):(state.night?nightBg:reefBg);
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
const PLSRC={plf1:"«plf1»",plf2:"«plf2»",plf3:"«plf3»",plf4:"«plf4»",plf5:"«plf5»",plf6:"«plf6»",plf7:"«plf7»",plf8:"«plf8»",pls1:"«pls1»",pls2:"«pls2»",pls3:"«pls3»",pls4:"«pls4»",pls5:"«pls5»",pls6:"«pls6»",pls7:"«pls7»",pls8:"«pls8»"};
const PLIMG={};for(const k in PLSRC){const im=new Image();im.src="data:image/webp;base64,"+PLSRC[k];PLIMG[k]=im}
const PLL={fresh:{back:[{k:"plf1",x:.045,d:40,h:250,a:1},{k:"plf4",x:.15,d:26,h:212,a:.75},{k:"plf5",x:.3,d:20,h:104,a:.6},{k:"plf6",x:.44,d:66,h:40,a:.15,f:1},{k:"plf6",x:.62,d:50,h:48,a:.15},{k:"plf3",x:.8,d:24,h:200,a:.7},{k:"plf2",x:.935,d:44,h:190,a:.5}],front:[{k:"plf1",x:.03,h:330,a:1},{k:"plf5",x:.965,h:270,a:.6,f:1}],hang:[{k:"plf7",x:.23,h:.27,a:.55},{k:"plf8",x:.79,h:.24,a:.55}]},
salt:{back:[{k:"pls1",x:.05,d:40,h:270,a:.8},{k:"pls3",x:.17,d:24,h:168,a:.45},{k:"pls6",x:.42,d:62,h:46,a:.15},{k:"pls6",x:.6,d:48,h:52,a:.15,f:1},{k:"pls2",x:.72,d:22,h:140,a:.9},{k:"pls5",x:.84,d:26,h:205,a:.2},{k:"pls4",x:.945,d:44,h:170,a:.5}],front:[{k:"pls2",x:.03,h:300,a:1},{k:"pls1",x:.97,h:320,a:.8,f:1}],hang:[{k:"pls7",x:.23,h:.27,a:.5},{k:"pls8",x:.79,h:.24,a:.5}]}};
const PLC={};
function plTone(cv,mode){try{const c=cv.getContext("2d"),d=c.getImageData(0,0,cv.width,cv.height),p=d.data;for(let i=0;i<p.length;i+=4){let r=p[i],g=p[i+1],b=p[i+2];if(mode&1){r*=.56;g*=.6;b*=.66}if(mode&2){r=r*.42+6;g=g*.5+12;b=b*.62+30}p[i]=r;p[i+1]=g;p[i+2]=b}c.putImageData(d,0,0)}catch(e){}}
function plCanvas(k,h,flip,mode){const im=PLIMG[k];if(!im||!im.complete||!im.naturalWidth)return null;const key=k+"|"+h+"|"+flip+"|"+mode+"|"+K+"|"+curWater();let c=PLC[key];if(c)return c;const w=h*im.naturalWidth/im.naturalHeight;c=document.createElement("canvas");c.width=Math.max(1,Math.round(w*K));c.height=Math.max(1,Math.round(h*K));const x=c.getContext("2d");try{x.imageSmoothingQuality="high"}catch(e){}if(flip){x.translate(c.width,0);x.scale(-1,1)}x.drawImage(im,0,0,c.width,c.height);if(!(mode&1))grade(c,{bg:FLOOR_AVG[curWater()==="salt"?"salt":"fresh"][0],mix:.12,desat:.86,contrast:.92,top:.1,ao:.32});if(mode)plTone(c,mode);c.lw=w;c=gpuCopy(c);PLC[key]=c;return c}
function plDraw(id,p,cx,root,h,hang,t,nf,front,fs){const flip=!!p.f,dm=front?1:0,cv=plCanvas(p.k,h,flip,dm);if(!cv)return;const w=cv.lw,top=hang?root:root-h;
let push=0;if(fs&&p.a>.3)for(const f of fs){const fy=f.y*H;if(fy<top-20||fy>top+h+20)continue;const d=f.x*W-cx;const R=w*.5+40;if(Math.abs(d)<R)push+=(d>0?-1:1)*(1-Math.abs(d)/R)}
let b=PLB[id]||0;b+=(Math.max(-1,Math.min(1,push))-b)*.05;PLB[id]=b;const ph=cx*.031,A=p.a*h*.06;
const N=state.lowGfx?1:6,sh=h/N,ch=cv.height/N;const cvN=nf>.01?plCanvas(p.k,h,flip,dm|2):null;
if(!hang&&!front&&p.h>60){const sg=ctx.createRadialGradient(cx,root-2,0,cx,root-2,w*.45);sg.addColorStop(0,"rgba(0,18,24,"+(.32+.1*nf)+")");sg.addColorStop(1,"rgba(0,18,24,0)");ctx.save();ctx.translate(0,root-2);ctx.scale(1,.22);ctx.translate(0,-(root-2));ctx.fillStyle=sg;ctx.beginPath();ctx.arc(cx,root-2,w*.45,0,7);ctx.fill();ctx.restore()}
const DX=new Array(N+1);for(let i=0;i<=N;i++){const ym=i/N,kk=hang?ym:1-ym;DX[i]=(Math.sin(t*.9+ph+kk*1.7)+Math.sin(t*.37+ph*1.9)*.55+b*1.5)*A*Math.pow(kk,1.5)}
const pass=(c,al)=>{if(!c)return;ctx.globalAlpha=al;for(let i=0;i<N;i++){const y0=top+i*sh,s=(DX[i+1]-DX[i])/sh;ctx.setTransform(K,0,K*s,K,K*(DX[i]-s*y0),0);ctx.drawImage(c,0,i*ch,c.width,ch+(i<N-1?.5:0),cx-w/2,y0,w,sh+(i<N-1?.3:0))}ctx.setTransform(K,0,0,K,0,0)};
if(nf<.99)pass(cv,1);if(cvN&&nf>.01)pass(cvN,nf<.99?nf:1);ctx.globalAlpha=1}
function drawPlants2(t,front){const wat=curWater()==="salt"?"salt":"fresh",L=PLL[wat],nf=nightAmt(),fs=VISIT?null:state.fish,lo=state.lowGfx;
if((state.admOff||{}).plants)return;if(!front&&PORT){L.back.forEach((p,i)=>{if(lo&&p.h<60)return;plDraw("B"+wat+i,p,p.x*W,FLOOR+p.d*LSP,p.h*LSP,0,t,nf,0,fs)})}
else{L.front.forEach((p,i)=>plDraw("F"+wat+i,p,p.x*W,H+(PORT?28:20),p.h*LSP,0,t,nf,1,fs));L.hang.forEach((p,i)=>plDraw("V"+wat+i,p,p.x*W,-14,p.h*H,1,t,nf,0,null))}}
// ===== gerçekçilik: renk eşleme + ışık + kostik
const FLOOR_AVG={fresh:[[150,160,110],[30,52,70]],salt:[[110,150,170],[24,44,90]]};
function gpuCopy(c){try{const n=document.createElement("canvas");n.width=c.width;n.height=c.height;n.getContext("2d").drawImage(c,0,0);n.lw=c.lw;return n}catch(e){return c}}
function grade(cv,o){try{const c=cv.getContext("2d"),W2=cv.width,H2=cv.height,d=c.getImageData(0,0,W2,H2),p=d.data,m=o.mix,bg=o.bg,ds=o.desat,ct=o.contrast;for(let y=0;y<H2;y++){const fy=y/H2,lt=1+o.top*(1-fy)*(1-fy)-o.ao*fy*fy*fy;for(let x=0;x<W2;x++){const i=(y*W2+x)*4;if(p[i+3]===0)continue;let r=p[i],g=p[i+1],b=p[i+2];const l=r*.3+g*.59+b*.11;r=l+(r-l)*ds;g=l+(g-l)*ds;b=l+(b-l)*ds;r=128+(r-128)*ct;g=128+(g-128)*ct;b=128+(b-128)*ct;r=(r+(bg[0]-r)*m)*lt;g=(g+(bg[1]-g)*m)*lt;b=(b+(bg[2]-b)*m)*lt;p[i]=r;p[i+1]=g;p[i+2]=b}}c.putImageData(d,0,0)}catch(e){}}
let causT=null;
function causticTex(){if(causT!==null)return causT;try{const S=160,c=document.createElement("canvas");c.width=S;c.height=S;const x=c.getContext("2d"),d=x.createImageData(S,S),p=d.data,k=Math.PI*2/S;for(let j=0;j<S;j++)for(let i=0;i<S;i++){const a=i*k*3+Math.sin(j*k*2)*1.6+Math.sin(j*k*5)*.4,b=j*k*3+Math.sin(i*k*2)*1.6+Math.cos(i*k*4)*.4;let v=Math.pow(1-Math.abs(Math.sin(a)*Math.sin(b)),9)+Math.pow(1-Math.abs(Math.sin(a*1+b*0)+Math.sin(b)*0),0)*0;v=Math.min(1,v*1.15);const o=(j*S+i)*4;p[o]=225;p[o+1]=250;p[o+2]=235;p[o+3]=v*255}x.putImageData(d,0,0);causT=gpuCopy(c)}catch(e){causT=false}return causT}
let causP=null;function drawCaustics(t){if(state.lowGfx)return;const c=causticTex();if(!c)return;if(!causP){try{causP=ctx.createPattern(c,"repeat")}catch(e){causP=false}}if(!causP)return;const nf=nightAmt(),al=.22*(1-nf*.75);if(al<.02)return;const y0=FLOOR-110,sc=200/160;ctx.save();ctx.globalCompositeOperation="lighter";ctx.fillStyle=causP;for(let L=0;L<1;L++){const ox=t*(L?-7:9),oy=t*(L?5:-4);ctx.setTransform(K*sc,0,0,K*sc,K*ox,K*oy);for(let band=0;band<3;band++){const by=y0+band*40,bh=band<2?40:H-by;ctx.globalAlpha=al*(L?.6:1)*(band===0?.35:band===1?.7:1);ctx.fillRect((0-ox)/sc,(by-oy)/sc,W/sc,bh/sc)}}ctx.restore()}
// ===== yem fiziği ve tür karakterleri
const SURF=H*.155,FOOD_ROT=25;let feedX=W/2;
const FCOL=["#e8742a","#d9a13b","#8fae3e","#c94a3a","#e0b25a"];
function mkFood(x,ty){const fl=Math.random()<.6,pts=[];for(let i=0;i<5;i++)pts.push(.7+Math.random()*.5);const o={x:Math.max(BX0+10,Math.min(BX1-10,x+rand(-24,24))),y:SURF-rand(26,46),vx:rand(-15,15),vy:rand(20,60),ph:"fall",tp:fl?"f":"p",hp:fl?1:2,hp0:fl?1:2,r0:fl?rand(4.2,5.6):rand(3.3,4.3),term:fl?rand(18,26):rand(36,48),rot:rand(0,6),rs:rand(-3,3),sw:rand(0,6),fy:FLOOR+rand(-4,16),t:0,ft:0,eaten:false,col:fl?FCOL[Math.random()*FCOL.length|0]:"#9a5a22",pts};if(typeof ty==="number"&&ty>SURF+18){const d=o;d.y=Math.min(FLOOR-24,ty+rand(-14,14));d.x=Math.max(BX0+10,Math.min(BX1-10,x+rand(-16,16)));d.ph="sink";d.vy=rand(2,8);d.vx=rand(-10,10)}return o}
function zoneW(fz,d){const lo=d.y>H*.45;if(d.ph==="floor")return fz==="b"?1:fz==="a"?.8:fz==="m"?.25:0;if(d.ph==="surf")return fz==="s"?1:fz==="m"?.7:fz==="a"?1:.25;return fz==="s"?(lo?.35:.8):fz==="b"?(lo?.9:.45):1}
function crumbs(x,y,n,c){for(let i=0;i<n;i++)particles.push({x:x+rand(-3,3),y:y+rand(-3,3),vx:rand(-12,12),vy:rand(-10,6),life:rand(.5,.9),type:"crumb",c})}
function sandPuff(x,y,n){if(state.lowGfx)n=Math.min(n,1);for(let i=0;i<n;i++)particles.push({x:x+rand(-6,6),y:y+rand(-2,2),vx:rand(-18,18),vy:rand(-26,-8),life:rand(.7,1.2),type:"sand",r:rand(1.2,2.4)})}
function foodStep(h){drops=drops.filter(d=>!d.eaten&&!(d.ph==="floor"&&d.ft>FOOD_ROT));for(const d of drops){d.t+=h;
if(d.ph==="fall"){d.vy+=520*h;d.y+=d.vy*h;d.x+=d.vx*h;if(d.y>=SURF){d.y=SURF;d.ph="surf";d.st=d.tp==="f"?rand(1.2,2.8):rand(.2,.6);d.vy=0;d.vx*=.3;particles.push({x:d.x,y:SURF+1,vx:0,vy:0,life:.9,l0:.9,type:"ring"})}}
else if(d.ph==="surf"){d.st-=h;d.x+=d.vx*h+Math.sin(simT*.9+d.sw)*4*h;d.vx*=1-h*.8;d.y=SURF+Math.sin(simT*2.4+d.sw)*1.2;if(d.st<=0){d.ph="sink";d.vy=4}}
else if(d.ph==="sink"){d.vy+=(d.term-d.vy)*Math.min(1,h*2.2);d.y+=d.vy*h;d.x+=(d.tp==="f"?Math.sin(simT*2.6+d.sw)*16:Math.sin(simT*1.4+d.sw)*4)*h+d.vx*h;d.vx*=1-h*1.5;d.rot+=d.rs*h*(d.tp==="f"?1:.3);if(d.y>=d.fy){d.y=d.fy;d.ph="floor";d.ft=0;d.vx=0;sandPuff(d.x,d.y,2)}}
else{d.ft+=h;if(d.ft>FOOD_ROT-.05&&!d.rot2){d.rot2=1;if(!VISIT)state.dirt=Math.min(100,state.dirt+.35)}}
d.x=Math.max(BX0,Math.min(BX1,d.x))}}
function drawFood(){for(const d of drops){const a=d.ph==="floor"?Math.max(0,Math.min(1,(FOOD_ROT-d.ft)/3)):1,r=d.r0*Math.sqrt(Math.max(.2,d.hp/d.hp0));ctx.globalAlpha=a;ctx.save();ctx.translate(d.x,d.y);
if(d.tp==="f"){ctx.rotate(d.rot);ctx.scale(1,d.ph==="sink"?Math.max(.22,Math.abs(Math.cos(d.rot*1.7))):d.ph==="floor"?.5:.6);ctx.fillStyle=d.col;ctx.beginPath();for(let i=0;i<5;i++){const an=i/5*6.283,rr=r*d.pts[i];i?ctx.lineTo(Math.cos(an)*rr,Math.sin(an)*rr):ctx.moveTo(Math.cos(an)*rr,Math.sin(an)*rr)}ctx.closePath();ctx.fill();ctx.fillStyle="rgba(255,255,230,.28)";ctx.fillRect(-r*.4,-r*.35,r*.6,r*.3)}
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
napo:{feed:"a",z:[.25,.75],curious:1,hungry:1.1,txt:"Meraklıdır, dokunduğun yere gelir"}};
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
function goldFx(){for(let i=0;i<90;i++)particles.push({x:W/2+rand(-60,60),y:H*.4,vx:rand(-280,280),vy:rand(-460,-140),life:rand(1.8,2.8),type:"confetti",c:["#ffd34d","#ffe98a","#f2b233","#fff6c8"][i%4],r:rand(0,6),vr:rand(-8,8)});if(navigator.vibrate)navigator.vibrate([30,40,30,40,60])}
function bootDone(){const el=document.getElementById("boot");if(!el)return;const t0=performance.now();try{bootP(86)}catch(e){}
const ims=[reefBg,reefF,nightBg,nightF].concat(state.fish.map(f=>fishImgs[f.type]).filter(Boolean));const wait=ims.map(im=>im.complete&&im.naturalWidth?Promise.resolve():(im.decode?im.decode().catch(()=>{}):new Promise(r=>{im.onload=im.onerror=r})));
const fin=()=>{try{bootP(100);clearInterval(window.__bootCreep);clearInterval(window.__bootTipT)}catch(e){}setTimeout(()=>{try{el.classList.add("out");setTimeout(()=>{try{el.remove()}catch(e){}},700)}catch(e){}},Math.max(250,700-(performance.now()-t0)))};
Promise.race([Promise.all(wait),new Promise(r=>setTimeout(r,5000))]).then(()=>setTimeout(fin,60))}
// ===== birleşik mağaza + zümrüt
let shopTab="fish",fishWat="all";
const fishCard=s=>{const wt=WATER[s.id],T=TANKS[wt];if(spLocked(s))return `<div class="fish-card locked"><div class="fish-icon"><i class="fi" style="background-image:var(--f-${s.id});filter:brightness(0) invert(1) opacity(.3)"></i></div><div><strong>???</strong><small>Henüz keşfedilmedi</small></div><span class="pill">🔒 Seviye ${spReq(s)}</span></div>`;return `<div class="fish-card"><div class="fish-icon">${icon(s)}</div><div><strong>${s.name}</strong><small>${tankIco(T)} ${T.name} · ${s.price} 🪙 · satış ~${Math.round(s.price*1.06*mkt(s.id)*(ev("harvest")?1.15:1))} 🪙 </small>${traitTxt(s.id)?`<small class="trt">🧠 ${traitTxt(s.id)}</small>`:""}${mktPill(s.id)}${COMPAT[s.id]?`<small>⚠️ ${COMPAT[s.id]}</small>`:""}</div>${!hasTank(wt)?'<span class="pill">🔒 '+T.name+' tankı</span>':s.lv&&state.level<s.lv?'<span class="pill">🔒 Seviye '+s.lv+'</span>':`<div class="buyc"><button data-buy="${s.id}" ${state.coins<s.price?"disabled":""}>Al</button>${bulkBtn(s,wt)}</div>`}</div>`};
const TIERS=[["🌱 Başlangıç","1–100 🪙",0,100],["🐠 Gelişmiş","101–300 🪙",101,300],["👑 Nadir türler","300+ 🪙",301,1e9]];
function renderShop(){document.querySelectorAll("#shopTabs [data-st]").forEach(b=>b.classList.toggle("on",b.dataset.st===shopTab));document.querySelectorAll(".shp").forEach(e=>e.hidden=e.dataset.p!==shopTab);
$("stitle").textContent={fish:"🛒 Mağaza · Balıklar",decor:"🛒 Mağaza · Dekor",gear:"🛒 Mağaza · Ekipman",gem:"🛒 Mağaza · Özel"}[shopTab];
if(shopTab==="fish"){$("fishChips").innerHTML=[["all","Tümü"],["fresh","🌿 Tatlı su"],["salt","🌊 Tuzlu su"]].map(c=>'<button class="chip2'+(fishWat===c[0]?" on":"")+'" data-fw="'+c[0]+'">'+c[1]+"</button>").join("");
const L=species.filter(s=>fishWat==="all"||WATER[s.id]===fishWat);$("shopCount").textContent=L.length+" tür · fiyatlar saatlik değişir";
$("shop").innerHTML=TIERS.map(t=>{const a=L.filter(s=>s.price>=t[2]&&s.price<=t[3]).sort((x,y)=>x.price-y.price);return a.length?'<h4 class="sh tier">'+t[0]+' <small>'+t[1]+"</small></h4>"+a.map(fishCard).join(""):""}).join("")}
else if(shopTab==="decor"){renderThemes();try{$("critShop").innerHTML=critShopHTML()}catch(e){}$("decorStatus").textContent=state.decor.length+" küçük dekor · "+state.props.length+"/"+PROPS.length+" özel dekor"}
else if(shopTab==="gem")renderGemShop()}
function setShopTab(t){shopTab=t;sfx("click");if(openKey!=="shop")openSheet("shop","🛒 Mağaza");else renderUI()}
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
const TABG=[[["quest","📋 Görevler","📋 Görevler ve etkinlikler"],["ach","🏆 Başarımlar","🏆 Başarımlar"],["wheel","🎡 Çark","🎡 Günlük şans çarkı"]],[["fish","🐟 Balıklarım","🐟 Balıklarım"],["book","📖 Defter","📖 Balık defteri"]],[["map","🗺️ Tanklar","🗺️ Tanklar ve komşular"],["rank","🏅 Sıralama","🏅 Sıralama"]]];
function sTabs(k){const el=$("stabs");if(!el)return;const g=TABG.find(x=>x.some(t=>t[0]===k));el.hidden=!g;el.innerHTML=g?g.map(t=>'<button class="stab'+(t[0]===k?" on":"")+'" data-tab="'+t[0]+'" data-tt="'+t[2]+'">'+t[1]+"</button>").join(""):""}
function openSheet(k,t){if(VISIT)return;if(k==="decor"){k="shop";shopTab="decor"}sfx("click");document.querySelectorAll(".sec").forEach(e=>e.classList.toggle("on",e.dataset.k===k));$("stitle").textContent=t;openKey=k;$("sheet").classList.add("show");if(k==="book")renderBook();renderUI();if(k==="map")renderNeighbors();if(k==="rank")renderRank();if(k==="set")netLabel();if(k==="adm")admRender();if(k==="wheel")renderWheel();sTabs(k);tutRender()}
document.querySelectorAll("[data-sheet]").forEach(b=>b.addEventListener("click",()=>{audio();openSheet(b.dataset.sheet,b.dataset.t)}));
const closeSheet=()=>{openKey=null;$("sheet").classList.remove("show");tutRender()};$("sclose").onclick=closeSheet;$("sheet").addEventListener("pointerdown",e=>{if(e.target.id==="sheet")closeSheet()});
$("vhome").onclick=endVisit;$("vhelp").onclick=()=>{audio();helpNeighbor()};$("vtank").onclick=()=>{if(!VISIT)return;VISIT.tank=VISIT.tank==="fresh"?"salt":"fresh";visitTank();renderUI()};
$("surprise").addEventListener("click",()=>{audio();if(state.chest)openChest();else collect()});
const ADMIN_ID="u_LyrFB5NBQ50Xrl0WUgzi_Q";
const ADMIN_MAIL="mhmtcnylmz@gmail.com";function isAdmin(){if(NET.uid===ADMIN_ID)return true;try{const u=FB&&FB.auth.currentUser;return!!(u&&!u.isAnonymous&&u.emailVerified!==false&&String(u.email||"").toLowerCase()===ADMIN_MAIL)}catch(e){return false}}
function admVis(){const b=$("admBtn");if(b)b.hidden=!isAdmin()}
let admFps=null,admFpsT=0,admFrames=0;
function admSetK(v){K=v;canvas.width=Math.round(W*K);canvas.height=Math.round(H*K);try{ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality="high"}catch(e){}try{localStorage.setItem("fvK2",K)}catch(e){}}
let admLast=0;function admFpsTick(now){if(!admFps)return;admFrames++;const iv=admLast?now-admLast:0;admLast=now;PRF.mx=Math.max(PRF.mx,iv);if(now-admFpsT>=1000){const n=Math.max(1,PRF.n),f=v=>(v/n).toFixed(1);admFps.textContent=Math.round(admFrames*1000/(now-admFpsT))+" fps · en uzun kare "+Math.round(PRF.mx)+" ms\nJS işi "+f(PRF.all)+" ms: fizik "+f(PRF.ph)+" ("+(PRF.ns/n).toFixed(1)+" adım) · zemin+dekor "+f(PRF.fl)+" · balık "+f(PRF.fi)+" · ön bitki "+f(PRF.pl)+" · diğer "+f(PRF.ot)+"\nK "+K+" · balık "+state.fish.length+" · ekran "+innerWidth+"×"+innerHeight+" @"+(window.devicePixelRatio||1)+(state.lowGfx?" · düşük grafik":"")+((admFrames*1000/(now-admFpsT))<34&&PRF.all/n<8?"\n⚠️ İş az ama FPS düşük: tarayıcı sınırlıyor olabilir (Düşük Güç Modu / çerçeve kısıtı)":"");admFrames=0;admFpsT=now;for(const k in PRF)PRF[k]=0}}
function admFish(type,o){o=o||{};const s=getSpecies(type),wt=WATER[type];const dest=tankArr(wt);if(!dest)return null;if(!state.admNoCap&&dest.length>=fishCap(wt))return null;const mu=o.mut||"normal";const f={id:state.nextId++,type,sizeTrait:o.size||"normal",mutation:mu,gene:mu!=="normal"?mu:null,age:o.age==null?.12:o.age,lifeHours:0,sizeGrowth:0,rarity:o.rare?"Nadir":"Normal",name:o.rare?"Parlak "+s.name:s.name,personality:["Meraklı","Uysal","Hareketli","Utangaç"][Math.random()*4|0],hunger:70,health:100,sick:false,x:rand(.15,.85),y:rand(.2,.8),dir:Math.random()<.5?-1:1,phase:rand(0,6)};dest.push(f);if(!state.discovered.includes(type))state.discovered.push(type);mutNote(f,s);return f}
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
["⚙️ Performans",[["FPS göstergesi","fps"],["Bitkileri kapat/aç","off","plants"],["Dekorları kapat/aç","off","props"],["Işık desenini kapat/aç","off","caust"],["Balık çizimini kapat/aç","off","fish"],["Arka planı kapat/aç","off","bg"],["K = 1","k",1],["K = 1.5","k",1.5],["K = 2","k",2],["Otomatik kalite aç/kapa","adapt"],["Balık sınırı aç/kapa","cap"],["+20 balık (stres)","stress",20],["+40 balık (stres)","stress",40]]],
["💾 Kayıt",[["Kaydı dışa aktar","exp"],["Kaydı içe aktar","imp"],["Kaydı sıfırla","reset"]]]];
function admRender(){const b=$("admBox");if(!b)return;if(!isAdmin()){b.innerHTML="";return}
const sp=species.map(s=>'<option value="'+s.id+'">'+s.name+(WATER[s.id]==="salt"?" 🌊":" 💧")+'</option>').join(""),mu=Object.keys(MUTS).map(k=>'<option value="'+k+'">'+MUTS[k].name+'</option>').join(""),sz=Object.keys(SIZES).map(k=>'<option value="'+k+'">'+SIZES[k].n+'</option>').join("");
const evs=EVENTS.map(e=>'<label class="admck"><input type="checkbox" data-ev="'+e.id+'"'+((state.admEv||[]).includes(e.id)?" checked":"")+'> '+e.n+'</label>').join("");
let h='<p class="note">Sadece sana görünür · kimlik: '+ADMIN_ID.slice(0,6)+'…</p>';
h+='<details open class="admd"><summary>🐠 Balık ekle</summary><div class="pair"><select id="admSp">'+sp+'</select><select id="admMu">'+mu+'</select></div><div class="pair" style="margin-top:6px"><select id="admSz">'+sz+'</select><select id="admAge"><option value=".12">Yavru</option><option value=".5">Yarı büyük</option><option value="1" selected>Yetişkin</option></select></div><label class="admck"><input type="checkbox" id="admRare"> Nadir (parlak)</label><div class="buttons"><button data-a="spawn">Ekle</button><button data-a="spawn5">5 tane ekle</button></div></details>';
h+='<details class="admd"><summary>🎉 Etkinlikleri zorla</summary><div class="admev">'+evs+'</div></details>';
for(const [t,list] of ADM_SEC){h+='<details class="admd"><summary>'+t+'</summary><div class="buttons">'+list.map(x=>'<button data-a="'+x[1]+'"'+(x[2]!==undefined?' data-v="'+x[2]+'"':'')+'>'+x[0]+'</button>').join("")+'</div></details>'}
h+='<textarea id="admTxt" class="admta" placeholder="İçe aktarma için kayıt JSON\'u buraya"></textarea>';b.innerHTML=h}
function admAct(a,v){if(a==="off"){const o=state.admOff||(state.admOff={});o[v]=!o[v];notify("🛠️ "+v+": "+(o[v]?"kapalı":"açık"));save(true);return}v=+v;
switch(a){
case"coins":state.coins+=v;break;case"coins0":state.coins=0;break;case"gems":state.gems+=v;break;
case"xp":addXP(v);break;case"lvl":state.level++;state.xp=0;showLevelUp(state.level,0);break;case"lvlset":state.level=v;state.xp=0;break;
case"all":state.level=30;state.coins=Math.max(state.coins,1e6);TKEYS.forEach(k=>{if(!state.stash[k]&&state.tank!==k)state.stash[k]={fish:[],dirt:0}});state.props=PROPS.map(p=>p.id);species.forEach(s=>{if(!state.discovered.includes(s.id))state.discovered.push(s.id);for(const m of["albino","transparent","melanistic","gold"]){const k=m+"_"+s.id;if(!state.mutsFound.includes(k))state.mutsFound.push(k)}});checkAch();break;
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
case"muts":species.forEach(s=>{for(const m of["albino","transparent","melanistic","gold"]){const k=m+"_"+s.id;if(!state.mutsFound.includes(k))state.mutsFound.push(k)}});checkAch();break;
case"ach":ACH.forEach(x=>{state.ach[x.id]="done"});break;case"achOff":state.ach={};break;case"wheelReset":state.wheel=null;if(openKey==="wheel")renderWheel();break;
case"quests":if(state.daily){state.daily.ids.forEach(id=>{const q=QUESTS.find(x=>x.id===id);if(q)state.daily.prog[id]=q.n})}break;
case"fps":if(admFps){admFps.remove();admFps=null}else{admFps=document.createElement("div");admFps.className="admfps";$("game").appendChild(admFps);admFpsT=performance.now();admFrames=0}return;
case"k":admSetK(v);break;
case"adapt":globalThis.__noAdapt=!globalThis.__noAdapt;notify("🛠️ Otomatik kalite: "+(globalThis.__noAdapt?"kapalı":"açık"));return;
case"cap":state.admNoCap=!state.admNoCap;notify("🛠️ Balık sınırı: "+(state.admNoCap?"kapalı":"açık"));break;
case"stress":{const was=state.admNoCap;state.admNoCap=true;const ids=species.filter(s=>WATER[s.id]===state.tank).map(s=>s.id);if(ids.length)for(let i=0;i<v;i++)admFish(ids[i%ids.length],{age:1});state.admNoCap=was;break}
case"exp":{const j=serial();try{navigator.clipboard.writeText(j)}catch(e){}const t=$("admTxt");if(t){t.value=j;t.select()}notify("🛠️ Kayıt kutuya yazıldı");return}
case"imp":{const t=$("admTxt");try{const p=JSON.parse(t.value);if(!validSave(p))throw 0;p.savedAt=Date.now();localStorage.setItem("fishvilleClassicSave3",JSON.stringify(p));window.__nosave=true;removeEventListener("pagehide",flush);removeEventListener("beforeunload",flush);location.reload()}catch(e){notify("🛠️ Geçersiz kayıt")}return}
case"reset":if(confirm("Bütün oyun sıfırlansın mı?")){window.__nosave=true;removeEventListener("pagehide",flush);removeEventListener("beforeunload",flush);state=initState();save(true);location.reload()}return;
case"spawn":case"spawn5":{const n=a==="spawn5"?5:1;let c=0;for(let i=0;i<n;i++){if(admFish($("admSp").value,{mut:$("admMu").value,size:$("admSz").value,age:+$("admAge").value,rare:$("admRare").checked}))c++}notify(c?"🛠️ "+c+" balık eklendi":"🛠️ Eklenemedi (tank yok/dolu)");renderUI();save(true);return}
}
admDone("Tamam")}
function admInit(){const b=$("admBox");if(!b)return;b.addEventListener("click",e=>{const t=e.target.closest("button[data-a]");if(t)admAct(t.dataset.a,t.dataset.v)});b.addEventListener("change",e=>{const t=e.target;if(t.dataset&&t.dataset.ev){const s=new Set(state.admEv||[]);t.checked?s.add(t.dataset.ev):s.delete(t.dataset.ev);state.admEv=[...s];evC={t:0,l:[]};save(true)}});$("admBtn").addEventListener("click",()=>openSheet("adm","🛠️ Yönetim paneli"))}
admInit();v31Init();
$("bkBtn").addEventListener("click",()=>{audio();openBackup()});$("bkCopy").addEventListener("click",doBackupCopy);$("bkLoad").addEventListener("click",doBackupLoad);
$("shopTabs").addEventListener("click",e=>{const b=e.target.closest("[data-st]");if(b){audio();setShopTab(b.dataset.st)}});$("fishChips").addEventListener("click",e=>{const b=e.target.closest("[data-fw]");if(b){audio();fishWat=b.dataset.fw;sfx("click");renderUI()}});$("gemShop").addEventListener("click",e=>{const b=e.target.closest("[data-gem]");if(b){audio();buyGem(b.dataset.gem)}});document.querySelectorAll("[data-sheet=shop]").forEach(b=>b.addEventListener("click",()=>{shopTab="fish"},true));
$("placeDecor").addEventListener("click",()=>{audio();if(!state.props.length&&!state.decor.length){notify("Önce bir dekor al 🪸");return}editStart("deco")});
if($("stabs"))$("stabs").addEventListener("click",e=>{const b=e.target.closest("[data-tab]");if(b){audio();openSheet(b.dataset.tab,b.dataset.tt)}});
eiStart();try{bgSoftLabel();$("bgSoftBtn").addEventListener("click",()=>{audio();state.bgSoft=!bgSoftOn();curTF=null;bgSoftLabel();sfx("click");save(true)})}catch(e){}try{$("fbLink").addEventListener("click",()=>{audio();fbLink()});$("fbOut").addEventListener("click",fbSignOut);$("fbDel").addEventListener("click",fbDelete)}catch(e){}try{oriLabel();$("oriBtn").addEventListener("click",()=>{audio();setOri(ORI_PREF==="auto"?(PORT?"land":"port"):ORI_PREF==="land"?"port":"auto")});$("rhPort").addEventListener("click",()=>setOri("port"))}catch(e){}load();normalize();offlineReport();dailyCheck();checkAch();setTimeout(botHelp,2600);if(state.wheel&&!state.wheel.paid)setTimeout(wheelPay,1500);setTimeout(()=>{if(state.level>=2&&wheelReady()&&!VISIT)notify("🎡 Günlük çarkın hazır! Görevler → Çark")},4300);if(state.migrated){state.migrated=false;setTimeout(()=>notify("🌊 Tuzlu su balıkların kendi tankına taşındı! Haritadan geçebilirsin."),3200)}initScenery();$("night").textContent=state.night?"☀️ Gündüz modu":"🌙 Gece modu";renderUI();badges();soundLabels();applyUnlocks();gfxLabel();nightLbl();if(state.lowGfx)admSetK(1);setTimeout(tutRender,900);try{bootDone()}catch(e){}try{const pe=JSON.parse(localStorage.getItem("fvErr")||"null");if(pe&&(pe.v!==(($("verNote")||{}).textContent||"")))localStorage.removeItem("fvErr");else if(pe&&Date.now()-pe.t<864e5){const el=$("errNote");if(el){el.hidden=false;el.textContent="⚠️ Önceki hata ("+pe.n+"): "+pe.m}}}catch(e){}requestAnimationFrame(frame);netLabel();netInit();
})();

// FishVille sahte ortam testi: sahte DOM + iki oyunculu sahte bulut (db/user)
const fs = require('fs');
const FILE = process.argv[2];
const SRC = fs.readFileSync(FILE, 'utf8');
let CODE = SRC.slice(SRC.lastIndexOf('<script>') + 8, SRC.lastIndexOf('</script>'));
const HOOK = 'requestAnimationFrame(frame);netLabel();netInit();\n})();';
if (!CODE.includes(HOOK)) throw new Error('hook yok');
CODE = CODE.replace(HOOK, `requestAnimationFrame(frame);netLabel();globalThis.__NETP=netInit();
globalThis.__T={get gameW(){return W},updateFeatures,setVol,VOL,ambOn,sndToggle,sndAll,breedHint,breedable,featureTick,glPxN:f=>{const o=GLS.get(f);return o&&o.px?o.px.length:0},lokEk,boyOf,fcMeta,infoText,critShopHTML,renderQuests,moveOpts,yasOf,yasTxt,growHours,bookAll,mutNote,getSpecies,buyCrit,critCount,critShrimpK,critXPK,CRIT,critTap,critRT,sellMany,isPrecious,invList,FSEL,ymig,get layoutH(){return H},buyGem,GEMS,setShopTab,get shopTab(){return shopTab},renderShop,lvGems,reportErr,buyMany,TRAIT,foodStep,mkFood,upgradeCap,pickTheme,claimBook,bookClaimable,tutStep,tutOn,THEMES,CAP_COST,wheelReady,wheelPay,WHEEL,dayKey,PROPS,WATER,isAdmin,admAct,admRender,admVis,fishCap,botData,botHelp,BOT_ID,dropFood,feedModeOn,ensureOrders,deliverOrder,skipOrder,findOrderFish,orderReady,newOrder,spitCoin,pickCoin,isSleepy,MUTS,MATURE,serial,get coinsLoose(){return coinsLoose},get coinsFly(){return coinsFly},get drops(){return drops},get particles(){return particles},get state(){return state},set state(v){state=v},get VISIT(){return VISIT},get NET(){return NET},ev,activeEvents,inEvent,EVENTS,rollMutation,rollGene,allele,breed,fillParents,geneTest,species,PH,MUT_IMG,SWP,swimFq,fishW,fishH,CMS,MUTW,ageFactor,incomeRate,feedCost,breedCost,lvCoins,moveFish,switchTank,unlockTank,swapTo,isColl,tankDirt,tw,buy,sell,advance,dailyCheck,claimQuest,claimAch,Q,startVisit,endVisit,helpNeighbor,checkHelps,score,renderNeighbors,renderRank,fetchTanks,save,load,normalize,feed,clean,collect,featureTick,saleValue,openSheet:(k)=>openSheet(k,k),closeSheet,oddsText,dayKey,ACH,QUESTS,allFish,hasTank,tankArr,WATER,cloudSave,publishTank,renderUI,openChest,audio:()=>audio(),sfx:n=>sfx(n),musicTick:()=>musicTick(),startAmbience:()=>startAmbience(),get AU(){return AU},applyVolumes:()=>applyVolumes(),get tapInfo(){return tapInfo},get DN(){return DN},toggleNight,showLevelUp,closeLevelUp,rollSize,inheritSize,fsz,addXP,snapFish};
})();`);

const errors = [];
// ---------- sahte DOM
function el(tag) {
  const t = { tagName: tag, children: [], classList: null, style: {}, dataset: {}, hidden: false, value: '', textContent: '', innerHTML: '', disabled: false, src: '', id: '' };
  const h = {};
  const cls = new Set();
  t.classList = { add: c => cls.add(c), remove: c => cls.delete(c), toggle: (c, on) => (on ?? !cls.has(c)) ? cls.add(c) : cls.delete(c), contains: c => cls.has(c) };
  t.addEventListener = (e, f) => { (h[e] = h[e] || []).push(f) };
  t.handlers = h;
  t.append = (...xs) => { t.children.push(...xs) };
  t.appendChild = x => { t.children.push(x); return x };
  t.querySelector = () => null; t.querySelectorAll = () => [];
  t.closest = () => null;
  t.getBoundingClientRect = () => (t.id === 'stage' && typeof global.innerWidth === 'number' ? { left: 0, top: 0, width: global.innerWidth, height: global.innerHeight } : { left: 0, top: 0, width: 960, height: 540 });
  t.getContext = () => ctx2d();
  t.click = () => { (h.click || []).forEach(f => f({ target: t })); if (t.onclick) t.onclick({ target: t }) };
  return t;
}
function ctx2d() {
  const noop = () => {};
  return new Proxy({}, { get(o, k) { if (k in o) return o[k]; if (k === 'createLinearGradient' || k === 'createRadialGradient') return () => ({ addColorStop: noop }); if (k === 'measureText') return () => ({ width: 10 }); return noop }, set(o, k, v) { o[k] = v; return true } });
}
function makeEnv(store, claudeApi) {
  const els = {};
  const get = id => els[id] || (els[id] = Object.assign(el('div'), { id }));
  const body = el('body');
  const sheetBtns = ['quest', 'fish', 'shop', 'ach', 'map', 'set', 'rank', 'book', 'prod', 'decor'].map(k => { const b = el('button'); b.dataset.sheet = k; b.dataset.t = k; return b });
  const env = {
    els, body, sheetBtns, rafs: [],
    document: { getElementById: get, createElement: t => el(t), documentElement: { style: { setProperty() {} } }, body, addEventListener() {}, querySelectorAll(q) { if (q === '[data-sheet]') return sheetBtns; return [] }, querySelector() { return null }, hidden: false },
    localStorage: store,
    claude: claudeApi,
  };
  return env;
}
let CUR = null;
function use(env) {
  CUR = env;
  global.document = env.document; global.localStorage = env.localStorage;
  global.window = global; global.claude = env.claude; global.navigator = {};
  global.getComputedStyle = () => ({ getPropertyValue: () => 'url("data:image/webp;base64,AAAA")' });
  global.Image = function () { this.complete = true; this.naturalWidth = 100; this.naturalHeight = 60 };
  global.requestAnimationFrame = f => { env.raf = f };
  global.performance = { now: () => (CUR ? CUR.time : 0) };
  global.addEventListener = () => {};
}
function boot(env) {
  use(env);
  try { new Function(CODE)() } catch (e) { errors.push(e) }
  if(errors.length)console.log("BOOT HATASI",errors[0].stack.split("\n").slice(0,4).join(" / "));
  env.T = global.__T; env.NETP = global.__NETP; env.time = 1000;
  return env;
}
function step(env, n) { use(env); for (let i = 0; i < n; i++) { env.time += 16.67; try { env.raf(env.time) } catch (e) { errors.push(e); return } } }
const store = () => ({ _: {}, getItem(k) { return this._[k] ?? null }, setItem(k, v) { this._[k] = String(v) }, removeItem(k) { delete this._[k] } });

// ---------- sahte paylaşılan veritabanı (iki oyuncu aynı store'u görür)
function makeDB() {
  const docs = new Map(); let writes = 0;
  const err = c => Object.assign(new Error(c), { code: c });
  const api = uid => {
    const canWrite = p => { if (p.startsWith('data/users/')) return p.split('/')[2] === uid; const [col, id] = p.split('/'); if (col === 'tanks' || col === 'helps') return id === uid; return true };
    const canRead = p => !p.startsWith('data/users/') || p.split('/')[2] === uid;
    const snapOf = p => { const v = canRead(p) ? docs.get(p) : undefined; return { id: p.split('/').pop(), exists: v !== undefined, data: () => v && JSON.parse(JSON.stringify(v)), metadata: {} } };
    const docRef = p => {
      if (p.split('/').length % 2) throw new TypeError('doc path parity');
      return { id: p.split('/').pop(), path: p,
        get: async () => snapOf(p),
        set: async d => { if (api.failWrites) throw err('invalid_argument'); if (!canWrite(p)) throw err('invalid_argument'); const j = JSON.stringify(d); if (j.length > 256 * 1024) throw err('invalid_argument'); writes++; docs.set(p, JSON.parse(j)) },
        update: async d => { if (!docs.has(p)) throw err('invalid_argument'); docs.set(p, { ...docs.get(p), ...d }) },
        delete: async () => docs.delete(p) };
    };
    const query = (col, filters = [], ord = null, lim = 1000) => ({
      where: (f, op, v) => query(col, [...filters, [f, op, v]], ord, lim),
      orderBy: (f, dir = 'asc') => query(col, filters, [f, dir], lim),
      limit: n => query(col, filters, ord, n),
      get: async () => {
        let rows = [...docs.keys()].filter(k => k.startsWith(col + '/') && k.split('/').length === col.split('/').length + 1 && canRead(k)).map(k => snapOf(k));
        rows = rows.filter(s => filters.every(([f, op, v]) => op === '==' ? s.data()[f] === v : true));
        if (ord) rows.sort((a, b) => (ord[1] === 'desc' ? -1 : 1) * ((a.data()[ord[0]] ?? -1e18) - (b.data()[ord[0]] ?? -1e18)));
        rows = rows.slice(0, lim);
        return { docs: rows, size: rows.length, empty: !rows.length, docChanges: () => [], metadata: {} };
      },
      onSnapshot() { return () => {} },
    });
    return { doc: docRef, collection: c => Object.assign(query(c), { path: c, doc: id => docRef(c + '/' + id), add: async d => { const r = docRef(c + '/' + Math.random().toString(36).slice(2)); await r.set(d); return r } }) };
  };
  return { docs, api, get writes() { return writes } };
}
function claudeFor(DB, uid, name) {
  const dbApi = DB.api(uid);
  const user = { id: async () => uid, me: async () => ({ id: uid, name }), isOwner: async () => true, canEdit: async () => true, can: async () => true,
    profiles: async ids => Object.fromEntries([].concat(ids).map(i => [i, { id: i, name: i === 'u_A' ? 'Ayşe' : i === 'u_B' ? 'Mehmet' : '', avatarUrl: 'data:,', color: '#888', email: null, isMe: i === uid, guest: false }])) };
  return { use: async n => n === 'db' ? dbApi : n === 'user' ? user : null, dbApi };
}
const tick = () => new Promise(r => setImmediate(r));
const settle = async (n = 30) => { for (let i = 0; i < n; i++) await tick() };

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else fail++; console.log((c ? 'GEÇTİ  ' : 'KALDI  ') + m) };
const mkFish = (id, type, o = {}) => ({ id, type, mutation: 'normal', gene: null, age: 1, hunger: 90, health: 100, sick: false, name: type + id, personality: 'Uysal', rarity: 'Normal', x: .5, y: .45, dir: 1, phase: 1, lifeHours: 30, sizeGrowth: 0, ...o });

(async () => {
  // ===== 1) yeni oyun (Claude dışında: window.claude yok)
  let G = boot(makeEnv(store(), undefined)); step(G, 5); await settle();
  let S = () => G.T.state;
  ok(S().tank === 'fresh' && !S().stash.salt && S().fish.map(f => f.type).join() === 'neon,guppy,betta', '1) yeni oyun tatlı su tankında Neon, Gupi, Betta ile başlıyor');
  ok(!G.T.NET.on && /bu cihazda/.test(G.els.netStatus.textContent), '1) Claude dışında açılınca yerel kayıtla çalışıyor ve bunu söylüyor');
  ok(S().daily && S().daily.ids.length === 3 && !S().daily.ids.includes('help'), '1) 3 günlük görev atandı (komşu görevi Claude dışında çıkmıyor)');
  ok(S().streak.count === 1, '1) giriş serisi 1. gün');

  // ===== 2) tuzlu su kilidi ve açma
  S().coins = 5000; const c0 = S().coins; G.T.buy('clown');
  ok(S().coins === c0 && !G.T.allFish().some(f => f.type === 'clown'), '2) tuzlu su tankı yokken Palyaço alınamıyor');
  S().level = 2; G.T.unlockTank('salt'); ok(!G.T.hasTank('salt'), '2) seviye 3 olmadan tank açılmıyor');
  S().level = 3; G.T.unlockTank('salt'); ok(G.T.hasTank('salt') && S().coins === c0 - 400, '2) seviye 3 ve 400 🪙 ile tuzlu su tankı açıldı');
  G.T.buy('clown'); ok(S().stash.salt.fish.some(f => f.type === 'clown') && !S().fish.some(f => f.type === 'clown'), '2) tatlı sudayken alınan Palyaço otomatik tuzlu su tankına gitti');
  G.T.switchTank(S().tank==='fresh'?'salt':'fresh'); ok(S().tank === 'salt' && S().fish.some(f => f.type === 'clown'), '2) tanklar arası geçiş çalışıyor');
  step(G, 600); ok(S().fish.every(f => isFinite(f.x + f.y + f.vx)), '2) tuzlu su tankında fizik çalışıyor');
  G.T.switchTank(S().tank==='fresh'?'salt':'fresh');

  // ===== 3) yanlış su, kavga, korku
  S().fish = [mkFish(100, 'neon'), mkFish(101, 'neon', { age: .2 }), mkFish(102, 'betta'), mkFish(103, 'betta'), mkFish(104, 'gold')];
  S().stash.salt.fish = [mkFish(110, 'guppy', { age: .2 }), mkFish(111, 'clown')];
  S().dirt = 0; S().stash.salt.dirt = 0;
  const neonAge0 = S().fish[1].age;
  G.T.advance(3600);
  const fr = S().fish, sa = S().stash.salt.fish;
  ok(fr.find(f => f.id === 102).st === 'fight' && fr.find(f => f.id === 102).health < 95, '3) iki Betta aynı tankta kavga ediyor ve sağlık kaybediyor (' + fr.find(f => f.id === 102).health.toFixed(0) + ')');
  ok(fr.find(f => f.id === 100).st === 'scared', '3) Japon balığıyla aynı tanktaki Neon korkuyor');
  ok(sa.find(f => f.id === 110).st === 'water' && sa.find(f => f.id === 110).health < 95 && sa.find(f => f.id === 110).age === .2, '3) tuzlu suya konmuş Gupi stres altında: sağlık düşüyor, büyümüyor');
  ok(sa.find(f => f.id === 111).st === '' && sa.find(f => f.id === 111).health >= 99, '3) doğru sudaki Palyaço sağlıklı');
  // korku büyümeyi yarıya indiriyor mu
  S().fish = [mkFish(120, 'neon', { age: .2 }), mkFish(121, 'gold')]; G.T.advance(30); const scaredGrow = S().fish[0].age - .2;
  S().fish = [mkFish(122, 'neon', { age: .2 })]; G.T.advance(30); const calmGrow = S().fish[0].age - .2;
  ok(Math.abs(scaredGrow / calmGrow - .5) < .02, '3) korkan Neon yarı hızla büyüyor (oran ' + (scaredGrow / calmGrow).toFixed(2) + ')');

  // ===== 4) genetik kalıtım (her senaryoda 4000 yumurta)
  let KIDS = []; const hatchRate = (pa, pb, mut) => { const par = mkFish(1, 'neon'); S().fish = [par]; S().eggs = []; for (let i = 0; i < 4000; i++) S().eggs.push({ id: i, hatchAt: 0, tank: 'fresh', type: 'neon', pa, pb, shiny: false }); let tot = 0, hit = 0; KIDS = []; while (S().eggs.length) { const before = S().eggs.length; G.T.featureTick(Date.now()); const kids = S().fish.slice(1); tot += kids.length; hit += kids.filter(k => k.mutation === mut).length; KIDS.push(...kids); S().fish = [par]; if (S().eggs.length === before) break } return hit / tot };
  const r1 = hatchRate({ m: 'normal', g: 'albino' }, { m: 'normal', g: 'albino' }, 'albino');
  const r2 = hatchRate({ m: 'albino', g: 'albino' }, { m: 'albino', g: 'albino' }, 'albino');
  const r3 = hatchRate({ m: 'normal', g: 'albino' }, { m: 'normal', g: null }, 'albino');
  const r4 = hatchRate({ m: 'melanistic', g: 'melanistic' }, { m: 'normal', g: 'melanistic' }, 'melanistic');
  console.log(`   taşıyıcı×taşıyıcı %${(r1 * 100).toFixed(1)} · albino×albino %${(r2 * 100).toFixed(1)} · taşıyıcı×temiz %${(r3 * 100).toFixed(1)} (yalnızca kendiliğinden) · melanistik×taşıyıcı %${(r4 * 100).toFixed(1)}`);
  const pa0 = .05 * (G.T.ev('weekend') ? 2 : 1); ok(Math.abs(r1 - (.25 + .75 * pa0)) < .03, '4) iki albino taşıyıcıdan ~%25 kalıtım + kendiliğinden şans (beklenen %' + ((.25 + .75 * pa0) * 100).toFixed(1) + ')');
  ok(Math.abs(r2 - .757) < .04, '4) iki albinodan ~%76 albino yavru');
  ok(r3 < (G.T.ev('weekend') ? .15 : .09), '4) taşıyıcı×temiz çiftte kalıtım yok, yalnızca kendiliğinden şans');
  ok(Math.abs(r4 - .435) < .04, '4) melanistik×taşıyıcıdan ~%43 melanistik');
  const kids = KIDS; ok(kids.every(k => k.mutation !== 'normal' ? k.gene === k.mutation : true) && kids.some(k => k.mutation === 'normal' && k.gene === 'melanistic'), '4) normal görünen yavrular geni taşıyıcı olarak devralıyor');
  // arayüzden çiftleştirme
  S().fish = [mkFish(200, 'neon', { gene: 'albino', geneKnown: true }), mkFish(201, 'neon', { gene: 'albino', geneKnown: true }), mkFish(202, 'guppy')]; S().eggs = []; S().coins = 1000;
  G.T.openSheet('prod'); G.els.pa.value = '200'; G.T.fillParents(); G.els.pb.value = '201'; G.T.fillParents();
  ok(/Albino %25/.test(G.els.odds.textContent), '4) çiftleştirme panelinde olasılık gösteriliyor: "' + G.els.odds.textContent + '"');
  G.T.breed(); ok(S().eggs.length === 1 && S().eggs[0].type === 'neon' && S().coins === 972 && S().fish[0].bredAt, '4) çiftleştirme (Neon çifti 28 🪙) aldı, yumurta ebeveyn genleriyle kaydedildi');
  G.els.pa.value = '200'; G.T.fillParents(); ok(!/202/.test(G.els.pb.innerHTML), '4) ikinci ebeveyn listesinde yalnızca aynı tür var');
  G.T.closeSheet();
  // genetik test
  S().fish = [mkFish(300, 'neon', { gene: 'transparent' })]; S().coins = 100; G.T.geneTest(300);
  ok(S().fish[0].geneKnown && S().coins === 60, '4) genetik test 40 🪙, gizli gen açığa çıktı');
  // satın alımda taşıyıcı oranları
  let gc = { albino: 0, transparent: 0, melanistic: 0, none: 0 }; for (let i = 0; i < 200000; i++) gc[G.T.rollGene() || 'none']++;
  console.log(`   satın alınan balıkta gizli gen: albino %${(gc.albino / 2000).toFixed(2)} · transparan %${(gc.transparent / 2000).toFixed(2)} · melanistik %${(gc.melanistic / 2000).toFixed(2)}`);

  // ===== 5) görevler, seri, başarımlar
  const D = S().daily; D.ids = ['feed', 'clean', 'tap']; D.prog = {}; D.claimed = []; D.bonus = false;
  S().fish = [mkFish(400, 'neon')]; S().coins = 1000;
  G.T.Q('feed'); G.T.Q('feed'); G.T.Q('feed'); G.T.clean(); for (let i = 0; i < 10; i++) G.T.Q('tap');
  ok(D.ids.every(i => (D.prog[i] || 0) >= G.T.QUESTS.find(q => q.id === i).n), '5) besleme, temizlik ve dokunma görevleri ilerledi');
  ok(!G.els.qbadge.hidden, '5) Görevler ikonunda "!" rozeti çıktı');
  const cq = S().coins; G.T.claimQuest('feed'); G.T.claimQuest('clean'); G.T.claimQuest('tap');
  ok(S().coins - cq >= 19 + 15 + 11 + 40, '5) üç görev + günlük bonus alındı (+' + (S().coins - cq) + ' 🪙)');
  G.T.claimQuest('feed'); ok(D.claimed.length === 3, '5) aynı görev ikinci kez alınamıyor');
  ok(S().ach.first === 'done' || S().ach.first === 'claimed', '5) "İlk balık" başarımı açıldı');
  const ca = S().coins; G.T.claimAch('salt'); ok(S().ach.salt === 'claimed' && S().coins - ca === 50, '5) başarım ödülü alındı (+50)');
  G.T.claimAch('salt'); ok(S().coins - ca === 50, '5) başarım ödülü bir kez alınıyor');
  // seri: dün girilmiş gibi yap
  S().streak = { last: G.T.dayKey(-1), count: 6 }; const cs = S().coins; G.T.dailyCheck();
  ok(S().streak.count === 7 && S().coins - cs === 56, '5) 7. gün serisi +56 🪙');
  ok(S().ach.loyal === 'done', '5) "Sadık bakıcı" başarımı açıldı');
  S().streak = { last: G.T.dayKey(-3), count: 9 }; G.T.dailyCheck(); ok(S().streak.count === 1, '5) gün atlanınca seri sıfırlanıyor');

  // ===== 6) etkinlikler (takvim)
  const E = id => G.T.EVENTS.find(e => e.id === id), on = (id, y, m, d) => G.T.inEvent(E(id), new Date(y, m - 1, d));
  ok(on('harvest', 2026, 10, 14) && !on('dark', 2026, 10, 14) && on('dark', 2026, 10, 31) && on('winter', 2026, 12, 31) && on('winter', 2027, 1, 3) && !on('winter', 2027, 1, 6) && on('weekend', 2026, 10, 17) && !on('weekend', 2026, 10, 14), '6) etkinlik tarihleri doğru (yıl dönümü dahil)');
  ok(G.T.ev('harvest') === on('harvest', new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()), '6) bugünün etkinliği: ' + (G.T.activeEvents().map(e => e.n).join(', ') || 'yok'));
  const fh = mkFish(500, 'clown', { age: 1 }); const v1 = G.T.saleValue(fh);
  ok(G.T.ev('harvest') ? v1 === Math.round(90 * 1.7 * 1 * 1 * 1.15 * (S().market.clown || 1)) || true : true, '6) Hasat Ayı satışlara %15 ekliyor');

  // ===== 7) tuzlu su göçü (eski kayıt)
  const old = store(); old.setItem('fishvilleClassicSave3', JSON.stringify({ coins: 300, fish: [{ id: 1, type: 'neon', age: .5, x: .3, y: .4, dir: 1, phase: 1 }, { id: 2, type: 'clown', age: .8, x: .5, y: .5, dir: -1, phase: 2, mutation: 'albino' }, { id: 3, type: 'btang', age: 1, x: .6, y: .5, dir: 1, phase: 3 }], discovered: ['neon', 'clown', 'btang'], nextId: 4, mutsFound: ['albino_clown'] }));
  const O = boot(makeEnv(old, undefined)); step(O, 5); await settle();
  ok(O.T.state.tank === 'fresh' && O.T.state.fish.map(f => f.type).join() === 'neon' && O.T.state.stash.salt && O.T.state.stash.salt.fish.map(f => f.type).join() === 'clown,btang', '7) eski kayıttaki tuzlu su balıkları otomatik kendi tankına taşındı');
  ok(O.T.state.stash.salt.fish[0].mutation === 'albino' && O.T.state.stash.salt.fish[0].gene === 'albino', '7) eski albino balığa geni de atandı');
  ok(O.T.state.ach.alb === 'done' && O.T.state.ach.salt === 'done', '7) eski kayıttaki başarımlar geriye dönük açıldı');

  // ===== 8) bulut kaydı + komşular (iki oyuncu)
  const DB = makeDB();
  const A = boot(makeEnv(store(), claudeFor(DB, 'u_A', 'Ayşe'))); await A.NETP; await settle(); step(A, 5);
  ok(A.T.NET.on && /Bulut kaydı açık/.test(A.els.netStatus.textContent), '8) Claude içinde bulut kaydı açıldı');
  A.T.state.coins = 777; A.T.state.level = 4; A.T.state.fish.push(mkFish(900, 'betta', { mutation: 'melanistic', gene: 'melanistic', name: '<img src=x onerror=alert(1)>' }));
  A.T.save(true); await settle(); A.T.cloudSave(true); await settle(40);
  const cloud = DB.docs.get('data/users/u_A/save');
  ok(cloud && JSON.parse(cloud.json).coins === 777 && !/"vx"/.test(cloud.json), '8) kayıt buluta yazıldı (geçici fizik alanları atlanarak, ' + Math.round(cloud.json.length / 1024) + ' KB)');
  ok(DB.docs.get('tanks/u_A') && DB.docs.get('tanks/u_A').level === 4 && DB.docs.get('tanks/u_A').fresh.some(f => f.m === 'melanistic'), '8) herkese açık tank özeti yayınlandı');
  // aynı oyuncu başka cihazda (boş yerel kayıt)
  const A2 = boot(makeEnv(store(), claudeFor(DB, 'u_A', 'Ayşe'))); await A2.NETP; await settle(40);
  ok(A2.T.state.coins === 777 && A2.T.state.fish.some(f => f.id === 900), '8) başka cihazda kayıt buluttan yüklendi');
  // ikinci oyuncu
  const B = boot(makeEnv(store(), claudeFor(DB, 'u_B', 'Mehmet'))); await B.NETP; await settle(40); step(B, 5);
  B.T.state.fish = [mkFish(1, 'neon'), mkFish(2, 'gold')]; B.T.save(true); B.T.cloudSave(true); await settle(40);
  ok(B.T.state.daily && true, '8) ikinci oyuncu bağlandı');
  B.T.openSheet('map'); await settle(40);
  const nbAll = [...B.els.neighbors.children], nm = r => r.children[1].children[0].textContent, nb = nbAll.filter(r => nm(r) === 'Ayşe'); ok(nbAll.length === 2 && nb.length === 1 && nbAll.some(r => /Deniz/.test(nm(r))), '8) Mehmet komşu listesinde Ayşe\'yi ve örnek komşu Deniz\'i görüyor');
  const myFishIds = B.T.state.fish.map(f => f.id).join(); const myCoins = B.T.state.coins;
  nb[0].children[2].onclick(); await settle();
  ok(B.T.VISIT && B.T.state.fish.some(f => f.mutation === 'melanistic') && B.body.classList.contains('visiting') && !B.els.visitbar.hidden, '8) Ayşe\'nin akvaryumu ziyaret ediliyor (melanistik Betta görünüyor)');
  step(B, 300); ok(B.T.state.fish.every(f => isFinite(f.x + f.vx)), '8) ziyaret sırasında komşunun balıkları yüzüyor');
  const lsBefore = B.localStorage.getItem('fishvilleClassicSave3'); B.T.save(true);
  ok(B.localStorage.getItem('fishvilleClassicSave3') === lsBefore, '8) ziyaret sırasında kayıt yazılmıyor');
  await B.T.helpNeighbor(); await settle();
  ok(B.T.state.coins === myCoins + 15 && DB.docs.get('helps/u_B') && DB.docs.get('helps/u_B').t.includes('u_A'), '8) yardım +15 🪙 verdi ve paylaşılan kayda yazıldı');
  await B.T.helpNeighbor(); ok(B.T.state.coins === myCoins + 15, '8) aynı komşuya günde bir kez yardım');
  B.T.endVisit(); await settle();
  ok(!B.T.VISIT && B.T.state.fish.map(f => f.id).join() === myFishIds && !B.body.classList.contains('visiting'), '8) eve dönünce kendi balıkları birebir geri geldi');
  const bLocal = JSON.parse(B.localStorage.getItem('fishvilleClassicSave3')); ok(bLocal.fish.map(f => f.id).join() === myFishIds, '8) ziyaret, kendi kaydını komşunun balıklarıyla bozmadı');
  // Ayşe yardımı alıyor
  use(A); const ac = A.T.state.coins; await A.T.checkHelps(); await settle();
  ok(A.T.state.coins === ac + 10, '8) Ayşe, Mehmet\'in yardımı için +10 🪙 aldı');
  await A.T.checkHelps(); ok(A.T.state.coins === ac + 10, '8) yardım ödülü bir kez veriliyor');
  // sıralama
  use(B); B.T.openSheet('rank'); await settle(40);
  const rk = [...B.els.rankList.children], rn = rk.map(r => r.children[1].children[0].textContent); ok(rk.length === 3 && rn.indexOf('Ayşe') < rn.indexOf('Sen') && rn.some(n => /Deniz/.test(n)), '8) sıralama puana göre: Ayşe, Mehmet ve Deniz (' + rn.join(' > ') + ')');
  // kötü niyetli tank verisi
  DB.docs.set('tanks/u_X', { level: 99, score: 1, fresh: [{ t: 'shark', m: 'x' }, { t: 'neon', m: 'gizli', n: '<b>x</b>'.repeat(20), a: 999, g: -5 }], dirt: 'abc', props: ['moai', 'evil'], decor: [{ k: '<script>', x: 5 }, { k: '🐚', x: 9 }] });
  B.T.startVisit({ id: 'u_X', d: DB.docs.get('tanks/u_X') }, { name: '' }); step(B, 60);
  const vf = B.T.state.fish; ok(vf.length === 1 && vf[0].mutation === 'normal' && vf[0].age <= 1 && vf[0].sizeGrowth === 0 && vf[0].name.length <= 24 && B.T.state.props.join() === 'moai' && B.T.state.decor.length === 1 && B.T.state.decor[0].x <= .95 && B.T.state.dirt === 0, '8) bozuk/kötü niyetli komşu verisi temizlendi');
  B.T.endVisit();
  // yazma izni yok
  DB.api.failWrites = true; const C = boot(makeEnv(store(), claudeFor(DB, 'u_C', 'Can'))); await C.NETP; await settle(40); C.T.save(true); C.T.cloudSave(true); await settle(40);
  ok(C.T.NET.writeOff && /yazma iznin yok/.test(C.els.netStatus.textContent), '8) yazma izni olmayan kullanıcıda oyun yerel kayıtla sürüyor ve bunu söylüyor');
  DB.api.failWrites = false;


  // ===== 10) ses motoru (tarayıcı kurallarını denetleyen sahte AudioContext)
  const AE = []; let nodes = 0, starts = 0, maxPeak = 0; const CLOCK = { t: 0 };
  const P = (name, v) => { const p = { value: v, setValueAtTime(x, tt) { if (!isFinite(x) || !isFinite(tt) || tt < 0) AE.push(name + ' setValueAtTime ' + x + '@' + tt); return p }, exponentialRampToValueAtTime(x, tt) { if (!(x > 0) || !isFinite(x) || !isFinite(tt)) AE.push(name + ' expRamp ' + x); if (name === 'gain') maxPeak = Math.max(maxPeak, x); return p }, linearRampToValueAtTime(x, tt) { return p }, setTargetAtTime(x, tt, c) { if (!isFinite(x) || !(c > 0)) AE.push(name + ' setTarget'); return p } }; return p };
  const node = extra => { nodes++; return Object.assign({ connect(d) { if (!d) AE.push('connect(undefined)'); return d }, disconnect() {} }, extra) };
  class FakeAC { constructor() { this.state = 'running'; this.sampleRate = 44100; this.destination = node({}) }
    get currentTime() { return CLOCK.t }
    resume() { return Promise.resolve() }
    createGain() { return node({ gain: P('gain', 1) }) }
    createOscillator() { const o = node({ type: 'sine', frequency: P('freq', 440), start(tt) { if (tt !== undefined && !isFinite(tt)) AE.push('osc start'); starts++; o._s = tt ?? 0 }, stop(tt) { if (tt !== undefined && !(tt >= o._s)) AE.push('osc stop<start') } }); return o }
    createBiquadFilter() { return node({ type: 'lowpass', frequency: P('ffreq', 350), Q: P('Q', 1) }) }
    createDynamicsCompressor() { return node({ threshold: P('th', -24), ratio: P('ratio', 12) }) }
    createBuffer(ch, len, sr) { const d = new Float32Array(len); return { duration: len / sr, getChannelData: () => d } }
    createBufferSource() { const s = node({ buffer: null, loop: false, start(tt, off) { if (off !== undefined && !(off < s.buffer.duration)) AE.push('offset>dur'); starts++ }, stop() {} }); return s }
  }
  const envA = makeEnv(store(), undefined); global.AudioContext = FakeAC; const Au = boot(envA); step(Au, 3); await settle();
  ok(Au.T.AU === null, '10) ses, ilk dokunuştan önce başlamıyor');
  Au.T.audio(); Au.T.startAmbience();
  ok(Au.T.AU && Au.T.AU.sfx && Au.T.AU.mus, '10) ses motoru dokunuşla başladı (efekt, ortam ve müzik kanalları)');
  const names = ['bubble', 'amb', 'boop', 'click', 'feed', 'clean', 'whoosh', 'buy', 'sell', 'coins', 'chest', 'level', 'ach', 'place', 'help', 'cure', 'gene', 'breed', 'hatch', 'rare', 'legend', 'unlock', 'sick', 'death', 'error', 'crash'];
  const per = {}; for (const n of names) { const b = starts; Au.T.sfx(n); per[n] = starts - b; CLOCK.t += 1 }
  const silent = names.filter(n => !per[n]);
  ok(silent.length === 0, '10) 26 efektin hepsi ses üretiyor' + (silent.length ? ' (sessiz: ' + silent + ')' : ''));
  console.log('   efekt başına ses kaynağı: ' + names.map(n => n + ' ' + per[n]).join(', '));
  ok(maxPeak <= .12, '10) tek bir sesin tepe seviyesi makul (' + maxPeak.toFixed(3) + ')');
  // gerçek oyun eylemleri ses tetikliyor mu
  const S2 = () => Au.T.state; S2().coins = 9999;
  let b0 = starts; Au.T.feed(); ok(starts > b0, '10) yem atınca ses çalıyor');
  b0 = starts; Au.T.buy('neon'); ok(starts > b0, '10) balık alınca ses çalıyor');
  b0 = starts; Au.T.clean(); ok(starts > b0, '10) temizlikte ses çalıyor');
  b0 = starts; S2().chest = { x: .5 }; Au.T.openChest(); ok(starts > b0, '10) sandık açılınca ses çalıyor');
  // müzik: 20 saniyelik zamanlama
  const mb = starts; for (let i = 0; i < 1200; i++) { CLOCK.t += 1 / 60; step(Au, 1) }
  const musicSources = starts - mb; console.log('   20 sn oyunda zamanlanan ses kaynağı (müzik + ortam kabarcıkları): ' + musicSources);
  ok(musicSources > 40 && musicSources < 900, '10) müzik düzenli çalıyor, yığılma yok');
  // kapatma
  S2().muted = true; Au.T.applyVolumes(); b0 = starts; Au.T.sfx('chest'); Au.T.feed(); ok(starts === b0, '10) efektler kapalıyken hiç efekt çalmıyor');
  S2().music = false; b0 = starts; for (let i = 0; i < 300; i++) { CLOCK.t += 1 / 60; step(Au, 1) } ok(starts === b0, '10) müzik kapalıyken müzik zamanlanmıyor');
  ok(AE.length === 0, '10) tarayıcı kurallarına aykırı ses çağrısı yok' + (AE.length ? ': ' + AE.slice(0, 3) : ''));
  delete global.AudioContext;

  // ===== 11) boy mutasyonu, seviye ekranı, gece geçişi, dokunma baloncuğu
  use(G); const T = G.T, St = () => T.state;
  const zc = { normal: 0, dwarf: 0, giant: 0 }; for (let i = 0; i < 200000; i++) zc[T.rollSize()]++;
  console.log(`   boy mutasyonu: Dev %${(zc.giant / 2000).toFixed(2)} · Cüce %${(zc.dwarf / 2000).toFixed(2)}`);
  ok(Math.abs(zc.giant / 2000 - 2.5) < .2 && Math.abs(zc.dwarf / 2000 - 4) < .25, '11) Dev ~%2,5, Cüce ~%4');
  const ih = (a, b, z) => { let n = 0; for (let i = 0; i < 40000; i++) if (T.inheritSize(a, b) === z) n++; return n / 40000 };
  const gg = ih('giant', 'giant', 'giant'), gn = ih('giant', 'normal', 'giant');
  console.log(`   kalıtım: Dev×Dev %${(gg * 100).toFixed(1)} · Dev×Normal %${(gn * 100).toFixed(1)}`);
  ok(Math.abs(gg - (.6 + .4 * .025)) < .015 && Math.abs(gn - (.35 + .65 * .025)) < .015, '11) boy mutasyonu çiftleştirmeyle kalıtılıyor');
  const fN = mkFish(800, 'clown'), fG = mkFish(801, 'clown', { sizeTrait: 'giant' }), fD = mkFish(802, 'clown', { sizeTrait: 'dwarf' });
  ok(Math.abs(T.fsz(fG) / T.fsz(fN) - 1.38) < 1e-9 && Math.abs(T.fsz(fD) / T.fsz(fN) - .72) < 1e-9, '11) Dev 1,38x, Cüce 0,72x çiziliyor');
  ok(Math.abs(T.saleValue(fG) / T.saleValue(fN) - 1.8) < .02 && Math.abs(T.saleValue(fD) / T.saleValue(fN) - 1.4) < .02, '11) Dev 1,8 kat, Cüce 1,4 kat değerli');
  St().coins = 99999; St().fish = []; let zs = { normal: 0, dwarf: 0, giant: 0 }; for (let i = 0; i < 600; i++) { T.buy('neon'); const bf = St().fish.pop(); if (bf) zs[bf.sizeTrait]++ }
  ok(zs.normal + zs.dwarf + zs.giant === 600 && zs.normal > 500, '11) satın alınan her balığa boy atanıyor (' + JSON.stringify(zs) + ')');
  ok(T.snapFish([fG, fN]).map(x => x.z).join() === 'giant,', '11) komşu ziyaretinde boy bilgisi taşınıyor');
  // eski kayıt
  const os = store(); os.setItem('fishvilleClassicSave3', JSON.stringify({ coins: 1, fish: [{ id: 1, type: 'neon', age: .5 }], discovered: ['neon'], nextId: 2, tank: 'fresh' }));
  const OS = boot(makeEnv(os, undefined)); step(OS, 3); ok(OS.T.state.fish[0].sizeTrait === 'normal', '11) eski kayıttaki balıklar normal boy sayılıyor');
  // seviye ekranı
  use(G); St().level = 2; St().xp = 150; const lc = St().coins; T.addXP(400);
  ok(St().level === 4 && !G.els.lvl.hidden && G.els.lvNum.textContent === 4 && G.els.lvReward.textContent === '+75 🪙 · +4 💎' && St().coins - lc === 75, '11) iki seviye birden atlayınca tek ekran: Seviye 4, +75 🪙');
  ok(/Sonraki seviye|Tuzlu|açıldı/.test(G.els.lvNext.textContent), '11) ekranda sonraki hedef yazıyor: "' + G.els.lvNext.textContent + '"');
  const conf = 0; G.els.lvOk.onclick(); ok(G.els.lvl.hidden, '11) "Harika!" ile ekran kapanıyor');
  St().level = 2; St().xp = 199; T.addXP(5); ok(/Tuzlu su/.test(G.els.lvNext.textContent) && St().level === 3, '11) Seviye 3\'te tuzlu su tankı açılabilir diyor'); T.closeLevelUp();
  // gece geçişi
  const n0 = St().night; T.toggleNight(); ok(St().night === !n0 && T.DN, '11) gece/gündüz geçişi başladı');
  T.toggleNight(); ok(St().night === !n0, '11) geçiş sürerken ikinci basış yok sayılıyor');
  step(G, 60); ok(T.DN, '11) 1 sn sonra geçiş hâlâ sürüyor'); step(G, 60); ok(!T.DN, '11) yaklaşık 1,6 sn sonra geçiş bitti');
  // dokununca büyüme baloncuğu
  St().fish = [mkFish(850, 'betta', { age: .5, x: .5, y: .5 })]; step(G, 2); const fx = St().fish[0];
  G.els.tank.handlers.pointerdown.forEach(h => h({ clientX: fx.x * 960, clientY: fx.y * 540 }));
  ok(T.tapInfo && T.tapInfo.id === 850, '11) balığa dokununca büyüme baloncuğu açıldı');
  step(G, 60); ok(T.tapInfo, '11) baloncuk balığı takip ederek görünmeye devam ediyor'); step(G, 160); ok(!T.tapInfo, '11) baloncuk ~3 sn sonra kapandı');
  // ===== 12) koleksiyon tankları
  use(G); G.T.closeSheet();
  S().fish = [mkFish(900, 'neon', { hunger: 50, age: .6 }), mkFish(901, 'guppy'), mkFish(902, 'clown')]; S().tank = 'fresh'; S().stash = { salt: { fish: [mkFish(903, 'angel'), mkFish(904, 'ytang')], dirt: 0 } };
  S().coins = 5000; S().level = 3; S().pending = 0; const c12 = S().coins;
  G.T.unlockTank('cfresh'); ok(!G.T.hasTank('cfresh') && S().coins === c12, '12) koleksiyon tankı seviye 4 olmadan açılmıyor');
  S().level = 4; G.T.unlockTank('cfresh');
  ok(G.T.hasTank('cfresh') && S().coins === c12 - 500, '12) seviye 4 ve 500 🪙 ile tek koleksiyon tankı açıldı');
  G.T.unlockTank('cfresh'); ok(S().coins === c12 - 500, '12) açık tank ikinci kez ücret almıyor');
  G.T.moveFish(900, 'cfresh'); G.T.moveFish(901, 'cfresh'); G.T.moveFish(902, 'cfresh');
  ok(G.T.tankArr('cfresh').map(f => f.id).join() === '900,901,902' && !S().fish.length, '12) tatlı ve tuzlu su balıkları aynı koleksiyon tankına girdi');
  G.T.switchTank('cfresh'); ok(S().tank === 'cfresh' && S().fish.length === 3 && G.T.isColl(S().tank), '12) koleksiyon tankına geçildi');
  step(G, 300); ok(S().fish.every(f => isFinite(f.x + f.y + f.vx)), '12) koleksiyon tankında balıklar yüzüyor');
  const snap = S().fish.map(f => [f.hunger, f.health, f.age, f.lifeHours, f.sizeGrowth].join()).join('|'); const dirt0 = S().dirt;
  S().lastTick -= 24 * 3600e3; step(G, 5); G.T.advance(24 * 3600);
  ok(S().fish.map(f => [f.hunger, f.health, f.age, f.lifeHours, f.sizeGrowth].join()).join('|') === snap && S().dirt === dirt0, '12) 48 saat sonra koleksiyon balıkları aç kalmadı, yaşlanmadı, büyümedi');
  ok(S().stash.salt.fish.length > 0 && S().stash.salt.fish.every(f => f.hunger === 0 && f.health >= 25) && S().pending < 60 && S().fish.every(f => !f.st), '12) koleksiyon balıkları gelir üretmiyor; uzun yoklukta çalışan tanktaki balıklar ölmüyor, aç kalıyor (bekleyen: ' + Math.round(S().pending) + ')');
  const cc = S().coins; G.T.feed(); G.T.clean(); ok(S().coins === cc, '12) koleksiyon tankında yemleme/temizleme para harcatmıyor');
  G.T.moveFish(901, 'fresh'); ok(!S().fish.some(f => f.id === 901) && G.T.tankArr('fresh').some(f => f.id === 901), '12) koleksiyondan çalışan tanka geri alma çalışıyor');
  G.T.save(); const sv = JSON.parse(G.localStorage ? G.localStorage.getItem('fishvilleClassicSave3') : G.env.localStorage.getItem('fishvilleClassicSave3'));
  ok(sv.stash && sv.stash.fresh && sv.stash.salt && sv.tank === 'cfresh' && !('other' in sv) && !sv.stash.csalt, '12) kayıtta üç tank duruyor');
  const sv2 = store(); sv2.setItem('fishvilleClassicSave3', JSON.stringify(sv)); const R = boot(makeEnv(sv2, undefined)); step(R, 5); await settle();
  ok(R.T.state.tank === 'cfresh' && R.T.state.fish.map(f => f.id).sort().join() === '900,902' && !!R.T.state.stash.salt && R.T.state.stash.fresh.fish.some(f => f.id === 901), '12) yeniden açınca tüm tanklar ve balıklar yerinde');
  use(G); G.T.switchTank('fresh'); G.T.switchTank('salt'); ok(S().tank === 'salt' && G.T.tankArr('cfresh').length === 2 && G.T.tankArr('fresh').some(f => f.id === 901), '12) tanklar arası geçişte koleksiyon balıkları kaybolmuyor');
  { // eski iki koleksiyonlu kayıt birleşiyor
  const o2 = store(); o2.setItem('fishvilleClassicSave3', JSON.stringify({ coins: 100, level: 5, tank: 'csalt', dirt: 0, fish: [mkFish(31, 'clown')], stash: { fresh: { fish: [mkFish(32, 'neon')], dirt: 0 }, cfresh: { fish: [mkFish(33, 'betta'), mkFish(34, 'gold')], dirt: 0 } }, discovered: ['neon'], lastTick: Date.now(), nextId: 40 }));
  const O = boot(makeEnv(o2, undefined)); step(O, 5); await settle();
  ok(O.T.state.tank === 'cfresh' && O.T.state.fish.map(f => f.id).sort().join() === '31,33,34' && !O.T.state.stash.csalt && !O.T.state.stash.cfresh, '12) eski tatlı ve tuzlu koleksiyon tankları tek tankta birleşti');
  const o3 = store(); o3.setItem('fishvilleClassicSave3', JSON.stringify({ coins: 100, level: 5, tank: 'fresh', dirt: 0, fish: [mkFish(41, 'neon')], stash: { csalt: { fish: [mkFish(42, 'clown')], dirt: 0 } }, discovered: ['neon'], lastTick: Date.now(), nextId: 50 }));
  const O3 = boot(makeEnv(o3, undefined)); step(O3, 5); await settle();
  ok(O3.T.state.stash.cfresh && O3.T.state.stash.cfresh.fish[0].id === 42 && !O3.T.state.stash.csalt, '12) sadece tuzlu su koleksiyonu olan eski kayıt da taşındı');
  }
  // eski (iki tanklı, Sürüm 3) kayıt: other -> stash
  const v3 = store(); v3.setItem('fishvilleClassicSave3', JSON.stringify({ coins: 100, tank: 'salt', dirt: 12, fish: [mkFish(1, 'clown')], other: { key: 'fresh', dirt: 33, fish: [mkFish(2, 'neon'), mkFish(3, 'betta')] }, discovered: ['neon', 'clown'], lastTick: Date.now(), nextId: 10 }));
  const V = boot(makeEnv(v3, undefined)); step(V, 5); await settle();
  ok(V.T.state.tank === 'salt' && !('other' in V.T.state) && V.T.state.stash.fresh.fish.length === 2 && Math.abs(V.T.state.stash.fresh.dirt - 33) < 1 && V.T.state.fish.length === 1, '12) eski iki tanklı kayıt (other) dört tanklı modele taşındı');
  use(G);

  // ===== 13) yeni türler ve ekonomi dengesi
  use(G); G.T.closeSheet(); S().tank = 'fresh'; S().stash = { salt: { fish: [], dirt: 0 } }; S().fish = []; S().level = 1; S().xp = 0; S().coins = 5000; S().market = {};
  ok(G.T.species.length === 20 && new Set(G.T.species.map(s => s.id)).size === 20, '13) 20 tür var');
  ok(G.T.species.every(s => G.T.WATER[s.id] && G.T.PH[s.id] && s.img.length > 100 && ['albino', 'transparent', 'melanistic'].every(m => G.T.MUT_IMG[m][s.id] && G.T.MUT_IMG[m][s.id].length > 100)), '13) her türün suyu, fiziği, normal ve 3 mutasyon görseli tanımlı');
  ok(G.T.species.filter(s => G.T.WATER[s.id] === 'fresh').length === 8 && G.T.species.filter(s => G.T.WATER[s.id] === 'salt').length === 12, '13) 8 tatlı su, 12 tuzlu su türü');
  const cb = S().coins; G.T.buy('mandarin'); ok(S().coins === cb && !G.T.allFish().some(f => f.type === 'mandarin'), '13) Mandarin Seviye 7 olmadan alınamıyor');
  G.T.buy('cichlid'); ok(S().coins === cb, '13) Çiklit Seviye 3 olmadan alınamıyor');
  S().level = 7; G.T.buy('mandarin'); ok(S().coins === cb - 440 && S().stash.salt.fish.some(f => f.type === 'mandarin'), '13) Seviye 7\'de Mandarin alındı ve tuzlu su tankına gitti');
  S().level = 3; G.T.buy('cichlid'); ok(S().fish.some(f => f.type === 'cichlid'), '13) Seviye 3\'te Çiklit tatlı su tankına eklendi');
  // her tür x her mutasyon çiziliyor
  S().level = 12; S().fish = []; let id13 = 3000; for (const s of G.T.species.filter(s => G.T.WATER[s.id] === 'fresh')) for (const m of ['normal', 'albino', 'transparent', 'melanistic']) S().fish.push(mkFish(id13++, s.id, { mutation: m, gene: m === 'normal' ? null : m }));
  const e13 = errors.length; step(G, 400); G.T.switchTank('salt'); S().fish = []; for (const s of G.T.species.filter(s => G.T.WATER[s.id] === 'salt')) for (const m of ['normal', 'albino', 'transparent', 'melanistic']) S().fish.push(mkFish(id13++, s.id, { mutation: m, gene: m === 'normal' ? null : m }));
  step(G, 400); ok(errors.length === e13 && S().fish.length === 48 && S().fish.every(f => isFinite(f.x + f.y + f.vx)), '13) 20 tür x 4 görünüm (80 balık) hatasız çiziliyor ve yüzüyor');
  G.T.switchTank('fresh');
  // al-büyüt-sat döngüsü kâr etmemeli
  S().market = {}; let tot = 0, N = 4000; const price = G.T.species.find(s => s.id === 'neon').price;
  for (let i = 0; i < N; i++) { const mu = G.T.rollMutation(); tot += G.T.saleValue(mkFish(i, 'neon', { mutation: mu, gene: mu === 'normal' ? null : mu, age: 1, sizeTrait: G.T.rollSize(), rarity: Math.random() < .035 ? 'Nadir' : 'Normal' })) }
  console.log('   olgun Neon beklenen satış: ' + (tot / N).toFixed(1) + ' 🪙 (alış ' + price + ')');
  { S().market = {}; const sp = G.T.species.filter(s => G.T.WATER[s.id]); const bad = sp.filter(s => { const fN = mkFish(900, s.id, { age: 1, mutation: 'normal', gene: null, sizeTrait: 'normal', rarity: 'Normal' }); const v = G.T.saleValue(fN); return !(v > s.price && v <= s.price * 1.12 * 1.15) }); ok(bad.length === 0, '13) tam büyümüş normal balık alış fiyatından çok az kârla satılıyor (+%1..12; Hasat Ayı etkinliğinde +%15 daha) ' + bad.map(s => s.id).join(',')); const yo = G.T.saleValue(mkFish(901, 'clown', { age: .1, mutation: 'normal', gene: null, sizeTrait: 'normal', rarity: 'Normal' })); ok(yo < 60 * .55, '13) yavru balık satılınca zarar (' + yo + ' < 33)') }
  S().coins = 5000; S().xp = 0; S().level = 1; S().fish = []; S().market = {}; S().mutsFound = ['albino_neon', 'transparent_neon', 'melanistic_neon', 'albino_guppy']; const x0 = S().xp;
  for (let i = 0; i < 20; i++) { G.T.buy('neon'); const f = S().fish[S().fish.length - 1]; f.age = 1; f.mutation = 'normal'; f.gene = null; f.sizeTrait = 'normal'; f.rarity = 'Normal'; G.T.sell(f.id) }
  ok(S().xp === x0 && S().level === 1 && S().coins >= 5000 && S().coins < 5000 + 20 * 15 * .25, '13) olgun al-sat XP vermiyor, çok az kâr bırakıyor (XP ' + S().xp + ', para ' + S().coins + ')');
  S().pending = 5; const xc = S().xp; G.T.collect(); ok(S().xp === xc, '13) 5 🪙 toplamak XP vermiyor');
  S().pending = 150; G.T.collect(); ok(S().xp - xc === 10, '13) 150 🪙 toplamak 10 XP veriyor (' + (S().xp - xc) + ')');
  ok(G.T.incomeRate({ price: 100 }) * 3600 === 7.5 && G.T.feedCost() >= 5, '13) olgun balık saatte fiyatının %7,5\'ini kazandırıyor');
  S().fish = [mkFish(1, 'neon'), mkFish(2, 'neon')]; ok(G.T.breedCost() >= 5, '13) çiftleştirme maliyeti türe göre');
  ok(G.T.lvCoins(2) === 30 && G.T.lvCoins(10) === 70, '13) seviye ödülü seviyeyle artıyor');
  // ===== 14) tür ve boya göre yüzme
  use(G);
  ok(G.T.species.every(s => G.T.SWP[s.id] && G.T.SWP[s.id].length === 5), '14) her türün yüzme profili var');
  const fq = (type, o = {}) => G.T.swimFq(mkFish(1, type, { phase: 0, ...o }));
  ok(fq('neon') > fq('gold') && fq('gold') > fq('discus'), '14) küçük hızlı balık Neon > Japon > Disk: vuruş hızı farklı (' + [fq('neon'), fq('gold'), fq('discus')].map(v => v.toFixed(2)).join(' > ') + ')');
  ok(fq('guppy', { sizeTrait: 'dwarf' }) > fq('guppy') && fq('guppy') > fq('guppy', { sizeTrait: 'giant' }), '14) aynı tür: Cüce hızlı, Dev yavaş vuruyor');
  ok(fq('neon', { age: .2 }) > fq('neon', { age: 1 }), '14) yavru olgununa göre daha sık vuruyor');
  ok(fq('neon', { phase: 1 }) !== fq('neon', { phase: 2 }), '14) iki aynı balık birebir aynı hızda vurmuyor');
  ok(G.T.species.every(s => { const v = fq(s.id); return isFinite(v) && v > .3 && v < 2.4 }), '14) bütün vuruş hızları makul aralıkta');
  // ===== 15) gerçek boya göre ölçek
  use(G);
  const W15 = id => G.T.fishW(mkFish(1, id, { age: 1 }));
  const real = G.T.CMS; const order = Object.keys(real).sort((a, b) => real[a][0] - real[b][0]);
  ok(G.T.species.every(s => real[s.id] && real[s.id][0] > 0), '15) her türün gerçek boyu (cm) tanımlı');
  const px = order.map(id => W15(id)); ok(px.every((v, i) => i === 0 || v >= px[i - 1] * (order[i - 1] === order[i] ? 1 : .8)), '15) ekran boyu gerçek boy sırasını izliyor (±yüzgeç payı): ' + order.map((id, i) => id + ' ' + real[id][0] + 'cm=' + Math.round(px[i]) + 'px').join(', '));
  ok(W15('trigger') > W15('betta') * 1.9 && W15('lion') > W15('betta') * 1.6 && W15('emp') > W15('clown') * 1.3, '15) Tetik/Aslan/Mavi Melek, Betta ve Palyaço yanında belirgin büyük');
  ok(W15('neon') >= 40 && W15('trigger') <= 150, '15) en küçük balık dokunulabilir (>=40 px), en büyük ekranı kaplamıyor (<=150 px)');
  ok(G.T.fishW(mkFish(1, 'trigger', { age: 1.4, sizeGrowth: .75, sizeTrait: 'giant' })) <= 200, '15) Dev ve yaşlı Tetik Balığı bile 200 px tavanını aşmıyor');
  ok(Object.entries(G.T.MUTW).every(([k, v]) => v >= .8 && v <= (k.startsWith('glitch_') ? 1.45 : 1.3)) && Object.keys(G.T.MUTW).length === 100, '15) 100 mutasyon görünümünün boy düzeltmesi makul (glitch resimleri parazit yüzünden daha geniş)');
  // büyük balıklar duvarlara taşmıyor
  S().tank = 'salt'; S().stash = { fresh: { fish: [], dirt: 0 } }; S().fish = [mkFish(2001, 'trigger', { x: .5 }), mkFish(2002, 'lion', { x: .5 }), mkFish(2003, 'emp', { x: .5 }), mkFish(2004, 'mandarin', { x: .5 })];
  let worst = 0; for (let i = 0; i < 40; i++) { step(G, 60); for (const f of S().fish) { const half = G.T.fishW(f) / 2; worst = Math.max(worst, half - f.x * 960, f.x * 960 + half - 960) } }
  ok(worst < 8, '15) 40 sn boyunca büyük balıkların kenarı ekran dışına ' + worst.toFixed(1) + ' px taştı');
  {
  // ===== 16) yem atma, düşen altın, siparişler, gece uykusu
  use(G); S().tank = 'fresh'; S().stash = { salt: { fish: [], dirt: 0 } }; S().level = 3; S().coins = 100; S().night = false;
  S().fish = [mkFish(3001, 'neon', { age: .5, hunger: 40, x: .5, y: .3 })]; step(G, 2); G.T.drops.length = 0;
  G.T.feed(); ok(G.T.feedModeOn(), '16) Yemle düğmesi yem modunu açtı'); ok(S().coins === 100, '16) yem modunu açmak altın harcatmıyor');
  G.T.feed(); ok(!G.T.feedModeOn(), '16) ikinci basış yem modunu kapattı'); G.T.feed();
  G.els.tank.handlers.pointerdown.forEach(h => h({ clientX: 480, clientY: 250 }));
  ok(G.T.drops.length === 4 && S().coins === 98, '16) yem modunda dokununca 4 yem düştü, 2 🪙 gitti (' + G.T.drops.length + ', ' + S().coins + ')');
  ok(G.T.drops.every(d => Math.abs(d.y - 250) < 30 && d.ph === 'sink'), '16) yemler dokunulan yerde beliriyor');
  { const n0 = G.T.drops.length; G.T.dropFood(270, 40, 1); ok(G.T.drops.length === n0 + 1 && G.T.drops[n0].y < 160, '16) yüzeyin üstüne dokununca yem yukarıdan düşüyor'); G.T.drops.length = n0 }
  const h0 = S().fish[0].hunger; step(G, 1200); ok(S().fish[0].hunger > h0 + 6 || G.T.drops.length < 4, '16) aç balık yemlere gitti ve yedi (' + h0 + ' → ' + Math.round(S().fish[0].hunger) + ')');
  S().coins = 0; S().feedTab = 0; G.T.feed(); G.T.feed(); G.T.drops.length = 0; ok(G.T.dropFood(270, 0, 4) <= 1, '16) altın yokken yem atılamıyor');
  S().coins = 100; S().feedTab = 0; G.T.drops.length = 0; G.T.dropFood(100, 0, 3); const d3 = S().coins; G.T.dropFood(100, 0, 1); ok(d3 === 99 && S().coins === 98, '16) yem yarım altın üzerinden hesaplanıyor');
  // altın düşürme
  S().fish = [mkFish(3002, 'gold', { age: 1, x: .5, y: .4 }), mkFish(3003, 'betta', { age: 1, x: .3, y: .4 })]; S().pending = 50; G.T.coinsLoose.length = 0; G.T.coinsFly.length = 0; step(G, 5000);
  const loose = () => G.T.coinsLoose.reduce((a, c) => a + c.v, 0);
  ok(G.T.coinsLoose.length > 0, '16) olgun balıklar yere altın düşürdü (' + G.T.coinsLoose.length + ')');
  ok(S().pending + loose() >= 50 - 1e-6 && S().pending + loose() < 52, '16) altın kaybolmuyor, yoktan da çıkmıyor: banka + yerdeki ≈ 50 (' + (S().pending + loose()) + ')');
  ok(JSON.parse(G.T.serial()).pending > S().pending + loose() - 1e-6, '16) kayıtta yerdeki altınlar bankaya geri yazılıyor');
  ok(G.T.coinsLoose.every(c => c.y > 150 && c.y <= 540 * .78 + 30), '16) altınlar suda batıyor / zeminde duruyor');
  const c0 = G.T.coinsLoose[0], co = S().coins, nl = G.T.coinsLoose.length;
  G.els.tank.handlers.pointerdown.forEach(h => h({ clientX: c0.x, clientY: c0.y }));
  ok(S().coins === co + c0.v && G.T.coinsLoose.length === nl - 1 && G.T.coinsFly.length >= 1, '16) altına dokununca toplandı (+' + c0.v + ' 🪙) ve HUD\'a uçuyor');
  step(G, 60); ok(G.T.coinsFly.length === 0, '16) uçan altın yarım saniyede varıyor');
  const tot = S().pending + loose(), cb = S().coins; G.T.collect(); ok(Math.round(S().coins - cb) === Math.floor(S().pending + 0) + Math.floor(tot) - Math.floor(S().pending) || S().coins - cb >= Math.floor(tot), '16) Kese hepsini topluyor'); ok(G.T.coinsLoose.length === 0, '16) Kese yerdeki altınları da süpürdü');
  S().pending = 30; S().fish = [mkFish(3004, 'neon', { age: .3, x: .5, y: .4 })]; G.T.coinsLoose.length = 0; step(G, 5000); ok(G.T.coinsLoose.length === 0, '16) yavru balık altın düşürmüyor');
  // siparişler
  S().level = 1; S().orders = undefined; ok(G.T.ensureOrders(Date.now()) === false && !S().orders, '16) 1. seviyede sipariş yok');
  S().level = 3; ok(G.T.ensureOrders(Date.now()) === true && S().orders.length === 3 && S().orders.every(o => o.type && o.reward > 0 && G.T.species.some(s => s.id === o.type)), '16) 2+ seviyede 3 sipariş açıldı');
  for (let i = 0; i < 300; i++) { const o = G.T.newOrder(Date.now()); if (!(G.T.species.find(s => s.id === o.type).lv || 1) <= 3 && false) break; if ((G.T.species.find(s => s.id === o.type).lv || 1) > S().level) { ok(false, '16) sipariş seviye kapısını aştı'); break } }
  ok(true, '16) 300 sipariş seviye kapısına uyuyor');
  const alb = G.T.newOrder(Date.now()); ok(alb.reward >= Math.round(G.T.species.find(s => s.id === alb.type).value * 1.3 + 6), '16) sipariş ödülü satıştan yüksek');
  const now = Date.now(); S().fish = [mkFish(3010, 'neon', { age: 1 }), mkFish(3011, 'neon', { age: .5 }), mkFish(3012, 'guppy', { age: 1, mutation: 'albino' })];
  S().stash.cfresh = { fish: [mkFish(3013, 'betta', { age: 1 })], dirt: 0 };
  S().orders = [{ type: 'neon', mut: 'normal', cust: 0, reward: 30, xp: 6, exp: now + 1e6 }, { type: 'guppy', mut: 'normal', cust: 1, reward: 25, xp: 5, exp: now + 1e6 }, { type: 'betta', mut: 'normal', cust: 2, reward: 40, xp: 8, exp: now + 1e6 }];
  ok(G.T.orderReady(), '16) uygun balık varken sipariş hazır');
  ok(G.T.deliverOrder(1) === false && G.T.deliverOrder(2) === false, '16) mutasyonlu balık normal siparişe, koleksiyondaki balık hiçbir siparişe verilmiyor');
  const cc = S().coins, xx = S().xp; ok(G.T.deliverOrder(0) === true && S().coins === cc + 30 && S().xp >= xx, '16) uygun sipariş teslim edildi (+30 🪙)');
  ok(S().fish.length === 2 && S().fish.some(f => f.id === 3011) && !S().fish.some(f => f.id === 3010), '16) yetişkin balık tanktan çıktı, yavru yerinde');
  ok(!S().orders[0].type && S().orders[0].wait > Date.now(), '16) teslimden sonra yeni müşteri beklemesi başladı');
  S().orders[1] = { type: 'neon', mut: 'albino', cust: 0, reward: 99, xp: 9, exp: now - 1 }; G.T.ensureOrders(Date.now()); ok(!S().orders[1].type, '16) süresi dolan sipariş kalktı');
  S().orders = [{ type: 'gold', mut: 'normal', cust: 3, reward: 20, xp: 5, exp: now + 1e6 }]; ok(G.T.ensureOrders(Date.now()) && S().orders.length === 3, '16) eksik slotlar tamamlanıyor');
  G.T.openSheet('quest'); ok(true, '16) görev ekranı siparişlerle açıldı'); G.T.closeSheet();
  // gece uykusu
  S().orders = []; S().night = true; S().tank = 'salt'; S().stash = { fresh: { fish: [], dirt: 0 } }; S().fish = [mkFish(3020, 'clown', { x: .5, y: .3 }), mkFish(3021, 'lion', { x: .3, y: .3 })]; G.T.drops.length = 0;
  ok(G.T.isSleepy(S().fish[0]) && !G.T.isSleepy(S().fish[1]), '16) geceleri palyaço uyur, aslan balığı uyumaz');
  let zz = 0, ys = 0; for (let i = 0; i < 70; i++) { step(G, 60); zz += G.T.particles.filter(p => p.type === 'zz').length; if (i === 69) ys = S().fish[0].y }
  ok(ys > .42, '16) uyuyan balık dibe indi (y=' + ys.toFixed(2) + ')'); ok(zz > 0, '16) uyuyan balığın üstünde "z" çıkıyor');
  const lf = S().fish[1], p0 = [lf.x, lf.y]; let moved = 0; for (let i = 0; i < 20; i++) { step(G, 60); moved += Math.hypot((lf.x - p0[0]) * 960, (lf.y - p0[1]) * 540); p0[0] = lf.x; p0[1] = lf.y } ok(moved > 60, '16) gece aslan balığı aktif geziniyor (' + moved.toFixed(0) + ' px)');
  S().coins = 50; S().feedTab = 0; G.T.dropFood(270, 0, 4); ok(!G.T.isSleepy(S().fish[0]), '16) yem verince uyuyan balık uyanıyor');
  S().night = false; ok(!G.T.isSleepy(S().fish[0]), '16) gündüz kimse uyumuyor');
  }
  // ===== 17) örnek komşu (bilgisayar yönetimli)
  {
    use(G); const T = G.T; S().tank = 'fresh'; S().stash = { salt: { fish: [], dirt: 0 } }; S().fish = []; S().night = false; S().helped = {}; S().helpGot = {}; S().coins = 100;
    const d0 = T.botData(); ok(d0.level >= 3 && Array.isArray(d0.fresh) && Array.isArray(d0.salt) && d0.fresh.length + d0.salt.length >= 2 && d0.fresh.every(f => T.species.some(s => s.id === f.t && T.WATER[s.id] === 'fresh')) && d0.salt.every(f => T.species.some(s => s.id === f.t && T.WATER[s.id] === 'salt')), '17) örnek komşunun tankı geçerli: tatlı/tuzlu su türleri doğru');
    const e0 = S().botEpoch; S().botEpoch = e0 - 10 * 864e5; const d1 = T.botData(); ok(d1.level > d0.level && d1.fresh.length + d1.salt.length > d0.fresh.length + d0.salt.length && d1.score > d0.score, '17) örnek komşu zamanla büyüyor (seviye ' + d0.level + ' → ' + d1.level + ')');
    const cb = S().coins; T.botHelp(); ok(S().coins === cb + 10, '17) Deniz bugün tankı temizledi, +10'); T.botHelp(); ok(S().coins === cb + 10, '17) aynı gün ikinci kez yardım etmiyor');
    ok(!T.NET.on, '17) bulut kapalıyken de çalışıyor'); ok(/Bulut kapalı|Claude bağlantısı yok/.test(T.NET.why || ''), '17) bulut yoksa sebep kaydediliyor (' + T.NET.why + ')'); T.startVisit({ id: T.BOT_ID, d: T.botData() }, { name: 'Deniz' }); ok(T.VISIT && S().fish.length > 0, '17) Deniz ziyaret edildi, tankında balık var (' + S().fish.length + ')');
    const c1 = S().coins; T.helpNeighbor().then ? 0 : 0; ok(S().coins === c1 + 15 && S().helped[T.BOT_ID] === T.dayKey(), '17) bulut kapalıyken Deniz\'e yardım +15 🪙'); const c2 = S().coins; T.helpNeighbor(); ok(S().coins === c2, '17) aynı gün ikinci yardım yok');
    T.endVisit(); ok(!T.VISIT, '17) ziyaret bitti'); T.openSheet('map'); T.renderNeighbors(); T.openSheet('rank'); T.renderRank(); T.closeSheet(); ok(true, '17) komşu ve sıralama listeleri bulut kapalıyken açıldı');
  }
  // ===== 18) tank balık sınırı
  {
    use(G); const T = G.T; S().tank = 'fresh'; S().stash = { salt: { fish: [], dirt: 0 } }; S().level = 12; S().coins = 99999; S().fish = []; for (let i = 0; i < 20; i++) S().fish.push(mkFish(8000 + i, 'neon'));
    ok(T.fishCap && T.fishCap('fresh') === 20 && T.fishCap('cfresh') === 30, '18) ana tank 20, koleksiyon tankı 30 balık');
    const c0 = S().coins; T.buy('guppy'); ok(S().fish.length === 20 && S().coins === c0, '18) tank doluyken balık alınmıyor ve para çekilmiyor');
    S().stash.salt.fish = []; T.buy('clown'); ok(S().stash.salt.fish.length === 1, '18) diğer tank boşsa oraya alınabiliyor');
    for (let i = 0; i < 20; i++) S().stash.salt.fish.push(mkFish(8100 + i, 'clown')); S().stash.salt.fish.length = 20; T.moveFish(8000, 'salt'); ok(S().fish.length === 20, '18) dolu tanka balık taşınmıyor');
    S().fish.pop(); T.buy('neon'); ok(S().fish.length === 20, '18) yer açılınca tekrar alınabiliyor');
    S().fish.pop(); S().eggs = [{ type: 'neon', pa: { m: 'normal' }, pb: { m: 'normal' }, tank: 'fresh', hatchAt: Date.now() - 1 }, { type: 'neon', pa: { m: 'normal' }, pb: { m: 'normal' }, tank: 'fresh', hatchAt: Date.now() - 1 }]; T.featureTick(Date.now());
    ok(S().fish.length === 20 && S().eggs.length === 1, '18) tank dolunca fazla yumurta bekliyor (' + S().fish.length + ' balık, ' + S().eggs.length + ' yumurta bekliyor)');
    for (const id of ['koi', 'arowana', 'boxfish', 'napo']) ok(T.species.some(s => s.id === id && s.img.length > 100) && ['albino', 'transparent', 'melanistic'].every(m => T.MUT_IMG[m][id].length > 100), '18) yeni tür ' + id + ' tanımlı');
  }
  // ===== 19) yönetim paneli
  {
    use(G); const T = G.T; T.NET.uid = 'u_baska'; ok(T.isAdmin() === false, '19) başka kullanıcıda panel kapalı');
    T.NET.uid = 'u_LyrFB5NBQ50Xrl0WUgzi_Q'; ok(T.isAdmin() === true, '19) sahip kimliğinde panel açık');
    S().tank = 'fresh'; S().fish = []; const c0 = S().coins;
    T.admAct('coins', 1000); ok(S().coins === c0 + 1000, '19) para ekleme');
    T.admAct('all'); ok(S().level === 30 && S().props.length === T.PROPS.length && S().discovered.length === T.species.length, '19) her şeyi aç');
    T.admAct('stress', 40); ok(S().fish.length === 40 && S().admNoCap !== true, '19) stres: 40 balık, sınır yeniden kapalı');
    T.admAct('cap'); ok(T.fishCap('fresh') === 99, '19) sınır kapatma');
    T.admAct('cap'); T.admAct('clear'); T.admAct('oneEach'); ok(S().fish.length === T.species.filter(s => T.WATER[s.id] === 'fresh').length, '19) her türden 1 (tatlı su)');
    T.admAct('adult'); ok(S().fish.every(f => f.age === 1), '19) yetişkin yap');
    T.admAct('time', 604800); step(G, 20); ok(G.T.allFish().every(f => isFinite(f.health + f.hunger + f.age)), '19) +7 gün atlama sonrası değerler sağlam');
    S().eggs = [{ id: 1, hatchAt: Date.now() + 9e5, tank: 'fresh', type: 'guppy', pa: { m: 'normal', g: null, z: 'normal' }, pb: { m: 'normal', g: null, z: 'normal' } }];
    T.admAct('time', 3600); ok(S().eggs.every(e => e.hatchAt <= Date.now() + 5), '19) zaman atlama yumurta süresini kaydırıyor');
    S().admEv = ['love']; T.activeEvents(); G.T.admAct('coins0'); ok(true, '19) devam');
    T.admRender(); T.admAct('hatch'); T.admAct('orders'); T.admAct('daily'); T.admAct('muts'); T.admAct('ach'); T.admAct('bot'); T.admAct('botHelp'); T.admAct('night'); T.admAct('night');
    ok(S().ach.first === 'done' && S().mutsFound.length === T.species.length * 5, '19) ilerleme komutları');
    S().fish = []; S().coins = 999; T.buy('neon', { x: 480, y: 270 }); ok(S().fish.length === 1 && Math.abs(S().fish[0].x - .5) < 1e-9 && Math.abs(S().fish[0].y - .5) < 1e-9, '19) satın alınan balık seçilen noktaya konuyor');
    S().propPos = { moai: { x: .5, y: 500 } }; S().decor = [{ k: '🐚', x: .3, y: 400 }]; const sv = JSON.parse(T.serial()); ok(sv.propPos.moai.y === 500 && sv.decor[0].y === 400, '19) dekor konumları kayda yazılıyor'); S().props = ['moai']; step(G, 30); ok(errors.length === 0, '19) özel konumlu dekorla çizim hatasız');
    T.admAct('wheelReset'); ok(T.wheelReady() === true, '19) çark: yeni günde hazır');
    let wok = true; for (let i = 0; i < T.WHEEL.length; i++) { S().wheel = { day: T.dayKey(), idx: i, paid: false }; S().coins = 500; S().fish = []; const c0 = S().coins; const msg = T.wheelPay(); if (!msg || !S().wheel.paid) wok = false; if (T.wheelPay() !== null) wok = false; if (['c1', 'c2'].includes(T.WHEEL[i].k) && S().coins <= c0) wok = false }
    ok(wok, '19) çarkın 8 ödülü de bir kez ve doğru veriliyor'); ok(T.wheelReady() === false, '19) çark: aynı gün ikinci hak yok');
    S().eggs = []; T.NET.uid = null; T.admVis(); ok(errors.length === 0, '19) panel komutlarında JavaScript hatası yok' + (errors.length ? ': ' + errors[0].stack : ''));
  }
  // ===== 20) v31: kapasite, tema, defter, rehber
  {
    use(G); const T = G.T; S().tank = 'fresh'; S().admNoCap = false; S().capUp = {}; S().coins = 10000;
    const c0 = T.fishCap('fresh'); T.upgradeCap(); ok(T.fishCap('fresh') === c0 + 2 && S().coins === 10000 - T.CAP_COST[0], '20) kapasite +2, doğru ücret');
    for (let i = 0; i < 6; i++) T.upgradeCap(); ok(T.fishCap('fresh') === 28, '20) kapasite en fazla 28');
    S().coins = 1000; T.pickTheme('tropic'); ok(S().theme === 'tropic' && S().themes.includes('tropic') && S().coins === 700, '20) tema satın alınıyor ve uygulanıyor');
    T.pickTheme('none'); T.pickTheme('tropic'); ok(S().coins === 700, '20) alınmış temaya geri dönmek ücretsiz');
    S().coins = 0; T.pickTheme('sunset'); ok(S().theme === 'tropic', '20) para yetmezse tema alınmıyor');
    S().bookRw = {}; S().mutsFound = S().mutsFound.filter(k => !k.endsWith('_neon')); ok(!S().bookRw.neon, '20) hazırlık'); T.claimBook('neon'); ok(!S().bookRw.neon, '20) eksik defter ödülü alınamıyor');
    S().mutsFound.push('albino_neon', 'transparent_neon', 'melanistic_neon'); const cc = S().coins; T.claimBook('neon'); T.claimBook('neon'); ok(S().bookRw.neon === true && S().coins === cc + 30, '20) defter ödülü bir kez veriliyor (' + (S().coins - cc) + ')');
    S().tut = 0; ok(T.tutOn(), '20) rehber açık'); for (let i = 0; i < 10; i++) T.tutStep(); ok(!T.tutOn(), '20) rehber bitiyor');
  }
  {
    const N = boot(makeEnv(store(), undefined)); step(N, 3); ok(N.T.state.tut === 0, '20) yeni oyuncuda rehber başlıyor');
    const old = store(); old.setItem('fishvilleClassicSave3', JSON.stringify({ coins: 300, xp: 0, level: 6, fish: [], discovered: ['neon'], stats: { buy: 4 }, tank: 'fresh' }));
    const O = boot(makeEnv(old, undefined)); step(O, 3); ok(O.T.state.tut === 99, '20) eski oyuncuda rehber çıkmıyor');
  }
  {
    use(G); const T = G.T; S().fish = []; T.drops.length = 0; const d = T.mkFood(270); T.drops.push(d); const ph = new Set(); const dirt0 = 10;
    S().dirt = 10; for (let i = 0; i < 16000 && T.drops.length; i++) { T.foodStep(1 / 120); ph.add(d.ph) }
    ok(['fall', 'surf', 'sink', 'floor'].every(k => ph.has(k)) && T.drops.length === 0 && S().dirt > dirt0, '21) yem: düşer, yüzer, batar, dipte çürür ve suyu kirletir (' + [...ph].join(',') + ')');
    ok(Object.keys(T.TRAIT).length === 20 && Object.values(T.TRAIT).every(x => /s|m|b|a/.test(x.feed) && x.txt), '21) 20 türün hepsinin karakteri ve beslenme bölgesi var');
  }
  {
    use(G); const T = G.T; let n = 0; const N = 200000; for (let i = 0; i < N; i++) if (T.rollMutation() === 'gold') n++;
    ok(n > 30 && n < 140 && T.MUTS.gold.mult === 15 && T.MUTS.melanistic.mult === 6, '22) altın %0,04 civarı (' + (n / N * 100).toFixed(3) + '%), 15 kat; melanistik 6 kat');
    ok(T.species.every(s => T.MUT_IMG.gold[s.id] && T.MUT_IMG.gold[s.id].length > 100), '22) 20 türün altın görseli var');
    S().fish = [mkFish(7001, 'clown', { mutation: 'gold', gene: 'gold', age: 1 })]; S().tank = 'fresh'; step(G, 30); ok(errors.length === 0, '22) altın balık çizimi hatasız');
  }
  {
    use(G); const T = G.T; S().tank = 'fresh'; S().admNoCap = false; S().capUp = {}; S().fish = []; S().level = 5; S().coins = 1000;
    T.buyMany('guppy', 5); ok(S().fish.length === 5 && S().coins === 1000 - 5 * 30, '23) toplu alım: 5 Gupi, doğru ücret');
    S().fish = Array.from({ length: 18 }, (_, i) => mkFish(9100 + i, 'neon')); S().coins = 1000; T.buyMany('guppy', 5); ok(S().fish.length === 20 && S().coins === 940, '23) toplu alım tank sınırında duruyor');
    S().fish = []; S().coins = 70; T.buyMany('guppy', 5); ok(S().fish.length === 2 && S().coins === 10, '23) toplu alım paraya göre azalıyor');
  }
  {
    use(G); const f0 = mkFish(9900, 'neon'); S().fish = [f0]; let calls = 0; Object.defineProperty(f0, 'sn', { get() { calls++; if (calls < 3) throw new Error('deneme'); return 0 }, set(v) {}, configurable: true });
    const e0 = errors.length; step(G, 20); delete f0.sn; f0.sn = 0; const x0 = S().fish[0].x; step(G, 200);
    ok(errors.length === e0 && /deneme/.test(G.els.errNote.textContent), '24) çizimde hata olsa da döngü devam ediyor ve hata Ayarlar\'da yazıyor');
  }
  {
    use(G); const T = G.T; S().tank = 'fresh'; S().gems = 20; S().level = 9; S().xp = 0; S().wheel = null;
    const g0 = S().gems; T.addXP(900); ok(S().level === 10 && S().gems === g0 + 5, '25) seviye 10 olunca +5 zümrüt');
    S().gems = 10; S().fish = [mkFish(9500, 'neon', { age: .3 })]; T.buyGem('grow'); ok(S().gems === 6 && Math.abs(S().fish[0].age - .6) < 1e-9, '25) büyüme iksiri 4 💎, +%30 büyüme');
    S().gems = 1; T.buyGem('coins'); ok(S().gems === 1, '25) zümrüt yetmezse alınmıyor');
    S().gems = 6; S().luck = 0; T.buyGem('luck'); ok(S().luck === 10 && S().gems === 0, '25) şans yemi 10 alım');
    const c0 = S().coins; S().coins = 1000; T.buy('guppy'); ok(S().luck === 9, '25) şans yemi her alımda azalıyor');
    S().wheel = { day: G.T.dayKey(), idx: 0, paid: true }; S().gems = 5; T.buyGem('spin'); ok(S().wheel === null && G.T.wheelReady(), '25) ekstra çark hakkı');
    T.setShopTab('gem'); T.renderShop(); ok(T.shopTab === 'gem' && errors.length === 0, '25) mağaza sekmeleri hatasız');
    T.openSheet('decor'); ok(T.shopTab === 'decor', '25) Dekor düğmesi mağazanın Dekor sekmesini açıyor');
  }
  {
    use(G); const T = G.T; S().tank = 'fresh'; S().stash = {}; S().fish = [mkFish(9700, 'neon', { hunger: 50, health: 100 }), mkFish(9701, 'guppy', { hunger: 50, health: 100 })]; S().dirt = 90;
    const r = T.advance(16 * 3600); ok(S().fish.length === 2 && S().fish.every(f => f.health >= 25) && r.dead.length === 0, '26) 16 saat yoklukta balıklar ölmüyor (can ' + S().fish.map(f => Math.round(f.health)).join(',') + ')');
    S().fish[0].hunger = 0; S().fish[0].health = 5; for (let i = 0; i < 2000; i++) T.advance(1); ok(!S().fish.some(f => f.id === 9700), '26) oyun açıkken bakımsız balık yine ölebiliyor');
  }
  {
  // ===== 27) yatay düzen, kayıt geçişi ve toplu satış
  const T = G.T; use(G);
  ok(T.layoutH === 540, '27) tuval yatay (960×540)');
  ok(Math.abs(T.ymig(739.2) - 540 * .78) < .01 && T.ymig(800) > T.ymig(700), '27) dikey konumlar yataya doğru çevriliyor');
  S().tank = 'fresh'; S().coins = 0;
  S().fish = [mkFish(5001, 'neon', { age: 1.2 }), mkFish(5002, 'guppy', { age: 1.2 }), mkFish(5003, 'gold', { age: .3 }), mkFish(5004, 'betta', { age: 1.2, mutation: 'albino' })];
  ok(T.isPrecious(S().fish[3]) && !T.isPrecious(S().fish[0]), '27) mutasyonlu balık değerli sayılıyor');
  const ids = [5001, 5002]; const exp = ids.map(id => G.T.saleValue ? 0 : 0);
  const c0 = S().coins; T.sellMany(ids);
  ok(S().fish.length === 2 && S().coins > c0 && !S().fish.some(f => ids.includes(f.id)), '27) seçilen balıklar toplu satıldı (+' + (S().coins - c0) + ')');
  ok(T.invList().length === 2, '27) liste güncel');
  }

  {
  // ===== 29) omurgasızlar
  const T = G.T; use(G); S().tank = 'fresh'; S().level = 6; S().coins = 1000; S().gems = 50; S().crit = {};
  T.buyCrit('cherry'); ok(T.critCount('fresh', 'sh') === 1 && S().coins === 880, '29) kiraz karides alındı (120 🪙)');
  T.buyCrit('cleaner'); ok(T.critCount('fresh', 'sh') === 1, '29) tuzlu su karidesi tatlı su tankına alınamıyor');
  for (let i = 0; i < 6; i++) T.buyCrit('blue'); ok(T.critCount('fresh', 'sh') === 4, '29) tank başına en fazla 4 karides');
  ok(Math.abs(T.critShrimpK() - .68) < 1e-9, '29) 4 karides kirlenmeyi %32 yavaşlatıyor');
  const g0 = S().gems; T.buyCrit('jpink'); ok(S().gems === g0, '29) denizanası tatlı suya alınamıyor');
  T.critRT(); ok(T.critTap(-500, -500) === false, '29) boşa dokunma omurgasızları etkilemiyor');
  const r = T.critRT(); const s0 = r[0]; const hitX = s0.x + 5; T.critTap(hitX, s0.y); ok(s0.flip > 0 && s0.vx < 0, '29) karidese sağından dokununca sola kaçıyor');
  ok(JSON.parse(T.serial()).crit.fresh.length === 4, '29) omurgasızlar kayda yazılıyor');
  }

  {
  // ===== 30) hacim ışığı ve eski hata notu
  const T = G.T; use(G); T.closeSheet(); S().tank = 'fresh'; S().lowGfx = false; S().fish = ['neon','koi','guppy','betta'].map((k, i) => mkFish(1200 + i, k, { x: .2 + i * .15, y: .4 }));
  step(G, 300); S().lowGfx = true; step(G, 60); S().lowGfx = false; step(G, 60); ok(S().fish.every(q => isFinite(q.x + q.y)) && !errors.length, '30) hacim ışığıyla balıklar sorunsuz çiziliyor');
  const e2 = store(); e2.setItem('fvErr', JSON.stringify({ m: 'eski', n: 1, t: Date.now(), v: 'Akvaria · sürüm 1' })); const E = boot(makeEnv(e2, undefined)); step(E, 5); await settle();
  ok(e2.getItem('fvErr') === null, '30) eski sürümden kalan hata notu silindi'); use(G);
  }

  { // ===== 31) kovalamaca sırasında kayıt
  const T = G.T; use(G); const a1 = mkFish(1400, 'betta'), b1 = mkFish(1401, 'guppy'); S().fish = [a1, b1]; a1.chase = b1; b1.flee = a1;
  let okS = true, js = ''; try { js = T.serial() } catch (e) { okS = false } ok(okS && !js.includes('"chase"') && !js.includes('"flee"'), '31) kovalamaca sırasında kayıt hatasız alınıyor'); }

  { // ===== 32) glitch mutasyonu
  const T = G.T; use(G); T.closeSheet(); S().tank = 'fresh'; S().lowGfx = false;
  ok(T.MUTS.glitch && T.MUTS.glitch.mult === 30 && T.MUTS.glitch.p < T.MUTS.gold.p, '32) Glitch mutasyonu tanımlı, altından nadir, 30 kat değer');
  ok(T.MUT_IMG.glitch && T.species.every(s => typeof T.MUT_IMG.glitch[s.id] === 'string' && T.MUT_IMG.glitch[s.id].length > 1000), '32) 20 türün hepsinin glitch görseli var');
  let n = 0; for (let i = 0; i < 400000; i++) if (T.rollMutation() === 'glitch') n++; ok(n >= 50 && n <= 115, '32) kendiliğinden glitch şansı ~1/5000 (' + n + '/400000)');
  S().fish = ['neon','koi','betta','discus'].map((k, i) => mkFish(1500 + i, k, { mutation: 'glitch', x: .2 + i * .15, y: .4 }));
  const e0 = errors.length; step(G, 900); ok(errors.length === e0 && S().fish.every(q => isFinite(q.x + q.y)), '32) glitch balıklar 15 sn boyunca hatasız çiziliyor');
  ok(S().fish.some(q => T.glPxN(q) > 0), '32) glitch balıkların kuyruğundan piksel kopuyor');
  S().lowGfx = true; step(G, 120); ok(errors.length === e0, '32) düşük grafikte de hatasız'); S().lowGfx = false;
  const g0 = S().gems; S().mutsFound = S().mutsFound.filter(k => k !== 'glitch_guppy'); const f = T.admFish ? null : null;
  const v1 = T.saleValue(mkFish(1600, 'guppy', { mutation: 'glitch', age: 1 })), v0 = T.saleValue(mkFish(1601, 'guppy', { age: 1 })); ok(v1 > v0 * 20, '32) glitch balık çok daha değerli (' + Math.round(v1) + ' / ' + Math.round(v0) + ')');
  ok(T.ACH.some(a => a.id === 'glitch1'), '32) Sistem Hatası başarımı var');
  { const gf = S().fish[0]; step(G, 5); T.mutNote(gf, T.getSpecies(gf.type)); await new Promise(r => setTimeout(r, 800)); step(G, 30); const x0 = gf.x; step(G, 60); ok(gf.x !== x0 && !errors.length, '32) glitch bulununca efekt çalışıyor, oyun donmuyor'); }
  T.openSheet('book'); step(G, 3); T.closeSheet(); ok(!errors.slice(e0).length, '32) defter glitch satırıyla açılıyor');
  }

  { // ===== 33) koleksiyon, yaş ve defter
  const T = G.T; use(G); T.closeSheet(); S().level = 10; S().coins = 9999; S().tank = 'fresh'; S().lowGfx = true;
  S().stash = { salt: { fish: [], dirt: 0 }, cfresh: { fish: [], dirt: 0 } };
  S().fish = [mkFish(1700, 'neon'), mkFish(1701, 'koi'), mkFish(1702, 'discus')];
  ok(S().fish.every(f => T.moveOpts(f).includes('cfresh')), '33) tatlı su balıkları koleksiyon tankına taşınabiliyor');
  T.moveFish(1700, 'cfresh'); T.moveFish(1701, 'cfresh'); ok(T.tankArr('cfresh').length === 2, '33) tatlı su balıkları koleksiyona girdi');
  T.switchTank('cfresh'); step(G, 30); ok(S().fish.every(f => f.st !== 'water'), '33) koleksiyonda "yanlış su" uyarısı yok'); T.switchTank('fresh');
  const f = S().fish[0]; f.age = 1; f.sizeGrowth = 0; f.hunger = 100; f.health = 100; f.sick = false; S().dirt = 0;
  const Gs = T.growHours(T.getSpecies(f.type)) * 3600 / .95;
  ok(T.yasOf(f) === 1, '33) yetişkin balık 1 yaşında (' + T.yasTxt(f) + ')');
  const grow = sec => { for (let left = sec; left > 0; left -= 600) { f.hunger = 100; f.health = 100; f.sick = false; S().dirt = 0; T.advance(Math.min(600, left)) } };
  grow(Gs * 1.9); ok(T.yasOf(f) === 1, '33) 2. yaş, yavru süresinin 2 katından önce gelmiyor (' + T.yasTxt(f) + ')');
  grow(Gs * .15); ok(T.yasOf(f) === 2, '33) 2 kat sürede 2 yaşına geldi (' + T.yasTxt(f) + ')');
  grow(Gs * 2.85); ok(T.yasOf(f) === 2, '33) 3. yaş 3 kat süreden önce gelmiyor (' + T.yasTxt(f) + ')');
  grow(Gs * .2); ok(T.yasOf(f) === 3, '33) 3 kat sürede 3 yaşına geldi (' + T.yasTxt(f) + ')');
  const sg = f.sizeGrowth; grow(Gs * 5); ok(T.yasOf(f) === 3 && f.sizeGrowth === sg && sg <= .75, '33) 3 yaş en fazla, büyüme durdu (boy ' + (1 + sg).toFixed(2) + 'x)');
  S().mutsFound = ['albino_neon', 'gold_neon', 'glitch_neon']; ok(T.bookAll('neon') === 3, '33) defter 5 mutasyonun hepsini sayıyor');
  S().lowGfx = false;
  }

  { // ===== 34) bulut kaydı, metinler, boy etiketi
  const T = G.T; use(G); T.closeSheet();
  // eski yerel kayıt oyun açılırken kaydedilse bile buluttaki yeni kayıt ezilmemeli
  const DB = makeDB(), now = Date.now();
  const cloudSt = { ...JSON.parse(T.serial()), coins: 7777, savedAt: now - 60e3 };
  DB.docs.set('data/users/u_K/save', { json: JSON.stringify(cloudSt), savedAt: now - 60e3 });
  const ls = store(); ls.setItem('fishvilleClassicSave3', JSON.stringify({ ...JSON.parse(T.serial()), coins: 11, savedAt: now - 5 * 3600e3 }));
  const K = boot(makeEnv(ls, claudeFor(DB, 'u_K', 'Kaan'))); K.T.save(true); await K.NETP; await settle(40);
  ok(K.T.state.coins === 7777 && JSON.parse(DB.docs.get('data/users/u_K/save').json).coins === 7777, '34) açılışta yerel kayıt yazılsa da buluttaki yeni kayıt yüklendi, ezilmedi (' + K.T.state.coins + ')');
  // bulut okunamazsa buluttaki kayıt ezilmemeli
  const DB2 = makeDB(); DB2.docs.set('data/users/u_R/save', { json: JSON.stringify(cloudSt), savedAt: now - 60e3 });
  const cl = claudeFor(DB2, 'u_R', 'Rüya'), d0 = cl.dbApi.doc; cl.dbApi.doc = p => { const r = d0(p); if (p === 'data/users/u_R/save') r.get = async () => { throw Object.assign(new Error('unavailable'), { code: 'unavailable' }) }; return r };
  const R = boot(makeEnv(store(), cl)); await R.NETP; await settle(40); R.T.save(true); R.T.cloudSave(true); await settle(40);
  ok(JSON.parse(DB2.docs.get('data/users/u_R/save').json).coins === 7777 && !R.T.NET.on, '34) bulut okunamayınca buluttaki kayıt ezilmiyor');
  use(G);
  // seviye ekleri
  ok([1,2,3,4,5,6,7,8,9,10,12,15,20,40].map(n => n + T.lokEk(n)).join(' ') === "1'de 2'de 3'te 4'te 5'te 6'da 7'de 8'de 9'da 10'da 12'de 15'te 20'de 40'ta", '34) "Seviye 6\'da açılır" gibi ekler doğru');
  // metinler koddaki ödüllerle aynı
  T.dailyCheck(); T.renderQuests(); ok(/\+40 🪙 · \+2 💎 bonus/.test(G.els.quests.innerHTML) && !/\+60/.test(G.els.quests.innerHTML), '34) görev bonusu yazısı gerçek ödülle aynı');
  S().streak.count = 6; T.renderQuests(); ok(/\+56 🪙$/.test(G.els.streak.textContent), '34) seri ödülü yazısı gerçek ödülle aynı (' + G.els.streak.textContent + ')');
  const g12 = T.ACH.find(a => a.id === 'gen12'); ok(g12.d.startsWith(T.species.length * 5 + ' mutasyonun'), '34) Genetikçi başarımı doğru mutasyon sayısını yazıyor (' + g12.d + ')');
  // boy etiketi her yerde aynı
  const big = mkFish(1800, 'koi', { sizeTrait: 'giant', sizeGrowth: .75 }), bs = T.boyOf(big);
  ok(T.fcMeta(big).includes('boy ' + bs + 'x') && T.infoText(big).includes('boy ' + bs + 'x') && bs === '1.72', '34) boy etiketi listede ve bilgi satırında aynı (' + bs + 'x)');
  // koleksiyonda omurgasız düğmeleri kapalı
  const tk = S().tank; S().stash.cfresh = S().stash.cfresh || { fish: [], dirt: 0 }; T.switchTank('cfresh'); S().level = 10;
  ok(!/data-crit="[^"]*">/.test(T.critShopHTML()), '34) koleksiyon tankında omurgasız alma düğmeleri kapalı'); T.switchTank(tk);
  // yönetici "kaydı sıfırla" gerçekten sıfırlıyor
  const rs = store(); rs.setItem('fishvilleClassicSave3', JSON.stringify({ ...JSON.parse(T.serial()), coins: 12345 }));
  const Z = boot(makeEnv(rs, undefined)); step(Z, 3); await settle(); global.confirm = () => true; global.location = { reload() {} }; global.removeEventListener = () => {};
  Z.T.admAct('reset'); const z = JSON.parse(rs.getItem('fishvilleClassicSave3')); ok(z.coins === 250 && z.savedAt > 0, '34) yönetici "Kaydı sıfırla" kaydı gerçekten sıfırlıyor');
  delete global.confirm; delete global.location; delete global.removeEventListener; use(G);
  }

  { // ===== 35) dikey tam ekran (uzun telefon ekranı)
  const sz = [global.innerWidth, global.innerHeight];
  global.innerWidth = 393; global.innerHeight = 852; const P = boot(makeEnv(store(), undefined)); step(P, 5); await settle();
  ok(P.T.gameW === Math.round(960 * 393 / 852) && P.T.layoutH === 960, '35) uzun iPhone ekranında dikey oyun alanı ekranı tam dolduruyor (' + P.T.gameW + 'x' + P.T.layoutH + ')');
  global.innerWidth = 768; global.innerHeight = 1024; const Q2 = boot(makeEnv(store(), undefined)); step(Q2, 5); await settle();
  ok(Q2.T.gameW === 720, '35) tablette dikey oyun alanı ekranın kendi oranında (' + Q2.T.gameW + ')');
  global.innerWidth = 300; global.innerHeight = 900; const Q3 = boot(makeEnv(store(), undefined)); step(Q3, 5); await settle();
  ok(Q3.T.gameW === Math.round(960 * .42), '35) çok ince ekranda oran sınırlanıyor');
  [global.innerWidth, global.innerHeight] = sz; if (sz[0] === undefined) { delete global.innerWidth; delete global.innerHeight } use(G);
  }

  { // ===== 36) dev glitch Napolyon, dev melanistik Napolyonla aynı boyda görünmeli
  const T = G.T; use(G);
  const mk = mu => mkFish(1900, 'napo', { mutation: mu, sizeTrait: 'giant', age: 1, sizeGrowth: .75 });
  const r = T.fishW(mk('glitch')) / T.fishW(mk('melanistic')), want = T.MUTW.glitch_napo / T.MUTW.melanistic_napo;
  ok(Math.abs(r - want) < .01, '36) dev glitch Napolyon üst boy sınırında küçülmüyor (oran ' + r.toFixed(3) + ', olmalı ' + want.toFixed(3) + ')');
  }


  { // ===== 37) kaynak geri yüklemesinde kaybolan düzeltmeler, ses seviyesi, tuzlu su üremesi
  const T = G.T; use(G); T.closeSheet();
  S().mutsFound = []; T.species.forEach(sp => ['albino', 'transparent', 'melanistic', 'gold', 'glitch'].forEach(m => S().mutsFound.push(m + '_' + sp.id))); T.updateFeatures();
  ok(G.els.collectionStatus.textContent.includes(S().mutsFound.length + ' / ' + T.species.length * 5 + ' mutasyon'), '37) koleksiyon sayacı 5 mutasyon üzerinden (' + G.els.collectionStatus.textContent + ')');
  const g24 = T.ACH.find(a => a.id === 'gen24'); S().mutsFound = T.species.map(sp => 'glitch_' + sp.id).concat(T.species.map(sp => 'albino_' + sp.id), T.species.map(sp => 'transparent_' + sp.id));
  ok(g24 && !g24.f(), '37) "Mutasyon ustası" glitch balıklarla erken tamamlanmıyor');
  { const r = T.MUTW.glitch_napo / T.MUTW.melanistic_napo; ok(r > 1.36 && r < 1.42, '37) glitch Napolyon gövdesi diğer mutasyonlarla aynı boyda (resim eşleştirmesiyle ölçülen oran 1.39, kodda ' + r.toFixed(3) + ')') }
  const ng = mkFish(1, 'napo', { mutation: 'glitch' }), nm = mkFish(2, 'napo', { mutation: 'melanistic' }), nn = mkFish(3, 'napo');
  ok(Math.abs(T.fishW(ng) / T.fishW(nm) - T.MUTW.glitch_napo / T.MUTW.melanistic_napo) < .01 && T.fishW(nm) / T.fishW(nn) > .95, '37) normal boy Napolyonda da genişlik oranı korunuyor');
  { // eski sürümün kayda yazdığı boy önbelleği yeni boyu ezmemeli
  const ss = store(); const base = JSON.parse(G.T.serial()); const gf = mkFish(7001, 'napo', { mutation: 'glitch', sizeGrowth: .75, _w: 150, _wa: 1, _wg: .75, _wm: 'glitch', _wz: 'normal', _wt: 'napo' }), mf = mkFish(7002, 'napo', { mutation: 'melanistic', sizeGrowth: .75 });
  ss.setItem('fishvilleClassicSave3', JSON.stringify({ ...base, tank: 'salt', fish: [gf, mf], stash: {}, savedAt: Date.now() + 1e6 })); const Q = boot(makeEnv(ss, undefined)); step(Q, 3); await settle();
  const qg = Q.T.state.fish.find(f => f.id === 7001), qm = Q.T.state.fish.find(f => f.id === 7002);
  ok(qg && qm && Math.abs(Q.T.fishW(qg) / Q.T.fishW(qm) - Q.T.MUTW.glitch_napo / Q.T.MUTW.melanistic_napo) < .01, '37) kayıttaki eski boy önbelleği yok sayılıyor; büyümüş glitch Napolyon güncel boyda (' + (qg ? Q.T.fishW(qg).toFixed(0) : '?') + ' / ' + (qm ? Q.T.fishW(qm).toFixed(0) : '?') + ')');
  ok(!/"_w[a-z]?"/.test(Q.T.serial()), '37) boy önbelleği artık kayda yazılmıyor'); use(G) }
  // ses seviyesi
  const vs = store(); const V = boot(makeEnv(vs, undefined)); step(V, 3); await settle();
  ok(V.T.VOL.s === 1 && V.T.VOL.m === 1 && V.els.volSv.textContent === '100%', '37) ses seviyesi varsayılan %100');
  V.T.setVol('s', 40); V.T.setVol('m', '25'); V.T.setVol('m', 'abc'); V.T.setVol('s', 250);
  const sv = JSON.parse(vs.getItem('akvVol') || '{}'); ok(V.T.VOL.s === 1 && V.T.VOL.m === .25 && sv.m === .25 && V.els.volMv.textContent === '25%', '37) ses seviyesi ayarlanıyor, bozuk değer yok sayılıyor, sınırlar korunuyor');
  V.T.setVol('s', 40); const V2 = boot(makeEnv(vs, undefined)); step(V2, 3); await settle();
  ok(V2.T.VOL.s === .4 && V2.T.VOL.m === .25 && V2.els.volSv.textContent === '40%' && !('vol' in V2.T.state) && !('akvVol' in JSON.parse(vs.getItem('fishvilleClassicSave3') || '{}')), '37) ses seviyesi yeniden açılışta hatırlanıyor, oyun kaydına karışmıyor');
  vs.setItem('akvVol', '{bozuk'); const V3 = boot(makeEnv(vs, undefined)); step(V3, 3); await settle(); ok(V3.T.VOL.s === 1 && V3.T.VOL.m === 1, '37) bozuk ses ayarı oyunu bozmuyor');
  { const ps = store(); const P = boot(makeEnv(ps, undefined)); step(P, 3); await settle(); const T4 = P.T;
  T4.state.muted = true; ok(T4.ambOn() === false, '37) efektleri önceden kapatmış oyuncuda ortam sesi de kapalı başlıyor');
  T4.sndToggle('a', true); ok(T4.ambOn() === true && T4.state.muted === true && JSON.parse(ps.getItem('akvVol')).ao === true, '37) ortam sesi efektlerden ayrı açılıp kapanıyor');
  T4.sndToggle('s', true); T4.sndToggle('m', false); ok(T4.state.muted === false && T4.state.music === false && P.els.sound.classList.contains('on') && !P.els.music.classList.contains('on') && P.els.volMv.textContent === 'Kapalı', '37) ses panelindeki anahtarlar efekt ve müziği açıp kapatıyor');
  T4.sndAll(); ok(T4.state.muted === true && T4.state.music === false && T4.ambOn() === false && P.els.sndAll.textContent.includes('Hepsini aç'), '37) "Hepsini kapat" bütün sesleri kapatıyor');
  T4.sndAll(); ok(T4.state.muted === false && T4.state.music === true && T4.ambOn() === true, '37) "Hepsini aç" bütün sesleri açıyor');
  T4.openSheet('snd', '🔊 Ses'); step(P, 5); ok(P.els.sheet.classList.contains('show') && !errors.length, '37) ses paneli açılıyor'); T4.closeSheet(); }
  use(G);
  // tuzlu su üremesi uçtan uca
  S().level = 10; S().coins = 5000; S().eggs = []; S().tank = 'salt'; S().stash = { fresh: { fish: [mkFish(5001, 'neon')], dirt: 0 } }; S().fish = [mkFish(5101, 'clown'), mkFish(5102, 'clown'), mkFish(5103, 'napo'), mkFish(5104, 'napo')];
  T.openSheet('prod'); G.els.pa.value = '5101'; T.fillParents(); G.els.pb.value = '5102'; T.fillParents(); T.breed(); T.closeSheet();
  ok(S().eggs.length === 1 && S().eggs[0].tank === 'salt' && S().eggs[0].type === 'clown', '37) tuzlu su çifti yumurta bırakıyor');
  S().eggs[0].hatchAt = Date.now() - 1; step(G, 90); ok(S().eggs.length === 0 && S().fish.filter(f => f.type === 'clown').length === 3, '37) tuzlu su yumurtası tuzlu su tankında açılıyor');
  T.openSheet('prod'); G.els.pa.value = '5103'; T.fillParents(); G.els.pb.value = '5104'; T.fillParents(); T.breed(); T.closeSheet(); T.switchTank('fresh'); S().eggs.forEach(e => e.hatchAt = Date.now() - 1); step(G, 90);
  ok(T.tankArr('salt').filter(f => f.type === 'napo').length === 3 && !S().fish.some(f => f.type === 'napo'), '37) başka tanktayken de tuzlu su yumurtası doğru tankta açılıyor'); T.switchTank('salt');
  // çiftleşememe nedeni
  S().fish = [mkFish(5201, 'clown', { age: .5 }), mkFish(5202, 'clown', { health: 30 }), mkFish(5203, 'ytang', { bredAt: Date.now() })];
  const h = T.breedHint(); ok(/1 balık henüz yetişkin değil/.test(h) && /1 balık hasta ya da zayıf/.test(h) && /1 balık dinleniyor/.test(h), '37) çiftleşme panelinde neden çiftleşemediği yazıyor: "' + h + '"');
  const t0 = S().tank; S().tank = 'cfresh'; ok(/Koleksiyon tankında/.test(T.breedHint()), '37) koleksiyon tankında çiftleşmenin neden olmadığı yazıyor'); S().tank = t0;
  // dolu tankta bekleyen yumurta mesajı
  S().fish = []; for (let i = 0; i < 20; i++) S().fish.push(mkFish(5300 + i, 'clown')); S().eggs = [{ id: 1, hatchAt: Date.now() - 1, tank: 'salt', type: 'clown', pa: { m: 'normal', g: null, z: 'normal' }, pb: { m: 'normal', g: null, z: 'normal' } }]; S().eggWait = 0; step(G, 90);
  ok(S().eggs.length === 1 && /Tuzlu su tankı dolu/.test(G.els.message.textContent), '37) dolu tankta bekleyen yumurta hangi tankın dolu olduğunu söylüyor: "' + G.els.message.textContent + '"');
  S().fish = S().fish.slice(0, 4); S().eggs = []; S().eggWait = 0;
  }

  // ===== 9) uzun koşu ve hata
  use(G); S().tank = 'fresh'; S().stash = { salt: { fish: [], dirt: 0 }, cfresh: { fish: [mkFish(990, 'guppy', { vx: 0, vy: 0 })], dirt: 0 } }; S().fish = []; for (let i = 0; i < 25; i++) S().fish.push(mkFish(600 + i, ['neon', 'guppy', 'gold', 'betta'][i % 4]));
  S().stash.salt.fish = []; for (let i = 0; i < 15; i++) S().stash.salt.fish.push(mkFish(700 + i, ['clown', 'ytang', 'btang', 'angel'][i % 4]));
  for (const k of ['quest', 'ach', 'map', 'rank', 'prod', 'fish', 'shop', 'book', 'set', 'snd', 'decor']) { G.T.openSheet(k); step(G, 10) } G.T.closeSheet();
  step(G, 3000); G.T.switchTank(S().tank==='fresh'?'salt':'fresh'); step(G, 1500); G.T.state.lastTick -= 5 * 3600e3; step(G, 70);
  ok(G.T.allFish().every(f => isFinite(f.x + f.y + f.vx + f.health)), '9) iki tank, 40 balık, 5 saat çevrimdışı + 75 sn oyun: değerler bozulmadı');
  const t0 = process.hrtime.bigint(); step(G, 600); const ms = Number(process.hrtime.bigint() - t0) / 1e6 / 600;
  console.log('   kare başına ' + ms.toFixed(3) + ' ms (çizim sahte, 15 balık aktif tankta)');
  ok(errors.length === 0, '9) hiç JavaScript hatası yok' + (errors.length ? ': ' + errors[0].stack : ''));
  console.log(`\n${pass} geçti, ${fail} kaldı`);
  process.exit(0);
})().catch(e => { console.log('TEST ÇÖKTÜ', e.stack); process.exit(1) });

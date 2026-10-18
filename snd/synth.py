# Akvaria müzik ve efekt sentezleyici — tamamen özgün, örnek/sample kullanılmaz.
import numpy as np, json, subprocess, os
from scipy.signal import fftconvolve, lfilter, butter, sosfilt

SR = 44100
OUT = os.path.dirname(os.path.abspath(__file__))
rng = np.random.default_rng(7)

def mf(n): return 440.0 * 2 ** ((n - 69) / 12)
def tt(d): return np.arange(int(d * SR)) / SR

def att(x, a=0.003):
    n = min(len(x), max(1, int(a * SR)))
    x[:n] *= 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, n))
    return x

def rel(x, r=0.02):
    n = min(len(x), max(1, int(r * SR)))
    x[-n:] *= np.linspace(1, 0, n) ** 2
    return x

def lp(x, fc, order=2):
    sos = butter(order, min(fc, SR * 0.45), 'low', fs=SR, output='sos'); return sosfilt(sos, x)
def hp(x, fc, order=2):
    sos = butter(order, fc, 'high', fs=SR, output='sos'); return sosfilt(sos, x)
def bp(x, lo, hi, order=2):
    sos = butter(order, [lo, hi], 'band', fs=SR, output='sos'); return sosfilt(sos, x)

# ---------- enstrümanlar ----------
def modal(f, parts, dur, vel=1.0, a=0.002):
    t = tt(dur); y = np.zeros_like(t)
    for r, amp, dec in parts:
        if f * r > SR * 0.45: continue
        y += amp * np.sin(2 * np.pi * f * r * t + rng.uniform(0, 6.28)) * np.exp(-t / dec)
    return rel(att(y * vel, a), 0.03)

def marimba(f, vel=1.0, dur=1.6):
    k = min(1.0, (330 / f) ** 0.35)
    y = modal(f, [(1, 1, 0.9 * k), (3.93, 0.28, 0.18 * k), (9.2, 0.07, 0.05 * k)], dur, vel, 0.0015)
    click = lp(rng.standard_normal(int(0.006 * SR)), 2500) * 0.05 * vel
    y[:len(click)] += click * np.linspace(1, 0, len(click))
    return y

def kalimba(f, vel=1.0, dur=2.2):
    return modal(f, [(1, 1, 1.1), (2.0, 0.08, 0.4), (5.9, 0.12, 0.12), (12.3, 0.03, 0.03)], dur, vel, 0.002)

def glock(f, vel=1.0, dur=2.5):
    return modal(f, [(1, 1, 1.3), (2.76, 0.32, 0.45), (5.40, 0.14, 0.2), (8.93, 0.06, 0.08)], dur, vel, 0.001)

def musicbox(f, vel=1.0, dur=3.0):
    return modal(f, [(1, 1, 1.6), (3.0, 0.06, 0.5), (4.2, 0.1, 0.25), (7.1, 0.04, 0.1)], dur, vel, 0.001)

def epiano(f, vel=1.0, dur=2.6):
    t = tt(dur); idx = 1.6 * np.exp(-t / 0.5) + 0.25
    y = np.sin(2 * np.pi * f * t + idx * np.sin(2 * np.pi * f * t)) * np.exp(-t / 1.7)
    y += 0.12 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t / 0.6)
    return rel(att(y * vel, 0.004), 0.08)

def pluck(f, vel=1.0, dur=1.0, damp=0.996, bright=0.5):
    N = int(SR / f); n = int(dur * SR)
    exc = np.zeros(n); burst = rng.uniform(-1, 1, N); burst = lp(burst, 1500 + 6000 * bright); exc[:N] = burst
    a = np.zeros(N + 2); a[0] = 1; a[N] = -damp * 0.5; a[N + 1] = -damp * 0.5
    y = lfilter([1], a, exc)
    return rel(att(y / (np.abs(y).max() + 1e-9) * vel, 0.001), 0.05)

def bass(f, dur, vel=1.0):
    t = tt(dur + 0.15)
    y = np.sin(2 * np.pi * f * t) + 0.22 * np.sin(4 * np.pi * f * t) + 0.06 * np.sin(6 * np.pi * f * t)
    env = np.minimum(1, t / 0.012) * (0.55 + 0.45 * np.exp(-t / 0.35))
    env[t > dur] *= np.exp(-(t[t > dur] - dur) / 0.05)
    return y * env * vel

def pad(freqs, dur, vel=1.0, bright=1400, attk=1.4, relse=1.8, det=0.006):
    t = tt(dur + relse); y = np.zeros_like(t)
    for f in freqs:
        for d in (-det, 0, det):
            ff = f * (1 + d); ph = rng.uniform(0, 6.28)
            nh = int(min(24, 7000 / ff))
            for h in range(1, nh + 1):
                w = (1 / h) / (1 + (ff * h / bright) ** 2)
                if w < 0.004: break
                y += w * np.sin(2 * np.pi * ff * h * t + ph * h)
    env = np.minimum(1, t / attk) ** 2
    env[t > dur] *= np.exp(-(t[t > dur] - dur) / (relse / 3))
    y *= env * (1 + 0.06 * np.sin(2 * np.pi * 0.17 * t))
    return y / (len(freqs) * 3) * vel

def shaker(vel=1.0, dur=0.07):
    x = hp(rng.standard_normal(int(dur * SR)), 6000, 4)
    t = tt(dur); env = np.minimum(1, t / 0.008) * np.exp(-t / 0.018)
    return x * env * vel

def kick(vel=1.0):
    t = tt(0.3); f = 50 + 70 * np.exp(-t / 0.04)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t / 0.12) * np.minimum(1, t / 0.002) * vel

def clap(vel=1.0):
    t = tt(0.18); x = bp(rng.standard_normal(len(t)), 900, 3500)
    env = np.zeros_like(t)
    for d in (0, 0.011, 0.022):
        m = t >= d; env[m] += np.exp(-(t[m] - d) / (0.012 if d < 0.02 else 0.05))
    return x * env * vel * 0.5

def bubble(f0=None, vel=1.0):
    f0 = f0 or rng.uniform(450, 1100); d = rng.uniform(0.035, 0.07); t = tt(d + 0.03)
    f = f0 * (1 + 1.6 * np.minimum(1, t / d) ** 1.5)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / (d * 0.7)) * np.minimum(1, t / 0.002)
    return y * vel

def noise_sweep(dur, f0, f1, q=1.2, vel=1.0, attk=0.1):
    n = int(dur * SR); x = rng.standard_normal(n); out = np.zeros(n); blk = 1024
    for i in range(0, n, blk):
        fc = f0 * (f1 / f0) ** (i / n); lo = fc / (1 + 0.5 / q); hi = min(fc * (1 + 0.5 / q), SR * 0.45)
        seg = x[max(0, i - 2048):i + blk]; y = bp(seg, lo, hi); out[i:i + blk] = y[-len(out[i:i + blk]):]
    t = tt(dur); env = np.minimum(1, t / attk) * np.exp(-np.maximum(0, t - attk) / (dur * 0.35))
    return out * env * vel

# ---------- karıştırma ----------
class Mix:
    def __init__(self, dur): self.L = np.zeros(int(dur * SR) + SR * 6); self.R = np.zeros_like(self.L)
    def add(self, t0, sig, gain=1.0, pan=0.0):
        i = max(0, int(t0 * SR)); n = min(len(sig), len(self.L) - i)
        if n <= 0: return
        a = (pan + 1) * np.pi / 4
        self.L[i:i + n] += sig[:n] * gain * np.cos(a); self.R[i:i + n] += sig[:n] * gain * np.sin(a)

def ir(length=2.4, decay=0.5, damp=5000, seed=3):
    r = np.random.default_rng(seed); n = int(length * SR); t = np.arange(n) / SR
    chans = []
    for c in range(2):
        x = r.standard_normal(n) * np.exp(-t / decay)
        x = lp(x, damp) * 0.6 + lp(x, damp * 0.35) * 0.4
        x[:int(0.012 * SR)] = 0
        for d, g in ((0.017, .5), (0.029, .35), (0.041, .25), (0.057, .2)):
            x[int((d + 0.003 * c) * SR)] += g * 3
        chans.append(x / np.sqrt(np.sum(x ** 2)))
    return chans

def finish(m, loop_len, wet=0.3, room=(2.4, 0.5, 5000), circular=True, target_rms=-21.0, peak=0.89):
    L, R = m.L, m.R
    irL, irR = ir(*room)
    wL = fftconvolve(L, irL)[:len(L)]; wR = fftconvolve(R, irR)[:len(R)]
    L = L * (1 - wet * 0.5) + wL * wet; R = R * (1 - wet * 0.5) + wR * wet
    L = hp(L, 35); R = hp(R, 35)
    n = int(loop_len * SR)
    if circular:
        tail = len(L) - n
        L2 = L[:n].copy(); R2 = R[:n].copy()
        for k in range(0, tail, n):
            s = L[n + k:n + k + n]; L2[:len(s)] += s; R2[:len(s)] += R[n + k:n + k + len(s)]
        L, R = L2, R2
    else:
        L, R = L[:n], R[:n]
    st = np.stack([L, R], 1)
    rms = np.sqrt(np.mean(st ** 2)); st *= 10 ** (target_rms / 20) / (rms + 1e-12)
    pk = np.abs(st).max()
    if pk > peak:  # yumuşak sınırlayıcı
        st = np.tanh(st / peak * 0.9) * peak / np.tanh(0.9)
    return st

def save(st, name, br='96k', mono=False):
    st = np.clip(st, -1, 1).astype(np.float32); ch = 1 if st.ndim == 1 else 2
    args = ['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', str(ch), '-i', '-']
    if mono and ch == 2: args += ['-ac', '1']
    args += ['-b:a', br, os.path.join(OUT, name)]
    subprocess.run(args, input=st.tobytes(), check=True)

# ---------- yardımcı: akor sesleri ----------
def degree_melody(scale, chord_tones, bars, beats_per_bar, seed, density=0.55, phrase=2):
    r = np.random.default_rng(seed); notes = []; pos = len(scale) // 2
    motif = None
    for b in range(bars):
        if b % (phrase * 2) == phrase and motif is not None:
            # cevap cümlesi: motifi bir derece kaydırarak tekrarla
            for (bt, d, du) in motif:
                notes.append((b * beats_per_bar + bt, max(0, min(len(scale) - 1, d + r.choice([-1, 1]))), du))
            continue
        cur = []
        bt = 0.0
        while bt < beats_per_bar:
            if r.random() < density or bt == 0:
                if bt == 0:
                    ct = chord_tones[b]; cands = [i for i, s in enumerate(scale) if s % 12 in ct]
                    pos = min(cands, key=lambda i: abs(i - pos)) if cands else pos
                else:
                    pos = int(np.clip(pos + r.choice([-2, -1, -1, 1, 1, 2]), 0, len(scale) - 1))
                du = r.choice([1.0, 1.0, 1.5, 2.0]) if bt == 0 else r.choice([0.5, 1.0, 1.0])
                cur.append((bt, pos, du)); notes.append((b * beats_per_bar + bt, pos, du))
                bt += du
            else:
                bt += 0.5
        if b % (phrase * 2) == 0: motif = cur
    return notes

# =====================================================
def make_day():
    bpm = 84; B = 60 / bpm; bars = 32; bar = 4 * B; dur = bars * bar
    m = Mix(dur)
    F = 41  # F2
    prog = {
        'A': [([65, 69, 72, 76], 41), ([62, 65, 69, 72, 76], 38), ([58, 62, 65, 69], 46), ([60, 64, 67, 69, 74], 36)],
        'B': [([55, 58, 62, 65], 43), ([57, 60, 64, 67], 45), ([58, 62, 65, 69], 46), ([60, 65, 67, 70], 36)],
    }
    form = ['A', 'A', 'B', 'A']
    chords = []
    for s in form:
        for c in prog[s]: chords += [c, c]
    scale = [n for n in range(60, 92) if n % 12 in (5, 7, 9, 0, 2)]  # F majör pentatonik
    mel = degree_melody(scale, [set(n % 12 for n in c[0]) for c in chords], bars, 4, seed=11, density=0.45)
    for b, (ch, root) in enumerate(chords):
        t0 = b * bar; sec = b // 8
        if b % 2 == 0: m.add(t0, pad([mf(n) for n in ch[:4]], bar * 2, 1.0, bright=1300), 0.55, 0)
        m.add(t0, bass(mf(root), B * 1.6, 0.9), 0.42, 0)
        m.add(t0 + 2 * B, bass(mf(root + 7 if root + 7 < 50 else root - 5), B * 1.2, 0.75), 0.38, 0)
        arp = [ch[i % len(ch)] + (12 if i >= len(ch) else 0) for i in (0, 2, 1, 3, 2, 4, 3, 1)]
        if sec == 2: arp = [ch[i % len(ch)] + 12 * (i % 2) for i in (0, 1, 2, 3, 0, 2, 1, 3)]
        for i, n in enumerate(arp):
            if sec == 0 and b < 2 and i % 2: continue
            v = (0.85 if i % 2 == 0 else 0.6) * (1 if i != 0 else 1.1) * rng.uniform(0.9, 1.05)
            m.add(t0 + i * B / 2 + rng.normal(0, 0.004), marimba(mf(n + 12 if n < 64 else n), v), 0.42, -0.35 + 0.1 * (i % 3))
        if sec >= 1:
            for i in range(8):
                m.add(t0 + i * B / 2 + B / 4 * (i % 2 == 1) * 0, shaker(0.55 if i % 2 else 0.3), 0.18, 0.45)
        if sec == 3 and b % 2 == 0:
            m.add(t0, glock(mf(ch[-1] + 24), 0.6), 0.16, 0.5)
    for (beat, d, du) in mel:
        b = int(beat // 4)
        if b < 2: continue
        m.add(beat * B + rng.normal(0, 0.005), kalimba(mf(scale[d]), rng.uniform(0.75, 0.95), max(1.4, du * B + 0.8)), 0.5, 0.25)
    return finish(m, dur, wet=0.3, room=(2.2, 0.45, 5500), target_rms=-21.5)

def make_night():
    bpm = 62; B = 60 / bpm; bars = 24; bar = 4 * B; dur = bars * bar
    m = Mix(dur)
    seq = [([63, 67, 70, 74], 39), ([60, 63, 67, 70, 74], 36), ([56, 60, 63, 67, 74], 44), ([58, 63, 65, 70], 46),
           ([56, 60, 63, 67], 44), ([55, 58, 62, 65], 43), ([53, 56, 60, 63, 67], 41), ([58, 62, 65, 70], 46)]
    chords = [seq[i % 8] for i in range(bars)]
    scale = [n for n in range(67, 96) if n % 12 in (3, 5, 7, 10, 0)]  # Eb majör pentatonik
    mel = degree_melody(scale, [set(n % 12 for n in c[0]) for c in chords], bars, 4, seed=5, density=0.22, phrase=2)
    for b, (ch, root) in enumerate(chords):
        t0 = b * bar
        m.add(t0, pad([mf(n) for n in ch[:4]], bar, 1.0, bright=900, attk=2.2, relse=2.6, det=0.008), 0.75, 0)
        m.add(t0, bass(mf(root), bar * 0.9, 0.7), 0.38, 0)
        for i, n in enumerate(ch[:4] + [ch[1] + 12]):
            m.add(t0 + i * B * 0.75 + (B if i > 2 else 0) * 0.25 + rng.normal(0, 0.01), epiano(mf(n), 0.5 + 0.1 * (i == 0)), 0.33, -0.3 + 0.15 * i)
    for (beat, d, du) in mel:
        if beat < 8: continue
        m.add(beat * B + rng.normal(0, 0.01), musicbox(mf(scale[d]), rng.uniform(0.6, 0.85)), 0.32, 0.35)
    return finish(m, dur, wet=0.48, room=(3.4, 0.9, 4200), target_rms=-22.5)

def make_event():
    bpm = 112; B = 60 / bpm; bars = 16; bar = 4 * B; dur = bars * bar
    m = Mix(dur)
    C = [([60, 64, 67], 48), ([59, 62, 67], 43), ([57, 60, 64], 45), ([57, 60, 65], 41)]
    D = [([57, 60, 65], 41), ([59, 62, 67], 43), ([59, 64, 67], 40), ([57, 60, 64], 45),
         ([57, 60, 65], 41), ([59, 62, 67], 43), ([60, 64, 67], 48), ([60, 64, 67], 48)]
    chords = C + C + D
    motif = [(0, 76), (0.5, 79), (1, 81), (1.5, 79), (2, 76), (3, 74), (3.5, 72)]
    motif2 = [(0, 79), (0.5, 81), (1, 84), (2, 81), (2.5, 79), (3, 76)]
    for b, (ch, root) in enumerate(chords):
        t0 = b * bar
        m.add(t0, pluck(mf(root), 0.9, 0.6, 0.994, 0.3), 0.55, -0.1)
        m.add(t0 + 2 * B, pluck(mf(root + 7), 0.8, 0.5, 0.994, 0.3), 0.5, -0.1)
        for k in (1, 3):
            for j, n in enumerate(ch):
                m.add(t0 + k * B + j * 0.006, pluck(mf(n), 0.7, 0.35, 0.99, 0.6), 0.25, -0.4 + 0.3 * j)
        for i in range(8):
            n = ch[(i * 2 + (i // 4)) % 3] + 12
            m.add(t0 + i * B / 2, marimba(mf(n), 0.75 if i % 2 == 0 else 0.55), 0.3, 0.35)
        m.add(t0, kick(0.9), 0.35, 0); m.add(t0 + 2 * B, kick(0.8), 0.3, 0)
        m.add(t0 + B, clap(0.8), 0.22, 0.1); m.add(t0 + 3 * B, clap(0.8), 0.22, 0.1)
        for i in range(8): m.add(t0 + i * B / 2, shaker(0.7 if i % 2 else 0.4), 0.2, 0.5)
        if b >= 2:
            mt = motif if (b // 2) % 2 == 0 else motif2
            if b % 2 == 0:
                for (bt, n) in mt: m.add(t0 + bt * B, glock(mf(n + (12 if b >= 8 else 0) - (12 if n > 80 and b >= 8 else 0)), 0.75), 0.3, -0.2)
            else:
                for (bt, n) in mt[:3]: m.add(t0 + bt * B, glock(mf(n - 5), 0.6), 0.22, -0.2)
    return finish(m, dur, wet=0.2, room=(1.6, 0.35, 6000), target_rms=-21.0)

def make_amb():
    dur = 24.0; n = int(dur * SR); c = 2 * SR
    def bed(seed):
        r = np.random.default_rng(seed); w = np.cumsum(r.standard_normal(n + c + SR)); w = hp(w, 90, 2); w = lp(w, 650, 2); w = w[SR:]
        f = np.linspace(0, np.pi / 2, c); w[:c] = w[:c] * np.sin(f) + w[n:n + c] * np.cos(f); w = w[:n]
        t = np.arange(n) / SR; return w / np.abs(w).max() * (0.75 + 0.25 * np.sin(2 * np.pi * t / 6.0))
    m = Mix(dur); m.L[:n] += bed(21) * 0.45; m.R[:n] += bed(22) * 0.45
    tt0 = 0.0
    while tt0 < dur:
        if rng.random() < 0.25:  # baloncuk dizisi
            base = rng.uniform(500, 900); pan = rng.uniform(-.6, .6)
            for k in range(rng.integers(4, 9)):
                m.add(tt0 + k * rng.uniform(0.05, 0.12), bubble(base * rng.uniform(0.85, 1.4), rng.uniform(0.3, 0.6)), 0.4, pan)
        else:
            m.add(tt0, bubble(None, rng.uniform(0.2, 0.5)), 0.32, rng.uniform(-.8, .8))
        tt0 += rng.exponential(0.7)
    return finish(m, dur, wet=0.35, room=(1.8, 0.4, 3500), target_rms=-27.0)

# =====================================================
def sfx_set():
    S = {}
    def mk(d): return Mix(d)
    def done(m, d, wet=0.22, peak=0.7):
        st = finish(m, d, wet=wet, room=(1.3, 0.28, 6500), circular=False, target_rms=-14)
        st = st.mean(1); st = st / (np.abs(st).max() + 1e-9) * peak
        f = int(0.01 * SR); st[-f:] *= np.linspace(1, 0, f); return st
    def coin1(m, t0, v=1.0, base=88):
        m.add(t0, glock(mf(base), v, 0.6), 0.6); m.add(t0 + 0.045, glock(mf(base + 7), v * 0.8, 0.8), 0.55)
        m.add(t0, modal(mf(base) * 1.5, [(1, 1, .08), (2.4, .6, .05), (3.9, .4, .03)], 0.2, v), 0.25)
    m = mk(0.7)
    for i in range(4):
        t0 = i * rng.uniform(0.07, 0.11); f = rng.uniform(900, 1400); d = 0.035; t = tt(0.08)
        y = np.sin(2 * np.pi * np.cumsum(f * np.exp(-t / 0.03) + 250) / SR) * np.exp(-t / 0.025)
        m.add(t0, att(y, 0.001), 0.7); m.add(t0, hp(rng.standard_normal(int(.02 * SR)), 3000) * np.exp(-tt(.02) / .005), 0.08)
    S['feed'] = done(m, 0.7, 0.15, 0.55)
    m = mk(0.9); coin1(m, 0); S['sell'] = done(m, 0.9, peak=0.6)
    m = mk(1.2)
    for i in range(5): coin1(m, i * 0.075 + rng.uniform(0, .02), 0.8, 86 + (i % 3) * 2)
    S['coins'] = done(m, 1.2, peak=0.65)
    m = mk(1.0); m.add(0, bubble(380, 1), 0.6); coin1(m, 0.06, 0.9)
    for i, n in enumerate((84, 88, 91)): m.add(0.18 + i * 0.06, kalimba(mf(n), 0.7, 0.8), 0.45)
    S['buy'] = done(m, 1.0, peak=0.65)
    m = mk(0.18); m.add(0, marimba(mf(96), 0.6, 0.12), 0.7); m.add(0, bubble(1300, .3), .2); S['click'] = done(m, 0.18, 0.05, 0.3)
    m = mk(0.6); m.add(0, lp(marimba(mf(57), 0.9, 0.4), 1200), 0.8); m.add(0.13, lp(marimba(mf(53), 0.9, 0.5), 1000), 0.8); S['error'] = done(m, 0.6, 0.1, 0.5)
    m = mk(1.4); m.add(0, noise_sweep(0.7, 600, 3200, 1.1, 1, 0.15), 0.5)
    for i in range(7): m.add(0.25 + i * 0.07, bubble(rng.uniform(500, 1100), .6), .4, rng.uniform(-.5, .5))
    for i, n in enumerate((84, 88, 91, 96)): m.add(0.7 + i * 0.07, glock(mf(n), 0.6, 0.8), 0.35)
    S['clean'] = done(m, 1.4, peak=0.6)
    m = mk(0.35); m.add(0, bubble(rng.uniform(450, 650), 1), .7); m.add(0.08, bubble(rng.uniform(700, 950), .6), .5); S['bubble'] = done(m, 0.35, 0.15, 0.45)
    m = mk(0.6); t = tt(0.16); f = 380 + 420 * (t / 0.16); y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / 0.16)
    m.add(0, y, 0.5); m.add(0.1, kalimba(mf(84), 0.6, 0.5), 0.35); S['boop'] = done(m, 0.6, 0.15, 0.5)
    m = mk(2.0); t = tt(0.4); f = 90 + 60 * (t / 0.4); y = lp(np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.3 + rng.standard_normal(len(t)) * .1, 900) * np.sin(np.pi * t / 0.4)
    m.add(0, y, 0.5); m.add(0.35, lp(rng.standard_normal(int(.1 * SR)), 700) * np.exp(-tt(.1) / .03), .5)
    for i, n in enumerate((84, 88, 91, 96, 100)): m.add(0.45 + i * 0.06, glock(mf(n), 0.75, 1.0), 0.4)
    for i in range(4): coin1(m, 0.85 + i * 0.08, 0.6)
    S['chest'] = done(m, 2.0, peak=0.7)
    def fanfare(notes, chord, d=2.0):
        m = mk(d)
        for i, n in enumerate(notes): m.add(i * 0.09, marimba(mf(n), 0.9, 0.8), 0.45, -0.2); m.add(i * 0.09, glock(mf(n + 12), 0.5, 0.8), 0.2, 0.2)
        tc = len(notes) * 0.09
        m.add(tc, pad([mf(n) for n in chord], d - tc - 0.3, 1.0, 1800, 0.08, 0.6), 0.7)
        for n in chord: m.add(tc, glock(mf(n + 12), 0.5, 1.5), 0.18)
        return done(m, d, 0.3, 0.7)
    S['level'] = fanfare([72, 76, 79, 84], [60, 64, 67, 72, 76])
    S['ach'] = fanfare([67, 72, 76, 79], [55, 60, 64, 67, 72])
    m = mk(1.8)
    for i, n in enumerate([84, 86, 88, 91, 93, 96, 98, 100, 103]): m.add(i * 0.05, glock(mf(n), 0.55, 1.2), 0.35, -0.5 + i * 0.12)
    m.add(0, pad([mf(72), mf(76), mf(79)], 1.0, 1, 2500, 0.3, 0.8), 0.35); S['rare'] = done(m, 1.8, 0.4, 0.65)
    m = mk(3.2); t = tt(2.6); m.add(0, np.sin(2 * np.pi * 43 * t) * np.exp(-t / 0.9) * np.minimum(1, t / .02), 0.7)
    for i in range(16): m.add(0.15 + i * 0.045, pluck(mf([67, 69, 72, 74, 76][i % 5] + 12 * (i // 5)), 0.7, 1.2, 0.997, 0.6), 0.3, -0.6 + i * 0.08)
    for n in (72, 76, 79, 84, 88): m.add(0.95, glock(mf(n + 12), 0.6, 2.0), 0.22)
    m.add(0.9, pad([mf(60), mf(64), mf(67), mf(72)], 2.0, 1, 2200, 0.15, 1.0), 0.6)
    for i in range(10): m.add(1.1 + i * 0.09, glock(mf([96, 100, 103, 108][i % 4]), 0.35, 0.8), 0.15, rng.uniform(-.7, .7))
    S['legend'] = done(m, 3.2, 0.42, 0.75)
    m = mk(1.0)
    for i in range(3): m.add(i * 0.11, hp(rng.standard_normal(int(.012 * SR)), 2500) * np.exp(-tt(.012) / .003), .5)
    m.add(0.36, bubble(500, 1), .6); m.add(0.42, kalimba(mf(88), .7, .6), .4); m.add(0.55, kalimba(mf(91), .7, .6), .4)
    S['hatch'] = done(m, 1.0, peak=0.55)
    m = mk(0.8); m.add(0, noise_sweep(0.6, 2200, 280, 1.3, 1, 0.12), 0.7); m.add(0.45, bubble(500, .5), .3); S['whoosh'] = done(m, 0.8, 0.2, 0.5)
    m = mk(1.6); m.add(0, pad([mf(60), mf(67), mf(72)], 0.9, 1, 2000, 0.5, 0.6), 0.6)
    for i, n in enumerate((67, 72, 76, 79, 84)): m.add(0.3 + i * 0.09, kalimba(mf(n), 0.8, 0.9), 0.45)
    S['unlock'] = done(m, 1.6, 0.3, 0.6)
    m = mk(1.0)
    for i, n in enumerate((76, 83, 88)): m.add(i * 0.08, glock(mf(n), 0.6, .9), .4)
    S['cure'] = done(m, 1.0, 0.3, 0.55)
    m = mk(0.9); m.add(0, kalimba(mf(79), .7, .7), .5); m.add(0.16, kalimba(mf(83), .7, .7), .5); m.add(0.3, bubble(700, .5), .3); S['breed'] = done(m, 0.9, 0.25, 0.5)
    m = mk(1.0)
    for i in range(6): m.add(i * 0.045, glock(mf(84 + (i * 5) % 12), .5, .5), .3, rng.uniform(-.5, .5))
    m.add(0.3, glock(mf(91), .6, .8), .35); S['gene'] = done(m, 1.0, 0.3, 0.55)
    m = mk(0.7); t = tt(0.2); f = 140 * np.exp(-t / .1) + 70; m.add(0, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .06), .7)
    m.add(0, lp(rng.standard_normal(int(.15 * SR)), 900) * np.exp(-tt(.15) / .04), .3); m.add(0.15, glock(mf(88), .5, .5), .3)
    S['place'] = done(m, 0.7, 0.2, 0.55)
    m = mk(1.3); m.add(0, noise_sweep(0.6, 500, 2400, 1.2, 1, 0.12), 0.45)
    for i in range(6): m.add(0.15 + i * 0.06, bubble(rng.uniform(450, 1000), .5), .35)
    coin1(m, 0.5, .7); coin1(m, 0.62, .6); S['help'] = done(m, 1.3, 0.22, 0.6)
    m = mk(0.9); m.add(0, epiano(mf(64), .6, .5), .5); m.add(0.22, epiano(mf(63), .6, .6), .5); S['sick'] = done(m, 0.9, 0.2, 0.45)
    m = mk(2.0)
    for i, n in enumerate((67, 63, 60, 55)): m.add(i * 0.22, epiano(mf(n), .6, 1.2), .45)
    S['death'] = done(m, 2.0, 0.35, 0.5)
    m = mk(2.0)
    for i, n in enumerate((84, 79, 76, 72, 67)): m.add(0.1 + i * 0.16, glock(mf(n), .5, 1), .3)
    m.add(0, pad([mf(48), mf(55), mf(60)], 1.4, 1, 900, 0.5, 0.6), .5); S['dusk'] = done(m, 2.0, 0.4, 0.55)
    m = mk(2.0)
    for i, n in enumerate((67, 72, 76, 79, 84, 88)): m.add(0.1 + i * 0.12, kalimba(mf(n), .6, 1), .35)
    m.add(0, pad([mf(60), mf(67), mf(72)], 1.4, 1, 2400, 0.5, 0.6), .45); S['dawn'] = done(m, 2.0, 0.4, 0.55)
    return S

if __name__ == '__main__':
    import sys
    os.makedirs(OUT, exist_ok=True)
    save(make_day(), 'day.mp3', '96k'); print('day')
    save(make_night(), 'night.mp3', '96k'); print('night')
    save(make_event(), 'event.mp3', '96k'); print('event')
    save(make_amb(), 'amb.mp3', '64k'); print('amb')
    S = sfx_set(); gap = int(0.12 * SR); buf = []; idx = {}; pos = 0
    for k, v in S.items():
        idx[k] = [round(pos / SR, 4), round(len(v) / SR, 4)]; buf.append(v); buf.append(np.zeros(gap)); pos += len(v) + gap
    save(np.concatenate(buf), 'sfx.mp3', '96k', mono=True)
    json.dump(idx, open(os.path.join(OUT, 'sfx.json'), 'w'))
    print('sfx', len(S), round(pos / SR, 1), 's')

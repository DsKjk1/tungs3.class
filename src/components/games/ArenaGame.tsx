import { useEffect, useRef, useState, useCallback } from "react";
import { pickQuestionForWave, type Question } from "@/lib/questions";
import { QuestionGate } from "@/components/games/QuestionGate";
import sahurImg from "@/assets/mr-sahur.png";

// ============ TYPES ============
type WeaponId =
  | "lasers" | "rocket" | "ball" | "burst"
  | "shield" | "discs" | "boomerang" | "redball"
  | "katana" | "bat" | "warhammer" | "stormbreaker";

interface WeaponDef {
  id: WeaponId;
  name: string;
  category: "Lock-On" | "Crowd Control" | "Damage";
  desc: string;
}

const WEAPONS: WeaponDef[] = [
  { id: "lasers", name: "LASERS", category: "Lock-On", desc: "Rapid auto-fire stream at nearest." },
  { id: "rocket", name: "ROCKET", category: "Lock-On", desc: "Slow homing splash damage." },
  { id: "ball", name: "ENERGY BALL", category: "Lock-On", desc: "Ricochets between enemies." },
  { id: "burst", name: "BURST", category: "Lock-On", desc: "Triple-shot bursts." },
  { id: "shield", name: "ENERGY SHIELD", category: "Crowd Control", desc: "Damaging aura around player." },
  { id: "discs", name: "DISCS", category: "Crowd Control", desc: "Orbit and slice enemies." },
  { id: "boomerang", name: "BOOMERANG", category: "Crowd Control", desc: "Pierces and returns." },
  { id: "redball", name: "RED BALL", category: "Crowd Control", desc: "Chaotic endless ricochet." },
  { id: "katana", name: "KATANA", category: "Damage", desc: "Quick directional slash." },
  { id: "bat", name: "BAT", category: "Damage", desc: "Wide arc, big damage." },
  { id: "warhammer", name: "WARHAMMER", category: "Damage", desc: "Slow, huge, stuns enemies." },
  { id: "stormbreaker", name: "STORMBREAKER", category: "Damage", desc: "Lightning AoE." },
];

interface OwnedWeapon { id: WeaponId; level: number; cd: number; t: number; }
interface Enemy { x: number; y: number; hp: number; maxHp: number; spd: number; r: number; type: string; stunUntil: number; }
interface Projectile { x: number; y: number; vx: number; vy: number; dmg: number; r: number; life: number; piercesLeft: number; ricochetLeft: number; ownerId: WeaponId; targetId?: number; splash?: number; hitSet: Set<number>; lastHit: number; color: string; }
interface DmgNum { x: number; y: number; v: number; t: number; crit: boolean; }

interface Sparkle { x: number; y: number; t: number; color: string; }

const ARENA_W = 1600;
const ARENA_H = 1000;

// ============ COMPONENT ============
export function ArenaGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sahurRef = useRef<HTMLImageElement | null>(null);
  const [phase, setPhase] = useState<"intro" | "question" | "choose" | "wave" | "between" | "victory" | "dead">("intro");
  const [wave, setWave] = useState(0);
  const [hp, setHp] = useState(100);
  const [maxHp] = useState(100);
  const [owned, setOwned] = useState<OwnedWeapon[]>([]);
  const [choices, setChoices] = useState<WeaponId[]>([]);
  const [question, setQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [killCount, setKillCount] = useState(0);

  // refs (mutable game state — kept outside React for perf)
  const stateRef = useRef({
    px: ARENA_W / 2, py: ARENA_H / 2, pvx: 0, pvy: 0, pspd: 3.6,
    keys: new Set<string>(),
    enemies: [] as Enemy[],
    projectiles: [] as Projectile[],
    dmg: [] as DmgNum[],
    sparkles: [] as Sparkle[],
    aim: { x: ARENA_W / 2 + 50, y: ARENA_H / 2 },
    nextEnemyId: 1,
    waveSpawned: 0,
    waveTotal: 0,
    waveTime: 0,
    invuln: 0,
    shake: 0,
    hp: 100,
    runningWave: false,
    bossWave: false,
  });

  // Preload Mr Sahur
  useEffect(() => {
    const img = new Image();
    img.src = sahurImg;
    img.onload = () => { sahurRef.current = img; };
  }, []);

  // ============ WAVE START ============
  const startWaveQuestion = useCallback(() => {
    setQuestion(pickQuestionForWave(wave + 1, "env"));
    setPhase("question");
  }, [wave]);

  const onAnswerCorrect = () => {
    // Pick 3 random choices
    const opts: WeaponId[] = [];
    const pool = [...WEAPONS];
    while (opts.length < 3) {
      const w = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
      opts.push(w.id);
    }
    setChoices(opts);
    setPhase("choose");
  };

  const pickWeapon = (id: WeaponId) => {
    setOwned((prev) => {
      const ex = prev.find((p) => p.id === id);
      if (ex) {
        return prev.map((p) => p.id === id ? { ...p, level: Math.min(3, p.level + 1) } : p);
      }
      return [...prev, { id, level: 1, cd: 0, t: 0 }];
    });
    spawnWave(wave + 1);
  };

  const spawnWave = (w: number) => {
    setWave(w);
    const isBoss = w % 5 === 0;
    const total = Math.round((12 + w * 6) * (isBoss ? 1.4 : 1));
    stateRef.current.waveSpawned = 0;
    stateRef.current.waveTotal = total;
    stateRef.current.waveTime = 0;
    stateRef.current.runningWave = true;
    stateRef.current.bossWave = isBoss;
    setPhase("wave");
  };

  // ============ INPUT ============
  useEffect(() => {
    const dn = (e: KeyboardEvent) => stateRef.current.keys.add(e.key.toLowerCase());
    const up = (e: KeyboardEvent) => stateRef.current.keys.delete(e.key.toLowerCase());
    window.addEventListener("keydown", dn);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", dn); window.removeEventListener("keyup", up); };
  }, []);

  // ============ MAIN LOOP ============
  useEffect(() => {
    if (phase !== "wave") return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let last = performance.now();
    const ownedRef = owned; // snapshot

    const enemyKilled = (e: Enemy) => {
      setKillCount((k) => k + 1);
      setScore((s) => s + Math.round(e.maxHp * 2));
      // sparkles
      for (let i = 0; i < 6; i++) {
        stateRef.current.sparkles.push({ x: e.x, y: e.y, t: 1, color: "var(--glow)" });
      }
    };

    const fireWeapons = (dt: number) => {
      const s = stateRef.current;
      ownedRef.forEach((w) => {
        w.t += dt;
        const lvl = w.level;
        // find nearest
        let nearest: Enemy | null = null;
        {
          let bd = Infinity;
          for (const e of s.enemies) {
            const d = (e.x - s.px) ** 2 + (e.y - s.py) ** 2;
            if (d < bd) { bd = d; nearest = e; }
          }
        }

        const cd = (base: number) => base * (1 - Math.min(0.55, (lvl - 1) * 0.22)) * 0.78;
        const dmg = (base: number) => base * 1.75 * (1 + (lvl - 1) * 0.5);

        switch (w.id) {
          case "lasers": {
            const fire = cd(0.12);
            if (w.t >= fire && nearest) {
              w.t = 0;
              const dx = nearest.x - s.px, dy = nearest.y - s.py;
              const m = Math.hypot(dx, dy) || 1;
              s.projectiles.push({ x: s.px, y: s.py, vx: dx / m * 12, vy: dy / m * 12, dmg: dmg(8), r: 3, life: 0.6, piercesLeft: lvl >= 3 ? 3 : 0, ricochetLeft: 0, ownerId: w.id, hitSet: new Set(), lastHit: -1, color: "#7df3ff" });
            }
            break;
          }
          case "rocket": {
            if (w.t >= cd(1.6) && nearest) {
              w.t = 0;
              const fire = (target: Enemy) => {
                s.projectiles.push({ x: s.px, y: s.py, vx: 0, vy: 0, dmg: dmg(95), r: 9, life: 4, piercesLeft: 0, ricochetLeft: 0, ownerId: w.id, targetId: s.enemies.indexOf(target), splash: 110 + lvl * 28, hitSet: new Set(), lastHit: -1, color: "#ff7a3d" });
              };
              fire(nearest);
              if (lvl >= 3) {
                const others = s.enemies.filter(e => e !== nearest);
                if (others[0]) fire(others[0]);
                if (others[1]) fire(others[1]);
              }
              s.shake = Math.max(s.shake, 4);
            }
            break;
          }
          case "ball": {
            if (w.t >= cd(0.35) && nearest) {
              w.t = 0;
              const dx = nearest.x - s.px, dy = nearest.y - s.py;
              const m = Math.hypot(dx, dy) || 1;
              s.projectiles.push({ x: s.px, y: s.py, vx: dx / m * 9, vy: dy / m * 9, dmg: dmg(10), r: 5, life: 3, piercesLeft: 0, ricochetLeft: lvl >= 3 ? 6 : 2, ownerId: w.id, hitSet: new Set(), lastHit: -1, color: "#9af0ff" });
            }
            break;
          }
          case "burst": {
            if (w.t >= cd(1.0) && nearest) {
              w.t = 0;
              const count = lvl >= 3 ? 6 : 3;
              const dx = nearest.x - s.px, dy = nearest.y - s.py;
              const m = Math.hypot(dx, dy) || 1;
              for (let i = 0; i < count; i++) {
                setTimeout(() => {
                  if (!stateRef.current.runningWave) return;
                  stateRef.current.projectiles.push({ x: s.px, y: s.py, vx: dx / m * 11, vy: dy / m * 11, dmg: dmg(14), r: 3, life: 0.8, piercesLeft: lvl >= 3 ? 2 : 0, ricochetLeft: 0, ownerId: w.id, hitSet: new Set(), lastHit: -1, color: "#5dd5ff" });
                }, i * 90);
              }
            }
            break;
          }
          case "shield": {
            const tickRate = lvl >= 3 ? 0.18 : (lvl === 2 ? 0.28 : 0.35);
            if (w.t >= tickRate) {
              w.t = 0;
              const radius = 88 + lvl * 26;
              const dmgVal = dmg(18);
              s.enemies.forEach((e) => {
                const d = Math.hypot(e.x - s.px, e.y - s.py);
                if (d < radius + e.r) {
                  e.hp -= dmgVal;
                  s.dmg.push({ x: e.x, y: e.y, v: dmgVal, t: 1, crit: false });
                  s.sparkles.push({ x: e.x, y: e.y, t: 0.4, color: "#7df3ff" });
                }
              });
            }
            break;
          }
          case "discs": {
            // Orbit visual handled in render; damage on contact
            const num = lvl >= 3 ? 6 : 2 + (lvl - 1);
            const radius = 85 + lvl * 4;
            const speed = 3.4 + lvl * 0.7;
            const angleBase = performance.now() / 1000 * speed;
            const dmgVal = dmg(16);
            for (let i = 0; i < num; i++) {
              const a = angleBase + (i * Math.PI * 2) / num;
              const dx = s.px + Math.cos(a) * radius;
              const dy = s.py + Math.sin(a) * radius;
              if (w.t >= 0.14) {
                s.enemies.forEach((e) => {
                  if (Math.hypot(e.x - dx, e.y - dy) < e.r + 14) {
                    e.hp -= dmgVal;
                    s.dmg.push({ x: e.x, y: e.y, v: dmgVal, t: 1, crit: false });
                    s.sparkles.push({ x: dx, y: dy, t: 0.4, color: "#a3f7ff" });
                  }
                });
              }
              (w as any).discs = (w as any).discs || [];
              (w as any).discs[i] = { x: dx, y: dy };
              (w as any).discCount = num;
            }
            if (w.t >= 0.14) w.t = 0;
            break;
          }
          case "boomerang": {
            if (w.t >= cd(2.5) && nearest) {
              w.t = 0;
              const count = lvl >= 3 ? 3 : 1;
              for (let i = 0; i < count; i++) {
                const angle = Math.atan2(nearest.y - s.py, nearest.x - s.px) + (i - count / 2) * 0.4;
                s.projectiles.push({ x: s.px, y: s.py, vx: Math.cos(angle) * 7, vy: Math.sin(angle) * 7, dmg: dmg(20), r: 8, life: 2.5, piercesLeft: 99, ricochetLeft: 0, ownerId: w.id, hitSet: new Set(), lastHit: -1, color: "#9bff8a" });
              }
            }
            break;
          }
          case "redball": {
            if (w.t >= cd(2.0)) {
              w.t = 0;
              const count = lvl >= 3 ? 4 : 1;
              for (let i = 0; i < count; i++) {
                const a = Math.random() * Math.PI * 2;
                s.projectiles.push({ x: s.px, y: s.py, vx: Math.cos(a) * 13, vy: Math.sin(a) * 13, dmg: dmg(8), r: 5, life: 6, piercesLeft: 0, ricochetLeft: 99, ownerId: w.id, hitSet: new Set(), lastHit: -1, color: "#ff4d6d" });
              }
            }
            break;
          }
          case "katana": {
            if (w.t >= cd(0.9) && nearest) {
              w.t = 0;
              const angle = Math.atan2(nearest.y - s.py, nearest.x - s.px);
              const range = 90 + lvl * 10;
              const arc = Math.PI / 2;
              s.enemies.forEach((e) => {
                const ea = Math.atan2(e.y - s.py, e.x - s.px);
                const d = Math.hypot(e.x - s.px, e.y - s.py);
                let diff = Math.abs(ea - angle); if (diff > Math.PI) diff = Math.PI * 2 - diff;
                if (d < range && diff < arc / 2) { e.hp -= dmg(35); s.dmg.push({ x: e.x, y: e.y, v: dmg(35), t: 1, crit: true }); }
              });
              s.sparkles.push({ x: s.px + Math.cos(angle) * range / 2, y: s.py + Math.sin(angle) * range / 2, t: 1, color: "#a3f7ff" });
              (w as any).slashAngle = angle; (w as any).slashT = 0.3; (w as any).slashRange = range;
              if (lvl >= 3) {
                // 4-hit combo
                for (let k = 1; k < 4; k++) {
                  setTimeout(() => {
                    const ang = angle + (k % 2 ? Math.PI : 0);
                    s.enemies.forEach((e) => {
                      const ea = Math.atan2(e.y - s.py, e.x - s.px);
                      const d = Math.hypot(e.x - s.px, e.y - s.py);
                      let diff = Math.abs(ea - ang); if (diff > Math.PI) diff = Math.PI * 2 - diff;
                      if (d < range && diff < arc / 2) { e.hp -= dmg(35); s.dmg.push({ x: e.x, y: e.y, v: dmg(35), t: 1, crit: true }); }
                    });
                  }, k * 110);
                }
              }
            }
            break;
          }
          case "bat": {
            if (w.t >= cd(1.4)) {
              w.t = 0;
              const range = 100;
              const full = lvl >= 3;
              s.enemies.forEach((e) => {
                const d = Math.hypot(e.x - s.px, e.y - s.py);
                if (d < range) {
                  const ang = Math.atan2(e.y - s.py, e.x - s.px);
                  if (full) {
                    e.x += Math.cos(ang) * 30; e.y += Math.sin(ang) * 30;
                  }
                  e.hp -= dmg(45); s.dmg.push({ x: e.x, y: e.y, v: dmg(45), t: 1, crit: true });
                }
              });
              s.shake = Math.max(s.shake, 6);
            }
            break;
          }
          case "warhammer": {
            if (w.t >= cd(2.5)) {
              w.t = 0;
              const range = 110;
              s.enemies.forEach((e) => {
                const d = Math.hypot(e.x - s.px, e.y - s.py);
                if (d < range) {
                  e.hp -= dmg(80); e.stunUntil = performance.now() + (lvl >= 3 ? 1500 : 800);
                  s.dmg.push({ x: e.x, y: e.y, v: dmg(80), t: 1.5, crit: true });
                }
              });
              s.shake = Math.max(s.shake, 10);
            }
            break;
          }
          case "stormbreaker": {
            if (w.t >= cd(2.0)) {
              w.t = 0;
              const range = 130;
              s.enemies.forEach((e) => {
                const d = Math.hypot(e.x - s.px, e.y - s.py);
                if (d < range) {
                  e.hp -= dmg(60);
                  e.stunUntil = performance.now() + 600;
                  s.dmg.push({ x: e.x, y: e.y, v: dmg(60), t: 1.2, crit: true });
                  // chain lightning
                  for (let k = 0; k < 3; k++) {
                    s.sparkles.push({ x: e.x, y: e.y, t: 0.6, color: "#bff5ff" });
                  }
                }
              });
              s.shake = Math.max(s.shake, 8);
            }
            break;
          }
        }
      });
    };

    const spawnEnemy = () => {
      const s = stateRef.current;
      const side = Math.floor(Math.random() * 4);
      let x = 0, y = 0;
      if (side === 0) { x = -20; y = Math.random() * ARENA_H; }
      else if (side === 1) { x = ARENA_W + 20; y = Math.random() * ARENA_H; }
      else if (side === 2) { x = Math.random() * ARENA_W; y = -20; }
      else { x = Math.random() * ARENA_W; y = ARENA_H + 20; }
      const tier = Math.random();
      const w = wave;
      let type = "normal", hp = 22 + w * 10, spd = 0.85 + w * 0.045, r = 16;
      const eliteChance = 0.95 - Math.min(0.15, w * 0.012);
      const tankChance = 0.78 - Math.min(0.10, w * 0.008);
      if (tier > eliteChance && w > 3) { type = "elite"; hp *= 6; r = 30; spd *= 0.9; }
      else if (tier > tankChance) { type = "tank"; hp *= 2.6; r = 24; spd *= 0.75; }
      else if (tier > 0.55) { type = "fast"; hp *= 0.75; spd *= 1.85; r = 14; }
      else if (tier > 0.35 && w > 2) { type = "cyber"; hp *= 1.4; spd *= 1.15; }
      // Boss wave: every 5th wave spawns extra elites at the start
      if (s.bossWave && s.waveSpawned < 3) {
        type = "elite"; hp = (22 + w * 10) * 9; r = 36; spd = (0.85 + w * 0.045) * 0.95;
      }
      s.enemies.push({ x, y, hp, maxHp: hp, spd, r, type, stunUntil: 0 });
    };

    const onPlayerDamaged = (amount: number) => {
      const s = stateRef.current;
      if (s.invuln > 0) return;
      s.invuln = 0.6;
      s.hp = Math.max(0, s.hp - amount);
      setHp(s.hp);
      s.shake = Math.max(s.shake, 8);
      if (s.hp <= 0) {
        s.runningWave = false;
        setPhase("dead");
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = stateRef.current;

      // movement
      let mx = 0, my = 0;
      if (s.keys.has("w") || s.keys.has("arrowup")) my -= 1;
      if (s.keys.has("s") || s.keys.has("arrowdown")) my += 1;
      if (s.keys.has("a") || s.keys.has("arrowleft")) mx -= 1;
      if (s.keys.has("d") || s.keys.has("arrowright")) mx += 1;
      const m = Math.hypot(mx, my) || 1;
      s.px += (mx / m) * s.pspd * (mx || my ? 1 : 0) * 60 * dt;
      s.py += (my / m) * s.pspd * (mx || my ? 1 : 0) * 60 * dt;
      s.px = Math.max(15, Math.min(ARENA_W - 15, s.px));
      s.py = Math.max(15, Math.min(ARENA_H - 15, s.py));

      s.invuln = Math.max(0, s.invuln - dt);
      s.shake *= 0.85;

      // spawning
      s.waveTime += dt;
      const spawnRate = Math.max(0.12, 0.45 - wave * 0.018);
      if (s.waveSpawned < s.waveTotal && s.waveTime > spawnRate * (s.waveSpawned + 1)) {
        spawnEnemy(); s.waveSpawned++;
      }

      // enemies
      s.enemies.forEach((e) => {
        if (e.stunUntil > now) return;
        const dx = s.px - e.x, dy = s.py - e.y;
        const d = Math.hypot(dx, dy) || 1;
        e.x += (dx / d) * e.spd * 60 * dt;
        e.y += (dy / d) * e.spd * 60 * dt;
        if (d < e.r + 14) onPlayerDamaged(8 + wave * 0.5);
      });

      // projectiles
      s.projectiles.forEach((p) => {
        // homing rocket
        if (p.ownerId === "rocket" && p.targetId !== undefined) {
          const tgt = s.enemies[p.targetId];
          if (tgt && tgt.hp > 0) {
            const dx = tgt.x - p.x, dy = tgt.y - p.y;
            const dm = Math.hypot(dx, dy) || 1;
            p.vx = (dx / dm) * 5; p.vy = (dy / dm) * 5;
          } else {
            p.targetId = undefined;
          }
        }
        p.x += p.vx * 60 * dt;
        p.y += p.vy * 60 * dt;
        p.life -= dt;

        s.enemies.forEach((e, ei) => {
          if (e.hp <= 0) return;
          if (p.hitSet.has(ei) && p.ownerId !== "redball") return;
          if (Math.hypot(e.x - p.x, e.y - p.y) < e.r + p.r) {
            // boomerang doesn't dedupe per frame but cooldown
            if (p.lastHit === ei && (p.ownerId === "boomerang" || p.ownerId === "redball")) return;
            e.hp -= p.dmg;
            s.dmg.push({ x: e.x, y: e.y, v: p.dmg, t: 1, crit: false });
            p.hitSet.add(ei);
            p.lastHit = ei;

            // splash for rocket
            if (p.splash) {
              s.enemies.forEach((e2, ei2) => {
                if (ei2 === ei) return;
                if (Math.hypot(e2.x - p.x, e2.y - p.y) < p.splash!) {
                  e2.hp -= p.dmg * 0.6;
                  s.dmg.push({ x: e2.x, y: e2.y, v: p.dmg * 0.6, t: 1, crit: false });
                }
              });
              p.life = 0;
              for (let k = 0; k < 12; k++) s.sparkles.push({ x: p.x, y: p.y, t: 0.6, color: "#ff9056" });
              s.shake = Math.max(s.shake, 5);
            }

            // ricochet (ball / redball)
            if (p.ricochetLeft > 0) {
              p.ricochetLeft--;
              // find new target not just hit
              let best: { e: Enemy; idx: number; d: number } | null = null;
              s.enemies.forEach((e2, ei2) => {
                if (ei2 === ei || e2.hp <= 0) return;
                const d = Math.hypot(e2.x - p.x, e2.y - p.y);
                if (!best || d < best.d) best = { e: e2, idx: ei2, d };
              });
              if (best !== null) {
                const b = best as { e: Enemy; idx: number; d: number };
                const dx = b.e.x - p.x, dy = b.e.y - p.y;
                const dm = Math.hypot(dx, dy) || 1;
                const speed = Math.hypot(p.vx, p.vy);
                p.vx = (dx / dm) * speed; p.vy = (dy / dm) * speed;
                p.lastHit = b.idx;
                if (p.ownerId === "redball") p.hitSet.delete(ei);
              } else {
                if (p.ownerId !== "redball") p.life = 0;
              }
            } else if (p.piercesLeft > 0) {
              p.piercesLeft--;
            } else if (p.ownerId !== "boomerang") {
              p.life = 0;
            }
          }
        });

        // boomerang return
        if (p.ownerId === "boomerang") {
          const t = 2.5 - p.life;
          if (t > 1.0) {
            const dx = s.px - p.x, dy = s.py - p.y;
            const dm = Math.hypot(dx, dy) || 1;
            const speed = 8;
            p.vx = (dx / dm) * speed; p.vy = (dy / dm) * speed;
          }
        }

        // bounce off walls (redball)
        if (p.ownerId === "redball") {
          if (p.x < 0 || p.x > ARENA_W) p.vx *= -1;
          if (p.y < 0 || p.y > ARENA_H) p.vy *= -1;
        }
      });

      // cull
      s.projectiles = s.projectiles.filter((p) => p.life > 0 && p.x > -50 && p.x < ARENA_W + 50 && p.y > -50 && p.y < ARENA_H + 50);

      // weapons fire
      fireWeapons(dt);

      // dead enemies
      const before = s.enemies.length;
      const survivors: Enemy[] = [];
      s.enemies.forEach((e) => { if (e.hp > 0) survivors.push(e); else enemyKilled(e); });
      s.enemies = survivors;
      void before;

      // dmg numbers / sparkles aging
      s.dmg.forEach((d) => { d.t -= dt; d.y -= 30 * dt; });
      s.dmg = s.dmg.filter((d) => d.t > 0);
      s.sparkles.forEach((sp) => sp.t -= dt);
      s.sparkles = s.sparkles.filter((sp) => sp.t > 0);

      // wave done?
      if (s.waveSpawned >= s.waveTotal && s.enemies.length === 0 && s.runningWave) {
        s.runningWave = false;
        if (wave >= 20) setPhase("victory");
        else setPhase("between");
      }

      // ============ RENDER ============
      ctx.save();
      const sk = (Math.random() - 0.5) * s.shake;
      ctx.translate(sk, sk);

      // bg
      const bgGrad = ctx.createRadialGradient(ARENA_W / 2, ARENA_H / 2, 50, ARENA_W / 2, ARENA_H / 2, ARENA_W * 0.7);
      bgGrad.addColorStop(0, "#08131f");
      bgGrad.addColorStop(1, "#02050a");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, ARENA_W, ARENA_H);
      // animated diagonal energy cracks
      const tNow = now / 1000;
      for (let i = 0; i < 4; i++) {
        const cy = ((i * 250 + tNow * 30) % (ARENA_H + 200)) - 100;
        ctx.strokeStyle = `rgba(125,243,255,${0.05 + 0.04 * Math.sin(tNow * 2 + i)})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, cy);
        ctx.lineTo(ARENA_W, cy + 60);
        ctx.stroke();
      }
      // grid
      ctx.strokeStyle = "rgba(80,180,255,0.1)";
      ctx.lineWidth = 1;
      for (let x = 0; x < ARENA_W; x += 50) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ARENA_H); ctx.stroke();
      }
      for (let y = 0; y < ARENA_H; y += 50) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(ARENA_W, y); ctx.stroke();
      }
      // holographic boundary walls
      ctx.strokeStyle = `rgba(125,243,255,${0.5 + 0.2 * Math.sin(tNow * 3)})`;
      ctx.lineWidth = 3;
      ctx.strokeRect(4, 4, ARENA_W - 8, ARENA_H - 8);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(125,243,255,0.25)";
      ctx.strokeRect(20, 20, ARENA_W - 40, ARENA_H - 40);
      // corner cyber structures
      const corner = (cx: number, cy: number) => {
        ctx.strokeStyle = "rgba(125,243,255,0.5)";
        ctx.beginPath();
        ctx.moveTo(cx - 40, cy); ctx.lineTo(cx, cy); ctx.lineTo(cx, cy - 40);
        ctx.stroke();
      };
      corner(60, 60); corner(ARENA_W - 60, 60); corner(60, ARENA_H - 60); corner(ARENA_W - 60, ARENA_H - 60);
      // scrolling holographic ad
      const adText = "▸ TUNG³ NET // SAHUR.SYS ONLINE // KEEP CALCULATING // ";
      ctx.font = `18px "Share Tech Mono", monospace`;
      ctx.fillStyle = "rgba(125,243,255,0.18)";
      const adX = ((tNow * 60) % 600) - 600;
      ctx.fillText(adText + adText, -adX, 30);
      ctx.fillText(adText + adText, -adX + 200, ARENA_H - 14);

      // shield aura render
      const shield = ownedRef.find((w) => w.id === "shield");
      if (shield) {
        const radius = 88 + shield.level * 26;
        const pulse = 0.7 + 0.3 * Math.sin(tNow * 6);
        // outer field
        const grad = ctx.createRadialGradient(s.px, s.py, 10, s.px, s.py, radius);
        grad.addColorStop(0, "rgba(125,243,255,0.05)");
        grad.addColorStop(0.7, `rgba(125,243,255,${0.18 * pulse})`);
        grad.addColorStop(1, `rgba(125,243,255,${0.45 * pulse})`);
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(s.px, s.py, radius, 0, Math.PI * 2); ctx.fill();
        // electric pulse rings
        for (let i = 0; i < 3; i++) {
          const r = ((tNow * 80 + i * radius / 3) % radius);
          ctx.strokeStyle = `rgba(125,243,255,${0.4 * (1 - r / radius)})`;
          ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(s.px, s.py, r, 0, Math.PI * 2); ctx.stroke();
        }
        // hot rim
        ctx.strokeStyle = `rgba(163,247,255,${pulse})`;
        ctx.lineWidth = 2;
        ctx.shadowColor = "#7df3ff"; ctx.shadowBlur = 20;
        ctx.beginPath(); ctx.arc(s.px, s.py, radius, 0, Math.PI * 2); ctx.stroke();
        ctx.shadowBlur = 0;
        // arcing bolts to enemies inside
        s.enemies.forEach((e) => {
          const d = Math.hypot(e.x - s.px, e.y - s.py);
          if (d < radius + e.r) {
            ctx.strokeStyle = `rgba(191,245,255,${0.4 + 0.4 * Math.random()})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(s.px, s.py);
            const mx = (s.px + e.x) / 2 + (Math.random() - 0.5) * 30;
            const my = (s.py + e.y) / 2 + (Math.random() - 0.5) * 30;
            ctx.lineTo(mx, my); ctx.lineTo(e.x, e.y);
            ctx.stroke();
          }
        });
      }

      // enemies
      s.enemies.forEach((e) => {
        const img = sahurRef.current;
        if (img) {
          ctx.save();
          if (e.type === "elite") ctx.shadowColor = "#ff4d6d";
          else if (e.type === "tank") ctx.shadowColor = "#9aff7a";
          else if (e.type === "cyber") ctx.shadowColor = "#7df3ff";
          else if (e.type === "fast") ctx.shadowColor = "#ffd86b";
          else ctx.shadowColor = "#7df3ff";
          ctx.shadowBlur = 12;
          const scale = e.r / 16;
          ctx.translate(e.x, e.y);
          ctx.scale(scale, scale);
          ctx.drawImage(img, -16, -22, 32, 44);
          ctx.restore();
        } else {
          ctx.fillStyle = "#ff7a3d";
          ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2); ctx.fill();
        }
        // hp bar
        const w = e.r * 1.6;
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(e.x - w / 2, e.y - e.r - 8, w, 3);
        ctx.fillStyle = "#7df3ff";
        ctx.fillRect(e.x - w / 2, e.y - e.r - 8, w * (e.hp / e.maxHp), 3);
      });

      // discs render
      ownedRef.filter(w => w.id === "discs").forEach((w) => {
        const discs = (w as any).discs as Array<{ x: number; y: number }> | undefined;
        const n = (w as any).discCount as number | undefined;
        if (discs && n) {
          // orbit trail ring
          ctx.strokeStyle = `rgba(125,243,255,${0.15 + 0.1 * Math.sin(tNow * 8)})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(s.px, s.py, 85 + w.level * 4, 0, Math.PI * 2);
          ctx.stroke();
          for (let i = 0; i < n; i++) {
            const d = discs[i]; if (!d) continue;
            // outer glow
            ctx.fillStyle = "rgba(125,243,255,0.25)";
            ctx.beginPath(); ctx.arc(d.x, d.y, 18, 0, Math.PI * 2); ctx.fill();
            // spin blades
            const spin = tNow * 18 + i;
            ctx.save();
            ctx.translate(d.x, d.y);
            ctx.rotate(spin);
            ctx.shadowColor = "#7df3ff"; ctx.shadowBlur = 18;
            ctx.fillStyle = "#bff5ff";
            for (let k = 0; k < 4; k++) {
              ctx.rotate(Math.PI / 2);
              ctx.beginPath();
              ctx.moveTo(0, 0);
              ctx.lineTo(11, -3);
              ctx.lineTo(13, 0);
              ctx.lineTo(11, 3);
              ctx.closePath();
              ctx.fill();
            }
            // core
            ctx.fillStyle = "#fff";
            ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
            ctx.shadowBlur = 0;
          }
        }
      });

      // katana slash
      ownedRef.filter(w => w.id === "katana").forEach((w) => {
        const ang = (w as any).slashAngle;
        let st = (w as any).slashT;
        if (typeof ang === "number" && st > 0) {
          ctx.save();
          ctx.translate(s.px, s.py);
          ctx.rotate(ang);
          ctx.fillStyle = `rgba(163,247,255,${st})`;
          ctx.beginPath();
          ctx.arc(0, 0, ((w as any).slashRange || 90), -Math.PI / 4, Math.PI / 4);
          ctx.lineTo(0, 0);
          ctx.fill();
          ctx.restore();
          (w as any).slashT = st - dt * 3;
        }
      });

      // projectiles
      s.projectiles.forEach((p) => {
        ctx.save();
        ctx.shadowColor = p.color; ctx.shadowBlur = 18;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });

      // sparkles
      s.sparkles.forEach((sp) => {
        ctx.fillStyle = `rgba(125,243,255,${sp.t})`;
        ctx.beginPath(); ctx.arc(sp.x, sp.y, 3 + (1 - sp.t) * 8, 0, Math.PI * 2); ctx.fill();
      });

      // player
      ctx.save();
      ctx.shadowColor = "#7df3ff"; ctx.shadowBlur = 20;
      ctx.fillStyle = s.invuln > 0 && Math.floor(now / 60) % 2 ? "#fff" : "#7df3ff";
      ctx.beginPath(); ctx.arc(s.px, s.py, 12, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      ctx.fillStyle = "#03060d";
      ctx.fillRect(s.px - 5, s.py - 2, 10, 4);

      // dmg numbers
      s.dmg.forEach((d) => {
        ctx.fillStyle = d.crit ? `rgba(255,217,107,${d.t})` : `rgba(125,243,255,${d.t})`;
        ctx.font = `${d.crit ? 16 : 12}px "Share Tech Mono", monospace`;
        ctx.fillText(Math.round(d.v).toString(), d.x, d.y);
      });

      ctx.restore();

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, owned, wave]);

  const start = () => {
    stateRef.current.hp = maxHp;
    setHp(maxHp);
    setOwned([]);
    setWave(0);
    setScore(0);
    setKillCount(0);
    stateRef.current.enemies = [];
    stateRef.current.projectiles = [];
    stateRef.current.dmg = [];
    stateRef.current.sparkles = [];
    stateRef.current.px = ARENA_W / 2; stateRef.current.py = ARENA_H / 2;
    startWaveQuestion();
  };

  return (
    <div className="font-mono">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="border border-primary px-2 py-1 text-primary glow-border">WAVE {wave}/20</span>
        <span className="border px-2 py-1">HP {hp}/{maxHp}</span>
        <span className="border px-2 py-1 text-muted-foreground">KILLS {killCount}</span>
        <span className="border px-2 py-1 text-muted-foreground">SCORE {score}</span>
        <span className="ml-auto text-[11px] text-muted-foreground">[WASD] move • auto-attack</span>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={ARENA_W}
          height={ARENA_H}
          className="w-full border border-primary glow-border"
          style={{ aspectRatio: `${ARENA_W} / ${ARENA_H}`, imageRendering: "pixelated", background: "#03060d" }}
        />

        {/* HP bar overlay */}
        <div className="absolute left-3 bottom-3 h-2 w-1/3 border border-primary bg-background/60">
          <div className="h-full bg-primary glow-soft transition-all" style={{ width: `${(hp / maxHp) * 100}%` }} />
        </div>

        {/* Owned weapons */}
        <div className="absolute right-3 bottom-3 flex flex-wrap gap-1 max-w-[40%] justify-end">
          {owned.map((w) => (
            <span key={w.id} className="border border-primary bg-background/70 px-1 py-0.5 text-[9px] text-primary glow-border">
              {WEAPONS.find(x => x.id === w.id)?.name} L{w.level}
            </span>
          ))}
        </div>

        {/* Phase overlays */}
        {phase === "intro" && (
          <Overlay>
            <div className="ascii-frame bg-card/95 p-6 text-center max-w-md glow-border">
              <div className="text-2xl font-display text-primary glow-text mb-2">SAHUR SURVIVAL ARENA</div>
              <p className="text-xs text-muted-foreground mb-4">
                Survive 20 waves of Mr Sahurs. Answer questions to choose weapons.
                Owned weapons stack — pick the same one to upgrade.
              </p>
              <button onClick={start} className="border border-primary px-4 py-2 text-primary hover:glow-border">
                ▸ INITIATE SIMULATION
              </button>
              <div className="mt-3 text-[10px] text-muted-foreground">controls: WASD or arrow keys</div>
            </div>
          </Overlay>
        )}
        {phase === "question" && question && (
          <Overlay>
            <QuestionGate question={question} onCorrect={onAnswerCorrect} mustGetCorrect title={`WAVE ${wave + 1} BRIEFING`} />
          </Overlay>
        )}
        {phase === "choose" && (
          <Overlay>
            <div className="ascii-frame bg-card/95 p-5 max-w-3xl w-full glow-border">
              <div className="text-sm text-primary mb-3">&gt; SELECT UPGRADE [{wave + 1 === 1 ? "FIRST WEAPON" : "1 of 3"}]</div>
              <div className="grid gap-3 sm:grid-cols-3">
                {choices.map((id) => {
                  const def = WEAPONS.find(w => w.id === id)!;
                  const ex = owned.find(w => w.id === id);
                  return (
                    <button key={id} onClick={() => pickWeapon(id)}
                      className="border border-border p-3 text-left hover:border-primary hover:glow-border transition">
                      <div className="text-[10px] text-muted-foreground">{def.category}</div>
                      <div className="text-base text-primary glow-text">{def.name}</div>
                      <div className="mt-1 text-[11px] text-muted-foreground">{def.desc}</div>
                      <div className="mt-2 text-[10px] text-success">
                        {ex ? `▲ UPGRADE → L${Math.min(3, ex.level + 1)}` : "▸ NEW"}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </Overlay>
        )}
        {phase === "between" && (
          <Overlay>
            <BetweenWaves wave={wave} bossNext={(wave + 1) % 5 === 0} onContinue={startWaveQuestion} />
          </Overlay>
        )}
        {phase === "dead" && (
          <Overlay>
            <div className="ascii-frame bg-card/95 p-6 text-center max-w-md glow-border">
              <div className="text-3xl font-display text-destructive glow-text mb-2">SYSTEM FAILURE</div>
              <p className="text-xs text-muted-foreground mb-1">Reached wave {wave}. {killCount} Sahurs neutralised.</p>
              <p className="text-xs text-muted-foreground mb-4">Score: {score}</p>
              <button onClick={start} className="border border-primary px-4 py-2 text-primary hover:glow-border">
                ▸ RESTART SIMULATION
              </button>
            </div>
          </Overlay>
        )}
        {phase === "victory" && (
          <Overlay>
            <div className="ascii-frame bg-card/95 p-6 text-center max-w-md glow-border">
              <div className="text-3xl font-display text-success glow-text mb-2">SIMULATION COMPLETE</div>
              <p className="text-xs text-muted-foreground mb-1">All 20 waves survived.</p>
              <p className="text-xs text-muted-foreground mb-4">Final score: {score} • Kills: {killCount}</p>
              <button onClick={start} className="border border-primary px-4 py-2 text-primary hover:glow-border">
                ▸ RUN AGAIN
              </button>
            </div>
          </Overlay>
        )}
      </div>
    </div>
  );
}

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      {children}
    </div>
  );
}

function BetweenWaves({ wave, bossNext, onContinue }: { wave: number; bossNext: boolean; onContinue: () => void }) {
  const [count, setCount] = useState(3);
  useEffect(() => {
    if (count <= 0) { onContinue(); return; }
    const t = setTimeout(() => setCount((c) => c - 1), 800);
    return () => clearTimeout(t);
  }, [count, onContinue]);
  return (
    <div className="ascii-frame bg-card/95 p-5 text-center max-w-md glow-border animate-fade-in">
      <div className="text-xl text-primary glow-text mb-1">▸ WAVE {wave} CLEARED</div>
      <div className={`text-xs mb-3 ${bossNext ? "text-destructive glow-text" : "text-muted-foreground"}`}>
        {bossNext ? `// WARNING: ELITE WAVE ${wave + 1} INCOMING //` : `// next briefing in ${count}s //`}
      </div>
      <div className="text-5xl font-display text-primary glow-text mb-3">{count}</div>
      <button onClick={onContinue} className="border border-primary px-4 py-2 text-primary hover:glow-border text-sm">
        ▸ SKIP
      </button>
    </div>
  );
}

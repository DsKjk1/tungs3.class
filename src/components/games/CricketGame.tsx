import { useCallback, useEffect, useRef, useState } from "react";
import { pickQuestion, type Question } from "@/lib/questions";
import { QuestionGate } from "@/components/games/QuestionGate";
import sahurImg from "@/assets/mr-sahur.png";

/**
 * TUNG³ FUTURISTIC CRICKET
 * -------------------------
 * Inspired by Google Doodle Cricket: simple one-button timing game.
 * - SPACE / CLICK / TAP to swing.
 * - Perfect timing = SIX. Great = FOUR. Good = 2. Early/Late = 1 or miss.
 * - 3 wickets = end of innings.
 * - Educational question gate appears once per over (every 6 balls).
 */

// Canvas world (logical pixels; canvas auto-scales via CSS)
const W = 1280;
const H = 640;

// Pitch + actor positions
const BATTER_X = 240;
const BATTER_Y = 470;
const BOWLER_X = 1060;
const BOWLER_Y = 360;
const STUMP_X = 200;

// Timing zone: where ball X must be when swung
const SWING_ZONE_X = BATTER_X + 30;
const PERFECT_WIN = 16;
const GREAT_WIN = 34;
const GOOD_WIN = 58;
const REACH_WIN = 90;

type Phase = "idle" | "question" | "windup" | "delivery" | "shot" | "result" | "innings_end";
type Verdict = "SIX" | "FOUR" | "TWO" | "ONE" | "DOT" | "OUT_BOWLED" | "OUT_CAUGHT";

interface Ball {
  x: number; y: number;       // current pos
  vx: number; vy: number;     // velocity
  swung: boolean;
  inFlight: boolean;          // post-shot trajectory
  trail: { x: number; y: number; t: number }[];
  spin: number;
  glow: number;
}

interface Fielder { x: number; y: number; t: number; }

interface FloatText { x: number; y: number; text: string; color: string; t: number; size: number; }

interface SahurCrowd { x: number; y: number; bob: number; scale: number; }

export function CricketGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sahurRef = useRef<HTMLImageElement | null>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [balls, setBalls] = useState(0); // total balls bowled
  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    return Number(localStorage.getItem("tung3_cricket_hs") || 0);
  });
  const [combo, setCombo] = useState(0);
  const [longest, setLongest] = useState(0);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [slowmo, setSlowmo] = useState(false);
  const [shake, setShake] = useState(0);
  const [crowdHype, setCrowdHype] = useState(0);

  const state = useRef({
    ball: null as Ball | null,
    fielders: [] as Fielder[],
    floats: [] as FloatText[],
    crowd: [] as SahurCrowd[],
    bowlerArm: 0,    // 0..1 wind-up progress
    batSwing: 0,     // 0..1 swing animation
    pitchSpeed: 1.0, // multiplier
    swingPressed: false,
    raf: 0,
    last: 0,
    shake: 0,
    crowdHype: 0,
  });

  // Preload Mr Sahur sprite
  useEffect(() => {
    const img = new Image();
    img.src = sahurImg;
    img.onload = () => { sahurRef.current = img; };
  }, []);

  // Init crowd
  useEffect(() => {
    const arr: SahurCrowd[] = [];
    for (let i = 0; i < 24; i++) {
      arr.push({
        x: 60 + i * 50 + (Math.random() - 0.5) * 12,
        y: 90 + (i % 2) * 18,
        bob: Math.random() * Math.PI * 2,
        scale: 0.5 + Math.random() * 0.15,
      });
    }
    state.current.crowd = arr;
  }, []);

  // ===== Game flow =====

  const startInnings = useCallback(() => {
    setScore(0); setWickets(0); setBalls(0); setCombo(0);
    setLongest(0); setVerdict(null);
    state.current.pitchSpeed = 1.0;
    askQuestion();
  }, []);

  const askQuestion = () => {
    setQuestion(pickQuestion("env"));
    setShowQuestion(true);
    setPhase("question");
  };

  const onQuestionCorrect = () => {
    setShowQuestion(false);
    beginDelivery();
  };

  const beginDelivery = () => {
    setVerdict(null);
    state.current.bowlerArm = 0;
    state.current.batSwing = 0;
    setPhase("windup");
    // wind-up animation, then bowl
    setTimeout(() => {
      // Create ball at bowler hand. Vary line/length/speed slightly.
      const speedBase = 9 + state.current.pitchSpeed * 1.6;
      const targetY = 460 + (Math.random() - 0.5) * 40;
      const targetX = STUMP_X + (Math.random() - 0.5) * 60;
      const ball: Ball = {
        x: BOWLER_X - 30,
        y: BOWLER_Y - 30,
        vx: 0,
        vy: 0,
        swung: false,
        inFlight: false,
        trail: [],
        spin: 0,
        glow: 1,
      };
      // We'll drive ball with a parametric path for predictable timing
      (ball as any).t0 = performance.now();
      (ball as any).dur = 1000 - state.current.pitchSpeed * 70; // ms to reach batter
      (ball as any).from = { x: ball.x, y: ball.y };
      (ball as any).to = { x: targetX, y: targetY };
      (ball as any).arcY = 200 + Math.random() * 40; // bounce height
      state.current.ball = ball;
      setPhase("delivery");
    }, 600);
  };

  // ===== Swing input =====
  const trySwing = useCallback(() => {
    if (phase !== "delivery") return;
    const b = state.current.ball;
    if (!b || b.swung) return;
    b.swung = true;
    state.current.batSwing = 1;

    const diff = Math.abs(b.x - SWING_ZONE_X);
    let v: Verdict;
    let runs = 0;
    let dist = 0;
    let arcH = 0;
    let vx = -12, vy = -10;

    if (diff <= PERFECT_WIN) {
      v = "SIX"; runs = 6; dist = 1200; arcH = 240;
      vx = -16 - Math.random() * 4; vy = -16 - Math.random() * 3;
      setSlowmo(true);
      setTimeout(() => setSlowmo(false), 700);
      state.current.shake = 14;
      state.current.crowdHype = 1;
    } else if (diff <= GREAT_WIN) {
      v = "FOUR"; runs = 4; dist = 800; arcH = 150;
      vx = -13; vy = -11;
      state.current.shake = 8;
      state.current.crowdHype = 0.7;
    } else if (diff <= GOOD_WIN) {
      v = "TWO"; runs = 2; dist = 500; arcH = 90;
      vx = -10; vy = -8;
      state.current.shake = 4;
    } else if (diff <= REACH_WIN) {
      v = "ONE"; runs = 1; dist = 250; arcH = 50;
      vx = -7; vy = -6;
    } else {
      // swung but missed → bat misses, ball continues. Check if it hits stump.
      b.swung = true;
      // Let delivery code resolve OUT_BOWLED if ball reaches stumps
      // Mark verdict as pending miss
      (b as any).missedSwing = true;
      setShake(2);
      return;
    }

    // Trigger shot trajectory
    b.inFlight = true;
    b.vx = vx;
    b.vy = vy;
    (b as any).shotStart = performance.now();
    (b as any).shotFrom = { x: b.x, y: b.y };
    (b as any).shotDir = vx;
    (b as any).shotArcH = arcH;
    (b as any).shotDist = dist;
    (b as any).verdict = v;
    (b as any).runs = runs;
  }, [phase]);

  // Resolve a delivery → apply runs/wickets, advance ball count, optionally end innings or ask new question.
  const resolveDelivery = useCallback((v: Verdict, runs: number, dist: number) => {
    setVerdict(v);
    setPhase("result");
    setBalls((bb) => bb + 1);
    if (v === "OUT_BOWLED" || v === "OUT_CAUGHT") {
      setWickets((w) => {
        const nw = w + 1;
        if (nw >= 3) {
          // innings end
          setTimeout(() => {
            setPhase("innings_end");
            setHighScore((hs) => {
              const ns = Math.max(hs, score);
              if (typeof window !== "undefined") localStorage.setItem("tung3_cricket_hs", String(ns));
              return ns;
            });
          }, 1400);
        }
        return nw;
      });
      setCombo(0);
    } else {
      setScore((s) => s + runs);
      if (runs >= 4) setCombo((c) => c + 1);
      else if (runs === 0) setCombo(0);
      setLongest((l) => Math.max(l, dist));
    }
    // crank difficulty
    state.current.pitchSpeed = Math.min(2.4, state.current.pitchSpeed + 0.05);

    // After result, queue next ball
    setTimeout(() => {
      if (state.current.ball) state.current.ball = null;
      setPhase((p) => {
        if (p === "innings_end") return p;
        // If wickets reached 3, innings already ended.
        return p;
      });
      // ask question every 6 balls
      setBalls((bb) => {
        if (bb % 6 === 0) {
          setTimeout(() => askQuestion(), 50);
        } else {
          setTimeout(() => beginDelivery(), 50);
        }
        return bb;
      });
    }, 1500);
  }, [score]);

  // Key + click input
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") { e.preventDefault(); trySwing(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [trySwing]);

  // ===== Main render/update loop =====
  useEffect(() => {
    if (phase === "idle" || phase === "innings_end") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    let last = performance.now();

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000) * (slowmo ? 0.3 : 1);
      last = now;
      const s = state.current;
      s.shake *= 0.86;
      s.crowdHype *= 0.96;

      // Update ball
      if (s.ball && phase === "delivery" && !s.ball.inFlight) {
        const b = s.ball as any;
        const elapsed = now - b.t0;
        const t = Math.min(1, elapsed / b.dur);
        // parametric path with bounce arc
        b.x = s.ball.x = b.from.x + (b.to.x - b.from.x) * t;
        // y arc: down then up slightly to batter height
        const baseY = b.from.y + (b.to.y - b.from.y) * t;
        const arcOff = -Math.sin(t * Math.PI) * b.arcY * (1 - t * 0.4);
        s.ball.y = baseY + arcOff;
        s.ball.spin += 0.4;
        s.ball.trail.push({ x: s.ball.x, y: s.ball.y, t: 1 });
        if (s.ball.trail.length > 18) s.ball.trail.shift();

        if (t >= 1) {
          // Reached batter zone. If not swung → OUT_BOWLED or DOT depending where it landed
          if (!s.ball.swung || (s.ball as any).missedSwing) {
            // hit stump?
            const dx = Math.abs(b.to.x - STUMP_X);
            if (dx < 28) {
              resolveDelivery("OUT_BOWLED", 0, 0);
            } else {
              resolveDelivery("DOT", 0, 0);
            }
            s.ball = null;
          }
        }
      } else if (s.ball && s.ball.inFlight) {
        const b = s.ball as any;
        const dt2 = dt;
        s.ball.x += s.ball.vx * 60 * dt2;
        s.ball.y += s.ball.vy * 60 * dt2;
        s.ball.vy += 26 * dt2; // gravity
        s.ball.spin += 0.7;
        s.ball.trail.push({ x: s.ball.x, y: s.ball.y, t: 1 });
        if (s.ball.trail.length > 28) s.ball.trail.shift();

        // resolve when ball lands or leaves field
        if (s.ball.y > 540 || s.ball.x < -100 || s.ball.x > W + 100) {
          const v: Verdict = b.verdict;
          // catch chance: random Sahur fielder may snatch (only for FOUR/SIX with low prob)
          let final: Verdict = v;
          if ((v === "FOUR" || v === "SIX") && Math.random() < 0.06) {
            final = "OUT_CAUGHT";
            // spawn fielder where ball landed
            s.fielders.push({ x: s.ball.x, y: s.ball.y, t: 1 });
          }
          resolveDelivery(final, b.runs, b.shotDist);
          s.ball = null;
        }
      }

      // trail aging
      if (s.ball) {
        s.ball.trail.forEach((p) => (p.t -= dt * 3));
        s.ball.trail = s.ball.trail.filter((p) => p.t > 0);
      }

      // bat swing decay
      if (s.batSwing > 0) s.batSwing = Math.max(0, s.batSwing - dt * 4);

      // floats
      s.floats.forEach((f) => { f.t -= dt; f.y -= 40 * dt; });
      s.floats = s.floats.filter((f) => f.t > 0);

      // fielder fade
      s.fielders.forEach((f) => f.t -= dt * 0.7);
      s.fielders = s.fielders.filter((f) => f.t > 0);

      // ===== RENDER =====
      ctx.save();
      const sk = (Math.random() - 0.5) * s.shake;
      ctx.translate(sk, sk * 0.6);

      // sky / stadium background
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#040912");
      sky.addColorStop(0.55, "#081627");
      sky.addColorStop(1, "#02060d");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // far holographic skyline
      const tNow = now / 1000;
      ctx.fillStyle = "rgba(125,243,255,0.08)";
      for (let i = 0; i < 14; i++) {
        const bx = i * 100;
        const bh = 60 + ((i * 53) % 90);
        ctx.fillRect(bx, 200 - bh, 80, bh);
      }
      // skyline grid lines
      ctx.strokeStyle = "rgba(125,243,255,0.06)";
      for (let y = 0; y < 200; y += 20) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // stadium tiers (back wall)
      ctx.fillStyle = "rgba(8,22,40,0.9)";
      ctx.fillRect(0, 200, W, 80);
      // billboard hologram
      const billboardText = "▸ TUNG³ STADIUM // SAHUR.BOWL.SYS // MR_SAHUR XI // ";
      ctx.font = `bold 22px "Share Tech Mono", monospace`;
      const scroll = (tNow * 80) % 800;
      ctx.fillStyle = `rgba(125,243,255,${0.4 + 0.2 * Math.sin(tNow * 2)})`;
      ctx.fillText(billboardText + billboardText, -scroll, 240);
      // billboard frame
      ctx.strokeStyle = "rgba(125,243,255,0.5)";
      ctx.strokeRect(0, 210, W, 40);

      // crowd: rows of mini Mr Sahurs
      const img = sahurRef.current;
      const hype = s.crowdHype;
      s.crowd.forEach((c) => {
        c.bob += dt * (1 + hype * 4);
        const bobY = Math.sin(c.bob) * (1 + hype * 5);
        if (img) {
          ctx.save();
          ctx.globalAlpha = 0.85;
          ctx.translate(c.x, 130 + bobY);
          ctx.scale(c.scale, c.scale);
          ctx.drawImage(img, -16, -22, 32, 44);
          ctx.restore();
        }
      });
      // second row
      s.crowd.forEach((c, i) => {
        const bobY = Math.sin(c.bob + 1) * (1 + hype * 4);
        if (img) {
          ctx.save();
          ctx.globalAlpha = 0.7;
          ctx.translate(c.x + 25, 170 + bobY);
          ctx.scale(c.scale * 0.85, c.scale * 0.85);
          ctx.drawImage(img, -16, -22, 32, 44);
          ctx.restore();
        }
        void i;
      });

      // ground
      const ground = ctx.createLinearGradient(0, 280, 0, H);
      ground.addColorStop(0, "#06121e");
      ground.addColorStop(1, "#020610");
      ctx.fillStyle = ground;
      ctx.fillRect(0, 280, W, H - 280);
      // glowing field lines
      ctx.strokeStyle = "rgba(125,243,255,0.18)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 14; i++) {
        const y = 300 + i * 24;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      // pitch strip
      ctx.fillStyle = "rgba(125,243,255,0.06)";
      ctx.fillRect(160, 420, 920, 110);
      ctx.strokeStyle = "rgba(125,243,255,0.45)";
      ctx.strokeRect(160, 420, 920, 110);
      // crease lines
      ctx.strokeStyle = "rgba(125,243,255,0.6)";
      ctx.beginPath(); ctx.moveTo(BATTER_X + 40, 420); ctx.lineTo(BATTER_X + 40, 530); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(BOWLER_X - 40, 420); ctx.lineTo(BOWLER_X - 40, 530); ctx.stroke();

      // stumps
      ctx.fillStyle = "rgba(125,243,255,0.9)";
      ctx.shadowColor = "#7df3ff"; ctx.shadowBlur = 18;
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(STUMP_X - 12 + i * 10, 430, 4, 50);
      }
      ctx.shadowBlur = 0;

      // swing-zone marker (subtle target ring under batter)
      const zonePulse = 0.5 + 0.3 * Math.sin(tNow * 4);
      ctx.strokeStyle = `rgba(125,243,255,${0.3 * zonePulse})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(SWING_ZONE_X, 510, 60, 14, 0, 0, Math.PI * 2);
      ctx.stroke();

      // ===== Bowler (Mr Sahur) =====
      if (img) {
        ctx.save();
        ctx.shadowColor = "#ff6b6b"; ctx.shadowBlur = 18;
        ctx.translate(BOWLER_X, BOWLER_Y);
        const bob = Math.sin(tNow * 3) * 2;
        ctx.translate(0, bob);
        ctx.scale(2.4, 2.4);
        ctx.drawImage(img, -16, -22, 32, 44);
        ctx.restore();
      }
      ctx.fillStyle = "rgba(255,107,107,0.8)";
      ctx.font = `12px "Share Tech Mono", monospace`;
      ctx.fillText("MR_SAHUR.bowler", BOWLER_X - 50, BOWLER_Y + 70);

      // ===== Batter (cyber armor figure) =====
      drawBatter(ctx, BATTER_X, BATTER_Y, s.batSwing, tNow);

      // ===== Ball trail =====
      if (s.ball) {
        s.ball.trail.forEach((p, idx) => {
          const a = p.t * (idx / s.ball!.trail.length);
          ctx.fillStyle = `rgba(125,243,255,${a * 0.7})`;
          ctx.beginPath(); ctx.arc(p.x, p.y, 4 + (1 - p.t) * 2, 0, Math.PI * 2); ctx.fill();
        });
        // ball
        ctx.save();
        ctx.shadowColor = "#bff5ff"; ctx.shadowBlur = 24;
        ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.arc(s.ball.x, s.ball.y, 7, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        // INCOMING hint
        if (phase === "delivery" && s.ball.x > 500 && !s.ball.swung) {
          ctx.fillStyle = `rgba(125,243,255,${0.6 + 0.4 * Math.sin(tNow * 12)})`;
          ctx.font = `bold 14px "Share Tech Mono", monospace`;
          ctx.fillText("▸ INCOMING", s.ball.x - 50, s.ball.y - 18);
        }
      }

      // fielder catch flash
      s.fielders.forEach((f) => {
        ctx.fillStyle = `rgba(255,107,107,${f.t})`;
        ctx.beginPath(); ctx.arc(f.x, f.y, 14 + (1 - f.t) * 18, 0, Math.PI * 2); ctx.fill();
        if (img) {
          ctx.save();
          ctx.globalAlpha = f.t;
          ctx.translate(f.x, f.y);
          ctx.scale(1.4, 1.4);
          ctx.drawImage(img, -16, -22, 32, 44);
          ctx.restore();
        }
      });

      // slow-mo tint
      if (slowmo) {
        ctx.fillStyle = "rgba(125,243,255,0.08)";
        ctx.fillRect(0, 0, W, H);
      }

      ctx.restore();
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [phase, slowmo, resolveDelivery]);

  // sync external shake to React (only for outer container)
  useEffect(() => {
    const id = setInterval(() => {
      setShake(state.current.shake);
      setCrowdHype(state.current.crowdHype);
    }, 60);
    return () => clearInterval(id);
  }, []);

  const over = Math.floor(balls / 6);
  const ballInOver = balls % 6;

  return (
    <div className="font-mono">
      {/* HUD */}
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="border border-primary px-2 py-1 text-primary glow-border">
          SCORE {score}/{wickets}
        </span>
        <span className="border px-2 py-1 text-muted-foreground">
          OVER {over}.{ballInOver}
        </span>
        <span className="border px-2 py-1 text-muted-foreground">COMBO x{combo}</span>
        <span className="border px-2 py-1 text-muted-foreground">
          HI {highScore}
        </span>
        <span className="border px-2 py-1 text-muted-foreground">
          LONGEST {Math.round(longest)}
        </span>
        <span className="ml-auto text-[11px] text-muted-foreground">
          [SPACE] / [CLICK] / [TAP] to swing
        </span>
      </div>

      {/* Stadium canvas */}
      <div
        className={`relative w-full overflow-hidden border border-primary glow-border ${shake > 4 ? "animate-pulse" : ""}`}
        style={{ aspectRatio: `${W} / ${H}`, background: "#02060d" }}
        onPointerDown={(e) => { e.preventDefault(); trySwing(); }}
      >
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="block w-full h-full cursor-crosshair"
        />

        {/* Verdict overlay */}
        {verdict && phase === "result" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div
              className={`font-display text-7xl md:text-9xl glow-text drop-shadow-[0_0_30px_var(--glow)] ${
                verdict === "SIX" ? "text-success animate-bounce" :
                verdict === "FOUR" ? "text-primary" :
                verdict === "TWO" || verdict === "ONE" ? "text-muted-foreground" :
                verdict === "DOT" ? "text-muted-foreground" :
                "text-destructive animate-pulse"
              }`}
            >
              {verdict === "SIX" && "CYBER SIX!"}
              {verdict === "FOUR" && "FOUR!"}
              {verdict === "TWO" && "TWO RUNS"}
              {verdict === "ONE" && "SINGLE"}
              {verdict === "DOT" && "DOT BALL"}
              {verdict === "OUT_BOWLED" && "BOWLED!"}
              {verdict === "OUT_CAUGHT" && "CAUGHT BY SAHUR!"}
            </div>
          </div>
        )}

        {/* Combo flash */}
        {combo >= 3 && phase === "result" && (
          <div className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 text-primary glow-text font-display text-2xl animate-pulse">
            COMBO x{combo} • SAHUR DESTROYER
          </div>
        )}

        {/* Crowd hype meter */}
        <div className="absolute top-3 right-3 w-32 h-2 border border-primary bg-background/60 overflow-hidden">
          <div
            className="h-full bg-primary glow-soft transition-all"
            style={{ width: `${Math.min(100, crowdHype * 100)}%` }}
          />
        </div>

        {/* Idle / start */}
        {phase === "idle" && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/85 backdrop-blur-sm p-4">
            <div className="ascii-frame bg-card/95 p-6 text-center max-w-md glow-border">
              <div className="text-3xl font-display text-primary glow-text mb-2">CYBER CRICKET</div>
              <p className="text-xs text-muted-foreground mb-4">
                ONE BUTTON. PERFECT TIMING. INFINITE SAHURS.<br/>
                Tap exactly as the ball reaches the strike zone.
                <br/>3 wickets and the innings ends. Question once per over.
              </p>
              <div className="grid grid-cols-3 gap-2 text-[10px] mb-4">
                <div className="border p-1"><span className="text-success">PERFECT</span><br/>SIX</div>
                <div className="border p-1"><span className="text-primary">GREAT</span><br/>FOUR</div>
                <div className="border p-1"><span className="text-muted-foreground">GOOD</span><br/>1-2</div>
              </div>
              <button
                onClick={startInnings}
                className="border border-primary px-4 py-2 text-primary hover:glow-border"
              >
                ▸ START INNINGS
              </button>
            </div>
          </div>
        )}

        {/* Question gate */}
        {showQuestion && question && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4">
            <QuestionGate
              question={question}
              onCorrect={onQuestionCorrect}
              mustGetCorrect
              title={`OVER ${over + 1} — PRE-OVER BRIEFING`}
            />
          </div>
        )}

        {/* Wind-up flash */}
        {phase === "windup" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="font-display text-3xl text-primary glow-text animate-pulse">&gt; WIND-UP...</div>
          </div>
        )}

        {/* Innings end */}
        {phase === "innings_end" && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4">
            <div className="ascii-frame bg-card/95 p-6 text-center max-w-md glow-border">
              <div className="text-2xl font-display text-destructive glow-text mb-2">INNINGS OVER</div>
              <div className="text-3xl font-display text-primary glow-text mb-2">{score}/3</div>
              <p className="text-xs text-muted-foreground mb-1">Balls faced: {balls}</p>
              <p className="text-xs text-muted-foreground mb-1">Longest shot: {Math.round(longest)}</p>
              <p className="text-xs text-success mb-4">High score: {Math.max(highScore, score)}</p>
              <button
                onClick={startInnings}
                className="border border-primary px-4 py-2 text-primary hover:glow-border"
              >
                ▸ ONE MORE GAME
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tip */}
      <div className="mt-3 text-[11px] text-muted-foreground text-center">
        TIP: PERFECT timing triggers slow-mo + Cyber Six. Watch the ball, ignore the bowler's bluff.
      </div>
    </div>
  );
}

// ===== helpers =====

function drawBatter(ctx: CanvasRenderingContext2D, x: number, y: number, swing: number, tNow: number) {
  // shadow
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.beginPath(); ctx.ellipse(x, y + 60, 32, 6, 0, 0, Math.PI * 2); ctx.fill();

  // body (futuristic armor block)
  ctx.save();
  ctx.shadowColor = "#7df3ff"; ctx.shadowBlur = 14;
  ctx.fillStyle = "#0d2535";
  ctx.fillRect(x - 14, y - 30, 28, 50);
  // chest light
  ctx.fillStyle = `rgba(125,243,255,${0.7 + 0.3 * Math.sin(tNow * 4)})`;
  ctx.fillRect(x - 4, y - 14, 8, 4);
  // helmet
  ctx.fillStyle = "#0d2535";
  ctx.beginPath(); ctx.arc(x, y - 38, 12, 0, Math.PI * 2); ctx.fill();
  // visor
  ctx.fillStyle = "#7df3ff";
  ctx.fillRect(x - 9, y - 40, 18, 4);
  // legs
  ctx.fillStyle = "#0d2535";
  ctx.fillRect(x - 10, y + 20, 8, 28);
  ctx.fillRect(x + 2, y + 20, 8, 28);
  ctx.restore();

  // bat (energy)
  const swingAng = -0.4 + swing * -1.6; // rests at slight back-lift, swings forward
  ctx.save();
  ctx.translate(x + 8, y - 8);
  ctx.rotate(swingAng);
  ctx.shadowColor = "#7df3ff"; ctx.shadowBlur = 18;
  ctx.fillStyle = "#7df3ff";
  ctx.fillRect(0, -2, 6, 50);
  ctx.fillStyle = "#bff5ff";
  ctx.fillRect(0, 8, 6, 38);
  // hot trail when swinging hard
  if (swing > 0.4) {
    ctx.fillStyle = `rgba(125,243,255,${swing * 0.5})`;
    ctx.fillRect(-6, 8, 6, 38);
  }
  ctx.restore();

  ctx.fillStyle = "rgba(125,243,255,0.7)";
  ctx.font = `11px "Share Tech Mono", monospace`;
  ctx.fillText("CYBER_BATTER", x - 36, y + 70);
}

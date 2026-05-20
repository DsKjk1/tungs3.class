import { useEffect, useRef } from "react";
import { useTheme } from "@/lib/theme";

/**
 * Full-screen background atmosphere overlay.
 * - tung   → drifting leaves, fireflies, fog
 * - frost  → falling snow, drifting flakes, occasional gusts
 * - others → nothing (cheap no-op)
 */
export function Atmosphere() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (theme !== "tung" && theme !== "frost") {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    const ctx = canvas.getContext("2d")!;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    // particles
    type P = {
      x: number; y: number; vx: number; vy: number;
      r: number; rot: number; vr: number; life: number; kind: number;
    };
    const count = theme === "frost" ? 140 : 70;
    const parts: P[] = Array.from({ length: count }, () => spawn(theme, w, h, true));

    // fireflies for tung
    type F = { x: number; y: number; vx: number; vy: number; phase: number };
    const fireflies: F[] = theme === "tung"
      ? Array.from({ length: 35 }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          phase: Math.random() * Math.PI * 2,
        }))
      : [];

    let gustT = 0;
    let gustAmt = 0;

    const tick = () => {
      ctx.clearRect(0, 0, w, h);

      // gusts
      gustT += 1;
      if (gustT > 240 && Math.random() < 0.005) {
        gustAmt = (Math.random() * 1.5 + 0.6) * (theme === "frost" ? 2 : 1.2);
        gustT = 0;
      }
      gustAmt *= 0.985;

      // fog band for tung
      if (theme === "tung") {
        const g = ctx.createLinearGradient(0, h * 0.55, 0, h);
        g.addColorStop(0, "rgba(20, 40, 25, 0)");
        g.addColorStop(1, "rgba(40, 70, 45, 0.18)");
        ctx.fillStyle = g;
        ctx.fillRect(0, h * 0.55, w, h * 0.45);
      } else {
        // frost aurora wash at top
        const g = ctx.createLinearGradient(0, 0, 0, h * 0.45);
        g.addColorStop(0, "rgba(120, 200, 255, 0.08)");
        g.addColorStop(1, "rgba(120, 200, 255, 0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h * 0.45);
      }

      // particles
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.x += p.vx + gustAmt * (theme === "frost" ? 1.4 : 0.8);
        p.y += p.vy;
        p.rot += p.vr;
        p.life += 1;
        if (p.y > h + 20 || p.x > w + 40 || p.x < -40) {
          parts[i] = spawn(theme, w, h, false);
          continue;
        }
        drawParticle(ctx, p, theme);
      }

      // fireflies
      if (theme === "tung") {
        for (const f of fireflies) {
          f.x += f.vx;
          f.y += f.vy + Math.sin(f.phase) * 0.2;
          f.phase += 0.04;
          if (f.x < 0 || f.x > w) f.vx *= -1;
          if (f.y < 0 || f.y > h) f.vy *= -1;
          const alpha = 0.4 + Math.sin(f.phase * 1.3) * 0.4;
          ctx.fillStyle = `rgba(180,255,140,${alpha})`;
          ctx.shadowColor = "rgba(160,255,120,0.9)";
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(f.x, f.y, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      ctx.clearRect(0, 0, w, h);
    };
  }, [theme]);

  if (theme !== "tung" && theme !== "frost") return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[5]"
        style={{ mixBlendMode: theme === "frost" ? "screen" : "normal" }}
      />
      {/* CSS atmosphere layer (vignette + silhouettes) */}
      <div className={`pointer-events-none fixed inset-0 z-[1] atmos-${theme}`} aria-hidden />
    </>
  );
}

function spawn(theme: "tung" | "frost", w: number, h: number, anywhere: boolean) {
  if (theme === "frost") {
    return {
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : -10 - Math.random() * 60,
      vx: (Math.random() - 0.5) * 0.4,
      vy: 0.4 + Math.random() * 1.6,
      r: 0.8 + Math.random() * 2.6,
      rot: 0,
      vr: 0,
      life: 0,
      kind: Math.random() < 0.15 ? 1 : 0, // sparkle
    };
  }
  // tung leaf
  return {
    x: Math.random() * w,
    y: anywhere ? Math.random() * h : -20 - Math.random() * 80,
    vx: -0.4 + Math.random() * 0.9,
    vy: 0.5 + Math.random() * 1.1,
    r: 5 + Math.random() * 8,
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 0.04,
    life: 0,
    kind: Math.floor(Math.random() * 3),
  };
}

function drawParticle(
  ctx: CanvasRenderingContext2D,
  p: { x: number; y: number; r: number; rot: number; kind: number; life: number },
  theme: "tung" | "frost",
) {
  if (theme === "frost") {
    ctx.fillStyle = p.kind ? "rgba(220,240,255,0.95)" : "rgba(200,225,245,0.7)";
    if (p.kind) {
      ctx.shadowColor = "rgba(180,220,255,0.9)";
      ctx.shadowBlur = 6;
    }
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    return;
  }
  // leaf
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot + Math.sin(p.life * 0.04) * 0.4);
  const colors = ["#4a7a3a", "#6b8e23", "#8b6b2a", "#3d5a2d"];
  ctx.fillStyle = colors[p.kind % colors.length];
  ctx.beginPath();
  ctx.ellipse(0, 0, p.r, p.r * 0.45, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(20,30,15,0.5)";
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.moveTo(-p.r, 0);
  ctx.lineTo(p.r, 0);
  ctx.stroke();
  ctx.restore();
}

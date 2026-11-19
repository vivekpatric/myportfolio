import { useEffect, useRef } from 'react';

/**
 * A twisted-rope torus knot made of ~2,000 glowing points, drawn on a plain 2D canvas
 * (no three.js needed). It tilts toward your cursor and slowly spins on its own axis.
 */
type V = [number, number, number];

const P = 2;
const Q = 3;
const STEPS = 240; // points along the knot
const RING = 9; // strands around the tube
const TUBE = 0.42; // tube radius

const knot = (t: number): V => {
  const r = Math.cos(Q * t) + 2;
  return [r * Math.cos(P * t), r * Math.sin(P * t), -Math.sin(Q * t)];
};
const sub = (a: V, b: V): V => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: V, b: V) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const unit = (a: V): V => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};
const cross = (a: V, b: V): V => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

function build() {
  const pts: { p: V; warm: boolean }[] = [];
  const e = 0.01;
  for (let i = 0; i < STEPS; i += 1) {
    const t = (i / STEPS) * Math.PI * 2;
    const a = knot(t - e);
    const b = knot(t);
    const c = knot(t + e);
    const T = unit(sub(c, a));
    const acc: V = [a[0] + c[0] - 2 * b[0], a[1] + c[1] - 2 * b[1], a[2] + c[2] - 2 * b[2]];
    const k = dot(acc, T);
    const N = unit([acc[0] - k * T[0], acc[1] - k * T[1], acc[2] - k * T[2]]);
    const B = cross(T, N);
    for (let j = 0; j < RING; j += 1) {
      const f = (j / RING) * Math.PI * 2 + t * 6; // the twist
      const cf = Math.cos(f) * TUBE;
      const sf = Math.sin(f) * TUBE;
      pts.push({
        p: [b[0] + cf * N[0] + sf * B[0], b[1] + cf * N[1] + sf * B[1], b[2] + cf * N[2] + sf * B[2]],
        warm: j % 2 === 1,
      });
    }
  }
  return pts;
}

export default function CursorKnot() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;

    const pts = build();
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mouse = { x: 0.3, y: -0.2 };
    const rot = { x: 0, y: 0 };
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;

    const size = () => {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };

    const draw = (time: number) => {
      rot.x += (mouse.y * 0.9 - rot.x) * 0.07;
      rot.y += (mouse.x * 1.3 - rot.y) * 0.07;
      const spin = calm ? 0.6 : time * 0.0004;
      const [cs, ss] = [Math.cos(spin), Math.sin(spin)];
      const [cyr, syr] = [Math.cos(rot.y), Math.sin(rot.y)];
      const [cxr, sxr] = [Math.cos(rot.x), Math.sin(rot.x)];
      const sc = Math.min(w, h) / 7.4;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (const { p, warm } of pts) {
        const x0 = p[0] * cs - p[1] * ss;
        const y0 = p[0] * ss + p[1] * cs;
        const x1 = x0 * cyr + p[2] * syr;
        const z1 = -x0 * syr + p[2] * cyr;
        const y2 = y0 * cxr - z1 * sxr;
        const z2 = y0 * sxr + z1 * cxr;
        const s = 9 / (9 - z2); // perspective
        const depth = Math.min(1, Math.max(0, (z2 + 3.5) / 7));
        ctx.globalAlpha = 0.18 + 0.82 * depth;
        ctx.fillStyle = warm ? '#ffb48a' : '#f3efc8';
        ctx.beginPath();
        ctx.arc(w / 2 + x1 * sc * s, h / 2 + y2 * sc * s, (0.8 + 1.7 * depth) * s, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (time: number) => {
      draw(time);
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    size();
    const observer = new ResizeObserver(() => {
      size();
      if (calm) draw(0);
    });
    observer.observe(canvas);

    if (calm) {
      draw(0);
    } else {
      window.addEventListener('pointermove', onMove);
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return <canvas ref={ref} className="pr-knot" aria-hidden="true" />;
}
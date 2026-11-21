import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './LensCursor.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * A springy, wavy "lens" that follows the cursor (or finger). Inside it the page is shown in the
 * inverse of your theme: cream background becomes maroon, maroon text becomes cream.
 * The hands artwork is cut out of the lens, so it never changes colour.
 *
 * How the colour swap works: three transparent canvases are stacked over the page, all with the same
 * blob drawn on them, each with its own blend mode. Together they turn every page colour c into
 * (321 - c, 256 - c, 227 - c), which maps your cream exactly onto your maroon and back:
 *   1. white            + "difference"    -> 255 - c
 *   2. rgb(66, 1, 0)    + "plus-lighter"  -> adds 66 to red, 1 to green
 *   3. rgb(0, 0, 28)    + "difference"    -> takes 28 off blue
 * If your theme colours ever change, the three layer colours below are the only things to recompute.
 */
const LAYER_COLORS = ['rgb(255,255,255)', 'rgb(66,1,0)', 'rgb(0,0,28)'];

/* ---- feel: change these to tune it ---- */
const HOLD_MS = 380; // the lens shrinks away this long after the cursor stops
const TRAIL_LIFE_MS = 460; // how long the tail lasts
const SPRING_POS = { k: 190, c: 15 }; // follows the cursor with a little overshoot
const SPRING_RADIUS = { k: 280, c: 19 }; // pops open and settles
const SPRING_JELLY = { k: 420, c: 11 }; // wobble when speeding up or stopping
const MIN_RADIUS = 38; // px, on small phones
const MAX_RADIUS = 56; // px, on desktop
const MAX_TRAIL = 48;
const BLOB_POINTS = 64;

type TrailPoint = { x: number; y: number; t: number };

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, f: number) => a + (b - a) * f;

function addCircle(path: Path2D, x: number, y: number, r: number) {
  path.moveTo(x + r, y);
  path.arc(x, y, r, 0, Math.PI * 2);
}

/** The head of the lens: a smooth closed curve whose edge ripples and stretches with speed. */
function addBlob(
  path: Path2D,
  cx: number,
  cy: number,
  r: number,
  angle: number,
  stretch: number,
  jelly: number,
  amp: number,
  time: number,
) {
  const pts: [number, number][] = [];
  const ca = Math.cos(angle);
  const sa = Math.sin(angle);
  for (let i = 0; i < BLOB_POINTS; i++) {
    const th = (i / BLOB_POINTS) * Math.PI * 2;
    const wave = amp * (0.55 * Math.sin(3 * th + time * 2.4) + 0.45 * Math.sin(5 * th - time * 3.3 + 1.3));
    const rho = r * (1 + wave + jelly * Math.cos(2 * (th - angle)));
    const x = Math.cos(th) * rho;
    const y = Math.sin(th) * rho;
    // stretch along the direction of travel, squeeze across it
    const lx = (x * ca + y * sa) * (1 + stretch);
    const ly = (-x * sa + y * ca) * (1 - stretch * 0.45);
    pts.push([cx + lx * ca - ly * sa, cy + lx * sa + ly * ca]);
  }
  const mid = (a: [number, number], b: [number, number]): [number, number] => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const first = mid(pts[BLOB_POINTS - 1], pts[0]);
  path.moveTo(first[0], first[1]);
  for (let i = 0; i < BLOB_POINTS; i++) {
    const p = pts[i];
    const m = mid(p, pts[(i + 1) % BLOB_POINTS]);
    path.quadraticCurveTo(p[0], p[1], m[0], m[1]);
  }
  path.closePath();
}

function LensCursor() {
  const layer1 = useRef<HTMLCanvasElement>(null);
  const layer2 = useRef<HTMLCanvasElement>(null);
  const layer3 = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvases = [layer1.current, layer2.current, layer3.current];
    if (canvases.some((c) => !c)) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const cs = canvases as HTMLCanvasElement[];
    const ctxs = cs.map((c) => c.getContext('2d') as CanvasRenderingContext2D);
    if (ctxs.some((c) => !c)) return undefined;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0;
    let h = 0;
    const resize = () => {
      w = cs[0].clientWidth;
      h = cs[0].clientHeight;
      cs.forEach((c, i) => {
        c.width = Math.max(1, Math.round(w * dpr));
        c.height = Math.max(1, Math.round(h * dpr));
        ctxs[i].setTransform(dpr, 0, 0, dpr, 0, 0);
      });
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(cs[0]);
    resize();

    const baseRadius = () => clamp(w * 0.1, MIN_RADIUS, MAX_RADIUS);

    let raf = 0;
    let running = false;
    let covered = false;
    let last = 0;
    let lastInput = -1e9;
    let hasPointer = false;
    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0, vx: 0, vy: 0 };
    const rad = { r: 0, v: 0 };
    const jelly = { j: 0, v: 0 };
    let smoothSpeed = 0;
    let prevSpeed = 0;
    let angle = 0;
    const trail: TrailPoint[] = [];

    const setVisible = (on: boolean) => cs.forEach((c) => { c.style.display = on ? 'block' : 'none'; });
    const clearAll = () => ctxs.forEach((c) => c.clearRect(0, 0, w, h));

    const sleep = () => {
      running = false;
      cancelAnimationFrame(raf);
      clearAll();
      setVisible(false); // no blend layers over the page while nothing is happening
    };

    const frame = (now: number) => {
      const dt = clamp((now - last) / 1000, 0.001, 0.033);
      last = now;
      const R = baseRadius();
      const active = hasPointer && now - lastInput < HOLD_MS;

      // 1. the lens follows the pointer on a spring (underdamped, so it overshoots a little)
      const steps = 2;
      const hs = dt / steps;
      for (let i = 0; i < steps; i++) {
        pos.vx += (SPRING_POS.k * (target.x - pos.x) - SPRING_POS.c * pos.vx) * hs;
        pos.vy += (SPRING_POS.k * (target.y - pos.y) - SPRING_POS.c * pos.vy) * hs;
        pos.x += pos.vx * hs;
        pos.y += pos.vy * hs;
      }
      const speed = Math.hypot(pos.vx, pos.vy);
      smoothSpeed += (speed - smoothSpeed) * Math.min(1, dt * 10);
      if (speed > 40) angle = Math.atan2(pos.vy, pos.vx);

      // 2. jelly wobble: kicked when it speeds up or slows down
      const dSpeed = smoothSpeed - prevSpeed;
      prevSpeed = smoothSpeed;
      jelly.v += clamp(dSpeed / 60, -1.2, 1.2) * 3;
      jelly.v += (-SPRING_JELLY.k * jelly.j - SPRING_JELLY.c * jelly.v) * dt;
      jelly.j = clamp(jelly.j + jelly.v * dt, -0.3, 0.3);

      // 3. radius: opens fast (the "reveal"), closes soon after the pointer stops
      const targetRadius = active ? R : 0;
      rad.v += (SPRING_RADIUS.k * (targetRadius - rad.r) - SPRING_RADIUS.c * rad.v) * dt;
      rad.r += rad.v * dt;
      if (rad.r < 0) {
        rad.r = 0;
        rad.v = Math.max(0, rad.v);
      }

      // 4. tail
      if (active) {
        const tail = trail[trail.length - 1];
        if (!tail || Math.hypot(pos.x - tail.x, pos.y - tail.y) > 2) {
          trail.push({ x: pos.x, y: pos.y, t: now });
          if (trail.length > MAX_TRAIL) trail.shift();
        }
      }
      while (trail.length && now - trail[0].t > TRAIL_LIFE_MS) trail.shift();

      if (!active && rad.r < 0.6 && trail.length === 0) {
        sleep();
        return;
      }

      // 5. build one shape (tail circles + wavy head) and paint it on all three layers
      const path = new Path2D();
      const trailRadius = (p: TrailPoint) => R * 0.8 * Math.pow(Math.max(0, 1 - (now - p.t) / TRAIL_LIFE_MS), 1.3);
      for (let i = 0; i < trail.length; i++) {
        const a = trail[i];
        const ra = trailRadius(a);
        if (ra < 0.8) continue;
        addCircle(path, a.x, a.y, ra);
        if (i > 0) {
          const b = trail[i - 1];
          const rb = trailRadius(b);
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          const n = Math.min(24, Math.floor(dist / Math.max(1.5, Math.min(ra, rb) * 0.55)));
          for (let k = 1; k < n; k++) {
            const f = k / n;
            addCircle(path, lerp(b.x, a.x, f), lerp(b.y, a.y, f), lerp(rb, ra, f));
          }
        }
      }
      if (rad.r > 0.6) {
        const amp = 0.05 + 0.14 * clamp(smoothSpeed / 1100, 0, 1); // faster = wavier edge
        const stretch = clamp(smoothSpeed / 1600, 0, 0.35);
        addBlob(path, pos.x, pos.y, rad.r, angle, stretch, jelly.j, amp, now / 1000);
      }

      // the hands artwork is cut out of the lens so its colours never change
      const art = document.querySelector('.artwork_frame')?.getBoundingClientRect();
      const hole = art && art.width > 0 && art.height > 0 ? art : null;

      for (let i = 0; i < ctxs.length; i++) {
        const c = ctxs[i];
        c.clearRect(0, 0, w, h);
        c.fillStyle = LAYER_COLORS[i];
        c.fill(path);
        if (hole) {
          c.save();
          c.globalCompositeOperation = 'destination-out';
          c.fillRect(hole.left, hole.top, hole.width, hole.height);
          c.restore();
        }
      }

      raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      if (running || covered || document.hidden) return;
      running = true;
      setVisible(true);
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const aim = (x: number, y: number, touch: boolean) => {
      const fresh = !running;
      target.x = x;
      target.y = touch ? y - baseRadius() : y; // on a touch screen the lens sits just above the fingertip
      if (fresh) {
        // start from the pointer itself and open from nothing, instead of flying in from the last place
        pos.x = target.x;
        pos.y = target.y;
        pos.vx = 0;
        pos.vy = 0;
        rad.r = 0;
        rad.v = 0;
        jelly.j = 0;
        jelly.v = 0;
        smoothSpeed = 0;
        prevSpeed = 0;
        trail.length = 0;
      }
      hasPointer = true;
      lastInput = performance.now();
      wake();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return; // touch is handled below
      aim(e.clientX, e.clientY, false);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      rad.v += 140; // little pop on click
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) aim(t.clientX, t.clientY, true);
    };
    const onLeave = () => {
      hasPointer = false;
    };
    const onVisibility = () => {
      if (document.hidden) sleep();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('touchstart', onTouch, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('touchend', onLeave, { passive: true });
    window.addEventListener('touchcancel', onLeave, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.addEventListener('visibilitychange', onVisibility);

    // switch it off while the projects section covers the landing page
    const cover = () => {
      covered = true;
      sleep();
    };
    const uncover = () => {
      covered = false;
    };
    const rail = document.getElementById('featured-work');
    const trigger = rail
      ? ScrollTrigger.create({ trigger: rail, start: 'top top', onEnter: cover, onLeaveBack: uncover })
      : null;

    setVisible(false);

    return () => {
      trigger?.kill();
      sleep();
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('touchend', onLeave);
      window.removeEventListener('touchcancel', onLeave);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <>
      <canvas ref={layer1} className="lens-cursor lens-cursor--1" aria-hidden="true" />
      <canvas ref={layer2} className="lens-cursor lens-cursor--2" aria-hidden="true" />
      <canvas ref={layer3} className="lens-cursor lens-cursor--3" aria-hidden="true" />
    </>
  );
}

export default LensCursor;
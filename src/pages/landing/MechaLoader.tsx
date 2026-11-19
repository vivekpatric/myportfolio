import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useLayoutEffect, useRef } from 'react';
import './MechaLoader.css';

const NAME = 'VIVEK PATRIC';
const ROLE = 'FULL STACK ENGINEER';

type Pt = [number, number];
type Poly = { id: string; cls: string; car: Pt[]; bot: Pt[]; at: number; len: number; fade?: boolean };

/** 8-point thin bar (car underbody / side skirt). Same vertex order as the arm and leg shapes. */
const band = (x0: number, x1: number, y0: number, y1: number): Pt[] => {
  const d = (y1 - y0) / 3;
  return [[x0, y0], [x1, y0], [x1, y0 + d], [x1, y0 + 2 * d], [x1, y1], [x0, y1], [x0, y0 + 2 * d], [x0, y0 + d]];
};
const dot = (x: number, y: number): Pt[] => [[x, y], [x, y], [x, y]];

/**
 * Every part is a polygon with a car shape and a robot shape that have the SAME vertex count,
 * so the points slide from one to the other. Listed back to front. `at`/`len` are on a 0-1 timeline.
 * Ground is y=290, robot is centred on x=300.
 */
const POLY: Poly[] = [
  { id: 'legL', cls: 'm-dark', at: 0.25, len: 0.45, car: band(170, 300, 262, 270), bot: [[258, 206], [294, 206], [292, 250], [296, 278], [302, 290], [250, 290], [254, 278], [258, 250]] },
  { id: 'legR', cls: 'm-dark', at: 0.3, len: 0.45, car: band(300, 430, 262, 270), bot: [[306, 206], [342, 206], [342, 250], [346, 278], [350, 290], [298, 290], [304, 278], [308, 250]] },
  { id: 'waist', cls: 'm-dark', at: 0.5, len: 0.35, fade: true, car: [[200, 244], [400, 244], [404, 256], [196, 256]], bot: [[268, 160], [332, 160], [350, 206], [250, 206]] },
  { id: 'armL', cls: 'm-tan', at: 0.3, len: 0.45, car: band(150, 450, 238, 248), bot: [[210, 126], [240, 126], [240, 174], [244, 180], [240, 244], [208, 244], [204, 180], [210, 174]] },
  { id: 'armR', cls: 'm-tan', at: 0.35, len: 0.45, car: band(150, 450, 242, 252), bot: [[360, 126], [390, 126], [390, 174], [396, 180], [392, 244], [360, 244], [356, 180], [362, 174]] },
  { id: 'chest', cls: 'm-body', at: 0.4, len: 0.5, car: [[100, 262], [112, 230], [230, 212], [390, 206], [496, 236], [506, 262]], bot: [[254, 160], [240, 112], [250, 92], [350, 92], [360, 112], [346, 160]] },
  { id: 'belt', cls: 'm-orange', at: 0.5, len: 0.4, car: [[112, 240], [494, 246], [496, 252], [110, 246]], bot: [[266, 160], [334, 160], [334, 170], [266, 170]] },
  { id: 'head', cls: 'm-body', at: 0.55, len: 0.4, car: [[200, 212], [250, 172], [350, 172], [412, 210]], bot: [[282, 94], [278, 52], [322, 52], [318, 94]] },
  { id: 'visor', cls: 'm-visor', at: 0.55, len: 0.4, car: [[222, 208], [256, 182], [340, 182], [390, 205]], bot: [[284, 74], [284, 62], [316, 62], [316, 74]] },
  { id: 'finL', cls: 'm-orange', at: 0.7, len: 0.25, fade: true, car: dot(300, 172), bot: [[284, 54], [262, 22], [298, 50]] },
  { id: 'finR', cls: 'm-orange', at: 0.7, len: 0.25, fade: true, car: dot(300, 172), bot: [[316, 54], [338, 22], [302, 50]] },
];
const CORE = { id: 'core', cls: 'm-core', at: 0.6, len: 0.35, car: [[470, 230], [486, 236], [470, 242], [454, 236]] as Pt[], bot: [[300, 110], [316, 126], [300, 142], [284, 126]] as Pt[] };

/** Wheels become shoulder pads. Radii are [tire, rim, hub]. */
const WHEELS = [
  { id: 'wheelF', car: [430, 256], bot: [374, 108], at: 0.05, len: 0.45 },
  { id: 'wheelR', car: [170, 256], bot: [226, 108], at: 0.1, len: 0.45 },
];
const R_CAR = [34, 22, 8];
const R_BOT = [27, 17, 6];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (v: number) => Math.min(1, Math.max(0, v));

type MechaLoaderProps = { onDone: () => void };

/** Cream supercar that unfolds into an anime-style mech while 0-100% counts up, then fades out. */
export default function MechaLoader({ onDone }: MechaLoaderProps) {
  const root = useRef<HTMLDivElement>(null);
  const els = useRef<Record<string, SVGElement>>({});
  const reg = (id: string) => (el: SVGElement | null) => {
    if (el) els.current[id] = el;
  };

  // the site hides itself with a "boot" class until the first intro piece mounts
  useLayoutEffect(() => {
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => document.documentElement.classList.remove('boot')),
    );
    return () => cancelAnimationFrame(id);
  }, []);

  useGSAP(
    () => {
      const ease = gsap.parseEase('power2.inOut');
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const setPoly = ({ id, car, bot, at, len, fade }: Poly, p: number) => {
        const node = els.current[id];
        if (!node) return;
        const t = ease(clamp((p - at) / len));
        node.setAttribute('points', car.map((c, i) => `${lerp(c[0], bot[i][0], t).toFixed(1)},${lerp(c[1], bot[i][1], t).toFixed(1)}`).join(' '));
        if (fade) node.style.opacity = String(clamp(t * 2.5));
      };

      const draw = (p: number) => {
        POLY.forEach((part) => setPoly(part, p));
        setPoly(CORE, p);
        WHEELS.forEach(({ id, car, bot, at, len }) => {
          const g = els.current[id];
          if (!g) return;
          const t = ease(clamp((p - at) / len));
          g.setAttribute('transform', `translate(${lerp(car[0], bot[0], t).toFixed(1)} ${lerp(car[1], bot[1], t).toFixed(1)})`);
          R_CAR.forEach((r, i) => g.children[i]?.setAttribute('r', lerp(r, R_BOT[i], t).toFixed(1)));
        });
        const eyes = els.current.eyes;
        if (eyes) eyes.style.opacity = String(clamp((p - 0.92) / 0.06));
        const speed = els.current.speed;
        if (speed) speed.style.opacity = String(clamp(1 - p * 5));
      };

      draw(0);
      gsap.from('.ml__name, .ml__role', { y: 14, opacity: 0, stagger: 0.15, duration: 0.7, delay: 0.2 });

      const state = { p: 0 };
      const pct = root.current?.querySelector<HTMLElement>('.ml__pct');
      const fill = root.current?.querySelector<HTMLElement>('.ml__fill');
      const t1=gsap
     
         .timeline({ delay: 0.4,paused:true })

        .to(state, {
          p: 1,
          duration: reduce ? 0.8 : 4.2,
          ease: 'power1.inOut',
          onUpdate: () => {
            draw(state.p);
            if (pct) pct.textContent = `${Math.round(state.p * 100)}%`;
            if (fill) fill.style.transform = `scaleX(${state.p})`;
          },
        })
        // hold on the finished mech for a beat, then fade everything out over the red screen
        .to('.ml__content', { opacity: 0, scale: 1.05, duration: 0.45, ease: 'power2.inOut', onComplete: onDone }, '+=0.15');

        let started = false;
        const start = () => {
          if (started) return;
          started = true;
          requestAnimationFrame(() => requestAnimationFrame(() => t1.play(0)));
        };
        Promise.all([
          document.fonts.ready,
          new Promise<void>((r) =>
            document.readyState === 'complete'
              ? r()
              : window.addEventListener('load', () => r(), { once: true }),
          ),
        ]).then(start);
        window.setTimeout(start, 3000);
    },
    { scope: root },
  );

  return (
    <div className="ml" ref={root}>
      <div className="ml__content">
        <svg className="ml__svg" viewBox="0 0 600 320" aria-hidden="true">
          <ellipse className="m-ground" cx="300" cy="294" rx="230" ry="7" />
          <g ref={reg('speed')} className="ml__speed">
            <line x1="20" x2="90" y1="222" y2="222" />
            <line x1="10" x2="80" y1="244" y2="244" />
            <line x1="30" x2="100" y1="266" y2="266" />
            <line x1="0" x2="60" y1="284" y2="284" />
          </g>
          {POLY.map((part) => (
            <polygon key={part.id} ref={reg(part.id)} className={`m-p ${part.cls}`} />
          ))}
          {WHEELS.map(({ id }) => (
            <g key={id} ref={reg(id)}>
              <circle className="m-p m-tire" />
              <circle className="m-p m-rim" />
              <circle className="m-p m-hub" />
            </g>
          ))}
          <polygon ref={reg(CORE.id)} className={`m-p ${CORE.cls}`} />
          <g ref={reg('eyes')} className="m-eyes">
            <rect x="288" y="64" width="10" height="6" rx="1.5" />
            <rect x="302" y="64" width="10" height="6" rx="1.5" />
          </g>
        </svg>

        <div className="ml__row">
          <span className="ml__bar"><i className="ml__fill" /></span>
          <span className="ml__pct">0%</span>
        </div>
        <p className="ml__name">{NAME}</p>
        <p className="ml__role">{ROLE}</p>
      </div>
    </div>
  );
}
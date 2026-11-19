// import { Suspense, useLayoutEffect, useRef } from 'react';
// import { Canvas } from '@react-three/fiber';
// import { gsap } from 'gsap';
// import GoldChainModel from './TransitionModel';

// type TransitionOverlayProps = {
//   active: boolean;
//   onCovered: () => void;
//   onComplete: () => void;
// };

// export default function TransitionOverlay({ active, onCovered, onComplete }: TransitionOverlayProps) {
//   const rootRef = useRef<HTMLDivElement>(null);

//   useLayoutEffect(() => {
//     if (!active) return;
//     if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
//       onCovered();
//       onComplete();
//       return;
//     }

//     const root = rootRef.current;
//     const cover = root?.querySelector<HTMLElement>('.transition-overlay__mask');
//     const model = root?.querySelector<HTMLElement>('.transition-overlay__model');
//     if (!root || !cover || !model) return;

//     const context = gsap.context(() => {
//       gsap.set(cover, { clipPath: 'inset(0 100% 0 0)' });
//       gsap.set(model, { xPercent: -72, rotation: -17, scale: 0.86 });

//       gsap.timeline({ onComplete })
//         .to(cover, {
//           clipPath: 'inset(0 0% 0 0)',
//           duration: 0.52,
//           ease: 'power4.inOut',
//         })
//         .to(
//           model,
//           {
//             xPercent: 15,
//             rotation: 4,
//             scale: 1.04,
//             duration: 0.68,
//             ease: 'power3.inOut',
//           },
//           0.02,
//         )
//         .call(onCovered, [], 0.53)
//         .to(
//           cover,
//           {
//             clipPath: 'inset(0 0 0 100%)',
//             duration: 0.72,
//             ease: 'power4.inOut',
//           },
//           0.66,
//         )
//         .to(
//           model,
//           {
//             xPercent: 122,
//             rotation: 22,
//             scale: 0.88,
//             duration: 0.8,
//             ease: 'power3.in',
//           },
//           0.62,
//         );
//     }, root);

//     return () => context.revert();
//   }, [active, onCovered, onComplete]);

//   if (!active) return null;

//   return (
//     <div className="transition-overlay" ref={rootRef} aria-hidden="true">
//       <div className="transition-overlay__mask" />
//       <div className="transition-overlay__model">
//         <Canvas
//           dpr={[1, 1.5]}
//           camera={{ position: [0, 0, 8.5], fov: 43 }}
//           gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
//         >
//           <ambientLight intensity={1.2} />
//           <directionalLight position={[4, 5, 6]} intensity={3.2} color="#fff0c3" />
//           <pointLight position={[-4, -2, 5]} intensity={2.5} color="#ffcb55" />
//           <Suspense fallback={null}>
//             <GoldChainModel />
//           </Suspense>
//         </Canvas>
//       </div>
//       <div className="transition-overlay__label">
//         <span>VP / FIELD NOTES</span>
//         <span>Changing perspective</span>
//       </div>
//     </div>
//   );
// }
import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import './TransitionOverlay.css';

type TransitionOverlayProps = {
  active: boolean;
  onCovered: () => void;
  onComplete: () => void;
};

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const randomTurn = () => gsap.utils.random([-90, 90, 180]) as number;

/** Roughly square cells, about 120px wide, clamped so phones and ultrawides both look right. */
function measureGrid() {
  const cols = Math.max(6, Math.min(16, Math.round(window.innerWidth / 120)));
  const size = window.innerWidth / cols;
  const rows = Math.max(4, Math.ceil(window.innerHeight / size));
  return { cols, rows };
}

/**
 * 1. Red and cream grid lines cross the screen.
 * 2. Checkerboard "puzzle pieces" spin in from the top-left until the page is covered.
 * 3. The page swaps underneath (onCovered).
 * 4. The pieces spin away toward the bottom-right, revealing the new page.
 */
function GridWipe({ onCovered, onComplete }: Omit<TransitionOverlayProps, 'active'>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [{ cols, rows }] = useState(measureGrid);
  const coveredRef = useRef(onCovered);
  const completeRef = useRef(onComplete);

  useLayoutEffect(() => {
    coveredRef.current = onCovered;
    completeRef.current = onComplete;
  });

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      const cells = gsap.utils.toArray<HTMLElement>('.pt__cell');
      const hLines = gsap.utils.toArray<HTMLElement>('.pt__line--h');
      const vLines = gsap.utils.toArray<HTMLElement>('.pt__line--v');
      const mark = root.querySelector<HTMLElement>('.pt__mark');
      const lines = [...hLines, ...vLines];

      gsap.set(cells, { scale: 0, rotation: randomTurn, transformOrigin: '50% 50%' });
      gsap.set(hLines, { scaleX: 0, transformOrigin: (i: number) => (i % 2 ? '100% 50%' : '0% 50%') });
      gsap.set(vLines, { scaleY: 0, transformOrigin: (i: number) => (i % 2 ? '50% 100%' : '50% 0%') });
      gsap.set(mark, { opacity: 0, scale: 0.7 });
      
      // const t1=gsap.timeline({ onComplete: () => completeRef.current() });

      //   // 1. lines cross
      //   t1
      //   .to(hLines, { scaleX: 1, duration: 0.45, ease: 'power3.inOut', stagger: 0.025 }, 0)
      //   .to(vLines, { scaleY: 1, duration: 0.45, ease: 'power3.inOut', stagger: 0.02 }, 0.05)
      //   // 2. pieces fill the screen (scale 1.03 so neighbours overlap and no hairline gaps show)
      //   .to(
      //     cells,
      //     {
      //       scale: 1.03,
      //       rotation: 0,
      //       duration: 0.38,
      //       ease: 'back.out(1.5)',
      //       stagger: { amount: 0.35, grid: [rows, cols], from: 'start' },
      //     },
      //     0.25,
      //   )
      //   .to(mark, { opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out' }, '>-0.12')
      //   // 3. fully covered: swap the page
      //   .call(() => {
      //     t1.pause();
      //     coveredRef.current();
      //     requestAnimationFrame(() => requestAnimationFrame(() => t1.resume()));
      //   })
      //   .to(mark, { opacity: 0, scale: 0.8, duration: 0.2, ease: 'power2.in' }, '+=0.06')
      //   // 4. pieces leave from the opposite corner
      //   .to(
      //     cells,
      //     {
      //       scale: 0,
      //       rotation: randomTurn,
      //       duration: 0.36,
      //       ease: 'power3.in',
      //       stagger: { amount: 0.4, grid: [rows, cols], from: 'end' },
      //     },
      //     '<',
      //   )
      //   .to(lines, { opacity: 0, duration: 0.2 }, '<');
      const tl = gsap.timeline({ onComplete: () => completeRef.current() });
tl
  .to(hLines, { scaleX: 1, duration: 0.3, ease: 'power3.inOut', stagger: 0.015 }, 0)
  .to(vLines, { scaleY: 1, duration: 0.3, ease: 'power3.inOut', stagger: 0.012 }, 0.03)
  .to(cells, { scale: 1.03, rotation: 0, duration: 0.28, ease: 'back.out(1.2)',
    stagger: { amount: 0.25, grid: [rows, cols], from: 'start' } }, 0.15)
  .to(mark, { opacity: 1, scale: 1, duration: 0.18, ease: 'power2.out' }, '>-0.1')
  .call(() => {
    tl.pause();
    coveredRef.current();
    requestAnimationFrame(() => requestAnimationFrame(() => tl.resume()));
  })
  .to(mark, { opacity: 0, scale: 0.8, duration: 0.15, ease: 'power2.in' }, '+=0.02')
  .to(cells, { scale: 0, duration: 0.28, ease: 'power2.in',
    stagger: { amount: 0.3, grid: [rows, cols], from: 'start' } }, '<')
  .to(lines, { opacity: 0, duration: 0.45 }, '<');
    }, root);

    return () => context.revert();
  }, [cols, rows]);

  return (
    <div
      className="pt"
      ref={rootRef}
      aria-hidden="true"
      style={{ '--cols': cols, '--rows': rows } as CSSProperties}
    >
      <div className="pt__lines">
        {Array.from({ length: rows - 1 }, (_, k) => (
          <span key={`h${k}`} className="pt__line pt__line--h" style={{ '--k': k + 1 } as CSSProperties} />
        ))}
        {Array.from({ length: cols - 1 }, (_, k) => (
          <span key={`v${k}`} className="pt__line pt__line--v" style={{ '--k': k + 1 } as CSSProperties} />
        ))}
      </div>

      <div className="pt__grid">
        {Array.from({ length: rows * cols }, (_, i) => {
          const row = Math.floor(i / cols);
          const col = i % cols;
          return <span key={i} className={`pt__cell ${(row + col) % 2 ? 'pt__cell--cream' : 'pt__cell--red'}`} />;
        })}
      </div>

      <div className="pt__mark"><span>VP</span></div>
    </div>
  );
}

export default function TransitionOverlay({ active, onCovered, onComplete }: TransitionOverlayProps) {
  const reduce = active && prefersReducedMotion();

  // Reduced motion: swap instantly, no overlay
  useLayoutEffect(() => {
    if (!reduce) return;
    onCovered();
    onComplete();
  }, [reduce, onCovered, onComplete]);

  if (!active || reduce) return null;
  return <GridWipe onCovered={onCovered} onComplete={onComplete} />;
}

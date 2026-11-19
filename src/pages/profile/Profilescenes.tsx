// import { useEffect, useState } from 'react';

// /** Keeps only the scene images that actually load (broken links are dropped). */
// export function useWorkingScenes(all: string[]) {
//   const [scenes, setScenes] = useState(all);
//   useEffect(() => {
//     all.forEach((src) => {
//       const img = new Image();
//       img.onerror = () => setScenes((current) => current.filter((item) => item !== src));
//       img.src = src;
//     });
//   }, [all]);
//   return scenes;
// }

// type BackdropProps = { scenes: string[]; active: number | null };

// /** Fixed full-screen photo layer. Fades in while a bar segment is hovered. */
// export function ProfileSceneBackdrop({ scenes, active }: BackdropProps) {
//   return (
//     <div className={`prs-backdrop${active !== null ? ' is-on' : ''}`} aria-hidden="true">
//       {scenes.map((src, i) => (
//         <div key={src} className={`prs-layer${i === active ? ' is-current' : ''}`} style={{ backgroundImage: `url(${src})` }} />
//       ))}
//     </div>
//   );
// }

// type BarProps = { total: number; active: number | null; onSelect: (index: number | null) => void };

// /**
//  * One segment per scene. The scene changes the moment the pointer touches a segment,
//  * including the last one, so there is no waiting.
//  */
// export function ProfileSceneBar({ total, active, onSelect }: BarProps) {
//   return (
//     <div
//       className="prs-bar"
//       role="group"
//       aria-label="Background scenes"
//       onPointerLeave={(event) => {
//         if (event.pointerType === 'mouse') onSelect(null);
//       }}
//     >
//       <span className="prs-bar__hint">Hover to change the scene</span>
//       <div className="prs-bar__track">
//         {Array.from({ length: total }, (_, i) => (
//           <button
//             key={i}
//             type="button"
//             className={`prs-seg${active !== null && i <= active ? ' is-filled' : ''}${i === active ? ' is-current' : ''}`}
//             aria-label={`Scene ${i + 1}`}
//             aria-pressed={i === active}
//             onPointerEnter={() => onSelect(i)}
//             onClick={() => onSelect(i)}
//             onFocus={() => onSelect(i)}
//             onBlur={() => onSelect(null)}
//           >
//             {String(i + 1).padStart(2, '0')}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }
import { useCallback, useEffect, useRef, useState } from 'react';

/** Number of boxes in the energy bar. Each box reveals another 20% of the screen. */
export const STEPS = 5;

/** Keeps only the scene images that actually load (broken links are dropped). */
// export function useWorkingScenes(all: string[]) {
//   const [scenes, setScenes] = useState(all);
//   useEffect(() => {
//     all.forEach((src) => {
//       const img = new Image();
//       img.onerror = () => setScenes((current) => current.filter((item) => item !== src));
//       img.src = src;
//     });
//   }, [all]);
//   return scenes;
// }
export const isVideo = (src: string) => /\.(mp4|webm|ogg)(\?|#|$)/i.test(src);

/** Keeps only the scenes that actually load (broken links are dropped). */
// export function useWorkingScenes(all: string[]) {
//   const [scenes, setScenes] = useState(all);
//   useEffect(() => {
//     all.forEach((src) => {
//       const probe: HTMLImageElement | HTMLVideoElement = isVideo(src) ? document.createElement('video') : new Image();
//       probe.onerror = () => setScenes((current) => current.filter((item) => item !== src));
//       if (probe instanceof HTMLVideoElement) probe.preload = 'metadata';
//       probe.src = src;
//     });
//   }, [all]);
//   return scenes;
// }
export function useWorkingScenes(all: string[]) {
  const [scenes, setScenes] = useState(all);
  useEffect(() => {
    const remote = all.filter((src) => /^https?:\/\//i.test(src) && !isVideo(src));
    const probes = remote.map((src) => {
      const img = new Image();
      img.onerror = () => setScenes((c) => c.filter((s) => s !== src));
      img.src = src;
      return img;
    });
    return () => probes.forEach((img) => { img.onerror = null; });
  }, [all]);
  return scenes;
}
/**
 * level   = how many boxes are charged right now (0-5)
 * applied = index of the image that is currently the page background (-1 = none yet)
 * next    = index of the image being revealed by the bar
 * Charging all 5 boxes applies `next`, then the bar empties and the following image is queued.
 */
export function useSceneCycle(count: number) {
  const [level, setLevel] = useState(0);
  const [applied, setApplied] = useState(-1);
  const locked = useRef(false);
  const timer = useRef(0);
  const next = count ? (applied + 1) % count : 0;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const select = useCallback(
    (nextLevel: number) => {
      if (locked.current || !count) return;
      setLevel(nextLevel);
      if (nextLevel >= STEPS) {
        locked.current = true; // let the 100% reveal finish before committing
        timer.current = window.setTimeout(() => {
          setApplied((a) => (a + 1) % count);
          setLevel(0);
          locked.current = false;
        }, 650);
      }
    },
    [count],
  );

  return { level, applied, next, select };
}

export type SceneCycle = ReturnType<typeof useSceneCycle>;

const COLS = 28; // block columns; rows follow the screen's shape
const BAND = 4; // width of the pixelated leading edge, in blocks

/**
 * Reveals `src` from left to right. Hovering box N opens the first N x 20% of the screen.
 * The leading edge is a ragged band of blocks that start as chunky pixels and sharpen as the
 * wipe moves past them. The front glides smoothly to each new level, and back again if you leave.
 */
function PixelReveal({ src, level }: { src: string; level: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engine = useRef<{ update: (l: number) => void } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;

    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tiny = document.createElement('canvas');
    tiny.width = 8;
    tiny.height = 8;
    const tctx = tiny.getContext('2d');
    // const img = new Image();
    const vid = isVideo(src);
    const img: HTMLImageElement | HTMLVideoElement = vid ? document.createElement('video') : new Image();
    const iw = () => (img instanceof HTMLVideoElement ? img.videoWidth : img.naturalWidth);
    const ih = () => (img instanceof HTMLVideoElement ? img.videoHeight : img.naturalHeight);
    let W = 0;
    let H = 0;
    let cell = 1;
    let front = 0;
    let target = 0;
    let lvl = 0;
    let raf = 0;
    let last = 0;
    let ready = false;
    let jitter: number[] = [];

    // how far right the reveal has to travel; at 100% it overshoots so the ragged edge clears the screen
    const goal = () => (lvl >= STEPS ? W + cell * (BAND + 4) : (lvl / STEPS) * W);

    const frame = (now: number) => {
      const dt = last ? now - last : 16;
      last = now;
            if (img instanceof HTMLVideoElement && img.readyState < 2) {
        raf = requestAnimationFrame(frame); // wait for the first video frame
        return;
      }
      front += (target - front) * (1 - Math.exp(-dt / 150));
      if (Math.abs(target - front) < 0.5) front = target;

      ctx.clearRect(0, 0, W, H);
      // const scale = Math.max(W / img.naturalWidth, H / img.naturalHeight); // "cover"
      // const ox = (W - img.naturalWidth * scale) / 2;
      // const oy = (H - img.naturalHeight * scale) / 2;
      const scale = Math.max(W / iw(), H / ih()); // "cover"
      const ox = (W - iw() * scale) / 2;
      const oy = (H - ih() * scale) / 2;
      const band = cell * BAND;

      for (let i = 0; i < jitter.length; i += 1) {
        const bx = (i % COLS) * cell;
        const by = Math.floor(i / COLS) * cell;
        const a = Math.min(1, Math.max(0, (front - bx - jitter[i]) / band));
        if (a <= 0) continue;
        const sx = (bx - ox) / scale;
        const sy = (by - oy) / scale;
        const s = cell / scale;

        if (a < 1 && tctx) {
          const px = a < 0.33 ? 2 : a < 0.66 ? 4 : 7; // chunky first, finer as the wipe passes
          tctx.clearRect(0, 0, 8, 8);
          tctx.drawImage(img, sx, sy, s, s, 0, 0, px, px);
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(tiny, 0, 0, px, px, bx, by, cell + 1, cell + 1);
        } else {
          ctx.imageSmoothingEnabled = true;
          ctx.drawImage(img, sx, sy, s, s, bx, by, cell + 1, cell + 1);
        }
      }
      // raf = front !== target ? requestAnimationFrame(frame) : 0;
            raf = front !== target || (vid && target > 0) ? requestAnimationFrame(frame) : 0; // videos keep drawing while revealed
    };

    const kick = () => {
      if (!ready || raf) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };

    const layout = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cell = Math.ceil(W / COLS);
      const rows = Math.ceil(H / cell);
      jitter = Array.from({ length: COLS * rows }, () => Math.random() * cell * 3); // ragged, stair-step edge
      target = goal();
    };

    const onResize = () => {
      if (!ready) return;
      layout();
      kick();
    };

    // img.onload = () => {
    //   ready = true;
    //   layout();
    //   kick();
    // };
    // img.src = src;
        const onReady = () => {
      ready = true;
      layout();
      kick();
    };
    if (img instanceof HTMLVideoElement) {
      img.muted = true;
      img.loop = true;
      img.playsInline = true;
      img.preload = 'auto';
      img.onloadeddata = onReady;
      img.src = src;
      img.play().catch(() => {});
    } else {
      img.onload = onReady;
      img.src = src;
    }
    window.addEventListener('resize', onResize);

    engine.current = {
      update: (l) => {
        lvl = l;
        if (!ready) return;
        target = goal();
        if (calm) front = target;
        kick();
      },
    };

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      img.onload = null;
      if (img instanceof HTMLVideoElement) {
        img.onloadeddata = null;
        img.pause();
        img.removeAttribute('src');
        img.load();
      }
      engine.current = null;
    };
  }, [src]);

  useEffect(() => {
    engine.current?.update(level);
  }, [level, src]);

  return <canvas ref={canvasRef} className="prs-reveal" />;
}
/** Fixed full-screen layer: the applied image, with the next image wiping in from the top. */
export function ProfileSceneBackdrop({ scenes, cycle }: { scenes: string[]; cycle: SceneCycle }) {
  const { level, applied, next } = cycle;
  const base = scenes[applied];
  const incoming = scenes[next];
    return (
    <div className="prs-backdrop" aria-hidden="true">
            {base &&
        (isVideo(base) ? (
              <video
                key={base}
                className="prs-base"
                src={base}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div key={base} className="prs-base" style={{ backgroundImage: `url(${base})` }} />
        ))}
      {/* {incoming && <PixelReveal key={`${incoming}-${applied}`} src={incoming} level={level} />} */}
      {incoming && level > 0 && <PixelReveal key={`${incoming}-${applied}`} src={incoming} level={level} />}
      <div className="prs-veil" />
    </div>
  );
  
}

/** Energy-level bar: five boxes. Hovering box N charges boxes 1 to N. */
export function ProfileSceneBar({ cycle, count }: { cycle: SceneCycle; count: number }) {
  const { level, applied, select } = cycle;
  return (
    <div
      className="prs-bar"
      role="group"
      aria-label="Background scene charger"
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse') select(0);
      }}
    >
      <div className="prs-bar__meta">
        <span>Hover to Change Background · {level * 20}%</span>
        <span>{applied >= 0 ? `Scene ${applied + 1}/${count}` : 'No scene yet'}</span>
      </div>
      <div className="prs-shell">
        <div className="prs-cells">
          {Array.from({ length: STEPS }, (_, i) => (
            <button
              key={i}
              type="button"
              className={`prs-cell${i < level ? ' is-on' : ''}`}
              aria-label={`Charge to ${(i + 1) * 20} percent`}
              onPointerEnter={() => select(i + 1)}
              onClick={() => select(i + 1)}
              onFocus={() => select(i + 1)}
              onBlur={() => select(0)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/** Number of vertical strips the next background is revealed through. Must match the markup. */
export const SCENE_STRIPS = 20;

const HIDDEN = 'inset(0% 0% 100% 0%)';
const REARM_BELOW = 0.85; // after a swap, move back below 85% of the bar before scrubbing again
const STRIP_DURATION = 0.5;
const STRIP_STAGGER = 0.014;

const cssUrl = (src: string) => `url("${src.replace(/"/g, '%22')}")`;

/** Resolves with the src when the image loaded and decoded, or null if it failed. */
function preload(src: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      const done = () => resolve(src);
      if (typeof img.decode === 'function') img.decode().then(done, done);
      else done();
    };
    img.onerror = () => {
      console.warn(`[scenes] could not load ${src}`);
      resolve(null);
    };
    img.src = src;
  });
}

/**
 * Hover bar that peels a page background in, strip by strip.
 *
 * - Pointer position over the bar (0–100%) decides how many of the strips show the NEXT image.
 *   20% of the bar = 20% of the strips (4 of 20), each strip stepping in as 4 blocks.
 * - Reaching the far end swaps it in as the new base and queues the following image (loops forever).
 * - Leaving the bar peels the strips back off. Keyboard: Enter / Space / ← → also change scenes.
 * - Images that fail to load are skipped, so a bad link can never break the loop.
 */
export default function useSceneReveal(images: readonly string[]) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const backdrop = backdropRef.current;
    const bar = barRef.current;
    if (!backdrop || !bar || images.length === 0) return;

    const host = backdrop.querySelector<HTMLElement>('.scene__strips');
    const track = bar.querySelector<HTMLElement>('.scene-bar__track');
    const fill = bar.querySelector<HTMLElement>('.scene-bar__fill');
    const counter = bar.closest('.scene-row')?.querySelector<HTMLElement>('[data-scene-count]') ?? null;
    const strips = gsap.utils.toArray<HTMLElement>('.scene__strip', backdrop);
    if (!host || !track || !fill || strips.length === 0) return;

    const total = strips.length;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const settle = reduce ? 0.05 : STRIP_DURATION + total * STRIP_STAGGER + 0.08;

    let alive = true;
    let ready = false;
    let playlist: string[] = [];
    let base = 0; // image currently shown as the full background
    let target = 1; // image currently being revealed through the strips
    let armed = true;
    let busy = false; // true while a swap is being committed
    let inside = false;
    let lastP = 0;
    let pending: gsap.core.Tween | null = null;
    const shown: boolean[] = new Array<boolean>(total).fill(false);

    gsap.set(strips, { clipPath: HIDDEN });
    gsap.set(fill, { scaleX: 0 });
    const quickFill = gsap.quickTo(fill, 'scaleX', { duration: reduce ? 0.01 : 0.3, ease: 'power3.out' });

    /* strip images must be exactly as wide as the stage so every strip lines up */
    const measure = () => host.style.setProperty('--stage-w', `${host.clientWidth}px`);
    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(host);

    const setPeek = (value: boolean) => {
      backdrop.dataset.peek = String(value);
    };

    const paintLabel = () => {
      const n = playlist.length;
      if (counter) counter.textContent = `${String(base + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}`;
      bar.setAttribute('aria-valuenow', String(base + 1));
      bar.setAttribute('aria-valuemax', String(n));
      bar.setAttribute('aria-valuetext', `Scene ${base + 1} of ${n}`);
    };

    const killPending = () => {
      pending?.kill();
      pending = null;
    };

    /** Show the first `count` strips, hide the rest. Only strips whose state changes are animated. */
    const reveal = (count: number) => {
      const changed: number[] = [];
      for (let i = 0; i < total; i += 1) {
        const want = i < count;
        if (shown[i] !== want) {
          shown[i] = want;
          changed.push(i);
        }
      }
      if (changed.length === 0) return;

      const showing = shown[changed[0]]; // a single call only ever moves in one direction
      const ordered = showing ? changed : [...changed].reverse();
      ordered.forEach((strip, order) => {
        gsap.to(strips[strip], {
          clipPath: showing ? 'inset(0% 0% 0% 0%)' : HIDDEN,
          duration: reduce ? 0 : STRIP_DURATION,
          delay: reduce ? 0 : order * STRIP_STAGGER,
          ease: 'steps(4)', // four blocks per strip
          overwrite: 'auto',
        });
      });
    };

    /** The target image is fully revealed: make it the base and queue the next one. */
    const commit = () => {
      pending = null;
      if (!alive) return;
      busy = true;
      base = target;
      backdrop.style.setProperty('--base-img', cssUrl(playlist[base]));
      paintLabel();

      // One frame later the base already shows the same picture, so hiding the strips is invisible.
      requestAnimationFrame(() => {
        if (!alive) return;
        gsap.killTweensOf(strips);
        gsap.set(strips, { clipPath: HIDDEN });
        shown.fill(false);
        target = (base + 1) % playlist.length;
        host.style.setProperty('--next-img', cssUrl(playlist[target]));
        armed = false; // must move back left before the next scrub starts
        busy = false;
        setPeek(inside);
        quickFill(inside ? lastP : 0);
      });
    };

    const update = (p: number) => {
      if (!ready || busy) return;
      quickFill(p);
      if (!armed) {
        if (p >= REARM_BELOW) return;
        armed = true;
      }
      const count = Math.round(p * total);
      reveal(count);
      if (count >= total) {
        if (!pending) pending = gsap.delayedCall(settle, commit);
      } else if (pending) {
        killPending();
      }
    };

    const leave = () => {
      killPending();
      armed = true;
      quickFill(0);
      if (!busy) reveal(0);
    };

    const step = (direction: 1 | -1) => {
      if (!ready || busy || shown.some(Boolean)) return;
      busy = true;
      setPeek(true);
      target = (base + direction + playlist.length) % playlist.length;
      host.style.setProperty('--next-img', cssUrl(playlist[target]));
      reveal(total);
      quickFill(1);
      pending = gsap.delayedCall(settle, commit);
    };

    /* ---------- input ---------- */
    const toProgress = (clientX: number) => {
      const rect = track.getBoundingClientRect();
      return rect.width > 0 ? gsap.utils.clamp(0, 1, (clientX - rect.left) / rect.width) : 0;
    };
    const onMove = (event: PointerEvent) => {
      inside = true;
      setPeek(true);
      lastP = toProgress(event.clientX);
      update(lastP);
    };
    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') {
        try {
          bar.setPointerCapture(event.pointerId);
        } catch {
          /* pointer already gone */
        }
      }
      onMove(event);
    };
    const onLeave = () => {
      inside = false;
      lastP = 0;
      if (!busy) setPeek(false);
      leave();
    };
    const onUp = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') onLeave();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        step(1);
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
        event.preventDefault();
        step(-1);
      }
    };

    bar.addEventListener('pointermove', onMove);
    bar.addEventListener('pointerdown', onDown);
    bar.addEventListener('pointerup', onUp);
    bar.addEventListener('pointerleave', onLeave);
    bar.addEventListener('pointercancel', onLeave);
    bar.addEventListener('keydown', onKey);

    /* ---------- loading: start fetching only when the footer is near ---------- */
    const start = async () => {
      const loaded = await Promise.all(images.map(preload));
      if (!alive) return;
      playlist = loaded.filter((src): src is string => src !== null);
      if (playlist.length < 2) {
        console.warn(`[scenes] only ${playlist.length} of ${images.length} images loaded; the hover bar needs at least 2.`);
        if (counter) counter.textContent = '— / —';
      }
      if (playlist.length === 0) return;

      backdrop.style.setProperty('--base-img', cssUrl(playlist[0]));
      backdrop.classList.add('is-ready');
      if (playlist.length < 2) {
        bar.dataset.state = 'off';
        return;
      }
      base = 0;
      target = 1;
      host.style.setProperty('--next-img', cssUrl(playlist[1]));
      paintLabel();
      bar.dataset.state = 'ready';
      bar.setAttribute('aria-disabled', 'false');
      ready = true;
    };

    let started = false;
    const begin = () => {
      if (started) return;
      started = true;
      void start();
    };
    let observer: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            begin();
            observer?.disconnect();
          }
        },
        { rootMargin: '1600px 0px' },
      );
      observer.observe(backdrop);
    } else {
      begin();
    }

    return () => {
      alive = false;
      killPending();
      observer?.disconnect();
      resizeObserver.disconnect();
      bar.removeEventListener('pointermove', onMove);
      bar.removeEventListener('pointerdown', onDown);
      bar.removeEventListener('pointerup', onUp);
      bar.removeEventListener('pointerleave', onLeave);
      bar.removeEventListener('pointercancel', onLeave);
      bar.removeEventListener('keydown', onKey);
      gsap.killTweensOf(strips);
      gsap.killTweensOf(fill);
      backdrop.classList.remove('is-ready');
      delete backdrop.dataset.peek;
      bar.dataset.state = 'loading';
      bar.setAttribute('aria-disabled', 'true');
    };
  }, [images]);

  return { backdropRef, barRef };
}

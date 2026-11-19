import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { registerLenis } from '../pages/lib/scroll';

gsap.registerPlugin(ScrollTrigger);

/** Smooth, eased scrolling that stays in sync with ScrollTrigger. Use once per page. */
export default function useSmoothScroll(lerp = 0.085) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({ lerp });
    registerLenis(lenis);
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    // gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      registerLenis(null);
      lenis.destroy();
    };
  }, [lerp]);
}
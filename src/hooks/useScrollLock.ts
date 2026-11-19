import { useLayoutEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const SCROLL_KEYS = new Set([' ', 'Spacebar', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End']);

export default function useScrollLock(locked: boolean) {
  // useLayoutEffect = runs before the first paint
  useLayoutEffect(() => {
    if (!locked) return;

    const html = document.documentElement;
    html.classList.add('intro-lock');          // hides the rail + footer (CSS below)
    ScrollTrigger.clearScrollMemory('manual'); // stop ScrollTrigger restoring an old scroll position
    window.scrollTo(0, 0);

    const previous = html.style.overflow;
    html.style.overflow = 'hidden';

    const block = (e: Event) => {
      e.preventDefault();
      e.stopImmediatePropagation();
    };
    const blockKey = (e: KeyboardEvent) => {
      if (SCROLL_KEYS.has(e.key)) block(e);
    };
    const opts = { passive: false, capture: true } as const;

    window.addEventListener('wheel', block, opts);
    window.addEventListener('touchmove', block, opts);
    window.addEventListener('keydown', blockKey, opts);

    return () => {
      window.removeEventListener('wheel', block, opts);
      window.removeEventListener('touchmove', block, opts);
      window.removeEventListener('keydown', blockKey, opts);
      html.style.overflow = previous;
      html.classList.remove('intro-lock');
    };
  }, [locked]);
}
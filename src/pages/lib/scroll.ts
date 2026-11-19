import type Lenis from 'lenis';

let instance: Lenis | null = null;

/** The page that owns the Lenis instance registers it here so any component can scroll through it. */
export const registerLenis = (lenis: Lenis | null) => {
  instance = lenis;
};

/** Scrolls through Lenis when it is running (so the two never fight), otherwise natively. */
export function scrollToPosition(top: number, immediate = false) {
  if (instance) instance.scrollTo(top, { immediate, duration: 1.4 });
  else window.scrollTo({ top, left: 0, behavior: immediate ? 'auto' : 'smooth' });
}

export const scrollToTop = (immediate = false) => scrollToPosition(0, immediate);
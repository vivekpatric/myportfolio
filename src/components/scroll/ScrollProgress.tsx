import { useEffect, useRef } from 'react';

export default function ScrollProgress() {
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
        fillRef.current?.style.setProperty('--scroll-progress', String(Math.min(1, Math.max(0, progress))));
      });
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    const observer = new ResizeObserver(update);
    observer.observe(document.documentElement);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span className="scroll-progress__track" />
      <span className="scroll-progress__fill" ref={fillRef} />
      <span className="scroll-progress__label">SCROLL</span>
    </div>
  );
}

import { useRef, type PointerEvent, type ReactNode } from 'react';

type GlareCardProps = {
  children: ReactNode;
  className?: string;
  label?: string;
};

export default function GlareCard({ children, className = '', label }: GlareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch' || !cardRef.current) return;
    const bounds = cardRef.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    cardRef.current.style.setProperty('--glare-x', `${x * 100}%`);
    cardRef.current.style.setProperty('--glare-y', `${y * 100}%`);
    cardRef.current.style.setProperty('--rotate-x', `${(0.5 - y) * 10}deg`);
    cardRef.current.style.setProperty('--rotate-y', `${(x - 0.5) * 12}deg`);
  };

  const resetTilt = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty('--rotate-x', '0deg');
    cardRef.current.style.setProperty('--rotate-y', '0deg');
    cardRef.current.style.setProperty('--glare-x', '50%');
    cardRef.current.style.setProperty('--glare-y', '50%');
  };

  return (
    <div
      ref={cardRef}
      className={`glare-card ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onBlur={resetTilt}
      aria-label={label}
    >
      {children}
    </div>
  );
}

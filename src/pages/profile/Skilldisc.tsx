import type { CSSProperties } from 'react';

/**
 * Skills laid out on a spinning CD: two counter-rotating rings around a hub.
 * Labels stay upright (each one counter-rotates), and hovering the disc pauses it.
 */
export default function SkillDisc({ skills }: { skills: string[] }) {
  const outerCount = Math.ceil(skills.length * 0.58);
  const outer = skills.slice(0, outerCount);
  const inner = skills.slice(outerCount);

  const ring = (items: string[], className: string, offset: number) => (
    <div className={`pr-cd__ring ${className}`}>
      {items.map((skill, i) => (
        <div
          className="pr-cd__item"
          key={`${skill}-${i}`}
          style={{ '--a': `${offset + (i * 360) / items.length}deg` } as CSSProperties}
        >
          <span className="pr-cd__chip">
            <span className="pr-cd__label">{skill}</span>
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="pr-cd" aria-label="Skills">
      {ring(outer, 'pr-cd__ring--out', 0)}
      {inner.length > 0 && ring(inner, 'pr-cd__ring--in', 180 / inner.length)}
      <div className="pr-cd__hub" aria-hidden="true"><i /></div>
    </div>
  );
}
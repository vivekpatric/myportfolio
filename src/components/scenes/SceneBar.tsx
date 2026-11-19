import type { Ref } from 'react';
import './SceneReveal.css';

type SceneBarProps = {
  ref?: Ref<HTMLDivElement>;
  total: number;
  label?: string;
};

/** The small horizontal hover bar. useSceneReveal wires it to the backdrop. */
export default function SceneBar({ ref, total, label = 'BACKGROUND / HOVER TO PEEL' }: SceneBarProps) {
  return (
    <div className="scene-row">
      <span className="scene-row__label">{label}</span>
      <div
        className="scene-bar"
        ref={ref}
        role="slider"
        tabIndex={0}
        aria-label="Change the page background. Move across the bar to reveal the next image; press Enter to switch."
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={1}
        aria-disabled="true"
        data-state="loading"
      >
        <span className="scene-bar__track">
          <span className="scene-bar__fill" />
        </span>
      </div>
      <span className="scene-row__count" data-scene-count>01 / {String(total).padStart(2, '0')}</span>
    </div>
  );
}

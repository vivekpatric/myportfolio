import type { CSSProperties, Ref } from 'react';
import { SCENE_STRIPS } from './useSceneReveal';
import './SceneReveal.css';

/** Fixed, full-screen background: the current image, 20 strips for the next one, and a paper wash on top. */
export default function SceneBackdrop({ ref }: { ref?: Ref<HTMLDivElement> }) {
  return (
    <div className="scene" ref={ref} aria-hidden="true">
      <div className="scene__base" />
      <div className="scene__strips">
        {Array.from({ length: SCENE_STRIPS }, (_, i) => (
          <span className="scene__strip" key={i} style={{ '--i': i, '--n': SCENE_STRIPS } as CSSProperties}>
            <span className="scene__strip-img" />
          </span>
        ))}
      </div>
      <div className="scene__veil" />
    </div>
  );
}

import { Component, lazy, Suspense, type ReactNode } from 'react';


// three.js loads only when the Profile page opens.
const CatScene = lazy(() =>
  import('./CatScene').then((m) => {
    if (!m.default) {
      console.error('CatScene.tsx has no default export. Exports found:', Object.keys(m).join(', ') || 'none');
    }
    return { default: m.default ?? (() => null) };
  }),
);

/** If the zebra ever fails (missing file, no WebGL...), the rest of the Profile page still loads. */
class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.error('Zebra failed to render:', error instanceof Error ? error.message : Object.prototype.toString.call(error));
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function CatSlot() {
  return (
    <Boundary>
      <Suspense fallback={null}>
        <CatScene/>
      </Suspense>
    </Boundary>
  );
}
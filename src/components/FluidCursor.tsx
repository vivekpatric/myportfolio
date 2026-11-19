
import { useEffect, useRef } from "react";
import {gsap} from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// These files are JavaScript from the original repository.
// @ts-ignore - JavaScript module without TypeScript declarations
import { createFluidCursor } from "../pages/lib/FluidCursor/fluid-cursor.js";
// @ts-ignore - JavaScript module without TypeScript declarations
import { defaultConfig } from "../pages/lib/FluidCursor/presets.js";
import "./FluidCursor.css"


gsap.registerPlugin(ScrollTrigger);

function FluidCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect the visitor's reduced-motion preference.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const config = {
      ...defaultConfig,
      PRESSURE_ITERATIONS: 16, // was 30; barely visible, much cheaper
      inkColor: [...defaultConfig.inkColor],
    };

    let fluid: ReturnType<typeof createFluidCursor> | undefined;
    let covered = false; // true while the projects rail covers the landing page

    const run = () => {
      if (fluid && !covered && !document.hidden) fluid.start(); // start() ignores repeat calls
    };

    const cover = () => {
      covered = true;
      fluid?.stop();
      fluid?.clear(); // no old ink waiting when you scroll back up
      canvas.style.display = 'none';
    };

    const uncover = () => {
      covered = false;
      canvas.style.display = '';
      run();
    };

    const handleVisibility = () => {
      if (document.hidden) fluid?.stop();
      else run();
    };

    try {
      fluid = createFluidCursor(canvas, config);
    } catch (error) {
      console.warn('Fluid cursor could not start:', error);
      canvas.style.display = 'none';
      return;
    }

    fluid.start();
    document.addEventListener('visibilitychange', handleVisibility);

    // The rail's top reaching the top of the screen = landing page fully covered
    const rail = document.getElementById('featured-work');
    const trigger = rail
      ? ScrollTrigger.create({
          trigger: rail,
          start: 'top top',
          onEnter: cover,
          onLeaveBack: uncover,
        })
      : null;

    return () => {
      trigger?.kill();
      document.removeEventListener('visibilitychange', handleVisibility);
      fluid?.destroy();
    };
  }, []);

  return <canvas ref={canvasRef} className="fluid-cursor-canvas" aria-hidden="true" />;
}

export default FluidCursor;


// import { useEffect, useRef } from "react";
// import {gsap} from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// // These files are JavaScript from the original repository.
// // @ts-ignore - JavaScript module without TypeScript declarations
// import { createFluidCursor } from "../pages/lib/FluidCursor/fluid-cursor.js";
// // @ts-ignore - JavaScript module without TypeScript declarations
// import { defaultConfig } from "../pages/lib/FluidCursor/presets.js";
// import "./FluidCursor.css"


// gsap.registerPlugin(ScrollTrigger);

// function FluidCursor() {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     // Respect the visitor's reduced-motion preference.
//     if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

//     const config = {
//       ...defaultConfig,
//       PRESSURE_ITERATIONS: 16, // was 30; barely visible, much cheaper
//       inkColor: [...defaultConfig.inkColor],
//     };

//     let fluid: ReturnType<typeof createFluidCursor> | undefined;
//     let covered = false; // true while the projects rail covers the landing page

//     const run = () => {
//       if (fluid && !covered && !document.hidden) fluid.start(); // start() ignores repeat calls
//     };

//     const cover = () => {
//       covered = true;
//       fluid?.stop();
//       fluid?.clear(); // no old ink waiting when you scroll back up
//       canvas.style.display = 'none';
//     };

//     const uncover = () => {
//       covered = false;
//       canvas.style.display = '';
//       run();
//     };

//     const handleVisibility = () => {
//       if (document.hidden) fluid?.stop();
//       else run();
//     };

//     try {
//       fluid = createFluidCursor(canvas, config);
//     } catch (error) {
//       console.warn('Fluid cursor could not start:', error);
//       canvas.style.display = 'none';
//       return;
//     }

//     fluid.start();
//     document.addEventListener('visibilitychange', handleVisibility);

//     // The rail's top reaching the top of the screen = landing page fully covered
//     const rail = document.getElementById('featured-work');
//     const trigger = rail
//       ? ScrollTrigger.create({
//           trigger: rail,
//           start: 'top top',
//           onEnter: cover,
//           onLeaveBack: uncover,
//         })
//       : null;

//     return () => {
//       trigger?.kill();
//       document.removeEventListener('visibilitychange', handleVisibility);
//       fluid?.destroy();
//     };
//   }, []);

//   return <canvas ref={canvasRef} className="fluid-cursor-canvas" aria-hidden="true" />;
// }

// export default FluidCursor;
// import { useEffect, useRef } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// // @ts-ignore - JavaScript module without TypeScript declarations
// import { createFluidCursor } from "../pages/lib/FluidCursor/fluid-cursor.js";
// // @ts-ignore - JavaScript module without TypeScript declarations
// import { defaultConfig } from "../pages/lib/FluidCursor/presets.js";
// import "./FluidCursor.css";

// gsap.registerPlugin(ScrollTrigger);

// function FluidCursor() {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const mirrorRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const mirror = mirrorRef.current;
//     if (!canvas || !mirror) return;

//     if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

//     const config = { ...defaultConfig, inkColor: [...defaultConfig.inkColor] };

//     let fluid: ReturnType<typeof createFluidCursor> | undefined;
//     let covered = false;

//     const show = (on: boolean) => {
//       const d = on ? '' : 'none';
//       canvas.style.display = d;
//       mirror.style.display = d;
//     };

//     const run = () => {
//       if (fluid && !covered && !document.hidden) fluid.start();
//     };

//     const cover = () => {
//       covered = true;
//       fluid?.stop();
//       fluid?.clear();
//       show(false);
//     };

//     const uncover = () => {
//       covered = false;
//       show(true);
//       run();
//     };

//     const handleVisibility = () => {
//       if (document.hidden) fluid?.stop();
//       else run();
//     };

//     try {
//       fluid = createFluidCursor(canvas, config, mirror);
//     } catch (error) {
//       console.warn('Fluid cursor could not start:', error);
//       show(false);
//       return;
//     }

//     fluid.start();
//     document.addEventListener('visibilitychange', handleVisibility);

//     const rail = document.getElementById('featured-work');
//     const trigger = rail
//       ? ScrollTrigger.create({
//           trigger: rail,
//           start: 'top top',
//           onEnter: cover,
//           onLeaveBack: uncover,
//         })
//       : null;

//     return () => {
//       trigger?.kill();
//       document.removeEventListener('visibilitychange', handleVisibility);
//       fluid?.destroy();
//     };
//   }, []);

//   return (
//     <>
//       {/* layer 1: GL mask, layer 2: recoloured copy. Together they swap the colours */}
//       <canvas ref={canvasRef} className="fluid-cursor-canvas" aria-hidden="true" />
//       <canvas ref={mirrorRef} className="fluid-cursor-canvas fluid-cursor-canvas--mirror" aria-hidden="true" />
//     </>
//   );
// }

// export default FluidCursor;
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

    const touchScreen = window.matchMedia('(pointer: coarse)').matches;

    const config = {
      ...defaultConfig,
      RESOLUTION: touchScreen ? 384 : defaultConfig.RESOLUTION, // lighter on phones
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
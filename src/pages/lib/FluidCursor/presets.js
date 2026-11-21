export const defaultConfig = {
  RESOLUTION: 512,            // single sim+dye resolution (keeps the math simple/stable)
  CURL: 22,                   // how aggressively the fluid swirls
  PRESSURE_ITERATIONS: 30,    // Jacobi solver passes per frame (higher = more accurate)
  PRESSURE_DECAY: 1.0,        // pressure carried between frames
  VELOCITY_DISSIPATION: 1.00, // how long motion lingers (→1 = longer)
  DYE_DISSIPATION: 0.97,      // how long the ink lingers before fading
  SPLAT_RADIUS: 0.00160,      // width of the ink blob under the cursor
  SPLAT_FORCE: 7000,          // how hard cursor motion pushes the fluid
  inkColor: [0.124, 0.227, 0.426],  // white → "difference" blend inverts the page beneath
  threshold: 0.1,             // dye intensity needed before ink shows
  softness: 0.015             // edge falloff of the ink
};
// [0.124, 0.227, 0.929]
export const PRESETS = {
  ink:   { CURL: 22, DYE_DISSIPATION: 0.97,  SPLAT_RADIUS: 0.00025, inkColor: [1.000, 1.000, 1.000],   threshold: 0.10, softness: 0.015, blend: "difference" },
  smoke: { CURL: 10, DYE_DISSIPATION: 0.985, SPLAT_RADIUS: 0.00055, inkColor: [1.000, 1.000, 1.000],   threshold: 0.05, softness: 0.10,  blend: "difference" },
  neon:  { CURL: 30, DYE_DISSIPATION: 0.965, SPLAT_RADIUS: 0.00022, inkColor: [1.000, 1.000, 1.000], threshold: 0.07, softness: 0.04,  blend: "difference" },
  mono:  { CURL: 24, DYE_DISSIPATION: 0.97,  SPLAT_RADIUS: 0.00022, inkColor: [0.784, 0.063, 0.180],   threshold: 0.12, softness: 0.0,   blend: "normal" },
//   creamRed:  { CURL: 18, DYE_DISSIPATION: 0.98,  SPLAT_RADIUS: 0.00065, inkColor: [0.90, 0.52, 0.46],     threshold: 0.08, softness: 0.03,   blend: "difference" }
};
// The page's two colours. Change these if you change the palette.
// export const COLORS = { bg: '#f3efc8', text: '#681a25' };

// const hexToRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

// /**
//  * Two stacked `difference` layers turn bg <-> text exactly:
//  *   out = |second - |first - x||  =  (bg + text) - x     (per channel)
//  * For your palette: first = (92,10,0), second = (255,255,237).
//  */
// export function getSwapColors(a = COLORS.bg, b = COLORS.text) {
//   const A = hexToRgb(a), B = hexToRgb(b);
//   const first = [], second = [];
//   for (let i = 0; i < 3; i++) {
//     const sum = A[i] + B[i];
//     const c1 = Math.max(0, sum - 255);
//     first.push(c1);
//     second.push(sum - c1);
//   }
//   return { first, second };
// }

// const swap = getSwapColors();

// // Touch-first devices get a lighter, bigger-blob setup
// const isTouch =
//   typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

// export const defaultConfig = {


//   // RESOLUTION: isTouch ? 384 : 512,
//   SIM_RESOLUTION: isTouch ? 384 : 512,     // flow grid, same as your old RESOLUTION so nothing needs retuning
//   DYE_RESOLUTION: isTouch ? 768 : 1024,    // ink grid, this is what makes edges smooth
//   CURL: 6,
//   PRESSURE_ITERATIONS: 8,
//   PRESSURE_DECAY: 0.8,
//   VELOCITY_DISSIPATION: 0.97,
//   DYE_DISSIPATION: 0.975,
//   SPLAT_RADIUS: isTouch ? 0.012 : 0.008,   // width at the base of the streak
//   SPLAT_FORCE: 4500,
//   DYE_MAX: 1.0,
//   MAX_DPR: 1.5,
//   threshold: 0.5,
//   softness: 0.003,

//   // new: shooting behaviour
//   MIN_MOVE: 0.002,       // smallest mouse movement that triggers a shot
//   SHOOT_MIN: 0.05,       // minimum shot length (fraction of screen height), even for a tiny move
//   SHOOT_GAIN: 6,         // how much faster movement adds to the length
//   SHOOT_MAX: 0.3,        // length cap
//   SHOOT_SPEED: 60,       // forward push, so the ink keeps travelling after the shot
//   TAPER: 0.85,           // 0 = even width, 1 = needle tip

//   NOISE_AMOUNT: 0.8,
//   NOISE_SCALE: 9,
//   NOISE_STRETCH: 0.45,

//   inkColor: swap.first.map((v) => v / 255),
//   mirrorColor: `rgb(${swap.second.join(',')})`,

// };

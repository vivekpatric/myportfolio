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
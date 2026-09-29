/**
 * Resolves a CSS custom property (e.g. "--accent", stored as oklch) to 0–1
 * sRGB channels by letting the browser paint it, so WebGL scenes can use
 * the same semantic tokens as the rest of the site.
 */
export function readTokenColor(name: string, fallback: [number, number, number] = [0, 0, 0]) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  if (!ctx || !value) return fallback;
  ctx.fillStyle = "#000";
  ctx.fillStyle = value;
  ctx.fillRect(0, 0, 1, 1);
  const [r = 0, g = 0, b = 0] = ctx.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255] as [number, number, number];
}

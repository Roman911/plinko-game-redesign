import type { RowCount } from '$lib/types';

import img500 from '$lib/assets/500.png';
import img100 from '$lib/assets/100.png';
import img50 from '$lib/assets/50.png';
import img10 from '$lib/assets/10.png';
import img7 from '$lib/assets/7.png';
import img1 from '$lib/assets/1.png';

type RgbColor = { r: number; g: number; b: number };

/**
 * Creates a gradient of RGB colors of length `length`.
 *
 * @param from The starting RGB color.
 * @param to The ending RGB color.
 * @param length Number of colors in the output array. Must be `>= 2` since the first
 * and last color are `from` and `to`.
 */
export function interpolateRgbColors(from: RgbColor, to: RgbColor, length: number): RgbColor[] {
  return Array.from({ length }, (_, i) => ({
    r: Math.round(from.r + ((to.r - from.r) / (length - 1)) * i),
    g: Math.round(from.g + ((to.g - from.g) / (length - 1)) * i),
    b: Math.round(from.b + ((to.b - from.b) / (length - 1)) * i),
  }));
}

/**
 * Gets the background and shadow colors of each bin given the row count.
 */
export function getBinColors(rowCount: RowCount) {
  {
    const binCount = rowCount + 1;
    const isBinsEven = binCount % 2 === 0;
    const redToYellowLength = Math.ceil(binCount / 2);

    const redToYellowBg = [
      `url(${img500})`,
      `url(${img100})`,
      `url(${img50})`,
      `url(${img10})`,
      `url(${img7})`,
      `url(${img1})`,
    ];

    const redToYellowShadow = interpolateRgbColors(
      { r: 166, g: 0, b: 4 }, // rgb(166, 0, 4)
      { r: 171, g: 121, b: 0 }, // rgb(171, 121, 0)
      redToYellowLength,
    ).map(({ r, g, b }) => `rgb(${r},${g},${b})`);

    return {
      background: [...redToYellowBg, ...redToYellowBg.toReversed().slice(isBinsEven ? 0 : 1)],
      shadow: [...redToYellowShadow, ...redToYellowShadow.toReversed().slice(isBinsEven ? 0 : 1)],
    };
  }
}

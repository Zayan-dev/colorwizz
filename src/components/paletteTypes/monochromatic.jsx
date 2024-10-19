import chroma from "chroma-js";

export const monochromaticColors = (count) => {
  // Generate base color with random hue, saturation = 1, and value = 1
  const baseColor = chroma.hsv(Math.random() * 360, 1, 1);

  const palette = []; // First color is the base color

  // Calculate interval for reducing saturation and value
  const interval = 0.9 / (count - 1); // Equal intervals based on count

  for (let i = count - 1; i > 0; i--) {
    // Reduce saturation and value by equal intervals
    const newColor = chroma(baseColor)
      .set("hsv.s", `${0.1 - interval * i}`) // The saturation should not be less than 0.15
      .set("hsv.v", `${0.1 - interval * i}`); // The value should not be less than 0.15
    palette.push(newColor);
  }
  palette.push(baseColor)

  return palette.map((color) => color.hex()); // Return palette in hex format
};


// newColors = chroma
//   .scale([baseColor.darken(2), baseColor.brighten(2)])
//   .colors(paletteColorsCount);

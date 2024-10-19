import chroma from "chroma-js";

export const analogousColors = (count, baseColor = "") => {
  const palette = [];

  // Step 1: If no baseColor provided, generate a random one
  if (!baseColor) {
    baseColor = chroma.hsv([Math.random() * 360, Math.random(), 1]);
  }
  // Extract base color properties
  let baseHsv = chroma(baseColor).hsv();
  // Adjust the base color hue and saturation and create th first color
  const firstColor = chroma(baseColor)
    .set("hsv.h", `-${Math.floor((count - 1) / 2) * 30}`)
    .set("hsv.s", `${Math.min(baseHsv[1] + 0.4, 1)}`); // Ensure saturation doesn't exceed 1

  palette.push(firstColor); // Add the first color to the palette

  // Generate the remaining colors, hues are incremented by +30
  for (let i = 1; i < count; i++) {
    const nextColor = chroma(firstColor).set("hsv.h", `+${i*30}`);
    palette.push(nextColor);
  }

  console.log(palette.map((color) => chroma(color).hsv()));
  // Return the generated palette
  return palette.map((color) => color.hex());
};


// const dark = baseColor;
// const degree = paletteColorsCount * 30;
// const bright = dark.set("hsl.h", `+${degree}`);
// const medium = chroma.scale([dark, bright.brighten(4)]).colors(4);
// newColors = [...medium, bright.hex()];

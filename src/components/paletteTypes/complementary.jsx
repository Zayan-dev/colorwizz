import chroma from "chroma-js";

const generateReducedColors = (
  halfColors,
  baseHsv,
  saturationReduction,
  valueReduction,
  palette
) => {
  for (let i = 0; i < halfColors; i++) {
    // Reduce saturation and value for each color
    baseHsv[1] *= saturationReduction;
    baseHsv[2] *= valueReduction;
    // Create the new color and push to the palette
    const newColor = chroma.hsv(...baseHsv);
    palette.push(newColor);
  }
};


export const complementaryColors = (count, baseColor = "") => {
  if (!baseColor) {
    // Ensure base color has hue between (0, 360) saturation between (1, 0.2) and value between (1, 0.8)
    baseColor = chroma.hsv([
      Math.random() * 360,
      Math.random() * (0.5 - 0.2) + 0.2,
      Math.random() * (1 - 0.8) + 0.8,
    ]);
  }

  // Calculate the complementary color by shifting the hue by 180°
  const complementaryColor = chroma(baseColor).set("hsv.h", `+180`);

  const palette = [baseColor];
  // Divide count - 2 colors in half
  const halfColors = (count - 2) / 2;

  // First loop: Generate colors based on the base color
  let baseHsv = chroma(baseColor).hsv();
  generateReducedColors(Math.ceil(halfColors), baseHsv, 0.6, 0.5, palette);

  palette.push(complementaryColor)

  // Second loop: Generate colors based on the complementary color (in reverse order)
  let prevComplementaryHsv = chroma(complementaryColor).hsv();
  generateReducedColors(Math.floor(halfColors), prevComplementaryHsv, 0.6, 0.6, palette);

  return palette.map((color) => color.hex());
};


// old complementary logic
// let newColors = [...colors]; // Create a copy of the current colors
// const baseColor = chroma.random().saturate(2);
// const darkColor = baseColor.darken(2);
// const brightColor = darkColor.set("hsl.h", "+180");
// const mediumColors = chroma
//   .scale([darkColor, brightColor.brighten(4)])
//   .colors(4);
// newColors = [...mediumColors, brightColor.hex()];








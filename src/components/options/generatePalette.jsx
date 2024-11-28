import chroma from "chroma-js";
import { complementaryColors } from "../paletteTypes/complementary";
import { analogousColors } from "../paletteTypes/analogous";
import { monochromaticColors } from "../paletteTypes/monochromatic";
import { triadicColors } from "../paletteTypes/triadic";

import { shuffleArray } from "../utils/reusablefunctions";

export const generatePaletteColors = (
  mode,
  paletteColorsCount,
  colors,
  lockedColors
) => {
  let newColors = [...colors]; // Create a copy of the current colors
  const baseColor = chroma.random().saturate(2);
  switch (mode) {
    case "analogous":
      newColors = analogousColors(paletteColorsCount);
      break;
    case "complementary":
      newColors = complementaryColors(paletteColorsCount);
      break;
    case "triadic":
      newColors = triadicColors(paletteColorsCount);
      break;
    case "vibrant":
      const baseColor = chroma.random().saturate(2);
      const darkColor = baseColor.darken(2);
      const brightColor = darkColor.set("hsl.h", "+180");
      const mediumColors = chroma
        .scale([darkColor, brightColor.brighten(4)])
        .colors(4);
      newColors = [...mediumColors, brightColor.hex()];
      break;
    default:
      newColors = monochromaticColors(paletteColorsCount);
      break;
  }

  // Replace only unlocked colors
  newColors = newColors.map((newColor, index) =>
    lockedColors.includes(index) ? colors[index] : newColor
  );
  // Shuffle the newColors array if mode isn't monochromatic
  if (mode !== "monochromatic")
    newColors = shuffleArray(newColors, lockedColors);
  return newColors;
};

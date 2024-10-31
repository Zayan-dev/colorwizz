// generateShades.js
import chroma from "chroma-js";

export const generateShades = (color, numShades = 20) => {
  const baseColor = chroma(color);
  const shades = [];

  for (let i = 0; i < numShades; i++) {
    const shade = baseColor
      .set("hsv.s", 1 - i * 0.05) // Decrease saturation
    //   .set("hsv.v", 1 - i * 0.05); // Decrease value
    shades.push(shade.hex());
  }
  return shades;
};

// changeColorShade.js
export const changeColorShade = (colors, index, newShade) => {
  const updatedColors = [...colors];
  updatedColors[index] = newShade;
  return updatedColors;
};

import chroma from "chroma-js";

export const triadicColors = (count, baseColor = "") => {
  // If count is less than 3, set count to 3
  count = Math.max(count, 3);
  // Generate base color with random hue, saturation = 1, and value = 1
  if (!baseColor) {
    baseColor = chroma.hsv(Math.random() * 360, Math.random() * 0.8 + 0.2, 1); // Random hue, saturation [0.1 - 1], value = 1
  }

  // Step 1: Generate the 3 main colors (base + two triadic colors)
  const mainColors = Array.from({ length: 2 }, (_, i) => chroma(baseColor).set("hsv.h", `+${(i+1)*120}`) );

  const palette = [baseColor, ...mainColors];

  const childCount = count - 3;
  if (childCount > 0) {
    // Helper function to generate child colors based on the main color
    const generateChildColors = (parentColor, childIndex, satRed, valRed) => {
        let baseHsv = chroma(parentColor).hsv();
        let saturation = baseHsv[1] - (satRed * childIndex); // Different reduction for base and other main colors
        let value = baseHsv[2] - (valRed * childIndex)
        palette.push(chroma.hsv(baseHsv[0], Math.max(0.1 - saturation, saturation), value));
    }

    for (let i = 4; i <= count; i++) {
        if (i % 3 === 1) generateChildColors(palette[0], Math.floor(i / 3), 0.3, 0.3)
        if (i % 3 === 2) generateChildColors(palette[1], Math.floor(i / 3), 0.5, 0.5);
        if (i % 3 === 0) generateChildColors(palette[2], i / 3 - 1, 0.5, 0.5);
    }
  };
  return palette.map((color) => color.hex()); // Return palette in hex format
};



// const darkCol = baseColor;
// const color1 = darkCol.set("hsl.h", "+120");
// const color2 = darkCol.set("hsl.h", "-120");
// const mediumCol = chroma
//   .scale([darkCol, color1.brighten(4), color2.brighten(4)])
//   .colors(3);
// newColors = [...mediumCol, color1.hex(), color2.hex()];

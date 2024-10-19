const addColor = (e) => {
  if (paletteColorsCount < 10) {
    e.preventDefault();
    const baseColor = chroma.random().saturate(2).brighten(1);
    let newColor;

    switch (mode) {
      case "analogous":
        newColor = chroma
          .scale([
            baseColor,
            baseColor.set("hsl.h", "+30"),
            baseColor.set("hsl.h", "-30"),
          ])
          .colors(paletteColorsCount + 1)[paletteColorsCount];
        break;

      case "complementary":
        newColor = chroma
          .scale([baseColor, baseColor.set("hsl.h", "+180")])
          .colors(paletteColorsCount + 1)[paletteColorsCount];
        break;

      case "triadic":
        newColor = chroma
          .scale([
            baseColor,
            baseColor.set("hsl.h", "+120"),
            baseColor.set("hsl.h", "-120"),
          ])
          .colors(paletteColorsCount + 1)[paletteColorsCount];
        break;

      default:
        newColor = chroma
          .scale([baseColor.darken(2), baseColor.brighten(2)])
          .colors(paletteColorsCount + 1)[paletteColorsCount]; // Fallback for other modes
        break;
    }

    setColors((prevColors) => [...prevColors, newColor]); // Add the new color to the palette
    setPaletteColorsCount((prevCount) => prevCount + 1); // Increment the color count
  }
};

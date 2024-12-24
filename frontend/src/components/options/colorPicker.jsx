// colorPicker.js

import namer from "color-namer"; // Assuming `namer` is imported here.

export const updateColorNames = (colors, colorNames, prevColorsRef) => {
    const updatedNames = [...colorNames];
    colors.forEach((color, index) => {
      if (color !== prevColorsRef.current[index]) {
        updatedNames[index] = namer(color).ntc[0]?.name || "Unknown";
      }
    });
  prevColorsRef.current = colors;
  return updatedNames;
};

export const handleColorChange = (e, colors, index, setColors) => {
  const newColor = e.target.value;
  setColors((prevColors) => {
    const updatedColors = [...prevColors];
    updatedColors[index] = newColor;
    return updatedColors;
  });
};

export const handleColorPickEnd = (color, index, setColorNames) => {
  const updatedColorName = namer(color).ntc[0]?.name || "Unknown";
  setColorNames((prevNames) => {
    const newNames = [...prevNames];
    newNames[index] = updatedColorName;
    return newNames;
  });
};

export const handleCopy = (color) => {
  navigator.clipboard.writeText(color);
  return "Color copied to clipboard!";
};

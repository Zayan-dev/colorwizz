export const deleteColor = (colorHex, colors) => {
  // Filter out the color that matches the given hex code
  const updatedColors = colors.filter((color) => color !== colorHex);

  // Return the updated colors array
  return updatedColors;
}

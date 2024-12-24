export const deleteColor = (colorHex, colors) => {
  // Filter out the color that matches the given hex code
  const updatedColors = colors.filter((color) => color !== colorHex);

  // Return the updated colors array
  return updatedColors;
}

export  const handleAfterDeleteLockedColors = (lockedColors, index) => {
  const afterDeleteLockedColors = []
  for (let i = 0; i<lockedColors.length; i++) {
    if(lockedColors[i]>index){
      afterDeleteLockedColors[i] = lockedColors[i] - 1;
    }
    else if (lockedColors[i]<index){
      afterDeleteLockedColors[i] = lockedColors[i];
    }
  }
  return afterDeleteLockedColors;

}
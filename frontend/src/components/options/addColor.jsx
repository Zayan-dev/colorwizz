import chroma from "chroma-js";

const addColor = (color1, color2) => {
  // Convert both colors from hex to HSV
  const hsv1 = chroma(color1).hsv();
  const hsv2 = chroma(color2).hsv();

  // Calculate the middle HSV values
  const middleHue = (hsv1[0] + hsv2[0]) / 2;
  const middleSaturation = (hsv1[1] + hsv2[1]) / 2;
  const middleValue = (hsv1[2] + hsv2[2]) / 2;

  // Create the middle color in HSV and return it as hex
  const middleColor = chroma
    .hsv(middleHue, middleSaturation, middleValue)
    .hex();

  return middleColor;
};



export const handleAddColor = (leftColor, rightColor, index, colors) => {
  const newColor = addColor(leftColor, rightColor);
  // if(lockedColors.includes(index+1)){
  //   console.log("mubarak")
  // }
  const updatedColors = [
    ...colors.slice(0, index + 1),
    newColor,
    ...colors.slice(index + 1),
  ];
  // console.log(index+" from handle Add Color")

  return updatedColors;
};

export  const handleUpdatedLockedColors = (colors,lockedColors, index) => {
  const updatedLockedColors = []
  for (let i = 0; i<lockedColors.length; i++) {
    if(lockedColors[i]>index){
    updatedLockedColors[i] = lockedColors[i] + 1;
    }
   else{
      updatedLockedColors[i] = lockedColors[i];
    }
  }
  return updatedLockedColors;

}


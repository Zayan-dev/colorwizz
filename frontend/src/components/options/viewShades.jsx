import React, { useState } from 'react'
import chroma from "chroma-js";
import { GrRadialSelected } from "react-icons/gr";


const generateShades = (color) => {
  // let [h, s, v] = chroma(color).hsv();
  // const shades = [];
  // for (let i = 0; i < 25; i++) {
  //   const shadeS = 0 + i * 0.04; // Start at 0% saturation and increment to ~90%
  //   const shadeV = 1 - i * 0.039; // Start at 100% value and decrement to ~8%
  //   shades.push(chroma.hsv(h, Math.min(1, shadeS), Math.max(0, shadeV)).hex());
  // }

    // const hsvColor = chroma(color).hsv();
    // const hue = hsvColor[0]; // Get the hue
    // const shades = [];

    // // Generate 25 shades
    // for (let i = 0; i < 25; i++) {
    //     // Calculate saturation and value
    //     const saturation = (i / 24); // Saturation from 0 to 1
    //     const value = 0.06 + (i / 24) * (1 - 0.1); // Value from 0.06 to 1

    //     // Create new color in HSV and convert back to hex
    //     const newColor = chroma.hsv(hue, saturation, value).hex();
    //     shades.push(newColor);
    // }

  // // Step 3: Find the index of the closest shade
  // let closestIndex = 0;
  // let closestDistance = Infinity;

  // for (let i = 0; i < shades.length; i++) {
  //   let [shadeH, shadeS, shadeV] = chroma(shades[i]).hsv();

  //   // Calculate the distance in saturation and value
  //   const saturationDistance = Math.abs(shadeS - s);
  //   const valueDistance = Math.abs(shadeV - v);
  //   const distance = saturationDistance + valueDistance;

  //   // Update closest shade if the current one is closer
  //   if (distance < closestDistance) {
  //     closestDistance = distance;
  //     closestIndex = i;
  //   }
  // }

  // // Step 4: Replace the closest shade with the original color
  // const modifiedShades = [...shades]; // Create a copy of the shades
  // modifiedShades[closestIndex] = chroma(color).hex(); // Replace the closest shade

  // return modifiedShades; // Return the modified shades array

  const shades = chroma
    .scale([
      chroma(color).shade(0).tint(1),
      color,
      chroma(color).shade(0.95).tint(0),
    ])
    .mode("hsv")
    .colors(25);
  return shades;
};

const ViewShades = ({ setColorShade, onClose, colorInfo }) => {
  const findTextColor = (color) => {
    const textColor = chroma(color).luminance() > 0.5 ? "black" : "white";
    return textColor
  }

  // const lightness = chroma(colorInfo.color).lab()[0] / 100; // LAB lightness is in the 0-100 range
  // const position = Math.min(0.9, Math.max(0.1, lightness)); // Clamp within 0.1 to 0.9 for balance

  // // Create a scale with the given color at the calculated position
  // const shadesArray = chroma
  //   .scale(["#FFFFFF", colorInfo.color, chroma(colorInfo.color).darken(3)])
  //   .domain([0, position, 1]) // Use position as the midpoint for the color
  //   .mode("lab") // LAB mode for perceptually uniform shades
  //   .colors(25);

  // const shadesArray = chroma
  //   .scale(["#FFFFFF", chroma(colorInfo.color).darken(4)])
  //   .mode("lab") // LAB mode for perceptually uniform shades
  //   .colors(25);

  const shadesArray = generateShades(colorInfo.color)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-20 flex justify-center items-center cursor-default">
      <div className="bg-white p-6 rounded-lg shadow-lg relative">
        <h3 className="text-xl font-bold mb-4">Shades</h3>
        <div className="flex flex-wrap gap-2">
          {shadesArray.map((shade, idx) => (
            <div
              onClick={(e) => {
                setColorShade(e, shade, colorInfo.index);
              }}
              key={idx}
              className="w-12 h-12 cursor-pointer flex flex-col py-1 gap-1 justify-start items-center"
              style={{ backgroundColor: shade }}
            >
              <p className="text-[0.7rem]" style={{ color: findTextColor(shade) }}>
                {shade}
              </p>
              {shade == colorInfo.color && (
                <GrRadialSelected style={{ color: findTextColor(shade) }} />
              )}
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 absolute top-0 right-6 text-3xl font-bold rotate-45"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ViewShades;

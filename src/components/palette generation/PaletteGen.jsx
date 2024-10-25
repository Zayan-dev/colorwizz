import React, { useEffect, useState } from "react";
import chroma from 'chroma-js';
import namer from 'color-namer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { complementaryColors } from '../paletteTypes/complementary';
import { analogousColors } from '../paletteTypes/analogous';
import { monochromaticColors } from '../paletteTypes/monochromatic';
import { triadicColors } from '../paletteTypes/triadic';
import { handleAddColor } from '../options/addColor';
import { deleteColor } from "../options/deleteColor";

const PaletteGen = () => {
    const [colors, setColors] = useState([]);
    const [hoverIndex, setHoverIndex] = useState(null);
    const [paletteColorsCount, setPaletteColorsCount] = useState(5);
    const [mode, setMode] = useState('monochromatic');
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [pickedColor, setPickedColor] = useState('#BDAFD5'); // Initial color picker value

    // Add lock status for each color
    const [lockedColors, setLockedColors] = useState([]); // Tracks locked color indexes

    useEffect(() => {
      // Update paletteColorsCount whenever colors state changes
      setPaletteColorsCount(colors.length);
    }, [colors]);
    
    // Shuffle function
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            if (!lockedColors.includes(i)) {
                const j = Math.floor(Math.random() * (i + 1)); // Random index
                [array[i], array[j]] = [array[j], array[i]]; // Swap
            }
        }
        return array;
    }

    const generatePalette = () => {
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
                // newColors = Array.from({ length: paletteColorsCount }, (_, i) =>
                //   baseColor.set("hsl.h", `${i * (360 / paletteColorsCount)}`).hex()
                // );
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
        newColors = newColors.map((newColor, index) => lockedColors.includes(index) ? colors[index] : newColor);
        // Shuffle the newColors array if mode isn't monochromatic
        // if (mode !== "monochromatic") newColors = shuffleArray(newColors);

        setColors(newColors);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                generatePalette();
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [mode, lockedColors, paletteColorsCount]);

    useEffect(() => {
        generatePalette(); // Generate palette initially
    }, [mode]);

    const handleDragStart = (index) => {
        setDraggedIndex(index);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
    };
    const handleDrop = (index) => {
        const updatedColors = [...colors];
        let updatedLockedColors = [...lockedColors];
        if (draggedIndex < index) {
            if (updatedLockedColors.includes(draggedIndex)) {
                // setLockedColors((lockedcolor) => lockedcolor.filter(item => item !== draggedIndex))
                updatedLockedColors = updatedLockedColors.filter(item => item !== draggedIndex)
            }
            for (let i = draggedIndex; i <= index; i++) {
                if (updatedLockedColors.includes(i)) {
                    const elementIndex = updatedLockedColors.indexOf(i)
                    updatedLockedColors[elementIndex] = updatedLockedColors[elementIndex] - 1;
                }
            }
            if (lockedColors.includes(draggedIndex)) {
                updatedLockedColors.push(index)
            }
        }
        console.log(draggedIndex, index)
        if (draggedIndex > index) {
            if (updatedLockedColors.includes(draggedIndex)) {
                updatedLockedColors = updatedLockedColors.filter(item => item !== draggedIndex)
            }
            for (let i = draggedIndex; i >= index; i--) {
                if (updatedLockedColors.includes(i)) {
                    const elementIndex = updatedLockedColors.indexOf(i)
                    updatedLockedColors[elementIndex] = updatedLockedColors[elementIndex] + 1;
                }
            }
            if (lockedColors.includes(draggedIndex)) {
                updatedLockedColors.push(index)
            }
        }
        console.log("Old locked: ", lockedColors);
        console.log("New Locked: ", updatedLockedColors);
        const [movedColor] = updatedColors.splice(draggedIndex, 1); // Remove the dragged color
        updatedColors.splice(index, 0, movedColor); // Insert it at the drop location
        setColors(updatedColors);
        setLockedColors(updatedLockedColors);
        setDraggedIndex(null); // Clear the dragged index
    };

    const handleCopy = (e) => {
        navigator.clipboard.writeText(e.target.innerHTML);
        toast("Color copied to clipboard!");
    };

    const [name, setName] = useState();
    const handleColorChange = (e, index) => {
        const newColor = e.target.value; // Get the new color from the color picker
        setColors((prevColors) => {
            const updatedColors = [...prevColors];
            updatedColors[index] = newColor; // Update the specific color in the array
            return updatedColors;
        });
        // const colorName = namer(newColor).ntc[0]?.name || "Unknown";
        // setName(colorName);
    };

    const handleColorPickEnd = (e, color) => {
        const colorName = namer(color).ntc[0]?.name || "Unknown";
        setName(colorName);
     
    }
    const toggleLockColor = (index) => {
        setLockedColors((prevLocked) =>
            prevLocked.includes(index)
                ? prevLocked.filter((i) => i !== index)  // Unlock the color
                : [...prevLocked, index]                 // Lock the color
        );

    };
    const [colorName, setColorName] = useState([]);
    const handleColorNames = () => {
        let namesArray = [];
        for (let i = 0; i < colors.length; i++) {
            namesArray[i] = namer(colors[i]).ntc[0]?.name || "Unknown";
        }
        return namesArray;
    }

    // useEffect(() => {
    //     setColorName(handleColorNames())
    // }, [colors])

    return (
      <div>
        <div className="w-full h-[4.5rem] px-8 flex justify-between items-center fixed bg-white">
          <div className="flex">
            <select
              className="p-3 border border-gray rounded-md"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="monochromatic">Monochromatic</option>
              <option value="analogous">Analogous</option>
              <option value="complementary">Complementary</option>
              <option value="triadic">Triadic</option>
              <option value="vibrant">Vibrant</option>
            </select>
            <p className="text-base m-5 text-stone-500">
              Hit spacebar to generate colors palette
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row h-screen w-full pt-[4.5rem]">
          {colors.map((color, index) => {
            const luminance = chroma(color).luminance();
            const textColor = luminance > 0.5 ? "black" : "white";
            // const colorName = namer(color).ntc[0]?.name || "Unknown";
            const isLocked = lockedColors.includes(index);

            return (
              <div
                key={index}
                className="relative flex flex-col items-center justify-center transition-all duration-500"
                style={{
                  backgroundColor: color,
                  width:
                    window.innerWidth > 760
                      ? `${100 / colors.length}%`
                      : "100%",
                  cursor: "move",
                }}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
              >
                <p
                  onClick={handleCopy}
                  className="text-center uppercase cursor-pointer"
                  style={{ color: textColor }}
                >
                  {color}
                </p>

                            {/* <p
                                className="text-center uppercase"
                                style={{ color: textColor }}
                            >
                                {colorName[index]}
                            </p> */}

                            {/* Color Picker */}
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => handleColorChange(e, index)}  // Detect color change
                                onBlur={(e) => handleColorPickEnd(e, color)} // Detect when user finishes with the color picker
                                className="mt-4 mb-2"
                            />


                {/* Lock/Unlock button */}
                <button onClick={() => toggleLockColor(index)}>
                  {isLocked ? "🔒locked" : "🔓unlocked"}
                </button>
                {paletteColorsCount > 2 && (
                  <button
                    onClick={() => setColors(deleteColor(color, colors))}
                    className="pt-4"
                    style={{ color: textColor }}
                  >
                    Delete
                  </button>
                )}

                {/* Hover detection between color divs */}
                {index < colors.length - 1 && paletteColorsCount < 10 && (
                  <div
                    className={`absolute inset-y-0 -right-10 flex items-center justify-center w-20 z-10 transition-all duration-300 transform ease-in-out 
          ${hoverIndex === index ? "opacity-100" : "opacity-0"}`}
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                  >
                    {hoverIndex === index && (
                      <button
                        onClick={() => {
                          const updatedColors = handleAddColor(
                            color,
                            colors[index + 1],
                            index,
                            colors
                          );
                          setColors(updatedColors);
                        }}
                        className="absolute transform -translate-y-1/2 bg-white rounded-full w-12 h-12 text-black z-20"
                        style={{ top: "50%" }}
                      >
                        <p className="text-4xl font-bold pb-2">+</p>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <ToastContainer />
      </div>
    );
};

export default PaletteGen;

import React, { useEffect, useState, useRef } from "react";
import chroma from 'chroma-js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { complementaryColors } from '../paletteTypes/complementary';
import { analogousColors } from '../paletteTypes/analogous';
import { monochromaticColors } from '../paletteTypes/monochromatic';
import { triadicColors } from '../paletteTypes/triadic';
import { handleAddColor } from '../options/addColor';
import { deleteColor } from "../options/deleteColor";
import { shuffleArray } from "../utils/shuffleArray";
import { handleColorChange, handleColorPickEnd, handleCopy, updateColorNames } from "../options/colorPicker";
import { handleDrop, toggleLockColor } from "../options/dragAndLock";
import ViewShades from "../options/viewShades";
// import viewShades from "../options/viewShades.jsx";
// import { handleShades } from "../options/viewShades";

const PaletteGen = () => {
    const [colors, setColors] = useState([]);
    const [hoverIndex, setHoverIndex] = useState(null);
    const [paletteColorsCount, setPaletteColorsCount] = useState(5);
    const [mode, setMode] = useState('monochromatic');
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [lockedColors, setLockedColors] = useState([]); // Tracks locked color indexes
    const [colorNames, setColorNames] = useState([]);
    const [showShades, setShowShades] = useState(false); // Show/hide shades panel
    const [index, setIndex] = useState(0);
    const [shades, setShades] = useState([]);
    const prevColorsRef = useRef(colors);

    useEffect(() => {
        // Update paletteColorsCount whenever colors state changes
        setPaletteColorsCount(colors.length);
    }, [colors]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === "Space") {
                e.preventDefault();
                generatePalette();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [mode, lockedColors, paletteColorsCount]);


    useEffect(() => {
        generatePalette(); // Generate palette initially
    }, [mode])


    useEffect(() => {
        const updatedNames = updateColorNames(colors, colorNames, prevColorsRef);
        setColorNames(updatedNames);
    }, [colors]);

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
        if (mode !== "monochromatic") newColors = shuffleArray(newColors, lockedColors);
        setColors(newColors);
    };

    // const [index, setIndex] = useState(0);
    const handleShades = (index, color) => {
        const shadesArray = chroma.scale(['white', color, 'black']).mode('rgb').colors(25);
        setShades(shadesArray);
        setShowShades(true);
        setIndex(index);
    };

    const setColorShade = (e, shade) => {
        e.preventDefault();
        const colorArray = [...colors];
        colorArray[index] = shade
        setColors(colorArray);
    }
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

                    return (
                        <div
                            key={index}
                            className="relative flex flex-col items-center justify-center transition-all duration-300"
                            style={{
                                backgroundColor: color,
                                width:
                                    window.innerWidth > 760
                                        ? `${100 / colors.length}%`
                                        : "100%",
                                cursor: "move",
                            }}
                            draggable
                            onDragStart={() => setDraggedIndex(index)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() =>
                                handleDrop(
                                    index,
                                    draggedIndex,
                                    colors,
                                    lockedColors,
                                    setColors,
                                    setLockedColors
                                )
                            }
                        >
                            <p
                                onClick={() => toast(handleCopy(color))}
                                className="text-center uppercase cursor-pointer"
                                style={{ color: textColor }}
                            >
                                {color}
                            </p>

                            <p
                                className="text-center uppercase"
                                style={{ color: textColor }}
                            >
                                {colorNames[index]}
                            </p>

                            {/* Color Picker */}
                            <input
                                type="color"
                                value={color}
                                onChange={(e) =>
                                    handleColorChange(e, colors, index, setColors)
                                } // Detect color change
                                // onBlur={() => handleColorPickEnd(color, index, setColorNames)} // Detect when user finishes with the color picker
                                className="mt-4 mb-2 border-none cursor-pointer"
                                placeholder="Color Picker"
                            />

                            {/* Shades option */}
                            <button onClick={() => handleShades(index, color)} className='border border-red-800'>
                                View Shades
                            </button>

                            {/* Lock/Unlock button */}
                            <button
                                onClick={() =>
                                    toggleLockColor(index, lockedColors, setLockedColors)
                                }
                            >
                                {lockedColors.includes(index) ? "🔒 Unlock" : "🔓 Lock"}
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

            {/* view shades functionality */}
            {showShades && (
                <ViewShades shades={shades} setColorShade={setColorShade} onClose={() => setShowShades(false)}></ViewShades>
            )}

            <ToastContainer />
        </div>
    );
};

export default PaletteGen;

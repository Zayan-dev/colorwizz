import React, { useEffect, useState } from 'react';
import chroma from 'chroma-js';
import namer from 'color-namer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PaletteGen = () => {
    const [colors, setColors] = useState([]);
    const [paletteColorsCount, setPaletteColorsCount] = useState(5);
    const [mode, setMode] = useState('monochromatic');
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [pickedColor, setPickedColor] = useState('#BDAFD5'); // Initial color picker value

    // Add lock status for each color
    const [lockedColors, setLockedColors] = useState([]); // Tracks locked color indexes

    const addColor = (e) => {
        if (paletteColorsCount < 10) {
            e.preventDefault();
            const baseColor = chroma.random().saturate(2).brighten(1);
            let newColor;

            switch (mode) {
                case "analogous":
                    newColor = chroma
                        .scale([baseColor, baseColor.set("hsl.h", "+30"), baseColor.set("hsl.h", "-30")])
                        .colors(paletteColorsCount + 1)[paletteColorsCount];
                    break;

                case "complementary":
                    newColor = chroma
                        .scale([baseColor, baseColor.set("hsl.h", "+180")])
                        .colors(paletteColorsCount + 1)[paletteColorsCount];
                    break;

                case "triadic":
                    newColor = chroma
                        .scale([baseColor, baseColor.set("hsl.h", "+120"), baseColor.set("hsl.h", "-120")])
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

    // Shuffle function
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // Random index
            [array[i], array[j]] = [array[j], array[i]]; // Swap
        }
        return array;
    }

    const generatePalette = () => {
        let newColors = [...colors]; // Create a copy of the current colors
        const baseColor = chroma.random().saturate(2);

        switch (mode) {
            case 'analogous':
                const dark = baseColor;
                const degree = paletteColorsCount * 30;
                const bright = dark.set("hsl.h", `+${degree}`);
                const medium = chroma.scale([dark, bright.brighten(4)]).colors(4);
                newColors = [...medium, bright.hex()];
                break;

            case "complementary":
                const darkColor = baseColor.darken(2);
                const brightColor = darkColor.set("hsl.h", "+180");
                const mediumColors = chroma.scale([darkColor, brightColor.brighten(4)]).colors(4);
                newColors = [...mediumColors, brightColor.hex()];
                break;

            case "triadic":
                const darkCol = baseColor;
                const color1 = darkCol.set('hsl.h', "+120");
                const color2 = darkCol.set('hsl.h', "-120");
                const mediumCol = chroma.scale([darkCol, color1.brighten(4), color2.brighten(4)]).colors(3);
                newColors = [...mediumCol, color1.hex(), color2.hex()];
                break;

            case "vibrant":
                newColors = Array.from({ length: paletteColorsCount }, (_, i) =>
                    baseColor.set("hsl.h", `${i * (360 / paletteColorsCount)}`).hex()
                );
                break;

            default:
                newColors = chroma
                    .scale([baseColor.darken(2), baseColor.brighten(2)])
                    .colors(paletteColorsCount);
                break;
        }

        // Replace only unlocked colors
        newColors = newColors.map((newColor, index) => lockedColors.includes(index) ? colors[index] : newColor);

        // Shuffle the newColors array if mode isn't monochromatic
        if (mode !== "monochromatic") newColors = shuffleArray(newColors);

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
    }, [mode, lockedColors]);

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
        const updatedLockedColors = [...lockedColors];

        const [movedColor] = updatedColors.splice(draggedIndex, 1); // Remove the dragged color
        updatedColors.splice(index, 0, movedColor); // Insert it at the drop location

        // Move the lock status along with the color
        const isLocked = updatedLockedColors.includes(draggedIndex);
        if (isLocked) {
            updatedLockedColors.splice(draggedIndex, 1); // Remove the lock from the dragged index
            updatedLockedColors.splice(index, 0, index); // Add the lock to the new index
        }

        setColors(updatedColors);
        setLockedColors(updatedLockedColors);
        setDraggedIndex(null); // Clear the dragged index
    };

    const handleCopy = (e) => {
        navigator.clipboard.writeText(e.target.innerHTML);
        toast("Color copied to clipboard!");
    };

    const handleColorChange = (e, index) => {
        const newColor = e.target.value; // Get the new color from the color picker
        setColors((prevColors) => {
            const updatedColors = [...prevColors];
            updatedColors[index] = newColor; // Update the specific color in the array
            return updatedColors;
        });
    };

    const toggleLockColor = (index) => {
        setLockedColors((prevLocked) => 
            prevLocked.includes(index) 
                ? prevLocked.filter((i) => i !== index)  // Unlock the color
                : [...prevLocked, index]                 // Lock the color
        );
    };

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

            <div className={`flex flex-col md:flex-row h-screen w-full pt-[4.5rem]`}>
                {colors.map((color, index) => {
                    const luminance = chroma(color).luminance();
                    const textColor = luminance > 0.5 ? "black" : "white";
                    const colorName = namer(color).ntc[0]?.name || "Unknown";
                    const isLocked = lockedColors.includes(index);

                    return (
                        <div
                            key={index}
                            className={`flex flex-col items-center justify-center`}
                            style={{
                                backgroundColor: color,
                                width:
                                    window.innerWidth > 760
                                        ? `${100 / colors.length}%`
                                        : "100%",
                                cursor: 'move', // Change cursor to indicate draggable item
                            }}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(index)}
                        >
                            <p
                                onClick={handleCopy}
                                className="text-center uppercase"
                                style={{ color: textColor }}
                            >
                                {color}
                            </p>

                            <p
                                className="text-center uppercase"
                                style={{ color: textColor }}
                            >
                                {colorName}
                            </p>

                            {/* Color Picker */}
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => handleColorChange(e, index)}
                                className="mt-4 mb-2"
                            />

                            {/* Lock/Unlock button */}
                            <button onClick={() => toggleLockColor(index)}>
                                {isLocked ? "🔒" : "🔓"}
                            </button>
                        </div>
                    );
                })}
            </div>

            <ToastContainer />
        </div>
    );
};

export default PaletteGen;

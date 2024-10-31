import React, { useEffect, useState } from 'react';
import chroma from 'chroma-js';
import namer from 'color-namer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { complementaryColors } from '../paletteTypes/complementary';
import { analogousColors } from '../paletteTypes/analogous';
import { monochromaticColors } from '../paletteTypes/monochromatic';
import { triadicColors } from '../paletteTypes/triadic';

const PaletteGen = () => {
    const [colors, setColors] = useState([]);
    const [paletteColorsCount, setPaletteColorsCount] = useState(5);
    const [mode, setMode] = useState('monochromatic');
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [pickedColor, setPickedColor] = useState('#BDAFD5'); // Initial color picker value

    const [lockedColors, setLockedColors] = useState([]); // Tracks locked color indexes

    // New state for shades panel
    const [shades, setShades] = useState([]);
    const [showShades, setShowShades] = useState(false); // Show/hide shades panel

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

        newColors = newColors.map((newColor, index) =>
            lockedColors.includes(index) ? colors[index] : newColor
        );

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
        let updatedLockedColors = [...lockedColors];
        const [movedColor] = updatedColors.splice(draggedIndex, 1);
        updatedColors.splice(index, 0, movedColor);
        setColors(updatedColors);
        setLockedColors(updatedLockedColors);
        setDraggedIndex(null);
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

    const [index, setIndex] = useState(0);
    const handleShades = (index, color) => {
        const shadesArray = chroma.scale(['white', color, 'black']).mode('rgb').colors(25);
        setShades(shadesArray);
        setShowShades(true);
        setIndex(index);
    };
    // console.log(index)

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

            <div className={`flex flex-col md:flex-row h-screen w-full pt-[4.5rem]`}>
                {colors.map((color, index) => {
                    const luminance = chroma(color).luminance();
                    const textColor = luminance > 0.5 ? "black" : "white";
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
                                cursor: 'move',
                            }}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(index)}
                        >
                            <p onClick={handleCopy} className="text-center uppercase" style={{ color: textColor }}>
                                {color}
                            </p>

                            <input
                                type="color"
                                value={color}
                                onChange={(e) => handleColorChange(e, index)}
                                onBlur={(e) => handleColorPickEnd(e, color)}
                                className="mt-4 mb-2"
                            />

                            <button onClick={() => handleShades(index, color)} className='border border-red-800'>
                                View Shades
                            </button>

                            <button onClick={() => toggleLockColor(index)}>
                                {isLocked ? "🔒locked" : "🔓unlocked"}
                            </button>
                        </div>
                    );
                })}
            </div>

            {showShades && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold mb-4">Shades</h3>
                        <div className="flex flex-wrap gap-2">
                            {shades.map((shade, idx) => (
                                <div
                                    onClick={(e) => { setColorShade(e, shade) }}
                                    key={idx}
                                    className="w-12 h-12"
                                    style={{ backgroundColor: shade }}
                                ></div>
                            ))}
                        </div>
                        <button onClick={() => setShowShades(false)} className="mt-4 text-blue-500">
                            Close
                        </button>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default PaletteGen;

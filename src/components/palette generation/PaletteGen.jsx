import React, { useEffect, useState, useRef } from "react";
import { BiSolidColor } from "react-icons/bi";
import { FaLock } from "react-icons/fa";
import { FaLockOpen } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import chroma from 'chroma-js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handleAddColor, handleUpdatedLockedColors } from '../options/addColor';
import { deleteColor, handleAfterDeleteLockedColors } from "../options/deleteColor";
import { handleColorChange, handleColorPickEnd, handleCopy, updateColorNames } from "../options/colorPicker";
import { handleDrop, toggleLockColor } from "../options/dragAndLock";
import ViewShades from "../options/viewShades";
import { usePalette } from "../../contextAPI/PaletteHistoryContext";
import { generatePaletteColors } from "../options/generatePalette";
import { useColors } from "../../contextAPI/colorsContext";

const PaletteGen = ({ mode }) => {
  const { savePaletteToHistory, currentPalette } = usePalette();

  const { colors, setColors } = useColors();

  const [hoverIndex, setHoverIndex] = useState(null);
  const [paletteColorsCount, setPaletteColorsCount] = useState(5);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [lockedColors, setLockedColors] = useState([]); // Tracks locked color indexes
  const [colorNames, setColorNames] = useState([]);
  const [showShades, setShowShades] = useState({ color: "", index: null }); // Show/hide shades panel

  const prevColorsRef = useRef(colors);
  const isInitialRender = useRef(true); // Track initial render

  useEffect(() => {
    if (currentPalette.length) {
      setColors(currentPalette); // Set colors to the current palette in history
    }
  }, [currentPalette]);

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
    const initialPalette = generatePaletteColors(
      mode,
      paletteColorsCount,
      colors,
      lockedColors
    ); // Initial colors
    // Only save to history on the first render or if the palette changes
    if (isInitialRender.current) {
      isInitialRender.current = false;
      setColors(initialPalette);
      savePaletteToHistory(initialPalette); // Only save the initial palette on first render
    } else if (currentPalette.length && !isInitialRender.current) {
      setColors(initialPalette);
      savePaletteToHistory(initialPalette); // Save new palettes on mode change
    }
  }, [mode, isInitialRender]);

  useEffect(() => {
    const updatedNames = updateColorNames(colors, colorNames, prevColorsRef);
    setColorNames(updatedNames);
  }, [colors]);


  const generatePalette = () => {
    const newColors = generatePaletteColors(mode, paletteColorsCount, colors, lockedColors); // Your palette generation logic
    setColors(newColors);
    savePaletteToHistory(newColors);
  };

  const handleShades = (color, index) => {
    setShowShades({ color: color, index: index });
  };

  const setColorShade = (e, shade, colorIndex) => {
    e.preventDefault();
    setColors((prevColors) => {
      const updatedColors = [...prevColors];
      updatedColors[colorIndex] = shade;
      return updatedColors;
    });
    setShowShades(false);
  };
  return (
    <div>
      <div className="flex flex-col md:flex-row h-screen w-full pt-36">
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
                    : `${100}%`,
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

              <p className="text-center uppercase" style={{ color: textColor }}>
                {colorNames[index]}
              </p>

              {/* Color Picker */}
              <input
                type="color"
                value={color}
                onChange={(e) => handleColorChange(e, colors, index, setColors)} // Detect color change
                // onBlur={() => handleColorPickEnd(color, index, setColorNames)} // Detect when user finishes with the color picker
                className="mt-4 mb-2 border-none cursor-pointer"
                placeholder="Color Picker"
              />

              {/* Shades option */}
              <button
                onClick={() => handleShades(color, index)}
                className="text-3xl"
                style={{ color: textColor }}
              >
                <BiSolidColor />
              </button>

              {/* Lock/Unlock button */}
              <button
                className="mt-3 text-2xl"
                style={{ color: textColor }}
                onClick={() =>
                  toggleLockColor(index, lockedColors, setLockedColors)
                }
              >
                {lockedColors.includes(index) ? <FaLock /> : <FaLockOpen />}
              </button>
              {paletteColorsCount > 2 && (
                <button
                  onClick={() => {
                    setColors(deleteColor(color, colors))
                    setLockedColors(handleAfterDeleteLockedColors(lockedColors, index))
                  }
                  }
                  className="pt-4 text-2xl"
                  style={{ color: textColor }}
                >
                  <MdDelete />
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
                          colors,
                          lockedColors
                        );
                        setColors(updatedColors);
                        const updatedLockedColors = handleUpdatedLockedColors(colors, lockedColors, index)
                        setLockedColors(updatedLockedColors)
                      }}
                      className="absolute transform -translate-y-1/2 bg-white rounded-full w-12 h-12 text-black z-10"
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
      {showShades.color && (
        <ViewShades
          setColorShade={setColorShade}
          onClose={() => setShowShades(false)}
          colorInfo={showShades}
        ></ViewShades>
      )}
      {/* <ToastContainer /> */}
    </div>
  );
};

export default PaletteGen;

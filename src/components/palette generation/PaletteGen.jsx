import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { BiSolidColor } from "react-icons/bi";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import chroma from 'chroma-js';
import { toast } from 'react-toastify';

import { handleAddColor, handleUpdatedLockedColors } from '../options/addColor';
import { deleteColor, handleAfterDeleteLockedColors } from "../options/deleteColor";
import { handleColorChange, handleColorPickEnd, handleCopy, updateColorNames } from "../options/colorPicker";
import { handleDrop, toggleLockColor } from "../options/dragAndLock";
import ViewShades from "../options/viewShades";
import { usePalette } from "../../contextAPI/PaletteHistoryContext";
import { generatePaletteColors } from "../options/generatePalette";
import { urlParameters, urlColorsParsing } from "../utils/reusablefunctions";

const PaletteGen = ({ mode }) => {
  
  const { palette } = useParams(); // Extract palette from URL
  const navigate = useNavigate();
  
  // Custom Context apis
  const { savePaletteToHistory } = usePalette();
  
  // Component state
  const [colors, setColors] = useState([]);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [paletteColorsCount, setPaletteColorsCount] = useState(
    colors.length > 1 ? colors.length : 5
  );
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [lockedColors, setLockedColors] = useState([]); // Tracks locked color indexes
  const [colorNames, setColorNames] = useState([]);
  const [showShades, setShowShades] = useState({ color: "", index: null }); // Show/hide shades panel

  // Use references
  const prevColorsRef = useRef(colors);
  const isInitialRender = useRef(true); // Track initial render

  // undo redo, currentpalette
  useEffect(() => {
    if (palette) {
      setColors(urlColorsParsing(palette)); // Set colors to the current palette in history
    }
  }, [palette]);

  // Update paletteColorsCount whenever colors state changes
  useEffect(() => {
    setPaletteColorsCount(colors.length);
  }, [colors]);

  // Initial palette generation
  const generatePalette = () => {
    const newColors = generatePaletteColors(
      mode,
      paletteColorsCount,
      colors,
      lockedColors
    );
    setColors(newColors);
    savePaletteToHistory(newColors);
    const paletteUrl = urlParameters(newColors);
    navigate(`/${paletteUrl}`, { replace: true });
  };

  useEffect(() => {
    if (palette && isInitialRender.current) {
      isInitialRender.current = false;
      // Parse colors from URL
      const parsedColors = urlColorsParsing(palette);
      setColors(parsedColors);
      savePaletteToHistory(parsedColors);
    } else {
      // Generate a new palette and update URL if no palette is in URL
      if (isInitialRender.current) {
        // App started
        isInitialRender.current = false;
        generatePalette();
      }
      // App is not started but mode changed
      else if (colors.length && !isInitialRender.current)
        generatePalette();
    }
  }, [mode, isInitialRender]);

  // Generate palette on hitting space bar
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

  // For changing the names of colors, color picker
  useEffect(() => {
    const updatedNames = updateColorNames(colors, colorNames, prevColorsRef);
    setColorNames(updatedNames);
  }, [colors]);

  // Open shades modal and change shade
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
                    setColors(deleteColor(color, colors));
                    setLockedColors(
                      handleAfterDeleteLockedColors(lockedColors, index)
                    );
                  }}
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
                        const updatedLockedColors = handleUpdatedLockedColors(
                          colors,
                          lockedColors,
                          index
                        );
                        setLockedColors(updatedLockedColors);
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
    </div>
  );
};

export default PaletteGen;

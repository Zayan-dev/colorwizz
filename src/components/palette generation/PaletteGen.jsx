import React, { useEffect, useState } from 'react';
import chroma from 'chroma-js';
import namer from 'color-namer';

const PaletteGen = () => {
    const [colors, setColors] = useState([]);
    const [paletteColorsCount, setPaletteColorsCount] = useState(5)
    const [mode, setMode] = useState('monochromatic');

    const addColor = (e) => {
        if (paletteColorsCount < 10) {
            e.preventDefault(); 
            setPaletteColorsCount((prevCount) => Math.min(prevCount + 1, 10));
        }
    }

    const generatePalette = () => {
        let newColors;
        const baseColor = chroma.random().saturate(2).brighten(1);

        switch (mode) {
            case 'analogous':
                newColors = chroma.scale([baseColor, baseColor.set('hsl.h', '+30'), baseColor.set('hsl.h', '-30')]).colors(paletteColorsCount);
                break;

            case 'complementary':
                newColors = chroma.scale([baseColor, baseColor.set('hsl.h', '+180')]).colors(paletteColorsCount);
                break;

            case 'triadic':
                newColors = chroma.scale([baseColor, baseColor.set('hsl.h', '+120'), baseColor.set('hsl.h', '-120')]).colors(paletteColorsCount);
                break;

            case 'vibrant':
                // newColors = [
                //     baseColor.hex(),
                //     baseColor.set('hsl.h', '+30').hex(),  // Complementary hue
                //     baseColor.set('hsl.h', '-30').hex(),  // Analogous hue
                //     baseColor.set('hsl.h', '+180').hex(), // Complementary color
                //     baseColor.set('hsl.h', '+60').hex()   // Additional analogous color
                // ];
                newColors = Array.from({ length: paletteColorsCount }, (_, i) =>
                  baseColor
                    .set("hsl.h", `${i * (360 / paletteColorsCount)}`)
                    .hex()
                );
                break;

            default:
                newColors = chroma.scale([baseColor.darken(2), baseColor.brighten(2)]).colors(paletteColorsCount);
                break;
        }

        setColors(newColors);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space' ) {
                e.preventDefault(); 
                generatePalette();
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [mode, paletteColorsCount]);

    useEffect(() => {
        generatePalette(); // Generate palette initially
    }, [paletteColorsCount]);

    return (
      <div>
        <div className="w-full h-[4.5rem] px-8 flex justify-between items-center fixed bg-white">
          <div className="flex">
            <select
              className="p-3 border border-gray rounded-md "
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="monochromatic">Monochromatic</option>
              <option value="analogous">Analogous</option>
              <option value="complementary">Complementary</option>
              <option value="triadic">Triadic</option>
              <option value="vibrant">Vibrant</option>
            </select>

            {/* <button className='ml-5 p-3 bg-blue-600 text-white rounded cursor-pointer' onClick={generatePalette}>
                    Generate Palette
                </button> */}

            <p className="text-base m-5 text-stone-500">
              Hit spacebar to generate colors palette
            </p>
          </div>
          <div className="flex justify-between items-center flex-row-reverse">
            {paletteColorsCount < 10 && (
                <button className='p-2 bg-gray text-black rounded cursor-pointer' onClick={addColor}>
                    Add Color
                </button>
            )}
          </div>
        </div>

        <div className={`flex flex-col md:flex-row h-screen w-screen pt-[4.5rem]`}>
          {colors.map((color, index) => {
            const luminance = chroma(color).luminance();
            const textColor = luminance > 0.5 ? "black" : "white";
            const colorName = namer(color).ntc[0]?.name || "Unknown";
            return (
              <div
                key={index}
                className={`flex flex-col items-center justify-center ${"w-1/" + colors.length }`}
                style={{ backgroundColor: color }}
              >
                <p
                  className="text-center font-semibold uppercase text-4xl"
                  style={{ color: textColor }}
                >
                  {color}
                </p>
                <p style={{ color: textColor }}>{colorName}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
};

export default PaletteGen;

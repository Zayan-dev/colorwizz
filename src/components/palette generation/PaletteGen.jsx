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
            const baseColor = chroma.random().saturate(2).brighten(1);
            let newColor;

            switch (mode) {
                case "analogous":
                    newColor = chroma
                        .scale([
                            baseColor,
                            baseColor.set("hsl.h", "+30"),
                            baseColor.set("hsl.h", "-30"),
                        ])
                        .colors(paletteColorsCount + 1)[paletteColorsCount]; // Get the next color
                    break;

                case "complementary":
                    newColor = chroma
                        .scale([baseColor, baseColor.set("hsl.h", "+180")])
                        .colors(paletteColorsCount + 1)[paletteColorsCount];
                    break;

                case "triadic":
                    newColor = chroma
                        .scale([
                            baseColor,
                            baseColor.set("hsl.h", "+120"),
                            baseColor.set("hsl.h", "-120"),
                        ])
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
    }

    const generatePalette = () => {
        let newColors, newColors2;
        const baseColor = chroma.random().saturate(2);
        // const baseColor2 = chroma.random().saturate(2).brighten(1);

        switch (mode) {
            case 'analogous':
                newColors = chroma.scale([baseColor, baseColor.set('lch.h', '+30'), baseColor.set('lch.c', '-30')]).colors(5);
                // newColors2 = chroma.scale([baseColor2, baseColor2.set('hsl.h', '+30'), baseColor2.set('hsl.h', '-30')]).colors(3);

                // newColors = newColors.concat(newColors2)


                break;

          case "complementary":
            const darkColor = baseColor.darken(2); // Darken the base color
            const brightColor = darkColor.set("hsl.h", "+180");
            const mediumColors = chroma.scale([darkColor, brightColor.brighten(4)]).colors(4); // 3 medium-light to dark colors
            newColors = [...mediumColors, brightColor.hex()];
            console.log(darkColor, brightColor)
            break;

          case "triadic":
            newColors = chroma
              .scale([
                baseColor,
                baseColor.set("hsl.h", "+120"),
                baseColor.set("hsl.h", "-120"),
              ])
              .colors(paletteColorsCount);
            break;

          case "vibrant":
            newColors = [
              baseColor.hex(),
              baseColor.set("hsl.h", "+30").hex(), // Complementary hue
              baseColor.set("hsl.h", "-30").hex(), // Analogous hue
              baseColor.set("hsl.h", "+180").hex(), // Complementary color
              baseColor.set("hsl.h", "+60").hex(), // Additional analogous color
            ];
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
    }, [mode]);

    useEffect(() => {
        generatePalette(); // Generate palette initially
    }, [mode]);

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
                    {/* {paletteColorsCount < 10 && (
                <button className='p-2 bg-gray text-black rounded cursor-pointer' onClick={addColor}>
                    Add Color
                </button>
            )} */}
                </div>
            </div>

            <div className={`flex flex-col md:flex-row h-screen w-full pt-[4.5rem]`}>
                {colors.map((color, index) => {
                    const luminance = chroma(color).luminance();
                    const textColor = luminance > 0.5 ? "black" : "white";
                    const colorName = namer(color).ntc[0]?.name || "Unknown";
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
                            }}
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

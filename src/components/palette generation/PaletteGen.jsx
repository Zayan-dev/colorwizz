import React, { useEffect, useState } from 'react';
import chroma from 'chroma-js';
import namer from 'color-namer';

const PaletteGen = () => {
    const [colors, setColors] = useState([]);
    const [mode, setMode] = useState('monochromatic');

    const generatePalette = () => {
        let newColors;
        const baseColor = chroma.random().saturate(2).brighten(1);

        switch (mode) {
            case 'analogous':
                newColors = chroma.scale([baseColor, baseColor.set('hsl.h', '+30'), baseColor.set('hsl.h', '-30')]).colors(5);
                break;

            case 'complementary':
                newColors = chroma.scale([baseColor, baseColor.set('hsl.h', '+180')]).colors(5);
                break;

            case 'triadic':
                newColors = chroma.scale([baseColor, baseColor.set('hsl.h', '+120'), baseColor.set('hsl.h', '-120')]).colors(5);
                break;

            case 'vibrant':
                newColors = [
                    baseColor.hex(),
                    baseColor.set('hsl.h', '+30').hex(),  // Complementary hue
                    baseColor.set('hsl.h', '-30').hex(),  // Analogous hue
                    baseColor.set('hsl.h', '+180').hex(), // Complementary color
                    baseColor.set('hsl.h', '+60').hex()   // Additional analogous color
                ];
                break;

            default:
                newColors = chroma.scale([baseColor.darken(2), baseColor.brighten(2)]).colors(5);
                break;
        }

        setColors(newColors);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space') {
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
    }, []);

    return (
        <div>
            <div className='m-5 flex'>
                <select
                    className='p-3 border rounded-md'
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                >
                    <option value='monochromatic'>Monochromatic</option>
                    <option value='analogous'>Analogous</option>
                    <option value='complementary'>Complementary</option>
                    <option value='triadic'>Triadic</option>
                    <option value='vibrant'>Vibrant</option>
                </select>

                {/* <button className='ml-5 p-3 bg-blue-600 text-white rounded cursor-pointer' onClick={generatePalette}>
                    Generate Palette
                </button> */}

                <p className='text-xl m-5 text-stone-500'>Hit Spacebar to Generate Colors Palettes</p>

            </div>
            <div className='flex justify-center items-center'>
                {colors.map((color, index) => {
                    const luminance = chroma(color).luminance();
                    const textColor = luminance > 0.5 ? 'black' : 'white';
                    const colorName = namer(color).ntc[0]?.name || 'Unknown';
                    return (
                        <div
                            key={index}
                            className='h-[90vh] w-1/5 flex flex-col items-center justify-center'
                            style={{ backgroundColor: color }}
                        >
                            <p className='text-center font-semibold uppercase text-4xl' style={{ color: textColor }}>{color}</p>
                            <p style={{ color: textColor }}>{colorName}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PaletteGen;

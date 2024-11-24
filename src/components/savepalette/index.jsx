import axios from 'axios';
import chroma from 'chroma-js';
import Cookies from "js-cookie";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { toast } from 'react-toastify';
import { useColors } from '../../contextAPI/colorsContext';
import { usePalette } from '../../contextAPI/PaletteHistoryContext';

const index = () => {
    const [palettes, setPalettes] = useState([]);
    const [selectedPalette, setSelectedPalette] = useState(null);
    const [index, setIndex] = useState(null);

    const navigate = useNavigate();

    const { savePaletteToHistory } = usePalette()
    const { setColors } = useColors();

    const fetchSavePalettes = async () => {
        try {
            const token = Cookies.get("token");
            const response = await axios.get("http://localhost:5000/api/getAllPalettes", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });
            if (response.status === 404) {
                navigate("/");
            }
            setPalettes(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchSavePalettes();
    }, []);
    const handleDeletePalette = async (index) => {

        closeModal();
        try {
            const token = Cookies.get("token");
            const response = await axios.delete("http://localhost:5000/api/savedPaletteDelete", {
                data: { index }
                ,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.status === 200) {
                fetchSavePalettes();
            }
            toast.success(response.data.message);
        } catch (error) {
            console.log(error);
        }

    }

    const handlePaletteClick = (palette, index) => {
        setSelectedPalette(palette);
        setIndex(index);
    };

    const closeModal = () => {
        setSelectedPalette(null);
    };

    const handleOpen = (e, selectedPalette) => {
        navigate("/");
        e.preventDefault();
        setColors(selectedPalette);
        savePaletteToHistory(selectedPalette);
    }

    return (
      <div className="p-[7rem] z-0 relative top-20 grid grid-cols-3 gap-8">
        {palettes.length > 0 &&
          palettes.map((palette, index) => (
            <div
              key={index}
              className="h-40 w-full bg-gray-200 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform"
              onClick={() => handlePaletteClick(palette, index)}
            >
              <div className=" relative h-full flex">
                {palette.map((color, i) => {
                  return (
                    <div
                      key={i}
                      className="flex-1"
                      style={{ backgroundColor: color }}
                    ></div>
                  );
                })}
              </div>
            </div>
          ))}

        {palettes.length == 0 && (
          <h1 className="text-2xl">No saved palettes</h1>
        )}

        {selectedPalette && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-lg p-6 relative w-[90%] max-w-4xl">
              <button
                onClick={closeModal}
                className="text-3xl absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <RxCross2 />
              </button>
              <button
                onClick={() => handleDeletePalette(index)}
                className="text-3xl mt-2"
              >
                <MdDelete />
              </button>

              <h2 className="text-xl font-semibold mb-4 text-center">
                Selected Palette
              </h2>
              <div className="flex h-20">
                {selectedPalette.map((color, i) => {
                  const luminance = chroma(color).luminance();
                  const textColor = luminance > 0.5 ? "black" : "white";
                  return (
                    <div
                      key={i}
                      className="flex-1 flex justify-center items-center text-white font-medium"
                      style={{ backgroundColor: color, color: textColor }}
                    >
                      {color}
                    </div>
                  );
                })}
              </div>
              <div className="text-center">
                <button
                  onClick={() => {
                    setColors(selectedPalette);
                    savePaletteToHistory(selectedPalette);
                    navigate("/");
                  }}
                  className="px-4 py-2 mt-8 bg-blue-500 text-white rounded"
                >
                  Open
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
};

export default index;

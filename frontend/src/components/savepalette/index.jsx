import axios from 'axios';
import chroma from 'chroma-js';
import Cookies from "js-cookie";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { toast } from 'react-toastify';
import { ColorRing } from "react-loader-spinner";
import { usePalette } from '../../contextAPI/PaletteHistoryContext';
import { urlParameters } from '../utils/reusablefunctions';

const index = () => {
    const [palettes, setPalettes] = useState([]);
    const [palettesLoading, setPalettesLoading] = useState(false);
    const [selectedPalette, setSelectedPalette] = useState(null);
    const [index, setIndex] = useState(null);

    const navigate = useNavigate();

    const { savePaletteToHistory } = usePalette()

    const fetchSavePalettes = async () => {
        try {
            setPalettesLoading(true);
            const token = Cookies.get("token");
            const response = await axios.get("http://localhost:5000/api/getAllPalettes", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });
            if (response.status === 404) {
                navigate(`/${urlParameters(selectedPalette)}`, {
                  replace: true,
                });
            }
            if (response.data) {
              setPalettesLoading(false);
              setPalettes(response.data);
            }
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
        e.preventDefault();
        navigate(`/${urlParameters(selectedPalette)}`, { replace: true });
        savePaletteToHistory(selectedPalette);
    }

    return palettesLoading ? (
      <div className="flex h-screen justify-center items-center">
        <ColorRing
          visible={true}
          height="80"
          width="80"
          ariaLabel="color-ring-loading"
          wrapperStyle={{}}
          wrapperClass="color-ring-wrapper"
          colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
        />
      </div>
    ) : (
      <div className='h-screen p-28'>
        {palettes.length > 0 && (
          <>
            <h1 className="text-2xl font-medium">Your saved palettes</h1>
            <div className="z-0 relative top-12 grid grid-cols-3 gap-8">
              {palettes.map((palette, index) => (
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
            </div>
          </>
        )}
        
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
                    savePaletteToHistory(selectedPalette);
                    navigate(`/${urlParameters(selectedPalette)}`, {
                      replace: true,
                    });
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

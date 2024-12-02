import React, { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PiShuffleBold } from "react-icons/pi";
import { toPng } from "html-to-image";
import { urlColorsParsing, urlParameters } from "../../components/utils/reusablefunctions";
import VisualizerCanvas from "../../components/visualizerCanvas/visualizerCanvas";

const PaletteVisualizer = () => {
  const { palette } = useParams();
  const navigate = useNavigate();
  const colors = urlColorsParsing(palette);

  const canvasRef = useRef();

  const shuffleArray = (array) => {
    // Fisher-Yates shuffle algorithm
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleShuffle = () => {
    const shuffledColors = shuffleArray(colors);
    navigate(`/visualizePalette/${urlParameters(shuffledColors)}`, { replace: true }); // Update the URL with the shuffled colors
  };

  const downloadImage = async () => {
    if (canvasRef.current) {
      try {
        const dataUrl = await toPng(canvasRef.current);
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "Palette_Visualization.png";
        link.click();
      } catch (error) {
        console.error("Failed to download image", error);
      }
    }
  };

  return (
    <div className="bg-slate-100 min-h-fit h-screen pt-24 py-14 px-14 text-center">
      <div className="w-[1100px] mx-auto rounded-xl overflow-hidden mb-8 flex">
        <button
          onClick={handleShuffle}
          className="w-16 bg-blue-500 hover:bg-blue-700 flex items-center justify-center"
        >
          <PiShuffleBold className="text-white text-2xl" />
        </button>
        <div className="w-full flex">
          {colors.map((color, index) => (
            <div
              key={index}
              className="cursor-pointer flex-1 h-16 flex items-center justify-center relative group"
              style={{ backgroundColor: color }}
            >
              <span className="absolute opacity-0 group-hover:opacity-100 text-white bg-black bg-opacity-75 px-2 py-1 rounded text-sm transition-opacity duration-300">
                {color}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex w-full justify-center">
        <VisualizerCanvas colors={colors} ref={canvasRef} />
      </div>
      <button
        onClick={downloadImage}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-200"
      >
        Download
      </button>
    </div>
  );
};

export default PaletteVisualizer;

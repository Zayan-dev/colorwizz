import React, { useState } from "react";
import { useColors } from "../../contextAPI/colorsContext";
import VisualizerCanvas from "../../components/visualizerCanvas/visualizerCanvas";

import html2canvas from "html2canvas";

const PaletteVisualizer = () => {
  const { colors } = useColors();

  const downloadImage = () => {
    const element = document.getElementById("palette-visualizer");
    html2canvas(element).then((canvas) => {
      const link = document.createElement("a");
      link.download = "palette-visualization.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  return (
    <div className="bg-slate-200 h-screen pt-44 px-14 text-center">
      <VisualizerCanvas />
      <button
        onClick={downloadImage}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Download
      </button>
    </div>
  );
};

export default PaletteVisualizer;

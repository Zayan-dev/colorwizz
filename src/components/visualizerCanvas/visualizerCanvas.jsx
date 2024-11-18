import React from "react";
import { useColors } from "../../contextAPI/colorsContext";

const VisualizerCanvas = () => {
  const { colors } = useColors();

  return (
    <div
      id="palette-visualizer"
      className="p-4 rounded-lg shadow-lg bg-white w-4/5 mx-auto h-4/5 mb-14"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {colors.map((color, index) => (
          <div
            key={index}
            className="flex-1 h-20"
            style={{ backgroundColor: color }}
            title={color}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default VisualizerCanvas;

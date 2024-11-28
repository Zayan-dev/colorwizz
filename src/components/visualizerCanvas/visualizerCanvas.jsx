import React from "react";
import { useParams } from "react-router-dom";
import { urlColorsParsing } from "../utils/reusablefunctions";
import chroma from "chroma-js";

const VisualizerCanvas = () => {
  const { palette } = useParams();
  const colors = urlColorsParsing(palette)

  const checkLuminance = (color) => {
    const luminance = chroma(color).luminance();
    return luminance > 0.5 ? "black" : "white";
  }

  return (
    <div
      id="palette-visualizer"
      className="relative rounded-lg shadow-lg bg-white w-4/5 mx-auto h-5/6 mb-8"
    >
      <div className="absolute top-0 w-full bg-transparent flex justify-between items-end px-20 py-6">
        <div className="flex justify-between items-end w-1/2 max-w-fit gap-24 font-body">
          <div>
            <h1 className="text-3xl font-bold ">
              <span style={{ color: colors[0] }}>X</span>
              <span style={{ color: colors[1] }}>Studio</span>
            </h1>
          </div>
          <div className="flex space-x-10 text-lg font-medium">
            <p>Browse</p>
            <p>Trending</p>
            <p>Pricing</p>
          </div>
        </div>
        <div className="flex justify-between items-end w-fit gap-16 text-lg font-body font-medium">
          <p>Login</p>
          <button
            className="py-2 text-base px-4 rounded-md"
            style={{
              backgroundColor: colors[1],
              color: checkLuminance(colors[1]),
            }}
          >
            Free Trial
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="w-full h-full flex text-left">
        <div className="px-16 w-3/5 h-full flex justify-center flex-col bg-white">
          <div className="w-4/5">
            <h2 className="text-4xl font-extrabold mb-4">
              Craft Stunning Interfaces with Unlimited Designs
            </h2>
            <p className="text-gray-600 mb-6">
              Explore our library of professionally crafted UI/UX design
              resources. From wireframes to polished interfaces, we provide
              ready-to-use templates, design kits, and inspiration for
              developers and designers to build exceptional user experiences.
            </p>
          </div>
        </div>
        <div
          className="w-2/5 h-full"
          style={{ backgroundColor: colors[0] }}
        ></div>
      </div>
    </div>
  );
};

export default VisualizerCanvas;

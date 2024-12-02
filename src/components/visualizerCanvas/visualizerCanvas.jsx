import React, { forwardRef } from "react";
import chroma from "chroma-js";
import { BsSearch } from "react-icons/bs";
import { IoRocketOutline } from "react-icons/io5";
import { PiDownloadBold } from "react-icons/pi";
import { Circle, SemiCircle, TwoSquares, RoundedSquare, Square } from "../svgShapes/shapes";

const VisualizerCanvas = forwardRef((props, ref) => {
  const { colors } = props;
  const checkLuminance = (color) => {
    const luminance = chroma(color).luminance();
    return luminance > 0.5 ? "black" : "white";
  };

  const filteredColors = colors.slice(1);
  const assignColor = (index) => filteredColors[index % filteredColors.length];

  const shapes = [
    { type: SemiCircle, className: "absolute top-0 -left-[101px] rotate-90" },
    {
      type: SemiCircle,
      className: "w-36 h-36 absolute top-[56px] -left-[72px] -rotate-90",
    },
    {
      type: TwoSquares,
      className: "z-10 w-48 h-48 absolute top-[200px] left-0",
    },
    {
      type: Circle,
      className: "h-48 w-48 absolute top-[200px] -left-[96px]",
    },
    {
      type: RoundedSquare,
      className: "w-48 h-48 absolute top-[104px] left-[96px] rotate-90",
    },
    {
      type: SemiCircle,
      className: "w-24 h-24 z-10 absolute bottom-0 -left-[48px] -rotate-90",
    },
    {
      type: Square,
      className: "w-24 h-24 absolute bottom-0 -left-[96px]",
    },
    {
      type: "Pair",
      components: [
        {
          type: Square,
          className: "z-10 w-24 h-24 absolute bottom-0 left-0",
        },
        {
          type: Circle,
          className:
            "w-[11.85rem] h-[11.85rem] absolute bottom-0 left-0 -rotate-90",
        },
      ],
    },
    {
      type: "Pair",
      components: [
        {
          type: Square,
          className:
            "z-10 w-[5.5rem] h-[5.5rem] absolute top-[387.5px] left-[282.5px]",
        },
        {
          type: Circle,
          className: "w-44 h-44 absolute top-[300px] left-[195px] -rotate-90",
        },
      ],
    },
  ];


  return (
    <div
      ref={ref}
      id="palette-visualizer"
      className="relative rounded-lg shadow-lg bg-white w-[68.75rem] h-[36rem] mb-8 font-body"
    >
      <div className="absolute z-20 top-0 w-full bg-transparent flex justify-between items-end px-20 py-6">
        <div className="flex justify-between items-end w-1/2 max-w-fit gap-24 ">
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
        <div className="flex justify-between items-end w-fit gap-16 text-lg  font-medium">
          <p style={{ color: checkLuminance(colors[0]) }}>Login</p>
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
        <div className="px-16 pt-4 w-3/5 h-full flex justify-center flex-col bg-white">
          <div className="w-4/5">
            <h2 className="text-4xl font-heading font-bold mb-4">
              Craft Stunning Interfaces with Unlimited Designs
            </h2>
            <p className=" text-gray-600 mb-6">
              Explore our library of professionally crafted UI/UX design
              resources. From wireframes to polished interfaces, we provide
              design kits to build exceptional user experiences.
            </p>
          </div>

          <div className="absolute bottom-12 w-1/3 flex justify-between mt-4 font-heading">
            {[
              { icon: BsSearch, label: "Browse" },
              { icon: PiDownloadBold, label: "Download" },
              { icon: IoRocketOutline, label: "Get Started" },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center"
                  style={{ color: assignColor(index) }}
                >
                  <Icon className="text-3xl mb-2" />
                  <span className="text-lg font-semibold text-gray-700">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

          <Circle
            color={colors[colors.length - 1]}
            className="h-24 w-24 absolute top-1/3 left-[40%]"
          />
          <Circle
            color={colors[colors.length - 2]}
            className="h-16 w-16 absolute top-[65%] left-[25%]"
          />
        </div>

        <div
          className="relative w-2/5 h-full"
          style={{ backgroundColor: colors[0] }}
        >
          {shapes.map((shape, index) => {
            if (shape.type === "Pair") {
              const color = assignColor(index);
              return (
                <React.Fragment key={index}>
                  {shape.components.map((component, subIndex) =>
                    React.createElement(component.type, {
                      key: `${index}-${subIndex}`,
                      color,
                      className: component.className,
                    })
                  )}
                </React.Fragment>
              );
            }

            const color = filteredColors[index % filteredColors.length];
            return React.createElement(shape.type, {
              key: index,
              color,
              className: shape.className,
            });
          })}
        </div>
      </div>
    </div>
  );
});

export default VisualizerCanvas;


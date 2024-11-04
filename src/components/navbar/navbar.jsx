import React from "react";
import { IoIosUndo, IoIosRedo } from "react-icons/io";
import { usePalette } from "../../contextAPI/PaletteHistoryContext";

const Navbar = ({ mode, setMode}) => {

  const { undo, redo, currentIndex, paletteHistory } = usePalette();

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < paletteHistory.length - 1;
  return (
    <div className="w-full fixed top-[4.49rem] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 h-[4.5rem] flex justify-between items-center">
        <div className="flex items-center">
          <select
            className="px-3 h-12 border border-gray rounded-md text-stone-800"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="monochromatic">Monochromatic</option>
            <option value="analogous">Analogous</option>
            <option value="complementary">Complementary</option>
            <option value="triadic">Triadic</option>
            <option value="vibrant">Vibrant</option>
          </select>
          <p className="text-base m-5 text-stone-800">
            Hit spacebar to generate colors palette
          </p>
        </div>
        <div className="flex space-x-6">
          <button onClick={undo} disabled={!canUndo}>
            <IoIosUndo
              className={`text-2xl  ${
                canUndo ? "text-black hover:text-blue-500" : "text-darkGray"
              }`}
            />
          </button>
          <button onClick={redo} disabled={!canRedo}>
            <IoIosRedo
              className={`text-2xl  ${
                canRedo ? "text-black hover:text-blue-500" : "text-darkGray"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

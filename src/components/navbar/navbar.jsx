import React from "react";

const Navbar = ({ mode, setMode }) => {
  return (
    <div className="w-full h-[4.5rem] px-8 flex justify-between items-center fixed bg-white">
      <div className="flex">
        <select
          className="p-3 border border-gray rounded-md"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="monochromatic">Monochromatic</option>
          <option value="analogous">Analogous</option>
          <option value="complementary">Complementary</option>
          <option value="triadic">Triadic</option>
          <option value="vibrant">Vibrant</option>
        </select>
        <p className="text-base m-5 text-stone-500">
          Hit spacebar to generate colors palette
        </p>
      </div>
    </div>
  );
};

export default Navbar;

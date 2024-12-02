import React, { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { IoIosUndo, IoIosRedo } from "react-icons/io";
import { IoCamera } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { RxBorderDotted } from "react-icons/rx";

import ImagePickerModal from "../options/imagePicker/imagePickerModal";
import { isLoggedIn, loginOnlyFeature } from "../utils/loginOnlyfeature";
import { downloadPalette, drawPalette } from "../options/downloadPalette";

import { usePalette } from "../../contextAPI/PaletteHistoryContext";

import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const Navbar = ({ mode, setMode }) => {
  // Accessing url colors
  const location = useLocation();
  const colors = location.pathname.startsWith("/")
    ? location.pathname.substring(1).split("-").map((color) => `#${color}`)
    : [];

  // Image Picker modal state
  const [isPickerModalOpen, setPickerModalOpen] = useState(false);

  // Undo Redo
  const { undo, redo, currentIndex, paletteHistory } = usePalette();
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < paletteHistory.length - 1;

  // Export Palette
  const canvasRef = useRef(null);
  const handlePaletteDownload = () => {
    if (canvasRef.current) {
      drawPalette(canvasRef.current, colors);
      downloadPalette(canvasRef.current);
    }
  };

  // Extra options
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Save Palette
  const handleSavePalette = async () => {
    if (loginOnlyFeature()) {
      return
    }
    try {
      const token = Cookies.get("token");
      // console.log(token.plan);
      const response = await axios.post(
        "http://localhost:5000/api/savePalette",
        { colors },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        toast.success("Palette saved!");
      } else {
        toast.success("Palette already exists!");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("Please Login");
      } else {
        toast.error(error.response.data.message);
      }
    }
  };
  // const [img, setImg] = useState(null);
  // const setImageInLocalStorage = () => {
  //   const image = localStorage.getItem("img");
  //   setImg(image);

  // }
  return (
    <div className="w-full z-20 fixed top-[4.49rem] bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 h-[4.5rem] flex justify-between items-center border-t border-gray">
        <div className="flex items-center h-full">
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
          {isLoggedIn() && (
            <RxBorderDotted
              className="ml-8 text-3xl font-bold cursor-pointer hover:text-blue-500"
              onClick={toggleDropdown}
            />
          )}
          {dropdownOpen && (
            <div className="border border-gray relative right-12 top-16 bg-white shadow-lg rounded-md w-40 p-2">
              <ul className="space-y-2">
                <a
                  onClick={() => {
                    setDropdownOpen(!dropdownOpen);
                  }}
                  href="/savedpalette"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-500 cursor-pointer"
                >
                  Saved Palettes
                </a>
                <li className="hover:text-blue-500 cursor-pointer">Option 2</li>
                <li className="hover:text-blue-500 cursor-pointer">Option 3</li>
              </ul>
            </div>
          )}
        </div>
        <div className="flex justify-center items-center space-x-6">
          <button
            onClick={() => {
              setPickerModalOpen(true)
            }}
            disabled={isPickerModalOpen}
          >
            <IoCamera className="text-2xl text-black hover:text-blue-500" />
          </button>
          <a
            href={`/visualizePalette/${location.pathname.substring(1)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base text-black hover:text-blue-500"
          >
            Palette Visualizer
          </a>
          <button onClick={undo} disabled={!canUndo}>
            <IoIosUndo
              className={`text-2xl ${canUndo ? "text-black hover:text-blue-500" : "text-darkGray"
                }`}
            />
          </button>
          <button onClick={redo} disabled={!canRedo}>
            <IoIosRedo
              className={`text-2xl ${canRedo ? "text-black hover:text-blue-500" : "text-darkGray"
                }`}
            />
          </button>
          <button
            onClick={handlePaletteDownload}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-200"
          >
            Download
          </button>
          <div>
            <button
              onClick={handleSavePalette}
              className="flex justify-center items-center p-1 gap-1 text-center hover:text-blue-500 transition duration-200"
            >
              <p>Save</p> <CiHeart className="text-2xl" />
            </button>
          </div>

          {/* Export colors */}
          <canvas ref={canvasRef} style={{ display: "none" }} />

          {/* Image picker Modal */}
          {isPickerModalOpen && (
            <ImagePickerModal
              isOpen={isPickerModalOpen}
              onClose={() => setPickerModalOpen(false)}
              // img={img}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

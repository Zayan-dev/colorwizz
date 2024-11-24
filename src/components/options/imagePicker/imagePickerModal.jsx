import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { usePalette as useColorThiefPalette } from "color-thief-react";
import { ColorRing } from 'react-loader-spinner';
import Modal from 'react-modal';
import { MdClose, MdAddCircle, MdRemoveCircle , MdLock, MdDelete, MdLockOpen} from "react-icons/md";
import { usePalette } from '../../../contextAPI/PaletteHistoryContext';
import chroma from 'chroma-js';
import { urlParameters } from '../../utils/reusablefunctions';

const ImagePickerModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  // States
  const [image, setImage] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [displayedColors, setDisplayedColors] = useState([]);

  // Context APIs used only on onclick of next button
  const { savePaletteToHistory } = usePalette();

  // Extracting colors
  const { data, loading } = useColorThiefPalette(image, 20, "hex");

  // Effect to set displayed colors when `data` is available
  useEffect(() => {
    if (data && data.length > 0) {
      setImageUploading(loading);
      setDisplayedColors(getRandomColors(data));
    }
  }, [data]);

  // functions

  // Setting image
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setImageUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to return an array of 5 random colors object with locked = false
  const getRandomColors = (colorsArray) => {
    const count = displayedColors.length > 0 ? displayedColors.length : 5;
    const shuffled = colorsArray.sort(() => 0.5 - Math.random()); // Shuffle colors
    // Filter out the colors that are already present as locked colors
    const availableColors = shuffled.filter(
      (color) =>
        !displayedColors.some(
          (colorObj) => colorObj.locked && colorObj.color === color
        )
    );
    const formattedColors = availableColors.slice(0, count).map((color) => ({
      color: color,
      locked: false,
    }));
    return formattedColors; // Return the first 'count' colors
  };

  const changePalette = () => {
    // Get random colors 
    const newColors = getRandomColors(data);

    // Map through the current displayedColors and update only the unlocked colors
    setDisplayedColors((prevColors) =>
      prevColors.map((colorObj, index) => {
        if (colorObj.locked) {
          // If the color is locked, retain the existing color
          return colorObj;
        } else {
          // If the color is not locked, replace it with a new color from newColors
          return newColors[index] || colorObj;
        }
      })
    );
  };

  // Function to add a color to the existing palette
  const addColor = (colorsArray) => {
    if (displayedColors.length < 10) {
      // find a color that is not already present in the current colors
      const newColor = colorsArray.find(
        (color) =>
          !displayedColors.some(
            (existingColor) => existingColor.color === color
          )
      );

      if (newColor) {
        setDisplayedColors((prevColors) => [
          ...prevColors,
          { color: newColor, locked: false },
        ]);
      }
    }
  };

  // Function to remove a color from the palette right side, ensuring there are at least 2 left
  const removeColor = () => {
    if (displayedColors.length > 2) {
      // Check if the last color is locked
      const lastColor = displayedColors[displayedColors.length - 1];

      // If the last color is locked, remove an unlocked color
      if (lastColor.locked) {
        // Find an unlocked color to remove
        const updatedColors = displayedColors.filter(
          (colorObj) => !colorObj.locked
        );

        // If we have unlocked colors, remove one and update the displayedColors
        if (updatedColors.length < displayedColors.length) {
          const removedColor = updatedColors.pop(); // Remove the last unlocked color
          setDisplayedColors([
          ...updatedColors,
          ...displayedColors.filter(colorObj => colorObj.locked)
        ]);// Update the displayedColors with removed unlocked color
        }
      } else {
        // If the last color is not locked, simply remove it
        setDisplayedColors((prevColors) => prevColors.slice(0, -1));
      }
    }
  };

  // Delete a specific color
  const deleteColor = (color) => {
    setDisplayedColors((prevColors) =>
      prevColors.filter((c) => c.color !== color)
    );
  };

  // Function to lock a color
  const lockColor = (color) => {
    setDisplayedColors((prevColors) =>
      prevColors.map((c) => (c.color === color ? { ...c, locked: true } : c))
    );
  };

  // Function to unlock a color
  const unlockColor = (color) => {
    setDisplayedColors((prevColors) =>
      prevColors.map((c) => (c.color === color ? { ...c, locked: false } : c))
    );
  };

  const getColorValues = (colorsArray) => {
    return colorsArray.map((colorObj) => colorObj.color);
  };


  return (
    <Modal
      appElement={document.getElementById("root")}
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white py-4 px-8 z-50 rounded-lg max-w-fit mx-auto mt-32 my-10 outline-none shadow-lg"
      overlayClassName={{
        base: "fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto ", // Custom styles for the overlay
        afterOpen: "opacity-100",
        beforeClose: "opacity-0",
      }}
    >
      <div className="flex justify-between items-center my-4 pb-4 gap-16">
        <button onClick={onClose}>
          <MdClose className="text-3xl text-black hover:text-blue-500" />
        </button>

        {image ? (
          <h1 className="text-2xl text-center font-bold">Image Color Picker</h1>
        ) : (
          <h1 className="text-2xl text-center font-bold">Upload an Image</h1>
        )}
        {image ? (
          <button
            onClick={() => {
              onClose();
              navigate(`${urlParameters(getColorValues(displayedColors))}`)
              savePaletteToHistory(getColorValues(displayedColors));
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md dropdown"
          >
            Open
          </button>
        ) : (
          <div></div>
        )}
      </div>

      {imageUploading ? (
        <div className="flex h-40 justify-center items-center">
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
        <div>
          {!image ? (
            <div className="mb-4 w-[32rem] h-40 p-4 border-2 border-dashed border-ashGray flex justify-center items-center rounded-lg">
              <label className="cursor-pointer text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="bg-blue-500 text-white text-lg hover:bg-blue-700 px-5 py-2 rounded-md hover:bg-champagnePink">
                  Browse file
                </div>
              </label>
            </div>
          ) : (
            <div>
              <img
                src={image}
                alt="Uploaded"
                className="mb-8 w-full max-h-96 object-contain"
              />
              {displayedColors.length > 0 && (
                <div className="flex w-full justify-center space-x-3">
                  {displayedColors.map((colorObj, index) => {
                    const luminance = chroma(colorObj.color).luminance();
                    return (
                      <div key={index}>
                        <div
                          className="w-20 h-20 rounded"
                          style={{ backgroundColor: colorObj.color }}
                        >
                          <div
                            className={`flex p-1 justify-between w-full ${
                              luminance > 0.5 ? "text-black" : "text-white"
                            }`}
                          >
                            <button onClick={() => deleteColor(colorObj.color)}>
                              <MdDelete />
                            </button>

                            {/* Lock/Unlock Button */}
                            <button
                              onClick={() => {
                                if (colorObj.locked)
                                  unlockColor(colorObj.color);
                                else lockColor(colorObj.color);
                              }}
                            >
                              {colorObj.locked ? <MdLock /> : <MdLockOpen />}
                            </button>
                          </div>
                        </div>
                        <p className="text-base font-medium pt-3 uppercase">
                          {colorObj.color}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex justify-between items-center pt-10">
                <button
                  onClick={changePalette}
                  className="bg-blue-500 hover:bg-blue-700 transition duration-200 rounded-md text-white text-lg px-4 py-2"
                >
                  Change Palette
                </button>
                <div className="flex gap-8">
                  <button
                    disabled={displayedColors.length === 10}
                    onClick={() => addColor(data)}
                  >
                    <MdAddCircle
                      className={`text-4xl ${
                        displayedColors.length === 10
                          ? "text-gray cursor-not-allowed"
                          : "text-black hover:text-blue-500"
                      }`}
                    />
                  </button>
                  <button
                    disabled={displayedColors.length === 2}
                    onClick={() => removeColor()}
                  >
                    <MdRemoveCircle
                      className={`text-4xl ${
                        displayedColors.length === 2
                          ? "text-gray cursor-not-allowed"
                          : "text-black hover:text-blue-500"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default ImagePickerModal;

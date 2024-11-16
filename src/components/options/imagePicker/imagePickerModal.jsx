import React, { useState } from 'react';
// @ts-ignore
import { ColorExtractor } from 'react-color-extractor';
import { ColorRing } from 'react-loader-spinner'; // Example library for showing a loader
// import ColorPalette from './ColorPalette';
import Modal from 'react-modal';
import { MdClose, MdAddCircle, MdRemoveCircle } from "react-icons/md";
import { useColors } from '../../../contextAPI/colorsContext';

const ImagePickerModal = ({ isOpen, onClose }) => {
    // States
  const [image, setImage] = useState(null);
  const [pickedColors, setPickedColors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(0);

  // Context 
  const { setColors } = useColors();

  // functions

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractColors = (newColors) => {
    const numColorsToExtract = pickedColors.length > 0 ? pickedColors.length : 5; // Extract based on current palette size or 5 initially
    const extractedColors = newColors.slice(0, numColorsToExtract);
    setPickedColors(extractedColors);
  };

  // Function to add a color to the existing palette
  const addColor = (colorsArray) => {
    console.log("add")
    if (pickedColors.length < 10) {
      const newColor = colorsArray[pickedColors.length];
      setPickedColors((prevColors) => [...prevColors, newColor]);
    }
  };

  // Function to remove a color from the palette, ensuring there are at least 2 pickedColors left
  const removeColor = (colorToRemove) => {
    if (pickedColors.length > 2) {
      setPickedColors((prevColors) =>
        prevColors.filter((color) => color !== colorToRemove)
      );
    }
  };

  const changePalette = () => {
    setKey((prevKey) => prevKey + 1); // Increment key to force re-mount
  };
  // Function to handle the "Change Palette" button
//   const changePalette = () => {
//     // Force a re-render or refresh of the color extraction
//     setImage((prevImage) => {
//       // This ensures the `ColorExtractor` runs again, using the existing image and extracting pickedColors
//       return prevImage ? `${prevImage}?${new Date().getTime()}` : prevImage;
//     });
//   };


  return (
    <Modal
      appElement={document.getElementById("root")}
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white p-4 z-50 rounded-lg max-w-3xl mx-auto mt-32 my-10 outline-none shadow-lg"
      overlayClassName={{
        base: "fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto ", // Custom styles for the overlay
        afterOpen: "opacity-100",
        beforeClose: "opacity-0",
      }}
    >
      <div className="flex justify-between items-center my-4 pb-4">
        <button onClick={onClose}>
          <MdClose className="text-3xl text-black hover:text-blue-500" />
        </button>

        {image ? (
          <h1 className="text-2xl text-center font-bold">Image Picker</h1>
        ) : (
          <h1 className="text-2xl text-center font-bold">Upload an Image</h1>
        )}
        {image ? (
          <button
            onClick={() => {
              onClose();
              setColors(pickedColors); // Replace `newColors` with the appropriate value you want to set.
            }}
            className="bg-blue-500 hover:bg-blue-800 text-white px-4 py-2 rounded dropdown"
          >
            Next
          </button>
        ) : (
          <div></div>
        )}
      </div>

      {loading ? (
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
            <div className="mb-4 w-full h-40 p-4 border-2 border-dashed border-ashGray flex justify-center items-center rounded-lg">
              <label className="cursor-pointer text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="bg-blue-500 text-white text-lg hover:bg-blue-800 px-5 py-2 rounded hover:bg-champagnePink">
                  Browse file
                </div>
              </label>
            </div>
          ) : (
            <div>
              <ColorExtractor key={key} src={image} getColors={extractColors} />
              <img
                src={image}
                alt="Uploaded"
                className="mb-8 w-full max-h-96 object-contain"
              />
              {pickedColors.length > 0 && (
                <div className="flex w-full justify-center space-x-3">
                  {pickedColors.map((color, index) => (
                    <div key={index}>
                      <div
                        className="w-20 h-20 rounded"
                        style={{ backgroundColor: color }}
                      ></div>
                      <p className="text-base font-medium pt-3 uppercase">
                        {color}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center pt-10">
                <button
                  onClick={changePalette}
                  className="bg-blue-500 text-white text-lg px-4 py-2 rounded"
                >
                  Change Palette
                </button>
                <div className="flex gap-8">
                  <button
                    disabled={pickedColors.length === 10}
                    onClick={() => addColor(pickedColors)}
                  >
                    <MdAddCircle
                      className={`text-4xl ${
                        pickedColors.length === 10
                          ? "text-gray cursor-not-allowed"
                          : "text-black hover:text-blue-500"
                      }`}
                    />
                  </button>
                  <button
                    disabled={pickedColors.length === 2}
                    onClick={() => removeColor(pickedColors)}
                  >
                    <MdRemoveCircle
                      className={`text-4xl ${
                        pickedColors.length === 2
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

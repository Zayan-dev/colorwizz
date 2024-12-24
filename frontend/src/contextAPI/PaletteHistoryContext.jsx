import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { urlParameters } from "../components/utils/reusablefunctions";

// Create a context
const PaletteContext = createContext();

// Create a provider component
export const PaletteProvider = ({ children }) => {
  const navigate = useNavigate();
  const [paletteHistory, setPaletteHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const savePaletteToHistory = (newPalette) => {
    const sortedNewPalette = [...newPalette].sort();
    const exists = paletteHistory.some(
      (arr) =>
        arr.length === sortedNewPalette.length &&
        [...arr].sort().every((str, index) => str === sortedNewPalette[index])
    );

    if (!exists) {
      setPaletteHistory((prevHistory) => {
        const updatedHistory = [
          ...prevHistory,
          newPalette,
        ];
        setCurrentIndex(updatedHistory.length - 1); // Update currentIndex to the latest palette
        return updatedHistory;
      });
    }
  };

  const undo = () => {
    if (currentIndex > 0) {
      const paletteUrl = urlParameters(paletteHistory[currentIndex - 1]);
      navigate(`/${paletteUrl}`, { replace: true });
      setCurrentIndex(currentIndex - 1);
    }
  };

  const redo = () => {
    if (currentIndex < paletteHistory.length - 1) {
      const paletteUrl = urlParameters(paletteHistory[currentIndex + 1]);
      navigate(`/${paletteUrl}`, { replace: true });
      setCurrentIndex(currentIndex + 1); 
    }
  };

  return (
    <PaletteContext.Provider
      value={{
        paletteHistory,
        savePaletteToHistory,
        undo,
        redo,
        currentIndex,
      }}
    >
      {children}
    </PaletteContext.Provider>
  );
};

// Custom hook to use the PaletteContext
export const usePalette = () => {
  return useContext(PaletteContext);
};

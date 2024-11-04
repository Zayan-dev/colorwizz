import React, { createContext, useContext, useState } from "react";

// Create a context
const PaletteContext = createContext();

// Create a provider component
export const PaletteProvider = ({ children }) => {
  const [paletteHistory, setPaletteHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const savePaletteToHistory = (newPalette) => {
    setPaletteHistory((prevHistory) => {
      const updatedHistory = [...prevHistory, newPalette];
      setCurrentIndex(updatedHistory.length - 1);
      return updatedHistory;
    });
  };

  const undo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const redo = () => {
    if (currentIndex < paletteHistory.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const currentPalette = paletteHistory[currentIndex] || [];

  return (
    <PaletteContext.Provider
      value={{
        paletteHistory,
        currentPalette,
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

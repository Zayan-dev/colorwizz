import React, { createContext, useContext, useState } from "react";

// Create a context
const ColorsContext = createContext();

// Create a provider component
export const ColorsProvider = ({ children }) => {
  const [colors, setColors] = useState([]);

  return (
    <ColorsContext.Provider
      value={{
        colors,
        setColors,
      }}
    >
      {children}
    </ColorsContext.Provider>
  );
};

// Custom hook to use the PaletteContext
export const useColors = () => {
  return useContext(ColorsContext);
};

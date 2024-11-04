import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
// import Navbar from "./components/navbar/index.jsx";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Home from "./components/palette generation/PaletteGen.jsx"; // Example home page
import "./App.css";
import Navbar from "./components/navbar/navbar.jsx";
import Header from "./components/navbar/header.jsx";

const App = () => {
  const [mode, setMode] = useState("monochromatic");
  const [paletteHistory, setPaletteHistory] = useState([]); // Stores the history of palettes
  const [currentIndex, setCurrentIndex] = useState(0); // Tracks the current palette in history

  // Function to add a new palette to history
  const savePaletteToHistory = (newPalette) => {
    const updatedHistory = [
      ...paletteHistory,
      newPalette,
    ];
    setPaletteHistory(updatedHistory);
    setCurrentIndex(updatedHistory.length - 1);
    
    // console.log("History Index:", paletteHistory);
  };

  console.log("Updated History:", paletteHistory); // Log the updated history
  console.log("Current Index:", currentIndex);
  const undo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
    console.log("undo called")
  };

  const redo = () => {
    if (currentIndex < paletteHistory.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    console.log("undo called");
  };

  const location = useLocation();

  // Only show navbar if the route is not '/signup'
  // const showHeader = location.pathname !== "/signup";
  const showNavbar = location.pathname !== "/signup" && location.pathname !== "/signin";
  return (
    <div>
      <Header />
      {showNavbar && (
        <Navbar
          mode={mode}
          setMode={setMode}
          undo={undo}
          redo={redo}
          canUndo={currentIndex > 0}
          canRedo={currentIndex < paletteHistory.length - 1}
        />
      )}
      <Routes>
        <Route
          path="/"
          element={
            <Home
              mode={mode}
              savePaletteToHistory={savePaletteToHistory}
              currentPalette={paletteHistory[currentIndex]}
            />
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
      </Routes>
    </div>
  );
};

// Wrapping App component with Router
const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;

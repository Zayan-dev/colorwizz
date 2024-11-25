import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import SavedPalette from "./components/savepalette/index.jsx"
import Home from "./components/palette generation/PaletteGen.jsx"; // Example home page
import "./App.css";
import Navbar from "./components/navbar/navbar.jsx";
import Header from "./components/navbar/header.jsx";
import PaletteVisualizer from "./pages/visualizePalette/index.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PaletteProvider } from "./contextAPI/PaletteHistoryContext.jsx";

const App = () => {
  const [mode, setMode] = useState("monochromatic");
  const location = useLocation();

  const [headerKey, setHeaderKey] = useState(0);

  const showNavbar =
    location.pathname === "/" ||
    (location.pathname.startsWith("/") &&
      !["/signup", "/signin", "/savedpalette"].includes(location.pathname) &&
      !location.pathname.startsWith("/visualizePalette"));
  return (
    <PaletteProvider>
      <div>
        <ToastContainer />

        <Header key={headerKey} setHeaderKey={setHeaderKey} />
        {showNavbar && <Navbar mode={mode} setMode={setMode} />}
        <Routes>
          <Route path="/" element={<Home mode={mode} />} />
          <Route path="/:palette" element={<Home mode={mode} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/savedpalette" element={<SavedPalette />} />
          <Route
            path="/visualizePalette/:palette"
            element={<PaletteVisualizer />}
          />
        </Routes>
      </div>
    </PaletteProvider>
  );
};

// Wrapping App component with Router
const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;

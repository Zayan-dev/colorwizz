import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import SavedPalette from "./components/savepalette/index.jsx"
import Home from "./components/palette generation/PaletteGen.jsx"; // Example home page
import "./App.css";
import Navbar from "./components/navbar/navbar.jsx";
import Header from "./components/navbar/header.jsx";
import PaletteVisualizer from "./pages/visualizePalette/index.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PaletteProvider } from "./contextAPI/PaletteHistoryContext.jsx";
import axios from "axios";
import Cookies from "js-cookie";

const App = () => {
  const [mode, setMode] = useState("monochromatic");
  const location = useLocation();

  const [headerKey, setHeaderKey] = useState(0);
  const [plan, setPlan] = useState("free");

  const showNavbar =
    location.pathname === "/" ||
    (location.pathname.startsWith("/") &&
      !["/savedpalette"].includes(location.pathname) &&
      !location.pathname.startsWith("/visualizePalette"));


  const checkUserSubscriptionPlan = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get("http://localhost:5000/api/checkPlan", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });
      setPlan(response.data);
      console.log(plan);
    } catch (error) {
      console.log(error)
    }


  }
  useEffect(() => {
    checkUserSubscriptionPlan();
  }, [])
  // console.log(plan);
  return (
    <PaletteProvider>
      <div>
        <ToastContainer />

        <Header setHeaderKey={setHeaderKey} />
        {showNavbar && <Navbar mode={mode} setMode={setMode} />}
        <Routes>
          <Route path="/" element={<Home mode={mode} />} />
          <Route path="/:palette" element={<Home mode={mode} />} />
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

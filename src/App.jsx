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
import { PaletteProvider } from "./contextAPI/PaletteHistoryContext.jsx";
import { ToastContainer } from "react-toastify";

const App = () => {
  const [mode, setMode] = useState("monochromatic");
  const location = useLocation();

  // Only show navbar if the route is not '/signup'
  // const showHeader = location.pathname !== "/signup";
  const showNavbar = location.pathname !== "/signup" && location.pathname !== "/signin";
  return (
    <PaletteProvider>
      <div>
        <ToastContainer />

        <Header />
        {showNavbar && (
          <Navbar
            mode={mode}
            setMode={setMode}
          />
        )}
        <Routes>
          <Route
            path="/"
            element={
              <Home
                mode={mode}
              />
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
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

import React, { useState } from "react";
import "./App.css";
import PaletteGen from "./components/palette generation/PaletteGen";
import Navbar from "./components/navbar/navbar";

function App() {
  const [mode, setMode] = useState("monochromatic");

  return (
    <>
      <Navbar mode={mode} setMode={setMode} />
      <PaletteGen mode={mode} />
    </>
  );
}

export default App;

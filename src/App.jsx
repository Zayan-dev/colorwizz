import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/navbar/index.jsx';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Home from './components/palette generation/PaletteGen.jsx'; // Example home page

const App = () => {
  const location = useLocation();

  // Only show navbar if the route is not '/signup'
  const showNavbar = location.pathname !== '/signup' ;

  return (
    <div>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
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

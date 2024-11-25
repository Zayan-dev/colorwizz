import React from "react";
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";
import { isLoggedIn } from "../utils/loginOnlyfeature";

const Header = ({key, setHeaderKey}) => {
  const handleLogout=()=>{
    if (isLoggedIn()) {
      Cookies.remove("token", { path: "/" });
      toast.success("Logout Successful");
      setHeaderKey((prevKey) => prevKey + 1);
    }
  }
  return (
    <header className="w-full fixed z-40 bg-white">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 flex justify-between items-center h-[4.5rem]">
        {/* Logo */}
        <Link to="/">
          <div className="text-2xl font-semibold text-blue-500 hover:text-blue-700 transition duration-200">
            ColorWizz
          </div>
        </Link>

        {/* Buttons */}
        <div className="space-x-4">
          {!isLoggedIn() ? (
            <>
              <Link
                to="/signin"
                className="px-4 py-2 bg-transparent border border-blue-500 text-blue-500 rounded-md hover:bg-blue-700 hover:text-white transition duration-200"
              >
                Sign In
              </Link>
              <Link
                to="signup"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-200"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <></>
          )}
          {isLoggedIn() ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-200"
            >
              Logout
            </button>
          ) : (
            <></>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;

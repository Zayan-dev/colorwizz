import React, {useState} from "react";
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';
import { toast } from "react-toastify";
import { isLoggedIn } from "../utils/loginOnlyfeature";
import Signin from "../Signin";
import Signup from "../Signup";
import { useSubscriptionPlanContext } from "../../contextAPI/SubscriptionPlan";

const Header = ({setHeaderKey}) => {

  const { setPlan } = useSubscriptionPlanContext();
  // Login and signup modal states
  const [isSigninModalOpen, setSigninModalOpen] = useState(false);
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);

  const updateHeader = () => setHeaderKey((prevKey) => prevKey + 1)
  const handleLogout = () => {
    if (isLoggedIn()) {
      Cookies.remove("token", { path: "/" });
      setPlan("free")
      toast.success("Logout Successful");
      updateHeader();
    }
  };
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
              <button
                className="px-4 py-2 bg-transparent border border-blue-500 text-blue-500 rounded-md hover:bg-blue-700 hover:text-white transition duration-200"
                onClick={() => setSigninModalOpen(true)}
                disabled={isSigninModalOpen}
              >
                Sign In
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-200"
                onClick={() => setSignupModalOpen(true)}
                disabled={isSignupModalOpen}
              >
                Sign Up
              </button>
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
        {/* Login and signup Modal */}
        {isSigninModalOpen && (
          <Signin
            isOpen={isSigninModalOpen}
            onClose={() => setSigninModalOpen(false)}
            updateHeader={updateHeader}
          />
        )}
        {isSignupModalOpen && (
          <Signup
            isOpen={isSignupModalOpen}
            onClose={() => setSignupModalOpen(false)}
            updateHeader={updateHeader}
            openSignIn={() => setSigninModalOpen(true)}
          />
        )}
      </nav>
    </header>
  );
};

export default Header;

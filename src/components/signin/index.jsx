import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useState } from 'react';
import Modal from "react-modal";
import { toast } from 'react-toastify';
import { MdClose } from 'react-icons/md';

const Signin = ({ isOpen, onClose, updateHeader }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implement login logic here
    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        formData
      );
      if (response.status === 200) {
        // Cookies.set('token',response.data.token,{ expires: isRememberMe ? 7 : 1 , secure: true, sameSite: 'strict', path: '/' });
        toast.success("Login successful");
        Cookies.set("token", response.data.token);
        updateHeader();
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("Invalid Credentials");
        console.error("Response data:", error.response.data);
      } else {
        toast.error("Form submission is failed");
        // console.error("Response data:", error.response.data);
      }
    } finally {
      setFormData({
        email: "",
        password: "",
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-white w-full p-8 z-50 rounded-lg max-w-md mx-auto outline-none shadow-lg"
      overlayClassName={{
        base: "fixed inset-0 bg-black bg-opacity-30 z-50 overflow-y-auto flex justify-center items-center", // Custom styles for the overlay
        afterOpen: "opacity-100",
        beforeClose: "opacity-0",
      }}
    >
      <div className="relative pb-4">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 text-3xl text-black hover:text-blue-500"
        >
          <MdClose />
        </button>
        <h2 className="text-4xl font-bold text-gray-700 text-center mb-6">
          Sign In
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <label className="block text-gray-600">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-gray-600">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Remember Me */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="remember"
            checked={formData.remember}
            onChange={handleChange}
            className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
          />
          <label className="ml-2 text-gray-600">Remember me</label>
        </div>

        {/* Submit Button */}
        <div className="mt-4">
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Login
          </button>
        </div>

        {/* Forgot Password */}
        <p className="text-center text-gray-500 mt-4">
          <a href="#" className="text-blue-500 hover:underline">
            Forgot your password?
          </a>
        </p>
      </form>
    </Modal>
  );
};

export default Signin;

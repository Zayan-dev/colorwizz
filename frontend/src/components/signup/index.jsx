import React, { useState } from 'react';
import axios from 'axios';
import Modal from "react-modal";
import { toast } from "react-toastify";
import { MdClose } from "react-icons/md";

const Signup = ({ isOpen, onClose, updateHeader, openSignIn }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/register",
        formData
      );

      if (response.status === 201) {
        toast.success("Sign up Successfully");
        updateHeader();
        onClose()
        openSignIn()
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("Email Already Exists, Sign Up again");
        console.error("Response data:", error.response.data);
      } else {
        toast.error("Form submission is failed");
        console.error("Response data:", error.response.data);
      }
    } finally {
      setFormData({
        username: "",
        email: "",
        password: "",
        phone: "",
        gender: "",
      });
    }
    // Implement form submission logic
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
      <div className="relative py-4">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 text-3xl text-black hover:text-blue-500"
        >
          <MdClose />
        </button>
        <h2 className="text-4xl font-bold text-gray-700 text-center mb-6">
          Create an Account
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div>
          <label className="block text-gray-600">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

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

        {/* Phone */}
        <div>
          <label className="block text-gray-600">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-gray-600">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="mt-6 pt-6">
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Sign Up
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default Signup;

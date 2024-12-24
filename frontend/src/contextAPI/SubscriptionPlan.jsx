import React, { createContext, useContext, useState } from "react";
import axios from "axios";

// Create a context
const SubscriptionPlanContext = createContext();

// Create a provider component
export const SubscriptionPlanProvider = ({ children }) => {
  const [plan, setPlan] = useState("free");
  const checkUserSubscriptionPlan = async (token) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_HOSTURL}/checkPlan`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setPlan(response.data.plan);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log("The user plan not found");
      } else {
        console.log("Server Error");
      }
    }
  };

  return (
    <SubscriptionPlanContext.Provider
      value={{
        plan,
        setPlan,
        checkUserSubscriptionPlan,
      }}
    >
      {children}
    </SubscriptionPlanContext.Provider>
  );
};

// Custom hook to use the PaletteContext
export const useSubscriptionPlanContext = () => {
  return useContext(SubscriptionPlanContext);
};

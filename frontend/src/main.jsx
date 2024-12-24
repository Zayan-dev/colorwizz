import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Modal from "react-modal";
import { SubscriptionPlanProvider } from './contextAPI/SubscriptionPlan.jsx';

Modal.setAppElement("#root"); 

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SubscriptionPlanProvider>
      <App />
    </SubscriptionPlanProvider>
  </StrictMode>
);

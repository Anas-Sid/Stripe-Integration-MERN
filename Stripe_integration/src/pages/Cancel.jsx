import React from "react";
import { useNavigate } from "react-router-dom"; 
export default function Cancel() {
  const navigate = useNavigate(); 
  const handleBackToHome = () => {
    navigate("/"); 
  };
  return (
    <div className="flex items-center justify-center h-screen bg-red-900 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold">❌ Payment Cancelled</h1>
        <p className="mt-4">Your payment was not completed. Please try again.</p>
        <button
          onClick={handleBackToHome}
          className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

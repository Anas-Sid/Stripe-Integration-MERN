import React from "react";
export default function Success() {
  return (
    <div className="flex items-center justify-center h-screen bg-green-900 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold">🎉 Payment Successful!</h1>
        <p className="mt-4">Thank you for your purchase. Your order is confirmed.</p>
      </div>
    </div>
  );
}

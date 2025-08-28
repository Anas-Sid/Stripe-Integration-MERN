import React, { useState } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';

function App() {
  const [cart, setCart] = useState([]);
  const [cartVisible, setCartVisible] = useState(false);
  const [subscriptionModalVisible, setSubscriptionModalVisible] = useState(false); 
  const stripe = useStripe();
  const elements = useElements();

  const products = [
    { id: 1, name: 'Product 1', price: 25, image: 'https://i.pinimg.com/1200x/a6/42/4e/a6424e9550e01b5571b4dae2c76e855d.jpg' },
    { id: 2, name: 'Product 2', price: 40, image: 'https://i.pinimg.com/1200x/e4/b7/5b/e4b75b8e929a9f9ca16943e7f7597e5a.jpg' },
    { id: 3, name: 'Product 3', price: 50, image: 'https://i.pinimg.com/1200x/1b/25/fe/1b25fe26b62a75e9abb4b1c53e18e154.jpg' },
    { id: 4, name: 'Product 1', price: 25, image: 'https://i.pinimg.com/1200x/a6/42/4e/a6424e9550e01b5571b4dae2c76e855d.jpg' },
    { id: 5, name: 'Product 2', price: 40, image: 'https://i.pinimg.com/1200x/e4/b7/5b/e4b75b8e929a9f9ca16943e7f7597e5a.jpg' },
    { id: 6, name: 'Product 3', price: 50, image: 'https://i.pinimg.com/1200x/1b/25/fe/1b25fe26b62a75e9abb4b1c53e18e154.jpg' },
    { id: 7, name: 'Product 1', price: 25, image: 'https://i.pinimg.com/1200x/a6/42/4e/a6424e9550e01b5571b4dae2c76e855d.jpg' },
    { id: 8, name: 'Product 2', price: 40, image: 'https://i.pinimg.com/1200x/e4/b7/5b/e4b75b8e929a9f9ca16943e7f7597e5a.jpg' },
    { id: 9, name: 'Product 3', price: 50, image: 'https://i.pinimg.com/1200x/1b/25/fe/1b25fe26b62a75e9abb4b1c53e18e154.jpg' }
  ];

  const addToCart = (product) => {
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const toggleCart = () => {
    setCartVisible(!cartVisible);
  };

  const handleCheckout = async () => {
    const response = await fetch('http://localhost:4242/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items: cart }),
    });
    const session = await response.json();
    const { error } = await stripe.redirectToCheckout({ sessionId: session.id });
    if (error) {
      console.error(error);
    }
  };

  const handleSubscriptionCheckout = async (plan) => {
    const response = await fetch('http://localhost:4242/create-subscription-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ plan: plan }), 
    });
    const session = await response.json();
    const { error } = await stripe.redirectToCheckout({ sessionId: session.sessionId });
    if (error) {
      console.error(error);
    }
    setSubscriptionModalVisible(false); 
  };

  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <h1 className="text-xl ml-[300px]">React Shopping Cart</h1>
        <button onClick={toggleCart} className="relative">
          <span className="text-xl">🛒</span>
          {cart.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {products.map(product => (
          <div key={product.id} className="bg-white shadow-md rounded-lg p-4 text-center">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md" />
            <h2 className="text-xl mt-4">{product.name}</h2>
            <p className="text-lg text-gray-600">${product.price}</p>
            <button 
              onClick={() => addToCart(product)} 
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

     
      <button 
        onClick={() => setSubscriptionModalVisible(true)} 
        className="mt-6 bg-green-800 text-white py-2 px-4 rounded-lg ml-[198px] hover:bg-green-900"
      >
        Subscribe to a Plan
      </button>

     
      {subscriptionModalVisible && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl font-bold mb-4">Choose Your Subscription Plan</h2>
            <button 
              onClick={() => handleSubscriptionCheckout('basic')} 
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg mb-4 hover:bg-blue-600"
            >
              Basic Plan - $5/month
            </button>
            <button 
              onClick={() => handleSubscriptionCheckout('premium')} 
              className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600"
            >
              Premium Plan - $15/month
            </button>
            <button 
              onClick={() => setSubscriptionModalVisible(false)} 
              className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {cartVisible && (
        <div className="fixed top-0 right-0 bg-white shadow-lg w-1/3 h-full p-4">
          <h2 className="text-2xl mb-4">Shopping Cart</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty!</p>
          ) : (
            <ul>
              {cart.map(item => (
                <li key={item.id} className="flex justify-between items-center mb-4">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${item.price * item.quantity}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 font-bold text-xl">
            Total: ${totalAmount}
          </div>
          <button 
            onClick={toggleCart} 
            className="mt-6 bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900"
          >
            Close
          </button>
          <button 
            onClick={handleCheckout}
            className="mt-6 bg-red-800 text-white py-2 px-4 rounded-lg ml-[198px] hover:bg-red-900"
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

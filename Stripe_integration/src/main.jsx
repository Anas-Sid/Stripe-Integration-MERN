import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router here
const stripePromise = loadStripe('pk_test_51S0i0cDkpi1Al2fcI0S4D3rlQLXeyhk1FH21NbbWbjiX4iPIHpUW9KsdtuymibDw0FC6EM0WRxwGnhGeakR1p0ws00zDgaL3ml' , {
  locale: 'en-US',  
});
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Elements stripe={stripePromise}>
      <Router> 
        <App />
      </Router>
    </Elements>
  </StrictMode>,
);

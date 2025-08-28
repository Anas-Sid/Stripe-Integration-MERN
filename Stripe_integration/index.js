import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import cors from 'cors';  
dotenv.config();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27', 
});
const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: req.body.items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });  
    res.json({ id: session.id });
  } catch (err) {
    console.log('Error creating session:', err);
    res.status(500).send('Internal Server Error');
  }
});
app.post('/create-payment-session', async (req, res) => {
  console.log(req.body);
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: req.body.items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,  
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      // appearance: {
      //   theme: 'dark',  // Apply a dark theme
      //   layout: {
      //     type: 'tabs',  // Set the layout to tabs
      //     defaultCollapsed: false,  // Set default tab state
      //   },
      //   button: {
      //     color: 'black',  // Customize button color
      //     text_color: 'white',  // Customize button text color
      //     border_radius: '8px',  // Rounded button corners
      //   },
      //   header: {
      //     logo: `${process.env.FRONTEND_URL}/path-to-your-logo.png`,  // Optional: add logo
      //   },
      //   colors: {
      //     primary: '#ff6347',  // Primary color for buttons
      //     background: '#333',  // Dark background
      //     text: '#fff',  // White text
      //     link: '#ff6347',  // Link color
      //   }
      // }
    });
    res.json({ id: session.id });
  } catch (err) {
    console.error('Error creating session:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/create-subscription-session', async (req, res) => {
  try {
    const { plan } = req.body;

    // Determine the price ID based on the selected plan
    const priceId = plan === 'basic' ? 'price_1S16lADkpi1Al2fcUaXkUFe9' : 'price_1S16lbDkpi1Al2fcYc1dyfQw';

    // Create the Stripe Checkout session for subscription
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, // Use the correct price ID (Basic or Premium)
          quantity: 1,
        },
      ],
      mode: 'subscription', // Set the mode to 'subscription' for recurring billing
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    // Respond with the session ID to the frontend
    res.json({ sessionId: session.id });
  } catch (err) {
    console.error('Error creating subscription session:', err);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const app = express();
const port = 3001; 

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.post("/payments", async (req, res) => {
  const { amount, currency, paymentMethodId, description } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method: paymentMethodId,
      description,
      confirm: true,
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ error: "Payment failed" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
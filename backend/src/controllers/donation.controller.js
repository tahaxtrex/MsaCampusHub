import stripe from "../lib/stripe.js";

export const createDonationIntent = async (req, res) => {
  const { amount, name, email } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "eur",
      metadata: {
        name,
        email,
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    alert(error)
    console.error("Error: " + error)
    res.status(500).json({ error: "Stripe PaymentIntent creation failed" });
  }
};

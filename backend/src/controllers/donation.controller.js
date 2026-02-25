// Stripe has been removed — payments are handled via PayPal and Revolut redirects on the frontend.
// This file is kept as a placeholder.

export const createDonationIntent = async (req, res) => {
  return res.status(410).json({ message: "Stripe integration is no longer used. Use PayPal or Revolut." });
};

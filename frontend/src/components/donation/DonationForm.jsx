import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function DonationForm() {
  const available_amounts = [10, 20, 50, 100];
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !name || !email) {
      alert("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post("http://localhost:8001/api/donate_handle", {
        amount: parseFloat(amount) * 100,
        name,
        email,
      });

      const clientSecret = response.data.clientSecret;
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name, email },
        },
      });

      if (result.error) {
        alert("Payment failed: " + result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        alert("✅ Donation successful!");
        setAmount("");
        setName("");
        setEmail("");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block font-semibold text-gray-700 mb-2">Select Amount</label>
        <div className="flex flex-wrap justify-center gap-3 mb-3">
          {available_amounts.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setAmount(val)}
              className={`px-4 py-2 rounded-lg border transition font-semibold ${
                parseFloat(amount) == val
                  ? "bg-green-600 text-white border-green-700"
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
            >
              €{val}
            </button>
          ))}
        </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 text-lg font-semibold">€</span>
            <input
              type="number"
              placeholder="Enter custom amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
      </div>

      <div>
        <label className="block font-semibold text-gray-700 mb-1">Your Name</label>
        <div className="relative">
          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 mr-2" />
          <input
            type="text"
            placeholder="Ali Mohammed"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
      </div>

      <div>
        <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
        <div className="relative">
          <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 mr-2" />
          <input
            type="email"
            placeholder="ali@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
      </div>

      <div>
        <label className="block font-semibold text-gray-700 mb-1">Card Details</label>
        <div className="p-3 border border-gray-300 rounded-lg">
          <CardElement />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting || !stripe}
        className={`w-full py-3 font-bold rounded-lg text-white transition ${
          submitting || !stripe
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-700 hover:bg-green-800"
        }`}
      >
        {submitting ? "Processing..." : "Donate Now"}
      </button>
    </form>
  );
}


//just refactored some of the design using chat gpt and my intuition let me know if you wanna come back to anything

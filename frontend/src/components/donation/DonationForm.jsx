import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "axios";

export default function DonationForm() {
  let available_amounts = [10, 20, 50, 100];
  let [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !name || !email) {
      console.error("Missing fields");
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(
        "http://localhost:8001/api/donate_handle",
        {
          amount: parseFloat(amount) * 100,
          name: name,
          email: email,
        }
      );
      const clientSecret = response.data.clientSecret; //secret token from BE

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name,
            email,
          },
        },
      });
      if (result.error) {
        console.error(result.error.message);
        alert("Payment failed: " + result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        alert("✅ Donation successful!");
        // Reset form
        setAmount("");
        setName("");
        setEmail("");
      }
    } catch (err) {
      console.error("Error" + err);
      alert(err);
    }
    setSubmitting(false);
  };
  return (
    <form className="rounded-xl" onSubmit={handleSubmit}>
      <div>
        {/*for the amount selection */}
        <label>Select the amount</label>
        <div>
          {available_amounts.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setAmount(val)}
              className="px-4 py-2 rounded-lg border"
            >
              €{val}
            </button>
          ))}
        </div>

        <input
          type="number"
          placeholder="Custom amount"
          value={amount}
          onChange={(m) => setAmount(m.target.value)}
        />
      </div>

      <div>
        <label>In the name of</label>
        <input
          type="text"
          placeholder="Ali Mohammed"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label> The email</label>
        <input
          type="text"
          placeholder="ali@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label className="block font-semibold mb-2">Card Details</label>
        <div className="border rounded-md p-3">
          <CardElement />
        </div>
      </div>

      {/*Submit*/}

      <button
        type="submit"
        className="bg-green-700 text-white font-bold py-3 rounded-l"
        disabled={submitting || !stripe}
      >
        {submitting ? "Loading..." : "Donate Now!"}
      </button>
    </form>
  );
}

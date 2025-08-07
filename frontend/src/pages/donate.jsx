import DonationFrom from "../components/donation/DonationForm";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../lib/stripe";

function DonatePage() {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-center text-green-900 mb-4"> Financial Transactions to the MSA.</h1>
      <h2 className="text-center text-gray-600 text-lg max-w-2xl mx-auto mb-10">Or support with us with a donation!</h2>

      <Elements stripe={stripePromise}>
        <DonationFrom />
      </Elements>
    </div>
  );
}

export default DonatePage;

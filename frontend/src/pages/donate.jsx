import DonationFrom from "../components/donation/DonationForm";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../lib/stripe";

function DonatePage() {
  return (
    <div>
      <h1>Financial Transactions to the MSA.</h1>
      <h2>Or support with us with a donation!</h2>

      <Elements stripe={stripePromise}>
        <DonationFrom />
      </Elements>
    </div>
  );
}

export default DonatePage;

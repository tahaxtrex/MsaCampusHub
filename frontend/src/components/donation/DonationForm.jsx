import { useState } from "react";
import { FaPaypal, FaCopy, FaUniversity } from "react-icons/fa";
import { SiRevolut } from "react-icons/si";

export default function DonationForm() {
  const available_amounts = [10, 20, 50, 100];
  const [selectedAmount, setSelectedAmount] = useState(20);
  const [customAmount, setCustomAmount] = useState("");
  const [copied, setCopied] = useState(false);

  // You'll need to replace these with your actual PayPal and Revolut URLs
  const PAYPAL_URL = "https://www.paypal.com/paypalme/xtrexteam";
  const REVOLUT_URL = "https://revolut.me/tahahbirri";
  const IBAN = "DE41 1001 0178 7053 5173 02";
  const PAYEE = "Taha Hbirri";

  const handlePaymentRedirect = (platform) => {
    const amount = customAmount || selectedAmount;
    
    if (!amount || amount <= 0) {
      alert("Please select or enter a valid donation amount.");
      return;
    }

    // Open payment link in new tab
    if (platform === "paypal") {
      // PayPal.me format: paypalme/username/amount - pre-fills the amount
      window.open(`${PAYPAL_URL}/${amount}`, "_blank");
    } else if (platform === "revolut") {
      // Revolut - redirect to base URL without amount
      window.open(REVOLUT_URL, "_blank");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Amount Selection */}
      <div>
        <label className="block font-semibold text-gray-700 mb-3 text-lg">
          Select Donation Amount
        </label>
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          {available_amounts.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => {
                setSelectedAmount(val);
                setCustomAmount("");
              }}
              className={`px-6 py-3 rounded-lg border-2 transition-all duration-200 font-bold text-lg shadow-sm hover:shadow-md ${
                selectedAmount === val && !customAmount
                  ? "bg-green-600 text-white border-green-700 scale-105"
                  : "bg-white text-gray-700 border-gray-300 hover:border-green-400"
              }`}
            >
              €{val}
            </button>
          ))}
        </div>
        
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl font-bold">
            €
          </span>
          <input
            type="number"
            placeholder="Or enter custom amount"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setSelectedAmount(null);
            }}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-lg"
          />
        </div>
      </div>

      {/* Payment Method Buttons */}
      <div className="space-y-4 pt-4">
        <p className="text-center text-gray-600 font-medium mb-4">
          Choose your payment method:
        </p>

        {/* PayPal Button */}
        <button
          type="button"
          onClick={() => handlePaymentRedirect("paypal")}
          className="w-full py-4 px-6 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 flex items-center justify-center gap-3"
        >
          <FaPaypal className="text-2xl" />
          <span>Donate with PayPal</span>
        </button>

        {/* Revolut Button */}
        <button
          type="button"
          onClick={() => handlePaymentRedirect("revolut")}
          className="w-full py-4 px-6 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-600 flex items-center justify-center gap-3"
        >
          <SiRevolut className="text-2xl" />
          <span>Donate with Revolut</span>
        </button>
      </div>

      {/* Bank Transfer Section */}
      <div className="mt-6 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <FaUniversity className="text-blue-600 text-xl" />
          <h3 className="font-bold text-gray-800 text-lg">Or via Bank Transfer</h3>
        </div>
        
        <div className="space-y-3 bg-white p-4 rounded-lg border border-blue-100">
          {/* Payee */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Payee
            </p>
            <p className="text-gray-800 font-semibold text-lg">
              {PAYEE}
            </p>
          </div>

          {/* IBAN */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              IBAN
            </p>
            <div className="flex items-center gap-2">
              <p className="text-gray-800 font-mono font-semibold text-base flex-1">
                {IBAN}
              </p>
              <button
                onClick={() => copyToClipboard(IBAN)}
                className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
                title="Copy IBAN"
              >
                <FaCopy className={copied ? "text-green-600" : ""} />
              </button>
            </div>
            {copied && (
              <p className="text-green-600 text-sm mt-1 font-medium">✓ Copied to clipboard!</p>
            )}
          </div>
        </div>
      </div>

      {/* Info Text */}
      <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md">
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-green-800">💚 Thank you for your support!</span>
          <br />
          You'll be redirected to complete your donation securely. Your contribution helps us continue our mission.
        </p>
      </div>
    </div>
  );
}


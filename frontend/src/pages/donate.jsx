import DonationForm from "../components/donation/DonationForm";

function DonatePage() {
  return (
    <div className="text-center px-4 py-12 bg-gray-50 min-h-screen">
      <h1 className="text-5xl font-extrabold text-green-800 mb-4">Support the MSA Mission</h1>
      <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-8">
        Help us continue organizing events and community initiatives by making a contribution below.
      </p>

      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl p-6 border border-green-100">
        <DonationForm />
      </div>

      <p className="text-sm text-gray-500 mt-6">
        🔒 Your payment is secure and processed through trusted payment providers.
      </p>
    </div>
  );
}

export default DonatePage;
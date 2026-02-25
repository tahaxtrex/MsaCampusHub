import IftarTicketForm from "../components/iftar/IftarTicketForm";
import { Link } from "react-router-dom";

function IftarTicketPage() {
    const EVENT_DATE = "Saturday, March 7, 2026";

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-gray-50 px-4 py-12">
            {/* Hero Header */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full mb-4 text-sm font-semibold uppercase tracking-wider">
                    🎟️ Tickets Available Now
                </div>
                <h1 className="text-5xl font-extrabold text-green-800 mb-3">
                    MSA Iftar Dinner 🌙
                </h1>
                <p className="text-xl text-gray-600 font-medium mb-1">{EVENT_DATE}</p>
                <p className="text-gray-500 max-w-xl mx-auto">
                    Join us for a blessed evening of community, food, and remembrance. Secure your
                    spot before it sells out!
                </p>
            </div>

            {/* Ticket Card */}
            <div className="max-w-2xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden border border-amber-100">
                {/* Card top strip */}
                <div className="bg-gradient-to-r from-green-700 to-green-600 px-6 py-4 flex items-center justify-between">
                    <div className="text-white">
                        <p className="text-xs font-semibold uppercase tracking-widest opacity-75">MSA Campus Hub</p>
                        <p className="text-lg font-bold">Iftar Dinner · March 7, 2026</p>
                    </div>
                    <div className="text-5xl opacity-80">🌙</div>
                </div>

                {/* Dashed separator like a real ticket */}
                <div className="relative flex items-center px-2 py-0">
                    <div className="w-6 h-6 rounded-full bg-amber-50 border border-amber-100 -ml-3 flex-shrink-0"></div>
                    <div className="flex-1 border-t-2 border-dashed border-gray-200 mx-2"></div>
                    <div className="w-6 h-6 rounded-full bg-amber-50 border border-amber-100 -mr-3 flex-shrink-0"></div>
                </div>

                {/* Form Section */}
                <div className="p-6">
                    <IftarTicketForm />
                </div>
            </div>

            {/* Footer note */}
            <p className="text-center text-sm text-gray-400 mt-8">
                🔒 Your registration is saved securely. Payment is processed via trusted 3rd-party providers.
                <br />
                Questions? <Link to="/contact" className="text-green-600 hover:underline">Contact us</Link>.
            </p>
        </div>
    );
}

export default IftarTicketPage;

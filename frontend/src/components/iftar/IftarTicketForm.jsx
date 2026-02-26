import { useState, useEffect } from "react";
import { FaPaypal, FaCopy, FaUniversity, FaCheck, FaTicketAlt } from "react-icons/fa";
import { SiRevolut } from "react-icons/si";
import { useAuthStore } from "../../store/useAuthStore";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

const TICKET_PRICE = 5;
const MAX_CAPACITY = 100;

const PAYPAL_URL = "https://www.paypal.com/paypalme/xtrexteam";
const REVOLUT_URL = "https://revolut.me/tahahbirri";
const IBAN = "DE41 1001 0178 7053 5173 02";
const PAYEE = "Taha Hbirri";

export default function IftarTicketForm() {
    const { authUser } = useAuthStore();

    const [form, setForm] = useState({
        full_name: "",
        email: "",
        phone: "",
    });
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [capacity, setCapacity] = useState({ sold: 0, remaining: MAX_CAPACITY, sold_out: false });
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [loadingCapacity, setLoadingCapacity] = useState(true);

    // Pre-fill from auth user
    useEffect(() => {
        if (authUser) {
            setForm((prev) => ({
                ...prev,
                email: authUser.email || "",
                phone: authUser.phone_number || "",
                full_name: authUser.username ? authUser.username.replace(/_/g, " ") : "",
            }));
        }
    }, [authUser]);

    // Fetch capacity on mount
    useEffect(() => {
        const fetchCapacity = async () => {
            try {
                const res = await axiosInstance.get("/api/iftar-tickets/capacity");
                setCapacity(res.data);
            } catch {
                // silently fail — best effort
            } finally {
                setLoadingCapacity(false);
            }
        };
        fetchCapacity();
    }, []);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handlePayment = async (method) => {
        if (!form.full_name.trim()) {
            toast.error("Please enter your full name.");
            return;
        }
        if (!form.email.trim()) {
            toast.error("Please enter your email address.");
            return;
        }
        if (capacity.sold_out) {
            toast.error("Sorry, this event is sold out!");
            return;
        }

        setIsLoading(true);
        setSelectedMethod(method);

        try {
            await axiosInstance.post("/api/iftar-tickets", {
                full_name: form.full_name.trim(),
                email: form.email.trim().toLowerCase(),
                phone: form.phone.trim() || undefined,
                payment_method: method,
            });

            // Registration succeeded — open payment provider
            if (method === "paypal") {
                window.open(`${PAYPAL_URL}/${TICKET_PRICE}`, "_blank");
            } else if (method === "revolut") {
                window.open(REVOLUT_URL, "_blank");
            }
            // For bank: user copies IBAN manually

            setSubmitted(true);
            setCapacity((prev) => ({
                ...prev,
                sold: prev.sold + 1,
                remaining: Math.max(0, prev.remaining - 1),
                sold_out: prev.sold + 1 >= MAX_CAPACITY,
            }));
        } catch (err) {
            const msg =
                err?.response?.data?.error || "Registration failed. Please try again.";
            toast.error(msg);
        } finally {
            setIsLoading(false);
            setSelectedMethod(null);
        }
    };

    const handleBankRegister = async () => {
        if (!form.full_name.trim()) {
            toast.error("Please enter your full name.");
            return;
        }
        if (!form.email.trim()) {
            toast.error("Please enter your email address.");
            return;
        }
        if (capacity.sold_out) {
            toast.error("Sorry, this event is sold out!");
            return;
        }

        setIsLoading(true);
        setSelectedMethod("bank");

        try {
            await axiosInstance.post("/api/iftar-tickets", {
                full_name: form.full_name.trim(),
                email: form.email.trim().toLowerCase(),
                phone: form.phone.trim() || undefined,
                payment_method: "bank",
            });

            setSubmitted(true);
            setCapacity((prev) => ({
                ...prev,
                sold: prev.sold + 1,
                remaining: Math.max(0, prev.remaining - 1),
                sold_out: prev.sold + 1 >= MAX_CAPACITY,
            }));
        } catch (err) {
            const msg =
                err?.response?.data?.error || "Registration failed. Please try again.";
            toast.error(msg);
        } finally {
            setIsLoading(false);
            setSelectedMethod(null);
        }
    };

    // ——— Success State ———
    if (submitted) {
        return (
            <div className="text-center space-y-6 py-4">
                <div className="flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mx-auto">
                    <FaCheck className="text-green-600 text-4xl" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-green-800 mb-2">You're registered! 🌙</h3>
                    <p className="text-gray-600 text-base">
                        Complete your <strong>€{TICKET_PRICE}</strong> payment using the tab that opened.
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                        You will get an email after your request has been approved. See you at Iftar!
                    </p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left">
                    <p className="text-sm text-amber-800 font-medium">📋 Reference for your payment</p>
                    <p className="text-sm text-amber-700 mt-1">
                        Use <strong>{form.email}</strong> as the payment reference so we can match it to
                        your registration.
                    </p>
                </div>
                <div className="bg-green-50 border-l-4 border-green-500 rounded-md p-4 text-left">
                    <p className="text-sm text-gray-700">
                        <span className="font-semibold text-green-800">🎟️ {capacity.remaining} tickets remaining</span>
                        <br />
                        Don't forget to complete your payment to secure your spot!
                    </p>
                </div>
            </div>
        );
    }

    // ——— Main Form ———
    return (
        <div className="space-y-6">

            {/* Capacity Bar */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                        <FaTicketAlt />
                        {loadingCapacity ? "Loading availability..." : (
                            capacity.sold_out
                                ? "❌ Sold Out — No more tickets available"
                                : `${capacity.sold} / ${MAX_CAPACITY} tickets sold`
                        )}
                    </span>
                    {!loadingCapacity && !capacity.sold_out && (
                        <span className="text-sm font-bold text-amber-700">
                            {capacity.remaining} left
                        </span>
                    )}
                </div>
                {!loadingCapacity && (
                    <div className="w-full bg-amber-200 rounded-full h-2.5">
                        <div
                            className={`h-2.5 rounded-full transition-all duration-700 ${capacity.sold_out
                                ? "bg-red-500"
                                : capacity.remaining <= 20
                                    ? "bg-orange-500"
                                    : "bg-green-500"
                                }`}
                            style={{ width: `${Math.min((capacity.sold / MAX_CAPACITY) * 100, 100)}%` }}
                        />
                    </div>
                )}
            </div>

            {/* Price Badge */}
            <div className="flex items-center justify-center">
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 font-bold text-xl px-6 py-2 rounded-full border-2 border-green-300">
                    🌙 €{TICKET_PRICE} per person
                </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Your full name"
                        value={form.full_name}
                        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-800 transition"
                        disabled={isLoading || capacity.sold_out}
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                        {authUser && (
                            <span className="ml-2 text-xs text-green-600 font-normal">✓ from your account</span>
                        )}
                    </label>
                    <input
                        type="email"
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-800 transition disabled:opacity-70 disabled:bg-gray-100"
                        disabled={isLoading || capacity.sold_out || !!authUser?.email}
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Phone Number{" "}
                        <span className="text-gray-400 font-normal text-xs">(optional)</span>
                        {authUser?.phone_number && (
                            <span className="ml-2 text-xs text-green-600 font-normal">✓ from your account</span>
                        )}
                    </label>
                    <input
                        type="tel"
                        placeholder="+49 123 456 789"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-gray-800 transition disabled:opacity-70 disabled:bg-gray-100"
                        disabled={isLoading || capacity.sold_out || !!authUser?.phone_number}
                    />
                </div>
            </div>

            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">
                        {capacity.sold_out ? "Sold Out" : "Choose payment method to register & pay"}
                    </span>
                </div>
            </div>

            {!capacity.sold_out ? (
                <div className="space-y-3">
                    {/* PayPal */}
                    <button
                        type="button"
                        onClick={() => handlePayment("paypal")}
                        disabled={isLoading || capacity.sold_out}
                        className="w-full py-4 px-6 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        <FaPaypal className="text-2xl" />
                        <span>
                            {isLoading && selectedMethod === "paypal"
                                ? "Registering..."
                                : `Pay €${TICKET_PRICE} with PayPal`}
                        </span>
                    </button>

                    {/* Revolut */}
                    <button
                        type="button"
                        onClick={() => handlePayment("revolut")}
                        disabled={isLoading || capacity.sold_out}
                        className="w-full py-4 px-6 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-600 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        <SiRevolut className="text-2xl" />
                        <span>
                            {isLoading && selectedMethod === "revolut"
                                ? "Registering..."
                                : `Pay €${TICKET_PRICE} with Revolut`}
                        </span>
                    </button>

                    {/* Bank Transfer */}
                    <div className="mt-4 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl shadow-md">
                        <div className="flex items-center gap-2 mb-3">
                            <FaUniversity className="text-blue-600 text-xl" />
                            <h3 className="font-bold text-gray-800 text-lg">Or via Bank Transfer</h3>
                        </div>

                        <div className="space-y-3 bg-white p-4 rounded-lg border border-blue-100 mb-4">
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Payee</p>
                                <p className="text-gray-800 font-semibold text-lg">{PAYEE}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Amount</p>
                                <p className="text-gray-800 font-bold text-lg text-green-700">€{TICKET_PRICE}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">IBAN</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-gray-800 font-mono font-semibold text-base flex-1">{IBAN}</p>
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
                            <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Reference</p>
                                <p className="text-gray-600 text-sm italic">Use your email address as reference</p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleBankRegister}
                            disabled={isLoading || capacity.sold_out}
                            className="w-full py-3 px-5 rounded-xl font-bold text-base text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <FaTicketAlt />
                            {isLoading && selectedMethod === "bank"
                                ? "Registering..."
                                : "Register & I'll transfer the money"}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-8">
                    <p className="text-2xl mb-2">😢</p>
                    <p className="text-lg font-bold text-red-600">All 100 tickets are sold out!</p>
                    <p className="text-gray-500 text-sm mt-1">Follow us on social media for future events.</p>
                </div>
            )}

            {/* Info banner */}
            {!capacity.sold_out && (
                <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-md">
                    <p className="text-sm text-gray-700">
                        <span className="font-semibold text-green-800">ℹ️ How it works</span>
                        <br />
                        Clicking a payment button will register your spot <strong>and</strong> open your payment
                        provider. Your ticket is confirmed once an admin verifies your payment.
                    </p>
                </div>
            )}
        </div>
    );
}

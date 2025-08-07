import { useState } from "react";
import { Mail, MapPin, Send } from "lucide-react";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: connect to EmailJS or Formspree here
    console.log("Contact form submitted:", formData);
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 bg-gray-50 min-h-screen">
      <div className="max-w-4xl w-full bg-white shadow-md rounded-xl p-8 space-y-8">
        <h1 className="text-3xl font-bold text-center text-green-700">Contact Us</h1>
        <p className="text-center text-gray-600">
          Got a question? Want to volunteer? Reach out to your campus MSA!
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Contact Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="text-green-600" />
              <span>msa@constructor.university</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="text-green-600" />
              <span>Bremen, Germany</span>
            </div>
            {/* Add social links or phone if needed */}
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700">Full Name</label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                placeholder="Your name"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Email Address</label>
              <input
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="you@example.com"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700">Your Message</label>
              <textarea
                required
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                placeholder="How can we help?"
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
            >
              Send Message <Send className="inline ml-2" size={16} />
            </button>
          </form>
        </div>

        {submitted && (
          <p className="text-center text-green-600 font-medium mt-4">
            ✅ Thank you! We'll get back to you shortly.
          </p>
        )}
      </div>
    </div>
  );
}

export default ContactPage;

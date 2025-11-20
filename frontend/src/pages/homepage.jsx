import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import logo from '../assets/msapng.png';

function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Optimized gallery - reduced to 6 images only
  const galleryImages = [
    "https://raw.githubusercontent.com/tahaxtrex/Msa-images/26bc34b7f569f18d480d91a9f5bf54ff876e2743/amphi.JPG",
    "https://raw.githubusercontent.com/tahaxtrex/Msa-images/26bc34b7f569f18d480d91a9f5bf54ff876e2743/bbq.JPG",
    "https://raw.githubusercontent.com/tahaxtrex/Msa-images/26bc34b7f569f18d480d91a9f5bf54ff876e2743/women%20amphi.JPG",
    "https://raw.githubusercontent.com/tahaxtrex/Msa-images/26bc34b7f569f18d480d91a9f5bf54ff876e2743/men%20certificate.JPG",
    "https://raw.githubusercontent.com/tahaxtrex/Msa-images/26bc34b7f569f18d480d91a9f5bf54ff876e2743/bbq2.JPG",
    "https://raw.githubusercontent.com/tahaxtrex/Msa-images/26bc34b7f569f18d480d91a9f5bf54ff876e2743/finaliftarMSAdenoiseed-78.JPG",
  ];

  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Faith & Community",
      description: "Join a vibrant community of Muslim students supporting each other's spiritual growth"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Events & Activities",
      description: "Participate in weekly prayers, social events, educational workshops, and more"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Growth & Learning",
      description: "Expand your knowledge through Islamic studies, mentorship, and personal development"
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-transparent to-blue-50/30 pointer-events-none"></div>

        <div className={`max-w-7xl mx-auto text-center relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img
              src={logo}
              alt="MSA Logo"
              className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain drop-shadow-lg hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            The Muslim Student
            <span className="block bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
              Association
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-600 mb-8 italic font-light">
            Your new family away from home
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              to="/calendar"
              className="group px-8 py-4 bg-green-600 text-white rounded-full font-semibold text-lg hover:bg-green-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 w-full sm:w-auto justify-center"
            >
              Join Us
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/about"
              className="px-8 py-4 bg-white text-green-600 border-2 border-green-600 rounded-full font-semibold text-lg hover:bg-green-50 transition-all duration-300 w-full sm:w-auto justify-center flex items-center"
            >
              Learn More
            </Link>
          </div>

          {/* Scroll Indicator */}
          <div className="animate-bounce mt-8">
            <div className="w-6 h-10 rounded-full border-2 border-green-600 flex items-start justify-center p-2 mx-auto">
              <div className="w-1.5 h-3 bg-green-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full mb-4 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              What We Offer
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Build Your Faith Together
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join our community and discover opportunities for spiritual growth, learning, and friendship
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:border-green-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Recent Events
            </h2>
            <p className="text-lg text-gray-600">
              Moments from our community gatherings
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="group relative aspect-square overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <img
                  src={image}
                  alt={`MSA Event ${index + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Ready to Join Our Community?
          </h2>
          <p className="text-lg sm:text-xl mb-8 text-green-50">
            Don't miss out on our upcoming events and activities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/calendar"
              className="px-8 py-4 bg-white text-green-600 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              View Calendar
            </Link>
            <Link
              to="/volunteer"
              className="px-8 py-4 bg-green-800 text-white border-2 border-white/30 rounded-full font-semibold text-lg hover:bg-green-900 transition-all duration-300"
            >
              Get Involved
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Spacer */}
      <div className="h-20"></div>
    </main>
  );
}

export default Home;

import { useState, useEffect } from 'react';
import { Heart, Calendar, BookOpen, Users, Target, Sparkles, Code, Github, Linkedin } from 'lucide-react';

function AboutUs() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // What MSA Does
  const activities = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Spiritual Growth",
      description: "Daily prayers, Quran study circles, and Islamic lectures to strengthen our faith together",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Building",
      description: "Social events, iftars, and gatherings that create lasting bonds among Muslim students",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Education & Learning",
      description: "Workshops, seminars, and discussions on Islamic knowledge and contemporary issues",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Outreach & Service",
      description: "Charity drives, volunteer work, and interfaith initiatives to serve our community",
      color: "from-green-500 to-emerald-500"
    }
  ];

  // Events showcase
  const events = [
    {
      title: "Weekly Jummah Prayer",
      description: "Every Friday, our community gathers for congregational prayer",
      frequency: "Weekly"
    },
    {
      title: "Iftar & Ramadan Events",
      description: "Break fast together during the blessed month",
      frequency: "Seasonal"
    },
    {
      title: "Educational Workshops",
      description: "Learn about Islamic history, jurisprudence, and contemporary topics",
      frequency: "Monthly"
    },
    {
      title: "Social Gatherings",
      description: "BBQs, game nights, and outdoor activities to build friendships",
      frequency: "Regular"
    },
    {
      title: "Charity Drives",
      description: "Food drives, fundraisers, and community service projects",
      frequency: "Ongoing"
    },
    {
      title: "Interfaith Dialogue",
      description: "Building bridges with other campus communities",
      frequency: "Quarterly"
    }
  ];

  // Development team
  const team = [
    {
      name: "Ahmed Maghri",
      role: "Full Stack Developer",
      handle: "@iramxx",
      image: "https://raw.githubusercontent.com/tahaxtrex/Msa-images/main/DSC_5978.jpg",
      github: "https://github.com/tahaxtrex",
      linkedin: null,
      gradient: "from-blue-600 to-blue-500"
    },
    {
      name: "Taha Hbirri",
      role: "Full Stack Developer",
      handle: "@tahaxtrex",
      image: "https://raw.githubusercontent.com/tahaxtrex/Msa-images/main/edited-2237.jpg",
      github: "https://github.com/tahaxtrex",
      linkedin: "https://linkedin.com/in/tahahbirri",
      gradient: "from-green-600 to-green-500"
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-blue-50">
        <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full mb-6 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            About Us
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Muslim Student Association
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            We are a vibrant community of Muslim students dedicated to fostering faith, building friendships, and serving our campus and beyond.
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            To provide a welcoming space where Muslim students can practice their faith, grow spiritually,
            build meaningful connections, and make a positive impact on campus. We strive to create an
            inclusive community that supports academic excellence while nurturing Islamic values.
          </p>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What We Do
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our activities are designed to enrich student life through faith, learning, and community engagement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activities.map((activity, index) => (
              <div
                key={index}
                className={`group p-8 bg-white rounded-2xl border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${activity.color} text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {activity.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{activity.title}</h3>
                <p className="text-gray-600 leading-relaxed">{activity.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Events
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join us for a variety of activities throughout the year
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <div
                key={index}
                className="group p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:border-green-500 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <Calendar className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <span className="text-xs font-semibold px-3 py-1 bg-green-100 text-green-700 rounded-full">
                    {event.frequency}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                <p className="text-sm text-gray-600">{event.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="/calendar"
              className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-full font-semibold text-lg hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Calendar className="w-5 h-5" />
              View Full Calendar
            </a>
          </div>
        </div>
      </section>

      {/* Development Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-4 text-sm font-medium">
              <Code className="w-4 h-4" />
              Built with ❤️
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Meet the Development Team
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              This platform was built by dedicated students to serve our MSA community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div
                key={index}
                className={`group relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${member.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>

                <div className="relative z-10">
                  {/* Profile Image */}
                  <div className="mb-6 flex justify-center">
                    <div className="relative">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-32 h-32 rounded-full object-cover border-4 border-white/20 group-hover:border-white/40 transition-all duration-300"
                      />
                      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${member.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                    <p className="text-gray-400 mb-2">{member.role}</p>
                    <p className="text-sm text-gray-500 mb-4">{member.handle}</p>

                    {/* Social Links */}
                    <div className="flex gap-3 justify-center">
                      {member.github && (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-300"
                          title="GitHub"
                        >
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-300"
                          title="LinkedIn"
                        >
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Technology Stack */}
          <div className="mt-16 text-center">
            <p className="text-gray-400 mb-4">Built with modern technologies</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {['React', 'Node.js', 'Supabase', 'Tailwind CSS', 'Cloudinary'].map((tech, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-white/10 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors duration-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Join Our Community Today
          </h2>
          <p className="text-lg sm:text-xl mb-8 text-green-50">
            Be part of something bigger - connect with fellow Muslim students
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="px-8 py-4 bg-white text-green-600 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Get Started
            </a>
            <a
              href="/calendar"
              className="px-8 py-4 bg-green-800 text-white border-2 border-white/30 rounded-full font-semibold text-lg hover:bg-green-900 transition-all duration-300"
            >
              View Events
            </a>
          </div>
        </div>
      </section>

      {/* Footer Spacer */}
      <div className="h-20 bg-white"></div>
    </main>
  );
}

export default AboutUs;

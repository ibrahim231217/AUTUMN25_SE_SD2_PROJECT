import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Landing = () => {
  const categories = [
    { name: "Dermatologist", icon: "🔬" },
    { name: "Pathologist", icon: "🧪" },
    { name: "Neurologist", icon: "🧠" },
    { name: "Cardiologist", icon: "❤️" },
    { name: "Endocrinologist", icon: "💊" },
  ];

  return (
    <div className="bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 via-white to-accent-50 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg-soft text-3xl">
              ⚕️
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary-600 mb-4">
              MediCare Hospital System
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Professional healthcare management platform for seamless appointment booking and patient care
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                to="/register"
                className="btn-action text-lg px-8 py-4 shadow-medium hover:shadow-lg-soft"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="btn-outline text-lg px-8 py-4"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="section-header text-center">
            Our Specialties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <div
                key={category.name}
                className="card text-center hover:shadow-lg-soft hover:border-secondary-200 group cursor-pointer"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-primary-600 text-base group-hover:text-secondary-600 transition-colors">
                  {category.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-accent-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-header mb-8">
                Why Choose MediCare?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4 group">
                  <div className="text-3xl text-secondary-600 group-hover:scale-125 transition-transform flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-600 group-hover:text-secondary-600 transition-colors">
                      Expert Doctors
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Access highly qualified specialists across various medical fields
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 group">
                  <div className="text-3xl text-secondary-600 group-hover:scale-125 transition-transform flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-600 group-hover:text-secondary-600 transition-colors">
                      Easy Scheduling
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Book appointments at your convenience with real-time availability
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 group">
                  <div className="text-3xl text-secondary-600 group-hover:scale-125 transition-transform flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-600 group-hover:text-secondary-600 transition-colors">
                      Secure & Private
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Your health data is protected with industry-standard security
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 group">
                  <div className="text-3xl text-secondary-600 group-hover:scale-125 transition-transform flex-shrink-0">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-600 group-hover:text-secondary-600 transition-colors">
                      24/7 Support
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Round-the-clock customer support for all your healthcare needs
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-2xl h-96 flex items-center justify-center text-center p-8 shadow-lg-soft hover:shadow-lg-soft">
              <div className="text-white">
                <div className="text-7xl mb-4">🏥</div>
                <p className="text-2xl font-bold">Healthcare Excellence</p>
                <p className="text-secondary-100 mt-2 text-sm">Dedicated to your well-being</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to book your appointment?
          </h2>
          <p className="mb-8 text-primary-100 text-lg">
            Join thousands of patients receiving quality care
          </p>
          <Link
            to="/register"
            className="px-8 py-4 bg-white text-primary-600 rounded-xl hover:bg-neutral-light transition font-bold inline-block shadow-medium hover:shadow-lg-soft active:scale-95"
          >
            Register Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-primary-100 font-medium">&copy; 2024 MediCare Hospital System. All rights reserved.</p>
            <p className="text-primary-200 mt-2 text-sm">Dedicated to your health and well-being</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

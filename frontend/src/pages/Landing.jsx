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
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold text-slate-800 mb-4">
              MediCare Hospital System
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Professional healthcare management platform for seamless appointment booking and patient care
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                to="/register"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
            Our Specialties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <div
                key={category.name}
                className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-800 text-sm">
                  {category.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-8">
                Why Choose MediCare?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">✓</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Expert Doctors</h3>
                    <p className="text-gray-600 text-sm">
                      Access highly qualified specialists across various medical fields
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-2xl">✓</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Easy Scheduling</h3>
                    <p className="text-gray-600 text-sm">
                      Book appointments at your convenience with real-time availability
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-2xl">✓</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Secure & Private</h3>
                    <p className="text-gray-600 text-sm">
                      Your health data is protected with industry-standard security
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-2xl">✓</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">24/7 Support</h3>
                    <p className="text-gray-600 text-sm">
                      Round-the-clock customer support for all your healthcare needs
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-blue-600 rounded-lg h-96 flex items-center justify-center text-center p-8">
              <div className="text-white">
                <div className="text-6xl mb-4">🏥</div>
                <p className="text-2xl font-semibold">Healthcare Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to book your appointment?</h2>
          <p className="mb-6 text-blue-100">Join thousands of patients receiving quality care</p>
          <Link
            to="/register"
            className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-semibold inline-block"
          >
            Register Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300">&copy; 2024 MediCare Hospital System. All rights reserved.</p>
          <p className="text-gray-400 mt-2">Dedicated to your health and well-being</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

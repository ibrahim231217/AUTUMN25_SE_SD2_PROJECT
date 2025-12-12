import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMicroscope, 
  faFlask, 
  faBrain, 
  faHeartPulse, 
  faPills,
  faUserDoctor,
  faCalendarCheck,
  faShieldHalved,
  faHeadset,
  faHospital,
  faUsers,
  faStethoscope,
  faClipboardList,
  faComments,
  faArrowRight,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import Navbar from "../components/Navbar";

const Landing = () => {
  const categories = [
    { name: "Dermatologist", icon: faMicroscope, color: "from-purple-500 to-purple-600" },
    { name: "Pathologist", icon: faFlask, color: "from-pink-500 to-pink-600" },
    { name: "Neurologist", icon: faBrain, color: "from-blue-500 to-blue-600" },
    { name: "Cardiologist", icon: faHeartPulse, color: "from-red-500 to-red-600" },
    { name: "Endocrinologist", icon: faPills, color: "from-green-500 to-green-600" },
  ];

  const features = [
    {
      icon: faUserDoctor,
      title: "Expert Doctors",
      description: "Access highly qualified specialists across various medical fields",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: faCalendarCheck,
      title: "Easy Scheduling",
      description: "Book appointments at your convenience with real-time availability",
      gradient: "from-purple-500 to-violet-600"
    },
    {
      icon: faShieldHalved,
      title: "Secure & Private",
      description: "Your health data is protected with industry-standard security",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: faHeadset,
      title: "24/7 Support",
      description: "Round-the-clock customer support for all your healthcare needs",
      gradient: "from-orange-500 to-red-600"
    }
  ];

  const stats = [
    { number: "500+", label: "Patients", icon: faUsers },
    { number: "50+", label: "Doctors", icon: faStethoscope },
    { number: "1000+", label: "Appointments", icon: faClipboardList },
    { number: "24/7", label: "Support", icon: faComments }
  ];

  return (
    <div className="bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-200 rounded-full opacity-10 blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
              <FontAwesomeIcon icon={faHospital} />
              <span>Professional Healthcare Management</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                MediCare
              </span>
              <br />
              <span className="text-gray-900">Hospital System</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              Seamless appointment booking and patient care management platform connecting patients with expert healthcare professionals
            </p>
            
            <div className="flex gap-4 justify-center flex-wrap mb-8">
              <Link
                to="/register"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition font-bold shadow-lg hover:shadow-xl text-lg inline-flex items-center gap-2"
              >
                Get Started <FontAwesomeIcon icon={faArrowRight} />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-white text-blue-600 rounded-xl border-2 border-blue-600 hover:bg-blue-50 transition font-bold text-lg"
              >
                Login
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl p-4 shadow-md border-2 border-gray-100 hover:shadow-lg transition">
                  <FontAwesomeIcon icon={stat.icon} className="text-3xl text-blue-600 mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Specialties</h2>
            <p className="text-gray-600">Expert care across multiple medical disciplines</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((category) => (
              <div
                key={category.name}
                className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition group cursor-pointer border-2 border-gray-100 hover:border-blue-300"
              >
                <div className={`w-16 h-16 mx-auto mb-3 bg-gradient-to-br ${category.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-md`}>
                  <FontAwesomeIcon icon={category.icon} className="text-2xl text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Why Choose MediCare?</h2>
            <p className="text-gray-600">Everything you need for quality healthcare</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-xl bg-white border-2 border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition group"
              >
                <div className={`w-14 h-14 mb-4 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md`}>
                  <FontAwesomeIcon icon={feature.icon} className="text-2xl text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">How It Works</h2>
            <p className="text-gray-600">Simple steps to get started</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg">
                1
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Register</h3>
              <p className="text-gray-600 text-sm">Create your account as a patient or doctor</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-violet-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg">
                2
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Book Appointment</h3>
              <p className="text-gray-600 text-sm">Choose your doctor and preferred time slot</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg">
                3
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Get Care</h3>
              <p className="text-gray-600 text-sm">Receive quality healthcare from experts</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Ready to book your appointment?
          </h2>
          <p className="mb-6 text-blue-100 text-lg">
            Join thousands of patients receiving quality care
          </p>
          <Link
            to="/register"
            className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition font-bold inline-flex items-center gap-2 shadow-lg hover:shadow-xl active:scale-95"
          >
            Register Now <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faStethoscope} className="text-white" />
              </div>
              <span className="text-xl font-bold">MediCare</span>
            </div>
            <p className="text-gray-400 text-sm mb-2">© 2024 MediCare Hospital System. All rights reserved.</p>
            <p className="text-gray-500 text-xs">Dedicated to your health and well-being</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

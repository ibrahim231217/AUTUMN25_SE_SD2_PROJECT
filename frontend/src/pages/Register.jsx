import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

const Register = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    speciality: "",
    experience: 0,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "experience" ? parseInt(value) || 0 : value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (!selectedRole) {
      setError("Please select a role");
      setLoading(false);
      return;
    }

    if (selectedRole === "doctor" && !formData.speciality) {
      setError("Please select a speciality");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: selectedRole,
      };

      if (selectedRole === "doctor") {
        payload.speciality = formData.speciality;
        payload.experience = formData.experience;
      }

      const response = await api.post("/auth/register", payload);

      if (response.data.success) {
        alert(`Registration successful! Please login as ${selectedRole}.`);
        navigate("/login");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const specialities = [
    "Dermatologist",
    "Pathologist",
    "Neurologist",
    "Cardiologist",
    "Endocrinologist",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
              ⚕️
            </div>
            <h1 className="text-3xl font-bold text-slate-800">MediCare</h1>
            <p className="text-gray-600 text-sm mt-2">
              Hospital Management System
            </p>
          </div>

          {!selectedRole ? (
            // Role Selection Screen
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-800 text-center mb-6">
                Sign up as...
              </h2>

              <button
                onClick={() => {
                  setSelectedRole("patient");
                  setError("");
                }}
                className="w-full p-6 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition">
                  👨‍🦱
                </div>
                <h3 className="font-semibold text-gray-800 group-hover:text-blue-600">
                  Patient
                </h3>
                <p className="text-xs text-gray-500">Book appointments</p>
              </button>

              <button
                onClick={() => {
                  setSelectedRole("doctor");
                  setError("");
                }}
                className="w-full p-6 bg-white border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition">
                  👨‍⚕️
                </div>
                <h3 className="font-semibold text-gray-800 group-hover:text-green-600">
                  Doctor
                </h3>
                <p className="text-xs text-gray-500">Accept appointments</p>
              </button>

              <div className="my-6 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              <p className="text-center text-gray-600 text-sm mb-4">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Login here
                </Link>
              </p>

              <Link
                to="/"
                className="w-full block text-center px-4 py-2 text-gray-600 hover:text-blue-600 font-medium"
              >
                ← Back to Home
              </Link>
            </div>
          ) : (
            // Registration Form Screen
            <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-8">
              <button
                onClick={() => {
                  setSelectedRole(null);
                  setError("");
                  setFormData({ ...formData, speciality: "", experience: 0 });
                }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-6 flex items-center gap-1"
              >
                ← Back to Role Selection
              </button>

              <div className="text-center mb-6">
                <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold capitalize">
                  {selectedRole === "doctor" ? "👨‍⚕️ Doctor" : "👨‍🦱 Patient"} Registration
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Choose a username"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    minLength="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {selectedRole === "doctor" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Speciality
                      </label>
                      <select
                        name="speciality"
                        value={formData.speciality}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        required
                      >
                        <option value="">Select Speciality</option>
                        {specialities.map((spec) => (
                          <option key={spec} value={spec}>
                            {spec}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experience (Years)
                      </label>
                      <input
                        type="number"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        min="0"
                        max="70"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Choose a password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Registering..." : "Create Account"}
                </button>
              </form>

              <div className="my-6 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              <p className="text-center text-gray-600 text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Login here
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;

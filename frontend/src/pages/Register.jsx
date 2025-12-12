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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg-soft text-3xl">
              ⚕️
            </div>
            <h1 className="text-3xl font-bold text-primary-600">MediCare</h1>
            <p className="text-gray-600 text-sm mt-2 font-medium">
              Hospital Management System
            </p>
          </div>

          {!selectedRole ? (
            // Role Selection Screen
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-primary-600 text-center mb-6">
                Sign up as...
              </h2>

              <button
                onClick={() => {
                  setSelectedRole("patient");
                  setError("");
                }}
                className="w-full p-6 card text-center group hover:bg-blue-50 hover:border-secondary-400"
              >
                <div className="text-4xl mb-2 group-hover:scale-125 transition-transform">
                  👨‍🦱
                </div>
                <h3 className="font-bold text-primary-600 group-hover:text-secondary-600 transition-colors">
                  Patient
                </h3>
                <p className="text-xs text-gray-500 mt-1">Book appointments</p>
              </button>

              <button
                onClick={() => {
                  setSelectedRole("doctor");
                  setError("");
                }}
                className="w-full p-6 card text-center group hover:bg-green-50 hover:border-secondary-400"
              >
                <div className="text-4xl mb-2 group-hover:scale-125 transition-transform">
                  👨‍⚕️
                </div>
                <h3 className="font-bold text-primary-600 group-hover:text-secondary-600 transition-colors">
                  Doctor
                </h3>
                <p className="text-xs text-gray-500 mt-1">Accept appointments</p>
              </button>

              <div className="my-6 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-medium"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gradient-to-br from-primary-50 via-white to-accent-50 text-gray-500 font-medium">OR</span>
                </div>
              </div>

              <p className="text-center text-gray-600 text-sm mb-4">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-secondary-600 hover:text-secondary-700 font-bold transition-colors"
                >
                  Login here
                </Link>
              </p>

              <Link
                to="/"
                className="w-full block text-center px-4 py-2 text-primary-600 hover:text-primary-700 font-medium hover:bg-primary-50 rounded-lg transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          ) : (
            // Registration Form Screen
            <div className="card-elevated">
              <button
                onClick={() => {
                  setSelectedRole(null);
                  setError("");
                  setFormData({ ...formData, speciality: "", experience: 0 });
                }}
                className="btn-ghost text-sm mb-6 flex items-center gap-1"
              >
                ← Back to Role Selection
              </button>

              <div className="text-center mb-6">
                <div className="inline-block px-4 py-2 bg-secondary-100 text-secondary-600 rounded-full text-sm font-bold capitalize">
                  {selectedRole === "doctor" ? "👨‍⚕️ Doctor" : "👨‍🦱 Patient"} Registration
                </div>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                  <p className="text-red-700 text-sm font-semibold">⚠️ {error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-group">
                  <label className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Choose a username"
                    className="input-field"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    minLength="3"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="input-field"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {selectedRole === "doctor" && (
                  <>
                    <div className="form-group">
                      <label className="form-label">
                        Speciality
                      </label>
                      <select
                        name="speciality"
                        value={formData.speciality}
                        onChange={handleChange}
                        className="input-field"
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

                    <div className="form-group">
                      <label className="form-label">
                        Experience (Years)
                      </label>
                      <input
                        type="number"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className="input-field"
                        min="0"
                        max="70"
                      />
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Choose a password"
                    className="input-field"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    className="input-field"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-action w-full disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Registering..." : "Create Account"}
                </button>
              </form>

              <div className="my-6 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-medium"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500 font-medium">OR</span>
                </div>
              </div>

              <p className="text-center text-gray-600 text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-secondary-600 hover:text-secondary-700 font-bold transition-colors"
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

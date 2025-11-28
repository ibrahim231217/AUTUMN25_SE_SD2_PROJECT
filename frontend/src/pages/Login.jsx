import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", formData);

      if (response.data.success) {
        const { user, token } = response.data.data;

        // Verify the user role matches what they selected
        if (user.role !== selectedRole) {
          setError(`This account is registered as a ${user.role}, not a ${selectedRole}`);
          setLoading(false);
          return;
        }

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        setUser(user);

        switch (user.role) {
          case "patient":
            navigate("/patient/dashboard");
            break;
          case "doctor":
            navigate("/doctor/dashboard");
            break;
          case "admin":
            navigate("/admin/dashboard");
            break;
          default:
            navigate("/");
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

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

          {/* Role Selection or Login Form */}
          {!selectedRole ? (
            // Role Selection Screen
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-800 text-center mb-6">
                Login as...
              </h2>

              {/* Patient Button */}
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

              {/* Doctor Button */}
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
                <p className="text-xs text-gray-500">
                  Accept appointments
                </p>
              </button>

              {/* Divider */}
              <div className="my-6 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              {/* Links */}
              <p className="text-center text-gray-600 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Register here
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
            // Login Form Screen
            <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-8">
              {/* Back Button */}
              <button
                onClick={() => {
                  setSelectedRole(null);
                  setFormData({ email: "", password: "" });
                  setError("");
                }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-6 flex items-center gap-1"
              >
                ← Back to Role Selection
              </button>

              {/* Role Indicator */}
              <div className="text-center mb-6">
                <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold capitalize">
                  {selectedRole === "doctor"
                    ? "👨‍⚕️ Doctor Login"
                    : "👨‍🦱 Patient Login"}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              {/* Divider */}
              <div className="my-6 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              {/* Links */}
              <p className="text-center text-gray-600 text-sm mb-4">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Register here
                </Link>
              </p>

              <Link
                to="/"
                className="w-full block text-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Back to Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

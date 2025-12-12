import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState("roleSelection"); // roleSelection -> credentials -> done
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
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

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setStep("credentials");
    setError("");
    setFormData({ email: "", username: "", password: "" });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let loginPayload = { password: formData.password };

      // Admin uses username, Patient/Doctor use email
      if (selectedRole === "admin") {
        if (!formData.username || !formData.password) {
          setError("Please enter username and password");
          setLoading(false);
          return;
        }
        loginPayload = { username: formData.username, password: formData.password };
      } else {
        if (!formData.email || !formData.password) {
          setError("Please enter email and password");
          setLoading(false);
          return;
        }
        loginPayload = { email: formData.email, password: formData.password };
      }

      const response = await api.post("/auth/login", loginPayload);

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

          {step === "roleSelection" ? (
            // Step 1: Role Selection
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-primary-600 text-center mb-6">
                Select your role to login
              </h2>

              <button
                onClick={() => handleRoleSelect("patient")}
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
                onClick={() => handleRoleSelect("doctor")}
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

              <button
                onClick={() => handleRoleSelect("admin")}
                className="w-full p-6 card text-center group hover:bg-purple-50 hover:border-secondary-400"
              >
                <div className="text-4xl mb-2 group-hover:scale-125 transition-transform">
                  👨‍💼
                </div>
                <h3 className="font-bold text-primary-600 group-hover:text-secondary-600 transition-colors">
                  Admin
                </h3>
                <p className="text-xs text-gray-500 mt-1">Manage system</p>
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
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-secondary-600 hover:text-secondary-700 font-bold transition-colors"
                >
                  Sign up here
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
            // Step 2: Credentials Entry
            <div className="card-elevated">
              <button
                onClick={() => setStep("roleSelection")}
                className="btn-ghost text-sm mb-6 flex items-center gap-1"
              >
                ← Back to Role Selection
              </button>

              <h2 className="text-2xl font-bold text-primary-600 mb-2">
                {selectedRole === "admin" ? "Admin Login" : selectedRole === "doctor" ? "Doctor Login" : "Patient Login"}
              </h2>
              <p className="text-gray-600 text-sm mb-6 font-medium">
                {selectedRole === "admin" 
                  ? "Enter your admin credentials" 
                  : `Enter your ${selectedRole} email and password`}
              </p>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                  <p className="text-red-700 text-sm font-semibold">⚠️ {error}</p>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {selectedRole === "admin" ? (
                  // Admin: Username instead of email
                  <div className="form-group">
                    <label className="form-label">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      placeholder="Enter admin username"
                      className="input-field"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                ) : (
                  // Patient/Doctor: Email
                  <div className="form-group">
                    <label className="form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder={`Enter your ${selectedRole} email`}
                      className="input-field"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    className="input-field"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-action w-full disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              {selectedRole !== "admin" && (
                <>
                  <div className="my-6 relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-neutral-medium"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500 font-medium">OR</span>
                    </div>
                  </div>

                  <p className="text-center text-gray-600 text-sm">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="text-secondary-600 hover:text-secondary-700 font-bold transition-colors"
                    >
                      Sign up here
                    </Link>
                  </p>
                </>
              )}

              <Link
                to="/"
                className="w-full block text-center px-4 py-2 text-primary-600 hover:text-primary-700 font-medium hover:bg-primary-50 rounded-lg transition-colors mt-4"
              >
                ← Back to Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStethoscope,
  faUser,
  faUserDoctor,
  faUserTie,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-3 overflow-hidden">
      <div className="w-full max-w-md">
        {/* Enhanced Header */}
        <div className="text-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-2 shadow-xl animate-pulse">
            <FontAwesomeIcon icon={faStethoscope} className="text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-blue-950 mb-1" style={{ fontFamily: 'Merriweather, serif' }}>
            MediCare
          </h1>
          <p className="text-gray-600 text-xs" style={{ fontFamily: 'Kanit, sans-serif' }}>Welcome Back to Healthcare</p>
        </div>

        {step === "roleSelection" ? (
          // Enhanced Role Selection
          <div className="space-y-3">
            <div className="text-center mb-3">
              <h2 className="text-lg font-bold text-blue-950 mb-1" style={{ fontFamily: 'Merriweather, serif' }}>
                Login to Your Account
              </h2>
              <p className="text-gray-600 text-xs" style={{ fontFamily: 'Kanit, sans-serif' }}>Select your role to continue</p>
            </div>

            {/* Patient Card */}
            <button
              onClick={() => handleRoleSelect("patient")}
              className="w-full group relative overflow-hidden rounded-xl bg-white border-2 border-gray-200 hover:border-blue-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              
              <div className="relative p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FontAwesomeIcon icon={faUser} className="text-xl text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-base text-gray-900 group-hover:text-blue-600 transition-colors">
                    Patient
                  </h3>
                  <p className="text-xs text-gray-600">Book appointments</p>
                </div>
                <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                  →
                </div>
              </div>
            </button>

            {/* Doctor Card */}
            <button
              onClick={() => handleRoleSelect("doctor")}
              className="w-full group relative overflow-hidden rounded-xl bg-white border-2 border-gray-200 hover:border-green-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              
              <div className="relative p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FontAwesomeIcon icon={faUserDoctor} className="text-xl text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-base text-gray-900 group-hover:text-green-600 transition-colors">
                    Doctor
                  </h3>
                  <p className="text-xs text-gray-600">Accept appointments</p>
                </div>
                <div className="text-green-600 opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                  →
                </div>
              </div>
            </button>

            {/* Admin Card */}
            <button
              onClick={() => handleRoleSelect("admin")}
              className="w-full group relative overflow-hidden rounded-xl bg-white border-2 border-gray-200 hover:border-purple-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-violet-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              
              <div className="relative p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FontAwesomeIcon icon={faUserTie} className="text-xl text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-base text-gray-900 group-hover:text-purple-600 transition-colors">
                    Admin
                  </h3>
                  <p className="text-xs text-gray-600">Manage system</p>
                </div>
                <div className="text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                  →
                </div>
              </div>
            </button>

            <div className="my-3 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-medium"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-gradient-to-br from-primary-50 via-white to-accent-50 text-gray-500">OR</span>
              </div>
            </div>

            <p className="text-center text-gray-600 text-xs">
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
              className="w-full block text-center px-3 py-2 text-primary-600 hover:text-primary-700 text-sm hover:bg-primary-50 rounded-lg transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        ) : (
          // Step 2: Credentials Entry
          <div className="card-elevated p-5">
            <button
              onClick={() => setStep("roleSelection")}
              className="btn-ghost text-xs mb-4 flex items-center gap-1"
            >
              ← Back
            </button>

            <h2 className="text-xl font-bold text-primary-600 mb-1">
              {selectedRole === "admin" ? "Admin Login" : selectedRole === "doctor" ? "Doctor Login" : "Patient Login"}
            </h2>
            <p className="text-gray-600 text-xs mb-4">
              {selectedRole === "admin" 
                ? "Enter your admin credentials" 
                : `Enter your ${selectedRole} email and password`}
            </p>

            {error && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-xs flex items-center gap-2">
                  <FontAwesomeIcon icon={faTriangleExclamation} />
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-3">
              {selectedRole === "admin" ? (
                <div className="form-group">
                  <label className="form-label text-xs">Username</label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter admin username"
                    className="input-field text-sm py-2"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label text-xs">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder={`Enter your ${selectedRole} email`}
                    className="input-field text-sm py-2"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label text-xs">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="input-field text-sm py-2"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-action w-full disabled:opacity-60 disabled:cursor-not-allowed text-sm py-2"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {selectedRole !== "admin" && (
              <>
                <div className="my-3 relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-medium"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white text-gray-500">OR</span>
                  </div>
                </div>

                <p className="text-center text-gray-600 text-xs">
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
              className="w-full block text-center px-3 py-2 text-primary-600 hover:text-primary-700 text-sm hover:bg-primary-50 rounded-lg transition-colors mt-3"
            >
              ← Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;

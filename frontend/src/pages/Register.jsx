import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStethoscope,
  faUser,
  faUserDoctor
} from '@fortawesome/free-solid-svg-icons';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-3 overflow-hidden">
      <div className="w-full max-w-md">
        {/* Enhanced Header */}
        <div className="text-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-2 shadow-xl animate-pulse">
            <FontAwesomeIcon icon={faStethoscope} className="text-2xl" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
            MediCare
          </h1>
          <p className="text-gray-600 text-xs">Join Our Healthcare Community</p>
        </div>

        {!selectedRole ? (
          // Enhanced Role Selection Screen
          <div className="space-y-3">
            <div className="text-center mb-3">
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                Create Your Account
              </h2>
              <p className="text-gray-600 text-xs">Choose your role to get started</p>
            </div>

            {/* Patient Card */}
            <button
              onClick={() => {
                setSelectedRole("patient");
                setError("");
              }}
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
                  <p className="text-xs text-gray-600">Book appointments with doctors</p>
                </div>
                <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                  →
                </div>
              </div>
            </button>

            {/* Doctor Card */}
            <button
              onClick={() => {
                setSelectedRole("doctor");
                setError("");
              }}
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
                  <p className="text-xs text-gray-600">Manage patient appointments</p>
                </div>
                <div className="text-green-600 opacity-0 group-hover:opacity-100 transition-opacity text-sm">
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
              className="w-full block text-center px-3 py-2 text-primary-600 hover:text-primary-700 text-sm hover:bg-primary-50 rounded-lg transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        ) : (
          // Registration Form Screen
          <div className="card-elevated p-5">
            <button
              onClick={() => {
                setSelectedRole(null);
                setError("");
                setFormData({ ...formData, speciality: "", experience: 0 });
              }}
              className="btn-ghost text-xs mb-3 flex items-center gap-1"
            >
              ← Back
            </button>

            <div className="text-center mb-4">
              <div className="inline-block px-3 py-1 bg-secondary-100 text-secondary-600 rounded-full text-xs font-bold capitalize flex items-center gap-2">
                <FontAwesomeIcon icon={selectedRole === "doctor" ? faUserDoctor : faUser} />
                {selectedRole === "doctor" ? "Doctor" : "Patient"} Registration
              </div>
            </div>

            {error && (
              <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-xs">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="form-label text-xs">Username</label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    className="input-field text-sm py-2"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    minLength="3"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label text-xs">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="input-field text-sm py-2"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {selectedRole === "doctor" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="form-group">
                    <label className="form-label text-xs">Speciality</label>
                    <select
                      name="speciality"
                      value={formData.speciality}
                      onChange={handleChange}
                      className="input-field text-sm py-2"
                      required
                    >
                      <option value="">Select</option>
                      {specialities.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label text-xs">Experience (Yrs)</label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="input-field text-sm py-2"
                      min="0"
                      max="70"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="form-label text-xs">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="input-field text-sm py-2"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label text-xs">Confirm</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm"
                    className="input-field text-sm py-2"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-action w-full disabled:opacity-60 disabled:cursor-not-allowed text-sm py-2"
              >
                {loading ? "Registering..." : "Create Account"}
              </button>
            </form>

            <div className="my-3 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-medium"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

            <p className="text-center text-gray-600 text-xs">
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
  );
};

export default Register;

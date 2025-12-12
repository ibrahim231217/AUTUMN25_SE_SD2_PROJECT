import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../utils/api";

const AddAdmin = ({ user, onLogout }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setMessage({
        type: "error",
        text: "Passwords do not match",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/admin/add-admin", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        setMessage({
          type: "success",
          text: "Admin added successfully!",
        });

        // Reset form
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to add admin",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-light">
      <Navbar user={user} onLogout={onLogout} />

      <div className="flex">
        <Sidebar role="admin" />

        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-primary-600 mb-8">Add New Admin</h1>

            <div className="card bg-white rounded-xl p-6">
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <span className="text-yellow-800 text-sm font-medium">
                  ⚠️ Admin accounts have full access to the system. Use with caution.
                </span>
              </div>

              {message.text && (
                <div
                  className={`mb-6 p-4 rounded-lg text-sm font-medium border ${
                    message.type === "success"
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-red-50 border-red-200 text-red-700"
                  }`}
                >
                  <span>{message.text}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group mb-6">
                  <label className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    className="input-field w-full"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    minLength="3"
                  />
                </div>

                <div className="form-group mb-6">
                  <label className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    className="input-field w-full"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group mb-6">
                  <label className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    className="input-field w-full"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                  />
                </div>

                <div className="form-group mb-6">
                  <label className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    className="input-field w-full"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <button
                    type="submit"
                    className={`btn-primary rounded-xl px-8 py-3 w-full text-center transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={loading}
                  >
                    {loading ? "Adding Admin..." : "Add Admin"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddAdmin;

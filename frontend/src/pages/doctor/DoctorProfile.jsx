import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../utils/api";

const DoctorProfile = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: "",
    speciality: "",
    experience: 0,
    profileImage: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        description: user.description || "",
        speciality: user.speciality || "",
        experience: user.experience || 0,
        profileImage: user.profileImage || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "experience" ? parseInt(value) : value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.patch("/doctor/update-profile", formData);

      if (response.data.success) {
        setSuccess("Profile updated successfully!");
        setTimeout(() => {
          setSuccess("");
        }, 3000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update profile. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Please login first</p>
      </div>
    );
  }

  const specialities = [
    "Dermatologist",
    "Pathologist",
    "Neurologist",
    "Cardiologist",
    "Endocrinologist",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />

      <div className="flex">
        <Sidebar role="doctor" />

        <main className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800">
                Update Your Profile
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your professional information
              </p>
            </div>

            {/* Current Profile Summary */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">
                Your Current Profile
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-gray-600 text-sm">Username</p>
                  <p className="font-semibold text-slate-800">{user.username}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Email</p>
                  <p className="font-semibold text-slate-800">{user.email}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Specialty</p>
                  <p className="font-semibold text-slate-800">
                    {user.speciality || "Not set"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Experience</p>
                  <p className="font-semibold text-slate-800">
                    {user.experience} years
                  </p>
                </div>
                {user.description && (
                  <div className="md:col-span-3">
                    <p className="text-gray-600 text-sm">About</p>
                    <p className="text-slate-800">{user.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Edit Form */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-slate-800">
                  Edit Profile Information
                </h2>
              </div>

              <div className="p-6">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                      Specialty
                    </label>
                    <select
                      name="speciality"
                      value={formData.speciality}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="">Select Specialty</option>
                      {specialities.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                      Experience (Years)
                    </label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      min="0"
                      max="70"
                    />
                    <p className="text-gray-500 text-sm mt-2">
                      How many years of experience do you have?
                    </p>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                      About You
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                      rows="5"
                      placeholder="Write a brief bio about yourself, your expertise, and treatment approach..."
                    ></textarea>
                    <p className="text-gray-500 text-sm mt-2">
                      This will be shown to patients
                    </p>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                      Profile Image URL
                    </label>
                    <input
                      type="text"
                      name="profileImage"
                      value={formData.profileImage}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="https://example.com/image.jpg"
                    />
                    <p className="text-gray-500 text-sm mt-2">
                      Enter a valid image URL
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Updating..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/doctor/dashboard")}
                      className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div
                onClick={() => navigate("/doctor/bookings")}
                className="bg-blue-50 border border-blue-200 rounded-lg p-6 cursor-pointer hover:shadow-md transition"
              >
                <h3 className="font-semibold text-blue-700 text-lg mb-1">
                  📋 My Bookings
                </h3>
                <p className="text-blue-600 text-sm">
                  View and manage all your appointments
                </p>
              </div>
              <div
                onClick={() => navigate("/doctor/dashboard")}
                className="bg-green-50 border border-green-200 rounded-lg p-6 cursor-pointer hover:shadow-md transition"
              >
                <h3 className="font-semibold text-green-700 text-lg mb-1">
                  🏠 Dashboard
                </h3>
                <p className="text-green-600 text-sm">
                  Go back to your dashboard
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorProfile;

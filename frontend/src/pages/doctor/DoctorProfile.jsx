import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import ImageUpload from "../../components/ImageUpload";
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
    <div className="min-h-screen bg-neutral-50">
      <Navbar user={user} onLogout={onLogout} />

      <div className="flex">
        <Sidebar role="doctor" />

        <main className="flex-1 p-4 ml-64">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Update Profile</h1>
                <p className="text-sm text-gray-600">Manage your professional information</p>
              </div>
              <button
                onClick={() => navigate("/doctor/dashboard")}
                className="px-3 py-1.5 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:border-blue-600 hover:text-blue-600 transition font-medium text-sm"
              >
                ← Back
              </button>
            </div>

            {/* Current Profile Summary */}
            <div className="rounded-xl bg-white border-2 border-gray-200 p-4 mb-4">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">Current Profile</h2>
              <div className="grid md:grid-cols-4 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-600">Username</p>
                  <p className="font-semibold text-gray-900">{user.username}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{user.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Specialty</p>
                  <p className="font-semibold text-gray-900">{user.speciality || "Not set"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Experience</p>
                  <p className="font-semibold text-gray-900">{user.experience} years</p>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            <div className="rounded-xl bg-white border-2 border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Edit Information</h2>
              </div>

              <div className="p-4">
                {error && (
                  <div className="mb-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-3 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="space-y-3">
                    <ImageUpload
                      currentImage={formData.profileImage}
                      onImageUploaded={(url) => setFormData({ ...formData, profileImage: url })}
                    />

                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Specialty
                        </label>
                        <select
                          name="speciality"
                          value={formData.speciality}
                          onChange={handleChange}
                          className="input-field w-full text-sm"
                        >
                          <option value="">Select Specialty</option>
                          {specialities.map((spec) => (
                            <option key={spec} value={spec}>
                              {spec}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Experience (Years)
                        </label>
                        <input
                          type="number"
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          className="input-field w-full text-sm"
                          min="0"
                          max="70"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        About You
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="input-field w-full text-sm resize-none"
                        rows="3"
                        placeholder="Brief bio about yourself, expertise, and treatment approach..."
                      ></textarea>
                      <p className="text-xs text-gray-500 mt-1">This will be shown to patients</p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Updating..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/doctor/dashboard")}
                      className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorProfile;

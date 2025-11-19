import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../utils/api";

const BookAppointment = ({ user, onLogout }) => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [formData, setFormData] = useState({
    category: "",
    appointmentTime: "",
    message: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    "Dermatologist",
    "Pathologist",
    "Neurologist",
    "Cardiologist",
    "Endocrinologist",
  ];

  useEffect(() => {
    fetchDoctor();
  }, [doctorId]);

  const fetchDoctor = async () => {
    try {
      const response = await api.get("/patient/doctors");
      const foundDoctor = response.data.data.find((d) => d._id === doctorId);

      if (foundDoctor) {
        setDoctor(foundDoctor);
        setFormData((prev) => ({
          ...prev,
          category: foundDoctor.speciality,
        }));
      }
    } catch (error) {
      console.error("Error fetching doctor:", error);
      setError("Failed to load doctor information");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await api.post("/patient/book", {
        ...formData,
        doctorId,
      });

      if (response.data.success) {
        alert("Appointment booked successfully!");
        navigate("/patient/bookings");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book appointment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading doctor information...</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-800 mb-4">Doctor not found</p>
          <button
            onClick={() => navigate("/patient/doctors")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Back to Doctors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />

      <div className="flex">
        <Sidebar role="patient" />

        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Book Appointment</h1>

            {/* Doctor Info Card */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-4xl font-bold text-blue-600">
                    {doctor.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-800">Dr. {doctor.username}</h2>
                  <p className="text-gray-600 text-sm mt-1">{doctor.email}</p>
                  <div className="flex gap-2 mt-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                      {doctor.speciality}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                      {doctor.experience} years experience
                    </span>
                  </div>
                </div>
              </div>
              {doctor.description && (
                <p className="mt-6 text-gray-600 text-sm border-t border-gray-200 pt-6">{doctor.description}</p>
              )}
            </div>

            {/* Booking Form */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Appointment Details</h2>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Category
                  </label>
                  <select
                    name="category"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Choose a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Appointment Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="appointmentTime"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.appointmentTime}
                    onChange={handleChange}
                    min={new Date().toISOString().slice(0, 16)}
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    name="message"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                    placeholder="Any specific concerns or notes..."
                    value={formData.message}
                    onChange={handleChange}
                    maxLength="500"
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-2">
                    {formData.message.length}/500 characters
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate("/patient/doctors")}
                    className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={submitting}
                  >
                    {submitting ? "Booking..." : "Confirm Booking"}
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

export default BookAppointment;

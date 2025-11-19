import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import api from "../../utils/api";

const DoctorList = ({ user, onLogout }) => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const categories = [
    "All",
    "Dermatologist",
    "Pathologist",
    "Neurologist",
    "Cardiologist",
    "Endocrinologist",
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredDoctors(doctors);
    } else {
      setFilteredDoctors(
        doctors.filter((doc) => doc.speciality === selectedCategory)
      );
    }
  }, [selectedCategory, doctors]);

  const fetchDoctors = async () => {
    try {
      const response = await api.get("/patient/doctors");
      setDoctors(response.data.data);
      setFilteredDoctors(response.data.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Find Doctors</h1>
          <p className="text-gray-600 mt-2">Browse our team of qualified specialists</p>
        </div>

        {/* Filter */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8">
          <h2 className="font-semibold text-gray-800 mb-4">Filter by Specialty</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Doctors Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading doctors...</p>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-600">No doctors found in this specialty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor._id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">
                        Dr. {doctor.username}
                      </h3>
                      <p className="text-sm text-blue-600 font-medium">
                        {doctor.speciality}
                      </p>
                    </div>
                    <div className="text-3xl opacity-20">👨‍⚕️</div>
                  </div>

                  {doctor.experience > 0 && (
                    <p className="text-sm text-gray-600 mb-3">
                      <strong>Experience:</strong> {doctor.experience} years
                    </p>
                  )}

                  {doctor.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {doctor.description}
                    </p>
                  )}

                  <p className="text-xs text-gray-500 mb-4">
                    📧 {doctor.email}
                  </p>

                  <Link
                    to={`/patient/book/${doctor._id}`}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center font-medium text-sm"
                  >
                    Book Appointment
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorList;

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
    <div className="page-container">
      <Navbar user={user} onLogout={onLogout} />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="section-header">Find Doctors</h1>
          <p className="section-subtitle">Browse our team of qualified specialists</p>
        </div>

        {/* Filter */}
        <div className="card mb-10">
          <h2 className="font-semibold text-gray-800 mb-4">Filter by Specialty</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedCategory === category
                    ? "btn-primary"
                    : "btn-outline"
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
            <p className="text-gray-600 text-lg">Loading doctors...</p>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="card text-center p-8">
            <p className="text-gray-600">No doctors found in this specialty</p>
          </div>
        ) : (
          <div className="grid-responsive">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor._id}
                className="card group"
              >
                <div className="p-2">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">
                        Dr. {doctor.username}
                      </h3>
                      <p className="text-sm font-medium" style={{color: 'var(--secondary)'}}>
                        {doctor.speciality}
                      </p>
                    </div>
                    <div className="text-4xl group-hover:scale-110 transition-transform">👨‍⚕️</div>
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
                    className="w-full btn-action block text-center text-sm py-2"
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

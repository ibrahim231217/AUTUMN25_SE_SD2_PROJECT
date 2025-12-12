import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../utils/api";

const DoctorList = ({ user, onLogout }) => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
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
    let filtered = doctors;
    
    if (selectedCategory !== "All") {
      filtered = filtered.filter((doc) => doc.speciality === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter((doc) =>
        doc.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredDoctors(filtered);
  }, [selectedCategory, searchTerm, doctors]);

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
    <div className="min-h-screen bg-neutral-50">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="flex">
        <Sidebar role="patient" />
        
        <div className="flex-1 p-8 ml-64">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Doctors</h1>
              <p className="text-gray-600">Browse our team of qualified specialists</p>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="🔍 Search doctors by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field w-full"
              />
            </div>

            {/* Filter */}
            <div className="card mb-8">
              <h2 className="font-semibold text-gray-900 mb-4">Filter by Specialty</h2>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedCategory === category
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Doctors Grid */}
            {loading ? (
              <div className="card text-center py-12">
                <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 mt-2">Loading doctors...</p>
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="card text-center p-12">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-600 text-lg">No doctors found</p>
                <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filter</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    className="group relative overflow-hidden rounded-2xl bg-white border-2 border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    {/* Gradient Background */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500 to-green-600 opacity-5 rounded-bl-full"></div>
                    
                    {/* Content */}
                    <div className="relative p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900 mb-1">
                            Dr. {doctor.username}
                          </h3>
                          <p className="text-sm font-semibold text-green-600">
                            {doctor.speciality}
                          </p>
                        </div>
                        {doctor.profileImage ? (
                          <img
                            src={doctor.profileImage}
                            alt={`Dr. ${doctor.username}`}
                            className="w-16 h-16 rounded-full object-cover border-4 border-green-600 shadow-md group-hover:scale-110 transition-transform"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-110 transition-transform">
                            {doctor.username?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {doctor.experience > 0 && (
                        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                          <span className="font-semibold">📚 Experience:</span>
                          <span>{doctor.experience} years</span>
                        </div>
                      )}

                      {doctor.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {doctor.description}
                        </p>
                      )}

                      <p className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                        <span>📧</span>
                        <span className="truncate">{doctor.email}</span>
                      </p>

                      <Link
                        to={`/patient/book/${doctor._id}`}
                        className="block w-full text-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
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
      </div>
    </div>
  );
};

export default DoctorList;

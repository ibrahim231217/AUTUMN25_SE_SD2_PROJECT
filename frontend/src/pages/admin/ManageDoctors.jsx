import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../utils/api";

const ManageDoctors = ({ user, onLogout }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await api.get("/admin/doctors");
      setDoctors(response.data.data || []);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDoctor = async (doctorId) => {
    setDeleteId(doctorId);
    try {
      await api.delete(`/admin/doctor/${doctorId}`);
      setDoctors(doctors.filter((d) => d._id !== doctorId));
      alert("Doctor deleted successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting doctor");
    } finally {
      setDeleteId(null);
    }
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <Navbar user={user} onLogout={onLogout} />

      <div className="flex">
        <Sidebar role="admin" />

        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="section-header mb-2">
              Manage Doctors
            </h1>
            <p className="section-subtitle mb-8">
              View, update, and manage all registered doctors
            </p>

            {/* Search Bar */}
            <div className="mb-8">
              <input
                type="text"
                placeholder="Search by name, email, or speciality..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field w-full px-4 py-3 rounded-xl"
              />
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading doctors...</p>
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="card text-center p-12">
                <div className="text-5xl mb-4">👨‍⚕️</div>
                <h3 className="text-2xl font-bold text-primary-600 mb-2">
                  No Doctors Found
                </h3>
                <p className="text-gray-600">
                  {searchTerm
                    ? "No doctors match your search criteria."
                    : "No doctors registered yet."}
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredDoctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    className="card group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="text-5xl group-hover:scale-110 transition-transform">👨‍⚕️</div>
                        <div>
                          <h3 className="text-2xl font-bold text-primary-600">
                            {doctor.username}
                          </h3>
                          <p className="text-gray-600">{doctor.email}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="badge-success rounded-full text-sm font-semibold">
                          ✓ Approved
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wide">
                          Speciality
                        </p>
                        <p className="font-semibold text-primary-600">
                          {doctor.speciality}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wide">
                          Experience
                        </p>
                        <p className="font-semibold text-primary-600">
                          {doctor.experience} years
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wide">
                          Registered
                        </p>
                        <p className="font-semibold text-primary-600">
                          {new Date(doctor.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wide">
                          Status
                        </p>
                        <p className="font-semibold text-green-600">Active</p>
                      </div>
                    </div>

                    {doctor.description && (
                      <div className="mb-6">
                        <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">
                          Biography
                        </p>
                        <p className="text-gray-700 text-sm bg-neutral-light p-3 rounded-lg">
                          {doctor.description}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <button
                        className="px-4 py-2 btn-primary rounded-xl text-sm font-semibold"
                      >
                        Edit Profile
                      </button>
                      <button
                        onClick={() => deleteDoctor(doctor._id)}
                        disabled={deleteId === doctor._id}
                        className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-semibold text-sm disabled:opacity-50"
                      >
                        {deleteId === doctor._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageDoctors;

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
    <div className="min-h-screen bg-neutral-50">
      <Navbar user={user} onLogout={onLogout} />

      <div className="flex">
        <Sidebar role="admin" />

        <main className="flex-1 p-8 ml-64">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Doctors</h1>
            <p className="text-gray-600 mb-8">View, update, and manage all registered doctors</p>

            {/* Search Bar */}
            <div className="mb-8">
              <input
                type="text"
                placeholder="🔍 Search by name, email, or speciality..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field w-full"
              />
            </div>

            {loading ? (
              <div className="card text-center py-12">
                <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 mt-2">Loading doctors...</p>
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="card text-center p-12">
                <div className="text-6xl mb-4">⚕️</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Doctors Found</h3>
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
                    className="rounded-2xl bg-white border-2 border-gray-200 hover:shadow-lg transition overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          {doctor.profileImage ? (
                            <img
                              src={doctor.profileImage}
                              alt={doctor.username}
                              className="w-14 h-14 rounded-full object-cover border-4 border-green-600 shadow-md"
                            />
                          ) : (
                            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                              {doctor.username?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{doctor.username}</h3>
                            <p className="text-gray-600">{doctor.email}</p>
                          </div>
                        </div>
                        <div className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                          ✓ Approved
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div>
                          <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Speciality</p>
                          <p className="font-semibold text-gray-900">{doctor.speciality}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Experience</p>
                          <p className="font-semibold text-gray-900">{doctor.experience} years</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Registered</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(doctor.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Status</p>
                          <p className="font-semibold text-green-600">Active</p>
                        </div>
                      </div>

                      {doctor.description && (
                        <div className="mb-6">
                          <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Biography</p>
                          <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
                            {doctor.description}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-4">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm font-semibold">
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

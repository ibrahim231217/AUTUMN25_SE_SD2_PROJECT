import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import ConfirmModal from "../../components/ConfirmModal";
import api from "../../utils/api";

const ManagePatients = ({ user, onLogout }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, patient: null });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await api.get("/admin/patients");
      setPatients(response.data.data || []);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePatient = async () => {
    try {
      const response = await api.delete(`/admin/patient/${deleteModal.patient._id}`);
      
      if (response.data.success) {
        setPatients(patients.filter(p => p._id !== deleteModal.patient._id));
        setMessage({ type: "success", text: "Patient deleted successfully" });
        setDeleteModal({ isOpen: false, patient: null });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to delete patient";
      setMessage({ type: "error", text: errorMessage });
      setDeleteModal({ isOpen: false, patient: null });
      setTimeout(() => setMessage({ type: "", text: "" }), 5000);
    }
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar user={user} onLogout={onLogout} />

      <div className="flex">
        <Sidebar role="admin" />

        <main className="flex-1 p-8 ml-64">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Patients</h1>
            <p className="text-gray-600 mb-8">View all registered patients in the system</p>

            {message.text && (
              <div className={`p-4 rounded-xl mb-6 ${message.type === "success" ? "bg-green-100 text-green-700 border-2 border-green-200" : "bg-red-100 text-red-700 border-2 border-red-200"}`}>
                {message.text}
              </div>
            )}

            {/* Search Bar */}
            <div className="mb-8">
              <input
                type="text"
                placeholder="🔍 Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field w-full"
              />
            </div>

            {loading ? (
              <div className="card text-center py-12">
                <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 mt-2">Loading patients...</p>
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="card text-center p-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Patients Found</h3>
                <p className="text-gray-600">
                  {searchTerm
                    ? "No patients match your search criteria."
                    : "No patients registered yet."}
                </p>
              </div>
            ) : (
              <div className="rounded-2xl bg-white border-2 border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 border-b-2 border-gray-200">
                      <th className="text-left px-6 py-4 font-semibold text-sm text-gray-900">Name</th>
                      <th className="text-left px-6 py-4 font-semibold text-sm text-gray-900">Email</th>
                      <th className="text-left px-6 py-4 font-semibold text-sm text-gray-900">Registered</th>
                      <th className="text-left px-6 py-4 font-semibold text-sm text-gray-900">Status</th>
                      <th className="text-left px-6 py-4 font-semibold text-sm text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map((patient) => (
                      <tr
                        key={patient._id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {patient.profileImage ? (
                              <img
                                src={patient.profileImage}
                                alt={patient.username}
                                className="w-10 h-10 rounded-full object-cover border-2 border-blue-600"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                                {patient.username?.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span className="font-semibold text-gray-900">{patient.username}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{patient.email}</td>
                        <td className="px-6 py-4 text-gray-600 text-sm">
                          {new Date(patient.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => setDeleteModal({ isOpen: true, patient: patient })}
                            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-semibold text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, patient: null })}
        onConfirm={handleDeletePatient}
        title="Delete Patient"
        message={`Are you sure you want to delete patient "${deleteModal.patient?.username}"? This will also delete all their bookings.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default ManagePatients;

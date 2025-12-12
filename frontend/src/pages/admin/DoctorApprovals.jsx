import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../utils/api";

const DoctorApprovals = ({ user, onLogout }) => {
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  const fetchPendingDoctors = async () => {
    try {
      const response = await api.get("/admin/pending-doctors");
      setPendingDoctors(response.data.data || []);
    } catch (error) {
      console.error("Error fetching pending doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const approveDoctor = async (doctorId) => {
    setApproving(doctorId);
    try {
      await api.put(`/admin/approve-doctor/${doctorId}`);
      setPendingDoctors(pendingDoctors.filter((d) => d._id !== doctorId));
      alert("Doctor approved successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Error approving doctor");
    } finally {
      setApproving(null);
    }
  };

  const rejectDoctor = async (doctorId) => {
    setApproving(doctorId);
    try {
      await api.delete(`/admin/reject-doctor/${doctorId}`);
      setPendingDoctors(pendingDoctors.filter((d) => d._id !== doctorId));
      alert("Doctor application rejected");
    } catch (error) {
      alert(error.response?.data?.message || "Error rejecting doctor");
    } finally {
      setApproving(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar user={user} onLogout={onLogout} />

      <div className="flex">
        <Sidebar role="admin" />

        <main className="flex-1 p-8 ml-64">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Approvals</h1>
            <p className="text-gray-600 mb-8">Review and approve pending doctor registrations</p>

            {loading ? (
              <div className="card text-center py-12">
                <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 mt-2">Loading pending doctors...</p>
              </div>
            ) : pendingDoctors.length === 0 ? (
              <div className="card text-center p-12 border-2 border-green-200">
                <div className="text-6xl mb-4">✓</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">All Caught Up!</h3>
                <p className="text-gray-600">There are no pending doctor approvals.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {pendingDoctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    className="rounded-2xl bg-white border-2 border-amber-300 p-6 hover:shadow-lg transition"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-2xl shadow-md">
                          ⚕️
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{doctor.username}</h3>
                          <p className="text-gray-600">{doctor.email}</p>
                        </div>
                      </div>
                      <div className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full font-semibold text-sm">
                        ⏱️ Pending Review
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Speciality</p>
                        <p className="font-semibold text-gray-900">
                          {doctor.speciality || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Experience</p>
                        <p className="font-semibold text-gray-900">
                          {doctor.experience || 0} years
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Status</p>
                        <p className="font-semibold text-amber-700">Unapproved</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Registered</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(doctor.createdAt).toLocaleDateString()}
                        </p>
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
                      <button
                        onClick={() => approveDoctor(doctor._id)}
                        disabled={approving === doctor._id}
                        className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-semibold disabled:opacity-50 shadow-md"
                      >
                        {approving === doctor._id ? "Approving..." : "✓ Approve"}
                      </button>
                      <button
                        onClick={() => rejectDoctor(doctor._id)}
                        disabled={approving === doctor._id}
                        className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-semibold disabled:opacity-50 shadow-md"
                      >
                        {approving === doctor._id ? "Rejecting..." : "✕ Reject"}
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

export default DoctorApprovals;

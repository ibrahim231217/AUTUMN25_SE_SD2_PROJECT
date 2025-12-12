import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../utils/api";

const ManagePatients = ({ user, onLogout }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredPatients = patients.filter(
    (patient) =>
      patient.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-light">
      <Navbar user={user} onLogout={onLogout} />

      <div className="flex">
        <Sidebar role="admin" />

        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-primary-600 mb-2">
              Manage Patients
            </h1>
            <p className="text-gray-600 mb-8">
              View all registered patients in the system
            </p>

            {/* Search Bar */}
            <div className="mb-8">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field w-full px-4 py-3 rounded-xl"
              />
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading patients...</p>
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="card bg-white rounded-xl border-2 border-neutral-medium p-12 text-center">
                <div className="text-5xl mb-4">👨‍🦱</div>
                <h3 className="text-2xl font-bold text-primary-600 mb-2">
                  No Patients Found
                </h3>
                <p className="text-gray-600">
                  {searchTerm
                    ? "No patients match your search criteria."
                    : "No patients registered yet."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full card rounded-xl">
                  <thead>
                    <tr className="bg-primary-50 border-b border-neutral-medium">
                      <th className="text-left px-6 py-4 font-semibold text-primary-600">
                        Name
                      </th>
                      <th className="text-left px-6 py-4 font-semibold text-primary-600">
                        Email
                      </th>
                      <th className="text-left px-6 py-4 font-semibold text-primary-600">
                        Registered
                      </th>
                      <th className="text-left px-6 py-4 font-semibold text-primary-600">
                        Status
                      </th>
                      <th className="text-left px-6 py-4 font-semibold text-primary-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {filteredPatients.map((patient, idx) => (
                      <tr
                        key={patient._id}
                        className={`border-b border-neutral-medium ${
                          idx % 2 === 0 ? "bg-neutral-light" : "bg-white"
                        } hover:bg-accent-50 transition`}
                      >
                        <td className="px-6 py-4 font-semibold text-primary-600">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">👨‍🦱</div>
                            {patient.username}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {patient.email}
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">
                          {new Date(patient.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="badge-success rounded-full text-sm font-semibold">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="px-4 py-2 btn-primary rounded-xl hover:shadow-medium transition font-semibold text-sm">
                            View Details
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
    </div>
  );
};

export default ManagePatients;

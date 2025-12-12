import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../utils/api";

const AllBookings = ({ user, onLogout }) => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    let filtered = bookings;

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((b) => b.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (b) =>
          b.patientId?.username
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          b.doctorId?.username
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          b.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
  }, [filterStatus, searchTerm, bookings]);

  const fetchBookings = async () => {
    try {
      const response = await api.get("/admin/bookings");
      setBookings(response.data.data);
      setFilteredBookings(response.data.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "badge-warning",
      accepted: "badge-success",
      rejected: "badge-error",
    };
    return badges[status] || "badge-primary";
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar user={user} onLogout={onLogout} />

      <div className="flex">
        <Sidebar role="admin" />

        <main className="flex-1 p-8 ml-64">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">All Bookings</h1>
              <div className="badge-primary px-4 py-2 text-base">
                {bookings.length} Total
              </div>
            </div>

            {/* Filters */}
            <div className="card mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search by patient, doctor, or category..."
                    className="input-field"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setFilterStatus("all")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      filterStatus === "all"
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600"
                    }`}
                  >
                    All ({bookings.length})
                  </button>
                  <button
                    onClick={() => setFilterStatus("pending")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      filterStatus === "pending"
                        ? "bg-amber-500 text-white shadow-md"
                        : "bg-white border-2 border-gray-300 text-gray-700 hover:border-amber-500 hover:text-amber-600"
                    }`}
                  >
                    Pending ({bookings.filter((b) => b.status === "pending").length})
                  </button>
                  <button
                    onClick={() => setFilterStatus("accepted")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      filterStatus === "accepted"
                        ? "bg-green-600 text-white shadow-md"
                        : "bg-white border-2 border-gray-300 text-gray-700 hover:border-green-600 hover:text-green-600"
                    }`}
                  >
                    Accepted ({bookings.filter((b) => b.status === "accepted").length})
                  </button>
                  <button
                    onClick={() => setFilterStatus("rejected")}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      filterStatus === "rejected"
                        ? "bg-red-600 text-white shadow-md"
                        : "bg-white border-2 border-gray-300 text-gray-700 hover:border-red-600 hover:text-red-600"
                    }`}
                  >
                    Rejected ({bookings.filter((b) => b.status === "rejected").length})
                  </button>
                </div>
              </div>
            </div>

            {/* Bookings Table */}
            {loading ? (
              <div className="card text-center py-12">
                <div className="inline-block w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading bookings...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-500 text-lg">No bookings found</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="w-full">
                  <thead>
                    <tr className="table-header">
                      <th className="px-6 py-4 text-left">Patient</th>
                      <th className="px-6 py-4 text-left">Doctor</th>
                      <th className="px-6 py-4 text-left">Category</th>
                      <th className="px-6 py-4 text-left">Appointment Time</th>
                      <th className="px-6 py-4 text-left">Message</th>
                      <th className="px-6 py-4 text-left">Status</th>
                      <th className="px-6 py-4 text-left">Booked On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking._id} className="table-row">
                        <td className="table-cell">
                          <div>
                            <div className="font-semibold text-gray-900">
                              {booking.patientId?.username || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.patientId?.email || ""}
                            </div>
                          </div>
                        </td>
                        <td className="table-cell">
                          <div>
                            <div className="font-semibold text-gray-900">
                              Dr. {booking.doctorId?.username || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.doctorId?.speciality || ""}
                            </div>
                          </div>
                        </td>
                        <td className="table-cell">
                          <span className="badge-primary">
                            {booking.category}
                          </span>
                        </td>
                        <td className="table-cell">
                          <div className="text-sm">
                            {new Date(booking.appointmentTime).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(booking.appointmentTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </td>
                        <td className="table-cell">
                          <div
                            className="text-sm max-w-xs truncate"
                            title={booking.message}
                          >
                            {booking.message || "-"}
                          </div>
                        </td>
                        <td className="table-cell">
                          <span className={`${getStatusBadge(booking.status)} capitalize`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="table-cell">
                          <div className="text-sm text-gray-500">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </div>
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

export default AllBookings;

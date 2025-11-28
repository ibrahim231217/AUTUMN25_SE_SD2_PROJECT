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
    return badges[status] || "badge-ghost";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />

      <div className="flex">
        <Sidebar role="admin" />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">All Bookings</h1>
              <div className="badge badge-lg badge-primary">
                {bookings.length} Total
              </div>
            </div>

            {/* Filters */}
            <div className="card bg-white shadow-lg mb-8">
              <div className="card-body">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search by patient, doctor, or category..."
                      className="input input-bordered w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setFilterStatus("all")}
                      className={`btn btn-sm ${
                        filterStatus === "all" ? "btn-primary" : "btn-outline"
                      }`}
                    >
                      All ({bookings.length})
                    </button>
                    <button
                      onClick={() => setFilterStatus("pending")}
                      className={`btn btn-sm ${
                        filterStatus === "pending"
                          ? "btn-warning"
                          : "btn-outline"
                      }`}
                    >
                      Pending (
                      {bookings.filter((b) => b.status === "pending").length})
                    </button>
                    <button
                      onClick={() => setFilterStatus("accepted")}
                      className={`btn btn-sm ${
                        filterStatus === "accepted"
                          ? "btn-success"
                          : "btn-outline"
                      }`}
                    >
                      Accepted (
                      {bookings.filter((b) => b.status === "accepted").length})
                    </button>
                    <button
                      onClick={() => setFilterStatus("rejected")}
                      className={`btn btn-sm ${
                        filterStatus === "rejected"
                          ? "btn-error"
                          : "btn-outline"
                      }`}
                    >
                      Rejected (
                      {bookings.filter((b) => b.status === "rejected").length})
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bookings Table */}
            {loading ? (
              <div className="text-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="card bg-white shadow-lg">
                <div className="card-body text-center py-12">
                  <p className="text-gray-500 text-lg">No bookings found</p>
                </div>
              </div>
            ) : (
              <div className="card bg-white shadow-xl">
                <div className="card-body p-0">
                  <div className="overflow-x-auto">
                    <table className="table table-zebra">
                      <thead className="bg-base-200">
                        <tr>
                          <th>Patient</th>
                          <th>Doctor</th>
                          <th>Category</th>
                          <th>Appointment Time</th>
                          <th>Message</th>
                          <th>Status</th>
                          <th>Booked On</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBookings.map((booking) => (
                          <tr key={booking._id}>
                            <td>
                              <div>
                                <div className="font-semibold">
                                  {booking.patientId?.username || "N/A"}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {booking.patientId?.email || ""}
                                </div>
                              </div>
                            </td>
                            <td>
                              <div>
                                <div className="font-semibold">
                                  Dr. {booking.doctorId?.username || "N/A"}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {booking.doctorId?.speciality || ""}
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="badge badge-ghost">
                                {booking.category}
                              </span>
                            </td>
                            <td className="text-sm">
                              {new Date(
                                booking.appointmentTime
                              ).toLocaleString()}
                            </td>
                            <td>
                              <div
                                className="text-xs max-w-xs truncate"
                                title={booking.message}
                              >
                                {booking.message || "-"}
                              </div>
                            </td>
                            <td>
                              <span
                                className={`badge ${getStatusBadge(
                                  booking.status
                                )}`}
                              >
                                {booking.status}
                              </span>
                            </td>
                            <td className="text-xs text-gray-500">
                              {new Date(booking.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AllBookings;

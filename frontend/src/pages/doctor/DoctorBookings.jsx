import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../utils/api";

const DoctorBookings = ({ user, onLogout }) => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (filterStatus === "all") {
      setFilteredBookings(bookings);
    } else {
      setFilteredBookings(bookings.filter((b) => b.status === filterStatus));
    }
  }, [filterStatus, bookings]);

  const fetchBookings = async () => {
    try {
      const response = await api.get("/doctor/bookings");
      setBookings(response.data.data);
      setFilteredBookings(response.data.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, status) => {
    setUpdatingId(bookingId);

    try {
      const response = await api.patch(`/doctor/update-status/${bookingId}`, {
        status,
      });

      if (response.data.success) {
        // Update local state
        setBookings(
          bookings.map((booking) =>
            booking._id === bookingId ? { ...booking, status } : booking
          )
        );
        alert(`Appointment ${status} successfully`);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
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
        <Sidebar role="doctor" />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Appointment Requests</h1>

            {/* Filter Buttons */}
            <div className="card bg-white shadow-lg mb-8">
              <div className="card-body">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setFilterStatus("all")}
                    className={`btn ${
                      filterStatus === "all" ? "btn-primary" : "btn-outline"
                    }`}
                  >
                    All ({bookings.length})
                  </button>
                  <button
                    onClick={() => setFilterStatus("pending")}
                    className={`btn ${
                      filterStatus === "pending" ? "btn-warning" : "btn-outline"
                    }`}
                  >
                    Pending (
                    {bookings.filter((b) => b.status === "pending").length})
                  </button>
                  <button
                    onClick={() => setFilterStatus("accepted")}
                    className={`btn ${
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
                    className={`btn ${
                      filterStatus === "rejected" ? "btn-error" : "btn-outline"
                    }`}
                  >
                    Rejected (
                    {bookings.filter((b) => b.status === "rejected").length})
                  </button>
                </div>
              </div>
            </div>

            {/* Bookings List */}
            {loading ? (
              <div className="text-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="card bg-white shadow-lg">
                <div className="card-body text-center py-12">
                  <p className="text-gray-500 text-lg">No appointments found</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredBookings.map((booking) => (
                  <div key={booking._id} className="card bg-white shadow-xl">
                    <div className="card-body">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="avatar placeholder">
                              <div className="bg-accent text-white rounded-full w-12">
                                <span className="text-xl">
                                  {booking.patientId?.username
                                    ?.charAt(0)
                                    .toUpperCase() || "P"}
                                </span>
                              </div>
                            </div>
                            <div>
                              <h3 className="font-bold text-lg">
                                {booking.patientId?.username ||
                                  "Unknown Patient"}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {booking.patientId?.email || "No email"}
                              </p>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Category</p>
                              <p className="font-semibold">
                                {booking.category}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Appointment Time
                              </p>
                              <p className="font-semibold">
                                {new Date(
                                  booking.appointmentTime
                                ).toLocaleString()}
                              </p>
                            </div>
                            {booking.message && (
                              <div className="md:col-span-2">
                                <p className="text-sm text-gray-600">
                                  Patient's Message
                                </p>
                                <p className="text-sm bg-gray-50 p-3 rounded">
                                  {booking.message}
                                </p>
                              </div>
                            )}
                            <div>
                              <p className="text-sm text-gray-600">Booked On</p>
                              <p className="text-sm">
                                {new Date(booking.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">
                                Current Status
                              </p>
                              <span
                                className={`badge ${getStatusBadge(
                                  booking.status
                                )}`}
                              >
                                {booking.status.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {booking.status === "pending" && (
                        <div className="card-actions justify-end mt-4 gap-3">
                          <button
                            onClick={() =>
                              handleUpdateStatus(booking._id, "rejected")
                            }
                            className={`btn btn-error ${
                              updatingId === booking._id ? "loading" : ""
                            }`}
                            disabled={updatingId === booking._id}
                          >
                            Reject
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(booking._id, "accepted")
                            }
                            className={`btn btn-success ${
                              updatingId === booking._id ? "loading" : ""
                            }`}
                            disabled={updatingId === booking._id}
                          >
                            Accept
                          </button>
                        </div>
                      )}
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

export default DoctorBookings;

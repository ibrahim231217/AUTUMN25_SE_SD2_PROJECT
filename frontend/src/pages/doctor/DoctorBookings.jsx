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
      await api.patch(`/doctor/update-status/${bookingId}`, {
        status,
      });

      // Update local state
      setBookings(
        bookings.map((booking) =>
          booking._id === bookingId ? { ...booking, status } : booking
        )
      );
      alert(`Appointment ${status} successfully`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleScheduleNextDay = async (bookingId) => {
    setUpdatingId(bookingId);

    try {
      await api.patch(`/doctor/schedule-next-day/${bookingId}`);

      // Update local state
      setBookings(
        bookings.map((booking) => {
          if (booking._id === bookingId) {
            const nextDay = new Date(booking.appointmentTime);
            nextDay.setDate(nextDay.getDate() + 1);
            return {
              ...booking,
              appointmentTime: nextDay,
              status: "accepted",
            };
          }
          return booking;
        })
      );
      alert("Appointment scheduled for next day successfully");
    } catch (error) {
      console.error("Error scheduling next day:", error);
      alert(error.response?.data?.message || "Failed to schedule for next day");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700",
      accepted: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-neutral-light">
      <Navbar user={user} onLogout={onLogout} />

      <div className="flex">
        <Sidebar role="doctor" />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-primary-600 mb-8">
              Appointment Requests
            </h1>

            {/* Filter Buttons */}
            <div className="card bg-white rounded-xl p-6 mb-8">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`px-4 py-2 rounded-xl font-medium transition ${
                    filterStatus === "all"
                      ? "btn-primary"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All ({bookings.length})
                </button>
                <button
                  onClick={() => setFilterStatus("pending")}
                  className={`px-4 py-2 rounded-xl font-medium transition ${
                    filterStatus === "pending"
                      ? "badge-warning text-yellow-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Pending ({bookings.filter((b) => b.status === "pending").length})
                </button>
                <button
                  onClick={() => setFilterStatus("accepted")}
                  className={`px-4 py-2 rounded-xl font-medium transition ${
                    filterStatus === "accepted"
                      ? "badge-success text-green-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Accepted (
                  {bookings.filter((b) => b.status === "accepted").length})
                </button>
                <button
                  onClick={() => setFilterStatus("rejected")}
                  className={`px-4 py-2 rounded-xl font-medium transition ${
                    filterStatus === "rejected"
                      ? "badge-error text-red-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Rejected (
                  {bookings.filter((b) => b.status === "rejected").length})
                </button>
              </div>
            </div>

            {/* Bookings List */}
            {loading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-primary-300 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading appointments...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="card bg-white rounded-xl p-12 text-center">
                <p className="text-gray-500 text-lg">No appointments found</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="card bg-white rounded-xl hover:shadow-lg transition overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-bold text-secondary-600">
                              {booking.patientId?.username
                                ?.charAt(0)
                                .toUpperCase() || "P"}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-primary-600">
                              {booking.patientId?.username ||
                                "Unknown Patient"}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {booking.patientId?.email || "No email"}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <p className="text-gray-600 text-sm">Category</p>
                          <p className="font-semibold text-primary-600">
                            {booking.category}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">
                            Appointment Time
                          </p>
                          <p className="font-semibold text-primary-600">
                            {new Date(
                              booking.appointmentTime
                            ).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Requested On</p>
                          <p className="text-sm text-gray-700">
                            {new Date(booking.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Category</p>
                          <p className="text-sm text-gray-700">
                            {booking.category}
                          </p>
                        </div>
                      </div>

                      {booking.message && (
                        <div className="mb-6 p-4 bg-neutral-light rounded-lg border border-neutral-medium">
                          <p className="text-gray-600 text-sm mb-2">
                            Patient's Message
                          </p>
                          <p className="text-gray-800">{booking.message}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {booking.status === "pending" ? (
                        <div className="flex gap-3 flex-wrap">
                          <button
                            onClick={() =>
                              handleUpdateStatus(booking._id, "accepted")
                            }
                            disabled={updatingId === booking._id}
                            className="px-4 py-2 btn-primary rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updatingId === booking._id ? "..." : "✓ Accept"}
                          </button>
                          <button
                            onClick={() =>
                              handleScheduleNextDay(booking._id)
                            }
                            disabled={updatingId === booking._id}
                            className="px-4 py-2 btn-secondary rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updatingId === booking._id
                              ? "..."
                              : "📅 Schedule Next Day"}
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(booking._id, "rejected")
                            }
                            disabled={updatingId === booking._id}
                            className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updatingId === booking._id ? "..." : "✕ Reject"}
                          </button>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-600 p-4 bg-neutral-light rounded-lg">
                          This appointment has already been{" "}
                          <span className="font-semibold capitalize">
                            {booking.status}
                          </span>
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

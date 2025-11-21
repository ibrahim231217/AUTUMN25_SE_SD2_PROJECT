import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../utils/api";

const MyBookings = ({ user, onLogout }) => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);

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
      const response = await api.get("/patient/bookings");
      setBookings(response.data.data);
      setFilteredBookings(response.data.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />

      <div className="flex">
        <Sidebar role="patient" />

        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">My Appointments</h1>

            {/* Filter Buttons */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filterStatus === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All ({bookings.length})
                </button>
                <button
                  onClick={() => setFilterStatus("pending")}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filterStatus === "pending"
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Pending (
                  {bookings.filter((b) => b.status === "pending").length})
                </button>
                <button
                  onClick={() => setFilterStatus("accepted")}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filterStatus === "accepted"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Accepted (
                  {bookings.filter((b) => b.status === "accepted").length})
                </button>
                <button
                  onClick={() => setFilterStatus("rejected")}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filterStatus === "rejected"
                      ? "bg-red-600 text-white"
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
                <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading appointments...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-12 text-center">
                <p className="text-gray-500 text-lg">No appointments found</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredBookings.map((booking) => (
                  <div key={booking._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-bold text-blue-600">
                              {booking.doctorId?.username
                                ?.charAt(0)
                                .toUpperCase() || "D"}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              Dr. {booking.doctorId?.username || "Unknown"}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {booking.doctorId?.speciality || "Specialist"}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 text-sm font-semibold rounded-full ${
                            booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : booking.status === "accepted"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {booking.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 border-t border-gray-200 pt-6">
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Category</p>
                          <p className="text-gray-800 font-medium">
                            {booking.category}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                            Appointment Time
                          </p>
                          <p className="text-gray-800 font-medium">
                            {new Date(
                              booking.appointmentTime
                            ).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Booked On</p>
                          <p className="text-sm text-gray-700">
                            {new Date(booking.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {booking.message && (
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                              Your Message
                            </p>
                            <p className="text-sm text-gray-700 line-clamp-2">{booking.message}</p>
                          </div>
                        )}
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

export default MyBookings;

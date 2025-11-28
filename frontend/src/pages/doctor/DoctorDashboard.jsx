import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../utils/api";

const DoctorDashboard = ({ user, onLogout }) => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  });
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const bookingsResponse = await api.get("/doctor/bookings");
      const bookings = bookingsResponse.data.data;

      setStats({
        totalBookings: bookings.length,
        pending: bookings.filter((b) => b.status === "pending").length,
        accepted: bookings.filter((b) => b.status === "accepted").length,
        rejected: bookings.filter((b) => b.status === "rejected").length,
      });

      setPendingAppointments(
        bookings.filter((b) => b.status === "pending").slice(0, 5)
      );
      setRecentBookings(bookings.slice(0, 5));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = async (bookingId, status) => {
    try {
      await api.patch(`/doctor/update-status/${bookingId}`, { status });
      alert(`Appointment ${status} successfully`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || `Failed to ${status} appointment`);
    }
  };

  const handleScheduleNextDay = async (bookingId) => {
    try {
      await api.patch(`/doctor/schedule-next-day/${bookingId}`);
      alert("Appointment scheduled for next day successfully");
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to schedule for next day");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />

      <div className="flex">
        <Sidebar role="doctor" />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Doctor Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back, Dr. {user.username}!
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Appointments</p>
                    <p className="text-3xl font-bold text-slate-800">
                      {stats.totalBookings}
                    </p>
                  </div>
                  <div className="text-3xl opacity-20">📊</div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Pending</p>
                    <p className="text-3xl font-bold text-yellow-600">
                      {stats.pending}
                    </p>
                  </div>
                  <div className="text-3xl opacity-20">⏳</div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Accepted</p>
                    <p className="text-3xl font-bold text-green-600">
                      {stats.accepted}
                    </p>
                  </div>
                  <div className="text-3xl opacity-20">✓</div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Rejected</p>
                    <p className="text-3xl font-bold text-red-600">
                      {stats.rejected}
                    </p>
                  </div>
                  <div className="text-3xl opacity-20">✕</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Link
                to="/doctor/bookings"
                className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition shadow-sm"
              >
                <div className="text-2xl mb-2">📋</div>
                <h3 className="font-semibold">Manage Appointments</h3>
                <p className="text-sm text-blue-100 mt-1">View all bookings</p>
              </Link>

              <Link
                to="/doctor/profile"
                className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition shadow-sm"
              >
                <div className="text-2xl mb-2">👤</div>
                <h3 className="font-semibold">Update Profile</h3>
                <p className="text-sm text-green-100 mt-1">Edit your details</p>
              </Link>

              <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                <div className="text-2xl mb-2">⚕️</div>
                <h3 className="font-semibold text-gray-800">Specialty</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {user.speciality || "Not set"}
                </p>
              </div>
            </div>

            {/* Profile Info */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-slate-800">
                  Your Profile
                </h2>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-gray-600 text-sm">Specialty</p>
                    <p className="font-semibold text-slate-800">
                      {user.speciality || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Experience</p>
                    <p className="font-semibold text-slate-800">
                      {user.experience} years
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Email</p>
                    <p className="font-semibold text-slate-800 break-all">
                      {user.email}
                    </p>
                  </div>
                </div>
                {user.description && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-gray-600 text-sm">About</p>
                    <p className="text-slate-800 mt-2">{user.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Pending Appointments */}
            {pendingAppointments.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-8">
                <div className="p-6 border-b border-gray-200 bg-yellow-50">
                  <h2 className="text-xl font-semibold text-slate-800">
                    📌 Pending Appointments ({stats.pending})
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Awaiting your response
                  </p>
                </div>
                <div className="divide-y divide-gray-200">
                  {pendingAppointments.map((booking) => (
                    <div key={booking._id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-bold text-yellow-600">
                              {booking.patientId?.username?.charAt(0).toUpperCase() ||
                                "P"}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-800">
                              {booking.patientId?.username || "Unknown Patient"}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {booking.patientId?.email}
                            </p>
                          </div>
                        </div>
                        <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-semibold rounded-full">
                          {booking.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-gray-600 text-sm">Category</p>
                          <p className="font-semibold">{booking.category}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">
                            Appointment Time
                          </p>
                          <p className="font-semibold">
                            {new Date(
                              booking.appointmentTime
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {booking.message && (
                        <div className="mb-4">
                          <p className="text-gray-600 text-sm">
                            Patient's Message
                          </p>
                          <p className="text-sm bg-gray-50 p-3 rounded">
                            {booking.message}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-3 flex-wrap">
                        <button
                          onClick={() =>
                            handleQuickAction(booking._id, "accepted")
                          }
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-semibold"
                        >
                          ✓ Accept
                        </button>
                        <button
                          onClick={() =>
                            handleScheduleNextDay(booking._id)
                          }
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                        >
                          📅 Schedule Next Day
                        </button>
                        <button
                          onClick={() =>
                            handleQuickAction(booking._id, "rejected")
                          }
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-semibold"
                        >
                          ✕ Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Bookings Table */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-slate-800">
                  Recent Appointments
                </h2>
              </div>

              {loading ? (
                <div className="p-6 text-center text-gray-600">
                  <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                  Loading...
                </div>
              ) : recentBookings.length === 0 ? (
                <div className="p-6 text-center text-gray-600">
                  No appointments yet
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left p-4 text-gray-700 font-semibold text-sm">
                          Patient
                        </th>
                        <th className="text-left p-4 text-gray-700 font-semibold text-sm">
                          Category
                        </th>
                        <th className="text-left p-4 text-gray-700 font-semibold text-sm">
                          Date & Time
                        </th>
                        <th className="text-left p-4 text-gray-700 font-semibold text-sm">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((booking) => (
                        <tr
                          key={booking._id}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="p-4">
                            {booking.patientId?.username || "N/A"}
                          </td>
                          <td className="p-4">{booking.category}</td>
                          <td className="p-4">
                            {new Date(
                              booking.appointmentTime
                            ).toLocaleString()}
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                                booking.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : booking.status === "accepted"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {booking.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;






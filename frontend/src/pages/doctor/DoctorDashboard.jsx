import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartBar,
  faClock,
  faCheckCircle,
  faXmarkCircle,
  faClipboardList,
  faGear
} from '@fortawesome/free-solid-svg-icons';
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

  const statCards = [
    {
      title: "Total Appointments",
      value: stats.totalBookings,
      icon: faChartBar,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: faClock,
      gradient: "from-amber-500 to-amber-600",
    },
    {
      title: "Accepted",
      value: stats.accepted,
      icon: faCheckCircle,
      gradient: "from-green-500 to-green-600",
    },
    {
      title: "Rejected",
      value: stats.rejected,
      icon: faXmarkCircle,
      gradient: "from-red-500 to-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar user={user} onLogout={onLogout} />

      <div className="flex">
        <Sidebar role="doctor" />

        <main className="flex-1 p-8 ml-64">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            {/* Header with Profile */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Profile Picture */}
                <div className="relative">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.username}
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                {/* Welcome Text */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Doctor Dashboard
                  </h1>
                  <p className="text-gray-600">
                    Welcome back, Dr. {user.username}!
                  </p>
                </div>
              </div>

              {/* Edit Profile Button */}
              <Link to="/doctor/profile">
                <button className="btn-secondary flex items-center gap-2">
                  <FontAwesomeIcon icon={faGear} />
                  Edit Profile
                </button>
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {statCards.map((stat, idx) => (
                <div key={idx} className="relative overflow-hidden rounded-2xl bg-white border-2 border-gray-200 transition-all duration-300 hover:shadow-lg">
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-bl-full`}></div>
                  
                  <div className="relative p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-md`}>
                        <FontAwesomeIcon icon={stat.icon} className="text-2xl text-white" />
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Doctor Info */}
            <div className="mb-8">
              <div className="relative overflow-hidden rounded-2xl bg-white border-2 border-gray-200">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 opacity-10 rounded-bl-full"></div>
                
                <div className="relative p-6 text-center">
                  <div className="text-5xl mb-3">
                    ⚕️
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    Specialty
                  </h3>
                  <p className="text-sm text-gray-600">
                    {user.speciality || "Not set"}
                  </p>
                </div>
              </div>
            </div>

            {/* Pending Appointments */}
            {pendingAppointments.length > 0 && (
              <div className="rounded-2xl bg-white border-2 border-amber-300 overflow-hidden mb-8">
                <div className="p-6 border-b-2 border-amber-200 bg-amber-50">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⏱️</span>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Pending Appointments ({stats.pending})
                      </h2>
                      <p className="text-sm text-gray-600">
                        Awaiting your response
                      </p>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {pendingAppointments.map((booking) => (
                    <div key={booking._id} className="p-6 hover:bg-gray-50 transition">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          {booking.patientId?.profileImage ? (
                            <img
                              src={booking.patientId.profileImage}
                              alt={booking.patientId.username}
                              className="w-12 h-12 rounded-full object-cover border-2 border-blue-600 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-lg font-bold text-white">
                                {booking.patientId?.username?.charAt(0).toUpperCase() || "P"}
                              </span>
                            </div>
                          )}
                          <div>
                            <h3 className="font-bold text-gray-900">
                              {booking.patientId?.username || "Unknown Patient"}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {booking.patientId?.email}
                            </p>
                          </div>
                        </div>
                        <span className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold">
                          PENDING
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-gray-600 text-sm">Category</p>
                          <p className="font-semibold text-gray-900">{booking.category}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">Appointment Time</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(booking.appointmentTime).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {booking.message && (
                        <div className="mb-4">
                          <p className="text-gray-600 text-sm mb-1">Patient's Message</p>
                          <p className="text-sm bg-gray-100 p-3 rounded-lg text-gray-900">
                            {booking.message}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-3 flex-wrap">
                        <button
                          onClick={() => handleQuickAction(booking._id, "accepted")}
                          className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition text-sm font-semibold"
                        >
                          ✓ Accept
                        </button>
                        <button
                          onClick={() => handleScheduleNextDay(booking._id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm font-semibold"
                        >
                          📅 Schedule Next Day
                        </button>
                        <button
                          onClick={() => handleQuickAction(booking._id, "rejected")}
                          className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition text-sm font-semibold"
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
            <div className="rounded-2xl bg-white border-2 border-gray-200 overflow-hidden">
              <div className="p-6 border-b-2 border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Appointments
                </h2>
              </div>

              {loading ? (
                <div className="p-6 text-center">
                  <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-600 mt-2">Loading...</p>
                </div>
              ) : recentBookings.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4">📅</div>
                  <p className="text-gray-600 text-lg">No appointments yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr className="table-header">
                        <th className="text-left p-4 font-semibold text-sm">Patient</th>
                        <th className="text-left p-4 font-semibold text-sm">Category</th>
                        <th className="text-left p-4 font-semibold text-sm">Date & Time</th>
                        <th className="text-left p-4 font-semibold text-sm">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((booking) => (
                        <tr
                          key={booking._id}
                          className="border-b border-gray-200 hover:bg-gray-50 transition"
                        >
                          <td className="p-4 font-medium text-gray-900">
                            {booking.patientId?.username || "N/A"}
                          </td>
                          <td className="p-4 text-gray-700">{booking.category}</td>
                          <td className="p-4 text-gray-700">
                            {new Date(booking.appointmentTime).toLocaleString()}
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-block px-3 py-1.5 text-sm font-semibold rounded-full ${
                                booking.status === "pending"
                                  ? "bg-amber-100 text-amber-700"
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

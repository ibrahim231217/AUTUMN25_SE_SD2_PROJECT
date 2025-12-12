import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../utils/api";

const PatientDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    acceptedBookings: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get("/patient/bookings");
      if (response.data.success) {
        const bookings = response.data.data;
        setRecentBookings(bookings.slice(0, 5));
        setStats({
          totalBookings: bookings.length,
          pendingBookings: bookings.filter((b) => b.status === "pending").length,
          acceptedBookings: bookings.filter((b) => b.status === "accepted").length,
        });
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Please login first</p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-light min-h-screen">
      <Navbar user={user} onLogout={onLogout} />
      <div className="flex">
        <Sidebar role="patient" />
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="section-header">
              Welcome back, {user.username}! 👋
            </h1>
            <p className="text-gray-600 font-medium">Manage your appointments and health journey</p>
          </div>

          {/* Quick Actions */}
          <div className="grid-responsive mb-8">
            <Link
              to="/patient/doctors"
              className="card group cursor-pointer hover:shadow-lg-soft hover:border-action-500"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🔍</div>
              <h3 className="font-bold text-primary-600 group-hover:text-action-500 transition-colors">
                Find Doctors
              </h3>
              <p className="text-sm text-gray-600 mt-2">Browse available specialists</p>
            </Link>

            <Link
              to="/patient/bookings"
              className="card group cursor-pointer hover:shadow-lg-soft hover:border-secondary-600"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📋</div>
              <h3 className="font-bold text-primary-600 group-hover:text-secondary-600 transition-colors">
                My Bookings
              </h3>
              <p className="text-sm text-gray-600 mt-2">View all appointments</p>
            </Link>

            <div className="card group">
              <div className="text-4xl mb-3">👤</div>
              <h3 className="font-bold text-primary-600">My Profile</h3>
              <p className="text-sm text-gray-600 mt-2 truncate">{user.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid_responsive mb-8">
            <div className="card hover:shadow-lg-soft">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Total Bookings</p>
                  <p className="text-4xl font-bold text-primary-600 mt-2">{stats.totalBookings}</p>
                </div>
                <div className="text-5xl opacity-30 group-hover:scale-110 transition-transform">📊</div>
              </div>
            </div>

            <div className="card hover:shadow-lg-soft border-l-4 border-l-yellow-400">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Pending</p>
                  <p className="text-4xl font-bold text-yellow-500 mt-2">{stats.pendingBookings}</p>
                </div>
                <div className="text-5xl opacity-30">⏳</div>
              </div>
            </div>

            <div className="card hover:shadow-lg-soft border-l-4 border-l-green-400">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Accepted</p>
                  <p className="text-4xl font-bold text-green-500 mt-2">{stats.acceptedBookings}</p>
                </div>
                <div className="text-5xl opacity-30">✓</div>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="card">
            <div className="pb-6 border-b-2 border-neutral-medium">
              <h2 className="text-2xl font-bold text-primary-600">Recent Appointments</h2>
            </div>

            {loading ? (
              <div className="p-6 text-center">
                <div className="inline-block animate-spin">⏳</div>
                <p className="text-gray-600 mt-2">Loading appointments...</p>
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-gray-600 mb-4">No appointments yet</p>
                <Link to="/patient/doctors" className="btn-action inline-block">
                  Book Your First Appointment
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-neutral-medium">
                {recentBookings.map((booking) => (
                  <div key={booking._id} className="p-6 hover:bg-primary-50 transition-colors group cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-bold text-primary-600 group-hover:text-secondary-600 transition-colors">
                          Dr. {booking.doctorId.username}
                        </p>
                        <p className="text-sm text-secondary-600 font-semibold mt-1">
                          {booking.doctorId.speciality}
                        </p>
                        <p className="text-sm text-gray-600 mt-3 font-medium">
                          📅 {new Date(booking.appointmentTime).toLocaleDateString()} 
                          <span className="ml-2">🕐 {new Date(booking.appointmentTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </p>
                      </div>
                      <span
                        className={`ml-4 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${
                          booking.status === "accepted"
                            ? "badge-success"
                            : booking.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "badge-warning"
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
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
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Welcome, {user.username}!
          </h1>
          <p className="text-gray-600 mt-2">Manage your appointments and health</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/patient/doctors"
            className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            <div className="text-2xl mb-2">🔍</div>
            <h3 className="font-semibold">Find Doctors</h3>
            <p className="text-sm text-blue-100 mt-1">Browse specialists</p>
          </Link>

          <Link
            to="/patient/bookings"
            className="bg-slate-700 text-white p-6 rounded-lg hover:bg-slate-800 transition shadow-sm"
          >
            <div className="text-2xl mb-2">📋</div>
            <h3 className="font-semibold">My Bookings</h3>
            <p className="text-sm text-slate-300 mt-1">View appointments</p>
          </Link>

          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
            <div className="text-2xl mb-2">👤</div>
            <h3 className="font-semibold text-gray-800">Profile</h3>
            <p className="text-sm text-gray-600 mt-1">{user.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Bookings</p>
                <p className="text-3xl font-bold text-slate-800">{stats.totalBookings}</p>
              </div>
              <div className="text-3xl opacity-20">📊</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending</p>
                <p className="text-3xl font-bold text-slate-800">{stats.pendingBookings}</p>
              </div>
              <div className="text-3xl opacity-20">⏳</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Accepted</p>
                <p className="text-3xl font-bold text-slate-800">{stats.acceptedBookings}</p>
              </div>
              <div className="text-3xl opacity-20">✓</div>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-slate-800">Recent Appointments</h2>
          </div>

          {loading ? (
            <div className="p-6 text-center text-gray-600">Loading...</div>
          ) : recentBookings.length === 0 ? (
            <div className="p-6 text-center text-gray-600">
              No appointments yet. <Link to="/patient/doctors" className="text-blue-600 hover:underline">Book now</Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recentBookings.map((booking) => (
                <div key={booking._id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">
                        Dr. {booking.doctorId.username}
                      </p>
                      <p className="text-sm text-gray-600">
                        {booking.doctorId.speciality}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        {new Date(booking.appointmentTime).toLocaleDateString()} at{" "}
                        {new Date(booking.appointmentTime).toLocaleTimeString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.status === "accepted"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
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
  );
};

export default PatientDashboard;

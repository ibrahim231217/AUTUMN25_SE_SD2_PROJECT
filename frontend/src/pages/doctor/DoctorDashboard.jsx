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
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get("/doctor/bookings");
      const bookings = response.data.data;

      setStats({
        totalBookings: bookings.length,
        pending: bookings.filter((b) => b.status === "pending").length,
        accepted: bookings.filter((b) => b.status === "accepted").length,
        rejected: bookings.filter((b) => b.status === "rejected").length,
      });

      setRecentBookings(bookings.slice(0, 5));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />

      <div className="flex">
        <Sidebar role="doctor" />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Doctor Dashboard</h1>
            <p className="text-gray-600 mb-8">
              Welcome back, Dr. {user.username}!
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="stats shadow bg-white">
                <div className="stat">
                  <div className="stat-title">Total Appointments</div>
                  <div className="stat-value text-primary">
                    {stats.totalBookings}
                  </div>
                </div>
              </div>

              <div className="stats shadow bg-white">
                <div className="stat">
                  <div className="stat-title">Pending</div>
                  <div className="stat-value text-warning">{stats.pending}</div>
                </div>
              </div>

              <div className="stats shadow bg-white">
                <div className="stat">
                  <div className="stat-title">Accepted</div>
                  <div className="stat-value text-success">
                    {stats.accepted}
                  </div>
                </div>
              </div>

              <div className="stats shadow bg-white">
                <div className="stat">
                  <div className="stat-title">Rejected</div>
                  <div className="stat-value text-error">{stats.rejected}</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Link
                to="/doctor/bookings"
                className="card bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                <div className="card-body">
                  <h2 className="card-title text-2xl">Manage Appointments</h2>
                  <p>Review and respond to patient bookings</p>
                  <div className="text-4xl">📅</div>
                </div>
              </Link>

              <Link
                to="/doctor/profile"
                className="card bg-green-500 text-white hover:bg-green-600 transition"
              >
                <div className="card-body">
                  <h2 className="card-title text-2xl">Update Profile</h2>
                  <p>Edit your profile information and specialty</p>
                  <div className="text-4xl">👤</div>
                </div>
              </Link>
            </div>

            {/* Profile Info */}
            <div className="card bg-white shadow-xl mb-8">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">Your Profile</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-600">Specialty</p>
                    <p className="font-semibold text-lg">{user.speciality}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Experience</p>
                    <p className="font-semibold text-lg">
                      {user.experience} years
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-gray-600">About</p>
                    <p className="text-sm">
                      {user.description || "No description added yet"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="card bg-white shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">
                  Recent Appointments
                </h2>

                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : recentBookings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No appointments yet
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Patient</th>
                          <th>Category</th>
                          <th>Date & Time</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentBookings.map((booking) => (
                          <tr key={booking._id}>
                            <td>{booking.patientId?.username || "N/A"}</td>
                            <td>{booking.category}</td>
                            <td>
                              {new Date(
                                booking.appointmentTime
                              ).toLocaleString()}
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  booking.status === "pending"
                                    ? "badge-warning"
                                    : booking.status === "accepted"
                                    ? "badge-success"
                                    : "badge-error"
                                }`}
                              >
                                {booking.status}
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;






import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../utils/api";

const AdminDashboard = ({ user, onLogout }) => {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalBookings: 0,
    pendingBookings: 0,
    acceptedBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [doctorsRes, bookingsRes] = await Promise.all([
        api.get("/admin/doctors"),
        api.get("/admin/bookings"),
      ]);

      const doctors = doctorsRes.data.data;
      const bookings = bookingsRes.data.data;

      setStats({
        totalDoctors: doctors.length,
        totalBookings: bookings.length,
        pendingBookings: bookings.filter((b) => b.status === "pending").length,
        acceptedBookings: bookings.filter((b) => b.status === "accepted")
          .length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />

      <div className="flex">
        <Sidebar role="admin" />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 mb-8">
              Manage the entire hospital system
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="stats shadow bg-white">
                <div className="stat">
                  <div className="stat-title">Total Doctors</div>
                  <div className="stat-value text-primary">
                    {stats.totalDoctors}
                  </div>
                  <div className="stat-desc">Registered specialists</div>
                </div>
              </div>

              <div className="stats shadow bg-white">
                <div className="stat">
                  <div className="stat-title">Total Bookings</div>
                  <div className="stat-value text-secondary">
                    {stats.totalBookings}
                  </div>
                  <div className="stat-desc">All appointments</div>
                </div>
              </div>

              <div className="stats shadow bg-white">
                <div className="stat">
                  <div className="stat-title">Pending</div>
                  <div className="stat-value text-warning">
                    {stats.pendingBookings}
                  </div>
                  <div className="stat-desc">Awaiting response</div>
                </div>
              </div>

              <div className="stats shadow bg-white">
                <div className="stat">
                  <div className="stat-title">Accepted</div>
                  <div className="stat-value text-success">
                    {stats.acceptedBookings}
                  </div>
                  <div className="stat-desc">Confirmed appointments</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Link
                to="/admin/add-doctor"
                className="card bg-blue-500 text-white hover:bg-blue-600 transition"
              >
                <div className="card-body">
                  <h2 className="card-title text-xl">Add Doctor</h2>
                  <p>Register a new doctor to the system</p>
                  <div className="text-4xl">➕👨‍⚕️</div>
                </div>
              </Link>

              <Link
                to="/admin/add-admin"
                className="card bg-purple-500 text-white hover:bg-purple-600 transition"
              >
                <div className="card-body">
                  <h2 className="card-title text-xl">Add Admin</h2>
                  <p>Create a new admin account</p>
                  <div className="text-4xl">🔐</div>
                </div>
              </Link>

              <Link
                to="/admin/doctors"
                className="card bg-green-500 text-white hover:bg-green-600 transition"
              >
                <div className="card-body">
                  <h2 className="card-title text-xl">Manage Doctors</h2>
                  <p>View, edit, or remove doctors</p>
                  <div className="text-4xl">👥</div>
                </div>
              </Link>

              <Link
                to="/admin/bookings"
                className="card bg-orange-500 text-white hover:bg-orange-600 transition"
              >
                <div className="card-body">
                  <h2 className="card-title text-xl">View All Bookings</h2>
                  <p>Monitor all appointments system-wide</p>
                  <div className="text-4xl">📋</div>
                </div>
              </Link>
            </div>

            {/* System Overview */}
            <div className="card bg-white shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">System Overview</h2>
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="font-semibold">Active Doctors</span>
                      <span className="text-2xl text-primary">
                        {stats.totalDoctors}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="font-semibold">
                        Pending Appointments
                      </span>
                      <span className="text-2xl text-warning">
                        {stats.pendingBookings}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="font-semibold">Success Rate</span>
                      <span className="text-2xl text-success">
                        {stats.totalBookings > 0
                          ? Math.round(
                              (stats.acceptedBookings / stats.totalBookings) *
                                100
                            )
                          : 0}
                        %
                      </span>
                    </div>
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

export default AdminDashboard;

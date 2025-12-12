import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../utils/api";

const AdminDashboard = ({ user, onLogout }) => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    pendingDoctors: 0,
    totalAppointments: 0,
    appointmentsToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch all data for statistics
      const [usersRes, bookingsRes] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/bookings"),
      ]);

      const users = usersRes.data.data || [];
      const bookings = bookingsRes.data.data || [];

      // Separate patients and doctors
      const patients = users.filter((u) => u.role === "patient");
      const doctors = users.filter((u) => u.role === "doctor");
      const pendingDoctors = users.filter(
        (u) => u.role === "doctor" && u.isApproved === false
      );

      // Count today's appointments
      const today = new Date().toDateString();
      const appointmentsToday = bookings.filter((b) => {
        const bookingDate = new Date(b.date).toDateString();
        return bookingDate === today;
      });

      setStats({
        totalPatients: patients.length,
        totalDoctors: doctors.length,
        pendingDoctors: pendingDoctors.length,
        totalAppointments: bookings.length,
        appointmentsToday: appointmentsToday.length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Patients",
      value: stats.totalPatients,
      icon: "👨‍🦱",
      color: "bg-blue-50 border-blue-200",
      link: "/admin/manage-patients",
    },
    {
      title: "Total Doctors",
      value: stats.totalDoctors,
      icon: "👨‍⚕️",
      color: "bg-green-50 border-green-200",
      link: "/admin/manage-doctors",
    },
    {
      title: "Pending Doctor Approvals",
      value: stats.pendingDoctors,
      icon: "⏳",
      color: "bg-yellow-50 border-yellow-200",
      link: "/admin/doctor-approvals",
      highlight: stats.pendingDoctors > 0,
    },
    {
      title: "Total Appointments",
      value: stats.totalAppointments,
      icon: "📅",
      color: "bg-purple-50 border-purple-200",
      link: "/admin/all-bookings",
    },
    {
      title: "Appointments Today",
      value: stats.appointmentsToday,
      icon: "📌",
      color: "bg-orange-50 border-orange-200",
      link: "/admin/all-bookings",
    },
  ];

  return (
    <div className="page-container">
      <Navbar user={user} onLogout={onLogout} />

      <div className="flex">
        <Sidebar role="admin" />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-10">
              <h1 className="section-header mb-2">
                Admin Dashboard
              </h1>
              <p className="section-subtitle">
                Manage doctors, patients, and system operations
              </p>
            </div>

            {/* Stats Grid */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading statistics...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
                  {statCards.map((stat, idx) => (
                    <Link key={idx} to={stat.link}>
                      <div
                        className={`card-elevated rounded-xl p-6 cursor-pointer ${
                          stat.highlight ? "ring-2 ring-action-500" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              {stat.title}
                            </p>
                            <p className="text-3xl font-bold text-primary-600 mt-2">
                              {stat.value}
                            </p>
                          </div>
                          <div className="text-3xl">{stat.icon}</div>
                        </div>
                        {stat.highlight && (
                          <p className="text-xs text-action-500 mt-2 font-semibold">
                            Action required
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="card bg-white rounded-xl p-8 mb-12">
                  <h2 className="text-2xl font-bold text-primary-600 mb-6">
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                      to="/admin/manage-doctors"
                      className="card group rounded-xl text-center"
                    >
                      <div className="text-4xl mb-3 group-hover:scale-125 transition-transform">👨‍⚕️</div>
                      <h3 className="font-semibold text-primary-600 mb-1">
                        Manage Doctors
                      </h3>
                      <p className="text-xs text-gray-600">
                        View and manage doctors
                      </p>
                    </Link>

                    <Link
                      to="/admin/doctor-approvals"
                      className="card group rounded-xl text-center"
                    >
                      <div className="text-4xl mb-3 group-hover:scale-125 transition-transform">✅</div>
                      <h3 className="font-semibold text-primary-600 mb-1">
                        Approve Doctors
                      </h3>
                      <p className="text-xs text-gray-600">
                        Review pending applications
                      </p>
                    </Link>

                    <Link
                      to="/admin/manage-patients"
                      className="card group rounded-xl text-center"
                    >
                      <div className="text-4xl mb-3 group-hover:scale-125 transition-transform">👨‍🦱</div>
                      <h3 className="font-semibold text-primary-600 mb-1">
                        Manage Patients
                      </h3>
                      <p className="text-xs text-gray-600">
                        View patient list
                      </p>
                    </Link>

                    <Link
                      to="/admin/all-bookings"
                      className="card p-4 border-2 border-purple-200 rounded-xl hover:bg-purple-50 transition text-center group"
                    >
                      <div className="text-3xl mb-2 group-hover:scale-110 transition">📅</div>
                      <h3 className="font-semibold text-primary-600">
                        All Bookings
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        View all appointments
                      </p>
                    </Link>
                  </div>
                </div>

                {/* Recent Activity or Info Box */}
                <div className="card bg-gradient-to-r from-primary-50 to-secondary-50 border-2 border-primary-200 rounded-xl p-8">
                  <h3 className="text-lg font-bold text-primary-600 mb-2">
                    System Information
                  </h3>
                  <p className="text-primary-700 text-sm">
                    Welcome to the Admin Dashboard. Use the navigation menu to manage doctors, patients,
                    and view system statistics. Pending doctor approvals are highlighted above and require
                    immediate attention.
                  </p>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

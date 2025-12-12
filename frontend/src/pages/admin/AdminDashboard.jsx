import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers,
  faUserDoctor,
  faClock,
  faClipboardList,
  faCalendarDay,
  faCheckCircle,
  faStethoscope
} from '@fortawesome/free-solid-svg-icons';
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
      icon: faUsers,
      gradient: "from-blue-500 to-blue-600",
      bgLight: "bg-blue-50",
      link: "/admin/manage-patients",
    },
    {
      title: "Total Doctors",
      value: stats.totalDoctors,
      icon: faStethoscope,
      gradient: "from-green-500 to-green-600",
      bgLight: "bg-green-50",
      link: "/admin/manage-doctors",
    },
    {
      title: "Pending Approvals",
      value: stats.pendingDoctors,
      icon: faClock,
      gradient: "from-amber-500 to-amber-600",
      bgLight: "bg-amber-50",
      link: "/admin/doctor-approvals",
      highlight: stats.pendingDoctors > 0,
    },
    {
      title: "Total Appointments",
      value: stats.totalAppointments,
      icon: faClipboardList,
      gradient: "from-purple-500 to-purple-600",
      bgLight: "bg-purple-50",
      link: "/admin/all-bookings",
    },
    {
      title: "Today's Appointments",
      value: stats.appointmentsToday,
      icon: faCalendarDay,
      gradient: "from-pink-500 to-pink-600",
      bgLight: "bg-pink-50",
      link: "/admin/all-bookings",
    },
  ];


  return (
    <div className="page-container">
      <Navbar user={user} onLogout={onLogout} />

      <div className="flex">
        <Sidebar role="admin" />

        <main className="flex-1 p-8 ml-64">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Manage doctors, patients, and system operations
              </p>
            </div>

            {/* Stats Grid */}
            {loading ? (
              <div className="card text-center py-12">
                <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading statistics...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                  {statCards.map((stat, idx) => (
                    <Link key={idx} to={stat.link}>
                      <div className={`relative overflow-hidden rounded-2xl bg-white border-2 ${stat.highlight ? 'border-amber-400 shadow-lg' : 'border-gray-200'} transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer`}>
                        {/* Gradient Background */}
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-bl-full`}></div>
                        
                        {/* Content */}
                        <div className="relative p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-md`}>
                              <FontAwesomeIcon icon={stat.icon} className="text-2xl text-white" />
                            </div>
                            {stat.highlight && (
                              <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                                Action Required
                              </span>
                            )}
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
                    </Link>
                  ))}
                </div>


                {/* System Information */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 p-8">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 opacity-20 rounded-bl-full"></div>
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-xl">
                        ℹ️
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        System Information
                      </h3>
                    </div>
                    <p className="text-gray-700">
                      Welcome to the Admin Dashboard. Use the navigation menu to manage doctors, patients,
                      and view system statistics. Pending doctor approvals are highlighted above and require
                      immediate attention.
                    </p>
                  </div>
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

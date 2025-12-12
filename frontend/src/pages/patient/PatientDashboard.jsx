import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartBar,
  faClock,
  faCheckCircle,
  faGear
} from '@fortawesome/free-solid-svg-icons';
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
        setRecentBookings(bookings.slice(0, 3)); // Show only 3 recent appointments
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


  const statCards = [
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: faChartBar,
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Pending",
      value: stats.pendingBookings,
      icon: faClock,
      gradient: "from-amber-500 to-amber-600",
    },
    {
      title: "Confirmed",
      value: stats.acceptedBookings,
      icon: faCheckCircle,
      gradient: "from-green-500 to-green-600",
    },
  ];

  return (
    <div className="bg-neutral-50 min-h-screen">
      <Navbar user={user} onLogout={onLogout} />
      <div className="flex">
        <Sidebar role="patient" />
        <div className="flex-1 p-8 ml-64">
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
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              {/* Welcome Text */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back, {user.username}! 👋
                </h1>
                <p className="text-gray-600">Manage your appointments and health journey</p>
              </div>
            </div>

            {/* Edit Profile Button */}
            <Link to="/patient/profile">
              <button className="btn-secondary flex items-center gap-2">
                <FontAwesomeIcon icon={faGear} />
                Edit Profile
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          </div>

          {/* Recent Bookings */}
          <div className="rounded-2xl bg-white border-2 border-gray-200 overflow-hidden">
            <div className="p-6 border-b-2 border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Recent Appointments</h2>
            </div>

            {loading ? (
              <div className="p-6 text-center">
                <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 mt-2">Loading appointments...</p>
              </div>
            ) : recentBookings.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">📅</div>
                <p className="text-gray-600 mb-4 text-lg">No appointments yet</p>
                <Link to="/patient/doctors" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">
                  Book Your First Appointment
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {recentBookings.map((booking) => (
                  <div key={booking._id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {booking.doctorId.profileImage ? (
                            <img
                              src={booking.doctorId.profileImage}
                              alt={`Dr. ${booking.doctorId.username}`}
                              className="w-10 h-10 rounded-full object-cover border-2 border-green-600"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold">
                              {booking.doctorId.username?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-gray-900">
                              Dr. {booking.doctorId.username}
                            </p>
                            <p className="text-sm text-gray-600">
                              {booking.doctorId.speciality}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            📅 {new Date(booking.appointmentTime).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            🕐 {new Date(booking.appointmentTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap ${
                          booking.status === "accepted"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
              
            {!loading && recentBookings.length > 0 && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <Link
                  to="/patient/bookings"
                  className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
                >
                  View All Appointments →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;

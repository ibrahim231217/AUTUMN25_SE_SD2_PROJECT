import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ role }) => {
  const location = useLocation();

  const patientLinks = [
    { path: "/patient/dashboard", label: "Dashboard", icon: "🏠" },
    { path: "/patient/doctors", label: "Find Doctors", icon: "👨‍⚕️" },
    { path: "/patient/bookings", label: "My Bookings", icon: "📅" },
  ];

  const doctorLinks = [
    { path: "/doctor/dashboard", label: "Dashboard", icon: "🏠" },
    { path: "/doctor/bookings", label: "Appointments", icon: "📅" },
    { path: "/doctor/profile", label: "My Profile", icon: "👤" },
  ];

  const adminLinks = [
    { path: "/admin/dashboard", label: "Dashboard", icon: "🏠" },
    { path: "/admin/doctor-approvals", label: "Approve Doctors", icon: "✅" },
    { path: "/admin/manage-doctors", label: "Manage Doctors", icon: "👨‍⚕️" },
    { path: "/admin/manage-patients", label: "Manage Patients", icon: "👨‍🦱" },
    { path: "/admin/all-bookings", label: "All Bookings", icon: "📋" },
    { path: "/admin/add-admin", label: "Add Admin", icon: "🔐" },
  ];

  let links = [];
  if (role === "patient") links = patientLinks;
  if (role === "doctor") links = doctorLinks;
  if (role === "admin") links = adminLinks;

  return (
    <aside className="w-64 bg-white border-r-2 border-neutral-medium min-h-screen p-4 sticky top-16 overflow-y-auto shadow-soft">
      <nav className="space-y-2">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-primary-100 text-primary-600 border-l-4 border-primary-600"
                  : "text-gray-700 hover:bg-primary-50 hover:text-primary-600"
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span className="text-sm">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;

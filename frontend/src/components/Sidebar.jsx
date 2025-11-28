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
    { path: "/admin/add-doctor", label: "Add Doctor", icon: "➕" },
    { path: "/admin/add-admin", label: "Add Admin", icon: "🔐" },
    { path: "/admin/doctors", label: "Manage Doctors", icon: "👨‍⚕️" },
    { path: "/admin/bookings", label: "All Bookings", icon: "📋" },
  ];

  let links = [];
  if (role === "patient") links = patientLinks;
  if (role === "doctor") links = doctorLinks;
  if (role === "admin") links = adminLinks;

  return (
    <aside className="w-64 bg-base-200 min-h-screen p-4">
      <ul className="menu">
        {links.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={location.pathname === link.path ? "active" : ""}
            >
              <span className="text-xl">{link.icon}</span>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;

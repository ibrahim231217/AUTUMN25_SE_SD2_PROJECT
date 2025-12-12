import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faStethoscope, 
  faCalendarCheck,
  faUserDoctor,
  faUsers,
  faClipboardList,
  faUserPlus,
  faGear,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ role }) => {
  const location = useLocation();

  const patientLinks = [
    { path: "/patient/dashboard", label: "Dashboard", icon: faChartLine },
    { path: "/patient/doctors", label: "Find Doctors", icon: faStethoscope },
    { path: "/patient/bookings", label: "My Bookings", icon: faClipboardList },
  ];

  const doctorLinks = [
    { path: "/doctor/dashboard", label: "Dashboard", icon: faChartLine },
    { path: "/doctor/bookings", label: "Appointments", icon: faClipboardList },
    { path: "/doctor/profile", label: "My Profile", icon: faGear },
  ];

  const adminLinks = [
    { path: "/admin/dashboard", label: "Dashboard", icon: faChartLine },
    { path: "/admin/doctor-approvals", label: "Approve Doctors", icon: faCheckCircle },
    { path: "/admin/manage-doctors", label: "Manage Doctors", icon: faUserDoctor },
    { path: "/admin/manage-patients", label: "Manage Patients", icon: faUsers },
    { path: "/admin/all-bookings", label: "All Bookings", icon: faClipboardList },
    { path: "/admin/add-admin", label: "Add Admin", icon: faUserPlus },
  ];

  let links = [];
  if (role === "patient") links = patientLinks;
  if (role === "doctor") links = doctorLinks;
  if (role === "admin") links = adminLinks;

  return (
    <aside className="w-64 bg-white border-r-2 border-neutral-medium h-screen p-4 fixed left-0 top-0 overflow-y-auto shadow-soft">
      <div className="flex items-center gap-3 mb-8 pt-2">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center text-white text-xl">
          <FontAwesomeIcon icon={faStethoscope} />
        </div>
        <div>
          <h2 className="font-bold text-primary-600 text-lg">MediCare</h2>
          <p className="text-xs text-gray-500 capitalize">{role} Portal</p>
        </div>
      </div>

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
              <FontAwesomeIcon icon={link.icon} className="text-lg" />
              <span className="text-sm">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;

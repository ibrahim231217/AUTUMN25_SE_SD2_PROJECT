import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    switch (user.role) {
      case "patient":
        return "/patient/dashboard";
      case "doctor":
        return "/doctor/dashboard";
      case "admin":
        return "/admin/dashboard";
      default:
        return "/";
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-2 border-neutral-medium shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Brand */}
          <Link
            to={getDashboardLink()}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center text-white font-bold shadow-medium">
              ⚕️
            </div>
            <span className="text-2xl font-bold text-primary-600 hidden sm:inline">
              MediCare
            </span>
          </Link>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-primary-300 transition-colors">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.username}
                      className="w-8 h-8 rounded-full object-cover border-2 border-primary-500"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="pr-2">
                    <p className="text-xs font-semibold text-gray-900 leading-tight">
                      {user.username}
                    </p>
                    <p className="text-[10px] text-gray-500 capitalize leading-tight">
                      {user.role}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white rounded-lg border border-gray-200 transition-all hover:bg-red-50 hover:border-red-300 hover:text-red-600 active:scale-95"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-action text-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

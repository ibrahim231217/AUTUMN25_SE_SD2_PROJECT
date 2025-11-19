import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";

// Public Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Patient Pages
import PatientDashboard from "./pages/patient/PatientDashboard";
import DoctorList from "./pages/patient/DoctorList";
import BookAppointment from "./pages/patient/BookAppointment.jsx";
import MyBookings from "./pages/patient/MyBookings";

// Doctor Pages
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorBookings from "./pages/doctor/DoctorBookings";
import DoctorProfile from "./pages/doctor/DoctorProfile.jsx";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddDoctor from "./pages/admin/AddDoctor";
import AddAdmin from "./pages/admin/AddAdmin";
import ManageDoctors from "./pages/admin/ManageDoctors";
import AllBookings from "./pages/admin/AllBookings";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (userData && token) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />

        {/* Patient Routes */}
        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute user={user} role="patient">
              <PatientDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/doctors"
          element={
            <ProtectedRoute user={user} role="patient">
              <DoctorList user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/book/:doctorId"
          element={
            <ProtectedRoute user={user} role="patient">
              <BookAppointment user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/bookings"
          element={
            <ProtectedRoute user={user} role="patient">
              <MyBookings user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Doctor Routes */}
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute user={user} role="doctor">
              <DoctorDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/bookings"
          element={
            <ProtectedRoute user={user} role="doctor">
              <DoctorBookings user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/profile"
          element={
            <ProtectedRoute user={user} role="doctor">
              <DoctorProfile user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute user={user} role="admin">
              <AdminDashboard user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-doctor"
          element={
            <ProtectedRoute user={user} role="admin">
              <AddDoctor user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-admin"
          element={
            <ProtectedRoute user={user} role="admin">
              <AddAdmin user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/doctors"
          element={
            <ProtectedRoute user={user} role="admin">
              <ManageDoctors user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute user={user} role="admin">
              <AllBookings user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

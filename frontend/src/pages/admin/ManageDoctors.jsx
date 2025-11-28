import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../utils/api";

const ManageDoctors = ({ user, onLogout }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [savingId, setSavingId] = useState(null);

  const specialities = [
    "Dermatologist",
    "Pathologist",
    "Neurologist",
    "Cardiologist",
    "Endocrinologist",
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await api.get("/admin/doctors");
      setDoctors(response.data.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor._id);
    setEditFormData({
      username: doctor.username,
      email: doctor.email,
      speciality: doctor.speciality,
      experience: doctor.experience,
      description: doctor.description || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingDoctor(null);
    setEditFormData({});
  };

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveEdit = async (doctorId) => {
    setSavingId(doctorId);

    try {
      const response = await api.patch(
        `/admin/update-doctor/${doctorId}`,
        editFormData
      );

      if (response.data.success) {
        setDoctors(
          doctors.map((doc) =>
            doc._id === doctorId ? response.data.data : doc
          )
        );
        setEditingDoctor(null);
        alert("Doctor updated successfully!");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update doctor");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (doctorId, doctorName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete Dr. ${doctorName}? This action cannot be undone and will delete all their associated bookings.`
      )
    ) {
      return;
    }

    try {
      const response = await api.delete(`/admin/delete-doctor/${doctorId}`);

      if (response.data.success) {
        setDoctors(doctors.filter((doc) => doc._id !== doctorId));
        alert("Doctor deleted successfully");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete doctor");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />

      <div className="flex">
        <Sidebar role="admin" />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Manage Doctors</h1>
              <div className="badge badge-lg badge-primary">
                {doctors.length} Doctors
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : doctors.length === 0 ? (
              <div className="card bg-white shadow-lg">
                <div className="card-body text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No doctors registered yet
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-6">
                {doctors.map((doctor) => (
                  <div key={doctor._id} className="card bg-white shadow-xl">
                    <div className="card-body">
                      {editingDoctor === doctor._id ? (
                        // Edit Mode
                        <div>
                          <h3 className="font-bold text-lg mb-4">
                            Edit Doctor
                          </h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="form-control">
                              <label className="label">
                                <span className="label-text">Username</span>
                              </label>
                              <input
                                type="text"
                                name="username"
                                className="input input-bordered input-sm"
                                value={editFormData.username}
                                onChange={handleEditChange}
                              />
                            </div>

                            <div className="form-control">
                              <label className="label">
                                <span className="label-text">Email</span>
                              </label>
                              <input
                                type="email"
                                name="email"
                                className="input input-bordered input-sm"
                                value={editFormData.email}
                                onChange={handleEditChange}
                              />
                            </div>

                            <div className="form-control">
                              <label className="label">
                                <span className="label-text">Specialty</span>
                              </label>
                              <select
                                name="speciality"
                                className="select select-bordered select-sm"
                                value={editFormData.speciality}
                                onChange={handleEditChange}
                              >
                                {specialities.map((spec) => (
                                  <option key={spec} value={spec}>
                                    {spec}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="form-control">
                              <label className="label">
                                <span className="label-text">
                                  Experience (years)
                                </span>
                              </label>
                              <input
                                type="number"
                                name="experience"
                                className="input input-bordered input-sm"
                                value={editFormData.experience}
                                onChange={handleEditChange}
                                min="0"
                              />
                            </div>

                            <div className="form-control md:col-span-2">
                              <label className="label">
                                <span className="label-text">Description</span>
                              </label>
                              <textarea
                                name="description"
                                className="textarea textarea-bordered"
                                value={editFormData.description}
                                onChange={handleEditChange}
                              ></textarea>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() => handleSaveEdit(doctor._id)}
                              className={`btn btn-success btn-sm ${
                                savingId === doctor._id ? "loading" : ""
                              }`}
                              disabled={savingId === doctor._id}
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="btn btn-ghost btn-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                              <div className="avatar placeholder">
                                <div className="bg-primary text-white rounded-full w-16">
                                  <span className="text-2xl">
                                    {doctor.username.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <h3 className="font-bold text-xl">
                                  Dr. {doctor.username}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {doctor.email}
                                </p>
                                <div className="flex gap-2 mt-1">
                                  <span className="badge badge-primary badge-sm">
                                    {doctor.speciality}
                                  </span>
                                  <span className="badge badge-ghost badge-sm">
                                    {doctor.experience} years
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(doctor)}
                                className="btn btn-sm btn-info"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleDelete(doctor._id, doctor.username)
                                }
                                className="btn btn-sm btn-error"
                              >
                                Delete
                              </button>
                            </div>
                          </div>

                          {doctor.description && (
                            <div className="mt-4">
                              <p className="text-sm text-gray-600">About:</p>
                              <p className="text-sm">{doctor.description}</p>
                            </div>
                          )}

                          <div className="mt-4 text-xs text-gray-500">
                            <p>
                              Registered:{" "}
                              {new Date(doctor.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManageDoctors;

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import api from "../../utils/api";

const AddDoctor = ({ user, onLogout }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    speciality: "",
    experience: 0,
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const specialities = [
    "Dermatologist",
    "Pathologist",
    "Neurologist",
    "Cardiologist",
    "Endocrinologist",
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await api.post("/admin/add-doctor", formData);

      if (response.data.success) {
        setMessage({
          type: "success",
          text: "Doctor added successfully!",
        });

        // Reset form
        setFormData({
          username: "",
          email: "",
          password: "",
          speciality: "",
          experience: 0,
          description: "",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to add doctor",
      });
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
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Add New Doctor</h1>

            <div className="card bg-white shadow-xl">
              <div className="card-body">
                {message.text && (
                  <div
                    className={`alert ${
                      message.type === "success"
                        ? "alert-success"
                        : "alert-error"
                    } mb-4`}
                  >
                    <span>{message.text}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Username</span>
                      </label>
                      <input
                        type="text"
                        name="username"
                        placeholder="Enter username"
                        className="input input-bordered"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        minLength="3"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Email</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        className="input input-bordered"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Password</span>
                      </label>
                      <input
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        className="input input-bordered"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength="6"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Specialty</span>
                      </label>
                      <select
                        name="speciality"
                        className="select select-bordered"
                        value={formData.speciality}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select specialty</option>
                        {specialities.map((spec) => (
                          <option key={spec} value={spec}>
                            {spec}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Years of Experience</span>
                      </label>
                      <input
                        type="number"
                        name="experience"
                        placeholder="Years"
                        className="input input-bordered"
                        value={formData.experience}
                        onChange={handleChange}
                        min="0"
                        max="50"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-control mt-4">
                    <label className="label">
                      <span className="label-text">Description</span>
                    </label>
                    <textarea
                      name="description"
                      className="textarea textarea-bordered h-24"
                      placeholder="Doctor's bio and qualifications..."
                      value={formData.description}
                      onChange={handleChange}
                      maxLength="500"
                    ></textarea>
                    <label className="label">
                      <span className="label-text-alt">
                        {formData.description.length}/500 characters
                      </span>
                    </label>
                  </div>

                  <div className="form-control mt-6">
                    <button
                      type="submit"
                      className={`btn btn-primary ${loading ? "loading" : ""}`}
                      disabled={loading}
                    >
                      {loading ? "Adding Doctor..." : "Add Doctor"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddDoctor;

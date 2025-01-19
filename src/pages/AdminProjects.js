import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Admin.css";
import { getAuthToken, removeAuthToken } from "../utils/authUtils";
import withAuth from "../components/ProtectedRoute";

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [modal, setModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = getAuthToken();
        const response = await fetch("https://backend-dsnap.vercel.app/api/portfolio", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          if (response.status === 401) {
            removeAuthToken();
            navigate("/login");
            return;
          }
          throw new Error("Gagal mengambil data proyek");
        }
        const data = await response.json();
        setProjects(
          data.map((item) => ({
            id: item.id,
            nama: item.eventName,
            gambar: item.imageUrl,
          }))
        );
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [navigate]);

  const handleLogout = () => {
    removeAuthToken();
    navigate("/");
  };

  const handleAdd = () => {
    setEditData(null);
    setModal(true);
  };

  const handleEdit = (project) => {
    setEditData(project);
    setModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Anda yakin ingin menghapus proyek ini?")) {
      try {
        const response = await fetch(`https://backend-dsnap.vercel.app/api/portfolio/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Gagal menghapus proyek");
        }

        setProjects(projects.filter((project) => project.id !== id));
        alert("Proyek berhasil dihapus");
      } catch (error) {
        console.error("Error deleting project:", error);
        alert(`Gagal menghapus proyek: ${error.message}`);
      }
    }
  };

  const handleSave = async (formData) => {
    const url = editData
      ? `https://backend-dsnap.vercel.app/api/portfolio/${editData.id}`
      : `https://backend-dsnap.vercel.app/api/portfolio`;

    const method = editData ? "PUT" : "POST";
    const payload = new FormData();
    payload.append("eventName", formData.nama);
    if (formData.gambar) payload.append("image", formData.gambar);

    try {
      const response = await fetch(url, {
        method,
        body: payload,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Gagal ${editData ? "mengupdate" : "menambahkan"} proyek`
        );
      }

      const updatedData = await fetch("https://backend-dsnap.vercel.app/api/portfolio").then((res) => res.json());
      setProjects(
        updatedData.map((item) => ({
          id: item.id,
          nama: item.eventName,
          gambar: item.imageUrl,
        }))
      );
      setModal(false);
    } catch (error) {
      console.error("Error saving project:", error);
      alert(error.message);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <img src={require("../assets/logo.png")} alt="Logo d'snap" className="admin-logo" />
        <ul className="admin-menu">
          <li><a href="/admin" className="menu-link">Home</a></li>
          <li><a href="/adminprojects" className="menu-link active">Projects</a></li>
          <li><a href="/reservation" className="menu-link">Reservation</a></li>
        </ul>
      </div>
      <div className="admin-content">
        <h1 className="admin-title">Projects</h1>
        <button className="add-button" onClick={handleAdd}>TAMBAH</button>
        <div className="table-container">
          <table className="reservation-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Event</th>
                <th>Gambar Event</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr key={project.id}>
                  <td>{index + 1}</td>
                  <td>{project.nama}</td>
                  <td>
                    {project.gambar ? (
                      <img
                        src={`${project.gambar}`}
                        alt={project.nama}
                        style={{ width: "225px" }}
                      />
                    ) : (
                      "Belum ada gambar"
                    )}
                  </td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(project)}>EDIT</button>
                    <button className="delete-btn" onClick={() => handleDelete(project.id)}>DELETE</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="logout-button" onClick={handleLogout}>
        <img src={require("../assets/LogoutLogo.png")} alt="Logout" className="logout-logo" />
      </div>
      {modal && (
        <Modal data={editData} onClose={() => setModal(false)} onSave={handleSave} />
      )}
    </div>
  );
};

const Modal = ({ data, onClose, onSave }) => {
  const [formData, setFormData] = useState(data || { nama: "", gambar: null });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, gambar: file });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 style={{ color: "#004d00" }}>{data ? "Edit Project" : "Tambah Project"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nama Event</label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Gambar Event</label>
            <input type="file" name="gambar" onChange={handleFileChange} />
          </div>
          <div className="form-buttons">
            <button type="submit" className="save-button">Simpan</button>
            <button type="button" className="cancel-button" onClick={onClose}>Batal</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProjects;

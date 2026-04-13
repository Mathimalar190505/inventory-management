import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE from "../api";

const Suppliers = () => {
  const [addModal, setAddModal] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    address: "",
  });

  const token = localStorage.getItem("pos-token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/supplier",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuppliers(response.data.suppliers || []);
    } catch (error) {
      console.error("Error fetching suppliers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleEdit = (supplier) => {
    setFormData({
      name: supplier.name,
      email: supplier.email,
      number: supplier.number,
      address: supplier.address,
    });
    setEditSupplier(supplier._id);
    setAddModal(true);
  };

  const closeModal = () => {
    setAddModal(false);
    setEditSupplier(null);
    setFormData({
      name: "",
      email: "",
      number: "",
      address: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (editSupplier) {
        response = await axios.put(
          `http://localhost:5000/api/supplier/${editSupplier}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setSuppliers((prev) =>
            prev.map((sup) =>
              sup._id === editSupplier ? response.data.supplier : sup
            )
          );
          alert("Supplier updated successfully");
        }
      } else {
        response = await axios.post(
          "http://localhost:5000/api/supplier/add",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setSuppliers((prev) => [...prev, response.data.supplier]);
          alert("Supplier added successfully");
        }
      }

      closeModal();
    } catch (error) {
      console.error("Error saving supplier:", error);
      alert("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this supplier?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
          `${API_BASE}/api/supplier/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("Supplier deleted successfully");
        fetchSuppliers();
      }
    } catch (error) {
      console.error("Error deleting supplier:", error);
      alert("Something went wrong");
    }
  };

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 min-h-screen bg-[#e5e7eb]">
      <div className="max-w-7xl mx-auto bg-[#f3f4f6] rounded-3xl shadow-inner p-6">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Supplier Management</h1>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search suppliers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-md px-4 py-2 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition"
          onClick={() => setAddModal(true)}
        >
          + Add Supplier
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-blue-500 rounded-full"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Address</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((supplier, index) => (
                <tr key={supplier._id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 font-medium">{supplier.name}</td>
                  <td className="p-3">{supplier.email}</td>
                  <td className="p-3">{supplier.number}</td>
                  <td className="p-3">{supplier.address}</td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg text-xs"
                      onClick={() => handleEdit(supplier)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs"
                      onClick={() => handleDelete(supplier._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredSuppliers.length === 0 && (
            <div className="text-center py-6 text-gray-400">No suppliers found</div>
          )}
        </div>
      )}

      {addModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4">
              {editSupplier ? "Edit Supplier" : "Add Supplier"}
            </h2>

            <button
              className="absolute top-3 right-4 text-gray-500 hover:text-black"
              onClick={closeModal}
            >
              ✕
            </button>

            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <input name="name" value={formData.name} onChange={handleChange} placeholder="Supplier Name" className="input" />
              <input name="email" value={formData.email} onChange={handleChange} placeholder="Supplier Email" className="input" />
              <input name="number" value={formData.number} onChange={handleChange} placeholder="Phone Number" className="input" />
              <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="input" />

              <div className="flex gap-2 mt-2">
                <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl">
                  {editSupplier ? "Save" : "Add"}
                </button>

                {editSupplier && (
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-xl"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reusable input style */}
      <style>{`
        .input {
          padding: 10px;
          border-radius: 10px;
          border: 1px solid #ddd;
          outline: none;
          transition: 0.2s;
        }
        .input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59,130,246,0.2);
        }
      `}</style>
          </div>
    </div>
  );
};

export default Suppliers;

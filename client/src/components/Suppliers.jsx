import React, { useState, useEffect } from "react";
import axios from "axios";

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

  // 🔥 Moved outside useEffect
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
      setFilteredSuppliers(response.data.suppliers)
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
        `http://localhost:5000/api/supplier/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("Supplier deleted successfully");
        fetchSuppliers(); // refresh list
      }
    } catch (error) {
      console.error("Error deleting supplier:", error);
      alert("Something went wrong");
    }
  };

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold mb-4">Supplier Management</h1>

      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full max-w-md mb-4"
        />

        <button
          className="px-4 py-2 bg-blue-500 text-white rounded mb-4 cursor-pointer"
          onClick={() => setAddModal(true)}
        >
          Add Supplier
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">S No</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Address</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map((supplier, index) => (
              <tr key={supplier._id}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{supplier.name}</td>
                <td className="border p-2">{supplier.email}</td>
                <td className="border p-2">{supplier.number}</td>
                <td className="border p-2">{supplier.address}</td>
                <td className="border p-2">
                  <button
                    className="px-2 py-1 bg-yellow-500 text-white rounded mr-2"
                    onClick={() => handleEdit(supplier)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded"
                    onClick={() => handleDelete(supplier._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredSuppliers.length === 0 && <div>No records</div>}
        </div>
      )}

      {addModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-1/3 relative">
            <h2 className="text-xl font-bold mb-4">
              {editSupplier ? "Edit Supplier" : "Add Supplier"}
            </h2>

            <button
              className="absolute top-2 right-3 text-lg font-bold"
              onClick={closeModal}
            >
              X
            </button>

            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Supplier Name"
                className="border p-2 rounded"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Supplier Email"
                className="border p-2 rounded"
              />

              <input
                type="text"
                name="number"
                value={formData.number}
                onChange={handleChange}
                placeholder="Phone Number"
                className="border p-2 rounded"
              />

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="border p-2 rounded"
              />

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="w-full mt-2 rounded-md bg-green-500 text-white p-3 cursor-pointer hover:bg-green-600"
                >
                  {editSupplier ? "Save Changes" : "Add Supplier"}
                </button>

                {editSupplier && (
                  <button
                    type="button"
                    className="w-full mt-2 rounded-md bg-red-500 text-white p-3 cursor-pointer hover:bg-red-600"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
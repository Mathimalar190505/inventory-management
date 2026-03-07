import React, { useState, useEffect } from "react";
import axios from "axios";

const initialForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  categoryId: "",
  supplierId: ""
};

const Products = () => {
  const [openModal, setOpenModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` }
  };

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/products",
        config
      );
      if (data.success) {
        setProducts(data.products || []);
        setCategories(data.categories || []);
        setSuppliers(data.suppliers || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const closeModal = () => {
    setOpenModal(false);
    setEditProduct(null);
    setFormData(initialForm);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    let response;

    if (editProduct) {
      // ✅ EDIT (must be PUT and no /update in URL)
      response = await axios.put(
        `http://localhost:5000/api/products/${editProduct}`,
        {
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock)
        },
        config
      );
    } else {
      // ✅ ADD
      response = await axios.post(
        "http://localhost:5000/api/products/add",
        {
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock)
        },
        config
      );
    }

    if (response.data.success) {
      fetchProducts();
      closeModal();
    } else {
      alert(response.data.message);
    }

  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Error saving product");
  }
};

  const handleEdit = product => {
    setEditProduct(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId._id,
      supplierId: product.supplierId._id
    });
    setOpenModal(true);
  };

  const handleDelete = async id => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/products/${id}`,
        config
      );
      fetchProducts();
    } catch (err) {
      alert("Delete failed");
    }
  };
    const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-4 sm:p-8">
    <div className="max-w-7xl mx-auto">

      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Product Management
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">

            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={() => setOpenModal(true)}
              className="bg-blue-600 hover:bg-blue-700 transition px-5 py-2.5 rounded-lg text-white font-medium shadow-md w-full sm:w-auto"
            >
              + Add Product
            </button>

          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[750px] w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Supplier</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Stock</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">

              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-8 text-gray-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-medium text-gray-800">{p.name}</td>
                    <td className="p-4">{p.categoryId?.categoryName || "-"}</td>
                    <td className="p-4">{p.supplierId?.name || "-"}</td>
                    <td className="p-4 font-semibold">Rs. {p.price}</td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          p.stock === 0
                            ? "bg-red-100 text-red-600"
                            : p.stock < 5
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {p.stock}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(p)}
                          className="px-3 py-1.5 text-xs font-medium bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg shadow-sm transition w-full sm:w-auto"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(p._id)}
                          className="px-3 py-1.5 text-xs font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm transition w-full sm:w-auto"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 sm:p-8">

            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">
              {editProduct ? "Edit Product" : "Add Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Product Name"
                required
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Price"
                  required
                  className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />

                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="Stock"
                  required
                  className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.categoryName}
                  </option>
                ))}
              </select>

            <select
  name="supplierId"
  value={formData.supplierId}
  onChange={handleChange}
  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  <option value="">Select Supplier</option>
  {suppliers.map((supplier) => (
    <option key={supplier._id} value={supplier._id}>
      {supplier.name}
    </option>
  ))}
</select>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition w-full sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md transition w-full sm:w-auto"
                >
                  {editProduct ? "Update" : "Add"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  </div>
);
};

export default Products;
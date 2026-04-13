import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE from "../api";

const CustomerProducts = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const [orderData, setOrderData] = useState({
    productId: "",
    quantity: 1,
    total: 0,
    stock: 0,
    price: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });

      if (response.data.success) {
        const prods = response.data.products || [];
        const cats = response.data.categories || [];

        setProducts(prods);
        setCategories(cats);
        setFilteredProducts(prods);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // FILTER PRODUCTS
  const filterProducts = (searchText, categoryId) => {
    let filtered = [...products];

    if (categoryId) {
      filtered = filtered.filter(
        (product) => product.categoryId?._id === categoryId
      );
    }

    if (searchText) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  // SEARCH
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    filterProducts(value, selectedCategory);
  };

  // CATEGORY FILTER
  const handleChangeCategory = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    filterProducts(search, value);
  };

  // OPEN ORDER MODAL
  const handleOrderChange = (product) => {
    setOrderData({
      productId: product._id,
      quantity: 1,
      total: product.price,
      stock: product.stock,
      price: product.price,
    });

    setOpenModal(true);
  };

  // CLOSE MODAL
  const closeModal = () => {
    setOpenModal(false);
  };

  // CHANGE QUANTITY
const handleQuantityChange = (e) => {
  const qty = Number(e.target.value);

  if (qty > orderData.stock) {
    alert("Requested quantity exceeds available stock!");
    return;
  }

  setOrderData({
    ...orderData,
    quantity: qty,
    total: qty * orderData.price,
  });
};

  // SUBMIT ORDER
  const handleSubmit = async (e) => {
    e.preventDefault();
       try {
      const response = await axios.post("http://localhost:5000/api/orders/add",
        { productId: orderData.productId, quantity: orderData.quantity}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });

      if (response.data.success) {
        alert("Order placed successfully");
        setOpenModal(false);
        setOrderData({productId:"",quantity:1,stock:0,total:0,price:0})
      }
    } catch (err) {
      console.error("Error in ordering :", err);
      alert(error.response?.data?.message || "Order failed")
    }
    
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Products</h2>
      </div>

      {/* FILTERS */}
      <div className="bg-white shadow-sm rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <select
          onChange={handleChangeCategory}
          value={selectedCategory}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.categoryName}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={handleSearch}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-72 text-sm"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Stock</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-10 text-gray-400">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium">{p.name}</td>

                    <td className="p-4">
                      {p.categoryId?.categoryName || "-"}
                    </td>

                    <td className="p-4 font-semibold">
                      Rs. {p.price}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${p.stock === 0
                            ? "bg-red-100 text-red-600"
                            : p.stock < 5
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-600"
                          }`}
                      >
                        {p.stock}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleOrderChange(p)}
                        disabled={p.stock === 0}
                        className={`px-4 py-1.5 text-xs font-semibold text-white rounded-lg
                          ${p.stock === 0 ? "bg-gray-400 cursor-not-allowed": "bg-green-400 hover:bg-green-500" }`}>
                        {p.stock === 0 ? "Out of Stock" : "Order"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ORDER MODAL */}
        {openModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 sm:p-8">

              <h2 className="text-xl font-bold mb-6 text-gray-800">
                Place Order
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">

                <input
                  type="number"
                  value={orderData.quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  max={orderData.stock}
                  className="w-full border border-gray-300 p-3 rounded-lg"
                />

                <div className="text-gray-700 font-semibold">
                  Total: Rs. {orderData.total}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 rounded-lg bg-gray-200"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white"
                  >
                    Place Order
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

export default CustomerProducts;
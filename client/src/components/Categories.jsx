import React, { useState, useEffect } from "react";
import axios from "axios";

const Categories = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/category/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );

        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Add Category
 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (editingCategory) {
      // UPDATE CATEGORY
      const response = await axios.put(
        `http://localhost:5000/api/category/${editingCategory}`,
        { categoryName, categoryDescription }
      );

      if (response.data.success) {
        alert("Category updated successfully");

        setCategories((prev) =>
          prev.map((cat) =>
            cat._id === editingCategory ? response.data.category : cat
          )
        );

        setEditingCategory(null);
      }

    } else {
      // ADD CATEGORY
      const response = await axios.post(
        "http://localhost:5000/api/category/add",
        { categoryName, categoryDescription }
      );

      if (response.data.success) {
        alert("Category added successfully");

        setCategories((prev) => [...prev, response.data.category]);
      }
    }

    // Reset form
    setCategoryName("");
    setCategoryDescription("");

  } catch (error) {
    console.error("Error saving category:", error);
    alert("Something went wrong");
  }
};
const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this category?");
  if (!confirmDelete) return;

  try {
    const response = await axios.delete(
      `http://localhost:5000/api/category/${id}`
    );

    if (response.data.success) {
      alert("Category deleted successfully");

      setCategories((prev) =>
        prev.filter((cat) => cat._id !== id)
      );
    }

  } catch (error) {
    console.error("Error deleting category:", error);
    alert("Something went wrong");
  }
};


  const handleEdit = async(category) => {
    setEditingCategory(category._id);
    setCategoryName(category.categoryName);
    setCategoryDescription(category.categoryDescription);

  }
  const handleCancel=async()=>{
    setEditingCategory(null);
    setCategoryName("");
    setCategoryDescription("");

  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg font-semibold animate-pulse text-gray-600">
          Loading categories...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">
          Category Management
        </h1>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Add Category Card */}
          <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </h2>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />

              <textarea
                placeholder="Category Description"
                rows="4"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
              <div>
                <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 transition duration-300 text-white font-medium py-3 rounded-xl shadow-md hover:shadow-lg"
              >{editingCategory ? "Update Category" : "Add Category"}
              </button>
              {editingCategory && <button type="button" onClick={handleCancel} className="w-full mt-3 bg-red-500 hover:bg-red-600 transition duration-300 text-white font-medium py-3 rounded-xl shadow-md hover:shadow-lg">
                Cancel
              </button>}
              </div>
              
            </form>
          </div>

          {/* Category List */}
          <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100 overflow-x-auto">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">
              Category List
            </h2>

            {categories.length === 0 ? (
              <p className="text-gray-500 text-center py-6">
                No categories found.
              </p>
            ) : (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="p-3 text-left">Category Name</th>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr
                      key={category._id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-3 font-medium text-gray-800">
                        {category.categoryName}
                      </td>
                      <td className="p-3 text-gray-600">
                        {category.categoryDescription}
                      </td>
                      <td className="p-3 flex justify-center gap-3">
                        <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm transition shadow" onClick={()=>handleEdit(category)}>
                          Edit
                        </button>
                        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition shadow" onClick={() => handleDelete(category._id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;

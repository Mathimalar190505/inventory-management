import React, { useState, useEffect } from "react";
import axios from "axios";

const Users = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "",
  });
  const [users, setUsers] = useState([]);
  const [filteredUsers,setfilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);

 
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setUsers(response.data.users || []);
        setfilteredUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) =>{
    setfilteredUsers(
      users.filter((user) =>
        user.name.toLowerCase().includes(e.target.value.toLowerCase())
    ))
  }
  // Add Category
  const handleSubmit = async (e) => {
    e.preventDefault();
    // ADD CATEGORY
    const response = await axios.post(
      "http://localhost:5000/api/users/add",
      formData,
      {
        headers:{
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          
      }
    );

    if (response.data.success) {
      alert("Users added successfully");
      setFormData({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "",
      });
      fetchUsers();
    } else {
      console.error("Error adding user:");
      alert("Something went wrong");
    }
  };
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this User?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/users/${id}`,
         {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
      );

      if (response.data.success) {
        alert("User deleted successfully");
        setUsers(users.filter((user) => user._id !== id));
        fetchUsers();
      }
      else {
        console.error("Error deleting category:", error);
        alert("Something went wrong");
      }

    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Something went wrong");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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
          Users Management
        </h1>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Add Category Card */}
          <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">
              Add New User
            </h2>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  placeholder="Enter Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Enter Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Enter password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                /></div>
              <div>
                <input
                  type="address"
                  placeholder="Enter address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                /></div>
              <select name="role" value={formData.role} onChange={handleChange} className="border w-full p-2 rounded-md">
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="customer">Customer</option>
              </select>
              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 transition duration-300 text-white font-medium py-3 rounded-xl shadow-md hover:shadow-lg"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>

          
          <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-100 overflow-x-auto">
           <input type="text" placeholder="Search" className="p-2 bg-white w-full mb-4 rounded" onChange={handleSearch}/>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="border border-gray-200 p-2">S.No</th>
                  <th className="border border-gray-200 p-2">Name</th>
                  <th className="border border-gray-200 p-2">Email</th>
                  <th className="border border-gray-200 p-2">Address</th>
                  <th className="border border-gray-200 p-2">Role</th>
                  <th className="border border-gray-200 p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers && filteredUsers.map((user, index) => (
                  <tr
                    key={index}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="border border-gray-200 p-2">{index+1}</td>
                    <td className="border border-gray-200 p-2">
                      {user.name}
                    </td>
                    <td className="border border-gray-200 p-2">
                      {user.email}
                    </td>
                    <td className="border border-gray-200 p-2">
                      {user.address}
                    </td>
                    <td className="border border-gray-200 p-2">
                      {user.role}
                    </td>
                    <td className="p-3 flex justify-center gap-3">
                      <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition shadow" onClick={() => handleDelete(user._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && <div>No records</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;

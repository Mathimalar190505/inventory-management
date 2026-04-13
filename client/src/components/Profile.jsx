import React, { useState, useEffect } from "react";
import API_BASE from "../api";
const Profile = () => {

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    password: "",
    confirmPassword: "",
    image: null
  });

  const fetchUser = async () => {
    try {
      const response = await fetch(  `${API_BASE}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const data = await response.json();

      setUser((prev) => ({
        ...prev,
        name: data.user.name || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
        address: data.user.address || "",
        city: data.user.city || "",
        state: data.user.state || "",
      }));

    } catch (error) {
      console.error("Error fetching user profile", error);
      alert("Error fetching user profile, please try again");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setUser({ ...user, image: files[0] });
    } else {
      setUser({ ...user, [name]: value });
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (user.password && user.password !== user.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/users/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    alert("Profile updated successfully");

  } catch (error) {
    console.error("Update error:", error);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-3xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Update Profile
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Full Name */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              className="mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Profile Image */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">
              Profile Image
            </label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="mt-1 p-2 border rounded-lg bg-gray-50"
            />
          </div>

          {/* Address */}
          <div className="flex flex-col md:col-span-2">
            <label className="text-sm font-medium text-gray-600">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={user.address}
              onChange={handleChange}
              className="mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* City */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">
              City
            </label>
            <input
              type="text"
              name="city"
              value={user.city}
              onChange={handleChange}
              className="mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* State */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">
              State
            </label>
            <input
              type="text"
              name="state"
              value={user.state}
              onChange={handleChange}
              className="mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">
              New Password
            </label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              className="mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={user.confirmPassword}
              onChange={handleChange}
              className="mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Button */}
          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Update Profile
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Profile;
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import axios from 'axios';

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading , setLoading] = useState(false);
    const navigate = useNavigate();

    const {login} = useAuth();

   
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
 

  try {
    const response = await axios.post("http://localhost:5000/api/auth/login", {
    email, password});

    if (response.data.success) {
        await login(response.data.user,response.data.token);
        if(response.data.user.role === "admin"){
           navigate("/admin/dashboard"); 
        } else {
            navigate("/customer-dashboard");
        }
    } else {
        alert(response.data.error);
    }

  } catch (error) {
     if(error.response) {
    setError(error.response.data.message);
     }
  } finally {
     setLoading(false);
  }  
};
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <h1 className="text-3xl text-white mb-6">Inventory Management System</h1>
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login
        </h1>
        {error && (
          <div className="bg-red-200 text-red-700 p-2 mb-4 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
           {loading ? "Loading..." : "Login"}
          </button>

        </form>
      </div>

    </div>
  );
};

export default Login;

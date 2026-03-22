import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-16 md:ml-64 bg-gray-400 min-h-screen p-4">
       <div>
        <Outlet />
       </div>

      </div>
    </div>
  );
};

export default Dashboard;

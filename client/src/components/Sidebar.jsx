import React from 'react'
import { FaHome, FaList, FaBoxOpen, FaTruck, FaShoppingCart, FaUsers, FaCog, FaSignOutAlt } from "react-icons/fa";
import { NavLink } from 'react-router-dom';


const Sidebar = () => {
const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: <FaHome />, isParent: true },
  { name: "Categories", path: "/admin/dashboard/categories", icon: <FaList />, isParent: false },
  { name: "Products", path: "/admin/dashboard/products", icon: <FaBoxOpen />, isParent: false },
  { name: "Suppliers", path: "/admin/dashboard/supplier", icon: <FaTruck />, isParent: false },
  { name: "Orders", path: "/admin/dashboard/orders", icon: <FaShoppingCart />, isParent: false },
  { name: "Users", path: "/admin/dashboard/users", icon: <FaUsers />, isParent: false },
];


  return (
    <div className='flex flex-col h-screen w-64 bg-gray-900 text-white shadow-lg fixed'>
        
        {/* Header */}
        <div className='flex flex-col items-center justify-center h-20 border-b border-gray-700'>
            <span className='text-lg font-bold tracking-wide'>
                Inventory Management System
            </span>
            <span className='text-sm text-gray-400'>
                IMS
            </span>
        </div>

        {/* Menu */}
        <div className='flex-1 overflow-y-auto py-4'>
            <ul className='space-y-2 px-4'>
                {menuItems.map((item)=>(
                    <li 
                        key={item.name} 
                        className='rounded-lg hover:bg-gray-800 transition duration-200'
                    >
                        <NavLink to={item.path} end={item.isParent} 
                        className={({ isActive }) => `flex items-center gap-3 p-3 text-gray-300 hover:text-white ${isActive ? 'bg-gray-700' : ''}`}>
                            <span className='text-lg'>
                                {item.icon}
                            </span>
                            <span className='text-sm font-medium'>
                                {item.name}
                            </span>
                        </NavLink>  
                    </li>
                ))} 
            </ul>
        </div>
      
    </div>
  )
}

export default Sidebar

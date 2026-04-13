import React, { useState,useEffect } from 'react';
import axios  from 'axios';
import API_BASE from "../api";

const Summary = () => {
    const [dashboardData , setDashboardData] = useState({
        totalProducts: 0,
        totalStock: 0,
        ordersToday: 0,
        revenue: 0,
        outofStock: [],
        highestSaleProduct: null,
        lowStock: []
    })
    const [loading, setLoading] = useState(false);

    const fetchDashboardData = async ()=>{
        try{
            setLoading(true);
            const response = await axios.get(  `${API_BASE}/api/dashboard`,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("pos-token")}`
                }
            });
            setDashboardData(response.data.dashboardData);
        } catch(error){
            alert(error.message);
        } finally{
            setLoading(false);
        }
    }
    useEffect(()=>{
        fetchDashboardData();
    },[]);

    if(loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-500"></div>
            </div>
        );
    }

  return (
    <div className="p-8 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
      <h2 className='text-4xl font-extrabold text-gray-800 mb-8 tracking-tight'>Dashboard</h2>

      {/* Top Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10'>

        <div className='bg-blue-500/90 backdrop-blur text-white p-6 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 text-center'>
            <p className='text-sm opacity-80'>Total Products</p>
            <p className='text-4xl font-bold mt-2'>{dashboardData.totalProducts}</p>
        </div>

        <div className='bg-green-500/90 text-white p-6 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 text-center'>
            <p className='text-sm opacity-80'>Total Stock</p>
            <p className='text-4xl font-bold mt-2'>{dashboardData.totalStock}</p>
        </div>

        <div className='bg-yellow-500/90 text-white p-6 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 text-center'>
            <p className='text-sm opacity-80'>Orders Today</p>
            <p className='text-4xl font-bold mt-2'>{dashboardData.ordersToday}</p>
        </div>

        <div className='bg-purple-500/90 text-white p-6 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 text-center'>
            <p className='text-sm opacity-80'>Revenue</p>
            <p className='text-4xl font-bold mt-2'>${dashboardData.revenue}</p>
        </div>
      </div>

      {/* Bottom Sections */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>

        {/* Out of Stock */}
        <div className='bg-white/80 backdrop-blur p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100'>
         <h3 className='text-lg font-semibold text-gray-700 mb-4'>Out Of Stock</h3>
        {dashboardData.outofStock.length > 0 ? (
            <ul className='space-y-3 max-h-60 overflow-y-auto pr-2'>
                {dashboardData.outofStock.map((product, index) => (
                    <li key={index} className='flex justify-between items-center text-sm bg-gray-50 p-2 rounded-lg'>
                        <span className='font-medium'>{product.name}</span>
                        <span className='text-gray-400 text-xs'>{product.category.name}</span>
                    </li>
                ))}
            </ul>
        ):(
            <p className='text-gray-400 text-sm'>No products out of stock</p>
        )}
        </div>

        {/* Highest Sale */}
        <div className='bg-white/80 backdrop-blur p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100'>
         <h3 className='text-lg font-semibold text-gray-700 mb-4'>Highest Sale</h3>
        {dashboardData.highestSaleProduct?.name ?(
          <div className='space-y-3 text-sm text-gray-700'>
            <div className='flex justify-between'><span className='font-medium'>Name</span><span>{dashboardData.highestSaleProduct.name}</span></div>
            <div className='flex justify-between'><span className='font-medium'>Category</span><span>{dashboardData.highestSaleProduct.category}</span></div>
            <div className='flex justify-between'><span className='font-medium'>Units Sold</span><span>{dashboardData.highestSaleProduct.totalQuantity}</span></div>
          </div>
        ):(
            <p className='text-gray-400 text-sm'>{dashboardData.highestSaleProduct?.message || 'Loading...'}</p>
        )}
        </div>

        {/* Low Stock */}
        <div className='bg-white/80 backdrop-blur p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100'>
         <h3 className='text-lg font-semibold text-gray-700 mb-4'>Low Stock</h3>
         {dashboardData.lowStock.length > 0 ? (
            <ul className='space-y-3 max-h-60 overflow-y-auto pr-2'>
                {dashboardData.lowStock.map((product,index) => (
                    <li key={index} className='flex justify-between items-center text-sm bg-gray-50 p-2 rounded-lg'>
                        <span className='font-medium'>{product.name}</span>
                        <span className='text-red-400 text-xs font-semibold'>{product.stock} left</span>
                    </li>
                ))}
            </ul>
         ):(
            <p className='text-gray-400 text-sm'>No low stock products</p>
         )}
        </div>

      </div>
    </div>
  )
}

export default Summary
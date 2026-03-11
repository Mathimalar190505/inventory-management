import React, { useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {

  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {

    try {

      const token = localStorage.getItem("pos-token");

      const { data } = await axios.get(
        "http://localhost:5000/api/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (data.success) {
        setOrders(data.orders || []);
      }

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (

    <div>

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Orders
        </h1>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        <div className="overflow-x-auto">

          <table className="min-w-[750px] w-full text-sm">

            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="p-4 text-left">Product</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Quantity</th>
                <th className="p-4 text-left">Total Price</th>
                <th className="p-4 text-center">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y">

              {orders.length === 0 ? (

                <tr>
                  <td colSpan="5" className="text-center p-8 text-gray-500">
                    No orders found.
                  </td>
                </tr>

              ) : (

                orders.map((order) => (

                  <tr key={order._id} className="hover:bg-gray-50">

                    <td className="p-4 font-medium">
                      {order.product?.name || "-"}
                    </td>

                    <td className="p-4">
                      {order.product?.categoryId?.categoryName || "-"}
                    </td>

                    <td className="p-4">
                      {order.quantity}
                    </td>

                    <td className="p-4 font-semibold">
                      Rs. {order.totalPrice}
                    </td>

                    <td className="p-4 text-center">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );
};

export default Orders;
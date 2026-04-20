import React, { useEffect, useState } from "react";
import axios from "axios";

export default function OrdersPage() {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    if (!user) return;
    const res = await axios.get(`http://localhost:3000/api/orders/${user._id}`);
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-4xl font-bold text-purple-700 mb-8">📦 Your Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-lg">No orders found.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((o) => (
            <div
              key={o._id}
              className="bg-white p-6 rounded-xl shadow-lg border"
            >
              <h2 className="font-bold text-xl text-gray-800 mb-2">
                Order #{o._id.substring(0, 6)}
              </h2>

              {o.products.map((item) => (
                <div key={item.productId} className="mt-2">
                  <p>{item.name}</p>
                  <p className="text-green-600 font-bold">₹{item.price}</p>
                </div>
              ))}

              <p className="mt-3 font-semibold text-gray-700">
                Total: ₹{o.totalAmount}
              </p>
              <span className="inline-block mt-2 px-4 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full">
                {o.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import axios from "axios";

interface Sweet {
  _id?: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

const UserDashboard = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const token = localStorage.getItem("token"); // fetch token from localStorage
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchSweets = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/sweets", authHeader);
      setSweets(res.data.sweets);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto mt-10">
        {/* Dashboard Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">User Dashboard</h1>
          <p className="text-lg text-gray-600">
            Welcome! You are logged in as <span className="font-semibold">User</span>
          </p>
        </div>

        {/* Sweet Cards or Empty Message */}
        {sweets.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No sweets available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {sweets.map((sweet) => (
              <div
                key={sweet._id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">{sweet.name}</h3>
                  <p className="text-gray-600 mb-2">{sweet.category}</p>
                  <p className="text-gray-800 font-medium mb-2">${sweet.price.toFixed(2)}</p>
                  <p className="text-gray-500">Quantity: {sweet.quantity}</p>
                </div>
                <button
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition-all"
                  disabled={sweet.quantity === 0}
                >
                  {sweet.quantity === 0 ? "Out of Stock" : "Buy Now"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default UserDashboard;

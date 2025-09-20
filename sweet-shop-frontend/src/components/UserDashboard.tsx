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
  const [purchaseMap, setPurchaseMap] = useState<{ [key: string]: number }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const categories = ["All", "Candy", "Chocolate", "Bakery", "Traditional", "Ice Cream", "Other"];

  // Fetch sweets
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

  // Handle purchase
  const handleBuy = (id: string) => {
    const purchaseQty = purchaseMap[id] || 1;
    setSweets((prev) =>
      prev.map((sweet) =>
        sweet._id === id
          ? { ...sweet, quantity: Math.max(sweet.quantity - purchaseQty, 0) }
          : sweet
      )
    );
    setPurchaseMap((prev) => ({ ...prev, [id]: 1 }));
  };

  // Filtered sweets based on search and category
  const filteredSweets = sweets.filter((sweet) => {
    const matchesSearch = sweet.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "" || categoryFilter === "All" || sweet.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto mt-10">
        {/* Dashboard Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">User Dashboard</h1>
          <p className="text-lg text-gray-600">
            Welcome! You are logged in as <span className="font-semibold">User</span>
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <input
            type="text"
            placeholder="Search sweets..."
            className="border p-2 rounded w-full md:w-1/2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border p-2 rounded w-full md:w-1/4"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            data-testid="category-filter"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Sweet Cards or Empty Message */}
        {filteredSweets.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No sweets available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredSweets.map((sweet) => (
              <div
                key={sweet._id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">{sweet.name}</h3>
                  <p className="text-gray-600 mb-2">{sweet.category}</p>
                  <p className="text-gray-800 font-medium mb-2">${sweet.price.toFixed(2)}</p>
                  <p className="text-gray-500 mb-2">Quantity: {sweet.quantity}</p>

                  {/* Purchase Quantity Input */}
                  {sweet.quantity > 0 && (
                    <input
                      type="number"
                      min={1}
                      max={sweet.quantity}
                      value={purchaseMap[sweet._id!] || 1}
                      onChange={(e) =>
                        setPurchaseMap((prev) => ({
                          ...prev,
                          [sweet._id!]: Math.min(
                            Math.max(1, Number(e.target.value)),
                            sweet.quantity
                          ),
                        }))
                      }
                      className="border p-1 rounded w-20 mr-2"
                    />
                  )}
                </div>

                {/* Buy Button */}
                <button
                  className={`mt-4 text-white px-4 py-2 rounded-lg shadow-md transition-all ${
                    sweet.quantity === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                  disabled={sweet.quantity === 0}
                  onClick={() => handleBuy(sweet._id!)}
                  data-testid={`purchase-${sweet._id}`}
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

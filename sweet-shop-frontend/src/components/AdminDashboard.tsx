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

const categories = ["Candy", "Chocolate", "Bakery", "Traditional", "Ice Cream", "Other"];

const AdminDashboard = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [form, setForm] = useState<Sweet>({
    name: "",
    category: "",
    price: 0,
    quantity: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [restockMap, setRestockMap] = useState<{ [key: string]: number }>({});

  const token = localStorage.getItem("token");
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "price") {
      const val = Number(value);
      setForm((prev) => ({ ...prev, price: val >= 0 ? val : 0 }));
    } else if (name === "quantity") {
      const val = Math.floor(Number(value));
      setForm((prev) => ({ ...prev, quantity: val >= 0 ? val : 0 }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      if (!form.name || !form.category) return alert("Name and Category are required");

      if (editingId) {
        const currentSweet = sweets.find((s) => s._id === editingId)!;
        const isRestock = form.quantity > currentSweet.quantity;

        let res;
        if (isRestock) {
          res = await axios.post(
            `http://localhost:5000/api/sweets/${editingId}/restock`,
            { quantity: form.quantity - currentSweet.quantity },
            authHeader
          );
        } else {
          res = await axios.put(`http://localhost:5000/api/sweets/${editingId}`, form, authHeader);
        }
        setSweets((prev) => prev.map((s) => (s._id === editingId ? res.data.sweet : s)));
        setEditingId(null);
      } else {
        const res = await axios.post("http://localhost:5000/api/sweets", form, authHeader);
        setSweets((prev) => [...prev, res.data.sweet]);
      }

      setForm({ name: "", category: "", price: 0, quantity: 0 });
    } catch (err: any) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (sweet: Sweet) => {
    setForm({ ...sweet });
    setEditingId(sweet._id || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this sweet?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/sweets/${id}`, authHeader);
      setSweets((prev) => prev.filter((s) => s._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete sweet");
    }
  };

  const handleRestock = async (id: string) => {
    const qty = restockMap[id];
    if (!qty || qty <= 0) return alert("Enter valid quantity to restock");

    try {
      const res = await axios.post(
        `http://localhost:5000/api/sweets/${id}/restock`,
        { quantity: qty },
        authHeader
      );
      setSweets((prev) => prev.map((s) => (s._id === id ? res.data.sweet : s)));
      setRestockMap((prev) => ({ ...prev, [id]: 0 }));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to restock sweet");
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-7xl mx-auto mt-10">
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">Admin Dashboard</h1>
        <p className="text-lg text-center mb-8 text-gray-600">
          Welcome! You are logged in as <span className="font-semibold">Admin</span>
        </p>

        {/* Form Card */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-md mb-10">
          <h2 className="text-2xl font-semibold mb-5 text-gray-700">
            {editingId ? "Edit Sweet" : "Add New Sweet"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Sweet Name"
              value={form.name}
              onChange={handleChange}
              className="border p-2 rounded focus:outline-blue-400"
            />
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="border p-2 rounded focus:outline-blue-400"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={form.price}
              min={0}
              step={0.01}
              onChange={handleChange}
              className="border p-2 rounded focus:outline-blue-400"
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={form.quantity}
              min={0}
              step={1}
              onChange={handleChange}
              className="border p-2 rounded focus:outline-blue-400"
            />
          </div>
          <div className="mt-5 flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
              {editingId ? "Update Sweet" : "Add Sweet"}
            </button>
          </div>
        </div>

        {/* Sweet Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sweets.length === 0 && (
            <p className="text-center col-span-full text-gray-500">No sweets available</p>
          )}

          {sweets.map((sweet) => (
            <div
              key={sweet._id}
              data-testid={`sweet-${sweet._id}`}
              className="bg-white shadow-md rounded-xl p-5 hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div className="space-y-1">
                <h3 className="text-xl font-semibold text-gray-800">{sweet.name}</h3>
                <p className="text-gray-600">{sweet.category}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-gray-800 font-medium">${sweet.price.toFixed(2)}</span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-sm">
                    Qty: {sweet.quantity}
                  </span>
                </div>
              </div>

              {/* Restock Input */}
              <div className="mt-3 flex gap-2 items-center">
                <input
                  type="number"
                  min={1}
                  placeholder="Restock qty"
                  className="border p-2 rounded w-20 focus:outline-green-400"
                  value={restockMap[sweet._id!] || ""}
                  onChange={(e) =>
                    setRestockMap((prev) => ({ ...prev, [sweet._id!]: Number(e.target.value) }))
                  }
                />
                <button
                  onClick={() => handleRestock(sweet._id!)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded transition-transform transform hover:scale-105"
                >
                  Restock
                </button>
              </div>

              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleEdit(sweet)}
                  data-testid={`edit-${sweet._id}`}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded transition-transform transform hover:scale-105"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(sweet._id!)}
                  data-testid={`delete-${sweet._id}`}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition-transform transform hover:scale-105"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;

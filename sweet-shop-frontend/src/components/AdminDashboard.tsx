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

const categories = ["Candy", "Chocolate", "Bakery", "Ice Cream", "Other"];

const AdminDashboard = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [form, setForm] = useState<Sweet>({
    name: "",
    category: "",
    price: 0,
    quantity: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

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
        const res = await axios.put(
          `http://localhost:5000/api/sweets/${editingId}`,
          form,
          authHeader
        );
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

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto mt-10 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">Admin Dashboard</h1>
        <p className="text-lg text-center mb-6 text-gray-600">
          Welcome! You are logged in as <span className="font-semibold">Admin</span>
        </p>

        {/* Form Card */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            {editingId ? "Edit Sweet" : "Add New Sweet"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md"
            >
              {editingId ? "Update Sweet" : "Add Sweet"}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse shadow-sm">
            <thead className="bg-blue-50">
              <tr>
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Category</th>
                <th className="border p-2 text-left">Price</th>
                <th className="border p-2 text-left">Quantity</th>
                <th className="border p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sweets.map((sweet) => (
                <tr key={sweet._id} data-testid={`sweet-${sweet._id}`} className="hover:bg-gray-50">
                  <td className="border p-2">{sweet.name}</td>
                  <td className="border p-2">{sweet.category}</td>
                  <td className="border p-2">{sweet.price.toFixed(2)}</td>
                  <td className="border p-2">{sweet.quantity}</td>
                  <td className="border p-2 flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(sweet)}
                      data-testid={`edit-${sweet._id}`}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(sweet._id!)}
                      data-testid={`delete-${sweet._id}`}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {sweets.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-gray-500">
                    No sweets available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;

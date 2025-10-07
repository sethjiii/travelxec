"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function ManageRegionsPage() {
  const [regions, setRegions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editingRegion, setEditingRegion] = useState<any | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", image: "" });

  // ✅ Fetch regions
  const fetchRegions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/regions", { cache: "no-store" });
      const data = await res.json();
      setRegions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete region (your API expects ?id=)
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this region?")) return;
    try {
      const res = await fetch(`/api/admin/regions?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");
      setMessage("✅ Region deleted successfully!");
      fetchRegions(); // refresh list
    } catch (error: any) {
      setMessage(`❌ ${error.message}`);
    }
  };

  // ✅ Handle edit modal open
  const startEditing = (region: any) => {
    setEditingRegion(region);
    setFormData({
      name: region.name || "",
      description: region.description || "",
      image: region.image || "",
    });
  };

  // ✅ Submit updated region (PUT /api/admin/regions)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRegion) return;

    try {
      const res = await fetch("/api/admin/regions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingRegion._id,
          ...formData,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      setMessage("✅ Region updated successfully!");
      setEditingRegion(null);
      fetchRegions();
    } catch (error: any) {
      setMessage(`❌ ${error.message}`);
    }
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  return (
    <div className="max-w-5xl py-12 mx-auto mt-10">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Manage Regions</h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded-md text-sm ${
            message.startsWith("✅")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading regions...</p>
      ) : regions.length === 0 ? (
        <p className="text-gray-500">No regions found. Try adding one.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {regions.map((region) => (
            <div
              key={region._id}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              {region.image && (
                <Image
                  src={region.image}
                  alt={region.name}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {region.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {region.description || "No description"}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEditing(region)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(region._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Edit Modal */}
      {editingRegion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              Edit Region: {editingRegion.name}
            </h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring focus:ring-teal-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring focus:ring-teal-200"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingRegion(null)}
                  className="px-3 py-1 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

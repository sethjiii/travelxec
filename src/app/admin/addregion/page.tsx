"use client";

import { useState } from "react";
import Image from "next/image";

export default function AddRegionForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle image upload + preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/regions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          image,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to add region");

      setMessage("✅ Region added successfully!");
      setName("");
      setDescription("");
      setImage(null);
      setPreview(null);
    } catch (error: any) {
      console.error("Error:", error);
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-md p-6 mt-10 py-12">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add New Region (Category)</h2>

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

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Region Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Region Name</label>
          <input
            type="text"
            placeholder="Enter region name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Description</label>
          <textarea
            placeholder="Short description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
            rows={4}
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Region Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm text-gray-600"
          />

          {preview && (
            <div className="mt-4">
              <Image
                src={preview}
                alt="Region preview"
                width={300}
                height={200}
                className="rounded-lg border border-gray-200"
              />
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-700 text-white font-medium py-2 rounded-lg hover:bg-teal-800 transition disabled:opacity-50"
        >
          {loading ? "Adding Region..." : "Add Region"}
        </button>
      </form>
    </div>
  );
}

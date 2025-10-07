"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Image from "next/image";

export default function AddDestination() {
  const [city, setCity] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [region, setRegion] = useState<string>(""); // ✅ new
  const [regions, setRegions] = useState<any[]>([]); // ✅ new
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  // ✅ Fetch available regions
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await fetch("/api/admin/regions");
        if (!res.ok) throw new Error("Failed to fetch regions");
        const data = await res.json();
        setRegions(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRegions();
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const base64Images: string[] = [];
    let loadedCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result) {
          base64Images.push(event.target.result as string);
        }
        loadedCount++;
        if (loadedCount === files.length) {
          setImages(base64Images);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!region) {
      setMessage("Please select a region.");
      setLoading(false);
      return;
    }

    const payload = {
      city,
      description,
      images,
      region, // ✅ added
    };

    try {
      const token = localStorage.getItem("token") ?? "";

      const response = await fetch("/api/admin/adddestinations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Destination added successfully!");
        setCity("");
        setDescription("");
        setImages([]);
        setRegion("");
      } else {
        setMessage(data.error || "❌ Failed to add destination");
      }
    } catch (err) {
      setMessage("Error: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md text-gray-700 mx-auto p-4 border rounded shadow py-24">
      <h2 className="text-xl font-bold mb-4">Add New Destination</h2>
      <form onSubmit={handleSubmit}>
        {/* ✅ Region Dropdown */}
        <label className="block mb-2 font-semibold">
          Select Region <span className="text-red-600">*</span>
        </label>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          required
          className="w-full mb-4 px-3 py-2 border rounded"
        >
          <option value="">-- Choose a Region --</option>
          {regions.map((r) => (
            <option key={r._id} value={r._id}>
              {r.name}
            </option>
          ))}
        </select>

        <label className="block mb-2 font-semibold">
          City <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          className="w-full mb-4 px-3 py-2 border rounded"
        />

        <label className="block mb-2 font-semibold">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full mb-4 px-3 py-2 border rounded"
        />

        <label className="block mb-2 font-semibold">Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="mb-4"
        />

        {images.length > 0 && (
          <div className="mb-4">
            <p className="font-semibold mb-1">Preview:</p>
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, idx) => (
                <Image
                  key={idx}
                  src={img}
                  alt={`Preview ${idx + 1}`}
                  className="w-20 h-20 object-cover rounded border"
                  width={80}
                  height={80}
                />
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? "Adding..." : "Add Destination"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 text-center ${
            message.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

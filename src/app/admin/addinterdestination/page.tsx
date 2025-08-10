"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";

export default function AddInternationalDestination() {
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

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
    setIsSuccess(false);

    const payload = { city, description, images };

    try {
      const token = localStorage.getItem("token") ?? "";

      const response = await fetch("/api/admin/addinternationaldestinations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("International Destination added successfully!");
        setCity("");
        setDescription("");
        setImages([]);
        setIsSuccess(true);
      } else {
        setMessage(data.error || "Failed to add international destination");
        setIsSuccess(false);
      }
    } catch (err) {
      setMessage("Error: " + (err instanceof Error ? err.message : String(err)));
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-24 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Add International Destination
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g. Paris"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Write a short description..."
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Images
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* Image Previews */}
        {images.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Preview:</p>
            <div className="flex gap-3 overflow-x-auto py-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-20 h-20 flex-shrink-0 border rounded-md overflow-hidden">
                  <Image src={img} alt={`Preview ${idx + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2.5 rounded-md font-semibold hover:bg-blue-700 transition disabled:bg-blue-300"
        >
          {loading ? "Adding..." : "Add Destination"}
        </button>
      </form>

      {/* Message */}
      {message && (
        <div
          className={`mt-6 text-center text-sm font-medium ${
            isSuccess ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}

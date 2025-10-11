"use client";
import React, { useEffect, useState } from "react";

type MediaItem = {
  url: string;
  public_id?: string;
  isNew?: boolean; // mark newly uploaded files
};

type Accommodation = {
  _id?: string;
  name: string;
  location: string;
  coordinates: { lat: number | string; lng: number | string };
  media: MediaItem[];
  description?: string;
  pricePerDay: number | string;
  isActive?: boolean;
};

export default function AdminAccommodationsPage() {
  const [items, setItems] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Accommodation>({
    name: "",
    location: "",
    coordinates: { lat: "", lng: "" },
    media: [],
    description: "",
    pricePerDay: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch all accommodations
  const fetchList = async () => {
    const res = await fetch("/api/admin/accommodations");
    const data = await res.json();
    setItems(data.data || []);
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Convert file to base64
  const toBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });

  // Handle multi-file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const uploadedMedia: MediaItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const base64 = await toBase64(files[i]);
      uploadedMedia.push({ url: base64, isNew: true });
    }

    setForm((prev) => ({ ...prev, media: [...(prev.media || []), ...uploadedMedia] }));
    e.target.value = ""; // reset file input
  };

  // Remove a media item from the form
  const removeMedia = (index: number) => {
    setForm((prev) => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index),
    }));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `/api/admin/accommodations/${editingId}`
        : `/api/admin/accommodations`;

      // Separate new base64 files for upload
      const mediaFiles = form.media.filter((m) => m.isNew).map((m) => m.url);

      const body: any = {
        ...form,
        pricePerDay: form.pricePerDay !== "" ? Number(form.pricePerDay) : 0,
        coordinates: {
          lat: Number(form.coordinates.lat),
          lng: Number(form.coordinates.lng),
        },
        mediaFiles,
      };

      // Keep existing media (already uploaded) in PUT
      if (editingId) {
        body.existingMedia = form.media.filter((m) => !m.isNew);
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to save");

      // Reset form
      setForm({
        name: "",
        location: "",
        coordinates: { lat: "", lng: "" },
        media: [],
        description: "",
        pricePerDay: "",
      });
      setEditingId(null);
      fetchList();
    } catch (err) {
      alert("Error saving accommodation");
    } finally {
      setLoading(false);
    }
  };

  // Edit accommodation
  const handleEdit = (doc: Accommodation) => {
    setEditingId(doc._id!);
    setForm({
      name: doc.name,
      location: doc.location,
      coordinates: { lat: String(doc.coordinates.lat), lng: String(doc.coordinates.lng) },
      media: doc.media || [],
      description: doc.description || "",
      pricePerDay: String(doc.pricePerDay),
    });
  };

  // Delete accommodation
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this accommodation?")) return;
    await fetch(`/api/admin/accommodations/${id}`, { method: "DELETE" });
    fetchList();
  };

  return (
    <div className="p-6 max-w-5xl py-12 mx-auto">
      <h1 className="text-2xl font-bold mb-4">{editingId ? "Edit" : "Add"} Accommodation</h1>

      <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 rounded shadow">
        <input
          className="border p-2 w-full rounded"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="border p-2 w-full rounded"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            className="border p-2 w-full rounded"
            placeholder="Latitude"
            value={form.coordinates.lat}
            onChange={(e) =>
              setForm({ ...form, coordinates: { ...form.coordinates, lat: e.target.value } })
            }
            required
          />
          <input
            className="border p-2 w-full rounded"
            placeholder="Longitude"
            value={form.coordinates.lng}
            onChange={(e) =>
              setForm({ ...form, coordinates: { ...form.coordinates, lng: e.target.value } })
            }
            required
          />
        </div>

        <textarea
          className="border p-2 w-full rounded"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          type="number"
          className="border p-2 w-full rounded"
          placeholder="Price per day"
          value={form.pricePerDay}
          onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })}
          required
        />

        {/* Multi-file upload */}
        <div>
          <label className="font-medium">Media</label>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} className="mt-2" />
          <div className="flex gap-2 flex-wrap mt-2">
            {form.media.map((m, index) => (
              <div key={index} className="relative">
                <img src={m.url} alt="media" className="w-16 h-16 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => removeMedia(index)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button disabled={loading} className="bg-teal-700 text-white px-4 py-2 rounded">
            {loading ? "Saving..." : editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded"
              onClick={() => {
                setEditingId(null);
                setForm({
                  name: "",
                  location: "",
                  coordinates: { lat: "", lng: "" },
                  media: [],
                  description: "",
                  pricePerDay: "",
                });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="text-xl font-semibold mt-8 mb-3">All Accommodations</h2>
      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it._id} className="flex items-center justify-between p-3 border rounded bg-white">
            <div>
              <p className="font-semibold">{it.name}</p>
              <p className="text-sm text-gray-600">
                {it.location} · ₹{it.pricePerDay}/day
              </p>
            </div>
            <div className="space-x-3">
              <button className="text-blue-600" onClick={() => handleEdit(it)}>
                Edit
              </button>
              <button className="text-red-600" onClick={() => handleDelete(it._id!)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

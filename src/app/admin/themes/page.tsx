"use client";

import { useState, useEffect } from "react";

interface Theme {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  priceRange?: { min: number; max: number };
  experiences: any[];
}

export default function ThemeAdminPage() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    imageFile: "",
    minPrice: "",
    maxPrice: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchThemes();
  }, []);

  async function fetchThemes() {
    try {
      const res = await fetch("/api/admin/themes");
      const data = await res.json();
      setThemes(data);
    } catch (err) {
      console.error("Error fetching themes:", err);
    }
  }

  // Convert selected image to base64
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm({ ...form, imageFile: reader.result as string });
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `/api/admin/themes/${editingId}`
        : "/api/admin/themes";

      const body = {
        ...form,
        priceRange: {
          min: form.minPrice ? Number(form.minPrice) : 0,
          max: form.maxPrice ? Number(form.maxPrice) : 0,
        },
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to save theme");

      setForm({ name: "", description: "", imageFile: "", minPrice: "", maxPrice: "" });
      setEditingId(null);
      fetchThemes();
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this theme?")) return;
    await fetch(`/api/admin/themes/${id}`, { method: "DELETE" });
    fetchThemes();
  }

  function handleEdit(theme: Theme) {
    setEditingId(theme._id);
    setForm({
      name: theme.name,
      description: theme.description || "",
      imageFile: theme.image || "",
      minPrice: theme.priceRange?.min?.toString() || "",
      maxPrice: theme.priceRange?.max?.toString() || "",
    });
  }

  return (
    <div className="p-6 max-w-4xl py-12 md:py-24 mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-teal-800">
        {editingId ? "Edit Theme" : "Add Theme"}
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-2xl shadow"
      >
        <input
          placeholder="Theme name"
          className="border p-2 w-full rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <textarea
          placeholder="Description"
          className="border p-2 w-full rounded"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Min Price"
            className="border p-2 w-full rounded"
            value={form.minPrice}
            onChange={(e) => setForm({ ...form, minPrice: e.target.value })}
          />
          <input
            type="number"
            placeholder="Max Price"
            className="border p-2 w-full rounded"
            value={form.maxPrice}
            onChange={(e) => setForm({ ...form, maxPrice: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Theme Image
          </label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="border p-2 w-full rounded" />
          {form.imageFile && (
            <img
              src={form.imageFile}
              alt="Preview"
              className="mt-3 w-32 h-32 object-cover rounded"
            />
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded"
          >
            {loading ? "Saving..." : editingId ? "Update Theme" : "Add Theme"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ name: "", description: "", imageFile: "", minPrice: "", maxPrice: "" });
              }}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List of Themes */}
      <h2 className="text-2xl font-semibold mt-8 mb-3">All Themes</h2>

      <ul className="space-y-3">
        {themes.map((theme) => (
          <li
            key={theme._id}
            className="flex items-center justify-between p-3 border rounded-lg shadow-sm bg-white"
          >
            <div className="flex items-center gap-4">
              {theme.image && (
                <img
                  src={theme.image}
                  alt={theme.name}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div>
                <p className="font-semibold text-teal-800">{theme.name}</p>
                {theme.description && (
                  <p className="text-gray-600 text-sm">{theme.description}</p>
                )}
                {theme.priceRange?.min && theme.priceRange?.max && (
                  <p className="text-gray-700 text-sm">
                    ₹{theme.priceRange.min.toLocaleString()} – ₹{theme.priceRange.max.toLocaleString()}
                  </p>
                )}
                <p className="text-gray-500 text-sm mt-1">
                  Experiences linked: {theme.experiences?.length || 0}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleEdit(theme)} className="text-blue-600 hover:underline">
                Edit
              </button>
              <button onClick={() => handleDelete(theme._id)} className="text-red-600 hover:underline">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Theme {
  _id: string;
  name: string;
}

interface TravelPackage {
  _id: string;
  name: string;
  type: "domestic" | "international";
}

interface Experience {
  _id: string;
  name: string;
  description?: string;
  media: string[];
  iconPack?: string;
  duration?: number;
  preferredTime?: string;
  tips?: string;
  price?: number;
  peopleRequired?: string;
  theme?: Theme;
  linkedPackages?: string[]; // Storing package IDs for linking
}

export default function ExperienceAdminPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [domesticPackages, setDomesticPackages] = useState<TravelPackage[]>([]);
  const [internationalPackages, setInternationalPackages] = useState<TravelPackage[]>([]);
  const [basketPackages, setBasketPackages] = useState<TravelPackage[]>([]);
  const [form, setForm] = useState<any>({
    name: "",
    description: "",
    theme: "",
    linkedPackages: [],
    duration: "",
    preferredTime: "",
    tips: "",
    price: "",
    peopleRequired: "Solo",
    mediaFiles: [],
    iconPack: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch experiences from API
  async function fetchExperiences() {
    const res = await fetch("/api/admin/experiences");
    const data = await res.json();
    setExperiences(data.data || []);
  }

  // Fetch themes and packages
  async function fetchDropdowns() {
    const [themesRes, packagesRes] = await Promise.all([
      fetch("/api/admin/themes"),
      fetch("/api/admin/packages/dropdown"),
    ]);
    const themesData = await themesRes.json();
    const packagesData = await packagesRes.json();

    setThemes(themesData || []);
    if (packagesData.success) {
      const dom = packagesData.data.domestic || [];
      const intl = packagesData.data.international || [];
      setDomesticPackages(dom);
      setInternationalPackages(intl);
    }
  }

  useEffect(() => {
    fetchExperiences();
    fetchDropdowns();
  }, []);

  // File upload handlers
  async function handleMediaUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    const newMedia: string[] = [];
    for (const file of Array.from(files)) {
      const reader = new FileReader();
      await new Promise<void>((resolve) => {
        reader.onloadend = () => {
          newMedia.push(reader.result as string);
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }
    setForm({ ...form, mediaFiles: [...(form.mediaFiles || []), ...newMedia] });
  }

  async function handleIconUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm({ ...form, iconPack: reader.result });
    reader.readAsDataURL(file);
  }

  // Handle drag and drop of packages
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    const reorder = (list: TravelPackage[], startIdx: number, endIdx: number) => {
      const updated = Array.from(list);
      const [removed] = updated.splice(startIdx, 1);
      updated.splice(endIdx, 0, removed);
      return updated;
    };

    if (
      source.droppableId === "basket" &&
      destination.droppableId === "basket"
    ) {
      const reordered = reorder(basketPackages, source.index, destination.index);
      setBasketPackages(reordered);
      setForm({ ...form, linkedPackages: reordered.map((p) => p._id) });
      return;
    }

    let packageToMove: TravelPackage | undefined;
    if (source.droppableId === "domestic") {
      packageToMove = domesticPackages[source.index];
      setDomesticPackages(domesticPackages.filter((_, i) => i !== source.index));
    } else if (source.droppableId === "international") {
      packageToMove = internationalPackages[source.index];
      setInternationalPackages(internationalPackages.filter((_, i) => i !== source.index));
    } else if (source.droppableId === "basket") {
      packageToMove = basketPackages[source.index];
      setBasketPackages(basketPackages.filter((_, i) => i !== source.index));
    }

    if (!packageToMove) return;

    if (destination.droppableId === "basket") {
      const newBasket = Array.from(basketPackages);
      newBasket.splice(destination.index, 0, packageToMove);
      setBasketPackages(newBasket);
      setForm({ ...form, linkedPackages: newBasket.map((p) => p._id) });
    } else if (destination.droppableId === "domestic") {
      const newDomestic = Array.from(domesticPackages);
      newDomestic.splice(destination.index, 0, packageToMove);
      setDomesticPackages(newDomestic);
    } else if (destination.droppableId === "international") {
      const newInternational = Array.from(internationalPackages);
      newInternational.splice(destination.index, 0, packageToMove);
      setInternationalPackages(newInternational);
    }
  };

  // Form submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `/api/admin/experiences/${editingId}`
        : `/api/admin/experiences`;

      const body = {
        ...form,
        duration: form.duration ? Number(form.duration) : undefined,
        price: form.price ? Number(form.price) : undefined,
        linkedPackages: basketPackages.map(p => p._id), // keep linked packages synced with basket
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to save experience");

      setForm({
        name: "",
        description: "",
        theme: "",
        linkedPackages: [],
        duration: "",
        preferredTime: "",
        tips: "",
        price: "",
        peopleRequired: "Solo",
        mediaFiles: [],
        iconPack: "",
      });
      setEditingId(null);
      setBasketPackages([]);
      fetchExperiences();
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  // Delete experience
  async function handleDelete(id: string) {
    if (!confirm("Delete this experience?")) return;
    await fetch(`/api/admin/experiences/${id}`, { method: "DELETE" });
    fetchExperiences();
  }

  // Edit experience - pre-fill form and selected packages
  function handleEdit(exp: Experience) {
    setEditingId(exp._id);
    setForm({
      name: exp.name,
      description: exp.description || "",
      theme: exp.theme?._id || "",
      linkedPackages: exp.linkedPackages || [],
      duration: exp.duration || "",
      preferredTime: exp.preferredTime || "",
      tips: exp.tips || "",
      price: exp.price || "",
      peopleRequired: exp.peopleRequired || "Solo",
      mediaFiles: exp.media || [],
      iconPack: exp.iconPack || "",
    });
    // Set basketPackages array with package objects based on IDs
    const selectedPackages = [...domesticPackages, ...internationalPackages].filter(pkg => exp.linkedPackages?.includes(typeof pkg === 'string' ? pkg : pkg._id));
    setBasketPackages(selectedPackages);
  }

  // Remove media from form state
  function handleRemoveMedia(url: string) {
    setForm({ ...form, mediaFiles: form.mediaFiles.filter((m: string) => m !== url) });
  }

  return (
    <div className="p-6 max-w-7xl py-24 mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-teal-800">
        {editingId ? "Edit Experience" : "Add Experience"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow">
        {/* Basic inputs */}
        <input
          placeholder="Experience Name"
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
            placeholder="Duration (hr)"
            className="border p-2 w-full rounded"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
          />
          <input
            type="text"
            placeholder="Preferred Time"
            className="border p-2 w-full rounded"
            value={form.preferredTime}
            onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
          />
        </div>
        <input
          type="number"
          placeholder="Price"
          className="border p-2 w-full rounded"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="Tips"
          className="border p-2 w-full rounded"
          value={form.tips}
          onChange={(e) => setForm({ ...form, tips: e.target.value })}
        />
        <select
          className="border p-2 w-full rounded"
          value={form.peopleRequired}
          onChange={(e) => setForm({ ...form, peopleRequired: e.target.value })}
        >
          <option value="Solo">Solo</option>
          <option value="Couple">Couple</option>
          <option value="Group">Group</option>
        </select>
        <select
          className="border p-2 w-full rounded"
          value={form.theme}
          onChange={(e) => setForm({ ...form, theme: e.target.value })}
        >
          <option value="">Select Theme</option>
          {themes.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>

        {/* Drag and Drop Package Lists */}
        <div className="grid grid-cols-3 gap-6 mt-6">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="domestic">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="border rounded p-4 shadow h-96 overflow-auto"
                >
                  <h3 className="font-semibold mb-3">Domestic Packages</h3>
                  {domesticPackages.map((pkg, index) => (
                    <Draggable key={pkg._id} draggableId={pkg._id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`mb-2 p-2 border rounded cursor-pointer ${
                            snapshot.isDragging ? "bg-teal-100" : "bg-white"
                          }`}
                        >
                          {pkg.name}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <Droppable droppableId="international">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="border rounded p-4 shadow h-96 overflow-auto"
                >
                  <h3 className="font-semibold mb-3">International Packages</h3>
                  {internationalPackages.map((pkg, index) => (
                    <Draggable key={pkg._id} draggableId={pkg._id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`mb-2 p-2 border rounded cursor-pointer ${
                            snapshot.isDragging ? "bg-teal-100" : "bg-white"
                          }`}
                        >
                          {pkg.name}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <Droppable droppableId="basket">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="border rounded p-4 shadow h-96 overflow-auto bg-teal-50"
                >
                  <h3 className="font-semibold mb-3">Selected Packages</h3>
                  {basketPackages.length === 0 && (
                    <p className="text-gray-500">Drag packages here</p>
                  )}
                  {basketPackages.map((pkg, index) => (
                    <Draggable key={pkg._id} draggableId={pkg._id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`mb-2 p-2 border rounded cursor-pointer ${
                            snapshot.isDragging ? "bg-teal-200" : "bg-white"
                          }`}
                        >
                          {pkg.name} ({pkg.type === "international" ? "Intl" : "Dom"})
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* Icon Upload */}
        <div className="mt-6">
          <label className="block mb-1 font-medium">Icon</label>
          <input type="file" accept="image/*" onChange={handleIconUpload} />
          {form.iconPack && (
            <img
              src={form.iconPack}
              alt="Icon Preview"
              className="w-16 h-16 mt-2 rounded"
            />
          )}
        </div>

        {/* Media Upload */}
        <div className="mt-4">
          <label className="block mb-1 font-medium">Media</label>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleMediaUpload}
          />
          <div className="flex gap-2 flex-wrap mt-2">
            {form.mediaFiles?.map((m: string) => (
              <div key={m} className="relative">
                <img src={m} className="w-16 h-16 object-cover rounded" alt="media" />
                <button
                  type="button"
                  onClick={() => handleRemoveMedia(m)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit buttons */}
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-2 rounded"
          >
            {loading ? (editingId ? "Updating..." : "Saving...") : editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({
                  name: "",
                  description: "",
                  theme: "",
                  linkedPackages: [],
                  duration: "",
                  preferredTime: "",
                  tips: "",
                  price: "",
                  peopleRequired: "Solo",
                  mediaFiles: [],
                  iconPack: "",
                });
                setBasketPackages([]);
              }}
              className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Experiences List */}
      <h2 className="text-2xl font-semibold mt-12 mb-4">All Experiences</h2>
      <ul className="space-y-3">
        {experiences.map((exp) => (
          <li
            key={exp._id}
            className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white"
          >
            <div className="flex items-center gap-4">
              {exp.iconPack && (
                <img
                  src={exp.iconPack}
                  alt="Icon"
                  className="w-12 h-12 rounded"
                />
              )}
              <div>
                <p className="font-semibold text-teal-800">{exp.name}</p>
                <p className="text-gray-600 text-sm">{exp.description}</p>
                {exp.theme && (
                  <p className="text-gray-700 text-sm">
                    Theme: {exp.theme.name}
                  </p>
                )}
                {exp.linkedPackages && exp.linkedPackages.length > 0 && (
                  <p className="text-gray-700 text-sm">
                    Linked Packages: {exp.linkedPackages.length}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => handleEdit(exp)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(exp._id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

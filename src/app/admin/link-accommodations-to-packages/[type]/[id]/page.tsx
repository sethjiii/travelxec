"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface Accommodation {
  _id: string;
  name: string;
  location: string;
  pricePerDay: number;
  image?: string;
}

interface LinkedAccommodation {
  accommodationId: Accommodation | null;
  nights: number;
  checkInDay: number;
}

const placeholderImage = "https://via.placeholder.com/80x60?text=No+Image";

export default function PackageAccommodationsPage() {
  const { type, id } = useParams() as { type: string; id: string };
  const [available, setAvailable] = useState<Accommodation[]>([]);
  const [linked, setLinked] = useState<LinkedAccommodation[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [nights, setNights] = useState(1);
  const [checkInDay, setCheckInDay] = useState(1);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/accommodations")
      .then((r) => r.json())
      .then((d) => setAvailable(d.data || []));
    fetchLinked();
  }, []);

  const fetchLinked = () =>
    fetch(`/api/admin/packages/${type}/${id}/accommodations`)
      .then((r) => r.json())
      .then((d) => setLinked(d.data || []));

  const toggleSelect = (accId: string) => {
    setSelectedIds((prev) =>
      prev.includes(accId) ? prev.filter((i) => i !== accId) : [...prev, accId]
    );
  };

  const handleLink = async () => {
    if (selectedIds.length === 0) return alert("Select at least one accommodation");
    setLoading(true);

    for (const accId of selectedIds) {
      const res = await fetch(`/api/admin/packages/${type}/${id}/accommodations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accommodationId: accId, nights, checkInDay }),
      });
      const j = await res.json();
      if (!j.success) {
        alert(`Failed to link accommodation ID ${accId}: ${j.error || "unknown error"}`);
        setLoading(false);
        return;
      }
    }

    setSelectedIds([]);
    await fetchLinked();
    setLoading(false);
  };

  const unlinkAccommodation = async (accId: string) => {
    if (!confirm("Remove this accommodation?")) return;
    const res = await fetch(`/api/admin/packages/${type}/${id}/accommodations`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accommodationId: accId }),
    });
    const j = await res.json();
    if (j.success) fetchLinked();
    else alert("Failed to remove accommodation");
  };

  return (
    <div className="max-w-6xl py-24 mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-teal-700 mb-4">
        Manage Accommodations — {type.toUpperCase()} / {id} 
      </h1>

      {/* Available List */}
      <div className="p-5 border rounded-2xl shadow bg-white space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Available Accommodations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-auto">
          {available.map((acc) => (
            <label
              key={acc._id}
              className={`flex items-center gap-3 p-2 rounded-lg border ${
                selectedIds.includes(acc._id)
                  ? "border-teal-600 bg-teal-50"
                  : "border-gray-200"
              } cursor-pointer`}
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(acc._id)}
                onChange={() => toggleSelect(acc._id)}
              />
              <img
                src={acc.image || placeholderImage}
                alt={acc.name}
                className="w-16 h-12 object-cover rounded-md border"
              />
              <div>
                <p className="font-medium">{acc.name}</p>
                <p className="text-sm text-gray-600">{acc.location}</p>
                <p className="text-sm font-semibold text-teal-700">
                  ₹{acc.pricePerDay}/day
                </p>
              </div>
            </label>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <label className="flex items-center space-x-2">
            <span>Nights:</span>
            <input
              type="number"
              min={1}
              value={nights}
              onChange={(e) => setNights(Number(e.target.value))}
              className="w-20 p-1 border rounded"
            />
          </label>

          <label className="flex items-center space-x-2">
            <span>Check-in Day:</span>
            <input
              type="number"
              min={1}
              value={checkInDay}
              onChange={(e) => setCheckInDay(Number(e.target.value))}
              className="w-20 p-1 border rounded"
            />
          </label>

          <button
            onClick={handleLink}
            disabled={loading}
            className="bg-teal-700 text-white px-4 py-2 rounded-lg hover:bg-teal-800 transition disabled:opacity-50"
          >
            {loading ? "Linking..." : "Link Selected"}
          </button>
        </div>
      </div>

      {/* Linked List */}
      <div className="p-5 border rounded-2xl shadow bg-white">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Linked Accommodations
        </h2>
        {linked.length === 0 ? (
          <p className="text-gray-500">No accommodations linked yet.</p>
        ) : (
          <ul className="space-y-3 max-h-[400px] overflow-auto">
            {linked.map(({ accommodationId, nights, checkInDay }, i) => {
              if (!accommodationId) return null;
              return (
                <li
                  key={`${accommodationId._id}-${i}`}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={accommodationId.image || placeholderImage}
                      alt={accommodationId.name}
                      onClick={() =>
                        setPreviewImage(accommodationId.image || placeholderImage)
                      }
                      className="w-16 h-12 object-cover rounded-md border cursor-pointer hover:scale-105 transition"
                    />
                    <div>
                      <p className="font-medium">{accommodationId.name}</p>
                      <p className="text-sm text-gray-600">
                        {accommodationId.location}
                      </p>
                      <p className="text-sm text-gray-500">
                        {nights} night(s) — Check-in Day {checkInDay}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => unlinkAccommodation(accommodationId._id)}
                    className="text-red-600 hover:text-red-800 font-semibold"
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Preview"
            className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg border-4 border-white"
          />
        </div>
      )}
    </div>
  );
}

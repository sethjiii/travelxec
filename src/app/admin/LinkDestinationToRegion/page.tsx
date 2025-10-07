"use client";

import React, { useEffect, useState } from "react";

interface Region {
  _id: string;
  name: string;
}

interface Destination {
  _id: string;
  city: string;
  region?: string | null;
}

interface ApiResponse {
  domesticDestinations: Destination[];
  internationalDestinations: Destination[];
  regions: Region[];
}

export default function LinkDestinationsToRegion() {
  const [domestic, setDomestic] = useState<Destination[]>([]);
  const [international, setInternational] = useState<Destination[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [bulkDomesticRegion, setBulkDomesticRegion] = useState("");
  const [bulkInternationalRegion, setBulkInternationalRegion] = useState("");
  const [bulkUpdating, setBulkUpdating] = useState(false);

  // Fetch destinations + regions
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/link-destinations-to-region", { cache: "no-store" });
      const data: ApiResponse = await res.json();
      setDomestic(data.domesticDestinations);
      setInternational(data.internationalDestinations);
      setRegions(data.regions);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch destinations or regions");
    } finally {
      setLoading(false);
    }
  };

  // Update destination's region (link/unlink)
  const handleRegionChange = async (
    destinationId: string,
    type: "domestic" | "international",
    regionId: string
  ) => {
    setUpdatingId(destinationId);
    try {
      const token = localStorage.getItem("token") ?? "";
      const res = await fetch("/api/admin/link-destinations-to-region", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ destinationId, type, regionId: regionId || null }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update region");

      setMessage(regionId ? `✅ Region linked successfully` : `✅ Region unlinked successfully`);

      const updateList = (list: Destination[]) =>
        list.map((d) => (d._id === destinationId ? { ...d, region: regionId || null } : d));

      if (type === "domestic") setDomestic(updateList(domestic));
      else setInternational(updateList(international));
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  // Bulk update function
  const handleBulkUpdate = async (type: "domestic" | "international", regionId: string) => {
    const destinations = type === "domestic" ? domestic : international;
    if (destinations.length === 0) return;

    setBulkUpdating(true);
    try {
      const token = localStorage.getItem("token") ?? "";
      for (const dest of destinations) {
        await fetch("/api/admin/link-destinations-to-region", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ destinationId: dest._id, type, regionId: regionId || null }),
        });
      }

      setMessage(regionId ? `✅ All ${type} destinations linked!` : `✅ All ${type} destinations unlinked!`);

      // Update local state
      const updateList = destinations.map((d) => ({ ...d, region: regionId || null }));
      if (type === "domestic") setDomestic(updateList);
      else setInternational(updateList);
    } catch (err: any) {
      setMessage(`❌ Bulk update failed: ${err.message}`);
    } finally {
      setBulkUpdating(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading destinations...</p>;

  const renderDestination = (dest: Destination, type: "domestic" | "international") => (
    <div key={dest._id} className="p-3 border rounded flex items-center justify-between">
      <span>{dest.city}</span>
      <select
        value={dest.region || ""}
        onChange={(e) => handleRegionChange(dest._id, type, e.target.value)}
        className="border px-2 py-1 rounded"
        disabled={updatingId === dest._id || bulkUpdating}
      >
        <option value="">-- Unlink / Select Region --</option>
        {regions.map((region) => (
          <option key={region._id} value={region._id}>
            {region.name}
          </option>
        ))}
      </select>
      {updatingId === dest._id && <span className="ml-2 text-sm text-gray-500">Updating...</span>}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Link Destinations to Regions</h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded text-sm ${
            message.startsWith("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* Domestic Destinations */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-3">Domestic Destinations</h3>

        <div className="flex gap-2 mb-4 items-center">
          <select
            value={bulkDomesticRegion}
            onChange={(e) => setBulkDomesticRegion(e.target.value)}
            className="border px-2 py-1 rounded"
            disabled={bulkUpdating}
          >
            <option value="">-- Unlink All / Select Region --</option>
            {regions.map((region) => (
              <option key={region._id} value={region._id}>
                {region.name}
              </option>
            ))}
          </select>
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => handleBulkUpdate("domestic", bulkDomesticRegion)}
            disabled={bulkUpdating || domestic.length === 0}
          >
            {bulkUpdating ? "Updating..." : "Link All"}
          </button>
        </div>

        {domestic.length === 0 ? (
          <p>No domestic destinations found.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">{domestic.map((d) => renderDestination(d, "domestic"))}</div>
        )}
      </section>

      {/* International Destinations */}
      <section>
        <h3 className="text-xl font-semibold mb-3">International Destinations</h3>

        <div className="flex gap-2 mb-4 items-center">
          <select
            value={bulkInternationalRegion}
            onChange={(e) => setBulkInternationalRegion(e.target.value)}
            className="border px-2 py-1 rounded"
            disabled={bulkUpdating}
          >
            <option value="">-- Unlink All / Select Region --</option>
            {regions.map((region) => (
              <option key={region._id} value={region._id}>
                {region.name}
              </option>
            ))}
          </select>
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => handleBulkUpdate("international", bulkInternationalRegion)}
            disabled={bulkUpdating || international.length === 0}
          >
            {bulkUpdating ? "Updating..." : "Link All"}
          </button>
        </div>

        {international.length === 0 ? (
          <p>No international destinations found.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">{international.map((d) => renderDestination(d, "international"))}</div>
        )}
      </section>
    </div>
  );
}

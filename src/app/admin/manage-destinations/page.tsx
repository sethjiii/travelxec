"use client";

import React, { useEffect, useState } from "react";

interface Region {
    _id: string;
    name: string;
}

interface Package {
    _id: string;
    name: string;
    description: string;
}

interface Destination {
    _id: string;
    city: string;
    description: string;
    region?: Region;
    image?: string;
    images?: string[];
    packages?: Package[];
}

// Form type: store region as string (region _id)
interface DestinationForm extends Omit<Destination, "region"> {
    region?: string;
    images: string[];
}

export default function ManageDestinations() {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [regions, setRegions] = useState<Region[]>([]);
    const [selectedRegion, setSelectedRegion] = useState<string>("");
    const [type, setType] = useState<"domestic" | "international">("domestic");

    const [formData, setFormData] = useState<DestinationForm>({
        _id: "",
        city: "",
        description: "",
        region: "",
        images: [],
    });

    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const [packageModalOpen, setPackageModalOpen] = useState(false);
    const [allPackages, setAllPackages] = useState<Package[]>([]);
    const [currentPackages, setCurrentPackages] = useState<Package[]>([]);
    const [modalLoading, setModalLoading] = useState(false);

    // Fetch regions, packages, destinations
    useEffect(() => {
        fetchRegions();
        fetchAllPackages();
        setSelectedRegion("");
        fetchDestinations();
    }, [type]);

    const fetchRegions = async () => {
        try {
            const res = await fetch("/api/admin/regions");
            const data = await res.json();
            setRegions(data);
        } catch (err) {
            console.error("Error fetching regions:", err);
        }
    };

    const fetchAllPackages = async () => {
        try {
            const res = await fetch("/api/admin/packages");
            const data = await res.json();
            setAllPackages(data);
        } catch (err) {
            console.error("Error fetching packages:", err);
        }
    };

    const fetchDestinations = async (regionId?: string) => {
        setLoading(true);
        try {
            const url = regionId
                ? `/api/admin/manage-destination?type=${type}&regionId=${regionId}`
                : `/api/admin/manage-destination?type=${type}`;
            const res = await fetch(url);
            const data = await res.json();
            setDestinations(data);
        } catch (err) {
            console.error("Error fetching destinations:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const base64Images: string[] = [];
        let loaded = 0;

        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) base64Images.push(ev.target.result as string);
                loaded++;
                if (loaded === files.length) {
                    setPreviewImages(base64Images);
                    setFormData({ ...formData, images: base64Images });
                }
            };
            reader.readAsDataURL(files[i]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        const token = localStorage.getItem("token") ?? "";

        try {
            const method = formData._id ? "PUT" : "POST";
            const res = await fetch("/api/admin/manage-destination", {
                method,
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ ...formData, type }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage(formData._id ? "Destination updated!" : "Destination added!");
                resetForm();
                fetchDestinations(selectedRegion || undefined);
            } else {
                setMessage(data.error || "Something went wrong");
            }
        } catch (err) {
            console.error(err);
            setMessage("Error submitting form");
        } finally {
            setLoading(false);
        }
    };

    const handleEditDestination = (dest: Destination) => {
        setFormData({
            _id: dest._id,
            city: dest.city,
            description: dest.description,
            region: dest.region?._id || "",
            images: dest.images || [],
        });
        setPreviewImages(dest.images || []);
        setCurrentPackages(dest.packages || []);
    };

    const handleDeleteDestination = async (_id: string) => {
        if (!confirm("Are you sure you want to delete this destination?")) return;
        const token = localStorage.getItem("token") ?? "";

        try {
            const res = await fetch(`/api/admin/manage-destination?id=${_id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) fetchDestinations(selectedRegion || undefined);
            else alert(data.error);
        } catch (err) {
            console.error(err);
        }
    };

    const resetForm = () => {
        setFormData({
            _id: "",
            city: "",
            description: "",
            region: "",
            images: [],
        });
        setPreviewImages([]);
        setCurrentPackages([]);
    };

    const openPackageModal = (destPackages: Package[], destId: string) => {
        // No need to convert region to Region type
        setFormData((prev) => ({
            ...prev,
            _id: destId,
        }));
        setCurrentPackages(destPackages);
        setPackageModalOpen(true);
    };

    const togglePackageLink = async (pkg: Package) => {
        if (!formData._id) return;
        setModalLoading(true);
        const token = localStorage.getItem("token") ?? "";
        const isLinked = currentPackages.some((p) => p._id === pkg._id);

        try {
            const res = await fetch("/api/admin/manage-destination", {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    destinationId: formData._id,
                    packageId: pkg._id,
                    action: isLinked ? "unlink" : "link",
                }),
            });
            const data = await res.json();
            if (res.ok) {
                fetchDestinations(selectedRegion || undefined);
                setCurrentPackages((prev) =>
                    isLinked ? prev.filter((p) => p._id !== pkg._id) : [...prev, pkg]
                );
            } else alert(data.error);
        } catch (err) {
            console.error(err);
        } finally {
            setModalLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-24">
            <h2 className="text-2xl font-bold mb-6">Manage Destinations</h2>

            {/* Type & Region filter */}
            <div className="flex gap-3 flex-wrap mb-6 items-center">
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value as "domestic" | "international")}
                    className="border px-3 py-2 rounded"
                >
                    <option value="domestic">Domestic</option>
                    <option value="international">International</option>
                </select>

                <select
                    value={selectedRegion}
                    onChange={(e) => {
                        const regionId = e.target.value;
                        setSelectedRegion(regionId);
                        fetchDestinations(regionId || undefined);
                    }}
                    className="border px-3 py-2 rounded w-60"
                >
                    <option value="">All Regions</option>
                    {regions.map((r) => (
                        <option key={r._id} value={r._id}>
                            {r.name}
                        </option>
                    ))}
                </select>

                <button
                    className="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300"
                    onClick={() => {
                        setSelectedRegion("");
                        fetchDestinations();
                    }}
                >
                    Reset
                </button>
            </div>

            {/* Destination form */}
            <form onSubmit={handleSubmit} className="border rounded-lg p-6 mb-8 shadow-md bg-white">
                <h3 className="text-lg font-semibold mb-4">
                    {formData._id ? "Edit Destination" : "Add New Destination"}
                </h3>

                <label className="block mb-2 font-semibold">City *</label>
                <input
                    type="text"
                    value={formData.city || ""}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="border rounded w-full px-3 py-2 mb-4"
                    required
                />

                <label className="block mb-2 font-semibold">Description</label>
                <textarea
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="border rounded w-full px-3 py-2 mb-4"
                />

                <label className="block mb-2 font-semibold">Region *</label>
                <select
                    value={formData.region || ""}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="border rounded w-full px-3 py-2 mb-4"
                    required
                >
                    <option value="">Select Region</option>
                    {regions.map((r) => (
                        <option key={r._id} value={r._id}>
                            {r.name}
                        </option>
                    ))}
                </select>

                <label className="block mb-2 font-semibold">Images</label>
                <input type="file" multiple accept="image/*" onChange={handleImageChange} />
                {previewImages.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto mt-3">
                        {previewImages.map((img, i) => (
                            <img
                                key={i}
                                src={img}
                                alt="preview"
                                className="rounded border w-20 h-20 object-cover"
                            />
                        ))}
                    </div>
                )}

                <div className="flex gap-3 mt-4">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        disabled={loading}
                    >
                        {formData._id ? "Update Destination" : "Add Destination"}
                    </button>
                    {formData._id && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            {/* Destinations list */}
            {loading ? (
                <p>Loading...</p>
            ) : destinations.length === 0 ? (
                <p>No destinations found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {destinations.map((dest) => (
                        <div key={dest._id} className="border rounded-lg p-4 shadow-sm bg-white">
                            <img
                                src={dest.image || "/placeholder.png"}
                                alt={dest.city}
                                className="rounded-md mb-2 w-full h-40 object-cover"
                            />
                            <h4 className="font-bold">{dest.city}</h4>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{dest.description}</p>
                            <p className="text-xs text-gray-500">
                                Region: {dest.region?.name || "Unlinked"}
                            </p>
                            <p className="text-xs text-gray-500">Packages: {dest.packages?.length || 0}</p>

                            <div className="flex gap-2 mt-3 flex-wrap">
                                <button
                                    onClick={() => handleEditDestination(dest)}
                                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteDestination(dest._id)}
                                    className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => openPackageModal(dest.packages || [], dest._id)}
                                    className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                                >
                                    Manage Packages
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {message && <p className="text-center mt-4 text-blue-600">{message}</p>}

            {/* Package modal */}
            {packageModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-xl relative max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4">Manage Packages</h3>
                        <button
                            onClick={() => setPackageModalOpen(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                        >
                            ✕
                        </button>

                        {allPackages.map((pkg) => {
                            const isLinked = currentPackages.some((p) => p._id === pkg._id);
                            return (
                                <div
                                    key={pkg._id}
                                    className="border rounded p-3 mb-2 flex justify-between items-center"
                                >
                                    <div className="flex-1">
                                        <h4 className="font-semibold">{pkg.name}</h4>
                                        <p className="text-sm text-gray-600">{pkg.description}</p>
                                    </div>
                                    <button
                                        onClick={() => togglePackageLink(pkg)}
                                        className={`px-3 py-1 rounded ${
                                            isLinked ? "bg-red-600 text-white" : "bg-green-600 text-white"
                                        }`}
                                        disabled={modalLoading}
                                    >
                                        {modalLoading && isLinked ? "Processing..." : isLinked ? "Unlink" : "Link"}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

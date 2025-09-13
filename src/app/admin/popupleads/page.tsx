"use client";

import { useEffect, useState } from "react";

interface Lead {
    _id: string;
    name: string;
    email: string;
    phone: string;
    destination: string;
    budget: number;
    subscribedAt: string;
    contacted: boolean;
}

interface Meta {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export default function PopupLeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [q, setQ] = useState("");
    const [destination, setDestination] = useState("");
    const [contacted, setContacted] = useState<string | null>(null);
    const [minBudget, setMinBudget] = useState<number | "">("");
    const [maxBudget, setMaxBudget] = useState<number | "">("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [page, setPage] = useState(1);

    const fetchLeads = async (exportCsv = false) => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                page: page.toString(),
                pageSize: "10",
                ...(q ? { q } : {}),
                ...(destination ? { destination } : {}),
                ...(contacted !== null ? { contacted } : {}),
                ...(minBudget !== "" ? { minBudget: minBudget.toString() } : {}),
                ...(maxBudget !== "" ? { maxBudget: maxBudget.toString() } : {}),
                ...(startDate ? { startDate } : {}),
                ...(endDate ? { endDate } : {}),
                ...(exportCsv ? { exportCsv: "true" } : {}),
            });

            const res = await fetch(`/api/admin/popupleads?${params.toString()}`);
            if (exportCsv) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "popup_leads.csv";
                a.click();
                window.URL.revokeObjectURL(url);
                setLoading(false);
                return;
            }

            const data = await res.json();
            if (res.ok && data.success) {
                setLeads(data.leads);
                setMeta(data.meta);
            } else {
                setError(data.message || "Failed to fetch leads");
            }
        } catch (err) {
            setError("Network error");
        } finally {
            setLoading(false);
        }
    };

    const toggleContacted = async (id: string, current: boolean) => {
        try {
            const res = await fetch(`/api/admin/popupleads`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, contacted: !current }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setLeads((prev) =>
                    prev.map((lead) => (lead._id === id ? { ...lead, contacted: !current } : lead))
                );
            } else {
                alert(data.message || "Failed to update lead");
            }
        } catch {
            alert("Network error");
        }
    };

    const deleteLead = async (id: string) => {
        if (!confirm("Are you sure you want to delete this lead?")) return;
        try {
            const res = await fetch(`/api/admin/popupleads`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setLeads((prev) => prev.filter((lead) => lead._id !== id));
            } else {
                alert(data.message || "Failed to delete lead");
            }
        } catch {
            alert("Network error");
        }
    };

    useEffect(() => {
        fetchLeads();
    }, [page, q, destination, contacted, minBudget, maxBudget, startDate, endDate]);

    return (
        <div className="p-6">
            <h1 className="text-2xl text-center font-bold mb-6 py-10">Popup Leads Dashboard</h1>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
                <input
                    type="text"
                    value={q}
                    onChange={(e) => {
                        setPage(1);
                        setQ(e.target.value);
                    }}
                    placeholder="Search by name, email, phone..."
                    className="border px-3 py-2 rounded-md w-64"
                />
                <input
                    type="text"
                    value={destination}
                    onChange={(e) => {
                        setPage(1);
                        setDestination(e.target.value);
                    }}
                    placeholder="Filter by destination"
                    className="border px-3 py-2 rounded-md w-64"
                />
                <select
                    value={contacted ?? ""}
                    onChange={(e) => {
                        setPage(1);
                        setContacted(e.target.value || null);
                    }}
                    className="border px-3 py-2 rounded-md"
                >
                    <option value="">All</option>
                    <option value="true">Contacted</option>
                    <option value="false">Not Contacted</option>
                </select>
                <input
                    type="number"
                    placeholder="Min Budget"
                    value={minBudget}
                    onChange={(e) => setMinBudget(e.target.value ? Number(e.target.value) : "")}
                    className="border px-3 py-2 rounded-md w-32"
                />
                <input
                    type="number"
                    placeholder="Max Budget"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value ? Number(e.target.value) : "")}
                    className="border px-3 py-2 rounded-md w-32"
                />
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border px-3 py-2 rounded-md"
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border px-3 py-2 rounded-md"
                />
                <button
                    onClick={() => fetchLeads(true)}
                    className="px-4 py-2 bg-teal-700 text-white rounded-md hover:bg-teal-800"
                >
                    Export CSV
                </button>
            </div>

            {/* Table */}
            {loading ? (
                <p>Loading leads...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : leads.length === 0 ? (
                <p>No leads found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-2 text-left">Name</th>
                                <th className="border p-2 text-left">Email</th>
                                <th className="border p-2 text-left">Phone</th>
                                <th className="border p-2 text-left">Destination</th>
                                <th className="border p-2 text-left">Budget</th>
                                <th className="border p-2 text-left">Date</th>
                                <th className="border p-2 text-left">Contacted</th>
                                <th className="border p-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.map((lead) => (
                                <tr key={lead._id} className="hover:bg-gray-50">
                                    <td className="border p-2">{lead.name}</td>
                                    <td className="border p-2">{lead.email}</td>
                                    <td className="border p-2">{lead.phone}</td>
                                    <td className="border p-2">{lead.destination}</td>
                                    <td className="border p-2">₹{lead.budget.toLocaleString()}</td>
                                    <td className="border p-2">
                                        {new Date(lead.subscribedAt).toLocaleDateString()}
                                    </td>
                                    <td className="border p-2 text-center">
                                        <input
                                            type="checkbox"
                                            checked={!!lead.contacted} // <-- force boolean
                                            onChange={() => toggleContacted(lead._id, lead.contacted)}
                                        />
                                    </td>
                                    <td className="border p-2 text-center">
                                        <button
                                            onClick={() => deleteLead(lead._id)}
                                            className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
                <div className="flex justify-between items-center mt-6">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span>
                        Page {meta.page} of {meta.totalPages}
                    </span>
                    <button
                        disabled={page === meta.totalPages}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

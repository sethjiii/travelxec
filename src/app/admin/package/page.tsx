'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Fuse from 'fuse.js';

interface TravelPackage {
  _id: string;
  name?: string;
  title?: string;
  duration?: string;
  images?: { url: string; public_id: string }[];
  places?: string;
  OnwardPrice?: number;
  type: string;
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();
  const limit = 12;

  // Fetch packages from API
  const fetchPackages = async (currentPage = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/packages?types=domestic,international&page=${currentPage}&limit=${limit}`, {
        cache: 'no-store',
      });
      const data = await res.json();
      setPackages(data.packages || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setPage(data.pagination?.page || 1);
    } catch (err) {
      toast.error('Failed to fetch packages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;

    const res = await fetch(`/api/packages/${id}`, { method: 'DELETE' });

    if (res.ok) {
      toast.success('Package deleted');
      setPackages(prev => prev.filter(pkg => pkg._id !== id));
    } else {
      toast.error('Delete failed');
    }
  };

  // Setup Fuse.js for search
  const fuse = useMemo(() => {
    return new Fuse(packages, {
      keys: ['title', 'name', 'places'],
      threshold: 0.3,
    });
  }, [packages]);

  const filteredPackages = search
    ? fuse.search(search).map(result => result.item)
    : packages;

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 py-16">
      <h1 className="text-3xl text-center font-bold mb-6">All Packages</h1>
      <p className="text-center mb-6">
        Manage all domestic and international packages. You can edit or delete packages here.
      </p>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, title, or places..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#186663]"
        />
      </div>

      {/* Loading */}
      {loading && <p className="text-center py-10">Loading packages...</p>}

      {/* Package Grid */}
      {!loading && filteredPackages.length === 0 && <p className="text-center">No packages found.</p>}

      {!loading && filteredPackages.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map(pkg => (
            <div key={pkg._id} className="border rounded-xl p-5 shadow bg-white space-y-3">
              {/* Image */}
              <Image
                src={pkg.images?.[0]?.url || '/placeholder.png'}
                alt={pkg.title || pkg.name || 'Package'}
                width={500}
                height={300}
                className="w-full h-48 object-cover rounded-md"
              />

              {/* Title */}
              <h2 className="text-xl font-semibold text-[#002D37]">
                {pkg.title || pkg.name || 'Untitled Package'}
              </h2>

              {/* Details */}
              <div className="text-sm text-gray-500 space-y-1">
                {pkg.duration && <div>🕒 Duration: {pkg.duration}</div>}
                {pkg.places && <div>🏷️ Places: {pkg.places}</div>}
                <div>💰 Onward Price: ₹{pkg.OnwardPrice ?? 'N/A'}</div>
                <div>🌐 Type: {pkg.type}</div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => router.push(`/admin/editpackage/${pkg.type}/${pkg._id}`)}
                  className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(pkg._id)}
                  className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => router.push(`/admin/link-accommodations-to-packages/${pkg.type}/${pkg._id}`)}
                  className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Link Accommodations
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => fetchPackages(i + 1)}
              className={`px-3 py-1 rounded border ${page === i + 1 ? 'bg-[#186663] text-white' : 'bg-white'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

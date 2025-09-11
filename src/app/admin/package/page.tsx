'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Fuse from 'fuse.js';

interface TravelPackage {
  _id: string;
  title: string;
  duration: string;
  images: { url: string; public_id: string }[];
  likes: number;
  destination: string;
  name: string;
  places: string;
  rating: number;
  OnwardPrice?: number;
  type: string;
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [search, setSearch] = useState('');
  const router = useRouter();

  const fetchPackages = async () => {
    try {
      const res = await fetch('/api/packages', { cache: 'no-store' });
      const data = await res.json();
      setPackages(data.packages);
    } catch (error) {
      toast.error('Failed to fetch packages');
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
      setPackages((prev) => prev.filter((pkg) => pkg._id !== id));
    } else {
      toast.error('Delete failed');
    }
  };

  // ⚡ Setup Fuse.js
  const fuse = useMemo(() => {
    return new Fuse(packages, {
      keys: ['title', 'name', 'destination', 'places'],
      threshold: 0.3, // Lower = stricter, Higher = fuzzier
    });
  }, [packages]);

  // ⚡ Use fuzzy search when input is not empty
  const filteredPackages = search
    ? fuse.search(search).map((result) => result.item)
    : packages;

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 py-16">
      <h1 className="text-3xl text-center font-bold mb-6">All Packages</h1>
      <p className="text-center mb-6">Manage your packages here you can edit and delete packages</p>

      {/* 🔎 Fuzzy Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by title, destination, or places..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full  px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#186663]"
        />
      </div>

      {filteredPackages.length === 0 ? (
        <p>No packages found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg._id}
              className="border rounded-xl p-5 shadow bg-white space-y-3"
            >
              {pkg.images?.[0] && (
                <Image
                  src={pkg.images[0].url}
                  alt={pkg.title}
                  width={500}
                  height={300}
                  className="w-full h-48 object-cover rounded-md"
                />
              )}

              <h2 className="text-xl font-semibold text-[#002D37]">
                {pkg.title || pkg.name}
              </h2>
              <div className="text-sm text-gray-500 space-y-1">
                <div>🕒 Duration: {pkg.duration}</div>
                <div>🏷️ Places: {pkg.places}</div>
                <div>💰 Onward Price: ₹{pkg.OnwardPrice ?? 'N/A'}</div>
              </div>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() =>
                    router.push(`/admin/editpackage/${pkg.type}/${pkg._id}`)
                  }
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

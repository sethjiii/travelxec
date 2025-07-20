// src/app/favorites/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/favorites')
        .then(res => res.json())
        .then(data => {
          console.log("💾 Favorites from backend:", data); // 👈 Check structure
          setFavorites(data);
          setLoading(false);
        });
    }
  }, [status]);

  if (status === 'unauthenticated') return <p>Please log in to view your favorites.</p>;
  if (loading) return <p>Loading your favorites...</p>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Your Favorites</h1>
      {favorites.length === 0 ? (
        <p>You haven’t added any favorites yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(pkg => (
            <div key={pkg._id} className="border rounded-xl p-4 shadow-sm hover:shadow-md transition">
              {pkg.images?.length > 0 ? (
                <img
                  src={pkg.images[0].url}
                  alt={pkg.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                  No image available
                </div>
              )}
              <h2 className="text-xl font-medium">{pkg.name || 'Unnamed Package'}</h2>
              <p className="text-gray-600">
                {pkg.description ? `${pkg.description.slice(0, 100)}...` : 'No description available.'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
// This page displays the user's favorite travel packages.
// It fetches the favorites from the server and displays them in a grid layout.
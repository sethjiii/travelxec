import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export function useFavorites() {
  const { data: session } = useSession(); // For Google users
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔐 Determine if user is logged in via Google
  const isGoogleUser = typeof window !== 'undefined' &&
    !localStorage.getItem("token") &&
    !!session?.user;

  const isLoggedIn = typeof window !== 'undefined' &&
    (localStorage.getItem('token') || session?.user);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        const res = await fetch('/api/favorites', {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: isGoogleUser ? 'include' : 'same-origin',
        });

        const data = await res.json();

        if (Array.isArray(data)) {
          const ids = data.map((item: any) => item._id || item); // handles populated or raw IDs
          setFavorites(ids);
        } else {
          console.warn('Favorites response is not an array:', data);
        }
      } catch (err) {
        console.error('Failed to load favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [session]);

  const toggleFavorite = async (packageId: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    // 🛑 User is not logged in (neither Google nor JWT)
    if (!isLoggedIn) {
      alert("Please log in to add to your wishlist.");
      return;
    }

    const isFav = favorites.includes(packageId);
    const method = isFav ? 'DELETE' : 'POST';

    try {
      const res = await fetch('/api/favorites', {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: isGoogleUser ? 'include' : 'same-origin',
        body: JSON.stringify({ packageId }),
      });

      if (res.ok) {
        setFavorites(prev =>
          isFav ? prev.filter(id => id !== packageId) : [...prev, packageId]
        );
      } else {
        const errData = await res.json();
        console.error('Failed to update favorites:', errData);
      }
    } catch (err) {
      console.error('Error updating favorites:', err);
    }
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite: (id: string) => favorites.includes(id),
    loading,
  };
}
// This custom hook manages user favorites for travel packages.
// It fetches favorites from the server, allows toggling favorites, and tracks loading state
"use client";
import { useEffect, useState } from "react";
import { Heart, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";

interface Package {
  _id: string;
  name: string;
  type: string;
  description: string;
  duration: string;
  places: string;
  images: {
        url: string;
        public_id: string;
      }[]
  rating: number;
}

export default function SavedPlacesPage() {
  const [favorites, setFavorites] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setFavorites(data || []);
      } catch (err) {
        console.error("Error fetching favorites:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#002D37] text-[#D2AF94] text-xl">
        <Sparkles className="mr-3 animate-pulse" />
        Loading your saved places...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#002D37] py-24 px-6 text-white">
      <h1 className="text-4xl font-light text-center mb-10">
        Your <span className="text-[#D2AF94]">Saved Places</span>
      </h1>

      {favorites.length === 0 ? (
        <div className="text-center text-[#A6B5B4] text-lg">
          You haven't saved any places yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {favorites.map((pkg) => (
            <div
              key={pkg._id}
              className="rounded-3xl overflow-hidden bg-[#A6B5B4]/10 backdrop-blur-xl border border-[#A6B5B4]/30 transition duration-300 hover:bg-[#A6B5B4]/20 hover:scale-[1.01]"
            >
              <div className="relative h-60">
                <img
                   src={pkg.images[0].url}
                  alt={pkg.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
                <Link
                  href={`/packages/${pkg.type}/${pkg._id}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#D2AF94] hover:underline"
                >
              <div className="p-6">
                <h2 className="text-2xl text-[#D2AF94] mb-2">{pkg.name}</h2>
                <div className="flex items-center text-[#A6B5B4] mb-3 text-sm">
                  <MapPin className="w-4 h-4 mr-2" />
                  {pkg.places}
                </div>
                <p className="text-[#A6B5B4] text-sm mb-4 line-clamp-3">
                  {pkg.description}
                </p>
                  View Details
                  
              </div>
                </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

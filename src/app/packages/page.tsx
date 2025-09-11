"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight, Bookmark, Star, StarHalf, StarOff, Search, MapPin, Clock, Sparkles, Heart
} from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import Footer from "../components/FooterContent";
import Image from 'next/image';
import Fuse from 'fuse.js';
import debounce from 'lodash.debounce';

interface Package {
  _id: string;
  name: string;
  duration: string;
  places: string;
  description: string;
  rating: number;
  images: { url: string; public_id: string }[];
  OnwardPrice: number;
  type: string;
}

const PremiumLoader = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-[#002D37]">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-t-transparent border-[#D2AF94] rounded-full animate-spin"></div>
      <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#D2AF94] w-6 h-6 animate-pulse" />
    </div>
    <div className="text-[#A6B5B4] tracking-widest text-xl text-center font-light px-4 mt-8 animate-pulse">
      Hold on... We Are Fetching the Best Combination of Adventure For You...
    </div>
  </div>
);

const AllPackagesPage = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [fuse, setFuse] = useState<Fuse<Package> | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  const fetchPackages = useMemo(() => debounce(async (page, typeFilter) => {
    setLoading(true);
    try {
      let url = `/api/packages?page=${page}&limit=${limit}`;
      if (typeFilter !== "all") url += `&types=${typeFilter}`;
      const res = await fetch(url);
      const data = await res.json();
      setPackages(data.packages);
      setTotalPages(data.pagination.totalPages);

      const newFuse = new Fuse<Package>(data.packages, {
        keys: ["name", "places", "description"],
        includeScore: true,
        threshold: 0.3,
      });

      setFuse(newFuse);
    } catch (error) {
      console.error("Fetch error:", error);
    }
    setLoading(false);
  }, 300), []);

  useEffect(() => {
    fetchPackages(page, typeFilter);
  }, [page, typeFilter]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const renderStars = (rating = 4.5) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    const stars = [];
    for (let i = 0; i < fullStars; i++) stars.push(<Star key={i} className="text-amber-400 w-4 h-4" fill="currentColor" />);
    if (hasHalf && fullStars < 5) stars.push(<StarHalf key="half" className="text-amber-400 w-4 h-4" fill="currentColor" />);
    while (stars.length < 5) stars.push(<StarOff key={`off-${stars.length}`} className="text-slate-400 w-4 h-4 opacity-40" />);
    return stars;
  };

  const filteredPackages = useMemo(() => {
    if (!searchQuery.trim()) return packages;
    if (fuse) return fuse.search(searchQuery).map(r => r.item);
    return packages;
  }, [searchQuery, packages, fuse]);

  if (loading) return <PremiumLoader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#002D37] via-[#186663] to-[#002D37] relative playfair">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#186663] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#D2AF94] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#A6B5B4] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 pt-24 pb-12 px-6 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center mb-6 px-4 sm:px-6 md:px-8">
            <Sparkles className="text-[#D2AF94] w-8 h-8 mr-3 animate-pulse" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-white tracking-wide text-center sm:text-left">
              Exclusive
              <span className="bg-gradient-to-r from-[#D2AF94] to-[#8C7361] bg-clip-text text-transparent font-normal ml-4">
                Escapes
              </span>
            </h1>
            <Sparkles className="text-[#D2AF94] w-8 h-8 ml-3 animate-pulse" />
          </div>
          <p className="text-[#A6B5B4] text-lg sm:text-xl md:text-2xl font-light max-w-2xl mx-auto leading-relaxed mb-8">
            Discover our handpicked collection of extraordinary travel packages
          </p>
        </div>
      </div>

      {/* Search + Type Filter */}
      <div className="relative z-10 px-6 mb-16 max-w-2xl mx-auto space-y-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-[#8C7361] group-hover:text-[#D2AF94] transition-colors duration-300" />
          </div>
          <input
            type="text"
            placeholder="Search extraordinary destinations..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-16 pr-8 py-5 bg-[#A6B5B4]/10 backdrop-blur-xl border border-[#A6B5B4]/30 rounded-2xl hover:bg-[#A6B5B4]/20 focus:outline-none focus:ring-2 focus:ring-[#D2AF94]/50 focus:border-[#D2AF94]/50 transition-all duration-300 text-white placeholder-white text-lg font-light shadow-xl hover:shadow-2xl"
          />
        </div>
        <div className="flex gap-4 justify-center">
          {["all", "domestic", "international"].map(t => (
            <button
              key={t}
              onClick={() => { setTypeFilter(t); setPage(1); }}
              className={`px-4 py-2 rounded-full font-medium ${typeFilter === t ? "bg-[#D2AF94] text-[#002D37]" : "border border-[#D2AF94] text-white"}`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Packages */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPackages.map((pkg, index) => (
            <div key={pkg._id} className="relative overflow-hidden rounded-3xl bg-[#A6B5B4]/10 backdrop-blur-xl border border-[#A6B5B4]/30 flex flex-col justify-center items-center"
              style={{ animation: `slideUp 0.8s ease-out forwards ${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden w-full">
                {pkg.images?.[0]?.url?.trim() ? (
                  <Image
                    src={pkg.images[0].url}
                    alt={pkg.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full min-h-[300px] bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg">
                    No Image Available
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                {/* Wishlist Button */}
                <button onClick={() => toggleFavorite(pkg._id)} className="absolute top-4 left-4 w-12 h-12 bg-[#A6B5B4]/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-[#A6B5B4]/30 transition-all duration-300 group/heart">
                  <Heart className={`w-5 h-5 transition-all duration-300 ${isFavorite(pkg._id) ? "text-[#D2AF94] fill-current scale-110" : "text-white group-hover/heart:text-[#D2AF94] group-hover/heart:scale-110"}`} />
                </button>

                {/* Duration & Price */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center px-4">
                  <div className="flex items-center justify-center bg-[#002D37]/60 backdrop-blur-md rounded-full px-3 py-1 text-white text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {pkg.duration}
                  </div>
                  <div className="bg-[#002D37]/60 backdrop-blur-md rounded-full px-3 py-1 text-white text-sm">
                    ₹{pkg.OnwardPrice?.toLocaleString?.() || "N/A"} Onwards
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-col justify-center p-8">
                <div>
                  <h2 className="text-2xl font-light text-white mb-3">{pkg.name}</h2>

                  <div className="flex items-center text-[#A6B5B4] mb-4">
                    <MapPin className="w-4 h-4 mr-2 text-[#D2AF94]" />
                    <div className="flex flex-wrap text-sm gap-1">
                      {pkg.places.split("-").map((place, i, arr) => (
                        <span key={i} className="flex items-center">
                          <span className="hover:text-[#D2AF94] transition-colors duration-200">{place.trim()}</span>
                          {i < arr.length - 1 && <ArrowRight className="mx-2 w-3 h-3 text-[#8C7361]" />}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-[#A6B5B4] text-sm mb-6 leading-relaxed line-clamp-3">{pkg.description}</p>

                  <div className="flex gap-2 mb-6">
                    <div className="flex gap-1">{renderStars(pkg.rating)}</div>
                    <span className="text-white font-medium">{(pkg.rating ?? 4.5).toFixed(1)}</span>
                  </div>
                </div>

                <div className="flex gap-4 mt-auto w-full justify-center">
                  <Link href={`/packages/${pkg.type}/${pkg._id}`} className="flex-1 bg-gradient-to-r from-[#D2AF94] to-[#8C7361] text-[#002D37] py-3 px-6 rounded-xl font-medium hover:from-[#8C7361] hover:to-[#D2AF94] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center">
                    Explore Journey
                  </Link>
                  <button onClick={() => toggleFavorite(pkg._id)} className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${isFavorite(pkg._id) ? "bg-[#D2AF94] text-[#002D37] hover:bg-[#8C7361]" : "border border-[#D2AF94] text-[#D2AF94] hover:bg-[#D2AF94] hover:text-[#002D37]"}`}>
                    {isFavorite(pkg._id) ? "Wishlisted ❤️" : "Add to Wishlist"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPackages.length === 0 && (
          <div className="text-center py-16">
            <div className="text-[#A6B5B4] text-lg mb-4">
              No destinations found for "{searchQuery}"
            </div>
            <button onClick={() => setSearchQuery("")} className="text-[#D2AF94] hover:text-[#8C7361] transition-colors duration-200">
              Clear search to view all destinations
            </button>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button key={idx + 1} className={`px-4 py-2 rounded-md ${page === idx + 1 ? "bg-[#186663] text-white" : "bg-gray-200 text-gray-700"}`} onClick={() => setPage(idx + 1)}>
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <footer className="w-full bg-gradient-to-r from-transparent via-[#D2AF94] to-transparent">
        <Footer />
      </footer>
    </div>
  );
};

export default AllPackagesPage;

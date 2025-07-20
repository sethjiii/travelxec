"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { MapPin, Star, ArrowRight, Calendar, Camera } from "lucide-react";
import Loader from "@/ui2/Loader";
import Footer from "../components/FooterContent";
import { url } from "inspector/promises";

interface Package {
  _id: string;
  name: string;
  images: {
    url: string;
    public_id: string;
  }[];
  duration: string;
}

interface Destination {
  _id: string;
  city: string;
  description: string;
  image: string;
  packages?: Package[];
}

export default function DestinationsList() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!mounted) return;
    async function fetchDestinations() {
      try {
        const res = await fetch("/api/destinations");
        if (!res.ok) throw new Error("Failed to fetch destinations");
        const data = await res.json();
        setDestinations(data.destinations || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    fetchDestinations();
  }, [mounted]);

  if (!mounted) return null;

  if (loading) return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-gradient-to-br from-[#002D37] via-[#186663] to-[#002D37]">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#D2AF94] to-[#A6B5B4] rounded-full blur-xl opacity-30 animate-pulse"></div>
        <Loader />
      </div>
      <div className="text-[#D2AF94] tracking-[0.3em] text-lg sm:text-2xl text-center font-light px-2 sm:px-4 mt-4 sm:mt-8 animate-fadeIn">
        <span className="block text-xs sm:text-sm opacity-80 mb-2">CURATING YOUR JOURNEY</span>
        Discovering Extraordinary Adventures...
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-[#002D37] to-[#186663] flex justify-center items-center px-2">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-8 border border-[#A6B5B4]/20 w-full max-w-sm sm:max-w-md">
        <p className="text-[#D2AF94] text-base sm:text-lg font-light">Something went wrong: {error}</p>
      </div>
    </div>
  );

  if (destinations.length === 0) return (
    <div className="min-h-screen bg-gradient-to-br from-[#002D37] to-[#186663] flex justify-center items-center px-2">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-8 border border-[#A6B5B4]/20 w-full max-w-sm sm:max-w-md">
        <p className="text-[#A6B5B4] text-base sm:text-lg font-light">No destinations found.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#002D37] via-[#186663] to-[#002D37] relative overflow-hidden py-6 sm:py-16">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-2 sm:px-6 py-6 sm:py-16">

        {/* HEADER */}
        <div className="text-center mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 bg-[#D2AF94]/20 backdrop-blur-sm rounded-full px-4 sm:px-6 py-1.5 sm:py-2 mb-4 sm:mb-6 border border-[#D2AF94]/30">
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D2AF94]" />
            <span className="text-[#D2AF94] text-xs sm:text-sm font-light tracking-wider">LUXURY TRAVEL EXPERIENCES</span>
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D2AF94]" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-light text-[#D2AF94] mb-4 sm:mb-6 tracking-wider playfair">
            Discover
            <span className="block text-xl sm:text-4xl text-white font-extralight italic playfair">Extraordinary</span>
          </h1>
          <p className="text-[#A6B5B4] text-base sm:text-xl font-light max-w-xs sm:max-w-2xl mx-auto leading-relaxed">
            Embark on curated journeys that transcend ordinary travel. Where luxury meets adventure.
          </p>
        </div>

        {/* DESTINATION LIST */}
        <div className="space-y-16 sm:space-y-32">
          {destinations.map((destination, index) => {
            const destImg = destination.image && typeof destination.image === "string" ? destination.image : "/placeholder.jpg";
            return (
              <div
                key={destination._id || index}
                className="group relative flex flex-col lg:flex-row gap-8 sm:gap-12 items-center"
              >
                {/* Image Section */}
                <div className="w-full lg:w-1/2 relative">
                  <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl group-hover:scale-105 transition-all duration-700 ease-out">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#002D37]/80 via-transparent to-transparent z-10"></div>
                    <img
                      src={destImg}
                      alt={destination.city}
                      className="w-full h-[180px] xs:h-[240px] sm:h-[300px] md:h-[350px] lg:h-[400px] object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-3 sm:top-6 left-3 sm:left-6 z-20 bg-white/20 backdrop-blur-md rounded-full px-2 sm:px-4 py-1 sm:py-2 border border-white/30">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D2AF94]" />
                        <span className="text-white text-xs sm:text-sm font-light tracking-wide">{destination.city}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="w-full lg:w-1/2 space-y-6 sm:space-y-8">
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-[#D2AF94] to-transparent"></div>
                      <h2 className="text-2xl sm:text-5xl font-light text-white tracking-wide group-hover:text-[#D2AF94] transition-colors duration-500 playfair">
                        {destination.city}
                      </h2>
                    </div>
                    <p className="text-[#A6B5B4] text-sm sm:text-lg leading-relaxed font-light tracking-wide">
                      {destination.description}
                    </p>
                  </div>

                  {/* Packages Section */}
                  {destination.packages && destination.packages.length > 0 ? (
                    <div className="space-y-5 sm:space-y-8">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="bg-[#186663] p-1.5 sm:p-2 rounded-full">
                          <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-[#D2AF94]" />
                        </div>
                        <h3 className="text-lg sm:text-2xl font-light text-white">
                          Curated Experiences
                        </h3>
                      </div>

                      <div className="relative">
                        <Swiper
                          slidesPerView={1}
                          spaceBetween={16}
                          pagination={{
                            clickable: true,
                            bulletClass: "custom-bullet",
                            bulletActiveClass: "custom-bullet-active",
                          }}
                          modules={[Pagination, Autoplay]}
                          autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                          breakpoints={{
                            420: { slidesPerView: 1 },
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 2 },
                          }}
                          className="pb-8 sm:pb-12"
                        >
                          {destination.packages.map((pkg) => {
                            const pkgImg =
                              Array.isArray(pkg.images) && pkg.images[0] && typeof pkg.images[0] === "string"
                                ? pkg.images[0]
                                : "/placeholder.jpg";
                            return (
                              <SwiperSlide key={pkg._id}>
                                <Link href={`/packages/${pkg._id}`}>
                                  <div className="group/card bg-white/5 backdrop-blur-md rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 hover:border-[#D2AF94]/50 transition-all duration-500 hover:bg-white/10">
                                    <div className="relative overflow-hidden">
                                      {pkg.images?.length > 0 ? (
                                        <img
                                          src={pkg.images[0].url}
                                          alt={pkg.name}
                                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                                        />
                                      ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                                          No image available
                                        </div>
                                      )}
                                      <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4">
                                        <h4 className="text-white font-light text-base sm:text-lg mb-1 sm:mb-2 group-hover/card:text-[#D2AF94] transition-colors duration-300">
                                          {pkg.name}
                                        </h4>
                                        <div className="flex items-center gap-1 sm:gap-2 text-[#A6B5B4] text-xs sm:text-sm">
                                          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                          <span>{pkg.duration}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="px-3 py-3 sm:p-6">
                                      <div className="flex items-center justify-between">
                                        <span className="text-white text-xs sm:text-sm font-light tracking-wider">EXPLORE PACKAGE</span>
                                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D2AF94] transform group-hover/card:translate-x-2 transition-transform duration-300" />
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              </SwiperSlide>
                            );
                          })}
                        </Swiper>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-white/10">
                      <p className="text-[#A6B5B4] text-sm sm:text-lg font-light text-center">
                        New experiences coming soon to this destination
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <footer className="w-full bg-gradient-to-r from-transparent via-[#D2AF94] to-transparent mt-8 sm:mt-0">
        <Footer />
      </footer>
    </div>
  );
}

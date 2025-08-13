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
import Image from 'next/image';

interface Package {
  _id: string;
  type: string;
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
      <div className="text-[#D2AF94] tracking-[0.3em] text-base sm:text-lg md:text-xl lg:text-2xl text-center font-light px-4 mt-4 sm:mt-8 animate-fadeIn">
        <span className="block text-xs sm:text-sm opacity-80 mb-2">CURATING YOUR JOURNEY</span>
        Discovering Extraordinary Adventures...
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-[#002D37] to-[#186663] flex justify-center items-center px-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-[#A6B5B4]/20 w-full max-w-md">
        <p className="text-[#D2AF94] text-base sm:text-lg font-light">Something went wrong: {error}</p>
      </div>
    </div>
  );

  if (destinations.length === 0) return (
    <div className="min-h-screen bg-gradient-to-br from-[#002D37] to-[#186663] flex justify-center items-center px-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-[#A6B5B4]/20 w-full max-w-md">
        <p className="text-[#A6B5B4] text-base sm:text-lg font-light">No destinations found.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#002D37] via-[#186663] to-[#002D37] relative overflow-hidden py-4 sm:py-8 lg:py-16">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 lg:py-16">

        {/* HEADER */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-20">
          <div className="inline-flex items-center gap-2 bg-[#D2AF94]/20 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 mb-4 sm:mb-6 border border-[#D2AF94]/30">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-[#D2AF94]" />
            <span className="text-[#D2AF94] text-xs sm:text-sm font-light tracking-wider">LUXURY TRAVEL EXPERIENCES</span>
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-[#D2AF94]" />
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-[#D2AF94] mb-4 sm:mb-6 tracking-wider playfair">
            Discover
            <span className="block text-lg sm:text-3xl lg:text-4xl xl:text-5xl text-white font-extralight italic playfair mt-2">Extraordinary</span>
          </h1>
          <p className="text-[#A6B5B4] text-sm sm:text-lg lg:text-xl font-light max-w-lg sm:max-w-2xl mx-auto leading-relaxed px-4">
            Embark on curated journeys that transcend ordinary travel. Where luxury meets adventure.
          </p>
        </div>

        {/* DESTINATION LIST */}
        <div className="space-y-12 sm:space-y-20 lg:space-y-32">
          {destinations.map((destination, index) => {
            const destImg = destination.image && typeof destination.image === "string" ? destination.image : "/placeholder.jpg";
            return (
              <div
                key={destination._id || index}
                className="group relative flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12 items-center"
              >
                {/* Image Section */}
                <div className="w-full lg:w-1/2 relative">
                  <div className="relative overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl group-hover:scale-105 transition-all duration-700 ease-out">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#002D37]/80 via-transparent to-transparent z-10"></div>
                    <div className="relative w-full h-48 xs:h-56 sm:h-64 md:h-72 lg:h-80 xl:h-96">
                      <Image
                        src={destImg}
                        alt={destination.city}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        priority={index === 0}
                      />
                    </div>
                    <div className="absolute top-3 sm:top-4 lg:top-6 left-3 sm:left-4 lg:left-6 z-20 bg-white/20 backdrop-blur-md rounded-full px-3 sm:px-4 py-1.5 sm:py-2 border border-white/30">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-[#D2AF94]" />
                        <span className="text-white text-xs sm:text-sm font-light tracking-wide">{destination.city}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="w-full lg:w-1/2 space-y-4 sm:space-y-6 lg:space-y-8">
                  <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                    <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                      <div className="w-6 sm:w-8 lg:w-12 h-px bg-gradient-to-r from-[#D2AF94] to-transparent"></div>
                      <h2 className="text-xl sm:text-3xl lg:text-4xl xl:text-5xl font-light text-white tracking-wide group-hover:text-[#D2AF94] transition-colors duration-500 playfair">
                        {destination.city}
                      </h2>
                    </div>
                    <p className="text-[#A6B5B4] text-sm sm:text-base lg:text-lg leading-relaxed font-light tracking-wide">
                      {destination.description}
                    </p>
                  </div>

                  {/* Packages Section */}
                  {destination.packages && destination.packages.length > 0 ? (
                    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="bg-[#186663] p-1.5 sm:p-2 rounded-full">
                          <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-[#D2AF94]" />
                        </div>
                        <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-light text-white">
                          Curated Experiences
                        </h3>
                      </div>

                      <div className="relative">
                        <Swiper
                          slidesPerView={1}
                          spaceBetween={12}
                          pagination={{
                            clickable: true,
                            bulletClass: "custom-bullet",
                            bulletActiveClass: "custom-bullet-active",
                          }}
                          modules={[Pagination, Autoplay]}
                          autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                          breakpoints={{
                            480: { 
                              slidesPerView: 1.2,
                              spaceBetween: 14,
                            },
                            640: { 
                              slidesPerView: 1.5,
                              spaceBetween: 16,
                            },
                            768: { 
                              slidesPerView: 1.8,
                              spaceBetween: 18,
                            },
                            1024: { 
                              slidesPerView: 2,
                              spaceBetween: 20,
                            },
                            1280: { 
                              slidesPerView: 2.2,
                              spaceBetween: 24,
                            },
                          }}
                          className="pb-8 sm:pb-10 lg:pb-12"
                        >
                          {destination.packages.map((pkg) => (
                            <SwiperSlide key={pkg._id}>
                              <Link href={`/packages/${pkg.type}/${pkg._id}`}>
                                <div className="group/card bg-white/5 backdrop-blur-md rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden border border-white/10 hover:border-[#D2AF94]/50 transition-all duration-500 hover:bg-white/10 h-full">
                                  <div className="relative overflow-hidden">
                                    {pkg.images?.length > 0 ? (
                                      <div className="relative w-full h-32 xs:h-36 sm:h-40 md:h-44 lg:h-48">
                                        <Image
                                          src={pkg.images[0].url}
                                          alt={pkg.name}
                                          fill
                                          sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                          className="object-cover transition-all duration-700 group-hover/card:scale-105"
                                        />
                                      </div>
                                    ) : (
                                      <div className="w-full h-32 xs:h-36 sm:h-40 md:h-44 lg:h-48 bg-gray-200 flex items-center justify-center text-xs sm:text-sm text-gray-500">
                                        No image available
                                      </div>
                                    )}
                                    
                                    {/* Aesthetic overlay with theme colors */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#002D37]/95 via-[#002D37]/30 to-transparent"></div>
                                    
                                    {/* Elegant text overlay matching theme */}
                                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                                      {/* Decorative line */}
                                      <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-[#D2AF94] to-transparent mb-3 opacity-80"></div>
                                      
                                      {/* Package name with luxury styling */}
                                      <h4 className="text-white font-light text-sm sm:text-base lg:text-lg mb-2 group-hover/card:text-[#D2AF94] transition-colors duration-300 line-clamp-2 playfair tracking-wide leading-tight">
                                        {pkg.name}
                                      </h4>
                                      
                                      {/* Duration with elegant styling */}
                                      <div className="flex items-center gap-2 opacity-90">
                                        <div className="flex items-center gap-1.5 bg-[#D2AF94]/20 backdrop-blur-sm rounded-full px-2.5 py-1 border border-[#D2AF94]/30">
                                          <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D2AF94] flex-shrink-0" />
                                          <span className="text-[#A6B5B4] text-xs sm:text-sm font-light tracking-wide">{pkg.duration}</span>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Subtle corner decoration */}
                                    <div className="absolute top-3 right-3 w-2 h-2 bg-[#D2AF94]/40 rounded-full"></div>
                                  </div>
                                  <div className="p-3 sm:p-4 lg:p-6">
                                    <div className="flex items-center justify-between">
                                      <span className="text-white text-xs sm:text-sm font-light tracking-wider">EXPLORE PACKAGE</span>
                                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D2AF94] transform group-hover/card:translate-x-2 transition-transform duration-300 flex-shrink-0" />
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10">
                      <p className="text-[#A6B5B4] text-sm sm:text-base lg:text-lg font-light text-center">
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

      <footer className="w-full bg-gradient-to-r from-transparent via-[#D2AF94] to-transparent mt-8 sm:mt-12 lg:mt-16">
        <Footer />
      </footer>

      <style jsx global>{`
        .custom-bullet {
          width: 8px;
          height: 8px;
          background: rgba(166, 181, 180, 0.5);
          border-radius: 50%;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .custom-bullet-active {
          background: #D2AF94;
          transform: scale(1.2);
        }
        
        @media (min-width: 640px) {
          .custom-bullet {
            width: 10px;
            height: 10px;
          }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .swiper-pagination {
          bottom: 0 !important;
        }
        
        .swiper-pagination-bullet {
          margin: 0 4px !important;
        }
      `}</style>
    </div>
  );
}

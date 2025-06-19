"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { MapPin, Plane, Star, ArrowRight, Calendar, Camera } from "lucide-react";
import Loader from "@/ui2/Loader";

interface Package {
  _id: string;
  name: string;
  images: string[];
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
  const [hoveredDestination, setHoveredDestination] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false); // ✅ Added for hydration-safe rendering

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    async function fetchDestinations() {
      try {
        const res = await fetch("/api/destinations");
        if (!res.ok) throw new Error("Failed to fetch destinations");
        const data = await res.json();
        setDestinations(data.destinations || []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchDestinations();
  }, [mounted]);

  // ✅ Prevent rendering until mounted
  if (!mounted) return null;

  if (loading)
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-gradient-to-br from-[#002D37] via-[#186663] to-[#002D37]">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#D2AF94] to-[#A6B5B4] rounded-full blur-xl opacity-30 animate-pulse"></div>
          <Loader />
        </div>
        <div className="text-[#D2AF94] tracking-[0.3em] text-2xl text-center font-light px-4 mt-8 animate-fadeIn">
          <span className="block text-sm opacity-80 mb-2">CURATING YOUR JOURNEY</span>
          Discovering Extraordinary Adventures...
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#002D37] to-[#186663] flex justify-center items-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-[#A6B5B4]/20">
          <p className="text-[#D2AF94] text-lg font-light">Something went wrong: {error}</p>
        </div>
      </div>
    );

  if (destinations.length === 0)
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#002D37] to-[#186663] flex justify-center items-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-[#A6B5B4]/20">
          <p className="text-[#A6B5B4] text-lg font-light">No destinations found.</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#002D37] via-[#186663] to-[#002D37] relative overflow-hidden py-24">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#D2AF94]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#8C7361]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#A6B5B4]/5 rounded-full blur-3xl animate-pulse delay-2000"></div>

        {/* Moving Travel Elements */}
        <div className="absolute top-10 left-0 w-full h-full pointer-events-none">
          <div className="airplane-path">
            <Plane className="w-6 h-6 text-[#D2AF94]/30 transform rotate-45" />
          </div>
        </div>

        <div className="absolute top-40 right-0 w-full h-full pointer-events-none">
          <div className="airplane-path-reverse">
            <Plane className="w-5 h-5 text-[#8C7361]/25 transform -rotate-45" />
          </div>
        </div>

        {/* Floating Destination Markers */}
        <div className="absolute top-32 left-1/4 pointer-events-none">
          <div className="floating-marker">
            <MapPin className="w-4 h-4 text-[#A6B5B4]/40" />
          </div>
        </div>

        <div className="absolute bottom-40 right-1/3 pointer-events-none">
          <div className="floating-marker-slow">
            <MapPin className="w-5 h-5 text-[#D2AF94]/30" />
          </div>
        </div>

        <div className="absolute top-1/3 right-1/4 pointer-events-none">
          <div className="floating-marker-delay">
            <Star className="w-4 h-4 text-[#8C7361]/35" />
          </div>
        </div>

        {/* Subtle Moving Lines */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="moving-line-1"></div>
          <div className="moving-line-2"></div>
          <div className="moving-line-3"></div>
        </div>

        {/* Travel Route Paths */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 1200 800">
          <path
            d="M 100 200 Q 400 100 700 300 Q 900 400 1100 200"
            stroke="#D2AF94"
            strokeWidth="1"
            fill="none"
            className="travel-route"
            strokeDasharray="5,5"
          />
          <path
            d="M 200 600 Q 500 500 800 650 Q 1000 700 1100 550"
            stroke="#A6B5B4"
            strokeWidth="1"
            fill="none"
            className="travel-route-2"
            strokeDasharray="3,7"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Premium Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-[#D2AF94]/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6 border border-[#D2AF94]/30">
            <Star className="w-4 h-4 text-[#D2AF94]" />
            <span className="text-[#D2AF94] text-sm font-light tracking-wider">LUXURY TRAVEL EXPERIENCES</span>
            <Star className="w-4 h-4 text-[#D2AF94]" />
          </div>
          <h1 className="text-6xl md:text-7xl font-light text-[#D2AF94] mb-6 tracking-wider playfair">
            Discover
            <span className="block text-white font-extralight italic playfair">Extraordinary</span>
          </h1>
          <p className="text-[#A6B5B4] text-xl font-light max-w-2xl mx-auto leading-relaxed">
            Embark on curated journeys that transcend ordinary travel. Where luxury meets adventure.
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="space-y-32">
          {destinations.map((destination, index) => (
            <div
              key={destination._id}
              className={`group relative ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex flex-col lg:flex gap-12 items-center`}
              onMouseEnter={() => setHoveredDestination(destination._id)}
              onMouseLeave={() => setHoveredDestination(null)}
            >
              {/* Image Section */}
              <div className="w-full lg:w-1/2 relative">
                <div className="relative overflow-hidden rounded-3xl group-hover:scale-105 transition-all duration-700 ease-out">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#002D37]/80 via-transparent to-transparent z-10"></div>
                  <img
                    src={destination.image}
                    alt={destination.city}
                    className="w-full h-[600px] object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute top-6 left-6 z-20 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/30">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#D2AF94]" />
                      <span className="text-white text-sm font-light tracking-wide">{destination.city}</span>
                    </div>
                  </div>

                  <div className="absolute bottom-6 right-6 z-20 bg-black/30 backdrop-blur-sm rounded-full p-2">
                    <Camera className="w-4 h-4 text-white/70" />
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="w-full lg:w-1/2 space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-px bg-gradient-to-r from-[#D2AF94] to-transparent"></div>
                    <h2 className="text-5xl font-light text-white tracking-wide group-hover:text-[#D2AF94] transition-colors duration-500 playfair">
                      {destination.city}
                    </h2>
                  </div>

                  <p className="text-[#A6B5B4] text-lg leading-relaxed font-light tracking-wide">
                    {destination.description}
                  </p>
                </div>

                {/* Packages Section */}
                {destination.packages && destination.packages.length > 0 ? (
                  <div className="space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#186663] p-2 rounded-full">
                        <Plane className="w-5 h-5 text-[#D2AF94]" />
                      </div>
                      <h3 className="text-2xl font-light text-white">
                        Curated Experiences
                      </h3>
                    </div>

                    <div className="relative">
                      <Swiper
                        slidesPerView={1}
                        spaceBetween={24}
                        pagination={{
                          clickable: true,
                          bulletClass: "custom-bullet",
                          bulletActiveClass: "custom-bullet-active",
                        }}
                        modules={[Pagination, Autoplay]}
                        autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                        breakpoints={{
                          640: { slidesPerView: 1 },
                          768: { slidesPerView: 2 },
                          1024: { slidesPerView: 2 },
                        }}
                        className="pb-12"
                      >
                        {destination.packages.map((pkg) => (
                          <SwiperSlide key={pkg._id}>
                            <Link href={`/packages/${pkg._id}`}>
                              <div className="group/card bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-[#D2AF94]/50 transition-all duration-500 hover:bg-white/10 hover:transform hover:scale-105">
                                <div className="relative overflow-hidden">
                                  <img
                                    src={pkg.images[0]}
                                    alt={pkg.name}
                                    className="h-48 w-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                                  <div className="absolute bottom-4 left-4 right-4">
                                    <h4 className="text-white font-light text-lg mb-2 group-hover/card:text-[#D2AF94] transition-colors duration-300">
                                      {pkg.name}
                                    </h4>
                                    <div className="flex items-center gap-2 text-[#A6B5B4] text-sm">
                                      <Calendar className="w-4 h-4" />
                                      <span>{pkg.duration}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="p-6">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[#8C7361] text-sm font-light tracking-wider">EXPLORE PACKAGE</span>
                                    <ArrowRight className="w-4 h-4 text-[#D2AF94] transform group-hover/card:translate-x-2 transition-transform duration-300" />
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
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                    <p className="text-[#A6B5B4] text-lg font-light text-center">
                      New experiences coming soon to this destination
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-32 pt-16 border-t border-[#A6B5B4]/20">
          <div className="inline-flex items-center gap-2 text-[#D2AF94] text-sm font-light tracking-wider">
            <div className="w-8 h-px bg-[#D2AF94]"></div>
            <span>YOUR JOURNEY AWAITS</span>
            <div className="w-8 h-px bg-[#D2AF94]"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
 @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
        
        .playfair {
          font-family: 'Playfair Display', serif;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

         @keyframes airplaneFly {
          0% { transform: translateX(-100px) translateY(0px) rotate(45deg); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translateX(calc(100vw + 100px)) translateY(-50px) rotate(45deg); opacity: 0; }
        }
        
        @keyframes airplaneFlyReverse {
          0% { transform: translateX(calc(100vw + 100px)) translateY(0px) rotate(-45deg); opacity: 0; }
          10% { opacity: 0.25; }
          90% { opacity: 0.25; }
          100% { transform: translateX(-100px) translateY(50px) rotate(-45deg); opacity: 0; }
        }
        
        @keyframes floatUp {
          0%, 100% { transform: translateY(0px); opacity: 0.4; }
          50% { transform: translateY(-20px); opacity: 0.6; }
        }
        
        @keyframes floatUpSlow {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
          50% { transform: translateY(-30px) scale(1.1); opacity: 0.5; }
        }
        
        @keyframes floatUpDelay {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.35; }
          50% { transform: translateY(-25px) rotate(10deg); opacity: 0.55; }
        }
        
        @keyframes moveLine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes travelRoute {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }
        
        .airplane-path {
          animation: airplaneFly 25s linear infinite;
        }
        
        .airplane-path-reverse {
          animation: airplaneFlyReverse 35s linear infinite;
          animation-delay: 10s;
        }
        
        .floating-marker {
          animation: floatUp 4s ease-in-out infinite;
        }
        
        .floating-marker-slow {
          animation: floatUpSlow 6s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        .floating-marker-delay {
          animation: floatUpDelay 5s ease-in-out infinite;
          animation-delay: 4s;
        }
        
        .moving-line-1 {
          position: absolute;
          top: 25%;
          left: 0;
          width: 100px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #D2AF94, transparent);
          animation: moveLine 15s linear infinite;
        }
        
        .moving-line-2 {
          position: absolute;
          top: 60%;
          left: 0;
          width: 80px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #A6B5B4, transparent);
          animation: moveLine 20s linear infinite;
          animation-delay: 5s;
        }
        
        .moving-line-3 {
          position: absolute;
          top: 80%;
          left: 0;
          width: 60px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #8C7361, transparent);
          animation: moveLine 25s linear infinite;
          animation-delay: 10s;
        }
        
        .travel-route {
          animation: travelRoute 8s ease-in-out infinite;
        }
        
        .travel-route-2 {
          animation: travelRoute 12s ease-in-out infinite;
          animation-delay: 4s;
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out;
        }

        .custom-bullet {
          width: 12px;
          height: 12px;
          border-radius: 9999px;
          margin: 0 4px;
          background-color: rgba(166, 181, 180, 0.5);
          opacity: 0.7;
          transition: background-color 0.3s ease;
        }

        .custom-bullet-active {
          background-color: #D2AF94;
          opacity: 1;
        }
      `}</style>
    </div>
  );
}

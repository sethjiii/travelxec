"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Package, Calendar, Sparkles, ChevronRight, CalendarX } from "lucide-react";

const AdminDashboard = () => {
  const [hoveredButton, setHoveredButton] = useState<'package' | 'bookings' | 'itinerary' | null>(null);

  const [bookings, setBookings] = useState([]); // Empty array to simulate no bookings

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden py-24">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-teal-500/10 to-emerald-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 py-10 relative z-10">
        {/* Premium Header Section */}
        <div className="text-center mb-16">


          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent mb-4 tracking-tight">
            Admin Dashboard
          </h1>

          <div className="max-w-2xl mx-auto">
            <p className="text-xl text-slate-300 leading-relaxed font-light">
              Welcome to the admin dashboard! You can manage packages and bookings from here.
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-emerald-600 mx-auto mt-6 rounded-full"></div>
          </div>
        </div>

        {/* Premium Action Buttons */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-8 max-w-4xl mx-auto">
          <Link href="/admin/dashboard/" className="group w-full md:w-auto">
            <div
              className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800/70 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 cursor-pointer overflow-hidden"
              onMouseEnter={() => setHoveredButton('package')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

              {/* Content */}
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/25">
                  <Package className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors">
                  Add Package
                </h3>

                <p className="text-slate-400 mb-6 leading-relaxed">
                  Create and manage your travel packages with our intuitive interface
                </p>

                <div className="inline-flex items-center text-blue-400 group-hover:text-blue-300 transition-colors font-medium">
                  <span>Get Started</span>
                  <ChevronRight className={`w-5 h-5 ml-2 transition-transform duration-300 ${hoveredButton === 'package' ? 'translate-x-1' : ''}`} />
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-blue-500/5 to-cyan-600/5 rounded-full blur-xl"></div>
            </div>
          </Link>

          <Link href="/admin/bookings" className="group w-full md:w-auto">
            <div
              className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800/70 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20 cursor-pointer overflow-hidden"
              onMouseEnter={() => setHoveredButton('bookings')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

              {/* Content */}
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-amber-500/25">
                  <Calendar className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-amber-200 transition-colors">
                  View All Bookings
                </h3>

                <p className="text-slate-400 mb-6 leading-relaxed">
                  Monitor and manage all customer bookings in one centralized location
                </p>

                <div className="inline-flex items-center text-amber-400 group-hover:text-amber-300 transition-colors font-medium">
                  <span>Explore</span>
                  <ChevronRight className={`w-5 h-5 ml-2 transition-transform duration-300 ${hoveredButton === 'bookings' ? 'translate-x-1' : ''}`} />
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-amber-500/5 to-orange-600/5 rounded-full blur-xl"></div>
            </div>
          </Link>

          <Link href="/admin/itineraries" className="group w-full md:w-auto">
            <div
              className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800/70 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20 cursor-pointer overflow-hidden"
              onMouseEnter={() => setHoveredButton('itinerary')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-500/25">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-green-200 transition-colors">
                  View Itineraries
                </h3>

                <p className="text-slate-400 mb-6 leading-relaxed">
                  Review all curated itinerary requests submitted by users
                </p>

                <div className="inline-flex items-center text-green-400 group-hover:text-green-300 transition-colors font-medium">
                  <span>Open</span>
                  <ChevronRight className={`w-5 h-5 ml-2 transition-transform duration-300 ${hoveredButton === 'itinerary' ? 'translate-x-1' : ''}`} />
                </div>
              </div>

              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-r from-green-500/5 to-emerald-600/5 rounded-full blur-xl"></div>
            </div>
          </Link>
        </div>

        {/* Bookings Section */}

        {/* Premium Footer Accent */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center space-x-2 text-slate-500">
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Premium Admin Experience</span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse delay-500"></div>
          </div>
        </div>


      </div>
    </div>
  )
}



export default AdminDashboard;
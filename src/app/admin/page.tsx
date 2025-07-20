"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Package, Calendar, Sparkles, ChevronRight, Plane, BarChart3, Users, Globe, LayoutDashboard
} from "lucide-react";

const stats = [
  {
    label: "Total Packages",
    value: 21,
    icon: <Package className="w-6 h-6 text-teal-500" />,
    color: "from-teal-500/40 to-teal-600/10"
  },
  {
    label: "Bookings",
    value: 120,
    icon: <Calendar className="w-6 h-6 text-amber-500" />,
    color: "from-amber-500/40 to-amber-600/10"
  },
  {
    label: "Itineraries",
    value: 18,
    icon: <Sparkles className="w-6 h-6 text-green-500" />,
    color: "from-green-500/40 to-emerald-700/10"
  },
  {
    label: "Destinations",
    value: 12,
    icon: <Globe className="w-6 h-6 text-blue-500" />,
    color: "from-blue-500/40 to-blue-600/10"
  }
];

const AdminDashboard = () => {
  const [hoveredButton, setHoveredButton] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden py-24">
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-teal-500/10 to-emerald-600/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-2 sm:px-4 md:px-8 relative z-10">

        {/* Dashboard Header */}
        <div className="flex items-center gap-4 sm:gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-600/80 to-emerald-400/60 shadow-lg p-4 rounded-xl">
            <LayoutDashboard className="w-9 h-9 text-white" />
          </div>
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white">Admin Dashboard</h1>
            <p className="text-base sm:text-lg text-slate-300 mt-1 font-light">
              Welcome back, admin! Manage all your platform essentials here.
            </p>
          </div>
        </div>

        {/* STATISTICS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {stats.map(stat => (
            <div
              key={stat.label}
              className={`bg-gradient-to-br ${stat.color} border border-slate-700/30 rounded-2xl p-5 flex flex-col items-center shadow-md hover:scale-[1.025] transition-transform`}
            >
              <div className="mb-2">{stat.icon}</div>
              <span className="font-semibold text-xl text-white">{stat.value}</span>
              <span className="text-slate-300 mt-1 text-sm tracking-wide">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Admin Actions */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <Link href="/admin/dashboard/">
            <div
              className="relative bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800/80 transition duration-300
                hover:scale-105 shadow-lg cursor-pointer group overflow-hidden"
              // onMouseEnter={() => setHoveredButton('package')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl mb-5 group-hover:scale-110 transition duration-300 shadow-lg">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-200 transition">Add Package</h3>
                <p className="text-slate-400 mb-6 text-sm">Create and manage your travel packages.</p>
                <div className="inline-flex items-center text-blue-400 group-hover:text-blue-300 transition font-medium">
                  <span>Open</span>
                  <ChevronRight className={`w-5 h-5 ml-2 transition-transform ${hoveredButton === 'package' ? 'translate-x-1' : ''}`} />
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/package">
            <div
              className="relative bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800/80 transition duration-300
      hover:scale-105 shadow-lg cursor-pointer group overflow-hidden"
              // onMouseEnter={() => setHoveredButton('managepackage')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl mb-5 group-hover:scale-110 transition duration-300 shadow-lg">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-200 transition">Manage Packages</h3>
                <p className="text-slate-400 mb-6 text-sm">
                  You can edit and delete uploaded packages.
                </p>
                <div className="inline-flex items-center text-indigo-400 group-hover:text-indigo-300 transition font-medium">
                  <span>Manage</span>
                  <ChevronRight className={`w-5 h-5 ml-2 transition-transform ${hoveredButton === 'managepackage' ? 'translate-x-1' : ''}`} />
                </div>
              </div>
            </div>
          </Link>


          <Link href="/admin/bookings">
            <div
              className="relative bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800/80 transition duration-300
                hover:scale-105 shadow-lg cursor-pointer group overflow-hidden"
              // onMouseEnter={() => setHoveredButton('bookings')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl mb-5 group-hover:scale-110 transition duration-300 shadow-lg">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-200 transition">View Bookings</h3>
                <p className="text-slate-400 mb-6 text-sm">Monitor and manage all customer bookings.</p>
                <div className="inline-flex items-center text-amber-400 group-hover:text-amber-300 transition font-medium">
                  <span>Open</span>
                  <ChevronRight className={`w-5 h-5 ml-2 transition-transform ${hoveredButton === 'bookings' ? 'translate-x-1' : ''}`} />
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/itineraries">
            <div
              className="relative bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800/80 transition duration-300
                hover:scale-105 shadow-lg cursor-pointer group overflow-hidden"
              // onMouseEnter={() => setHoveredButton('itinerary')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl mb-5 group-hover:scale-110 transition duration-300 shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-200 transition">View Itineraries</h3>
                <p className="text-slate-400 mb-6 text-sm">Review all curated itinerary requests.</p>
                <div className="inline-flex items-center text-green-400 group-hover:text-green-300 transition font-medium">
                  <span>Open</span>
                  <ChevronRight className={`w-5 h-5 ml-2 transition-transform ${hoveredButton === 'itinerary' ? 'translate-x-1' : ''}`} />
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/adddestination">
            <div
              className="relative bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800/80 transition duration-300
                hover:scale-105 shadow-lg cursor-pointer group overflow-hidden"
              // onMouseEnter={() => setHoveredButton('adddestination')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl mb-5 group-hover:scale-110 transition duration-300 shadow-lg">
                  <Plane className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-200 transition">Add Destination</h3>
                <p className="text-slate-400 mb-6 text-sm">Add a new travel destination.</p>
                <div className="inline-flex items-center text-green-400 group-hover:text-green-300 transition font-medium">
                  <span>Open</span>
                  <ChevronRight className={`w-5 h-5 ml-2 transition-transform ${hoveredButton === 'adddestination' ? 'translate-x-1' : ''}`} />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Admin badge/footer */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center space-x-2 text-slate-500">
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">You are in admin mode • All changes are live</span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse delay-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

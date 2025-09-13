"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Calendar,
  Sparkles,
  ChevronRight,
  Plane,
  BarChart3,
  Globe,
  LayoutDashboard
} from "lucide-react";

const AdminDashboard = () => {
  const [hovered, setHovered] = useState<string | null>(null);
  const [statsData, setStatsData] = useState({
    totalPackages: 0,
    bookings: 0,
    itineraries: 0,
    destinations: 0,
  });

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (res.ok && data.success) {
        setStatsData(data.stats);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Replace hardcoded values with statsData
  const stats = [
    {
      label: "Total Packages",
      value: statsData.totalPackages,
      icon: <Package className="w-6 h-6 text-teal-500" />,
      color: "from-teal-500/40 to-teal-600/10"
    },
    {
      label: "Bookings",
      value: statsData.bookings,
      icon: <Calendar className="w-6 h-6 text-amber-500" />,
      color: "from-amber-500/40 to-amber-600/10"
    },
    {
      label: "Curated Itineraries",
      value: statsData.itineraries,
      icon: <Sparkles className="w-6 h-6 text-green-500" />,
      color: "from-green-500/40 to-emerald-700/10"
    },
    {
      label: "Destinations",
      value: statsData.destinations,
      icon: <Globe className="w-6 h-6 text-blue-500" />,
      color: "from-blue-500/40 to-blue-600/10"
    }
  ];


  const actions = [
    {
      label: "Add Domestic Package",
      description: "Create your domestic travel packages.",
      href: "/admin/dashboard",
      icon: <Package className="w-8 h-8 text-white" />,
      color: "from-blue-500 to-cyan-600",
      hover: "text-blue-200",
      text: "text-blue-400",
      buttonText: "Open"
    },
    {
      label: "Manage Packages",
      description: "Edit and delete uploaded packages.",
      href: "/admin/package",
      icon: <BarChart3 className="w-8 h-8 text-white" />,
      color: "from-indigo-500 to-blue-600",
      hover: "text-indigo-200",
      text: "text-indigo-400",
      buttonText: "Manage"
    },
    {
      label: "Add International Packages",
      description: "Add international travel packages.",
      href: "/admin/InternationalDashboard",
      icon: <BarChart3 className="w-8 h-8 text-white" />,
      color: "from-indigo-500 to-blue-600",
      hover: "text-indigo-200",
      text: "text-indigo-400",
      buttonText: "Manage"
    },
    {
      label: "Add Destination",
      description: "Add a new travel destination.",
      href: "/admin/adddestination",
      icon: <Plane className="w-8 h-8 text-white" />,
      color: "from-green-500 to-emerald-600",
      hover: "text-green-200",
      text: "text-green-400",
      buttonText: "Add"
    },

    {
      label: "Add International Destination",
      description: "Add a new travel destination.",
      href: "/admin/addinterdestination",
      icon: <Plane className="w-8 h-8 text-white" />,
      color: "from-green-500 to-emerald-600",
      hover: "text-green-200",
      text: "text-green-400",
      buttonText: "Add"
    },
    {
      label: "Bookings",
      description: "Monitor and manage all customer bookings.",
      href: "/admin/bookings",
      icon: <Calendar className="w-8 h-8 text-white" />,
      color: "from-amber-500 to-orange-600",
      hover: "text-amber-200",
      text: "text-amber-400",
      buttonText: "Open"
    },
    {
      label: "Itineraries",
      description: "Review all curated itinerary requests.",
      href: "/admin/itineraries",
      icon: <Sparkles className="w-8 h-8 text-white" />,
      color: "from-green-500 to-emerald-600",
      hover: "text-green-200",
      text: "text-green-400",
      buttonText: "View"
    },
    {
      label: "Pop-up Leads",
      description: "Review all pop-up leads.",
      href: "/admin/popupleads",
      icon: <Sparkles className="w-8 h-8 text-white" />,
      color: "from-green-500 to-emerald-600",
      hover: "text-green-200",
      text: "text-green-400",
      buttonText: "View"
    }
  ];

  

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-teal-500/10 to-emerald-600/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-full blur-2xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 z-10 relative">
          {/* Header */}
          <div className="flex items-center gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-600/80 to-emerald-400/60 shadow-lg p-4 rounded-xl">
              <LayoutDashboard className="w-9 h-9 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-white">Admin Dashboard</h1>
              <p className="text-lg text-slate-300 mt-1 font-light">
                Welcome back, admin! Manage all your platform essentials here.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
            {stats.map((stat) => (
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

          {/* Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {actions.map((action) => (
              <Link href={action.href} key={action.label}>
                <div
                  className="relative bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 transition duration-300 hover:scale-105 shadow-lg cursor-pointer group overflow-hidden"
                  onMouseEnter={() => setHovered(action.label)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <div className="relative z-10 text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${action.color} rounded-xl mb-5 group-hover:scale-110 transition duration-300 shadow-lg`}>
                      {action.icon}
                    </div>
                    <h3 className={`text-xl font-bold text-white mb-2 group-hover:${action.hover} transition`}>
                      {action.label}
                    </h3>
                    <p className="text-slate-400 mb-6 text-sm">{action.description}</p>
                    <div className={`inline-flex items-center ${action.text} group-hover:opacity-80 transition font-medium`}>
                      <span>{action.buttonText}</span>
                      <ChevronRight className={`w-5 h-5 ml-2 transition-transform ${hovered === action.label ? "translate-x-1" : ""}`} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Admin Badge */}
          <div className="mt-20 text-center">
            <div className="inline-flex items-center space-x-2 text-slate-500">
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">
                You are in admin mode • All changes are live
              </span>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse delay-500" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default AdminDashboard;

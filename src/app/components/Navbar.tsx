"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Globe, Menu, X, User, LogOut, Settings, Heart } from "lucide-react";
import { useAuth } from "../../Auth/AuthProvider";
import Image from "next/image";

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileMenuTimer, setProfileMenuTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { isAuthenticated, logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    if (profileMenuTimer) clearTimeout(profileMenuTimer);
  };

  const handleProfileMenuToggle = () => {
    if (isProfileMenuOpen) {
      setIsProfileMenuOpen(false);
      if (profileMenuTimer) clearTimeout(profileMenuTimer);
    } else {
      setIsProfileMenuOpen(true);
      const timer = setTimeout(() => {
        setIsProfileMenuOpen(false);
        setProfileMenuTimer(null);
      }, 5000);
      setProfileMenuTimer(timer);
    }
  };

  const handleProfileMenuHover = () => {
    if (profileMenuTimer) {
      clearTimeout(profileMenuTimer);
      const timer = setTimeout(() => {
        setIsProfileMenuOpen(false);
        setProfileMenuTimer(null);
      }, 10000);
      setProfileMenuTimer(timer);
    }
  };

  useEffect(() => {
    return () => {
      if (profileMenuTimer) clearTimeout(profileMenuTimer);
    };
  }, [profileMenuTimer]);

  const menuItems = [
    { name: "Destinations", href: "/destinations" },
    { name: "Packages", href: "/packages" },
    { name: "Contact Us", href: "/contact-us" },
    { name: "About Us", href: "/about-us" },
  ];

  // ⛔️ Hydration-safe: defer rendering until mounted
  if (!mounted) return null;

const renderProfileMenu = () => (
  <div
    className={`
      absolute z-50 top-16 right-0 w-64
      transition-all duration-300 ease-out transform
      ${isProfileMenuOpen
        ? "opacity-100 translate-y-0 scale-100"
        : "opacity-0 translate-y-[-8px] scale-95 pointer-events-none"
      }
    `}
    onMouseEnter={handleProfileMenuHover}
  >
    <div className="relative">
      {/* Glass Effect Container */}
      <div className="
        bg-white/10 backdrop-blur-2xl 
        border border-white/20 
        rounded-3xl shadow-2xl 
        ring-1 ring-white/10
        overflow-hidden
        before:absolute before:inset-0 
        before:bg-gradient-to-br before:from-white/5 before:via-transparent before:to-black/5
        before:pointer-events-none
      ">
        {/* Header */}
        <div className="relative px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Image 
                src="/avatar.jpeg" 
                alt="Profile" 
                width={48} 
                height={48} 
                className="rounded-full ring-2 ring-[#D2AF94]/40 shadow-md hover:scale-105 transition-transform"
              />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full shadow-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white text-sm font-semibold truncate">
                {user?.name || "Guest User"}
              </h3>
              <p className="text-[#D2AF94] text-xs font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 bg-[#D2AF94] rounded-full animate-pulse" />
                Premium Member
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-3">
          <nav className="space-y-1 text-sm font-medium text-white/90">
            {user?.role === "admin" && (
              <Link href="/dashboard" onClick={handleProfileMenuToggle}
                className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/10 rounded-xl transition">
                <Settings className="w-4 h-4 text-[#D2AF94]" />
                Admin Dashboard
              </Link>
            )}

            <Link href={`/my-trips/${user?._id}`} onClick={handleProfileMenuToggle}
              className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/10 rounded-xl transition">
              <MapPin className="w-4 h-4 text-blue-400" />
              My Adventures
            </Link>

            <Link href="/wishlist" onClick={handleProfileMenuToggle}
              className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/10 rounded-xl transition">
              <Heart className="w-4 h-4 text-rose-400" />
              Saved Places
            </Link>

            {/* Divider */}
            <div className="mx-6 my-3 border-t border-white/10" />

            <button onClick={handleLogout}
              className="flex items-center gap-4 px-6 py-3.5 text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-xl w-full transition">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
);
return (
    <nav className="fixed top-0 w-full z-50 transition-all duration-700 ease-out">
      {/* Background Glass Layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#002D37]/70 backdrop-blur-xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-[#002D37]/10" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D2AF94]/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link href={user?.role === "admin" ? "/admin" : "/"}>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D2AF94] to-[#8C7361] flex items-center justify-center shadow-lg">
                  <Globe className="h-5 w-5 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white via-[#D2AF94] to-white bg-clip-text text-transparent">
                TravelXec
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative px-5 py-2.5 text-white/80 hover:text-white font-medium transition-all duration-300 group"
              >
                {item.name}
              </Link>
            ))}
            <div className="ml-6 pl-6 border-l border-white/10">
              {isAuthenticated ? (
                <div className="relative">
                  <button onClick={handleProfileMenuToggle} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20">
                    <Image src="/avatar.jpeg" alt="Avatar" width={32} height={32} className="rounded-lg ring-2 ring-[#D2AF94]/30" />
                    <span>{user?.name?.split(" ")[0]}</span>
                  </button>
                  {renderProfileMenu()}
                </div>
              ) : (
                <Link href="/auth/login" className="px-6 py-2.5 bg-gradient-to-r from-[#D2AF94] to-[#8C7361] text-white rounded-xl">
                  <User className="h-4 w-4 inline mr-2" />
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

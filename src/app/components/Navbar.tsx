"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Globe,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Heart,
} from "lucide-react";
import { useAuth } from "../../Auth/AuthProvider";
import Image from "next/image";

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileMenuTimer, setProfileMenuTimer] =
    useState<ReturnType<typeof setTimeout> | null>(null);

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
    { name: "About Us", href: "/about-us" },
    { name: "Contact Us", href: "/contact-us" },
  ];

  // Prevent hydration mismatch by not rendering interactive elements until mounted
  if (!mounted) {
    return (
      <nav className="fixed top-0 w-full z-50 transition-all duration-700 ease-out">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[#002D37]/70 backdrop-blur-xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-[#002D37]/10" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D2AF94]/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link href="/">
              <div className="absolute left-0 top-2 h-full w-50 flex items-center justify-center z-10">
                <Image
                  src="/logo2.png"
                  alt="TravelXec Logo"
                  width={200}
                  height={70}
                  className="object-contain"
                />
              </div>
            </Link>
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
              <Link
                href="/curate-itinerary"
                className="relative ml-6 px-6 py-2.5 text-white/90 hover:text-white font-medium transition-all duration-300 group border-l border-white/10 pl-6"
              >
                <div className="relative flex items-center gap-2">
                  <span className="text-sm font-medium tracking-wide">Bespoke Itineraries</span>
                  <div className="w-1 h-1 bg-[#D2AF94] rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute bottom-0 left-6 right-0 h-0.5 bg-gradient-to-r from-[#D2AF94] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
              <div className="ml-6 pl-6 border-l border-white/10">
                <Link
                  href="/auth/login"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#D2AF94] to-[#8C7361] text-white rounded-xl"
                >
                  <User className="h-4 w-4 inline mr-2" />
                  Sign In
                </Link>
              </div>
            </div>
            <div className="md:hidden z-20">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white transition-colors"
                aria-expanded={isMenuOpen}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const renderProfileMenu = () => (
    <div
      className={`absolute z-50 top-16 right-0 w-64 transition-all duration-300 ease-out transform ${isProfileMenuOpen
        ? "opacity-100 translate-y-0 scale-100"
        : "opacity-0 translate-y-[-8px] scale-95 pointer-events-none"
        }`}
      onMouseEnter={handleProfileMenuHover}
    >
      <div className="relative">
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl ring-1 ring-white/10 overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:via-transparent before:to-black/5 before:pointer-events-none">
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
          <div className="py-3">
            <nav className="space-y-1 text-sm font-medium text-white/90">
              {user?.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={handleProfileMenuToggle}
                  className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/10 rounded-xl transition"
                >
                  <Settings className="w-4 h-4 text-[#D2AF94]" />
                  Admin Dashboard
                </Link>
              )}
              <Link
                href={`/my-trips/${user?._id}`}
                onClick={handleProfileMenuToggle}
                className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/10 rounded-xl transition"
              >
                <MapPin className="w-4 h-4 text-blue-400" />
                My Adventures
              </Link>
              <Link
                href="/saved-places"
                onClick={handleProfileMenuToggle}
                className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/10 rounded-xl transition"
              >
                <Heart className="w-4 h-4 text-rose-400" />
                Saved Places
              </Link>
              <div className="mx-6 my-3 border-t border-white/10" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-4 px-6 py-3.5 text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-xl w-full transition"
              >
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
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#002D37]/70 backdrop-blur-xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-[#002D37]/10" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D2AF94]/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link href={user?.role === "admin" ? "/admin" : "/"}> 
            <div className=" left-0 top-2 h-full w-50 flex items-center justify-center z-10">
              <Image
                src="/logo2.png"
                alt="TravelXec Logo"
                width={200}
                height={70}
                className="object-contain"
                priority
              />
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-1 z-10">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative px-5 py-2.5 text-white/80 hover:text-white font-medium transition-all duration-300 group"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Premium Curate Itinerary Button */}
            <Link
              href="/curate"
              className="relative ml-6 px-6 py-2.5 text-white/90 hover:text-white font-medium transition-all duration-300 group border-l border-white/10 pl-6"
            >
              <div className="relative flex items-center gap-2">
                <span className="text-sm font-medium tracking-wide">Bespoke Itineraries</span>
                <div className="w-1 h-1 bg-[#D2AF94] rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="absolute bottom-0 left-6 right-0 h-0.5 bg-gradient-to-r from-[#D2AF94] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>
            
            <div className="ml-6 pl-6 border-l border-white/10">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={handleProfileMenuToggle}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                    aria-expanded={isProfileMenuOpen}
                    aria-haspopup="true"
                  >
                    <Image
                      src="/avatar.jpeg"
                      alt="Avatar"
                      width={32}
                      height={32}
                      className="rounded-lg ring-2 ring-[#D2AF94]/30"
                    />
                    <span className="text-white/90">{user?.name?.split(" ")[0] || "User"}</span>
                  </button>
                  {renderProfileMenu()}
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#D2AF94] to-[#8C7361] text-white rounded-xl hover:from-[#C4925F] hover:to-[#7A6654] transition-all"
                >
                  <User className="h-4 w-4 inline mr-2" />
                  Sign In
                </Link>
              )}
            </div>
          </div>

          <div className="md:hidden z-20">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white transition-colors"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden px-6 pt-4 pb-6 space-y-3 bg-[#002D37]/10 backdrop-blur-lg border-t border-white/10 z-10">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-white/90 py-2 border-b border-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Premium Curate Itinerary */}
            <Link
              href="/curate"
              className="block py-3 text-white/90 hover:text-white border-b border-white/10 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center justify-between">
                <span>Bespoke Itineraries</span>
                <div className="w-1 h-1 bg-[#D2AF94] rounded-full" />
              </div>
            </Link>
            
            <div className="pt-4 border-t border-white/10">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/avatar.jpeg"
                      alt="Avatar"
                      width={36}
                      height={36}
                      className="rounded-full ring-2 ring-[#D2AF94]/30"
                    />
                    <div>
                      <p className="text-white font-medium">{user?.name || "User"}</p>
                      <p className="text-xs text-[#D2AF94]">Premium Member</p>
                    </div>
                  </div>
                  <Link href={`/my-trips/${user?._id}`} className="block text-white/80 hover:text-white" onClick={() => setIsMenuOpen(false)}>
                    My Adventures
                  </Link>
                  <Link href="/wishlist" className="block text-white/80 hover:text-white" onClick={() => setIsMenuOpen(false)}>
                    Saved Places
                  </Link>
                  {user?.role === "admin" && (
                    <Link href="/admin" className="block text-white/80 hover:text-white" onClick={() => setIsMenuOpen(false)}>
                      Admin Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} className="text-red-400 hover:text-red-300 mt-2">
                    <LogOut className="inline w-4 h-4 mr-1" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link href="/auth/login" className="block text-white/90 bg-[#D2AF94] text-center py-2 rounded-lg mt-4">
                  <User className="inline h-4 w-4 mr-2" />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

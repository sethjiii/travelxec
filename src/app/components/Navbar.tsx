"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  MapPin, Menu, X, User, LogOut, Settings, Heart,
} from "lucide-react";
import { useAuth } from "../../Auth/AuthProvider";
import Image from "next/image";

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDestDropdownOpen, setIsDestDropdownOpen] = useState(false);
  const destDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, logout, user } = useAuth();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on outside click or ESC
  useEffect(() => {
    function handleDocumentClick(e: MouseEvent) {
      // Destinations dropdown
      if (
        isDestDropdownOpen &&
        destDropdownRef.current &&
        !destDropdownRef.current.contains(e.target as Node)
      ) {
        setIsDestDropdownOpen(false);
      }

      // Profile dropdown
      if (
        isProfileMenuOpen &&
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    }

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setIsProfileMenuOpen(false);
        setIsDestDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleDocumentClick);
    window.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      window.removeEventListener("keydown", handleKey);
    };
  }, [isProfileMenuOpen, isDestDropdownOpen, isMenuOpen]);

  // Close all dropdowns
  const closeAllDropdowns = () => {
    setIsDestDropdownOpen(false);
    setIsProfileMenuOpen(false);
    setIsMenuOpen(false);
  };

  // Toggle functions
  const toggleDestDropdown = () => {
    setIsDestDropdownOpen(!isDestDropdownOpen);
    setIsProfileMenuOpen(false); // Close profile menu when opening dest dropdown
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    setIsDestDropdownOpen(false); // Close dest dropdown when opening profile menu
  };

  const menuItems = [
    { name: "Destinations", href: "/destinations" },
    { name: "Packages", href: "/packages" },
    { name: "About Us", href: "/about-us" },
    { name: "Contact Us", href: "/contact-us" },
  ];

  // Get home route based on user role
  const getHomeRoute = () => {
    if (user?.role === "admin") return "/admin";
    return "/";
  };

  if (!mounted) return null; // SSR hydration fix

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition duration-300
    ${isScrolled
          ? "md:backdrop-blur-md md:bg-[#002D37]/90 md:shadow-lg bg-[#002D37]"
          : "md:bg-transparent bg-[#002D37]"
        }
  `}
      aria-label="Global Navigation"
    >
      <div className="relative max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-5 md:px-8 h-16 md:h-20">
        {/* --- LOGO --- */}
        <Link href={getHomeRoute()}>
          <div className="flex items-center gap-3 h-16 md:h-20 w-auto cursor-pointer select-none">
            <Image
              src="/logo2.png"
              alt="Logo"
              width={isMenuOpen ? 110 : 150}
              height={45}
              className="object-contain transition-all duration-300"
              priority
            />
          </div>
        </Link>

        {/* --- DESKTOP NAV --- */}
        <div className="hidden md:flex items-center">
          {/* Destinations with dropdown */}
          <div className="relative" ref={destDropdownRef}>
            <button
              className="px-3 py-2 mx-1 text-base text-white/80 hover:text-white
                transition font-medium rounded-lg flex items-center gap-1
                focus:outline-none focus:ring-2 focus:ring-[#D2AF94]"
              type="button"
              aria-haspopup="true"
              aria-expanded={isDestDropdownOpen}
              onClick={toggleDestDropdown}
              tabIndex={0}
            >
              Destinations
              <svg
                className={`w-4 h-4 ml-1 transition-transform ${isDestDropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown: only when open */}
            {isDestDropdownOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-white shadow-xl rounded-xl z-30 border ring-1 ring-black/10">
                <Link
                  href="/destinations"
                  className="block px-5 py-3 text-[#002D37] font-medium hover:bg-[#D2AF94]/10 rounded-t-xl transition-colors"
                  onClick={closeAllDropdowns}
                >
                  All Destinations
                </Link>
                <Link
                  href="/InternationalDestination"
                  className="block px-5 py-3 text-[#8C7361] font-medium hover:bg-[#D2AF94]/10 rounded-b-xl transition-colors"
                  onClick={closeAllDropdowns}
                >
                  International Destinations
                </Link>
              </div>
            )}
          </div>

          {/* The rest of the menu items */}
          {menuItems.slice(1).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="px-3 py-2 mx-1 text-base text-white/80 hover:text-white
                transition font-medium rounded-lg
                focus:outline-none focus:ring-2 focus:ring-[#D2AF94]"
              onClick={closeAllDropdowns}
            >
              {item.name}
            </Link>
          ))}

          <Link
            href="/curate"
            className="ml-4 px-4 py-2 text-white bg-gradient-to-r from-[#D2AF94] to-[#8C7361]
              rounded-xl font-semibold hover:from-[#cba57f] hover:to-[#8C7361]
              focus:outline-none focus:ring-2 focus:ring-[#D2AF94] transition"
            onClick={closeAllDropdowns}
          >
            Make Your Itineraries
          </Link>

          {/* Profile Section */}
          <div className="ml-4" ref={profileDropdownRef}>
            {isAuthenticated ? (
              <div className="relative">
                <button
                  aria-haspopup="true"
                  aria-expanded={isProfileMenuOpen}
                  onClick={toggleProfileMenu}
                  className="flex items-center gap-2 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D2AF94] rounded-lg hover:bg-white/10 transition"
                  tabIndex={0}
                >
                  <Image
                    src="/avatar.jpeg"
                    alt="Avatar"
                    width={36}
                    height={36}
                    className="rounded-full ring-2 ring-[#D2AF94]/30"
                  />
                  <span className="hidden lg:inline-block text-white/80 font-medium">
                    {user?.name?.split(" ")[0] || "User"}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isProfileMenuOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* PROFILE MENU */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white shadow-2xl border ring-1 ring-black/5 z-30">
                    <div className="p-4">
                      <p className="text-[#002D37] font-semibold mb-2">{user?.name || "User"}</p>
                      <div className="border-b border-gray-200 mb-2" />

                      <Link
                        href="/profile"
                        className="block py-2 px-2 text-[#186663] hover:bg-[#D2AF94]/10 rounded font-medium transition-colors"
                        onClick={closeAllDropdowns}
                      >
                        <User className="inline w-4 h-4 mr-2" /> Profile
                      </Link>

                      <Link
                        href={`/my-trips/${user?._id}`}
                        className="block py-2 px-2 text-[#186663] hover:bg-[#D2AF94]/10 rounded font-medium transition-colors"
                        onClick={closeAllDropdowns}
                      >
                        <MapPin className="inline w-4 h-4 mr-2" /> My Adventures
                      </Link>

                      <Link
                        href="/saved-places"
                        className="block py-2 px-2 text-[#8C7361] hover:bg-[#D2AF94]/10 rounded font-medium transition-colors"
                        onClick={closeAllDropdowns}
                      >
                        <Heart className="inline w-4 h-4 mr-2" /> Saved Places
                      </Link>

                      {user?.role === "admin" && (
                        <Link
                          href="/admin"
                          className="block py-2 px-2 text-[#D2AF94] hover:bg-[#8C7361]/10 rounded font-medium transition-colors"
                          onClick={closeAllDropdowns}
                        >
                          <Settings className="inline w-4 h-4 mr-2" /> Admin Dashboard
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          closeAllDropdowns();
                        }}
                        className="block w-full text-left py-2 px-2 mt-2 text-red-500 hover:bg-red-50 rounded font-medium transition-colors"
                      >
                        <LogOut className="inline w-4 h-4 mr-2" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center px-4 py-2 bg-[#D2AF94] text-white rounded-xl hover:bg-[#cba57f] transition font-medium"
                onClick={closeAllDropdowns}
              >
                <User className="w-4 h-4 mr-2" /> Sign In
              </Link>
            )}
          </div>
        </div>

        {/* --- MOBILE MENU BUTTON --- */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg text-white/90 bg-white/10 hover:bg-[#D2AF94]/20 transition"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* --- MOBILE FULL SCREEN MENU --- */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#002D37] md:hidden">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-[#D2AF94]">
              <Link href={getHomeRoute()} onClick={closeAllDropdowns}>
                <Image src="/logo2.png" alt="Logo" width={110} height={40} />
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-[#D2AF94]/20 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-grow flex flex-col gap-2 px-7 py-5">
              {/* Destinations with sub-menu */}
              <div>
                <Link
                  href="/destinations"
                  className="block py-3 text-white/90 text-lg font-semibold rounded hover:bg-[#D2AF94]/10 transition"
                  onClick={closeAllDropdowns}
                >
                  Destinations
                </Link>
                <div className="ml-4">
                  <Link
                    href="/InternationalDestination"
                    className="block py-2 text-[#D2AF94] font-medium hover:bg-[#D2AF94]/10 rounded transition"
                    onClick={closeAllDropdowns}
                  >
                    International Destinations
                  </Link>
                </div>
              </div>

              {/* Other menu items */}
              {menuItems.slice(1).map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block py-3 text-white/90 text-lg font-semibold rounded hover:bg-[#D2AF94]/10 transition"
                  onClick={closeAllDropdowns}
                >
                  {item.name}
                </Link>
              ))}

              <Link
                href="/curate"
                className="block py-3 text-white text-lg font-semibold mt-2 rounded bg-gradient-to-r from-[#D2AF94] to-[#8C7361] text-center hover:from-[#cba57f] hover:to-[#8C7361] transition"
                onClick={closeAllDropdowns}
              >
                Make Your Own Itineraries
              </Link>

              {/* --- Mobile Auth/Profile --- */}
              <div className="mt-6 border-t border-[#D2AF94] pt-4">
                {isAuthenticated ? (
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <Image
                        src="/avatar.jpeg"
                        alt="Avatar"
                        width={48}
                        height={48}
                        className="rounded-full ring-2 ring-[#D2AF94]/30"
                      />
                      <div>
                        <p className="text-white font-medium">{user?.name || "User"}</p>
                        <p className="text-xs text-[#D2AF94]">
                          {user?.role === "admin" ? "Administrator" : "Premium Member"}
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/profile"
                      className="block py-2 text-white/80 hover:text-white transition"
                      onClick={closeAllDropdowns}
                    >
                      <User className="inline w-4 h-4 mr-2" /> Profile
                    </Link>

                    <Link
                      href={`/my-trips/${user?._id}`}
                      className="block py-2 text-white/80 hover:text-white transition"
                      onClick={closeAllDropdowns}
                    >
                      <MapPin className="inline w-4 h-4 mr-2" /> My Adventures
                    </Link>

                    <Link
                      href="/saved-places"
                      className="block py-2 text-white/80 hover:text-white transition"
                      onClick={closeAllDropdowns}
                    >
                      <Heart className="inline w-4 h-4 mr-2" /> Saved Places
                    </Link>

                    {user?.role === "admin" && (
                      <Link
                        href="/admin"
                        className="block py-2 text-[#D2AF94] hover:text-white transition"
                        onClick={closeAllDropdowns}
                      >
                        <Settings className="inline w-4 h-4 mr-2" /> Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        closeAllDropdowns();
                      }}
                      className="w-full mt-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition flex items-center justify-center font-medium"
                    >
                      <LogOut className="inline w-4 h-4 mr-2" /> Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/auth/login"
                    className="block text-white bg-[#D2AF94] py-3 text-center rounded-lg font-medium hover:bg-[#cba57f] transition"
                    onClick={closeAllDropdowns}
                  >
                    <User className="inline h-4 w-4 mr-2" /> Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

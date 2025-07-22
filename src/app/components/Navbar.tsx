"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
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

  const { isAuthenticated, logout, user } = useAuth();

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // For accessibility: close menus on ESC
  useEffect(() => {
    if (!isMenuOpen && !isProfileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setIsProfileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMenuOpen, isProfileMenuOpen]);

  const menuItems = [
    { name: "Destinations", href: "/destinations" },
    { name: "Packages", href: "/packages" },
    { name: "About Us", href: "/about-us" },
    { name: "Contact Us", href: "/contact-us" },
  ];

  if (!mounted) return null; // Avoid hydration issues

  /*** ---------- NAVBAR RENDER ---------- ***/
  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition duration-300
        ${isScrolled ? "backdrop-blur-md bg-[#002D37]/80 shadow-lg" : "bg-transparent"}
      `}
      aria-label="Global Navigation"
    >
      <div className="relative max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-5 md:px-8 h-16 md:h-20">
        {/* --- LOGO --- */}
        <Link href={user?.role === "admin" ? "/admin" : "/"}>
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
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="
                px-3 py-2 mx-1 text-base text-white/80 hover:text-white
                transition font-medium rounded-lg
                focus:outline-none focus:ring-2 focus:ring-[#D2AF94]
              "
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/curate"
            className="
              ml-4 px-4 py-2 text-white bg-gradient-to-r from-[#D2AF94] to-[#8C7361]
              rounded-xl font-semibold hover:from-[#cba57f] hover:to-[#8C7361] 
              focus:outline-none focus:ring-2 focus:ring-[#D2AF94] transition
            "
          >
            Bespoke Itineraries
          </Link>
          <div className="ml-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  aria-haspopup="true"
                  aria-expanded={isProfileMenuOpen}
                  onClick={() => setIsProfileMenuOpen((open) => !open)}
                  className="flex items-center gap-2 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D2AF94]"
                >
                  <Image
                    src="/avatar.jpeg"
                    alt="Avatar"
                    width={36}
                    height={36}
                    className="rounded-full ring-2 ring-[#D2AF94]/30"
                  />
                  <span className="hidden lg:inline-block text-white/80 font-medium">{user?.name?.split(" ")[0] || "User"}</span>
                </button>
                {/* PROFILE MENU */}
                <div
                  className={`
                    absolute right-0 mt-2 w-52 rounded-xl bg-white/90 shadow-2xl border py-24
                    transition-all duration-150
                    ${isProfileMenuOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}
                    ring-1 ring-black/5 z-30
                  `}
                  onMouseLeave={() => setIsProfileMenuOpen(false)}
                >
                  <div className="p-4">
                    <p className="text-[#002D37] font-semibold mb-2">{user?.name || "User"}</p>
                    <div className="border-b border-gray-200 mb-2" />
                    <Link
                      href={`/profile`}
                      className="block py-2 px-2 text-[#186663] hover:bg-[#D2AF94]/10 rounded font-medium"
                      onClick={() => setIsProfileMenuOpen(false)}
                    > <User className="inline w-4 h-4 mr-1" /> Profile </Link>
                    <Link
                      href={`/my-trips/${user?._id}`}
                      className="block py-2 px-2 text-[#186663] hover:bg-[#D2AF94]/10 rounded font-medium"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <MapPin className="inline w-4 h-4 mr-1" /> My Adventures
                    </Link>
                    <Link
                      href="/saved-places"
                      className="block py-2 px-2 text-[#8C7361] hover:bg-[#D2AF94]/10 rounded font-medium"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <Heart className="inline w-4 h-4 mr-1" /> Saved Places
                    </Link>
                    {user?.role === "admin" && (
                      <Link
                        href="/admin"
                        className="block py-2 px-2 text-[#D2AF94] hover:bg-[#8C7361]/10 rounded font-medium"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Settings className="inline w-4 h-4 mr-1" /> Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => { logout(); setIsProfileMenuOpen(false); }}
                      className="block w-full text-left py-2 mt-2 text-red-500 hover:bg-red-50 rounded font-medium"
                    >
                      <LogOut className="inline w-4 h-4 mr-1" /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center px-4 py-2 bg-[#D2AF94] text-white rounded-xl hover:bg-[#cba57f] transition font-medium"
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Link>
            )}
          </div>
        </div>
        {/* --- MOBILE MENU BUTTON --- */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen((open) => !open)}
            className="p-2 rounded-lg text-white/90 bg-white/10 hover:bg-[#D2AF94]/20 transition"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {/* --- MOBILE FULL SCREEN MENU --- */}
      <div className={`
        fixed inset-0 z-40 bg-[#002D37]/95 transition-all duration-300 ease-in-out 
        ${isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"}
        md:hidden
      `}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-[#D2AF94]">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>
              <Image src="/logo2.png" alt="Logo" width={110} height={40} />
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-[#D2AF94]/20"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-grow flex flex-col gap-2 px-7 py-5">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-3 text-white/90 text-lg font-semibold rounded hover:bg-[#D2AF94]/10 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/curate"
              className="block py-3 text-white/90 text-lg font-semibold mt-2 rounded bg-gradient-to-r from-[#D2AF94] to-[#8C7361] text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Bespoke Itineraries
            </Link>
            {/* --- Mobile Auth/Profile --- */}
            <div className="mt-6 border-t border-[#D2AF94] pt-4">
              {isAuthenticated ? (
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <Image
                      src="/avatar.jpeg"
                      alt="Avatar"
                      width={48}
                      height={48}
                      className="rounded-full ring-2 ring-[#D2AF94]/30"
                    />
                    <div>
                      <p className="text-white font-medium">{user?.name || "User"}</p>
                      <p className="text-xs text-[#D2AF94]">Premium Member</p>
                    </div>
                  </div>
                  <Link href={`/my-trips/${user?._id}`} className="block py-2 text-white/80 hover:text-white" onClick={() => setIsMenuOpen(false)}>
                    <MapPin className="inline w-4 h-4 mr-1" /> My Adventures
                  </Link>
                  <Link href="/saved-places" className="block py-2 text-white/80 hover:text-white" onClick={() => setIsMenuOpen(false)}>
                    <Heart className="inline w-4 h-4 mr-1" /> Saved Places
                  </Link>
                  {user?.role === "admin" && (
                    <Link href="/admin" className="block py-2 text-[#D2AF94] hover:text-white" onClick={() => setIsMenuOpen(false)}>
                      <Settings className="inline w-4 h-4 mr-1" /> Admin Dashboard
                    </Link>
                  )}
                  <button onClick={() => { logout(); setIsMenuOpen(false); }} className="w-full mt-4 py-2 bg-red-500/90 hover:bg-red-600 text-white rounded-lg transition flex items-center justify-center">
                    <LogOut className="inline w-4 h-4 mr-1" /> Sign Out
                  </button>
                </div>
              ) : (
                <Link href="/auth/login" className="block text-white/90 bg-[#D2AF94] py-2 text-center rounded-lg mt-1">
                  <User className="inline h-4 w-4 mr-2" /> Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

"use client";

import React from "react";
import { Globe, Users, MapPin, Star, Heart } from "lucide-react";
import Link from "next/link";
import { AuroraBackground } from "@/components/ui/aurora-background";
import Footer from "@/app/components/FooterContent"; // Adjust the import path as necessary

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FEFDFB] via-white to-[#D2AF94]/10 text-[#002D37] font-serif">
      {/* Navbar */}


      {/* Hero Section */}
      <section className="relative h-[650px] md:h-[750px] lg:h-[800px] overflow-hidden">
        {/* Video Background */}
        <video
          src="https://res.cloudinary.com/dgbhkfp0r/video/upload/v1753425241/hero-section_hisbsx.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0" />

        {/* Gradient highlight layer */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 z-0" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center h-full px-6 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-4 drop-shadow-lg">
            About <span className="text-[#D2AF94]">TravelXec</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#D2AF94] font-light max-w-2xl leading-relaxed drop-shadow-md">
            Where luxury meets legacy,<br className="hidden sm:block" /> and journeys become heirlooms.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light font-serif mb-4">Our Story</h2>
          <p className="text-lg text-[#8C7361] max-w-3xl mx-auto font-light leading-relaxed">
            Born out of a desire to redefine travel for the discerning few, TravelXec curates extraordinary experiences
            that go beyond itineraries. We blend opulence with authenticity — offering you not just a destination,
            but a narrative worth retelling.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center mt-12">
          {/* Global Access */}
          <div className="flex flex-col items-center">
            <Globe className="h-10 w-10 text-[#186663]" />
            <h3 className="mt-4 text-xl font-medium">Global Access</h3>
            <p className="text-[#8C7361] text-sm mt-2">
              Elite gateways to the world's rarest destinations.
            </p>
          </div>

          {/* Personal Touch */}
          <div className="flex flex-col items-center">
            <Heart className="h-10 w-10 text-[#186663]" />
            <h3 className="mt-4 text-xl font-medium">Personal Touch</h3>
            <p className="text-[#8C7361] text-sm mt-2">
              Each journey is tailored with heart and precision.
            </p>
          </div>

          {/* Uncompromised Luxury with Stars */}
          <div className="flex flex-col items-center">
            <div className="flex justify-center space-x-1 mb-4">
              <Star fill="currentColor" className="h-8 w-8 text-[#186663]" />
              <Star fill="currentColor" className="h-8 w-8 text-[#186663]" />
              <Star fill="currentColor" className="h-8 w-8 text-[#186663]" />
              <Star fill="currentColor" className="h-8 w-8 text-[#186663]" />
              <Star fill="currentColor" className="h-8 w-8 text-[#186663]" />
            </div>
            <h3 className="text-xl font-medium">Uncompromised Luxury</h3>
            <p className="text-[#8C7361] text-sm mt-2">
              We define luxury through experience, not just amenities.
            </p>
          </div>
        </div>
      </section>


      {/* Mission Section */}
      <section className="relative py-24 bg-gradient-to-br from-[#002D37]/90 via-[#003a47]/85 to-[#186663]/80 text-white px-6 overflow-hidden">
        <AuroraBackground className="absolute inset-0 w-full h-full z-0"> {/* Ensure full coverage of the section */}
          {/* The Aurora Background is set to cover the entire section now */}
        </AuroraBackground>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-serif font-light mb-6">
            Our <span className="text-[#D2AF94]">Mission</span>
          </h2>
          <p className="text-lg md:text-xl font-light leading-relaxed text-[#E0EDED] mb-10">
            To elevate every travel moment into a legacy — by merging cultural depth, sustainability, and understated elegance.
          </p>

          <div className="flex flex-wrap justify-center gap-8">
            {/* Card 1 */}
            <div className="w-50 bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 relative z-10">
              <MapPin className="mx-auto mb-4 w-8 h-8 text-white" />
              <p className="text-white font-light text-lg">500+ curated experiences</p>
            </div>

            {/* Card 2 */}
            <div className="w-50 bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 relative z-10">
              <Users className="mx-auto mb-4 w-8 h-8 text-white" />
              <p className="text-white font-light text-lg">10000+ delighted travelers</p>
            </div>

            {/* Card 3 */}
            <div className="w-50 bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 relative z-10">
              <div className="flex justify-center space-x-2">
                <Star fill="white" className="w-8 h-8 text-white" />
                <Star fill="white" className="w-8 h-8 text-white" />
                <Star fill="white" className="w-8 h-8 text-white" />
                <Star fill="white" className="w-8 h-8 text-white" />
                <Star fill="white" className="w-8 h-8 text-white" />
              </div>
              <p className=" py-2 text-white font-light text-lg">Rated 5-stars in experience & luxury</p>
            </div>
          </div>
        </div>
      </section>



      {/* Call to Action */}
      <section className="py-24 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-light font-serif text-[#002D37] mb-6">Let Your Next Story Begin with Us</h2>
        <p className="text-[#8C7361] text-lg mb-8">Explore handpicked luxury journeys made for the modern nomad.</p>
        <Link href="/packages">
          <button className="px-8 py-4 bg-gradient-to-r from-[#D2AF94] to-[#8C7361] text-white rounded-xl hover:scale-105 transition-all font-light">
            View Our Experiences
          </button>
        </Link>
      </section>
      <footer className="w-full bg-gradient-to-r from-transparent via-[#D2AF94] to-transparent">
        <Footer />
      </footer>
    </div>

  );
};

export default AboutUsPage;

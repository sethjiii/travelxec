"use client";
import React, { useState, useEffect } from "react";
import {
  MapPin,
  Search,
  Heart,
  Clock,
  Compass,
  ArrowRight,
  Award,
  Star,
  PhoneCall,
  Bookmark,
  IndianRupee,
  StarHalf,
  StarOff,
  Lamp,
  Castle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import ExploreButton from "@/ui/ExploreButton";
import ViewPackagesButton from "@/ui/ViewPackagesButton";
import Squares from "@/ui/Squares";








interface TravelPackage {
  _id: number;
  title: string;
  description: string;
  price: number;
  duration: string;
  highlights: string[];
  images: string[];
  likes: number;
  destination: string;
  name: string;
  places: string;
  rating: number;
}

interface Testimonial {
  id: number;
  name: string;
  image: string;
  comment: string;
  rating: number;
  destination: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    image: "r1.jpeg",
    comment: "The best travel experience I've ever had! The attention to detail was amazing.",
    rating: 5,
    destination: "Japan Tour"
  },
  {
    id: 2,
    name: "Michael Chen",
    image: "r2.jpeg",
    comment: "Perfectly organized trip with unforgettable moments. Highly recommended!",
    rating: 5,
    destination: "Italy Adventure"
  },
  {
    id: 3,
    name: "Emma Davis",
    image: "r3.jpeg",
    comment: "Professional service and incredible destinations. Will definitely book again!",
    rating: 5,
    destination: "Greece Explorer"
  }
];






const TravelContent = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  //const [priceRange, setPriceRange] = useState<string>("all");
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [sortBy, setSortBy] = useState<string>("popularity");

  // Fetch packages from backend
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("/api/packages");
        if (!response.ok) throw new Error("Failed to fetch packages");
        const data = await response.json();
        console.log(data)
        setPackages(data.packages);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    const popularPackages = [...packages]
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 6);
    console.log(popularPackages)
    fetchPackages();
  }, []);

  // ⭐ Star rendering logic
  const renderStars = (rating = 4.5) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="text-yellow-400 w-4 h-4" fill="currentColor" />);
    }

    if (hasHalf && fullStars < 5) {
      stars.push(<StarHalf key="half" className="text-yellow-400 w-4 h-4" fill="currentColor" />);
    }

    while (stars.length < 5) {
      stars.push(<StarOff key={`off-${stars.length}`} className="text-yellow-400 w-4 h-4" />);
    }

    return stars;
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setSubscribing(true);
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!response.ok) throw new Error('Subscription failed');

      toast.success("Successfully subscribed to newsletter!");
      setEmail("");
    } catch (error) {
      toast.error(error as string || "Failed to subscribe. Please try again.");
    } finally {
      setSubscribing(false);
    }
  };

  const filterPackages = (packages: TravelPackage[]) => {
    return packages.filter((pkg) => {
      const matchesSearch =
        pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.highlights.some((highlight) =>
          highlight.toLowerCase().includes(searchQuery.toLowerCase())
        );

      // let matchesPrice = true;
      // if (priceRange !== "all") {
      //   const [min, max] = priceRange.split("-").map(Number);
      //   matchesPrice = pkg.price >= min && (max ? pkg.price <= max : true);
      // }

      return matchesSearch
    });
  };

  const popularPackages = [...packages].sort((a, b) => b.likes - a.likes).slice(0, 6);
  const featuredPackages = filterPackages(packages).slice(0, 6);


  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Enhanced Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <video
          src="/hero-section.mp4"  // put the video inside /public
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center">
          <div className="text-white px-8 md:px-16 max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-[#D2AF94] playfair font-sans">
              The Connoisseur's Compass
            </h1>
            <p className="text-lg md:text-xl mb-8 text-[#8c7361] playfair font-sans">
              "True Luxury isn't thread count, but the thread that weaves unforgrttable stories"
            </p>
            <div className="flex gap-5">
              <ExploreButton />
              <ViewPackagesButton />
            </div>
          </div>
        </div>
      </section>






      {/* Featured Packages Section */}
      <section className="py-16 bg-gradient-to-b from-[#186663]/10 to-[#A6B5B4]/10 px-4">


        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
            <h2 className="text-3xl md:text-4xl font-bold text-[#186663] font-serif tracking-wide">
              Featured Packages
            </h2>
            <Link
              href="/packages"
              className="flex items-center gap-1 text-[#186663] hover:text-[#0a3c3a] font-semibold transition-colors group"
            >
              <span className="border-b border-transparent group-hover:border-[#186663] transition-all">
                View All Packages
              </span>
              <ArrowRight className="h-4 w-4 mt-0.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-8 bg-white p-3 rounded-xl shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="relative md:col-span-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search destinations or packages..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50
                      hover:border-[#186663] focus:outline-none focus:ring-2 focus:ring-[#186663]/50
                      transition-all text-gray-700"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                className="py-3 px-4 border border-gray-200 rounded-lg bg-gray-50 
                    focus:outline-none focus:ring-2 focus:ring-[#186663]/50 text-gray-700"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popularity">Sort by Popularity</option>
                <option value="duration">Sort by Duration</option>
              </select>
            </div>
          </div>

          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 }
            }}
            className="featured-packages-swiper"
          >
            {featuredPackages.map((pkg) => (
              <SwiperSlide key={pkg._id}>
                <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                  <div className="relative aspect-video">
                    <img
                      src={pkg.images[0]}
                      alt={pkg.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-[#186663] text-[#A6B5B4] py-1 px-3 rounded-lg 
                            text-sm font-medium z-10 shadow-md">
                      {pkg.duration}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="mb-3">
                      <h3 className="text-lg text-[#186663] mb-1 playfair">{pkg.name}</h3>
                      <div className="flex flex-wrap text-sm text-gray-500 gap-5">
                        {pkg.places.split("-").map((place, index, arr) => (
                          <span key={index} className="flex items-center">
                            {place}
                            {index < arr.length - 1 && <ArrowRight className="mx-1 w-3 h-3 opacity-50" />}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-auto pt-4">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/packages/${pkg._id}`}
                          className="flex-1 min-w-[12px] text-center bg-[#186663] hover:bg-[#0a3c3a] text-white 
                              py-2 px-2 rounded-lg font-medium transition-colors"
                        >
                          Explore Now
                        </Link>
                        <button
                          className="flex-1 min-w-[12px] border border-[#186663] text-[#186663] hover:bg-[#186663]/5
                              py-2 px-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-1"
                        >
                          <Bookmark className="w-4 h-4" />
                          <span>Save</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <section className="relative py-10 px-10 overflow-hidden">
        {/* Squares Background */}
        <div className="absolute inset-0 z-0">
          <Squares
            speed={0.2}
            squareSize={50}
            direction='down'
            hoverFillColor='#D2AF94'
            borderColor="#D2AF94"
          />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-20">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-white drop-shadow-md playfair font-sans">
              Popular Destinations
            </h2>
            <Link
              href="/destinations"
              className="flex items-center gap-2 text-white hover:text-blue-200 font-semibold"
            >
              Explore All <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          {/* Destination Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularPackages.map((pkg) => (
              <div
                key={pkg._id}
                className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden border border-[#D2AF94]/20 hover:border-[#D2AF94] hover:bg-white"
              >
                {/* Image Section */}
                <div className="relative">
                  <img
                    src={pkg.images[0]}
                    alt={pkg.title}
                    className="w-full h-40 object-cover"
                  />
                  <button className="absolute top-3 right-3 p-2 bg-white/80 rounded-full shadow hover:bg-white transition-all">
                    <Heart className="h-4 w-4 text-red-500" />
                  </button>
                </div>

                {/* Content Section */}
                <div className="p-4">
                  <h3 className="text-md font-bold text-[#d2af94]-800 mb-1 playfair font-sans">
                    {pkg.name}
                  </h3>

                  <p className="flex items-center gap-1 text-gray-600 text-sm mb-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    {pkg.highlights[0]}
                  </p>

                  <div className="flex items-center justify-between text-gray-800 mb-3">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-4 w-4 text-gray-400" />
                      {pkg.duration}
                    </span>
                    {/* <span className="text-blue-600 font-bold text-sm">
                ${pkg.price}
              </span> */}
                  </div>

                  <Link
                    href={`/destinations/${pkg._id}`}
                    className="block w-full text-center bg-blue-600 text-white text-sm py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
  <section
    className="py-20"
    style={{
      background: "linear-gradient(to bottom, #002D37, #186663)",
      minHeight: "100vh"
    }}
  >
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-[#D2AF94] playfair font-sans">
            Why Travel With TravelXec
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 playfair">
            {[
              {
                icon: <Award className="h-8 w-8 stroke-[#002D37]" />,
                title: "Curated Destinations",
                description: "We don’t just pick places — we handcraft journeys to India’s most coveted gems, offering privileged access to destinations that remain untouched by mass tourism"
              },
              {
                icon: <Castle className="h-8 w-8 text-[#002D37]" />,
                title: "Exceptional Stays",
                description: "From royal palaces and boutique heritage retreats to ultra-luxury eco-resorts, every accommodation is meticulously selected for its charm, comfort, and distinction"
              },
              {
                icon: <Star className="h-8 w-8 text-[#002D37]" />,
                title: "Luxury with Purpose",
                description: "We believe true luxury respects the planet. Our journeys uplift local artisans, preserve cultural legacies, and minimize environmental impact — all while delivering a seamless, world-class experience"
              },

            ].map((item, index) => (
              <div key={index} className="text-center p-6 bg-[#A6B5B4] rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="inline-block p-4 bg-blue-100 rounded-full text-blue-600 mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl text-gray-700 font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 font-playfair">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Testimonials Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
            What Our Travelers Say
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-blue-400 text-sm truncate">{testimonial.name}</h3>
                    <p className="text-gray-600 text-xs truncate">{testimonial.destination}</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                  {testimonial.comment}
                </p>
                <div className="flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Enhanced Newsletter Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-blue-600 transform -skew-y-6"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-6">
              Get Exclusive Travel Updates
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Subscribe to our newsletter and receive exclusive offers, travel tips, and destination guides.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email address"
                className="px-6 py-4 rounded-full text-gray-900 flex-grow max-w-md text-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                disabled={subscribing}
                className="bg-white text-blue-600 px-8 py-4 rounded-full hover:bg-gray-100 transition-colors text-lg font-semibold disabled:opacity-70"
              >
                {subscribing ? "Subscribing..." : "Subscribe Now"}
              </button>
            </form>
            <p className="mt-4 text-sm text-blue-100">
              By subscribing, you agree to receive our marketing emails. You can unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TravelContent;
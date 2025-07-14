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
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import ExploreButton from "@/ui2/ExploreButton.js";
import ViewPackagesButton from "@/ui2/ViewPackagesButton.js";
import { useFavorites } from "@/hooks/useFavorites";




interface TravelPackage {
  _id: number;
  title: string;
  description: string;
  // price: number;
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
    name: "Sanskar Seth, Delhi",
    image: "seth.jpg",
    comment: "TravelXec made my solo trip to Rajasthan seamless, allowing me to explore the beauty of Jaipur and Udaipur at my own pace!",
    rating: 5,
    destination: "Rajasthan Explorer"
  },
  {
    id: 2,
    name: "Sanskriti & Saket, Gurgaon",
    image: "saket&sanskriti.jpg",
    comment: "Thanks to TravelXec, our romantic escape to Coorg was nothing short of perfect, with personalized experiences and breathtaking views!",
    rating: 5,
    destination: "Coorg Getaway"
  },
  {
    id: 3,
    name: "The Deshmukh Family, Pune",
    image: "family.jpg",
    comment: "Our family vacation to Goa was unforgettable, with TravelXec handling every detail to ensure we experienced the best of the royal state!",
    rating: 5,
    destination: "Goa Family Vacation"
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
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Thanks for subscribing!");
        setEmail(""); // Reset input
      } else {
        toast.error(data.error || "Subscription failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
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
  const { isFavorite, toggleFavorite } = useFavorites();




  return (
    <div className="w-full mx-auto py-21">

      {/* Enhanced Hero Section */}
      <section className="relative h-[650px] md:h-[750px] lg:h-[800px] overflow-hidden">

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
            <p className="text-lg md:text-xl mb-8 text-[#FFFFFF] font-League Spartan leading-loose">
              "True Luxury isn't thread count, but the thread that weaves unforgettable stories"
            </p>
            <div className="flex flex-col md:flex-row gap-6"> {/* Increased gap to 6 for consistent spacing */}
              <Link href="/destinations">
                <ExploreButton />
              </Link>
              <ViewPackagesButton />
            </div>

          </div>
        </div>
      </section>







      {/* Featured Packages Section / Curated Experience  */}
      <section className="py-24 bg-gradient-to-br from-[#A6B5B4]/10 via-[#FEFDFB] to-[#D2AF94]/15 px-6 relative overflow-hidden" aria-labelledby="curated-experiences">

        {/* Background Radials */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-[#186663] to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-radial from-[#8C7361] to-transparent rounded-full blur-3xl" />
        </div>

        <div className="w-full mx-auto relative z-10">
          {/* Heading and Link */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6" id="curated-experiences">
            <div className="text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-light text-[#002D37] font-serif tracking-wide leading-tight mb-3">
                Curated
                <span className="block font-extralight text-[#186663] italic">Experiences</span>
              </h2>
              <div className="w-24 h-px bg-gradient-to-r from-[#186663] to-transparent mx-auto md:mx-0" />
            </div>

            {/* Button (Mobile-optimized) */}
            <Link
              href="/packages"
              className="group flex items-center gap-3 text-[#002D37] hover:text-[#186663] font-light text-lg transition-all duration-500 relative mt-6 md:mt-0"
            >
              <span className="relative">
                Discover Collection
                <span className="absolute bottom-0 left-0 w-0 h-px bg-[#186663] transition-all duration-500 group-hover:w-full" />
              </span>
              <div className="w-8 h-8 border border-[#186663] rounded-full flex items-center justify-center transition-all duration-500 group-hover:bg-[#186663] group-hover:scale-110">
                <ArrowRight className="h-4 w-4 transition-all duration-500 group-hover:text-white group-hover:translate-x-0.5" />
              </div>
            </Link>
          </div>

          {/* Search and Filter */}
          <div className="mb-12 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-[#A6B5B4]/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative md:col-span-2">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-[#8C7361]/60" />
                </div>
                <input
                  type="text"
                  placeholder="Search exclusive destinations..."
                  className="w-full pl-16 pr-6 py-4 border-0 rounded-xl bg-[#A6B5B4]/10 backdrop-blur-sm hover:bg-[#A6B5B4]/20 focus:outline-none focus:ring-2 focus:ring-[#186663]/30 focus:bg-white/80 transition-all duration-300 text-[#002D37] placeholder-[#8C7361]/60 font-light text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search destinations"
                />
              </div>

              <select
                className="py-4 px-6 border-0 rounded-xl bg-[#A6B5B4]/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#186663]/30 focus:bg-white/80 text-[#002D37] font-light text-lg transition-all duration-300 appearance-none cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort options"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23186663' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 1.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                }}
              >
                <option value="popularity">Curated Selection</option>
                <option value="duration">By Duration</option>
              </select>
            </div>
          </div>

          {/* Swiper Carousel */}
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            pagination={{
              clickable: true,
              bulletClass: 'swiper-pagination-bullet-custom',
              bulletActiveClass: 'swiper-pagination-bullet-active-custom',
            }}
            spaceBetween={40}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 3 },
            }}
            className="featured-packages-swiper relative"
          >
            {/* Custom Nav Buttons */}
            <div className="swiper-button-prev-custom absolute left-[-60px] top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-md border border-[#A6B5B4]/30 flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-white hover:scale-110 hover:border-[#186663]/50">
              <ArrowRight className="w-5 h-5 text-[#186663] rotate-180" />
            </div>
            <div className="swiper-button-next-custom absolute right-[-60px] top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-md border border-[#A6B5B4]/30 flex items-center justify-center cursor-pointer transition-all duration-300 hover:bg-white hover:scale-110 hover:border-[#186663]/50">
              <ArrowRight className="w-5 h-5 text-[#186663]" />
            </div>

            {/* Slides */}
            {featuredPackages.map((pkg) => (
              <SwiperSlide key={pkg._id}>
                <div className="group bg-white/60 backdrop-blur-md rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 h-full flex flex-col border border-[#A6B5B4]/20 hover:border-[#186663]/30 hover:bg-white/70">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={pkg.images[0]}
                      alt={pkg.name}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                      aria-describedby="package-description"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#002D37]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md text-[#186663] py-2 px-4 rounded-full text-sm font-light z-10 shadow-lg border border-[#A6B5B4]/30 transition-all duration-300 group-hover:bg-white">
                      {pkg.duration}
                    </div>
                  </div>

                  <div className="p-8 flex-1 flex flex-col">
                    <div className="mb-6">
                      <h3 className="text-xl text-[#002D37] mb-3 font-serif font-light leading-tight group-hover:text-[#186663] transition-colors duration-300">
                        {pkg.name}
                      </h3>
                      <div className="flex flex-wrap text-sm text-[#8C7361] gap-4 font-light">
                        {pkg.places.split("-").map((place, index, arr) => (
                          <span key={index} className="flex items-center">
                            {place.trim()}
                            {index < arr.length - 1 && (
                              <ArrowRight className="mx-2 w-3 h-3 text-[#A6B5B4]" />
                            )}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-auto pt-6">
                      <div className="flex flex-col gap-3">
                        <Link
                          href={`/packages/${pkg._id}`}
                          className="w-full text-center bg-gradient-to-r from-[#186663] to-[#002D37] hover:from-[#002D37] hover:to-[#186663] text-white py-4 px-6 rounded-xl font-light text-lg transition-all duration-500 transform hover:translate-y-[-2px] hover:shadow-lg"
                        >
                          Experience Luxury
                        </Link>
                        <button
                          onClick={() => toggleFavorite(pkg._id.toString())}
                          className={`w-full border ${isFavorite(pkg._id.toString()) ? 'border-[#002D37] text-[#002D37]' : 'border-[#8C7361]/40 text-[#8C7361]'} 
      hover:bg-[#D2AF94]/10 hover:border-[#8C7361] hover:text-[#002D37] py-3 px-6 
      rounded-xl font-light transition-all duration-300 flex items-center justify-center gap-2 group/save`}
                        >
                          <Bookmark className={`w-4 h-4 transition-transform duration-300 group-hover/save:scale-110 ${isFavorite(pkg._id.toString()) ? 'fill-[#002D37]' : ''}`} />
                          <span>{isFavorite(pkg._id.toString()) ? 'Wishlisted' : 'Wishlist'}</span>
                        </button>

                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-12 gap-3">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="swiper-pagination-bullet-custom w-2.5 h-2.5 bg-[#A6B5B4]/50 rounded-full cursor-pointer transition-all duration-300 hover:bg-[#186663]/80"
              />
            ))}
          </div>
        </div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#FEFDFB] z-20 pointer-events-none" />

      </section>



      {/* Popular Destinations Section */}
      <section className="relative py-20 px-6 overflow-hidden bg-gradient-to-b from-[#D2AF94]/8 via-white to-[#A6B5B4]/5">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-radial from-[#002D37] to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-gradient-radial from-[#8C7361] to-transparent rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="w-full mx-auto px-4 relative z-20">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-light text-[#002D37] font-serif tracking-wide leading-tight mb-3">
                Popular
                <span className="block font-extralight text-[#186663] italic">Destinations</span>
              </h2>
              <div className="w-28 h-px bg-gradient-to-r from-[#8C7361] to-transparent mx-auto md:mx-0"></div>
            </div>
            <Link
              href="/destinations"
              className="group flex items-center gap-3 text-[#002D37] hover:text-[#186663] font-light text-lg transition-all duration-500 relative"
            >
              <span className="relative">
                Explore All
                <span className="absolute bottom-0 left-0 w-0 h-px bg-[#186663] transition-all duration-500 group-hover:w-full"></span>
              </span>
              <div className="w-8 h-8 border border-[#8C7361] rounded-full flex items-center justify-center transition-all duration-500 group-hover:bg-[#8C7361] group-hover:scale-110">
                <ArrowRight className="h-4 w-4 transition-all duration-500 group-hover:text-white group-hover:translate-x-0.5" />
              </div>
            </Link>
          </div>

          {/* Swiper Slider */}
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            pagination={{
              clickable: true,
              el: '.swiper-pagination', // Ensures pagination is positioned correctly
              type: 'bullets', // Pagination style
            }}
            autoplay={{ delay: 4000 }}
            loop
            className="!px-2"
          >
            {popularPackages.map((pkg) => (
              <SwiperSlide key={pkg._id}>
                <div className="group bg-white/70 backdrop-blur-md rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-700 overflow-hidden border border-[#A6B5B4]/20 hover:border-[#186663]/30 hover:bg-white/85 transform hover:translate-y-[-4px] h-[440px] flex flex-col justify-between">
                  {/* Image Section */}
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={pkg.images[0]}
                      alt={pkg.title}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#002D37]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <button
                      onClick={() => toggleFavorite(pkg._id.toString())}
                      className="absolute top-4 left-4 w-12 h-12 bg-[#A6B5B4]/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-[#A6B5B4]/30 transition-all duration-300 group/heart"
                    >
                      <Heart
                        className={`w-5 h-5 transition-all duration-300 ${isFavorite(pkg._id.toString())
                          ? "text-[#D2AF94] fill-current scale-110"
                          : "text-white group-hover/heart:text-[#D2AF94] group-hover/heart:scale-110"
                          }`}
                      />
                    </button>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-lg font-light text-[#002D37] mb-2 font-serif leading-tight group-hover:text-[#186663] transition-colors duration-300">
                        {pkg.name}
                      </h3>

                      <div className="flex items-center justify-between text-[#002D37] mb-5">
                        <span className="flex items-center gap-2 text-sm text-[#8C7361] font-light">
                          <Clock className="h-4 w-4 text-[#A6B5B4]" />
                          {pkg.duration}
                        </span>
                      </div>

                      {/* Highlights with text truncation */}
                      <p className="flex items-center gap-2 text-[#8C7361] text-sm mb-4 font-light overflow-hidden text-ellipsis whitespace-nowrap">
                        <MapPin className="h-4 w-4 text-[#186663]" />
                        {pkg.highlights[0]}
                      </p>
                    </div>

                    <Link
                      href={`/destinations`}
                      className="block w-full text-center bg-gradient-to-r from-[#186663] to-[#002D37] hover:from-[#002D37] hover:to-[#186663] text-white text-sm py-3 px-4 rounded-xl font-light transition-all duration-500 transform hover:translate-y-[-1px] hover:shadow-lg mt-auto"
                    >
                      Discover Details
                    </Link>
                  </div>

                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Pagination Container */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center z-30 swiper-pagination"></div>

        <style jsx>{`
    .bg-gradient-radial {
      background: radial-gradient(circle, var(--tw-gradient-from), var(--tw-gradient-to));
    }

    .swiper-pagination {
      position: absolute;
      bottom: 20px;
      left: 0;
      right: 0;
      z-index: 10;  // Ensure pagination is above the other elements
    }
  `}</style>
      </section>



      {/* Why Choose Us Section */}
      <section
        className="py-20"
        style={{
          background: "linear-gradient(to bottom, #002D37, #186663)",
          minHeight: "80vh"
        }}
        aria-labelledby="why-travel-with-title"
      >
        <div className="w-full mx-auto px-6 sm:px-8 text-center" aria-describedby="why-travel-with-description">
          <h2
            id="why-travel-with-title"
            className="text-4xl md:text-5xl font-light text-white font-serif tracking-wide leading-tight mb-4"
          >
            Why Travel With
            <br />
            <span
              className="text-4xl font-bold text-[#d2af94] mb-2"
              style={{
                fontFamily: 'League Spartan, sans-serif',
                letterSpacing: '-1.5px',  // Reduce letter spacing
                lineHeight: '1.0',        // Adjust line height to make the lines tighter
              }}
            >
              travelxec
            </span>
          </h2>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#D2AF94] to-transparent mx-auto mb-4"></div>
          <p
            id="why-travel-with-description"
            className="text-[#A6B5B4] font-light text-lg max-w-2xl mx-auto playfair"
          >
            Discover the extraordinary through the eyes of our discerning travelers
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-10 playfair">
            {[
              {
                icon: <Award className="h-8 w-8 stroke-[#002D37]" />,
                title: "Curated Destinations",
                description:
                  "We don’t just pick places — we handcraft journeys to India’s most coveted gems, offering privileged access to destinations that remain untouched by mass tourism"
              },
              {
                icon: <Castle className="h-8 w-8 text-[#002D37]" />,
                title: "Exceptional Stays",
                description:
                  "From royal palaces and boutique heritage retreats to ultra-luxury eco-resorts, every accommodation is meticulously selected for its charm, comfort, and distinction"
              },
              {
                icon: <Star className="h-8 w-8 text-[#002D37]" />,
                title: "Luxury with Purpose",
                description:
                  "We believe true luxury respects the planet. Our journeys uplift local artisans, preserve cultural legacies, and minimize environmental impact — all while delivering a seamless, world-class experience"
              }
            ].map((item, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] bg-white/10 backdrop-blur-lg border border-white/20"
              >
                <div className="inline-block p-4 bg-blue-100 rounded-full text-blue-600 mb-4 shadow-md">
                  {item.icon}
                </div>
                <h3 className="text-xl text-[#D2AF94] font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-200 font-playfair">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Testimonials Section */}
      <section
        className="py-24 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #8C7361 0%, #002D37 50%, #186663 100%)",
          minHeight: "60vh"
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D2AF94] to-transparent"></div>
        {/* Artistic Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-[#D2AF94] to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-radial from-[#A6B5B4] to-transparent rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-radial from-white/5 to-transparent rounded-full blur-xl"></div>
        </div>

        {/* Elegant Overlay Pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-transparent"></div>

        <div className="w-full mx-auto px-6 relative z-10">
          {/* Premium Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-[#D2AF94] font-serif tracking-wide leading-tight mb-4">
              Voices of
              <span className="block font-extralight text-white/90 italic">Wanderlust</span>
            </h2>
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#D2AF94] to-transparent mx-auto mb-4"></div>
            <p className="text-[#A6B5B4] font-light text-lg max-w-2xl mx-auto">
              Discover the extraordinary through the eyes of our discerning travelers
            </p>
          </div>

          {/* Luxury Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="group bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 border border-white/20 hover:border-[#D2AF94]/40 hover:bg-white/15 transform hover:translate-y-[-8px]"
              >
                {/* Profile Section */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-[#D2AF94]/30 transition-all duration-500 group-hover:ring-[#D2AF94]/60 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#D2AF94]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-light text-white text-lg mb-1 group-hover:text-[#D2AF94] transition-colors duration-300">
                      {testimonial.name}
                    </h3>
                    <p className="text-[#A6B5B4] text-sm font-light flex items-center gap-2">
                      <span className="w-1 h-1 bg-[#8C7361] rounded-full"></span>
                      {testimonial.destination}
                    </p>
                  </div>
                </div>

                {/* Quote Content */}
                <div className="mb-6 relative">
                  <div className="absolute -top-2 -left-2 text-4xl text-[#D2AF94]/30 font-serif">"</div>
                  <p className="text-white/90 text-base leading-relaxed font-light pl-6 italic">
                    {testimonial.comment}
                  </p>
                  <div className="absolute -bottom-2 -right-2 text-4xl text-[#D2AF94]/30 font-serif rotate-180">"</div>
                </div>

                {/* Premium Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-[#D2AF94] fill-current transition-all duration-300 group-hover:scale-110"
                        style={{ animationDelay: `${i * 100}ms` }}
                      />
                    ))}
                  </div>
                  <div className="w-8 h-px bg-gradient-to-r from-[#8C7361] to-transparent opacity-60"></div>
                </div>

                {/* Elegant Corner Accent */}
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#D2AF94]/20 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#D2AF94]/20 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>

        <style jsx>{`
    .bg-gradient-radial {
      background: radial-gradient(circle, var(--tw-gradient-from), var(--tw-gradient-to));
    }
    .shadow-3xl {
      box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
    }
    @keyframes shimmer {
      0% { opacity: 0.5; }
      50% { opacity: 1; }
      100% { opacity: 0.5; }
    }
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `}</style>
      </section>

      {/* Enhanced Newsletter Section */}
      <section className="relative py-32 overflow-hidden flex items-center">
        {/* Background Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#002D37] via-[#003A47] to-[#002D37]"></div>

        <div
          className="absolute inset-0 transform -skew-y-3 origin-top-left"
          style={{
            background: `linear-gradient(135deg, 
            #002D37 0%, 
            rgba(24, 102, 99, 0.3) 25%, 
            rgba(166, 181, 180, 0.2) 50%, 
            rgba(24, 102, 99, 0.3) 75%, 
            #002D37 100%)`,
          }}
        ></div>

        {/* Animated SVG Background */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
            <defs>
              <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#186663" stopOpacity="0.3">
                  <animate attributeName="stop-opacity" values="0.1;0.5;0.1" dur="4s" repeatCount="indefinite" />
                </stop>
                <stop offset="50%" stopColor="#A6B5B4" stopOpacity="0.2">
                  <animate attributeName="stop-opacity" values="0.2;0.6;0.2" dur="3s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="#D2AF94" stopOpacity="0.1">
                  <animate attributeName="stop-opacity" values="0.1;0.4;0.1" dur="5s" repeatCount="indefinite" />
                </stop>
              </linearGradient>
              <linearGradient id="lineGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#8C7361" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#186663" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            <path
              d="M0,200 Q250,100 500,200 T1000,200"
              stroke="url(#lineGradient1)"
              strokeWidth="2"
              fill="none"
              opacity="0.6"
            >
              <animate attributeName="d" values="M0,200 Q250,100 500,200 T1000,200;M0,250 Q250,150 500,250 T1000,250;M0,200 Q250,100 500,200 T1000,200" dur="8s" repeatCount="indefinite" />
            </path>

            <path
              d="M0,400 Q500,300 1000,400"
              stroke="url(#lineGradient2)"
              strokeWidth="1.5"
              fill="none"
              opacity="0.4"
            >
              <animate attributeName="d" values="M0,400 Q500,300 1000,400;M0,450 Q500,350 1000,450;M0,400 Q500,300 1000,400" dur="6s" repeatCount="indefinite" />
            </path>

            <path
              d="M0,600 Q250,500 500,600 T1000,600"
              stroke="url(#lineGradient1)"
              strokeWidth="1"
              fill="none"
              opacity="0.3"
            >
              <animate attributeName="d" values="M0,600 Q250,500 500,600 T1000,600;M0,650 Q250,550 500,650 T1000,650;M0,600 Q250,500 500,600 T1000,600" dur="10s" repeatCount="indefinite" />
            </path>

            {/* Particles */}
            <circle cx="100" cy="300" r="2" fill="#D2AF94" opacity="0.6">
              <animate attributeName="cy" values="300;100;300" dur="12s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.2;0.8;0.2" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle cx="800" cy="500" r="1.5" fill="#A6B5B4" opacity="0.5">
              <animate attributeName="cy" values="500;200;500" dur="15s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.1;0.7;0.1" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="300" cy="700" r="1" fill="#186663" opacity="0.4">
              <animate attributeName="cy" values="700;400;700" dur="18s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0.9;0.3" dur="5s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        {/* Floating orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 rounded-full bg-gradient-to-br from-[#D2AF94]/20 to-[#8C7361]/10 blur-3xl animate-pulse" style={{ top: "10%", left: "10%" }}></div>
          <div className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-[#186663]/30 to-[#A6B5B4]/20 blur-2xl animate-pulse" style={{ top: "60%", right: "15%" }}></div>
          <div className="absolute w-80 h-80 rounded-full bg-gradient-to-br from-[#A6B5B4]/15 to-[#D2AF94]/25 blur-3xl animate-pulse" style={{ bottom: "20%", left: "70%" }}></div>
        </div>

        {/* Frame borders */}
        <div className="absolute inset-8 border border-[#D2AF94]/30 rounded-3xl pointer-events-none">
          <div className="absolute inset-4 border border-[#A6B5B4]/20 rounded-2xl">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-[#D2AF94] to-transparent"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-[#D2AF94] to-transparent"></div>
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-1 h-16 bg-gradient-to-b from-transparent via-[#D2AF94] to-transparent"></div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-1 h-16 bg-gradient-to-b from-transparent via-[#D2AF94] to-transparent"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative w-full mx-auto px-8 z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-block mb-8">
              <div className="relative px-8 py-3 bg-gradient-to-r from-[#D2AF94]/20 to-[#8C7361]/20 rounded-full border border-[#D2AF94]/40 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-[#D2AF94]/10 to-[#A6B5B4]/10 rounded-full animate-pulse"></div>
                <span className="relative text-[#D2AF94] font-medium tracking-widest text-sm uppercase">
                  Exclusive Collection
                </span>
              </div>
            </div>

            {/* Heading */}
            <h2 className="text-6xl md:text-7xl font-light mb-8 text-white relative leading-tight playfair font-sans">
              <span className="bg-gradient-to-r from-white via-[#A6B5B4] to-white bg-clip-text text-transparent">
                Get Exclusive
              </span>
              <br />
              <span className="font-extralight text-5xl md:text-6xl bg-gradient-to-r from-[#D2AF94] via-[#A6B5B4] to-[#D2AF94] bg-clip-text text-transparent">
                Travel Updates
              </span>
              <div className="absolute -top-4 -right-4 w-2 h-2 bg-[#D2AF94] rounded-full animate-ping"></div>
              <div className="absolute top-1/2 -left-8 w-1 h-1 bg-[#A6B5B4] rounded-full animate-pulse"></div>
            </h2>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl mb-12 font-light leading-relaxed max-w-3xl mx-auto text-blue-100 playfair font-sans">
              <span className="text-[#A6B5B4]">Subscribe to our newsletter and </span>
              <span className="text-[#D2AF94] font-medium">embark on a journey</span>
              <span className="text-[#A6B5B4]"> of discovery with </span>
              <span className="text-4xl font-bold text-[#d2af94] text-center mb-2"
                style={{
                  fontFamily: 'League Spartan, sans-serif',
                  letterSpacing: '-1.5px',  // Reduce letter spacing
                  lineHeight: '1.0',        // Adjust line height to make the lines tighter
                }}>travelxec</span>

            </p>

            {/* Form */}
            <form onSubmit={handleSubscribe} className="relative max-w-2xl mx-auto group">
              <div className="relative max-w-2xl mx-auto group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#186663]/20 via-[#A6B5B4]/30 to-[#D2AF94]/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative bg-gradient-to-r from-[#002D37]/80 via-[#186663]/20 to-[#002D37]/80 backdrop-blur-lg border border-[#A6B5B4]/30 rounded-2xl p-8 shadow-2xl">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="relative flex-grow w-full md:w-auto">
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        className="w-full px-8 py-5 bg-white/10 backdrop-blur-sm border border-[#A6B5B4]/40 rounded-xl text-white placeholder-[#A6B5B4]/70 text-lg font-light transition-all duration-300 focus:border-[#D2AF94] focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-[#D2AF94]/50"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={subscribing}
                      className="relative group px-10 py-5 bg-gradient-to-r from-[#D2AF94] to-[#8C7361] text-[#002D37] rounded-xl font-medium text-lg transition-all duration-300 hover:from-[#8C7361] hover:to-[#D2AF94] hover:shadow-2xl hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      <span className="relative z-10 flex items-center justify-center space-x-2">
                        {subscribing ? (
                          <>
                            <div className="w-5 h-5 border-2 border-[#002D37]/30 border-t-[#002D37] rounded-full animate-spin"></div>
                            <span>Subscribing...</span>
                          </>
                        ) : (
                          <>
                            <span>Subscribe Now</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </>
                        )}
                      </span>
                    </button>
                  </div>

                  <p className="mt-6 text-sm text-blue-100 font-light leading-relaxed">
                    By subscribing, you agree to receive our marketing emails.
                    <br />
                    <span className="text-[#D2AF94]/90">You can unsubscribe at any time.</span>
                  </p>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-16 flex justify-center items-center space-x-12 opacity-60">
                <div className="flex items-center space-x-2 text-[#A6B5B4]">
                  <div className="w-2 h-2 bg-[#D2AF94] rounded-full animate-pulse"></div>
                  <span className="text-sm font-light">Premium Content</span>
                </div>
                <div className="flex items-center space-x-2 text-[#A6B5B4]">
                  <div className="w-2 h-2 bg-[#186663] rounded-full animate-pulse"></div>
                  <span className="text-sm font-light">Weekly Updates</span>
                </div>
                <div className="flex items-center space-x-2 text-[#A6B5B4]">
                  <div className="w-2 h-2 bg-[#8C7361] rounded-full animate-pulse"></div>
                  <span className="text-sm font-light">Exclusive Access</span>
                </div>
              </div>
            </form>
          </div>
          {/* End of .relative w-full mx-auto px-8 z-10 */}
        </div>
        {/* Corner decorations */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-[#D2AF94]/40 rounded-tl-lg"></div>
        <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-[#D2AF94]/40 rounded-tr-lg"></div>
        <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-[#D2AF94]/40 rounded-bl-lg"></div>
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-[#D2AF94]/40 rounded-br-lg"></div>

      </section>
    </div>

  );
};

export default TravelContent;
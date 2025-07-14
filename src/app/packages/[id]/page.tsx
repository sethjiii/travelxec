"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { CalendarArrowDown, CalendarArrowUp, Check, CheckCircle, ListCheck, ListXIcon, Rocket, Sparkles, Star, User, X } from "lucide-react";
import Footer from "@/app/components/FooterContent";
import { useFavorites } from "@/hooks/useFavorites";


// Interfaces remain the same as your original code
type Availability = {
  startDate: string;
  endDate: string;
};



interface Activity {
  name: string;
  time: string;
  additionalDetails: string;
}

interface ItineraryItem {
  day: number;
  title: string;
  description: string;
  stay: string;
  activities: Activity[];
}

interface Review {
  username: string;
  rating: number;
  review: string;
  createdAt: string;
}

type NewReview = {
  rating: number;
  review: string;
};


interface Comment {
  username: string;
  comment: string;
  createdAt: string;
}

interface TravelPackage {
  _id: string;
  name: string;
  description: string;
  duration: string;
  highlights: string[];
  itinerary: ItineraryItem[];
  images: string[];
  rating: number;
  reviews: Review[];
  comments: Comment[];
  likes: number;
  isLiked: boolean;
  index: number;
  item: string;
  exclusions: string[];
  inclusions: string[];
  availability: Availability;
}


const TravelPackageDisplay = () => {
  const params = useParams();
  const id = params?.id as string;

  const [packageData, setPackageData] = useState<TravelPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [newReview, setNewReview] = useState({ rating: 0, review: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const { isFavorite, toggleFavorite } = useFavorites();
  const router = useRouter()
  useEffect(() => {
    const fetchPackageData = async () => {
      if (!id) return;
      try {
        const response = await fetch(`/api/packages/${id}`);
        const data = await response.json();
        setPackageData(data);
      } catch (error) {
        console.error("Error fetching travel package data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackageData();
  }, [id]);

  const handleBookNow = () => {
    router.push(`/confirmation/${id}`); // Redirect to confirmation page
  };


  const handleLike = async () => {
    if (!packageData) return;
    try {
      const response = await fetch(`/api/packages/${id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        setPackageData(prev => prev ? {
          ...prev,
          likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
          isLiked: !prev.isLiked
        } : null);
      }
    } catch (error) {
      console.error("Error liking package:", error);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim() || !packageData) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/packages/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: newComment }),
      });
      if (response.ok) {
        const newCommentData = await response.json();
        setPackageData(prev => prev ? {
          ...prev,
          comments: [...prev.comments, newCommentData]
        } : null);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (packageData) {
      setVisibleReviews(packageData.reviews.slice(0, 5));
    }
  }, [packageData]);

  const handleReview = async () => {
    if (!newReview.review.trim() || !newReview.rating || !packageData) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/packages/${id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });
      if (response.ok) {
        const newReviewData = await response.json();
        setPackageData(prev => prev ? {
          ...prev,
          reviews: [...prev.reviews, newReviewData],
          rating: (prev.rating * prev.reviews.length + newReview.rating) / (prev.reviews.length + 1)
        } : null);
        setNewReview({ rating: 0, review: "" });
      }
    } catch (error) {
      console.error("Error posting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        Package not found
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 mx-auto">

      <div className="relative w-full min-h-[80vh] pt-24 overflow-hidden bg-black top-22">
        {/* Background Image */}
        <Image
          src={packageData.images[0] || "/placeholder.jpg"}
          alt={packageData.name}
          className="absolute inset-0 w-full h-full object-cover brightness-90"
          width={1920}
          height={1080}
          priority
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/80 to-transparent z-10" />

        {/* Main Content */}
        <div className="relative z-20 flex flex-col justify-center items-center text-center px-6 sm:px-10 max-w-4xl mx-auto">
          <h1 className="text-white drop-shadow-lg leading-tight font-milchella text-4xl sm:text-6xl md:text-7xl lg:text-8xl py-4 sm:py-6 md:py-8 lg:py-10 tracking-loose">
            {packageData.name}
          </h1>

          {/* Description (Truncated) */}
          <p className="mt-6 text-base sm:text-lg text-white/90 leading-relaxed font-medium drop-shadow-sm playfair line-clamp-3">
            {packageData.description}
          </p>

          {/* Duration Badge */}
           <div className="mt-6 px-5 py-2 bg-[#186663]/50 text-white rounded-full shadow-md backdrop-blur-md text-sm border border-white/10 flex items-center gap-2 playfair text-3xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            {packageData.duration}
          </div>
        </div>


        {/* Footer Bar */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-2xl z-30 bg-[#002D37]/80 backdrop-blur-lg px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:justify-between items-center text-white rounded-xl shadow-lg md:shadow-xl gap-4 sm:gap-0">
          {/* Rating and Review */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-semibold flex items-center gap-1">
                <Star className="text-[#D2AF94]" size={20} />
                {(packageData.rating || 0).toFixed(1)}
              </span>
              <span className="text-lg sm:text-xl font-semibold flex items-center gap-1">
                <User size={20} className="text-[#D2AF94]" />
                {packageData.reviews.length}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 sm:gap-4">
            <button
              onClick={() => toggleFavorite(packageData._id)}
              className="bg-transparent border border-[#D2AF94] text-[#D2AF94] hover:bg-[#8C7361] hover:text-white px-5 py-2.5 rounded-md font-medium text-sm sm:text-base shadow-md transition-all duration-200 transform hover:scale-105"
            >
              {isFavorite(packageData._id) ? "Wishlisted ❤️" : "Add to Wishlist"}
            </button>
            <button
              onClick={handleBookNow}
              className="bg-[#D2AF94] text-[#002D37] hover:bg-[#8C7361] hover:text-white px-5 py-2.5 rounded-md font-medium text-sm sm:text-base shadow-md transition-all duration-200 transform hover:scale-105"
            >
              Book Now
            </button>
          </div>
        </div>





      </div>


      {/* Tabs Navigation */}
      <div className="py-8 border-b border-[#D2AF94]/20 bg-[#fdfaf6] backdrop-blur-lg shadow-sm">
        <nav className="flex flex-wrap justify-center gap-6 sm:gap-12">
          {["overview", "itinerary", "gallery", "reviews"].map((Tab) => (
            <button
              key={Tab}
              onClick={() => setActiveTab(Tab)}
              className={`relative text-sm sm:text-base tracking-widest uppercase font-light playfair transition-all duration-300 pb-2
        ${activeTab === Tab ? "text-[#8C7361]" : "text-gray-500 hover:text-[#8C7361]"}`}
            >
              {Tab}

              {/* Animated underline */}
              <span
                className={`absolute left-1/2 -bottom-1 h-[1.5px] bg-[#D2AF94] transition-all duration-300 ease-in-out
          ${activeTab === Tab ? "w-full -translate-x-1/2" : "w-0 -translate-x-1/2"}`}
              />
            </button>
          ))}
        </nav>
      </div>


      {/* Tab Content */}
      {activeTab === "overview" && (
        <div
          className="relative rounded-3xl border border-gray-200/50 p-6 sm:p-10 mt-8 overflow-hidden shadow-xl"
          style={{
            backgroundImage: "url('/decor/map-texture-beige.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Optional overlay for better text contrast */}
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-0"></div>

          {/* Actual Content */}
          <div className="relative z-10 grid md:grid-cols-2 gap-10 items-start animate-fadeIn">

            {/* Highlights */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-[#8C7361]">
                <Sparkles className="w-6 h-6" />
                <h2 className="text-2xl playfair font-semibold tracking-wide uppercase text-[#8C7361]">
                  Highlights
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {packageData.highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 bg-white/70 border border-[#D2AF94]/40 backdrop-blur-md rounded-2xl px-6 py-4 shadow-md hover:shadow-[0_0_20px_rgba(210,175,148,0.3)] transition-all duration-300 hover:scale-[1.015]"
                  >
                    <Rocket className="w-5 h-5 text-[#D2AF94]" />
                    <span className="text-[#002D37] text-[15px] tracking-wider font-light leading-relaxed playfair">
                      {highlight}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="space-y-10">

              {/* What's Included */}
              <div>
                <div className="flex items-center gap-2 text-[#186663]">
                  <ListCheck className="w-5 h-5 stroke-[#186663]" />
                  <h2 className="text-lg sm:text-xl font-semibold tracking-wide text-[#8C7361] uppercase playfair">
                    What's Included
                  </h2>
                </div>
                <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {packageData.inclusions.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#f8f6f3] text-[#002D37] tracking-wide text-sm playfair border border-[#D2AF94]/20 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="#186663" viewBox="0 0 24 24" className="w-5 h-5">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          stroke="#186663"
                          d="M9 12.75 11.25 15 15 9.75"
                        />
                        <circle cx="12" cy="12" r="9" stroke="#186663" strokeWidth="1.5" fill="none" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* What's Not Included */}
              <div>
                <div className="flex items-center gap-2 text-[#8C7361]">
                  <ListXIcon className="w-5 h-5" />
                  <h2 className="text-lg sm:text-xl font-semibold tracking-wide text-[#8C7361] uppercase playfair">
                    What's Not Included
                  </h2>
                </div>
                <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {packageData.exclusions.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#fcf8f4] text-[#333] tracking-wide text-sm playfair border border-[#D2AF94]/20 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="#8C7361" viewBox="0 0 24 24" className="w-5 h-5">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          stroke="#8C7361"
                          d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5"
                        />
                        <circle cx="12" cy="12" r="9" stroke="#8C7361" strokeWidth="1.5" fill="none" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* Itinerary Tab */}
      <div>
        {activeTab === "itinerary" && (
          <div className="relative px-6 sm:px-10 md:px-12 py-14 md:py-20 rounded-[2rem] border border-[#D2AF94]/20 bg-gradient-to-br from-[#fcfbf9] via-white to-[#f9f7f4] shadow-2xl backdrop-blur-sm overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#D2AF94]/5 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#186663]/3 to-transparent rounded-full translate-y-40 -translate-x-40"></div>

            {/* Header */}
            <div className="relative z-10 text-center mb-20">
              <div className="inline-block px-8 py-3 bg-gradient-to-r from-[#D2AF94]/10 to-[#8C7361]/10 rounded-full border border-[#D2AF94]/20 mb-4">
                <span className="text-sm font-medium text-[#8C7361] tracking-[0.2em] uppercase">Curated Experience</span>
              </div>
              <h2 className="text-4xl md:text-5xl playfair font-light tracking-wide text-[#002D37] mb-3">
                Journey <span className="italic font-normal text-[#186663]">Timeline</span>
              </h2>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D2AF94] to-transparent mx-auto"></div>
            </div>

            {/* Timeline */}
            {/* Timeline */}
            <div className="relative z-10 max-w-6xl mx-auto space-y-24 px-4 sm:px-6 lg:px-8">
              {packageData.itinerary.map((day, index) => (
                <div key={index} className="relative group">

                  {/* Vertical Line */}
                  <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#D2AF94]/40 via-[#A6B5B4]/30 to-[#D2AF94]/40"></div>

                  {/* Timeline Dot */}
                  <div className="absolute left-[7px] sm:left-4 top-8 w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#D2AF94] to-[#8C7361] ring-4 sm:ring-8 ring-white/80 shadow-xl border border-white/60 backdrop-blur-sm group-hover:scale-110 transition-transform duration-500"></div>

                  {/* Day Card */}
                  <div className="mt-10 sm:mt-0 ml-10 sm:ml-24 bg-white/90 backdrop-blur-xl rounded-3xl border border-[#D2AF94]/15 shadow-xl hover:shadow-2xl transition-all duration-700 overflow-hidden group-hover:-translate-y-2">

                    {/* Accent Bar */}
                    <div className="h-1.5 bg-gradient-to-r from-[#186663] via-[#A6B5B4] to-[#D2AF94]"></div>

                    <div className="px-5 sm:px-6 md:px-10 py-8 sm:py-10 md:py-12">

                      {/* Header Section */}
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-6 sm:gap-8 mb-8">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="text-xl sm:text-2xl text-[#A6B5B4] playfair">Day</span>
                            <span className="text-3xl sm:text-4xl font-semibold text-[#002D37] playfair">{day.day}</span>
                          </div>
                          <h3 className="text-xl sm:text-2xl md:text-3xl playfair font-light text-[#002D37] tracking-wide leading-tight">
                            {day.title}
                          </h3>
                        </div>

                        <div className="flex flex-col items-start sm:items-end gap-2">
                          <span className="px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-[#186663] to-[#002D37] text-white rounded-full text-xs sm:text-sm font-medium tracking-[0.15em] uppercase shadow-md">
                            {day.stay}
                          </span>
                          <div className="text-xs text-[#A6B5B4] tracking-wider uppercase">Accommodation</div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mb-8">
                        <p className="text-[#4a4a4a] text-sm sm:text-base md:text-lg leading-relaxed font-light tracking-wide">
                          {day.description}
                        </p>
                      </div>

                      {/* Activities */}
                      <div className="space-y-6">
                        {day.activities.map((activity, actIndex) => (
                          <div
                            key={actIndex}
                            className="group/activity relative bg-gradient-to-br from-[#fcfbf9] to-[#f8f6f3] rounded-2xl border border-[#D2AF94]/15 shadow-sm hover:shadow-md transition-all duration-500 overflow-hidden hover:-translate-y-1"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#D2AF94]/3 to-transparent opacity-0 group-hover/activity:opacity-100 transition-opacity duration-500"></div>

                            <div className="relative p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-start gap-4">

                              {/* Time Badge */}
                              <div className="flex-shrink-0">
                                <div className="relative">
                                  <div className="w-20 h-12 sm:w-24 sm:h-14 bg-gradient-to-br from-[#186663] to-[#002D37] rounded-xl shadow-md flex flex-col items-center justify-center text-white text-center px-2 py-1 transform group-hover/activity:scale-105 transition-transform duration-300">
                                    <span className="text-[10px] sm:text-xs font-semibold leading-snug break-words">
                                      {activity.time === "arrival" ? "As per\nArrival" : activity.time.split(':')[0]}
                                    </span>
                                    {activity.time !== "arrival" && (
                                      <span className="text-[10px] opacity-80">
                                        :{activity.time.split(':')[1]}
                                      </span>
                                    )}
                                  </div>
                                  <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#D2AF94] rounded-full"></div>
                                </div>
                              </div>

                              {/* Activity Content */}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm sm:text-base md:text-lg font-semibold text-[#002D37] tracking-wide mb-1 group-hover/activity:text-[#186663] transition-colors duration-300">
                                  {activity.name}
                                </h4>
                                {activity.additionalDetails && (
                                  <p className="text-sm text-[#555] font-light tracking-wide leading-relaxed opacity-80">
                                    {activity.additionalDetails}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {activeTab === "gallery" && (
          <div className="relative p-12 bg-gradient-to-br from-[#fcfbf9] via-white to-[#f9f7f4] overflow-hidden">
            {/* Elegant background decoration */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-[#186663]/3 to-transparent rounded-full -translate-y-60 -translate-x-60"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-[#D2AF94]/4 to-transparent rounded-full translate-y-40 translate-x-40"></div>

            {/* Premium Header */}
            <div className="relative z-10 text-center mb-16">
              <div className="inline-block px-8 py-3 bg-gradient-to-r from-[#D2AF94]/10 to-[#8C7361]/10 rounded-full border border-[#D2AF94]/20 mb-6">
                <span className="text-sm font-medium text-[#8C7361] tracking-[0.2em] uppercase">Visual Journey</span>
              </div>
              <h2 className="text-5xl md:text-6xl playfair font-light tracking-[0.05em] text-[#002D37] mb-4">
                Captured <span className="italic font-normal text-[#186663]">Moments</span>
              </h2>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D2AF94] to-transparent mx-auto mb-4"></div>
              <p className="text-[#A6B5B4] text-lg font-light tracking-wide max-w-2xl mx-auto">
                Immerse yourself in the breathtaking beauty and unforgettable experiences that await
              </p>
            </div>

            {/* Luxury Gallery Grid */}
            <div className="relative z-10 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {packageData.images.map((image, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-3xl bg-white shadow-2xl hover:shadow-3xl transition-all duration-700 transform hover:-translate-y-3"
                  >
                    {/* Premium Frame */}
                    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border-4 border-white/50 backdrop-blur-sm">
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#002D37]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>

                      {/* Luxury Corner Accents */}
                      <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-[#D2AF94] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>
                      <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-[#D2AF94] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>
                      <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-[#D2AF94] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>
                      <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-[#D2AF94] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20"></div>

                      {/* Premium Image */}
                      <Image
                        src={image}
                        alt={`${packageData.name} - Luxury Experience ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        fill
                      />

                      {/* Elegant Hover Content */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-30">
                        <div className="bg-white/90 backdrop-blur-md rounded-2xl px-6 py-4 shadow-xl border border-[#A6B5B4]ransform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-[#186663] to-[#002D37] rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </div>
                            <span className="text-[#002D37] font-medium tracking-wide">View Experience</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Premium Shadow Enhancement */}
                    <div className="absolute inset-0 rounded-3xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                    {/* Luxury Bottom Accent */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-12 h-1 bg-gradient-to-r from-[#186663] to-[#D2AF94] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Gallery Stats */}
            <div className="relative z-10 mt-20 flex justify-center">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-[#D2AF94]/15 shadow-2xl px-12 py-6">
                <div className="flex items-center gap-12">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#002D37] playfair mb-1">
                      {packageData.images.length}
                    </div>
                    <div className="text-sm text-[#A6B5B4] tracking-wider uppercase">
                      Curated Moments
                    </div>
                  </div>

                  <div className="w-px h-12 bg-[#D2AF94]/30"></div>

                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#186663] playfair mb-1">
                      4K
                    </div>
                    <div className="text-sm text-[#A6B5B4] tracking-wider uppercase">
                      Ultra HD Quality
                    </div>
                  </div>

                  <div className="w-px h-12 bg-[#D2AF94]/30"></div>

                  <div className="text-center">
                    <div className="flex items-center gap-1 justify-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-[#D2AF94] fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <div className="text-sm text-[#A6B5B4] tracking-wider uppercase">
                      Premium Collection
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Review Form */}
        {activeTab === "reviews" && (
          <div className="relative space-y-12 p-12 bg-gradient-to-br from-[#fcfbf9] via-white to-[#f9f7f4] rounded-[2rem] overflow-hidden">
            {/* Elegant background decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#D2AF94]/4 to-transparent rounded-full -translate-y-60 translate-x-60"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#186663]/3 to-transparent rounded-full translate-y-40 -translate-x-40"></div>

            {/* Premium Rating Section */}
            <div className="relative z-10 bg-white/90 backdrop-blur-xl rounded-3xl border border-[#D2AF94]/15 shadow-2xl overflow-hidden">
              {/* Luxury Header Accent */}
              <div className="h-2 bg-gradient-to-r from-[#186663] via-[#A6B5B4] to-[#D2AF94]"></div>

              <div className="p-10 md:p-12">
                {/* Premium Header */}
                <div className="text-center mb-10">
                  <div className="inline-block px-6 py-2 bg-gradient-to-r from-[#D2AF94]/10 to-[#8C7361]/10 rounded-full border border-[#D2AF94]/20 mb-4">
                    <span className="text-sm font-medium text-[#8C7361] tracking-[0.2em] uppercase">Share Your Experience</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl playfair font-light tracking-[0.05em] text-[#002D37] mb-3">
                    Rate This <span className="italic font-normal text-[#186663]">Journey</span>
                  </h2>
                  <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#D2AF94] to-transparent mx-auto"></div>
                </div>

                {/* Luxury Star Rating */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-[#A6B5B4] font-light tracking-wide">Your Rating</p>
                    <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-[#fcfbf9] to-white rounded-2xl border border-[#D2AF94]/10 shadow-lg">
                      {[1, 2, 3, 4, 5].map((star: number) => (
                        <button
                          key={star}
                          onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                          className={`text-4xl transition-all duration-300 transform hover:scale-110 ${star <= newReview.rating
                            ? "text-[#D2AF94] drop-shadow-lg"
                            : "text-[#A6B5B4]/30 hover:text-[#A6B5B4]/60"
                            }`}
                          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    {newReview.rating > 0 && (
                      <div className="text-center">
                        <p className="text-2xl font-light text-[#002D37] playfair">
                          {newReview.rating === 5 ? "Exceptional" :
                            newReview.rating === 4 ? "Excellent" :
                              newReview.rating === 3 ? "Very Good" :
                                newReview.rating === 2 ? "Good" : "Fair"}
                        </p>
                        <div className="flex items-center gap-1 justify-center mt-1">
                          {[...Array(newReview.rating)].map((_, i) => (
                            <div key={i} className="w-2 h-2 bg-[#D2AF94] rounded-full"></div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Premium Submit Button */}
                  <div className="flex flex-col items-center gap-4">
                    <button
                      onClick={handleReview}
                      disabled={isSubmitting || !newReview.rating}
                      className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-[#186663] to-[#002D37] text-white font-medium rounded-2xl shadow-xl hover:shadow-2xl disabled:from-[#A6B5B4] disabled:to-[#A6B5B4] disabled:cursor-not-allowed transition-all duration-500 transform hover:scale-105 disabled:hover:scale-100"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center gap-3">
                        <CheckCircle className="w-5 h-5" />
                        <span className="tracking-wide">
                          {isSubmitting ? "Submitting..." : "Submit Review"}
                        </span>
                      </div>
                    </button>
                    <p className="text-xs text-[#A6B5B4] tracking-wider uppercase">Secure & Private</p>
                  </div>
                </div>

                {/* Luxury Textarea */}
                <div className="relative">
                  <label className="block text-[#8C7361] font-medium tracking-wide mb-3">
                    Share Your Thoughts <span className="text-[#A6B5B4] font-light">(Optional)</span>
                  </label>
                  <div className="relative">
                    <textarea
                      value={newReview.review}
                      onChange={(e) =>
                        setNewReview(prev => ({ ...prev, review: e.target.value }))
                      }
                      placeholder="Tell us about your luxury travel experience..."
                      className="w-full p-6 bg-gradient-to-br from-[#fcfbf9] to-white border-2 border-[#D2AF94]/20 rounded-2xl focus:ring-4 focus:ring-[#D2AF94]/10 focus:border-[#D2AF94] font-light tracking-wide text-[#002D37] placeholder:text-[#A6B5B4] resize-none shadow-inner transition-all duration-300"
                      rows={4}
                    />
                    <div className="absolute bottom-4 right-4 text-xs text-[#A6B5B4] tracking-wider">
                      {newReview.review.length}/500
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Reviews Section */}
            <div className="relative z-10 bg-white/90 backdrop-blur-xl rounded-3xl border border-[#D2AF94]/15 shadow-2xl overflow-hidden">
              {/* Luxury Header Accent */}
              <div className="h-2 bg-gradient-to-r from-[#D2AF94] via-[#8C7361] to-[#186663]"></div>

              <div className="p-10 md:p-12">
                {/* Premium Reviews Header */}
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-4xl md:text-5xl playfair font-light tracking-[0.05em] text-[#002D37] mb-2">
                      Guest <span className="italic font-normal text-[#186663]">Experiences</span>
                    </h2>
                    <p className="text-[#A6B5B4] font-light tracking-wide">
                      {packageData.reviews.length} Verified Reviews
                    </p>
                  </div>

                  {/* Premium Rating Summary */}
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end mb-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-5 h-5 text-[#D2AF94] fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-2xl font-bold text-[#002D37] playfair">4.9</span>
                    </div>
                    <p className="text-sm text-[#A6B5B4] tracking-wider">Average Rating</p>
                  </div>
                </div>

                {/* Reviews Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {packageData.reviews.map((review, index) => (
                    <div
                      key={index}
                      className="group relative bg-gradient-to-br from-[#fcfbf9] to-white rounded-2xl border border-[#D2AF94]/15 p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"
                    >
                      {/* Luxury Quote Accent */}
                      <div className="absolute top-6 right-6 text-4xl text-[#D2AF94]/20 playfair font-bold">"</div>

                      {/* Review Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#186663] to-[#002D37] rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {review.username.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-[#002D37] tracking-wide">
                              {review.username}
                            </h4>
                            <p className="text-sm text-[#A6B5B4] tracking-wider">
                              Verified Guest
                            </p>
                          </div>
                        </div>

                        {/* Premium Rating Display */}
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'text-[#D2AF94]' : 'text-[#A6B5B4]/30'} fill-current`}
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs text-[#A6B5B4] tracking-wider">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Review Content */}
                      <p className="text-[#4a4a4a] leading-relaxed font-light tracking-wide italic">
                        "{review.review}"
                      </p>

                      {/* Premium Bottom Accent */}
                      <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#D2AF94]/30 to-transparent"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable Container */}
        <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
          {visibleReviews.map((review: Review, index: number) => (
            <div key={index} className="border-b last:border-0 pb-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <p className="font-medium text-gray-800">{review.username}</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${i < review.rating ? "text-yellow-400" : "text-gray-300"
                          }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              {review.review && (
                <p className="text-gray-600">{review.review}</p>
              )}
            </div>
          ))}
        </div>

        {/* View More Button */}
        {visibleReviews.length < packageData.reviews.length && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() =>
                setVisibleReviews(prev => [
                  ...prev,
                  ...packageData.reviews.slice(prev.length, prev.length + 5)
                ])
              }
              className="px-4 py-2 bg-gray-100 text-sm rounded-md hover:bg-gray-200"
            >
              View More
            </button>
          </div>
        )}
      </div>
      <footer className="w-full bg-gradient-to-r from-transparent via-[#D2AF94] to-transparent">
        <Footer />
      </footer>
    </div>
  )
}


export default TravelPackageDisplay;


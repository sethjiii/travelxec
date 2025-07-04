"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Calendar, MapPin, Users, Phone, Mail, Clock, ChevronDown, ChevronUp } from "lucide-react";

interface Traveler {
  name: string;
  email: string;
  phone: string;
}

interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

interface Booking {
  _id: string;
  packageId: {
    name: string;
    places: string;
    images: string[];
    duration: string;
  };
  userId: {
    name: string;
    email: string;
  };
  numberOfTravelers: number;
  startDate: string;
  specialRequests: string;
  emergencyContact: EmergencyContact;
  travelers: Traveler[];
  priceRange?: {
    min: number;
    max: number;
  };
}

const MyBookingsPage = () => {
  const params = useParams();
  const id = params && typeof params.id === "string" ? params.id : null;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`/api/mytrips/${id}`);
        if (!res.ok) throw new Error("Failed to fetch bookings");

        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookings();
    }
  }, [id]);

  const toggleExpand = (bookingId: string) => {
    setExpandedBookingId((prev) => (prev === bookingId ? null : bookingId));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 text-lg">Loading your journeys...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg border border-red-200">
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!bookings.length) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <MapPin className="w-12 h-12 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">No journeys yet</h2>
            <p className="text-slate-600">Your luxury adventures await</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-24 playfair">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light text-slate-800 mb-4 tracking-wide">
            My <span className="text-emerald-600 font-medium">Journeys</span>
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 mx-auto rounded-full"></div>
          <p className="text-slate-600 text-lg mt-4">Curated experiences for discerning travelers</p>
        </div>

        <div className="space-y-6">
          {bookings.map((booking) => {
            const formattedDate = new Date(booking.startDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
            const isExpanded = expandedBookingId === booking._id;

            return (
              <div
                key={booking._id}
                className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => toggleExpand(booking._id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleExpand(booking._id);
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      {booking.packageId.images?.[0] && (
                        <div className="w-32 h-24 rounded-xl overflow-hidden border-2 border-slate-200">
                          <img
                            src={booking.packageId.images[0]}
                            alt={booking.packageId.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="space-y-2">
                        <h2 className="text-2xl font-semibold text-slate-800">
                          {booking.packageId.name}
                        </h2>
                        <div className="flex items-center gap-6 text-slate-600">
                          <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-emerald-600" />
                            <span>{booking.numberOfTravelers} {booking.numberOfTravelers > 1 ? 'Travelers' : 'Traveler'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-emerald-600" />
                            <span>{formattedDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="w-6 h-6 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-slate-200 bg-slate-50 p-6">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                          <div className="flex items-center gap-3 mb-4">
                            <MapPin className="w-5 h-5 text-emerald-600" />
                            <h3 className="text-lg font-semibold text-slate-800">Package Details</h3>
                          </div>
                          <div className="space-y-3 text-slate-700">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Package:</span>
                              <span className="font-medium">{booking.packageId.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Places:</span>
                              <span className="font-medium">{booking.packageId.places}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Duration:</span>
                              <span className="font-medium flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {booking.packageId.duration}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                          <div className="flex items-center gap-3 mb-4">
                            <Mail className="w-5 h-5 text-emerald-600" />
                            <h3 className="text-lg font-semibold text-slate-800">Account Holder</h3>
                          </div>
                          <div className="space-y-3 text-slate-700">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Name:</span>
                              <span className="font-medium">{booking.userId.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Email:</span>
                              <span className="font-medium">{booking.userId.email}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                          <div className="flex items-center gap-3 mb-4">
                            <Calendar className="w-5 h-5 text-emerald-600" />
                            <h3 className="text-lg font-semibold text-slate-800">Journey Details</h3>
                          </div>
                          <div className="space-y-3 text-slate-700">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Start Date:</span>
                              <span className="font-medium">{formattedDate}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Travelers:</span>
                              <span className="font-medium">{booking.numberOfTravelers}</span>
                            </div>
                            <div className="flex justify-between items-start">
                              <span className="text-slate-600">Special Requests:</span>
                              <span className="font-medium text-right max-w-xs">
                                {booking.specialRequests || "None"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Price Range */}
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="w-5 h-5 text-emerald-600 font-bold">₹</span>
                            <h3 className="text-lg font-semibold text-slate-800">Budget Range</h3>
                          </div>
                          <div className="space-y-2 text-slate-700">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Min Budget (Per Person):</span>
                              <span className="font-medium">₹{booking.priceRange?.min.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Max Budget (Per Person):</span>
                              <span className="font-medium">₹{booking.priceRange?.max.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                          <div className="flex items-center gap-3 mb-4">
                            <Phone className="w-5 h-5 text-emerald-600" />
                            <h3 className="text-lg font-semibold text-slate-800">Emergency Contact</h3>
                          </div>
                          <div className="space-y-3 text-slate-700">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Name:</span>
                              <span className="font-medium">{booking.emergencyContact.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Phone:</span>
                              <span className="font-medium">{booking.emergencyContact.phone}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Relation:</span>
                              <span className="font-medium">{booking.emergencyContact.relation}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 bg-white rounded-xl p-5 shadow-sm border border-slate-200">
                      <div className="flex items-center gap-3 mb-4">
                        <Users className="w-5 h-5 text-emerald-600" />
                        <h3 className="text-lg font-semibold text-slate-800">Travel Companions</h3>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {booking.travelers.map((traveler, index) => (
                          <div
                            key={index}
                            className="bg-slate-50 rounded-lg p-4 border border-slate-200"
                          >
                            <div className="space-y-2">
                              <p className="font-semibold text-slate-800">{traveler.name}</p>
                              <p className="text-sm text-slate-600">{traveler.email}</p>
                              <p className="text-sm text-slate-600">{traveler.phone}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyBookingsPage;

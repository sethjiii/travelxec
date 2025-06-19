"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Calendar, MapPin, Users, Mail, Phone, Star } from "lucide-react";

interface TravelPackage {
  _id: string;
  name: string;
  description: string;
  duration: string;
  availability: {
    startDate: string;
    endDate: string;
  };
  images: string[];
  rating?: number;
  price?: string;
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

interface Traveler {
  name: string;
  email: string;
  phone: string;
}

interface BookingDetails {
  numberOfTravelers: number;
  startDate: string;
  specialRequests: string;
  emergencyContact: EmergencyContact;
  travelers: Traveler[];
}

const ConfirmationPage = () => {
  const params = useParams();
  const id = params?.id as string;

  const [packageData, setPackageData] = useState<TravelPackage | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    numberOfTravelers: 1,
    startDate: "",
    specialRequests: "",
    emergencyContact: {
      name: "",
      phone: "",
      relation: "",
    },
    travelers: [{ name: "", email: "", phone: "" }],
  });
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const packageResponse = await fetch(`/api/packages/${id}`);
        const packageData = await packageResponse.json();
        setPackageData(packageData);

        const _id = localStorage.getItem("_id");
        const name = localStorage.getItem("name");
        const email = localStorage.getItem("email") || '';
        const phone = localStorage.getItem("phone") || '';

        const userData: UserProfile = {
          _id: _id || '',
          name: name || '',
          email,
          phone,
        };

        setUserProfile(userData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("emergency")) {
      const field = name.split(".")[1];
      setBookingDetails(prev => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value,
        },
      }));
    } else if (name.startsWith("traveler")) {
      const index = parseInt(name.split(".")[1], 10);
      const field = name.split(".")[2];
      const updatedTravelers = [...bookingDetails.travelers];
      updatedTravelers[index] = {
        ...updatedTravelers[index],
        [field]: value,
      };
      setBookingDetails(prev => ({
        ...prev,
        travelers: updatedTravelers,
      }));
    } else {
      setBookingDetails(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddTraveler = () => {
    setBookingDetails(prev => ({
      ...prev,
      numberOfTravelers: prev.numberOfTravelers + 1,
      travelers: [...prev.travelers, { name: "", email: "", phone: "" }],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const bookingData = {
        packageId: id,
        userId: userProfile?._id,
        ...bookingDetails,
      };

      const response = await fetch(`/api/confirmation/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingData,
          userId: userProfile?._id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setSuccessMessage("Booking done! Our team will reach out to you soon.");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!packageData || !userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-red-600 font-semibold text-lg">
          Error loading confirmation page
        </div>
      </div>
    );
  }

  return (
<div className="min-h-screen" style={{ backgroundColor: '#faf9f7' }}>
      {/* Elegant Header */}
      <div className="relative h-24 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #002D37 0%, #186663 100%)' }}>
        <div className="text-center">
          <h1 className="text-2xl font-light tracking-widest text-white playfair">TRAVELXEC</h1>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-white to-transparent mt-2"></div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-12" style={{ background: 'linear-gradient(135deg, #002D37 0%, #186663 100%)' }}>
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative px-12 py-16 text-white">
            <div className="flex items-center gap-2 mb-4">
              {packageData.rating && (
                <>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-sm font-light opacity-90">{packageData.rating} • Luxury Experience</span>
                </>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-light mb-4 tracking-wide playfair">
              {packageData.name}
            </h1>
            <div className="flex flex-wrap items-center gap-8 text-sm font-light opacity-90">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{packageData.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>Premium Accommodations</span>
              </div>
              {packageData.price && (
                <div className="text-2xl font-light">
                  From {packageData.price}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Package Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-light mb-8 tracking-wide" style={{ color: '#002D37' }}>
            Experience Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl" style={{ backgroundColor: '#f8f6f4' }}>
              <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#D2AF94' }}>
                <Calendar size={20} style={{ color: '#002D37' }} />
              </div>
              <p className="text-sm font-medium opacity-70 mb-2">DURATION</p>
              <p className="text-lg font-light" style={{ color: '#002D37' }}>{packageData.duration}</p>
            </div>
            <div className="text-center p-6 rounded-xl" style={{ backgroundColor: '#f8f6f4' }}>
              <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#A6B5B4' }}>
                <Users size={20} style={{ color: '#002D37' }} />
              </div>
              <p className="text-sm font-medium opacity-70 mb-2">AVAILABILITY</p>
              <p className="text-lg font-light" style={{ color: '#002D37' }}>
                {packageData.availability ? 
                  `${new Date(packageData.availability.startDate).toLocaleDateString()} - ${new Date(packageData.availability.endDate).toLocaleDateString()}` 
                  : 'Contact for availability'
                }
              </p>
            </div>
            {packageData.rating && (
              <div className="text-center p-6 rounded-xl" style={{ backgroundColor: '#f8f6f4' }}>
                <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#8C7361' }}>
                  <Star size={20} style={{ color: '#002D37' }} />
                </div>
                <p className="text-sm font-medium opacity-70 mb-2">RATING</p>
                <p className="text-lg font-light" style={{ color: '#002D37' }}>{packageData.rating}/5.0</p>
              </div>
            )}
          </div>
        </div>

        {/* Booking Form */}
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Travelers Section */}
          {bookingDetails.travelers.map((traveler, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#186663' }}>
                  <Users size={18} className="text-white" />
                </div>
                <h2 className="text-2xl font-light tracking-wide" style={{ color: '#002D37' }}>
                  Guest {index + 1}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-sm font-medium tracking-wide" style={{ color: '#8C7361' }}>
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    name={`traveler.${index}.name`}
                    value={traveler.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-4 border-0 border-b-2 bg-transparent focus:outline-none focus:border-opacity-100 text-lg font-light transition-all duration-300"
                    style={{ 
                      borderColor: '#A6B5B4',
                      color: '#002D37'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#186663'}
                    onBlur={(e) => e.target.style.borderColor = '#A6B5B4'}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium tracking-wide" style={{ color: '#8C7361' }}>
                    EMAIL ADDRESS
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name={`traveler.${index}.email`}
                      value={traveler.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-4 pl-12 border-0 border-b-2 bg-transparent focus:outline-none focus:border-opacity-100 text-lg font-light transition-all duration-300"
                      style={{ 
                        borderColor: '#A6B5B4',
                        color: '#002D37'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#186663'}
                      onBlur={(e) => e.target.style.borderColor = '#A6B5B4'}
                    />
                    <Mail size={18} className="absolute left-0 top-4" style={{ color: '#A6B5B4' }} />
                  </div>
                </div>
                
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-medium tracking-wide" style={{ color: '#8C7361' }}>
                    PHONE NUMBER
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name={`traveler.${index}.phone`}
                      value={traveler.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-4 pl-12 border-0 border-b-2 bg-transparent focus:outline-none focus:border-opacity-100 text-lg font-light transition-all duration-300"
                      style={{ 
                        borderColor: '#A6B5B4',
                        color: '#002D37'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#186663'}
                      onBlur={(e) => e.target.style.borderColor = '#A6B5B4'}
                    />
                    <Phone size={18} className="absolute left-0 top-4" style={{ color: '#A6B5B4' }} />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add Traveler Button */}
          <button
            type="button"
            onClick={handleAddTraveler}
            className="w-full py-4 rounded-xl font-light text-lg tracking-wide transition-all duration-300 hover:shadow-lg border-2 border-dashed"
            style={{ 
              borderColor: '#A6B5B4',
              color: '#186663',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.backgroundColor = '#186663';
              target.style.color = 'white';
              target.style.borderColor = '#186663';
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLButtonElement;
              target.style.backgroundColor = 'transparent';
              target.style.color = '#186663';
              target.style.borderColor = '#A6B5B4';
            }}
          >
            + Add Another Guest
          </button>

          {/* Emergency Contact */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-light mb-8 tracking-wide" style={{ color: '#002D37' }}>
              Emergency Contact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-medium tracking-wide" style={{ color: '#8C7361' }}>
                  CONTACT NAME
                </label>
                <input
                  type="text"
                  name="emergency.name"
                  value={bookingDetails.emergencyContact.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-4 border-0 border-b-2 bg-transparent focus:outline-none text-lg font-light transition-all duration-300"
                  style={{ 
                    borderColor: '#A6B5B4',
                    color: '#002D37'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#186663'}
                  onBlur={(e) => e.target.style.borderColor = '#A6B5B4'}
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium tracking-wide" style={{ color: '#8C7361' }}>
                  PHONE NUMBER
                </label>
                <input
                  type="tel"
                  name="emergency.phone"
                  value={bookingDetails.emergencyContact.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-4 border-0 border-b-2 bg-transparent focus:outline-none text-lg font-light transition-all duration-300"
                  style={{ 
                    borderColor: '#A6B5B4',
                    color: '#002D37'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#186663'}
                  onBlur={(e) => e.target.style.borderColor = '#A6B5B4'}
                />
              </div>
              
              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-medium tracking-wide" style={{ color: '#8C7361' }}>
                  RELATIONSHIP
                </label>
                <input
                  type="text"
                  name="emergency.relation"
                  value={bookingDetails.emergencyContact.relation}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Spouse, Parent, Sibling"
                  className="w-full px-4 py-4 border-0 border-b-2 bg-transparent focus:outline-none text-lg font-light transition-all duration-300"
                  style={{ 
                    borderColor: '#A6B5B4',
                    color: '#002D37'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#186663'}
                  onBlur={(e) => e.target.style.borderColor = '#A6B5B4'}
                />
              </div>
            </div>
          </div>

          {/* Travel Date */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-light mb-8 tracking-wide" style={{ color: '#002D37' }}>
              Preferred Departure Date
            </h2>
            <div className="max-w-md">
              <label className="block text-sm font-medium tracking-wide mb-2" style={{ color: '#8C7361' }}>
                DEPARTURE DATE
              </label>
              <input
                type="date"
                name="startDate"
                value={bookingDetails.startDate}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-4 border-0 border-b-2 bg-transparent focus:outline-none text-lg font-light transition-all duration-300"
                style={{ 
                  borderColor: '#A6B5B4',
                  color: '#002D37'
                }}
                onFocus={(e) => e.target.style.borderColor = '#186663'}
                onBlur={(e) => e.target.style.borderColor = '#A6B5B4'}
              />
            </div>
          </div>

          {/* Special Requests */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-light mb-8 tracking-wide" style={{ color: '#002D37' }}>
              Special Requests & Preferences
            </h2>
            <div className="space-y-2">
              <label className="block text-sm font-medium tracking-wide" style={{ color: '#8C7361' }}>
                ADDITIONAL REQUESTS
              </label>
              <textarea
                name="specialRequests"
                value={bookingDetails.specialRequests}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-4 py-4 border-2 rounded-xl bg-transparent focus:outline-none text-lg font-light transition-all duration-300 resize-none"
                style={{ 
                  borderColor: '#A6B5B4',
                  color: '#002D37'
                }}
                onFocus={(e) => e.target.style.borderColor = '#186663'}
                onBlur={(e) => e.target.style.borderColor = '#A6B5B4'}
                placeholder="Dietary preferences, room preferences, celebration occasions, accessibility needs..."
              />
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="rounded-2xl p-6 text-center font-light text-lg border-2" style={{ 
              backgroundColor: '#f0f9f7',
              borderColor: '#186663',
              color: '#002D37'
            }}>
              {successMessage}
            </div>
          )}

          {/* Submit Button */}
          <div className="text-center pt-8">
            <button
              type="submit"
              className="px-16 py-5 rounded-xl font-light text-lg tracking-widest transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1"
              style={{ 
                background: 'linear-gradient(135deg, #002D37 0%, #186663 100%)',
                color: 'white'
              }}
            >
              RESERVE EXPERIENCE
            </button>
            <p className="mt-4 text-sm font-light opacity-70" style={{ color: '#8C7361' }}>
              Our travel concierge will contact you within 24 hours to finalize your luxury experience
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ConfirmationPage;

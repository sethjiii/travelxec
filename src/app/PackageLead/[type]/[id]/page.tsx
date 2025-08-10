"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Calendar, MapPin, Users, Mail, Phone, Star, IndianRupee } from "lucide-react";
import { useRouter } from 'next/navigation';

interface TravelPackage {
    _id: string;
    name: string;
    type: string;
    description: string;
    duration: string;
    availability: {
        startDate: string;
        endDate: string;
    };
    images: string[];
    rating?: number;
    OnwardPrice?: string;
}

interface UserProfile {
    _id: string;
    name: string;
    email: string;
    phone: string;
}

interface AlternateContact {
    name: string;
    phone: string;
}

interface Traveler {
    name: string;
    email: string;
    phone: string;
}

interface LeadDetails {
    name: string; // Primary traveler name
    email: string; // Primary traveler email
    phone: string; // Primary traveler phone
    numberOfTravelers: number;
    startDate: string;
    specialRequests: string;
    alternateContact: AlternateContact; // Changed from emergencyContact
    travelers: Traveler[];
    priceRange: {
        max: number;
    };
}

const PackageLeadPage = () => {
    const params = useParams();
    const id = params?.id as string;
    const type = params?.type as string;

    const router = useRouter()
    const [packageData, setPackageData] = useState<TravelPackage | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [LeadDetails, setLeadDetails] = useState<LeadDetails>({

        name: "", // Primary traveler
        email: "",
        phone: "",
        numberOfTravelers: 1,
        startDate: "",
        specialRequests: "",
        alternateContact: {
            name: "",
            phone: "",
        },
        travelers: [{ name: "", email: "", phone: "" }],
        priceRange: {
            max: 100000,
        },
    });
    const [successMessage, setSuccessMessage] = useState<string>("");

    // Price range constants
    const MAX_PRICE = 1000000;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const packageResponse = await fetch(`/api/packages/${type}/${id}`);
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

                // Pre-fill primary traveler details from user profile
                setLeadDetails(prev => ({
                    ...prev,
                    name: name || '',
                    email: email || '',
                    phone: phone || '',
                    travelers: [{ name: name || '', email: email || '', phone: phone || '' }]
                }));
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

        if (name.startsWith("alternateContact")) { // Changed from emergency
            const field = name.split(".")[1];
            setLeadDetails(prev => ({
                ...prev,
                alternateContact: {
                    ...prev.alternateContact,
                    [field]: value,
                },
            }));
        } else if (name.startsWith("traveler")) {
            const index = parseInt(name.split(".")[1], 10);
            const field = name.split(".")[2];
            const updatedTravelers = [...LeadDetails.travelers];
            updatedTravelers[index] = {
                ...updatedTravelers[index],
                [field]: value,
            };

            // If updating the first traveler, also update the primary details
            if (index === 0) {
                setLeadDetails(prev => ({
                    ...prev,
                    [field]: value, // Update primary traveler details
                    travelers: updatedTravelers,
                }));
            } else {
                setLeadDetails(prev => ({
                    ...prev,
                    travelers: updatedTravelers,
                }));
            }
        } else {
            setLeadDetails(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handlePriceRangeChange = (type: 'max', value: number) => {
        setLeadDetails(prev => ({
            ...prev,
            priceRange: {
                ...prev.priceRange,
                [type]: value,
            },
        }));
    };

    const handleAddTraveler = () => {
        setLeadDetails(prev => ({
            ...prev,
            numberOfTravelers: prev.numberOfTravelers + 1,
            travelers: [...prev.travelers, { name: "", email: "", phone: "" }],
        }));
    };

    const handleSubmit = async () => {
        try {
            if (!LeadDetails.name || !LeadDetails.email || !LeadDetails.phone) {
                alert("Please fill in all required fields for the primary traveler.");
                return;
            }

            const response = await fetch(`/api/PackageLead/${type}/${id}/lead`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...LeadDetails,
                    packageId: id,             // ✅ still needed
                    packageType: type,         // ✅ optional, if your backend expects it
                    userId: userProfile?._id || null,
                }),
            });


            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setSuccessMessage("Booking request submitted! Our team will reach out to you soon.");
                router.push("/thank-you");
            } else {
                const err = await response.json();
                console.error("Details Fetching Error:", err);
                alert(err?.error || "An error occurred while submitting your booking query request.");
            }
        } catch (error) {
            console.error("Error creating booking:", error);
            alert("An error occurred during booking.");
        }
    };

    // ✅ These are now inside PackageLeadPage, not inside handleSubmit
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
                    Error loading Package Lead page
                </div>
            </div>
        );
    }


    return (
        <div
            className="min-h-screen"
            style={{
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                backgroundImage: `url('https://res.cloudinary.com/dgbhkfp0r/image/upload/v1753618995/cppjtrzqjvnswkzifujb.avif')`,
                backgroundColor: '#186663',
            }}
        >


            <div className="max-w-5xl mx-auto py-20 px-4">
                {/* Hero Section */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl  mb-12" style={{ background: 'linear-gradient(135deg, #002D37 0%, #186663 100%)' }}>
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
                        </div>
                    </div>
                </div>

                {/* Package Overview */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
                    <h2 className="text-2xl font-light mb-8 tracking-wide" style={{ color: '#002D37' }}>
                        Experience Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
                        <div className="text-center p-6 rounded-xl" style={{ backgroundColor: '#f8f6f4' }}>
                            <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#D2AF94' }}>
                                <Calendar size={20} style={{ color: '#002D37' }} />
                            </div>
                            <p className="text-sm font-medium opacity-70 mb-2">DURATION</p>
                            <p className="text-lg font-light" style={{ color: '#002D37' }}>{packageData.duration}</p>
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
                        {/* Price Range Slider */}
                        <div className="text-center p-6 rounded-xl" style={{ backgroundColor: '#f8f6f4' }}>
                            <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#D2AF94' }}>
                                <IndianRupee size={20} style={{ color: '#002D37' }} />
                            </div>
                            <p className="text-sm font-medium opacity-70 mb-4">BUDGET RANGE PER PERSON</p>
                            <div className="space-y-4">
                                <div className="text-lg font-light" style={{ color: '#002D37' }}>
                                    ₹{LeadDetails.priceRange.max.toLocaleString()}
                                </div>



                                {/* Max Price Slider */}
                                <div className="space-y-2">
                                    <label className="block text-xs font-medium opacity-60" style={{ color: '#8C7361' }}>
                                        MAX BUDGET
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="range"

                                            max={MAX_PRICE}
                                            value={LeadDetails.priceRange.max}
                                            onChange={(e) => handlePriceRangeChange('max', parseInt(e.target.value))}
                                            className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
                                            style={{
                                                background: `linear-gradient(to right, #D2AF94 0%, #D2AF94 ${((LeadDetails.priceRange.max - 0) / (MAX_PRICE - 0)) * 100}%, #186663 ${((LeadDetails.priceRange.max - 0) / (MAX_PRICE - 0)) * 100}%, #186663 100%)`
                                            }}
                                        />
                                        <div className="w-28 justify-between flex">
                                            <input
                                                type="number"
                                                min={10000}
                                                max={MAX_PRICE}
                                                step={1000}
                                                value={LeadDetails.priceRange.max}
                                                onChange={(e) =>
                                                    handlePriceRangeChange("max", parseInt(e.target.value))
                                                }
                                                className="w-full px-3 py-1.5 border border-[#D2AF94] text-sm rounded-lg shadow-sm focus:ring-2 focus:ring-[#D2AF94]/50 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lead Form */}
                <div className="space-y-8">
                    {/* Primary Traveler Section */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#186663' }}>
                                <Users size={18} className="text-white" />
                            </div>
                            <h2 className="text-2xl font-light tracking-wide" style={{ color: '#002D37' }}>
                                Primary Traveler Details
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium tracking-wide" style={{ color: '#8C7361' }}>
                                    FULL NAME *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={LeadDetails.name}
                                    onChange={handleInputChange}

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
                                    EMAIL ADDRESS *
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        name="email"
                                        value={LeadDetails.email}
                                        onChange={handleInputChange}

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
                                    PHONE NUMBER *
                                </label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={LeadDetails.phone}
                                        onChange={handleInputChange}

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

                    {/* Additional Travelers Section */}
                    {LeadDetails.travelers.slice(1).map((traveler, index) => (
                        <div key={index + 1} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#186663' }}>
                                    <Users size={18} className="text-white" />
                                </div>
                                <h2 className="text-2xl font-light tracking-wide" style={{ color: '#002D37' }}>
                                    Guest {index + 2}
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium tracking-wide" style={{ color: '#8C7361' }}>
                                        FULL NAME
                                    </label>
                                    <input
                                        type="text"
                                        name={`traveler.${index + 1}.name`}
                                        value={traveler.name}
                                        onChange={handleInputChange}
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
                                            name={`traveler.${index + 1}.email`}
                                            value={traveler.email}
                                            onChange={handleInputChange}
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
                                            name={`traveler.${index + 1}.phone`}
                                            value={traveler.phone}
                                            onChange={handleInputChange}
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

                    {/* Alternate Contact */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-2xl font-light mb-8 tracking-wide" style={{ color: '#002D37' }}>
                            Alternate Contact
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium tracking-wide" style={{ color: '#8C7361' }}>
                                    CONTACT NAME
                                </label>
                                <input
                                    type="text"
                                    name="alternateContact.name"
                                    value={LeadDetails.alternateContact.name}
                                    onChange={handleInputChange}
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
                                    name="alternateContact.phone"
                                    value={LeadDetails.alternateContact.phone}
                                    onChange={handleInputChange}
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
                                value={LeadDetails.startDate}
                                onChange={handleInputChange}
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
                                value={LeadDetails.specialRequests}
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
                            onClick={handleSubmit}
                            className="px-16 py-5 rounded-xl font-light text-lg tracking-widest transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1"
                            style={{
                                background: 'linear-gradient(135deg, #002D37 0%, #186663 100%)',
                                color: 'white'
                            }}
                        >
                            SUBMIT BOOKING REQUEST
                        </button>
                        <p className="mt-4 text-sm font-light opacity-70" style={{ color: '#8C7361' }}>
                            Our travel concierge will contact you within 24 hours to finalize your luxury experience
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #002D37;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 6px rgba(0, 45, 55, 0.3);
        }

        .slider::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #002D37;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 6px rgba(0, 45, 55, 0.3);
        }
      `}</style>
        </div>
    );
}

export default PackageLeadPage;
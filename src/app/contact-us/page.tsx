'use client';

import React, { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, Clock, Star } from 'lucide-react';
import Footer from '../components/FooterContent';
import { FaWhatsapp, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { toast } from 'sonner';

const ContactUsPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [consent, setConsent] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/popuplead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          destination,
          budget: Number(budget),
          consent,
        }),
      });

      if (res.ok) {
        toast.success("Thanks for sharing your trip details!");
        setName("");
        setEmail("");
        setPhone("");
        setDestination("");
        setBudget("");
      } else {
        const { error } = await res.json();
        toast.error(error || "Something went wrong.");
      }
    } catch (err) {
      toast.error("Network error!");
    }
  };

  const contactData = {
    phoneNumbers: [
      'Contact No.: +91-9910583345',
      
    ],
    emailAddresses: [
      'Support: support@travelxec.com',
      'Contact: contact@travelxec.com',
    ],
    address: '114, Pyramid Urban Square, Sector 67A, Gurgaon, Haryana, India, 122102',
    hours: [
      'Tuesday-Sunday: 9am - 7pm',
      'Monday: Closed',
    ]
  };

  return (
    <div className="flex flex-col  min-h-screen">
      {/* Main Content */}
      <main className="flex-grow bg-gradient-to-br from-[#002D37] via-[#003A47] to-[#002D37] text-white relative overflow-x-hidden font-sans">
        <div
          className="hidden md:block fixed pointer-events-none z-50 w-6 h-6 rounded-full bg-[#186663]/30 blur-sm"
          style={{ left: mousePosition.x - 12, top: mousePosition.y - 12 }}
        />

        {/* Hero Section */}
        <section className="text-center py-20 px-4 sm:px-6 md:px-12">
          <div className="inline-flex items-center gap-2 bg-[#D2AF94]/10 rounded-full px-8 py-3 mb-6 border border-[#D2AF94]/30 shadow-md">
            <Star className="w-4 h-4 text-[#D2AF94] animate-spin-slow" />
            <span className="text-[#D2AF94] text-sm tracking-widest uppercase">Premium Support</span>
            <Star className="w-4 h-4 text-[#D2AF94] animate-spin-slow" />
          </div>
          <h1 className="text-4xl md:text-5xl font-light leading-tight mb-4 text-white">
            Connect <span className="font-medium text-[#D2AF94] italic">With Us</span>
          </h1>
          <p className="text-[#A6B5B4] text-lg leading-relaxed max-w-2xl mx-auto">
            Luxury travel services tailored to your journey.
          </p>
        </section>

        {/* Split Layout: Contact Info + Form */}
        <section className="px-4 sm:px-6 md:px-12 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">

              {/* Left Side - Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-semibold text-[#D2AF94] mb-8 tracking-wide">
                    Get In Touch
                  </h2>
                  <p className="text-[#A6B5B4] text-lg mb-8 leading-relaxed">
                    Ready to plan your next luxury adventure? We're here to create unforgettable experiences tailored just for you.
                  </p>
                </div>

                {/* Contact Cards Grid */}
                <div className="grid sm:grid-cols-2 gap-6">
                  {[{
                    title: 'Phone',
                    icon: <Phone className="w-5 h-5 text-[#D2AF94]" />,
                    content: contactData.phoneNumbers
                  }, {
                    title: 'Email',
                    icon: <Mail className="w-5 h-5 text-[#D2AF94]" />,
                    content: contactData.emailAddresses
                  }, {
                    title: 'Address',
                    icon: <MapPin className="w-5 h-5 text-[#D2AF94]" />,
                    content: [contactData.address]
                  }, {
                    title: 'Hours',
                    icon: <Clock className="w-5 h-5 text-[#D2AF94]" />,
                    content: contactData.hours
                  }].map((section, i) => (
                    <div key={i} className="bg-[#003A47]/30 backdrop-blur-xl rounded-2xl p-6 border border-[#A6B5B4]/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        {section.icon}
                        <h3 className="text-lg font-semibold text-[#D2AF94] tracking-wide">{section.title}</h3>
                      </div>
                      <div className="space-y-2 text-[#E8F1F1] text-sm leading-relaxed">
                        {section.content.map((item, j) => <p key={j}>{item}</p>)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social Media Section */}
                <div className="pt-4">
                  <h3 className="text-xl font-medium text-[#D2AF94] mb-4 tracking-wide">Follow Us</h3>
                  <div className="flex gap-4">
                    {[
                      { href: "https://www.facebook.com/profile.php?id=61571932697689", icon: FaFacebook },
                      { href: "https://www.instagram.com/travel.xec/", icon: FaInstagram },
                      { href: "https://wa.me/your-number", icon: FaWhatsapp },
                      { href: "https://www.linkedin.com/company/travelxec/about/?viewAsMember=true", icon: FaLinkedin }
                    ].map((social, i) => (
                      <a
                        key={i}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative group p-3 bg-gradient-to-br from-[#186663]/30 to-[#002D37]/50 backdrop-blur-sm border border-[#A6B5B4]/20 hover:border-[#D2AF94]/50 rounded-full transition-all duration-300 hover:scale-110"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#D2AF94]/20 to-[#8C7361]/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <social.icon className="relative h-5 w-5 text-[#A6B5B4] group-hover:text-[#D2AF94] transition-colors duration-300" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side - Contact Form */}
              <div className="lg:pl-8">
                <div className="sticky top-8">
                  <form
                    onSubmit={handleSubmit}
                    className="bg-[#003A47]/40 backdrop-blur-lg rounded-2xl p-8 border border-[#D2AF94]/30 shadow-2xl space-y-6"
                  >
                    <div className="mb-6">
                      <h3 className="text-2xl font-semibold text-[#D2AF94] mb-2 tracking-wide">
                        Feel Free to Reach Out!
                      </h3>
                      <p className="text-[#A6B5B4] text-sm">
                        Tell us about your dream destination and we'll create a personalized experience for you.
                      </p>
                    </div>

                    {/* Form Fields */}
                    {[
                      { id: 'name', label: 'Full Name / Business Name', type: 'text', value: name, setter: setName },
                      { id: 'phone', label: 'Phone Number', type: 'tel', value: phone, setter: setPhone },
                      { id: 'email', label: 'Email Address', type: 'email', value: email, setter: setEmail },
                      { id: 'destination', label: 'Destination (Paris, Bali, etc.)', type: 'text', value: destination, setter: setDestination },
                      { id: 'budget', label: 'Budget (e.g. 50000)', type: 'number', value: budget, setter: setBudget }
                    ].map((field) => (
                      <div key={field.id} className="relative">
                        <input
                          type={field.type}
                          id={field.id}
                          value={field.value}
                          onChange={(e) => field.setter(e.target.value)}
                          required
                          placeholder=" "
                          className="peer w-full px-4 pt-6 pb-2 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#D2AF94] transition-all duration-200"
                        />
                        <label
                          htmlFor={field.id}
                          className="pointer-events-none absolute left-4 top-4 text-base text-gray-500 transition-all duration-200
                           peer-focus:top-2.5 peer-focus:text-sm peer-focus:text-[#D2AF94]
                           peer-not-placeholder-shown:top-2.5 peer-not-placeholder-shown:text-sm peer-not-placeholder-shown:text-gray-600"
                        >
                          {field.label}
                        </label>
                      </div>
                    ))}

                    {/* Consent Checkbox */}
                    <div className="flex items-start gap-3 pt-2">
                      <input
                        type="checkbox"
                        id="consent"
                        checked={consent}
                        onChange={() => setConsent(!consent)}
                        className="h-4 w-4 mt-1 accent-[#D2AF94] rounded"
                      />
                      <label htmlFor="consent" className="text-sm text-gray-200 leading-relaxed">
                        I'd like to receive information about special offers and newsletters.
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full py-4 mt-6 bg-gradient-to-r from-[#D2AF94] to-[#8C7361] text-white font-semibold rounded-lg shadow-lg hover:scale-[1.02] hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D2AF94]/50"
                    >
                      Send Message
                    </button>

                    <p className="text-xs text-[#A6B5B4] text-center mt-4">
                      We'll get back to you within 24 hours
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gradient-to-r from-transparent via-[#D2AF94] to-transparent">
        <Footer />
      </footer>
    </div>
  );

};

export default ContactUsPage;

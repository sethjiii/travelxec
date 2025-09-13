'use client';

import React, { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, Clock, Star } from 'lucide-react';
import Footer from '../components/FooterContent';
import { FaWhatsapp, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
const ContactUsPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const contactData = {
    phoneNumbers: [
      'General Inquiries: +91-9667909383',
      'Support: +91-9667909383',
      'Sales: +91-9667909383',
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
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <main className="flex-grow bg-gradient-to-br from-[#002D37] via-[#003A47] to-[#002D37] text-white px-4 sm:px-6 md:px-12 py-24 relative overflow-x-hidden font-sans">
        <div
          className="hidden md:block fixed pointer-events-none z-50 w-6 h-6 rounded-full bg-[#186663]/30 blur-sm"
          style={{ left: mousePosition.x - 12, top: mousePosition.y - 12 }}
        />
        <section className="text-center max-w-3xl mx-auto mb-24">
          <div className="inline-flex items-center gap-2 bg-[#D2AF94]/10 rounded-full px-8 py-3 mb-6 border border-[#D2AF94]/30 shadow-md">
            <Star className="w-4 h-4 text-[#D2AF94] animate-spin-slow" />
            <span className="text-[#D2AF94] text-sm tracking-widest uppercase">Premium Support</span>
            <Star className="w-4 h-4 text-[#D2AF94] animate-spin-slow" />
          </div>
          <h1 className="text-5xl md:text-6xl font-light leading-tight mb-4 text-white">
            Connect <span className="font-medium text-[#D2AF94] italic">With Us</span>
          </h1>
          <p className="text-[#A6B5B4] text-lg md:text-xl leading-relaxed">
            Luxury travel services tailored to your journey.
          </p>
        </section>

        <section className="grid gap-12 md:grid-cols-2 mb-20">
          {[{
            title: 'Phone',
            icon: <Phone className="w-6 h-6 text-[#8C7361]" />,
            content: contactData.phoneNumbers
          }, {
            title: 'Emails',
            icon: <Mail className="w-6 h-6 text-[#8C7361]" />,
            content: contactData.emailAddresses
          }, {
            title: 'Address',
            icon: <MapPin className="w-6 h-6 text-[#8C7361]" />,
            content: [contactData.address]
          }, {
            title: 'Business Hours',
            icon: <Clock className="w-6 h-6 text-[#8C7361]" />,
            content: contactData.hours
          }].map((section, i) => (
            <div key={i} className="bg-[#003A47]/30 backdrop-blur-xl rounded-3xl p-8 border border-[#A6B5B4]/20 shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                {section.icon}
                <h2 className="text-2xl font-semibold text-[#D2AF94] tracking-wide">{section.title}</h2>
              </div>
              <ul className="space-y-3 text-[#E8F1F1] text-base leading-relaxed">
                {section.content.map((item, j) => <li key={j}>{item}</li>)}
              </ul>
            </div>
          ))}
        </section>

        <section className="text-center mb-16">
          <h2 className="text-3xl font-medium text-[#D2AF94] mb-4 tracking-wide">Follow Us</h2>
          <div className="flex justify-center items-center w-full gap-4">
            {/* Facebook */}
            <a
              href="https://www.facebook.com/profile.php?id=61571932697689"
              target="_blank"
              rel="noopener noreferrer"
              className="relative group p-3 bg-gradient-to-br from-[#186663]/30 to-[#002D37]/50 backdrop-blur-sm border border-[#A6B5B4]/20 hover:border-[#D2AF94]/50 rounded-full transition-all duration-300 hover:scale-110"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#D2AF94]/20 to-[#8C7361]/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <FaFacebook className="relative h-5 w-5 text-[#A6B5B4] group-hover:text-[#D2AF94] transition-colors duration-300" />
            </a>
            {/* Instagram */}
            <a
              href="https://www.instagram.com/travel.xec/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative group p-3 bg-gradient-to-br from-[#186663]/30 to-[#002D37]/50 backdrop-blur-sm border border-[#A6B5B4]/20 hover:border-[#D2AF94]/50 rounded-full transition-all duration-300 hover:scale-110"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#D2AF94]/20 to-[#8C7361]/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <FaInstagram className="relative h-5 w-5 text-[#A6B5B4] group-hover:text-[#D2AF94] transition-colors duration-300" />
            </a>
            {/* WhatsApp */}
            <a
              href="https://wa.me/your-number"
              target="_blank"
              rel="noopener noreferrer"
              className="relative group p-3 bg-gradient-to-br from-[#186663]/30 to-[#002D37]/50 backdrop-blur-sm border border-[#A6B5B4]/20 hover:border-[#D2AF94]/50 rounded-full transition-all duration-300 hover:scale-110"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#D2AF94]/20 to-[#8C7361]/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <FaWhatsapp className="relative h-5 w-5 text-[#A6B5B4] group-hover:text-[#D2AF94] transition-colors duration-300" />
            </a>
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/company/travelxec/about/?viewAsMember=true"
              target="_blank"
              rel="noopener noreferrer"
              className="relative group p-3 bg-gradient-to-br from-[#186663]/30 to-[#002D37]/50 backdrop-blur-sm border border-[#A6B5B4]/20 hover:border-[#D2AF94]/50 rounded-full transition-all duration-300 hover:scale-110"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#D2AF94]/20 to-[#8C7361]/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <FaLinkedin className="relative h-5 w-5 text-[#A6B5B4] group-hover:text-[#D2AF94] transition-colors duration-300" />
            </a>
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

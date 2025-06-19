'use client';

import React, { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, Clock, Star } from 'lucide-react';
import { AuroraBackground } from '@/components/ui/aurora-background';

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
      'General Inquiries: +1 (123) 456-7890',
      'Support: +1 (123) 555-0199',
      'Sales: +1 (123) 987-6543',
    ],
    emailAddresses: [
      'Support: support@example.com',
      'Sales: sales@example.com',
      'General: info@example.com',
    ],
    socialMedia: [
      { name: 'Facebook', url: 'https://facebook.com', icon: 'f' },
      { name: 'Twitter', url: 'https://twitter.com', icon: '𝕏' },
      { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'in' },
    ],
    address: '1234 Some Street, City, Country, ZIP',
    hours: [
      'Mon-Fri: 9am - 6pm',
      'Sat: 10am - 4pm',
      'Sun: Closed',
    ]
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#002D37] via-[#003A47] to-[#002D37] text-white px-4 sm:px-6 md:px-12 py-24 relative overflow-x-hidden font-sans">
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
        <div className="flex justify-center gap-5">
          {contactData.socialMedia.map((sm, i) => (
            <a
              key={i}
              href={sm.url}
              target="_blank"
              rel="noreferrer"
              className="w-12 h-12 flex items-center justify-center rounded-full bg-[#A6B5B4]/10 border border-[#D2AF94]/30 text-white hover:bg-[#D2AF94]/20 hover:scale-110 transition duration-300"
            >
              <span className="text-lg font-bold">{sm.icon}</span>
            </a>
          ))}
        </div>
      </section>

      <footer className="text-center border-t border-[#A6B5B4]/20 pt-10">
        <p className="text-[#A6B5B4] text-sm">Let TravelXec craft your dream journey — exquisitely and effortlessly.</p>
      </footer>
    </main>
  );
};

export default ContactUsPage;

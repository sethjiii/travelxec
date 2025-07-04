import React from 'react';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin,
  Plane,
  Heart,
  Clock
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const destinations = [
    'Europe Tours',
    'Asian Adventures',
    'African Safaris',
    'American Travels',
    'Oceania Expeditions'
  ];

  const quickLinks = [
    'Latest Deals',
    'Travel Insurance',
    'How It Works',
    'Travel Blog',
    'Gift Cards'
  ];

  return (
    <footer className="relative bg-gradient-to-br from-[#002D37] via-[#186663] to-[#002D37] text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating orbs */}
        <div className="absolute w-96 h-96 rounded-full bg-gradient-to-br from-[#D2AF94]/10 to-[#8C7361]/5 blur-3xl animate-pulse" style={{ top: '20%', left: '10%' }}></div>
        <div className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-[#186663]/20 to-[#A6B5B4]/10 blur-2xl animate-pulse" style={{ top: '60%', right: '15%', animationDelay: '3s' }}></div>
        <div className="absolute w-80 h-80 rounded-full bg-gradient-to-br from-[#A6B5B4]/8 to-[#D2AF94]/15 blur-3xl animate-pulse" style={{ bottom: '10%', left: '60%', animationDelay: '6s' }}></div>
        
        {/* Animated lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1000 600" preserveAspectRatio="none">
          <defs>
            <linearGradient id="footerGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D2AF94" stopOpacity="0.3">
                <animate attributeName="stop-opacity" values="0.1;0.5;0.1" dur="6s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#A6B5B4" stopOpacity="0.2">
                <animate attributeName="stop-opacity" values="0.2;0.6;0.2" dur="4s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
          </defs>
          
          <path d="M0,100 Q500,50 1000,100 T2000,100" 
                stroke="url(#footerGradient1)" 
                strokeWidth="1" 
                fill="none">
            <animate attributeName="d" 
                     values="M0,100 Q500,50 1000,100;M0,120 Q500,70 1000,120;M0,100 Q500,50 1000,100" 
                     dur="12s" 
                     repeatCount="indefinite" />
          </path>
          
          <path d="M0,300 Q250,250 500,300 T1000,300" 
                stroke="url(#footerGradient1)" 
                strokeWidth="0.8" 
                fill="none"
                opacity="0.6">
            <animate attributeName="d" 
                     values="M0,300 Q250,250 500,300 T1000,300;M0,320 Q250,270 500,320 T1000,320;M0,300 Q250,250 500,300 T1000,300" 
                     dur="15s" 
                     repeatCount="indefinite" />
          </path>
          
          {/* Floating particles */}
          <circle cx="150" cy="200" r="1.5" fill="#D2AF94" opacity="0.7">
            <animate attributeName="cy" values="200;50;200" dur="20s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.9;0.3" dur="8s" repeatCount="indefinite" />
          </circle>
          <circle cx="850" cy="400" r="1" fill="#A6B5B4" opacity="0.6">
            <animate attributeName="cy" values="400;200;400" dur="25s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.2;0.8;0.2" dur="6s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      {/* Luxury top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D2AF94] to-transparent"></div>
      
      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-[#D2AF94]/30 rounded-full blur-sm"></div>
                <div className="relative p-2 bg-gradient-to-br from-[#D2AF94] to-[#8C7361] rounded-full">
                  <Plane className="h-6 w-6 text-[#002D37]" />
                </div>
              </div>
              <span className="text-3xl font-light bg-gradient-to-r from-white via-[#A6B5B4] to-white bg-clip-text text-transparent">
                TravelXec
              </span>
            </div>
            
            <p className="text-[#A6B5B4] leading-relaxed font-light">
              Discover the world with us. We create 
              <span className="text-[#D2AF94] font-medium"> unforgettable travel experiences </span>
              and help you explore the most beautiful destinations around the globe.
            </p>
            
            <div className="flex items-center gap-4 pt-4">
              <button className="relative group p-3 bg-gradient-to-br from-[#186663]/30 to-[#002D37]/50 backdrop-blur-sm border border-[#A6B5B4]/20 hover:border-[#D2AF94]/50 rounded-full transition-all duration-300 hover:scale-110">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D2AF94]/20 to-[#8C7361]/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Facebook className="relative h-5 w-5 text-[#A6B5B4] group-hover:text-[#D2AF94] transition-colors duration-300" />
              </button>
              <button className="relative group p-3 bg-gradient-to-br from-[#186663]/30 to-[#002D37]/50 backdrop-blur-sm border border-[#A6B5B4]/20 hover:border-[#D2AF94]/50 rounded-full transition-all duration-300 hover:scale-110">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D2AF94]/20 to-[#8C7361]/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Instagram className="relative h-5 w-5 text-[#A6B5B4] group-hover:text-[#D2AF94] transition-colors duration-300" />
              </button>
              <button className="relative group p-3 bg-gradient-to-br from-[#186663]/30 to-[#002D37]/50 backdrop-blur-sm border border-[#A6B5B4]/20 hover:border-[#D2AF94]/50 rounded-full transition-all duration-300 hover:scale-110">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D2AF94]/20 to-[#8C7361]/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Twitter className="relative h-5 w-5 text-[#A6B5B4] group-hover:text-[#D2AF94] transition-colors duration-300" />
              </button>
              <button className="relative group p-3 bg-gradient-to-br from-[#186663]/30 to-[#002D37]/50 backdrop-blur-sm border border-[#A6B5B4]/20 hover:border-[#D2AF94]/50 rounded-full transition-all duration-300 hover:scale-110">
                <div className="absolute inset-0 bg-gradient-to-br from-[#D2AF94]/20 to-[#8C7361]/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Linkedin className="relative h-5 w-5 text-[#A6B5B4] group-hover:text-[#D2AF94] transition-colors duration-300" />
              </button>
            </div>
          </div>

          {/* Destinations */}
          <div className="space-y-6">
            <h3 className="text-xl font-light text-white mb-8 relative">
              Popular Destinations
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-[#D2AF94] to-transparent"></div>
            </h3>
            <ul className="space-y-4">
              {destinations.map((destination, index) => (
                <li key={destination}>
                  <a 
                    href="#" 
                    className="group text-[#A6B5B4] hover:text-[#D2AF94] transition-all duration-300 flex items-center gap-3 py-2"
                  >
                    <div className="relative">
                      <MapPin className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-[#D2AF94]/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <span className="font-light group-hover:font-medium transition-all duration-300">
                      {destination}
                    </span>
                    <div className="w-0 group-hover:w-2 h-0.5 bg-[#D2AF94] transition-all duration-300 ml-auto"></div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-light text-white mb-8 relative">
              Quick Links
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-[#D2AF94] to-transparent"></div>
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="group text-[#A6B5B4] hover:text-[#D2AF94] transition-all duration-300 flex items-center gap-3 py-2"
                  >
                    <div className="relative">
                      <Heart className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-[#D2AF94]/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <span className="font-light group-hover:font-medium transition-all duration-300">
                      {link}
                    </span>
                    <div className="w-0 group-hover:w-2 h-0.5 bg-[#D2AF94] transition-all duration-300 ml-auto"></div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-light text-white mb-8 relative">
              Contact Us
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-[#D2AF94] to-transparent"></div>
            </h3>
            <div className="space-y-6">
              <div className="group flex items-start gap-4 text-[#A6B5B4] hover:text-[#D2AF94] transition-colors duration-300">
                <div className="relative mt-1">
                  <MapPin className="h-5 w-5 flex-shrink-0 transition-all duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-[#D2AF94]/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <span className="font-light leading-relaxed">114, Pramid Urban Square</span>
              </div>
              
              <div className="group flex items-center gap-4 text-[#A6B5B4] hover:text-[#D2AF94] transition-colors duration-300">
                <div className="relative">
                  <Phone className="h-5 w-5 transition-all duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-[#D2AF94]/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <span className="font-light">+91-9667909383</span>
              </div>
              
              <div className="group flex items-center gap-4 text-[#A6B5B4] hover:text-[#D2AF94] transition-colors duration-300">
                <div className="relative">
                  <Mail className="h-5 w-5 transition-all duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-[#D2AF94]/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <span className="font-light">contact@travelxec.com</span>
              </div>
              
              <div className="group flex items-center gap-4 text-[#A6B5B4] hover:text-[#D2AF94] transition-colors duration-300">
                <div className="relative">
                  <Clock className="h-5 w-5 transition-all duration-300 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-[#D2AF94]/30 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <span className="font-light">24/7 Customer Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="relative mt-20 pt-8">
          {/* Decorative divider */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#A6B5B4]/30 to-transparent"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-[#D2AF94] to-transparent"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[#A6B5B4] text-sm font-light">
              © {currentYear} TravelXec. All rights reserved.
            </p>
            <div className="flex items-center gap-8">
              <a href="/privacy-policy" className="text-[#A6B5B4] hover:text-[#D2AF94] text-sm font-light transition-colors duration-300 relative group">
                Privacy Policy
                <div className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-px bg-[#D2AF94] transition-all duration-300"></div>
              </a>
              <a href="/terms-and-conditions" className="text-[#A6B5B4] hover:text-[#D2AF94] text-sm font-light transition-colors duration-300 relative group">
                Terms of Service
                <div className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-px bg-[#D2AF94] transition-all duration-300"></div>
              </a>
              <a href="/cookie-policy" className="text-[#A6B5B4] hover:text-[#D2AF94] text-sm font-light transition-colors duration-300 relative group">
                Cookie Policy
                <div className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-px bg-[#D2AF94] transition-all duration-300"></div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom luxury accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D2AF94] to-transparent"></div>
    </footer>
  );
};

export default Footer;
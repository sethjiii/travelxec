"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Sparkles, MapPin, Heart, Plane } from "lucide-react";

const ThankYouPage = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(8);
  const [particles] = useState(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
    }))
  );

  useEffect(() => {
    // Enhanced confetti animation
    import("canvas-confetti").then((module) => {
      const confetti = module.default;

      // Initial burst
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D2AF94', '#A6B5B4', '#8C7361', '#ffffff'],
      });

      // Follow-up sparkle burst
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 45,
          origin: { y: 0.4 },
          colors: ['#D2AF94', '#ffffff'],
          shapes: ['star'],
        });
      }, 300);

      // Final gentle rain
      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 120,
          origin: { y: 0.3 },
          gravity: 0.5,
          colors: ['#D2AF94', '#A6B5B4'],
        });
      }, 800);
    });

    // Countdown timer
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 relative overflow-hidden"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dgbhkfp0r/image/upload/v1753618995/cppjtrzqjvnswkzifujb.avif')",
      }}
    >
      {/* Animated background particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-[#D2AF94]/30 rounded-full animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}

      {/* Floating icons */}
      <div className="absolute inset-0 pointer-events-none">
        <Plane className="absolute top-20 left-10 w-6 h-6 text-[#D2AF94]/40 animate-bounce" style={{ animationDelay: '0.5s' }} />
        <MapPin className="absolute top-32 right-16 w-5 h-5 text-[#A6B5B4]/40 animate-bounce" style={{ animationDelay: '1s' }} />
        <Heart className="absolute bottom-32 left-20 w-4 h-4 text-[#D2AF94]/40 animate-bounce" style={{ animationDelay: '1.5s' }} />
        <Sparkles className="absolute top-40 right-32 w-5 h-5 text-[#A6B5B4]/40 animate-bounce" style={{ animationDelay: '2s' }} />
      </div>

      {/* Main content card */}
      <div className="bg-gradient-to-br from-[#002D37]/90 via-[#002D37]/85 to-[#001B23]/90 backdrop-blur-xl max-w-lg w-full p-10 rounded-3xl shadow-2xl text-center text-white border border-[#D2AF94]/20 relative transform transition-all duration-1000 hover:scale-105">

        {/* Decorative corner elements */}
        <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-[#D2AF94]/30 rounded-tl-3xl"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-[#D2AF94]/30 rounded-br-3xl"></div>

        {/* Success icon with glow effect */}
        <div className="w-36 h-36 mx-auto mb-6 relative">
          <div className="absolute inset-0 bg-[#D2AF94]/20 rounded-full animate-ping"></div>
          <div className="absolute inset-2 bg-[#D2AF94]/10 rounded-full animate-pulse"></div>
          <CheckCircle className="w-full h-full text-[#D2AF94] relative z-10 drop-shadow-lg animate-pulse" />
        </div>

        {/* Main heading with gradient text */}
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-[#D2AF94] via-white to-[#A6B5B4] bg-clip-text text-transparent animate-pulse">
          Thank You!
        </h1>

        {/* Subtitle with typewriter effect simulation */}
        <div className="text-lg font-medium text-[#D2AF94] mb-6 animate-pulse">
          ✨ Message Received ✨
        </div>

        {/* Enhanced description */}
        <p className="text-[#A6B5B4] mb-8 leading-relaxed text-lg">
          Adventure awaits! We've received your message and can't wait to help you craft
          <span className="text-[#D2AF94] font-semibold"> unforgettable journeys</span>
          — stay tuned for travel magic!
        </p>

        {/* Premium button with enhanced styling */}
        <button
          className="group relative overflow-hidden bg-gradient-to-r from-[#D2AF94] to-[#B8956B] text-[#002D37] font-bold py-4 px-8 rounded-2xl transform transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-[#D2AF94]/25 focus:outline-none focus:ring-4 focus:ring-[#D2AF94]/30"
          onClick={() => router.push("/")}
        >
          <span className="absolute inset-0 bg-gradient-to-r from-[#B8956B] to-[#D2AF94] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <span className="relative flex items-center justify-center gap-2">
            <MapPin className="w-5 h-5" />
            Return to Adventures
          </span>
        </button>

        {/* Enhanced countdown with progress bar */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-center gap-2 text-sm text-[#A6B5B4]">
            <div className="w-2 h-2 bg-[#D2AF94] rounded-full animate-pulse"></div>
            <span>Redirecting in {countdown} seconds</span>
            <div className="w-2 h-2 bg-[#D2AF94] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-[#002D37]/50 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#D2AF94] to-[#A6B5B4] rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${((8 - countdown) / 8) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Decorative footer */}
        <div className="mt-6 flex justify-center items-center gap-2 text-[#8C7361] text-xs">
          <Heart className="w-3 h-3 animate-pulse" />
          <span>Preparing your next adventure</span>
          <Heart className="w-3 h-3 animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
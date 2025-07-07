'use client';

import { useEffect, useState } from "react";
import { Mail, Lock, Eye, EyeOff, Compass, MapPin } from "lucide-react";
import Link from "next/link";
import { Input } from "../../components/InputProps";
import { useAuth } from "../../../Auth/AuthProvider";
import { signIn, useSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const { login, user } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const newErrors: Record<string, string> = {};

    if (!formData.email || !formData.password) {
      newErrors.general = "Both fields are required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      await login(formData.email, formData.password);
    } catch (error) {
      setErrors({ general: "Invalid credentials. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden py-24">
      {/* 🔹 Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-60"
      >
        <source src="/hero-section.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 🔹 Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* 🔹 Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-[#002D37]/20 overflow-hidden border border-white/20">
        {/* Header */}
        <div className="relative h-52 bg-gradient-to-br from-[#002D37] via-[#186663] to-[#002D37] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#002D37]/90 to-[#186663]/80"></div>
          <div className="absolute top-6 right-6 opacity-20">
            <MapPin className="h-8 w-8 text-[#D2AF94] animate-pulse" />
          </div>
          <div className="absolute bottom-6 left-6 opacity-15">
            <div className="w-16 h-16 border-2 border-[#A6B5B4] rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border border-[#D2AF94] rounded-full"></div>
            </div>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
            <div className="relative mb-4">
              <Compass className="h-16 w-16 text-[#D2AF94] animate-spin" style={{ animationDuration: '8s' }} />
              <div className="absolute inset-0 bg-gradient-to-r from-[#A6B5B4] to-[#D2AF94] rounded-full opacity-20 blur-xl"></div>
            </div>
            <h1
              className="text-4xl font-bold text-[#d2af94] text-center mb-2"
              style={{
                fontFamily: 'League Spartan, sans-serif',
                letterSpacing: '-1.5px',  // Reduce letter spacing
                lineHeight: '1.2',        // Adjust line height to make the lines tighter
              }}
            >
              travelxec
            </h1>
            <h2 className="text-xl font-semibold text-[#A6B5B4] text-center mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Welcome
            </h2>
            <p className="text-[#A6B5B4]/80 text-center text-sm font-light tracking-wide">
              Continue your luxury journey
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-8 pt-10">
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm text-center">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Input
                icon={Mail}
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
                error={errors.email}
              />
            </div>

            <div className="relative">
              <Input
                icon={Lock}
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                error={errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#8C7361] hover:text-[#186663] transition-colors duration-200"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center group cursor-pointer">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-[#186663]" />
                <span className="ml-3 text-[#8C7361] group-hover:text-[#002D37] transition-colors duration-200">
                  Remember me
                </span>
              </label>
              <a href="#" className="text-[#186663] hover:text-[#002D37] font-medium hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#002D37] via-[#186663] to-[#002D37] text-white py-4 px-6 rounded-xl hover:shadow-2xl hover:shadow-[#186663]/30 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-semibold tracking-wide border border-[#186663]/20 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#186663] to-[#002D37] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">
                {isLoading ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#A6B5B4]/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[#8C7361]">or</span>
              </div>
            </div>

            {/* 🔹 Google Login Button */}
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => signIn("google")}
                className="flex items-center gap-3 px-6 py-3 border border-[#A6B5B4] rounded-xl text-[#002D37] hover:bg-[#002D37] hover:text-white transition-all duration-300 shadow-sm bg-white"
              >
                <FcGoogle className="text-xl" />
                <span className="text-sm font-medium">Continue with Google</span>
              </button>
            </div>

            {/* Sign up */}
            <p className="mt-6 text-[#8C7361]">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-[#186663] hover:text-[#002D37] font-semibold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

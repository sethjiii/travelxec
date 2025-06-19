"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, Phone, Sparkles, Globe } from 'lucide-react';
import { Input } from "../../components/InputProps";
import Link from 'next/link';
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newErrors: Record<string, string> = {};
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        })
      });

      if (response.ok) {
        const data = await response.json();
        router.push("/auth/login");
        console.log('Registration successful', data);
      } else {
        const data = await response.json();
        setErrors({ general: data.message || 'Something went wrong. Please try again.' });
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setErrors({ general: 'Something went wrong. Please try again.' });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#002D37] via-[#186663] to-[#002D37]"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-[#8C7361]/10 via-transparent to-[#D2AF94]/10"></div>
        <div className="absolute top-20 left-10 w-56 h-56 bg-[#D2AF94]/5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-[#186663]/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-[#A6B5B4]/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl">
          <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

            {/* Header */}
            <div className="relative px-6 py-10 text-center border-b border-white/10">
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D2AF94] to-[#8C7361] flex items-center justify-center shadow-xl">
                    <Globe className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[#D2AF94]/20 to-[#8C7361]/20 blur-xl"></div>
                  <Sparkles className="absolute -top-2 -right-2 h-5 w-5 text-[#D2AF94] animate-pulse" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-[#D2AF94] to-white bg-clip-text text-transparent mb-2">
                Join TravelXec
              </h1>
              <p className="text-white/70 text-base max-w-xs mx-auto leading-relaxed">
                Begin your journey with our premium experiences
              </p>
            </div>

            {/* Form */}
            <div className="relative px-6 py-8 md:px-8 md:py-10">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input icon={User} type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required error={errors.fullName} />
                  <Input icon={Mail} type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required error={errors.email} />
                  <Input icon={Phone} type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required error={errors.phone} />
                  
                  {/* Password */}
                  <div className="relative">
                    <Input icon={Lock} type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" value={formData.password} onChange={handleChange} required error={errors.password} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-[#D2AF94]">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {/* Confirm Password */}
                  <Input icon={Lock} type={showPassword ? 'text' : 'password'} name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required error={errors.confirmPassword} />
                </div>

                {/* Error */}
                {errors.general && (
                  <p className="text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-center">
                    {errors.general}
                  </p>
                )}

                {/* Submit */}
                <div className="pt-2">
                  <button type="submit" disabled={isLoading} className="relative w-full group overflow-hidden rounded-xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#D2AF94] to-[#8C7361] group-hover:from-[#8C7361] group-hover:to-[#D2AF94] transition-all duration-300"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#D2AF94]/20 to-[#8C7361]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center gap-2 py-3 px-6 text-white font-medium text-base">
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5" />
                          Begin Your Journey
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </form>

              {/* Login Redirect */}
              <div className="mt-6 text-center text-sm text-white/70">
                <span>Already a member? </span>
                <Link href="/auth/login" className="text-[#D2AF94] hover:text-white transition-all">
                  Sign in to your account
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center mt-4 text-white/40 text-xs leading-snug">
            By joining TravelXec, you’re choosing premium travel experiences
          </p>
        </div>
      </div>
    </div>
  );
}
// This code is a complete SignUpPage component for a travel website, including form handling, validation, and UI elements.
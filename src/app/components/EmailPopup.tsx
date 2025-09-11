"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import toast from "react-hot-toast";

export default function EmailPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(true);

  // Show popup after 5s
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent }),
      });

      if (res.ok) {
        toast.success("Thanks for subscribing!");
        setIsOpen(false);
        setEmail("");
      } else {
        toast.error("Something went wrong.");
      }
    } catch (err) {
      toast.error("Network error!");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      {/* Modal content */}
      <div className="relative bg-white rounded-lg p-8 max-w-lg w-full mx-auto shadow-2xl text-center">
        {/* Logo / Heading */}
        <Dialog.Title className="text-2xl font-bold tracking-wide text-gray-900 uppercase">
          TravelXec
        </Dialog.Title>

        {/* Description */}
        <Dialog.Description className="mt-4 text-lg font-semibold text-gray-800">
          Get exclusive travel deals and updates
        </Dialog.Description>
        <p className="text-gray-600 mt-1">
          Subscribe to our newsletter and start your premium journey today.
        </p>

        {/* Checkbox */}
        <div className="flex items-center gap-2 justify-center mt-4 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={consent}
            onChange={() => setConsent(!consent)}
            className="h-4 w-4 accent-teal-700"
          />
          <span>I’d like to also receive information about special offers.</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
          />

          <button
            type="submit"
            className="w-full py-3 bg-[#002D37] text-white font-semibold rounded-md hover:bg-[#186663] transition"
          >
            Get the Newsletter
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full py-3 bg-gray-100 text-gray-500 font-semibold rounded-md hover:bg-gray-200 transition"
          >
            I’m not interested
          </button>
        </form>

        {/* Close button (top right corner) */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
    </Dialog>
  );
}

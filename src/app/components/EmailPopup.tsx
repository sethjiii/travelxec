"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import toast from "react-hot-toast";
// import ReCAPTCHA from "react-google-recaptcha";

export default function EmailPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [consent, setConsent] = useState(true);
  // const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  // Show popup after 7s
  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 7000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // if (!captchaToken) {
    //   toast.error("Please complete the reCAPTCHA.");
    //   return;
    // }

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
          // token: captchaToken,
        }),
      });

      if (res.ok) {
        toast.success("Thanks for sharing your trip details!");
        setIsOpen(false);
        setName("");
        setEmail("");
        setPhone("");
        setDestination("");
        setBudget("");
        // setCaptchaToken(null);
      } else {
        const { error } = await res.json();
        toast.error(error || "Something went wrong.");
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

      {/* Modal */}
      <div className="relative bg-white rounded-lg p-8 max-w-lg w-full mx-auto shadow-2xl text-center">
        <Dialog.Description className="mt-4 text-lg font-semibold text-gray-800">
          Dreaming of your next trip? Let us make it happen!
        </Dialog.Description>
        <p className="text-gray-600 mt-1">
          A few details from you, a dream escape crafted by us.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Full Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-md"
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="Phone Number"
            className="w-full px-4 py-3 border border-gray-300 rounded-md"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email Address"
            className="w-full px-4 py-3 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
            placeholder="Destination (Paris, Bali, etc.)"
            className="w-full px-4 py-3 border border-gray-300 rounded-md"
          />
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
            placeholder="Budget (e.g. 50000)"
            className="w-full px-4 py-3 border border-gray-300 rounded-md"
          />

          {/* reCAPTCHA
          <div className="flex justify-center mt-4">
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              onChange={(token: string | null) => setCaptchaToken(token)}
            />
          </div> */}

          <div className="flex items-center gap-2 justify-center mt-4 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={consent}
              onChange={() => setConsent(!consent)}
              className="h-4 w-4 accent-teal-700"
            />
            <span>
              I’d like to receive information about special offers and newsletters.
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#002D37] text-white font-semibold rounded-md hover:bg-[#186663] transition"
          >
            Submit
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full py-3 bg-gray-100 text-gray-500 font-semibold rounded-md hover:bg-gray-200 transition"
          >
            I’m not interested
          </button>
        </form>

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

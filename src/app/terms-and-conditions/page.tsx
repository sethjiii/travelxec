import React from "react";
import Footer from "../components/FooterContent";

export default function TermsAndConditionsPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-24 text-[#002D37]">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#186663]">
        Terms & Conditions
      </h1>
      <p className="text-sm text-gray-500 mb-8">Effective Date: 1st July 2025</p>

      <section className="space-y-6 text-base leading-relaxed">
        <p>
          Welcome to TravelXec. These Terms and Conditions (“Terms”) govern your
          access to and use of our website, services, and travel-related
          offerings. By using our website or making a booking with us, you agree
          to be bound by these Terms in full.
        </p>

        <h2 className="text-2xl font-semibold text-[#8C7361]">1. Scope of Services</h2>
        <p>
          TravelXec offers curated travel itineraries, planning assistance, and
          booking facilitation. Services include accommodations, transport,
          tours, and experiences. All are subject to availability, seasonal
          constraints, and vendor-specific policies.
        </p>

        <h2 className="text-2xl font-semibold text-[#8C7361]">2. Eligibility and User Responsibility</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>You are 18+ and legally competent to contract.</li>
          <li>You provide accurate and current booking information.</li>
          <li>You’re responsible for travelers in your booking group.</li>
          <li>
            You comply with destination laws, visas, and travel requirements.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-[#8C7361]">3. Booking, Payment & Confirmation</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Bookings are confirmed upon payment.</li>
          <li>Prices may change due to availability or exchange rates.</li>
          <li>Changes post-confirmation may incur extra charges.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-[#8C7361]">4. Cancellations & Refunds</h2>
        <p className="font-semibold">A. Fixed Departure Group Tours</p>
        <ul className="list-disc list-inside space-y-1">
          <li>30+ days: 80% refund</li>
          <li>15–29 days: 50% refund</li>
          <li>7–14 days: 25% refund</li>
          <li>&lt;7 days or no-show: No refund</li>
        </ul>

        <p className="font-semibold mt-4">B. Customized Private Itineraries</p>
        <ul className="list-disc list-inside space-y-1">
          <li>21+ days: Up to 60–70% refund</li>
          <li>&lt;21 days: Based on provider policies</li>
        </ul>

        <p className="font-semibold mt-4">C. Houseboats / Special Bookings</p>
        <ul className="list-disc list-inside space-y-1">
          <li>15+ days: 50% refund</li>
          <li>&lt;15 days: Non-refundable</li>
        </ul>

        <p className="font-semibold mt-4">D. Force Majeure</p>
        <p>
          No guaranteed refunds, but we’ll try to offer credits/postponements
          if possible.
        </p>

        <p className="font-semibold mt-4">E. Refund Processing</p>
        <p>
          Processed in 7–10 business days (minus deductions) to the original
          payment method.
        </p>

        <h2 className="text-2xl font-semibold text-[#8C7361]">5. Modifications and Substitutions</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>We may modify itineraries or accommodations due to necessity.</li>
          <li>
            Replacements will be of equal or greater value where possible.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-[#8C7361]">6. Travel Insurance and Risk</h2>
        <p>
          Comprehensive travel insurance is strongly recommended. Travel
          involves risks (weather, terrain, etc.) — you acknowledge and accept
          these by booking with us.
        </p>

        <h2 className="text-2xl font-semibold text-[#8C7361]">7. Limitation of Liability</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>No liability for third-party failures or natural disasters.</li>
          <li>Max liability = amount paid by you to TravelXec.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-[#8C7361]">8. Intellectual Property</h2>
        <p>
          All content on this website is owned by TravelXec. Reuse or
          redistribution is prohibited.
        </p>

        <h2 className="text-2xl font-semibold text-[#8C7361]">9. Governing Law</h2>
        <p>
          These terms are governed by the laws of India. Disputes fall under the
          jurisdiction of Gurgaon, Haryana courts.
        </p>

        <h2 className="text-2xl font-semibold text-[#8C7361]">10. Changes to Terms</h2>
        <p>
          We may update these terms anytime. New versions will be published on
          this page.
        </p>

        <h2 className="text-2xl font-semibold text-[#8C7361]">11. Contact Information</h2>
        <p>
          TravelXec <br />
          Email: <a href="mailto:contact@travelxec.com" className="text-[#186663] underline">contact@travelxec.com</a><br />
          Phone: 9667909383 <br />
          Address: 114, Pyramid Urban Square, Sector 67A, Gurgaon, Haryana,
          India, 122102
        </p>
      </section>
    </main>
      <footer className="w-full bg-gradient-to-r from-transparent via-[#D2AF94] to-transparent mt-8 sm:mt-0">
        <Footer />
      </footer>
  );
}

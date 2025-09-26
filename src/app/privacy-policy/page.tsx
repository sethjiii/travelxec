'use client';

import React from "react";
import Footer from "../components/FooterContent";

export default function PrivacyPolicyPage() {
  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-24 text-[#002D37]">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

        <p className="mb-4">
          At <strong>TravelXec</strong>, we are committed to protecting your privacy. This Privacy Policy outlines how we
          collect, use, disclose, and protect your personal information when you use our website and services.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li><strong>Personal Information:</strong> Name, email address, phone number, nationality, travel preferences, and booking details.</li>
          <li><strong>Payment Information:</strong> Billing and payment details through secure third-party gateways.</li>
          <li><strong>Device & Usage Data:</strong> IP address, browser type, device info, and site usage analytics.</li>
          <li><strong>Communication Data:</strong> Feedback or correspondence via forms, email, or chat.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Provide and manage bookings or inquiries</li>
          <li>Send updates, itineraries, and confirmations</li>
          <li>Improve our website and services</li>
          <li>Respond to queries or feedback</li>
          <li>Send marketing materials (with your consent)</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">3. How We Share Your Information</h2>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Trusted third parties (e.g., hotel partners, travel agents, payment processors)</li>
          <li>Service providers helping us operate the website</li>
          <li>Legal or regulatory authorities when required</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">4. Your Rights</h2>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Access and review your data</li>
          <li>Request corrections or updates</li>
          <li>Withdraw marketing consent</li>
          <li>Request deletion of personal data (subject to legal obligations)</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2">5. Data Security</h2>
        <p className="mb-4">
          This Privacy Policy describes how Ashish Trivedi and its affiliates (collectively "Ashish Trivedi, we, our, us") collect, use, share, protect or otherwise process your information/ personal data through our website https://travelxec.com/ (hereinafter referred to as Platform). Please note that you may be able to browse certain sections of the Platform without registering with us. We do not offer any product/service under this Platform outside India and your personal data will primarily be stored and processed in India. By visiting this Platform, providing your information or availing any product/service offered on the Platform, you expressly agree to be bound by the terms and conditions of this Privacy Policy, the Terms of Use and the applicable service/product terms and conditions, and agree to be governed by the laws of India including but not limited to the laws applicable to data protection and privacy. If you do not agree please do not use or access our Platform.

          We implement reasonable security measures to protect your data. However, no platform can guarantee absolute security.
          Please use the internet with caution.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">6. Cookies Policy</h2>
        <p className="mb-4">
          Our website uses cookies to improve user experience and serve relevant content. You can control cookie settings via your browser.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">7. Third-Party Links</h2>
        <p className="mb-4">
          Our site may contain links to third-party websites. We are not responsible for their privacy practices or content.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">8. Updates to This Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy. The latest version will be posted on this page with a new effective date.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">9. Contact Us</h2>
        <p className="mb-1"><strong>TravelXec</strong></p>
        <p>Email: <a href="mailto:contact@travelxec.com" className="text-blue-600">contact@travelxec.com</a></p>
        <p>Phone: +91-9910583345</p>
        <p>Address 1: 114, Pyramid Urban Square, Sector 67A, Gurgaon, Haryana, India, 122102</p>
        <p>Address 2: 1229, Basement, Block-C Gurugram Sushant Lok Ph-I, Gurgaon, India - 122002</p>
      </div>

      <footer className="w-full bg-gradient-to-r from-transparent via-[#D2AF94] to-transparent mt-8 sm:mt-0">
        <Footer />
      </footer>
    </>
  );
}

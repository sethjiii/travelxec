import React from "react";
import Footer from "../components/FooterContent";

export default function TermsAndConditionsPage() {
  return (
    <>
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

          <h2 className="text-2xl font-semibold text-[#8C7361]">
            2. Eligibility and User Responsibility
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>You are 18+ and legally competent to contract.</li>
            <li>You provide accurate and current booking information.</li>
            <li>You’re responsible for travelers in your booking group.</li>
            <li>You comply with destination laws, visas, and travel requirements.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-[#8C7361]">
            3. Booking, Payment & Confirmation
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Bookings are confirmed upon payment.</li>
            <li>Prices may change due to availability or exchange rates.</li>
            <li>Changes post-confirmation may incur extra charges.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-[#8C7361]">
            4. Cancellations & Refunds
          </h2>
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

          <h2 className="text-2xl font-semibold text-[#8C7361]">
            5. Modifications and Substitutions
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>We may modify itineraries or accommodations due to necessity.</li>
            <li>Replacements will be of equal or greater value where possible.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-[#8C7361]">
            6. Travel Insurance and Risk
          </h2>
          <p>
            Comprehensive travel insurance is strongly recommended. Travel
            involves risks (weather, terrain, etc.) — you acknowledge and accept
            these by booking with us.
          </p>

          <h2 className="text-2xl font-semibold text-[#8C7361]">
            7. Limitation of Liability
          </h2>
          <ul className="list-disc list-inside space-y-1">
            <li>No liability for third-party failures or natural disasters.</li>
            <li>Max liability = amount paid by you to TravelXec.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-[#8C7361]">
            8. Intellectual Property
          </h2>
          <p>
            All content on this website is owned by TravelXec. Reuse or
            redistribution is prohibited.
          </p>

          <h2 className="text-2xl font-semibold text-[#8C7361]">
            9. Governing Law
          </h2>
          <p>
            These terms are governed by the laws of India. Disputes fall under the
            jurisdiction of Gurgaon, Haryana courts.
          </p>

          <h2 className="text-2xl font-semibold text-[#8C7361]">
            10. Changes to Terms
          </h2>
          <p>
            We may update these terms anytime. New versions will be published on
            this page.
          </p>

          <h2 className="text-2xl font-semibold text-[#8C7361]">
            11. Contact Information
          </h2>
          <p>
            TravelXec <br />
            Email:{" "}
            <a
              href="mailto:contact@travelxec.com"
              className="text-[#186663] underline"
            >
              contact@travelxec.com
            </a>
            <br />
            Phone: 9910583345 <br />
            Address 1: 114, Pyramid Urban Square, Sector 67A, Gurgaon, Haryana,
            India, 122102

            Address 2: 1229, Basement, Block-C Gurugram Sushant Lok Ph-I,
            Gurgaon, India - 122002
          </p>

          {/* --- Extra Legal Boilerplate --- */}
          <div className="mt-12 p-6 bg-[#D2AF94]/20 border-l-4 border-[#8C7361] rounded">
            <p className="text-sm leading-relaxed text-gray-800">
              This document is an electronic record in terms of the Information
              Technology Act, 2000 and rules made thereunder, as applicable, and
              the amended provisions pertaining to electronic records in various
              statutes as amended by the Information Technology Act, 2000. This
              electronic record is generated by a computer system and does not
              require any physical or digital signatures.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gray-800">
              This document is published in accordance with the provisions of Rule
              3 (1) of the Information Technology (Intermediaries Guidelines)
              Rules, 2011 that require publishing the rules and regulations,
              privacy policy, and Terms of Use for access or usage of domain name{" "}
              <a
                href="https://travelxec.com"
                className="text-[#186663] underline"
              >
                https://travelxec.com
              </a>{" "}
              (“Website”), including the related mobile site and mobile
              application (hereinafter referred to as “Platform”).
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gray-800">
              The Platform is owned by <strong>Ashish Trivedi</strong>, a company
              incorporated under the Companies Act, 1956 with its registered
              office at 1229, Basement, Block-C Gurugram Sushant Lok Ph-I,
              Gurgaon, India (hereinafter referred to as “Platform Owner,” “we,”
              “us,” or “our”).
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gray-800">
              Your use of the Platform and its services and tools are governed by
              these Terms of Use, along with applicable policies incorporated
              herein by reference. By using the Platform, you contract with the
              Platform Owner, and these terms constitute your binding obligations
              with the Platform Owner.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gray-800">
              ACCESSING, BROWSING OR OTHERWISE USING THE PLATFORM INDICATES YOUR
              AGREEMENT TO ALL THE TERMS AND CONDITIONS UNDER THESE TERMS OF USE,
              SO PLEASE READ THEM CAREFULLY BEFORE PROCEEDING.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gray-800">
              You shall indemnify and hold harmless the Platform Owner, its
              affiliates, officers, directors, agents, and employees, from any
              claim, demand, or penalty arising out of your breach of these Terms
              of Use, Privacy Policy, other policies, or applicable laws.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-gray-800">
              These Terms shall be governed by the laws of India. All disputes
              shall be subject to the exclusive jurisdiction of the courts in
              Gurgaon, Haryana.
            </p>
          </div>
        </section>
      </main>

      <footer className="w-full bg-gradient-to-r from-transparent via-[#D2AF94] to-transparent mt-8 sm:mt-0">
        <Footer />
      </footer>
    </>
  );
}

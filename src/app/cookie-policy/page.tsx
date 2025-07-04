import React from "react";

export default function CookiePolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-24 text-[#002D37]">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#186663]">
        Cookie Policy
      </h1>
      <p className="text-sm text-gray-500 mb-8">Effective Date: 1st July 2025</p>

      <section className="space-y-6 text-base leading-relaxed">
        <p>
          This Cookie Policy explains how TravelXec uses cookies and similar
          technologies when you visit our website. By using our site, you agree
          to the use of cookies as outlined in this policy.
        </p>

        <h2 className="text-2xl font-semibold text-[#8C7361]">1. What Are Cookies?</h2>
        <p>
          Cookies are small data files stored on your browser or device when you
          visit a website. They help the site remember your actions and
          preferences (like login, language, and other display settings) over a
          period of time.
        </p>

        <h2 className="text-2xl font-semibold text-[#8C7361]">2. Types of Cookies We Use</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <strong>Essential Cookies:</strong> These are necessary for the website
            to function and cannot be switched off in our systems.
          </li>
          <li>
            <strong>Performance Cookies:</strong> These help us understand how
            visitors interact with the website by collecting anonymous data.
          </li>
          <li>
            <strong>Functionality Cookies:</strong> These remember choices you make
            (like preferred language or region) to provide a better experience.
          </li>
          <li>
            <strong>Advertising Cookies:</strong> These may be set by third-party
            advertisers to show you relevant ads across websites.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-[#8C7361]">3. Third-Party Cookies</h2>
        <p>
          We may use third-party services such as Google Analytics, Facebook
          Pixel, or similar tools to measure traffic and user engagement.
          Third-party cookies are governed by their own privacy policies.
        </p>

        <h2 className="text-2xl font-semibold text-[#8C7361]">4. Managing Cookies</h2>
        <p>
          You can control or delete cookies through your browser settings. Most
          browsers allow you to:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>View and delete stored cookies</li>
          <li>Block third-party cookies</li>
          <li>Block all cookies from specific websites</li>
          <li>Block all cookies altogether (may affect site functionality)</li>
        </ul>

        {/* <p>
          To learn more about how to manage cookies in your browser, visit:
          <br />
          <a
            href="https://www.allaboutcookies.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#186663] underline"
          >
            www.allaboutcookies.org
          </a>
        </p> */}

        <h2 className="text-2xl font-semibold text-[#8C7361]">5. Updates to This Policy</h2>
        <p>
          We may update this Cookie Policy from time to time to reflect changes
          in law or website functionality. Updated versions will be posted on
          this page with the latest effective date.
        </p>

        <h2 className="text-2xl font-semibold text-[#8C7361]">6. Contact Us</h2>
        <p>
          If you have any questions or concerns about our use of cookies, please
          contact:
        </p>
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
          Phone: 9667909383 <br />
          Address: 114, Pyramid Urban Square, Sector 67A, Gurgaon, Haryana,
          India, 122102
        </p>
      </section>
    </main>
  );
}

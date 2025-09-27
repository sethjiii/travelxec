// src/app/refund-cancellation/page.tsx
"use client";

import React from "react";

const RefundCancellationPage = () => {
  return (
    <div className="bg-[#F9FAFA] min-h-screen py-12 px-6 lg:px-20">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-[#002D37] mb-6">
          Refund & Cancellation Policy
        </h1>

        <p className="text-base text-gray-700 mb-6">
          This Refund and Cancellation Policy explains how you can cancel a
          booking or request a refund for products or services purchased through
          the <strong>TravelXec Platform (“TravelXec” / “TX”)</strong>, operated
          by <strong>Ashish Trivedi (“we” / “our”)</strong>.
        </p>

        {/* Section 1 */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-[#186663] mb-2">
            1. Order Cancellations
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>
              Cancellation requests must be made{" "}
              <strong>within 1 day of placing the order</strong>.
            </li>
            {/* <li>
              Cancellations may not be accepted if the order has already been
              communicated to the seller/merchant and shipping has started, or
              the product/service is out for delivery.
            </li>
            <li>
              In such cases, you may <strong>reject the product at delivery</strong>.
            </li> */}
          </ul>
        </section>

        {/* Section 2 */}
        {/* <section className="mb-6">
          <h2 className="text-xl font-semibold text-[#186663] mb-2">
            2. Exceptions to Cancellation
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>
              Cancellations will <strong>not</strong> be accepted for perishable
              items such as food, flowers, or similar products.
            </li>
            <li>
              Refunds or replacements may still be provided if you can establish
              that the quality of the delivered product is not satisfactory.
            </li>
          </ul>
        </section> */}

        {/* Section 3 */}
        {/* <section className="mb-6">
          <h2 className="text-xl font-semibold text-[#186663] mb-2">
            3. Damaged or Defective Products
          </h2>
          <p className="text-gray-700">
            If you receive a damaged or defective item, please report it to our
            customer service team <strong>within 1 day of receipt</strong>. The
            request will be processed only after the seller/merchant verifies
            the claim.
          </p>
        </section> */}

        {/* Section 4 */}
        {/* <section className="mb-6">
          <h2 className="text-xl font-semibold text-[#186663] mb-2">
            4. Product Not as Expected
          </h2>
          <p className="text-gray-700">
            If the delivered product does not match the description or your
            expectations, notify our customer service{" "}
            <strong>within 1 day of receipt</strong>. After reviewing your
            complaint, our team will take an appropriate decision
            (refund/replacement, if applicable).
          </p>
        </section> */}

        {/* Section 5 */}
        {/* <section className="mb-6">
          <h2 className="text-xl font-semibold text-[#186663] mb-2">
            5. Manufacturer Warranty
          </h2>
          <p className="text-gray-700">
            For products covered under a manufacturer’s warranty, please contact
            the manufacturer directly for service or replacement.
          </p>
        </section> */}

        {/* Section 6 */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-[#186663] mb-2">6. Refunds</h2>
          <p className="text-gray-700">
            Once approved by <strong>Ashish Trivedi / TravelXec</strong>,
            refunds will be initiated within{" "}
            <strong>10 working days</strong> and credited to the original
            payment method used during booking/purchase.
          </p>
        </section>

        {/* Footer Note */}
        <div className="mt-10 p-4 bg-[#D2AF94]/20 border-l-4 border-[#8C7361] rounded">
          <p className="text-sm text-gray-800">
            For further assistance, please contact our customer service team via
            the <strong>TravelXec Support Center</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefundCancellationPage;

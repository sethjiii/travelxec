import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.zoho.in", // Use smtp.zoho.com for global users
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER, // your@travelxec.com
    pass: process.env.EMAIL_PASS, // app-specific password from Zoho
  },
});

// 1. Welcome Email
export const sendWelcomeEmail = async (to: string, name: string) => {
  const html = `
    <div style="font-family:sans-serif; padding:32px; background:#fffaf6; border-radius:12px; border:1px solid #eee; max-width:600px; margin:auto;">
      <h2 style="color:#186663;">Welcome to <span style="color:#D2AF94;">TravelXec</span>, ${name}!</h2>
      <p>We're thrilled to have you on board. Get ready to explore tailor-made travel experiences.</p>
      <p><a href="https://travelxec.com/packages" style="color:#8C7361;">Explore Packages</a></p>
      <hr style="margin-top:24px; border:none; border-top:1px solid #ccc;" />
      <p style="font-size:13px; color:#999;">© ${new Date().getFullYear()} TravelXec. All rights reserved.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"TravelXec" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🎉 Welcome to TravelXec!",
    html,
  });
};

// 2. Booking Confirmation Email
export const sendBookingConfirmationEmail = async (to: string, name: string, bookingDetails: any) => {
  const html = `
    <div style="font-family:sans-serif; padding:32px; background:#f9f9f9; border-radius:12px; border:1px solid #e0e0e0; max-width:600px; margin:auto;">
      <h2 style="color:#186663;">Booking Confirmed, ${name}!</h2>
      <p>Thank you for booking your trip with <strong>TravelXec</strong>.</p>
      <h3 style="color:#8C7361;">Your Booking Details:</h3>
      <ul>
        <li><strong>Destination:</strong> ${bookingDetails.destination}</li>
        <li><strong>Dates:</strong> ${bookingDetails.fromDate} to ${bookingDetails.toDate}</li>
        <li><strong>Guests:</strong> ${bookingDetails.guests}</li>
        <li><strong>Budget:</strong> ₹${bookingDetails.budget}</li>
      </ul>
      <p>We will reach out with more updates soon. Meanwhile, feel free to contact us if you have any questions.</p>
      <hr style="margin-top:24px; border:none; border-top:1px solid #ccc;" />
      <p style="font-size:13px; color:#999;">TravelXec | contact@travelxec.com | +91 9667909383</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"TravelXec" <${process.env.EMAIL_USER}>`,
    to,
    subject: "📄 Your Booking with TravelXec is Confirmed!",
    html,
  });
};

// 3. Newsletter Subscription Confirmation Email
export const sendNewsletterConfirmationEmail = async (to: string) => {
  const html = `
    <div style="font-family:sans-serif; padding:32px; background:#fffefc; border-radius:12px; border:1px solid #eee; max-width:600px; margin:auto;">
      <h2 style="color:#186663;">You're in! 🎉</h2>
      <p>Thanks for subscribing to <strong>TravelXec</strong>'s newsletter.</p>
      <p>Expect curated travel tips, exclusive offers, and destination guides—delivered right to your inbox.</p>
      <p><a href="https://travelxec.com" style="color:#D2AF94; text-decoration:none;">Visit TravelXec</a></p>
      <hr style="margin-top:24px; border:none; border-top:1px solid #ccc;" />
      <p style="font-size:13px; color:#999;">You can unsubscribe at any time.</p>
      <p style="font-size:13px; color:#999;">© ${new Date().getFullYear()} TravelXec. All rights reserved.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"TravelXec" <${process.env.EMAIL_USER}>`,
    to,
    subject: "✅ You're Subscribed to TravelXec!",
    html,
  });
};

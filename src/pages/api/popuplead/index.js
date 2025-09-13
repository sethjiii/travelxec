import dbConnect from "../dbConnect";
import PopUpLead from "../../../models/PopUpLead";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  await dbConnect();

  try {
    const { name, email, phone, destination, budget, token } = req.body;

    // --- Validation ---
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required." });
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return res.status(400).json({ error: "Invalid email address." });
    }

    // --- Save or Update in DB ---
    const result = await PopUpLead.findOneAndUpdate(
      { email }, // search by email
      { name, email, phone, destination, budget }, // update fields
      { new: true, upsert: true, setDefaultsOnInsert: true } // create if not found
    );

    // --- Configure Zoho Mail ---
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.in", // use smtp.zoho.com if not India region
      port: 465,
      secure: true,
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASS,
      },
    });

    // --- Send Email Notification ---
    await transporter.sendMail({
      from: `"TravelXec Leads" <${process.env.ADMIN_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      replyTo: email,
      subject: "New TravelXec Lead Submitted Through PopUp Lead Form",
      text: `
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Destination: ${destination}
      Budget: ${budget}
      `,
    });

    res.status(200).json({
      message: "Lead saved/updated and emailed successfully!",
      lead: result,
    });
  } catch (err) {
    console.error("Popup Lead Error:", err);
    res.status(500).json({ error: "Error saving lead" });
  }
}
// Note: reCAPTCHA verification can be added here if needed
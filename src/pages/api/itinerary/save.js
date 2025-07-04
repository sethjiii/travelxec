import dbConnect from '../dbConnect';
import Itinerary from '../../../models/Itinerary';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  await dbConnect();

  try {
    const data = req.body;

    // Save to DB
    const saved = await Itinerary.create(data);

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASS,
      },
    });

    await transporter.sendMail({
      from: data.email,
      to: process.env.ADMIN_EMAIL,
      subject: 'New TravelXec Itinerary Submitted',
      text: `
      Name: ${data.firstName} ${data.lastName}
      Email: ${data.email}
      Phone: ${data.phone}
      Destinations: ${data.destinations}
      Dates: ${data.startDate} → ${data.endDate} (${data.duration} days)
      Budget: ${data.budget}
      Requirements: ${data.specialRequirements}
      `,
    });

    res.status(200).json({ message: 'Saved and emailed successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error saving itinerary' });
  }
}

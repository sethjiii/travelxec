import dbConnect from '../../dbConnect';
import Booking from '../../../../models/Bookings';
import User from '@/models/user';
import { getUserFromRequest } from '@/lib/getUserFromRequest';
import { sendBookingConfirmationEmail } from '@/lib/mail'; // ✅ Add this

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    await dbConnect();

    const user = await getUserFromRequest(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { bookingData } = req.body;
    const { priceRange, totalAmount, ...rest } = bookingData;

    // ✅ Validate priceRange
    if (
      !priceRange ||
      typeof priceRange.min !== 'number' ||
      typeof priceRange.max !== 'number' ||
      priceRange.min < 0 ||
      priceRange.max < priceRange.min
    ) {
      return res.status(400).json({ error: 'Invalid priceRange format' });
    }

    // ✅ Lookup actual MongoDB ObjectId from email
    const dbUser = await User.findOne({ email: user.email });
    if (!dbUser) {
      return res.status(404).json({ error: 'User not found in DB' });
    }

    // ✅ Create booking
    const newBooking = new Booking({
      ...rest,
      userId: dbUser._id,
      priceRange,
    });

    const savedBooking = await newBooking.save();

    // ✅ Send confirmation email
    await sendBookingConfirmationEmail(
      dbUser.email,
      dbUser.name || 'Guest User',
      {
        destination: savedBooking.destination || 'Not specified',
        date: savedBooking.preferredDepartureDate || 'Not specified',
        guests: savedBooking.guests?.length || 1,
        budget: `${priceRange.min} - ${priceRange.max}`,
      }
    );

    return res.status(201).json({
      bookingId: savedBooking._id.toString(),
      userId: savedBooking.userId.toString(),
    });
  } catch (error) {
    console.error('❌ Error creating booking:', error);
    return res.status(500).json({ error: 'Error creating booking' });
  }
}
// This code handles booking creation, validates input, and sends a confirmation email.
// It uses MongoDB for data storage and includes error handling for various scenarios.
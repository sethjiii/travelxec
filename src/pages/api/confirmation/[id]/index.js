import dbConnect from "../../dbConnect"; // Mongoose connection
import Booking from "../../../../models/Bookings"; // Your Booking model

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await dbConnect();

    const { bookingData, userId } = req.body;

    if (!userId || !bookingData) {
      return res.status(400).json({ error: "Missing userId or bookingData" });
    }

    // Clean unwanted fields just in case (e.g. totalAmount)
    const {
      totalAmount, // ❌ destructure to discard it
      ...filteredBookingData
    } = bookingData;

    // Create new booking
    const newBooking = new Booking({
      ...filteredBookingData,
      userId,
    });

    const savedBooking = await newBooking.save();

    return res.status(201).json({
      bookingId: savedBooking._id.toString(),
      userId: savedBooking.userId.toString(),
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return res.status(500).json({ error: "Error creating booking" });
  }
}

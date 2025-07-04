import dbConnect from '../../dbConnect';
import Booking from '@/models/Bookings';
import User from '@/models/user';
import { getUserFromRequest } from '@/lib/getUserFromRequest';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    await dbConnect();

    // ✅ Use centralized auth
    const authUser = await getUserFromRequest(req);
    console.log("🔐 Authenticated user:", authUser);

    if (!authUser) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // ✅ Fetch user record to get ObjectId
    const user = await User.findOne({ email: authUser.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // ✅ Fetch bookings using user's ObjectId
    const bookings = await Booking.find({ userId: user._id })
      .populate('packageId')
      .populate('userId')
      .lean();

    return res.status(200).json(bookings);
  } catch (error) {
    console.error('❌ Error fetching bookings:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

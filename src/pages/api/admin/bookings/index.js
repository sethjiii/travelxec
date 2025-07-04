import dbConnect from '../../dbConnect';
import { getUserFromRequest } from '../../../../lib/getUserFromRequest';
import Bookings from '../../../../models/Bookings';
import User from '../../../../models/user';
import TravelPackage from '../../../../models/TravelPackage';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: Admins only' });
    }

    const bookings = await Bookings.find()
      .populate({ path: 'userId', model: User, select: 'name email' })
      .populate({ path: 'packageId', model: TravelPackage, select: 'name' })
      .sort({ createdAt: -1 });

    const formatted = bookings.map((b) => ({
      _id: b._id,
      user: b.userId ? { name: b.userId.name } : null,
      package: b.packageId ? { name: b.packageId.name } : null,
      startDate: b.startDate,
      numberOfTravelers: b.numberOfTravelers,
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error("❌ Error fetching bookings:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
// This code handles the GET request to fetch all bookings for admins, ensuring proper authentication and authorization.
// It connects to the database, retrieves bookings, populates user and package details, and formats the response.
// The response includes booking ID, user name, package name, start date, and number of travelers.
// It also handles errors gracefully, returning appropriate status codes and messages.
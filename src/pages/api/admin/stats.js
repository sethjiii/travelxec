import dbConnect from '@/pages/api/dbConnect';
import TravelPackage from '@/models/TravelPackage';
import Bookings from '@/models/Bookings';
import Itinerary from '@/models/Itinerary';
import InternationalDestination from '@/models/InternationalDestination';
import Destination from '@/models/Destination';
import { getUserFromRequest } from '@/lib/getUserFromRequest';

export default async function handler(req, res) {
  await dbConnect();

  const user = await getUserFromRequest(req);
  if (!user || user.role !== 'admin') {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const totalPackages = await TravelPackage.countDocuments();
      const bookings = await Bookings.countDocuments();
      const itineraries = await Itinerary.countDocuments();
      const destinations = await Destination.countDocuments();

      return res.status(200).json({
        success: true,
        stats: { totalPackages, bookings, itineraries, destinations },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' });
}

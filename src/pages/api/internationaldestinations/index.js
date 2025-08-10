import dbConnect from '../dbConnect';  // Adjust if needed
import interTravelPackage from '@/models/interTravelPackage'; // ✅ singular, correctly cased
import InternationalDestination from '../../../models/InternationalDestination'; // Your Mongoose Destination model

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const internationalDestinations = await InternationalDestination.find({}).populate('packages').sort({ createdAt: -1 }).exec(); // This will populate the referenced TravelPackage documents
    const internationalDestination = internationalDestinations.map((dest) => ({ ...dest.toObject(), type: 'International' }));

    return res.status(200).json({ internationalDestination });
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
    
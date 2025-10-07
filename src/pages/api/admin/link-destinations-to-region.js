import dbConnect from '../dbConnect';
import Destination from '@/models/Destination';
import InternationalDestination from '@/models/InternationalDestination';
import Region from '@/models/Region';
import { getUserFromRequest } from '@/lib/getUserFromRequest';

export default async function handler(req, res) {
  await dbConnect();

  // Verify admin
  const user = await getUserFromRequest(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }

  try {
    switch (req.method) {
      // GET: Fetch all destinations + regions
      case 'GET': {
        const domesticDestinations = await Destination.find().sort({ city: 1 });
        const internationalDestinations = await InternationalDestination.find().sort({ city: 1 });
        const regions = await Region.find().sort({ name: 1 });

        return res.status(200).json({
          domesticDestinations,
          internationalDestinations,
          regions,
        });
      }

      // PUT: Update a destination's region OR bulk update
      case 'PUT': {
        const { type, regionId, destinationId, destinationIds } = req.body;

        // If bulk update
        if (destinationIds && Array.isArray(destinationIds) && type) {
          let Model;
          if (type === 'domestic') Model = Destination;
          else if (type === 'international') Model = InternationalDestination;
          else return res.status(400).json({ message: 'Type must be domestic or international' });

          const result = await Model.updateMany(
            { _id: { $in: destinationIds } },
            { $set: { region: regionId || null } }
          );

          return res.status(200).json({
            message: `✅ ${result.modifiedCount} ${type} destinations updated successfully`,
          });
        }

        // Single update
        if (!destinationId || !type) {
          return res.status(400).json({ message: 'destinationId and type are required' });
        }

        let destination;
        if (type === 'domestic') destination = await Destination.findById(destinationId);
        else if (type === 'international') destination = await InternationalDestination.findById(destinationId);

        if (!destination) return res.status(404).json({ message: 'Destination not found' });

        destination.region = regionId || null;
        await destination.save();

        return res.status(200).json({ message: 'Region linked successfully', destination });
      }

      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Link destinations API error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

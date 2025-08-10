import dbConnect from '../dbConnect';
import TravelPackage from '@/models/TravelPackage';
import interTravelPackage from '@/models/interTravelPackage'; // if needed

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();

    // Update all packages with missing "type" field
    const result = await TravelPackage.updateMany(
      { type: { $exists: false } },
      { $set: { type: 'domestic' } }
    );

    // Repeat for international if needed
    const interResult = await interTravelPackage.updateMany(
      { type: { $exists: false } },
      { $set: { type: 'international' } }
    );

    res.status(200).json({
      message: 'Type fields updated successfully',
      domesticModified: result.modifiedCount,
      internationalModified: interResult.modifiedCount,
    });
  } catch (err) {
    console.error('Bulk update error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

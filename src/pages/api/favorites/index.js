import { getUserFromRequest } from '@/lib/getUserFromRequest';
import dbConnect from '../dbConnect';
import User from '@/models/user';

export default async function handler(req, res) {
  await dbConnect();

  const userData = await getUserFromRequest(req);
  if (!userData) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = await User.findOne({ email: userData.email });
  if (!user) {
    return res.status(404).json({ error: 'User not found in database' });
  }

  if (req.method === 'GET') {
    try {
      const populatedUser = await User.findById(user._id).populate('favorites');
      return res.status(200).json(populatedUser.favorites || []);
    } catch (err) {
      console.error('❌ Failed to fetch favorites:', err);
      return res.status(500).json({ error: 'Failed to fetch favorites' });
    }
  }

  if (req.method === 'POST') {
    const { packageId } = req.body;
    if (!packageId) {
      return res.status(400).json({ error: 'Missing packageId' });
    }

    try {
      await User.findByIdAndUpdate(user._id, {
        $addToSet: { favorites: packageId },
      });
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('❌ Failed to add favorite:', err);
      return res.status(500).json({ error: 'Failed to add favorite' });
    }
  }

  if (req.method === 'DELETE') {
    const { packageId } = req.body;
    if (!packageId) {
      return res.status(400).json({ error: 'Missing packageId' });
    }

    try {
      await User.findByIdAndUpdate(user._id, {
        $pull: { favorites: packageId },
      });
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('❌ Failed to remove favorite:', err);
      return res.status(500).json({ error: 'Failed to remove favorite' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
// This API endpoint handles user favorites for travel packages.
// It supports GET to fetch favorites, POST to add a favorite, and DELETE to remove a favorite.
// It uses Mongoose to interact with the MongoDB database and requires user authentication.
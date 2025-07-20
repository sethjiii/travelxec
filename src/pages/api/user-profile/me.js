// ✅ src/pages/api/user-profile/me.js
import dbConnect from '../dbConnect';
import UserProfile from '../../../models/userProfile';
import { getUserFromRequest } from '../../../lib/getUserFromRequest';

export default async function handler(req, res) {
  await dbConnect();

  const authUser = await getUserFromRequest(req);
  if (!authUser || !authUser.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userId = authUser.id; // ✅ Keep it as string

  if (req.method === 'GET') {
    try {
      const profile = await UserProfile.findOne({ userId });
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      return res.status(200).json(profile);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch profile' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const updated = await UserProfile.findOneAndUpdate(
        { userId },
        { $set: req.body },
        { new: true, upsert: true, runValidators: true }
      );
      return res.status(200).json(updated);
    } catch (error) {
      return res.status(400).json({ error: error.message || 'Update failed' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

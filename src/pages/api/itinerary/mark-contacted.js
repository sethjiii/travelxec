import dbConnect from '../dbConnect';
import Itinerary from '../../../models/Itinerary';

export default async function handler(req, res) {
  if (req.method !== 'PATCH') return res.status(405).end();

  await dbConnect();
  const { id } = req.body;

  try {
    await Itinerary.findByIdAndUpdate(id, { contacted: true });
    res.status(200).json({ message: 'Marked as contacted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update itinerary' });
  }
}

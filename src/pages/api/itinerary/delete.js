import dbConnect from '../dbConnect';
import Itinerary from '../../../models/Itinerary';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).end();

  await dbConnect();
  const { id } = req.body;

  try {
    await Itinerary.findByIdAndDelete(id);
    res.status(200).json({ message: 'Itinerary deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete itinerary' });
  }
}

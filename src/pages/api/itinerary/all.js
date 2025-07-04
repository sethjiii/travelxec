import dbConnect from '../dbConnect';
import Itinerary from '../../../models/Itinerary';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  await dbConnect();
  const itineraries = await Itinerary.find().sort({ createdAt: -1 });
  res.status(200).json(itineraries);
}
// This code retrieves all itineraries from the database and returns them in descending order of creation date.
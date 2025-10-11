import dbConnect from '../../dbConnect';
import interTravelPackage from "@/models/interTravelPackage";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== "GET")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const packages = await InterTravelPackage.find().lean();
    res.status(200).json(packages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

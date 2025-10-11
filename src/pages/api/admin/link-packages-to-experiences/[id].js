import dbConnect from '../../dbConnect';
import Experience from '@/models/Experience';
import TravelPackage from '@/models/TravelPackage';
import InterTravelPackage from '@/models/InterTravelPackage';
import { getUserFromRequest } from '@/lib/getUserFromRequest';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };
export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  if (!id) return res.status(400).json({ error: "Experience ID is required" });

  const user = await getUserFromRequest(req);
  if (!user || user.role !== "admin")
    return res.status(403).json({ error: "Access denied: Admins only" });

  if (req.method === "PUT") {
    const { linkedPackages } = req.body;
    if (!Array.isArray(linkedPackages))
      return res.status(400).json({ error: "linkedPackages must be an array" });

    const updated = await Experience.findByIdAndUpdate(
      id,
      { linkedPackages },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Experience not found" });
    return res.status(200).json({ message: "Packages linked successfully", experience: updated });
  }

  return res.status(405).json({ error: "Method not allowed" });
}

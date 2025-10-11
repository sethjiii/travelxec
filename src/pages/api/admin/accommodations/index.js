import dbConnect from "../../dbConnect";
import Accommodation from "@/models/Accommodation";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = { api: { bodyParser: { sizeLimit: "10mb" } } };

export default async function handler(req, res) {
  await dbConnect();

  // Admin guard
  const user = await getUserFromRequest(req);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ success: false, error: "Access denied: Admins only" });
  }

  switch (req.method) {
    case "GET":
      try {
        const { q, limit = 50, page = 1, active } = req.query;
        const match = {};
        if (q) match.name = { $regex: q, $options: "i" };
        if (active === "true") match.isActive = true;
        if (active === "false") match.isActive = false;

        const skip = (Number(page) - 1) * Number(limit);

        const [items, total] = await Promise.all([
          Accommodation.find(match).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
          Accommodation.countDocuments(match),
        ]);

        return res.status(200).json({
          success: true,
          data: items,
          pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(total / Number(limit)),
          },
        });
      } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
      }

    case "POST":
      try {
        const { name, location, coordinates, description, pricePerDay, mediaFiles } = req.body;

        if (!name || !location || !coordinates?.lat || !coordinates?.lng || pricePerDay == null) {
          return res.status(400).json({
            success: false,
            error: "name, location, coordinates(lat,lng) and pricePerDay are required",
          });
        }

        // Upload each media file to Cloudinary
        const media = [];
        if (mediaFiles && Array.isArray(mediaFiles)) {
          for (const file of mediaFiles) {
            // file should be base64 string (or you can adapt for file buffer)
            const uploadResponse = await cloudinary.uploader.upload(file, {
              folder: "accommodations",
            });
            media.push({ url: uploadResponse.secure_url, public_id: uploadResponse.public_id });
          }
        }

        const doc = await Accommodation.create({
          name: name.trim(),
          location: location.trim(),
          coordinates: {
            lat: Number(coordinates.lat),
            lng: Number(coordinates.lng),
          },
          media, // uploaded files
          description,
          pricePerDay: Number(pricePerDay),
          createdBy: user.id,
        });

        return res.status(201).json({ success: true, data: doc });
      } catch (err) {
        return res.status(400).json({ success: false, error: err.message });
      }

    default:
      return res.status(405).json({ success: false, error: "Method not allowed" });
  }
}

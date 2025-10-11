import dbConnect from '../../dbConnect';
import Experience from "@/models/Experience";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };
export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  const user = await getUserFromRequest(req);
  if (!user || user.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  switch (req.method) {
    case "GET":
      try {
        const experience = await Experience.findById(id).populate("theme");
        if (!experience) return res.status(404).json({ error: "Not found" });
        res.status(200).json(experience);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
      break;

    case "PUT":
      try {
        const { mediaFiles = [], removeMedia = [], ...data } = req.body;
        const existing = await Experience.findById(id);
        if (!existing) return res.status(404).json({ error: "Not found" });

        // Remove media
        let updatedMedia = existing.media.filter(
          (url) => !removeMedia.includes(url)
        );

        // Upload new media
        for (const file of mediaFiles) {
          if (file.startsWith("data:")) {
            const result = await cloudinary.uploader.upload(file, {
              folder: "experiences",
            });
            updatedMedia.push(result.secure_url);
          }
        }

        const updated = await Experience.findByIdAndUpdate(
          id,
          { ...data, media: updatedMedia },
          { new: true }
        );

        res.status(200).json(updated);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
      break;

    case "DELETE":
      try {
        await Experience.findByIdAndDelete(id);
        res.status(204).end();
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
      break;

    default:
      res.status(405).json({ error: "Method not allowed" });
  }
}

import dbConnect from "../../dbConnect";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import { v2 as cloudinary } from "cloudinary";
import Theme from "@/models/Theme";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  // ✅ Authenticate Admin
  const user = await getUserFromRequest(req);
  if (!user || user.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  switch (req.method) {
    /**
     * 📖 GET: Fetch a single theme by ID
     */
    case "GET":
      try {
        const theme = await Theme.findById(id).populate("experiences");
        if (!theme) return res.status(404).json({ error: "Theme not found" });
        res.status(200).json(theme);
      } catch (err) {
        console.error("GET Theme Error:", err);
        res.status(400).json({ error: err.message });
      }
      break;

    /**
     * ✏️ PUT: Update an existing theme (with optional image + priceRange update)
     */
    case "PUT":
      try {
        const existingTheme = await Theme.findById(id);
        if (!existingTheme) {
          return res.status(404).json({ error: "Theme not found" });
        }

        let { name, description, image, imageFile, priceRange, experiences } = req.body;
        const updatedData = { name, description, priceRange, experiences };

        // ✅ If new image uploaded (base64 string)
        if (imageFile && imageFile.startsWith("data:")) {
          const uploadRes = await cloudinary.uploader.upload(imageFile, {
            folder: "travelxec/themes",
          });
          updatedData.image = uploadRes.secure_url;

          // Delete old Cloudinary image if exists
          if (existingTheme.image?.includes("cloudinary")) {
            const publicId = existingTheme.image.split("/").slice(-1)[0].split(".")[0];
            await cloudinary.uploader.destroy(`travelxec/themes/${publicId}`);
          }
        } else if (image) {
          // If user directly passed a URL
          updatedData.image = image;
        }

        const updatedTheme = await Theme.findByIdAndUpdate(id, updatedData, {
          new: true,
        });

        res.status(200).json(updatedTheme);
      } catch (err) {
        console.error("PUT Theme Error:", err);
        res.status(400).json({ error: err.message });
      }
      break;

    /**
     * 🗑️ DELETE: Delete theme (and remove its Cloudinary image if applicable)
     */
    case "DELETE":
      try {
        const theme = await Theme.findById(id);
        if (!theme) return res.status(404).json({ error: "Theme not found" });

        // Delete from Cloudinary if image exists
        if (theme.image?.includes("cloudinary")) {
          const publicId = theme.image.split("/").slice(-1)[0].split(".")[0];
          await cloudinary.uploader.destroy(`travelxec/themes/${publicId}`);
        }

        await Theme.findByIdAndDelete(id);
        res.status(204).end();
      } catch (err) {
        console.error("DELETE Theme Error:", err);
        res.status(400).json({ error: err.message });
      }
      break;

    default:
      res.status(405).json({ message: "Method not allowed" });
  }
}

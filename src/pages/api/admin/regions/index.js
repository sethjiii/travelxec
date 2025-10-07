import dbConnect from "../../dbConnect";
import Region from "@/models/Region";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Allow large payloads for image upload
    },
  },
};

export default async function handler(req, res) {
  await dbConnect();

  // ✅ Verify Admin Access
  const user = await getUserFromRequest(req);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }

  try {
    switch (req.method) {
      //  CREATE a new Region
      case "POST": {
        const { name, description = "", image } = req.body;

        if (!name?.trim()) {
          return res.status(400).json({ message: "Region name is required" });
        }

        // Check if region already exists
        const existing = await Region.findOne({ name: name.trim() });
        if (existing) {
          return res.status(409).json({ message: "Region already exists" });
        }

        let uploadedImage = "";
        if (image) {
          try {
            const result = await cloudinary.uploader.upload(image, {
              folder: "regions",
            });
            uploadedImage = result.secure_url;
          } catch (uploadErr) {
            console.error("Cloudinary upload error:", uploadErr);
            return res.status(500).json({ message: "Image upload failed" });
          }
        }

        const region = await Region.create({
          name: name.trim(),
          description: description.trim(),
          image: uploadedImage,
        });

        return res
          .status(201)
          .json({ message: "Region added successfully", region });
      }

      //  READ all Regions
      case "GET": {
        const regions = await Region.find().sort({ createdAt: -1 });
        return res.status(200).json(regions);
      }

      //  UPDATE Region
      case "PUT": {
        const { id, name, description, image } = req.body;
        if (!id) {
          return res.status(400).json({ message: "Region ID is required" });
        }

        const region = await Region.findById(id);
        if (!region) {
          return res.status(404).json({ message: "Region not found" });
        }

        // Handle optional Cloudinary upload
        let updatedImage = region.image;
        if (image && image.startsWith("data:")) {
          const result = await cloudinary.uploader.upload(image, {
            folder: "regions",
          });
          updatedImage = result.secure_url;
        }

        region.name = name?.trim() || region.name;
        region.description = description?.trim() || region.description;
        region.image = updatedImage;

        await region.save();

        return res
          .status(200)
          .json({ message: "Region updated successfully", region });
      }

      // DELETE Region
      case "DELETE": {
        const { id } = req.query;
        if (!id) {
          return res.status(400).json({ message: "Region ID is required" });
        }

        const deleted = await Region.findByIdAndDelete(id);
        if (!deleted) {
          return res.status(404).json({ message: "Region not found" });
        }

        return res.status(200).json({ message: "Region deleted successfully" });
      }

      default:
        return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Region API error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

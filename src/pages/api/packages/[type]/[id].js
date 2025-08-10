import dbConnect from '../../dbConnect';
import TravelPackage from '@/models/TravelPackage';
import interTravelPackage from "@/models/interTravelPackage";
import DestinationModel from "@/models/Destination";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get correct model based on type
function getModelByType(type) {
  switch (type) {
    case "domestic":
      return TravelPackage;
    case "international":
      return interTravelPackage;
    // Add more cases for other types like "luxury", "fest", etc.
    default:
      throw new Error("Invalid package type");
  }
}

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;
  const { id, type } = req.query;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  let PackageModel;
  try {
    PackageModel = getModelByType(type);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  if (method !== "GET") {
    try {
      const user = await getUserFromRequest(req);
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      if (user.role !== "admin") {
        return res.status(403).json({ error: "Access denied: Admins only" });
      }
    } catch (authErr) {
      console.error("Auth error:", authErr);
      return res.status(401).json({ error: "Authentication failed" });
    }
  }

  switch (method) {
    case "GET":
      try {
        const travelPackage = await PackageModel.findById(id);
        if (!travelPackage) {
          return res.status(404).json({ error: "Package not found" });
        }

        const safePackage = {
          ...travelPackage.toObject(),
          reviews: Array.isArray(travelPackage.reviews) ? travelPackage.reviews : [],
          comments: Array.isArray(travelPackage.comments) ? travelPackage.comments : [],
          likes: typeof travelPackage.likes === "number" ? travelPackage.likes : 0,
        };

        return res.status(200).json(safePackage);
      } catch (error) {
        console.error("❌ Error fetching package:", error);
        return res.status(500).json({ error: "Failed to fetch package" });
      }

    case "PUT":
      try {
        const updateFields = req.body;

        const allowedFields = [
          "name",
          "description",
          "duration",
          "places",
          "itinerary",
          "highlights",
          "inclusions",
          "exclusions",
          "availability",
          "OnwardPrice",
          "images",
        ];

        const filteredUpdate = {};
        for (const key of allowedFields) {
          if (Object.prototype.hasOwnProperty.call(updateFields, key)) {
            filteredUpdate[key] = updateFields[key];
          }
        }

        const existingPackage = await PackageModel.findById(id);
        if (!existingPackage) {
          return res.status(404).json({ error: "Package not found" });
        }

        const oldImages = existingPackage.images || [];
        const newImages = filteredUpdate.images || [];

        const oldPublicIds = oldImages.map((img) => img.public_id);
        const newPublicIds = newImages.map((img) => img.public_id);
        const removedPublicIds = oldPublicIds.filter(
          (publicId) => !newPublicIds.includes(publicId)
        );

        for (const publicId of removedPublicIds) {
          if (publicId) {
            try {
              await cloudinary.uploader.destroy(publicId);
            } catch (err) {
              console.warn(`⚠️ Failed to delete Cloudinary image: ${publicId}`, err);
            }
          }
        }

        const updatedPackage = await PackageModel.findByIdAndUpdate(
          id,
          { $set: filteredUpdate },
          { new: true, runValidators: true }
        );

        return res.status(200).json({
          message: "Package updated successfully",
          package: updatedPackage,
        });
      } catch (error) {
        console.error("❌ Error updating package:", error);
        return res.status(500).json({ error: "Failed to update package" });
      }

    case "DELETE":
      try {
        const deleted = await PackageModel.findByIdAndDelete(id);
        if (!deleted) {
          return res.status(404).json({ error: "Package not found" });
        }

        await DestinationModel.updateMany(
          { packages: id },
          { $pull: { packages: id } }
        );

        const deletePromises = (deleted.images || []).map(async (image) => {
          if (image.public_id) {
            try {
              await cloudinary.uploader.destroy(image.public_id);
            } catch (err) {
              console.warn(`⚠️ Failed to delete Cloudinary image: ${image.public_id}`, err);
            }
          }
        });

        await Promise.all(deletePromises);

        return res.status(200).json({
          message: "Package and images deleted successfully",
        });
      } catch (error) {
        console.error("❌ Error deleting package:", error);
        return res.status(500).json({ error: "Failed to delete package" });
      }

    default:
      return res.status(405).json({ error: `Method ${method} not allowed` });
  }
}

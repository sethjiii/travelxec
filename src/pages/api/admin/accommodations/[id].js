import dbConnect from "../../dbConnect";
import Accommodation from "@/models/Accommodation";
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

// 🔧 Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔧 Allow larger media payloads
export const config = { api: { bodyParser: { sizeLimit: "10mb" } } };

export default async function handler(req, res) {
  await dbConnect();

  // 🧩 Authenticate Admin
  const user = await getUserFromRequest(req);
  if (!user || user.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: "Access denied: Admins only",
    });
  }

  const { id } = req.query;

  // 🛑 Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      error: "Invalid accommodation ID",
    });
  }

  switch (req.method) {
    /** ──────────────── 🟢 GET Accommodation by ID ──────────────── **/
    case "GET":
      try {
        const accommodation = await Accommodation.findById(id).lean();
        if (!accommodation) {
          return res.status(404).json({
            success: false,
            error: "Accommodation not found",
          });
        }
        return res.status(200).json({
          success: true,
          data: accommodation,
        });
      } catch (err) {
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

    /** ──────────────── 🟡 UPDATE Accommodation ──────────────── **/
    case "PUT":
      try {
        const {
          name,
          location,
          coordinates,
          media,
          description,
          pricePerDay,
          isActive,
        } = req.body;

        const update = {};

        if (name) update.name = name.trim();
        if (location) update.location = location.trim();
        if (coordinates?.lat && coordinates?.lng) {
          update.coordinates = {
            lat: Number(coordinates.lat),
            lng: Number(coordinates.lng),
          };
        }
        if (Array.isArray(media)) update.media = media;
        if (description) update.description = description;
        if (pricePerDay != null) update.pricePerDay = Number(pricePerDay);
        if (typeof isActive === "boolean") update.isActive = isActive;

        // ✅ If updating with new Cloudinary image URLs
        if (Array.isArray(media) && media.length > 0) {
          update.media = await Promise.all(
            media.map(async (item) => {
              if (item.startsWith("data:")) {
                const uploaded = await cloudinary.uploader.upload(item, {
                  folder: "travelxec/accommodations",
                });
                return uploaded.secure_url;
              }
              return item;
            })
          );
        }

        const updated = await Accommodation.findByIdAndUpdate(id, update, {
          new: true,
          runValidators: true,
        });

        if (!updated) {
          return res.status(404).json({
            success: false,
            error: "Accommodation not found",
          });
        }

        return res.status(200).json({
          success: true,
          data: updated,
        });
      } catch (err) {
        return res.status(400).json({
          success: false,
          error: err.message,
        });
      }

    /** ──────────────── 🔴 DELETE Accommodation ──────────────── **/
    case "DELETE":
      try {
        const deleted = await Accommodation.findByIdAndDelete(id);
        if (!deleted) {
          return res.status(404).json({
            success: false,
            error: "Accommodation not found",
          });
        }

        return res.status(200).json({
          success: true,
          message: "Accommodation deleted successfully",
        });
      } catch (err) {
        return res.status(500).json({
          success: false,
          error: err.message,
        });
      }

    /** ──────────────── ⚪ METHOD NOT ALLOWED ──────────────── **/
    default:
      return res.status(405).json({
        success: false,
        error: `Method ${req.method} not allowed`,
      });
  }
}

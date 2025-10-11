// models/Experience.js
import mongoose from "mongoose";

const linkedPackageSchema = new mongoose.Schema({
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  packageType: {
    type: String,
    enum: ["domestic", "international"], // extendable for new types
    required: true,
  },
});

const experienceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    media: [{ type: String }], // URLs of images/videos
    duration: { type: Number, min: 0 },
    preferredTime: { type: String }, // Morning, Afternoon, Evening
    tips: { type: String, trim: true },
    price: { type: Number, min: 0 },
    peopleRequired: {
      type: String,
      enum: ["Solo", "Couple", "Group"],
      default: "Solo",
    },
    iconPack: { type: String, trim: true }, // Name or Cloudinary URL
    theme: { type: mongoose.Schema.Types.ObjectId, ref: "Theme" },
    linkedPackages: [linkedPackageSchema], // dynamic linking
  },
  { timestamps: true }
);

export default mongoose.models.Experience ||
  mongoose.model("Experience", experienceSchema);

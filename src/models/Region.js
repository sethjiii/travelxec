import mongoose from "mongoose";

const RegionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    image: {
      type: String, // optional region image
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Region || mongoose.model("Region", RegionSchema);

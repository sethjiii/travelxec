// models/Theme.js
import mongoose from "mongoose";

const themeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    experiences: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Experience",
      },
    ],
    priceRange: {
      min: Number,
      max: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Theme || mongoose.model("Theme", themeSchema);

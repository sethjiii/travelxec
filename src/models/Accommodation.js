import mongoose from "mongoose";

const AccommodationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
    },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    media: [
      {
        url: { type: String, required: false },
        alt: { type: String },
      },
    ],
    description: {
      type: String,
      required: true,
    },
    pricePerDay: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Accommodation ||
  mongoose.model("Accommodation", AccommodationSchema);

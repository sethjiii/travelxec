import mongoose from "mongoose";

const { Schema } = mongoose;

// Alternate Contact Sub-Schema (optional)
const AlternateContactSchema = new Schema({
  name: { type: String },
  phone: { type: String },
});

// Traveler Sub-Schema (optional)
const TravelerSchema = new Schema({
  name: { type: String },
  email: { type: String },
  phone: { type: String },
});

// Price Range Sub-Schema
const PriceRangeSchema = new Schema({
  max: { type: Number },
});

// Package Lead Schema
const PackageLeadSchema = new Schema(
  {
    packageId: { type: Schema.Types.ObjectId, ref: "TravelPackage", required: true },

    // Allow optional userId for anonymous leads
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false },

    // Contact info of lead submitter
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },

    numberOfTravelers: { type: Number, required: false },
    startDate: { type: String, required: false },
    specialRequests: { type: String, default: "" },

    alternateContact: { type: AlternateContactSchema, required: false },
    travelers: { type: [TravelerSchema], required: false },
    priceRange: { type: PriceRangeSchema, required: false },
  },
  {
    timestamps: true,
  }
);

const PackageLeadModel =
  mongoose.models.PackageLead || mongoose.model("PackageLead", PackageLeadSchema);

export default PackageLeadModel;

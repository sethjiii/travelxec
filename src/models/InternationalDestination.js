import mongoose from 'mongoose';

const InternationalDestinationSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
      unique: true, // Ensures one entry per city
      trim: true,
    },
    country: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String, // Main image URL for the destination
    },
    packages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'interTravelPackage', // Reference to TravelPackage model
      },
    ],
  },
  {
    timestamps: true,
  }
);

const InternationalDestination =
  mongoose.models.InternationalDestination || mongoose.model('InternationalDestination', InternationalDestinationSchema);

export default InternationalDestination;

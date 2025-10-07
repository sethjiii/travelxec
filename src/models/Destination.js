import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
      unique: true, // Ensures one entry per city
      trim: true,
    },
    country: {
      type: String,
      default: 'India',
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String, // Main image URL for the destination
    },
    region: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Region", // 👈 link to Region
      required: false,
    },
    packages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TravelPackage', // Reference to TravelPackage model
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Destination =
  mongoose.models.Destination || mongoose.model('Destination', destinationSchema);

export default Destination;

import mongoose from 'mongoose';

const ItinerarySchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  destinations: String,
  startDate: String,
  endDate: String,
  duration: Number,
  budget: String,
  specialRequirements: String,
  contacted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.models.Itinerary || mongoose.model('Itinerary', ItinerarySchema);

const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // ✅ FIXED

  fullName: String,
  profilePicture: String,
  bio: String,
  gender: String,
  dateOfBirth: Date,
  phoneNumber: String,
  email: String,

  country: String,
  state: String,
  city: String,
  address: String,
  zipCode: String,

  preferredDestinations: [String],
  travelStyles: [String],
  budgetRange: {
    min: Number,
    max: Number,
  },

  bookingsCount: { type: Number, default: 0 },
  wishlistPackages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TravelPackage' }],
  lastVisitedPackages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TravelPackage' }],

  instagram: String,
  facebook: String,
  linkedin: String,

  receiveNewsletter: { type: Boolean, default: false },
  preferredCurrency: { type: String, default: 'INR' },
  language: { type: String, default: 'en' }
}, { timestamps: true });

const UserProfile = mongoose.models.UserProfile || mongoose.model('UserProfile', userProfileSchema);
module.exports = UserProfile;

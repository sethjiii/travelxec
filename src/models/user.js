import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true, // ✅ Required for all users (JWT + Google)
      unique: true,   // ✅ Ensure no duplicates
      trim: true,
      lowercase: true,
    },
    location: {
      type: String,
    },
    password: {
      type: String,
      required: false, // ✅ Optional for Google users
    },
    phone: {
      type: String,
      trim: true,
    },
    profilePicture: {
      type: String,
      default: 'avatar.jpeg',
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TravelPackage',
      },
    ],
    role: {
      type: String,
      enum: ['user', 'admin', 'superadmin'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    preferences: {
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
      },
      theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light',
      },
    },
    accountStatus: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Index to speed up email-based lookups (optional)
UserSchema.index({ email: 1 });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;

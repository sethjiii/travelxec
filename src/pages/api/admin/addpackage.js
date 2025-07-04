import { v2 as cloudinary } from 'cloudinary';
import TravelPackage from '../../../models/TravelPackage';
import DestinationModel from '../../../models/Destination';
import dbConnect from '../dbConnect';
import mongoose from 'mongoose';
import { getUserFromRequest } from '@/lib/getUserFromRequest';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1000mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await dbConnect();

  try {
    // ✅ Auth support for both Google + JWT
    const user = await getUserFromRequest(req);
    console.log("🔐 Authenticated user:", user);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: Admins only' });
    }

    const {
      name,
      description,
      itinerary,
      duration,
      highlights,
      inclusions,
      exclusions,
      availability,
      images,
      places,
      cityId,
    } = req.body;

    // ✅ Validate required fields
    if (
      !name ||
      !description ||
      !duration ||
      !Array.isArray(cityId) ||
      cityId.length === 0
    ) {
      return res.status(400).json({ error: 'Missing or invalid required fields' });
    }

    // ✅ Upload images to Cloudinary
    const uploadedImages = [];
    for (const image of images || []) {
      try {
        const result = await cloudinary.uploader.upload(image, {
          folder: 'travel-packages',
        });
        uploadedImages.push(result.secure_url);
      } catch (uploadError) {
        console.error('❌ Cloudinary upload error:', uploadError);
        return res.status(500).json({ error: 'Image upload failed' });
      }
    }

    // ✅ Save travel package
    const newPackage = new TravelPackage({
      name,
      description,
      itinerary,
      duration,
      highlights,
      inclusions,
      exclusions,
      availability,
      places,
      images: uploadedImages,
    });

    const savedPackage = await newPackage.save();

    // ✅ Link to destination(s)
    await Promise.all(
      cityId.map(async (id) => {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          console.warn(`Invalid ObjectId: ${id}`);
          return null;
        }

        const updated = await DestinationModel.findByIdAndUpdate(
          id,
          { $addToSet: { packages: savedPackage._id } },
          { new: true }
        );

        if (!updated) {
          console.warn(`Destination not found for ID: ${id}`);
        }

        return updated;
      })
    );

    return res.status(201).json({
      message: 'Travel package added and linked to cities successfully',
      package: savedPackage,
    });

  } catch (error) {
    console.error('❌ Error adding package:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

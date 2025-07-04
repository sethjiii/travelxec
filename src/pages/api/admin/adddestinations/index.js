import { v2 as cloudinary } from 'cloudinary';
import dbConnect from '../../dbConnect';
import Destination from '../../../../models/Destination';
import { getUserFromRequest } from '@/lib/getUserFromRequest'; // ✅ Update path as needed

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await dbConnect();

    // ✅ Get authenticated user (JWT or Google)
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: Admins only' });
    }

    // ✅ Extract and validate fields
    const { city, description = '', packages = [], images = [] } = req.body;

    if (!city || typeof city !== 'string' || city.trim().length === 0) {
      return res.status(400).json({ error: 'City is required and must be a string' });
    }

    if (!Array.isArray(packages)) {
      return res.status(400).json({ error: 'Packages must be an array' });
    }

    if (!Array.isArray(images)) {
      return res.status(400).json({ error: 'Images must be an array' });
    }

    // ✅ Upload images to Cloudinary
    const uploadedImages = [];
    for (const base64Image of images) {
      try {
        const result = await cloudinary.uploader.upload(base64Image, {
          folder: 'destinations',
        });
        uploadedImages.push(result.secure_url);
      } catch (uploadErr) {
        console.error('Cloudinary upload error:', uploadErr);
        return res.status(500).json({ error: 'Image upload failed' });
      }
    }

    // ✅ Check if city already exists
    const existing = await Destination.findOne({ city: city.trim() });
    if (existing) {
      return res.status(409).json({ error: 'City already exists' });
    }

    // ✅ Create and save new destination
    const destination = new Destination({
      city: city.trim(),
      description: description.trim(),
      packages,
      image: uploadedImages[0] || '',
      images: uploadedImages,
    });

    await destination.save();

    return res.status(201).json({
      message: 'Destination added successfully',
      destinationId: destination._id,
    });
  } catch (error) {
    console.error('Error adding destination:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

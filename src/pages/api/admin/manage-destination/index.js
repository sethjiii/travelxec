// src/pages/api/admin/manage-destination/index.js
import { v2 as cloudinary } from 'cloudinary';
import dbConnect from '../../dbConnect';
import Destination from '@/models/Destination';
import InternationalDestination from '@/models/InternationalDestination';
import TravelPackage from '@/models/TravelPackage';
import interTravelPackage from "@/models/interTravelPackage";
import { getUserFromRequest } from '@/lib/getUserFromRequest';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '20mb', // for images
        },
    },
};

export default async function handler(req, res) {
    await dbConnect();

    // Admin check
    const user = await getUserFromRequest(req);
    if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied: Admins only' });
    }

    try {
        // ---------------- GET ----------------
        if (req.method === 'GET') {
            const { type, regionId } = req.query;

            if (!type || !['domestic', 'international'].includes(type)) {
                return res.status(400).json({ error: 'Type must be domestic or international' });
            }

            const Model = type === 'domestic' ? Destination : InternationalDestination;
            const filter = regionId ? { region: regionId } : {};

            const destinations = await Model.find(filter)
                .populate('region', 'name')
                .populate('packages', 'name')
                .sort({ createdAt: -1 });

            return res.status(200).json(destinations);
        }

        // ---------------- POST ----------------
        if (req.method === 'POST') {
            const { type, city, description = '', region, packages = [], images = [] } = req.body;

            if (!type || !['domestic', 'international'].includes(type))
                return res.status(400).json({ error: 'Type is required' });
            if (!city) return res.status(400).json({ error: 'City is required' });
            if (!region) return res.status(400).json({ error: 'Region ID is required' });

            const Model = type === 'domestic' ? Destination : InternationalDestination;

            // Check duplicate
            const existing = await Model.findOne({ city: city.trim() });
            if (existing) return res.status(409).json({ error: 'City already exists' });

            // Upload images
            const uploadedImages = [];
            for (const img of images) {
                if (img.startsWith('data:image')) {
                    const result = await cloudinary.uploader.upload(img, { folder: 'destinations' });
                    uploadedImages.push(result.secure_url);
                } else {
                    uploadedImages.push(img);
                }
            }

            const newDestination = await Model.create({
                city: city.trim(),
                description: description.trim(),
                region,
                packages,
                images: uploadedImages,
                image: uploadedImages[0] || '',
            });

            return res.status(201).json({ message: 'Destination added', destination: newDestination });
        }

        // ---------------- PUT ----------------
        // ---------------- PUT ----------------
        if (req.method === 'PUT') {
            const { type, id, city, description, region, packages, images, linkPackageId, unlinkPackageId } = req.body;

            if (!type || !['domestic', 'international'].includes(type))
                return res.status(400).json({ error: 'Type is required' });
            if (!id) return res.status(400).json({ error: 'Destination ID is required' });

            const Model = type === 'domestic' ? Destination : InternationalDestination;

            const destination = await Model.findById(id);
            if (!destination) return res.status(404).json({ error: 'Destination not found' });

            // Upload new images if provided
            let uploadedImages = destination.images;
            if (images && images.length > 0) {
                const newImages = [];
                for (const img of images) {
                    if (img.startsWith('data:image')) {
                        const result = await cloudinary.uploader.upload(img, { folder: 'destinations' });
                        newImages.push(result.secure_url);
                    } else {
                        newImages.push(img);
                    }
                }
                uploadedImages = newImages;
            }

            // Handle package linking / unlinking
            if (linkPackageId && !destination.packages.includes(linkPackageId)) {
                destination.packages.push(linkPackageId);
            }

            if (unlinkPackageId) {
                destination.packages = destination.packages.filter(pkg => pkg.toString() !== unlinkPackageId);
            }

            // Update other fields
            if (city) destination.city = city;
            if (description) destination.description = description;
            if (region !== undefined) destination.region = region;
            if (packages) destination.packages = packages;
            destination.images = uploadedImages;
            destination.image = uploadedImages[0] || destination.image;

            await destination.save();

            return res.status(200).json({ message: 'Destination updated successfully', destination });
        }


        // ---------------- DELETE ----------------
        if (req.method === 'DELETE') {
            const { type, id } = req.query;

            if (!type || !['domestic', 'international'].includes(type))
                return res.status(400).json({ error: 'Type is required' });
            if (!id) return res.status(400).json({ error: 'Destination ID is required' });

            const Model = type === 'domestic' ? Destination : InternationalDestination;

            const deleted = await Model.findByIdAndDelete(id);
            if (!deleted) return res.status(404).json({ error: 'Destination not found' });

            return res.status(200).json({ message: 'Destination deleted' });
        }

        // ---------------- METHOD NOT ALLOWED ----------------
        return res.status(405).json({ error: 'Method not allowed' });
    } catch (err) {
        console.error('Manage Destination API error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

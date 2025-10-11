// src/pages/api/admin/experiences/index.js - ENHANCED VERSION
import dbConnect from '../../dbConnect';
import Experience from "@/models/Experience";
import Theme from "@/models/Theme";
import TravelPackage from "@/models/TravelPackage"; // domestic
import interTravelPackage from "@/models/interTravelPackage"; // international
import { getUserFromRequest } from "@/lib/getUserFromRequest";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  console.log('=== Experiences API Called ===');
  console.log('Method:', req.method);
  
  await dbConnect();

  // Authentication
  try {
    const user = await getUserFromRequest(req);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: "Authentication required" 
      });
    }
    
    if (user.role !== "admin") {
      return res.status(403).json({ 
        success: false, 
        error: "Access denied: Admins only" 
      });
    }
    
    console.log('Authentication successful for admin user');
  } catch (authError) {
    console.error('Authentication error:', authError);
    return res.status(500).json({ 
      success: false, 
      error: "Authentication error" 
    });
  }

  switch (req.method) {
    case "POST":
      try {
        console.log('Creating new experience...');
        const { mediaFiles = [], iconPack, theme, linkedPackages = [], ...data } = req.body;

        // Input validation
        if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
          return res.status(400).json({ 
            success: false, 
            error: 'Experience name is required' 
          });
        }

        // Validate linkedPackages format
        if (linkedPackages.length > 0) {
          for (const pkg of linkedPackages) {
            if (!pkg.packageId || !pkg.packageType) {
              return res.status(400).json({ 
                success: false, 
                error: 'Each linked package must have packageId and packageType' 
              });
            }
            if (!['domestic', 'international'].includes(pkg.packageType)) {
              return res.status(400).json({ 
                success: false, 
                error: 'Package type must be either "domestic" or "international"' 
              });
            }
          }
        }

        // Upload media
        console.log('Uploading media files...');
        const uploadedMedia = [];
        for (const file of mediaFiles) {
          if (file.startsWith("data:")) {
            const result = await cloudinary.uploader.upload(file, {
              folder: "experiences",
              transformation: [
                { width: 1200, height: 800, crop: "limit", quality: "auto" }
              ]
            });
            uploadedMedia.push(result.secure_url);
          } else {
            uploadedMedia.push(file);
          }
        }

        // Upload icon
        console.log('Uploading icon...');
        let uploadedIcon = iconPack;
        if (iconPack && iconPack.startsWith("data:")) {
          const result = await cloudinary.uploader.upload(iconPack, {
            folder: "experience-icons",
            transformation: [
              { width: 100, height: 100, crop: "fill", quality: "auto" }
            ]
          });
          uploadedIcon = result.secure_url;
        }

        // Validate theme exists if provided
        if (theme) {
          const themeExists = await Theme.findById(theme);
          if (!themeExists) {
            return res.status(400).json({ 
              success: false, 
              error: 'Invalid theme ID' 
            });
          }
        }

        // Create experience
        const experienceData = {
          ...data,
          name: data.name.trim(),
          description: data.description?.trim(),
          media: uploadedMedia,
          iconPack: uploadedIcon,
          theme,
          linkedPackages,
          isActive: true, // Ensure new experiences are active
          createdAt: new Date()
        };

        const experience = await Experience.create(experienceData);
        console.log('Experience created:', experience._id);

        // Populate theme for response
        const populatedExperience = await Experience.findById(experience._id)
          .populate('theme', 'name color')
          .lean();

        return res.status(201).json({ 
          success: true, 
          data: populatedExperience,
          message: 'Experience created successfully'
        });

      } catch (err) {
        console.error("POST Experience Error:", err);
        
        if (err.name === 'ValidationError') {
          return res.status(400).json({ 
            success: false, 
            error: 'Validation failed',
            details: Object.values(err.errors).map(e => e.message)
          });
        }
        
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to create experience',
          details: err.message 
        });
      }

    case "GET":
      try {
        console.log('Fetching experiences...');
        
        // Get experiences with active filter (similar to packages)
        const experiences = await Experience.find({
          $or: [
            { isActive: true },
            { isActive: { $exists: false } }, // Legacy documents
            { isActive: { $ne: false } }
          ]
        })
        .populate('theme', 'name color')
        .sort({ createdAt: -1 })
        .lean();

        console.log('Experiences found:', experiences.length);

        return res.status(200).json({ 
          success: true, 
          data: experiences,
          count: experiences.length 
        });

      } catch (err) {
        console.error("GET Experiences Error:", err);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to fetch experiences' 
        });
      }

    case "PUT":
      try {
        const { id } = req.query;
        
        if (!id) {
          return res.status(400).json({ 
            success: false, 
            error: 'Experience ID is required' 
          });
        }

        console.log('Updating experience:', id);
        const { mediaFiles = [], iconPack, theme, linkedPackages = [], ...data } = req.body;

        // Handle media uploads for updates
        const uploadedMedia = [];
        for (const file of mediaFiles) {
          if (file.startsWith("data:")) {
            const result = await cloudinary.uploader.upload(file, {
              folder: "experiences",
              transformation: [
                { width: 1200, height: 800, crop: "limit", quality: "auto" }
              ]
            });
            uploadedMedia.push(result.secure_url);
          } else {
            uploadedMedia.push(file);
          }
        }

        // Handle icon upload
        let uploadedIcon = iconPack;
        if (iconPack && iconPack.startsWith("data:")) {
          const result = await cloudinary.uploader.upload(iconPack, {
            folder: "experience-icons",
            transformation: [
              { width: 100, height: 100, crop: "fill", quality: "auto" }
            ]
          });
          uploadedIcon = result.secure_url;
        }

        const updateData = {
          ...data,
          media: uploadedMedia.length > 0 ? uploadedMedia : undefined,
          iconPack: uploadedIcon,
          theme,
          linkedPackages,
          updatedAt: new Date()
        };

        // Remove undefined values
        Object.keys(updateData).forEach(key => 
          updateData[key] === undefined && delete updateData[key]
        );

        const updatedExperience = await Experience.findByIdAndUpdate(
          id,
          updateData,
          { new: true, runValidators: true }
        ).populate('theme', 'name color');

        if (!updatedExperience) {
          return res.status(404).json({ 
            success: false, 
            error: 'Experience not found' 
          });
        }

        return res.status(200).json({ 
          success: true, 
          data: updatedExperience,
          message: 'Experience updated successfully'
        });

      } catch (err) {
        console.error("PUT Experience Error:", err);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to update experience' 
        });
      }

    case "DELETE":
      try {
        const { id } = req.query;
        
        if (!id) {
          return res.status(400).json({ 
            success: false, 
            error: 'Experience ID is required' 
          });
        }

        console.log('Deleting experience:', id);

        // Soft delete by setting isActive to false
        const deletedExperience = await Experience.findByIdAndUpdate(
          id,
          { isActive: false, deletedAt: new Date() },
          { new: true }
        );

        if (!deletedExperience) {
          return res.status(404).json({ 
            success: false, 
            error: 'Experience not found' 
          });
        }

        return res.status(200).json({ 
          success: true, 
          message: 'Experience deleted successfully'
        });

      } catch (err) {
        console.error("DELETE Experience Error:", err);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to delete experience' 
        });
      }

    default:
      return res.status(405).json({ 
        success: false, 
        error: "Method not allowed" 
      });
  }
}

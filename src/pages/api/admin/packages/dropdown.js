// src/pages/api/admin/packages/dropdown.js - FINAL CLEAN VERSION
import dbConnect from '../../dbConnect';
import TravelPackage from '@/models/TravelPackage';
import interTravelPackage from '@/models/interTravelPackage';
import { getUserFromRequest } from '@/lib/getUserFromRequest';

export default async function handler(req, res) {
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
  } catch (authError) {
    return res.status(500).json({ 
      success: false, 
      error: "Authentication error"
    });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    // Query that works with your existing data structure
    // Includes documents where isActive is true OR doesn't exist (legacy documents)
    const domesticPackages = await TravelPackage.find({
      $or: [
        { isActive: true },
        { isActive: { $exists: false } }, // Legacy documents without isActive field
        { isActive: { $ne: false } } // Documents where isActive is not explicitly false
      ]
    })
    .select('_id name duration price')
    .lean();

    const internationalPackages = await interTravelPackage.find({
      $or: [
        { isActive: true },
        { isActive: { $exists: false } },
        { isActive: { $ne: false } }
      ]
    })
    .select('_id name duration price')
    .lean();

    const packagesData = {
      domestic: domesticPackages.map(pkg => ({
        _id: pkg._id,
        name: pkg.name || 'Unnamed Package',
        duration: pkg.duration || 0,
        basePrice: pkg.price || 0,
        type: 'domestic'
      })),
      international: internationalPackages.map(pkg => ({
        _id: pkg._id,
        name: pkg.name || 'Unnamed Package',
        duration: pkg.duration || 0,
        basePrice: pkg.price || 0,
        type: 'international'
      }))
    };

    return res.status(200).json({ 
      success: true, 
      data: packagesData 
    });

  } catch (error) {
    console.error('Error fetching packages:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch packages'
    });
  }
}

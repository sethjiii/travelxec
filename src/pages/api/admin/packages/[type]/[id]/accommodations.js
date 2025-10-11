// src/pages/api/admin/packages/[type]/[id]/accommodations.js
import dbConnect from '../../../../dbConnect';
import TravelPackage from '@/models/TravelPackage';
import interTravelPackage from '@/models/interTravelPackage';
import Accommodation from '@/models/Accommodation';
import { getUserFromRequest } from '@/lib/getUserFromRequest';

export default async function handler(req, res) {
  await dbConnect();
  
  const user = await getUserFromRequest(req);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ success: false, error: "Access denied" });
  }

  const { type, id } = req.query; // type: 'domestic' | 'international'
  const PackageModel = type === 'domestic' ? TravelPackage : interTravelPackage;

  switch (req.method) {
    case 'GET':
      try {
        const pkg = await PackageModel.findById(id)
          .populate('accommodations.accommodationId')
          .lean();
        
        if (!pkg) {
          return res.status(404).json({ success: false, error: 'Package not found' });
        }

        return res.status(200).json({ 
          success: true, 
          data: pkg.accommodations 
        });
      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }

    case 'POST':
      try {
        const { accommodationId, nights, checkInDay } = req.body;

        // Validate accommodation exists
        const accommodation = await Accommodation.findById(accommodationId);
        if (!accommodation) {
          return res.status(404).json({ success: false, error: 'Accommodation not found' });
        }

        // Check if accommodation is already linked
        const pkg = await PackageModel.findById(id);
        const isAlreadyLinked = pkg.accommodations.some(
          acc => acc.accommodationId.toString() === accommodationId
        );

        if (isAlreadyLinked) {
          return res.status(400).json({ 
            success: false, 
            error: 'Accommodation already linked to this package' 
          });
        }

        // Add accommodation to package
        const updatedPackage = await PackageModel.findByIdAndUpdate(
          id,
          {
            $push: {
              accommodations: { accommodationId, nights, checkInDay }
            }
          },
          { new: true }
        ).populate('accommodations.accommodationId');

        return res.status(200).json({ 
          success: true, 
          data: updatedPackage.accommodations,
          message: 'Accommodation linked successfully'
        });

      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }

    case 'DELETE':
      try {
        const { accommodationId } = req.body;

        const updatedPackage = await PackageModel.findByIdAndUpdate(
          id,
          {
            $pull: {
              accommodations: { accommodationId }
            }
          },
          { new: true }
        );

        if (!updatedPackage) {
          return res.status(404).json({ success: false, error: 'Package not found' });
        }

        return res.status(200).json({ 
          success: true, 
          message: 'Accommodation unlinked successfully'
        });

      } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
      }

    default:
      return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
// src/pages/api/experiences/[id]/unlink-package.js
import dbConnect from "@/pages/api/dbConnect";
import Experience from "@/models/Experience";
import InterTravelPackage from "@/models/interTravelPackage";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

export default async function handler(req, res) {
  const { id } = req.query;
  const { packageId } = req.body;
  
  await dbConnect();

const user = await getUserFromRequest(req);
  if (!user || user.role !== "admin") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  switch (req.method) {
    case 'DELETE':
      try {
        if (!packageId) {
          return res.status(400).json({ 
            success: false, 
            error: 'Package ID is required' 
          });
        }

        const updatedExperience = await Experience.findByIdAndUpdate(
          id,
          {
            $pull: {
              linkedPackages: { packageId }
            }
          },
          { new: true }
        );

        if (!updatedExperience) {
          return res.status(404).json({ 
            success: false, 
            error: 'Experience not found' 
          });
        }

        res.status(200).json({ 
          success: true, 
          message: 'Package unlinked successfully',
          data: updatedExperience 
        });

      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// src/pages/api/experiences/[id]/link-package.js
import dbConnect from '../../dbConnect';
import Experience from '../../../../models/Experience';
import { getUserFromRequest } from "@/lib/getUserFromRequest";
export default async function handler(req, res) {
    const { id } = req.query;



    await dbConnect();


    const user = await getUserFromRequest(req);
    if (!user || user.role !== "admin") {
        return res.status(401).json({ error: "Unauthorized" });
    }

    switch (req.method) {
        case 'POST':
            try {
                const { packageId, packageType } = req.body;

                // Validate required fields
                if (!packageId || !packageType) {
                    return res.status(400).json({
                        success: false,
                        error: 'Package ID and type are required'
                    });
                }

                // Check if experience exists
                const experience = await Experience.findById(id);
                if (!experience) {
                    return res.status(404).json({
                        success: false,
                        error: 'Experience not found'
                    });
                }

                // Check if package is already linked
                const isAlreadyLinked = experience.linkedPackages.some(
                    pkg => pkg.packageId.toString() === packageId
                );

                if (isAlreadyLinked) {
                    return res.status(400).json({
                        success: false,
                        error: 'Package already linked to this experience'
                    });
                }

                // Add package to linkedPackages array
                const updatedExperience = await Experience.findByIdAndUpdate(
                    id,
                    {
                        $push: {
                            linkedPackages: { packageId, packageType }
                        }
                    },
                    { new: true }
                );

                res.status(200).json({
                    success: true,
                    message: 'Package linked successfully',
                    data: updatedExperience
                });

            } catch (error) {
                res.status(500).json({ success: false, error: error.message });
            }
            break;

        default:
            res.setHeader('Allow', ['POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

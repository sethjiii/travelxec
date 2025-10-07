import dbConnect from '../dbConnect';
import TravelPackage from '../../../models/TravelPackage';
import interTravelPackage from '../../../models/interTravelPackage';
import { z } from 'zod';

const querySchema = z.object({
  query: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  types: z.string().optional(), // comma-separated types
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
});

const escapeRegex = (str = '') => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getModelByType = (type) => {
  switch (type) {
    case 'domestic':
      return TravelPackage;
    case 'international':
      return interTravelPackage;
    default:
      throw new Error(`Invalid type: ${type}`);
  }
};

export default async function handler(req, res) {
  if (req.method !== 'GET')
    return res.status(405).json({ error: 'Method not allowed' });

  await dbConnect();

  try {
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success)
      return res.status(400).json({ error: 'Invalid query parameters' });

    const { query = '', page, limit, types, minPrice, maxPrice } = parsed.data;

    // --- Determine types ---
    const typeArray = types ? types.split(',').map(t => t.trim()) : ['domestic', 'international'];

    // --- Fetch all packages for all types ---
    let allPackages = [];

    for (const type of typeArray) {
      let Model;
      try {
        Model = getModelByType(type);
      } catch {
        continue;
      }

      const filter = {};

      if (query) {
        const searchRegex = new RegExp(escapeRegex(query.trim()), 'i');
        filter.$or = [
          { name: searchRegex },
          { description: searchRegex },
          { places: searchRegex },
        ];
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        filter.OnwardPrice = {};
        if (minPrice !== undefined) filter.OnwardPrice.$gte = minPrice;
        if (maxPrice !== undefined) filter.OnwardPrice.$lte = maxPrice;
      }

      const docs = await Model.find(filter).sort({ createdAt: -1 });
      allPackages.push(...docs.map(doc => ({ ...doc.toObject(), type })));
    }

    // --- Global Pagination ---
    const total = allPackages.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedPackages = allPackages.slice((page - 1) * limit, page * limit);

    return res.status(200).json({
      packages: paginatedPackages,
      pagination: { total, page, limit, totalPages },
    });
  } catch (err) {
    console.error('Package listing API error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

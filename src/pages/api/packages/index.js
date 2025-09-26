import dbConnect from '../dbConnect';
import TravelPackage from '../../../models/TravelPackage';
import interTravelPackage from '../../../models/interTravelPackage';
import { z } from 'zod';

const querySchema = z.object({
  id: z.string().optional(), // 👈 add id
  query: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minDays: z.coerce.number().optional(),
  maxDays: z.coerce.number().optional(),
  types: z.string().optional(), // comma-separated types
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
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  await dbConnect();

  try {
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid query parameters' });

    const { id, query = '', page, limit, minPrice, maxPrice, minDays, maxDays, types } = parsed.data;
    const skip = (page - 1) * limit;

    // 🔹 Handle single package fetch
    if (id) {
      const typeArray = types ? types.split(',').map((t) => t.trim()) : ['domestic', 'international'];
      for (const type of typeArray) {
        let Model;
        try {
          Model = getModelByType(type);
        } catch {
          continue;
        }

        const pkg = await Model.findById(id);
        if (pkg) {
          return res.status(200).json({ package: { ...pkg.toObject(), type } });
        }
      }
      return res.status(404).json({ error: 'Package not found' });
    }

    // 🔹 Otherwise: handle listing
    const searchRegex = new RegExp(escapeRegex(query.trim()), 'i');
    const typeArray = types ? types.split(',').map((t) => t.trim()) : ['domestic', 'international'];

    const results = [];
    let totalCount = 0;

    for (const type of typeArray) {
      let Model;
      try {
        Model = getModelByType(type);
      } catch {
        continue;
      }

      const filter = {};

      if (query) {
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

      if (minDays !== undefined || maxDays !== undefined) {
        filter.duration = {};
        if (minDays !== undefined) filter.duration.$gte = minDays;
        if (maxDays !== undefined) filter.duration.$lte = maxDays;
      }

      const count = await Model.countDocuments(filter);
      totalCount += count;

      const docs = await Model.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      results.push(...docs.map((doc) => ({ ...doc.toObject(), type })));
    }

    return res.status(200).json({
      packages: results,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Package listing API error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}

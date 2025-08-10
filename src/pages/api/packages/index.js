import dbConnect from '../dbConnect';
import TravelPackage from '../../../models/TravelPackage';
import { z } from 'zod'; // You must install Zod: npm install zod

const querySchema = z.object({
  query: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minDays: z.coerce.number().optional(),
  maxDays: z.coerce.number().optional(),
  types: z.string().optional(), // Will be split by comma later
});

const escapeRegex = (str = '') => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const parsed = querySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid query parameters' });
    }

    const {
      query = '',
      page,
      limit,
      minPrice,
      maxPrice,
      minDays,
      maxDays,
      types,
    } = parsed.data;

    const skip = (page - 1) * limit;
    const searchRegex = new RegExp(escapeRegex(query.trim()), 'i');

    const filter = {};

    if (query) {
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { city: searchRegex },
        { country: searchRegex },
      ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }

    if (minDays !== undefined || maxDays !== undefined) {
      filter.duration = {};
      if (minDays !== undefined) filter.duration.$gte = minDays;
      if (maxDays !== undefined) filter.duration.$lte = maxDays;
    }

    if (types) {
      const typeArray = types.split(',').map(t => t.trim());
      filter.type = { $in: typeArray };
    }

    const total = await TravelPackage.countDocuments(filter);

    const packages = await TravelPackage.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      packages,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Advanced Filter API Error'); // Avoid leaking stack trace in prod
    return res.status(500).json({ error: 'Server error' });
  }
}

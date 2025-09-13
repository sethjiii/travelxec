// pages/api/admin/popupleads.js
import dbConnect from '../dbConnect'; // adjust path if needed
import PopUpLead from '../../../models/PopUpLead';
import { getUserFromRequest } from '@/lib/getUserFromRequest';
import { Parser } from 'json2csv';

export default async function handler(req, res) {
  await dbConnect();

  // Require admin
  const user = await getUserFromRequest(req);
  if (!user || user.role !== 'admin') {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    // ---------------- GET LEADS ----------------
    if (req.method === 'GET') {
      const {
        page = '1',
        pageSize = '20',
        q,
        destination,
        contacted,
        minBudget,
        maxBudget,
        startDate,
        endDate,
        sort = '-subscribedAt',
        exportCsv // optional query param to export CSV
      } = req.query;

      const pageNum = Math.max(parseInt(page, 10) || 1, 1);
      const size = Math.min(Math.max(parseInt(pageSize, 10) || 20, 1), 100);

      const filter = {};
      if (q) {
        const re = new RegExp(String(q), 'i');
        filter.$or = [{ name: re }, { email: re }, { phone: re }];
      }
      if (destination) filter.destination = String(destination);
      if (contacted !== undefined) filter.contacted = contacted === 'true';
      if (minBudget) filter.budget = { ...filter.budget, $gte: Number(minBudget) };
      if (maxBudget) filter.budget = { ...filter.budget, $lte: Number(maxBudget) };
      if (startDate) filter.subscribedAt = { ...filter.subscribedAt, $gte: new Date(startDate) };
      if (endDate) filter.subscribedAt = { ...filter.subscribedAt, $lte: new Date(endDate) };

      const total = await PopUpLead.countDocuments(filter);
      const leads = await PopUpLead.find(filter)
        .sort(sort)
        .skip((pageNum - 1) * size)
        .limit(size)
        .select('name email phone destination budget subscribedAt contacted')
        .lean();

      // CSV export
      if (exportCsv === 'true') {
        const parser = new Parser();
        const csv = parser.parse(leads);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
        return res.status(200).send(csv);
      }

      const meta = {
        total,
        page: pageNum,
        pageSize: size,
        totalPages: Math.ceil(total / size),
      };

      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json({ success: true, leads, meta });
    }

    // ---------------- PATCH: Mark as contacted ----------------
    if (req.method === 'PATCH') {
      const { id, contacted } = req.body;
      if (!id) return res.status(400).json({ success: false, message: 'Lead ID required' });

      const updated = await PopUpLead.findByIdAndUpdate(
        id,
        { contacted: contacted ?? true },
        { new: true }
      );

      if (!updated) return res.status(404).json({ success: false, message: 'Lead not found' });

      return res.status(200).json({ success: true, lead: updated });
    }

    // ---------------- DELETE LEAD ----------------
    if (req.method === 'DELETE') {
      const { id } = req.body;
      if (!id) return res.status(400).json({ success: false, message: 'Lead ID required' });

      const deleted = await PopUpLead.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Lead not found' });

      return res.status(200).json({ success: true, message: 'Lead deleted successfully' });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (err) {
    console.error('Admin PopUpLeads Error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}


import dbConnect from '../../dbConnect';
import PackageLead from '@/models/PackageLead';
// import { sendLeadThankYouEmail } from '@/lib/mail';
// import { sendNotificationToAdmin } from '@/lib/notifications'; // ✅ Import your admin notifier

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    await dbConnect();

    const {
      packageId,
      userId,
      name,
      email,
      phone,
      numberOfTravelers,
      startDate,
      specialRequests,
      alternateContact,
      travelers,
      priceRange,
    } = req.body;

    if (!packageId || !name || !email || !phone) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    if (
      priceRange &&
      (typeof priceRange.max !== 'number' || priceRange.max <= 0)
    ) {
      return res.status(400).json({ error: 'Invalid priceRange format' });
    }

    const newLead = new PackageLead({
      packageId,
      userId: userId || null,
      name,
      email,
      phone,
      numberOfTravelers,
      startDate,
      specialRequests,
      alternateContact,
      travelers,
      priceRange,
    });

    const savedLead = await newLead.save();

    // ✅ Send confirmation to user
    // await sendLeadThankYouEmail({
    //   name,
    //   email,
    // });

    // ✅ Send admin notification
    // await sendNotificationToAdmin({
    //   subject: '📩 New Travel Package Lead Submitted',
    //   body: `
    //     A new lead has been submitted.

    //     Name: ${name}
    //     Email: ${email}
    //     Phone: ${phone}
    //     Package ID: ${packageId}
    //     Number of Travelers: ${numberOfTravelers || '-'}
    //     Start Date: ${startDate || '-'}
    //     Special Requests: ${specialRequests || '-'}
    //   `,
    // });

    return res.status(201).json({
      leadId: savedLead._id.toString(),
      email: savedLead.email,
    });
  } catch (error) {
    console.error('❌ Error creating lead:', error);
    return res.status(500).json({ error: 'Error creating lead' });
  }
}

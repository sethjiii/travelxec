import dbConnect from '../dbConnect';
import Subscriber from '../../../models/Subscriber';
import { sendNewsletterConfirmationEmail } from '../../../lib/mail';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    await dbConnect();
    const existing = await Subscriber.findOne({ email });

    if (existing) {
      return res.status(400).json({ error: 'Email already subscribed' });
    }

    await Subscriber.create({ email });
    await sendNewsletterConfirmationEmail(email); // ✅ fixed

    return res.status(200).json({ message: 'Subscribed and email sent' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
}

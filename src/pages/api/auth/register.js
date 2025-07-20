import dbConnect from '../dbConnect';
import User from '../../../models/user';
import UserProfile from '../../../models/userProfile'; // ✅ Import profile model
import bcrypt from 'bcrypt';
import { sendWelcomeEmail } from '@/lib/mail';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fullName, email, phone, password } = req.body;

  try {
    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: fullName,
      email,
      phone,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date(),
    });

    await newUser.save();

    // ✅ Automatically create user profile
    await UserProfile.create({
      userId: newUser._id,
      fullName,
      email,
      phoneNumber: phone,
      // Optional: You can prefill other fields or leave blank
    });

    // ✅ Send welcome email
    await sendWelcomeEmail(email, fullName);

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

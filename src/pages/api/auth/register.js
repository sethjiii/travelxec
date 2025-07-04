import dbConnect from '../dbConnect';  // Adjust path if needed
import User from '../../../models/user';  // Adjust path if needed
import bcrypt from 'bcrypt';
import { sendWelcomeEmail } from '@/lib/mail'; // ✅ Make sure this path is correct

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fullName, email, phone, password } = req.body;
  console.log(req.body);

  try {
    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name: fullName,
      email,
      phone,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date(),
    });

    await newUser.save();

    // ✅ Send welcome email
    await sendWelcomeEmail(email, fullName);

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

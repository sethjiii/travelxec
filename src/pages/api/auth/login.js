import dbConnect from '../dbConnect'; // ✅ adjust if needed
import User from '../../../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    await dbConnect();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      return res.status(500).json({ error: 'Server misconfiguration: JWT_SECRET missing' });
    }

    const tokenPayload = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };

    const expiresIn = user.role === 'admin' ? '6h' : '8h';
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn });

    // ✅ Return user data and token
    res.status(200).json({
      message: 'Login successful',
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.profilePicture,
        token,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error('❌ Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

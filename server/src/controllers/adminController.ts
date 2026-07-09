import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    res.json({ token, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const checkAuth = async (req: Request, res: Response) => {
  res.json({ authenticated: true });
};

export const seedAdmin = async () => {
  try {
    const existing = await Admin.findOne({ username: 'admin' });
    if (!existing) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'love2024', 12);
      await Admin.create({ username: 'admin', password: hashedPassword });
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Seed admin error:', error);
  }
};

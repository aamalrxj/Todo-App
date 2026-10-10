import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Creates a signed token valid for 7 days
const signToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password || password.length < 6) {
    res.status(400).json({ message: 'Email and a password of at least 6 characters are required' });
    return;
  }
  if (await User.findOne({ email: email.toLowerCase() })) {
    res.status(409).json({ message: 'Email already registered' });
    return;
  }

  const hashed = await bcrypt.hash(password, 10); // hash before saving
  const user = await User.create({ email, password: hashed });
  res.status(201).json({ token: signToken(user.id), user: { id: user.id, email: user.email } });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: (email || '').toLowerCase() });

  // Same message for both failures so we don't reveal which emails exist
  if (!user || !(await bcrypt.compare(password || '', user.password))) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }
  res.json({ token: signToken(user.id), user: { id: user.id, email: user.email } });
};
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Request type that carries the logged-in user's id
export interface AuthRequest extends Request {
  userId?: string;
}

// Protects routes: expects header "Authorization: Bearer <token>"
export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Not authorized, token missing' });
    return;
  }
  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};
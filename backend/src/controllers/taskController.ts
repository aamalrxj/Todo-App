import { Response } from 'express';
import Task from '../models/Task';
import { AuthRequest } from '../middleware/auth';

// GET /api/tasks: only the logged-in user's tasks, soonest deadline first
export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  const tasks = await Task.find({ user: req.userId }).sort({ deadline: 1 });
  res.json(tasks);
};

// POST /api/tasks
export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, description, dateTime, deadline, priority, category } = req.body;
  if (!title || !dateTime || !deadline) {
    res.status(400).json({ message: 'title, dateTime and deadline are required' });
    return;
  }
  const task = await Task.create({
    user: req.userId, title, description, dateTime, deadline, priority, category,
  });
  res.status(201).json(task);
};

// PUT /api/tasks/:id: used for marking complete and for editing
export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.userId }, // user check: can't touch others' tasks
    req.body,
    { new: true, runValidators: true }
  );
  if (!task) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }
  res.json(task);
};

// DELETE /api/tasks/:id
export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!task) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }
  res.json({ message: 'Task deleted' });
};
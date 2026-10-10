import { Router } from 'express';
import { protect } from '../middleware/auth';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController';

const router = Router();
router.use(protect); // every task route requires a valid token
router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
export default router;
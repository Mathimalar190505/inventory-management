import express from 'express';
import { addCategory ,getCategories,updateCategory,deleteCategory} from '../controllers/categoryController.js';
import bcrypt from 'bcrypt';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/add',addCategory);
router.get('/',getCategories);
router.put('/:id',updateCategory);
router.delete('/:id',deleteCategory);

export default router;
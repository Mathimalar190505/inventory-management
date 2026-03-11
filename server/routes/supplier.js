import express from 'express';
import { addCategory ,getCategories,updateCategory,deleteCategory} from '../controllers/categoryController.js';
import bcrypt from 'bcrypt';
import { addSupplier , getSuppliers ,updateSupplier ,deleteSupplier } from '../controllers/supplierController.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/add', addSupplier);
router.get('/', getSuppliers);
router.put('/:id',updateSupplier);
router.delete('/:id',deleteSupplier);

export default router;
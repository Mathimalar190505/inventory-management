import express from 'express';
import { addUser,getUsers,deleteUser,getUser,updateProfile} from '../controllers/userController.js';
import bcrypt from 'bcrypt';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/add',addUser);
router.get('/',getUsers);
router.delete('/:id',deleteUser);
router.get('/profile',authMiddleware,getUser);
router.put('/profile',authMiddleware,updateProfile);

export default router;
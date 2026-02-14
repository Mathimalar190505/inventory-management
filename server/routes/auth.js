import express from 'express';
import { login } from '../controllers/AuthController.js';
import bcrypt from 'bcrypt';
const router = express.Router();

router.post('/login',login);

export default router;
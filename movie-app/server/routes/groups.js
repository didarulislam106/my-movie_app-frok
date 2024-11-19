import express from 'express';
import { createGroup } from '../controllers/groupController.js';
import { authenticateToken } from '../helpers/authenticateUser.js';

const router = express.Router();

// Route to create a new group
router.post('/create', createGroup);

export default router;

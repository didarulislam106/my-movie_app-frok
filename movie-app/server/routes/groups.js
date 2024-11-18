import express from 'express';
import pool from '../db.js';
// import authenticateUser from '../middleware/authenticateUser.js';

const router = express.Router();

router.post('/create', async (req, res) => {
    const { name, description } = req.body;
    req.user = { id: 1 }; // Set user ID to 1 for testing
    const ownerId = req.user.id;

    if (!name || !description) {
        return res.status(400).json({ message: 'Name and description are required' });
    }

    try {
        const insertGroupQuery = `
            INSERT INTO Groups (id, name, description, owner_id)
            VALUES (DEFAULT, $1, $2, $3)
            RETURNING *;
        `;
        const result = await pool.query(insertGroupQuery, [name, description, ownerId]);
        res.status(201).json(result.rows[0]); // Send back created group details
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ message: 'Error creating group' });
    }
});

export default router;

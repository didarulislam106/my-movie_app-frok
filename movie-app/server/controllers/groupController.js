import Group from '../models/group.js';

export const createGroup = async (req, res) => {
    const { name, description } = req.body;
    req.user = { id: 1 }; // Set user ID to 1 for testing
    const ownerId = req.user.id;

    if (!name || !description) {
        return res.status(400).json({ message: 'Name and description are required' });
    }

    try {
        const group = await Group.create({ name, description, ownerId });
        res.status(201).json(group); // Send back created group details
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ message: 'Error creating group' });
    }
};

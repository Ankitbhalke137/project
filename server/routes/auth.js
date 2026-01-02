import express from 'express';
import Student from '../models/Student.js';

const router = express.Router();

// POST login - authenticate by name
router.post('/login', async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        // Find student by name (case-insensitive)
        const student = await Student.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') }
        });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Return student data (in production, you'd also create a session/JWT here)
        res.json(student);
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// GET current user info (placeholder for when you add session management)
router.get('/me', async (req, res) => {
    // For now, this is a placeholder
    // In production, you'd verify a session token/JWT and return the current user
    res.status(501).json({ error: 'Session management not implemented yet' });
});

export default router;

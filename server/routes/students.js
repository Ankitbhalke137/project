import express from 'express';
import Student from '../models/Student.js';

const router = express.Router();

// GET all students with optional filtering
router.get('/', async (req, res) => {
    try {
        const { campus, batch } = req.query;
        let filter = {};

        if (campus && campus !== 'All') {
            filter.campus = campus;
        }
        if (batch && batch !== 'All') {
            filter.batch = parseInt(batch);
        }

        const students = await Student.find(filter).sort({ name: 1 });
        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Failed to fetch students' });
    }
});

// GET single student by ID
router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({ error: 'Failed to fetch student' });
    }
});

// POST create new student
router.post('/', async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).json(student);
    } catch (error) {
        console.error('Error creating student:', error);
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Student with this name already exists' });
        }
        res.status(500).json({ error: 'Failed to create student' });
    }
});

// PUT update student
router.put('/:id', async (req, res) => {
    try {
        const allowedUpdates = ['location', 'avatar', 'about', 'portfolio', 'achievements'];
        const updates = {};

        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json(student);
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ error: 'Failed to update student' });
    }
});

// DELETE student
router.delete('/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ error: 'Failed to delete student' });
    }
});

export default router;

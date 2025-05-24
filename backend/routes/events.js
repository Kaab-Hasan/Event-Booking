const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { auth, admin } = require('../middlewares/auth');

// Public route - Create a new event request
router.post('/', eventController.createEvent);

// Public route - Get events by email
router.get('/user/:email', eventController.getEventsByEmail);

// Admin routes - Protected by auth and admin middleware
router.get('/', auth, admin, eventController.getAllEvents);
router.get('/:id', auth, admin, eventController.getEventById);
router.patch('/:id/status', auth, admin, eventController.updateEventStatus);
router.patch('/:id', auth, admin, eventController.updateEvent);

module.exports = router; 
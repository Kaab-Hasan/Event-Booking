const Event = require('../models/Event');

// Create a new event request
exports.createEvent = async (req, res) => {
  try {
    const { name, email, date, time, description } = req.body;
    
    // Create new event
    const event = new Event({
      name,
      email,
      date,
      time,
      description,
      status: 'pending' // Default status
    });
    
    await event.save();
    
    res.status(201).json({
      message: 'Event request submitted successfully',
      event
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all events (admin only)
exports.getAllEvents = async (req, res) => {
  try {
    // Get optional query parameters for filtering
    const { status } = req.query;
    
    // Build query
    const query = {};
    if (status) {
      query.status = status;
    }
    
    const events = await Event.find(query).sort({ createdAt: -1 });
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update event status (admin only)
exports.updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    event.status = status;
    await event.save();
    
    res.json({
      message: `Event ${status} successfully`,
      event
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update event date and time (admin only)
exports.updateEvent = async (req, res) => {
  try {
    const { date, time } = req.body;
    
    // Validate input
    if (!date || !time) {
      return res.status(400).json({ message: 'Date and time are required' });
    }
    
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Update event details
    event.date = date;
    event.time = time;
    
    await event.save();
    
    res.json({
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get events by email (for users to check their own events)
exports.getEventsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    
    const events = await Event.find({ email }).sort({ createdAt: -1 });
    
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 
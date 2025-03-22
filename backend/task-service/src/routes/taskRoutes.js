const express = require('express');
const Task = require('../models/Task');
const router = express.Router();
const { getChannel } = require('../rabbitmq'); // RabbitMQ integration

// POST /api/tasks — Create a new task and publish to RabbitMQ
router.post('/', async (req, res) => {
  try {
    console.log('POST /api/tasks hit', req.body);

    const { title } = req.body;
    const task = new Task({ title });
    await task.save();

    const channel = getChannel();
    if (channel) {
      channel.sendToQueue('tasks', Buffer.from(JSON.stringify(task)));
      console.log('Task sent to RabbitMQ queue');
    } else {
      console.warn('No RabbitMQ channel available — message not sent');
    }

    res.status(201).json(task);
  } catch (err) {
    console.error('Error in POST /api/tasks:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/tasks — Fetch all tasks from MongoDB
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/tasks hit');

    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error('Error in GET /api/tasks:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

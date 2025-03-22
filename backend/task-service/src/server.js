const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config');
const taskRoutes = require('./routes/taskRoutes');
const { connectRabbitMQ, getChannel } = require('./rabbitmq'); // extract helper

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(
    `Incoming request to task-service: ${req.method} ${req.originalUrl}`
  );
  next();
});

// Routes
app.use('/', taskRoutes);

app.all('*', (req, res) => {
  console.log(`Received unknown request: ${req.method} ${req.originalUrl}`);
  res.status(404).send('Not Found');
});

// Start only after Mongo & RabbitMQ are ready
async function startServer() {
  await connectDB();
  await connectRabbitMQ(); // Waits for full connection
  app.listen(PORT, () => {
    console.log(`🚀 Task Service running at http://localhost:${PORT}`);
  });
}

startServer();

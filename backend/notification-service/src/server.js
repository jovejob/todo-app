require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const amqp = require('amqplib');

const PORT = process.env.PORT || 5000;
const RABBITMQ_URL = process.env.RABBITMQ_URL;

const RETRY_INTERVAL_MS = 5000; // 5 seconds
const MAX_RETRIES = 10;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }, // allow frontend dev
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
});

const start = async () => {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const connection = await amqp.connect(RABBITMQ_URL);
      const channel = await connection.createChannel();
      const queue = 'tasks';

      await channel.assertQueue(queue);

      console.log('Connected to RabbitMQ from notification-service');
      console.log('Waiting for task messages...');

      channel.consume(queue, (msg) => {
        if (msg !== null) {
          const task = JSON.parse(msg.content.toString());
          console.log('New task received:', task);

          io.emit('newTask', task);
          channel.ack(msg);
        }
      });

      server.listen(PORT, () => {
        console.log(`Notification Service running at http://localhost:${PORT}`);
      });

      return; // Exit the retry loop
    } catch (err) {
      retries++;
      console.error(
        `RabbitMQ connection failed (attempt ${retries}/${MAX_RETRIES}):`,
        err.message
      );

      if (retries >= MAX_RETRIES) {
        console.error('Max retries reached. Exiting notification-service.');
        process.exit(1);
      }

      await new Promise((res) => setTimeout(res, RETRY_INTERVAL_MS));
    }
  }
};
start();

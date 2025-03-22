const amqp = require('amqplib');

let channel;
const MAX_RETRIES = 20;

async function connectRabbitMQ() {
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://rabbitmq';

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const connection = await amqp.connect(RABBITMQ_URL);
      channel = await connection.createChannel();
      await channel.assertQueue('tasks');
      console.log('Connected to RabbitMQ from task-service');
      return;
    } catch (err) {
      console.error(
        `RabbitMQ connection failed (attempt ${attempt}):`,
        err.message
      );
      await delay(2000);
    }
  }

  console.error('Failed to connect to RabbitMQ after max retries. Exiting...');
  process.exit(1);
}

function getChannel() {
  return channel;
}

module.exports = { connectRabbitMQ, getChannel };

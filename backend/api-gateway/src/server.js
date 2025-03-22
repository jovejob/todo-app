/**
 * API Gateway
 *
 * Responsibilities:
 * - Routes frontend requests to backend microservices
 * - Decouples frontend from direct service dependencies
 *
 * Future Enhancements:
 * - Handle authentication (JWT, API keys)
 * - Add rate-limiting / request throttling
 * - Route to multiple services (/api/users, /api/notifications, etc.)
 * - Implement GraphQL as a unified entry point maybe etc.
 * - Integrate with service mesh (e.g., Istio)
 */
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const http = require('http');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Enable CORS for local dev
app.use(cors());

// Debug: Log incoming task requests
app.use('/api/tasks', (req, res, next) => {
  console.log(`Proxying request to /api/tasks - task-service`);
  next();
});

// Debug: Log WebSocket connections
app.use('/socket.io', (req, res, next) => {
  console.log(
    'Proxying WebSocket request to /socket.io - notification-service'
  );
  next();
});

// Proxy /api/tasks - task-service
app.use(
  '/api/tasks',
  createProxyMiddleware({
    target: 'http://task-service:4000',
    changeOrigin: true,
    pathRewrite: {
      '^/api/tasks': '',
    },
  })
);

// Proxy /socket.io - notification-service (for real-time updates)
app.use(
  '/socket.io',
  createProxyMiddleware({
    target: 'http://notification-service:5050',
    changeOrigin: true,
    ws: true, // Required for socket.io!
  })
);

// Proxy /api/notifications - notification-service
app.use(
  '/api/notifications',
  createProxyMiddleware({
    target: 'http://notification-service:5050',
    changeOrigin: true,
  })
);

// Health check route
app.get('/', (req, res) => {
  res.send('API Gateway is up and running!');
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 API Gateway running at http://localhost:${PORT}`);
});

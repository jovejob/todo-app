# Real-Time To-Do App (Microservices Architecture)

This is a real-time collaborative To-Do app built using a microservices architecture. It's designed with scalability, modularity, and real-time communication in mind.

## Tech Stack

### Frontend

- Vue.js 2 (Simple real-time UI)
- Axios (for API calls)
- Socket.IO client (for real-time updates)

### Backend

- Task Service: Node.js + Express + MongoDB
  - Handles task creation and retrieval
  - Publishes task creation events to RabbitMQ
- Notification Service: Node.js + Socket.IO + RabbitMQ
  - Consumes task events and emits them to frontend clients via WebSocket
- API Gateway: Node.js + http-proxy-middleware
  - Routes `/api/tasks` and `/socket.io` to the respective services

### Infra & Messaging

- MongoDB (for persisting tasks)
- RabbitMQ (for async message queuing)
- Docker & Docker Compose (for containerized orchestration)

## Microservices Motivation

This project is broken into microservices for the following reasons:

- Scalability: Services can scale independently (e.g., task load is high? Scale just task-service).
- Separation of concerns: Each service has a single responsibility.
- Tech Flexibility: Services can be written in different stacks in the future.
- Team autonomy: Different teams can own different services.
- Real-world architecture: Mirrors production-ready cloud-native patterns.

## Features

- Add tasks from the UI
- View all existing tasks
- See tasks appear in real-time as other users add them (via WebSocket)
- All services run in Docker containers
- Fully decoupled using RabbitMQ

## Getting Started

1. Clone the repo:

```bash
git clone https://github.com/jovejob/todo-app.git
cd todo-app
```

2. Start the system:

```bash
docker-compose up --build
```

3. Visit:

- Frontend: [http://localhost:8080](http://localhost:8080)
- API Gateway: [http://localhost:3000](http://localhost:3000)
- RabbitMQ UI: [http://localhost:15672](http://localhost:15672) (guest/guest)

## Docker Containers

- `frontend`: Vue.js SPA
- `api-gateway`: Entry point to services
- `task-service`: REST API + MongoDB logic
- `notification-service`: WebSocket server + RabbitMQ consumer
- `mongo`: Task storage
- `rabbitmq`: Message broker

## Folder Structure

```
.
├── backend
│   ├── api-gateway
│   ├── task-service
│   └── notification-service
├── frontend
└── docker-compose.yml
```

## Concepts Used

- Microservices & service boundaries
- Message queues (RabbitMQ)
- Event-driven architecture
- WebSockets (Socket.IO)
- Reverse proxying via API Gateway
- Docker & Compose for full stack orchestration

## TODO / Improvements

- Add unit tests for each service
- Use persistent volumes for Mongo & RabbitMQ
- Add UI notifications on errors etc

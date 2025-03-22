<template>
  <div class="task-list">
    <h2>Tasks</h2>
    <ul v-if="tasks.length">
      <li v-for="task in tasks" :key="task._id">
        {{ task.title }}
      </li>
    </ul>
    <p v-else class="no-tasks">No tasks yet.</p>
  </div>
</template>

<script>
import axios from "axios";
import io from "socket.io-client";

export default {
  data() {
    return {
      tasks: [],
      socket: null,
    };
  },
  methods: {
    async fetchTasks() {
      try {
        const res = await axios.get("http://localhost:3000/api/tasks");
        this.tasks = res.data;
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    },
    listenForNewTasks() {
      this.socket = io("http://localhost:3000", {
        transports: ["websocket"],
      });

      this.socket.on("newTask", (task) => {
        console.log("Real-time task received via socket.io:", task);
        this.tasks.unshift(task);
      });
    },
  },
  mounted() {
    this.fetchTasks();
    this.listenForNewTasks();
  },
  beforeDestroy() {
    if (this.socket) this.socket.disconnect();
  },
};
</script>

<style scoped>
.task-list {
  margin-top: 2rem;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  background: #f4f4f4;
  margin-bottom: 0.5rem;
  padding: 0.75rem;
  border-radius: 5px;
}
.no-tasks {
  font-style: italic;
  color: #999;
  margin-top: 1rem;
}
</style>

<!-- <template>
  <div class="task-list">
    <h2>Tasks</h2>
    <ul>
      <li v-for="task in tasks" :key="task._id">
        {{ task.title }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import io from "socket.io-client";

export default {
  data() {
    return {
      tasks: [],
      socket: null,
    };
  },
  methods: {
    async fetchTasks() {
      try {
        // const res = await axios.get("http://localhost:4000/api/tasks");
        const res = await axios.get("http://localhost:3000/api/tasks");
        this.tasks = res.data;
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    },
    listenForNewTasks() {
      this.socket = io("http://localhost:3000", {
        transports: ["websocket"], // Force WebSocket, skip polling
      });

      this.socket.on("newTask", (task) => {
        console.log("Real-time task received via socket.io:", task);
        this.tasks.unshift(task); // prepend new task
      });
    },
  },
  mounted() {
    this.fetchTasks();
    this.listenForNewTasks();
  },
  beforeDestroy() {
    if (this.socket) this.socket.disconnect();
  },
};
</script>

<style scoped>
.task-list {
  margin-top: 2rem;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  background: #f4f4f4;
  margin-bottom: 0.5rem;
  padding: 0.75rem;
  border-radius: 5px;
}
</style> -->

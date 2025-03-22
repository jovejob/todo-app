<template>
  <form @submit.prevent="submitTask" class="task-form">
    <input v-model="title" type="text" placeholder="Enter a task" required />
    <button type="submit">Add Task</button>
  </form>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      title: "",
    };
  },
  methods: {
    async submitTask() {
      if (!this.title.trim()) return;

      try {
        await axios.post("http://localhost:3000/api/tasks", {
          title: this.title,
        });
        this.title = ""; // Clear input
      } catch (error) {
        console.error("Failed to add task:", error);
      }
    },
  },
};
</script>

<style scoped>
.task-form {
  display: flex;
  gap: 0.5rem;
}
.task-form input {
  flex: 1;
  padding: 0.5rem;
}
</style>

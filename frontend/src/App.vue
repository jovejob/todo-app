<template>
  <div id="app">
    <h1>Real-Time To-Do List</h1>
    <TaskForm />
    <TaskList />
  </div>
</template>

<script>
import TaskForm from "./components/TaskForm.vue";
import TaskList from "./components/TaskList.vue";

export default {
  name: "App",
  components: {
    TaskForm,
    TaskList,
  },
};
</script>

<style>
#app {
  max-width: 600px;
  margin: 40px auto;
  padding: 2rem;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
}
</style>

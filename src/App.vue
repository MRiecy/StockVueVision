<template>
  <div class="app">
    <MenuBar />
    <router-view />
  </div>
</template>

<script setup>
import MenuBar from '@/components/layout/MenuBar.vue';
</script>

<style>
.app {
  min-height: 100vh;
  background-color: #f5f5f5;
}

body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}
</style>

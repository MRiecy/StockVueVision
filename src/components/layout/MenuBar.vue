<template>
  <div class="menu-bar">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      router
      @select="handleSelect"
    >
      <el-menu-item index="/display">展示</el-menu-item>
      <el-menu-item index="/comparison">对比评估</el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const activeIndex = ref(route.path);

const handleSelect = (key) => {
  activeIndex.value = key;
  router.push(key);
};
</script>

<style scoped>
.menu-bar {
  width: 100%;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.el-menu-demo {
  padding: 0 20px;
}

.el-menu-item {
  font-size: 16px;
  height: 60px;
  line-height: 60px;
}
</style>

<template>
  <main class="trading-main">
    <div class="main-layout">
      <!-- 左侧内容区 -->
      <div class="main-content">
        <AssetDisplayModule />
      </div>
      
      <!-- 右侧边栏 -->
      <div class="right-sidebar">
        <RightAside />
      </div>
    </div>
  </main>
</template>

<script setup>
import AssetDisplayModule from '@/components/AssetDisplayModule.vue'
import RightAside from '@/components/layout/RightAside.vue'
</script>

<style scoped>
.trading-main {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-color);
  overflow: hidden;
}

.main-layout {
  display: flex;
  flex: 1;
  width: 100%;
  height: calc(100% - 60px); /* 减去可能的顶部导航高度 */
  overflow: hidden;
}

.main-content {
  flex: 3; /* 左侧内容区占3份 */
  padding: 10px;
  overflow-y: auto;
}

.right-sidebar {
  flex: 1; /* 右侧边栏占1份 */
  border-left: 1px solid var(--border-color);
  background-color: var(--panel-bg);
  overflow-y: auto;
}
</style> 
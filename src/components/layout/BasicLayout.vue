<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="25%">
        <AssetDisplayModule />
      </el-aside>
      <el-main>Main</el-main>
      <el-aside width="25%">Aside</el-aside>
    </el-container>
  </div>
</template>

<script>
import AssetDisplayModule from '../AssetDisplayModule.vue';

export default {
  name: 'BasicLayout',
  components: {
    AssetDisplayModule,
  },
};
</script>

<style scoped>
.common-layout {
  width: 100%;
  height: 100vh; /* 使布局高度铺满整个视窗 */
}

.el-container {
  height: 100%; /* 使容器高度铺满父容器 */
}

.el-aside {
  background-color: #f5f5f5; /* 侧边栏背景色 */
  padding: 20px; /* 侧边栏内边距 */
}

.el-main {
  background-color: #ffffff; /* 主体背景色 */
  padding: 20px; /* 主体内边距 */
}
</style>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="25%">
        <AssetDisplayModule />
      </el-aside>
      <el-main class="main-content">
        <!-- 第一块 -->
        <section class="section">
          <h3>板块一标题</h3>
          <!-- 具体内容 -->
        </section>

        <!-- 第二块 -->
        <section class="section">
          <h3>板块二标题</h3>
          <!-- 具体内容 -->
        </section>

        <!-- 第三块 图表展示 -->
        <ChartSection />

        <!-- 第四块 -->
        <section class="section">
          <h3>板块四标题</h3>
          <!-- 具体内容 -->
        </section>
      </el-main>
      <el-aside width="25%">Aside</el-aside>
    </el-container>
  </div>
</template>

<script>
import AssetDisplayModule from '../AssetDisplayModule.vue';
import ChartSection from './ChartSection.vue';
export default {
  name: 'BasicLayout',
  components: {
    AssetDisplayModule,
    ChartSection,
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
.main-content {
  overflow-y: auto;
  padding: 20px;
}
.section {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #fff;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
}
.section > h3 {
  font-size: 18px;
  margin-bottom: 15px;
}
</style>

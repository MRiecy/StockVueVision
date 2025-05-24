<template>
  <div class="display-page">
    <div class="left-section">
      <AssetDisplayModule />
    </div>
    <div class="middle-section">
      <StrategyExecution />
    </div>
    <div class="right-section">
      <StrategyExecutionResult />
    </div>
  </div>
</template>

<script>
import AssetDisplayModule from '@/components/layout/AssetDisplayModule.vue';
import StrategyExecution from '@/components/layout/StrategyExecution.vue';
import StrategyExecutionResult from '@/components/layout/StrategyExecutionResult.vue';

export default {
  name: 'DisplayPage',
  components: {
    AssetDisplayModule,
    StrategyExecution,
    StrategyExecutionResult,
  },
};
</script>

<style scoped>
.display-page {
  width: 100%;
  height: 100vh;
  display: flex;
  background-color: #2c3e50; /* 深灰色背景 */
  padding: 10px;
  box-sizing: border-box;
  gap: 10px;
  color: #2c3e50;
  overflow: hidden;
}

.left-section {
  width: 20%;
  height: 100%;
  min-width: 200px;
  background-color: #ecf0f1; /* 浅灰色背景 */
  border-radius: 0;
}

.middle-section {
  width: 20%;
  height: 100%;
  min-width: 200px;
  background-color: #ecf0f1;
  border-radius: 0;
}

.right-section {
  width: 60%;
  height: 100%;
  flex: 1;
  background-color: #ecf0f1;
  border-radius: 0;
}

/* 确保内容不会溢出 */
.left-section,
.middle-section,
.right-section {
  overflow: hidden;
}

/* 隐藏滚动条 */
:deep(*) {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

:deep(*)::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

/* 调整子组件中的文字颜色 */
:deep(.el-table) {
  background-color: #ecf0f1;
  color: #2c3e50;
  border-radius: 0;
}

:deep(.el-table th) {
  background-color: #bdc3c7 !important;
  color: #2c3e50;
}

:deep(.el-table td) {
  background-color: #ecf0f1;
  color: #2c3e50;
}

:deep(.el-table--border) {
  border-color: #bdc3c7;
  border-radius: 0;
}

:deep(.el-table--border th),
:deep(.el-table--border td) {
  border-color: #bdc3c7;
}

:deep(.el-select .el-input__inner) {
  background-color: #ffffff;
  color: #2c3e50;
  border-color: #bdc3c7;
  border-radius: 0;
}

:deep(.el-button) {
  background-color: #3498db;
  border-color: #3498db;
  color: #ffffff;
  border-radius: 0;
}

:deep(.el-button:hover) {
  background-color: #2980b9;
  border-color: #2980b9;
}

/* 调整标题和文本颜色 */
:deep(.title) {
  color: #2c3e50;
}

:deep(.el-table__header) {
  color: #2c3e50;
}

:deep(.el-table__body) {
  color: #2c3e50;
}

/* 移除所有子组件的圆角 */
:deep(*) {
  border-radius: 0 !important;
}
</style>

<template>
  <div class="common-layout">
    <!-- 第一部分：资产展示模块 -->
    <div class="section">
      <AssetDisplayModule />
    </div>

    <!-- 第二部分：策略选择和执行 -->
    <div class="section">
      <StrategyExecution />
    </div>

    <!-- 第三部分：策略执行结果 -->
    <div class="section">
      <StrategyExecutionResult />
    </div>

    <!-- 第四部分：右侧内容 -->
    <div class="section">
      <RightAside />
    </div>
  </div>
</template>

<script>
import AssetDisplayModule from './AssetDisplayModule.vue';
import RightAside from './RightAside.vue';
import StrategyExecution from './StrategyExecution.vue';
import StrategyExecutionResult from './StrategyExecutionResult.vue';

export default {
  name: 'BasicLayout',
  components: {
    AssetDisplayModule,
    RightAside,
    StrategyExecution,
    StrategyExecutionResult,
  },
};
</script>

<style scoped>
.common-layout {
  width: 100%;
  min-height: 100vh; /* 确保页面高度至少占满视窗 */
  background-color: #f5f5f5; /* 背景色 */
  padding: 20px; /* 整体内边距 */
  box-sizing: border-box; /* 包含内边距在总宽高内 */
}

.section {
  margin-bottom: 20px; /* 每个模块之间的间距 */
  padding: 20px; /* 模块内部间距 */
  background-color: #ffffff; /* 模块背景色 */
  border-radius: 8px; /* 圆角 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05); /* 微弱阴影 */
}

/* 确保页面内容可以滚动 */
.common-layout {
  overflow-y: auto;
}
</style>

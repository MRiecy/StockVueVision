<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="25%" class="no-gap">
        <AssetDisplayModule />
      </el-aside>
      <el-main class="main-content no-gap">
        <!-- 第一块 -->
        <div class="strategy-section">
          <!-- 策略选择和详情 -->
          <StrategyExecution />
        </div>

        <!-- 第二块 -->
        <div class="result-section">
          <!-- 策略执行结果 -->
          <StrategyExecutionResult />
        </div>
      </el-main>

      <el-aside width="25%" class="no-gap">
        <RightAside />
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import AssetDisplayModule from '../AssetDisplayModule.vue';
import RightAside from './RightAside.vue';
import StrategyExecution from './StrategyExecution.vue'; // 引入策略选择组件
import StrategyExecutionResult from './StrategyExecutionResult.vue'; // 引入策略执行结果组件

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
  height: 100vh; /* 使布局高度铺满整个视窗 */
}

.el-container {
  height: 100%; /* 使容器高度铺满父容器 */
}

.el-aside {
  background-color: #f5f5f5; /* 侧边栏背景色 */

}

.el-aside.no-gap,
.el-main.no-gap  {
  margin: 0;/* 移除默认外边距 */
  background-color: #ffffff; /* 主体背景色 */
  padding: 0; /* 主体内边距 */
}

.el-aside.no-gap {
  background-color: #f5f5f5; /* 左右侧边栏背景色 */
}

.el-main {
  background-color: #ffffff; /* 主体背景色 */
}

.main-content {
  overflow-y: auto;
  padding: 0;/*移除默认内边距 */
}

</style>

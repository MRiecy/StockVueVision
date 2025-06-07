<template>
  <div class="display-page">
    <!-- 网格背景装饰 -->
    <div class="grid-background"></div>
    
    <!-- 主要内容区域 -->
    <div class="content-wrapper">
      <!-- 左侧资产展示模块 -->
      <div class="left-section glass-panel">
        <div class="panel-header">
          <div class="header-line"></div>
          <h3 class="panel-title">
            <i class="title-icon"></i>
            资产展示
          </h3>
          <div class="status-indicator"></div>
        </div>
        <div class="panel-content">
          <AssetDisplayModule />
        </div>
        <div class="panel-footer">
          <div class="footer-decoration"></div>
        </div>
      </div>

      <!-- 右侧模块区域 -->
      <div class="right-section">
        <!-- 策略简介模块 -->
        <div class="strategy-intro-panel glass-panel">
          <div class="panel-header">
            <div class="header-line"></div>
            <h3 class="panel-title">
              <i class="title-icon"></i>
              策略简介
            </h3>
            <div class="status-indicator"></div>
          </div>
          <div class="panel-content">
            <StrategyExecution />
          </div>
          <div class="panel-footer">
            <div class="footer-decoration"></div>
          </div>
        </div>

        <!-- 策略执行结果图模块 -->
        <div class="strategy-result-panel glass-panel">
          <div class="panel-header">
            <div class="header-line"></div>
            <h3 class="panel-title">
              <i class="title-icon"></i>
              策略执行结果图
            </h3>
            <div class="status-indicator"></div>
          </div>
          <div class="panel-content">
            <StrategyExecutionResult />
          </div>
          <div class="panel-footer">
            <div class="footer-decoration"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 浮动装饰元素 -->
    <div class="floating-decorations">
      <div class="decoration-orb orb-1"></div>
      <div class="decoration-orb orb-2"></div>
      <div class="decoration-orb orb-3"></div>
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
  position: relative;
  width: 100%;
  height: calc(100vh - 120px);
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 2;
}

/* 主页面滚动条样式 */
.display-page::-webkit-scrollbar {
  width: 6px;
}

.display-page::-webkit-scrollbar-track {
  background: rgba(64, 224, 255, 0.1);
  border-radius: 3px;
}

.display-page::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(64, 224, 255, 0.6), rgba(30, 144, 255, 0.4));
  border-radius: 3px;
  box-shadow: 0 0 8px rgba(64, 224, 255, 0.3);
  transition: all 0.3s ease;
}

.display-page::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(64, 224, 255, 0.8), rgba(30, 144, 255, 0.6));
  box-shadow: 0 0 12px rgba(64, 224, 255, 0.5);
}

/* 网格背景装饰 */
.grid-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(64, 224, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(64, 224, 255, 0.05) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 20s linear infinite;
  pointer-events: none;
}

@keyframes gridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

/* 主要内容包装器 */
.content-wrapper {
  position: relative;
  width: 100%;
  min-height: 100%; /* 最小高度100%，内容可以超出 */
  display: flex;
  gap: 20px;
  z-index: 3;
}

/* 玻璃态面板样式 */
.glass-panel {
  position: relative;
  background: rgba(12, 20, 38, 0.4);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(64, 224, 255, 0.3);
  border-radius: 12px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 40px rgba(64, 224, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  overflow: hidden;
  transition: all 0.5s ease;
  animation: panelGlow 4s ease-in-out infinite alternate;
  display: flex;
  flex-direction: column;
}

.glass-panel:hover {
  border-color: rgba(64, 224, 255, 0.6);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.4),
    0 0 60px rgba(64, 224, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transform: translateY(-5px);
}

@keyframes panelGlow {
  0% {
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.3),
      0 0 40px rgba(64, 224, 255, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
  100% {
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.3),
      0 0 60px rgba(64, 224, 255, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }
}

/* 面板尺寸 */
.left-section {
  width: 38%;
  min-width: 380px;
}

.right-section {
  width: 62%;
  min-width: 520px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.strategy-intro-panel {
  flex: 0 1 auto; /* 根据内容自适应高度 */
  min-height: 320px; /* 保持最小高度 */
}

.strategy-result-panel {
  flex: 0 1 auto; /* 根据内容自适应高度 */
  min-height: 480px; /* 保持最小高度 */
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .content-wrapper {
    flex-direction: column;
    gap: 15px;
  }
  
  .left-section {
    width: 100%;
    min-width: auto;
    height: 400px;
  }
  
  .right-section {
    width: 100%;
    min-width: auto;
    flex-direction: row;
    height: 450px;
  }
  
  .strategy-intro-panel {
    width: 50%;
    height: 100%;
    min-height: 400px;
  }
  
  .strategy-result-panel {
    width: 50%;
    height: 100%;
    min-height: 400px;
  }
}

@media (max-width: 768px) {
  .display-page {
    padding: 10px;
  }
  
  .content-wrapper {
    gap: 10px;
  }
  
  .right-section {
    flex-direction: column;
    height: auto;
  }
  
  .strategy-intro-panel,
  .strategy-result-panel {
    width: 100%;
    height: 350px;
    min-height: 350px;
  }
}

/* 面板头部 */
.panel-header {
  position: relative;
  padding: 15px 20px;
  background: linear-gradient(135deg, 
    rgba(64, 224, 255, 0.1) 0%, 
    rgba(30, 144, 255, 0.05) 100%);
  border-bottom: 1px solid rgba(64, 224, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-line {
  width: 3px;
  height: 20px;
  background: linear-gradient(180deg, #40e0ff, #1e90ff);
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(64, 224, 255, 0.8);
}

.panel-title {
  flex: 1;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 8px;
  text-shadow: 0 0 10px rgba(64, 224, 255, 0.5);
}

.title-icon {
  width: 16px;
  height: 16px;
  background: linear-gradient(135deg, #40e0ff, #1e90ff);
  border-radius: 3px;
  box-shadow: 0 0 8px rgba(64, 224, 255, 0.6);
  animation: iconPulse 2s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.1); }
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #00ff88;
  box-shadow: 
    0 0 10px #00ff88,
    0 0 20px rgba(0, 255, 136, 0.5);
  animation: statusBlink 2s ease-in-out infinite;
}

@keyframes statusBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* 面板内容 */
.panel-content {
  flex: 1;
  padding: 20px;
  overflow: auto;
  position: relative;
}

/* 面板内容滚动条样式 */
.panel-content::-webkit-scrollbar {
  width: 4px;
}

.panel-content::-webkit-scrollbar-track {
  background: rgba(64, 224, 255, 0.1);
  border-radius: 2px;
}

.panel-content::-webkit-scrollbar-thumb {
  background: rgba(64, 224, 255, 0.4);
  border-radius: 2px;
  transition: background 0.3s ease;
}

.panel-content::-webkit-scrollbar-thumb:hover {
  background: rgba(64, 224, 255, 0.6);
}

/* 面板底部 */
.panel-footer {
  height: 3px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(64, 224, 255, 0.6) 50%, 
    transparent 100%);
  position: relative;
}

.footer-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(64, 224, 255, 0.8) 50%, 
    transparent 100%);
  animation: footerFlow 3s ease-in-out infinite;
}

@keyframes footerFlow {
  0%, 100% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
}

/* 浮动装饰元素 */
.floating-decorations {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.decoration-orb {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(64, 224, 255, 0.3), transparent);
  box-shadow: 0 0 30px rgba(64, 224, 255, 0.4);
  animation: orbFloat 8s ease-in-out infinite;
}

.orb-1 {
  width: 100px;
  height: 100px;
  top: 15%;
  right: 15%;
  animation-delay: 0s;
}

.orb-2 {
  width: 60px;
  height: 60px;
  bottom: 25%;
  left: 35%;
  animation-delay: 2s;
}

.orb-3 {
  width: 80px;
  height: 80px;
  top: 50%;
  right: 5%;
  animation-delay: 4s;
}

@keyframes orbFloat {
  0%, 100% { transform: translateY(0px); opacity: 0.3; }
  50% { transform: translateY(-20px); opacity: 0.6; }
}

/* 全局样式覆盖 */
:deep(.el-table) {
  background: rgba(12, 20, 38, 0.6) !important;
  color: #000000 !important;
  border: 1px solid rgba(64, 224, 255, 0.2) !important;
  border-radius: 8px !important;
  overflow: hidden;
}

:deep(.el-table th) {
  background: rgba(64, 224, 255, 0.1) !important;
  color: #000000 !important;
  border-color: rgba(64, 224, 255, 0.2) !important;
  font-weight: bold !important;
}

:deep(.el-table td) {
  background: rgba(12, 20, 38, 0.4) !important;
  color: #000000 !important;
  border-color: rgba(64, 224, 255, 0.1) !important;
}

:deep(.el-table tr:hover td) {
  background: rgba(64, 224, 255, 0.1) !important;
}

:deep(.el-select .el-input__wrapper) {
  background: rgba(12, 20, 38, 0.8) !important;
  border: 1px solid rgba(64, 224, 255, 0.3) !important;
  border-radius: 6px !important;
  box-shadow: 0 0 10px rgba(64, 224, 255, 0.2) !important;
}

:deep(.el-select .el-input__inner) {
  color: #000000 !important;
  text-shadow: 0 0 5px rgba(64, 224, 255, 0.3);
}

:deep(.el-button) {
  background: linear-gradient(135deg, rgba(64, 224, 255, 0.2), rgba(30, 144, 255, 0.2)) !important;
  border: 1px solid rgba(64, 224, 255, 0.4) !important;
  color: #ffffff !important;
  border-radius: 6px !important;
  box-shadow: 0 0 15px rgba(64, 224, 255, 0.3) !important;
  transition: all 0.3s ease !important;
  text-shadow: 0 0 5px rgba(64, 224, 255, 0.5);
}

:deep(.el-button:hover) {
  background: linear-gradient(135deg, rgba(64, 224, 255, 0.4), rgba(30, 144, 255, 0.4)) !important;
  border-color: rgba(64, 224, 255, 0.8) !important;
  box-shadow: 0 0 25px rgba(64, 224, 255, 0.6) !important;
  transform: translateY(-2px);
}

:deep(.el-input__wrapper) {
  background: rgba(12, 20, 38, 0.8) !important;
  border: 1px solid rgba(64, 224, 255, 0.3) !important;
  border-radius: 6px !important;
  box-shadow: 0 0 10px rgba(64, 224, 255, 0.2) !important;
}

:deep(.el-input__inner) {
  color: #000000 !important;
  text-shadow: 0 0 5px rgba(64, 224, 255, 0.3);
}

:deep(.el-card) {
  background: rgba(12, 20, 38, 0.6) !important;
  border: 1px solid rgba(64, 224, 255, 0.2) !important;
  border-radius: 8px !important;
  box-shadow: 0 0 20px rgba(64, 224, 255, 0.1) !important;
}

:deep(.el-card__header) {
  background: rgba(64, 224, 255, 0.1) !important;
  color: #ffffff !important;
  border-bottom: 1px solid rgba(64, 224, 255, 0.2) !important;
}

:deep(.el-card__body) {
  color: #ffffff !important;
}

/* 移除圆角限制，使用现代化的圆角设计 */
:deep(*) {
  border-radius: inherit !important;
}

/* ECharts图表优化 */
:deep(.echarts) {
  border-radius: 8px !important;
  box-shadow: 0 0 20px rgba(64, 224, 255, 0.1) !important;
}
</style> 
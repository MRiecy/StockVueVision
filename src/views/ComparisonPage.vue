<template>
  <div class="comparison-page">
    <!-- 网格背景装饰 -->
    <div class="grid-background"></div>

    <!-- 主要内容区域 -->
    <div class="content-wrapper">
      <!-- 左侧导航栏 -->
      <div class="left-sidebar glass-panel">
        <div class="sidebar-header">
          <div class="header-line"></div>
          <h3 class="sidebar-title">对比评估</h3>
        </div>

        <div class="sidebar-menu">
          <div
            class="menu-item"
            :class="{ active: activeMenu === 'asset' }"
            @click="setActiveMenu('asset')"
          >
            <div class="menu-icon asset-icon"></div>
            <span>资产对比</span>
          </div>

          <div
            class="menu-item"
            :class="{ active: activeMenu === 'time' }"
            @click="setActiveMenu('time')"
          >
            <div class="menu-icon time-icon"></div>
            <span>时间段对比</span>
          </div>

          <div
            class="menu-item"
            :class="{ active: activeMenu === 'region' }"
            @click="setActiveMenu('region')"
          >
            <div class="menu-icon region-icon"></div>
            <span>交易所对比</span>
          </div>
        </div>
      </div>

      <!-- 左侧分析区域 -->
      <div class="left-analysis glass-panel">
        <div class="panel-header">
          <div class="header-line"></div>
          <h4 class="panel-title">
            <i class="title-icon analysis-icon"></i>
            {{ getAnalysisTitle() }}
          </h4>
          <div class="status-indicator"></div>
        </div>
        <div class="panel-content">
          <component :is="currentComponent" />
        </div>
      </div>

      <!-- 右侧风险板块 -->
      <div class="risk-panel glass-panel">
        <!-- 风险阈值面板 -->
        <div class="risk-section">
          <div class="panel-header">
            <div class="header-line"></div>
            <h4 class="panel-title">
              <i class="title-icon threshold-icon"></i>
              风险阈值
            </h4>
            <div class="status-indicator"></div>
          </div>
          <div class="panel-content">
            <RiskThreshold :data="riskThresholdData" />
          </div>
        </div>

        <!-- 风险预警面板 -->
        <div class="risk-section">
          <div class="panel-header">
            <div class="header-line"></div>
            <h4 class="panel-title">
              <i class="title-icon warning-icon"></i>
              风险预警
            </h4>
            <div class="status-indicator"></div>
          </div>
          <div class="panel-content">
            <RiskWarning :warnings="riskWarnings" />
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
import AssetCategoryAnalysis from '@/components/layout/AssetCategoryAnalysis.vue';
import TimePeriodAnalysis from '@/components/layout/TimePeriodAnalysis.vue';
import ExchangeAnalysis from '@/components/layout/ExchangeAnalysis.vue';
import RiskWarning from '@/components/comparison/RiskWarning.vue';
import RiskThreshold from '@/components/comparison/RiskThreshold.vue';

export default {
  name: 'ComparisonPage',
  components: {
    AssetCategoryAnalysis,
    TimePeriodAnalysis,
    ExchangeAnalysis,
    RiskWarning,
    RiskThreshold
  },
  data() {
    return {
      activeMenu: 'asset',
      riskThresholdData: [
        { metric: '最大损失', value: '5%', status: 'normal' },
        { metric: '波动率', value: '12%', status: 'warning' },
        { metric: '回撤幅度', value: '8%', status: 'normal' },
        { metric: 'VaR值', value: '3.2%', status: 'normal' }
      ],
      riskWarnings: [
        {
          level: 'high',
          message: '股票A波动率异常偏高',
          time: '2025-01-25 15:45',
          action: '建议立即减仓'
        },
        {
          level: 'medium',
          message: '市场整体下跌风险增加',
          time: '2025-01-25 15:30',
          action: '建议观望'
        },
        {
          level: 'low',
          message: '市场波动率略高',
          time: '2025-01-25 14:30',
          action: '建议适当降低仓位'
        }
      ]
    };
  },
  computed: {
    currentComponent() {
      switch (this.activeMenu) {
        case 'asset':
          return 'AssetCategoryAnalysis';
        case 'time':
          return 'TimePeriodAnalysis';
        case 'region':
          return 'ExchangeAnalysis';
        default:
          return 'AssetCategoryAnalysis';
      }
    }
  },
  methods: {
    setActiveMenu(menu) {
      this.activeMenu = menu;
    },
    getAnalysisTitle() {
      const titleMap = {
        asset: '资产类别对比分析',
        time: '时间段对比分析',
        region: '交易所对比分析'
      };
      return titleMap[this.activeMenu] || '对比分析';
    }
  }
};
</script>

<style scoped>
.comparison-page {
  position: relative;
  width: 100%;
  height: calc(100vh - 120px);
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
  z-index: 2;
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
  height: 100%;
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
}

.glass-panel:hover {
  border-color: rgba(64, 224, 255, 0.6);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.4),
    0 0 60px rgba(64, 224, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* 左侧导航栏 */
.left-sidebar {
  width: 180px;
  min-width: 180px;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 15px;
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
  height: 16px;
  background: linear-gradient(180deg, #40e0ff, #1e90ff);
  border-radius: 2px;
  box-shadow: 0 0 8px rgba(64, 224, 255, 0.8);
}

.sidebar-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  text-shadow: 0 0 8px rgba(64, 224, 255, 0.5);
}

.sidebar-menu {
  flex: 1;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
}

.menu-item:hover {
  background: rgba(64, 224, 255, 0.1);
  color: #ffffff;
  transform: translateX(3px);
}

.menu-item.active {
  background: rgba(64, 224, 255, 0.2);
  color: #40e0ff;
  border: 1px solid rgba(64, 224, 255, 0.3);
  box-shadow: 0 0 15px rgba(64, 224, 255, 0.2);
}

.menu-icon {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.asset-icon {
  background: linear-gradient(135deg, #40e0ff, #1e90ff);
}

.time-icon {
  background: linear-gradient(135deg, #feca57, #ff9ff3);
}

.region-icon {
  background: linear-gradient(135deg, #48dbfb, #0abde3);
}

.menu-item.active .menu-icon {
  box-shadow: 0 0 10px rgba(64, 224, 255, 0.6);
  transform: scale(1.1);
}

/* 左侧分析区域 */
.left-analysis {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* 右侧风险面板 */
.risk-panel {
  width: 400px;
  min-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.risk-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: rgba(12, 20, 38, 0.4);
  border: 1px solid rgba(64, 224, 255, 0.3);
  border-radius: 12px;
  overflow: hidden;
}

/* 面板头部 */
.panel-header {
  padding: 12px 15px;
  background: linear-gradient(135deg,
    rgba(64, 224, 255, 0.1) 0%,
    rgba(30, 144, 255, 0.05) 100%);
  border-bottom: 1px solid rgba(64, 224, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.panel-title {
  flex: 1;
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 6px;
  text-shadow: 0 0 8px rgba(64, 224, 255, 0.5);
}

.title-icon {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  box-shadow: 0 0 6px rgba(64, 224, 255, 0.6);
  animation: iconPulse 2s ease-in-out infinite;
}

.analysis-icon {
  background: linear-gradient(135deg, #40e0ff, #1e90ff);
}

.warning-icon {
  background: linear-gradient(135deg, #ff9f43, #feca57);
}

.threshold-icon {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
}

@keyframes iconPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.1); }
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00ff88;
  box-shadow:
    0 0 8px #00ff88,
    0 0 16px rgba(0, 255, 136, 0.5);
  animation: statusBlink 2s ease-in-out infinite;
}

@keyframes statusBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* 面板内容 */
.panel-content {
  flex: 1;
  padding: 15px;
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
  width: 80px;
  height: 80px;
  top: 10%;
  right: 20%;
  animation-delay: 0s;
}

.orb-2 {
  width: 60px;
  height: 60px;
  bottom: 20%;
  left: 15%;
  animation-delay: 3s;
}

.orb-3 {
  width: 70px;
  height: 70px;
  top: 60%;
  right: 10%;
  animation-delay: 6s;
}

@keyframes orbFloat {
  0%, 100% { transform: translateY(0px); opacity: 0.3; }
  50% { transform: translateY(-15px); opacity: 0.6; }
}

/* 响应式设计 */
@media (max-width: 1400px) {
  .risk-panel {
    width: 350px;
    min-width: 350px;
  }
}

@media (max-width: 1200px) {
  .left-sidebar {
    width: 160px;
    min-width: 160px;
  }

  .risk-panel {
    width: 300px;
    min-width: 300px;
  }
}

@media (max-width: 992px) {
  .content-wrapper {
    flex-direction: column;
  }

  .left-sidebar {
    width: 100%;
    height: auto;
    flex-direction: row;
  }

  .sidebar-menu {
    flex-direction: row;
    padding: 10px;
  }

  .left-analysis,
  .risk-panel {
    width: 100%;
    min-width: 100%;
  }

  .risk-section {
    min-height: 300px;
  }
}
</style>

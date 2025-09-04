<template>
  <div class="home-view">
    <!-- 网格背景装饰 -->
    <div class="grid-background"></div>

    <!-- 主要内容区域 -->
    <div class="content-wrapper">
      <!-- 欢迎标题 -->
      <div class="welcome-section glass-panel">
        <div class="panel-header">
          <div class="header-line"></div>
          <h1 class="welcome-title">
            <i class="title-icon"></i>
            欢迎使用 StockVueVision
          </h1>
          <div class="status-indicator"></div>
        </div>
        <div class="welcome-content">
          <p class="welcome-text">专业的股票投资策略分析与执行平台</p>
          <p class="subtitle">连接国金平台，实时数据，智能分析</p>
        </div>
      </div>

      <!-- 快速导航卡片 -->
      <div class="navigation-cards">
        <div class="card glass-panel" @click="navigateTo('/display')">
          <div class="card-icon">📊</div>
          <h3 class="card-title">数据展示</h3>
          <p class="card-description">查看账户资产、持仓信息和策略执行结果</p>
        </div>

        <div class="card glass-panel" @click="navigateTo('/comparison')">
          <div class="card-icon">📈</div>
          <h3 class="card-title">对比分析</h3>
          <p class="card-description">多维度数据对比和风险分析</p>
        </div>

        <div class="card glass-panel" @click="navigateTo('/strategy')">
          <div class="card-icon">🎯</div>
          <h3 class="card-title">策略管理</h3>
          <p class="card-description">策略配置、回测和执行管理</p>
        </div>

        <div class="card glass-panel" @click="navigateTo('/reports')">
          <div class="card-icon">📋</div>
          <h3 class="card-title">报告中心</h3>
          <p class="card-description">生成和查看各类分析报告</p>
        </div>
      </div>

      <!-- 系统状态 -->
      <div class="system-status glass-panel">
        <div class="panel-header">
          <div class="header-line"></div>
          <h3 class="panel-title">
            <i class="title-icon"></i>
            系统状态
          </h3>
          <div class="status-indicator"></div>
        </div>
        <div class="status-content">
          <div class="status-item">
            <span class="status-label">后端连接:</span>
            <span class="status-value" :class="backendStatus.class">
              {{ backendStatus.text }}
            </span>
          </div>
          <div class="status-item">
            <span class="status-label">数据源:</span>
            <span class="status-value" :class="dataSourceStatus.class">
              {{ dataSourceStatus.text }}
            </span>
          </div>
          <div class="status-item">
            <span class="status-label">最后更新:</span>
            <span class="status-value">{{ lastUpdateTime }}</span>
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  name: 'HomeView',
  setup() {
    const router = useRouter();
    const backendStatus = ref({ text: '检查中...', class: 'checking' });
    const dataSourceStatus = ref({ text: '检查中...', class: 'checking' });
    const lastUpdateTime = ref('--');

    const checkBackendStatus = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/health/');
        backendStatus.value = { text: '已连接', class: 'connected' };
        dataSourceStatus.value = { text: '国金平台', class: 'connected' };
        lastUpdateTime.value = new Date().toLocaleString('zh-CN');
      } catch (error) {
        console.error('后端连接检查失败:', error);
        backendStatus.value = { text: '未连接', class: 'disconnected' };
        dataSourceStatus.value = { text: '无法访问', class: 'disconnected' };
        lastUpdateTime.value = '--';
      }
    };

    const navigateTo = (path) => {
      router.push(path);
    };

    onMounted(() => {
      checkBackendStatus();
    });

    return {
      backendStatus,
      dataSourceStatus,
      lastUpdateTime,
      navigateTo
    };
  }
};
</script>

<style scoped>
.home-view {
  position: relative;
  width: 100%;
  min-height: calc(100vh - 140px);
  padding: 20px;
  box-sizing: border-box;
  overflow: auto;
  z-index: 2;
}

.grid-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(rgba(64, 224, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(64, 224, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  z-index: -1;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.glass-panel {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(64, 224, 255, 0.2);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.panel-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.header-line {
  width: 4px;
  height: 20px;
  background: linear-gradient(180deg, #00ffff 0%, #0080ff 100%);
  border-radius: 2px;
  margin-right: 12px;
}

.panel-title {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  flex: 1;
}

.title-icon {
  display: inline-block;
  width: 20px;
  height: 20px;
  background: linear-gradient(45deg, #00ffff, #0080ff);
  border-radius: 50%;
  margin-right: 8px;
  vertical-align: middle;
}

.status-indicator {
  width: 8px;
  height: 8px;
  background: #00ffff;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.welcome-section {
  text-align: center;
  padding: 40px 24px;
}

.welcome-title {
  font-size: 32px;
  margin-bottom: 16px;
  background: linear-gradient(45deg, #00ffff, #0080ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-text {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 8px;
}

.subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.navigation-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.card {
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  padding: 32px 24px;
}

.card:hover {
  transform: translateY(-8px);
  border-color: rgba(64, 224, 255, 0.4);
  box-shadow: 0 12px 40px rgba(64, 224, 255, 0.2);
}

.card-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 12px;
}

.card-description {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
}

.system-status {
  margin-top: 20px;
}

.status-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(64, 224, 255, 0.1);
}

.status-item:last-child {
  border-bottom: none;
}

.status-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.status-value {
  font-size: 14px;
  font-weight: 500;
}

.status-value.connected {
  color: #00ff88;
}

.status-value.disconnected {
  color: #ff4757;
}

.status-value.checking {
  color: #ffa502;
}

.floating-decorations {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.decoration-orb {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(64, 224, 255, 0.3) 0%, transparent 70%);
  animation: float 20s infinite linear;
}

.orb-1 {
  width: 120px;
  height: 120px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 80px;
  height: 80px;
  top: 60%;
  right: 15%;
  animation-delay: -7s;
}

.orb-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 20%;
  animation-delay: -14s;
}

@keyframes float {
  0% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0.3;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@media (max-width: 768px) {
  .home-view {
    padding: 16px;
  }

  .welcome-title {
    font-size: 24px;
  }

  .navigation-cards {
    grid-template-columns: 1fr;
  }

  .card {
    padding: 24px 20px;
  }
}
</style>

<template>
  <div class="risk-warning">
    <div class="warning-header">
      <div class="status-overview">
        <div class="status-circle" :class="getOverallStatus()"></div>
        <div class="status-text">
          <div class="status-title">{{ getStatusTitle() }}</div>
          <div class="status-subtitle">{{ getStatusSubtitle() }}</div>
        </div>
      </div>
      <div class="refresh-time">
        最后更新: {{ currentTime }}
      </div>
    </div>

    <div class="warning-content">
      <div class="warning-list">
        <div 
          v-for="(warning, index) in warnings" 
          :key="index"
          class="warning-item"
          :class="warning.level"
        >
          <div class="warning-icon" :class="`icon-${warning.level}`">
            <div class="icon-pulse"></div>
          </div>
          
          <div class="warning-details">
            <div class="warning-message">{{ warning.message }}</div>
            <div class="warning-meta">
              <span class="warning-time">{{ warning.time }}</span>
              <span class="warning-action">{{ warning.action }}</span>
            </div>
          </div>
          
          <div class="warning-level-badge" :class="warning.level">
            {{ getLevelText(warning.level) }}
          </div>
        </div>
      </div>

      <div class="warning-stats">
        <div class="stats-title">预警统计</div>
        <div class="stats-grid">
          <div class="stat-item high">
            <div class="stat-icon"></div>
            <div class="stat-content">
              <div class="stat-number">{{ getHighRiskCount() }}</div>
              <div class="stat-label">高风险</div>
            </div>
          </div>
          
          <div class="stat-item medium">
            <div class="stat-icon"></div>
            <div class="stat-content">
              <div class="stat-number">{{ getMediumRiskCount() }}</div>
              <div class="stat-label">中风险</div>
            </div>
          </div>
          
          <div class="stat-item low">
            <div class="stat-icon"></div>
            <div class="stat-content">
              <div class="stat-number">{{ getLowRiskCount() }}</div>
              <div class="stat-label">低风险</div>
            </div>
          </div>
          
          <div class="stat-item normal">
            <div class="stat-icon"></div>
            <div class="stat-content">
              <div class="stat-number">{{ getNormalCount() }}</div>
              <div class="stat-label">正常</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="warning-actions">
      <el-button size="small" type="primary" @click="handleAllWarnings">
        <i class="handle-icon"></i>
        处理全部
      </el-button>
      <el-button size="small" @click="refreshWarnings">
        <i class="refresh-icon"></i>
        刷新状态
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RiskWarning',
  props: {
    warnings: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentTime: '',
      timer: null
    };
  },
  mounted() {
    this.updateTime();
    this.timer = setInterval(this.updateTime, 1000);
  },
  beforeUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    updateTime() {
      const now = new Date();
      this.currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    },
    
    getOverallStatus() {
      const highRisk = this.getHighRiskCount();
      const mediumRisk = this.getMediumRiskCount();
      
      if (highRisk > 0) return 'status-danger';
      if (mediumRisk > 0) return 'status-warning';
      return 'status-safe';
    },
    
    getStatusTitle() {
      const status = this.getOverallStatus();
      const statusMap = {
        'status-danger': '风险预警',
        'status-warning': '需要关注',
        'status-safe': '系统正常'
      };
      return statusMap[status] || '未知状态';
    },
    
    getStatusSubtitle() {
      const total = this.warnings.length;
      const risk = this.getHighRiskCount() + this.getMediumRiskCount();
      return `共${total}项监控，${risk}项需要关注`;
    },
    
    getLevelText(level) {
      const levelMap = {
        high: '高',
        medium: '中',
        low: '低',
        normal: '正常'
      };
      return levelMap[level] || '未知';
    },
    
    getHighRiskCount() {
      return this.warnings.filter(w => w.level === 'high').length;
    },
    
    getMediumRiskCount() {
      return this.warnings.filter(w => w.level === 'medium').length;
    },
    
    getLowRiskCount() {
      return this.warnings.filter(w => w.level === 'low').length;
    },
    
    getNormalCount() {
      return this.warnings.filter(w => w.level === 'normal').length;
    },
    
    handleAllWarnings() {
      console.log('处理全部预警');
      // 这里可以实现处理所有预警的逻辑
    },
    
    refreshWarnings() {
      console.log('刷新预警状态');
      // 这里可以实现刷新预警数据的逻辑
      this.$emit('refresh');
    }
  }
};
</script>

<style scoped>
.risk-warning {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.warning-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(64, 224, 255, 0.2);
  border-radius: 8px;
}

.status-overview {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-circle {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  position: relative;
  animation: statusPulse 2s ease-in-out infinite;
}

.status-circle.status-safe {
  background: #00ff88;
  box-shadow: 0 0 12px rgba(0, 255, 136, 0.6);
}

.status-circle.status-warning {
  background: #feca57;
  box-shadow: 0 0 12px rgba(254, 202, 87, 0.6);
}

.status-circle.status-danger {
  background: #ff6b6b;
  box-shadow: 0 0 12px rgba(255, 107, 107, 0.6);
}

@keyframes statusPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
}

.status-text {
  display: flex;
  flex-direction: column;
}

.status-title {
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
}

.status-subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 10px;
}

.refresh-time {
  color: rgba(255, 255, 255, 0.6);
  font-size: 10px;
  font-family: monospace;
}

.warning-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;
}

.warning-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
}

.warning-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(64, 224, 255, 0.2);
  border-radius: 6px;
  transition: all 0.3s ease;
}

.warning-item:hover {
  border-color: rgba(64, 224, 255, 0.4);
  box-shadow: 0 0 10px rgba(64, 224, 255, 0.1);
  transform: translateY(-1px);
}

.warning-item.high {
  border-left: 3px solid #ff6b6b;
}

.warning-item.medium {
  border-left: 3px solid #feca57;
}

.warning-item.low {
  border-left: 3px solid #48dbfb;
}

.warning-item.normal {
  border-left: 3px solid #00ff88;
}

.warning-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
}

.icon-high {
  background: rgba(255, 107, 107, 0.2);
  border: 2px solid #ff6b6b;
}

.icon-medium {
  background: rgba(254, 202, 87, 0.2);
  border: 2px solid #feca57;
}

.icon-low {
  background: rgba(72, 219, 251, 0.2);
  border: 2px solid #48dbfb;
}

.icon-normal {
  background: rgba(0, 255, 136, 0.2);
  border: 2px solid #00ff88;
}

.icon-pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: iconPulse 1.5s ease-in-out infinite;
}

.icon-high .icon-pulse {
  background: #ff6b6b;
}

.icon-medium .icon-pulse {
  background: #feca57;
}

.icon-low .icon-pulse {
  background: #48dbfb;
}

.icon-normal .icon-pulse {
  background: #00ff88;
}

@keyframes iconPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.warning-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.warning-message {
  color: #ffffff;
  font-size: 11px;
  font-weight: 500;
}

.warning-meta {
  display: flex;
  gap: 8px;
  font-size: 9px;
  color: rgba(255, 255, 255, 0.6);
}

.warning-time {
  font-family: monospace;
}

.warning-action {
  color: #40e0ff;
}

.warning-level-badge {
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 8px;
  font-weight: bold;
  flex-shrink: 0;
}

.warning-level-badge.high {
  background: rgba(255, 107, 107, 0.3);
  color: #ff6b6b;
}

.warning-level-badge.medium {
  background: rgba(254, 202, 87, 0.3);
  color: #feca57;
}

.warning-level-badge.low {
  background: rgba(72, 219, 251, 0.3);
  color: #48dbfb;
}

.warning-level-badge.normal {
  background: rgba(0, 255, 136, 0.3);
  color: #00ff88;
}

.warning-stats {
  padding: 8px;
  background: rgba(64, 224, 255, 0.05);
  border: 1px solid rgba(64, 224, 255, 0.2);
  border-radius: 6px;
}

.stats-title {
  color: #ffffff;
  font-size: 11px;
  font-weight: bold;
  margin-bottom: 8px;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.stat-item.high {
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
}

.stat-item.medium {
  background: rgba(254, 202, 87, 0.1);
  border: 1px solid rgba(254, 202, 87, 0.3);
}

.stat-item.low {
  background: rgba(72, 219, 251, 0.1);
  border: 1px solid rgba(72, 219, 251, 0.3);
}

.stat-item.normal {
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid rgba(0, 255, 136, 0.3);
}

.stat-item:hover {
  transform: scale(1.02);
}

.stat-icon {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  flex-shrink: 0;
}

.stat-item.high .stat-icon {
  background: #ff6b6b;
  box-shadow: 0 0 4px rgba(255, 107, 107, 0.6);
}

.stat-item.medium .stat-icon {
  background: #feca57;
  box-shadow: 0 0 4px rgba(254, 202, 87, 0.6);
}

.stat-item.low .stat-icon {
  background: #48dbfb;
  box-shadow: 0 0 4px rgba(72, 219, 251, 0.6);
}

.stat-item.normal .stat-icon {
  background: #00ff88;
  box-shadow: 0 0 4px rgba(0, 255, 136, 0.6);
}

.stat-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
}

.stat-number {
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0 0 6px rgba(64, 224, 255, 0.5);
}

.stat-label {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.7);
}

.warning-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
  padding-top: 8px;
}

.handle-icon,
.refresh-icon {
  width: 12px;
  height: 12px;
  margin-right: 4px;
  display: inline-block;
  background: currentColor;
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
}

.handle-icon {
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z'/%3E%3C/svg%3E");
}

.refresh-icon {
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z'/%3E%3C/svg%3E");
}

/* 滚动条样式 */
.warning-list::-webkit-scrollbar {
  width: 4px;
}

.warning-list::-webkit-scrollbar-track {
  background: rgba(64, 224, 255, 0.1);
  border-radius: 2px;
}

.warning-list::-webkit-scrollbar-thumb {
  background: rgba(64, 224, 255, 0.4);
  border-radius: 2px;
  transition: background 0.3s ease;
}

.warning-list::-webkit-scrollbar-thumb:hover {
  background: rgba(64, 224, 255, 0.6);
}

/* Element UI按钮样式覆盖 */
:deep(.el-button) {
  background: linear-gradient(135deg, rgba(64, 224, 255, 0.2), rgba(30, 144, 255, 0.2)) !important;
  border: 1px solid rgba(64, 224, 255, 0.4) !important;
  color: #ffffff !important;
  border-radius: 6px !important;
  box-shadow: 0 0 10px rgba(64, 224, 255, 0.2) !important;
  transition: all 0.3s ease !important;
  font-size: 11px !important;
  padding: 4px 12px !important;
  height: auto !important;
}

:deep(.el-button:hover) {
  background: linear-gradient(135deg, rgba(64, 224, 255, 0.4), rgba(30, 144, 255, 0.4)) !important;
  border-color: rgba(64, 224, 255, 0.8) !important;
  box-shadow: 0 0 15px rgba(64, 224, 255, 0.4) !important;
  transform: translateY(-1px);
}
</style> 
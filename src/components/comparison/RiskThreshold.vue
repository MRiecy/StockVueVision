<template>
  <div class="risk-threshold">
    <div class="threshold-content">
      <div class="metrics-grid">
        <div 
          v-for="(item, index) in data" 
          :key="index"
          class="metric-card"
          :class="item.status"
        >
          <div class="metric-header">
            <div class="metric-icon" :class="`icon-${item.status}`"></div>
            <div class="metric-name">{{ item.metric }}</div>
            <div class="status-badge" :class="item.status">
              {{ getStatusText(item.status) }}
            </div>
          </div>
          <div class="metric-value">{{ item.value }}</div>
          <div class="metric-trend">
            <div class="trend-icon" :class="getTrendClass(item.value)"></div>
            <span class="trend-text">{{ getTrendText(item.value) }}</span>
          </div>
        </div>
      </div>
      
      <div class="threshold-summary">
        <div class="summary-title">风险总览</div>
        <div class="summary-grid">
          <div class="summary-item normal">
            <div class="summary-count">{{ getNormalCount() }}</div>
            <div class="summary-label">正常</div>
          </div>
          <div class="summary-item warning">
            <div class="summary-count">{{ getWarningCount() }}</div>
            <div class="summary-label">预警</div>
          </div>
          <div class="summary-item danger">
            <div class="summary-count">{{ getDangerCount() }}</div>
            <div class="summary-label">风险</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RiskThreshold',
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    getStatusText(status) {
      const statusMap = {
        normal: '正常',
        warning: '预警',
        danger: '风险'
      };
      return statusMap[status] || '未知';
    },
    
    getTrendClass(value) {
      const numValue = parseFloat(value);
      if (numValue > 10) return 'trend-up';
      if (numValue < 5) return 'trend-down';
      return 'trend-stable';
    },
    
    getTrendText(value) {
      const numValue = parseFloat(value);
      if (numValue > 10) return '偏高';
      if (numValue < 5) return '偏低';
      return '正常';
    },
    
    getNormalCount() {
      return this.data.filter(item => item.status === 'normal').length;
    },
    
    getWarningCount() {
      return this.data.filter(item => item.status === 'warning').length;
    },
    
    getDangerCount() {
      return this.data.filter(item => item.status === 'danger').length;
    }
  }
};
</script>

<style scoped>
.risk-threshold {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.threshold-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;
}

.metrics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.metric-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(64, 224, 255, 0.2);
  border-radius: 8px;
  padding: 12px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: #40e0ff;
  transition: all 0.3s ease;
}

.metric-card.normal::before {
  background: #00ff88;
}

.metric-card.warning::before {
  background: #feca57;
}

.metric-card.danger::before {
  background: #ff6b6b;
}

.metric-card:hover {
  border-color: rgba(64, 224, 255, 0.4);
  box-shadow: 0 0 15px rgba(64, 224, 255, 0.2);
  transform: translateY(-2px);
}

.metric-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.metric-icon {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(64, 224, 255, 0.4);
}

.icon-normal {
  background: #00ff88;
  box-shadow: 0 0 8px rgba(0, 255, 136, 0.6);
}

.icon-warning {
  background: #feca57;
  box-shadow: 0 0 8px rgba(254, 202, 87, 0.6);
}

.icon-danger {
  background: #ff6b6b;
  box-shadow: 0 0 8px rgba(255, 107, 107, 0.6);
}

.metric-name {
  flex: 1;
  color: #ffffff;
  font-size: 11px;
  font-weight: 500;
}

.status-badge {
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 9px;
  font-weight: bold;
}

.status-badge.normal {
  background: rgba(0, 255, 136, 0.2);
  color: #00ff88;
}

.status-badge.warning {
  background: rgba(254, 202, 87, 0.2);
  color: #feca57;
}

.status-badge.danger {
  background: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
}

.metric-value {
  font-size: 18px;
  font-weight: bold;
  color: #40e0ff;
  text-shadow: 0 0 10px rgba(64, 224, 255, 0.5);
  margin-bottom: 6px;
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 4px;
}

.trend-icon {
  width: 8px;
  height: 8px;
  border-radius: 2px;
}

.trend-up {
  background: #ff6b6b;
  box-shadow: 0 0 6px rgba(255, 107, 107, 0.4);
}

.trend-down {
  background: #00ff88;
  box-shadow: 0 0 6px rgba(0, 255, 136, 0.4);
}

.trend-stable {
  background: #feca57;
  box-shadow: 0 0 6px rgba(254, 202, 87, 0.4);
}

.trend-text {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
}

.threshold-summary {
  margin-top: auto;
  padding: 12px;
  background: rgba(64, 224, 255, 0.05);
  border: 1px solid rgba(64, 224, 255, 0.2);
  border-radius: 8px;
}

.summary-title {
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
}

.summary-grid {
  display: flex;
  justify-content: space-around;
  gap: 10px;
}

.summary-item {
  text-align: center;
  padding: 8px;
  border-radius: 6px;
  flex: 1;
  transition: all 0.3s ease;
}

.summary-item.normal {
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid rgba(0, 255, 136, 0.3);
}

.summary-item.warning {
  background: rgba(254, 202, 87, 0.1);
  border: 1px solid rgba(254, 202, 87, 0.3);
}

.summary-item.danger {
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
}

.summary-item:hover {
  transform: scale(1.05);
}

.summary-count {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 2px;
}

.summary-item.normal .summary-count {
  color: #00ff88;
  text-shadow: 0 0 8px rgba(0, 255, 136, 0.5);
}

.summary-item.warning .summary-count {
  color: #feca57;
  text-shadow: 0 0 8px rgba(254, 202, 87, 0.5);
}

.summary-item.danger .summary-count {
  color: #ff6b6b;
  text-shadow: 0 0 8px rgba(255, 107, 107, 0.5);
}

.summary-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.8);
}

/* 滚动条样式 */
.threshold-content::-webkit-scrollbar {
  width: 4px;
}

.threshold-content::-webkit-scrollbar-track {
  background: rgba(64, 224, 255, 0.1);
  border-radius: 2px;
}

.threshold-content::-webkit-scrollbar-thumb {
  background: rgba(64, 224, 255, 0.4);
  border-radius: 2px;
  transition: background 0.3s ease;
}

.threshold-content::-webkit-scrollbar-thumb:hover {
  background: rgba(64, 224, 255, 0.6);
}
</style> 
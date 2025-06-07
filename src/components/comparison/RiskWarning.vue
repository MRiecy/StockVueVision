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
      <!-- 行业偏离度监控 -->
      <div class="sector-deviation-panel">
        <div class="panel-header">
          <h3 class="panel-title">行业偏离度监控</h3>
          <div class="threshold-info">
            <span>配置阈值: ≤{{ sectorThreshold }}%</span>
            <span>偏离阈值: ±{{ deviationThreshold }}%</span>
          </div>
        </div>
        
        <div class="sector-list">
          <div 
            v-for="(sector, index) in sectorData" 
            :key="index"
            class="sector-item"
            :class="getSectorWarningClass(sector)"
          >
            <div class="sector-info">
              <div class="sector-name">{{ sector.name }}</div>
              <div class="sector-details">
                <span class="allocation">配置: {{ sector.allocation }}%</span>
                <span class="deviation" :class="getDeviationClass(sector.deviation)">
                  偏离: {{ sector.deviation > 0 ? '+' : '' }}{{ sector.deviation }}%
                </span>
              </div>
            </div>
            <div class="sector-progress">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: sector.allocation + '%' }"
                  :class="getSectorProgressClass(sector)"
                ></div>
              </div>
              <div class="benchmark-line" :style="{ left: sector.benchmark + '%' }"></div>
            </div>
            <div v-if="isSectorWarning(sector)" class="warning-indicator">
              <i class="warning-icon"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- 风格偏离度监控 -->
      <div class="style-deviation-panel">
        <div class="panel-header">
          <h3 class="panel-title">风格偏离度监控 (CNE6模型)</h3>
          <div class="risk-concentration">
            风险集中度: <span :class="getConcentrationClass()">{{ styleConcentration }}%</span>
          </div>
        </div>
        
        <div class="style-factors">
          <div 
            v-for="(factor, index) in styleFactors" 
            :key="index"
            class="factor-item"
            :class="getFactorWarningClass(factor)"
          >
            <div class="factor-header">
              <span class="factor-name">{{ factor.name }}</span>
              <span class="factor-exposure" :class="getExposureClass(factor.exposure)">
                {{ factor.exposure > 0 ? '+' : '' }}{{ factor.exposure.toFixed(2) }}
              </span>
            </div>
            <div class="factor-details">
              <div class="exposure-bar">
                <div 
                  class="exposure-fill" 
                  :style="getExposureBarStyle(factor.exposure)"
                  :class="getExposureBarClass(factor.exposure)"
                ></div>
                <div class="zero-line"></div>
              </div>
              <div class="factor-meta">
                <span class="portfolio-weight">组合暴露: {{ factor.portfolioExposure }}%</span>
                <span class="benchmark-weight">基准暴露: {{ factor.benchmarkExposure }}%</span>
              </div>
            </div>
            <div v-if="isFactorWarning(factor)" class="warning-indicator">
              <i class="warning-icon"></i>
            </div>
          </div>
        </div>
      </div>

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
      timer: null,
      // 行业监控阈值设置
      sectorThreshold: 20, // 单一行业权重阈值
      deviationThreshold: 5, // 偏离度阈值
      
      // 行业配置数据
      sectorData: [
        { name: '信息技术', allocation: 25.3, benchmark: 18.5, deviation: 6.8 },
        { name: '医疗保健', allocation: 18.7, benchmark: 15.2, deviation: 3.5 },
        { name: '金融服务', allocation: 15.2, benchmark: 22.1, deviation: -6.9 },
        { name: '消费品', allocation: 12.8, benchmark: 14.3, deviation: -1.5 },
        { name: '工业', allocation: 10.5, benchmark: 12.7, deviation: -2.2 },
        { name: '材料', allocation: 8.2, benchmark: 7.8, deviation: 0.4 },
        { name: '能源', allocation: 5.1, benchmark: 6.2, deviation: -1.1 },
        { name: '公用事业', allocation: 4.2, benchmark: 3.2, deviation: 1.0 }
      ],
      
      // 风格因子数据 (CNE6模型)
      styleFactors: [
        { 
          name: '成长', 
          exposure: 0.42, 
          portfolioExposure: 35.8, 
          benchmarkExposure: 28.2,
          threshold: 0.3
        },
        { 
          name: '价值', 
          exposure: -0.28, 
          portfolioExposure: 22.1, 
          benchmarkExposure: 28.9,
          threshold: 0.3
        },
        { 
          name: '盈利质量', 
          exposure: 0.15, 
          portfolioExposure: 31.4, 
          benchmarkExposure: 28.7,
          threshold: 0.25
        },
        { 
          name: '规模', 
          exposure: -0.18, 
          portfolioExposure: 24.3, 
          benchmarkExposure: 28.2,
          threshold: 0.25
        },
        { 
          name: '动量', 
          exposure: 0.22, 
          portfolioExposure: 33.5, 
          benchmarkExposure: 29.1,
          threshold: 0.3
        },
        { 
          name: '波动率', 
          exposure: -0.12, 
          portfolioExposure: 26.8, 
          benchmarkExposure: 29.2,
          threshold: 0.2
        },
        { 
          name: 'Beta', 
          exposure: 0.08, 
          portfolioExposure: 30.1, 
          benchmarkExposure: 28.5,
          threshold: 0.2
        },
        { 
          name: '流动性', 
          exposure: 0.05, 
          portfolioExposure: 29.8, 
          benchmarkExposure: 28.9,
          threshold: 0.15
        },
        { 
          name: '杠杆', 
          exposure: -0.35, 
          portfolioExposure: 18.7, 
          benchmarkExposure: 26.4,
          threshold: 0.25
        }
      ],
      
      // 风格风险集中度
      styleConcentration: 68.5
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
    },
    
    // 行业监控相关方法
    getSectorWarningClass(sector) {
      if (this.isSectorWarning(sector)) {
        if (sector.allocation > this.sectorThreshold) return 'sector-overweight';
        if (Math.abs(sector.deviation) > this.deviationThreshold) return 'sector-deviation';
      }
      return '';
    },
    
    isSectorWarning(sector) {
      return sector.allocation > this.sectorThreshold || 
             Math.abs(sector.deviation) > this.deviationThreshold;
    },
    
    getDeviationClass(deviation) {
      if (Math.abs(deviation) > this.deviationThreshold) {
        return deviation > 0 ? 'deviation-positive-high' : 'deviation-negative-high';
      }
      return deviation > 0 ? 'deviation-positive' : 'deviation-negative';
    },
    
    getSectorProgressClass(sector) {
      if (sector.allocation > this.sectorThreshold) return 'progress-danger';
      if (Math.abs(sector.deviation) > this.deviationThreshold) return 'progress-warning';
      return 'progress-normal';
    },
    
    // 风格监控相关方法
    getFactorWarningClass(factor) {
      return this.isFactorWarning(factor) ? 'factor-warning' : '';
    },
    
    isFactorWarning(factor) {
      return Math.abs(factor.exposure) > factor.threshold;
    },
    
    getExposureClass(exposure) {
      if (Math.abs(exposure) > 0.3) {
        return exposure > 0 ? 'exposure-high-positive' : 'exposure-high-negative';
      }
      return exposure > 0 ? 'exposure-positive' : 'exposure-negative';
    },
    
    getExposureBarStyle(exposure) {
      const maxWidth = 50; // 最大宽度50%
      const width = Math.min(Math.abs(exposure) * 100, maxWidth);
      const left = exposure > 0 ? 50 : (50 - width);
      return {
        width: width + '%',
        left: left + '%'
      };
    },
    
    getExposureBarClass(exposure) {
      if (Math.abs(exposure) > 0.3) {
        return exposure > 0 ? 'exposure-bar-high-positive' : 'exposure-bar-high-negative';
      }
      return exposure > 0 ? 'exposure-bar-positive' : 'exposure-bar-negative';
    },
    
    getConcentrationClass() {
      if (this.styleConcentration > 80) return 'concentration-high';
      if (this.styleConcentration > 60) return 'concentration-medium';
      return 'concentration-normal';
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
  overflow-y: auto;
  padding-right: 4px;
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
.risk-warning::-webkit-scrollbar,
.warning-list::-webkit-scrollbar {
  width: 4px;
}

.risk-warning::-webkit-scrollbar-track,
.warning-list::-webkit-scrollbar-track {
  background: rgba(64, 224, 255, 0.1);
  border-radius: 2px;
}

.risk-warning::-webkit-scrollbar-thumb,
.warning-list::-webkit-scrollbar-thumb {
  background: rgba(64, 224, 255, 0.4);
  border-radius: 2px;
  transition: background 0.3s ease;
}

.risk-warning::-webkit-scrollbar-thumb:hover,
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

/* 行业偏离度监控样式 */
.sector-deviation-panel,
.style-deviation-panel {
  margin-bottom: 12px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(64, 224, 255, 0.2);
  border-radius: 8px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(64, 224, 255, 0.1);
}

.panel-title {
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  margin: 0;
}

.threshold-info {
  display: flex;
  gap: 12px;
  font-size: 9px;
  color: rgba(255, 255, 255, 0.6);
}

.risk-concentration {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
}

.concentration-normal { color: #00ff88; }
.concentration-medium { color: #feca57; }
.concentration-high { color: #ff6b6b; }

.sector-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sector-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(64, 224, 255, 0.1);
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
}

.sector-item:hover {
  border-color: rgba(64, 224, 255, 0.3);
  transform: translateY(-1px);
}

.sector-item.sector-overweight {
  border-left: 3px solid #ff6b6b;
  background: rgba(255, 107, 107, 0.05);
}

.sector-item.sector-deviation {
  border-left: 3px solid #feca57;
  background: rgba(254, 202, 87, 0.05);
}

.sector-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sector-name {
  color: #ffffff;
  font-size: 11px;
  font-weight: 500;
}

.sector-details {
  display: flex;
  gap: 12px;
  font-size: 9px;
}

.allocation {
  color: #40e0ff;
}

.deviation {
  font-weight: 500;
}

.deviation-positive { color: #ff6b6b; }
.deviation-negative { color: #48dbfb; }
.deviation-positive-high { 
  color: #ff6b6b; 
  font-weight: bold;
  text-shadow: 0 0 4px rgba(255, 107, 107, 0.5);
}
.deviation-negative-high { 
  color: #48dbfb; 
  font-weight: bold;
  text-shadow: 0 0 4px rgba(72, 219, 251, 0.5);
}

.sector-progress {
  flex: 2;
  position: relative;
  height: 20px;
  display: flex;
  align-items: center;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  position: relative;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: progressShimmer 2s infinite;
}

@keyframes progressShimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

.progress-normal {
  background: linear-gradient(90deg, #00ff88, #40e0ff);
}

.progress-warning {
  background: linear-gradient(90deg, #feca57, #ff9ff3);
}

.progress-danger {
  background: linear-gradient(90deg, #ff6b6b, #feca57);
}

.benchmark-line {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 12px;
  background: #ffffff;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
}

.warning-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(255, 107, 107, 0.2);
  animation: warningPulse 1.5s ease-in-out infinite;
}

.warning-indicator .warning-icon {
  width: 10px;
  height: 10px;
  background: #ff6b6b;
  border-radius: 50%;
}

@keyframes warningPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.2); }
}

/* 风格偏离度监控样式 */
.style-factors {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.factor-item {
  padding: 8px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(64, 224, 255, 0.1);
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
}

.factor-item:hover {
  border-color: rgba(64, 224, 255, 0.3);
  transform: translateY(-1px);
}

.factor-item.factor-warning {
  border-left: 3px solid #ff6b6b;
  background: rgba(255, 107, 107, 0.05);
}

.factor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.factor-name {
  color: #ffffff;
  font-size: 11px;
  font-weight: 500;
}

.factor-exposure {
  font-size: 11px;
  font-weight: bold;
  font-family: monospace;
}

.exposure-positive { color: #ff6b6b; }
.exposure-negative { color: #48dbfb; }
.exposure-high-positive { 
  color: #ff6b6b; 
  text-shadow: 0 0 4px rgba(255, 107, 107, 0.5);
  animation: exposurePulse 2s ease-in-out infinite;
}
.exposure-high-negative { 
  color: #48dbfb; 
  text-shadow: 0 0 4px rgba(72, 219, 251, 0.5);
  animation: exposurePulse 2s ease-in-out infinite;
}

@keyframes exposurePulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.factor-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.exposure-bar {
  position: relative;
  height: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  overflow: hidden;
}

.exposure-fill {
  position: absolute;
  top: 0;
  height: 100%;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.exposure-bar-positive {
  background: linear-gradient(90deg, #ff6b6b, #ff9ff3);
}

.exposure-bar-negative {
  background: linear-gradient(90deg, #48dbfb, #40e0ff);
}

.exposure-bar-high-positive {
  background: linear-gradient(90deg, #ff6b6b, #feca57);
  box-shadow: 0 0 8px rgba(255, 107, 107, 0.6);
}

.exposure-bar-high-negative {
  background: linear-gradient(90deg, #48dbfb, #00ff88);
  box-shadow: 0 0 8px rgba(72, 219, 251, 0.6);
}

.zero-line {
  position: absolute;
  left: 50%;
  top: 0;
  width: 1px;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  transform: translateX(-50%);
}

.factor-meta {
  display: flex;
  justify-content: space-between;
  font-size: 9px;
  color: rgba(255, 255, 255, 0.6);
}

.portfolio-weight {
  color: #40e0ff;
}

.benchmark-weight {
  color: rgba(255, 255, 255, 0.5);
}
</style> 
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
      <div class="market-cap-overview">
        <div class="overview-title">市值分布详情</div>
        <div class="market-cap-list">
          <div
            v-for="(stock, index) in marketCapData"
            :key="index"
            class="stock-item"
            :class="getStockCategory(stock)"
          >
            <div class="stock-icon" :class="`icon-${getStockCategory(stock)}`">
              <div class="icon-dot"></div>
            </div>

            <div class="stock-details">
              <div class="stock-name">{{ stock.name }}</div>
              <div class="stock-market-cap">
                市值: {{ stock.marketCap }}亿
              </div>
            </div>

            <div class="stock-category-badge" :class="getStockCategory(stock)">
              {{ getCategoryText(stock) }}
            </div>
          </div>
        </div>
      </div>

      <div class="market-cap-stats">
        <div class="stats-title">业绩归因板块</div>
        <div class="stats-grid">
          <div class="stat-item small">
            <div class="stat-icon"></div>
            <div class="stat-content">
              <div class="stat-number">{{ getSmallCapCount() }}</div>
              <div class="stat-label">小市值</div>
            </div>
          </div>

          <div class="stat-item medium">
            <div class="stat-icon"></div>
            <div class="stat-content">
              <div class="stat-number">{{ getMediumCapCount() }}</div>
              <div class="stat-label">中市值</div>
            </div>
          </div>

          <div class="stat-item large">
            <div class="stat-icon"></div>
            <div class="stat-content">
              <div class="stat-number">{{ getLargeCapCount() }}</div>
              <div class="stat-label">大市值</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="warning-actions">
      <el-button size="small" type="primary" @click="handleMarketCapAnalysis">
        <i class="handle-icon"></i>
        市值分析
      </el-button>
      <el-button size="small" @click="refreshMarketCapData">
        <i class="refresh-icon"></i>
        刷新数据
      </el-button>
    </div>
  </div>
</template>

<script>
import { fetchMarketCapData } from '@/api/performanceAttributionApi.js';

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
      marketCapData: [],
      marketCapSummary: { small: 0, medium: 0, large: 0, total: 0 },
      loading: false
    };
  },
  async mounted() {
    this.updateTime();
    this.timer = setInterval(this.updateTime, 1000);
    
    // 加载市值分布数据
    await this.loadMarketCapData();
  },
  beforeUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  methods: {
    async loadMarketCapData() {
      this.loading = true;
      try {
        console.log('📡 开始加载市值分布数据...');
        const data = await fetchMarketCapData();
        console.log('✅ 市值分布数据:', data);
        
        // 兼容新旧数据格式
        if (data.stocks && data.summary) {
          // 新格式：包含 stocks 和 summary
          this.marketCapData = data.stocks;
          this.marketCapSummary = data.summary;
        } else if (Array.isArray(data)) {
          // 旧格式：直接是数组
          this.marketCapData = data;
          this.marketCapSummary = this.calculateSummary(data);
        } else {
          this.marketCapData = [];
          this.marketCapSummary = { small: 0, medium: 0, large: 0, total: 0 };
        }
        console.log('📊 市值数据赋值后:', this.marketCapData);
        console.log('📊 市值统计:', this.marketCapSummary);
      } catch (error) {
        console.error('❌ 加载市值分布数据失败:', error);
        // 不显示数据
        this.marketCapData = [];
      } finally {
        this.loading = false;
      }
    },
    
    updateTime() {
      const now = new Date();
      this.currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    },

    getOverallStatus() {
      const total = this.marketCapData.length;
      if (total > 0) return 'status-active';
      return 'status-inactive';
    },

    getStatusTitle() {
      return '市值分布概览';
    },

    getStatusSubtitle() {
      const { total, small, medium, large } = this.marketCapSummary;
      return `共${total}只股票：小市值${small}只，中市值${medium}只，大市值${large}只`;
    },

    // 使用 API 层返回的 category，如果没有则兼容旧数据格式
    getStockCategory(stock) {
      // 优先使用 API 层返回的 category
      if (stock.category) {
        return stock.category;
      }
      // 兼容旧格式：根据 marketCap 计算
      if (stock.marketCap < 50) return 'small';
      if (stock.marketCap >= 50 && stock.marketCap < 500) return 'medium';
      return 'large';
    },

    getCategoryText(stock) {
      const category = this.getStockCategory(stock);
      const categoryMap = {
        small: '小市值',
        medium: '中市值',
        large: '大市值'
      };
      return categoryMap[category] || '未知';
    },

    // 直接使用 API 层返回的统计结果
    getSmallCapCount() {
      return this.marketCapSummary.small || 0;
    },

    getMediumCapCount() {
      return this.marketCapSummary.medium || 0;
    },

    getLargeCapCount() {
      return this.marketCapSummary.large || 0;
    },

    // 兼容旧数据格式的统计方法（仅在数据没有 summary 时使用）
    calculateSummary(data) {
      return {
        small: data.filter(stock => {
          const category = stock.category || (stock.marketCap < 50 ? 'small' : (stock.marketCap < 500 ? 'medium' : 'large'));
          return category === 'small';
        }).length,
        medium: data.filter(stock => {
          const category = stock.category || (stock.marketCap < 50 ? 'small' : (stock.marketCap < 500 ? 'medium' : 'large'));
          return category === 'medium';
        }).length,
        large: data.filter(stock => {
          const category = stock.category || (stock.marketCap < 50 ? 'small' : (stock.marketCap < 500 ? 'medium' : 'large'));
          return category === 'large';
        }).length,
        total: data.length
      };
    },

    handleMarketCapAnalysis() {
      console.log('进行市值分析');
      // 这里可以实现市值分析的逻辑
    },

    async refreshMarketCapData() {
      console.log('🔄 刷新市值数据...');
      await this.loadMarketCapData();
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

.status-circle.status-active {
  background: #40e0ff;
  box-shadow: 0 0 12px rgba(64, 224, 255, 0.6);
}

.status-circle.status-inactive {
  background: #666666;
  box-shadow: 0 0 12px rgba(102, 102, 102, 0.6);
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

.market-cap-overview {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.overview-title {
  color: #ffffff;
  font-size: 11px;
  font-weight: bold;
  text-align: center;
  padding: 4px;
  background: rgba(64, 224, 255, 0.1);
  border-radius: 4px;
}

.market-cap-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
}

.stock-item {
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

.stock-item:hover {
  border-color: rgba(64, 224, 255, 0.4);
  box-shadow: 0 0 10px rgba(64, 224, 255, 0.1);
  transform: translateY(-1px);
}

.stock-item.small {
  border-left: 3px solid #ff6b6b;
}

.stock-item.medium {
  border-left: 3px solid #feca57;
}

.stock-item.large {
  border-left: 3px solid #48dbfb;
}

.stock-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
}

.icon-small {
  background: rgba(255, 107, 107, 0.2);
  border: 2px solid #ff6b6b;
}

.icon-medium {
  background: rgba(254, 202, 87, 0.2);
  border: 2px solid #feca57;
}

.icon-large {
  background: rgba(72, 219, 251, 0.2);
  border: 2px solid #48dbfb;
}

.icon-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.icon-small .icon-dot {
  background: #ff6b6b;
}

.icon-medium .icon-dot {
  background: #feca57;
}

.icon-large .icon-dot {
  background: #48dbfb;
}



.stock-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stock-name {
  color: #ffffff;
  font-size: 11px;
  font-weight: 500;
}

.stock-market-cap {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.6);
}

.stock-category-badge {
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 8px;
  font-weight: bold;
  flex-shrink: 0;
}

.stock-category-badge.small {
  background: rgba(255, 107, 107, 0.3);
  color: #ff6b6b;
}

.stock-category-badge.medium {
  background: rgba(254, 202, 87, 0.3);
  color: #feca57;
}

.stock-category-badge.large {
  background: rgba(72, 219, 251, 0.3);
  color: #48dbfb;
}

.market-cap-stats {
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

.stat-item.small {
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.3);
}

.stat-item.medium {
  background: rgba(254, 202, 87, 0.1);
  border: 1px solid rgba(254, 202, 87, 0.3);
}

.stat-item.large {
  background: rgba(72, 219, 251, 0.1);
  border: 1px solid rgba(72, 219, 251, 0.3);
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

.stat-item.small .stat-icon {
  background: #ff6b6b;
  box-shadow: 0 0 4px rgba(255, 107, 107, 0.6);
}

.stat-item.medium .stat-icon {
  background: #feca57;
  box-shadow: 0 0 4px rgba(254, 202, 87, 0.6);
}

.stat-item.large .stat-icon {
  background: #48dbfb;
  box-shadow: 0 0 4px rgba(72, 219, 251, 0.6);
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
.market-cap-list::-webkit-scrollbar {
  width: 4px;
}

.market-cap-list::-webkit-scrollbar-track {
  background: rgba(64, 224, 255, 0.1);
  border-radius: 2px;
}

.market-cap-list::-webkit-scrollbar-thumb {
  background: rgba(64, 224, 255, 0.4);
  border-radius: 2px;
  transition: background 0.3s ease;
}

.market-cap-list::-webkit-scrollbar-thumb:hover {
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

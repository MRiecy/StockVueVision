<template>
  <div class="comparison-table">
    <div class="table-header">
      <div class="table-title">{{ getTableTitle() }}</div>
      <div class="table-actions">
        <el-button size="small" type="primary" @click="exportData">
          <i class="export-icon"></i>
          导出
        </el-button>
        <el-button size="small" @click="refreshData">
          <i class="refresh-icon"></i>
          刷新
        </el-button>
      </div>
    </div>

         <div class="table-content">
       <el-table
         :data="tableData"
         style="width: 100%"
         height="100%"
         :header-cell-style="headerCellStyle"
         :cell-style="cellStyle"
         stripe
         fit
       >
                 <el-table-column
           v-for="column in tableColumns"
           :key="column.prop"
           :prop="column.prop"
           :label="column.label"
           :min-width="column.minWidth"
           :formatter="column.formatter"
         >
          <template #default="{ row, column: col }" v-if="column.prop === 'trend'">
            <div class="trend-cell">
              <div class="trend-indicator" :class="getTrendClass(row[col.property])"></div>
              <span>{{ row[col.property] }}</span>
            </div>
          </template>
          <template #default="{ row, column: col }" v-else-if="column.prop === 'risk'">
            <div class="risk-cell">
              <el-tag :type="getRiskTagType(row[col.property])" size="small">
                {{ row[col.property] }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { fetchAssetComparison, fetchYearlyComparisonData, fetchAreaComparison } from '@/api/comparisonModuleApi.js';

export default {
  name: 'ComparisonTable',
  props: {
    tableType: {
      type: String,
      default: 'asset'
    }
  },
  data() {
    return {
      assetTableData: [],
      timeTableData: [],
      regionTableData: [],
      loading: false
    };
  },
  computed: {
    tableData() {
      switch (this.tableType) {
        case 'asset':
          return this.assetTableData;
        case 'time':
          return this.timeTableData;
        case 'region':
          return this.regionTableData;
        default:
          return [];
      }
    },

    tableColumns() {
      switch (this.tableType) {
        case 'asset':
          return [
            { prop: 'stock_code', label: '股票代码', minWidth: '120' },
            { prop: 'stock_name', label: '股票名称', minWidth: '120' },
            { prop: 'market_value', label: '市值(元)', minWidth: '120', formatter: this.formatNumber },
            { prop: 'asset_ratio', label: '占比(%)', minWidth: '100', formatter: this.formatPercent },
            { prop: 'daily_return', label: '日收益率(%)', minWidth: '120', formatter: this.formatPercent }
          ];
        case 'time':
          return [
            { prop: 'year', label: '年份', minWidth: '100' },
            { prop: 'totalAssets', label: '总资产(元)', minWidth: '150', formatter: this.formatNumber },
            { prop: 'returnRate', label: '回报率(%)', minWidth: '100', formatter: this.formatPercent },
            { prop: 'investmentRate', label: '投资占比(%)', minWidth: '120', formatter: this.formatPercent }
          ];
        case 'region':
          return [
            { prop: 'region', label: '地区', minWidth: '120' },
            { prop: 'totalAssets', label: '总资产(元)', minWidth: '150', formatter: this.formatNumber },
            { prop: 'returnRate', label: '回报率', minWidth: '100' },
            { prop: 'investmentRate', label: '投资占比', minWidth: '120' }
          ];
        default:
          return [];
      }
    }
  },
  watch: {
    tableType: {
      handler(newType) {
        console.log(`📊 表格类型切换: ${newType}`);
        this.loadTableData(newType);
      },
      immediate: true
    }
  },
  methods: {
    async loadTableData(type) {
      this.loading = true;
      try {
        switch (type) {
          case 'asset':
            await this.loadAssetData();
            break;
          case 'time':
            await this.loadTimeData();
            break;
          case 'region':
            await this.loadRegionData();
            break;
        }
      } catch (error) {
        console.error(`❌ 加载${type}表格数据失败:`, error);
      } finally {
        this.loading = false;
      }
    },
    
    async loadAssetData() {
      try {
        const data = await fetchAssetComparison();
        console.log('✅ 资产对比表格数据:', data);
        
        // 兼容两种数据格式：asset_data 或 positions
        const assetData = data.asset_data || data.positions || [];
        
        this.assetTableData = assetData.map(item => ({
          stock_code: item.stock_code,
          stock_name: item.stock_name || item.stock_code,
          market_value: item.market_value,
          asset_ratio: item.asset_ratio || item.percentage,
          daily_return: item.daily_return || item.profit_loss_rate || 0
        }));
        
        console.log('📋 资产表格数据赋值后:', this.assetTableData);
      } catch (error) {
        console.error('❌ 获取资产对比表格数据失败:', error);
        this.assetTableData = [];
      }
    },
    
    async loadTimeData() {
      try {
        const data = await fetchYearlyComparisonData();
        console.log('✅ 年度对比表格数据:', data);
        
        this.timeTableData = data.yearly_data || [];
        console.log('📋 年度表格数据赋值后:', this.timeTableData);
      } catch (error) {
        console.error('❌ 获取年度对比表格数据失败:', error);
        this.timeTableData = [];
      }
    },
    
    async loadRegionData() {
      try {
        const data = await fetchAreaComparison();
        console.log('✅ 地区对比表格数据:', data);
        
        this.regionTableData = data.region_data || [];
        console.log('📋 地区表格数据赋值后:', this.regionTableData);
      } catch (error) {
        console.error('❌ 获取地区对比表格数据失败:', error);
        this.regionTableData = [];
      }
    },
    
    getTableTitle() {
      const titleMap = {
        asset: '资产对比数据',
        time: '时间段对比数据',
        region: '分市场对比数据'
      };
      return titleMap[this.tableType] || '对比数据';
    },

    formatNumber(row, column, cellValue) {
      if (cellValue === null || cellValue === undefined) return '-';
      return Number(cellValue).toLocaleString();
    },

    formatPercent(row, column, cellValue) {
      if (cellValue === null || cellValue === undefined) return '-';
      return `${cellValue}%`;
    },

    getTrendClass(trend) {
      const trendMap = {
        '牛式': 'trend-up',
        '熊式': 'trend-down',
        '震荡': 'trend-stable'
      };
      return trendMap[trend] || 'trend-stable';
    },

    getRiskTagType(risk) {
      const riskMap = {
        '低': 'success',
        '中': 'warning',
        '高': 'danger'
      };
      return riskMap[risk] || 'info';
    },

    headerCellStyle() {
      return {
        backgroundColor: 'rgba(64, 224, 255, 0.2)',
        color: '#000000',
        fontWeight: 'bold',
        fontSize: '11px',
        padding: '8px'
      };
    },

    cellStyle() {
      return {
        backgroundColor: 'transparent',
        color: '#000000',
        fontSize: '10px',
        padding: '6px'
      };
    },

    exportData() {
      console.log('导出数据:', this.tableData);
      // 这里可以实现实际的导出功能
    },

    async refreshData() {
      console.log('🔄 刷新表格数据...');
      await this.loadTableData(this.tableType);
    }
  }
};
</script>

<style scoped>
.comparison-table {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(64, 224, 255, 0.2);
}

.table-title {
  color: #ffffff;
  font-size: 13px;
  font-weight: bold;
  text-shadow: 0 0 8px rgba(64, 224, 255, 0.5);
}

.table-actions {
  display: flex;
  gap: 8px;
}

.table-content {
  flex: 1;
  overflow: hidden;
}

.trend-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}

.trend-indicator {
  width: 8px;
  height: 8px;
  border-radius: 2px;
}

.trend-up {
  background: #00ff88;
  box-shadow: 0 0 6px rgba(0, 255, 136, 0.6);
}

.trend-down {
  background: #ff6b6b;
  box-shadow: 0 0 6px rgba(255, 107, 107, 0.6);
}

.trend-stable {
  background: #feca57;
  box-shadow: 0 0 6px rgba(254, 202, 87, 0.6);
}

.risk-cell {
  display: flex;
  justify-content: center;
}

.export-icon,
.refresh-icon {
  width: 12px;
  height: 12px;
  margin-right: 4px;
  display: inline-block;
}

.export-icon {
  background: currentColor;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z'/%3E%3C/svg%3E");
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
}

.refresh-icon {
  background: currentColor;
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z'/%3E%3C/svg%3E");
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
}

/* Element UI表格样式覆盖 */
:deep(.el-table) {
  background: transparent !important;
  color: #000000 !important;
  border: 1px solid rgba(64, 224, 255, 0.2) !important;
  border-radius: 8px !important;
  overflow: hidden;
  width: 100% !important;
}

:deep(.el-table__body-wrapper) {
  width: 100% !important;
}

:deep(.el-table__header-wrapper) {
  width: 100% !important;
}

:deep(.el-table th.el-table__cell) {
  background: rgba(64, 224, 255, 0.2) !important;
  color: #000000 !important;
  border-bottom: 1px solid rgba(64, 224, 255, 0.3) !important;
  font-weight: bold !important;
}

:deep(.el-table td.el-table__cell) {
  background: transparent !important;
  color: #000000 !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

:deep(.el-table tr:hover td) {
  background: rgba(64, 224, 255, 0.1) !important;
}

:deep(.el-table__row.el-table__row--striped td) {
  background: rgba(255, 255, 255, 0.02) !important;
}

:deep(.el-table__row.el-table__row--striped:hover td) {
  background: rgba(64, 224, 255, 0.1) !important;
}

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

:deep(.el-tag) {
  border: none !important;
  font-size: 10px !important;
  padding: 2px 6px !important;
  border-radius: 4px !important;
}

:deep(.el-tag.el-tag--success) {
  background: rgba(0, 255, 136, 0.2) !important;
  color: #00ff88 !important;
}

:deep(.el-tag.el-tag--warning) {
  background: rgba(254, 202, 87, 0.2) !important;
  color: #feca57 !important;
}

:deep(.el-tag.el-tag--danger) {
  background: rgba(255, 107, 107, 0.2) !important;
  color: #ff6b6b !important;
}
</style>

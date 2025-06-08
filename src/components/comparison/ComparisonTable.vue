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
      >
        <el-table-column 
          v-for="column in tableColumns" 
          :key="column.prop"
          :prop="column.prop" 
          :label="column.label"
          :width="column.width"
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
export default {
  name: 'ComparisonTable',
  props: {
    tableType: {
      type: String,
      default: 'asset'
    }
  },
  computed: {
    tableData() {
      switch (this.tableType) {
        case 'asset':
          return this.getAssetData();
        case 'time':
          return this.getTimeData();
        case 'region':
          return this.getRegionData();
        default:
          return this.getAssetData();
      }
    },
    
    tableColumns() {
      switch (this.tableType) {
        case 'asset':
          return [
            { prop: 'name', label: '资产名称', width: '120' },
            { prop: 'return', label: '收益率', width: '80', formatter: this.formatPercent },
            { prop: 'volatility', label: '波动率', width: '80', formatter: this.formatPercent },
            { prop: 'sharpe', label: '夏普比率', width: '90' },
            { prop: 'trend', label: '趋势', width: '80' },
            { prop: 'risk', label: '风险等级', width: '90' }
          ];
        case 'time':
          return [
            { prop: 'period', label: '时间段', width: '100' },
            { prop: 'return', label: '收益率', width: '80', formatter: this.formatPercent },
            { prop: 'maxDrawdown', label: '最大回撤', width: '90', formatter: this.formatPercent },
            { prop: 'winRate', label: '胜率', width: '70', formatter: this.formatPercent },
            { prop: 'trades', label: '交易次数', width: '80' },
            { prop: 'risk', label: '风险等级', width: '90' }
          ];
        case 'region':
          return [
            { prop: 'region', label: '交易所', width: '100' },
            { prop: 'allocation', label: '配置比例', width: '90', formatter: this.formatPercent },
            { prop: 'return', label: '收益率', width: '80', formatter: this.formatPercent },
            { prop: 'correlation', label: '相关性', width: '80' },
            { prop: 'trend', label: '趋势', width: '80' },
            { prop: 'risk', label: '风险等级', width: '90' }
          ];
        default:
          return [];
      }
    }
  },
  
  methods: {
    getTableTitle() {
      const titleMap = {
        asset: '资产对比数据',
        time: '时间段对比数据',
        region: '交易所对比数据'
      };
      return titleMap[this.tableType] || '对比数据';
    },
    
    getAssetData() {
      return [
        {
          name: '股票A',
          return: 12.5,
          volatility: 15.2,
          sharpe: 1.85,
          trend: '上升',
          risk: '低'
        },
        {
          name: '股票B',
          return: 8.3,
          volatility: 18.7,
          sharpe: 1.42,
          trend: '稳定',
          risk: '中'
        },
        {
          name: '基金C',
          return: 15.8,
          volatility: 12.4,
          sharpe: 2.12,
          trend: '上升',
          risk: '低'
        },
        {
          name: '债券D',
          return: 4.2,
          volatility: 3.8,
          sharpe: 1.08,
          trend: '稳定',
          risk: '低'
        },
        {
          name: '期货E',
          return: -2.1,
          volatility: 25.6,
          sharpe: -0.15,
          trend: '下降',
          risk: '高'
        }
      ];
    },
    
    getTimeData() {
      return [
        {
          period: '近1月',
          return: 3.2,
          maxDrawdown: -1.8,
          winRate: 68.5,
          trades: 15,
          risk: '低'
        },
        {
          period: '近3月',
          return: 8.7,
          maxDrawdown: -3.5,
          winRate: 72.3,
          trades: 42,
          risk: '中'
        },
        {
          period: '近6月',
          return: 16.4,
          maxDrawdown: -5.2,
          winRate: 65.8,
          trades: 89,
          risk: '中'
        },
        {
          period: '近1年',
          return: 28.9,
          maxDrawdown: -8.7,
          winRate: 69.2,
          trades: 178,
          risk: '中'
        },
        {
          period: '近2年',
          return: 45.6,
          maxDrawdown: -12.3,
          winRate: 71.5,
          trades: 356,
          risk: '高'
        }
      ];
    },
    
    getRegionData() {
      return [
        {
          region: 'A股',
          allocation: 45.0,
          return: 12.8,
          correlation: 0.85,
          trend: '上升',
          risk: '中'
        },
        {
          region: '港股',
          allocation: 25.0,
          return: 8.5,
          correlation: 0.72,
          trend: '稳定',
          risk: '中'
        },
        {
          region: '美股',
          allocation: 20.0,
          return: 15.2,
          correlation: 0.45,
          trend: '上升',
          risk: '中'
        },
        {
          region: '欧股',
          allocation: 10.0,
          return: 6.3,
          correlation: 0.68,
          trend: '稳定',
          risk: '低'
        }
      ];
    },
    
    formatPercent(row, column, cellValue) {
      return `${cellValue}%`;
    },
    
    getTrendClass(trend) {
      const trendMap = {
        '上升': 'trend-up',
        '下降': 'trend-down',
        '稳定': 'trend-stable'
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
    
    refreshData() {
      console.log('刷新数据');
      // 这里可以实现数据刷新功能
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
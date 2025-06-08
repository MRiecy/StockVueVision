<template>
  <div class="asset-comparison-analysis">
    <!-- 资产类别对比分析 -->
    <div class="analysis-module">
      <h5 class="module-title">资产类别对比分析</h5>
      <div class="module-content">
        <div v-if="isLoading" class="loading-state">
          <el-skeleton :rows="3" animated />
        </div>
        <div v-else-if="hasError" class="error-state">
          <el-alert
            :title="errorMessage"
            type="error"
            :closable="false"
            show-icon
          />
        </div>
        <template v-else>
          <button class="module-button" @click="toggleCategoryChart">点击查看图表</button>
          <div class="analysis-chart" v-if="isCategoryChartVisible">
            <div ref="categoryChart" style="width: 100%; height: 400px;"></div>
          </div>
          <div class="module-table">
            <h4>资产类别对比表</h4>
            <el-table :data="categoryData" border style="width: 100%">
              <el-table-column prop="stock_code" label="股票代码" />
              <el-table-column prop="asset_ratio" label="资产占比%" />
              <el-table-column prop="market_value" label="股票市值">
                <template #default="scope">
                  {{ formatCurrency(scope.row.market_value) }}
                </template>
              </el-table-column>
              <el-table-column prop="daily_return" label="收益率" />
            </el-table>
          </div>
        </template>
      </div>
    </div>

    <!-- 时间段对比分析 -->
    <div class="analysis-module">
      <h5 class="module-title">时间段对比分析</h5>
      <div class="module-content">
        <button class="module-button" @click="toggleTimeChart">点击查看图表</button>
        <div class="analysis-chart" v-if="isTimeChartVisible">
          <div ref="timeChart" style="width: 100%; height: 400px;"></div>
        </div>
        <div class="module-table">
          <h4>时间段数据表</h4>
          <el-table :data="timeData" border style="width: 100%">
            <el-table-column prop="timePeriod" label="时间段" />
            <el-table-column prop="totalAssets" label="总资产" />
            <el-table-column prop="returnRate" label="收益率" />
            <el-table-column prop="growthRate" label="增长率" />
          </el-table>
        </div>
      </div>
    </div>

    <!-- 交易所对比分析 -->
    <div class="analysis-module">
      <h5 class="module-title">交易所对比分析</h5>
      <div class="module-content">
        <button class="module-button" @click="toggleRegionChart">点击查看图表</button>
        <div class="analysis-chart" v-if="isRegionChartVisible">
          <div ref="regionChart" style="width: 100%; height: 400px;"></div>
        </div>
        <div class="module-table">
          <h4>交易所数据表</h4>
          <el-table :data="regionData" border style="width: 100%">
            <el-table-column prop="region" label="交易所" />
            <el-table-column prop="totalAssets" label="资产总值" />
            <el-table-column prop="returnRate" label="收益率" />
            <el-table-column prop="investmentRate" label="最大回撤率" />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, nextTick, onMounted } from 'vue';
import * as echarts from 'echarts';

export default {
  name: 'AssetComparisonAnalysis',
  setup() {
    const categoryChart = ref(null);
    const timeChart = ref(null);
    const regionChart = ref(null);

    // 添加数据加载状态和错误状态
    const isLoading = ref(false);
    const hasError = ref(false);
    const errorMessage = ref('');

    // 资产类别数据
    const categoryData = ref([]);



    // 在组件挂载时获取数据
    onMounted(() => {
      console.log('组件已挂载，开始获取数据...');
      // 使用模拟数据而不是实际API调用
      categoryData.value = [
        { stock_code: '600000.SH', asset_ratio: '7.6%', market_value: 216000, daily_return: '8.5%' },
        { stock_code: '000001.SZ', asset_ratio: '8.0%', market_value: 228000, daily_return: '7.8%' },
        { stock_code: '600519.SH', asset_ratio: '12.0%', market_value: 342000, daily_return: '9.2%' },
        { stock_code: '000858.SZ', asset_ratio: '10.0%', market_value: 285000, daily_return: '6.5%' },
        { stock_code: '002415.SZ', asset_ratio: '18.0%', market_value: 513000, daily_return: '7.0%' }
      ];
    });

    // 时间段数据 - 使用更真实的模拟数据
    const timeData = ref([
      { timePeriod: '2024-01', totalAssets: 3800000, returnRate: '5.2%', growthRate: '8.5%' },
      { timePeriod: '2024-02', totalAssets: 3850000, returnRate: '5.5%', growthRate: '14.1%' },
      { timePeriod: '2024-03', totalAssets: 3920000, returnRate: '6.1%', growthRate: '12.3%' },
      { timePeriod: '2024-04', totalAssets: 3780000, returnRate: '4.8%', growthRate: '10.2%' },
      { timePeriod: '2024-05', totalAssets: 3950000, returnRate: '6.5%', growthRate: '15.8%' },
      { timePeriod: '2024-06', totalAssets: 4020000, returnRate: '7.2%', growthRate: '18.2%' }
    ]);

    // 交易所数据 - 使用更真实的模拟数据
    const regionData = ref([
      { region: '上海证券交易所', totalAssets: 820000, returnRate: '8.5%', investmentRate: '28.8%' },
      { region: '深圳证券交易所', totalAssets: 712500, returnRate: '7.8%', investmentRate: '25.0%' },
      { region: '北京证券交易所', totalAssets: 570000, returnRate: '9.2%', investmentRate: '20.0%' },
      { region: '上海科创板', totalAssets: 342000, returnRate: '6.5%', investmentRate: '12.0%' },
      { region: '深圳创业板', totalAssets: 228000, returnRate: '7.0%', investmentRate: '8.0%' },
      { region: '香港交易所', totalAssets: 114000, returnRate: '5.8%', investmentRate: '4.0%' }
    ]);

    const isCategoryChartVisible = ref(false);
    const isTimeChartVisible = ref(false);
    const isRegionChartVisible = ref(false);

    // 初始化资产类别图表
    const initCategoryChart = () => {
      if (!categoryChart.value) {
        console.error('图表容器不存在');
        return;
      }

      console.log('开始初始化图表，数据:', categoryData.value);

      const chart = echarts.init(categoryChart.value);
      const option = {
        title: {
          text: '资产类别对比分析',
          left: 'center',
          textStyle: {
            color: '#ffffff'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
          backgroundColor: 'rgba(26, 31, 58, 0.95)',
          borderColor: 'rgba(64, 224, 255, 0.3)',
          textStyle: {
            color: '#ffffff'
          },
          formatter: function(params) {
            let tooltip = `<div style="font-size: 14px; font-weight: bold; margin-bottom: 8px;">${params[0].axisValueLabel}</div>`;
            params.forEach(param => {
              const color = param.color;
              const seriesName = param.seriesName;
              let value = param.value;
              let unit = '';
              
              // 根据不同系列添加合适的单位和格式
              if (seriesName === '资产占比') {
                unit = '%';
              } else if (seriesName === '股票市值') {
                value = new Intl.NumberFormat('zh-CN').format(value);
                unit = '元';
              } else if (seriesName === '收益率') {
                unit = '%';
              }
              
              tooltip += `<div style="margin: 4px 0;">
                <span style="display: inline-block; width: 10px; height: 10px; background-color: ${color}; border-radius: 50%; margin-right: 8px;"></span>
                <span style="font-weight: 500;">${seriesName}:</span>
                <span style="float: right; margin-left: 20px; font-weight: bold;">${value}${unit}</span>
              </div>`;
            });
            return tooltip;
          }
        },
        legend: {
          data: ['资产占比', '股票市值', '收益率'],
          bottom: 0,
          textStyle: {
            color: '#ffffff'
          }
        },
        xAxis: {
          type: 'category',
          data: categoryData.value.map(item => item.stock_code),
          axisLabel: {
            color: '#ffffff'
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(64, 224, 255, 0.3)'
            }
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '资产占比',
            position: 'left',
            axisLabel: { 
              formatter: '{value}%',
              color: '#ffffff'
            },
            nameTextStyle: {
              color: '#ffffff'
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(64, 224, 255, 0.3)'
              }
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(64, 224, 255, 0.1)'
              }
            }
          },
          {
            type: 'value',
            name: '股票市值',
            position: 'right',
            axisLabel: { 
              formatter: '{value} 元',
              color: '#ffffff'
            },
            nameTextStyle: {
              color: '#ffffff'
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(64, 224, 255, 0.3)'
              }
            }
          },
          {
            type: 'value',
            name: '收益率',
            position: 'right',
            offset: 80,
            axisLabel: { 
              formatter: '{value}%',
              color: '#ffffff'
            },
            nameTextStyle: {
              color: '#ffffff'
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(64, 224, 255, 0.3)'
              }
            }
          }
        ],
        series: [
          {
            name: '资产占比',
            type: 'bar',
            data: categoryData.value.map(item => parseFloat(item.asset_ratio)),
            itemStyle: { color: '#5470C6' },
            emphasis: {
              itemStyle: {
                color: '#5aa9e8'
              }
            }
          },
          {
            name: '股票市值',
            type: 'line',
            yAxisIndex: 1,
            data: categoryData.value.map(item => item.market_value),
            itemStyle: { color: '#EE6666' },
            lineStyle: { width: 2 },
            symbol: 'circle',
            symbolSize: 6,
            emphasis: {
              itemStyle: {
                color: '#ff8a8a',
                borderWidth: 2,
                borderColor: '#fff'
              },
              symbolSize: 10
            }
          },
          {
            name: '收益率',
            type: 'line',
            yAxisIndex: 2,
            data: categoryData.value.map(item => parseFloat(item.daily_return)),
            itemStyle: { color: '#91CC75' },
            lineStyle: { width: 2 },
            symbol: 'circle',
            symbolSize: 6,
            emphasis: {
              itemStyle: {
                color: '#b3e584',
                borderWidth: 2,
                borderColor: '#fff'
              },
              symbolSize: 10
            }
          }
        ],
      };

      console.log('图表配置:', option);
      chart.setOption(option);

      // 调整图表宽度自适应
      window.addEventListener('resize', () => {
        chart.resize();
      });
    };

    // 初始化时间段图表
    const initTimeChart = () => {
      const chart = echarts.init(timeChart.value);
      chart.setOption({
        title: {
          text: '时间段对比分析',
          left: 'center',
          textStyle: {
            color: '#ffffff'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
          backgroundColor: 'rgba(26, 31, 58, 0.95)',
          borderColor: 'rgba(64, 224, 255, 0.3)',
          textStyle: {
            color: '#ffffff'
          },
          formatter: function(params) {
            let tooltip = `<div style="font-size: 14px; font-weight: bold; margin-bottom: 8px;">${params[0].axisValueLabel}</div>`;
            params.forEach(param => {
              const color = param.color;
              const seriesName = param.seriesName;
              let value = param.value;
              let unit = '';
              
              // 根据不同系列添加合适的单位和格式
              if (seriesName === '总资产') {
                value = new Intl.NumberFormat('zh-CN').format(value);
                unit = '元';
              } else if (seriesName === '收益率' || seriesName === '增长率') {
                unit = '%';
              }
              
              tooltip += `<div style="margin: 4px 0;">
                <span style="display: inline-block; width: 10px; height: 10px; background-color: ${color}; border-radius: 50%; margin-right: 8px;"></span>
                <span style="font-weight: 500;">${seriesName}:</span>
                <span style="float: right; margin-left: 20px; font-weight: bold;">${value}${unit}</span>
              </div>`;
            });
            return tooltip;
          }
        },
        legend: {
          data: ['总资产', '收益率', '增长率'],
          bottom: 0,
          textStyle: {
            color: '#ffffff'
          }
        },
        xAxis: {
          type: 'category',
          data: timeData.value.map(item => item.timePeriod),
          axisLabel: {
            color: '#ffffff'
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(64, 224, 255, 0.3)'
            }
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '总资产',
            position: 'left',
            axisLabel: { 
              formatter: '{value} 元',
              color: '#ffffff'
            },
            nameTextStyle: {
              color: '#ffffff'
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(64, 224, 255, 0.3)'
              }
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(64, 224, 255, 0.1)'
              }
            }
          },
          {
            type: 'value',
            name: '收益率',
            position: 'right',
            axisLabel: { 
              formatter: '{value}%',
              color: '#ffffff'
            },
            nameTextStyle: {
              color: '#ffffff'
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(64, 224, 255, 0.3)'
              }
            }
          },
        ],
        series: [
          {
            name: '总资产',
            type: 'line',
            data: timeData.value.map(item => item.totalAssets),
            itemStyle: { color: '#5470C6' },
            lineStyle: { width: 2 },
            symbol: 'circle',
            symbolSize: 6,
            emphasis: {
              itemStyle: {
                color: '#5aa9e8',
                borderWidth: 2,
                borderColor: '#fff'
              },
              symbolSize: 10
            }
          },
          {
            name: '收益率',
            type: 'line',
            yAxisIndex: 1,
            data: timeData.value.map(item => parseFloat(item.returnRate)),
            itemStyle: { color: '#EE6666' },
            lineStyle: { width: 2 },
            symbol: 'circle',
            symbolSize: 6,
            emphasis: {
              itemStyle: {
                color: '#ff8a8a',
                borderWidth: 2,
                borderColor: '#fff'
              },
              symbolSize: 10
            }
          },
          {
            name: '增长率',
            type: 'line',
            yAxisIndex: 1,
            data: timeData.value.map(item => parseFloat(item.growthRate)),
            itemStyle: { color: '#FFB657' },
            lineStyle: { width: 2 },
            symbol: 'circle',
            symbolSize: 6,
            emphasis: {
              itemStyle: {
                color: '#ffc87a',
                borderWidth: 2,
                borderColor: '#fff'
              },
              symbolSize: 10
            }
          },
        ],
      });

      // 调整图表宽度自适应
      window.addEventListener('resize', () => {
        chart.resize();
      });
    };

    // 初始化交易所图表
    const initRegionChart = () => {
      const chart = echarts.init(regionChart.value);
      chart.setOption({
        title: {
                          text: '交易所对比分析',
          left: 'center',
          textStyle: {
            color: '#ffffff'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
          backgroundColor: 'rgba(26, 31, 58, 0.95)',
          borderColor: 'rgba(64, 224, 255, 0.3)',
          textStyle: {
            color: '#ffffff'
          },
          formatter: function(params) {
            let tooltip = `<div style="font-size: 14px; font-weight: bold; margin-bottom: 8px;">${params[0].axisValueLabel}</div>`;
            params.forEach(param => {
              const color = param.color;
              const seriesName = param.seriesName;
              let value = param.value;
              let unit = '';
              
              // 根据不同系列添加合适的单位和格式
              if (seriesName === '总资产') {
                value = new Intl.NumberFormat('zh-CN').format(value);
                unit = '元';
              } else if (seriesName === '收益率' || seriesName === '投资率') {
                unit = '%';
              }
              
              tooltip += `<div style="margin: 4px 0;">
                <span style="display: inline-block; width: 10px; height: 10px; background-color: ${color}; border-radius: 50%; margin-right: 8px;"></span>
                <span style="font-weight: 500;">${seriesName}:</span>
                <span style="float: right; margin-left: 20px; font-weight: bold;">${value}${unit}</span>
              </div>`;
            });
            return tooltip;
          }
        },
        legend: {
          data: ['总资产', '收益率', '投资率'],
          bottom: 0,
          textStyle: {
            color: '#ffffff'
          }
        },
        xAxis: {
          type: 'category',
          data: regionData.value.map(item => item.region),
          axisLabel: {
            color: '#ffffff'
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(64, 224, 255, 0.3)'
            }
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '总资产',
            position: 'left',
            axisLabel: { 
              formatter: '{value} 元',
              color: '#ffffff'
            },
            nameTextStyle: {
              color: '#ffffff'
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(64, 224, 255, 0.3)'
              }
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(64, 224, 255, 0.1)'
              }
            }
          },
          {
            type: 'value',
            name: '收益率',
            position: 'right',
            axisLabel: { 
              formatter: '{value}%',
              color: '#ffffff'
            },
            nameTextStyle: {
              color: '#ffffff'
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(64, 224, 255, 0.3)'
              }
            }
          },
        ],
        series: [
          {
            name: '总资产',
            type: 'bar',
            data: regionData.value.map(item => item.totalAssets),
            itemStyle: { color: '#5470C6' },
            emphasis: {
              itemStyle: {
                color: '#5aa9e8'
              }
            }
          },
          {
            name: '收益率',
            type: 'line',
            yAxisIndex: 1,
            data: regionData.value.map(item => parseFloat(item.returnRate)),
            itemStyle: { color: '#EE6666' },
            lineStyle: { width: 2 },
            symbol: 'circle',
            symbolSize: 6,
            emphasis: {
              itemStyle: {
                color: '#ff8a8a',
                borderWidth: 2,
                borderColor: '#fff'
              },
              symbolSize: 10
            }
          },
          {
            name: '投资率',
            type: 'line',
            yAxisIndex: 1,
            data: regionData.value.map(item => parseFloat(item.investmentRate)),
            itemStyle: { color: '#FFB657' },
            lineStyle: { width: 2 },
            symbol: 'circle',
            symbolSize: 6,
            emphasis: {
              itemStyle: {
                color: '#ffc87a',
                borderWidth: 2,
                borderColor: '#fff'
              },
              symbolSize: 10
            }
          },
        ],
      });

      // 调整图表宽度自适应
      window.addEventListener('resize', () => {
        chart.resize();
      });
    };

    // 切换图表显示
    const toggleCategoryChart = () => {
      isCategoryChartVisible.value = !isCategoryChartVisible.value;
      if (isCategoryChartVisible.value) {
        nextTick(() => {
          initCategoryChart();
        });
      } else {
        // 销毁图表实例
        if (categoryChart.value) {
          const chart = echarts.getInstanceByDom(categoryChart.value);
          if (chart) {
            chart.dispose();
          }
        }
      }
    };

    const toggleTimeChart = () => {
      isTimeChartVisible.value = !isTimeChartVisible.value;
      if (isTimeChartVisible.value) {
        nextTick(() => {
          initTimeChart();
        });
      } else {
        // 销毁图表实例
        if (timeChart.value) {
          const chart = echarts.getInstanceByDom(timeChart.value);
          if (chart) {
            chart.dispose();
          }
        }
      }
    };

    const toggleRegionChart = () => {
      isRegionChartVisible.value = !isRegionChartVisible.value;
      if (isRegionChartVisible.value) {
        nextTick(() => {
          initRegionChart();
        });
      } else {
        // 销毁图表实例
        if (regionChart.value) {
          const chart = echarts.getInstanceByDom(regionChart.value);
          if (chart) {
            chart.dispose();
          }
        }
      }
    };

    // 添加格式化货币的方法
    const formatCurrency = (value) => {
      if (value === undefined || value === null) return '¥0.00';
      const num = Number(value);
      if (isNaN(num)) return '¥0.00';
      
      return '¥' + num.toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    };

    return {
      categoryChart,
      timeChart,
      regionChart,
      categoryData,
      timeData,
      regionData,
      isCategoryChartVisible,
      isTimeChartVisible,
      isRegionChartVisible,
      toggleCategoryChart,
      toggleTimeChart,
      toggleRegionChart,
      isLoading,
      hasError,
      errorMessage,
      formatCurrency
    };
  },
};
</script>

<style scoped>
.asset-comparison-analysis {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(64, 224, 255, 0.2);
  border-radius: 8px;
  padding: 15px;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.2),
    0 0 20px rgba(64, 224, 255, 0.1);
  margin-bottom: 20px;
  width: 100%;
  color: #000000;
}

.loading-state {
  padding: 20px;
  background: rgba(64, 224, 255, 0.1);
  border: 1px solid rgba(64, 224, 255, 0.2);
  border-radius: 6px;
  color: #000000;
}

.error-state {
  padding: 20px;
}

.error-state :deep(.el-alert) {
  margin: 0;
  background: rgba(255, 107, 107, 0.1) !important;
  border: 1px solid rgba(255, 107, 107, 0.3) !important;
  color: #ffffff !important;
}

.error-state :deep(.el-alert .el-alert__title) {
  color: #ff6b6b !important;
}

.analysis-module {
  margin-bottom: 20px;
  width: 100%;
}

.module-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #000000;
  text-shadow: 0 0 8px rgba(64, 224, 255, 0.6);
}

.module-content {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.module-content h4 {
  color: #000000;
  text-shadow: 0 0 6px rgba(64, 224, 255, 0.5);
  margin-bottom: 10px;
}

.module-button {
  background: linear-gradient(135deg, rgba(64, 224, 255, 0.3), rgba(30, 144, 255, 0.3));
  color: #ffffff;
  border: 1px solid rgba(64, 224, 255, 0.5);
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(64, 224, 255, 0.2);
  text-shadow: 0 0 5px rgba(64, 224, 255, 0.5);
}

.module-button:hover {
  background: linear-gradient(135deg, rgba(64, 224, 255, 0.5), rgba(30, 144, 255, 0.5));
  border-color: rgba(64, 224, 255, 0.8);
  box-shadow: 0 0 25px rgba(64, 224, 255, 0.4);
  transform: translateY(-2px);
}

.module-table {
  margin-top: 10px;
  width: 100%;
}

.analysis-chart {
  margin-bottom: 20px;
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(64, 224, 255, 0.1);
  border-radius: 6px;
  padding: 10px;
}

.analysis-chart > div {
  width: 100%;
  height: 400px;
}

/* Element UI组件深色主题适配 */
:deep(.el-table) {
  background: transparent !important;
  color: #000000 !important;
  border: 1px solid rgba(64, 224, 255, 0.2) !important;
  border-radius: 6px !important;
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

:deep(.el-table__border-left-patch) {
  background: rgba(64, 224, 255, 0.2) !important;
}

:deep(.el-table__border-bottom-patch) {
  background: rgba(64, 224, 255, 0.2) !important;
}

/* Skeleton组件适配 */
:deep(.el-skeleton) {
  background: transparent !important;
}

:deep(.el-skeleton__item) {
  background: rgba(64, 224, 255, 0.1) !important;
}

:deep(.el-skeleton.is-animated .el-skeleton__item) {
  background: linear-gradient(90deg, 
    rgba(64, 224, 255, 0.1) 25%, 
    rgba(64, 224, 255, 0.3) 37%, 
    rgba(64, 224, 255, 0.1) 63%) !important;
}
</style>
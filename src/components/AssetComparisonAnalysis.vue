<template>
  <div class="asset-comparison-analysis">
    <!-- 资产类别对比分析 -->
    <div class="analysis-module">
      <h5 class="module-title">资产类别对比分析</h5>
      <div class="module-content">
        <button class="module-button" @click="toggleCategoryChart">点击查看图表</button>
        <div class="analysis-chart" v-if="isCategoryChartVisible">
          <div ref="categoryChart" style="width: 100%; height: 400px;"></div>
        </div>
        <div class="module-table">
          <h4>资产类别数据表</h4>
          <el-table :data="categoryData" border style="width: 100%">
            <el-table-column prop="category" label="资产类别" />
            <el-table-column prop="totalAssets" label="总资产" :formatter="formatCurrency" />
            <el-table-column prop="returnRate" label="收益率" />
            <el-table-column prop="marketShare" label="市场份额" />
            <el-table-column prop="marketValue" label="市场额" :formatter="formatCurrency" />
          </el-table>
        </div>
      </div>
    </div>

    <!-- 时间段对比分析 -->
    <div class="analysis-module">
      <h5 class="module-title">时间段对比分析</h5>
      <div class="module-content">
        <div class="period-selector">
          <el-radio-group v-model="timePeriod" @change="fetchTimeData">
            <el-radio-button label="weekly">按周分析</el-radio-button>
            <el-radio-button label="yearly">按年分析</el-radio-button>
          </el-radio-group>
        </div>
        <button class="module-button" @click="toggleTimeChart">点击查看图表</button>
        <div class="analysis-chart" v-if="isTimeChartVisible">
          <div ref="timeChart" style="width: 100%; height: 400px;"></div>
        </div>
        <div class="module-table">
          <h4>时间段数据表</h4>
          <el-table :data="timeData" border style="width: 100%">
            <el-table-column prop="timePeriod" label="时间段" />
            <el-table-column prop="totalAssets" label="总资产" :formatter="formatCurrency" />
            <el-table-column prop="returnRate" label="收益率" />
            <el-table-column prop="growthRate" label="增长率" />
            <el-table-column prop="marketValue" label="市场额" :formatter="formatCurrency" />
          </el-table>
        </div>
      </div>
    </div>

    <!-- 地区对比分析 -->
    <div class="analysis-module">
      <h5 class="module-title">地区对比分析</h5>
      <div class="module-content">
        <button class="module-button" @click="toggleRegionChart">点击查看图表</button>
        <div class="analysis-chart" v-if="isRegionChartVisible">
          <div ref="regionChart" style="width: 100%; height: 400px;"></div>
        </div>
        <div class="module-table">
          <h4>地区数据表</h4>
          <el-table :data="regionData" border style="width: 100%">
            <el-table-column prop="region" label="地区" />
            <el-table-column prop="totalAssets" label="总资产" :formatter="formatCurrency" />
            <el-table-column prop="returnRate" label="收益率" />
            <el-table-column prop="maxDrawdown" label="最大回撤" />
            <el-table-column prop="investmentRate" label="投资率" />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue';
import * as echarts from 'echarts';
import { fetchAssetCategoryData, fetchTimeDataFromBackend, fetchRegionDataFromBackend } from '@/api/acp';

export default {
  setup() {
    // 资产类别对比分析
    const categoryChart = ref(null);
    const categoryData = ref([]);
    const isCategoryChartVisible = ref(false);
    
    // 时间段对比分析
    const timeChart = ref(null);
    const timeData = ref([]);
    const isTimeChartVisible = ref(false);
    const timePeriod = ref('weekly');
    
    // 地区对比分析
    const regionChart = ref(null);
    const regionData = ref([]);
    const isRegionChartVisible = ref(false);
    
    // 格式化货币显示
    const formatCurrency = (row, column, cellValue) => {
      if (typeof cellValue === 'number') {
        return '¥' + cellValue.toLocaleString('zh-CN', {minimumFractionDigits: 2, maximumFractionDigits: 2});
      }
      return cellValue;
    };
    
    // 解析字符串百分比为数字
    const parsePercentage = (value) => {
      if (typeof value === 'string' && value.endsWith('%')) {
        return parseFloat(value.replace('%', ''));
      }
      return parseFloat(value) || 0;
    };
    
    // 初始化资产类别图表
    const initCategoryChart = () => {
      const chart = echarts.init(categoryChart.value);
      const option = {
        title: {
          text: '资产类别对比分析',
          subtext: '展示各类资产的总资产、收益率和市场额',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function(params) {
            let result = params[0].name + '<br/>';
            params.forEach(param => {
              const value = param.seriesIndex === 1 ? param.value + '%' : '¥' + param.value.toLocaleString();
              result += `${param.seriesName}: ${value}<br/>`;
            });
            return result;
          }
        },
        legend: {
          data: ['总资产', '收益率', '市场额'],
          bottom: 10
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: categoryData.value.map(item => item.category),
          axisLabel: {
            interval: 0,
            rotate: 30
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '金额',
            position: 'left',
            axisLabel: {
              formatter: '¥{value}'
            }
          },
          {
            type: 'value',
            name: '收益率(%)',
            position: 'right',
            axisLabel: {
              formatter: '{value}%'
            },
            max: function(value) {
              return value.max + 5; // 留出空间
            }
          }
        ],
        series: [
          {
            name: '总资产',
            type: 'bar',
            barGap: 0,
            barWidth: '30%',
            data: categoryData.value.map(item => parseFloat(item.totalAssets) || 0),
            itemStyle: { color: '#5470C6' }
          },
          {
            name: '收益率',
            type: 'line',
            yAxisIndex: 1,
            data: categoryData.value.map(item => parsePercentage(item.returnRate)),
            itemStyle: { color: '#EE6666' },
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: {
              width: 3
            }
          },
          {
            name: '市场额',
            type: 'bar',
            barWidth: '30%',
            data: categoryData.value.map(item => parseFloat(item.marketValue) || 0),
            itemStyle: { color: '#91CC75' }
          }
        ]
      };
      chart.setOption(option);
      window.addEventListener('resize', chart.resize);
    };
    
    // 初始化时间段图表
    const initTimeChart = () => {
      const chart = echarts.init(timeChart.value);
      const option = {
        title: {
          text: timePeriod.value === 'weekly' ? '周度对比分析' : '年度对比分析',
          subtext: '展示不同时间段的总资产和收益率变化',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'line' }
        },
        legend: {
          data: ['总资产', '收益率', '市场额'],
          bottom: 10
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: timeData.value.map(item => item.timePeriod),
          axisLabel: {
            interval: 0,
            rotate: timePeriod.value === 'weekly' ? 30 : 0
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '金额',
            position: 'left',
            axisLabel: {
              formatter: '¥{value}'
            }
          },
          {
            type: 'value',
            name: '百分比',
            position: 'right',
            axisLabel: {
              formatter: '{value}%'
            }
          }
        ],
        series: [
          {
            name: '总资产',
            type: 'line',
            data: timeData.value.map(item => parseFloat(item.totalAssets) || 0),
            itemStyle: { color: '#5470C6' },
            symbol: 'circle',
            symbolSize: 8
          },
          {
            name: '收益率',
            type: 'line',
            yAxisIndex: 1,
            data: timeData.value.map(item => parsePercentage(item.returnRate)),
            itemStyle: { color: '#EE6666' },
            symbol: 'diamond',
            symbolSize: 8
          },
          {
            name: '市场额',
            type: 'bar',
            data: timeData.value.map(item => parseFloat(item.marketValue) || 0),
            itemStyle: { color: '#91CC75' }
          }
        ]
      };
      chart.setOption(option);
      
      window.addEventListener('resize', () => {
        chart.resize();
      });
    };
    
    // 初始化地区图表
    const initRegionChart = () => {
      const chart = echarts.init(regionChart.value);
      const option = {
        title: {
          text: '地区对比分析',
          subtext: '展示不同地区的总资产、收益率和最大回撤',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' }
        },
        legend: {
          data: ['总资产', '收益率', '最大回撤'],
          bottom: 10
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: regionData.value.map(item => item.region)
        },
        yAxis: [
          {
            type: 'value',
            name: '金额',
            position: 'left',
            axisLabel: {
              formatter: '¥{value}'
            }
          },
          {
            type: 'value',
            name: '百分比',
            position: 'right',
            axisLabel: {
              formatter: '{value}%'
            }
          }
        ],
        series: [
          {
            name: '总资产',
            type: 'bar',
            data: regionData.value.map(item => parseFloat(item.totalAssets) || 0),
            itemStyle: { color: '#5470C6' }
          },
          {
            name: '收益率',
            type: 'line',
            yAxisIndex: 1,
            data: regionData.value.map(item => parsePercentage(item.returnRate)),
            itemStyle: { color: '#EE6666' }
          },
          {
            name: '最大回撤',
            type: 'line',
            yAxisIndex: 1,
            data: regionData.value.map(item => parsePercentage(item.maxDrawdown)),
            itemStyle: { color: '#FFB657' },
            symbol: 'triangle',
            symbolSize: 8
          }
        ]
      };
      chart.setOption(option);
      
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
      }
    };
    
    const toggleTimeChart = () => {
      isTimeChartVisible.value = !isTimeChartVisible.value;
      if (isTimeChartVisible.value) {
        nextTick(() => {
          initTimeChart();
        });
      }
    };
    
    const toggleRegionChart = () => {
      isRegionChartVisible.value = !isRegionChartVisible.value;
      if (isRegionChartVisible.value) {
        nextTick(() => {
          initRegionChart();
        });
      }
    };
    
    // 获取数据
    const fetchCategoryData = async () => {
      try {
        const response = await fetchAssetCategoryData();
        categoryData.value = response.categoryData || [];
      } catch (error) {
        console.error('获取资产类别数据失败:', error);
      }
    };
    
    const fetchTimeData = async () => {
      try {
        const response = await fetchTimeDataFromBackend({ period: timePeriod.value });
        timeData.value = response.timeData || [];
      } catch (error) {
        console.error('获取时间段数据失败:', error);
      }
    };
    
    const fetchRegionData = async () => {
      try {
        const response = await fetchRegionDataFromBackend();
        regionData.value = response.regionData || [];
      } catch (error) {
        console.error('获取地区数据失败:', error);
      }
    };
    
    // 初始化
    onMounted(() => {
      fetchCategoryData();
      fetchTimeData();
      fetchRegionData();
    });
    
    return {
      categoryChart,
      categoryData,
      isCategoryChartVisible,
      toggleCategoryChart,
      
      timeChart,
      timeData,
      isTimeChartVisible,
      timePeriod,
      toggleTimeChart,
      fetchTimeData,
      
      regionChart,
      regionData,
      isRegionChartVisible,
      toggleRegionChart,
      
      formatCurrency
    };
  }
};
</script>

<style scoped>
.asset-comparison-analysis {
  padding: 20px;
}

.analysis-module {
  margin-bottom: 30px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.module-title {
  font-size: 18px;
  margin-bottom: 15px;
  color: #303133;
}

.module-content {
  margin-top: 15px;
}

.module-button {
  background-color: #409eff;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 15px;
}

.module-button:hover {
  background-color: #66b1ff;
}

.analysis-chart {
  margin-bottom: 20px;
}

.module-table {
  margin-top: 20px;
}

.period-selector {
  margin-bottom: 15px;
}
</style>
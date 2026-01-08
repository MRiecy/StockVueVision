<template>
  <div class="comparison-chart">
    <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { fetchAssetComparison, fetchYearlyComparisonData, fetchAreaComparison } from '@/api/comparisonModuleApi.js';

export default {
  name: 'ComparisonChart',
  props: {
    chartType: {
      type: String,
      default: 'asset'
    }
  },
  data() {
    return {
      myChart: null,
      loading: false
    };
  },
  mounted() {
    this.initChart();
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
    if (this.myChart) {
      this.myChart.dispose();
    }
  },
  watch: {
    chartType: {
      handler() {
        this.updateChart();
      },
      immediate: false
    }
  },
  methods: {
    initChart() {
      const chartDom = this.$refs.chartContainer;
      this.myChart = echarts.init(chartDom);
      this.updateChart();
    },
    
    async updateChart() {
      if (!this.myChart) return;
      
      this.loading = true;
      let option = {};
      
      try {
        console.log(`📊 开始更新图表: ${this.chartType}`);
        
        switch (this.chartType) {
          case 'asset':
            option = await this.getAssetComparisonOption();
            break;
          case 'time':
            option = await this.getTimeComparisonOption();
            break;
          case 'region':
            option = await this.getRegionComparisonOption();
            break;
          default:
            option = await this.getAssetComparisonOption();
        }
        
        // 确保配置完整，添加必要的默认配置
        if (!option.series) {
          option.series = [];
        }
        
        // 确保每个 series 都有 type 属性，避免 ECharts 读取 undefined.type
        if (Array.isArray(option.series)) {
          option.series = option.series.map(seriesItem => {
            if (!seriesItem || typeof seriesItem !== 'object') {
              return { type: 'bar', data: [] };
            }
            if (!seriesItem.type) {
              console.warn('⚠️ Series 缺少 type 属性，使用默认值 bar');
              return { ...seriesItem, type: 'bar' };
            }
            return seriesItem;
          });
        }
        
        // 完全清除极坐标配置，避免配置冲突
        delete option.polar;
        delete option.angleAxis;
        delete option.radiusAxis;
        
        // 使用 notMerge: true 完全替换配置，避免残留配置导致错误
        this.myChart.setOption(option, { notMerge: true, lazyUpdate: false });
        console.log(`✅ 图表更新成功: ${this.chartType}`);
      } catch (error) {
        console.error(`❌ 更新图表失败: ${this.chartType}`, error);
        // 如果出错，显示空图表
        try {
          this.myChart.setOption(this.getEmptyChartOption('图表加载失败'), { notMerge: true });
        } catch (e) {
          console.error('设置空图表也失败:', e);
        }
      } finally {
        this.loading = false;
      }
    },
    
    async getAssetComparisonOption() {
      try {
        const data = await fetchAssetComparison();
        console.log('✅ 资产对比数据:', data);
        
        // 兼容两种数据格式：asset_data 或 positions
        const assetData = data.asset_data || data.positions || [];
        
        if (!Array.isArray(assetData) || assetData.length === 0) {
          console.warn('⚠️ 资产对比数据为空');
          throw new Error('资产对比数据为空');
        }
        
        // 提取股票代码和市值
        const stockNames = assetData.map(item => item.stock_name || item.stock_code);
        const marketValues = assetData.map(item => item.market_value);
        const percentages = assetData.map(item => item.percentage || item.asset_ratio);
        
        return {
          tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(26, 31, 58, 0.95)',
            borderColor: 'rgba(64, 224, 255, 0.3)',
            textStyle: { color: '#ffffff' },
            formatter: (params) => {
              const idx = params[0].dataIndex;
              return `${stockNames[idx]}<br/>市值: ${marketValues[idx].toLocaleString()}<br/>占比: ${percentages[idx]}%`;
            }
          },
          grid: {
            left: '5%',
            right: '5%',
            bottom: '15%',
            top: '10%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: stockNames,
            axisLabel: { color: '#ffffff', fontSize: 10, rotate: 30 },
            axisLine: { lineStyle: { color: 'rgba(64, 224, 255, 0.3)' } }
          },
          yAxis: {
            type: 'value',
            name: '市值(元)',
            axisLabel: {
              color: '#ffffff',
            fontSize: 10,
            formatter: '{value}%'
          },
          nameTextStyle: { color: '#ffffff', fontSize: 11 },
          axisLine: { lineStyle: { color: 'rgba(64, 224, 255, 0.3)' } },
          splitLine: { lineStyle: { color: 'rgba(64, 224, 255, 0.1)' } }
        },
        series: [
          {
            name: '市值',
            type: 'bar',
            data: marketValues,
            itemStyle: { 
              color: '#40e0ff',
              borderRadius: [4, 4, 0, 0]
            },
            label: {
              show: true,
              position: 'top',
              color: '#fff',
              formatter: (params) => `${percentages[params.dataIndex]}%`
            }
          }
        ]
      };
      } catch (error) {
        console.error('❌ 获取资产对比数据失败:', error);
        return this.getEmptyChartOption('资产对比数据加载失败');
      }
    },
    
    async getTimeComparisonOption() {
      try {
        const data = await fetchYearlyComparisonData();
        console.log('✅ 年度对比数据:', data);
        
        const yearlyData = data.yearly_data || [];
        
        if (!Array.isArray(yearlyData) || yearlyData.length === 0) {
          console.warn('⚠️ 年度对比数据为空');
          throw new Error('年度对比数据为空');
        }
        
        // 兼容不同的字段名：timePeriod 或 year
        const years = yearlyData.map(item => item.timePeriod || item.year || '');
        const totalAssets = yearlyData.map(item => item.totalAssets || 0);
        const returnRates = yearlyData.map(item => item.returnRate || 0);
        
        return {
          tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(26, 31, 58, 0.95)',
            borderColor: 'rgba(64, 224, 255, 0.3)',
            textStyle: { color: '#ffffff' }
          },
          legend: {
            data: ['总资产', '回报率'],
            textStyle: { color: '#ffffff', fontSize: 12 },
            bottom: '5%'
          },
          grid: {
            left: '5%',
            right: '5%',
            bottom: '20%',
            top: '10%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: years,
            axisLabel: { color: '#ffffff', fontSize: 10 },
            axisLine: { lineStyle: { color: 'rgba(64, 224, 255, 0.3)' } }
          },
          yAxis: [
            {
              type: 'value',
              name: '总资产(元)',
              position: 'left',
              axisLabel: {
                color: '#ffffff',
                fontSize: 10,
                formatter: (value) => (value / 10000).toFixed(0) + 'w'
              },
              nameTextStyle: { color: '#ffffff', fontSize: 11 },
              axisLine: { lineStyle: { color: 'rgba(64, 224, 255, 0.3)' } },
              splitLine: { lineStyle: { color: 'rgba(64, 224, 255, 0.1)' } }
            },
            {
              type: 'value',
              name: '回报率(%)',
              position: 'right',
              axisLabel: {
                color: '#ffffff',
                fontSize: 10,
                formatter: '{value}%'
              },
              nameTextStyle: { color: '#ffffff', fontSize: 11 },
              axisLine: { lineStyle: { color: 'rgba(255, 107, 107, 0.3)' } },
              splitLine: { show: false }
            }
          ],
          series: [
            {
              name: '总资产',
              type: 'bar',
              data: totalAssets,
              itemStyle: { color: '#40e0ff', borderRadius: [4, 4, 0, 0] },
              yAxisIndex: 0
            },
            {
              name: '回报率',
              type: 'line',
              data: returnRates,
              itemStyle: { color: '#ff6b6b' },
              lineStyle: { width: 2 },
              yAxisIndex: 1
            }
          ]
        };
      } catch (error) {
        console.error('❌ 获取年度对比数据失败:', error);
        return this.getEmptyChartOption('年度对比数据加载失败');
      }
    },
    
    async getRegionComparisonOption() {
      try {
        const data = await fetchAreaComparison();
        console.log('✅ 地区对比数据:', data);
        
        const regionData = data.region_data || [];
        
        if (!Array.isArray(regionData) || regionData.length === 0) {
          console.warn('⚠️ 地区对比数据为空');
          throw new Error('地区对比数据为空');
        }
        
        const regions = regionData.map(item => item.region);
        const colors = ['#40e0ff', '#ff6b6b', '#feca57', '#48dbfb', '#00ff88', '#ff6348'];
        
        const pieData = regionData.map((item, index) => ({
          name: item.region,
          value: item.totalAssets,
          itemStyle: { color: colors[index % colors.length] }
        }));
        
        return {
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(26, 31, 58, 0.95)',
            borderColor: 'rgba(64, 224, 255, 0.3)',
            textStyle: { color: '#ffffff' },
            formatter: (params) => {
              const item = regionData[params.dataIndex];
              const investRate = typeof item.investmentRate === 'string' 
                ? item.investmentRate 
                : `${item.investmentRate}%`;
              const returnRate = typeof item.returnRate === 'string'
                ? item.returnRate
                : `${item.returnRate}%`;
              return `${params.name}<br/>资产: ${params.value.toLocaleString()}<br/>投资占比: ${investRate}<br/>回报率: ${returnRate}`;
            }
          },
          legend: {
            data: regions,
            textStyle: { color: '#ffffff', fontSize: 12 },
            bottom: '5%'
          },
          series: [
            {
              name: '地区配置',
              type: 'pie',
              radius: ['30%', '70%'],
              center: ['50%', '45%'],
              data: pieData,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              label: {
                color: '#ffffff',
                fontSize: 12,
                formatter: '{b}: {d}%'
              }
            }
          ]
        };
      } catch (error) {
        console.error('❌ 获取地区对比数据失败:', error);
        return this.getEmptyChartOption('地区对比数据加载失败');
      }
    },
    
    handleResize() {
      if (this.myChart) {
        this.myChart.resize();
      }
    },
    
    getEmptyChartOption(message = '暂无数据') {
      return {
        title: {
          text: message,
          left: 'center',
          top: 'center',
          textStyle: {
            color: '#999',
            fontSize: 14
          }
        },
        // 添加一个空的 bar 类型 series，确保有 type 属性
        series: [{
          type: 'bar',
          data: []
        }],
        // 添加基本的坐标轴配置，避免配置冲突
        xAxis: { 
          type: 'category',
          show: false,
          data: []
        },
        yAxis: { 
          type: 'value',
          show: false
        },
        // 确保没有极坐标配置
        grid: {
          show: false
        }
      };
    }
  }
};
</script>

<style scoped>
.comparison-chart {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-container {
  width: 100%;
  height: 100%;
  min-height: 200px;
}
</style> 
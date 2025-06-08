<template>
  <div class="comparison-chart">
    <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

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
      myChart: null
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
    
    updateChart() {
      if (!this.myChart) return;
      
      let option = {};
      
      switch (this.chartType) {
        case 'asset':
          option = this.getAssetComparisonOption();
          break;
        case 'time':
          option = this.getTimeComparisonOption();
          break;
        case 'region':
          option = this.getRegionComparisonOption();
          break;
        default:
          option = this.getAssetComparisonOption();
      }
      
      this.myChart.setOption(option, true);
    },
    
    getAssetComparisonOption() {
      return {
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
          textStyle: { color: '#ffffff' },
          formatter: function(params) {
            let tooltip = `<div style="font-size: 14px; font-weight: bold; margin-bottom: 8px;">日期: ${params[0].axisValueLabel}</div>`;
            params.forEach(param => {
              const color = param.color;
              const seriesName = param.seriesName;
              const value = param.value.toFixed(2);
              
              tooltip += `<div style="margin: 4px 0;">
                <span style="display: inline-block; width: 10px; height: 10px; background-color: ${color}; border-radius: 50%; margin-right: 8px;"></span>
                <span style="font-weight: 500;">${seriesName}:</span>
                <span style="float: right; margin-left: 20px; font-weight: bold;">${value}%</span>
              </div>`;
            });
            return tooltip;
          }
        },
        legend: {
          data: ['股票A', '股票B', '基准指数'],
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
          data: this.generateDateRange(30),
          axisLabel: { color: '#ffffff', fontSize: 10 },
          axisLine: { lineStyle: { color: 'rgba(64, 224, 255, 0.3)' } }
        },
        yAxis: {
          type: 'value',
          name: '收益率(%)',
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
            name: '股票A',
            type: 'line',
            data: this.generateRandomData(30, 15, 5),
            smooth: true,
            itemStyle: { color: '#40e0ff' },
            lineStyle: { width: 2 },
            symbol: 'circle',
            symbolSize: 6,
            emphasis: {
              itemStyle: {
                color: '#66e6ff',
                borderWidth: 2,
                borderColor: '#fff'
              },
              symbolSize: 10
            }
          },
          {
            name: '股票B',
            type: 'line',
            data: this.generateRandomData(30, 12, 8),
            smooth: true,
            itemStyle: { color: '#ff6b6b' },
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
            name: '基准指数',
            type: 'line',
            data: this.generateRandomData(30, 10, 3),
            smooth: true,
            itemStyle: { color: '#feca57' },
            lineStyle: { width: 2 },
            symbol: 'circle',
            symbolSize: 6,
            emphasis: {
              itemStyle: {
                color: '#fed97a',
                borderWidth: 2,
                borderColor: '#fff'
              },
              symbolSize: 10
            }
          }
        ]
      };
    },
    
    getTimeComparisonOption() {
      return {
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
          textStyle: { color: '#ffffff' },
          formatter: function(params) {
            let tooltip = `<div style="font-size: 14px; font-weight: bold; margin-bottom: 8px;">时间: ${params[0].axisValueLabel}</div>`;
            params.forEach(param => {
              const color = param.color;
              const seriesName = param.seriesName;
              const value = param.value.toFixed(2);
              
              tooltip += `<div style="margin: 4px 0;">
                <span style="display: inline-block; width: 10px; height: 10px; background-color: ${color}; border-radius: 50%; margin-right: 8px;"></span>
                <span style="font-weight: 500;">${seriesName}:</span>
                <span style="float: right; margin-left: 20px; font-weight: bold;">${value}%</span>
              </div>`;
            });
            return tooltip;
          }
        },
        legend: {
          data: ['近1月', '近3月', '近6月', '近1年'],
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
          data: ['2024-07', '2024-08', '2024-09', '2024-10', '2024-11', '2024-12', '2025-01'],
          axisLabel: { color: '#ffffff', fontSize: 10 },
          axisLine: { lineStyle: { color: 'rgba(64, 224, 255, 0.3)' } }
        },
        yAxis: {
          type: 'value',
          name: '累计收益率(%)',
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
            name: '近1月',
            type: 'bar',
            data: [2.3, 1.8, 3.2, 2.9, 4.1, 3.7, 2.5],
            itemStyle: { color: '#40e0ff' }
          },
          {
            name: '近3月',
            type: 'bar',
            data: [8.5, 7.2, 9.8, 8.9, 11.2, 10.3, 9.1],
            itemStyle: { color: '#ff6b6b' }
          },
          {
            name: '近6月',
            type: 'bar',
            data: [15.2, 14.8, 18.3, 16.7, 19.8, 18.9, 17.2],
            itemStyle: { color: '#feca57' }
          },
          {
            name: '近1年',
            type: 'bar',
            data: [28.5, 26.8, 32.1, 29.7, 35.2, 33.8, 31.5],
            itemStyle: { color: '#48dbfb' }
          }
        ]
      };
    },
    
    getRegionComparisonOption() {
      return {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(26, 31, 58, 0.95)',
          borderColor: 'rgba(64, 224, 255, 0.3)',
          textStyle: { color: '#ffffff' },
          formatter: function(params) {
            const name = params.name;
            const value = params.value;
            const percent = params.percent;
            
            return `<div style="font-size: 14px; font-weight: bold; margin-bottom: 8px;">交易所配置</div>
              <div style="margin: 4px 0;">
                <span style="display: inline-block; width: 10px; height: 10px; background-color: ${params.color}; border-radius: 50%; margin-right: 8px;"></span>
                <span style="font-weight: 500;">${name}:</span>
                <span style="float: right; margin-left: 20px; font-weight: bold;">${value}% (${percent}%)</span>
              </div>`;
          }
        },
        legend: {
          data: ['A股', '港股', '美股', '欧股'],
          textStyle: { color: '#ffffff', fontSize: 12 },
          bottom: '5%'
        },
        series: [
          {
            name: '交易所配置',
            type: 'pie',
            radius: ['30%', '70%'],
            center: ['50%', '45%'],
            data: [
              { value: 45, name: 'A股', itemStyle: { color: '#40e0ff' } },
              { value: 25, name: '港股', itemStyle: { color: '#ff6b6b' } },
              { value: 20, name: '美股', itemStyle: { color: '#feca57' } },
              { value: 10, name: '欧股', itemStyle: { color: '#48dbfb' } }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              color: '#ffffff',
              fontSize: 12
            }
          }
        ]
      };
    },
    
    generateDateRange(days) {
      const dates = [];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        dates.push(`${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`);
      }
      return dates;
    },
    
    generateRandomData(length, base, volatility) {
      const data = [];
      let current = base;
      
      for (let i = 0; i < length; i++) {
        current += (Math.random() - 0.5) * volatility;
        data.push(Number(current.toFixed(2)));
      }
      return data;
    },
    
    handleResize() {
      if (this.myChart) {
        this.myChart.resize();
      }
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
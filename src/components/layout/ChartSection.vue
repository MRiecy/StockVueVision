<template>
  <div class="chart-section">
    <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'ChartSection',
  mounted() {
    this.initChart();
    // 添加窗口大小变化监听
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    // 清理监听器
    window.removeEventListener('resize', this.handleResize);
    if (this.myChart) {
      this.myChart.dispose();
    }
  },
  methods: {
    initChart() {
      const chartDom = this.$refs.chartContainer;
      this.myChart = echarts.init(chartDom);

      const option = {
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
          }
        },
        legend: {
          data: ['基准收益', '策略收益', '超额收益'],
          bottom: '5%',
          textStyle: {
            color: '#ffffff',
            fontSize: 12
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '20%',
          top: '10%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: this.generateXAxisData(),
          axisLabel: {
            interval: 'auto',
            rotate: 30,
            color: '#ffffff',
            fontSize: 10
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(64, 224, 255, 0.3)'
            }
          }
        },
        yAxis: {
          type: 'value',
          name: '收益走势(%)',
          min: 0,
          max: 350,
          interval: 50,
          axisLabel: {
            formatter: '{value}%',
            color: '#ffffff',
            fontSize: 10
          },
          nameTextStyle: {
            color: '#ffffff',
            fontSize: 11
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
        series: [
          {
            name: '基准收益',
            type: 'line',
            data: this.generateRandomData('基准收益'),
            smooth: true,
            itemStyle: {
              color: '#00a2ae',
            },
            lineStyle: {
              width: 2
            },
            symbol: 'circle',
            symbolSize: 4
          },
          {
            name: '策略收益',
            type: 'line',
            data: this.generateRandomData('策略收益'),
            smooth: true,
            itemStyle: {
              color: '#ff7c57',
            },
            lineStyle: {
              width: 2
            },
            symbol: 'circle',
            symbolSize: 4
          },
          {
            name: '超额收益',
            type: 'line',
            data: this.generateRandomData('超额收益'),
            smooth: true,
            itemStyle: {
              color: '#00e191',
            },
            lineStyle: {
              width: 2
            },
            symbol: 'circle',
            symbolSize: 4
          },
        ],
      };

      this.myChart.setOption(option);
    },
    handleResize() {
      if (this.myChart) {
        this.myChart.resize();
      }
    },
    generateXAxisData() {
      const startDate = new Date('2025-01-01');
      return Array.from({ length: 30 }, (_, index) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + index);
        return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      });
    },
    generateRandomData(type) {
      return Array.from({ length: 30 }, () => {
        const base = Math.random() * 350;
        if (type === '基准收益') {
          return base;
        } else if (type === '策略收益') {
          return base * 1.1 + 50;
        } else if (type === '超额收益') {
          return base * 1.2 + 100;
        }
        return base;
      });
    },
  },
};
</script>

<style scoped>
.chart-section {
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
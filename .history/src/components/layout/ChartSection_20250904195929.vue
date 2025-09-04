<template>
  <div class="chart-section">
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <div class="loading-text">正在加载图表数据...</div>
    </div>

    <div v-else-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <div class="error-text">{{ error }}</div>
      <el-button type="primary" @click="retryLoad" size="small">重试</el-button>
    </div>

    <div v-else ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';

export default {
  name: 'ChartSection',
  data() {
    return {
      myChart: null,
      loading: true,
      error: null,
      chartData: null
    };
  },
  async mounted() {
    await this.loadChartData();
    this.initChart();
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('active-account-changed', this.reloadChart);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('active-account-changed', this.reloadChart);
    if (this.myChart) {
      this.myChart.dispose();
    }
  },
  methods: {
        async loadChartData() {
      this.loading = true;
      this.error = null;

      try {
        // 调用后端API获取策略图表数据
        const response = await axios.get('http://localhost:8000/api/strategy-chart/');
        this.chartData = response.data;
        console.log('图表数据加载成功:', this.chartData);
      } catch (error) {
        console.error('加载图表数据失败:', error);
        this.error = '无法加载图表数据，请检查网络连接或联系管理员';
      } finally {
        this.loading = false;
      }
    },

    retryLoad() {
      this.loadChartData().then(() => {
        if (this.chartData) {
          this.initChart();
        }
      });
    },
    reloadChart() {
      this.loading = true;
      this.loadChartData().then(() => {
        if (this.myChart) this.myChart.dispose();
        this.initChart();
      });
    },

    initChart() {
      if (!this.chartData) {
        console.warn('没有图表数据，无法初始化图表');
        return;
      }

      const chartDom = this.$refs.chartContainer;
      if (!chartDom) {
        console.warn('图表容器未找到');
        return;
      }

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
          data: this.chartData.legend || ['基准收益', '策略收益', '超额收益'],
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
          data: this.chartData.xAxis || [],
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
          name: this.chartData.yAxisName || '收益走势(%)',
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
        series: this.chartData.series || []
      };

      this.myChart.setOption(option);
    },

    handleResize() {
      if (this.myChart) {
        this.myChart.resize();
      }
    }
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

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #ffffff;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(64, 224, 255, 0.3);
  border-top: 3px solid #00ffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.loading-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #ffffff;
  text-align: center;
}

.error-icon {
  font-size: 32px;
  margin-bottom: 16px;
}

.error-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 16px;
  max-width: 300px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

<template>
  <div class="chart-section">
    <h3>策略执行结果</h3>
    <!-- 图表容器 -->
    <div ref="chartContainer" style="width:100%; height:400px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'; // 引入 ECharts

export default {
  name: 'ChartSection',
  mounted() {
    this.initChart();
  },
  methods: {
    // 初始化 ECharts 图表
    initChart() {
      const chartDom = this.$refs.chartContainer;
      const myChart = echarts.init(chartDom);

      // 生成数据
      const baseData = this.generateRandomData('基准收益');
      const strategyData = this.generateRandomData('策略收益');
      const excessData = this.calculateExcessData(baseData, strategyData);

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        legend: {
          data: ['基准收益', '策略收益', '超额收益'],
          bottom: '0', // 图例位置
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: this.generateXAxisData(), // X 轴时间范围
          axisLabel: {
            interval: 5, // 每隔5天显示一次时间刻度
            rotate: 45, // 旋转45度
          },
        },
        yAxis: {
          type: 'value',
          name: '收益走势', // Y轴标题
          min: 0,
          max: 350,
          interval: 50,
          axisLabel: {
            formatter: '{value} %',
          },
        },
        series: [
          {
            name: '基准收益',
            type: 'line',
            data: baseData,
            smooth: true,
            itemStyle: {
              color: '#00a2ae',
            },
          },
          {
            name: '策略收益',
            type: 'line',
            data: strategyData,
            smooth: true,
            itemStyle: {
              color: '#ff7c57',
            },
          },
          {
            name: '超额收益',
            type: 'line',
            data: excessData,
            smooth: true,
            itemStyle: {
              color: '#00e191',
            },
          },
        ],
      };

      myChart.setOption(option);
    },
    // 生成 X 轴数据（虚拟数据，30 天的时间）
    generateXAxisData() {
      const startDate = new Date('2025-01-01');
      return Array.from({ length: 30 }, (_, index) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + index);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      });
    },
    // 生成随机数据（基准收益和策略收益）
    generateRandomData(type) {
      return Array.from({ length: 30 }, () => {
        const base = Math.random() * 350; // 随机生成基数
        if (type === '策略收益') {
          return base + Math.random() * 100; // 策略收益相对于基准收益有一定的差值
        }
        return base;
      });
    },
    // 计算超额收益（策略收益减去基准收益）
    calculateExcessData(baseData, strategyData) {
      return baseData.map((base, index) => strategyData[index] - base);
    },
  },
};
</script>

<style scoped>
.chart-section {
  padding: 15px;
  background-color: #fff;
  border: 1px solid #dcdcdc;
  border-radius: 8px; /* 圆角边框 */
}
</style>
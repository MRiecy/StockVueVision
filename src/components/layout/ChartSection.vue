<template>
  <div class="chart-section">
    <div ref="chartContainer" style="width:100%; height:400px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'ChartSection',
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      const chartDom = this.$refs.chartContainer;
      const myChart = echarts.init(chartDom);

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
          bottom: '0',
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: this.generateXAxisData(),
          axisLabel: {
            interval: 5,
            rotate: 45,
          },
        },
        yAxis: {
          type: 'value',
          name: '收益走势',
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
            data: this.generateRandomData('基准收益'),
            smooth: true,
            itemStyle: {
              color: '#00a2ae',
            },
          },
          {
            name: '策略收益',
            type: 'line',
            data: this.generateRandomData('策略收益'),
            smooth: true,
            itemStyle: {
              color: '#ff7c57',
            },
          },
          {
            name: '超额收益',
            type: 'line',
            data: this.generateRandomData('超额收益'),
            smooth: true,
            itemStyle: {
              color: '#00e191',
            },
          },
        ],
      };

      myChart.setOption(option);
    },
    generateXAxisData() {
      const startDate = new Date('2025-01-01');
      return Array.from({ length: 30 }, (_, index) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + index);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
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
}
</style>
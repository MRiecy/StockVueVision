<template>
  <div class="comparison-chart">
    <div ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { fetchYearlyComparisonData, fetchWeeklyComparisonData } from '@/api/timecomparisonApi.js';
import { fetchRegionComparisonData } from '@/api/regioncomparisonApi.js';

export default {
  name: 'ComparisonChart',
  props: {
    chartType: { type: String, default: 'asset' },
    accountId: { type: String, default: 'DEMO000001' }
  },
  data() {
    return {
      myChart: null,
      yearlyData: [],
      weeklyData: [],
      regionData: []
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
    },
    accountId: {
      handler() {
        this.fetchAndRender();
      },
      immediate: true
    }
  },
  methods: {
    async initChart() {
      const chartDom = this.$refs.chartContainer;
      this.myChart = echarts.init(chartDom);
      await this.fetchAndRender();
    },

    async fetchAndRender() {
      try {
        if (this.chartType === 'time') {
          const yearly = await fetchYearlyComparisonData(this.accountId);
          const weekly = await fetchWeeklyComparisonData(this.accountId);
          this.yearlyData = Array.isArray(yearly?.yearly_data) ? yearly.yearly_data : [];
          this.weeklyData = Array.isArray(weekly?.weekly_data) ? weekly.weekly_data : [];
        } else if (this.chartType === 'region') {
          const region = await fetchRegionComparisonData(this.accountId);
          this.regionData = Array.isArray(region?.region_data) ? region.region_data : [];
        }
      } catch (e) {
        console.warn('数据获取失败，使用空数据占位', e);
        if (this.chartType === 'time') {
          this.yearlyData = [];
          this.weeklyData = [];
        } else if (this.chartType === 'region') {
          this.regionData = [];
        }
      } finally {
        this.updateChart();
      }
    },

    updateChart() {
      if (!this.myChart) return;
      let option = {};
      switch (this.chartType) {
        case 'time':
          option = this.getTimeComparisonOption();
          break;
        case 'region':
          option = this.getRegionComparisonOption();
          break;
        case 'asset':
        default:
          option = this.getAssetComparisonOption();
      }
      this.myChart.setOption(option, true);
    },

    safeSeries(series) {
      return Array.isArray(series) ? series : [];
    },

    getAssetComparisonOption() {
      // 仍为占位演示（无指定资产API），保留随机数据但加安全保护
      return {
        tooltip: { trigger: 'axis', backgroundColor: 'rgba(26, 31, 58, 0.95)', borderColor: 'rgba(64, 224, 255, 0.3)', textStyle: { color: '#ffffff' } },
        legend: { data: ['股票A', '股票B', '基准指数'], textStyle: { color: '#ffffff', fontSize: 12 }, bottom: '5%' },
        grid: { left: '5%', right: '5%', bottom: '20%', top: '10%', containLabel: true },
        xAxis: { type: 'category', data: this.generateDateRange(30), axisLabel: { color: '#ffffff', fontSize: 10 }, axisLine: { lineStyle: { color: 'rgba(64, 224, 255, 0.3)' } } },
        yAxis: { type: 'value', name: '收益率(%)', axisLabel: { color: '#ffffff' }, nameTextStyle: { color: '#ffffff' }, axisLine: { lineStyle: { color: 'rgba(64, 224, 255, 0.3)' } }, splitLine: { lineStyle: { color: 'rgba(64, 224, 255, 0.1)' } } },
        series: this.safeSeries([
          { name: '股票A', type: 'line', data: this.generateRandomData(30, 100, 8) || [], smooth: true, itemStyle: { color: '#40e0ff' } },
          { name: '股票B', type: 'line', data: this.generateRandomData(30, 90, 10) || [], smooth: true, itemStyle: { color: '#ff6b6b' } },
          { name: '基准指数', type: 'line', data: this.generateRandomData(30, 80, 6) || [], smooth: true, itemStyle: { color: '#feca57' } },
        ])
      };
    },

    getTimeComparisonOption() {
      const x = (this.yearlyData.length > 0 ? this.yearlyData : this.weeklyData).map(d => d.timePeriod);
      const totalAssets = (this.yearlyData.length > 0 ? this.yearlyData : this.weeklyData).map(d => d.totalAssets ?? 0);
      const returnRate = (this.yearlyData.length > 0 ? this.yearlyData : this.weeklyData).map(d => parseFloat(d.returnRate) || 0);
      const growthRate = (this.yearlyData.length > 0 ? this.yearlyData : this.weeklyData).map(d => parseFloat(d.growthRate) || 0);
      return {
        tooltip: { trigger: 'axis', backgroundColor: 'rgba(26, 31, 58, 0.95)', borderColor: 'rgba(64, 224, 255, 0.3)', textStyle: { color: '#ffffff' } },
        legend: { data: ['总资产', '收益率', '增长率'], textStyle: { color: '#ffffff', fontSize: 12 }, bottom: '5%' },
        grid: { left: '5%', right: '5%', bottom: '20%', top: '10%', containLabel: true },
        xAxis: { type: 'category', data: Array.isArray(x) ? x : [], axisLabel: { color: '#ffffff', fontSize: 10 }, axisLine: { lineStyle: { color: 'rgba(64, 224, 255, 0.3)' } } },
        yAxis: [
          { type: 'value', name: '总资产', axisLabel: { color: '#ffffff' }, nameTextStyle: { color: '#ffffff' }, axisLine: { lineStyle: { color: 'rgba(64, 224, 255, 0.3)' } }, splitLine: { lineStyle: { color: 'rgba(64, 224, 255, 0.1)' } } },
          { type: 'value', name: '百分比', axisLabel: { formatter: '{value}%', color: '#ffffff' }, nameTextStyle: { color: '#ffffff' }, axisLine: { lineStyle: { color: 'rgba(64, 224, 255, 0.3)' } } },
        ],
        series: this.safeSeries([
          { name: '总资产', type: 'line', data: Array.isArray(totalAssets) ? totalAssets : [], smooth: true, itemStyle: { color: '#40e0ff' } },
          { name: '收益率', type: 'line', yAxisIndex: 1, data: Array.isArray(returnRate) ? returnRate : [], smooth: true, itemStyle: { color: '#ff6b6b' } },
          { name: '增长率', type: 'line', yAxisIndex: 1, data: Array.isArray(growthRate) ? growthRate : [], smooth: true, itemStyle: { color: '#feca57' } },
        ])
      };
    },

    getRegionComparisonOption() {
      const regions = this.regionData.map(d => d.region);
      const totalAssets = this.regionData.map(d => d.totalAssets ?? 0);
      const returnRate = this.regionData.map(d => parseFloat((d.returnRate || '').toString().replace('%','')) || 0);
      const investRate = this.regionData.map(d => parseFloat((d.investmentRate || '').toString().replace('%','')) || 0);
      return {
        tooltip: { trigger: 'axis', backgroundColor: 'rgba(26, 31, 58, 0.95)', borderColor: 'rgba(64, 224, 255, 0.3)', textStyle: { color: '#ffffff' } },
        legend: { data: ['总资产', '收益率', '投资率'], textStyle: { color: '#ffffff', fontSize: 12 }, bottom: '5%' },
        grid: { left: '5%', right: '5%', bottom: '20%', top: '10%', containLabel: true },
        xAxis: { type: 'category', data: Array.isArray(regions) ? regions : [], axisLabel: { color: '#ffffff', fontSize: 10 }, axisLine: { lineStyle: { color: 'rgba(64, 224, 255, 0.3)' } } },
        yAxis: [
          { type: 'value', name: '总资产', axisLabel: { color: '#ffffff' }, nameTextStyle: { color: '#ffffff' }, axisLine: { lineStyle: { color: 'rgba(64, 224, 255, 0.3)' } }, splitLine: { lineStyle: { color: 'rgba(64, 224, 255, 0.1)' } } },
          { type: 'value', name: '百分比', axisLabel: { formatter: '{value}%', color: '#ffffff' }, nameTextStyle: { color: '#ffffff' }, axisLine: { lineStyle: { color: 'rgba(64, 224, 255, 0.3)' } } },
        ],
        series: this.safeSeries([
          { name: '总资产', type: 'bar', data: Array.isArray(totalAssets) ? totalAssets : [], itemStyle: { color: '#5470C6' } },
          { name: '收益率', type: 'line', yAxisIndex: 1, data: Array.isArray(returnRate) ? returnRate : [], itemStyle: { color: '#EE6666' } },
          { name: '投资率', type: 'line', yAxisIndex: 1, data: Array.isArray(investRate) ? investRate : [], itemStyle: { color: '#FFB657' } },
        ])
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

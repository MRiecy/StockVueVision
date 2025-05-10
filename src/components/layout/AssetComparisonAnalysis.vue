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

    // 获取资产类别数据的方法
    const fetchCategoryData = async () => {
      isLoading.value = true;
      hasError.value = false;
      errorMessage.value = '';

      try {
        console.log('开始获取数据...');
        const response = await fetch('/api/asset_comparison/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('服务器响应错误:', {
            status: response.status,
            statusText: response.statusText,
            errorText: errorText
          });

          if (response.status === 500) {
            // 如果是500错误，等待1秒后重试
            await new Promise(resolve => setTimeout(resolve, 1000));
            return fetchCategoryData();
          } else {
            throw new Error(`请求失败: ${response.status} ${response.statusText}`);
          }
        }

        const data = await response.json();
        console.log('API返回的原始数据:', data);

        // 检查数据结构
        if (!data || !data.accounts || !Array.isArray(data.accounts) || data.accounts.length === 0) {
          throw new Error('返回的数据格式不正确');
        }

        const account = data.accounts[0];
        if (!account.positions || !Array.isArray(account.positions) || account.positions.length === 0) {
          throw new Error('未找到持仓数据');
        }

        // 处理数据
        categoryData.value = account.positions.map(item => ({
          stock_code: item.stock_code,
          asset_ratio: (item.asset_ratio * 100).toFixed(2) + '%',
          market_value: Number(item.market_value),
          daily_return: Number(item.daily_return).toFixed(2) + '%'
        }));

        console.log('处理后的数据:', categoryData.value);

        // 如果图表可见，重新初始化图表
        if (isCategoryChartVisible.value) {
          nextTick(() => {
            initCategoryChart();
          });
        }

      } catch (error) {
        console.error('获取数据时发生错误:', error);
        hasError.value = true;
        errorMessage.value = error.message || '获取数据时发生错误';

        // 如果是网络错误，3秒后重试
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
          setTimeout(() => {
            fetchCategoryData();
          }, 3000);
        }
      } finally {
        isLoading.value = false;
      }
    };

    // 在组件挂载时获取数据
    onMounted(() => {
      console.log('组件已挂载，开始获取数据...');
      fetchCategoryData();
    });

    // 时间段数据
    const timeData = ref([
      { timePeriod: '2024-01', totalAssets: 200000, returnRate: '4%', growthRate: '5%' },
      { timePeriod: '2024-02', totalAssets: 220000, returnRate: '5%', growthRate: '10%' },
      { timePeriod: '2024-03', totalAssets: 250000, returnRate: '6%', growthRate: '15%' },
      { timePeriod: '2024-04', totalAssets: 280000, returnRate: '7%', growthRate: '20%' },
      { timePeriod: '2024-05', totalAssets: 300000, returnRate: '8%', growthRate: '25%' },
    ]);

    // 地区数据
    const regionData = ref([
      { region: '北京', totalAssets: 150000, returnRate: '5%', investmentRate: '30%' },
      { region: '上海', totalAssets: 180000, returnRate: '6%', investmentRate: '35%' },
      { region: '深圳', totalAssets: 200000, returnRate: '7%', investmentRate: '40%' },
      { region: '广州', totalAssets: 120000, returnRate: '4%', investmentRate: '25%' },
      { region: '杭州', totalAssets: 100000, returnRate: '3%', investmentRate: '20%' },
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
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
        },
        legend: {
          data: ['资产占比', '股票市值', '收益率'],
          bottom: 0,
        },
        xAxis: {
          type: 'category',
          data: categoryData.value.map(item => item.stock_code),
        },
        yAxis: [
          {
            type: 'value',
            name: '资产占比',
            position: 'left',
            axisLabel: { formatter: '{value}%' },
          },
          {
            type: 'value',
            name: '股票市值',
            position: 'right',
            axisLabel: { formatter: '{value} 元' },
          },
          {
            type: 'value',
            name: '收益率',
            position: 'right',
            offset: 80,
            axisLabel: { formatter: '{value}%' },
          }
        ],
        series: [
          {
            name: '资产占比',
            type: 'bar',
            data: categoryData.value.map(item => parseFloat(item.asset_ratio)),
            itemStyle: { color: '#5470C6' },
          },
          {
            name: '股票市值',
            type: 'line',
            yAxisIndex: 1,
            data: categoryData.value.map(item => item.market_value),
            itemStyle: { color: '#EE6666' },
          },
          {
            name: '收益率',
            type: 'line',
            yAxisIndex: 2,
            data: categoryData.value.map(item => parseFloat(item.daily_return)),
            itemStyle: { color: '#91CC75' },
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
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'line' },
        },
        legend: {
          data: ['总资产', '收益率', '增长率'],
          bottom: 0,
        },
        xAxis: {
          type: 'category',
          data: timeData.value.map(item => item.timePeriod),
        },
        yAxis: [
          {
            type: 'value',
            name: '总资产',
            position: 'left',
            axisLabel: { formatter: '{value} 元' },
          },
          {
            type: 'value',
            name: '收益率',
            position: 'right',
            axisLabel: { formatter: '{value}%' },
          },
        ],
        series: [
          {
            name: '总资产',
            type: 'line',
            data: timeData.value.map(item => item.totalAssets),
            itemStyle: { color: '#5470C6' },
          },
          {
            name: '收益率',
            type: 'line',
            yAxisIndex: 1,
            data: timeData.value.map(item => parseFloat(item.returnRate)),
            itemStyle: { color: '#EE6666' },
          },
          {
            name: '增长率',
            type: 'line',
            yAxisIndex: 1,
            data: timeData.value.map(item => parseFloat(item.growthRate)),
            itemStyle: { color: '#FFB657' },
          },
        ],
      });

      // 调整图表宽度自适应
      window.addEventListener('resize', () => {
        chart.resize();
      });
    };

    // 初始化地区图表
    const initRegionChart = () => {
      const chart = echarts.init(regionChart.value);
      chart.setOption({
        title: {
          text: '地区对比分析',

          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'line' },
        },
        legend: {
          data: ['总资产', '收益率', '投资率'],
          bottom: 0,
        },
        xAxis: {
          type: 'category',
          data: regionData.value.map(item => item.region),
        },
        yAxis: [
          {
            type: 'value',
            name: '总资产',
            position: 'left',
            axisLabel: { formatter: '{value} 元' },
          },
          {
            type: 'value',
            name: '收益率',
            position: 'right',
            axisLabel: { formatter: '{value}%' },
          },
        ],
        series: [
          {
            name: '总资产',
            type: 'bar',
            data: regionData.value.map(item => item.totalAssets),
            itemStyle: { color: '#5470C6' },
          },
          {
            name: '收益率',
            type: 'line',
            yAxisIndex: 1,
            data: regionData.value.map(item => parseFloat(item.returnRate)),
            itemStyle: { color: '#EE6666' },
          },
          {
            name: '投资率',
            type: 'line',
            yAxisIndex: 1,
            data: regionData.value.map(item => parseFloat(item.investmentRate)),
            itemStyle: { color: '#FFB657' },
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
    };
  },
};
</script>

<style scoped>
.asset-comparison-analysis {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  width: 100%;
}

.loading-state {
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.error-state {
  padding: 20px;
}

.error-state :deep(.el-alert) {
  margin: 0;
}

.analysis-module {
  margin-bottom: 20px;
  width: 100%;
}

.module-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333333;
}

.module-content {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.module-button {
  background-color: #409eff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;
}

.module-button:hover {
  background-color: #66b1ff;
}

.module-table {
  margin-top: 10px;
  width: 100%;
}

.analysis-chart {
  margin-bottom: 20px;
  width: 100%;
}

.analysis-chart > div {
  width: 100%;
  height: 400px;
}
</style>
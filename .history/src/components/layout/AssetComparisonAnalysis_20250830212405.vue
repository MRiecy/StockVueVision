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
        <div v-if="isTimeLoading" class="loading-state">
          <el-skeleton :rows="3" animated />
        </div>
        <div v-else-if="hasTimeError" class="error-state">
          <el-alert
            :title="timeErrorMessage"
            type="error"
            :closable="false"
            show-icon
          />
        </div>
        <template v-else>
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
        </template>
      </div>
    </div>

    <!-- 地区对比分析 -->
    <div class="analysis-module">
      <h5 class="module-title">分市场对比分析</h5>
      <div class="module-content">
        <div v-if="isRegionLoading" class="loading-state">
          <el-skeleton :rows="3" animated />
        </div>
        <div v-else-if="hasRegionError" class="error-state">
          <el-alert
            :title="regionErrorMessage"
            type="error"
            :closable="false"
            show-icon
          />
        </div>
        <template v-else>
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
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, nextTick, onMounted, watch } from 'vue';
import * as echarts from 'echarts';
import { fetchAccountInfo } from '@/api/accountApi.js';
import { fetchYearlyComparisonData, fetchWeeklyComparisonData } from '@/api/timecomparisonApi.js';
import { fetchRegionComparisonData } from '@/api/regioncomparisonApi.js';

export default {
  name: 'AssetComparisonAnalysis',
  props: {
    accountId: {
      type: String,
      default: '40000326'
    }
  },
  setup(props) {
    const categoryChart = ref(null);
    const timeChart = ref(null);
    const regionChart = ref(null);

    // 数据加载状态和错误状态
    const isLoading = ref(false);
    const hasError = ref(false);
    const errorMessage = ref('');

    const isTimeLoading = ref(false);
    const hasTimeError = ref(false);
    const timeErrorMessage = ref('');

    const isRegionLoading = ref(false);
    const hasRegionError = ref(false);
    const regionErrorMessage = ref('');

    // 数据状态
    const categoryData = ref([]);
    const timeData = ref([]);
    const regionData = ref([]);

    const isCategoryChartVisible = ref(false);
    const isTimeChartVisible = ref(false);
    const isRegionChartVisible = ref(false);

    const safeSeries = (series) => Array.isArray(series) ? series : [];

    // 格式化货币
    const formatCurrency = (value) => {
      return new Intl.NumberFormat('zh-CN', {
        style: 'currency',
        currency: 'CNY',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    };

    // 获取资产类别数据
    const fetchCategoryData = async () => {
      isLoading.value = true;
      hasError.value = false;
      errorMessage.value = '';

      try {
        console.log('正在获取账户信息...');
        const accountData = await fetchAccountInfo();

        if (accountData && accountData.accounts && accountData.accounts.length > 0) {
          const account = accountData.accounts[0];
          const totalAsset = account.total_asset || 0;

          // 从持仓数据生成资产类别数据
          const positions = account.positions || [];
          categoryData.value = positions.map(position => {
            const marketValue = position.market_value || 0;
            const assetRatio = totalAsset > 0 ? ((marketValue / totalAsset) * 100).toFixed(1) + '%' : '0%';

            return {
              stock_code: position.stock_code || '',
              asset_ratio: assetRatio,
              market_value: marketValue,
              daily_return: '0.0%' // 这里需要后端提供日收益率数据
            };
          });

          console.log('资产类别数据:', categoryData.value);
        } else {
          throw new Error('账户数据格式不正确');
        }
      } catch (error) {
        console.error('获取资产类别数据失败:', error);
        hasError.value = true;
        errorMessage.value = `获取数据失败: ${error.message}`;
        categoryData.value = [];
      } finally {
        isLoading.value = false;
      }
    };

    // 获取时间段数据
    const fetchTimeData = async () => {
      isTimeLoading.value = true;
      hasTimeError.value = false;
      timeErrorMessage.value = '';

      try {
        console.log('正在获取时间段对比数据...');
        // 使用传入的账户ID
        const accountId = props.accountId;
        const yearlyData = await fetchYearlyComparisonData(accountId);
        const weeklyData = await fetchWeeklyComparisonData(accountId);

        // 优先使用年度数据，如果没有则使用周数据
        const sourceData = yearlyData?.yearly_data || weeklyData?.weekly_data || [];

        if (sourceData.length > 0) {
          timeData.value = sourceData.map(item => ({
            timePeriod: item.timePeriod || '',
            totalAssets: item.totalAssets || 0,
            returnRate: item.returnRate || 0,  // 保持数值类型，不添加%
            growthRate: item.growthRate || 0   // 保持数值类型，不添加%
          }));

          console.log('处理后的时间段数据:', timeData.value);
        } else {
          // 如果没有时间段数据，显示空数据而不是模拟数据
          console.log('没有时间段数据，显示空数据');
          timeData.value = [];
        }

        console.log('时间段数据:', timeData.value);
      } catch (error) {
        console.error('获取时间段数据失败:', error);
        hasTimeError.value = true;
        timeErrorMessage.value = `获取数据失败: ${error.message}`;
        timeData.value = [];
      } finally {
        isTimeLoading.value = false;
      }
    };

    // 获取地区数据
    const fetchRegionData = async () => {
      isRegionLoading.value = true;
      hasRegionError.value = false;
      regionErrorMessage.value = '';

      try {
        console.log('正在获取地区对比数据...');
        // 使用传入的账户ID
        const accountId = props.accountId;
        const regionResponse = await fetchRegionComparisonData(accountId);

        if (regionResponse && regionResponse.region_data) {
          regionData.value = regionResponse.region_data.map(item => ({
            region: item.region || '',
            totalAssets: item.totalAssets || 0,
            returnRate: item.returnRate || '0%',
            investmentRate: item.investmentRate || '0%'
          }));
        } else {
          // 如果没有地区数据，从账户数据生成
          console.log('没有地区数据，从账户数据生成...');
          const accountData = await fetchAccountInfo();
          if (accountData && accountData.accounts && accountData.accounts.length > 0) {
            const account = accountData.accounts[0];
            const totalAsset = account.total_asset || 0;

            // 根据股票代码前缀判断地区
            const positions = account.positions || [];
            const regionMap = {
              '600': '上海',
              '000': '深圳',
              '002': '深圳',
              '300': '深圳',
              '688': '上海'
            };

            const regionStats = {};
            positions.forEach(position => {
              const stockCode = position.stock_code || '';
              let region = '其他';

              for (const [prefix, regionName] of Object.entries(regionMap)) {
                if (stockCode.startsWith(prefix)) {
                  region = regionName;
                  break;
                }
              }

              if (!regionStats[region]) {
                regionStats[region] = {
                  totalAssets: 0,
                  count: 0
                };
              }

              regionStats[region].totalAssets += position.market_value || 0;
              regionStats[region].count += 1;
            });

            regionData.value = Object.entries(regionStats).map(([region, stats]) => ({
              region,
              totalAssets: stats.totalAssets,
              returnRate: 0.0, // 保持数值类型，等待后端提供真实收益率数据
              investmentRate: totalAsset > 0 ? Number(((stats.totalAssets / totalAsset) * 100).toFixed(1)) : 0
            }));
          } else {
            regionData.value = [];
          }
        }

        console.log('地区数据:', regionData.value);
      } catch (error) {
        console.error('获取地区数据失败:', error);
        hasRegionError.value = true;
        regionErrorMessage.value = `获取数据失败: ${error.message}`;
        regionData.value = [];
      } finally {
        isRegionLoading.value = false;
      }
    };

    // 监听账户ID变化
    watch(() => props.accountId, async (newAccountId, oldAccountId) => {
      if (newAccountId !== oldAccountId) {
        console.log('账户ID变化，重新获取数据:', newAccountId);
        await Promise.all([
          fetchCategoryData(),
          fetchTimeData(),
          fetchRegionData()
        ]);
      }
    });

    // 在组件挂载时获取数据
    onMounted(async () => {
      console.log('组件已挂载，开始获取数据...');
      await Promise.all([
        fetchCategoryData(),
        fetchTimeData(),
        fetchRegionData()
      ]);
    });

    // 初始化资产类别图表
    const initCategoryChart = () => {
      if (!categoryChart.value) {
        console.error('图表容器不存在');
        return;
      }

      console.log('开始初始化资产类别图表，数据:', categoryData.value);

      // 检查数据是否为空
      if (!Array.isArray(categoryData.value) || categoryData.value.length === 0) {
        console.warn('资产类别数据为空，显示空图表');
        const chart = echarts.init(categoryChart.value);
        chart.setOption({
          title: {
            text: '资产类别对比分析 (无数据)',
            left: 'center',
            textStyle: { color: '#ffffff' }
          },
          xAxis: { type: 'category', data: [] },
          yAxis: [],
          series: []
        });
        return;
      }

      const chart = echarts.init(categoryChart.value);
      const option = {
        title: {
          text: `资产类别对比分析 (真实数据 - 账户: ${props.accountId})`,
          left: 'center',
          textStyle: {
            color: '#ffffff'
          }
        },
        subtitle: {
          text: `数据更新时间: ${new Date().toLocaleString('zh-CN')}`,
          left: 'center',
          top: '5%',
          textStyle: {
            color: '#40e0ff',
            fontSize: 12
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          backgroundColor: 'rgba(26, 31, 58, 0.95)',
          borderColor: 'rgba(64, 224, 255, 0.3)',
          textStyle: {
            color: '#ffffff'
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
          data: Array.isArray(categoryData.value) ? categoryData.value.map(item => item.stock_code) : [],
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
            data: Array.isArray(categoryData.value) ? categoryData.value.map(item => Number(item.asset_ratio) || 0) : [],
            itemStyle: { color: '#5470C6' },
            barWidth: '40%',
            emphasis: {
              focus: 'series'
            }
          },
          {
            name: '股票市值',
            type: 'line',
            yAxisIndex: 1,
            data: Array.isArray(categoryData.value) ? categoryData.value.map(item => Number(item.market_value) || 0) : [],
            itemStyle: { color: '#EE6666' },
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: { width: 2 }
          },
          {
            name: '收益率',
            type: 'line',
            yAxisIndex: 2,
            data: Array.isArray(categoryData.value) ? categoryData.value.map(item => Number(item.daily_return) || 0) : [],
            itemStyle: { color: '#91CC75' },
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: { width: 2 }
          }
        ].filter(series => series.data && series.data.length > 0),
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
      if (!timeChart.value) {
        console.error('时间段图表容器不存在');
        return;
      }

      console.log('开始初始化时间段图表，数据:', timeData.value);
      console.log('收益率数据:', timeData.value?.map(item => ({ time: item.timePeriod, returnRate: item.returnRate, growthRate: item.growthRate })));

      // 检查数据是否为空
      if (!Array.isArray(timeData.value) || timeData.value.length === 0) {
        console.warn('时间段数据为空，显示空图表');
      const chart = echarts.init(timeChart.value);
      chart.setOption({
        title: {
          text: '时间段对比分析',
            left: 'center',
            textStyle: { color: '#ffffff' }
          },
          xAxis: { type: 'category', data: [] },
          yAxis: [],
          series: []
        });
        return;
      }

      const chart = echarts.init(timeChart.value);
      chart.setOption({
        title: {
          text: `时间段对比分析 (真实数据 - 账户: ${props.accountId})`,
          left: 'center',
          textStyle: {
            color: '#ffffff'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'line' },
          backgroundColor: 'rgba(26, 31, 58, 0.95)',
          borderColor: 'rgba(64, 224, 255, 0.3)',
          textStyle: {
            color: '#ffffff'
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
          data: Array.isArray(timeData.value) ? timeData.value.map(item => item.timePeriod) : [],
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
            data: Array.isArray(timeData.value) ? timeData.value.map(item => item.totalAssets || 0) : [],
            itemStyle: { color: '#5470C6' },
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: { width: 2 },
            emphasis: {
              focus: 'series'
            }
          },
          {
            name: '收益率',
            type: 'line',
            yAxisIndex: 1,
            data: Array.isArray(timeData.value) ? timeData.value.map(item => Number(item.returnRate) || 0) : [],
            itemStyle: { color: '#EE6666' },
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: { width: 2 }
          },
          {
            name: '增长率',
            type: 'line',
            yAxisIndex: 1,
            data: Array.isArray(timeData.value) ? timeData.value.map(item => Number(item.growthRate) || 0) : [],
            itemStyle: { color: '#FFB657' },
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: { width: 2 }
          },
        ].filter(series => series.data && series.data.length > 0),
      });

      // 调整图表宽度自适应
      window.addEventListener('resize', () => {
        chart.resize();
      });
    };

    // 初始化地区图表
    const initRegionChart = () => {
      if (!regionChart.value) {
        console.error('地区图表容器不存在');
        return;
      }

      console.log('开始初始化地区图表，数据:', regionData.value);
      console.log('收益率数据:', regionData.value?.map(item => ({ region: item.region, returnRate: item.returnRate, investmentRate: item.investmentRate })));

      // 检查数据是否为空
      if (!Array.isArray(regionData.value) || regionData.value.length === 0) {
        console.warn('地区数据为空，显示空图表');
        const chart = echarts.init(regionChart.value);
        chart.setOption({
                  title: {
          text: `分市场对比分析 (真实数据 - 账户: ${props.accountId})`,
          left: 'center',
          textStyle: { color: '#ffffff' }
        },
          xAxis: { type: 'category', data: [] },
          yAxis: [],
          series: []
        });
        return;
      }

      const chart = echarts.init(regionChart.value);
      chart.setOption({
        title: {
          text: '地区对比分析',
          left: 'center',
          textStyle: {
            color: '#ffffff'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'line' },
          backgroundColor: 'rgba(26, 31, 58, 0.95)',
          borderColor: 'rgba(64, 224, 255, 0.3)',
          textStyle: {
            color: '#ffffff'
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
          data: Array.isArray(regionData.value) ? regionData.value.map(item => item.region) : [],
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
            data: Array.isArray(regionData.value) ? regionData.value.map(item => item.totalAssets || 0) : [],
            itemStyle: { color: '#5470C6' },
            barWidth: '40%',
            emphasis: {
              focus: 'series'
            }
          },
          {
            name: '收益率',
            type: 'line',
            yAxisIndex: 1,
            data: Array.isArray(regionData.value) ? regionData.value.map(item => Number(item.returnRate) || 0) : [],
            itemStyle: { color: '#EE6666' },
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: { width: 2 }
          },
          {
            name: '投资率',
            type: 'line',
            yAxisIndex: 1,
            data: Array.isArray(regionData.value) ? regionData.value.map(item => Number(item.investmentRate) || 0) : [],
            itemStyle: { color: '#FFB657' },
            symbol: 'circle',
            symbolSize: 6,
            lineStyle: { width: 2 }
          },
        ].filter(series => series.data && series.data.length > 0),
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
      isTimeLoading,
      hasTimeError,
      timeErrorMessage,
      isRegionLoading,
      hasRegionError,
      regionErrorMessage,
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

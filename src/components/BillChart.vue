<template>
  <div class="chart" ref="chartRef"></div>
</template>

<script setup>
  import { ref, onMounted, watch } from 'vue';
  import * as echarts from 'echarts';
  import { BillService } from '@/api/bill_api';

  const props = defineProps({
    startDay: {
      type: String,
      required: true
    },
    endDay: {
      type: String,
      required: true
    }
  });
  const  emit  = defineEmits(["intoCategory"]);

  const chartRef = ref(null);
  let chart = null;
  const billCategoryPId = ref("0");

  // 获取图表数据
  const getChartData = async () => {
    // 调用接口获取统计数据（这里使用mock数据）
    const response = await BillService.chartStatsData({
          startDay:props.startDay
          ,endDay:props.endDay
          ,billCategoryPId:billCategoryPId});
    return response.data || [];
  };

  // 初始化图表
  const initChart = async () => {
    if (!chartRef.value) return;

    // 获取数据
    const pieData = await getChartData();
    const totalAmount = pieData.reduce((sum, item) => sum + item.value, 0);

    // 创建图表
    chart = echarts.init(chartRef.value);

    // 设置图表选项
    chart.setOption({
      tooltip: { trigger: 'item' },
      legend: { show: false },
      graphic: { // 添加自定义文本
        elements: [{
          type: 'text',
          left: 'center',
          top: 'center',
          style: {
            text: totalAmount > 0?`+${totalAmount.toFixed(2)}`:`-${totalAmount.toFixed(2)}`,
            textAlign: 'center',
            fontSize: 16,
            fontFamily: '"Luckiest Guy", cursive',
            fill: totalAmount > 0 ? '#EE2222' : '#22AA22'
          }
        }]
      },
      series: [{
        name: '占比',
        type: 'pie',
        radius: ['40%', '70%'], // 内外半径，留出中心空间
        avoidLabelOverlap: true,
        label: { show: true },
        emphasis: {
          label: { show: true, fontSize: '18', fontWeight: 'bold' },
          labelLine: { show: true }
        },
        data: pieData
      }]
    });

    chart.on('click', (params) => {
      // 重新初始化图标
      billCategoryPId.value = params.data.categoryId;
      disposeChart();
      initChart();
      // 通知父组件
      emit('intoCategory',billCategoryPId.value);
    });

    // 自适应窗口大小
    window.addEventListener('resize', () => {
      chart.resize();
    });
  };

  // 清除图表
  const disposeChart = () => {
    if (chart) {
      chart.dispose();
      chart = null;
    }
  };

  // 监听属性变化并重新加载数据
  watch(() => [props.startDay, props.endDay], async () => {
    disposeChart();
    await initChart();
  }, { deep: true });

  // 组件挂载时初始化图表
  onMounted(() => {
    initChart();
  });
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap');
.chart {
  height: 200px;
  width: 100%;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

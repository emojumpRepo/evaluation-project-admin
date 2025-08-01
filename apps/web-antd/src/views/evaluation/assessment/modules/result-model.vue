<script lang="ts" setup>
import type { EchartsUIType } from '@vben/plugins/echarts';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { EchartsUI, useEcharts } from '@vben/plugins/echarts';

import { getAssessmentResult } from '#/api/evaluation/assessment/index';

// 评估结果数据类型定义
interface AssessmentResult {
  developmentQuotient: {
    actualAge: number;
    description: string;
    level: string;
    mentalAge: number;
    value: number;
  };
  questionnaireScores: Array<{
    level: string;
    questionnaireId: number;
    questionnaireName: string;
    score: number;
  }>;
  advice: {
    content: string[];
    description: string;
  };
}

const chartRef = ref<EchartsUIType>();
const { renderEcharts, getChartInstance } = useEcharts(chartRef);
const resultData = ref<AssessmentResult | null>(null);

// 发育商等级颜色映射
const levelColorMap = {
  优秀: '#52c41a',
  良好: '#1890ff',
  一般: '#faad14',
  需改善: '#ff4d4f',
  低下: '#d9d9d9',
};

// 计算发育商等级对应的颜色
const quotientLevelColor = computed(() => {
  if (!resultData.value) return '#1890ff';
  return (
    levelColorMap[
      resultData.value.developmentQuotient.level as keyof typeof levelColorMap
    ] || '#1890ff'
  );
});

// 渲染问卷分数柱状图
const renderQuestionnaireChart = () => {
  if (!resultData.value?.questionnaireScores) return;

  const scores = resultData.value.questionnaireScores;
  const names = scores.map((item) =>
    item.questionnaireName.replace('儿童', '').replace('测评量表', ''),
  );
  const values = scores.map((item) => item.score);

  renderEcharts({
    title: {
      text: '各项测评分数',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: (params: any) => {
        const item = params[0];
        const originalName = scores[item.dataIndex]?.questionnaireName || '';
        return `${originalName}<br/>分数: ${item.value}`;
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: names,
      axisLabel: {
        interval: 0,
        rotate: 45,
        fontSize: 12,
      },
    },
    yAxis: {
      type: 'value',
      name: '分数',
      nameTextStyle: {
        fontSize: 12,
      },
    },
    series: [
      {
        type: 'bar',
        data: values,
        itemStyle: {
          color: '#1890ff',
          borderRadius: [4, 4, 0, 0],
        },
        barWidth: '60%',
        label: {
          show: true,
          position: 'top',
          fontSize: 12,
          fontWeight: 'bold',
        },
      },
    ],
  });
};

const [ResultModel, resultModelApi] = useVbenModal({
  title: '评估结果详情',
  onCancel() {
    resultModelApi.close();
    // 销毁图表实例
    getChartInstance()?.dispose();
  },
  async onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const data = resultModelApi.getData();
      const res = await getAssessmentResult({
        id: data.id,
      });
      resultData.value = JSON.parse(res.overallReport);
      renderQuestionnaireChart();
    }
  },
});
</script>

<template>
  <ResultModel>
    <div v-if="resultData" class="flex flex-col gap-5 p-4">
      <!-- 发育商信息卡片 -->
      <div class="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <h3
          class="m-0 border-b border-gray-200 bg-gray-50 px-5 py-4 text-base font-semibold text-gray-800"
        >
          发育商评估
        </h3>
        <div
          class="flex flex-col gap-5 p-6 text-center md:flex-row md:items-center md:gap-8 md:text-left"
        >
          <div class="flex-shrink-0">
            <div
              class="w-25 h-25 md:w-30 md:h-30 flex flex-col items-center justify-center rounded-full border-4 bg-gray-50"
              :style="{ borderColor: quotientLevelColor }"
            >
              <span
                class="text-xl font-bold leading-none text-gray-800 md:text-2xl"
              >
                {{ resultData.developmentQuotient.value }}
              </span>
              <span class="mt-1 text-sm text-gray-400">DQ</span>
            </div>
          </div>
          <div class="flex flex-1 flex-col gap-3">
            <div class="flex items-start">
              <span class="min-w-20 flex-shrink-0 font-medium text-gray-600">
                等级：
              </span>
              <span
                class="flex-1 text-base font-semibold text-gray-800"
                :style="{ color: quotientLevelColor }"
              >
                {{ resultData.developmentQuotient.level }}
              </span>
            </div>
            <div class="flex items-start">
              <span class="min-w-20 flex-shrink-0 font-medium text-gray-600">
                心理年龄：
              </span>
              <span class="flex-1 text-gray-800">
                {{ resultData.developmentQuotient.mentalAge }} 个月
              </span>
            </div>
            <div class="flex items-start">
              <span class="min-w-20 flex-shrink-0 font-medium text-gray-600">
                实际年龄：
              </span>
              <span class="flex-1 text-gray-800">
                {{ resultData.developmentQuotient.actualAge }} 个月
              </span>
            </div>
            <div class="flex items-start">
              <span class="min-w-20 flex-shrink-0 font-medium text-gray-600">
                说明：
              </span>
              <span class="flex-1 text-gray-800">{{
                resultData.developmentQuotient.description
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 问卷分数图表 -->
      <div
        class="overflow-hidden rounded-lg border border-gray-200 bg-white p-0"
      >
        <EchartsUI ref="chartRef" height="400px" />
      </div>

      <!-- 建议信息卡片 -->
      <div class="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <h3
          class="m-0 border-b border-gray-200 bg-gray-50 px-5 py-4 text-base font-semibold text-gray-800"
        >
          专业建议
        </h3>
        <div class="p-5">
          <p class="mb-4 text-sm italic text-gray-600">
            {{ resultData.advice.description }}
          </p>
          <ul class="m-0 list-none p-0">
            <li
              v-for="(item, index) in resultData.advice.content"
              :key="index"
              class="relative border-b border-gray-100 py-2 pl-5 leading-normal text-gray-800 before:absolute before:left-0 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-blue-500 before:content-[''] last:border-b-0 hover:bg-gray-50"
            >
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </ResultModel>
</template>

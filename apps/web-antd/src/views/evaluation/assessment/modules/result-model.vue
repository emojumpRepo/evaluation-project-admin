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
const resultData = ref<AssessmentResult | null>(null);

// 发育商等级颜色映射（增强版）
const levelColorMap = {
  优秀: { color: '#52c41a', bg: '#f6ffed', border: '#b7eb8f', icon: '🌟' },
  良好: { color: '#1890ff', bg: '#f0f9ff', border: '#91d5ff', icon: '👍' },
  一般: { color: '#faad14', bg: '#fffbe6', border: '#ffd666', icon: '😐' },
  需改善: { color: '#ff4d4f', bg: '#fff2f0', border: '#ffa39e', icon: '⚠️' },
  低下: { color: '#8c8c8c', bg: '#fafafa', border: '#d9d9d9', icon: '😟' },
};

// 计算发育商等级对应的样式
const quotientLevelStyle = computed(() => {
  if (!resultData.value) return levelColorMap.良好;
  return (
    levelColorMap[
      resultData.value.developmentQuotient.level as keyof typeof levelColorMap
    ] || levelColorMap.良好
  );
});

// 获取等级描述
const getLevelDescription = (level: string) => {
  const descriptions = {
    优秀: '发育水平超出同龄儿童，各项能力表现突出',
    良好: '发育水平符合同龄儿童标准，各项能力发展正常',
    一般: '发育水平基本符合同龄儿童，部分能力需要关注',
    需改善: '发育水平略低于同龄儿童，建议加强相关训练',
    低下: '发育水平明显低于同龄儿童，需要专业干预指导',
  };
  return descriptions[level as keyof typeof descriptions] || '';
};

// 渲染问卷分数柱状图
const renderQuestionnaireChart = () => {
  if (!resultData.value?.questionnaireScores) return;

  const scores = resultData.value.questionnaireScores;
  const names = scores.map((item) =>
    item.questionnaireName.replace('儿童', '').replace('测评量表', ''),
  );
  const values = scores.map((item) => item.score);

  // 为不同的测评量表设置不同颜色
  const colorPalette = [
    '#1890ff', // 蓝色
    '#52c41a', // 绿色
    '#faad14', // 橙色
    '#f5222d', // 红色
    '#722ed1', // 紫色
  ];
  const colors = scores.map(
    (_, index) => colorPalette[index % colorPalette.length],
  );

  const { renderEcharts } = useEcharts(chartRef);

  renderEcharts({
    title: {
      text: '各项测评分数分布',
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#262626',
      },
      subtextStyle: {
        fontSize: 12,
        color: '#8c8c8c',
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'transparent',
      textStyle: {
        color: '#fff',
        fontSize: 13,
      },
      formatter: (params: any) => {
        const item = params[0];
        const originalName = scores[item.dataIndex]?.questionnaireName || '';
        const level = scores[item.dataIndex]?.level || '';

        return `
          <div style="padding: 8px;">
            <div style="font-weight: bold; margin-bottom: 4px;">${originalName}</div>
            <div>分数: <span style="color: #52c41a; font-weight: bold;">${item.value}</span></div>
            <div>等级: <span style="color: #faad14; font-weight: bold;">${level}</span></div>
          </div>
        `;
      },
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '20%',
      top: '20%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: names,
      axisLabel: {
        interval: 0,
        rotate: 45,
        fontSize: 11,
        color: '#595959',
        margin: 15,
      },
      axisLine: {
        lineStyle: {
          color: '#e8e8e8',
        },
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      name: '分数',
      nameTextStyle: {
        fontSize: 12,
        color: '#8c8c8c',
        padding: [0, 0, 0, 20],
      },
      axisLabel: {
        fontSize: 11,
        color: '#8c8c8c',
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0',
          type: 'dashed',
        },
      },
    },
    series: [
      {
        type: 'bar',
        data: values.map((value, index) => ({
          value,
          itemStyle: {
            color: colors[index],
            borderRadius: [6, 6, 0, 0],
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowBlur: 4,
            shadowOffsetY: 2,
          },
        })),
        barWidth: '50%',
        label: {
          show: true,
          position: 'top',
          fontSize: 12,
          fontWeight: 'bold',
          color: '#262626',
          distance: 8,
        },
        emphasis: {
          itemStyle: {
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowBlur: 8,
            shadowOffsetY: 4,
          },
        },
      },
    ],
  });
};

const [ResultModel, resultModelApi] = useVbenModal({
  title: '📊 评估结果详情',
  onCancel() {
    resultModelApi.close();
    chartRef.value?.dispose();
  },
  async onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const data = resultModelApi.getData();
      const res = await getAssessmentResult({
        id: data.id,
      });
      resultData.value = JSON.parse(res.overallReport);
      // 延迟渲染图表，确保DOM已挂载
      setTimeout(() => {
        renderQuestionnaireChart();
      }, 100);
    }
  },
});
</script>

<template>
  <ResultModel class="w-3/4 p-4">
    <div v-if="resultData" class="overflow-y-auto bg-gray-50/30 p-6">
      <!-- 整体评估概览 -->
      <div class="mb-8 rounded-2xl bg-blue-50 p-6 shadow-sm">
        <div class="mb-4 flex items-center gap-3">
          <div class="rounded-lg bg-blue-100 p-2">
            <span class="text-xl">📋</span>
          </div>
          <h2 class="text-xl font-bold text-gray-800">评估结果概览</h2>
        </div>
        <div class="grid gap-4 md:grid-cols-3">
          <div class="rounded-lg bg-white/80 p-4 text-center backdrop-blur-sm">
            <div class="text-sm text-gray-500">发育商</div>
            <div
              class="text-2xl font-bold"
              :style="{ color: quotientLevelStyle.color }"
            >
              {{ resultData.developmentQuotient.value }}
            </div>
            <div class="text-xs text-gray-400">DQ</div>
          </div>
          <div class="rounded-lg bg-white/80 p-4 text-center backdrop-blur-sm">
            <div class="text-sm text-gray-500">心理年龄</div>
            <div class="text-2xl font-bold text-gray-700">
              {{ resultData.developmentQuotient.mentalAge }}
            </div>
            <div class="text-xs text-gray-400">个月</div>
          </div>
          <div class="rounded-lg bg-white/80 p-4 text-center backdrop-blur-sm">
            <div class="text-sm text-gray-500">实际年龄</div>
            <div class="text-2xl font-bold text-gray-700">
              {{ resultData.developmentQuotient.actualAge }}
            </div>
            <div class="text-xs text-gray-400">个月</div>
          </div>
        </div>
      </div>

      <!-- 发育商详细信息卡片 -->
      <div class="mb-8 overflow-hidden rounded-2xl bg-white shadow-lg">
        <div class="border-b border-gray-100 p-6">
          <div class="flex items-center gap-3">
            <div class="rounded-lg bg-blue-100 p-2">
              <span class="text-xl">🧠</span>
            </div>
            <h3 class="text-lg font-bold text-gray-800">发育商评估详情</h3>
          </div>
        </div>

        <div class="p-6">
          <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-8">
            <!-- 发育商圆形指示器 -->
            <div class="flex-shrink-0 text-center">
              <div
                class="relative mx-auto mb-3 flex h-32 w-32 items-center justify-center rounded-full border-4 shadow-lg lg:h-36 lg:w-36"
                :style="{
                  borderColor: quotientLevelStyle.color,
                  backgroundColor: quotientLevelStyle.bg,
                }"
              >
                <div class="text-center">
                  <div class="text-3xl font-bold text-gray-800 lg:text-4xl">
                    {{ resultData.developmentQuotient.value }}
                  </div>
                  <div class="text-sm font-medium text-gray-500">DQ</div>
                </div>
              </div>
              <div
                class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-sm"
                :style="{
                  backgroundColor: quotientLevelStyle.bg,
                  color: quotientLevelStyle.color,
                  border: `1px solid ${quotientLevelStyle.border}`,
                }"
              >
                <span>{{ quotientLevelStyle.icon }}</span>
                {{ resultData.developmentQuotient.level }}
              </div>
            </div>

            <!-- 详细信息 -->
            <div class="flex-1 space-y-4">
              <div class="grid gap-4 sm:grid-cols-2">
                <div class="rounded-lg bg-gray-50 p-4">
                  <div
                    class="flex items-center gap-2 text-sm font-medium text-gray-600"
                  >
                    <span>👶</span>
                    心理年龄
                  </div>
                  <div class="mt-1 text-lg font-semibold text-gray-800">
                    {{ resultData.developmentQuotient.mentalAge }} 个月
                  </div>
                </div>
                <div class="rounded-lg bg-gray-50 p-4">
                  <div
                    class="flex items-center gap-2 text-sm font-medium text-gray-600"
                  >
                    <span>📅</span>
                    实际年龄
                  </div>
                  <div class="mt-1 text-lg font-semibold text-gray-800">
                    {{ resultData.developmentQuotient.actualAge }} 个月
                  </div>
                </div>
              </div>

              <!-- 等级说明 -->
              <div
                class="rounded-lg border-l-4 bg-blue-50 p-4"
                :style="{ borderColor: quotientLevelStyle.color }"
              >
                <div class="text-sm font-medium text-gray-700">
                  发育水平说明
                </div>
                <div class="mt-1 text-sm text-gray-600">
                  {{
                    getLevelDescription(resultData.developmentQuotient.level)
                  }}
                </div>
              </div>

              <!-- 原始说明 -->
              <div class="rounded-lg bg-gray-50 p-4">
                <div class="text-sm font-medium text-gray-700">详细说明</div>
                <div class="mt-1 text-sm text-gray-600">
                  {{ resultData.developmentQuotient.description }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 问卷分数图表 -->
      <div class="mb-8 overflow-hidden rounded-2xl bg-white shadow-lg">
        <div class="border-b border-gray-100 p-6">
          <div class="flex items-center gap-3">
            <div class="rounded-lg bg-green-100 p-2">
              <span class="text-xl">📊</span>
            </div>
            <h3 class="text-lg font-bold text-gray-800">各项能力测评分析</h3>
          </div>
        </div>
        <div class="p-6">
          <EchartsUI ref="chartRef" height="450px" />
        </div>
      </div>

      <!-- 专业建议卡片 -->
      <div class="overflow-hidden rounded-2xl bg-white shadow-lg">
        <div class="border-b border-gray-100 p-6">
          <div class="flex items-center gap-3">
            <div class="rounded-lg bg-purple-100 p-2">
              <span class="text-xl">💡</span>
            </div>
            <h3 class="text-lg font-bold text-gray-800">专业建议与指导</h3>
          </div>
        </div>
        <div class="p-6">
          <!-- 建议总述 -->
          <div class="mb-6 rounded-lg bg-purple-50 p-4">
            <div class="flex items-start gap-3">
              <div class="rounded-full bg-purple-100 p-2">
                <span class="text-sm">🎯</span>
              </div>
              <div>
                <div class="font-medium text-purple-800">评估总结</div>
                <div class="mt-1 text-sm text-purple-700">
                  {{ resultData.advice.description }}
                </div>
              </div>
            </div>
          </div>

          <!-- 具体建议列表 -->
          <div class="space-y-3">
            <div class="mb-3 font-medium text-gray-700">具体建议措施：</div>
            <div
              v-for="(item, index) in resultData.advice.content"
              :key="index"
              class="group relative rounded-lg border border-gray-100 bg-gray-50/50 p-4 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-md"
            >
              <div class="flex items-start gap-3">
                <div
                  class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600 group-hover:bg-blue-200"
                >
                  {{ index + 1 }}
                </div>
                <div class="flex-1 text-sm leading-relaxed text-gray-700">
                  {{ item }}
                </div>
              </div>
            </div>
          </div>

          <!-- 温馨提示 -->
          <div class="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div class="flex items-start gap-3">
              <span class="text-amber-500">⚠️</span>
              <div class="text-sm text-amber-700">
                <div class="font-medium">温馨提示</div>
                <div class="mt-1">
                  以上建议仅供参考，如需更详细的指导方案，建议咨询专业的儿童发育专家或心理医生。
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ResultModel>
</template>

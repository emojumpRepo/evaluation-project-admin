<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Progress } from 'ant-design-vue';

import { getLevelClass } from '#/api/evaluation/constants';
import { getQuestionnaireResult } from '#/api/evaluation/questionnaire';

// 模拟数据
const questionnaireData = ref();

const [Model, ModelApi] = useVbenModal({
  onCancel() {
    ModelApi.close();
  },
  async onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const data = await ModelApi.getData<Record<string, any>>();
      const res = await getQuestionnaireResult(data.id);
      questionnaireData.value = res?.resultData
        ? JSON.parse(res.resultData)
        : {};
    }
  },
});

// 计算进度百分比
const getProgressPercent = (value: number, range: number[]) => {
  if (!range || range.length < 2) return 0;
  const [min, max] = range;
  if (min === undefined || max === undefined) return 0;
  return Math.min(((value - min) / (max - min)) * 100, 100);
};
</script>

<template>
  <Model>
    <div
      v-if="questionnaireData?.summary && questionnaireData?.details"
      class="mx-auto max-w-5xl p-6"
    >
      <!-- 标题区域 -->
      <div class="mb-10 text-center">
        <h2 class="mb-1 text-2xl font-bold text-gray-900">心理测评结果报告</h2>
        <div
          class="mx-auto mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
        ></div>
      </div>

      <!-- 总体评估卡片 -->
      <div
        class="mb-10 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-lg"
      >
        <div
          class="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 px-8 py-6"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center justify-center space-x-3">
              <div class="rounded-full bg-blue-500 p-2">
                <svg
                  t="1753782151163"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="3230"
                  width="18"
                  height="18"
                >
                  <path
                    d="M511.8 63.3c-246.7 0-448.5 201.8-448.5 448.5s201.8 448.5 448.5 448.5 448.5-201.8 448.5-448.5S758.5 63.3 511.8 63.3z m253.1 307.1L446.2 724 262.9 536.3c-17.5-17.5-17.5-43.7 0-61.1s43.7-17.5 61.1 0l122.2 122.2 253.2-283.7c17.5-17.5 43.7-17.5 61.1-4.4 17.5 17.5 17.5 43.7 4.4 61.1z"
                    fill="#ffffff"
                    p-id="3231"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900">总体评估</h3>
            </div>
            <span
              class="rounded-full px-4 py-2 text-sm font-bold shadow-sm"
              :class="
                getLevelClass(questionnaireData.summary.level, ['color', 'bg'])
              "
            >
              {{ questionnaireData.summary.level }}
            </span>
          </div>
        </div>

        <div class="p-8">
          <div class="grid gap-8 lg:grid-cols-2">
            <!-- 得分展示 -->
            <div class="space-y-4">
              <div class="flex items-end justify-between">
                <div>
                  <p
                    class="text-sm font-medium uppercase tracking-wide text-gray-500"
                  >
                    {{ questionnaireData.summary.label }}
                  </p>
                  <p class="mt-1 text-4xl font-bold text-gray-900">
                    {{ questionnaireData.summary.value }}
                    <span class="text-lg font-normal text-gray-500">分</span>
                  </p>
                </div>
              </div>

              <div class="space-y-2">
                <Progress
                  :percent="
                    getProgressPercent(
                      questionnaireData.summary.value,
                      questionnaireData.summary.range,
                    )
                  "
                  :stroke-color="
                    getLevelClass(
                      questionnaireData.summary.level,
                      'progressColor',
                    )
                  "
                  :show-info="false"
                  :stroke-width="8"
                />
                <div class="flex justify-between text-xs text-gray-500">
                  <span>{{ questionnaireData.summary.range[0] }}</span>
                  <span>评分范围</span>
                  <span>{{ questionnaireData.summary.range[1] }}</span>
                </div>
              </div>
            </div>

            <!-- 评估解读 -->
            <div class="rounded-xl bg-gray-50 p-6">
              <div class="mb-3 flex items-center space-x-2">
                <svg
                  class="h-5 w-5 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  />
                </svg>
                <h4 class="font-semibold text-gray-900">评估解读</h4>
              </div>
              <p class="leading-relaxed text-gray-700">
                {{ questionnaireData.summary.interpretation }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 详细评估结果 -->
      <div class="mb-10">
        <div class="mb-8 flex items-center space-x-4">
          <div class="flex items-center space-x-3">
            <div
              class="h-8 w-1 rounded-full bg-gradient-to-b from-blue-500 to-indigo-500"
            ></div>
            <h3 class="text-xl font-bold text-gray-900">详细评估结果</h3>
          </div>
          <div class="flex-1 border-t border-gray-200"></div>
        </div>

        <div class="grid gap-6">
          <div
            v-for="(detail, index) in questionnaireData.details"
            :key="index"
            class="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-xl"
          >
            <!-- 卡片头部 -->
            <div class="mb-6 flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div
                  class="rounded-lg bg-blue-50 p-2 transition-colors group-hover:bg-blue-100"
                >
                  <svg
                    class="h-5 w-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-gray-900">
                  {{ detail.label }}
                </h4>
              </div>
              <span
                class="rounded-full px-3 py-1 text-sm font-bold shadow-sm"
                :class="getLevelClass(detail.level, ['color', 'bg'])"
              >
                {{ detail.level }}
              </span>
            </div>

            <!-- 得分展示 -->
            <div
              class="mb-6 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 p-4"
            >
              <div class="mb-3 flex items-end justify-between">
                <span class="text-sm font-medium text-gray-600">得分</span>
                <div class="text-right">
                  <span class="text-2xl font-bold text-gray-900">{{
                    detail.value
                  }}</span>
                  <span class="ml-1 text-sm text-gray-500">分</span>
                </div>
              </div>

              <div class="space-y-2">
                <Progress
                  :percent="getProgressPercent(detail.value, detail.range)"
                  :stroke-color="getLevelClass(detail.level, 'progressColor')"
                  :show-info="false"
                  :stroke-width="6"
                />
                <div class="flex justify-between text-xs text-gray-500">
                  <span>{{ detail.range[0] }}</span>
                  <span>{{ detail.range[1] }}</span>
                </div>
              </div>
            </div>

            <!-- 专业解读 -->
            <div class="rounded-xl border border-gray-100 bg-white p-4">
              <div class="mb-3 flex items-center space-x-2">
                <svg
                  class="h-4 w-4 text-indigo-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  />
                </svg>
                <h5 class="font-medium text-gray-900">专业解读</h5>
              </div>
              <p class="text-sm leading-relaxed text-gray-700">
                {{ detail.interpretation }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 专业建议 -->
      <div
        class="overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-lg"
      >
        <!-- 建议标题区域 -->
        <div
          class="bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 px-8 py-6"
        >
          <div class="flex items-center space-x-4">
            <div
              class="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 p-2 shadow-lg"
            >
              <svg
                class="h-5 w-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900">专业建议</h3>
              <p class="text-sm text-gray-600">
                {{ questionnaireData.summary.advice.description }}
              </p>
            </div>
          </div>
        </div>

        <div class="p-8">
          <!-- 建议内容 -->
          <div
            class="mb-6 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 p-6"
          >
            <div class="space-y-4">
              <div
                v-for="(advice, index) in questionnaireData.summary.advice
                  .content"
                :key="index"
                class="flex items-start space-x-3 rounded-lg bg-white p-4 shadow-sm"
              >
                <div
                  class="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white"
                >
                  {{ index + 1 }}
                </div>
                <p class="leading-relaxed text-gray-700">{{ advice }}</p>
              </div>
            </div>
          </div>

          <!-- 温馨提示 -->
          <div
            class="rounded-xl border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6"
          >
            <div class="mb-3 flex items-center space-x-3">
              <div class="rounded-full bg-blue-500 p-1">
                <svg
                  class="h-3 w-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <span class="font-semibold text-blue-900">温馨提示</span>
            </div>
            <div class="rounded-lg bg-white p-4">
              <p class="leading-relaxed text-blue-800">
                本测评结果仅供参考，如需专业心理咨询或治疗，请及时联系专业心理健康机构。心理健康需要持续关注和专业指导。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Model>
</template>

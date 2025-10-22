<script setup lang="ts">
import type { AssessmentVO } from '#/api/evaluation/assessment/index';
import type { QuestionnaireVO } from '#/api/evaluation/questionnaire/index';

import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { IconifyIcon } from '@vben/icons';

import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  List,
  message,
  Row,
  Space,
  Statistic,
  Tabs,
  Tag,
  Timeline,
} from 'ant-design-vue';

import {
  getAssessment,
  getAssessmentQuestionnaires,
} from '#/api/evaluation/assessment';
import {
  publishAssessment,
  unpublishAssessment,
} from '#/api/evaluation/assessment/index';
import { getTypeLabel } from '#/api/evaluation/constants';

import QuestionnaireResultList from './modules/questionnaire-result-list.vue';
import ResultList from './modules/result-list.vue';

const route = useRoute();

const assessmentId = ref<number>();
const assessment = ref<AssessmentVO>();
const questionnaires = ref<QuestionnaireVO[]>([]);
const loading = ref(false);
const subTabsName = ref('assessmentResult');

// 计算属性
const statusConfig = computed(() => {
  const status = assessment.value?.status;
  switch (status) {
    case 0: {
      return {
        color: 'default',
        text: '草稿',
        icon: 'ant-design:clock-circle-outlined',
      };
    }
    case 1: {
      return {
        color: 'success',
        text: '已发布',
        icon: 'ant-design:check-circle-outlined',
      };
    }
    case 2: {
      return {
        color: 'warning',
        text: '已结束',
        icon: 'ant-design:exclamation-circle-outlined',
      };
    }
    case 3: {
      return {
        color: 'error',
        text: '已取消',
        icon: 'ant-design:close-circle-outlined',
      };
    }
    default: {
      return {
        color: 'default',
        text: '未知',
        icon: 'ant-design:clock-circle-outlined',
      };
    }
  }
});

const formatDate = (timestamp: number | string) => {
  if (!timestamp) return '-';
  const date =
    typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp);
  return date.toLocaleString('zh-CN');
};

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}小时${mins}分钟` : `${mins}分钟`;
};

// 获取用户名的首字母（用于头像显示）
const getUserInitial = (text: null | string | undefined): string => {
  if (!text || typeof text !== 'string') {
    return '';
  }
  const firstChar = text.charAt(0);
  return firstChar.toUpperCase();
};

// 初始化测评信息
async function init(assessmentId: number) {
  loading.value = true;
  try {
    const assessmentData = await getAssessment(assessmentId);
    assessment.value = assessmentData;
    const questionnairesData = await getAssessmentQuestionnaires(assessmentId);
    questionnaires.value = questionnairesData;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

// 发布/取消发布
const handlePublish = async () => {
  try {
    if (assessment.value?.status === 1) {
      await unpublishAssessment(assessmentId.value!);
      message.success('取消发布成功');
    } else {
      await publishAssessment(assessmentId.value!);
      message.success('发布成功');
    }
    // 发布成功后刷新数据
    await init(assessmentId.value!);
  } catch (error) {
    message.error('发布失败');
    console.error('发布失败', error);
  }
};

const handleViewQuestionnaire = (link: string) => {
  if (!link && !link.startsWith('http://') && !link.startsWith('https://')) {
    message.error('链接不存在');
    return;
  }

  try {
    // 在新标签页打开链接
    window.open(link, '_blank', 'noopener,noreferrer');
  } catch (error) {
    message.error('打开链接失败');
    console.error('打开链接失败:', error);
  }
};

onMounted(async () => {
  if (route.query.id) {
    assessmentId.value = Number(route.query.id);
    await init(assessmentId.value);
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 页面头部 -->
    <div class="mb-6 bg-white p-6 shadow-sm">
      <div class="mx-auto flex items-start justify-between px-6">
        <div class="flex-1">
          <h1
            class="m-0 mb-3 flex items-center gap-3 text-2xl font-semibold text-gray-800"
          >
            <Avatar :size="40" class="bg-indigo-500">
              <template #icon>
                {{ getUserInitial(assessment?.title) }}
              </template>
            </Avatar>
            {{ assessment?.title || '测评详情' }}
          </h1>
          <div class="flex flex-wrap items-center gap-4">
            <Tag
              :color="statusConfig.color"
              class="flex items-center gap-1 font-medium"
            >
              <IconifyIcon :icon="statusConfig.icon" />
              {{ statusConfig.text }}
            </Tag>
            <span class="flex items-center gap-1 text-sm text-gray-500">
              <IconifyIcon icon="ant-design:calendar-outlined" />
              创建时间：{{
                assessment?.createTime ? formatDate(assessment.createTime) : '-'
              }}
            </span>
          </div>
        </div>
        <div>
          <Space>
            <Button type="primary" @click="handlePublish">
              {{ assessment?.status === 1 ? '取消发布' : '发布' }}
            </Button>
          </Space>
        </div>
      </div>
    </div>

    <div class="mx-auto px-12" v-if="assessment">
      <!-- 子表的表单 -->
      <Tabs v-model:active-key="subTabsName" class="mt-2">
        <Tabs.TabPane key="assessmentResult" tab="测评结果" force-render>
          <ResultList />
        </Tabs.TabPane>
        <Tabs.TabPane key="questionnaireResult" tab="问卷结果" force-render>
          <QuestionnaireResultList />
        </Tabs.TabPane>
      </Tabs>

      <!-- 统计卡片 -->
      <Row :gutter="24" class="my-6">
        <Col :span="8">
          <Card class="rounded-lg text-center shadow-sm">
            <Statistic
              title="当前参与人数"
              :value="assessment.currentParticipants || 0"
              :value-style="{ color: '#1890ff' }"
            >
              <template #prefix>
                <IconifyIcon icon="ant-design:team-outlined" />
              </template>
            </Statistic>
          </Card>
        </Col>
        <Col :span="8">
          <Card class="rounded-lg text-center shadow-sm">
            <Statistic
              title="最大参与人数"
              :value="assessment.maxParticipants || 0"
              :value-style="{ color: '#52c41a' }"
            >
              <template #prefix>
                <IconifyIcon icon="ant-design:user-outlined" />
              </template>
            </Statistic>
          </Card>
        </Col>
        <Col :span="8">
          <Card class="rounded-lg text-center shadow-sm">
            <Statistic
              title="测评时长"
              :value="assessment.duration || 0"
              suffix="分钟"
              :value-style="{ color: '#faad14' }"
            >
              <template #prefix>
                <IconifyIcon icon="ant-design:clock-circle-outlined" />
              </template>
            </Statistic>
          </Card>
        </Col>
      </Row>

      <!-- 基本信息 -->
      <Card title="基本信息" class="mb-6 rounded-lg shadow-sm">
        <Descriptions :column="2" bordered>
          <Descriptions.Item label="测评ID">
            {{ assessment.id }}
          </Descriptions.Item>
          <Descriptions.Item label="测评标题">
            {{ assessment.title }}
          </Descriptions.Item>
          <Descriptions.Item label="目标受众">
            <Tag color="blue">{{ assessment.targetAudience }}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="测评类型">
            <Tag color="purple">
              {{ getTypeLabel(assessment.type, 'assessment') }}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="创建者">
            <Space>
              {{ assessment.creator }}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="是否需要预约">
            <Tag :color="assessment.needAppointment ? 'success' : 'default'">
              {{ assessment.needAppointment ? '需要预约' : '无需预约' }}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="开始时间">
            <Space>
              <IconifyIcon icon="ant-design:calendar-outlined" />
              {{
                assessment.startTime ? formatDate(assessment.startTime) : '-'
              }}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="结束时间">
            <Space>
              <IconifyIcon icon="ant-design:calendar-outlined" />
              {{ assessment.endTime ? formatDate(assessment.endTime) : '-' }}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="测评时长" :span="2">
            <Tag color="orange">
              {{ formatDuration(assessment.duration || 0) }}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <!-- 关联问卷 -->
      <Card title="关联问卷" class="mb-6 rounded-lg shadow-sm">
        <div
          v-if="questionnaires.length === 0 && !loading"
          class="py-10 text-center"
        >
          <div class="mb-4 text-5xl">📝</div>
          <div class="text-sm text-gray-500">暂无关联问卷</div>
        </div>
        <List v-else :data-source="questionnaires" :loading="loading">
          <template #renderItem="{ item, index }">
            <List.Item>
              <template #actions>
                <Button
                  type="link"
                  @click="handleViewQuestionnaire(item.link)"
                  class="flex items-center"
                >
                  <IconifyIcon icon="ant-design:eye-outlined" />
                  查看问卷
                </Button>
              </template>
              <List.Item.Meta>
                <template #avatar>
                  <Avatar shape="square" :size="48">
                    <template #icon>
                      {{ getUserInitial(item.title) }}
                    </template>
                  </Avatar>
                </template>
                <template #title>
                  <Space>
                    <span class="text-black">{{
                      item.title || `问卷 ${index + 1}`
                    }}</span>
                  </Space>
                </template>
                <template #description>
                  <div class="flex flex-col gap-2">
                    <div>{{ item.description || '暂无描述' }}</div>
                    <Space class="text-xs text-gray-500">
                      <span class="flex items-center gap-1">
                        <IconifyIcon icon="ant-design:calendar-outlined" />
                        有效时间：{{ formatDate(item.validFrom) }} -
                        {{ formatDate(item.validTo) }}
                      </span>
                    </Space>
                  </div>
                </template>
              </List.Item.Meta>
            </List.Item>
          </template>
        </List>
      </Card>

      <!-- 时间线 -->
      <Card title="测评时间线" class="mb-6 rounded-lg shadow-sm">
        <Timeline>
          <Timeline.Item color="blue">
            <div class="pl-2">
              <div class="mb-1 font-semibold text-gray-800">测评创建</div>
              <div class="mb-1 text-xs text-blue-500">
                {{
                  assessment.createTime
                    ? formatDate(assessment.createTime)
                    : '-'
                }}
              </div>
              <div class="text-xs text-gray-500">
                由 {{ assessment.creator }} 创建测评
              </div>
            </div>
          </Timeline.Item>
          <Timeline.Item color="green" v-if="assessment.startTime">
            <div class="pl-2">
              <div class="mb-1 font-semibold text-gray-800">测评开始</div>
              <div class="mb-1 text-xs text-blue-500">
                {{ formatDate(assessment.startTime) }}
              </div>
              <div class="text-xs text-gray-500">测评正式开始，开放参与</div>
            </div>
          </Timeline.Item>
          <Timeline.Item color="red" v-if="assessment.endTime">
            <div class="pl-2">
              <div class="mb-1 font-semibold text-gray-800">测评结束</div>
              <div class="mb-1 text-xs text-blue-500">
                {{ formatDate(assessment.endTime) }}
              </div>
              <div class="text-xs text-gray-500">
                测评结束，停止接受新的参与
              </div>
            </div>
          </Timeline.Item>
        </Timeline>
      </Card>
    </div>

    <!-- 加载状态 -->
    <div v-else class="loading-container">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <div class="loading-text">加载中...</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
  }

  .action-section {
    align-self: stretch;
  }

  .content-container {
    padding: 0 16px;
  }

  .stats-row .ant-col {
    margin-bottom: 16px;
  }
}

.assessment-detail {
  min-height: 100vh;
  background: #f5f5f5;
}

.page-header {
  padding: 24px;
  margin-bottom: 24px;
  background: white;
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
}

.header-content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
}

.title-section {
  flex: 1;
}

.page-title {
  display: flex;
  gap: 12px;
  align-items: center;
  margin: 0 0 12px;
  font-size: 24px;
  font-weight: 600;
  color: #262626;
}

.title-icon {
  background: #667eea;
}

.title-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.status-tag {
  display: flex;
  gap: 4px;
  align-items: center;
  font-weight: 500;
}

.meta-text {
  display: flex;
  gap: 4px;
  align-items: center;
  font-size: 14px;
  color: #8c8c8c;
}

.content-container {
  max-width: 1200px;
  padding: 0 24px;
  margin: 0 auto;
}

.stats-row {
  margin-bottom: 24px;
}

.stat-card {
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
}

.participation-rate {
  padding: 16px 0;
}

.rate-title {
  margin-bottom: 16px;
  font-size: 14px;
  color: #8c8c8c;
}

.info-card,
.description-card,
.questionnaire-card,
.timeline-card {
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
}

.description-content {
  padding: 8px 0;
}

.remark-section {
  padding: 16px;
  margin-top: 16px;
  background: #fafafa;
  border-radius: 6px;
}

.questionnaire-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.meta-info {
  font-size: 12px;
  color: #8c8c8c;
}

.empty-state {
  padding: 40px 0;
  text-align: center;
}

.empty-icon {
  margin-bottom: 16px;
  font-size: 48px;
}

.empty-text {
  font-size: 14px;
  color: #8c8c8c;
}

.timeline-content {
  padding-left: 8px;
}

.timeline-title {
  margin-bottom: 4px;
  font-weight: 600;
  color: #262626;
}

.timeline-time {
  margin-bottom: 4px;
  font-size: 12px;
  color: #1890ff;
}

.timeline-desc {
  font-size: 12px;
  color: #8c8c8c;
}

.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.loading-content {
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 16px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  font-size: 14px;
  color: #8c8c8c;
}
</style>

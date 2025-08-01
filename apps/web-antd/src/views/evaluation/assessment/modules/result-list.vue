<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { AssessmentResultRespVO } from '#/api/evaluation/assessment/index';

import { onMounted } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message, Tag } from 'ant-design-vue';
import dayjs from 'dayjs';

import { TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getAssessmentResultPage } from '#/api/evaluation/assessment/index';

import {
  useAssessmentResultGridColumns,
  useAssessmentResultGridFormSchema,
} from '../data';
import ResultModel from './result-model.vue';

const props = defineProps<{
  id?: number; // 测评编号（主表的关联字段）
}>();

/** 测评结果弹窗 */
const [Model, ModelApi] = useVbenModal({
  header: false,
  footer: false,
  fullscreenButton: false,
  connectedComponent: ResultModel,
});

/** 查看测评结果 */
async function onGet(row: AssessmentResultRespVO) {
  if (!row.overallReport) {
    message.warning('不支持查看结果');
    return;
  }

  ModelApi.setData({
    id: row.id,
  }).open();
}

/** 表格 */
const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useAssessmentResultGridFormSchema(),
  },
  gridOptions: {
    columns: useAssessmentResultGridColumns(),
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          if (props.id) {
            formValues.assessmentId = props.id;
          }
          return await getAssessmentResultPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    pagerConfig: {
      enabled: true,
    },
    toolbarConfig: {
      refresh: { code: 'query' },
      search: true,
      zoom: false,
      custom: false,
    },
    height: '600px',
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
  } as VxeTableGridOptions<AssessmentResultRespVO>,
});

/** 刷新表格 */
const onRefresh = async () => {
  await gridApi.query();
};

onMounted(() => {
  onRefresh();
});
</script>

<template>
  <Grid table-title="测评结果列表">
    <template #overallScore="{ row }">
      <span v-if="row.overallScore" class="font-bold text-green-500">
        {{ row.overallScore }}
      </span>
      <span v-else>---</span>
    </template>

    <template #overallLevel="{ row }">
      <Tag color="blue" v-if="row.overallLevel">
        {{ row.overallLevel }}
      </Tag>
      <span v-else>---</span>
    </template>

    <template #status="{ row }">
      <Tag :color="row.status === 1 ? 'green' : 'red'">
        {{ row.status === 1 ? '已完成' : '未完成' }}
      </Tag>
    </template>

    <template #completedTime="{ row }">
      {{
        row.completedTime
          ? dayjs(row.completedTime).format('YYYY-MM-DD HH:mm:ss')
          : '---'
      }}
    </template>

    <template #actions="{ row }">
      <TableAction
        :actions="[
          {
            label: '查看',
            type: 'link',
            onClick: onGet.bind(null, row),
          },
        ]"
      />
    </template>
  </Grid>

  <!-- 测评结果弹窗 -->
  <Model class="w-[600px]" />
</template>

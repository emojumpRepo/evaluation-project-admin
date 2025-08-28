<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { AssessmentResultRespVO } from '#/api/evaluation/assessment/index';

import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { useVbenModal } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';

import { message, Tag } from 'ant-design-vue';
import dayjs from 'dayjs';

import { TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  exportAssessmentResult,
  getAssessmentResultPage,
} from '#/api/evaluation/assessment/index';

import {
  useAssessmentResultGridColumns,
  useAssessmentResultGridFormSchema,
} from '../data';
import ResultModel from './result-model.vue';

const route = useRoute();

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

/** 导出测评结果 */
async function onExport(row: AssessmentResultRespVO) {
  if (!row?.id) {
    message.warning('无法导出：缺少结果编号');
    return;
  }
  const hide = message.loading({
    content: '正在导出...',
    key: 'export_assessment_result',
  });
  try {
    const blob = await exportAssessmentResult(row.id);
    // 校验返回内容是否为有效 PDF
    if (!blob || blob.size === 0) {
      message.error('导出失败：服务未返回文件');
      return;
    }
    if (
      (blob as any).type &&
      String((blob as any).type).includes('application/json')
    ) {
      try {
        const text = await (blob as Blob).text();
        const json = JSON.parse(text);
        message.error(json?.message || json?.msg || '导出失败：服务返回错误');
      } catch {
        message.error('导出失败：服务返回错误');
      }
      return;
    }
    // 默认文件名：测评结果-标题-宝宝名-时间.pdf
    const fileName = `测评结果-${row.assessmentTitle || row.assessmentId}-${row.babyName || row.babyId}-${dayjs(row.completedTime).format('YYYYMMDDHHmmss')}.pdf`;
    downloadFileFromBlobPart({ fileName, source: blob });
  } finally {
    hide();
  }
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
          if (route.query.id) {
            formValues.assessmentId = route.query.id;
            return await getAssessmentResultPage({
              pageNo: page.currentPage,
              pageSize: page.pageSize,
              ...formValues,
            });
          }
          return {
            data: [],
            total: 0,
          };
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
          {
            label: '导出',
            type: 'link',
            onClick: onExport.bind(null, row),
          },
        ]"
      />
    </template>
  </Grid>

  <!-- 测评结果弹窗 -->
  <Model class="w-[600px]" />
</template>

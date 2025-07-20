<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { AssessmentResultRespVO } from '#/api/evaluation/assessment/index';

import { nextTick, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getAssessmentResultPage } from '#/api/evaluation/assessment/index';

import {
  useAssessmentResultGridColumns,
  useAssessmentResultGridFormSchema,
} from '../data';

const props = defineProps<{
  id?: number; // 测评编号（主表的关联字段）
}>();

/** 测评结果弹窗 */
const [ResultModel, resultModelApi] = useVbenModal({
  header: false,
  footer: false,
  fullscreenButton: false,
});

/** 查看测评结果 */
async function onGet(row: AssessmentResultRespVO) {
  resultModelApi
    .setData({
      assessmentId: row.id,
    })
    .open();
}

/** 表格操作按钮的回调函数 */
function onActionClick({
  code,
  row,
}: OnActionClickParams<AssessmentResultRespVO>) {
  switch (code) {
    case 'get': {
      onGet(row);
      break;
    }
  }
}

/** 表格 */
const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useAssessmentResultGridFormSchema(),
  },
  gridOptions: {
    columns: useAssessmentResultGridColumns(onActionClick),
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

/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.id,
  async (val) => {
    if (!val) {
      return;
    }
    await nextTick();
    await onRefresh();
  },
  { immediate: true },
);
</script>

<template>
  <Grid table-title="测评结果列表" />

  <!-- 测评结果弹窗 -->
  <ResultModel class="w-[600px]">
    <div>测评结果</div>
  </ResultModel>
</template>

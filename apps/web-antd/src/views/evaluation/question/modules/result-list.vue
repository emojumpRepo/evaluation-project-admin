<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { QuestionnaireResultVO } from '#/api/evaluation/questionnaire/index';

import { onMounted } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Tag } from 'ant-design-vue';

import { TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getQuestionnaireResultList } from '#/api/evaluation/questionnaire/index';

import {
  useQuestionnaireResultGridColumns,
  useQuestionnaireResultGridFormSchema,
} from '../data';
import ResultModel from './result-model.vue';

const props = defineProps<{
  id?: number; // 测评编号（主表的关联字段）
}>();

/** 测评结果弹窗 */
const [Modal, modalApi] = useVbenModal({
  header: false,
  footer: false,
  fullscreenButton: false,
  connectedComponent: ResultModel,
});

const onGet = (row: QuestionnaireResultVO) => {
  modalApi
    .setData({
      id: row.id,
    })
    .open();
};

/** 表格 */
const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useQuestionnaireResultGridFormSchema(),
  },
  gridOptions: {
    columns: useQuestionnaireResultGridColumns(),
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          if (props.id) {
            formValues.assessmentId = props.id;
          }
          const res = await getQuestionnaireResultList({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
          // console.log('获取问卷结果列表', res);
          return res;
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
  } as VxeTableGridOptions<QuestionnaireResultVO>,
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
  <Grid table-title="问卷结果列表">
    <template #score="{ row }">
      <span class="font-bold text-green-500">{{ row.score }}</span>
    </template>
    <template #level="{ row }">
      <Tag color="blue">
        {{ row.level }}
      </Tag>
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
  <Modal class="w-[800px]" />
</template>

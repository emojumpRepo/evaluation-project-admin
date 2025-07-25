<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { AssessmentVO } from '#/api/evaluation/assessment/index';

import { h, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message, Tag } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteAssessment,
  getAssessmentList,
} from '#/api/evaluation/assessment/index';
import {
  getStatusColor,
  getStatusLabel,
  getTypeLabel,
} from '#/api/evaluation/constants';
import { $t } from '#/locales';

import { useAssessmentGridColumns, useAssessmentGridFormSchema } from './data';
import Form from './modules/add-form.vue';

/** 子表的列表 */
const selectAssessment = ref<AssessmentVO>();

const router = useRouter();

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

/** 刷新表格 */
function onRefresh() {
  gridApi.query();
}

/** 创建测评 */
function onCreate() {
  formModalApi.setData({}).open();
}

/** 发布/取消发布测评 */
// async function onPublish(row: AssessmentVO) {
//   await (row.status === 1
//     ? unpublishAssessment(row.id as number)
//     : publishAssessment(row.id as number));
//   onRefresh();
// }

/** 查看测评 */
function onView(row: AssessmentVO) {
  router.push({
    path: '/evaluation/assessment/detail',
    query: {
      id: row.id,
    },
  });
}

/** 编辑测评 */
function onEdit(row: AssessmentVO) {
  formModalApi.setData(row).open();
}

/** 删除测评 */
async function onDelete(row: AssessmentVO) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.id]),
    duration: 0,
    key: 'action_process_msg',
  });
  try {
    await deleteAssessment(row.id as number);
    message.success($t('ui.actionMessage.deleteSuccess', [row.id]));
    onRefresh();
  } finally {
    hideLoading();
  }
}

/** 表格操作按钮的回调函数 */
function onActionClick({ code, row }: OnActionClickParams<AssessmentVO>) {
  switch (code) {
    case 'delete': {
      onDelete(row);
      break;
    }
    case 'edit': {
      onEdit(row);
      break;
    }
    case 'view': {
      onView(row);
      break;
    }
  }
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useAssessmentGridFormSchema(),
  },
  gridOptions: {
    columns: useAssessmentGridColumns(onActionClick),
    height: 'auto',
    pagerConfig: {
      enabled: true,
    },
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          const res = await getAssessmentList({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
          return res;
        },
      },
    },
    rowConfig: {
      keyField: 'id',
      isHover: true,
      isCurrent: true,
    },
    toolbarConfig: {
      refresh: true,
      refreshOptions: { code: 'query' },
      search: true,
      zoom: false,
      custom: false,
    },
  } as VxeTableGridOptions<AssessmentVO>,
  gridEvents: {
    cellClick: ({ row }: { row: AssessmentVO }) => {
      selectAssessment.value = row;
    },
  },
});

onMounted(() => {
  gridApi.query();
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="onRefresh" />

    <!-- <div class="flex flex-col gap-10"> -->
    <Grid table-title="测评管理">
      <template #toolbar-tools>
        <Button :icon="h(Plus)" type="primary" @click="onCreate">
          {{ $t('ui.actionTitle.create', ['测评']) }}
        </Button>
      </template>

      <!-- 测评类型 -->
      <template #type="{ row }">
        <Tag color="blue">
          {{ getTypeLabel(row.type, 'assessment') }}
        </Tag>
      </template>

      <!-- 测评状态 -->
      <template #status="{ row }">
        <Tag :color="getStatusColor(row.status, 'assessment')">
          {{ getStatusLabel(row.status, 'assessment') }}
        </Tag>
      </template>

      <!-- 是否需要预约 -->
      <template #needAppointment="{ row }">
        <Tag :color="row.needAppointment ? 'blue' : 'red'">
          {{ row.needAppointment ? '是' : '否' }}
        </Tag>
      </template>

      <!-- 是否可重复测评 -->
      <template #isRepeatable="{ row }">
        <Tag :color="row.isRepeatable ? 'green' : 'red'">
          {{ row.isRepeatable ? '是' : '否' }}
        </Tag>
      </template>
    </Grid>

    <!-- 子表的表单 -->
    <!-- <ResultList :id="selectAssessment?.id" /> -->
    <!-- </div> -->
  </Page>
</template>

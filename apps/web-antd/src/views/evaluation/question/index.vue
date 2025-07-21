<script setup lang="ts">
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { QuestionnaireVO } from '#/api/evaluation/questionnaire/index';

import { onMounted } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { message, Tag } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getStatusColor,
  getStatusLabel,
  getTypeLabel,
} from '#/api/evaluation/constants';
import {
  deleteQuestionnaire,
  getQuestionnaireList,
  syncQuestionnaireData,
} from '#/api/evaluation/questionnaire/index';
import { $t } from '#/locales';

import { useQuestionGridColumns, useQuestionGridFormSchema } from './data';
import AddForm from './modules/add-form.vue';

defineOptions({ name: 'QuestionnaireManagement' });

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: AddForm,
  destroyOnClose: true,
});

// 同步数据
async function handleSync() {
  const hideLoading = message.loading({
    content: '正在同步最新问卷数据...',
    duration: 0,
    key: 'sync_questionnaire',
  });

  try {
    await syncQuestionnaireData();
    message.success({
      content: '同步成功',
      key: 'sync_questionnaire',
    });
    onRefresh();
  } catch {
    message.error({
      content: '同步失败',
      key: 'sync_questionnaire',
    });
  } finally {
    hideLoading();
  }
}

// 刷新表格
function onRefresh() {
  gridApi.query();
}

/** 编辑测评 */
function onEdit(row: QuestionnaireVO) {
  formModalApi.setData(row).open();
}

/** 删除测评 */
async function onDelete(row: QuestionnaireVO) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.id]),
    duration: 0,
    key: 'action_process_msg',
  });
  try {
    await deleteQuestionnaire(row.id as number);
    message.success($t('ui.actionMessage.deleteSuccess', [row.id]));
    onRefresh();
  } finally {
    hideLoading();
  }
}

/** 表格操作按钮的回调函数 */
function onActionClick({ code, row }: OnActionClickParams<QuestionnaireVO>) {
  switch (code) {
    case 'delete': {
      onDelete(row);
      break;
    }
    case 'edit': {
      onEdit(row);
      break;
    }
  }
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useQuestionGridFormSchema(),
  },
  gridOptions: {
    columns: useQuestionGridColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getQuestionnaireList({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
    toolbarConfig: {
      refresh: { code: 'query' },
      search: true,
      zoom: false,
      custom: false,
    },
  } as VxeTableGridOptions<QuestionnaireVO>,
});

onMounted(() => {
  gridApi.query();
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="onRefresh" />

    <Grid table-title="问卷管理">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: '同步最新数据',
              type: 'primary',
              icon: ACTION_ICON.REFRESH,
              onClick: handleSync,
            },
          ]"
        />
      </template>

      <!-- 问卷类型列 -->
      <template #type="{ row }">
        <Tag color="blue">{{ getTypeLabel(row.type, 'questionnaire') }}</Tag>
      </template>

      <!-- 状态列 -->
      <template #status="{ row }">
        <Tag :color="getStatusColor(row.status, 'questionnaire')">
          {{ getStatusLabel(row.status, 'questionnaire') }}
        </Tag>
      </template>

      <!-- 是否开放列 -->
      <template #isOpen="{ row }">
        <Tag :color="row.isOpen ? 'green' : 'red'">
          {{ row.isOpen ? '开放' : '关闭' }}
        </Tag>
      </template>
    </Grid>
  </Page>
</template>

<style scoped lang="scss"></style>

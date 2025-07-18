<script setup lang="ts">
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { QuestionnaireVO } from '#/api/emojump/questionnaire';

import { Page } from '@vben/common-ui';

import { message, Tag } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getStatusColor,
  getTypeLabel,
  QUESTIONNAIRE_STATUS_OPTIONS,
  QUESTIONNAIRE_TYPE_OPTIONS,
} from '#/api/emojump/constants';
import {
  getQuestionnaireList,
  syncQuestionnaireData,
} from '#/api/emojump/questionnaire';

defineOptions({ name: 'QuestionnaireManagement' });

// 表格列配置
function useGridColumns() {
  return [
    { title: '序号', type: 'seq', width: 50 },
    { field: 'title', title: '问卷标题', width: 200, showOverflow: true },
    { field: 'description', title: '问卷描述', width: 250, showOverflow: true },
    {
      field: 'type',
      title: '问卷类型',
      width: 120,
      slots: { default: 'type' },
    },
    {
      field: 'status',
      title: '状态',
      width: 100,
      slots: { default: 'status' },
    },
    { field: 'targetAudience', title: '目标受众', width: 120 },
    { field: 'estimatedDuration', title: '预计时长(分钟)', width: 120 },
    { field: 'accessCount', title: '访问次数', width: 100 },
    { field: 'completionCount', title: '完成次数', width: 100 },
    {
      field: 'isOpen',
      title: '是否开放',
      width: 100,
      slots: { default: 'isOpen' },
    },
    {
      field: 'validFrom',
      title: '有效期开始',
      width: 150,
      formatter: 'formatDate',
    },
    {
      field: 'validTo',
      title: '有效期结束',
      width: 150,
      formatter: 'formatDate',
    },
    { field: 'creator', title: '创建人', width: 100 },
    {
      field: 'createTime',
      title: '创建时间',
      width: 150,
      formatter: 'formatDateTime',
    },
  ];
}

// 搜索表单配置
function useGridFormSchema() {
  return [
    {
      component: 'Input',
      fieldName: 'title',
      label: '问卷标题',
      componentProps: {
        placeholder: '请输入问卷标题',
        allowClear: true,
      },
    },
    {
      component: 'Select',
      fieldName: 'type',
      label: '问卷类型',
      componentProps: {
        placeholder: '请选择问卷类型',
        allowClear: true,
        options: QUESTIONNAIRE_TYPE_OPTIONS,
      },
    },
    {
      component: 'Select',
      fieldName: 'status',
      label: '状态',
      componentProps: {
        placeholder: '请选择状态',
        allowClear: true,
        options: QUESTIONNAIRE_STATUS_OPTIONS,
      },
    },
    {
      component: 'RangePicker',
      fieldName: 'createTime',
      label: '创建时间',
      componentProps: {
        placeholder: ['开始时间', '结束时间'],
        format: 'YYYY-MM-DD',
      },
    },
    {
      component: 'Switch',
      fieldName: 'isOpen',
      label: '是否开放',
      componentProps: {
        checkedValue: true,
        unCheckedValue: false,
        style: {
          width: '40px',
        },
      },
    },
  ];
}

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
  gridApi.reload();
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
  },
  gridOptions: {
    columns: useGridColumns(),
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
    },
  } as VxeTableGridOptions<QuestionnaireVO>,
});
</script>

<template>
  <Page auto-content-height>
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
          {{
            QUESTIONNAIRE_STATUS_OPTIONS.find(
              (item) => item.value === row.status,
            )?.label || '未知状态'
          }}
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

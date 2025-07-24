<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { EmojumpArticleApi } from '#/api/evaluation/article';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';

import { message, Tag } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteArticle,
  deleteArticleBatch,
  getArticleList,
} from '#/api/evaluation/article';
import { $t } from '#/locales';

import { useGridColumns } from './data';
import editForm from './modules/edit-form.vue';

/** 设置选中 ID */
const checkedIds = ref<number[]>([]);

/** 设置选中 ID */
function setCheckedIds({ records }: { records: EmojumpArticleApi.Article[] }) {
  checkedIds.value = records.map((item) => item.id as number);
}

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: editForm,
  destroyOnClose: true,
});

/** 新增文章 */
function handleCreate() {
  formModalApi.setData({}).open();
}

/** 编辑 */
function handleEdit(row: EmojumpArticleApi.Article) {
  formModalApi.setData(row).open();
}

/** 删除文章 */
async function handleDelete(row: EmojumpArticleApi.Article) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.id]),
    duration: 0,
    key: 'action_process_msg',
  });
  try {
    await deleteArticle(row.id as number);
    message.success($t('ui.actionMessage.deleteSuccess', [row.id]));
    onRefresh();
  } finally {
    hideLoading();
  }
}

/** 批量删除文章 */
async function handleDeleteBatch() {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting'),
    duration: 0,
    key: 'action_process_msg',
  });
  try {
    await deleteArticleBatch(checkedIds.value);
    message.success($t('ui.actionMessage.deleteSuccess'));
    onRefresh();
  } finally {
    hideLoading();
  }
}

/** 刷新表格 */
function onRefresh() {
  gridApi.query();
}

// 表格实例
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    checkboxConfig: {
      highlight: true,
      labelField: 'checkbox',
    },
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => {
          return await getArticleList({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
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
  } as VxeTableGridOptions<EmojumpArticleApi.Article>,
  gridEvents: {
    checkboxAll: setCheckedIds,
    checkboxChange: setCheckedIds,
  },
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="onRefresh" />

    <Grid table-title="文章列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: '新增文章',
              type: 'primary',
              icon: 'lucide:plus',
              onClick: handleCreate,
            },
            {
              label: '批量删除',
              type: 'primary',
              danger: true,
              disabled: isEmpty(checkedIds),
              icon: ACTION_ICON.DELETE,
              onClick: handleDeleteBatch,
            },
          ]"
        />
      </template>

      <template #coverImage="{ row }">
        <div class="flex justify-center">
          <img :src="row.coverImage" style="width: 50px; height: 50px" />
        </div>
      </template>

      <template #status="{ row }">
        <Tag :color="row.status === 1 ? 'success' : 'warning'">
          {{ row.status === 1 ? '已发布' : '未发布' }}
        </Tag>
      </template>

      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: $t('common.edit'),
              type: 'link',
              icon: ACTION_ICON.EDIT,
              onClick: handleEdit.bind(null, row),
            },
            {
              label: $t('common.delete'),
              type: 'link',
              danger: true,
              icon: ACTION_ICON.DELETE,
              popConfirm: {
                title: $t('ui.actionMessage.deleteConfirm', [row.title]),
                confirm: handleDelete.bind(null, row),
              },
            },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template>

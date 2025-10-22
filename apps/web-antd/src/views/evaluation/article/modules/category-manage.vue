<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { EmojumpArticleCategoryApi } from '#/api/evaluation/article-category';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteArticleCategory,
  getArticleCategoryPage,
} from '#/api/evaluation/article-category';
import { $t } from '#/locales';

import categoryEditForm from './category-edit-form.vue';

const emit = defineEmits(['success']);

const [EditFormModal, editFormModalApi] = useVbenModal({
  connectedComponent: categoryEditForm,
  destroyOnClose: true,
});

/** 新增分类 */
function handleCreate() {
  editFormModalApi.setData({}).open();
}

/** 编辑分类 */
function handleEdit(row: EmojumpArticleCategoryApi.ArticleCategory) {
  editFormModalApi.setData(row).open();
}

/** 删除分类 */
async function handleDelete(row: EmojumpArticleCategoryApi.ArticleCategory) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.id]),
    duration: 0,
    key: 'action_process_msg',
  });
  try {
    await deleteArticleCategory(row.id as number);
    message.success($t('ui.actionMessage.deleteSuccess', [row.id]));
    onRefresh();
  } finally {
    hideLoading();
  }
}

/** 刷新表格 */
function onRefresh() {
  gridApi.query();
  emit('success');
}

// 表格实例
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: [
      {
        field: 'id',
        title: '分类编号',
        width: 120,
      },
      {
        field: 'name',
        title: '分类名称',
      },
      {
        field: 'sort',
        title: '排序',
        width: 120,
        sortable: true,
      },
      {
        title: '操作',
        width: 180,
        fixed: 'right',
        slots: { default: 'actions' },
      },
    ],
    height: 500,
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }) => {
          return await getArticleCategoryPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
    sortConfig: {
      defaultSort: { field: 'sort', order: 'asc' },
    },
    toolbarConfig: {
      refresh: { code: 'query' },
      search: false,
      zoom: false,
      custom: false,
    },
  } as VxeTableGridOptions<EmojumpArticleCategoryApi.ArticleCategory>,
});

/**
 * 内部 Modal 配置
 * 当使用 connectedComponent 时，内部配置优先级更高
 */
const [Modal] = useVbenModal({
  title: '分类管理',
  class: 'w-[800px]',
  fullscreenButton: false,
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      // 延迟加载，确保 Grid 已经完全初始化
      setTimeout(async () => {
        await gridApi.query();
      }, 100);
    }
  },
});
</script>

<template>
  <Modal>
    <EditFormModal @success="onRefresh" />

    <Grid table-title="分类列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: '新增分类',
              type: 'primary',
              icon: 'lucide:plus',
              onClick: handleCreate,
            },
          ]"
        />
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
                title: $t('ui.actionMessage.deleteConfirm', [row.name]),
                confirm: handleDelete.bind(null, row),
              },
            },
          ]"
        />
      </template>
    </Grid>
  </Modal>
</template>

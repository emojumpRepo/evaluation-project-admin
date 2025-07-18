<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MemberBabyApi } from '#/api/member/baby';

import { Page } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getBabyList } from '#/api/member/baby';

import { useGridColumns, useGridFormSchema } from './data';

// 表格实例
const [Grid] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
  },
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
        query: async ({ page }, formValues) => {
          const res = await getBabyList({
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
    },
    toolbarConfig: {
      search: true,
    },
  } as VxeTableGridOptions<MemberBabyApi.Baby>,
});
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="宝宝列表">
      <template #avatar="{ row }">
        <div class="flex justify-center">
          <img :src="row.avatar" style="width: 50px; height: 50px" />
        </div>
      </template>
      <template #gender="{ row }">
        <span>{{ row.gender === 1 ? '男' : '女' }}</span>
      </template>
    </Grid>
  </Page>
</template>

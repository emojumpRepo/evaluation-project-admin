<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { MemberBabyApi } from '#/api/member/baby';

import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getBabyList } from '#/api/member/baby';

import BabyDetailModal from './components/BabyDetailModal.vue';
import { useGridColumns, useGridFormSchema } from './data';

// 组件引用
const babyDetailModalRef = ref<InstanceType<typeof BabyDetailModal>>();

// 当前选中的宝宝信息
const currentBaby = ref<MemberBabyApi.Baby | null>(null);

// 表格实例
const [Grid, gridApi] = useVbenVxeGrid({
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

const handleShowDetail = (baby: MemberBabyApi.Baby) => {
  currentBaby.value = baby;
  babyDetailModalRef.value?.showModal();
};

const handleUpdate = () => {
  // 文件上传或更新后刷新表格数据
  gridApi.query();
};

onMounted(async () => {
  await gridApi.query();
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

      <template #action="{ row }">
        <a-button type="link" size="small" @click="() => handleShowDetail(row)">
          详情
        </a-button>
      </template>
    </Grid>

    <!-- 宝宝详情弹窗 -->
    <BabyDetailModal
      ref="babyDetailModalRef"
      :baby="currentBaby"
      @update="handleUpdate"
    />
  </Page>
</template>

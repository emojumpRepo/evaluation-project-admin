<script setup lang="ts">
import type { VbenFormSchema } from '@vben/common-ui';

import type { Carousel, Policy } from './types';

import { computed, onMounted, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { Button, Card, message, Modal, TabPane, Tabs } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createCarousel,
  createPolicy,
  deleteCarousel,
  getCarousel,
  getCarouselPage,
  getPolicy,
  getPolicyPage,
  updateCarousel,
  updatePolicy,
} from '#/api/system/platform';
import { DICT_TYPE, getDictOptions } from '#/utils';

import { Tinymce } from '../../../components/tinymce';
import { useUpload } from '../../../components/upload/use-upload';
import { PolicyType, PolicyTypeLabelMap } from './types';

getDictOptions(DICT_TYPE.COMMON_STATUS);

const activeMainTab = ref('homepage');
const activePolicyTab = ref('service');

// ======================== 首页设置 ========================
const banners = ref<Carousel[]>([]);

// 轮播图操作表单配置
const bannerModalFormSchema = computed((): VbenFormSchema[] => {
  return [
    {
      fieldName: 'id',
      component: 'Input',
      label: 'ID',
      componentProps: { disabled: true },
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'title',
      component: 'Input',
      label: '标题',
      rules: 'required',
    },
    { fieldName: 'subtitle', component: 'Input', label: '副标题' },
    {
      fieldName: 'type',
      component: 'RadioGroup',
      label: '类型',
      componentProps: {
        options: [
          { label: '跳转链接', value: 1 },
          { label: '弹窗', value: 2 },
        ],
        buttonStyle: 'solid',
        optionType: 'button',
      },
      rules: 'required',
    },
    {
      fieldName: 'imageUrl',
      component: 'ImageUpload',
      label: '轮播图',
      rules: 'required',
      componentProps: {
        maxNumber: 1,
        maxSize: 5,
        accept: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        showDescription: true,
        listType: 'picture-card',
        resultField: 'url',
        // 自定义上传接口，可以在这里处理上传逻辑
        api: async (file: File) => {
          const { httpRequest } = useUpload();
          const res = await httpRequest(file);
          console.warn('res', res);
          return res;
        },
      },
    },
    {
      fieldName: 'linkUrl',
      component: 'Input',
      label: '跳转链接',
      dependencies: {
        triggerFields: ['type'],
        show: (values) => values.type === 1,
        trigger: (values) => {
          if (values.type === 1) {
            values.linkUrl = '';
          }
        },
        required: (values) => values.type === 1,
      },
    },
    {
      fieldName: 'popupContent',
      component: 'Textarea',
      label: '弹窗内容',
      dependencies: {
        triggerFields: ['type'],
        show: (values) => values.type === 2,
        trigger: (values) => {
          if (values.type === 2) {
            values.popupContent = '';
          }
        },
        required: (values) => values.type === 2,
      },
      componentProps: {
        height: 400,
      },
    },
    {
      fieldName: 'sort',
      component: 'InputNumber',
      label: '排序',
      rules: 'required',
      componentProps: { min: 1 },
    },
    {
      fieldName: 'status',
      component: 'RadioGroup',
      label: '状态',
      componentProps: {
        options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
        buttonStyle: 'solid',
        optionType: 'button',
      },
      rules: 'required',
    },
  ];
});

const [BannerForm, bannerFormApi] = useVbenForm({
  schema: bannerModalFormSchema.value,
  showDefaultActions: false,
});
const [BannerModal, bannerModalApi] = useVbenModal({
  title: '轮播图',
  async onConfirm() {
    const { valid } = await bannerFormApi.validate();
    if (!valid) return;
    bannerModalApi.lock();
    const values = await bannerFormApi.getValues();
    // 保证 remark/createTime 字段存在
    if (!values.remark) values.remark = '';
    if (!values.createTime) values.createTime = new Date().toISOString();
    if (values.id) {
      await updateCarousel(values as Carousel);
      message.success('修改成功');
    } else {
      await createCarousel(values as Carousel);
      message.success('添加成功');
    }
    bannerModalApi.close();
    bannerModalApi.unlock();
    GridApi.reload();
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = bannerModalApi.getData();
      if (data && data.id) {
        getCarousel(Number(data.id)).then((res) => {
          bannerFormApi.setValues(res);
        });
      } else {
        bannerFormApi.setValues({ status: 0, type: 1 });
      }
    }
  },
});

// 轮播图表格列
const bannerColumns = [
  { field: 'id', title: 'ID', width: 100 },
  { field: 'sort', title: '排序', width: 120 },
  { field: 'title', title: '标题' },
  { field: 'subtitle', title: '副标题' },
  { field: 'imageUrl', title: '图片', cellRender: { name: 'CellImage' } },
  { field: 'linkUrl', title: '跳转链接', showOverflow: true },
  {
    field: 'status',
    title: '状态',
    cellRender: {
      name: 'CellDict',
      props: { type: DICT_TYPE.COMMON_STATUS },
    },
  },
  {
    title: '操作',
    field: 'action',
    resizable: false,
    slots: { default: 'action' },
    width: 150,
  },
];

// 轮播图搜索表单配置
const bannerFormSchema = [
  {
    component: 'Input',
    fieldName: 'title',
    label: '标题',
    componentProps: {
      placeholder: '请输入轮播图标题',
      allowClear: true,
    },
  },
  {
    component: 'Select',
    fieldName: 'status',
    label: '状态',
    componentProps: {
      placeholder: '请选择状态',
      allowClear: true,
      options: getDictOptions(DICT_TYPE.COMMON_STATUS, 'number'),
    },
  },
  {
    label: '创建时间',
    component: 'RangePicker',
    fieldName: 'createTime',
    componentProps: {
      placeholder: ['开始时间', '结束时间'],
      allowClear: true,
      format: 'YYYY-MM-DD HH:mm:ss',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      showTime: { format: 'HH:mm:ss' },
    },
  },
];

const [Grid, GridApi] = useVbenVxeGrid({
  formOptions: {
    schema: bannerFormSchema,
  },
  gridOptions: {
    columns: bannerColumns,
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async (
          { page }: { page: { currentPage: number; pageSize: number } },
          formValues: any,
        ) => {
          // 处理时间范围参数
          const params = { ...formValues };
          if (!params.createTime || !Array.isArray(params.createTime)) {
            // 如果不是数组或为空，清空参数
            delete params.createTime;
          }

          return await getCarouselPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...params,
          });
        },
      },
    },
    rowConfig: { keyField: 'id' },
    toolbarConfig: {
      refresh: { code: 'query' },
      search: true,
    },
  },
});

function handleAddBanner() {
  bannerModalApi.setData({ status: 0, sort: banners.value.length + 1 }).open();
}
function handleEditBanner(row: Carousel) {
  bannerModalApi.setData(row).open();
}
async function handleDeleteBanner(id: number) {
  Modal.confirm({
    title: '确认删除',
    content: '确定要删除这个轮播图吗？',
    async onOk() {
      await deleteCarousel(id);
      message.success('删除成功');
      GridApi.reload();
    },
  });
}

// ======================== 政策设置 ========================
const agreements = ref<Policy[]>([]);
const agreementLoading = ref(false);
async function fetchAgreements() {
  agreementLoading.value = true;
  const res = await getPolicyPage({
    pageNo: 1,
    pageSize: 10,
    type: '',
    title: '',
    status: 0,
    createTime: '',
  });
  agreements.value = res.list || [];
  agreementLoading.value = false;
}

const editContent = ref('');
const [AgreementModal, agreementModalApi] = useVbenModal({
  title: '编辑协议',
  class: 'w-[900px]',
  async onConfirm() {
    agreementModalApi.lock();
    if (!editContent.value) {
      message.error('请输入协议内容');
      return;
    }
    const key = agreementModalApi.getData()?.key;
    const policy = agreements.value.find((a) => a.type === key);
    // 保证 Policy 类型字段完整
    const basePolicy = {
      type: key,
      title:
        key === PolicyType.SERVICE_AGREEMENT
          ? PolicyTypeLabelMap[PolicyType.SERVICE_AGREEMENT]
          : PolicyTypeLabelMap[PolicyType.PRIVACY_POLICY],
      content: editContent.value,
      version: '1.0',
      status: 0,
      effectiveTime: '',
      remark: '',
      createTime: new Date().toISOString(),
    };
    if (policy && policy.id) {
      await updatePolicy({ ...policy, ...basePolicy });
      message.success('修改成功');
    } else {
      await createPolicy(basePolicy as Policy);
      message.success('添加成功');
    }
    agreementLoading.value = false;
    agreementModalApi.close();
    agreementModalApi.unlock();
    fetchAgreements();
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = agreementModalApi.getData();
      if (data && data.id) {
        getPolicy(Number(data.id)).then((res) => {
          editContent.value = res.content;
        });
      } else {
        editContent.value = '';
      }
    }
  },
});
function handleEditAgreement(type: string) {
  const policyType =
    type === 'service'
      ? PolicyType.SERVICE_AGREEMENT
      : PolicyType.PRIVACY_POLICY;
  const policy = agreements.value.find((a) => a.type === policyType);
  agreementModalApi
    .setData(
      policy
        ? { ...policy, key: policyType }
        : { key: policyType, content: '' },
    )
    .open();
}

onMounted(async () => {
  await GridApi.query();
  fetchAgreements();
});
</script>

<template>
  <Page auto-content-height>
    <Card>
      <!-- 主 Tab -->
      <Tabs v-model:active-key="activeMainTab" tab-position="left">
        <!-- 首页设置 Tab -->
        <TabPane key="homepage" tab="首页设置">
          <Page auto-content-height :height-offset="82">
            <Grid table-title="轮播图列表">
              <template #toolbar-tools>
                <TableAction
                  :actions="[
                    {
                      label: '添加轮播图',
                      type: 'primary',
                      icon: 'ant-design:plus-outlined',
                      onClick: handleAddBanner,
                    },
                  ]"
                />
              </template>
              <template #action="{ row }">
                <TableAction
                  :actions="[
                    {
                      label: '编辑',
                      type: 'link',
                      onClick: () => handleEditBanner(row),
                    },
                    {
                      label: '删除',
                      type: 'link',
                      danger: true,
                      onClick: () => handleDeleteBanner(row.id),
                    },
                  ]"
                />
              </template>
            </Grid>
          </Page>
        </TabPane>

        <!-- 政策设置 Tab -->
        <TabPane key="policy" tab="政策设置">
          <Tabs v-model:active-key="activePolicyTab" type="line">
            <TabPane key="service" tab="服务协议">
              <div class="editor-header">
                <Button type="primary" @click="handleEditAgreement('service')">
                  编辑协议
                </Button>
              </div>
              <div
                class="agreement-preview"
                v-html="
                  agreements.find(
                    (a) => a.type === PolicyType.SERVICE_AGREEMENT,
                  )?.content || '暂无协议内容'
                "
              ></div>
            </TabPane>

            <TabPane key="privacy" tab="隐私协议">
              <div class="editor-header">
                <Button type="primary" @click="handleEditAgreement('privacy')">
                  编辑协议
                </Button>
              </div>
              <div
                class="agreement-preview"
                v-html="
                  agreements.find((a) => a.type === PolicyType.PRIVACY_POLICY)
                    ?.content || '暂无协议内容'
                "
              ></div>
            </TabPane>
          </Tabs>
        </TabPane>
      </Tabs>

      <!-- 轮播图编辑弹窗 -->
      <BannerModal>
        <BannerForm />
      </BannerModal>

      <!-- 协议编辑弹窗 -->
      <AgreementModal>
        <Tinymce v-model="editContent" :height="600" />
      </AgreementModal>
    </Card>
  </Page>
</template>
<style scoped lang="less">
.editor-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.editor-header h4 {
  margin: 0;
  color: #262626;
}

.agreement-preview {
  min-height: 200px;
  padding: 16px;
  line-height: 1.6;
  background: #fafafa;
  border-radius: 6px;
  border: 1px solid #d9d9d9;
}

.agreement-preview :deep(p) {
  margin-bottom: 8px;
}

:deep(.tox-tinymce) {
  min-height: 300px;
}
</style>

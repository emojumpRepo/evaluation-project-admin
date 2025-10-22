<script lang="ts" setup>
import type { EmojumpArticleCategoryApi } from '#/api/evaluation/article-category';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  createArticleCategory,
  getArticleCategoryDetail,
  updateArticleCategory,
} from '#/api/evaluation/article-category';
import { $t } from '#/locales';

const emit = defineEmits(['success']);

const formData = ref<EmojumpArticleCategoryApi.ArticleCategory>();

/**
 * 获取标题
 */
const getTitle = computed(() => {
  return formData.value?.id ? '编辑分类' : '新增分类';
});

/**
 * 自定义表单
 */
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: [
    {
      fieldName: 'id',
      component: 'Input',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'name',
      label: '分类名称',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入分类名称',
      },
    },
    {
      fieldName: 'sort',
      label: '排序',
      component: 'InputNumber',
      defaultValue: 0,
      componentProps: {
        placeholder: '请输入排序值',
        min: 0,
        class: 'w-full',
      },
    },
  ],
  showDefaultActions: false,
});

/**
 * 创建弹窗
 */
const [Modal, modalApi] = useVbenModal({
  /** 提交表单 */
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    modalApi.lock();
    // 提交表单
    const data =
      (await formApi.getValues()) as EmojumpArticleCategoryApi.ArticleCategory;
    try {
      await (data?.id
        ? updateArticleCategory(data)
        : createArticleCategory(data));
      // 关闭并提示
      await modalApi.close();
      emit('success');
      message.success({
        content: $t('ui.actionMessage.operationSuccess'),
        key: 'action_process_msg',
      });
    } finally {
      modalApi.unlock();
    }
  },

  /** 打开表单 */
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      formData.value = undefined;
      return;
    }

    // 加载数据
    let data = modalApi.getData<EmojumpArticleCategoryApi.ArticleCategory>();
    if (!data) {
      return;
    }
    if (data.id) {
      modalApi.lock();
      try {
        data = await getArticleCategoryDetail(data.id);
      } finally {
        modalApi.unlock();
      }
    }
    // 设置到 values
    formData.value = data;
    await formApi.setValues(formData.value);
  },
});
</script>

<template>
  <Modal :title="getTitle" class="w-[500px]" :fullscreen-button="false">
    <Form class="mx-4" />
  </Modal>
</template>

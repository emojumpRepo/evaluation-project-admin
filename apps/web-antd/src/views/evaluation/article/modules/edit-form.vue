<script lang="ts" setup>
import type { EmojumpArticleApi } from '#/api/emojump/article/index';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenForm } from '#/adapter/form';
import {
  addArticle,
  editArticle,
  getArticleDetail,
} from '#/api/emojump/article';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const emit = defineEmits(['success']);

const formData = ref<EmojumpArticleApi.Article>();

/**
 * 获取标题
 */
const getTitle = computed(() => {
  return formData.value?.id ? '编辑文章' : '新增文章';
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
    labelWidth: 120,
  },
  layout: 'horizontal',
  schema: useFormSchema(),
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
    const data = (await formApi.getValues()) as EmojumpArticleApi.Article;
    try {
      const formData: EmojumpArticleApi.Article = {
        ...data,
        publishTime: dayjs(data.publishTime).valueOf(),
      };
      await (formData?.id ? editArticle(formData) : addArticle(formData));
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
    let data = modalApi.getData<EmojumpArticleApi.Article>();
    if (!data) {
      return;
    }
    if (data.id) {
      modalApi.lock();
      try {
        const res = await getArticleDetail(data.id);
        data = {
          ...res,
          publishTime: dayjs(res.publishTime),
        };
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
  <Modal :title="getTitle" class="w-[1000px]" :fullscreen-button="false">
    <Form class="mx-4" />
  </Modal>
</template>

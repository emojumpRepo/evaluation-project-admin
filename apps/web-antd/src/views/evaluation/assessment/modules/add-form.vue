<script lang="ts" setup>
import type { AssessmentVO } from '#/api/evaluation/assessment/index';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  createAssessment,
  getAssessment,
  updateAssessment,
} from '#/api/evaluation/assessment/index';
import { $t } from '#/locales';

import { useAssessmentFormSchema } from '../data';

const emit = defineEmits(['success']);
const formData = ref<AssessmentVO>();
const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['测评'])
    : $t('ui.actionTitle.create', ['测评']);
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 120,
  },
  layout: 'horizontal',
  schema: useAssessmentFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    modalApi.lock();
    // 提交表单
    const data = (await formApi.getValues()) as AssessmentVO;
    const formatData = {
      ...data,
      startTime: data.startTime ? new Date(data.startTime).getTime() : undefined,
      endTime: data.endTime ? new Date(data.endTime).getTime() : undefined,
    };

    console.log('添加提交的表单', formatData)

    try {
      await (data?.id
        ? updateAssessment(formatData)
        : createAssessment(formatData));
      // 关闭并提示
      await modalApi.close();
      emit('success');
      message.success($t('ui.actionMessage.operationSuccess'));
    } finally {
      modalApi.unlock();
    }
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      formData.value = undefined;
      return;
    }
    // 加载数据
    let data = modalApi.getData<AssessmentVO>();
    if (!data) {
      return;
    }
    if (data.id) {
      modalApi.lock();
      try {
        const respData = await getAssessment(data.id);
        // 转换 AssessmentRespVO 到 AssessmentVO 格式
        data = {
          ...respData,
        };
      } finally {
        modalApi.unlock();
      }
    }
    
    await formApi.setValues(data);
  },
});
</script>

<template>
  <Modal
    :title="getTitle"
    class="w-[900px]"
    :fullscreen-button="false"
    :destroy-on-close="true"
  >
    <Form class="mx-4" />
  </Modal>
</template>

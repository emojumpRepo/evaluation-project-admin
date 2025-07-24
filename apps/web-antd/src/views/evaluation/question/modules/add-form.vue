<script lang="ts" setup>
import type { QuestionnaireVO } from '#/api/evaluation/questionnaire/index';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenForm } from '#/adapter/form';
import {
  createQuestionnaire,
  getQuestionnaire,
  updateQuestionnaire,
} from '#/api/evaluation/questionnaire/index';
import { $t } from '#/locales';

import { useQuestionFormSchema } from '../data';

const emit = defineEmits(['success']);
const formData = ref<QuestionnaireVO>();
const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['问卷'])
    : $t('ui.actionTitle.create', ['编辑']);
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
  schema: useQuestionFormSchema(),
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
    const data = (await formApi.getValues()) as QuestionnaireVO;
    const formatData = {
      ...data,
      validFrom: Number(data.validFrom),
      validTo: Number(data.validTo),
    };

    try {
      await (data?.id
        ? updateQuestionnaire(formatData)
        : createQuestionnaire(formatData));
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
    let data = modalApi.getData<QuestionnaireVO>();
    if (!data) {
      return;
    }
    if (data.id) {
      modalApi.lock();
      try {
        data = await getQuestionnaire(data.id);
      } finally {
        modalApi.unlock();
      }
    }
    // 设置到 values，时间戳转 dayjs 对象
    const values: Record<string, any> = {
      ...data,
      validFrom: data.validFrom ? dayjs(data.validFrom) : undefined,
      validTo: data.validTo ? dayjs(data.validTo) : undefined,
    };
    formData.value = values as QuestionnaireVO;
    await formApi.setValues(values);
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

<script lang="ts" setup>
import { ref, watch } from 'vue';

import { Form, Input, message, Modal } from 'ant-design-vue';

import { uploadBabyFile } from '#/api/member/baby';
import { FileUpload } from '#/components/upload';

interface Props {
  babyId: number;
  assessmentId?: number;
}

interface Emits {
  (e: 'success'): void;
  (e: 'error', error: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const visible = ref(false);
const uploading = ref(false);
const formRef = ref();
const fileUrl = ref<string>('');
const fileUploadKey = ref(0); // ✅ 用于强制刷新 FileUpload 组件
const formData = ref<any>({
  babyId: props.babyId,
  assessmentId: props.assessmentId,
  file: '', // 用于表单验证
  fileUrl: '',
  fileName: '',
  fileType: '',
  fileSize: 0,
  description: '',
});

// 监听文件上传成功，更新表单数据
watch(fileUrl, (newUrl) => {
  if (newUrl) {
    // 从URL中提取文件名和类型
    const fileName = newUrl.split('/').pop() || '';
    const fileExtension = fileName.split('.').pop()?.toLowerCase();

    let fileType = 'other';
    if (fileExtension === 'pdf') fileType = 'application/pdf';
    else if (['doc', 'docx'].includes(fileExtension || ''))
      fileType = 'application/msword';
    else if (['xls', 'xlsx'].includes(fileExtension || ''))
      fileType = 'application/vnd.ms-excel';
    else if (['jpeg', 'jpg'].includes(fileExtension || ''))
      fileType = 'image/jpeg';
    else if (['png'].includes(fileExtension || '')) fileType = 'image/png';

    formData.value.file = newUrl; // 用于表单验证
    formData.value.fileUrl = newUrl;
    formData.value.fileName = fileName;
    formData.value.fileType = fileType;
    // TODO: 获取文件大小，暂时设置为0
    formData.value.fileSize = 0;
  }
});

const handleSubmit = async () => {
  try {
    await formRef.value.validate();

    if (!fileUrl.value) {
      message.error('请先上传文件!');
      return;
    }

    uploading.value = true;

    // 构建提交数据
    const submitData = {
      babyId: props.babyId,
      assessmentId: props.assessmentId,
      fileUrl: fileUrl.value,
      fileName: formData.value.fileName,
      fileType: formData.value.fileType,
      fileSize: formData.value.fileSize,
      description: formData.value.description,
    };

    await uploadBabyFile(submitData);

    message.success('附件上传成功!');
    visible.value = false;

    // ✅ 清空表单数据
    fileUrl.value = '';
    formData.value = {
      babyId: props.babyId,
      assessmentId: props.assessmentId,
      file: '',
      fileUrl: '',
      fileName: '',
      fileType: '',
      fileSize: 0,
      description: '',
    };
    // ✅ 重置表单验证状态
    formRef.value?.resetFields();
    // ✅ 强制刷新 FileUpload 组件，清空文件选择器
    fileUploadKey.value++;

    emit('success');
  } catch (error) {
    console.error('上传失败:', error);
    emit('error', '上传失败，请重试');
  } finally {
    uploading.value = false;
  }
};

const handleCancel = () => {
  visible.value = false;
  fileUrl.value = '';
  formData.value = {
    babyId: props.babyId,
    assessmentId: props.assessmentId,
    file: '', // 用于表单验证
    fileUrl: '',
    fileName: '',
    fileType: '',
    fileSize: 0,
    description: '',
  };
  // ✅ 取消时也清空文件选择器
  fileUploadKey.value++;
};

const showModal = () => {
  visible.value = true;
};

defineExpose({
  showModal,
});
</script>

<template>
  <Modal
    v-model:open="visible"
    title="上传宝宝附件"
    :confirm-loading="uploading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    width="600px"
  >
    <Form ref="formRef" :model="formData" layout="vertical">
      <Form.Item
        label="选择文件"
        name="file"
        :rules="[{ required: true, message: '请选择文件' }]"
      >
        <FileUpload
          :key="fileUploadKey"
          v-model:value="fileUrl"
          :max-size="10"
          :max-number="1"
          :accept="[
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'image/jpeg',
            'image/png',
            'image/gif',
          ]"
          directory="baby"
          :show-description="true"
        />
      </Form.Item>

      <Form.Item label="附件描述" name="description">
        <Input.TextArea
          v-model:value="formData.description"
          placeholder="请输入附件描述（可选）"
          :rows="3"
          :maxlength="500"
          show-count
        />
      </Form.Item>
    </Form>
  </Modal>
</template>

<style scoped>
.ant-upload-list {
  margin-top: 8px;
}
</style>

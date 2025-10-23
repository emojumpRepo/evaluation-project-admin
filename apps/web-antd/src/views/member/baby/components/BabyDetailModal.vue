<script lang="ts" setup>
import type { ColumnsType } from 'ant-design-vue/es/table';

import type { BabyFileApi, MemberBabyApi } from '#/api/member/baby';

import { computed, h, ref } from 'vue';

import { Download, Trash2, Upload } from '@vben/icons';

import {
  Avatar,
  Button,
  Descriptions,
  message,
  Modal,
  Popconfirm,
  Table,
  Tabs,
  Tag,
} from 'ant-design-vue';

import { deleteBabyFile, getBabyFileListByBabyId } from '#/api/member/baby';

import FileUpload from './FileUpload.vue';

interface Props {
  baby: MemberBabyApi.Baby | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'update'): void;
}>();

const visible = ref(false);
const activeTab = ref('basic');
const fileUploadRef = ref<InstanceType<typeof FileUpload>>();

// 附件管理相关状态
const fileList = ref<BabyFileApi.BabyFile[]>([]);
const loading = ref(false);
const selectedRowKeys = ref<number[]>([]);
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
});

const babyInfo = computed(() => props.baby);

const genderText = computed(() => {
  return babyInfo.value?.gender === 1 ? '男' : '女';
});

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('zh-CN');
};

// 文件类型相关
const getFileTypeName = (type?: string) => {
  if (!type) return '未知';
  if (type.startsWith('image/')) return '图片';
  if (type.startsWith('video/')) return '视频';
  if (type.startsWith('audio/')) return '音频';
  if (type.includes('pdf')) return 'PDF';
  if (type.includes('word') || type.includes('document')) return 'Word';
  if (type.includes('excel') || type.includes('sheet')) return 'Excel';
  return '其他';
};

const getFileTypeColor = (type?: string) => {
  if (!type) return 'default';
  if (type.startsWith('image/')) return 'blue';
  if (type.startsWith('video/')) return 'purple';
  if (type.startsWith('audio/')) return 'green';
  if (type.includes('pdf')) return 'red';
  if (type.includes('word') || type.includes('document')) return 'orange';
  if (type.includes('excel') || type.includes('sheet')) return 'cyan';
  return 'default';
};

// 表格列配置
const columns: ColumnsType<BabyFileApi.BabyFile> = [
  {
    title: '文件名',
    dataIndex: 'fileName',
    key: 'fileName',
    width: 300,
    ellipsis: true,
  },
  {
    title: '类型',
    dataIndex: 'fileType',
    key: 'fileType',
    width: 100,
    customRender: ({ record }) => {
      return h(
        Tag,
        {
          color: getFileTypeColor(record.fileType),
        },
        { default: () => getFileTypeName(record.fileType) },
      );
    },
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    width: 250,
    ellipsis: true,
  },
  {
    title: '上传时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180,
    customRender: ({ record }) => {
      return new Date(record.createTime).toLocaleString();
    },
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    fixed: 'right',
  },
];

// 加载附件列表
const loadFileList = async () => {
  if (!babyInfo.value?.id) return;

  loading.value = true;
  try {
    const response = await getBabyFileListByBabyId(babyInfo.value.id);
    fileList.value = response || [];
    pagination.value.total = fileList.value.length;
  } catch (error) {
    console.error('加载附件列表失败:', error);
    message.error('加载附件列表失败');
  } finally {
    loading.value = false;
  }
};

// 下载附件
const handleDownload = async (record: BabyFileApi.BabyFile) => {
  try {
    if (record.fileUrl) {
      const link = document.createElement('a');
      link.href = record.fileUrl;
      link.download = record.fileName || '附件';
      link.target = '_blank';
      document.body.append(link);
      link.click();
      link.remove();
      message.success('开始下载');
    }
  } catch (error) {
    console.error('下载失败:', error);
    message.error('下载失败');
  }
};

// 删除附件
const handleDelete = async (id: number) => {
  try {
    await deleteBabyFile(id);
    message.success('删除成功');
    await loadFileList();
    emit('update');
  } catch (error) {
    console.error('删除失败:', error);
    message.error('删除失败');
  }
};

// 批量删除
const handleBatchDelete = async () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请先选择要删除的附件');
    return;
  }

  try {
    await Promise.all(selectedRowKeys.value.map((id) => deleteBabyFile(id)));
    message.success('批量删除成功');
    selectedRowKeys.value = [];
    await loadFileList();
    emit('update');
  } catch (error) {
    console.error('批量删除失败:', error);
    message.error('批量删除失败');
  }
};

const handleUploadFile = () => {
  fileUploadRef.value?.showModal();
};

const handleFileUploadSuccess = () => {
  loadFileList();
  emit('update');
};

const showModal = () => {
  visible.value = true;
  activeTab.value = 'basic';
  loadFileList();
};

defineExpose({
  showModal,
});
</script>

<template>
  <Modal
    v-model:open="visible"
    :title="`宝宝详情 - ${babyInfo?.name || ''}`"
    :footer="null"
    width="1200px"
  >
    <div v-if="babyInfo">
      <Tabs v-model:active-key="activeTab">
        <!-- 基本信息标签页 -->
        <Tabs.TabPane key="basic" tab="基本信息">
          <Descriptions bordered :column="2">
            <Descriptions.Item label="头像" :span="2">
              <Avatar :size="80" :src="babyInfo.avatar" />
            </Descriptions.Item>
            <Descriptions.Item label="姓名">
              {{ babyInfo.name || '-' }}
            </Descriptions.Item>
            <Descriptions.Item label="昵称">
              {{ babyInfo.nickname || '-' }}
            </Descriptions.Item>
            <Descriptions.Item label="性别">
              <Tag :color="babyInfo.gender === 1 ? 'blue' : 'pink'">
                {{ genderText }}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="出生日期">
              {{ formatDate(babyInfo.birthday) }}
            </Descriptions.Item>
            <Descriptions.Item label="身高" v-if="babyInfo.height">
              {{ babyInfo.height }} cm
            </Descriptions.Item>
            <Descriptions.Item label="体重" v-if="babyInfo.weight">
              {{ babyInfo.weight }} kg
            </Descriptions.Item>
          </Descriptions>
        </Tabs.TabPane>

        <!-- 附件管理标签页 -->
        <Tabs.TabPane key="files" tab="附件管理">
          <div class="mb-4 flex items-center justify-between">
            <div class="flex gap-2">
              <Button type="primary" @click="handleUploadFile">
                <Upload class="action-icon" />
                上传附件
              </Button>
              <Popconfirm
                title="确定要删除选中的附件吗？"
                @confirm="handleBatchDelete"
                :disabled="selectedRowKeys.length === 0"
              >
                <Button danger :disabled="selectedRowKeys.length === 0">
                  <Trash2 class="action-icon" />
                  批量删除
                </Button>
              </Popconfirm>
            </div>
            <div class="text-gray-500">
              共 {{ pagination.total }} 个附件
              <span v-if="selectedRowKeys.length > 0" class="ml-2">
                （已选择 {{ selectedRowKeys.length }} 个）
              </span>
            </div>
          </div>

          <Table
            :columns="columns"
            :data-source="fileList"
            :loading="loading"
            :row-key="(record) => record.id"
            :row-selection="{
              selectedRowKeys,
              onChange: (keys) => (selectedRowKeys = keys),
              fixed: true,
            }"
            :pagination="{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条`,
            }"
            :scroll="{ x: 1000 }"
            bordered
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'action'">
                <div class="action-buttons">
                  <Button
                    type="link"
                    size="small"
                    @click="handleDownload(record)"
                    title="下载"
                  >
                    <Download class="action-icon" />
                    下载
                  </Button>
                  <Popconfirm
                    title="确定要删除这个附件吗？"
                    @confirm="() => handleDelete(record.id!)"
                  >
                    <Button type="link" size="small" danger title="删除">
                      <Trash2 class="action-icon" />
                      删除
                    </Button>
                  </Popconfirm>
                </div>
              </template>
            </template>
          </Table>
        </Tabs.TabPane>
      </Tabs>

      <!-- 关闭按钮 -->
      <div class="mt-6 text-right">
        <Button @click="visible = false"> 关闭 </Button>
      </div>
    </div>

    <!-- 文件上传弹窗 -->
    <FileUpload
      v-if="babyInfo"
      ref="fileUploadRef"
      :baby-id="babyInfo.id || 0"
      @success="handleFileUploadSuccess"
    />
  </Modal>
</template>

<style scoped>
.action-icon {
  width: 14px;
  height: 14px;
  margin-right: 4px;
}

.action-buttons {
  display: flex;
  flex-wrap: nowrap;
  gap: 4px;
}

.text-gray-500 {
  color: #6b7280;
}
</style>

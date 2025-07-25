<script setup lang="ts">
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { QuestionnaireVO } from '#/api/evaluation/questionnaire/index';

import { onMounted, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import {
  Button,
  DatePicker,
  Dropdown,
  Menu,
  MenuItem,
  message,
  Tag,
} from 'ant-design-vue';
import dayjs from 'dayjs';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getStatusColor,
  getStatusLabel,
  getTypeLabel,
} from '#/api/evaluation/constants';
import {
  deleteQuestionnaire,
  getQuestionnaireList,
  pauseQuestionnaire,
  publishQuestionnaire,
  syncQuestionnaireData,
  updateQuestionnaire,
} from '#/api/evaluation/questionnaire/index';
import { $t } from '#/locales';

import { useQuestionGridColumns, useQuestionGridFormSchema } from './data';
import AddForm from './modules/add-form.vue';
import ResultList from './modules/result-list.vue';

defineOptions({ name: 'QuestionnaireManagement' });

/** 子表的列表 */
const selectQuestionnaire = ref<QuestionnaireVO>();

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: AddForm,
  destroyOnClose: true,
});

// 同步数据
async function handleSync() {
  const hideLoading = message.loading({
    content: '正在同步最新问卷数据...',
    duration: 0,
    key: 'sync_questionnaire',
  });

  try {
    await syncQuestionnaireData();
    message.success({
      content: '同步成功',
      key: 'sync_questionnaire',
    });
    onRefresh();
  } catch {
    message.error({
      content: '同步失败',
      key: 'sync_questionnaire',
    });
  } finally {
    hideLoading();
  }
}

// 刷新表格
function onRefresh() {
  gridApi.query();
}

/** 创建问卷 */
// function onCreate() {
//   formModalApi.setData({}).open();
// }

/** 编辑测评 */
function onEdit(row: QuestionnaireVO) {
  formModalApi.setData(row).open();
}

/** 删除测评 */
async function onDelete(row: QuestionnaireVO) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.id]),
    duration: 0,
    key: 'action_process_msg',
  });
  try {
    await deleteQuestionnaire(row.id as number);
    message.success($t('ui.actionMessage.deleteSuccess', [row.id]));
    onRefresh();
  } finally {
    hideLoading();
  }
}

async function onPublish(row: QuestionnaireVO) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.publishing', [row.title]),
    duration: 0,
    key: 'action_process_msg',
  });
  try {
    await publishQuestionnaire(row.id as number);
    message.success($t('ui.actionMessage.publishSuccess', [row.title]));
    onRefresh();
  } finally {
    hideLoading();
  }
}

async function onPause(row: QuestionnaireVO) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.pausing', [row.title]),
    duration: 0,
    key: 'action_process_msg',
  });
  try {
    await pauseQuestionnaire(row.id as number);
    message.success($t('ui.actionMessage.pauseSuccess', [row.title]));
    onRefresh();
  } finally {
    hideLoading();
  }
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useQuestionGridFormSchema(),
  },
  gridOptions: {
    columns: useQuestionGridColumns(),
    height: '600px',
    keepSource: true,
    editConfig: {
      mode: 'row',
      trigger: 'click',
    },
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getQuestionnaireList({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
    toolbarConfig: {
      refresh: { code: 'query' },
      search: true,
      zoom: false,
      custom: false,
    },
  } as VxeTableGridOptions<QuestionnaireVO>,
  gridEvents: {
    cellClick: ({ row }: { row: QuestionnaireVO }) => {
      selectQuestionnaire.value = row;
    },
  },
});

function hasEditStatus(row: QuestionnaireVO) {
  return gridApi.grid?.isEditByRow(row);
}

async function saveRowEvent(row: QuestionnaireVO) {
  await gridApi.grid?.clearEdit();
  gridApi.setLoading(true);
  try {
    await updateQuestionnaire(row as QuestionnaireVO);
    message.success($t('ui.actionMessage.operationSuccess'));
    gridApi.query();
  } catch {
    message.error($t('ui.actionMessage.operationFailed'));
  } finally {
    gridApi.setLoading(false);
  }
}

function cancelRowEvent() {
  gridApi.grid?.clearEdit();
}

onMounted(() => {
  gridApi.query();
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="onRefresh" />

    <div class="flex flex-col gap-4">
      <Grid table-title="问卷管理">
        <template #toolbar-tools>
          <TableAction
            :actions="[
              {
                label: '同步最新数据',
                type: 'primary',
                icon: ACTION_ICON.REFRESH,
                onClick: handleSync,
              },
              // {
              //   label: '添加问卷',
              //   type: 'primary',
              //   icon: ACTION_ICON.ADD,
              //   onClick: onCreate,
              // },
            ]"
          />
        </template>

        <!-- 问卷类型列 -->
        <template #type="{ row }">
          <Tag color="blue">{{ getTypeLabel(row.type, 'questionnaire') }}</Tag>
        </template>

        <!-- 状态列 -->
        <template #status="{ row }">
          <Tag :color="getStatusColor(row.status, 'questionnaire')">
            {{ getStatusLabel(row.status, 'questionnaire') }}
          </Tag>
        </template>

        <!-- 是否开放列 -->
        <template #isOpen="{ row }">
          <Tag :color="row.isOpen ? 'green' : 'red'">
            {{ row.isOpen ? '开放' : '关闭' }}
          </Tag>
        </template>

        <!-- 答题有效期开始列 -->
        <template #validFrom="{ row }">
          {{
            row.validFrom
              ? dayjs(row.validFrom).format('YYYY-MM-DD HH:mm:ss')
              : '0'
          }}
        </template>

        <template #validFrom_edit="{ row }">
          <DatePicker
            v-model="row.validFrom"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="x"
            show-time
          />
        </template>

        <!-- 答题有效期结束列 -->
        <template #validTo="{ row }">
          {{
            row.validTo ? dayjs(row.validTo).format('YYYY-MM-DD HH:mm:ss') : '0'
          }}
        </template>

        <template #validTo_edit="{ row }">
          <DatePicker
            v-model="row.validTo"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="x"
            show-time
          />
        </template>

        <template #operation="{ row }">
          <div v-if="hasEditStatus(row)" class="flex w-full items-center gap-2">
            <Button type="primary" @click="saveRowEvent(row)"> 保存 </Button>
            <Button type="text" @click="cancelRowEvent()"> 取消 </Button>
            <Dropdown>
              <Button type="link">更多</Button>
              <template #overlay>
                <Menu>
                  <MenuItem @click="onEdit(row)">编辑</MenuItem>
                  <MenuItem danger @click="onDelete(row)">删除</MenuItem>
                </Menu>
              </template>
            </Dropdown>
          </div>
          <div v-else class="flex w-full items-center gap-2">
            <Button
              v-if="![1, 3].includes(row.status)"
              type="link"
              @click="onPublish(row)"
            >
              发布
            </Button>
            <Button
              v-else-if="[1, 3].includes(row.status)"
              type="link"
              @click="onPause(row)"
            >
              暂停
            </Button>
            <Dropdown>
              <Button type="link">更多</Button>
              <template #overlay>
                <Menu>
                  <MenuItem @click="onEdit(row)">编辑</MenuItem>
                  <MenuItem danger @click="onDelete(row)">删除</MenuItem>
                </Menu>
              </template>
            </Dropdown>
          </div>
        </template>
      </Grid>

      <!-- 子表的表单 -->
      <ResultList :id="selectQuestionnaire?.id" />
    </div>
  </Page>
</template>

<style scoped lang="scss"></style>

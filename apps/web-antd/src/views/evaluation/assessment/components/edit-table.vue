<script lang="ts" setup>
import type { Ref } from 'vue';

import type { AssessmentQuestionnaireVO } from '#/api/evaluation/assessment/index';

import { computed, nextTick, ref, watch } from 'vue';

import { InputNumber, Switch, Table } from 'ant-design-vue';

interface DataItem extends AssessmentQuestionnaireVO {
  key: string;
}

const props = withDefaults(
  defineProps<{
    tableList?: AssessmentQuestionnaireVO[];
  }>(),
  {
    tableList: () => [],
  },
);

const emit = defineEmits<{
  'update:tableList': [value: AssessmentQuestionnaireVO[]];
}>();

const columns = [
  {
    title: '问卷ID',
    dataIndex: 'questionnaireId',
  },
  {
    title: '问卷排序',
    dataIndex: 'sortOrder',
  },
  {
    title: '是否必填',
    dataIndex: 'isRequired',
  },
  {
    title: '权重',
    dataIndex: 'weight',
  },
  {
    title: '操作',
    dataIndex: 'operation',
  },
];
const dataSource: Ref<DataItem[]> = ref([]); // 数据源
const count = computed(() => dataSource.value.length + 1); // 计数器

// 用于防止循环更新的标志
let isInternalUpdate = false;

// 监听props.tableList变化，同步到dataSource
watch(
  () => props.tableList,
  (newValue) => {
    if (isInternalUpdate) return;

    dataSource.value =
      newValue && Array.isArray(newValue)
        ? newValue.map((item, index) => {
            const normalizedItem: DataItem = {
              key: `${index + 1}`,
              questionnaireId: item.questionnaireId,
              sortOrder: item.sortOrder || index + 1,
              isRequired:
                item.isRequired === undefined ? true : item.isRequired,
              weight: item.weight || 0,
            };
            return normalizedItem;
          })
        : [];
  },
  { immediate: true, deep: true },
);

// 同步数据到父组件的函数
const syncToParent = () => {
  isInternalUpdate = true;
  const result = dataSource.value.map(({ key, ...item }) => item);
  emit('update:tableList', result);
  nextTick(() => {
    isInternalUpdate = false;
  });
};

// 用于存储正在编辑的单元格，格式为 "rowKey-columnKey"
const editingCell = ref<string>('');
// 用于存储编辑中的值
const editingValue = ref<number>(0);
const inputRef = ref();

// 获取单元格的键
const getCellKey = (rowKey: string, columnKey: string) =>
  `${rowKey}-${columnKey}`;

/**
 * 编辑单元格
 * @param rowKey 行键
 * @param columnKey 列键
 * @param currentValue 当前值
 */
const edit = (
  rowKey: string,
  columnKey: string,
  currentValue: boolean | number | string,
) => {
  // 如果当前有正在编辑的单元格，先保存它
  if (editingCell.value) {
    const parts = editingCell.value.split('-');
    if (parts.length >= 2) {
      const currentRowKey = parts[0];
      const currentColumnKey = parts.slice(1).join('-');
      if (currentRowKey && currentColumnKey) {
        save(currentRowKey, currentColumnKey);
      }
    }
  }

  const cellKey = getCellKey(rowKey, columnKey);
  editingCell.value = cellKey;
  editingValue.value = Number(currentValue) || 0;

  // 下一个tick聚焦到输入框
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.focus();
    }
  });
};

/**
 * 保存单元格
 * @param rowKey 行键
 * @param columnKey 列键
 */
const save = (rowKey: string, columnKey: string) => {
  const item = dataSource.value.find((item) => item.key === rowKey);
  if (item && editingCell.value) {
    // 根据字段类型进行适当的类型转换
    let value: any = editingValue.value;
    if (columnKey === 'questionnaireId' || columnKey === 'sortOrder') {
      value = Number(value) || 0;
    } else if (columnKey === 'weight') {
      value = Number(value) || 0;
    }
    (item as any)[columnKey] = value;
    // 同步到父组件
    syncToParent();
  }
  editingCell.value = '';
  editingValue.value = 0;
};

/**
 * 是否正在编辑
 * @param rowKey 行键
 * @param columnKey 列键
 */
const isEditing = (rowKey: string, columnKey: string) => {
  return editingCell.value === getCellKey(rowKey, columnKey);
};

/**
 * 失去焦点
 * @param rowKey 行键
 * @param columnKey 列键
 */
const handleBlur = (rowKey: string, columnKey: string) => {
  // 使用 setTimeout 确保失焦事件正确处理，但要检查是否还在编辑同一个单元格
  setTimeout(() => {
    const currentCellKey = getCellKey(rowKey, columnKey);
    // 只有当前仍在编辑这个单元格时才保存（避免被其他点击事件覆盖）
    if (editingCell.value === currentCellKey) {
      save(rowKey, columnKey);
    }
  }, 150);
};

/**
 * 删除行
 * @param key 行键
 */
const onDelete = (key: string) => {
  dataSource.value = dataSource.value.filter((item) => item.key !== key);
  syncToParent();
};
const handleSwitchChange = (rowKey: string, checked: any) => {
  const item = dataSource.value.find((item) => item.key === rowKey);
  if (item) {
    item.isRequired = Boolean(checked);
    // 同步到父组件
    syncToParent();
  }
};

/**
 * 添加行
 */
const handleAdd = () => {
  const newData: DataItem = {
    key: `${count.value}`,
    questionnaireId: count.value,
    sortOrder: count.value,
    isRequired: true,
    weight: 0,
  };
  dataSource.value.push(newData);
  syncToParent();
};
</script>

<template>
  <Table
    bordered
    :data-source="dataSource"
    :columns="columns"
    :pagination="false"
  >
    <template #bodyCell="{ column, text, record }">
      <template
        v-if="
          ['questionnaireId', 'sortOrder', 'weight'].includes(
            column.dataIndex as string,
          )
        "
      >
        <div class="editable-cell">
          <div
            v-if="isEditing(record.key, column.dataIndex as string)"
            class="editable-cell-input-wrapper"
          >
            <InputNumber
              v-model:value="editingValue"
              @press-enter="save(record.key, column.dataIndex as string)"
              @blur="handleBlur(record.key, column.dataIndex as string)"
              ref="inputRef"
              :precision="column.dataIndex === 'weight' ? 2 : 0"
              :step="column.dataIndex === 'weight' ? 0.1 : 1"
              :min="0"
            />
          </div>
          <div
            v-else
            class="editable-cell-text-wrapper"
            @click="edit(record.key, column.dataIndex as string, text)"
          >
            {{ text ?? ' ' }}
          </div>
        </div>
      </template>
      <template v-else-if="column.dataIndex === 'isRequired'">
        <Switch
          :checked="record.isRequired"
          @change="(checked, _event) => handleSwitchChange(record.key, checked)"
        />
      </template>
      <template v-else-if="column.dataIndex === 'operation'">
        <span style="color: red; cursor: pointer" @click="onDelete(record.key)">
          删除
        </span>
      </template>
    </template>
    <template #footer>
      <div
        class="hover:bg-grey-300 cursor-pointer p-2 text-center"
        @click="handleAdd"
      >
        Add
      </div>
    </template>
  </Table>
</template>

<style lang="less" scoped>
:deep(.ant-table-footer) {
  padding: 0;
}

.editable-cell {
  position: relative;
  width: 100%;

  .editable-cell-input-wrapper {
    padding: 0;
    width: 100%;

    :deep(.ant-input-number) {
      width: 100% !important;
      box-sizing: border-box;
    }

    :deep(.ant-input) {
      width: 100% !important;
      box-sizing: border-box;
    }
  }

  .editable-cell-text-wrapper {
    padding: 5px;
    cursor: pointer;
    min-height: 32px;
    display: flex;
    align-items: center;
    width: 100%;
    box-sizing: border-box;

    &:hover {
      background-color: #f5f5f5;
      border-radius: 4px;
    }
  }
}

.add-row-wrapper {
  padding: 16px;
  text-align: center;
  border-top: 1px solid #f0f0f0;

  .editable-add-btn {
    width: 100%;
    max-width: 200px;
  }
}

.ant-input {
  width: 100%;
  padding: 4px 11px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  outline: none;

  &:focus {
    border-color: #1890ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
}
</style>

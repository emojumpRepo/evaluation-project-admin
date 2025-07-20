import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn } from '#/adapter/vxe-table';
import type { QuestionnaireVO } from '#/api/evaluation/questionnaire/index';

import {
  QUESTIONNAIRE_STATUS_OPTIONS,
  QUESTIONNAIRE_TYPE_OPTIONS,
} from '#/api/evaluation/constants';

// ============== 问卷配置 ======================

// 添加表单配置
export function useQuestionFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'id',
      component: 'Input',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'title',
      label: '问卷标题',
      component: 'Input',
      rules: 'required',
      componentProps: {
        placeholder: '请输入问卷标题',
      },
    },
    {
      fieldName: 'description',
      label: '问卷描述',
      component: 'Input',
    },
    {
      fieldName: 'link',
      label: '问卷链接',
      component: 'Input',
      rules: 'required',
      componentProps: {
        placeholder: '请输入问卷链接',
      },
    },
    {
      fieldName: 'type',
      label: '问卷类型',
      component: 'Select',
      rules: 'required',
      componentProps: {
        placeholder: '请选择问卷类型',
        options: QUESTIONNAIRE_TYPE_OPTIONS,
      },
    },
    {
      fieldName: 'targetAudience',
      label: '目标人群',
      component: 'Input',
    },
    {
      fieldName: 'estimatedDuration',
      label: '预计时长(分钟)',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入预计时长',
        allowClear: true,
      },
    },
    {
      fieldName: 'isOpen',
      label: '是否开放',
      component: 'Switch',
      componentProps: {
        checkedValue: true,
        unCheckedValue: false,
        style: {
          width: '40px',
        },
      },
    },
    {
      fieldName: 'validFrom',
      label: '有效期开始时间',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
        showTime: true,
      },
    },
    {
      fieldName: 'validTo',
      label: '有效期结束时间',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
        showTime: true,
      },
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Input',
    },
  ];
}

// 搜索表单配置
export function useQuestionGridFormSchema() {
  return [
    {
      component: 'Input',
      fieldName: 'title',
      label: '问卷标题',
      componentProps: {
        placeholder: '请输入问卷标题',
        allowClear: true,
      },
    },
    {
      component: 'Select',
      fieldName: 'type',
      label: '问卷类型',
      componentProps: {
        placeholder: '请选择问卷类型',
        allowClear: true,
        options: QUESTIONNAIRE_TYPE_OPTIONS,
      },
    },
    {
      component: 'Select',
      fieldName: 'status',
      label: '状态',
      componentProps: {
        placeholder: '请选择状态',
        allowClear: true,
        options: QUESTIONNAIRE_STATUS_OPTIONS,
      },
    },
    {
      component: 'RangePicker',
      fieldName: 'createTime',
      label: '创建时间',
      componentProps: {
        placeholder: ['开始时间', '结束时间'],
        format: 'YYYY-MM-DD',
      },
    },
    {
      component: 'Switch',
      fieldName: 'isOpen',
      label: '是否开放',
      componentProps: {
        checkedValue: true,
        unCheckedValue: false,
        style: {
          width: '40px',
        },
      },
    },
  ];
}

// 表格列配置
export function useQuestionGridColumns(
  onActionClick?: OnActionClickFn<QuestionnaireVO>,
) {
  return [
    {
      field: 'id',
      minWidth: 70,
      title: '编号',
    },
    { field: 'title', title: '问卷标题', width: 200, showOverflow: true },
    { field: 'description', title: '问卷描述', width: 250, showOverflow: true },
    {
      field: 'type',
      title: '问卷类型',
      width: 120,
      slots: { default: 'type' },
    },
    {
      field: 'status',
      title: '状态',
      width: 100,
      slots: { default: 'status' },
    },
    { field: 'targetAudience', title: '目标受众', width: 120 },
    { field: 'estimatedDuration', title: '预计时长(分钟)', width: 120 },
    { field: 'accessCount', title: '访问次数', width: 100 },
    { field: 'completionCount', title: '完成次数', width: 100 },
    {
      field: 'isOpen',
      title: '是否开放',
      width: 100,
      slots: { default: 'isOpen' },
    },
    {
      field: 'validFrom',
      title: '有效期开始',
      width: 150,
      formatter: 'formatDate',
    },
    {
      field: 'validTo',
      title: '有效期结束',
      width: 150,
      formatter: 'formatDate',
    },
    { field: 'creator', title: '创建人', width: 100 },
    {
      field: 'createTime',
      title: '创建时间',
      width: 150,
      formatter: 'formatDateTime',
    },
    {
      field: 'operation',
      title: '操作',
      minWidth: 130,
      align: 'center',
      fixed: 'right', // 固定在右侧
      showOverflow: false, // 不显示溢出内容的省略号
      cellRender: {
        attrs: {
          nameField: 'id',
          nameTitle: '问卷',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'edit',
            show: true,
            // show: hasAccessByCodes(['evaluation:questionnaire:update']),
          },
          {
            code: 'delete',
            show: true,
            // show: hasAccessByCodes(['evaluation:questionnaire:delete']),
          },
        ],
      },
    },
  ];
}

// =============== 问卷结果配置 ====================

// export function useQuestionnaireResultGridFormSchema(
//   onActionClick?: OnActionClickFn<>,
// ) {

// }

// export function useQuestionnaireResultGridColumns(
//   onActionClick?: OnActionClickFn<QuestionnaireResultRespVO>,
// ) {
//   return [
//     {
//       title: '问卷标题',
//       dataIndex: 'questionnaireTitle',
//       width: 200,
//     },
//     {
//       title: '用户名称',
//       dataIndex: 'userName',
//       width: 100,
//     },
//     {}
//   ]
// }

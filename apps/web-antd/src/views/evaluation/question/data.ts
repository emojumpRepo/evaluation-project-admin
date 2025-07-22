import type { VbenFormSchema } from '#/adapter/form';

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
      disabled: true,
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
      disabled: true,
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
      disabled: true,
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
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
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
export function useQuestionGridColumns() {
  return [
    {
      field: 'id',
      minWidth: 70,
      title: '编号',
    },
    { field: 'title', title: '问卷标题', width: 200, showOverflow: true },
    {
      field: 'description',
      title: '问卷描述',
      width: 250,
      showOverflow: true,
      editRender: {
        name: 'VxeInput',
      },
    },
    {
      field: 'type',
      title: '问卷类型',
      width: 150,
      slots: { default: 'type' },
      editRender: {
        name: 'VxeSelect',
        componentProps: {
          options: QUESTIONNAIRE_TYPE_OPTIONS,
        },
        options: QUESTIONNAIRE_TYPE_OPTIONS,
      },
    },
    {
      field: 'status',
      title: '状态',
      width: 100,
      slots: { default: 'status' },
    },
    {
      field: 'targetAudience',
      title: '目标受众',
      width: 120,
      editRender: {
        name: 'VxeInput',
      },
    },
    { field: 'completionCount', title: '完成次数', width: 100 },
    {
      field: 'isOpen',
      title: '是否开放',
      width: 100,
      slots: { default: 'isOpen' },
    },
    {
      field: 'validFrom',
      title: '答题有效期开始',
      width: 180,
      formatter: 'formatDateTime',
      // editRender: {
      //   name: 'VxeDatePicker',
      //   componentProps: {
      //     type: 'datetime',
      //     format: 'YYYY-MM-DD HH:mm:ss',
      //     valueFormat: 'x',
      //     showTime: true,
      //   },
      // },
      // slots: { default: 'validFrom', edit: 'validFrom_edit' },
    },
    {
      field: 'validTo',
      title: '答题有效期结束',
      width: 180,
      formatter: 'formatDateTime',
      // editRender: {
      //   name: 'VxeDatePicker',
      //   props: {
      //     type: 'datetime',
      //     format: 'YYYY-MM-DD HH:mm:ss',
      //     valueFormat: 'x',
      //   },
      // },
      // slots: { default: 'validTo', edit: 'validTo_edit' },
    },
    { field: 'creator', title: '创建人', width: 100 },
    {
      field: 'createTime',
      title: '创建时间',
      width: 150,
      formatter: 'formatDateTime',
      resizable: false,
    },
    {
      field: 'operation',
      title: '操作',
      minWidth: 150,
      align: 'center',
      fixed: 'right', // 固定在右侧
      showOverflow: false, // 不显示溢出内容的省略号
      slots: { default: 'operation' },
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

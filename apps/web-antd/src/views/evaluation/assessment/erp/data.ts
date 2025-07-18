import type { VbenFormSchema } from '#/adapter/form';

import {
  ASSESSMENT_STATUS_OPTIONS,
  ASSESSMENT_TYPE_OPTIONS,
} from '#/api/emojump/constants';
import { DICT_TYPE, getDictOptions } from '#/utils';

// ===========  测评新增/修改/搜索表单 ====================

/** 新增/修改测评的表单 */
export function useAssessmentFormSchema(): VbenFormSchema[] {
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
      label: '测评标题',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入测评标题',
      },
    },
    {
      fieldName: 'type',
      label: '测评类型',
      rules: 'required',
      component: 'RadioGroup',
      componentProps: {
        options: getDictOptions(DICT_TYPE.SYSTEM_USER_SEX, 'number'),
        buttonStyle: 'solid',
        optionType: 'button',
      },
    },
    {
      fieldName: 'birthday',
      label: '出生日期',
      rules: 'required',
      component: 'DatePicker',
      componentProps: {
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
      },
    },
    {
      fieldName: 'description',
      label: '简介',
      rules: 'required',
      component: 'RichTextarea',
    },
  ];
}

/** 列表的搜索测评表单 */
export function useAssessmentGridFormSchema(): VbenFormSchema[] {
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
      label: '测评标题',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入测评标题',
      },
    },
    {
      fieldName: 'type',
      label: '类型',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: ASSESSMENT_STATUS_OPTIONS,
        placeholder: '请选择类型',
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: ASSESSMENT_TYPE_OPTIONS,
        placeholder: '请选择状态',
      },
    },
  ];
}

// ===========  测评列表 ====================

/** 列表的字段 */
export function useAssessmentGridColumns(
  onActionClick?: OnActionClickFn<AssessmentVO>,
) {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '测评编号',
    },
    {
      field: 'title',
      title: '测评标题',
    },
    {
      field: 'description',
      title: '测评简介',
    },
    {
      field: 'type',
      title: '测评类型',
    },
    {
      field: 'targetAudience',
      title: '目标人群',
    },
    {
      field: 'description',
      title: '描述',
    },
    {
      field: 'duration',
      title: '测评时长（分钟）',
    },
    {
      field: 'status',
      title: '状态',
    },
    {
      field: 'startTime',
      title: '开始时间',
    },
    {
      field: 'endTime',
      title: '结束时间',
    },
    {
      field: 'needAppointment',
      title: '是否需要预约',
    },
    {
      field: 'maxParticipants',
      title: '最大参与人数',
    },
    {
      field: 'currentParticipants',
      title: '当前参与人数',
    },
    {
      field: 'remark',
      title: '备注',
    },
    {
      field: 'createTime',
      title: '创建时间',
    },
    {
      field: 'operation',
      title: '操作',
      minWidth: 200,
      align: 'center',
      fixed: 'right', // 固定在右侧
      showOverflow: false, // 不显示溢出内容的省略号
    },
  ];
}

// ==================== 子表（测评结果） ====================

/** 测评结果的搜索表单 */
export function useAssessmentResultGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'assessmentId',
      label: '测评编号',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入测评编号',
      },
    },
    {
      fieldName: 'userId',
      label: '用户编号',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入用户编号',
      },
    },
  ];
}

/** 列表的字段 */
export function useAssessmentResultGridColumns() {
  return [
    { type: 'checkbox', width: 40 },
    {
      field: 'id',
      title: '结果编号',
    },
    {
      field: 'assessmentId',
      title: '测评编号',
    },
    {
      field: 'userId',
      title: '用户编号',
    },
    {
      field: 'overallScore',
      title: '总体得分',
    },
    {
      field: 'overallLever',
      title: '总体评级',
    },
    {
      field: 'overallResult',
      title: '总体测评报告',
    },
    {
      field: 'completeTime',
      title: '完成时间',
    },
    {
      field: 'operation',
      title: '操作',
      minWidth: 200,
      align: 'center',
      fixed: 'right',
      showOverflow: false,
    },
  ];
}

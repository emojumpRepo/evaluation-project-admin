import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn } from '#/adapter/vxe-table';
import type {
  AssessmentResultRespVO,
  AssessmentVO,
} from '#/api/evaluation/assessment/index';

// import { useAccess } from '@vben/access';
import {
  ASSESSMENT_STATUS_OPTIONS,
  ASSESSMENT_TYPE_OPTIONS,
} from '#/api/evaluation/constants';

// const { hasAccessByCodes } = useAccess();

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
      fieldName: 'description',
      label: '测评简介',
      component: 'Textarea',
    },
    {
      fieldName: 'questionnaires',
      label: '问卷列表',
      rules: 'required',
      component: 'EditTable',
      componentProps: {
        placeholder: '请选择问卷',
      },
    },
    {
      fieldName: 'type',
      label: '测评类型',
      rules: 'required',
      component: 'Select',
      componentProps: {
        options: ASSESSMENT_TYPE_OPTIONS,
      },
    },
    {
      fieldName: 'targetAudience',
      label: '目标人群',
      component: 'Input',
      componentProps: {
        placeholder: '请输入目标人群',
      },
    },
    {
      fieldName: 'duration',
      label: '测评时长（分钟）',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入测评时长（分钟）',
      },
    },
    {
      fieldName: 'startTime',
      label: '开始时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择开始时间',
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
      },
    },
    {
      fieldName: 'endTime',
      label: '结束时间',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择结束时间',
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
      },
    },
    {
      fieldName: 'needAppointment',
      label: '是否需要预约',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '是', value: true },
          { label: '否', value: false },
        ],
      },
    },
    {
      fieldName: 'maxParticipants',
      label: '最大参与人数',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入最大参与人数',
      },
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入备注',
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      rules: 'required',
      component: 'Select',
      componentProps: {
        options: ASSESSMENT_STATUS_OPTIONS,
      },
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
      label: '测评类型',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: ASSESSMENT_TYPE_OPTIONS,
        placeholder: '请选择测评类型',
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: ASSESSMENT_STATUS_OPTIONS,
        placeholder: '请选择测评状态',
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
    {
      field: 'id',
      minWidth: 70,
      title: '编号',
    },
    {
      field: 'title',
      minWidth: 180,
      title: '测评标题',
    },
    {
      field: 'description',
      minWidth: 220,
      title: '测评简介',
    },
    {
      field: 'type',
      minWidth: 180,
      title: '测评类型',
      slots: {
        default: 'type',
      },
    },
    {
      field: 'targetAudience',
      minWidth: 120,
      title: '目标人群',
    },
    {
      field: 'duration',
      minWidth: 120,
      title: '测评时长（分钟）',
    },
    {
      field: 'status',
      minWidth: 120,
      title: '状态',
      slots: {
        default: 'status',
      },
    },
    {
      field: 'startTime',
      minWidth: 150,
      title: '开始时间',
      formatter: 'formatDateTime',
    },
    {
      field: 'endTime',
      minWidth: 150,
      title: '结束时间',
      formatter: 'formatDateTime',
    },
    {
      field: 'needAppointment',
      minWidth: 120,
      title: '是否需要预约',
      slots: {
        default: 'needAppointment',
      },
    },
    {
      field: 'currentParticipants',
      minWidth: 120,
      title: '当前参与人数',
    },
    {
      field: 'maxParticipants',
      minWidth: 120,
      title: '最大参与人数',
    },
    {
      field: 'remark',
      minWidth: 120,
      title: '备注',
    },
    {
      field: 'createTime',
      minWidth: 150,
      title: '创建时间',
      formatter: 'formatDateTime',
    },
    {
      field: 'operation',
      title: '操作',
      minWidth: 180,
      align: 'center',
      fixed: 'right', // 固定在右侧
      showOverflow: false, // 不显示溢出内容的省略号
      cellRender: {
        attrs: {
          nameField: 'id',
          nameTitle: '测评',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'view',
            show: true,
            text: '查看',
          },
          {
            code: 'edit',
            show: true,
            // show: hasAccessByCodes(['evaluation:assessment:update']),
          },
          {
            code: 'delete',
            show: true,
            // show: hasAccessByCodes(['evaluation:assessment:delete']),
          },
        ],
      },
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
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: '进行中', value: 0 },
          { label: '已完成', value: 1 },
        ],
      },
    },
    {
      fieldName: 'completedTime',
      label: '完成时间',
      component: 'DatePicker',
      componentProps: {
        allowClear: true,
        placeholder: '请选择完成时间',
        showTime: true,
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
      },
    },
  ];
}

/** 列表的字段 */
export function useAssessmentResultGridColumns(
  onActionClick?: OnActionClickFn<AssessmentResultRespVO>,
) {
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
      align: 'center',
      fixed: 'right',
      showOverflow: false,
      cellRender: {
        attrs: {
          nameField: 'id',
          nameTitle: '测评结果',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'get',
            show: true,
            // show: hasAccessByCodes(['evaluation:assessment-result:get']),
          },
          {
            code: 'delete',
            show: true,
            // show: hasAccessByCodes(['evaluation:assessment-result:delete']),
          },
        ],
      },
    },
  ];
}

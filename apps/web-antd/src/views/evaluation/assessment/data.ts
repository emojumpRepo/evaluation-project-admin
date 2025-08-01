import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn } from '#/adapter/vxe-table';
import type { AssessmentVO } from '#/api/evaluation/assessment/index';

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
      fieldName: 'isRepeatable',
      label: '是否可重复测评',
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
    // {
    //   fieldName: 'status',
    //   label: '状态',
    //   rules: 'required',
    //   component: 'Select',
    //   componentProps: {
    //     options: ASSESSMENT_STATUS_OPTIONS,
    //   },
    // },
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
      field: 'isRepeatable',
      minWidth: 120,
      title: '是否可重复测评',
      slots: {
        default: 'isRepeatable',
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
      fieldName: 'assessmentTitle',
      label: '测评标题',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入测评标题',
      },
    },
    {
      fieldName: 'babyName',
      label: '宝宝姓名',
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入宝宝姓名',
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
  ];
}

/** 列表的字段 */
export function useAssessmentResultGridColumns() {
  return [
    {
      field: 'id',
      title: '编号',
      width: 70,
    },
    {
      field: 'assessmentTitle',
      title: '测评标题',
    },
    {
      field: 'babyName',
      title: '宝宝姓名',
    },
    {
      field: 'overallScore',
      title: '总体得分',
      slots: {
        default: 'overallScore',
      },
    },
    {
      field: 'overallLevel',
      title: '总体评级',
      slots: {
        default: 'overallLevel',
      },
    },
    {
      field: 'completedTime',
      title: '完成时间',
      slots: {
        default: 'completedTime',
      },
    },
    {
      field: 'status',
      title: '状态',
      slots: {
        default: 'status',
      },
    },
    {
      field: 'operation',
      title: '操作',
      align: 'center',
      fixed: 'right',
      showOverflow: false,
      width: 100,
      slots: {
        default: 'actions',
      },
    },
  ];
}

// ================== 子表（问卷结果） =====================
export function useQuestionnaireResultGridFormSchema() {
  return [
    {
      fieldName: 'assessmentTitle',
      label: '测评标题',
      component: 'Input',
      componentProps: {
        placeholder: '请输入测评标题',
        allowClear: true,
      },
    },
    {
      fieldName: 'questionnaireTitle',
      label: '问卷标题',
      component: 'Input',
      componentProps: {
        placeholder: '请输入问卷标题',
        allowClear: true,
      },
    },
    {
      fieldName: 'babyName',
      label: '宝宝姓名',
      component: 'Input',
      componentProps: {
        placeholder: '请输入宝宝姓名',
        allowClear: true,
      },
    },
  ];
}

export function useQuestionnaireResultGridColumns() {
  return [
    {
      title: '编号',
      field: 'id',
      width: 70,
    },
    {
      title: '测评标题',
      field: 'assessmentTitle',
    },
    {
      title: '问卷标题',
      field: 'questionnaireTitle',
    },
    {
      title: '宝宝姓名',
      field: 'babyName',
    },
    {
      title: '问卷得分',
      field: 'score',
      slots: { default: 'score' },
    },
    {
      title: '问卷评级',
      field: 'level',
      slots: { default: 'level' },
    },
    {
      title: '完成时间',
      field: 'completedTime',
      formatter: 'formatDateTime',
    },
    {
      title: '操作',
      fixed: 'right',
      field: 'actions',
      width: 100,
      slots: { default: 'actions' },
    },
  ];
}

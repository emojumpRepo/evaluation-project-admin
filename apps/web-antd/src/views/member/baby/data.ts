import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: '宝宝名字',
      component: 'Input',
    },
    {
      fieldName: 'mobile',
      label: '监护人手机号',
      component: 'Input',
    },
  ];
}

/** 列表的字段 */
export function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: '宝宝编号',
      width: 80,
    },
    {
      field: 'name',
      title: '宝宝名字',
      minWidth: 100,
    },
    {
      field: 'avatar',
      title: '头像',
      width: 80,
      slots: { default: 'avatar' },
    },
    {
      field: 'birthday',
      title: '宝宝生日',
      width: 120,
    },
    {
      field: 'gender',
      title: '性别',
      width: 60,
      slots: { default: 'gender' },
    },
    {
      field: 'height',
      title: '身高（cm）',
      width: 100,
    },
    {
      field: 'weight',
      title: '体重（kg）',
      width: 100,
    },
    {
      field: 'birthType',
      title: '生育方式',
      minWidth: 100,
    },
    {
      field: 'guardian',
      title: '带养人',
      minWidth: 100,
    },
    {
      field: 'createTime',
      title: '创建时间',
      width: 160,
      formatter: 'formatDateTime',
    },
    {
      field: 'action',
      title: '操作',
      width: 100,
      fixed: 'right',
      slots: { default: 'action' },
    },
  ];
}

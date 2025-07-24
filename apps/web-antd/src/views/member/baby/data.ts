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
    },
    {
      field: 'name',
      title: '宝宝名字',
    },
    {
      field: 'avatar',
      title: '头像',
      slots: { default: 'avatar' },
    },
    {
      field: 'birthday',
      title: '宝宝生日',
    },
    {
      field: 'gender',
      title: '性别',
      slots: { default: 'gender' },
    },
    {
      field: 'height',
      title: '身高（cm）',
    },
    {
      field: 'weight',
      title: '体重（kg）',
    },
    {
      field: 'birthType',
      title: '生育方式',
    },
    {
      field: 'guardian',
      title: '带养人',
    },
    {
      field: 'createTime',
      title: '创建时间',
      formatter: 'formatDateTime',
    },
  ];
}

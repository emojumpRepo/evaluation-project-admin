import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { ref } from 'vue';

import dayjs from 'dayjs';

import {
  ARTICLE_STATUS_OPTIONS,
  setCategoryOptionsCache,
} from '#/api/evaluation/article';
import { getArticleCategoryListSimple } from '#/api/evaluation/article-category';

// 动态分类选项
export const categoryOptions = ref<Array<{ label: string; value: number }>>([]);

/** 加载文章分类选项 */
export async function loadCategoryOptions() {
  try {
    const categories = await getArticleCategoryListSimple();
    categoryOptions.value = categories.map((item) => ({
      label: item.name,
      value: item.id as number,
    }));
    // 同步更新缓存，用于getArticleCategoryLabel函数
    setCategoryOptionsCache(categoryOptions.value);
    return categoryOptions.value;
  } catch {
    categoryOptions.value = [];
    setCategoryOptionsCache([]);
    return [];
  }
}

/** 新增/修改的表单 */
export function useFormSchema(): VbenFormSchema[] {
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
      label: '文章标题',
      rules: 'required',
      component: 'Input',
      componentProps: {
        placeholder: '请输入文章标题',
      },
    },
    {
      fieldName: 'coverImage',
      label: '文章封面',
      rules: 'required',
      component: 'ImageUpload',
    },
    {
      fieldName: 'content',
      label: '文章内容',
      rules: 'required',
      component: 'RichTextarea',
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Textarea',
    },
    {
      fieldName: 'categoryId',
      label: '文章分类',
      rules: 'required',
      component: 'Select',
      componentProps: {
        options: categoryOptions,
      },
    },
    {
      fieldName: 'publishTime',
      label: '发布时间',
      rules: 'required',
      component: 'DatePicker',
      defaultValue: dayjs(),
      componentProps: {
        showTime: true,
      },
    },
    {
      fieldName: 'status',
      label: '发布状态',
      rules: 'required',
      component: 'RadioGroup',
      defaultValue: 1,
      componentProps: {
        options: ARTICLE_STATUS_OPTIONS,
      },
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'categoryId',
      label: '文章分类',
      component: 'Select',
      componentProps: {
        options: categoryOptions,
      },
    },
    {
      fieldName: 'status',
      label: '发布状态',
      component: 'Select',
      componentProps: {
        options: ARTICLE_STATUS_OPTIONS,
      },
    },
  ];
}

/** 列表的字段 */
export function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      type: 'checkbox',
      width: 50,
    },
    {
      field: 'id',
      title: '文章编号',
    },
    {
      field: 'title',
      title: '文章标题',
    },
    {
      field: 'coverImage',
      title: '封面图',
      slots: { default: 'coverImage' },
    },
    {
      field: 'content',
      title: '文章内容',
    },
    {
      field: 'remark',
      title: '描述',
    },
    {
      field: 'categoryId',
      title: '分类',
      slots: { default: 'categoryId' },
    },
    {
      field: 'viewCount',
      title: '浏览量',
    },
    {
      field: 'status',
      title: '状态',
      slots: { default: 'status' },
    },
    {
      field: 'publishTime',
      title: '发布时间',
      formatter: 'formatDateTime',
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

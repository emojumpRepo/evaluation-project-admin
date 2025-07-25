import type { Dayjs } from 'dayjs';

import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace EmojumpArticleApi {
  export interface Article {
    id?: number;
    title: string;
    content: string;
    coverImage: string;
    category: string;
    remark: string;
    viewCount: number;
    status: number;
    publishTime: Dayjs | number;
  }
}

export const ARTICLE_CATEGORY_OPTIONS = [
  {
    label: '儿童发展与干预',
    value: '1',
  },
  {
    label: '儿童精神健康',
    value: '2',
  },
  {
    label: '膳食与健康',
    value: '3',
  },
  {
    label: '心理健康与生活方式',
    value: '4',
  },
];

export const ARTICLE_STATUS_OPTIONS = [
  { label: '草稿', value: 0 },
  { label: '发布', value: 1 },
  { label: '下架', value: 2 },
];

/** 获取文章类型标签 */
export const getArticleCategoryLabel = (value: string) => {
  return ARTICLE_CATEGORY_OPTIONS.find((item) => item.value === value)?.label;
};

/** 获取文章状态标签 */
export const getArticleStatusLabel = (value: number) => {
  return ARTICLE_STATUS_OPTIONS.find((item) => item.value === value)?.label;
};

// ========================= API =========================

/** 查询文章列表 */
export function getArticleList(params: PageParam) {
  return requestClient.get<PageResult<EmojumpArticleApi.Article>>(
    '/emojump/article/page',
    {
      params,
    },
  );
}

/** 查询文章详情 */
export function getArticleDetail(id: number) {
  return requestClient.get<EmojumpArticleApi.Article>(`/emojump/article/get`, {
    params: {
      id,
    },
  });
}

/** 新增文章 */
export function addArticle(data: EmojumpArticleApi.Article) {
  return requestClient.post('/emojump/article/create', data);
}

/** 编辑文章 */
export function editArticle(data: EmojumpArticleApi.Article) {
  return requestClient.put('/emojump/article/update', data);
}

/** 删除文章 */
export function deleteArticle(id: number) {
  return requestClient.delete(`/emojump/article/delete`, {
    params: {
      id,
    },
  });
}

/** 批量删除文章 */
export function deleteArticleBatch(ids: number[]) {
  return requestClient.delete(`/emojump/article/delete-batch`, {
    params: {
      ids,
    },
  });
}

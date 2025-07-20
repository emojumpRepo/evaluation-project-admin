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

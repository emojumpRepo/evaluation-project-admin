import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace EmojumpArticleCategoryApi {
  export interface ArticleCategory {
    id?: number;
    name: string;
    sort?: number;
  }
}

// ========================= API =========================

/** 查询文章分类列表（分页） */
export function getArticleCategoryPage(params: PageParam) {
  return requestClient.get<
    PageResult<EmojumpArticleCategoryApi.ArticleCategory>
  >('/emojump/article-category/page', {
    params,
  });
}

/** 查询文章分类详情 */
export function getArticleCategoryDetail(id: number) {
  return requestClient.get<EmojumpArticleCategoryApi.ArticleCategory>(
    `/emojump/article-category/get`,
    {
      params: {
        id,
      },
    },
  );
}

/** 查询所有文章分类（简单列表） */
export function getArticleCategoryListSimple() {
  return requestClient.get<EmojumpArticleCategoryApi.ArticleCategory[]>(
    '/emojump/article-category/list-all-simple',
  );
}

/** 新增文章分类 */
export function createArticleCategory(
  data: EmojumpArticleCategoryApi.ArticleCategory,
) {
  return requestClient.post('/emojump/article-category/create', data);
}

/** 编辑文章分类 */
export function updateArticleCategory(
  data: EmojumpArticleCategoryApi.ArticleCategory,
) {
  return requestClient.put('/emojump/article-category/update', data);
}

/** 删除文章分类 */
export function deleteArticleCategory(id: number) {
  return requestClient.delete(`/emojump/article-category/delete`, {
    params: {
      id,
    },
  });
}

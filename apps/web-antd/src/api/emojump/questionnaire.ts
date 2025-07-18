import { defHttp } from '#/utils/http';

export interface QuestionnaireVO {
  id?: number;
  title: string;
  description?: string;
  link: string;
  type: number;
  status?: number;
  targetAudience?: string;
  estimatedDuration?: number;
  accessCount?: number;
  completionCount?: number;
  isOpen?: boolean;
  validFrom?: string;
  validTo?: string;
  remark?: string;
  createTime?: string;
  creator?: string;
}

export interface QuestionnairePageReqVO {
  pageNo?: number;
  pageSize?: number;
  title?: string;
  status?: number;
  type?: number;
  isOpen?: boolean;
  createTime?: string[];
}

// 创建问卷
export const createQuestionnaire = (data: QuestionnaireVO) => {
  return defHttp.post<number>({
    url: '/emojump/questionnaire/create',
    data,
  });
};

// 更新问卷
export const updateQuestionnaire = (data: QuestionnaireVO) => {
  return defHttp.put<boolean>({
    url: '/emojump/questionnaire/update',
    data,
  });
};

// 删除问卷
export const deleteQuestionnaire = (id: number) => {
  return defHttp.delete<boolean>({
    url: '/emojump/questionnaire/delete',
    params: { id },
  });
};

// 获取问卷详情
export const getQuestionnaire = (id: number) => {
  return defHttp.get<QuestionnaireVO>({
    url: '/emojump/questionnaire/get',
    params: { id },
  });
};

// 获取问卷列表
export const getQuestionnaireList = (params: QuestionnairePageReqVO) => {
  return defHttp.get<{
    list: QuestionnaireVO[];
    total: number;
  }>({
    url: '/emojump/questionnaire/list',
    params,
  });
};

// 发布问卷
export const publishQuestionnaire = (id: number) => {
  return defHttp.post<boolean>({
    url: '/emojump/questionnaire/publish',
    params: { id },
  });
};

// 下线问卷
export const unpublishQuestionnaire = (id: number) => {
  return defHttp.post<boolean>({
    url: '/emojump/questionnaire/unpublish',
    params: { id },
  });
};

// 获取已发布问卷列表
export const getPublishedQuestionnaireList = (
  params: QuestionnairePageReqVO,
) => {
  return defHttp.get<{
    list: QuestionnaireVO[];
    total: number;
  }>({
    url: '/emojump/questionnaire/published',
    params,
  });
};

// 测试问卷链接
export const testQuestionnaireLink = (id: number) => {
  return defHttp.post<boolean>({
    url: '/emojump/questionnaire/test-link',
    params: { id },
  });
};

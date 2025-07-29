import { requestClient } from '#/api/request';

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
  validFrom?: number;
  validTo?: number;
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

export interface QuestionnaireResultVO {
  id?: number;
  assessmentResultId?: number;
  assessmentId?: number;
  babyId?: number;
  questionnaireId?: number;
  resultData?: string;
  answerData?: string;
  score?: number;
  level?: number;
  completionTime?: string;
}

export interface QuestionnaireResultPageReqVO {
  pageNo?: number;
  pageSize?: number;
  assessmentResultId?: number;
  assessmentId?: number;
  babyId?: number;
  questionnaireId?: number;
  level?: string;
  completionTime?: string[];
  createTime?: string[];
}

// 创建问卷
export const createQuestionnaire = (data: QuestionnaireVO) => {
  return requestClient.post('/emojump/questionnaire/create', data);
};

// 更新问卷
export const updateQuestionnaire = (data: QuestionnaireVO) => {
  return requestClient.put('/emojump/questionnaire/update', data);
};

// 删除问卷
export const deleteQuestionnaire = (id: number) => {
  return requestClient.delete(`/emojump/questionnaire/delete?id=${id}`);
};

// 获取问卷详情
export const getQuestionnaire = (id: number) => {
  return requestClient.get<QuestionnaireVO>(
    `/emojump/questionnaire/get?id=${id}`,
  );
};

// 获取问卷列表
export const getQuestionnaireList = (params: QuestionnairePageReqVO) => {
  return requestClient.get<{
    list: QuestionnaireVO[];
    total: number;
  }>('/emojump/questionnaire/list', { params });
};

// 发布问卷
export const publishQuestionnaire = (id: number) => {
  return requestClient.post(`/emojump/questionnaire/publish?id=${id}`);
};

// 暂停问卷
export const pauseQuestionnaire = (id: number) => {
  return requestClient.post(`/emojump/questionnaire/pause?id=${id}`);
};

// 获取已发布问卷列表
export const getPublishedQuestionnaireList = (
  params: QuestionnairePageReqVO,
) => {
  return requestClient.get<{
    list: QuestionnaireVO[];
    total: number;
  }>('/emojump/questionnaire/published', { params });
};

// 测试问卷链接
export const testQuestionnaireLink = (id: number) => {
  return requestClient.post(`/emojump/questionnaire/test-link?id=${id}`);
};

// 同步最新问卷数据
export const syncQuestionnaireData = () => {
  return requestClient.post('/emojump/questionnaire-sync/manual-sync');
};

// =============== 问卷结果 ===============
export const getQuestionnaireResultList = (
  params: QuestionnaireResultPageReqVO,
) => {
  return requestClient.get<{
    list: QuestionnaireResultVO[];
    total: number;
  }>('/emojump/questionnaire-result/page', { params });
};

// 获取问卷结果
export const getQuestionnaireResult = (id: number) => {
  return requestClient.get<QuestionnaireResultVO>(
    `/emojump/questionnaire-result/get?id=${id}`,
  );
};

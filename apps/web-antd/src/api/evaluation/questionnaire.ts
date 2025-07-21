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

export const getQuestionnaireList = (params: QuestionnairePageReqVO) => {
  return requestClient.get('/emojump/questionnaire/list', { params });
};

// 同步最新问卷数据
export const syncQuestionnaireData = () => {
  return requestClient.post('/emojump/questionnaire-sync/manual-sync');
};

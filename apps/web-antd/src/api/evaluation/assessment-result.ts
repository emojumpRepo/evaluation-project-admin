import { PageResult } from '@/api/model/baseModel';
import { defHttp } from '@/utils/http/axios';

export interface AssessmentResultVO {
  id?: number;
  assessmentId: number;
  assessmentTitle?: string;
  userId: number;
  username?: string;
  overallScore?: number;
  overallLevel?: string;
  overallReport?: string;
  completedTime?: string;
  status: number;
  createTime?: string;
  questionnaireResults?: QuestionnaireResultVO[];
}

export interface QuestionnaireResultVO {
  id?: number;
  questionnaireId: number;
  questionnaireTitle?: string;
  resultData?: string;
  score?: number;
  level?: string;
  report?: string;
  completedTime?: string;
}

export interface AssessmentResultPageReqVO {
  pageNo?: number;
  pageSize?: number;
  assessmentId?: number;
  userId?: number;
  status?: number;
  completedTime?: string[];
}

// 获得测评结果
export const getAssessmentResult = (id: number) => {
  return defHttp.get<AssessmentResultVO>({
    url: `/emojump/assessment-result/get?id=${id}`,
  });
};

// 获得测评结果分页
export const getAssessmentResultPage = (params: AssessmentResultPageReqVO) => {
  return defHttp.get<PageResult<AssessmentResultVO>>({
    url: '/emojump/assessment-result/page',
    params,
  });
};

// 导出测评结果
export const exportAssessmentResult = (params: AssessmentResultPageReqVO) => {
  return defHttp.download({
    url: '/emojump/assessment-result/export',
    params,
  });
};

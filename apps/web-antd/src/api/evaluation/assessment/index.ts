import { requestClient } from '#/api/request';

export interface AssessmentQuestionnaireVO {
  questionnaireId: number;
  sortOrder?: number;
  isRequired?: boolean;
  weight?: number;
}

export interface AssessmentVO {
  id?: number;
  title: string;
  description?: string;
  questionnaires: AssessmentQuestionnaireVO[];
  type: number;
  status?: number;
  targetAudience?: string;
  duration?: number;
  startTime?: string;
  endTime?: string;
  needAppointment?: boolean;
  maxParticipants?: number;
  currentParticipants?: number;
  remark?: string;
  createTime?: string;
  creator?: string;
}

export interface AssessmentPageReqVO {
  pageNo?: number;
  pageSize?: number;
  title?: string;
  status?: number;
  type?: number;
  questionnaireId?: number;
  createTime?: string[];
}

export interface AssessmentRespVO extends AssessmentVO {
  questionnaires: {
    estimatedDuration: number;
    isRequired: boolean;
    questionnaireDescription: string;
    questionnaireId: number;
    questionnaireTitle: string;
    sortOrder: number;
    weight: number;
  }[];
}

export interface AssessmentResultPageReqVO {
  pageNo?: number;
  pageSize?: number;
  assessmentId?: number;
  userId?: number;
  status?: number;
  completedTime?: string[];
}

export interface QuestionnaireResultRespVO {
  id: number;
  questionnaireId: number;
  questionnaireTitle: string;
  resultData: string;
  score: number;
  level: string;
  report: string;
  completedTime: string;
}

export interface AssessmentResultRespVO {
  id?: number;
  assessmentId: number;
  assessmentTitle: string;
  userId: number;
  userName: string;
  overallScore: number;
  overallLevel: string;
  overallReport: string;
  completedTime: string;
  status: number;
  createTime: string;
  questionnaireResults: QuestionnaireResultRespVO[];
}

// 创建测评
export const createAssessment = (data: AssessmentVO) => {
  return requestClient.post<number>('/emojump/assessment/create', data);
};

// 更新测评
export const updateAssessment = (data: AssessmentVO) => {
  return requestClient.put<boolean>('/emojump/assessment/update', data);
};

// 删除测评
export const deleteAssessment = (id: number) => {
  return requestClient.delete<boolean>('/emojump/assessment/delete', {
    params: {
      id,
    },
  });
};

// 获取测评详情
export const getAssessment = (id: number) => {
  return requestClient.get<AssessmentRespVO>(`/emojump/assessment/get`, {
    params: {
      id,
    },
  });
};

// 获取测评列表
export const getAssessmentList = (params: AssessmentPageReqVO) => {
  return requestClient.get<{
    list: AssessmentRespVO[];
    total: number;
  }>(`/emojump/assessment/list`, {
    params,
  });
};

// 发布测评
export const publishAssessment = (id: number) => {
  return requestClient.post<boolean>(`/emojump/assessment/publish`, {
    params: {
      id,
    },
  });
};

// 取消发布测评
export const unpublishAssessment = (id: number) => {
  return requestClient.post<boolean>(`/emojump/assessment/unpublish`, {
    params: {
      id,
    },
  });
};

// 获取可选择的问卷列表
export const getAvailableQuestionnaires = (params: any) => {
  return requestClient.get<{
    list: any[];
    total: number;
  }>(`/emojump/assessment/available-questionnaires`, {
    params,
  });
};

// 获取测评结果列表
export const getAssessmentResultPage = (params: AssessmentResultPageReqVO) => {
  return requestClient.get<{
    list: AssessmentResultRespVO[];
    total: number;
  }>(`/emojump/assessment-result/page`, {
    params,
  });
};

// 获取测评结果详情
export const getAssessmentResult = (id: number) => {
  return requestClient.get<AssessmentResultRespVO>(
    `/emojump/assessment-result/get`,
    {
      params: {
        id,
      },
    },
  );
};

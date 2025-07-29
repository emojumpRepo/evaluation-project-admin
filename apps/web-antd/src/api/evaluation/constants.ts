// 测评状态枚举
export const ASSESSMENT_STATUS = {
  DRAFT: 0,
  PUBLISHED: 1,
  ENDED: 2,
  CANCELLED: 3,
} as const;

export const ASSESSMENT_STATUS_OPTIONS = [
  { value: 0, label: '草稿', color: 'default' },
  { value: 1, label: '已发布', color: 'processing' },
  { value: 2, label: '已结束', color: 'error' },
  { value: 3, label: '已取消', color: 'warning' },
];

// 测评类型枚举
export const ASSESSMENT_TYPE = {
  CHILD_DEVELOPMENT: 1,
  BEHAVIOR_EVALUATION: 2,
  COGNITIVE_ASSESSMENT: 3,
  EMOTIONAL_ASSESSMENT: 4,
  SOCIAL_SKILLS: 5,
} as const;

export const ASSESSMENT_TYPE_OPTIONS = [
  { value: 1, label: '儿童发展测评' },
  { value: 2, label: '行为评估' },
  { value: 3, label: '认知能力测评' },
  { value: 4, label: '情感发展测评' },
  { value: 5, label: '社交技能测评' },
];

// 问卷状态枚举
export const QUESTIONNAIRE_STATUS = {
  DRAFT: 0,
  PUBLISHED: 1,
  OFFLINE: 2,
  ARCHIVED: 3,
} as const;

export const QUESTIONNAIRE_STATUS_OPTIONS = [
  { value: 0, label: '草稿', color: 'default' },
  { value: 1, label: '已发布', color: 'processing' },
  { value: 2, label: '已下线', color: 'error' },
  { value: 3, label: '已归档', color: 'warning' },
];

// 问卷类型枚举
export const QUESTIONNAIRE_TYPE = {
  CHILD_DEVELOPMENT: 1,
  BEHAVIOR_SURVEY: 2,
  COGNITIVE_TEST: 3,
  EMOTIONAL_SURVEY: 4,
  SOCIAL_ASSESSMENT: 5,
  PARENT_FEEDBACK: 6,
  TEACHER_EVALUATION: 7,
} as const;

export const QUESTIONNAIRE_TYPE_OPTIONS = [
  { value: 1, label: '儿童发展问卷' },
  { value: 2, label: '行为调查问卷' },
  { value: 3, label: '认知测试问卷' },
  { value: 4, label: '情感调查问卷' },
  { value: 5, label: '社交评估问卷' },
  { value: 6, label: '家长反馈问卷' },
  { value: 7, label: '教师评估问卷' },
];

// 获取状态标签
export const getStatusLabel = (
  status: number,
  type: 'assessment' | 'questionnaire',
) => {
  const options =
    type === 'assessment'
      ? ASSESSMENT_STATUS_OPTIONS
      : QUESTIONNAIRE_STATUS_OPTIONS;
  return options.find((item) => item.value === status)?.label || '未知状态';
};

// 获取状态颜色
export const getStatusColor = (
  status: number,
  type: 'assessment' | 'questionnaire',
) => {
  const options =
    type === 'assessment'
      ? ASSESSMENT_STATUS_OPTIONS
      : QUESTIONNAIRE_STATUS_OPTIONS;
  return options.find((item) => item.value === status)?.color || 'default';
};

// 获取类型标签
export const getTypeLabel = (
  type: number | string,
  category: 'assessment' | 'questionnaire',
) => {
  const options =
    category === 'assessment'
      ? ASSESSMENT_TYPE_OPTIONS
      : QUESTIONNAIRE_TYPE_OPTIONS;
  return (
    options.find((item) => item.value === Number(type))?.label || '未知类型'
  );
};

// =============== 问卷结果等级样式 ===============

export const LEVEL_COLOR_MAP: Record<
  string,
  { bg: string; color: string; icon: string; progressColor: string }
> = {
  正常范围: {
    color: 'text-green-600',
    bg: 'bg-green-50',
    icon: '🟢',
    progressColor: '#10b981',
  },
  可能抑郁: {
    color: 'text-red-600',
    bg: 'bg-red-50',
    icon: '🔴',
    progressColor: '#f87171',
  },
  需要提升: {
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    icon: '⚠️',
    progressColor: '#fb923c',
  },
  需关注: {
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    icon: '⚠️',
    progressColor: '#fb923c',
  },
  明显: {
    color: 'text-red-600',
    bg: 'bg-red-50',
    icon: '🔴',
    progressColor: '#f87171',
  },
  一般: {
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    icon: '🟡',
    progressColor: '#fbbf24',
  },
  正常: {
    color: 'text-green-600',
    bg: 'bg-green-50',
    icon: '🟢',
    progressColor: '#10b981',
  },
  优秀: {
    color: 'text-green-600',
    bg: 'bg-green-50',
    icon: '🟢',
    progressColor: '#34d399',
  },
  低风险: {
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    icon: '🟢',
    progressColor: '#60a5fa',
  },
  中度风险: {
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    icon: '🟡',
    progressColor: '#fbbf24',
  },
  高风险: {
    color: 'text-red-600',
    bg: 'bg-red-50',
    icon: '🔴',
    progressColor: '#f87171',
  },
  严重: {
    color: 'text-red-600',
    bg: 'bg-red-50',
    icon: '🔴',
    progressColor: '#ef4444',
  },
  中等: {
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    icon: '🟡',
    progressColor: '#fbbf24',
  },
  不足: {
    color: 'text-red-600',
    bg: 'bg-red-50',
    icon: '🔴',
    progressColor: '#ef4444',
  },
};

export type LevelType = 'bg' | 'color' | 'icon' | 'progressColor';

// 获取等级样式
export function getLevelClass(
  level: string,
  type: LevelType | LevelType[],
): string {
  const info = LEVEL_COLOR_MAP[level] || {
    color: 'text-gray-600',
    bg: 'bg-gray-50',
    icon: '📊',
    progressColor: '#1677ff',
  };
  return Array.isArray(type)
    ? type
        .map((t) => info[t] || '')
        .filter(Boolean)
        .join(' ')
    : info[type] || '';
}

import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/evaluation/assessment/detail',
    component: () => import('#/views/evaluation/assessment/detail.vue'),
    name: 'EvaluationAssessmentDetail',
    meta: {
      title: '测评详情',
      icon: 'lucide:file-text',
      hideInMenu: true,
    },
  },
];

export default routes;

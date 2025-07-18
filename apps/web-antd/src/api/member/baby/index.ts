import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace MemberBabyApi {
  export interface Baby {
    id?: number;
    user_id?: number;
    name: string;
    birthday: string;
    gender: number;
    height?: number;
    weight?: number;
    avatar: string;
    birth_type: string;
    guardian: string;
  }
}

/** 查询宝宝列表 */
export function getBabyList(params: PageParam) {
  return requestClient.get<PageResult<MemberBabyApi.Baby>>(
    '/member/baby/list',
    {
      params,
    },
  );
}

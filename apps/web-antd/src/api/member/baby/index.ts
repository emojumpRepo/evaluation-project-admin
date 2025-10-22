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

export namespace BabyFileApi {
  export interface BabyFile {
    id?: number;
    babyId: number;
    assessmentId?: number;
    fileId: number;
    fileName: string;
    fileType: string;
    fileSize: number;
    description?: string;
    uploadUserId: number;
    uploadUserName?: string;
    babyName?: string;
    assessmentTitle?: string;
    fileUrl?: string;
    createTime: string;
  }

  export interface FileCreateReq {
    babyId: number;
    assessmentId?: number;
    fileUrl: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    description?: string;
  }

  export interface FileUpdateReq {
    id: number;
    description?: string;
  }

  export interface FilePageReq extends PageParam {
    babyId?: number;
    assessmentId?: number;
    fileName?: string;
    fileType?: string;
    uploadUserId?: number;
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

/** 上传宝宝附件 */
export function uploadBabyFile(data: BabyFileApi.FileCreateReq) {
  return requestClient.post<number>('/member/baby/file/upload', data);
}

/** 更新宝宝附件 */
export function updateBabyFile(data: BabyFileApi.FileUpdateReq) {
  return requestClient.put<boolean>('/member/baby/file/update', data);
}

/** 删除宝宝附件 */
export function deleteBabyFile(id: number) {
  return requestClient.delete<boolean>('/member/baby/file/delete', {
    params: { id },
  });
}

/** 获取宝宝附件详情 */
export function getBabyFile(id: number) {
  return requestClient.get<BabyFileApi.BabyFile>('/member/baby/file/get', {
    params: { id },
  });
}

/** 获取宝宝附件分页列表 */
export function getBabyFilePage(params: BabyFileApi.FilePageReq) {
  return requestClient.get<PageResult<BabyFileApi.BabyFile>>(
    '/member/baby/file/page',
    {
      params,
    },
  );
}

/** 根据宝宝ID获取附件列表 */
export function getBabyFileListByBabyId(babyId: number) {
  return requestClient.get<BabyFileApi.BabyFile[]>(
    '/member/baby/file/list-by-baby',
    {
      params: { babyId },
    },
  );
}

/** 批量删除宝宝附件 */
export function deleteBabyFileBatch(ids: number[]) {
  return requestClient.delete<boolean>('/member/baby/file/batch-delete', {
    data: ids,
  });
}

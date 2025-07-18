import type { PageResult } from '@vben/request';

import type {
  Carousel,
  CarouselPageParmas,
  Policy,
  PolicyPageParmas,
} from '#/views/system/platform/types';

import { requestClient } from '#/api/request';

/** ===== 轮播图 接口 ===== */

/** 查询轮播图列表 */
export function getCarouselPage(params: CarouselPageParmas) {
  return requestClient.get<PageResult<Carousel>>('/system/carousel/page', {
    params,
  });
}

/** 查询轮播图详情 */
export function getCarousel(id: number) {
  return requestClient.get<Carousel>(`/system/carousel/get?id=${id}`);
}

/** 新增轮播图 */
export function createCarousel(data: Carousel) {
  return requestClient.post('/system/carousel/create', data);
}

/** 修改轮播图 */
export function updateCarousel(data: Carousel) {
  return requestClient.put('/system/carousel/update', data);
}

/** 删除轮播图 */
export function deleteCarousel(id: number) {
  return requestClient.delete(`/system/carousel/delete?id=${id}`);
}

/** ===== 协议 接口 ===== */

/** 查询协议列表 */
export function getPolicyPage(params: PolicyPageParmas) {
  return requestClient.get<PageResult<Policy>>('/system/policy/page', {
    params,
  });
}

/** 查询协议详情 */
export function getPolicy(id: number) {
  return requestClient.get<Policy>(`/system/policy/get?id=${id}`);
}

/** 新增协议 */
export function createPolicy(data: Policy) {
  return requestClient.post('/system/policy/create', data);
}

/** 修改协议 */
export function updatePolicy(data: Policy) {
  return requestClient.put('/system/policy/update', data);
}

/** 删除协议 */
export function deletePolicy(id: number) {
  return requestClient.delete(`/system/policy/delete?id=${id}`);
}

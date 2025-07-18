import type { PageParam } from '@vben/request';

// 首页设置 —— 轮播图类型
export interface BaseCarousel {
  title: string; // 标题
  remark: string; // 备注
  imageUrl: string; // 图片路径
  linkUrl: string; // 跳转链接
  sort: number; // 排序
  status: number; // 状态
}

export interface Carousel extends BaseCarousel {
  id: number; // 轮播图ID
  createTime: string; // 创建时间
}

export interface CarouselList {
  list: Carousel[];
  total: number;
}

export interface CarouselPageParmas extends PageParam {
  title?: string;
  status?: number;
  createTime?: string;
}

// 政策设置 —— 协议类型
export enum PolicyType {
  PRIVACY_POLICY = 'privacy_policy',
  SERVICE_AGREEMENT = 'service_agreement',
}

export const PolicyTypeLabelMap = {
  [PolicyType.PRIVACY_POLICY]: '隐私协议',
  [PolicyType.SERVICE_AGREEMENT]: '服务协议',
};

export interface BasePolicy {
  type: PolicyType; // 协议类型
  title: string; // 协议标题
  content: string; // 协议内容
  version: string; // 协议版本
  status: number; // 协议状态
  effectiveTime: string; // 生效时间
  remark: string; // 备注
}

export interface Policy extends BasePolicy {
  id: number;
  createTime: string;
}

export interface PolicyList {
  list: Policy[];
  total: number;
}

export interface PolicyPageParmas extends PageParam {
  type: string;
  title: string;
  status: number;
  createTime: string;
}

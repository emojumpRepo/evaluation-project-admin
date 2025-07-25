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

// 轮播图表单值类型
export interface CarouselFormValues {
  id?: number; // 轮播图ID (编辑时存在)
  title: string; // 标题
  subtitle?: string; // 副标题
  type: number; // 类型：1-跳转链接, 2-弹窗
  imageUrl: string; // 图片路径
  linkUrl?: string; // 跳转链接 (type=1时)
  popupContent?: string; // 弹窗内容 (type=2时)
  sort: number; // 排序
  status: number; // 状态
  remark?: string; // 备注
  createTime?: string; // 创建时间
}

export interface Carousel extends BaseCarousel {
  id: number; // 轮播图ID
  createTime: string; // 创建时间
  subtitle?: string; // 副标题
  type: number; // 类型：1-跳转链接, 2-弹窗
  popupContent?: string; // 弹窗内容
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

/**
 * 默认图片类型
 */
export const defaultImageAccepts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

/**
 * MIME 类型到文件扩展名的映射
 */
const mimeToExtensions: Record<string, string[]> = {
  'application/pdf': ['pdf'],
  'application/msword': ['doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    'docx',
  ],
  'application/vnd.ms-excel': ['xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['xlsx'],
  'image/jpeg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'image/gif': ['gif'],
  'image/webp': ['webp'],
};

export function checkFileType(file: File, accepts: string[]) {
  if (!accepts || accepts.length === 0) {
    return true;
  }

  // 将 accepts 数组转换为扩展名数组
  const extensions: string[] = [];

  for (const accept of accepts) {
    // 如果是 MIME 类型（包含 '/'）
    if (accept.includes('/')) {
      // 1. 首先检查文件的 MIME 类型是否匹配
      if (file.type === accept) {
        return true;
      }
      // 2. 如果 MIME 类型不匹配，获取对应的扩展名进行检查
      const exts = mimeToExtensions[accept];
      if (exts) {
        extensions.push(...exts);
      }
    } else {
      // 如果是扩展名（不包含 '/'）
      extensions.push(accept.replace(/^\./, '')); // 移除开头的点
    }
  }

  // 如果有扩展名需要检查，检查文件扩展名（避免使用动态正则以通过 lint）
  if (extensions.length > 0) {
    const lastDotIndex = file.name.lastIndexOf('.');
    if (lastDotIndex === -1) return false;
    const fileExt = file.name.slice(lastDotIndex + 1).toLowerCase();
    return extensions.some((ext) => ext.toLowerCase() === fileExt);
  }

  return false;
}

export function checkImgType(
  file: File,
  accepts: string[] = defaultImageAccepts,
) {
  return checkFileType(file, accepts);
}

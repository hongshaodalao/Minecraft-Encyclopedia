const BASE = import.meta.env.BASE_URL;

/** 拼接图片路径，自动适配 GitHub Pages 子目录 */
export function imagePath(category: string, imageId: string): string {
  return `${BASE}images/${category}/${imageId}.webp`;
}

import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import {Camera, Color, Point} from "@/types/canvas";

const COLORS = [
  "#DC2626",
  "#D97706",
  "#059669",
  "#7C3AED",
  "#DB2777",
]

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function connectionIdToColor(connectionId: number): string {
  return COLORS[connectionId % COLORS.length];
}

export function pointerEventToCanvasPoint(e: React.PointerEvent, camera: Camera) {
  return {
    x: Math.round(e.clientX) - camera.x,
    y: Math.round(e.clientY) - camera.y,
  }
}

/**rgb转换为16进制*/
export function colorToCss(color: Color){
  // 将RGB值转换为16进制字符串，并确保每个值都是两位数
  const hexR = color.r.toString(16).padStart(2, '0');
  const hexG = color.g.toString(16).padStart(2, '0');
  const hexB = color.b.toString(16).padStart(2, '0');

  // 返回完整的16进制颜色代码
  return `#${hexR}${hexG}${hexB}`;
}

/**
 * @module policies
 * @description 一些预定义的重排序策略
 * @file reorder.ts
 */

import { ReorderItem } from '../data/policy'

/**
 * 按照文件名的字典序重排序
 */
function reorder_by_name(items: ReorderItem[]) {
  return items.sort((a, b) => a.value.localeCompare(b.value))
}

/**
 * 按照文件名的字典序重排序的函数体
 */
const reorder_by_name_func = `return (${reorder_by_name.toString()})(items)`

export { reorder_by_name_func }

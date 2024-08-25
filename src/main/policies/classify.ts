/**
 * @file classify.ts
 * @description 分类策略，对应 ClassificationPolicy 类的 func_str 字段，
 * 包含了一些分类策略的实现
 * @module policies
 */

/**
 * 按照正则表达式分类
 */
function classify_by_regex(data: string, regex: string): string {
  const re = new RegExp(regex)
  const match = data.match(re)
  if (match) {
    return match[0]
  } else {
    return '其他'
  }
}

/**
 * 生成按照正则表达式分类的函数体
 * @param regex 正则表达式
 */
function gen_classify_by_regex_func(regex: string): string {
  return `return (${classify_by_regex.toString()})(data, '${regex}')`
}

export { gen_classify_by_regex_func }

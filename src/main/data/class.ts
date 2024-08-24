/**
 * 分类字段类型，用于区分不同的分类字段
 */
enum ClassificationFieldType {
  // 图片文件名称
  PHOTO_NAME,

  // 图片的 Exif 信息
  PHOTO_EXIF_INFO,

  // 图片的属性
  PHOTO_PROPERTY,

  // 图片的内容
  PHOTO_CONTENT
}

/**
 * 分类数据，存储一些分类策略
 */
class ClassificationPolicy {
  /**
   * 构造函数
   * @param field_type 字段类型
   * @param field_name 字段名称，若字段类型为 [PHOTO_NAME, PHOTO_CONTENT] 则该字段无效
   * @param func_str 分类函数的字符串形式，
   * 该函数参数为一个字符串（若字段类型 PHOTO_CONTENT 则为 base64 字符串），
   * 返回值为 Promise<string>，表示分类的结果
   */
  constructor(
    private readonly field_type: ClassificationFieldType,
    private readonly field_name: string,
    private readonly func_str: string
  ) {}

  serialize(): string {
    return JSON.stringify({
      field_type: this.field_type,
      field_name: this.field_name,
      func_str: this.func_str
    })
  }

  deserialize(str: string): ClassificationPolicy {
    const obj = JSON.parse(str)
    return new ClassificationPolicy(obj.field_type, obj.field_name, obj.func_str)
  }
}

/**
 * 重排序数据项
 */
class ReorderItem {
  /**
   * 构造函数
   * @param id id
   * @param value 字段值
   */
  constructor(
    private readonly id: string,
    private readonly value: string
  ) {}

  serialize(): string {
    return JSON.stringify({
      id: this.id,
      value: this.value
    })
  }

  deserialize(str: string): ReorderItem {
    const obj = JSON.parse(str)
    return new ReorderItem(obj.id, obj.value)
  }
}

class ReorderPolicy {
  /**
   * 构造函数
   * @param func_str 重排序函数的字符串形式，
   * 该函数参数为 ReorderItem[]，
   * 返回值为 Promise<ReorderItem[]>，表示重排序的结果
   */
  constructor(private readonly func_str: string) {}

  serialize(): string {
    return JSON.stringify({
      func_str: this.func_str
    })
  }

  deserialize(str: string): ReorderPolicy {
    const obj = JSON.parse(str)
    return new ReorderPolicy(obj.func_str)
  }
}

export default {
  ClassificationFieldType,
  ClassificationPolicy,
  ReorderItem,
  ReorderPolicy
}

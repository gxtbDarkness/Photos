abstract class Serializable {
  /**
   * 将对象序列化为 JSON 字符串
   */
  serialize(): string {
    return JSON.stringify(this.serialize_json())
  }

  /**
   * 将对象序列化为 JSON 对象
   */
  abstract serialize_json(): object
}

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
class ClassificationPolicy extends Serializable {
  /**
   * 构造函数
   * @param field_type 字段类型
   * @param field_name 字段名称，若字段类型为 [PHOTO_NAME, PHOTO_CONTENT] 则该字段无效
   * @param func_str 分类函数的字符串形式，
   * 该函数参数为一个名为 data 的字符串（若字段类型 PHOTO_CONTENT 则为 base64 字符串），
   * 返回值为 Promise<string>，表示分类的结果。
   */
  constructor(
    public readonly field_type: ClassificationFieldType,
    public readonly field_name: string,
    public readonly func_str: string
  ) {
    super()
  }

  /**
   * 执行分类策略
   * @param data 数据
   */
  evaluate(data: string): Promise<string> {
    const func = new Function('data', this.func_str)
    return Promise.resolve(func(data))
  }

  serialize_json(): object {
    return {
      field_type: this.field_type,
      field_name: this.field_name,
      func_str: this.func_str
    }
  }

  /**
   * 反序列化
   * @param str JSON 字符串
   */
  static deserialize(str: string): ClassificationPolicy {
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
    public readonly id: string,
    public readonly value: string
  ) {}
}

/**
 * 重排序策略
 */
class ReorderPolicy extends Serializable {
  /**
   * 构造函数
   * @param func_str 重排序函数的字符串形式，
   * 该函数参数为 items: ReorderItem[]，
   * 返回值为 Promise<ReorderItem[]>，表示重排序的结果
   * 若为 null，则表示不需要重排序，按照原有顺序输出
   */
  constructor(public readonly func_str: string | null) {
    super()
  }

  /**
   * 执行重排序策略
   * @param items 数据项
   */
  evaluate(items: ReorderItem[]): Promise<ReorderItem[]> {
    if (this.func_str === null) {
      return Promise.resolve(items)
    }
    const func = new Function('items', this.func_str)
    return Promise.resolve(func(items))
  }

  serialize_json(): object {
    return {
      func_str: this.func_str
    }
  }

  /**
   * 反序列化
   * @param str JSON 字符串
   */
  static deserialize(str: string): ReorderPolicy {
    const obj = JSON.parse(str)
    return new ReorderPolicy(obj.func_str)
  }
}

/**
 * 分类重排序策略，分类然后对分类名称进行重排序
 */
class ClassificationReorderPolicy extends Serializable {
  /**
   * 构造函数
   * @param classification_policies 分类策略
   * @param reorder_policy 重排序策略
   */
  constructor(
    public readonly classification_policies: ClassificationPolicy,
    public readonly reorder_policy: ReorderPolicy
  ) {
    super()
  }

  serialize_json(): object {
    return {
      classification_policies: this.classification_policies.serialize_json(),
      reorder_policy: this.reorder_policy.serialize_json()
    }
  }

  /**
   * 反序列化
   * @param str JSON 字符串
   */
  static deserialize(str: string): ClassificationReorderPolicy {
    const obj = JSON.parse(str)
    return new ClassificationReorderPolicy(
      ClassificationPolicy.deserialize(JSON.stringify(obj.classification_policies)),
      ReorderPolicy.deserialize(JSON.stringify(obj.reorder_policy))
    )
  }
}

/**
 * 策略，n 个分类重排序策略和一个重排序策略
 */
class Policies extends Serializable {
  /**
   * 构造函数
   * @param classification_reorder_policies 分类重排序策略，对应 n 个分类
   * @param reorder_policy 重排序策略，对应最后一次分类之后所有照片的重排序
   */
  constructor(
    public readonly classification_reorder_policies: ClassificationReorderPolicy[],
    public readonly reorder_policy: ReorderPolicy
  ) {
    super()
  }

  serialize_json(): object {
    return {
      classification_reorder_policies: this.classification_reorder_policies.map((policy) =>
        policy.serialize_json()
      ),
      reorder_policy: this.reorder_policy.serialize_json()
    }
  }

  /**
   * 反序列化
   * @param str JSON 字符串
   */
  static deserialize(str: string): Policies {
    const obj = JSON.parse(str)
    return new Policies(
      obj.classification_reorder_policies.map((policy: object) =>
        ClassificationReorderPolicy.deserialize(JSON.stringify(policy))
      ),
      ReorderPolicy.deserialize(JSON.stringify(obj.reorder_policy))
    )
  }
}

export {
  ClassificationFieldType,
  ClassificationPolicy,
  ReorderItem,
  ReorderPolicy,
  ClassificationReorderPolicy,
  Policies
}

/**
 * @file policy.ts
 * @description 分类重排序策略，这里是需要持久化的数据
 * @module data
 */

/**
 * 序列化类，所有需要序列化的类都需要继承该类
 */
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
 * 一个用于分类或重排序的单参数函数
 * @template T 函数的参数类型
 * @template R 函数的返回值类型
 */
class PolicyFunction<T, R> extends Serializable {
  /**
   * 构造函数
   * @param type 类型，用于在前端区分不同类型的函数
   * @param arg 函数的参数
   * @param func_str 函数体的字符串形式
   * @example
   * ```typescript
   * const func1 = new PolicyFunction<string, string>('后缀名', 'file_name', 'file_name.split('.')[1]')
   * const func2 = new PolicyFunction<ReorderItem[], ReorderItem[]>('按字典序', 'items', 'items.sort((a, b) => a.value.localeCompare(b.value))')
   * ```
   */
  constructor(
    public readonly type: string,
    public readonly arg: string,
    public readonly func_str: string
  ) {
    super()
  }

  /**
   * 执行函数
   */
  evaluate(data: T): R {
    const func = new Function(...this.arg, this.func_str)
    return func(data)
  }

  serialize_json(): object {
    return {
      type: this.type,
      arg: this.arg,
      func_str: this.func_str
    }
  }

  /**
   * 反序列化
   * @param str JSON 字符串
   */
  static deserialize<T, R>(str: string): PolicyFunction<T, R> {
    const obj = JSON.parse(str)
    return new PolicyFunction(obj.type, obj.arg, obj.func_str)
  }
}

/**
 * 分类字段类型，用于区分不同的分类字段
 */
enum ClassificationFieldType {
  // 图片文件名称，即文件名（包括后缀）
  PHOTO_NAME,

  // 图片的 Exif 信息
  PHOTO_EXIF_INFO,

  // 图片的属性
  PHOTO_PROPERTY,

  // 图片的内容
  PHOTO_CONTENT
}

/**
 * 分类策略
 */
class ClassificationPolicy extends Serializable {
  /**
   * 构造函数
   * @param field_type 字段类型
   * @param field_name 字段名称，若字段类型为 `PHOTO_NAME` 或 `PHOTO_CONTENT` 则该字段无效
   * @param func 一个用于分类的函数，为 `PolicyFunction<string, string>` 类型
   * 该函数参数为一个名为 `data` 的字符串（若字段类型 `PHOTO_CONTENT` 则为 base64 字符串），
   * 返回值为字符串，表示分类的结果。
   * @see PolicyFunction
   */
  constructor(
    public readonly field_type: ClassificationFieldType,
    public readonly field_name: string,
    public readonly func: PolicyFunction<string, string>
  ) {
    super()
  }

  /**
   * 执行分类策略
   * @param data 数据
   */
  evaluate(data: string): Promise<string> {
    return Promise.resolve(this.func.evaluate(data))
  }

  serialize_json(): object {
    return {
      field_type: this.field_type,
      field_name: this.field_name,
      func: this.func.serialize_json()
    }
  }

  /**
   * 反序列化
   * @param str JSON 字符串
   */
  static deserialize(str: string): ClassificationPolicy {
    const obj = JSON.parse(str)
    const func = PolicyFunction.deserialize<string, string>(JSON.stringify(obj.func))
    return new ClassificationPolicy(obj.field_type, obj.field_name, func)
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
   * @param func 一个函数，
   * 该函数参数为 `items: ReorderItem[]`，
   * 返回值为 `ReorderItem[]`，表示重排序的结果
   * 若为 `null`，则表示不需要重排序，按照原有顺序输出
   */
  constructor(public readonly func: PolicyFunction<ReorderItem[], ReorderItem[]> | null) {
    super()
  }

  /**
   * 执行重排序策略
   * @param items 数据项
   */
  evaluate(items: ReorderItem[]): Promise<ReorderItem[]> {
    if (this.func === null) {
      return Promise.resolve(items)
    }
    return Promise.resolve(this.func.evaluate(items))
  }

  serialize_json(): object {
    return {
      func: this.func?.serialize_json()
    }
  }

  /**
   * 反序列化
   * @param str JSON 字符串
   */
  static deserialize(str: string): ReorderPolicy {
    const obj = JSON.parse(str)
    const func =
      obj.func === null
        ? null
        : PolicyFunction.deserialize<ReorderItem[], ReorderItem[]>(JSON.stringify(obj.func))
    return new ReorderPolicy(func)
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
  PolicyFunction,
  ClassificationFieldType,
  ClassificationPolicy,
  ReorderItem,
  ReorderPolicy,
  ClassificationReorderPolicy,
  Policies
}

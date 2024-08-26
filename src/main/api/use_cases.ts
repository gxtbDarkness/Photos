import { DAOs } from '../data/dao'
import { FileManager } from '../files/manager'
import { ReorderItem } from '../data/policy'

/**
 * 上下文，包含了 `DAOs` 和照片文件管理器
 * `DAO` 和 `FileManager` 分别对应数据存储库的 `meta` 文件夹和 `photos` 文件夹
 */
class Context implements WithContext {
  /**
   * 构造函数
   * @param daos 数据访问对象
   * @param file_manager 文件管理器
   */
  constructor(
    public readonly daos: DAOs,
    public readonly file_manager: FileManager
  ) {}

  context: Context = this
}

/**
 * 带有上下文的接口
 */
interface WithContext {
  context: Context
}

/**
 * 将照片导入到照片池中，并将信息存储到元数据中
 */
interface Import {
  /**
   * 导入照片文件，需要生成一个照片 uuid，并将照片文件和元数据存储到对应的文件夹中
   * @param ctx 上下文
   * @param file 照片文件
   * @returns 照片 uuid
   */
  (ctx: WithContext, file: File): Promise<string>

  /**
   * 导入照片文件，需要生成多个照片 uuid，并将照片文件和元数据存储到对应的文件夹中
   * @param ctx 上下文
   * @param files 多个照片
   * @returns 照片 uuid 数组
   */
  (ctx: WithContext, files: File[]): Promise<string[]>

  /**
   * 指定 uuid 导入照片文件，如果 uuid 已经存在，则报错
   * @param ctx 上下文
   * @param file 照片文件
   * @param uuid 照片 uuid
   */
  (ctx: WithContext, file: File, uuid: string): Promise<void>
}

/**
 * 根据 id 删除照片文件和对应的元数据
 */
interface Delete {
  /**
   * 删除照片文件
   * @param ctx 上下文
   * @param uuid 照片 uuid
   */
  (ctx: WithContext, uuid: string): Promise<void>
}

/**
 * 根据 id 获取照片文件
 */
interface Get {
  /**
   * 获取照片文件
   * @param ctx 上下文
   * @param uuid 照片 uuid
   * @returns 照片
   */
  (ctx: WithContext, uuid: string): Promise<File>
}

/**
 * 分类结果
 */
class ClassificationResult {
  /**
   * 构造函数
   * @param uuid 照片 uuid
   * @param classification 分类结果，为一个字符串数组，表示分类的路径
   */
  constructor(
    public readonly uuid: string,
    public readonly classification: string[]
  ) {}
}

/**
 * 根据元数据中存储的分类策略对照片进行分类
 */
interface Classify {
  /**
   * 对单个照片进行分类，返回分类结果
   * @param ctx 上下文
   * @param uuid 照片 uuid
   * @returns 分类结果
   * @see ClassificationResult
   */
  (ctx: WithContext, uuid: string): Promise<ClassificationResult>

  /**
   * 对多个照片进行分类，返回分类结果数组
   * @param ctx 上下文
   * @param uuids 照片 uuid 数组
   * @returns 分类结果数组
   * @see ClassificationResult
   */
  (ctx: WithContext, uuids: string[]): Promise<ClassificationResult[]>
}

/**
 * 根据元数据中存储的重排序策略对分类结果或者照片文件进行重排序
 */
interface Reorder {
  /**
   * 对分类结果或者照片进行重排序
   * @param ctx 上下文
   * @param items 一个带有 id 的数组，表示分类结果或者照片
   * @returns 重排序后的分类结果
   */
  (ctx: WithContext, items: ReorderItem[]): Promise<ReorderItem[]>
}

/**
 * 按照元数据中存储的分类策略对分类结果以及归档数据进行导出
 */
interface Export {
  /**
   * 导出分类结果
   * @param ctx 上下文
   * @param path 导出路径
   * @param manifest 是否导出归档数据
   * @param photos 是否导出照片
   */
  (ctx: WithContext, path: string, manifest: boolean, photos: boolean): Promise<void>
}

/**
 * 测试函数
 */
interface Test {
  /**
   * 测试函数，用来测试数据库连接等
   * @param ctx 上下文
   */
  (ctx: WithContext): void
}

export {
  Context,
  type WithContext,
  ClassificationResult,
  type Import,
  type Delete,
  type Get,
  type Classify,
  type Reorder,
  type Export,
  type Test
}

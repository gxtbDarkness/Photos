/**
 * @module files
 * @description 文件管理
 * @file manager.ts
 */

/**
 * 文件管理器接口
 *
 * 为了提升性能，文件管理器将传入的 UUID 转化为特定编码（改进的 base64 等），然后将其分为两级目录。
 *
 * base64 含有 `+` 和 `/` 字符，而文件系统中通常不允许使用这两个字符作为文件名，因此需要将其转化为其他字符，例如 `{` 和 `=`。
 *
 * 例如，若传入的 UUID 为 `01234567-89ab-cdef-0123-456789abcdef`，则去掉连字符后，
 * 将其转化为 base64 编码为 `ASNFZ4mrze8S6Pzlnu{gA`，然后分为两级目录，该文件将会被存储在 `AS/NF/` 下，
 * 文件名为 `ASNFZ4mrze8S6Pzlnu{gA` 加上拓展名。
 *
 * 注意传入的 UUID 不带 `-` 符号
 */
interface FileManager {
  /**
   * 打开一个文件夹
   * @param path 文件夹路径，即 photos 文件夹
   */
  open(path: string): Promise<void>

  /**
   * 判断文件夹是否已经打开
   */
  is_opened(): boolean

  /**
   * 关闭
   */
  close(): Promise<void>

  /**
   * 上传文件，文件名为 uuid 编码后加上拓展名
   * @see FileManager
   * @param file 文件
   * @param uuid 文件 uuid
   * @param extension 文件扩展名，例如 `.jpg`，还可以多级，例如 `.raw.thumbnail.jpg` 表示缩略图
   */
  upload(file: File, uuid: string, extension: string): Promise<void>

  /**
   * 删除文件
   * @param uuid 文件 uuid
   * @param extension 文件扩展名，例如 `.jpg`，还可以多级，例如 `.raw.thumbnail.jpg` 表示缩略图
   */
  delete(uuid: string, extension: string): Promise<void>

  /**
   * 删除某个 UUID 对应的所有文件
   * @param uuid 文件 uuid
   */
  delete_all(uuid: string): Promise<void>

  /**
   * 获取文件
   * @param uuid 文件 uuid
   * @param extension 文件扩展名，例如 `.jpg`，还可以多级，例如 `.raw.thumbnail.jpg` 表示缩略图
   */
  get(uuid: string, extension: string): Promise<File>

  /**
   * 获取文件路径
   * @param uuid 文件 id
   * @param extension 文件扩展名，例如 `.jpg`，还可以多级，例如 `.raw.thumbnail.jpg` 表示缩略图
   */
  path(uuid: string, extension: string): string
}

export { type FileManager }

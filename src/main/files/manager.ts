/**
 * @module files
 * @description 文件管理
 * @file manager.ts
 */
interface FileManager {
  /**
   * 上传文件
   * @param file 文件
   * @param id 文件 id
   */
  upload(file: File, id: string): Promise<void>

  /**
   * 删除文件
   * @param id 文件 id
   */
  delete(id: string): Promise<void>

  /**
   * 获取文件
   * @param id 文件 id
   */
  get(id: string): Promise<File>
}

export { type FileManager }

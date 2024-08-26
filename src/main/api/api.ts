import {
  Classify,
  Context,
  Delete,
  Export,
  Get,
  Import,
  Reorder,
  Test,
  WithContext
} from './use_cases'

/**
 * API 类，包含所有用例
 *
 * @example
 * ```typescript
 * const api = window.api
 *
 * api.open_repository(path)
 * api.Test(api.context)
 * ```
 */
class API implements WithContext {
  /**
   * 构造函数，初始化所有用例
   */
  constructor(
    readonly context: Context,
    public readonly Import: Import,
    public readonly Delete: Delete,
    public readonly Get: Get,
    public readonly Classify: Classify,
    public readonly Reorder: Reorder,
    public readonly Export: Export,
    public readonly Test: Test
  ) {}

  /**
   * 打开一个仓库
   * @param path 仓库路径
   */
  async open_repository(path: string) {
    await this.close_repository()

    await this.context.daos.open(path + '/meta')
    await this.context.file_manager.open(path + '/photos')
  }

  /**
   * 判断仓库是否已经打开
   */
  is_opened(): boolean {
    return this.context.daos.is_opened() && this.context.file_manager.is_opened()
  }

  /**
   * 关闭仓库
   */
  async close_repository() {
    await this.context.daos.close()
    await this.context.file_manager.close()
  }

  /**
   * 将 API 转换为暴露给渲染进程的 API
   */
  expose(): object {
    return {
      open_repository: this.open_repository.bind(this),
      is_opened: this.is_opened.bind(this),
      close_repository: this.close_repository.bind(this),
      import: this.Import.bind(this),
      delete: this.Delete.bind(this),
      get: this.Get.bind(this),
      classify: this.Classify.bind(this),
      reorder: this.Reorder.bind(this),
      export: this.Export.bind(this),
      test: this.Test.bind(this)
    }
  }
}

export { API }

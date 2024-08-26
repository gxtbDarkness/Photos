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
    await this.context.daos.open(path + '/meta')
    await this.context.file_manager.open(path + '/photos')
  }
}

export { API }

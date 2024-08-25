import {
  Classify,
  Context,
  Delete,
  Export,
  Get,
  Import,
  Open,
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
 * const ctx = api.open(path)
 * api.context = ctx
 *
 * const photos = api.test(api.context)
 * ```
 */
class API implements WithContext {
  /**
   * 构造函数，初始化所有用例
   */
  constructor(
    private readonly Open_: Open,
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
  open_repository(path: string) {
    this.context = this.Open_(path)
  }

  context: Context | null = null
}

export { type API }

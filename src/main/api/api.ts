import {
  Classify,
  Delete,
  Export,
  Get,
  Import,
  Open,
  Reorder, Test,
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
 * const photos = api.test(api)
 * ```
 */
interface API extends WithContext {
  open: Open
  import: Import
  delete: Delete
  get: Get
  classify: Classify
  reorder: Reorder
  export: Export
  test: Test
}

export { type API }

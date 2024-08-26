import { ClassificationResult, Context, WithContext } from '../use_cases'
import { ReorderItem } from '../../data/policy'
import { API } from '../api'
import { gen_fake_daos } from '../../data/impl/fake'
import { gen_fake_file_manager } from '../../files/impl/fake'

function fake_import(this: WithContext, file: File): Promise<string>
function fake_import(this: WithContext, files: File[]): Promise<string[]>
function fake_import(this: WithContext, file: File, id: string): Promise<void>
function fake_import(
  this: WithContext,
  arg1: File | File[],
  arg2?: string
): Promise<string> | Promise<string[]> | Promise<void> {
  if (arg1 instanceof File) {
    if (arg2) {
      return Promise.resolve()
    } else {
      return Promise.resolve('')
    }
  } else {
    return Promise.resolve([''])
  }
}

function fake_delete(this: WithContext, id: string): Promise<void> {
  return Promise.resolve()
}

function fake_get(this: WithContext, id: string): Promise<File> {
  return Promise.resolve(new File([], ''))
}

function fake_classify(this: WithContext, id: string): Promise<ClassificationResult>
function fake_classify(this: WithContext, ids: string[]): Promise<ClassificationResult[]>
function fake_classify(
  this: WithContext,
  arg: string | string[]
): Promise<ClassificationResult> | Promise<ClassificationResult[]> {
  if (typeof arg === 'string') {
    return Promise.resolve(new ClassificationResult('', ['']))
  } else {
    return Promise.resolve([new ClassificationResult('', [''])])
  }
}

function fake_reorder(this: WithContext, items: ReorderItem[]): Promise<ReorderItem[]> {
  return Promise.resolve(items)
}

function fake_export(
  this: WithContext,
  path: string,
  manifest: boolean,
  photos: boolean
): Promise<void> {
  return Promise.resolve()
}

function fake_test(this: WithContext): string {
  return 'test'
}

function gen_fake_api(): API {
  return new API(
    new Context(gen_fake_daos(), gen_fake_file_manager()),
    fake_import,
    fake_delete,
    fake_get,
    fake_classify,
    fake_reorder,
    fake_export,
    fake_test
  )
}

export { gen_fake_api }

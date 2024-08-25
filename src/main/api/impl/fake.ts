import { ClassificationResult, Context, WithContext } from '../use_cases'
import { ReorderItem } from '../../data/policy'
import { API } from '../api'

function fake_open(path: string): Context {}


function fake_import(ctx: WithContext, file: File): Promise<string>
function fake_import(ctx: WithContext, files: File[]): Promise<string[]>
function fake_import(ctx: WithContext, file: File, id: string): Promise<void>
function fake_import(ctx: WithContext, arg1: File | File[], arg2?: string): Promise<string> | Promise<string[]> | Promise<void> {
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

function fake_delete(ctx: WithContext, id: string): Promise<void> {
  return Promise.resolve()
}

function fake_get(ctx: WithContext, id: string): Promise<File> {
  return Promise.resolve(new File([], ''))
}


function fake_classify(ctx: WithContext, id: string): Promise<ClassificationResult>
function fake_classify(ctx: WithContext, ids: string[]): Promise<ClassificationResult[]>
function fake_classify(ctx: WithContext, arg: string | string[]): Promise<ClassificationResult> | Promise<ClassificationResult[]> {
  if (typeof arg === 'string') {
    return Promise.resolve(new ClassificationResult('', ['']))
  } else {
    return Promise.resolve([new ClassificationResult('', [''])])
  }
}


function fake_reorder(ctx: WithContext, items: ReorderItem[]): Promise<ReorderItem[]> {
  return Promise.resolve(items)
}
function fake_export(ctx: WithContext, path: string, manifest: boolean, photos: boolean): Promise<void> {
  return Promise.resolve()
}


function fake_test(ctx: WithContext): void {
}

function gen_fake_api(): API {
  return new API(
    fake_open,
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

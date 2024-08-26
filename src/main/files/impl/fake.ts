import { FileManager } from '../manager'

class FakeFileManager implements FileManager {
  delete(id: string): Promise<void> {
    return Promise.resolve()
  }

  delete_all(uuid: string): Promise<void> {
    return Promise.resolve(undefined)
  }

  open(path: string): Promise<void> {
    return Promise.resolve(undefined)
  }

  path(uuid: string, extension: string): string {
    return ''
  }

  get(uuid: string, extension: string): Promise<File> {
    return Promise.resolve(new File([], ''))
  }

  upload(file: File, uuid: string, extension: string): Promise<void> {
    return Promise.resolve(undefined)
  }
}

function gen_fake_file_manager(): FileManager {
  return new FakeFileManager()
}

export { FakeFileManager, gen_fake_file_manager }

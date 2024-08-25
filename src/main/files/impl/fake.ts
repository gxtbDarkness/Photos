import { FileManager } from '../manager'

class FakeFileManager implements FileManager {
  delete(id: string): Promise<void> {
    return Promise.resolve()
  }

  get(id: string): Promise<File> {
    return Promise.resolve(new File([], ''))
  }

  upload(file: File, id: string): Promise<void> {
    return Promise.resolve()
  }
}

export { FakeFileManager }

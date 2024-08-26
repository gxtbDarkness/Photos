import { DAOs, InfosDAO, SettingsDAO } from '../dao'
import { EXIFInfo, PhotoInfo } from '../info'
import { Policies, PolicyFunction, ReorderPolicy } from '../policy'

class FakeInfosDAO implements InfosDAO {
  delete(id: string): Promise<void> {
    return Promise.resolve(undefined)
  }

  insert(info: PhotoInfo): Promise<void> {
    return Promise.resolve(undefined)
  }

  query(id: string): Promise<PhotoInfo> {
    const exif_info = new EXIFInfo({})
    const info = new PhotoInfo(id, '', exif_info, '')
    return Promise.resolve(info)
  }

  query_all(): Promise<PhotoInfo[]> {
    return Promise.resolve([])
  }

  update(info: PhotoInfo): Promise<void> {
    return Promise.resolve(undefined)
  }

  close(): Promise<void> {
    return Promise.resolve(undefined)
  }

  is_opened(): boolean {
    return false
  }

  open(path: string): Promise<void> {
    return Promise.resolve(undefined)
  }
}

class FakeSettingsDAO implements SettingsDAO {
  get_policies(): Promise<Policies> {
    const reorder_policy = new ReorderPolicy(
      new PolicyFunction(
        '按字典序',
        'items',
        'items. sort((a, b) => a. value. localeCompare(b. value))'
      )
    )
    const policies = new Policies([], reorder_policy)
    return Promise.resolve(policies)
  }

  set_policies(policies: Policies): Promise<void> {
    return Promise.resolve(undefined)
  }

  close(): Promise<void> {
    return Promise.resolve(undefined)
  }

  get_by_key(key: string): Promise<string> {
    return Promise.resolve('')
  }

  is_opened(): boolean {
    return false
  }

  open(path: string): Promise<void> {
    return Promise.resolve(undefined)
  }

  set_by_key(key: string, value: string): Promise<void> {
    return Promise.resolve(undefined)
  }
}

class FakeDAOs implements DAOs {
  constructor(
    private _infos_dao: InfosDAO,
    private _settings_dao: SettingsDAO
  ) {}

  close(): Promise<void> {
    return Promise.resolve(undefined)
  }

  infos_dao(): InfosDAO {
    return this._infos_dao
  }

  is_opened(): boolean {
    return false
  }

  open(path: string): Promise<void> {
    return Promise.resolve(undefined)
  }

  settings_dao(): SettingsDAO {
    return this._settings_dao
  }
}

function gen_fake_daos(): DAOs {
  return new FakeDAOs(new FakeInfosDAO(), new FakeSettingsDAO())
}

export { gen_fake_daos }

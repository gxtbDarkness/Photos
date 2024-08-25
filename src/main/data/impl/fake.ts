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
}

function gen_fake_daos(): DAOs {
  return new DAOs(new FakeInfosDAO(), new FakeSettingsDAO())
}

export { gen_fake_daos }

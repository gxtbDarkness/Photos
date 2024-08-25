/**
 * @file dao.ts
 * @module data
 * @description 数据访问对象接口
 */

import { PhotoInfo } from './info'
import { Policies } from './policy'
import { gen_fake_daos } from './impl/fake'

/**
 * 数据访问对象接口，定义了数据访问对象的基本方法
 */
interface InfosDAO {
  /**
   * 插入一条数据
   * @param info 数据
   */
  insert(info: PhotoInfo): Promise<void>

  /**
   * 删除一条数据
   * @param id 数据 id
   */
  delete(id: string): Promise<void>

  /**
   * 更新一条数据
   * @param info 数据
   */
  update(info: PhotoInfo): Promise<void>

  /**
   * 查询所有数据
   */
  query_all(): Promise<PhotoInfo[]>

  /**
   * 查询一条数据
   * @param id 数据 id
   */
  query(id: string): Promise<PhotoInfo>
}

/**
 * 配置数据访问对象接口，访存排序及分类策略
 */
interface SettingsDAO {
  /**
   * 获取策略
   */
  get_policies(): Promise<Policies>

  /**
   * 设置策略
   * @param policies 策略
   */
  set_policies(policies: Policies): Promise<void>
}

/**
 * 所有 DAO 接口
 */
class DAOs {
  /**
   * 构造函数
   * @param infos 照片信息 DAO
   * @param settings 配置 DAO
   */
  constructor(
    public readonly infos: InfosDAO,
    public readonly settings: SettingsDAO
  ) {}
}

/**
 * DAOs 提供者
 */
class DAOsProvider {
  static path: string | null = null
  static daos: DAOs | null = null

  static open(path: string): DAOs {
    if (DAOsProvider.path === path && DAOsProvider.daos !== null) {
      return DAOsProvider.daos
    } else {
      // TODO: 创建 DAOs 实例
      // 现在先创建 fake DAOs
      return gen_fake_daos()
    }
  }
}

export { type InfosDAO, type SettingsDAO, DAOs, DAOsProvider }

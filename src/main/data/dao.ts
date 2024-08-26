/**
 * @file dao.ts
 * @module data
 * @description 数据访问对象接口
 */

import { PhotoInfo } from './info'
import { Policies } from './policy'

/**
 * 数据访问对象接口，定义了数据访问对象的基本方法
 */
interface InfosDAO {
  /**
   * 打开
   * @param path 元数据存储路径，即 meta 文件夹
   */
  open(path: string): Promise<void>

  /**
   * 是否已经打开
   */
  is_opened(): boolean

  /**
   * 插入一条数据
   * @param info 数据
   */
  insert(info: PhotoInfo): Promise<void>

  /**
   * 删除一条数据
   * @param uuid 照片 uuid
   */
  delete(uuid: string): Promise<void>

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
 * 配置数据访问对象接口，访存排序及分类策略，可能还有其他配置
 *
 * 需要持久化存储到磁盘，例如存储到 JSON 文件中
 */
interface SettingsDAO {
  /**
   * 打开
   * @param path 元数据存储路径，即 meta 文件夹
   */
  open(path: string): Promise<void>

  /**
   * 是否已经打开
   */
  is_opened(): boolean

  /**
   * 获取策略
   */
  get_policies(): Promise<Policies>

  /**
   * 设置策略
   * @param policies 策略
   */
  set_policies(policies: Policies): Promise<void>

  /**
   * 根据 key 获取值
   * @param key key
   */
  get_by_key(key: string): Promise<string>

  /**
   * 设置 key-value
   * @param key key
   * @param value value
   */
  set_by_key(key: string, value: string): Promise<void>
}

/**
 * 所有 DAO 接口
 */
interface DAOs {
  /**
   * 打开 DAOs
   * @param path 元数据存储路径，即 meta 文件夹
   */
  open(path: string): Promise<void>

  /**
   * 是否已经打开
   */
  is_opened(): boolean

  /**
   * 获取照片信息 DAO
   */
  infos_dao(): InfosDAO

  /**
   * 获取配置 DAO
   */
  settings_dao(): SettingsDAO
}

export { type InfosDAO, type SettingsDAO, type DAOs }

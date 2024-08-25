/**
 * @file info.ts
 * @description 图片信息相关的类，包括 EXIF 信息、图片信息等
 * @module data
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const imageThumbnail = require('image-thumbnail')
import EXIF from 'exif-js'

class EXIFInfo {
  /**
   * 构造函数
   * @param tag_record tag 的 key-value 形式
   */
  constructor(private readonly tag_record: Record<string, string> = {}) {}

  /**
   * 获取图片的 exif 信息
   * @param file 图片文件
   */
  static async from_file(file: File): Promise<EXIFInfo> {
    // 读取文件的二进制数据
    const buffer = await file.arrayBuffer()

    // 获取图片的 exif 信息
    const exif = EXIF.readFromBinaryFile(buffer)

    // 获取所有的 tag
    const tags = EXIF.getAllTags(exif)

    // 将 tags 转换为 key-value 形式
    const tag_record = {}
    for (const tag in tags) {
      tag_record[tag] = tags[tag].toString()
    }

    // 返回 EXIFData 实例
    return new EXIFInfo(tag_record)
  }

  /**
   * 获取 tag 的值
   * @param tag tag 的名称
   */
  get(tag: string): string | null {
    return this.tag_record[tag]
  }

  /**
   * 获取所有的 tag
   */
  get_all_tags(): Record<string, string> {
    return this.tag_record
  }

  /**
   * 将 tag 转换为 JSON 字符串
   */
  to_json(): string {
    return JSON.stringify(this.tag_record)
  }

  // TODO: 这里应该之后再补充可以获取的 tag，例如设备型号、拍摄时间等
}

/**
 * 代表一个照片的相关信息
 */
class PhotoInfo {
  /**
   * 构造函数
   * @param id id
   * @param file_name 文件名，包括后缀
   * @param exif_info exif 信息
   * @param thumbnail base64 编码的缩略图
   */
  constructor(
    public readonly id: string,
    public readonly file_name: string,
    public readonly exif_info: EXIFInfo,
    public readonly thumbnail: string
  ) {}

  /**
   * 获取照片信息
   * @param id id
   * @param file 文件
   */
  static async from_file(id: string, file: File): Promise<PhotoInfo> {
    // 获取 exif 信息
    const exif_info = await EXIFInfo.from_file(file)

    // 获取缩略图
    // const url = URL.createObjectURL(file)

    // 先尝试获取 exif 中的缩略图
    const exif_thumbnail = exif_info.get('ThumbnailImage')
    if (exif_thumbnail != null) {
      // 如果存在缩略图，则直接返回
      // TODO: 这里不知道 exif 中的缩略图是什么格式，暂时直接返回
      return new PhotoInfo(id, file.name, exif_info, exif_thumbnail)
    } else {
      // 否则生成缩略图
      // TODO: 生成缩略图
      // const generated_thumbnail = await imageThumbnail(url)
      const generated_thumbnail = ''
      return new PhotoInfo(id, file.name, exif_info, generated_thumbnail)
    }
  }
}

export { EXIFInfo, PhotoInfo }

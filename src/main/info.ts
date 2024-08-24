import EXIF from 'exif-js'

class EXIFData {
  /**
   * 构造函数
   * @param tag_record tag 的 key-value 形式
   */
  constructor(private readonly tag_record: Record<string, string> = {}) {}

  /**
   * 获取 tag 的值
   * @param tag tag 的名称
   */
  get(tag: string): string {
    return this.tag_record[tag]
  }

  /**
   * 获取所有的 tag
   */
  get_all_tags(): Record<string, string> {
    return this.tag_record
  }
}

/**
 * 获取图片的 exif 信息
 * @param file 图片文件
 */
function get_exif_data(file: File): Promise<EXIFData> {
  return file.arrayBuffer().then((buffer) => {
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
    return new EXIFData(tag_record)
  })
}

export { EXIFData, get_exif_data }

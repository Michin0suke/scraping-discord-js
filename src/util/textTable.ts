import textTable = require('text-table')
import { hankaku2Zenkaku } from './zenkaku2hankaku'

export const table = (arr: string[][]): string => {
  const hankakuTable = textTable(arr).replace(/ /g, '　')
  return hankaku2Zenkaku(hankakuTable)
}

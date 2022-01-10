import { runCode } from './run-code'

export type ArticleInfo = {
  title: string
  url: string
}

function assertArtistInfo (obj: any): asserts obj is ArticleInfo {
  if (!obj) throw new Error()
  if (typeof obj.title !== 'string') throw new Error('returnされたオブジェクトにtitleプロパティが含まれていないか、titleプロパティが文字列ではありません。')
  if (typeof obj.url !== 'string') throw new Error('returnされたオブジェクトにurlプロパティが含まれていないか、urlプロパティが文字列ではありません。')
}

function assertArtistInfoArr (obj: any): asserts obj is ArticleInfo[] {
  if (!Array.isArray(obj)) throw new Error('returnされたオブジェクトが配列ではありません。')
  obj.forEach(i => assertArtistInfo(i))
}

export const runScrapCode = async (code: string): Promise<ArticleInfo[]> => {
  const results: any = await runCode(code)
  assertArtistInfoArr(results)

  const trimmedResults = results.map(result => {
    return ({
      title: result.title.trim(),
      url: result.url.trim()
    })
  })
  return trimmedResults
}

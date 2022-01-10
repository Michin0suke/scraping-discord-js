import { runCode } from './run-code'

export type ArticleInfo = {
  title: string
  url: string
}

function assertArtistInfo (obj: any): asserts obj is ArticleInfo {
  if (!obj) throw new Error()
  if (typeof obj.title !== 'string') throw new Error()
  if (typeof obj.url !== 'string') throw new Error()
}

function assertArtistInfoArr (obj: any): asserts obj is ArticleInfo[] {
  if (!Array.isArray(obj)) throw new Error()
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

import fetch from 'node-fetch'
import cheerio from 'cheerio'

export const runCode = async (code: string) => {
  // eslint-disable-next-line no-new-func
  const asyncFunc = Function(`"use strict"; return async (fetch, cheerio) => { ${code} }`)()
  return asyncFunc(fetch, cheerio)
}

import fetch from 'node-fetch'
import cheerio from 'cheerio'
import * as RSSHub from 'rsshub'

RSSHub.init()

export const runCode = async (code: string) => {
  // eslint-disable-next-line no-new-func
  const asyncFunc = Function(`"use strict"; return async (fetch, cheerio, RSSHub) => { ${code} }`)()
  return asyncFunc(fetch, cheerio, RSSHub)
}

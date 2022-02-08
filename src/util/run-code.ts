import fetch from 'node-fetch'
import cheerio from 'cheerio'
import * as RSSHub from 'rsshub'
import { XMLParser } from 'fast-xml-parser'

RSSHub.init()
const xmlParser = new XMLParser()

export const runCode = async (code: string) => {
  // eslint-disable-next-line no-new-func
  const asyncFunc = Function(`"use strict"; return async (fetch, cheerio, RSSHub, xmlParser) => { ${code} }`)()
  return asyncFunc(fetch, cheerio, RSSHub, xmlParser)
}

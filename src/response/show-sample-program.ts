import { Message } from 'discord.js'

export const showSampleProgram = async (message: Message): Promise<boolean> => {
  if (!message.content.match(/^サンプル(プログラム|コード)?を表示/)) {
    return false
  }
  message.channel.send(SAMPLE)
  return true
}

export const SAMPLE = `プログラムのサンプルは以下の通りです。

1. up-station
\`\`\`js
const html = await fetch('https://upstation-ntv.com/archive-topic').then(res => res.text())
const $ = cheerio.load(html, null, false)
const arr = []
$('.article-box a').each((index, elem) => {
  arr.push({
    title: $('.article-title', elem).text(),
    url: $(elem).attr('href')
  })
})
return arr
\`\`\`

2. panora
\`\`\`js
const html = await fetch('https://panora.tokyo/').then(res => res.text())
const $ = cheerio.load(html, null, false)
const arr = []
$('.entry-title a').each((index, elem) => {
  arr.push({
    title: $(elem).text(),
    url: $(elem).attr('href')
  })
})
return arr
\`\`\`

3. はてブの「vtuber」キーワードで10人以上にブックマークされた最新記事を取得する
\`\`\`js
const html = await fetch('https://b.hatena.ne.jp/search/text?q=vtuber&users=10').then(res => res.text())
const $ = cheerio.load(html, null, false)
const arr = []
$('.centerarticle-entry-title').each((index, elem) => {
  arr.push({
    title: $('a', elem).text(),
    url: $('a', elem).attr('href')
  })
})
return arr
\`\`\`
`

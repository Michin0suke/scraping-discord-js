export function hankaku2Zenkaku (str: string): string {
  return str.replace(/[A-Za-z0-9]/g, function (s) {
    return String.fromCharCode(s.charCodeAt(0) + 0xFEE0)
  })
}

export function zenkaku2Hankaku (str: string): string {
  return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0)
  })
}

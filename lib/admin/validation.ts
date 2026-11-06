export function text(form: FormData, key: string, max = 200, required = false) {
  const value = String(form.get(key) ?? '').trim()
  if (value.length > max || (required && !value)) throw new Error(key)
  return value
}
export function slug(value: string) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) || value.length > 80) throw new Error('slug')
  return value
}
export function webUrl(value: string) {
  if (!value) return ''
  if (/^\/images\/[a-zA-Z0-9/_-]+\.(png|jpg|jpeg|webp|svg)$/.test(value)) return value
  if (/^\/media\/[a-z0-9-]+\.(png|jpg|webp)$/.test(value)) return value
  const url = new URL(value)
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('URL')
  return url.href
}
export function localDateToISO(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) throw new Error('date')
  const date = new Date(`${value}:00+09:00`)
  if (!Number.isFinite(date.getTime()) || new Date(date.getTime() + 9 * 3600000).toISOString().slice(0, 16) !== value) throw new Error('date')
  return date.toISOString()
}
export function translation(form: FormData, hasEnglish: boolean) {
  return !hasEnglish ? 'none' as const : form.get('reviewed') === 'on' ? 'reviewed' as const : 'needs_review' as const
}

export function linkUrl(value:string){
 if (/^\/(?!\/)[a-zA-Z0-9/?&=._#%+-]*$/.test(value) && !/%(?:2f|5c|0[ad])/i.test(value)) return value
 return webUrl(value)
}

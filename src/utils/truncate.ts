export const truncate = (text: string, limit: number) => {
  return text.length <= limit ? text : text.slice(0, limit - 3).trim() + '...'
}

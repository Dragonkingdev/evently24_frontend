export const useLastWorkspace = () => {
  const KEY = 'last_wid'
  const lastWid = useState('last_wid', () => {
    if (process.client) {
      const raw = localStorage.getItem(KEY)
      const id = raw ? parseInt(raw, 10) : null
      return Number.isFinite(id) ? id : null
    }
    return null
  })
  const setLast = (id) => {
    lastWid.value = id
    if (process.client && Number.isFinite(id)) localStorage.setItem(KEY, String(id))
  }
  return { lastWid, setLast }
}

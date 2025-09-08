// composables/useTheme.js
export function useTheme() {
  const theme = useState('theme', () => 'light')

  function apply(t) {
    theme.value = t
    if (process.client) {
      document.documentElement.setAttribute('data-theme', t)
      localStorage.setItem('theme', t)
      const meta = document.querySelector('meta[name="theme-color"]')
      if (meta) meta.setAttribute('content', t === 'dark' ? '#0f172a' : '#ffffff')
    }
  }

  function detect() {
    if (process.client) {
      const saved = localStorage.getItem('theme')
      if (saved === 'light' || saved === 'dark') return saved
      const prefersDark = typeof window !== 'undefined'
        && window.matchMedia
        && window.matchMedia('(prefers-color-scheme: dark)').matches
      return prefersDark ? 'dark' : 'light'
    }
    return 'light'
  }

  function toggle() {
    apply(theme.value === 'dark' ? 'light' : 'dark')
  }

  onMounted(() => apply(detect()))
  return { theme, apply, toggle }
}

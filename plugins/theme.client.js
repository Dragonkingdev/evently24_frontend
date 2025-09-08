// plugins/theme.client.js
export default defineNuxtPlugin(() => {
  const saved = localStorage.getItem('theme')
  const prefersDark = typeof window !== 'undefined'
    && window.matchMedia
    && window.matchMedia('(prefers-color-scheme: light)').matches
  const t = (saved === 'dark' || saved === 'light') ? saved : (prefersDark ? 'dark' : 'light')
  document.documentElement.setAttribute('data-theme', t)
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', t === 'dark' ? '#0f172a' : '#ffffff')
})

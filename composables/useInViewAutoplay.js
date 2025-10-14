// composables/useInViewAutoplay.js
export function useInViewAutoplay () {
  let io = null

  function setup () {
    destroy()
    const vids = Array.from(document.querySelectorAll('video[data-autoplay]'))
    vids.forEach(v => { v.muted = true; v.playsInline = true })
    io = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        const v = target
        if (isIntersecting) v.play?.().catch(()=>{})
        else v.pause?.()
      })
    }, { threshold: .6 })
    vids.forEach(v => io.observe(v))
  }

  function destroy () {
    if (io) {
      try { io.disconnect() } catch(e){}
      io = null
    }
  }

  return { setup, destroy }
}

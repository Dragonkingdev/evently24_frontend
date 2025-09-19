import { onMounted, onBeforeUnmount } from 'vue'

export function useAutoplayVideos(selector = 'video[data-autoplay]'){
  let io = null
  onMounted(()=>{
    const vids = Array.from(document.querySelectorAll(selector))
    vids.forEach(v=>{ v.muted = true; v.playsInline = true })
    io = new IntersectionObserver((entries)=>{
      entries.forEach(({target, isIntersecting})=>{
        if(isIntersecting){ target.play().catch(()=>{}) } else { target.pause() }
      })
    }, { threshold: .5 })
    vids.forEach(v=> io.observe(v))
  })
  onBeforeUnmount(()=>{ io?.disconnect() })
}

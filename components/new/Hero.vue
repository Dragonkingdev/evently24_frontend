<script setup lang="ts">
import { onMounted } from 'vue'
const region = useState<string>('region')

onMounted(() => {
  const heroCarousel = document.getElementById('featureCarousel')
  if (!heroCarousel) return
  // @ts-ignore
  //new bootstrap.Carousel(heroCarousel, { interval: 5000, ride: 'carousel' })
})
</script>

<template>
  <section class="hero py-3 py-md-4">
    <div class="container-fluid container-xxl">
      <div class="row align-items-center g-4">
        <div class="col-lg-6">
          <div class="eyebrow mb-2">Jetzt & demnächst in <span>{{ region }}</span></div>
          <h1 class="display-5 fw-bold">Entdecke Events, die <span class="text-primary">wirklich</span> zu dir passen.</h1>
          <p class="lead text-secondary">Von Stadtfest bis Techno-Nacht – scrolle dich durch Live-Videos, Highlights & personalisierte Empfehlungen. Tickets direkt sichern oder teilen.</p>
          <div class="d-flex gap-2">
            <button class="btn btn-brand btn"><i class="bi bi-ticket-perforated"></i> Jetzt Tickets finden</button>
            <button class="btn btn-outline-primary btn" data-bs-toggle="modal" data-bs-target="#regionModal"><i class="bi bi-geo"></i> Region ändern</button>
          </div>
          <div class="mt-3 d-flex flex-wrap gap-2">
            <span class="category-pill active">Heute Abend</span>
            <span class="category-pill">Dieses Wochenende</span>
            <span class="category-pill">Für dich</span>
            <span class="category-pill">Familie</span>
            <span class="category-pill">Open Air</span>
            <span class="category-pill">Nightlife</span>
          </div>
        </div>

        <div class="col-lg-6">
          <div id="featureCarousel" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-indicators">
              <button type="button" data-bs-target="#featureCarousel" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#featureCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
              <button type="button" data-bs-target="#featureCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
            </div>
            <div class="carousel-inner rounded-4 shadow-lg">
              <div class="carousel-item active">
                <div class="position-relative">
                  <video class="w-100" playsinline muted loop preload="metadata" poster="https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1200&auto=format&fit=crop">
                    <source src="https://cdn.coverr.co/videos/coverr-people-at-a-concert-2924/1080p.mp4" type="video/mp4">
                  </video>
                  <div class="caption-grad">
                    <h5 class="mb-1">Castle Beats Festival</h5>
                    <p class="mb-2">Burg Ehrenfels • 27–29 Sep • Techno / House</p>
                    <div class="d-flex gap-2">
                      <a href="#" class="btn btn-sm btn-light"><i class="bi bi-ticket"></i> Tickets</a>
                      <button class="btn btn-sm btn-outline-light"><i class="bi bi-bookmark"></i> Merken</button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="carousel-item">
                <img class="d-block w-100" alt="Straßenfest" src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1200&auto=format&fit=crop">
                <div class="carousel-caption text-start">
                  <h5>Altstadt Straßenfest</h5>
                  <p>Foodtrucks, Live-Bands & Kunsthandwerk • Sa 21 Sep</p>
                </div>
              </div>

              <div class="carousel-item">
                <img class="d-block w-100" alt="Open Air Kino" src="https://images.unsplash.com/photo-1535016120720-40c646be5581?q=80&w=1200&auto=format&fit=crop">
                <div class="carousel-caption text-end">
                  <h5>Open Air Kino am Rhein</h5>
                  <p>Heute 21:30 • Klassiker & Popcorn</p>
                </div>
              </div>
            </div>
          </div>
        </div><!-- /col -->
      </div>
    </div>
  </section>
</template>

<style scoped>
:root{
  --brand:#5b7cfa;
  --brand-dark:#3b57c9;
  --soft:#f5f7ff;
}
.hero{
  background: radial-gradient(1200px 600px at 0% -10%, rgba(91,124,250,.25), transparent),
              radial-gradient(1200px 600px at 100% -10%, rgba(91,124,250,.25), transparent),
              linear-gradient(180deg, #ffffff 0%, #f9faff 100%);
}
.eyebrow{font-size:.8rem; letter-spacing:.08em; text-transform:uppercase; color:#6c7a91;}
.btn-brand{background:var(--brand); border-color:var(--brand);}
.btn-brand:hover{background:var(--brand-dark); border-color:var(--brand-dark);}
.category-pill{border-radius:3rem; padding:.35rem .8rem; border:1px solid #e9ecf5; background:#fff; font-weight:600;}
.category-pill.active{background:var(--soft); border-color:#dfe6ff; color:#2e3a8c;}
.caption-grad{
  position:absolute; bottom:0; left:0; right:0; color:#fff; padding:1rem;
  background:linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.7) 90%);
}
</style>

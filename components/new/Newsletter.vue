<!--components/new/Newslater.vue-->
<template>
  <section class="py-5 bg-light">
    <div class="container-fluid container-xxl">
      <div class="row align-items-center g-4">
        <div class="col-lg-7">
          <h3 class="mb-1">Nie wieder Highlights verpassen</h3>
          <p class="subtitle">Wähle deine Stadt &amp; Genres – wir schicken dir personalisierte Empfehlungen.</p>
        </div>
        <div class="col-lg-5">
          <form class="d-flex gap-2" @submit.prevent>
            <input type="email" class="form-control" placeholder="Deine E-Mail">
            <button class="btn btn-brand" type="submit">Anmelden</button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

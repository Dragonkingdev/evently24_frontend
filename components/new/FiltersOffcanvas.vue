<!--components/new/FiltersOffcanvas.vue-->
<template>
  <div class="offcanvas offcanvas-end" tabindex="-1" id="filters" aria-labelledby="filtersLabel">
    <div class="offcanvas-header">
      <h5 id="filtersLabel"><i class="bi bi-sliders"></i> Filter</h5>
      <button class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      <div class="mb-3">
        <label class="form-label">Datum</label>
        <select class="form-select">
          <option>Beliebig</option>
          <option>Heute</option>
          <option>Morgen</option>
          <option>Dieses Wochenende</option>
          <option>Diesen Monat</option>
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label">Kategorie</label>
        <div class="d-flex flex-wrap gap-2">
          <span class="badge rounded-pill text-bg-light" role="button">Konzert</span>
          <span class="badge rounded-pill text-bg-light" role="button">Festival</span>
          <span class="badge rounded-pill text-bg-light" role="button">Theater</span>
          <span class="badge rounded-pill text-bg-light" role="button">Familie</span>
          <span class="badge rounded-pill text-bg-light" role="button">Nightlife</span>
        </div>
      </div>
      <div class="mb-3">
        <label class="form-label">Preis</label>
        <input type="range" class="form-range" min="0" max="150">
      </div>
      <button class="btn btn-brand w-100"><i class="bi bi-check2-circle"></i> Anwenden</button>
    </div>
  </div>
</template>

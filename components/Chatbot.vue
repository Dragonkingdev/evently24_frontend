<!-- components/Chatbot.vue -->
<template>
  <!-- Launcher -->
  <button
    class="ev-chatbot-launcher"
    :aria-expanded="isOpen ? 'true' : 'false'"
    aria-controls="ev-chatbot"
    aria-label="Chatbot öffnen"
    @click="toggle()"
  >
    <i class="bi bi-chat-dots" aria-hidden="true"></i>
    <span class="badge-dot" aria-hidden="true"></span>
  </button>

  <!-- Overlay -->
  <div v-if="isOpen" class="ev-chatbot-overlay" @click="close()" aria-hidden="true"></div>

  <!-- Chatfenster -->
  <transition name="ev-slide-in">
    <section
      v-if="isOpen"
      id="ev-chatbot"
      class="ev-chatbot"
      role="dialog"
      aria-modal="true"
      aria-label="Evently24 Chatbot"
    >
      <!-- Header (Liquid Glass) -->
      <header class="ev-header">
        <div class="ev-avatar" aria-hidden="true">
          <i class="bi bi-stars"></i>
        </div>
        <div class="ev-title">
          <strong>Chatbot</strong>
          <div class="ev-sub">Schnelle Antworten</div>
        </div>
        <button class="ev-icon-btn" @click="close()" aria-label="Chatbot schließen">
          <i class="bi bi-x-lg" aria-hidden="true"></i>
        </button>
      </header>

      <!-- Nachrichtenliste -->
      <div class="ev-messages" ref="listRef" :aria-live="reduceMotion ? 'polite' : 'off'">
        <!-- Begrüßung + Quicklist -->
        <div class="ev-msg bot">
          <div class="bubble">
            <p class="mb-1">{{ welcome }}</p>
            <ul class="ev-quick-list" role="list">
              <li v-for="(item, i) in faqs" :key="'qk-'+i">
                <button class="ev-quick" @click="ask(item)">
                  <i :class="item.icon" aria-hidden="true"></i>
                  <span>{{ item.q }}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <!-- Chatverlauf -->
        <div
          v-for="(m, i) in messages"
          :key="i"
          class="ev-msg"
          :class="m.from"
        >
          <div class="bubble">
            <p v-html="m.text"></p>
            <time class="stamp" :datetime="m.iso">{{ m.time }}</time>
          </div>
        </div>

        <!-- Tippen-Indikator -->
        <div v-if="typing" class="ev-msg bot">
          <div class="bubble typing" aria-live="polite">
            <span class="dot"></span><span class="dot"></span><span class="dot"></span>
            <span class="screen-reader-only">Bot tippt …</span>
          </div>
        </div>

        <!-- Kontaktformular (einklappbar) -->
        <transition name="ev-fade">
          <div v-if="showContact" class="ev-contact">
            <div class="ev-contact-head">
              <i class="bi bi-send-check"></i>
              <strong>Kontaktanfrage</strong>
              <button class="ev-icon-btn small" @click="showContact = false" aria-label="Kontaktformular schließen">
                <i class="bi bi-chevron-down"></i>
              </button>
            </div>
            <form @submit.prevent="submitContact" class="ev-contact-form" aria-label="Kontaktformular im Chat">
              <div class="row">
                <input v-model="contact.name" type="text" required placeholder="Name*" />
                <input v-model="contact.email" type="email" required placeholder="E-Mail*" />
              </div>
              <textarea v-model="contact.msg" rows="3" placeholder="Nachricht (optional)"></textarea>
              <button class="ev-btn-brand" type="submit">
                <i class="bi bi-rocket-takeoff"></i> Anfrage senden
              </button>
              <p class="mini">Mit Absenden bestätigst du die Verarbeitung deiner Angaben gem. Datenschutz.</p>
            </form>
          </div>
        </transition>
      </div>

      <!-- Footer: Chips + Kontakt -->
      <footer class="ev-footer">
        <div class="ev-foot-actions">
          <button
            v-for="(item, i) in faqs"
            :key="'more-'+i"
            class="ev-chip"
            @click="ask(item)"
            :title="item.q"
          >
            <i :class="item.icon" aria-hidden="true"></i>
            <span>{{ item.short || item.q }}</span>
          </button>

          <button class="ev-chip brand" @click="toggleContact()" title="Kontaktanfrage">
            <i class="bi bi-send"></i><span>Kontakt</span>
          </button>
        </div>
      </footer>
    </section>
  </transition>
</template>

<script setup lang="js">
import { ref, onMounted, nextTick } from 'vue'

/** Vordefinierte FAQs inkl. Links zu deinen Sektionen/Modals */
const faqs = ref([
  {
    q: 'Was kostet Evently24?',
    short: 'Gebühren',
    icon: 'bi bi-cash-coin',
    a: `Unsere All-in-Service-Fee beträgt <strong>5,4 % + 0,50 €</strong> pro verkauftem Ticket.
        Mehr unter <a href="#pricing">Gebühren</a> oder direkt <a href="#contact">Kontakt</a>.`
  },
  {
    q: 'Wie funktioniert das Ticketing?',
    short: 'Ticketing',
    icon: 'bi bi-ticket-perforated',
    a: `Sicheres Bezahlen via <strong>Stripe</strong>. QR-Check-in & Dashboard sind dabei.
        Details: <a href="#solution">Wie es funktioniert</a> & <a href="#faq">FAQ</a>.`
  },
  {
    q: 'Kann ich Social Ads automatisieren?',
    short: 'Social Ads',
    icon: 'bi bi-badge-ad',
    a: `Ja – Automatisierung für <strong>Meta & TikTok</strong> (A/B-Tests, Budget-Optim.).
        Roadmap: <a href="#roadmap">ansehen</a> · <a href="#beta">Beta</a>.`
  },
  {
    q: 'Ist Evently24 DSGVO-konform?',
    short: 'DSGVO',
    icon: 'bi bi-shield-lock',
    a: `Ja. <strong>EU-Hosting</strong>, verschlüsselte Datenflüsse, Marketing-Cookies nur per Einwilligung.
        Mehr: <a href="#datenschutzModal" data-bs-toggle="modal">Datenschutz</a>.`
  },
  {
    q: 'Gibt es eine Beta?',
    short: 'Beta',
    icon: 'bi bi-stars',
    a: `Ja – bewirb dich als Partner: <a href="#beta">Beta</a> · oder gleich <a href="#contact">Kontakt</a>.`
  },
  {
    q: 'Wie läuft der Check-in?',
    short: 'Check-in',
    icon: 'bi bi-qr-code-scan',
    a: `Am Eingang einfach <strong>QR-Codes scannen</strong> (mobil/Handscanner). 
        Die Check-ins siehst du live im <a href="#features">Dashboard</a>.`
  },
  {
    q: 'Kann ich Events auf meiner Website einbetten?',
    short: 'Widgets',
    icon: 'bi bi-window-stack',
    a: `Ja, mit <strong>Widget/iFrame</strong>. Einmal eingebunden, synchronisiert es automatisch.
        Siehe <a href="#solution">Wie es funktioniert</a>.`
  },
  {
    q: 'Wie schnell sind Auszahlungen?',
    short: 'Auszahlungen',
    icon: 'bi bi-arrow-repeat',
    a: `Auszahlungen erfolgen über <strong>Stripe</strong> nach deinem Auszahlungsplan (typisch 2–7 Werktage).
        Infos: <a href="#pricing">Gebühren</a>.`
  },
  {
    q: 'Welche Zahlungsmethoden werden unterstützt?',
    short: 'Zahlarten',
    icon: 'bi bi-credit-card-2-front',
    a: `Kredit-/Debitkarte, SEPA u.a. – abhängig vom Stripe-Setup. 
        Bei Premium-Zahlarten kann für Käufer ein kleiner Aufpreis entstehen (<a href="#pricing">Details</a>).`
  },
  {
    q: 'Wie funktionieren Stornos/Erstattungen?',
    short: 'Erstattungen',
    icon: 'bi bi-arrow-counterclockwise',
    a: `Erstattungen richten sich nach deiner Veranstalter-Policy und werden über Stripe abgewickelt.
        Siehe <a href="#agbModal" data-bs-toggle="modal">AGB</a> & <a href="#faq">FAQ</a>.`
  }
])

const welcome = 'Hi! Wähle eine Frage aus – ich verlinke dir die passende Stelle auf der Seite. Oder schick direkt eine Kontaktanfrage.'

const isOpen = ref(false)
const typing = ref(false)
const listRef = ref(null)
const messages = ref([])
const reduceMotion = ref(false)

const showContact = ref(false)
const contact = ref({ name: '', email: '', msg: '' })

function now() {
  const d = new Date()
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return { time: `${hh}:${mm}`, iso: d.toISOString() }
}

function scrollToBottom() {
  nextTick(() => {
    const el = listRef.value
    if (el) el.scrollTop = el.scrollHeight
  })
}

function toggle() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    localStorage.setItem('ev-chatbot-opened', '1')
    nextTick(scrollToBottom)
  }
}

function close() { isOpen.value = false }

function answerFor(question) {
  const f = faqs.value.find(x => x.q === question)
  return f
    ? f.a + ` <div class="ev-inline-cta"><button class="ev-btn-ghost" onclick="document.querySelector('#contact')?.scrollIntoView({behavior:'smooth'})"><i class='bi bi-send'></i> Kontakt aufnehmen</button></div>`
    : 'Dazu habe ich gerade keine vorbereitete Antwort. Schau in den <a href="#faq">FAQ</a> oder <a href="#contact">schreib uns</a>.'
}

async function ask(item) {
  const t = now()
  messages.value.push({ from: 'user', text: item.q, time: t.time, iso: t.iso })
  scrollToBottom()

  typing.value = true
  const delay = reduceMotion.value ? 160 : 600 + Math.random() * 400
  await new Promise(r => setTimeout(r, delay))

  const a = now()
  messages.value.push({ from: 'bot', text: answerFor(item.q), time: a.time, iso: a.iso })
  typing.value = false
  scrollToBottom()
}

function toggleContact() {
  showContact.value = !showContact.value
  if (showContact.value) {
    const t = now()
    messages.value.push({
      from: 'bot',
      text: `Du kannst mir auch direkt hier eine <strong>Kontaktanfrage</strong> schicken. Alternativ findest du unten auf der Seite das <a href="#contact">Kontaktformular</a>.`,
      time: t.time, iso: t.iso
    })
    scrollToBottom()
  }
}

async function submitContact() {
  const { name, email } = contact.value
  showContact.value = false
  contact.value = { name: '', email: '', msg: '' }

  typing.value = true
  await new Promise(r => setTimeout(r, reduceMotion.value ? 130 : 450))
  typing.value = false

  const t = now()
  messages.value.push({
    from: 'bot',
    text: `Danke <strong>${name || '!'}</strong> – wir melden uns per E-Mail an <strong>${email}</strong>. 
           Du kannst uns jederzeit auch über <a href="#contact">Kontakt</a> erreichen.`,
    time: t.time, iso: t.iso
  })
  scrollToBottom()
}

onMounted(() => {
  reduceMotion.value = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  const openedBefore = localStorage.getItem('ev-chatbot-opened') === '1'
  if (!openedBefore && !reduceMotion.value) {
    setTimeout(() => {
      const btn = document.querySelector('.ev-chatbot-launcher')
      btn?.classList.add('nudge')
      setTimeout(() => btn?.classList.remove('nudge'), 1600)
    }, 1800)
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen.value) close()
  })
})
</script>

<style scoped>
/* ===== Tokens / Fallbacks ===== */
:host, :root {
  --ev-brandA: var(--brandA, #4f46e5);
  --ev-brandB: var(--brandB, #06b6d4);
  --ev-ink: var(--ink, #111827);
  --ev-muted: var(--muted, #6B7280);
  --ev-surface: #ffffff;
  --ev-shadow: 0 22px 48px rgba(17,24,39,.16);
  --ev-radius: 20px;
  --ev-radius-bubble: 16px;
}

/* ===== Launcher ===== */
.ev-chatbot-launcher{
  position: fixed; right: 18px; bottom: 18px; z-index: 1080;
  width: 58px; height: 58px; border-radius: 50%; border: 0; color: #fff;
  background-image: linear-gradient(120deg, var(--ev-brandA), var(--ev-brandB), var(--ev-brandA));
  background-size: 200% 200%; animation: ev-bgmove 7s ease-in-out infinite;
  box-shadow: 0 14px 44px rgba(79,70,229,.35);
  display: inline-flex; align-items:center; justify-content:center; cursor: pointer;
}
.ev-chatbot-launcher i{ font-size: 1.35rem }
.ev-chatbot-launcher:focus{ outline: 3px solid rgba(6,182,212,.45) }
.badge-dot{ position:absolute; top:6px; right:6px; width:10px; height:10px; border-radius:50%;
  background:#22c55e; box-shadow:0 0 0 0 rgba(34,197,94,.6); animation: ev-ping 1.8s infinite; }
.ev-chatbot-launcher.nudge{
  animation: ev-bgmove 7s ease-in-out infinite, ev-wiggle 1.4s ease-in-out 0s 1;
}
@keyframes ev-bgmove{ 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
@keyframes ev-ping{ 0%{ box-shadow:0 0 0 0 rgba(34,197,94,.6) } 70%{ box-shadow:0 0 0 12px rgba(34,197,94,0) } 100%{ box-shadow:0 0 0 0 rgba(34,197,94,0) } }
@keyframes ev-wiggle{
  0%{ transform: translate3d(0,0,0) rotate(0) }
  25%{ transform: translate3d(0,-2px,0) rotate(-6deg) }
  50%{ transform: translate3d(0,0,0) rotate(3deg) }
  75%{ transform: translate3d(0,-1px,0) rotate(-3deg) }
  100%{ transform: translate3d(0,0,0) rotate(0) }
}

/* ===== Overlay ===== */
.ev-chatbot-overlay{ position: fixed; inset: 0; background: rgba(0,0,0,.12); z-index: 1079; }

/* ===== Panel ===== */
.ev-chatbot{
  position: fixed; right: 18px; bottom: 86px; z-index: 1081;
  width: min(392px, 94vw); max-height: min(76vh, 760px);
  background: var(--ev-surface); color: var(--ev-ink);
  border-radius: var(--ev-radius); overflow: hidden; box-shadow: var(--ev-shadow);
  display: grid; grid-template-rows: auto 1fr auto; border: 1px solid rgba(17,24,39,.06);
}

/* Animations */
.ev-slide-in-enter-from { opacity:0; transform: translateY(12px) scale(.98) }
.ev-slide-in-enter-to   { opacity:1; transform:none }
.ev-slide-in-enter-active,
.ev-slide-in-leave-active { transition: all .22s ease }
.ev-slide-in-leave-from { opacity:1; transform:none }
.ev-slide-in-leave-to   { opacity:0; transform: translateY(10px) scale(.98) }

.ev-fade-enter-active, .ev-fade-leave-active{ transition: opacity .18s ease }
.ev-fade-enter-from, .ev-fade-leave-to { opacity: 0 }

/* ===== Header – LIQUID GLASS (opak & frosted) ===== */
.ev-header{
  position: relative;
  display:flex; align-items:center; gap:.7rem; padding:.9rem .95rem;
  color:#fff; border-bottom: 1px solid rgba(255,255,255,.14);
  background: linear-gradient(135deg, rgba(79,70,229,.94), rgba(6,182,212,.94));
  backdrop-filter: blur(14px) saturate(160%);
}
.ev-header::after{
  content:""; position:absolute; inset:0;
  background: radial-gradient(120% 60% at 10% -20%, rgba(255,255,255,.16), transparent 60%);
  pointer-events:none;
}
.ev-avatar{
  width:38px; height:38px; border-radius:50%;
  background: rgba(255,255,255,.18);
  display:flex; align-items:center; justify-content:center; color:#fff;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.18);
}
.ev-title{ line-height:1.1 }
.ev-title strong{ letter-spacing:.2px }
.ev-title .ev-sub{ font-size:.8rem; opacity:.95 }
.ev-icon-btn{
  margin-left:auto; border:0; background:transparent; cursor:pointer; color:#fff;
  width:36px; height:36px; border-radius:10px; display:grid; place-items:center;
}
.ev-icon-btn:hover{ background: rgba(255,255,255,.12) }
.ev-icon-btn.small{ width:32px; height:32px; color: var(--ev-ink) }
.ev-icon-btn.small:hover{ background: rgba(17,24,39,.06) }

/* ===== Messages ===== */
.ev-messages{ padding: .85rem; overflow:auto;
  background: linear-gradient(180deg, #fafbff, #ffffff 28%); }
.ev-msg{ display:flex; margin:.34rem 0 }
.ev-msg.user{ justify-content: flex-end }

/* Runde, sichtbare Bubbles + definierte Farben */
.ev-msg .bubble{
  max-width: 88%;
  padding: .64rem .8rem;
  border-radius: var(--ev-radius-bubble);
  box-shadow: 0 8px 22px rgba(17,24,39,.06);
  position: relative; word-break: break-word;
  overflow: hidden; /* für „glassy“ Kanten */
}
.ev-msg.bot .bubble{
  background: #fff; border: 1px solid rgba(17,24,39,.10);
  color: var(--ev-ink); /* nie weiß auf weiß */
}
.ev-msg.user .bubble{
  background: linear-gradient(120deg, var(--ev-brandA), var(--ev-brandB));
  color:#fff;
}

/* Links als „brandige Pills“ (statt Standard-Blau) */
.ev-msg .bubble a{
  display:inline-block;
  padding: 0 .25rem;
  border-radius: 8px;
  background: linear-gradient(120deg, rgba(79,70,229,.10), rgba(6,182,212,.10));
  border: 1px solid rgba(79,70,229,.25);
  color: var(--ev-brandA);
  font-weight: 700;
  text-decoration: none;
}
.ev-msg .bubble a:hover{
  background: linear-gradient(120deg, rgba(79,70,229,.18), rgba(6,182,212,.18));
  border-color: rgba(79,70,229,.45);
}
/* Im User-Bubble: weiße Links mit Unterstreichung für Kontrast */
.ev-msg.user .bubble a{
  background: transparent;
  border-color: rgba(255,255,255,.45);
  color:#fff;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.ev-msg .bubble .stamp{ display:block; font-size:.7rem; opacity:.6; margin-top:.28rem }

/* Typing Indicator */
.typing{ display:inline-flex; gap:6px; align-items:center }
.typing .dot{
  width:6px; height:6px; border-radius:50%; background: rgba(17,24,39,.65);
  animation: ev-bounce 1.2s infinite ease-in-out;
}
.typing .dot:nth-child(2){ animation-delay:.12s }
.typing .dot:nth-child(3){ animation-delay:.24s }
@keyframes ev-bounce{
  0%,80%,100%{ transform: translateY(0); opacity:.55 }
  40%{ transform: translateY(-4px); opacity:1 }
}

/* Inline CTA in Antworten */
.ev-inline-cta{ margin-top:.4rem }
.ev-btn-ghost{
  border:1px solid rgba(17,24,39,.18);
  background:#fff; color:var(--ev-ink); border-radius:999px;
  padding:.32rem .66rem; font-size:.86rem; cursor:pointer;
}
.ev-btn-ghost:hover{ border-color: rgba(79,70,229,.45) }

/* ===== Kontaktformular ===== */
.ev-contact{
  margin:.45rem 0 0; padding:.7rem; border:1px solid rgba(17,24,39,.10);
  border-radius: 16px; background:#fff; box-shadow: 0 8px 22px rgba(17,24,39,.06);
}
.ev-contact-head{ display:flex; align-items:center; gap:.5rem; margin-bottom:.6rem; color: var(--ev-ink) }
.ev-contact-head i{ color: var(--ev-brandA) }

.ev-contact-form .row{
  display:grid; grid-template-columns: 1fr 1fr; gap:.52rem; margin-bottom:.52rem;
}
.ev-contact-form input, .ev-contact-form textarea{
  width:100%; box-sizing: border-box;
  border:1px solid #e6e8ef; border-radius:12px; padding:.54rem .62rem; font-size:.92rem;
  background:#fff; color: var(--ev-ink);
}
.ev-contact-form textarea{ resize: vertical }
.ev-contact-form input:focus, .ev-contact-form textarea:focus{
  outline:2px solid rgba(6,182,212,.35); border-color: transparent;
}
.ev-contact-form .ev-btn-brand{
  margin-top:.42rem; border:0; border-radius:999px; padding:.5rem .9rem; color:#fff; cursor:pointer;
  background-image: linear-gradient(120deg, var(--ev-brandA), var(--ev-brandB), var(--ev-brandA));
  background-size:200% 200%; animation: ev-bgmove 6s ease-in-out infinite;
  box-shadow: 0 10px 30px rgba(79,70,229,.28);
}
.ev-contact-form .mini{ margin:.35rem 0 0; font-size:.78rem; color: var(--ev-muted) }
@media (max-width: 420px){
  .ev-contact-form .row{ grid-template-columns: 1fr }
}

/* ===== Footer Chips ===== */
.ev-footer{ border-top:1px solid rgba(17,24,39,.06); background:#fff; padding:.65rem .68rem }
.ev-foot-actions{ display:flex; gap:.5rem; flex-wrap:wrap }
.ev-chip{
  display:inline-flex; align-items:center; gap:.44rem; cursor:pointer;
  font-size:.86rem; padding:.46rem .74rem; border-radius:999px;
  border:1px solid #e6e8ef;
  background: linear-gradient(120deg, rgba(79,70,229,.06), rgba(6,182,212,.06));
  box-shadow: 0 6px 18px rgba(17,24,39,.06);
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
  white-space: nowrap; color: var(--ev-ink);
}
.ev-chip i{ color: var(--ev-brandA) }
.ev-chip:hover{ transform: translateY(-1px); border-color: rgba(79,70,229,.45); box-shadow: 0 10px 26px rgba(17,24,39,.08) }
.ev-chip.brand{
  background: linear-gradient(120deg, var(--ev-brandA), var(--ev-brandB));
  color:#fff; border-color: transparent;
}
.ev-chip.brand i{ color:#fff }

/* Quick-List im Begrüßungsbubble */
.ev-quick-list{ list-style:none; padding:0; margin:.42rem 0 0; display:flex; flex-wrap:wrap; gap:.44rem }
.ev-quick{
  display:inline-flex; align-items:center; gap:.38rem; cursor:pointer;
  border:1px solid rgba(79,70,229,.28);
  background: linear-gradient(120deg, rgba(79,70,229,.10), rgba(6,182,212,.10));
  color: var(--ev-ink);
  padding:.38rem .6rem; border-radius:999px; font-size:.86rem;
  transition: transform .18s ease, border-color .18s ease;
}
.ev-quick:hover{ transform: translateY(-1px); border-color: rgba(79,70,229,.55) }

/* A11y */
.screen-reader-only {
  position: absolute !important; height:1px; width:1px; overflow:hidden;
  clip: rect(1px, 1px, 1px, 1px); white-space: nowrap;
}
</style>

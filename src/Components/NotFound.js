function invoke(handler, ...args) {
  if (typeof handler === 'function') {
    handler(...args)
  }
}

export function NotFound({ title, message, onGoHome, onGoExplore } = {}) {
  const section = document.createElement('section')
  section.className = 'not-found-page grid min-h-[calc(100vh-96px)] place-items-center px-4 py-8 md:px-6'

  const card = document.createElement('article')
  card.className =
    'w-full max-w-3xl overflow-hidden rounded-[2.2rem] border border-slate-200/80 bg-white/92 p-8 text-center shadow-[0_25px_60px_-34px_rgba(15,23,42,0.42)] md:p-12'

  const code = document.createElement('p')
  code.className = 'text-xs font-bold uppercase tracking-[0.26em] text-slate-400'
  code.textContent = 'Error 404'

  const heading = document.createElement('h2')
  heading.className = 'mt-4 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl'
  heading.textContent = title || 'Halaman tidak ditemukan'

  const caption = document.createElement('p')
  caption.className = 'mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-500 md:text-base'
  caption.textContent =
    message ||
    'Route, pin, atau board yang kamu cari tidak tersedia. Kita arahkan kembali ke jalur discovery supaya sesi browsing tetap lanjut.'

  const collage = document.createElement('div')
  collage.className = 'mx-auto mt-8 grid max-w-xl gap-3 sm:grid-cols-3'

  ;[
    'https://picsum.photos/id/1025/320/420',
    'https://picsum.photos/id/1084/320/460',
    'https://picsum.photos/id/1019/320/430',
  ].forEach((src, index) => {
    const image = document.createElement('img')
    image.src = src
    image.alt = 'Recommended visual'
    image.className =
      index === 1
        ? 'h-40 w-full rounded-[1.5rem] object-cover sm:h-52 sm:-translate-y-5'
        : 'h-40 w-full rounded-[1.5rem] object-cover sm:h-52'
    collage.appendChild(image)
  })

  const actions = document.createElement('div')
  actions.className = 'mt-8 flex flex-wrap items-center justify-center gap-3'

  const homeButton = document.createElement('button')
  homeButton.type = 'button'
  homeButton.textContent = 'Back to Home'
  homeButton.className =
    'rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700'
  homeButton.addEventListener('click', () => invoke(onGoHome))

  const exploreButton = document.createElement('button')
  exploreButton.type = 'button'
  exploreButton.textContent = 'Go to Explore'
  exploreButton.className =
    'rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900'
  exploreButton.addEventListener('click', () => invoke(onGoExplore))

  actions.appendChild(homeButton)
  actions.appendChild(exploreButton)

  card.appendChild(code)
  card.appendChild(heading)
  card.appendChild(caption)
  card.appendChild(collage)
  card.appendChild(actions)
  section.appendChild(card)

  return section
}

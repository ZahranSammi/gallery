function invoke(handler, ...args) {
  if (typeof handler === 'function') {
    handler(...args)
  }
}

export function BoardCard(board, { pins = [], onOpenBoard, compact = false } = {}) {
  const card = document.createElement('button')
  card.type = 'button'
  card.className = compact
    ? 'board-card group overflow-hidden rounded-[1.7rem] border border-slate-200/80 bg-white/90 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl'
    : 'board-card group overflow-hidden rounded-[1.9rem] border border-slate-200/80 bg-white/92 text-left shadow-[0_20px_45px_-30px_rgba(15,23,42,0.4)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_55px_-32px_rgba(15,23,42,0.46)]'
  card.addEventListener('click', () => invoke(onOpenBoard, board.id))

  const cover = document.createElement('div')
  cover.className = compact
    ? 'grid h-40 grid-cols-2 gap-2 overflow-hidden bg-slate-100 p-2'
    : 'grid h-48 grid-cols-2 gap-2 overflow-hidden bg-slate-100 p-2.5 md:h-56'

  const coverPins = pins.slice(0, 4)

  if (!coverPins.length) {
    const emptyTile = document.createElement('div')
    emptyTile.className =
      'col-span-2 grid place-items-center rounded-[1.3rem] bg-[radial-gradient(circle_at_top,#fef3c7,transparent_45%),linear-gradient(135deg,#f8fafc,#e2e8f0)] px-4 text-center'

    const emptyText = document.createElement('p')
    emptyText.className = 'text-sm font-semibold text-slate-500'
    emptyText.textContent = 'Belum ada pin di board ini.'

    emptyTile.appendChild(emptyText)
    cover.appendChild(emptyTile)
  } else {
    coverPins.forEach((pin, index) => {
      const image = document.createElement('img')
      image.src = pin.imageSrc
      image.alt = pin.altText || pin.title || 'Board cover image'
      image.loading = 'lazy'
      image.decoding = 'async'
      image.className =
        index === 0 && coverPins.length === 1
          ? 'board-card-cover-image col-span-2 h-full w-full rounded-[1.2rem] object-cover transition duration-500 group-hover:scale-[1.04]'
          : 'board-card-cover-image h-full w-full rounded-[1.2rem] object-cover transition duration-500 group-hover:scale-[1.04]'
      cover.appendChild(image)
    })
  }

  const content = document.createElement('div')
  content.className = compact ? 'px-4 py-4' : 'px-4 py-4 md:px-5 md:py-5'

  const metaRow = document.createElement('div')
  metaRow.className = 'mb-3 flex items-center justify-between gap-3'

  const privacy = document.createElement('span')
  privacy.className =
    board.privacy === 'private'
      ? 'rounded-full bg-slate-900 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white'
      : 'rounded-full bg-emerald-50 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-emerald-700'
  privacy.textContent = board.privacy === 'private' ? 'Private' : 'Public'

  const theme = document.createElement('span')
  theme.className = 'text-xs font-semibold text-slate-500'
  theme.textContent = board.theme || 'Collection'

  metaRow.appendChild(privacy)
  metaRow.appendChild(theme)

  const title = document.createElement('h3')
  title.className = compact
    ? 'text-base font-extrabold text-slate-900'
    : 'text-lg font-extrabold text-slate-900'
  title.textContent = board.name

  const description = document.createElement('p')
  description.className = 'mt-1 line-clamp-2 text-sm leading-relaxed text-slate-600'
  description.textContent = board.description || 'Curated visual collection for quick inspiration.'

  const footer = document.createElement('div')
  footer.className = 'mt-4 flex items-center justify-between gap-3 text-sm text-slate-500'

  const owner = document.createElement('span')
  owner.className = 'truncate font-semibold text-slate-600'
  owner.textContent = board.ownerName || 'Pinboard'

  const stats = document.createElement('span')
  stats.className = 'shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400'
  stats.textContent = `${board.pinIds.length} pins`

  footer.appendChild(owner)
  footer.appendChild(stats)

  content.appendChild(metaRow)
  content.appendChild(title)
  content.appendChild(description)
  content.appendChild(footer)

  card.appendChild(cover)
  card.appendChild(content)

  return card
}

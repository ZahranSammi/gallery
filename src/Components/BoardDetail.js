function invoke(handler, ...args) {
  if (typeof handler === 'function') {
    handler(...args)
  }
}

export function BoardDetail({
  board,
  pins = [],
  isOwner = false,
  onBack,
  onOpenPin,
  onCreatePin,
  onRemovePin,
  onTogglePrivacy,
  onGoProfile,
} = {}) {
  const section = document.createElement('section')
  section.className = 'detail-page w-full px-4 pb-10 pt-6 md:px-6'

  const hero = document.createElement('article')
  hero.className =
    'overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/92 shadow-[0_22px_60px_-34px_rgba(15,23,42,0.42)]'

  const cover = document.createElement('div')
  cover.className = 'grid gap-2 bg-slate-100 p-3 md:grid-cols-[1.35fr_0.65fr]'

  const primaryCover = document.createElement('div')
  primaryCover.className =
    'min-h-[260px] overflow-hidden rounded-[1.6rem] bg-[radial-gradient(circle_at_top,#fde68a,transparent_30%),linear-gradient(180deg,#f8fafc,#e2e8f0)]'

  if (pins[0]) {
    const image = document.createElement('img')
    image.src = pins[0].imageSrc
    image.alt = pins[0].altText || pins[0].title || 'Board cover'
    image.className = 'h-full w-full object-cover'
    primaryCover.appendChild(image)
  }

  const mosaic = document.createElement('div')
  mosaic.className = 'grid grid-cols-2 gap-2'

  pins.slice(1, 5).forEach((pin) => {
    const tile = document.createElement('div')
    tile.className = 'overflow-hidden rounded-[1.4rem] bg-slate-200'

    const image = document.createElement('img')
    image.src = pin.imageSrc
    image.alt = pin.altText || pin.title || 'Board tile'
    image.className = 'h-full min-h-[126px] w-full object-cover'

    tile.appendChild(image)
    mosaic.appendChild(tile)
  })

  if (!pins.length) {
    const emptyTile = document.createElement('div')
    emptyTile.className =
      'col-span-2 grid min-h-[260px] place-items-center rounded-[1.6rem] border border-dashed border-slate-300 bg-white text-center'

    const emptyText = document.createElement('p')
    emptyText.className = 'max-w-xs text-sm leading-relaxed text-slate-500'
    emptyText.textContent = 'Board ini belum punya pin. Tambahkan pin baru agar cover collage mulai terbentuk.'

    emptyTile.appendChild(emptyText)
    cover.appendChild(emptyTile)
  } else {
    cover.appendChild(primaryCover)
    cover.appendChild(mosaic)
  }

  const content = document.createElement('div')
  content.className = 'grid gap-5 px-5 py-5 md:px-6 md:py-6'

  const topRow = document.createElement('div')
  topRow.className = 'flex flex-wrap items-start justify-between gap-4'

  const identity = document.createElement('div')
  identity.className = 'max-w-3xl'

  const metaRow = document.createElement('div')
  metaRow.className = 'flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-400'

  const privacy = document.createElement('span')
  privacy.textContent = board.privacy === 'private' ? 'Private board' : 'Public board'

  const theme = document.createElement('span')
  theme.textContent = board.theme || 'Collection'

  metaRow.appendChild(privacy)
  metaRow.appendChild(document.createTextNode('•'))
  metaRow.appendChild(theme)

  const title = document.createElement('h2')
  title.className = 'mt-3 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl'
  title.textContent = board.name

  const description = document.createElement('p')
  description.className = 'mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base'
  description.textContent = board.description || 'Curated board for saving reference images and pin ideas.'

  const info = document.createElement('div')
  info.className = 'mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500'
  info.textContent = `${board.pinIds.length} pins • ${board.followers || 0} followers • Updated ${board.updatedLabel || 'recently'}`

  identity.appendChild(metaRow)
  identity.appendChild(title)
  identity.appendChild(description)
  identity.appendChild(info)

  const actions = document.createElement('div')
  actions.className = 'flex flex-wrap items-center gap-3'

  const backButton = document.createElement('button')
  backButton.type = 'button'
  backButton.textContent = 'Back'
  backButton.className =
    'rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900'
  backButton.addEventListener('click', () => invoke(onBack))

  const profileButton = document.createElement('button')
  profileButton.type = 'button'
  profileButton.textContent = 'Profile'
  profileButton.className =
    'rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900'
  profileButton.addEventListener('click', () => invoke(onGoProfile))

  const createButton = document.createElement('button')
  createButton.type = 'button'
  createButton.textContent = 'Add new pin'
  createButton.className =
    'rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700'
  createButton.addEventListener('click', () => invoke(onCreatePin))

  actions.appendChild(backButton)
  actions.appendChild(profileButton)
  actions.appendChild(createButton)

  if (isOwner) {
    const privacyButton = document.createElement('button')
    privacyButton.type = 'button'
    privacyButton.textContent = board.privacy === 'private' ? 'Make public' : 'Make private'
    privacyButton.className =
      'rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900'
    privacyButton.addEventListener('click', () => invoke(onTogglePrivacy, board.id))
    actions.appendChild(privacyButton)
  }

  topRow.appendChild(identity)
  topRow.appendChild(actions)
  content.appendChild(topRow)

  const gridHeader = document.createElement('div')
  gridHeader.className = 'flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 pt-5'

  const gridTitle = document.createElement('h3')
  gridTitle.className = 'text-lg font-extrabold text-slate-900'
  gridTitle.textContent = 'Pins in this board'

  const gridCaption = document.createElement('p')
  gridCaption.className = 'text-sm text-slate-500'
  gridCaption.textContent = isOwner
    ? 'Klik pin untuk membuka detail atau hapus dari board bila sudah tidak relevan.'
    : 'Board ini menampilkan pin yang sudah dikurasi untuk satu tema visual.'

  const titleWrap = document.createElement('div')
  titleWrap.appendChild(gridTitle)
  titleWrap.appendChild(gridCaption)
  gridHeader.appendChild(titleWrap)
  content.appendChild(gridHeader)

  const grid = document.createElement('div')
  grid.className = 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3'

  if (!pins.length) {
    const emptyState = document.createElement('article')
    emptyState.className =
      'rounded-[1.8rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center sm:col-span-2 xl:col-span-3'

    const emptyTitle = document.createElement('h3')
    emptyTitle.className = 'text-xl font-extrabold text-slate-900'
    emptyTitle.textContent = 'Board masih kosong'

    const emptyCaption = document.createElement('p')
    emptyCaption.className = 'mt-3 text-sm leading-relaxed text-slate-500'
    emptyCaption.textContent =
      'Mulai dengan membuat pin baru atau simpan pin dari homepage dan explore agar koleksi ini segera hidup.'

    emptyState.appendChild(emptyTitle)
    emptyState.appendChild(emptyCaption)
    grid.appendChild(emptyState)
  } else {
    pins.forEach((pin) => {
      const card = document.createElement('article')
      card.className =
        'overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg'

      const openButton = document.createElement('button')
      openButton.type = 'button'
      openButton.className = 'w-full text-left'
      openButton.addEventListener('click', () => invoke(onOpenPin, pin.id))

      const image = document.createElement('img')
      image.src = pin.imageSrc
      image.alt = pin.altText || pin.title || 'Board pin'
      image.className = 'h-72 w-full object-cover'

      const meta = document.createElement('div')
      meta.className = 'px-4 py-4'

      const pinTitle = document.createElement('h4')
      pinTitle.className = 'text-base font-extrabold text-slate-900'
      pinTitle.textContent = pin.title || 'Untitled Pin'

      const pinCaption = document.createElement('p')
      pinCaption.className = 'mt-2 text-sm leading-relaxed text-slate-500'
      pinCaption.textContent = pin.caption || 'No description available.'

      meta.appendChild(pinTitle)
      meta.appendChild(pinCaption)
      openButton.appendChild(image)
      openButton.appendChild(meta)
      card.appendChild(openButton)

      if (isOwner) {
        const footer = document.createElement('div')
        footer.className = 'flex items-center justify-between border-t border-slate-200 px-4 py-3'

        const owner = document.createElement('span')
        owner.className = 'text-xs font-semibold uppercase tracking-[0.14em] text-slate-400'
        owner.textContent = pin.author || 'Creator'

        const removeButton = document.createElement('button')
        removeButton.type = 'button'
        removeButton.textContent = 'Remove'
        removeButton.className = 'text-sm font-semibold text-red-600 transition hover:text-red-700'
        removeButton.addEventListener('click', () => invoke(onRemovePin, board.id, pin.id))

        footer.appendChild(owner)
        footer.appendChild(removeButton)
        card.appendChild(footer)
      }

      grid.appendChild(card)
    })
  }

  content.appendChild(grid)
  hero.appendChild(cover)
  hero.appendChild(content)
  section.appendChild(hero)
  return section
}

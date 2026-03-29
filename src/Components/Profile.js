function invoke(handler, ...args) {
  if (typeof handler === 'function') {
    handler(...args)
  }
}

export function Profile({
  user,
  createdPins = [],
  savedPins = [],
  onOpenDetail,
  onBackHome,
  onEditProfile,
} = {}) {
  const section = document.createElement('section')
  section.className = 'profile-page w-full px-4 pb-10 pt-6 md:px-6'

  const hero = document.createElement('article')
  hero.className =
    'overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/90 shadow-[0_18px_55px_-30px_rgba(15,23,42,0.55)]'

  const cover = document.createElement('div')
  cover.className =
    'h-36 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.45),transparent_40%),linear-gradient(120deg,#0f172a_0%,#1d4ed8_45%,#0891b2_100%)]'

  const heroContent = document.createElement('div')
  heroContent.className =
    '-mt-12 flex flex-col gap-4 px-4 pb-5 md:flex-row md:items-end md:justify-between md:px-6 md:pb-6'

  const profileMain = document.createElement('div')
  profileMain.className = 'flex min-w-0 items-end gap-4'

  const avatar = document.createElement('img')
  avatar.src = user?.avatar || 'https://picsum.photos/id/1005/160/160'
  avatar.alt = `${user?.name || 'User'} avatar`
  avatar.decoding = 'async'
  avatar.loading = 'eager'
  avatar.className = 'h-24 w-24 rounded-3xl border-4 border-white object-cover shadow-md'

  const identity = document.createElement('div')
  identity.className = 'min-w-0 pb-1'

  const name = document.createElement('h2')
  name.className = 'truncate text-2xl font-extrabold text-slate-900'
  name.textContent = user?.name || 'Pinboard User'

  const handle = document.createElement('p')
  handle.className = 'truncate text-sm text-slate-500'
  handle.textContent = user?.handle || '@pinboard'

  const bio = document.createElement('p')
  bio.className = 'mt-2 w-full text-sm leading-relaxed text-slate-600'
  bio.textContent =
    user?.bio ||
    'Sharing visual ideas for decor, styling, and daily inspiration.'

  identity.appendChild(name)
  identity.appendChild(handle)
  identity.appendChild(bio)

  profileMain.appendChild(avatar)
  profileMain.appendChild(identity)

  const actions = document.createElement('div')
  actions.className = 'flex items-center gap-2'

  const backButton = document.createElement('button')
  backButton.type = 'button'
  backButton.textContent = 'Back to Feed'
  backButton.className =
    'rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 md:text-sm'
  backButton.addEventListener('click', () => invoke(onBackHome))

  const editButton = document.createElement('button')
  editButton.type = 'button'
  editButton.textContent = 'Edit Profile'
  editButton.className =
    'rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 md:text-sm'
  editButton.addEventListener('click', () => invoke(onEditProfile))

  actions.appendChild(backButton)
  actions.appendChild(editButton)

  heroContent.appendChild(profileMain)
  heroContent.appendChild(actions)
  hero.appendChild(cover)
  hero.appendChild(heroContent)

  const stats = document.createElement('div')
  stats.className = 'mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4'

  const statItems = [
    { label: 'Followers', value: `${user?.followers || 0}` },
    { label: 'Following', value: `${user?.following || 0}` },
    { label: 'Created', value: `${createdPins.length}` },
    { label: 'Saved', value: `${savedPins.length}` },
  ]

  statItems.forEach((item) => {
    const card = document.createElement('article')
    card.className =
      'rounded-2xl border border-slate-200/80 bg-white/85 px-4 py-3 shadow-sm'

    const value = document.createElement('p')
    value.className = 'text-xl font-extrabold text-slate-900'
    value.textContent = item.value

    const label = document.createElement('p')
    label.className = 'text-xs font-semibold uppercase tracking-[0.12em] text-slate-500'
    label.textContent = item.label

    card.appendChild(value)
    card.appendChild(label)
    stats.appendChild(card)
  })

  const boards = document.createElement('section')
  boards.className =
    'mt-6 rounded-[1.8rem] border border-slate-200/80 bg-white/85 p-4 shadow-sm md:p-5'

  const boardsTitle = document.createElement('h3')
  boardsTitle.className = 'text-lg font-extrabold text-slate-900'
  boardsTitle.textContent = 'Saved Collection'

  const boardsCaption = document.createElement('p')
  boardsCaption.className = 'mt-1 text-sm text-slate-500'
  boardsCaption.textContent = 'Quick access to pins you marked as favorite.'

  const savedStream = document.createElement('div')
  savedStream.className = 'mt-4 flex gap-3 overflow-x-auto pb-1'

  const sourceSavedPins = savedPins.length ? savedPins : createdPins.slice(0, 8)
  sourceSavedPins.forEach((pin) => {
    const item = document.createElement('button')
    item.type = 'button'
    item.className =
      'group w-full overflow-hidden rounded-2xl bg-slate-100 text-left transition hover:-translate-y-0.5'
    item.addEventListener('click', () => invoke(onOpenDetail, pin.id))

    const image = document.createElement('img')
    image.src = pin.imageSrc
    image.alt = pin.altText || pin.title || 'Saved pin image'
    image.loading = 'lazy'
    image.decoding = 'async'
    image.fetchPriority = 'low'
    image.className = 'h-36 w-full object-cover transition duration-300 group-hover:scale-[1.03]'

    const label = document.createElement('p')
    label.className = 'px-3 py-2 text-xs font-semibold text-slate-700'
    label.textContent = pin.title || 'Untitled Pin'

    item.appendChild(image)
    item.appendChild(label)
    savedStream.appendChild(item)
  })

  boards.appendChild(boardsTitle)
  boards.appendChild(boardsCaption)
  boards.appendChild(savedStream)

  const gallery = document.createElement('section')
  gallery.className =
    'mt-6 rounded-[1.8rem] border border-slate-200/80 bg-white/85 p-4 shadow-sm md:p-5'

  const galleryTitle = document.createElement('h3')
  galleryTitle.className = 'text-lg font-extrabold text-slate-900'
  galleryTitle.textContent = 'Created Pins'

  const grid = document.createElement('div')
  grid.className =
    'mt-4 columns-2 gap-3 md:columns-4 lg:columns-8 [column-gap:0.9rem]'

  createdPins.forEach((pin) => {
    const card = document.createElement('button')
    card.type = 'button'
    card.className =
      'mb-3 w-full break-inside-avoid overflow-hidden rounded-2xl bg-slate-100 text-left transition duration-300 hover:-translate-y-0.5 hover:shadow-md'
    card.addEventListener('click', () => invoke(onOpenDetail, pin.id))

    const image = document.createElement('img')
    image.src = pin.imageSrc
    image.alt = pin.altText || pin.title || 'Profile pin image'
    image.loading = 'lazy'
    image.decoding = 'async'
    image.fetchPriority = 'low'
    image.className = 'w-full object-cover'

    const label = document.createElement('p')
    label.className = 'px-2.5 py-2 text-xs font-semibold text-slate-700'
    label.textContent = pin.title || 'Untitled Pin'

    card.appendChild(image)
    card.appendChild(label)
    grid.appendChild(card)
  })

  gallery.appendChild(galleryTitle)
  gallery.appendChild(grid)

  section.appendChild(hero)
  section.appendChild(stats)
  section.appendChild(boards)
  section.appendChild(gallery)

  return section
}

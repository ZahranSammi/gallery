function invoke(handler, ...args) {
  if (typeof handler === 'function') {
    handler(...args)
  }
}

export function Header({
  query = '',
  onSearch,
  savedCount = 0,
  onOpenProfile,
  searchDebounceMs = 160,
} = {}) {
  let searchTimerId = null
  const debounceDelay = Number.isFinite(searchDebounceMs)
    ? Math.max(0, searchDebounceMs)
    : 0

  function emitSearch(value) {
    invoke(onSearch, value)
  }

  function scheduleSearch(value) {
    if (searchTimerId) {
      clearTimeout(searchTimerId)
      searchTimerId = null
    }

    if (debounceDelay === 0) {
      emitSearch(value)
      return
    }

    searchTimerId = setTimeout(() => {
      searchTimerId = null
      emitSearch(value)
    }, debounceDelay)
  }

  const header = document.createElement('header')
  header.className =
    'sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-md'

  const container = document.createElement('div')
  container.className =
    'flex w-full items-center gap-3 px-4 py-3 md:gap-4 md:px-6'

  const brand = document.createElement('div')
  brand.className = 'flex shrink-0 items-center gap-2 md:gap-3'

  const logo = document.createElement('div')
  logo.className =
    'grid h-10 w-10 place-items-center rounded-full bg-red-600 text-lg font-extrabold text-white shadow-sm'
  logo.textContent = 'P'

  const title = document.createElement('h1')
  title.textContent = 'Pinboard'
  title.className = 'text-base font-extrabold text-slate-900 md:text-lg'

  brand.appendChild(logo)
  brand.appendChild(title)

  const searchWrapper = document.createElement('label')
  searchWrapper.className =
    'group flex min-w-0 flex-1 items-center gap-2 rounded-full bg-slate-100 px-3 py-2 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-300 md:px-4 md:py-2.5'

  const searchIcon = document.createElement('span')
  searchIcon.textContent = 'Search'
  searchIcon.className =
    'hidden text-xs font-semibold tracking-wide text-slate-500 md:inline'

  const input = document.createElement('input')
  input.type = 'search'
  input.value = query
  input.placeholder = 'Cari ide dekorasi, outfit, atau resep...'
  input.className =
    'w-full border-none bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-500 md:text-base'

  input.addEventListener('input', (event) => {
    scheduleSearch(event.target.value)
  })

  input.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') {
      return
    }

    if (searchTimerId) {
      clearTimeout(searchTimerId)
      searchTimerId = null
    }

    emitSearch(event.target.value)
  })

  input.addEventListener('blur', () => {
    if (!searchTimerId) {
      return
    }

    clearTimeout(searchTimerId)
    searchTimerId = null
    emitSearch(input.value)
  })

  searchWrapper.appendChild(searchIcon)
  searchWrapper.appendChild(input)

  const rightActions = document.createElement('div')
  rightActions.className = 'flex shrink-0 items-center gap-2 md:gap-3'

  const savedBadge = document.createElement('span')
  savedBadge.dataset.savedCount = 'true'
  savedBadge.textContent = `Saved ${savedCount}`
  savedBadge.className =
    'rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white md:text-sm'

  const avatarButton = document.createElement('button')
  avatarButton.type = 'button'
  avatarButton.className =
    'rounded-full p-0.5 transition hover:ring-2 hover:ring-slate-300'
  avatarButton.setAttribute('aria-label', 'Open profile')
  avatarButton.addEventListener('click', () => invoke(onOpenProfile))

  const avatar = document.createElement('img')
  avatar.src = 'https://picsum.photos/id/1005/96/96'
  avatar.alt = 'Profile'
  avatar.className = 'h-10 w-10 rounded-full object-cover'

  avatarButton.appendChild(avatar)

  rightActions.appendChild(savedBadge)
  rightActions.appendChild(avatarButton)

  container.appendChild(brand)
  container.appendChild(searchWrapper)
  container.appendChild(rightActions)
  header.appendChild(container)

  return header
}

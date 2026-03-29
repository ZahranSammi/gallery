function invoke(handler, ...args) {
  if (typeof handler === 'function') {
    return handler(...args)
  }

  return undefined
}

function createNavButton(label, isActive, onClick) {
  const button = document.createElement('button')
  button.type = 'button'
  button.textContent = label
  button.className = isActive
    ? 'rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition'
    : 'rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900'
  button.addEventListener('click', () => invoke(onClick))
  return button
}

export function Header({
  query = '',
  onSearch,
  savedCount = 0,
  isAuthenticated = false,
  activeRoute = 'home',
  onNavigateHome,
  onNavigateExplore,
  onNavigateCreate,
  onOpenProfile,
  onOpenSettings,
  onOpenLogin,
  onOpenRegister,
  onLogout,
  avatarSrc = '',
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
    'sticky top-0 z-40 border-b border-slate-200/80 bg-white/86 backdrop-blur-xl'

  const container = document.createElement('div')
  container.className =
    'mx-auto flex w-full max-w-[1600px] flex-wrap items-center gap-3 px-4 py-3 md:flex-nowrap md:gap-4 md:px-6'

  const brand = document.createElement('button')
  brand.type = 'button'
  brand.className = 'flex shrink-0 items-center gap-3 rounded-full pr-2 text-left'
  brand.addEventListener('click', () => invoke(onNavigateHome))

  const logo = document.createElement('div')
  logo.className =
    'grid h-11 w-11 place-items-center rounded-[1.1rem] bg-gradient-to-br from-red-500 via-orange-400 to-amber-300 text-lg font-extrabold text-white shadow-[0_12px_30px_-18px_rgba(239,68,68,0.9)]'
  logo.textContent = 'P'

  const brandText = document.createElement('div')
  brandText.className = 'min-w-0'

  const title = document.createElement('p')
  title.textContent = 'Pinboard'
  title.className = 'text-base font-extrabold text-slate-900 md:text-lg'

  const subtitle = document.createElement('p')
  subtitle.textContent = 'Modern gallery for visual collecting'
  subtitle.className = 'hidden text-xs text-slate-500 lg:block'

  brandText.appendChild(title)
  brandText.appendChild(subtitle)
  brand.appendChild(logo)
  brand.appendChild(brandText)

  const nav = document.createElement('nav')
  nav.className = 'flex shrink-0 items-center gap-1 rounded-full bg-slate-100/90 p-1'
  nav.setAttribute('aria-label', 'Primary navigation')
  nav.appendChild(createNavButton('Home', activeRoute === 'home', onNavigateHome))
  nav.appendChild(createNavButton('Explore', activeRoute === 'explore', onNavigateExplore))
  nav.appendChild(createNavButton('Create', activeRoute === 'create', onNavigateCreate))

  const searchWrapper = document.createElement('label')
  searchWrapper.className =
    'group order-4 flex min-w-0 flex-1 items-center gap-2 rounded-full border border-transparent bg-slate-100 px-3 py-2 transition focus-within:border-slate-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-200 md:order-none md:px-4 md:py-2.5'

  const searchIcon = document.createElement('span')
  searchIcon.textContent = 'Search'
  searchIcon.className =
    'hidden text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 lg:inline'

  const input = document.createElement('input')
  input.type = 'search'
  input.value = query
  input.placeholder = 'Cari ide interior, styling, travel, atau visual notes...'
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
  rightActions.className = 'ml-auto flex shrink-0 items-center gap-2'

  const savedBadge = document.createElement('span')
  savedBadge.dataset.savedCount = 'true'
  savedBadge.textContent = `Saved ${savedCount}`
  savedBadge.className =
    'hidden rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white sm:inline-flex'
  rightActions.appendChild(savedBadge)

  if (isAuthenticated) {
    const settingsButton = document.createElement('button')
    settingsButton.type = 'button'
    settingsButton.textContent = 'Settings'
    settingsButton.className =
      activeRoute === 'settings'
        ? 'rounded-full border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition'
        : 'rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900'
    settingsButton.addEventListener('click', () => invoke(onOpenSettings))

    const avatarButton = document.createElement('button')
    avatarButton.type = 'button'
    avatarButton.className =
      activeRoute === 'profile'
        ? 'rounded-full ring-2 ring-slate-300 ring-offset-2 ring-offset-white'
        : 'rounded-full transition hover:ring-2 hover:ring-slate-300 hover:ring-offset-2 hover:ring-offset-white'
    avatarButton.setAttribute('aria-label', 'Open profile')
    avatarButton.addEventListener('click', () => invoke(onOpenProfile))

    const avatar = document.createElement('img')
    avatar.src = avatarSrc || 'https://picsum.photos/seed/pinboard-user/96/96'
    avatar.alt = 'Profile'
    avatar.className = 'h-11 w-11 rounded-full object-cover'

    const logoutButton = document.createElement('button')
    logoutButton.type = 'button'
    logoutButton.textContent = 'Logout'
    logoutButton.className =
      'hidden rounded-full border border-transparent px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 xl:inline-flex'
    logoutButton.addEventListener('click', () => invoke(onLogout))

    avatarButton.appendChild(avatar)
    rightActions.appendChild(settingsButton)
    rightActions.appendChild(logoutButton)
    rightActions.appendChild(avatarButton)
  } else {
    const loginButton = document.createElement('button')
    loginButton.type = 'button'
    loginButton.textContent = 'Log in'
    loginButton.className =
      activeRoute === 'login'
        ? 'rounded-full border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition'
        : 'rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900'
    loginButton.addEventListener('click', () => invoke(onOpenLogin))

    const registerButton = document.createElement('button')
    registerButton.type = 'button'
    registerButton.textContent = 'Join now'
    registerButton.className =
      activeRoute === 'register'
        ? 'rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700'
        : 'rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700'
    registerButton.addEventListener('click', () => invoke(onOpenRegister))

    rightActions.appendChild(loginButton)
    rightActions.appendChild(registerButton)
  }

  container.appendChild(brand)
  container.appendChild(nav)
  container.appendChild(searchWrapper)
  container.appendChild(rightActions)
  header.appendChild(container)

  return header
}


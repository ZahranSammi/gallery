import './style.css'
import { Header } from './Components/Header'
import Gallery, { PINS } from './Components/gallery'
import { PinDetail } from './Components/PinDetail'
import { EditProfile } from './Components/EditProfile'
import { Profile } from './Components/Profile'
import { Explore } from './Components/Explore'
import { CreatePin } from './Components/CreatePin'
import { Authentication } from './Components/Authentication'
import { BoardDetail } from './Components/BoardDetail'
import { NotFound } from './Components/NotFound'
import { Settings } from './Components/Settings'

const app = document.querySelector('#app')

if (!app) {
  throw new Error('Missing #app mount element.')
}

const ROUTES = {
  HOME: '#/',
  EXPLORE: '#/explore',
  PROFILE: '#/profile',
  PROFILE_EDIT: '#/profile/edit',
  CREATE: '#/pin/create',
  LOGIN: '#/login',
  REGISTER: '#/register',
  SETTINGS: '#/settings',
  NOT_FOUND: '#/404',
  PIN_PREFIX: '#/pin/',
  BOARD_PREFIX: '#/boards/',
}

const CURRENT_USER_ID = 'me'
const INITIAL_LIKES = 120
const LIKES_STEP = 37
const RELATED_PINS_LIMIT = 12
const MAX_QUERY_CACHE_SIZE = 40
const DAY_IN_MS = 24 * 60 * 60 * 1000

const baseProfile = {
  id: CURRENT_USER_ID,
  name: 'Zahra A.',
  handle: '@zahra.gallery',
  avatar: 'https://picsum.photos/seed/zahra-profile/160/160',
  bio: 'Curating visual references, moodboards, and polished gallery collections for everyday inspiration.',
  email: 'zahra@pinboard.dev',
  website: 'https://pinboard.gallery/zahra',
  followers: 18240,
  following: 391,
}

const currentUserSeedPins = new Set(['pin-02', 'pin-04', 'pin-15'])

function formatUpdatedLabel(dateValue) {
  const diffInDays = Math.max(0, Math.round((Date.now() - new Date(dateValue).getTime()) / DAY_IN_MS))

  if (diffInDays === 0) {
    return 'today'
  }

  if (diffInDays === 1) {
    return '1 day ago'
  }

  return `${diffInDays} days ago`
}

const state = {
  query: '',
  auth: {
    isAuthenticated: true,
    redirectAfterAuth: '',
  },
  navigation: {
    previousHash: ROUTES.HOME,
  },
  drafts: {
    createPin: null,
  },
  profile: { ...baseProfile },
  settings: {
    featuredBoardId: 'board-cozy-home',
    defaultBoardId: 'board-cozy-home',
    defaultBoardPrivacy: 'public',
    discoverable: true,
    showSavedPins: true,
    emailOnSave: true,
    emailOnBoardFollow: true,
    emailDigest: true,
    interests: ['interior', 'travel', 'styling'],
    mutedTags: ['spoiler'],
  },
  pins: PINS.map((pin, index) => {
    const isCurrentUserPin = currentUserSeedPins.has(pin.id)
    return {
      ...pin,
      likes: INITIAL_LIKES + index * LIKES_STEP,
      ownerId: isCurrentUserPin ? CURRENT_USER_ID : `creator-${index + 1}`,
      author: isCurrentUserPin ? baseProfile.name : pin.author,
      handle: isCurrentUserPin
        ? baseProfile.handle
        : `@${(pin.author || 'creator').toLowerCase().replace(/[^a-z0-9]+/g, '')}`,
      authorAvatar: isCurrentUserPin
        ? baseProfile.avatar
        : `https://picsum.photos/seed/avatar-${pin.id}/96/96`,
      createdAt: new Date(Date.now() - index * DAY_IN_MS).toISOString(),
      sourceUrl: '',
    }
  }),
  boards: [
    {
      id: 'board-cozy-home',
      name: 'Cozy Home Cues',
      description: 'Interior references with warm lighting, soft materials, and clean furniture rhythm.',
      privacy: 'public',
      ownerId: CURRENT_USER_ID,
      ownerName: baseProfile.name,
      theme: 'Interior',
      followers: 328,
      pinIds: ['pin-02', 'pin-04', 'pin-15'],
      updatedAt: new Date(Date.now() - DAY_IN_MS).toISOString(),
    },
    {
      id: 'board-weekend-escape',
      name: 'Weekend Escape',
      description: 'Pantai, roadtrip, dan visual yang cocok untuk recharge dan planning mini trip.',
      privacy: 'private',
      ownerId: CURRENT_USER_ID,
      ownerName: baseProfile.name,
      theme: 'Travel',
      followers: 92,
      pinIds: ['pin-09', 'pin-14', 'pin-16'],
      updatedAt: new Date(Date.now() - DAY_IN_MS * 3).toISOString(),
    },
    {
      id: 'board-visual-notes',
      name: 'Visual Notes',
      description: 'Texture, color, and composition studies for future product and editorial references.',
      privacy: 'public',
      ownerId: CURRENT_USER_ID,
      ownerName: baseProfile.name,
      theme: 'Design',
      followers: 214,
      pinIds: ['pin-05', 'pin-10', 'pin-13'],
      updatedAt: new Date(Date.now() - DAY_IN_MS * 2).toISOString(),
    },
    {
      id: 'board-city-moods',
      name: 'City Moods',
      description: 'Urban scenes, night lighting, and modern facades collected from public saves.',
      privacy: 'public',
      ownerId: 'creator-urban',
      ownerName: 'Awan',
      theme: 'Urban',
      followers: 801,
      pinIds: ['pin-07', 'pin-10', 'pin-13'],
      updatedAt: new Date(Date.now() - DAY_IN_MS * 4).toISOString(),
    },
  ],
}

let pinById = new Map()
let searchTextByPinId = new Map()
const filteredPinsCache = new Map()
const relatedPinsCache = new Map()

const shell = document.createElement('div')
shell.className = 'min-h-screen'

const headerMount = document.createElement('div')
const feedMount = document.createElement('main')

function normalizeQuery(query) {
  return query.trim().toLowerCase()
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function clearQueryCaches() {
  filteredPinsCache.clear()
  relatedPinsCache.clear()
}

function refreshPinIndexes() {
  pinById = new Map(state.pins.map((pin) => [pin.id, pin]))
  searchTextByPinId = new Map(
    state.pins.map((pin) => [
      pin.id,
      [pin.title, pin.caption, pin.author, ...(pin.tags || []), pin.sourceUrl]
        .join(' ')
        .toLowerCase(),
    ])
  )
  clearQueryCaches()
}

function getCurrentHash() {
  const hash = window.location.hash || ROUTES.HOME
  return hash === '#' ? ROUTES.HOME : hash
}

function parseRoute() {
  const hash = getCurrentHash()

  if (hash === ROUTES.HOME) {
    return { name: 'home' }
  }

  if (hash === ROUTES.EXPLORE) {
    return { name: 'explore' }
  }

  if (hash === ROUTES.PROFILE) {
    return { name: 'profile' }
  }

  if (hash === ROUTES.PROFILE_EDIT) {
    return { name: 'profileEdit' }
  }

  if (hash === ROUTES.CREATE) {
    return { name: 'create' }
  }

  if (hash === ROUTES.LOGIN) {
    return { name: 'login' }
  }

  if (hash === ROUTES.REGISTER) {
    return { name: 'register' }
  }

  if (hash === ROUTES.SETTINGS) {
    return { name: 'settings' }
  }

  if (hash === ROUTES.NOT_FOUND) {
    return { name: 'notFound' }
  }

  if (hash.startsWith(ROUTES.PIN_PREFIX) && hash !== ROUTES.CREATE) {
    return {
      name: 'pinDetail',
      id: decodeURIComponent(hash.slice(ROUTES.PIN_PREFIX.length)),
    }
  }

  if (hash.startsWith(ROUTES.BOARD_PREFIX)) {
    return {
      name: 'boardDetail',
      id: decodeURIComponent(hash.slice(ROUTES.BOARD_PREFIX.length)),
    }
  }

  return { name: 'unknown' }
}

function getActiveRoute(route) {
  if (route.name === 'explore') {
    return 'explore'
  }

  if (route.name === 'create') {
    return 'create'
  }

  if (route.name === 'settings') {
    return 'settings'
  }

  if (route.name === 'login') {
    return 'login'
  }

  if (route.name === 'register') {
    return 'register'
  }

  if (route.name === 'profile' || route.name === 'profileEdit' || route.name === 'boardDetail') {
    return 'profile'
  }

  return 'home'
}

function setFilteredCacheEntry(query, pins) {
  if (filteredPinsCache.has(query)) {
    return
  }

  if (filteredPinsCache.size >= MAX_QUERY_CACHE_SIZE) {
    const oldestQuery = filteredPinsCache.keys().next().value
    filteredPinsCache.delete(oldestQuery)
  }

  filteredPinsCache.set(query, pins)
}

function getFilteredPins() {
  const normalizedQuery = normalizeQuery(state.query)

  if (filteredPinsCache.has(normalizedQuery)) {
    return filteredPinsCache.get(normalizedQuery)
  }

  if (!normalizedQuery) {
    setFilteredCacheEntry(normalizedQuery, state.pins)
    return state.pins
  }

  const filteredPins = state.pins.filter((pin) => searchTextByPinId.get(pin.id).includes(normalizedQuery))
  setFilteredCacheEntry(normalizedQuery, filteredPins)
  return filteredPins
}

function getExplorePins() {
  return [...getFilteredPins()].sort((left, right) => right.likes - left.likes)
}

function getRelatedPins(pinId) {
  if (relatedPinsCache.has(pinId)) {
    return relatedPinsCache.get(pinId)
  }

  const currentPin = pinById.get(pinId)
  const currentTags = new Set(currentPin?.tags || [])

  const relatedPins = state.pins
    .filter((candidate) => candidate.id !== pinId)
    .sort((left, right) => {
      const leftScore = (left.tags || []).filter((tag) => currentTags.has(tag)).length
      const rightScore = (right.tags || []).filter((tag) => currentTags.has(tag)).length

      if (leftScore !== rightScore) {
        return rightScore - leftScore
      }

      return right.likes - left.likes
    })
    .slice(0, RELATED_PINS_LIMIT)

  relatedPinsCache.set(pinId, relatedPins)
  return relatedPins
}

function getUserBoards() {
  return state.boards.filter((board) => board.ownerId === CURRENT_USER_ID)
}

function getPublicBoards() {
  return state.boards.filter((board) => board.privacy === 'public' || board.ownerId === CURRENT_USER_ID)
}

function getBoardById(boardId) {
  return state.boards.find((board) => board.id === boardId) || null
}

function getBoardPins(board) {
  return board.pinIds.map((pinId) => pinById.get(pinId)).filter(Boolean)
}

function getSavedPinIds() {
  const ids = new Set()
  getUserBoards().forEach((board) => {
    board.pinIds.forEach((pinId) => ids.add(pinId))
  })
  return ids
}

function getCreatedPins() {
  return state.pins.filter((pin) => pin.ownerId === CURRENT_USER_ID)
}

function navigateTo(hash = ROUTES.HOME) {
  if (getCurrentHash() === hash) {
    renderCurrentView()
    return
  }

  window.location.hash = hash
}

function requireAuth(targetHash) {
  if (state.auth.isAuthenticated) {
    return true
  }

  state.auth.redirectAfterAuth = targetHash || getCurrentHash()
  navigateTo(ROUTES.LOGIN)
  return false
}

function ensureBoardDefaults() {
  const userBoards = getUserBoards()

  if (!userBoards.length) {
    state.settings.defaultBoardId = ''
    state.settings.featuredBoardId = ''
    return
  }

  if (!userBoards.some((board) => board.id === state.settings.defaultBoardId)) {
    state.settings.defaultBoardId = userBoards[0].id
  }

  if (state.settings.featuredBoardId && !userBoards.some((board) => board.id === state.settings.featuredBoardId)) {
    state.settings.featuredBoardId = ''
  }
}

function createBoard({ name, privacy = 'public', description = '', theme = 'Custom' }) {
  const board = {
    id: `board-${slugify(name)}-${Date.now().toString(36)}`,
    name,
    description: description || `Collection for ${name.toLowerCase()}.`,
    privacy,
    ownerId: CURRENT_USER_ID,
    ownerName: state.profile.name,
    theme,
    followers: 0,
    pinIds: [],
    updatedAt: new Date().toISOString(),
  }

  state.boards.unshift(board)
  ensureBoardDefaults()
  return board
}

function upsertBoard(boardId, updater) {
  state.boards = state.boards.map((board) => {
    if (board.id !== boardId) {
      return board
    }

    return updater(board)
  })
}

function togglePinInBoards(pinId) {
  const userBoards = getUserBoards()
  let defaultBoard = userBoards.find((board) => board.id === state.settings.defaultBoardId)

  if (!defaultBoard) {
    defaultBoard = createBoard({
      name: 'Saved for Later',
      privacy: state.settings.defaultBoardPrivacy || 'public',
      description: 'Quick-save board generated automatically from save actions.',
      theme: 'Quick Save',
    })
    state.settings.defaultBoardId = defaultBoard.id
  }

  const isAlreadySaved = userBoards.some((board) => board.pinIds.includes(pinId))

  state.boards = state.boards.map((board) => {
    if (board.ownerId !== CURRENT_USER_ID) {
      return board
    }

    if (isAlreadySaved) {
      return {
        ...board,
        pinIds: board.pinIds.filter((id) => id !== pinId),
        updatedAt: new Date().toISOString(),
      }
    }

    if (board.id !== defaultBoard.id) {
      return board
    }

    return {
      ...board,
      pinIds: [pinId, ...board.pinIds.filter((id) => id !== pinId)],
      updatedAt: new Date().toISOString(),
    }
  })
}

function renderHeader() {
  const route = parseRoute()
  const headerElement = Header({
    query: state.query,
    savedCount: getSavedPinIds().size,
    isAuthenticated: state.auth.isAuthenticated,
    activeRoute: getActiveRoute(route),
    avatarSrc: state.profile.avatar,
    onSearch: handleSearch,
    onNavigateHome: () => navigateTo(ROUTES.HOME),
    onNavigateExplore: () => navigateTo(ROUTES.EXPLORE),
    onNavigateCreate: () => {
      if (requireAuth(ROUTES.CREATE)) {
        navigateTo(ROUTES.CREATE)
      }
    },
    onOpenProfile: () => {
      if (requireAuth(ROUTES.PROFILE)) {
        navigateTo(ROUTES.PROFILE)
      }
    },
    onOpenSettings: () => {
      if (requireAuth(ROUTES.SETTINGS)) {
        navigateTo(ROUTES.SETTINGS)
      }
    },
    onOpenLogin: () => navigateTo(ROUTES.LOGIN),
    onOpenRegister: () => navigateTo(ROUTES.REGISTER),
    onLogout: handleLogout,
    searchDebounceMs: 160,
  })

  headerMount.replaceChildren(headerElement)
}

function renderSavedCount() {
  const savedCountElement = headerMount.querySelector('[data-saved-count]')

  if (savedCountElement) {
    savedCountElement.textContent = `Saved ${getSavedPinIds().size}`
  }
}

function handleSearch(nextQuery) {
  state.query = nextQuery
  const route = parseRoute()

  if (route.name !== 'home' && route.name !== 'explore') {
    navigateTo(nextQuery.trim() ? ROUTES.EXPLORE : ROUTES.HOME)
    return
  }

  renderCurrentView()
}

function openPinDetail(pinId) {
  state.navigation.previousHash = getCurrentHash()
  navigateTo(`${ROUTES.PIN_PREFIX}${encodeURIComponent(pinId)}`)
}

function openBoardDetail(boardId) {
  state.navigation.previousHash = getCurrentHash()
  navigateTo(`${ROUTES.BOARD_PREFIX}${encodeURIComponent(boardId)}`)
}

function closeDetail() {
  navigateTo(state.navigation.previousHash || ROUTES.HOME)
}

function handleToggleSave(pinId) {
  if (!requireAuth(getCurrentHash())) {
    return
  }

  togglePinInBoards(pinId)
  ensureBoardDefaults()
  renderCurrentView()
}

function handleLogout() {
  state.auth.isAuthenticated = false
  state.auth.redirectAfterAuth = ''
  navigateTo(ROUTES.HOME)
  renderCurrentView()
}

function handleSaveProfile(nextProfile) {
  state.profile = {
    ...state.profile,
    ...nextProfile,
    email: state.profile.email,
    website: state.profile.website,
  }
  renderHeader()
  navigateTo(ROUTES.PROFILE)
}

function handleSaveSettings(payload) {
  state.profile = {
    ...state.profile,
    ...payload.profile,
  }

  state.settings = {
    ...state.settings,
    ...payload.settings,
  }

  ensureBoardDefaults()
  renderHeader()
}

function handleAuthSubmit(payload) {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      state.auth.isAuthenticated = true

      if (payload.mode === 'register') {
        const normalizedHandle = `@${(payload.username || 'pinboard').replace(/^@/, '')}`
        state.profile = {
          ...state.profile,
          name: payload.name,
          handle: normalizedHandle,
          email: payload.email,
          avatar: `https://picsum.photos/seed/${slugify(normalizedHandle) || 'pinboard-user'}/160/160`,
          bio: 'New curator building a fresh collection of visual references.',
        }

        if (payload.interests?.length) {
          state.settings.interests = payload.interests
        }
      } else {
        state.profile = {
          ...state.profile,
          email: payload.email || state.profile.email,
        }
      }

      ensureBoardDefaults()
      renderHeader()
      const nextHash = state.auth.redirectAfterAuth || ROUTES.HOME
      state.auth.redirectAfterAuth = ''
      navigateTo(nextHash)
      resolve()
    }, 320)
  })
}

function handleSaveDraft(payload) {
  state.drafts.createPin = payload
}

function handleCreatePin(payload) {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      let targetBoardId = payload.boardId

      if (payload.newBoardName) {
        const newBoard = createBoard({
          name: payload.newBoardName,
          privacy: payload.privacy,
          description: `Collection for ${payload.newBoardName.toLowerCase()}.`,
          theme: 'Custom',
        })
        targetBoardId = newBoard.id
      }

      const newPin = {
        id: `pin-${Date.now().toString(36)}`,
        imageSrc: payload.imageSrc,
        altText: payload.altText || payload.title,
        title: payload.title,
        caption: payload.caption || 'Freshly published pin.',
        author: state.profile.name,
        tags: payload.tags.length ? payload.tags : ['inspiration'],
        likes: 0,
        handle: state.profile.handle,
        authorAvatar: state.profile.avatar,
        ownerId: CURRENT_USER_ID,
        createdAt: new Date().toISOString(),
        sourceUrl: payload.sourceUrl,
      }

      state.pins.unshift(newPin)
      refreshPinIndexes()

      if (targetBoardId) {
        upsertBoard(targetBoardId, (board) => ({
          ...board,
          pinIds: [newPin.id, ...board.pinIds.filter((pinId) => pinId !== newPin.id)],
          updatedAt: new Date().toISOString(),
        }))
      }

      state.drafts.createPin = null
      ensureBoardDefaults()
      renderHeader()
      navigateTo(`${ROUTES.PIN_PREFIX}${encodeURIComponent(newPin.id)}`)
      resolve(newPin)
    }, 360)
  })
}

function handleRemovePinFromBoard(boardId, pinId) {
  upsertBoard(boardId, (board) => ({
    ...board,
    pinIds: board.pinIds.filter((id) => id !== pinId),
    updatedAt: new Date().toISOString(),
  }))
  renderCurrentView()
}

function handleToggleBoardPrivacy(boardId) {
  upsertBoard(boardId, (board) => ({
    ...board,
    privacy: board.privacy === 'private' ? 'public' : 'private',
    updatedAt: new Date().toISOString(),
  }))
  renderCurrentView()
}

function renderFeed() {
  const galleryElement = Gallery(getFilteredPins(), {
    query: state.query,
    savedIds: getSavedPinIds(),
    onToggleSave: handleToggleSave,
    onOpenDetail: openPinDetail,
  })

  feedMount.replaceChildren(galleryElement)
}

function renderExplore() {
  const exploreElement = Explore({
    pins: getExplorePins(),
    boards: getPublicBoards().slice(0, 3),
    savedIds: getSavedPinIds(),
    interests: state.settings.interests,
    onToggleSave: handleToggleSave,
    onOpenDetail: openPinDetail,
    onOpenBoard: openBoardDetail,
  })

  feedMount.replaceChildren(exploreElement)
}

function renderDetail(pin) {
  const detailElement = PinDetail(pin, {
    onBack: closeDetail,
    relatedPins: getRelatedPins(pin.id),
    onOpenDetail: openPinDetail,
    isSaved: getSavedPinIds().has(pin.id),
    onToggleSave: handleToggleSave,
  })

  feedMount.replaceChildren(detailElement)
}

function renderProfile() {
  const profileElement = Profile({
    user: state.profile,
    createdPins: getCreatedPins(),
    savedPins: [...getSavedPinIds()].map((pinId) => pinById.get(pinId)).filter(Boolean),
    boards: getUserBoards(),
    showSavedPins: state.settings.showSavedPins,
    onOpenDetail: openPinDetail,
    onOpenBoard: openBoardDetail,
    onBackHome: () => navigateTo(ROUTES.HOME),
    onEditProfile: () => navigateTo(ROUTES.PROFILE_EDIT),
    onOpenSettings: () => navigateTo(ROUTES.SETTINGS),
    onCreatePin: () => navigateTo(ROUTES.CREATE),
  })

  feedMount.replaceChildren(profileElement)
}

function renderEditProfile() {
  const editProfileElement = EditProfile({
    user: state.profile,
    onSave: handleSaveProfile,
    onCancel: () => navigateTo(ROUTES.PROFILE),
  })

  feedMount.replaceChildren(editProfileElement)
}

function renderCreatePin() {
  const createPinElement = CreatePin({
    boards: getUserBoards(),
    draft: state.drafts.createPin,
    onSubmit: handleCreatePin,
    onSaveDraft: handleSaveDraft,
    onCancel: () => navigateTo(ROUTES.HOME),
  })

  feedMount.replaceChildren(createPinElement)
}

function renderAuth(mode) {
  const authenticationElement = Authentication({
    mode,
    redirectTo: state.auth.redirectAfterAuth,
    isAuthenticated: state.auth.isAuthenticated,
    currentUser: state.profile,
    onSubmit: handleAuthSubmit,
    onSwitch: () => navigateTo(mode === 'login' ? ROUTES.REGISTER : ROUTES.LOGIN),
  })

  feedMount.replaceChildren(authenticationElement)
}

function renderSettings() {
  const settingsElement = Settings({
    user: state.profile,
    settings: state.settings,
    boards: getUserBoards(),
    onSave: handleSaveSettings,
    onCancel: () => navigateTo(ROUTES.PROFILE),
    onLogout: handleLogout,
  })

  feedMount.replaceChildren(settingsElement)
}

function renderBoard(board) {
  const boardPins = getBoardPins(board)
  const boardElement = BoardDetail({
    board: {
      ...board,
      updatedLabel: formatUpdatedLabel(board.updatedAt),
    },
    pins: boardPins,
    isOwner: board.ownerId === CURRENT_USER_ID,
    onBack: closeDetail,
    onOpenPin: openPinDetail,
    onCreatePin: () => navigateTo(ROUTES.CREATE),
    onRemovePin: handleRemovePinFromBoard,
    onTogglePrivacy: handleToggleBoardPrivacy,
    onGoProfile: () => navigateTo(ROUTES.PROFILE),
  })

  feedMount.replaceChildren(boardElement)
}

function renderNotFound(title, message) {
  const notFoundElement = NotFound({
    title,
    message,
    onGoHome: () => navigateTo(ROUTES.HOME),
    onGoExplore: () => navigateTo(ROUTES.EXPLORE),
  })

  feedMount.replaceChildren(notFoundElement)
}

function renderCurrentView() {
  renderHeader()
  ensureBoardDefaults()

  const route = parseRoute()

  if (route.name === 'profile' || route.name === 'profileEdit' || route.name === 'create' || route.name === 'settings') {
    if (!requireAuth(getCurrentHash())) {
      return
    }
  }

  if (route.name === 'home') {
    renderFeed()
    renderSavedCount()
    return
  }

  if (route.name === 'explore') {
    renderExplore()
    renderSavedCount()
    return
  }

  if (route.name === 'profile') {
    renderProfile()
    renderSavedCount()
    return
  }

  if (route.name === 'profileEdit') {
    renderEditProfile()
    renderSavedCount()
    return
  }

  if (route.name === 'create') {
    renderCreatePin()
    renderSavedCount()
    return
  }

  if (route.name === 'settings') {
    renderSettings()
    renderSavedCount()
    return
  }

  if (route.name === 'login') {
    renderAuth('login')
    renderSavedCount()
    return
  }

  if (route.name === 'register') {
    renderAuth('register')
    renderSavedCount()
    return
  }

  if (route.name === 'pinDetail') {
    const selectedPin = pinById.get(route.id)

    if (!selectedPin) {
      renderNotFound('Pin not found', 'Pin yang kamu buka tidak tersedia atau sudah dipindahkan dari gallery ini.')
      renderSavedCount()
      return
    }

    renderDetail(selectedPin)
    renderSavedCount()
    return
  }

  if (route.name === 'boardDetail') {
    const selectedBoard = getBoardById(route.id)

    if (!selectedBoard) {
      renderNotFound('Board not found', 'Board yang kamu cari tidak ada, mungkin dihapus atau URL-nya sudah berubah.')
      renderSavedCount()
      return
    }

    if (selectedBoard.privacy === 'private' && selectedBoard.ownerId !== CURRENT_USER_ID) {
      renderNotFound('Board is private', 'Board ini bersifat private dan tidak bisa diakses dari akun yang sedang aktif.')
      renderSavedCount()
      return
    }

    renderBoard(selectedBoard)
    renderSavedCount()
    return
  }

  renderNotFound('Page not found', 'Halaman yang kamu cari tidak tersedia. Coba kembali ke home atau explore untuk melanjutkan browsing.')
  renderSavedCount()
}

function init() {
  refreshPinIndexes()
  ensureBoardDefaults()
  shell.replaceChildren(headerMount, feedMount)
  app.replaceChildren(shell)
  renderCurrentView()
}

window.addEventListener('hashchange', renderCurrentView)

init()

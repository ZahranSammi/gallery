import './style.css'
import { Header } from './Components/Header'
import { Card } from './Components/Card'
import Gallery, { PINS } from './Components/gallery'
import { PinDetail } from './Components/PinDetail'
import { EditProfile } from './Components/EditProfile'
import { Profile } from './Components/Profile'

const app = document.querySelector('#app')

if (!app) {
  throw new Error('Missing #app mount element.')
}

const ROUTES = {
  HOME: '',
  PROFILE: '#/profile',
  PROFILE_EDIT: '#/profile/edit',
  PIN_PREFIX: '#/pin/',
}

const INITIAL_LIKES = 120
const LIKES_STEP = 37
const RELATED_PINS_LIMIT = 12
const MAX_QUERY_CACHE_SIZE = 40

const state = {
  query: '',
  savedIds: new Set(),
  profile: {
    name: 'Zahra A.',
    handle: '@zahra.gallery',
    avatar: 'https://picsum.photos/id/1005/160/160',
    bio: 'Curating visual references and stylish moments for daily inspiration.',
    followers: 18240,
    following: 391,
  },
  pins: PINS.map((pin, index) => ({
    ...pin,
    likes: INITIAL_LIKES + index * LIKES_STEP,
    handle: `@${(pin.author || 'creator').toLowerCase().replace(/[^a-z0-9]+/g, '')}`,
    authorAvatar: `https://picsum.photos/seed/avatar-${pin.id}/96/96`,
  })),
}

const pinById = new Map(state.pins.map((pin) => [pin.id, pin]))
const searchTextByPinId = new Map(
  state.pins.map((pin) => [
    pin.id,
    [pin.title, pin.caption, pin.author, ...(pin.tags || [])]
      .join(' ')
      .toLowerCase(),
  ])
)
const filteredPinsCache = new Map()
const relatedPinsCache = new Map()

const shell = document.createElement('div')
shell.className = 'min-h-screen'

const feedMount = document.createElement('main')

function normalizeQuery(query) {
  return query.trim().toLowerCase()
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

  const filteredPins = state.pins.filter((pin) =>
    searchTextByPinId.get(pin.id).includes(normalizedQuery)
  )

  setFilteredCacheEntry(normalizedQuery, filteredPins)
  return filteredPins
}

function getCurrentPinId() {
  const hash = window.location.hash || ''

  if (!hash.startsWith(ROUTES.PIN_PREFIX)) {
    return null
  }

  return decodeURIComponent(hash.slice(ROUTES.PIN_PREFIX.length))
}

function isProfileRoute() {
  return (window.location.hash || '') === ROUTES.PROFILE
}

function isEditProfileRoute() {
  return (window.location.hash || '') === ROUTES.PROFILE_EDIT
}

function getSelectedPin() {
  const selectedPinId = getCurrentPinId()

  if (!selectedPinId) {
    return null
  }

  return pinById.get(selectedPinId) || null
}

function getRelatedPins(pinId) {
  if (relatedPinsCache.has(pinId)) {
    return relatedPinsCache.get(pinId)
  }

  const relatedPins = state.pins
    .filter((candidate) => candidate.id !== pinId)
    .slice(0, RELATED_PINS_LIMIT)

  relatedPinsCache.set(pinId, relatedPins)
  return relatedPins
}

function navigateTo(hash = ROUTES.HOME) {
  if (window.location.hash === hash) {
    renderCurrentView()
    return
  }

  window.location.hash = hash
}

function handleSearch(nextQuery) {
  if (state.query === nextQuery) {
    return
  }

  state.query = nextQuery

  if (isProfileRoute() || isEditProfileRoute() || getCurrentPinId()) {
    return
  }

  renderFeed()
  renderSavedCount()
}

function rerenderSavedCard(pinId) {
  const cardElement = feedMount.querySelector(`[data-pin-id="${pinId}"]`)

  if (!cardElement) {
    return
  }

  const pin = pinById.get(pinId)

  if (!pin) {
    return
  }

  const nextCard = Card(pin, {
    isSaved: state.savedIds.has(pinId),
    onToggleSave: handleToggleSave,
    onOpenDetail: openPinDetail,
  })

  cardElement.replaceWith(nextCard)
}

function handleToggleSave(pinId) {
  if (state.savedIds.has(pinId)) {
    state.savedIds.delete(pinId)
  } else {
    state.savedIds.add(pinId)
  }

  renderSavedCount()

  if (isProfileRoute() || isEditProfileRoute() || getCurrentPinId()) {
    renderCurrentView()
    return
  }

  rerenderSavedCard(pinId)
}

function openPinDetail(pinId) {
  navigateTo(`${ROUTES.PIN_PREFIX}${encodeURIComponent(pinId)}`)
}

function closePinDetail() {
  navigateTo(ROUTES.HOME)
}

function openProfile() {
  navigateTo(ROUTES.PROFILE)
}

function openEditProfile() {
  navigateTo(ROUTES.PROFILE_EDIT)
}

function closeEditProfile() {
  navigateTo(ROUTES.PROFILE)
}

function closeProfile() {
  navigateTo(ROUTES.HOME)
}

function handleSaveProfile(nextProfile) {
  state.profile = {
    ...state.profile,
    ...nextProfile,
  }

  navigateTo(ROUTES.PROFILE)
}

function renderSavedCount() {
  const savedCountElement = shell.querySelector('[data-saved-count]')

  if (savedCountElement) {
    savedCountElement.textContent = `Saved ${state.savedIds.size}`
  }
}

function renderFeed() {
  const filteredPins = getFilteredPins()
  const galleryElement = Gallery(filteredPins, {
    query: state.query,
    savedIds: state.savedIds,
    onToggleSave: handleToggleSave,
    onOpenDetail: openPinDetail,
  })

  feedMount.replaceChildren(galleryElement)
}

function renderDetail(pin) {
  const detailElement = PinDetail(pin, {
    onBack: closePinDetail,
    relatedPins: getRelatedPins(pin.id),
    onOpenDetail: openPinDetail,
    isSaved: state.savedIds.has(pin.id),
    onToggleSave: handleToggleSave,
  })

  feedMount.replaceChildren(detailElement)
}

function renderProfile() {
  const savedPins = state.pins.filter((pin) => state.savedIds.has(pin.id))
  const profileElement = Profile({
    user: state.profile,
    createdPins: state.pins,
    savedPins,
    onOpenDetail: openPinDetail,
    onBackHome: closeProfile,
    onEditProfile: openEditProfile,
  })

  feedMount.replaceChildren(profileElement)
}

function renderEditProfile() {
  const editProfileElement = EditProfile({
    user: state.profile,
    onSave: handleSaveProfile,
    onCancel: closeEditProfile,
  })

  feedMount.replaceChildren(editProfileElement)
}

function renderCurrentView() {
  if (isEditProfileRoute()) {
    renderEditProfile()
    renderSavedCount()
    return
  }

  if (isProfileRoute()) {
    renderProfile()
    renderSavedCount()
    return
  }

  const selectedPin = getSelectedPin()

  if (selectedPin) {
    renderDetail(selectedPin)
    renderSavedCount()
    return
  }

  renderFeed()
  renderSavedCount()
}

function init() {
  const headerElement = Header({
    query: state.query,
    onSearch: handleSearch,
    savedCount: state.savedIds.size,
    onOpenProfile: openProfile,
    searchDebounceMs: 160,
  })

  shell.replaceChildren(headerElement, feedMount)
  app.replaceChildren(shell)

  renderCurrentView()
}

window.addEventListener('hashchange', renderCurrentView)

init()

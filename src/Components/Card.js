function invoke(handler, ...args) {
  if (typeof handler === 'function') {
    handler(...args)
  }
}

const SAVE_BUTTON_HOVER_CLASSES = [
  'opacity-100',
  'sm:opacity-0',
  'sm:group-hover:opacity-100',
]

function applySaveButtonState(button, isSaved) {
  button.textContent = isSaved ? 'Saved' : 'Save'
  button.setAttribute('aria-pressed', String(isSaved))
  button.classList.toggle('bg-red-600', isSaved)
  button.classList.toggle('bg-black/75', !isSaved)

  SAVE_BUTTON_HOVER_CLASSES.forEach((className) => {
    button.classList.toggle(className, !isSaved)
  })
}

export function Card(pin, { isSaved = false, onToggleSave, onOpenDetail } = {}) {
  const card = document.createElement('article')
  card.className = 'group pin-card mb-4 break-inside-avoid'
  card.dataset.pinId = pin.id

  const media = document.createElement('div')
  media.className =
    'relative overflow-hidden rounded-[1.35rem] bg-slate-200 shadow-sm transition duration-300 group-hover:shadow-xl'

  const image = document.createElement('img')
  image.src = pin.imageSrc
  image.alt = pin.altText || pin.title || 'Pin Image'
  image.loading = 'lazy'
  image.decoding = 'async'
  image.fetchPriority = 'low'
  image.className =
    'block w-full rounded-[1.35rem] object-cover transition duration-500 group-hover:scale-[1.03]'

  const overlay = document.createElement('div')
  overlay.className =
    'pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition duration-300 group-hover:opacity-100'

  const saveButton = document.createElement('button')
  saveButton.type = 'button'
  saveButton.dataset.role = 'save-button'
  saveButton.className =
    'absolute right-3 top-3 rounded-full px-4 py-2 text-xs font-semibold text-white shadow-lg transition md:text-sm'
  applySaveButtonState(saveButton, isSaved)

  const openDetail = () => invoke(onOpenDetail, pin.id)

  saveButton.addEventListener('click', (event) => {
    event.stopPropagation()
    invoke(onToggleSave, pin.id)
  })

  media.addEventListener('click', openDetail)

  media.tabIndex = 0
  media.setAttribute('role', 'button')
  media.setAttribute('aria-label', `Open ${pin.title || 'pin'} details`)
  media.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openDetail()
    }
  })

  media.appendChild(image)
  media.appendChild(overlay)
  media.appendChild(saveButton)

  const meta = document.createElement('div')
  meta.className = 'px-1.5 pt-3'

  const title = document.createElement('p')
  title.className = 'pin-title text-[0.95rem] font-bold leading-snug text-slate-900'
  title.textContent = pin.title || 'Untitled Pin'

  const author = document.createElement('p')
  author.className = 'mt-1 text-xs font-medium text-slate-500'
  author.textContent = pin.author || 'Unknown creator'

  meta.appendChild(title)
  meta.appendChild(author)

  card.appendChild(media)
  card.appendChild(meta)

  return card
}

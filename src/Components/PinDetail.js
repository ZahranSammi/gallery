function invoke(handler, ...args) {
  if (typeof handler === 'function') {
    handler(...args)
  }
}

export function PinDetail(
  pin,
  { onBack, relatedPins = [], onOpenDetail, isSaved = false, onToggleSave } = {}
) {
  const section = document.createElement('section')
  section.className = 'detail-page w-full px-4 pb-10 pt-6 md:px-6'

  const layout = document.createElement('div')
  layout.className = 'detail-layout grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]'

  const leftPanel = document.createElement('article')
  leftPanel.className =
    'detail-panel overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/92 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.45)]'

  const actionBar = document.createElement('div')
  actionBar.className = 'flex items-center justify-between border-b border-slate-200/80 px-4 py-3 md:px-6'

  const leftActions = document.createElement('div')
  leftActions.className = 'flex items-center gap-2'

  const backButton = document.createElement('button')
  backButton.type = 'button'
  backButton.textContent = 'Back'
  backButton.className =
    'rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 md:text-sm'
  backButton.addEventListener('click', () => invoke(onBack))

  const likesChip = document.createElement('span')
  likesChip.className =
    'rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 md:text-sm'
  likesChip.textContent = `${pin.likes || 0} likes`

  const saveButton = document.createElement('button')
  saveButton.type = 'button'
  saveButton.textContent = isSaved ? 'Saved' : 'Save'
  saveButton.className = isSaved
    ? 'rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-700 md:text-sm'
    : 'rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-700 md:text-sm'
  saveButton.addEventListener('click', () => invoke(onToggleSave, pin.id))

  leftActions.appendChild(backButton)
  leftActions.appendChild(likesChip)
  actionBar.appendChild(leftActions)
  actionBar.appendChild(saveButton)

  const hero = document.createElement('div')
  hero.className = 'relative px-4 pt-4 md:px-6 md:pt-6'

  const mainImage = document.createElement('img')
  mainImage.src = pin.imageSrc
  mainImage.alt = pin.altText || pin.title || 'Pin image'
  mainImage.decoding = 'async'
  mainImage.loading = 'eager'
  mainImage.fetchPriority = 'high'
  mainImage.className = 'detail-hero-image w-full rounded-[1.35rem] object-cover'

  const zoomIndicator = document.createElement('span')
  zoomIndicator.className =
    'absolute bottom-7 right-7 rounded-full border border-white/75 bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm'
  zoomIndicator.textContent = 'Open'

  hero.appendChild(mainImage)
  hero.appendChild(zoomIndicator)

  const content = document.createElement('div')
  content.className = 'px-4 pb-4 pt-5 md:px-6 md:pb-6'

  const title = document.createElement('h2')
  title.className = 'text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl'
  title.textContent = pin.title || 'Untitled Pin'

  const description = document.createElement('p')
  description.className = 'mt-2 text-[0.97rem] leading-relaxed text-slate-600 md:text-base'
  description.textContent = pin.caption || 'No description available.'

  const accountRow = document.createElement('div')
  accountRow.className = 'mt-5 flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-3 py-3 md:px-4'

  const account = document.createElement('div')
  account.className = 'flex min-w-0 items-center gap-3'

  const accountAvatar = document.createElement('img')
  accountAvatar.src = pin.authorAvatar || 'https://picsum.photos/id/1005/80/80'
  accountAvatar.alt = `${pin.author || 'Creator'} profile`
  accountAvatar.className = 'h-11 w-11 shrink-0 rounded-full border border-slate-200 object-cover'

  const accountInfo = document.createElement('div')
  accountInfo.className = 'min-w-0'

  const accountName = document.createElement('p')
  accountName.className = 'truncate text-sm font-bold text-slate-900'
  accountName.textContent = pin.author || 'Unknown creator'

  const accountHandle = document.createElement('p')
  accountHandle.className = 'truncate text-xs text-slate-500'
  accountHandle.textContent = pin.handle || '@unknown'

  const followButton = document.createElement('button')
  followButton.type = 'button'
  followButton.textContent = 'Follow'
  followButton.className =
    'rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900'

  accountInfo.appendChild(accountName)
  accountInfo.appendChild(accountHandle)
  account.appendChild(accountAvatar)
  account.appendChild(accountInfo)
  accountRow.appendChild(account)
  accountRow.appendChild(followButton)

  content.appendChild(title)
  content.appendChild(description)
  content.appendChild(accountRow)

  leftPanel.appendChild(actionBar)
  leftPanel.appendChild(hero)
  leftPanel.appendChild(content)

  const rightPanel = document.createElement('aside')
  rightPanel.className = 'detail-side rounded-[2rem] border border-slate-200/80 bg-white/85 p-4 shadow-sm md:p-5'

  const rightHeading = document.createElement('h3')
  rightHeading.className = 'mb-3 text-sm font-extrabold uppercase tracking-[0.12em] text-slate-500'
  rightHeading.textContent = 'From Many Accounts'

  const relatedGrid = document.createElement('div')
  relatedGrid.className = 'detail-related-grid columns-2 gap-3 sm:columns-3 lg:columns-2 xl:columns-3'

  if (!relatedPins.length) {
    const emptyRelated = document.createElement('p')
    emptyRelated.className = 'rounded-2xl bg-slate-100 px-4 py-6 text-sm text-slate-600'
    emptyRelated.textContent = 'No related pins available yet.'
    relatedGrid.appendChild(emptyRelated)
  } else {
    relatedPins.forEach((relatedPin) => {
      const button = document.createElement('button')
      button.type = 'button'
      button.className =
        'detail-related-item mb-3 w-full break-inside-avoid overflow-hidden rounded-2xl bg-slate-100 text-left transition duration-300 hover:-translate-y-0.5 hover:shadow-md'
      button.addEventListener('click', () => invoke(onOpenDetail, relatedPin.id))

      const image = document.createElement('img')
      image.src = relatedPin.imageSrc
      image.alt = relatedPin.altText || relatedPin.title || 'Related pin image'
      image.loading = 'lazy'
      image.decoding = 'async'
      image.fetchPriority = 'low'
      image.className = 'w-full object-cover'

      const meta = document.createElement('div')
      meta.className = 'flex items-center gap-2 px-2.5 py-2'

      const metaAvatar = document.createElement('img')
      metaAvatar.src = relatedPin.authorAvatar || 'https://picsum.photos/id/1005/40/40'
      metaAvatar.alt = `${relatedPin.author || 'Creator'} profile`
      metaAvatar.loading = 'lazy'
      metaAvatar.decoding = 'async'
      metaAvatar.className = 'h-6 w-6 rounded-full object-cover'

      const metaText = document.createElement('div')
      metaText.className = 'min-w-0'

      const metaTitle = document.createElement('p')
      metaTitle.className = 'truncate text-[0.72rem] font-semibold text-slate-700'
      metaTitle.textContent = relatedPin.title || 'Untitled Pin'

      const metaAccount = document.createElement('p')
      metaAccount.className = 'truncate text-[0.68rem] text-slate-500'
      metaAccount.textContent = relatedPin.handle || '@unknown'

      metaText.appendChild(metaTitle)
      metaText.appendChild(metaAccount)
      meta.appendChild(metaAvatar)
      meta.appendChild(metaText)

      button.appendChild(image)
      button.appendChild(meta)
      relatedGrid.appendChild(button)
    })
  }

  rightPanel.appendChild(rightHeading)
  rightPanel.appendChild(relatedGrid)

  layout.appendChild(leftPanel)
  layout.appendChild(rightPanel)
  section.appendChild(layout)

  return section
}

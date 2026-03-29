function invoke(handler, ...args) {
  if (typeof handler === 'function') {
    return handler(...args)
  }

  return undefined
}

function createField(label, input, hint = '') {
  const wrapper = document.createElement('label')
  wrapper.className = 'grid gap-2 text-sm font-semibold text-slate-700'

  const caption = document.createElement('span')
  caption.textContent = label

  wrapper.appendChild(caption)
  wrapper.appendChild(input)

  if (hint) {
    const text = document.createElement('p')
    text.className = 'text-sm font-normal leading-relaxed text-slate-500'
    text.textContent = hint
    wrapper.appendChild(text)
  }

  return wrapper
}

function createInput(type, value = '', placeholder = '') {
  const input = document.createElement(type === 'textarea' ? 'textarea' : 'input')
  input.className =
    'rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100'

  if (type === 'textarea') {
    input.rows = 4
    input.value = value
    input.placeholder = placeholder
  } else {
    input.type = type
    input.value = value
    input.placeholder = placeholder
  }

  return input
}

function createToggle(name, labelText, checked = false) {
  const label = document.createElement('label')
  label.className = 'flex items-start gap-3 rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600'

  const input = document.createElement('input')
  input.type = 'checkbox'
  input.name = name
  input.checked = checked
  input.className = 'mt-0.5 h-4 w-4 shrink-0 accent-slate-900'

  const text = document.createElement('span')
  text.textContent = labelText

  label.appendChild(input)
  label.appendChild(text)

  return { label, input }
}

export function Settings({ user, settings, boards = [], onSave, onCancel, onLogout } = {}) {
  const page = document.createElement('section')
  page.className = 'settings-page w-full px-4 pb-10 pt-6 md:px-6'

  const layout = document.createElement('div')
  layout.className = 'grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]'

  const sidebar = document.createElement('aside')
  sidebar.className =
    'rounded-[2rem] border border-slate-200/80 bg-white/92 p-5 shadow-[0_22px_60px_-34px_rgba(15,23,42,0.42)]'

  const sidebarTitle = document.createElement('h2')
  sidebarTitle.className = 'text-2xl font-extrabold tracking-tight text-slate-900'
  sidebarTitle.textContent = 'Settings'

  const sidebarCaption = document.createElement('p')
  sidebarCaption.className = 'mt-2 text-sm leading-relaxed text-slate-500'
  sidebarCaption.textContent =
    'Fokus pengaturan untuk gallery app: profil visual, board defaults, privacy, notifications, dan preferensi discovery.'

  const navList = document.createElement('div')
  navList.className = 'mt-5 grid gap-2'

  ;['Account', 'Profile Customization', 'Privacy', 'Notifications', 'Board Defaults', 'Content Preferences', 'Security'].forEach((item, index) => {
    const chip = document.createElement('div')
    chip.className =
      index === 0
        ? 'rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white'
        : 'rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500'
    chip.textContent = item
    navList.appendChild(chip)
  })

  const sidebarActions = document.createElement('div')
  sidebarActions.className = 'mt-6 flex flex-wrap gap-3'

  const cancelButton = document.createElement('button')
  cancelButton.type = 'button'
  cancelButton.className =
    'rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900'
  cancelButton.textContent = 'Back'
  cancelButton.addEventListener('click', () => invoke(onCancel))

  const logoutButton = document.createElement('button')
  logoutButton.type = 'button'
  logoutButton.className =
    'rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:text-red-700'
  logoutButton.textContent = 'Logout'
  logoutButton.addEventListener('click', () => invoke(onLogout))

  sidebarActions.appendChild(cancelButton)
  sidebarActions.appendChild(logoutButton)
  sidebar.appendChild(sidebarTitle)
  sidebar.appendChild(sidebarCaption)
  sidebar.appendChild(navList)
  sidebar.appendChild(sidebarActions)

  const panel = document.createElement('article')
  panel.className =
    'overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/92 shadow-[0_22px_60px_-34px_rgba(15,23,42,0.42)]'

  const form = document.createElement('form')
  form.className = 'grid gap-6 p-5 md:p-6'

  const notice = document.createElement('div')
  notice.className = 'hidden rounded-[1.4rem] border px-4 py-3 text-sm font-medium'

  const nameInput = createInput('text', user?.name || '', 'Display name')
  nameInput.name = 'name'
  const handleInput = createInput('text', (user?.handle || '').replace(/^@/, ''), 'username')
  handleInput.name = 'handle'
  const emailInput = createInput('email', user?.email || '', 'you@example.com')
  emailInput.name = 'email'
  const websiteInput = createInput('url', user?.website || '', 'https://portfolio.site')
  websiteInput.name = 'website'
  const bioInput = createInput('textarea', user?.bio || '', 'Ceritakan selera visual atau niche board kamu')
  bioInput.name = 'bio'

  const featuredSelect = document.createElement('select')
  featuredSelect.name = 'featuredBoardId'
  featuredSelect.className =
    'rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100'

  const defaultBoardSelect = document.createElement('select')
  defaultBoardSelect.name = 'defaultBoardId'
  defaultBoardSelect.className =
    'rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100'

  const emptyOption = document.createElement('option')
  emptyOption.value = ''
  emptyOption.textContent = 'No featured board'
  featuredSelect.appendChild(emptyOption)

  boards.forEach((board) => {
    const featuredOption = document.createElement('option')
    featuredOption.value = board.id
    featuredOption.textContent = board.name
    featuredOption.selected = settings?.featuredBoardId === board.id
    featuredSelect.appendChild(featuredOption)

    const defaultOption = document.createElement('option')
    defaultOption.value = board.id
    defaultOption.textContent = board.name
    defaultOption.selected = settings?.defaultBoardId === board.id
    defaultBoardSelect.appendChild(defaultOption)
  })

  const privacySelect = document.createElement('select')
  privacySelect.name = 'defaultBoardPrivacy'
  privacySelect.className =
    'rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100'
  ;['public', 'private'].forEach((value) => {
    const option = document.createElement('option')
    option.value = value
    option.textContent = value === 'public' ? 'Public' : 'Private'
    option.selected = (settings?.defaultBoardPrivacy || 'public') === value
    privacySelect.appendChild(option)
  })

  const interestsInput = createInput('text', (settings?.interests || []).join(', '), 'interior, travel, styling')
  interestsInput.name = 'interests'
  const mutedTagsInput = createInput('text', (settings?.mutedTags || []).join(', '), 'spoiler, violence')
  mutedTagsInput.name = 'mutedTags'

  const currentPasswordInput = createInput('password', '', 'Current password')
  currentPasswordInput.name = 'currentPassword'
  const newPasswordInput = createInput('password', '', 'New password')
  newPasswordInput.name = 'newPassword'
  const confirmPasswordInput = createInput('password', '', 'Confirm new password')
  confirmPasswordInput.name = 'confirmPassword'

  const discoverabilityToggle = createToggle(
    'discoverable',
    'Izinkan profil dan board publik muncul di hasil pencarian dan Explore.',
    settings?.discoverable
  )
  const savedPinsToggle = createToggle(
    'showSavedPins',
    'Tampilkan saved pins di profil agar orang lain bisa melihat koleksi referensi kamu.',
    settings?.showSavedPins
  )
  const notifySaveToggle = createToggle(
    'emailOnSave',
    'Kirim notifikasi saat pin saya disimpan orang lain.',
    settings?.emailOnSave
  )
  const notifyFollowToggle = createToggle(
    'emailOnBoardFollow',
    'Kirim notifikasi saat board saya diikuti atau dibagikan.',
    settings?.emailOnBoardFollow
  )
  const digestToggle = createToggle(
    'emailDigest',
    'Kirim ringkasan inspirasi mingguan berdasarkan board dan minat visual saya.',
    settings?.emailDigest
  )

  const sectionGrid = document.createElement('div')
  sectionGrid.className = 'grid gap-6'

  const accountCard = document.createElement('section')
  accountCard.className = 'rounded-[1.8rem] border border-slate-200 bg-slate-50/80 p-5'
  accountCard.innerHTML = '<h3 class="text-lg font-extrabold text-slate-900">Account</h3><p class="mt-1 text-sm text-slate-500">Atur identitas profil dan detail creator-facing yang terlihat di app.</p>'

  const accountFields = document.createElement('div')
  accountFields.className = 'mt-5 grid gap-4 md:grid-cols-2'
  accountFields.appendChild(createField('Display name', nameInput))
  accountFields.appendChild(createField('Username', handleInput))
  accountFields.appendChild(createField('Email', emailInput))
  accountFields.appendChild(createField('Website', websiteInput))
  accountFields.appendChild(createField('Bio', bioInput, 'Gunakan bio untuk menjelaskan gaya board atau niche visualmu.'))
  sectionGrid.appendChild(accountCard)
  accountCard.appendChild(accountFields)

  const customizationCard = document.createElement('section')
  customizationCard.className = 'rounded-[1.8rem] border border-slate-200 bg-slate-50/80 p-5'
  customizationCard.innerHTML = '<h3 class="text-lg font-extrabold text-slate-900">Profile Customization</h3><p class="mt-1 text-sm text-slate-500">Tentukan board unggulan dan default board saat quick save atau publish pin.</p>'

  const customizationGrid = document.createElement('div')
  customizationGrid.className = 'mt-5 grid gap-4 md:grid-cols-2'
  customizationGrid.appendChild(createField('Featured board', featuredSelect))
  customizationGrid.appendChild(createField('Default save board', defaultBoardSelect))
  customizationGrid.appendChild(createField('Default board privacy', privacySelect))
  customizationCard.appendChild(customizationGrid)
  sectionGrid.appendChild(customizationCard)

  const privacyCard = document.createElement('section')
  privacyCard.className = 'rounded-[1.8rem] border border-slate-200 bg-slate-50/80 p-5'
  privacyCard.innerHTML = '<h3 class="text-lg font-extrabold text-slate-900">Privacy & Visibility</h3><p class="mt-1 text-sm text-slate-500">Pastikan board, saved pins, dan discoverability sesuai cara kamu ingin tampil di gallery.</p>'
  const privacyGrid = document.createElement('div')
  privacyGrid.className = 'mt-5 grid gap-3'
  privacyGrid.appendChild(discoverabilityToggle.label)
  privacyGrid.appendChild(savedPinsToggle.label)
  privacyCard.appendChild(privacyGrid)
  sectionGrid.appendChild(privacyCard)

  const notificationCard = document.createElement('section')
  notificationCard.className = 'rounded-[1.8rem] border border-slate-200 bg-slate-50/80 p-5'
  notificationCard.innerHTML = '<h3 class="text-lg font-extrabold text-slate-900">Notifications</h3><p class="mt-1 text-sm text-slate-500">Pilih momen penting apa saja yang layak masuk inbox atau digest.</p>'
  const notificationGrid = document.createElement('div')
  notificationGrid.className = 'mt-5 grid gap-3'
  notificationGrid.appendChild(notifySaveToggle.label)
  notificationGrid.appendChild(notifyFollowToggle.label)
  notificationGrid.appendChild(digestToggle.label)
  notificationCard.appendChild(notificationGrid)
  sectionGrid.appendChild(notificationCard)

  const contentCard = document.createElement('section')
  contentCard.className = 'rounded-[1.8rem] border border-slate-200 bg-slate-50/80 p-5'
  contentCard.innerHTML = '<h3 class="text-lg font-extrabold text-slate-900">Content Preferences</h3><p class="mt-1 text-sm text-slate-500">Kontrol interest dan tag yang memengaruhi ranking pin di homepage dan Explore.</p>'
  const contentGrid = document.createElement('div')
  contentGrid.className = 'mt-5 grid gap-4 md:grid-cols-2'
  contentGrid.appendChild(createField('Interest categories', interestsInput, 'Pisahkan dengan koma untuk kategori seperti interior, travel, styling.'))
  contentGrid.appendChild(createField('Muted tags', mutedTagsInput, 'Tag yang dimasukkan di sini akan ditekan atau disembunyikan dari rekomendasi.'))
  contentCard.appendChild(contentGrid)
  sectionGrid.appendChild(contentCard)

  const securityCard = document.createElement('section')
  securityCard.className = 'rounded-[1.8rem] border border-slate-200 bg-slate-50/80 p-5'
  securityCard.innerHTML = '<h3 class="text-lg font-extrabold text-slate-900">Security</h3><p class="mt-1 text-sm text-slate-500">Untuk demo ini password tidak benar-benar dikirim ke backend, tapi validasinya sudah disiapkan di UI.</p>'
  const securityGrid = document.createElement('div')
  securityGrid.className = 'mt-5 grid gap-4 md:grid-cols-3'
  securityGrid.appendChild(createField('Current password', currentPasswordInput))
  securityGrid.appendChild(createField('New password', newPasswordInput))
  securityGrid.appendChild(createField('Confirm password', confirmPasswordInput))
  securityCard.appendChild(securityGrid)
  sectionGrid.appendChild(securityCard)

  const actions = document.createElement('div')
  actions.className = 'flex flex-wrap items-center gap-3 border-t border-slate-200 pt-2'

  const saveButton = document.createElement('button')
  saveButton.type = 'submit'
  saveButton.className =
    'rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700'
  saveButton.textContent = 'Save settings'

  actions.appendChild(saveButton)

  form.appendChild(notice)
  form.appendChild(sectionGrid)
  form.appendChild(actions)
  panel.appendChild(form)

  form.addEventListener('submit', (event) => {
    event.preventDefault()

    const handle = handleInput.value.trim()
    const email = emailInput.value.trim().toLowerCase()
    const website = websiteInput.value.trim()
    const nextPassword = newPasswordInput.value.trim()
    const confirmPassword = confirmPasswordInput.value.trim()
    const currentPassword = currentPasswordInput.value.trim()

    if (!handle || !/^[a-z0-9._]+$/i.test(handle)) {
      notice.className = 'rounded-[1.4rem] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700'
      notice.textContent = 'Username hanya boleh berisi huruf, angka, titik, atau underscore.'
      return
    }

    if (!email || !email.includes('@')) {
      notice.className = 'rounded-[1.4rem] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700'
      notice.textContent = 'Email belum valid.'
      return
    }

    if (website) {
      try {
        new URL(website)
      } catch {
        notice.className = 'rounded-[1.4rem] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700'
        notice.textContent = 'Website URL belum valid.'
        return
      }
    }

    if (nextPassword || confirmPassword || currentPassword) {
      if (!currentPassword) {
        notice.className = 'rounded-[1.4rem] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700'
        notice.textContent = 'Masukkan current password untuk mengubah password.'
        return
      }

      if (nextPassword.length < 8) {
        notice.className = 'rounded-[1.4rem] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700'
        notice.textContent = 'Password baru minimal 8 karakter.'
        return
      }

      if (nextPassword !== confirmPassword) {
        notice.className = 'rounded-[1.4rem] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700'
        notice.textContent = 'Konfirmasi password baru belum cocok.'
        return
      }
    }

    invoke(onSave, {
      profile: {
        name: nameInput.value.trim(),
        handle: `@${handle.replace(/^@/, '')}`,
        email,
        website,
        bio: bioInput.value.trim(),
      },
      settings: {
        featuredBoardId: featuredSelect.value,
        defaultBoardId: defaultBoardSelect.value,
        defaultBoardPrivacy: privacySelect.value,
        discoverable: discoverabilityToggle.input.checked,
        showSavedPins: savedPinsToggle.input.checked,
        emailOnSave: notifySaveToggle.input.checked,
        emailOnBoardFollow: notifyFollowToggle.input.checked,
        emailDigest: digestToggle.input.checked,
        interests: interestsInput.value
          .split(',')
          .map((item) => item.trim().toLowerCase())
          .filter(Boolean),
        mutedTags: mutedTagsInput.value
          .split(',')
          .map((item) => item.trim().toLowerCase())
          .filter(Boolean),
      },
    })

    notice.className = 'rounded-[1.4rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700'
    notice.textContent = 'Settings berhasil diperbarui.'
  })

  layout.appendChild(sidebar)
  layout.appendChild(panel)
  page.appendChild(layout)
  return page
}

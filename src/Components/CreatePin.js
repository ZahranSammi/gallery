function invoke(handler, ...args) {
  if (typeof handler === 'function') {
    return handler(...args)
  }

  return undefined
}

function parseTags(input) {
  return input
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 8)
}

function createField(label, input) {
  const field = document.createElement('label')
  field.className = 'flex flex-col gap-2 text-sm font-semibold text-slate-700'

  const caption = document.createElement('span')
  caption.textContent = label

  field.appendChild(caption)
  field.appendChild(input)
  return field
}

export function CreatePin({ boards = [], draft = null, onSubmit, onSaveDraft, onCancel } = {}) {
  let previewSrc = draft?.imageSrc || ''
  let objectUrl = previewSrc.startsWith('blob:') ? previewSrc : null

  const page = document.createElement('section')
  page.className = 'create-page w-full px-4 pb-10 pt-6 md:px-6'

  const layout = document.createElement('div')
  layout.className = 'grid gap-6 xl:grid-cols-[minmax(440px,0.95fr)_minmax(0,1.05fr)]'

  const previewPanel = document.createElement('article')
  previewPanel.className =
    'overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/92 shadow-[0_22px_60px_-34px_rgba(15,23,42,0.42)]'

  const previewHeader = document.createElement('div')
  previewHeader.className = 'flex items-center justify-between border-b border-slate-200/80 px-5 py-4 md:px-6'

  const previewHeading = document.createElement('div')

  const previewLabel = document.createElement('p')
  previewLabel.className = 'text-xs font-bold uppercase tracking-[0.22em] text-slate-400'
  previewLabel.textContent = 'Preview'

  const previewTitle = document.createElement('h2')
  previewTitle.className = 'mt-1 text-2xl font-extrabold tracking-tight text-slate-900'
  previewTitle.textContent = 'Create a new pin'

  previewHeading.appendChild(previewLabel)
  previewHeading.appendChild(previewTitle)

  const statusBox = document.createElement('div')
  statusBox.className = 'hidden rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700'

  previewHeader.appendChild(previewHeading)
  previewHeader.appendChild(statusBox)

  const previewBody = document.createElement('div')
  previewBody.className = 'space-y-5 p-5 md:p-6'

  const previewCanvas = document.createElement('div')
  previewCanvas.className =
    'relative grid min-h-[520px] place-items-center overflow-hidden rounded-[1.8rem] bg-[radial-gradient(circle_at_top,#fde68a,transparent_26%),linear-gradient(180deg,#f8fafc,#e2e8f0)]'

  const previewImage = document.createElement('img')
  previewImage.className = 'hidden h-full max-h-[680px] w-full rounded-[1.8rem] object-cover'
  previewImage.alt = 'Pin preview'

  const previewPlaceholder = document.createElement('div')
  previewPlaceholder.className = 'max-w-sm px-6 text-center'

  const previewPlaceholderTitle = document.createElement('p')
  previewPlaceholderTitle.className = 'text-xl font-extrabold text-slate-900'
  previewPlaceholderTitle.textContent = 'Upload visual utamamu'

  const previewPlaceholderCaption = document.createElement('p')
  previewPlaceholderCaption.className = 'mt-2 text-sm leading-relaxed text-slate-500'
  previewPlaceholderCaption.textContent =
    'Tambahkan file gambar atau URL gambar untuk melihat bagaimana pin akan tampil sebelum dipublish ke board.'

  previewPlaceholder.appendChild(previewPlaceholderTitle)
  previewPlaceholder.appendChild(previewPlaceholderCaption)
  previewCanvas.appendChild(previewImage)
  previewCanvas.appendChild(previewPlaceholder)

  const tips = document.createElement('div')
  tips.className = 'grid gap-3 md:grid-cols-3'

  ;[
    ['Rasio fleksibel', 'Preview akan mengikuti gaya masonry feed sehingga pin terasa natural saat masuk homepage.'],
    ['Board-aware', 'Pilih board tujuan sekarang agar publish flow lebih singkat dan terorganisasi.'],
    ['Accessibility', 'Alt text dan caption membantu pin tetap kuat saat dibagikan atau dicari.'],
  ].forEach(([title, description]) => {
    const item = document.createElement('article')
    item.className = 'rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4'

    const heading = document.createElement('h3')
    heading.className = 'text-sm font-bold text-slate-900'
    heading.textContent = title

    const text = document.createElement('p')
    text.className = 'mt-2 text-sm leading-relaxed text-slate-500'
    text.textContent = description

    item.appendChild(heading)
    item.appendChild(text)
    tips.appendChild(item)
  })

  previewBody.appendChild(previewCanvas)
  previewBody.appendChild(tips)
  previewPanel.appendChild(previewHeader)
  previewPanel.appendChild(previewBody)

  const formPanel = document.createElement('article')
  formPanel.className =
    'overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/92 shadow-[0_22px_60px_-34px_rgba(15,23,42,0.42)]'

  const form = document.createElement('form')
  form.className = 'grid gap-5 p-5 md:p-6'

  const messageBox = document.createElement('div')
  messageBox.className = 'hidden rounded-[1.4rem] border px-4 py-3 text-sm font-medium'

  const fileInput = document.createElement('input')
  fileInput.type = 'file'
  fileInput.accept = 'image/png,image/jpeg,image/webp'
  fileInput.className = 'hidden'

  const uploadButton = document.createElement('button')
  uploadButton.type = 'button'
  uploadButton.className =
    'rounded-[1.4rem] border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-left text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:bg-white hover:text-slate-900'
  uploadButton.textContent = 'Pilih file gambar atau drag-and-drop ke sini nanti jika ingin ditambah.'
  uploadButton.addEventListener('click', () => fileInput.click())

  const imageUrlInput = document.createElement('input')
  imageUrlInput.name = 'imageUrl'
  imageUrlInput.type = 'url'
  imageUrlInput.placeholder = 'Atau tempel URL gambar...'
  imageUrlInput.value = draft?.imageSrc && !draft.imageSrc.startsWith('blob:') ? draft.imageSrc : ''
  imageUrlInput.className =
    'rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100'

  const titleInput = document.createElement('input')
  titleInput.name = 'title'
  titleInput.type = 'text'
  titleInput.placeholder = 'Mis. Cozy apartment moodboard'
  titleInput.value = draft?.title || ''
  titleInput.className =
    'rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100'

  const descriptionInput = document.createElement('textarea')
  descriptionInput.name = 'caption'
  descriptionInput.rows = 5
  descriptionInput.placeholder = 'Tambahkan cerita singkat, konteks, atau insight visual untuk pin ini.'
  descriptionInput.value = draft?.caption || ''
  descriptionInput.className =
    'resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100'

  const boardSelect = document.createElement('select')
  boardSelect.name = 'boardId'
  boardSelect.className =
    'rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100'

  const defaultBoardOption = document.createElement('option')
  defaultBoardOption.value = ''
  defaultBoardOption.textContent = 'Pilih board tujuan'
  boardSelect.appendChild(defaultBoardOption)

  boards.forEach((board) => {
    const option = document.createElement('option')
    option.value = board.id
    option.textContent = `${board.name} (${board.privacy})`
    option.selected = draft?.boardId === board.id
    boardSelect.appendChild(option)
  })

  const newBoardInput = document.createElement('input')
  newBoardInput.name = 'newBoardName'
  newBoardInput.type = 'text'
  newBoardInput.placeholder = 'Atau buat board baru, mis. Summer references'
  newBoardInput.value = draft?.newBoardName || ''
  newBoardInput.className =
    'rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100'

  const tagsInput = document.createElement('input')
  tagsInput.name = 'tags'
  tagsInput.type = 'text'
  tagsInput.placeholder = 'tag1, tag2, tag3'
  tagsInput.value = (draft?.tags || []).join(', ')
  tagsInput.className =
    'rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100'

  const sourceInput = document.createElement('input')
  sourceInput.name = 'sourceUrl'
  sourceInput.type = 'url'
  sourceInput.placeholder = 'https://source-link.com'
  sourceInput.value = draft?.sourceUrl || ''
  sourceInput.className =
    'rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100'

  const altInput = document.createElement('textarea')
  altInput.name = 'altText'
  altInput.rows = 3
  altInput.placeholder = 'Deskripsikan isi gambar untuk aksesibilitas.'
  altInput.value = draft?.altText || ''
  altInput.className =
    'resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100'

  const privacySelect = document.createElement('select')
  privacySelect.name = 'privacy'
  privacySelect.className =
    'rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100'
  ;['public', 'private'].forEach((value) => {
    const option = document.createElement('option')
    option.value = value
    option.textContent = value === 'public' ? 'Public board' : 'Private board'
    option.selected = (draft?.privacy || 'public') === value
    privacySelect.appendChild(option)
  })

  const actions = document.createElement('div')
  actions.className = 'flex flex-wrap items-center gap-3 pt-2'

  const cancelButton = document.createElement('button')
  cancelButton.type = 'button'
  cancelButton.className =
    'rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900'
  cancelButton.textContent = 'Cancel'
  cancelButton.addEventListener('click', () => invoke(onCancel))

  const draftButton = document.createElement('button')
  draftButton.type = 'button'
  draftButton.className =
    'rounded-full border border-slate-300 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-white hover:text-slate-900'
  draftButton.textContent = 'Save draft'

  const submitButton = document.createElement('button')
  submitButton.type = 'submit'
  submitButton.className =
    'rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700'
  submitButton.textContent = 'Publish pin'

  actions.appendChild(cancelButton)
  actions.appendChild(draftButton)
  actions.appendChild(submitButton)

  form.appendChild(messageBox)
  form.appendChild(fileInput)
  form.appendChild(createField('Upload image', uploadButton))
  form.appendChild(createField('Image URL', imageUrlInput))
  form.appendChild(createField('Title', titleInput))
  form.appendChild(createField('Description', descriptionInput))
  form.appendChild(createField('Save to board', boardSelect))
  form.appendChild(createField('New board name', newBoardInput))
  form.appendChild(createField('Tags', tagsInput))
  form.appendChild(createField('Source link', sourceInput))
  form.appendChild(createField('Alt text', altInput))
  form.appendChild(createField('Board visibility', privacySelect))
  form.appendChild(actions)
  formPanel.appendChild(form)

  function setMessage(type, text) {
    if (!text) {
      messageBox.className = 'hidden rounded-[1.4rem] border px-4 py-3 text-sm font-medium'
      messageBox.textContent = ''
      statusBox.className = 'hidden rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700'
      statusBox.textContent = ''
      return
    }

    if (type === 'error') {
      messageBox.className = 'rounded-[1.4rem] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700'
      statusBox.className = 'hidden rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700'
      statusBox.textContent = ''
    } else {
      messageBox.className = 'rounded-[1.4rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700'
      statusBox.className = 'rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700'
      statusBox.textContent = text
    }

    messageBox.textContent = text
  }

  function renderPreview() {
    if (previewSrc) {
      previewImage.src = previewSrc
      previewImage.classList.remove('hidden')
      previewPlaceholder.classList.add('hidden')
      return
    }

    previewImage.removeAttribute('src')
    previewImage.classList.add('hidden')
    previewPlaceholder.classList.remove('hidden')
  }

  function extractPayload() {
    return {
      imageSrc: previewSrc,
      title: titleInput.value.trim(),
      caption: descriptionInput.value.trim(),
      boardId: boardSelect.value,
      newBoardName: newBoardInput.value.trim(),
      tags: parseTags(tagsInput.value),
      sourceUrl: sourceInput.value.trim(),
      altText: altInput.value.trim(),
      privacy: privacySelect.value,
    }
  }

  function validatePayload(payload) {
    if (!payload.imageSrc) {
      return 'Tambahkan gambar terlebih dahulu agar pin punya preview visual.'
    }

    if (!payload.title) {
      return 'Judul pin wajib diisi.'
    }

    if (payload.title.length > 100) {
      return 'Judul pin maksimal 100 karakter.'
    }

    if (!payload.boardId && !payload.newBoardName) {
      return 'Pilih board tujuan atau tulis nama board baru.'
    }

    if (payload.newBoardName && payload.newBoardName.length < 3) {
      return 'Nama board baru minimal 3 karakter.'
    }

    if (payload.sourceUrl) {
      try {
        new URL(payload.sourceUrl)
      } catch {
        return 'Source link belum valid.'
      }
    }

    return ''
  }

  fileInput.addEventListener('change', () => {
    const [file] = fileInput.files || []

    if (!file) {
      return
    }

    if (objectUrl) {
      URL.revokeObjectURL(objectUrl)
    }

    objectUrl = URL.createObjectURL(file)
    previewSrc = objectUrl
    imageUrlInput.value = ''
    renderPreview()
    setMessage('success', 'Preview gambar siap.')
  })

  imageUrlInput.addEventListener('change', () => {
    const nextValue = imageUrlInput.value.trim()

    if (!nextValue) {
      previewSrc = ''
      renderPreview()
      return
    }

    if (objectUrl) {
      URL.revokeObjectURL(objectUrl)
      objectUrl = null
    }

    previewSrc = nextValue
    renderPreview()
    setMessage('success', 'Preview dari URL diperbarui.')
  })

  draftButton.addEventListener('click', () => {
    const draftPayload = extractPayload()
    invoke(onSaveDraft, draftPayload)
    setMessage('success', 'Draft tersimpan untuk sesi ini.')
  })

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const payload = extractPayload()
    const validationMessage = validatePayload(payload)

    if (validationMessage) {
      setMessage('error', validationMessage)
      return
    }

    submitButton.disabled = true
    submitButton.textContent = 'Publishing...'

    try {
      await Promise.resolve(invoke(onSubmit, payload))
    } catch (error) {
      setMessage('error', error instanceof Error ? error.message : 'Gagal mempublish pin.')
    } finally {
      submitButton.disabled = false
      submitButton.textContent = 'Publish pin'
    }
  })

  renderPreview()
  layout.appendChild(previewPanel)
  layout.appendChild(formPanel)
  page.appendChild(layout)

  return page
}

function invoke(handler, ...args) {
  if (typeof handler === 'function') {
    handler(...args)
  }
}

function normalizeHandle(handle) {
  const trimmedHandle = (handle || '').trim()

  if (!trimmedHandle) {
    return '@pinboard'
  }

  return trimmedHandle.startsWith('@') ? trimmedHandle : `@${trimmedHandle}`
}

function toNonNegativeNumber(value, fallbackValue) {
  const parsedValue = Number.parseInt(value, 10)

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return fallbackValue
  }

  return parsedValue
}

export function EditProfile({ user = {}, onSave, onCancel } = {}) {
  const section = document.createElement('section')
  section.className = 'profile-page w-full px-4 pb-10 pt-6 md:px-6'

  const form = document.createElement('form')
  form.className =
    'overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/92 p-5 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.45)] md:p-7'

  const heading = document.createElement('h2')
  heading.className = 'text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl'
  heading.textContent = 'Edit Profile'

  const description = document.createElement('p')
  description.className = 'mt-2 text-sm text-slate-600 md:text-base'
  description.textContent = 'Perbarui identitas profil kamu lalu simpan perubahan.'

  const fields = document.createElement('div')
  fields.className = 'mt-6 grid gap-4 md:grid-cols-2'

  const fullNameField = document.createElement('label')
  fullNameField.className = 'flex flex-col gap-1.5 text-sm font-semibold text-slate-700'
  fullNameField.textContent = 'Nama'

  const fullNameInput = document.createElement('input')
  fullNameInput.name = 'name'
  fullNameInput.type = 'text'
  fullNameInput.value = user.name || ''
  fullNameInput.className =
    'rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200'
  fullNameField.appendChild(fullNameInput)

  const handleField = document.createElement('label')
  handleField.className = 'flex flex-col gap-1.5 text-sm font-semibold text-slate-700'
  handleField.textContent = 'Handle'

  const handleInput = document.createElement('input')
  handleInput.name = 'handle'
  handleInput.type = 'text'
  handleInput.value = user.handle || ''
  handleInput.className =
    'rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200'
  handleField.appendChild(handleInput)

  const avatarField = document.createElement('label')
  avatarField.className = 'flex flex-col gap-1.5 text-sm font-semibold text-slate-700 md:col-span-2'
  avatarField.textContent = 'Avatar URL'

  const avatarInput = document.createElement('input')
  avatarInput.name = 'avatar'
  avatarInput.type = 'url'
  avatarInput.value = user.avatar || ''
  avatarInput.className =
    'rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200'
  avatarField.appendChild(avatarInput)

  const bioField = document.createElement('label')
  bioField.className = 'flex flex-col gap-1.5 text-sm font-semibold text-slate-700 md:col-span-2'
  bioField.textContent = 'Bio'

  const bioInput = document.createElement('textarea')
  bioInput.name = 'bio'
  bioInput.rows = 4
  bioInput.value = user.bio || ''
  bioInput.className =
    'resize-none rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200'
  bioField.appendChild(bioInput)

  const followersField = document.createElement('label')
  followersField.className = 'flex flex-col gap-1.5 text-sm font-semibold text-slate-700'
  followersField.textContent = 'Followers'

  const followersInput = document.createElement('input')
  followersInput.name = 'followers'
  followersInput.type = 'number'
  followersInput.min = '0'
  followersInput.value = `${user.followers || 0}`
  followersInput.className =
    'rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200'
  followersField.appendChild(followersInput)

  const followingField = document.createElement('label')
  followingField.className = 'flex flex-col gap-1.5 text-sm font-semibold text-slate-700'
  followingField.textContent = 'Following'

  const followingInput = document.createElement('input')
  followingInput.name = 'following'
  followingInput.type = 'number'
  followingInput.min = '0'
  followingInput.value = `${user.following || 0}`
  followingInput.className =
    'rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200'
  followingField.appendChild(followingInput)

  fields.appendChild(fullNameField)
  fields.appendChild(handleField)
  fields.appendChild(avatarField)
  fields.appendChild(bioField)
  fields.appendChild(followersField)
  fields.appendChild(followingField)

  const actions = document.createElement('div')
  actions.className = 'mt-6 flex flex-wrap items-center gap-3'

  const cancelButton = document.createElement('button')
  cancelButton.type = 'button'
  cancelButton.textContent = 'Cancel'
  cancelButton.className =
    'rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 md:text-sm'
  cancelButton.addEventListener('click', () => invoke(onCancel))

  const saveButton = document.createElement('button')
  saveButton.type = 'submit'
  saveButton.textContent = 'Save Changes'
  saveButton.className =
    'rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 md:text-sm'

  actions.appendChild(cancelButton)
  actions.appendChild(saveButton)

  form.appendChild(heading)
  form.appendChild(description)
  form.appendChild(fields)
  form.appendChild(actions)

  form.addEventListener('submit', (event) => {
    event.preventDefault()

    const formData = new FormData(form)
    const nextProfile = {
      name: (formData.get('name') || '').toString().trim() || user.name || 'Pinboard User',
      handle: normalizeHandle((formData.get('handle') || '').toString()),
      avatar:
        (formData.get('avatar') || '').toString().trim() ||
        user.avatar ||
        'https://picsum.photos/id/1005/160/160',
      bio:
        (formData.get('bio') || '').toString().trim() ||
        user.bio ||
        'Sharing visual ideas for decor, styling, and daily inspiration.',
      followers: toNonNegativeNumber(formData.get('followers'), user.followers || 0),
      following: toNonNegativeNumber(formData.get('following'), user.following || 0),
    }

    invoke(onSave, nextProfile)
  })

  section.appendChild(form)
  return section
}

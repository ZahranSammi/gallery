function invoke(handler, ...args) {
  if (typeof handler === 'function') {
    return handler(...args)
  }

  return undefined
}

const INTEREST_OPTIONS = ['Interior', 'Travel', 'Styling', 'Food', 'Workspace', 'Architecture']

function createInput({ label, name, type = 'text', placeholder = '', value = '', required = false }) {
  const field = document.createElement('label')
  field.className = 'flex flex-col gap-2 text-sm font-semibold text-slate-700'

  const caption = document.createElement('span')
  caption.textContent = label

  const input = document.createElement(type === 'textarea' ? 'textarea' : 'input')
  input.name = name
  input.placeholder = placeholder
  input.required = required
  input.className =
    'rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100'

  if (type === 'textarea') {
    input.rows = 4
    input.value = value
  } else {
    input.type = type
    input.value = value
  }

  field.appendChild(caption)
  field.appendChild(input)

  return { field, input }
}

export function Authentication({
  mode = 'login',
  onSubmit,
  onSwitch,
  redirectTo,
  isAuthenticated = false,
  currentUser,
} = {}) {
  const isLogin = mode === 'login'
  const page = document.createElement('section')
  page.className = 'auth-page grid min-h-[calc(100vh-96px)] gap-6 px-4 py-6 md:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]'

  const visual = document.createElement('article')
  visual.className =
    'relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-[radial-gradient(circle_at_top_left,#fef3c7,transparent_28%),radial-gradient(circle_at_bottom_right,#ddd6fe,transparent_34%),linear-gradient(145deg,#0f172a_0%,#1d4ed8_42%,#0891b2_100%)] p-6 text-white shadow-[0_28px_70px_-40px_rgba(15,23,42,0.75)] md:p-8'

  const visualLabel = document.createElement('p')
  visualLabel.className = 'text-xs font-bold uppercase tracking-[0.24em] text-white/65'
  visualLabel.textContent = isLogin ? 'Welcome back' : 'Build your visual identity'

  const visualTitle = document.createElement('h2')
  visualTitle.className = 'mt-4 max-w-xl text-3xl font-extrabold tracking-tight md:text-5xl'
  visualTitle.textContent = isLogin
    ? 'Masuk untuk lanjut menyimpan, membuat pin, dan menyusun board favoritmu.'
    : 'Buat akun agar pin, board, dan profil kreatifmu siap tampil di feed.'

  const visualCaption = document.createElement('p')
  visualCaption.className = 'mt-4 max-w-xl text-sm leading-relaxed text-white/76 md:text-base'
  visualCaption.textContent =
    'Flow autentikasi ini dirancang ringan: cepat diisi, langsung mengembalikan user ke intent awal seperti save pin, create pin, atau membuka board tertentu.'

  const collage = document.createElement('div')
  collage.className = 'mt-8 grid gap-3 sm:grid-cols-3'

  const collageItems = [
    'https://picsum.photos/id/1015/400/580',
    'https://picsum.photos/id/1060/400/520',
    'https://picsum.photos/id/1041/400/560',
  ]

  collageItems.forEach((src, index) => {
    const frame = document.createElement('div')
    frame.className =
      index === 1
        ? 'overflow-hidden rounded-[1.6rem] bg-white/10 shadow-lg sm:translate-y-8'
        : 'overflow-hidden rounded-[1.6rem] bg-white/10 shadow-lg'

    const image = document.createElement('img')
    image.src = src
    image.alt = 'Gallery preview'
    image.loading = 'lazy'
    image.decoding = 'async'
    image.className = 'h-52 w-full object-cover'

    frame.appendChild(image)
    collage.appendChild(frame)
  })

  visual.appendChild(visualLabel)
  visual.appendChild(visualTitle)
  visual.appendChild(visualCaption)

  if (redirectTo) {
    const redirectBadge = document.createElement('p')
    redirectBadge.className = 'mt-5 inline-flex rounded-full border border-white/14 bg-white/10 px-4 py-2 text-sm text-white/88'
    redirectBadge.textContent = `Setelah autentikasi kamu akan diarahkan ke ${redirectTo.replace('#/', '/').replace('#', '/')}.`
    visual.appendChild(redirectBadge)
  }

  visual.appendChild(collage)

  const card = document.createElement('article')
  card.className =
    'overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/94 p-6 shadow-[0_22px_55px_-32px_rgba(15,23,42,0.42)] md:p-8'

  const heading = document.createElement('h3')
  heading.className = 'text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl'
  heading.textContent = isLogin ? 'Log in to Pinboard' : 'Create your account'

  const caption = document.createElement('p')
  caption.className = 'mt-2 text-sm leading-relaxed text-slate-500'
  caption.textContent = isLogin
    ? 'Masukkan email dan password untuk melanjutkan ke gallery, board, dan profile settings.'
    : 'Isi data dasar, pilih minat visual, lalu akun siap dipakai untuk eksplorasi dan publishing.'

  const authState = document.createElement('div')
  authState.className = isAuthenticated
    ? 'mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700'
    : 'hidden'
  if (isAuthenticated) {
    authState.textContent = `Saat ini kamu sudah masuk sebagai ${currentUser?.name || 'Pinboard User'}. Form ini tetap bisa dipakai untuk simulasi switch account.`
  }

  const errorBox = document.createElement('div')
  errorBox.className = 'mt-5 hidden rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700'

  const form = document.createElement('form')
  form.className = 'mt-6 grid gap-4'

  const emailField = createInput({
    label: 'Email',
    name: 'email',
    type: 'email',
    placeholder: 'you@example.com',
    required: true,
  })

  const passwordField = createInput({
    label: 'Password',
    name: 'password',
    type: 'password',
    placeholder: 'Minimal 8 karakter',
    required: true,
  })

  if (isLogin) {
    form.appendChild(emailField.field)
    form.appendChild(passwordField.field)
  } else {
    const nameField = createInput({
      label: 'Display name',
      name: 'name',
      placeholder: 'Zahra Ananta',
      required: true,
    })

    const usernameField = createInput({
      label: 'Username',
      name: 'username',
      placeholder: 'zahra.gallery',
      required: true,
    })

    const confirmPasswordField = createInput({
      label: 'Confirm password',
      name: 'confirmPassword',
      type: 'password',
      placeholder: 'Ulangi password',
      required: true,
    })

    form.appendChild(nameField.field)
    form.appendChild(usernameField.field)
    form.appendChild(emailField.field)
    form.appendChild(passwordField.field)
    form.appendChild(confirmPasswordField.field)

    const interestsField = document.createElement('fieldset')
    interestsField.className = 'grid gap-3 rounded-[1.6rem] border border-slate-200 bg-slate-50 p-4'

    const interestsLegend = document.createElement('legend')
    interestsLegend.className = 'px-2 text-sm font-semibold text-slate-700'
    interestsLegend.textContent = 'Minat visual utama'
    interestsField.appendChild(interestsLegend)

    const interestGrid = document.createElement('div')
    interestGrid.className = 'flex flex-wrap gap-2'

    INTEREST_OPTIONS.forEach((interest) => {
      const label = document.createElement('label')
      label.className =
        'inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900'

      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.name = 'interests'
      checkbox.value = interest.toLowerCase()
      checkbox.className = 'h-4 w-4 accent-slate-900'

      label.appendChild(checkbox)
      label.append(interest)
      interestGrid.appendChild(label)
    })

    interestsField.appendChild(interestGrid)
    form.appendChild(interestsField)

    const termsLabel = document.createElement('label')
    termsLabel.className = 'flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600'

    const termsInput = document.createElement('input')
    termsInput.type = 'checkbox'
    termsInput.name = 'terms'
    termsInput.className = 'mt-0.5 h-4 w-4 shrink-0 accent-slate-900'

    const termsText = document.createElement('span')
    termsText.textContent = 'Saya setuju dengan aturan konten dan kebijakan privasi aplikasi gallery.'

    termsLabel.appendChild(termsInput)
    termsLabel.appendChild(termsText)
    form.appendChild(termsLabel)
  }

  const actions = document.createElement('div')
  actions.className = 'mt-2 flex flex-wrap items-center gap-3'

  const submitButton = document.createElement('button')
  submitButton.type = 'submit'
  submitButton.className =
    'rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700'
  submitButton.textContent = isLogin ? 'Log in' : 'Create account'

  const switchButton = document.createElement('button')
  switchButton.type = 'button'
  switchButton.className =
    'rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900'
  switchButton.textContent = isLogin ? 'Need an account?' : 'Already have an account?'
  switchButton.addEventListener('click', () => invoke(onSwitch))

  actions.appendChild(submitButton)
  actions.appendChild(switchButton)

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    errorBox.classList.add('hidden')
    errorBox.textContent = ''

    const formData = new FormData(form)
    const email = (formData.get('email') || '').toString().trim().toLowerCase()
    const password = (formData.get('password') || '').toString()

    if (!email || !password) {
      errorBox.textContent = 'Email dan password wajib diisi.'
      errorBox.classList.remove('hidden')
      return
    }

    if (!isLogin) {
      const name = (formData.get('name') || '').toString().trim()
      const username = (formData.get('username') || '').toString().trim()
      const confirmPassword = (formData.get('confirmPassword') || '').toString()
      const interests = formData.getAll('interests').map((value) => value.toString())
      const termsAccepted = formData.get('terms') === 'on'

      if (!name) {
        errorBox.textContent = 'Display name wajib diisi.'
        errorBox.classList.remove('hidden')
        return
      }

      if (!/^[a-z0-9._]+$/i.test(username)) {
        errorBox.textContent = 'Username hanya boleh berisi huruf, angka, titik, atau underscore.'
        errorBox.classList.remove('hidden')
        return
      }

      if (password.length < 8) {
        errorBox.textContent = 'Password minimal 8 karakter.'
        errorBox.classList.remove('hidden')
        return
      }

      if (password !== confirmPassword) {
        errorBox.textContent = 'Konfirmasi password belum cocok.'
        errorBox.classList.remove('hidden')
        return
      }

      if (!termsAccepted) {
        errorBox.textContent = 'Kamu perlu menyetujui aturan konten untuk membuat akun.'
        errorBox.classList.remove('hidden')
        return
      }

      submitButton.disabled = true
      submitButton.textContent = 'Creating account...'

      try {
        await Promise.resolve(
          invoke(onSubmit, {
            mode,
            name,
            username,
            email,
            password,
            interests,
          })
        )
      } catch (error) {
        errorBox.textContent = error instanceof Error ? error.message : 'Gagal membuat akun.'
        errorBox.classList.remove('hidden')
      } finally {
        submitButton.disabled = false
        submitButton.textContent = 'Create account'
      }

      return
    }

    submitButton.disabled = true
    submitButton.textContent = 'Signing in...'

    try {
      await Promise.resolve(
        invoke(onSubmit, {
          mode,
          email,
          password,
        })
      )
    } catch (error) {
      errorBox.textContent = error instanceof Error ? error.message : 'Gagal login.'
      errorBox.classList.remove('hidden')
    } finally {
      submitButton.disabled = false
      submitButton.textContent = 'Log in'
    }
  })

  card.appendChild(heading)
  card.appendChild(caption)
  card.appendChild(authState)
  card.appendChild(errorBox)
  card.appendChild(form)
  card.appendChild(actions)

  page.appendChild(visual)
  page.appendChild(card)

  return page
}

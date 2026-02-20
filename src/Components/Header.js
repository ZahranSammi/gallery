export function Header() {
  const header = document.createElement('header')
  const title = document.createElement('h1')
  const profile = document.createElement('img')
  const container = document.createElement('div')
  header.appendChild(container)
  container.appendChild(title)
  profile.src = 'https://placehold.co/400'
  profile.alt = 'Profile Picture'
  profile.className = 'rounded-full w-10 h-10'
  container.appendChild(profile)
  title.textContent = 'My Gallery'
  title.className = 'ml-4 text-xl font-bold text-gray-800'
  header.className = ' bg-white shadow-2xl border border-gray-200 text-white p-4'
  container.className = ' flex items-center justify-between'
  return header.outerHTML
}
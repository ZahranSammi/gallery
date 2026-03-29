import Gallery from './gallery'
import { BoardCard } from './BoardCard'

export function Explore({
  pins = [],
  boards = [],
  savedIds = new Set(),
  interests = [],
  onToggleSave,
  onOpenDetail,
  onOpenBoard,
} = {}) {
  const page = document.createElement('section')
  page.className = 'explore-page w-full px-4 pb-10 pt-6 md:px-6'

  const hero = document.createElement('article')
  hero.className =
    'overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[radial-gradient(circle_at_top_left,#fde68a,transparent_30%),radial-gradient(circle_at_top_right,#fecdd3,transparent_34%),linear-gradient(135deg,#0f172a_0%,#172554_42%,#155e75_100%)] p-6 text-white shadow-[0_24px_60px_-34px_rgba(15,23,42,0.78)] md:p-8'

  const eyebrow = document.createElement('p')
  eyebrow.className = 'text-xs font-bold uppercase tracking-[0.24em] text-white/70'
  eyebrow.textContent = 'Explore visual worlds'

  const heading = document.createElement('h2')
  heading.className = 'mt-3 max-w-3xl text-3xl font-extrabold tracking-tight md:text-5xl'
  heading.textContent = 'Temukan pin, board, dan gaya visual yang siap kamu simpan.'

  const description = document.createElement('p')
  description.className = 'mt-4 max-w-2xl text-sm leading-relaxed text-white/78 md:text-base'
  description.textContent =
    'Explore merangkum board populer, mood koleksi, dan pin dengan engagement tinggi agar discovery terasa lebih terarah dan tetap ringan.'

  const chips = document.createElement('div')
  chips.className = 'mt-5 flex flex-wrap gap-2'

  ;(interests.length ? interests : ['interior', 'travel', 'styling']).forEach((interest) => {
    const chip = document.createElement('span')
    chip.className =
      'rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/88 backdrop-blur-sm'
    chip.textContent = interest
    chips.appendChild(chip)
  })

  hero.appendChild(eyebrow)
  hero.appendChild(heading)
  hero.appendChild(description)
  hero.appendChild(chips)

  const boardSection = document.createElement('section')
  boardSection.className = 'mt-6'

  const boardHeader = document.createElement('div')
  boardHeader.className = 'flex items-end justify-between gap-4'

  const boardTitleWrap = document.createElement('div')

  const boardTitle = document.createElement('h3')
  boardTitle.className = 'text-xl font-extrabold text-slate-900'
  boardTitle.textContent = 'Trending Boards'

  const boardCaption = document.createElement('p')
  boardCaption.className = 'mt-1 text-sm text-slate-500'
  boardCaption.textContent = 'Board publik dengan tema dan komposisi visual yang paling kuat minggu ini.'

  boardTitleWrap.appendChild(boardTitle)
  boardTitleWrap.appendChild(boardCaption)
  boardHeader.appendChild(boardTitleWrap)

  const boardGrid = document.createElement('div')
  boardGrid.className = 'mt-4 grid gap-4 lg:grid-cols-3'

  boards.forEach((board) => {
    const boardPins = pins.filter((pin) => board.pinIds.includes(pin.id))
    boardGrid.appendChild(
      BoardCard(board, {
        pins: boardPins,
        onOpenBoard,
      })
    )
  })

  boardSection.appendChild(boardHeader)
  boardSection.appendChild(boardGrid)

  const pinSectionHeader = document.createElement('div')
  pinSectionHeader.className = 'mt-8 flex items-end justify-between gap-4'

  const pinTitleWrap = document.createElement('div')

  const pinTitle = document.createElement('h3')
  pinTitle.className = 'text-xl font-extrabold text-slate-900'
  pinTitle.textContent = 'Recommended Pins'

  const pinCaption = document.createElement('p')
  pinCaption.className = 'mt-1 text-sm text-slate-500'
  pinCaption.textContent = 'Disusun dari performa pin, relevance tag, dan minat visual yang aktif.'

  pinTitleWrap.appendChild(pinTitle)
  pinTitleWrap.appendChild(pinCaption)
  pinSectionHeader.appendChild(pinTitleWrap)

  const galleryElement = Gallery(pins, {
    query: '',
    savedIds,
    onToggleSave,
    onOpenDetail,
  })
  galleryElement.classList.add('mt-2')

  page.appendChild(hero)
  page.appendChild(boardSection)
  page.appendChild(pinSectionHeader)
  page.appendChild(galleryElement)

  return page
}

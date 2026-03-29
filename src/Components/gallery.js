import { Card } from './Card'

export const PINS = [
  {
    id: 'pin-01',
    imageSrc: 'https://picsum.photos/id/1015/600/900',
    altText: 'Misty mountain landscape',
    title: 'Kabut Pagi di Pegunungan',
    caption: 'Nuansa tenang untuk inspirasi wallpaper.',
    author: 'Nadia R.',
    tags: ['nature', 'mountain', 'mist'],
  },
  {
    id: 'pin-02',
    imageSrc: 'https://picsum.photos/id/1039/600/760',
    altText: 'Minimalist living room',
    title: 'Ruang Tamu Minimalis',
    caption: 'Palet netral dengan sentuhan kayu hangat.',
    author: 'Arka Studio',
    tags: ['interior', 'minimal', 'home'],
  },
  {
    id: 'pin-03',
    imageSrc: 'https://picsum.photos/id/1050/600/980',
    altText: 'Forest road and sunlight',
    title: 'Jalan Hutan',
    caption: 'Komposisi natural untuk feed yang calming.',
    author: 'Lio',
    tags: ['forest', 'travel', 'green'],
  },
  {
    id: 'pin-04',
    imageSrc: 'https://picsum.photos/id/1080/600/840',
    altText: 'Modern cafe interior',
    title: 'Cafe Moodboard',
    caption: 'Pencahayaan warm, cocok untuk ide coffee corner.',
    author: 'Mori Co.',
    tags: ['cafe', 'interior', 'lighting'],
  },
  {
    id: 'pin-05',
    imageSrc: 'https://picsum.photos/id/1060/600/1020',
    altText: 'Ocean waves aerial view',
    title: 'Blue Drift',
    caption: 'Pattern ombak untuk inspirasi desain warna.',
    author: 'Gita',
    tags: ['ocean', 'texture', 'blue'],
  },
  {
    id: 'pin-06',
    imageSrc: 'https://picsum.photos/id/1003/600/760',
    altText: 'Workspace desk with laptop',
    title: 'Desk Setup Produktif',
    caption: 'Layout meja kerja yang clean dan efisien.',
    author: 'Tara',
    tags: ['workspace', 'desk', 'productivity'],
  },
  {
    id: 'pin-07',
    imageSrc: 'https://picsum.photos/id/1024/600/920',
    altText: 'City skyline at sunset',
    title: 'Sunset Skyline',
    caption: 'Warna oranye-biru yang kontras dan modern.',
    author: 'Awan',
    tags: ['city', 'sunset', 'urban'],
  },
  {
    id: 'pin-08',
    imageSrc: 'https://picsum.photos/id/1025/600/780',
    altText: 'Golden retriever portrait',
    title: 'Anjing Ceria',
    caption: 'Konten hewan lucu selalu jadi favorit feed.',
    author: 'Kimi',
    tags: ['dog', 'pet', 'cute'],
  },
  {
    id: 'pin-09',
    imageSrc: 'https://picsum.photos/id/1011/600/850',
    altText: 'Tropical beach and palms',
    title: 'Tropical Escape',
    caption: 'Vibes liburan dengan langit cerah.',
    author: 'Rhea',
    tags: ['beach', 'travel', 'summer'],
  },
  {
    id: 'pin-10',
    imageSrc: 'https://picsum.photos/id/1041/600/980',
    altText: 'Foggy bridge',
    title: 'Bridge in Fog',
    caption: 'Komposisi simetris dengan atmosfer dramatis.',
    author: 'Vino',
    tags: ['bridge', 'moody', 'architecture'],
  },
  {
    id: 'pin-11',
    imageSrc: 'https://picsum.photos/id/1057/600/780',
    altText: 'Flatlay breakfast table',
    title: 'Weekend Brunch',
    caption: 'Inspirasi plating sarapan yang estetik.',
    author: 'Lana',
    tags: ['food', 'flatlay', 'breakfast'],
  },
  {
    id: 'pin-12',
    imageSrc: 'https://picsum.photos/id/1074/600/900',
    altText: 'Autumn street with trees',
    title: 'Autumn Walk',
    caption: 'Tone hangat untuk moodboard musim gugur.',
    author: 'Sora',
    tags: ['autumn', 'street', 'nature'],
  },
  {
    id: 'pin-13',
    imageSrc: 'https://picsum.photos/id/1084/600/760',
    altText: 'Modern architecture facade',
    title: 'Geometric Facade',
    caption: 'Inspirasi pola garis untuk desain modern.',
    author: 'Nexus Lab',
    tags: ['architecture', 'modern', 'pattern'],
  },
  {
    id: 'pin-14',
    imageSrc: 'https://picsum.photos/id/1000/600/980',
    altText: 'Calm lake with mountains',
    title: 'Lake Serenity',
    caption: 'Palet biru-hijau untuk visual yang menenangkan.',
    author: 'Maya',
    tags: ['lake', 'mountain', 'calm'],
  },
  {
    id: 'pin-15',
    imageSrc: 'https://picsum.photos/id/1019/600/820',
    altText: 'Creative studio shelves',
    title: 'Studio Corner',
    caption: 'Rak display kreatif untuk ruang kerja.',
    author: 'Bayu',
    tags: ['studio', 'decor', 'creative'],
  },
  {
    id: 'pin-16',
    imageSrc: 'https://picsum.photos/id/1020/600/940',
    altText: 'Road trip through desert',
    title: 'Roadtrip Diary',
    caption: 'Angle cinematic untuk inspirasi perjalanan.',
    author: 'Nora',
    tags: ['travel', 'roadtrip', 'desert'],
  },
]

function createEmptyState(query) {
  const empty = document.createElement('div')
  empty.className =
    'mt-10 w-full rounded-3xl border border-slate-200 bg-white/90 px-6 py-10 text-center shadow-sm'

  const heading = document.createElement('h2')
  heading.className = 'text-xl font-bold text-slate-900'
  heading.textContent = 'Tidak ada pin yang cocok'

  const description = document.createElement('p')
  description.className = 'mt-2 text-sm text-slate-600'
  description.textContent = `Coba kata kunci lain untuk "${query}" atau hapus filter pencarian.`

  empty.appendChild(heading)
  empty.appendChild(description)

  return empty
}

export default function Gallery(
  pins,
  { query = '', savedIds = new Set(), onToggleSave, onOpenDetail } = {}
) {
  const section = document.createElement('section')
  section.id = 'gallery-feed'
  section.className = 'w-full px-4 pb-8 pt-5 md:px-6'

  if (!pins.length) {
    section.appendChild(createEmptyState(query))
    return section
  }

  const stream = document.createElement('div')
  stream.className =
    'columns-2 md:columns-4 lg:columns-8 [column-gap:1rem] md:[column-gap:1.25rem]'
  const fragment = document.createDocumentFragment()

  pins.forEach((pin) => {
    const card = Card(pin, {
      isSaved: savedIds.has(pin.id),
      onToggleSave,
      onOpenDetail,
    })
    fragment.appendChild(card)
  })

  stream.appendChild(fragment)
  section.appendChild(stream)
  return section
}

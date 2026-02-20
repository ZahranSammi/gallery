export function Card(imageSrc,altText) {
  const props = {
    imageSrc: imageSrc || 'https://placehold.co/200',
    altText: altText || 'Card Image'
  }
  const card = document.createElement('div')
  const image = document.createElement('img')
  image.src = props.imageSrc
  image.alt = props.altText
  card.appendChild(image)
  card.className = 'rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer'
  image.className = 'w-full h-auto object-cover'
  return card
}
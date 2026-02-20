import Masonry from "masonry-layout"

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
  card.className = 'bg-white shadow-md rounded-lg overflow-hidden'  
  return card
}
import { Card } from "./Card";
import Masonry from "masonry-layout"
const items = [
  { imageSrc: 'https://placehold.co/200x300', altText: 'Image 1' },
  { imageSrc: 'https://placehold.co/200x250', altText: 'Image 2' },
    { imageSrc: 'https://placehold.co/200x350', altText: 'Image 3' },
]
export default function gallery(){
    const container=document.createElement('div');
    container.id='gallery-card';
    container.className='p-4 grid gap-4 auto-rows-max grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
items.forEach(item=>{
    const card=Card(item.imageSrc,item.altText);
    container.appendChild(card);});
    return container;
}
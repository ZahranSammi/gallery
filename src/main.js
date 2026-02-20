import './style.css'
import { Header } from './Components/Header'
import gallery from './Components/gallery'
document.querySelector('#app').innerHTML = `
  ${Header()}
`
document.querySelector('#app').appendChild(gallery())
setupCounter(document.querySelector('#counter'))

import './style.css'
import { Header } from './Components/Header'
import { Card } from './Components/Card'
document.querySelector('#app').innerHTML = `
  ${Header()}
  ${  Card()}
`
setupCounter(document.querySelector('#counter'))

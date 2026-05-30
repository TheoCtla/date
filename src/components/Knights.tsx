// Chevaliers decoratifs (vraies illustrations) places a gauche et a droite des pages.
import knightLeft from '../assets/1650d1be5c17829b3294053336404ae1.jpg'
import knightRight from '../assets/f3e4616dfd4c8f225d84d6c549df62ce.jpg'

export default function Knights() {
  return (
    <>
      <img
        src={knightLeft}
        alt=""
        aria-hidden="true"
        className="side-knight side-knight--left"
      />
      <img
        src={knightRight}
        alt=""
        aria-hidden="true"
        className="side-knight side-knight--right"
      />
    </>
  )
}

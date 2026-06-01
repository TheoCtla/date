import knightFlowers from '../assets/00509e64ab056540958f88e354fb2232.jpg'
import { formatFrenchDate, formatFrenchTime } from '../data'

type Answers = {
  jour?: string
  heure?: string
  repas?: string
  activite?: string
}

type Props = {
  answers: Answers
  onRestart: () => void
}

export default function Recap({ answers, onRestart }: Props) {
  return (
    <div className="card recap-card">
      <img src={knightFlowers} alt="Chevalier qui offre des fleurs" className="recap-banner" />
      <h2 className="recap-title">La frappe, ptit recap note bien :</h2>

      <ul className="recap-list">
        <li>
          <span>Jour</span>
          <strong>{formatFrenchDate(answers.jour)}</strong>
        </li>
        <li>
          <span>Heure</span>
          <strong>{formatFrenchTime(answers.heure)}</strong>
        </li>
        <li>
          <span>Au menu</span>
          <strong>{answers.repas}</strong>
        </li>
        <li>
          <span>Activité</span>
          <strong>{answers.activite}</strong>
        </li>
      </ul>

      <button className="btn btn--ghost" onClick={onRestart}>
        Recommencer
      </button>
    </div>
  )
}

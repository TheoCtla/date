import { useState } from 'react'
import type { Question } from '../data'
import { formatFrenchDate, formatFrenchTime, OTHER_OPTION } from '../data'

// Ouvre le sélecteur natif (date/heure) au clic n'importe où sur le champ
function openPicker(e: React.MouseEvent<HTMLInputElement>) {
  const input = e.currentTarget as HTMLInputElement & { showPicker?: () => void }
  try {
    input.showPicker?.()
  } catch {
    // showPicker() peut échouer selon le navigateur : on ignore sans casser
  }
}

// Date du jour au format YYYY-MM-DD (pour empêcher de choisir une date passée)
const today = new Date()
const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
  today.getDate(),
).padStart(2, '0')}`

type Props = {
  question: Question
  selected?: string
  index: number
  total: number
  onSelect: (value: string, advance?: boolean) => void
  onBack: () => void
  onNext: () => void
  isLast: boolean
  onFinish: () => void
}

export default function QuestionStep({
  question,
  selected,
  index,
  total,
  onSelect,
  onBack,
  onNext,
  isLast,
  onFinish,
}: Props) {
  // Valeurs proposées (hors "Autre")
  const presetValues = (question.options ?? [])
    .map((o) => o.value)
    .filter((v) => v !== OTHER_OPTION)

  // "Autre" est actif si la réponse enregistrée ne correspond à aucune option proposée
  const initialOther = selected !== undefined && !presetValues.includes(selected)
  const [otherActive, setOtherActive] = useState(initialOther)
  const [otherText, setOtherText] = useState(initialOther ? selected ?? '' : '')

  const placeholder =
    question.key === 'repas' ? 'Écris ce que tu veux manger…' : 'Écris ce que tu veux faire…'

  const selectPreset = (value: string) => {
    setOtherActive(false)
    onSelect(value) // choix simple : avance automatiquement
  }
  const activateOther = () => {
    setOtherActive(true)
    onSelect(otherText, false) // pas d'avance auto : elle doit écrire
  }
  const changeOtherText = (text: string) => {
    setOtherText(text)
    onSelect(text, false)
  }

  // Faut-il attendre une validation manuelle ("Suivant") ?
  const manualAdvance = (question.input && question.input !== 'choice') || otherActive

  return (
    <div className="card question-card">
      <div className="progress">
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} className={`dot ${i <= index ? 'dot--on' : ''}`} />
        ))}
      </div>

      <h2 className="q-title">{question.title}</h2>
      <p className="q-sub">{question.subtitle}</p>

      {question.input === 'date' ? (
        <div className="date-picker">
          <input
            type="date"
            className="date-input"
            min={todayIso}
            value={selected ?? ''}
            onChange={(e) => onSelect(e.target.value, false)}
            onClick={openPicker}
          />
          {selected && <p className="date-chosen">{formatFrenchDate(selected)}</p>}
        </div>
      ) : question.input === 'time' ? (
        <div className="date-picker">
          <input
            type="time"
            className="date-input"
            value={selected ?? ''}
            onChange={(e) => onSelect(e.target.value, false)}
            onClick={openPicker}
          />
          {selected && <p className="date-chosen">{formatFrenchTime(selected)}</p>}
        </div>
      ) : (
        <>
          <div className="options">
            {question.options?.map((opt) => {
              const isOther = opt.value === OTHER_OPTION
              const isSelected = isOther ? otherActive : !otherActive && selected === opt.value
              return (
                <button
                  key={opt.value}
                  className={`option ${isSelected ? 'option--selected' : ''}`}
                  onClick={() => (isOther ? activateOther() : selectPreset(opt.value))}
                >
                  <span className="option-label">{opt.value}</span>
                </button>
              )
            })}
          </div>

          {otherActive && (
            <input
              type="text"
              className="other-input"
              placeholder={placeholder}
              value={otherText}
              autoFocus
              onChange={(e) => changeOtherText(e.target.value)}
            />
          )}
        </>
      )}

      <div className="nav-row">
        {index > 0 ? (
          <button className="btn btn--ghost" onClick={onBack}>
            ← Retour
          </button>
        ) : (
          <span />
        )}

        {isLast && selected && (
          <button className="btn btn--yes" onClick={onFinish}>
            C'est parti !
          </button>
        )}

        {!isLast && manualAdvance && selected && (
          <button className="btn btn--yes" onClick={onNext}>
            Suivant →
          </button>
        )}
      </div>
    </div>
  )
}

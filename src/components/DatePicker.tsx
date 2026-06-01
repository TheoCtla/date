import { useState } from 'react'

type Props = {
  value?: string // YYYY-MM-DD
  min?: string // YYYY-MM-DD (dates antérieures désactivées)
  onChange: (value: string) => void
}

const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const MONTHS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
]

const pad = (n: number) => String(n).padStart(2, '0')
const iso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`

function parseIso(s: string) {
  const [y, m, d] = s.split('-').map(Number)
  return { y, m: m - 1, d }
}

const now = new Date()
const todayIso = iso(now.getFullYear(), now.getMonth(), now.getDate())

export default function DatePicker({ value, min, onChange }: Props) {
  const start = value ? parseIso(value) : { y: now.getFullYear(), m: now.getMonth(), d: now.getDate() }
  const [view, setView] = useState({ y: start.y, m: start.m })

  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate()
  // Décalage du 1er du mois (semaine commençant le lundi)
  const firstDow = (new Date(view.y, view.m, 1).getDay() + 6) % 7

  // Désactiver le bouton "mois précédent" si on atteint le mois minimum
  const atMinMonth =
    !!min &&
    (() => {
      const mn = parseIso(min)
      return view.y < mn.y || (view.y === mn.y && view.m <= mn.m)
    })()

  const goPrev = () =>
    setView((v) => (v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 }))
  const goNext = () =>
    setView((v) => (v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 }))

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="cal">
      <div className="cal-head">
        <button
          type="button"
          className="cal-nav"
          onClick={goPrev}
          disabled={atMinMonth}
          aria-label="Mois précédent"
        >
          ‹
        </button>
        <span className="cal-title">
          {MONTHS[view.m]} {view.y}
        </span>
        <button type="button" className="cal-nav" onClick={goNext} aria-label="Mois suivant">
          ›
        </button>
      </div>

      <div className="cal-grid">
        {WEEKDAYS.map((w, i) => (
          <span key={i} className="cal-weekday">
            {w}
          </span>
        ))}

        {cells.map((d, i) => {
          if (d === null) return <span key={`e${i}`} className="cal-day cal-day--empty" />
          const dayIso = iso(view.y, view.m, d)
          const disabled = !!min && dayIso < min
          const selected = value === dayIso
          const isToday = dayIso === todayIso
          return (
            <button
              key={dayIso}
              type="button"
              className={`cal-day ${selected ? 'cal-day--selected' : ''} ${
                isToday && !selected ? 'cal-day--today' : ''
              }`}
              disabled={disabled}
              onClick={() => onChange(dayIso)}
            >
              {d}
            </button>
          )
        })}
      </div>
    </div>
  )
}

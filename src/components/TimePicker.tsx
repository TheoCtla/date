import { useEffect, useRef } from 'react'

type Props = {
  value?: string // HH:MM
  onChange: (value: string) => void
}

const pad = (n: number) => String(n).padStart(2, '0')
const HOURS = Array.from({ length: 24 }, (_, i) => i)
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5) // pas de 5 min

type ColumnProps = {
  label: string
  values: number[]
  selected: number | null
  onPick: (v: number) => void
}

// Colonne défilante qui centre l'élément sélectionné à l'ouverture
function TimeColumn({ label, values, selected, onPick }: ColumnProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const selRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const box = scrollRef.current
    const item = selRef.current
    if (box && item) {
      box.scrollTop = item.offsetTop - box.clientHeight / 2 + item.clientHeight / 2
    }
  }, [])

  return (
    <div className="time-col">
      <div className="time-col-label">{label}</div>
      <div className="time-scroll" ref={scrollRef}>
        {values.map((v) => {
          const isSel = v === selected
          return (
            <button
              key={v}
              type="button"
              ref={isSel ? selRef : undefined}
              className={`time-item ${isSel ? 'time-item--selected' : ''}`}
              onClick={() => onPick(v)}
            >
              {pad(v)}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function TimePicker({ value, onChange }: Props) {
  const [h, m] = value ? value.split(':').map(Number) : [null, null]

  const pickHour = (nh: number) => onChange(`${pad(nh)}:${pad(m ?? 0)}`)
  const pickMinute = (nm: number) => onChange(`${pad(h ?? 0)}:${pad(nm)}`)

  return (
    <div className="time-picker">
      <TimeColumn label="Heures" values={HOURS} selected={h} onPick={pickHour} />
      <span className="time-colon">:</span>
      <TimeColumn label="Minutes" values={MINUTES} selected={m} onPick={pickMinute} />
    </div>
  )
}

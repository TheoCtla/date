import { useRef, useState } from 'react'

type Props = {
  onYes: () => void
}

// GIF de chat mignon (Giphy). Un fond neutre prend le relais si le réseau coupe.
const CAT_GIF = 'https://media.giphy.com/media/vFKqnCdLPNOKc/giphy.gif'

export default function IntroCard({ onYes }: Props) {
  // Déplacement du bouton "Non" via translate (s'anime en douceur dès le 1er mouvement).
  const noRef = useRef<HTMLButtonElement>(null)
  // Position "au repos" (sans translate), mesurée une seule fois pour rester fiable
  // même si la souris re-survole pendant que le bouton glisse encore.
  const baseRef = useRef<{ left: number; top: number } | null>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dodges, setDodges] = useState(0)
  const [gifBroken, setGifBroken] = useState(false)

  const runAway = () => {
    const el = noRef.current
    if (!el) return
    // On capture la position de départ au 1er passage (offset encore à 0,0).
    if (!baseRef.current) {
      const rect = el.getBoundingClientRect()
      baseRef.current = { left: rect.left - offset.x, top: rect.top - offset.y }
    }
    const w = el.offsetWidth
    const h = el.offsetHeight
    const margin = 14
    // Cible aléatoire toujours entièrement dans la fenêtre, le bouton reste insaisissable.
    const targetLeft = margin + Math.random() * Math.max(window.innerWidth - w - margin * 2, 0)
    const targetTop = margin + Math.random() * Math.max(window.innerHeight - h - margin * 2, 0)
    setOffset({ x: targetLeft - baseRef.current.left, y: targetTop - baseRef.current.top })
    setDodges((d) => d + 1)
  }

  const teaseMessages = [
    'Jamais',
    'T\'es sûre ?',
    'Réessaie pour voir',
    'Raté',
    'Tu ne m\'auras jamais',
    'Arrête',
    'Pitié',
    'DIS OUI PITIÉ'
  ]
  const noLabel = teaseMessages[Math.min(dodges, teaseMessages.length - 1)]

  return (
    <div className="card intro-card">
      <div className="gif-wrap">
        {gifBroken ? (
          <div className="gif-fallback" />
        ) : (
          <img
            src={CAT_GIF}
            alt="Chat mignon"
            className="cat-gif"
            onError={() => setGifBroken(true)}
          />
        )}
      </div>

      <h1 className="intro-title">On se revoit quand ?</h1>
      <p className="intro-sub"></p>

      <div className="btn-row">
        <button className="btn btn--yes" onClick={onYes}>
          Le plus tôt possible
        </button>

        <span className="no-slot">
          {/* fantôme invisible qui réserve une place fixe → le bouton "oui" ne bouge plus */}
          <span className="btn btn--no no-ghost" aria-hidden="true">
            Non
          </span>
          <button
            ref={noRef}
            className="btn btn--no no-real"
            style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
            onMouseEnter={runAway}
            onTouchStart={runAway}
            onClick={runAway}
          >
            {noLabel}
          </button>
        </span>
      </div>
    </div>
  )
}

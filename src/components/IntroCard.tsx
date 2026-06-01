import { useRef, useState } from 'react'

type Props = {
  onYes: () => void
}

// GIF de chat mignon (Giphy). Un fond neutre prend le relais si le réseau coupe.
const CAT_GIF = 'https://media.giphy.com/media/vFKqnCdLPNOKc/giphy.gif'

export default function IntroCard({ onYes }: Props) {
  // Déplacement du bouton "Non" via translate (s'anime en douceur dès le 1er mouvement).
  const noRef = useRef<HTMLButtonElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dodges, setDodges] = useState(0)
  const [gifBroken, setGifBroken] = useState(false)

  const runAway = () => {
    const el = noRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    // Position du bouton "au repos" (sans translate), pour calculer le nouveau décalage.
    const baseLeft = rect.left - offset.x
    const baseTop = rect.top - offset.y
    const margin = 14
    // Cible aléatoire qui reste dans la fenêtre, le bouton devient insaisissable
    const targetLeft = margin + Math.random() * Math.max(window.innerWidth - rect.width - margin * 2, 0)
    const targetTop = margin + Math.random() * Math.max(window.innerHeight - rect.height - margin * 2, 0)
    setOffset({ x: targetLeft - baseLeft, y: targetTop - baseTop })
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

        <button
          ref={noRef}
          className="btn btn--no"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px)`,
            position: 'relative',
            zIndex: 50,
          }}
          onMouseEnter={runAway}
          onTouchStart={runAway}
          onClick={runAway}
        >
          {noLabel}
        </button>
      </div>
    </div>
  )
}

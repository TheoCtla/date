import { useState } from 'react'
import { questions } from './data'
import Knights from './components/Knights'
import IntroCard from './components/IntroCard'
import QuestionStep from './components/QuestionStep'
import Recap from './components/Recap'

type Answers = {
  jour?: string
  heure?: string
  repas?: string
  activite?: string
}

// -1 = écran d'intro, 0..n-1 = questions, n = récap
export default function App() {
  const [step, setStep] = useState(-1)
  const [answers, setAnswers] = useState<Answers>({})

  const goRecap = questions.length

  const handleSelect = (value: string, advance = true) => {
    const current = questions[step]
    setAnswers((prev) => ({ ...prev, [current.key]: value }))
    // Sélecteurs (date/heure) et "Autre" : on laisse valider avec le bouton "Suivant".
    // Choix simples : on avance automatiquement (sauf à la dernière question).
    const isChoice = !current.input || current.input === 'choice'
    if (advance && isChoice && step < questions.length - 1) {
      setTimeout(() => setStep((s) => s + 1), 220)
    }
  }

  const restart = () => {
    setAnswers({})
    setStep(-1)
  }

  return (
    <div className="app">
      <Knights />

      <main className="stage">
        {step === -1 && <IntroCard onYes={() => setStep(0)} />}

        {step >= 0 && step < questions.length && (
          <QuestionStep
            key={step}
            question={questions[step]}
            selected={answers[questions[step].key]}
            index={step}
            total={questions.length}
            onSelect={handleSelect}
            onBack={() => setStep((s) => s - 1)}
            onNext={() => setStep((s) => s + 1)}
            isLast={step === questions.length - 1}
            onFinish={() => setStep(goRecap)}
          />
        )}

        {step === goRecap && <Recap answers={answers} onRestart={restart} />}
      </main>
    </div>
  )
}

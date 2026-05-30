export type Option = {
  value: string
}

export type Question = {
  key: 'jour' | 'heure' | 'repas' | 'activite'
  title: string
  subtitle: string
  input?: 'choice' | 'date' | 'time'
  options?: Option[]
}

export const questions: Question[] = [
  {
    key: 'jour',
    title: 'On se voit quel jour ?',
    subtitle: 'Choisis le grand jour de notre rendez-vous',
    input: 'date',
  },
  {
    key: 'heure',
    title: 'À quelle heure ?',
    subtitle: 'Je serai à l\'heure, promis (presque)',
    input: 'time',
  },
  {
    key: 'repas',
    title: 'On mange quoi ?',
    subtitle: 'Le plus important, soyons honnêtes',
    options: [
      { value: 'Pizza' },
      { value: 'Ramen' },
      { value: 'Sushis' },
      { value: 'Burger' },
      { value: 'Crêpes' },
      { value: 'Autre' }
    ],
  },
  {
    key: 'activite',
    title: 'On fait quoi ensuite ?',
    subtitle: 'Pour prolonger la soirée ensemble',
    options: [
      { value: 'Ciné' },
      { value: 'Couché de soleil' },
      { value: 'Bowling' },
      { value: 'Escape game' },
      { value: 'Salle d\'arcade' },
      { value: 'Autre' },
    ],
  },
]

// Valeur d'option spéciale : affiche un champ texte libre quand elle est choisie
export const OTHER_OPTION = 'Autre'

// Transforme une date ISO "YYYY-MM-DD" en joli format français : "samedi 6 juin 2026"
export function formatFrenchDate(iso?: string): string {
  if (!iso) return ''
  const [year, month, day] = iso.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  const formatted = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
  return formatted
}

// Transforme une heure "HH:MM" en format français : "19h30"
export function formatFrenchTime(value?: string): string {
  if (!value) return ''
  const [h, m] = value.split(':')
  return `${h}h${m}`
}

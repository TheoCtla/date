import { formatFrenchDate, formatFrenchTime } from './data'

// ─────────────────────────────────────────────────────────────────────────────
// Envoi du mail récap via Web3Forms (gratuit, sans backend).
//
//  → Va sur https://web3forms.com
//  → Entre l'adresse de réception : tcatala32@gmail.com
//  → Tu reçois une "Access Key" par mail
//  → Colle-la ci-dessous à la place de 'COLLE_TA_CLE_ICI'
//
// (La clé est conçue pour être publique : l'adresse de destination est fixée
//  côté Web3Forms, pas dans ce code.)
// ─────────────────────────────────────────────────────────────────────────────
const WEB3FORMS_ACCESS_KEY: string = 'c2711538-fdc6-4f6c-a9ce-fceda5fda973'

type Answers = {
  jour?: string
  heure?: string
  repas?: string
  activite?: string
}

export async function sendRecapEmail(answers: Answers): Promise<void> {
  if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === 'COLLE_TA_CLE_ICI') {
    console.warn('[email] Clé Web3Forms manquante — récap non envoyé.')
    return
  }

  const jour = formatFrenchDate(answers.jour)
  const heure = formatFrenchTime(answers.heure)

  try {
    await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: '🌹 Nouveau date programmé !',
        from_name: 'Date avec moi',
        // Chaque champ apparaît dans le mail :
        Jour: jour,
        Heure: heure,
        Repas: answers.repas ?? '',
        Activité: answers.activite ?? '',
        message:
          `Nouveau rendez-vous programmé !\n\n` +
          `📅 Jour : ${jour}\n` +
          `🕐 Heure : ${heure}\n` +
          `🍽️ Repas : ${answers.repas ?? '—'}\n` +
          `🎉 Activité : ${answers.activite ?? '—'}`,
      }),
    })
  } catch (err) {
    // On n'interrompt jamais l'expérience utilisateur si l'envoi échoue.
    console.error('[email] Échec de l\'envoi du récap', err)
  }
}

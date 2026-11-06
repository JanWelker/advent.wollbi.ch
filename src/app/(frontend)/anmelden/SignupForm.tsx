'use client'

import { useActionState } from 'react'

import { signUp, type SignupState } from './actions'

export type Day = { day: string; label: string; house?: string | null; names?: string | null }

export const SignupForm = ({ code, days }: { code: string; days: Day[] }) => {
  const [state, action, pending] = useActionState<SignupState, FormData>(signUp, {})
  const free = days.filter((d) => !d.house)

  if (state.ok) {
    const chosen = days.find((d) => d.day === state.day)
    return (
      <div className="signup-done">
        <h2>Merci!</h2>
        <p>Ihr öffnet euer Fenster am {chosen?.label ?? state.day}.</p>
      </div>
    )
  }

  return (
    <form action={action} className="signup-form">
      <input type="hidden" name="code" value={code} />

      <fieldset>
        <legend>Tag</legend>
        <ul className="signup-days">
          {days.map((d) => (
            <li key={d.day} className={d.house ? 'is-taken' : undefined}>
              <label>
                <input type="radio" name="day" value={d.day} disabled={Boolean(d.house)} required />
                <span className="signup-day">{d.label}</span>
                {d.house ? <span className="signup-taken">{d.house}</span> : null}
              </label>
            </li>
          ))}
        </ul>
        {!free.length ? <p>Alle Tage sind vergeben.</p> : null}
      </fieldset>

      <label className="signup-field">
        <span>Hausnummer</span>
        <input name="house" placeholder="W43" maxLength={12} required autoComplete="off" />
      </label>
      <label className="signup-field">
        <span>Gastgeber</span>
        <input name="names" placeholder="Anna & Beat Muster" maxLength={120} required />
      </label>
      <label className="signup-field">
        <span>Hinweis (freiwillig)</span>
        <input name="note" placeholder="z. B. ohne Apéro" maxLength={120} />
      </label>
      <label className="signup-field">
        <span>E-Mail oder Telefon (nur für das OK)</span>
        <input name="contact" maxLength={120} autoComplete="email" />
      </label>

      {state.error ? (
        <p className="signup-error" role="alert">
          {state.error}
        </p>
      ) : null}

      <button className="button button-primary" type="submit" disabled={pending || !free.length}>
        {pending ? 'Einen Moment …' : 'Tag reservieren'}
      </button>
    </form>
  )
}

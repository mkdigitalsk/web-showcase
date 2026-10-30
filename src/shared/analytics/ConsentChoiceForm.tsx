import { useState } from 'react'
import { Checkbox } from '../components'
import { useTranslation } from '../hooks'
import { PURPOSES, type Answers } from './consent'
import styles from './ConsentChoiceForm.module.css'

interface ConsentChoiceFormProps {
  /** The form's id, which the dialog's save button submits it by. */
  id: string
  initial: Answers
  onSave: (answers: Answers) => void
}

/**
 * A box a purpose, as the dialog opened them, saved together — mounted afresh at each opening, so a closed draft is
 * gone. Each box says what ticking it records.
 */
export function ConsentChoiceForm({ id, initial, onSave }: ConsentChoiceFormProps) {
  const { t } = useTranslation()
  const [draft, setDraft] = useState(initial)

  return (
    <form
      id={id}
      onSubmit={(event) => {
        event.preventDefault()
        onSave(draft)
      }}
    >
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles -- Safari drops the list role under list-style: none */}
      <ul role="list" className={styles.purposes}>
        {PURPOSES.map((purpose) => (
          <li key={purpose} className={styles.purpose}>
            <Checkbox
              checked={draft[purpose] === 'granted'}
              onCheckedChange={(granted) => setDraft({ ...draft, [purpose]: granted ? 'granted' : 'denied' })}
              label={t(`consent.${purpose}.name`)}
              description={t(`consent.${purpose}.what`)}
            />
          </li>
        ))}
      </ul>
    </form>
  )
}

import { useRef, useState } from 'react'
import { Chip, FilterChip } from '../../../shared/components'
import { useTranslation } from '../../../shared/hooks'
import { Section } from './Section'
import styles from './ChipsSection.module.css'

export function ChipsSection() {
  const { t } = useTranslation()
  const [filterSelected, setFilterSelected] = useState(false)
  const [deletableShown, setDeletableShown] = useState(true)
  const filterRef = useRef<HTMLButtonElement>(null)

  /** The Delete pressed leaves with its chip — focus moves to the next chip rather than falling back to the page. */
  const deleteChip = () => {
    setDeletableShown(false)
    filterRef.current?.focus()
  }

  return (
    <Section title={t('uiComponents.chips')}>
      <div className={styles.chips}>
        <Chip label={t('uiComponents.chips.default')} />
        <Chip label={t('uiComponents.chips.outlined')} variant="outlined" />
        {deletableShown && (
          <Chip
            label={t('uiComponents.chips.deletable')}
            onDelete={deleteChip}
            deleteLabel={t('uiComponents.chips.delete')}
          />
        )}
        <FilterChip
          ref={filterRef}
          label={t('uiComponents.chips.filter')}
          selected={filterSelected}
          onClick={() => setFilterSelected((v) => !v)}
        />
      </div>
    </Section>
  )
}

import { useState } from 'react'
import { Chip, FilterChip } from '../../../shared/components'
import { useTranslation } from '../../../shared/hooks'
import { Section } from './Section'
import styles from './ChipsSection.module.css'

export function ChipsSection() {
  const { t } = useTranslation()
  const [filterSelected, setFilterSelected] = useState(false)

  return (
    <Section title={t('uiComponents.chips')}>
      <div className={styles.chips}>
        <Chip label={t('uiComponents.chips.default')} />
        <Chip label={t('uiComponents.chips.outlined')} variant="outlined" />
        <Chip
          label={t('uiComponents.chips.deletable')}
          onDelete={() => {}}
          deleteLabel={t('uiComponents.chips.delete')}
        />
        <FilterChip
          label={t('uiComponents.chips.filter')}
          selected={filterSelected}
          onClick={() => setFilterSelected((v) => !v)}
        />
      </div>
    </Section>
  )
}

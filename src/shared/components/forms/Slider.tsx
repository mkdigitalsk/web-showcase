import { Slider as BaseSlider } from '@base-ui/react/slider'
import { cx } from '../css'
import styles from './Slider.module.css'

interface SliderProps extends Omit<BaseSlider.Root.Props, 'className'> {
  /** What the value is, for the thumb a screen reader lands on. */
  label: string
  className?: string
}

export function Slider({ label, className, ...props }: SliderProps) {
  return (
    <BaseSlider.Root className={cx(styles.root, className)} {...props}>
      <BaseSlider.Control className={styles.control}>
        <BaseSlider.Track className={styles.track}>
          <BaseSlider.Indicator className={styles.indicator} />
          <BaseSlider.Thumb className={styles.thumb} aria-label={label} />
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  )
}

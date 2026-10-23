import { Text } from './Text'
import type { BaseTextProps } from './types'

export function TextH6Bold(props: BaseTextProps) {
  return <Text variant="h6" bold {...props} />
}

export function TextH6BoldPrimary(props: BaseTextProps) {
  return <Text variant="h6" bold tone="action" {...props} />
}

export function TextH6BoldNeutral80(props: BaseTextProps) {
  return <Text variant="h6" bold tone="ink" {...props} />
}

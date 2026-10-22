import { Text } from './Text'
import type { BaseTextProps } from './types'

export function TextH4Bold(props: BaseTextProps) {
  return <Text variant="h4" bold {...props} />
}

export function TextH4BoldPrimary(props: BaseTextProps) {
  return <Text variant="h4" bold tone="action" {...props} />
}

export function TextH4BoldNeutral80(props: BaseTextProps) {
  return <Text variant="h4" bold tone="ink" {...props} />
}

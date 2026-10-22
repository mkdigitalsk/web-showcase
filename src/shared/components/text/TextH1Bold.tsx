import { Text } from './Text'
import type { BaseTextProps } from './types'

export function TextH1Bold(props: BaseTextProps) {
  return <Text variant="h1" bold {...props} />
}

export function TextH1BoldPrimary(props: BaseTextProps) {
  return <Text variant="h1" bold tone="action" {...props} />
}

export function TextH1BoldNeutral80(props: BaseTextProps) {
  return <Text variant="h1" bold tone="ink" {...props} />
}

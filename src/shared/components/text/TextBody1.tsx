import { Text } from './Text'
import type { BaseTextProps } from './types'

export function TextBody1(props: BaseTextProps) {
  return <Text variant="body1" {...props} />
}

export function TextBody1Neutral80(props: BaseTextProps) {
  return <Text variant="body1" tone="ink" {...props} />
}

export function TextBody1Neutral60(props: BaseTextProps) {
  return <Text variant="body1" tone="muted" {...props} />
}

export function TextBody1Disabled(props: BaseTextProps) {
  return <Text variant="body1" tone="faint" {...props} />
}

export function TextBody1Primary(props: BaseTextProps) {
  return <Text variant="body1" tone="action" {...props} />
}

import { Text } from './Text'
import type { BaseTextProps } from './types'

export function TextCaption(props: BaseTextProps) {
  return <Text variant="caption" {...props} />
}

export function TextCaptionNeutral60(props: BaseTextProps) {
  return <Text variant="caption" tone="muted" {...props} />
}

export function TextCaptionNeutral40(props: BaseTextProps) {
  return <Text variant="caption" tone="faint" {...props} />
}
